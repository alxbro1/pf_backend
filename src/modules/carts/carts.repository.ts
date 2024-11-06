import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { db } from '../../config/db';
import { carts } from '../../../db/schemas/cart.schema';
import { eq, gte, sql } from 'drizzle-orm';
import { cartAndProducts } from '../../../db/schemas/cart_products.schema';
import { PaginationByUserDto } from '../../schemas/pagination.dto';
import { AddProductToCartDto } from './dto/addProduct.dto';
import { RemoveProductFromCartDto } from './dto/deleteProduct.dto';
import { MixedLocalStorageDto } from './dto/mixedLocalStorage.dto';

@Injectable()
export class CartsRepository {
  async getCartByUserId({ userId, limit, cursor }: PaginationByUserDto) {
    if (!cursor) cursor = 0;

    const productsCart = await db.query.carts.findFirst({
      where: eq(carts.userId, userId),
      columns: {
        userId: false,
        id: false,
      },
      with: {
        products: {
          where: gte(cartAndProducts.id, cursor),
          with: {
            product: {
              with: {
                category: true,
              },
            },
          },
          columns: {
            productId: false,
            cartId: false,
          },
          limit: limit + 1,
        },
      },
    });

    if (!productsCart?.products)
      throw new NotFoundException(
        `Cart with ${userId} user uuid didn't exist.`,
      );

    let nextCursor: number | null = null;

    if (productsCart?.products?.length > limit) {
      nextCursor = productsCart?.products?.pop()!.id;
    }

    const data = productsCart?.products?.map((product) => ({
      productId: product.product?.id,
      category: product.product?.category.name,
      price: product.product?.price,
      title: product.product?.name,
      image: product.product?.imageUrl,
      qty: product.quantity,
    }));

    if (!data)
      return {
        data: [],
        nextCursor,
      };

    return {
      data: data,
      nextCursor,
    };
  }

  async addProduct({ productId, quantity, userId }: AddProductToCartDto) {
    const result = await db
      .execute(
        sql`
  INSERT INTO cart_products (cart_id, product_id, quantity)
  SELECT 
    (SELECT id FROM carts WHERE user_id = ${userId}),
    ${productId},
    ${quantity}
  WHERE ${quantity} <= (SELECT stock FROM products WHERE id = ${productId})
`,
      )
      .catch((error) => {
        throw new BadRequestException(error.details);
      });

    if (result.rowCount == 0)
      throw new NotFoundException(
        `Product with ${productId} id didn't have stock enough`,
      );

    return result;
  }

  async mixedLocalStorage({ products, userId }: MixedLocalStorageDto) {
    const cart = await db.query.carts.findFirst({
      where: eq(carts.userId, userId),
      with: {
        products: {
          with: {
            product: true,
          },
        },
      },
    });

    if (!cart)
      throw new NotFoundException(
        `Cart with ${userId} user uuid didn't exist.`,
      )

    const productsInCart = products
      .filter((product) =>
        cart.products.find(
          (cartProduct) => cartProduct.productId == product.productId,
        ),
      )
      ?.map((product) => {
        const productInCart = cart.products.find(
          (productCart) => productCart.productId === product.productId,
        );

        if (productInCart) {
          product.qty += productInCart.quantity;
          productInCart?.product?.stock < product.qty &&
            (product.qty = productInCart?.product.stock);
        }
        return product;
      })

    const productsNotInCart = products.filter(
      (product) =>
        !cart.products.find(
          (productCart) => productCart.productId === product.productId,
        ),
    );

    productsNotInCart?.length != 0 &&
      (await db
        .insert(cartAndProducts)
        .values(
          productsNotInCart.map((product) => ({
            cartId: cart.id,
            productId: product.productId,
            quantity: product.qty,
          })),
        )
        .returning({
          productId: cartAndProducts.productId,
          quantity: cartAndProducts.quantity,
        }));

    if (productsInCart?.length > 0) {
      const updatePromises = productsInCart.map(async (product) =>{
        await db
          .update(cartAndProducts)
          .set({
            quantity: product.qty,
          })
          .where(eq(cartAndProducts.productId, product.productId))}
      );

      await Promise.all(updatePromises);
    }

    return { message: 'products added succesfuly' }
  }

  async removeProduct({ productId, userId }: RemoveProductFromCartDto) {
    const result = await db.execute(sql`
  DELETE FROM cart_products
  WHERE cart_id = (SELECT id FROM carts WHERE user_id = ${userId})
    AND product_id = ${productId};
`);

    if (result.rowCount == 0)
      throw new NotFoundException(
        `Product with ${productId} id didn't exist in cart`,
      );

    return { message: 'product deleted succesfuly' };
  }

  async updateQuantity({ productId, quantity, userId }: AddProductToCartDto) {
    const result = await db.execute(sql`
  UPDATE cart_products
  SET quantity = ${quantity}
  WHERE cart_id = (SELECT id FROM carts WHERE user_id = ${userId})
    AND product_id = ${productId}
    AND ${quantity} <= (SELECT stock FROM products WHERE id = ${productId});
`);

    if (result.rowCount == 0)
      throw new NotFoundException(
        `Product with ${productId} id didn't exist in cart or didn't have stock enough`,
      );

    return { message: 'product updated succesfuly' };
  }
}
