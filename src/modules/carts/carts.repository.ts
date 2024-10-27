import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../config/db';
import { carts } from '../../../db/schemas/cart.schema';
import { and, eq } from 'drizzle-orm';
import { cartAndProducts } from '../../../db/schemas/cart_products.schema';
import { products } from '../../../db/schemas/products.schema';

@Injectable()
export class CartsRepository {
  async getCartByUserId(userId: string) {
    const cart = await db.select().from(carts).where(eq(carts.userId, userId));

    if (cart.length === 0)
      throw new NotFoundException(
        `User with ${userId} didn't exist or cart of the user didn't exist.`,
      );

    const productsInCart = db
      .select()
      .from(cartAndProducts)
      .innerJoin(products, eq(cartAndProducts.productId, products.id))
      .where(eq(cartAndProducts.cartId, cart[0].id));

    return {
      cart: cart[0],
      products: (await productsInCart).map((row) => row.products),
    };
  }

  async createOrAddCart(userId: string, product: string) {
    const existingCart = await db
      .select()
      .from(carts)
      .where(eq(carts.userId, userId));

    if (existingCart.length === 0)
      throw new NotFoundException(`User with ${userId} uuid didn't exist.`);

    let cartId;

    if (existingCart.length === 0) {
      const newCart = await db
        .insert(carts)
        .values({ userId })
        .returning({ id: carts.id });

      cartId = Number(newCart[0].id);
    } else {
      cartId = Number(existingCart[0].id);
    }

    await db.insert(cartAndProducts).values({
      cartId: Number(cartId),
      productId: product,
    });

    return { message: 'Product added.' };
  }

  async removeProduct(userId: string, product: string) {
    const userCart = await db
      .select()
      .from(carts)
      .where(eq(carts.userId, userId));

    if (userCart.length === 0)
      throw new NotFoundException(
        `Cart with ${userId} user uuid didn't exist.`,
      );

    const cartId = userCart[0].id;

    const result = await db
      .delete(cartAndProducts)
      .where(
        and(
          eq(cartAndProducts.cartId, cartId),
          eq(cartAndProducts.productId, product),
        ),
      );

    if (result.rowCount === 0)
      throw new NotFoundException(`Product with ${product} id didn't exist.`);

    return { message: 'Product removed.' };
  }
}
