import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { db } from '../../config/db';
import { InsertProduct, products } from '../../../db/schemas/schema';
import { eq, and, gt } from 'drizzle-orm';

@Injectable()
export class ProductsRepository {
  constructor() {}

  async findAllProducts({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }): Promise<
    Omit<InsertProduct, 'description' | 'categoryId' | 'stock'>[] | []
  > {
    const products = await db.query.products
      .findMany({
        with: { category: { columns: { name: true } } },
        where: (products, { gt, eq, and }: any) =>
          and(gt(products.stock, 1), eq(products.active, true)),
        columns: { categoryId: false, description: false, stock: false },
        limit: limit,
        offset: (page - 1) * limit,
      })
      .catch((err) => {
        throw new BadRequestException('There are no more products available');
      });
    if (products.length === 0) return [];
    return products;
  }

  async findProductsByCategory({
    category,
    page,
    limit,
  }: {
    category: string;
    page: number;
    limit: number;
  }): Promise<Omit<InsertProduct, 'description' | 'categoryId' | 'stock'>[]> {
    const productsArr = await db.query.products
      .findMany({
        with: { category: { columns: { name: true } } },
        where: and(
          gt(products.stock, 1),
          eq(products.active, true),
          eq(products.categoryId, category),
        ),
        columns: { categoryId: false, description: false, stock: false },
        limit: limit,
        offset: (page - 1) * limit,
      })
      .catch(() => {
        throw new BadRequestException(
          'There are no products available for this category',
        );
      });
    if (productsArr.length === 0) {
      throw new NotFoundException('Products Not Found for this category');
    }
    return productsArr;
  }

  async createProduct(productData: InsertProduct): Promise<InsertProduct[]> {
    const product = await db.insert(products).values(productData).returning();
    if (!product) throw new BadRequestException('Error creando el producto');
    return product;
  }

  async findOneById(id: string): Promise<InsertProduct> {
    const product = await db.query.products.findFirst({
      where: and(
        eq(products.id, id),
        eq(products.active, true),
        gt(products.stock, 1),
      ),
      with: { category: true },
    });
    if (!product) throw new NotFoundException('Product not Found');
    return product;
  }

  async updateProduct(
    id: string,
    productData: Partial<InsertProduct>,
  ): Promise<Partial<InsertProduct>[]> {
    const updateProduct = await db
      .update(products)
      .set(productData)
      .where(and(eq(products.id, id), eq(products.active, true)))
      .returning({
        id: products.id,
        price: products.price,
        description: products.description,
        type: products.type,
        stock: products.stock,
        name: products.name,
        categoryId: products.categoryId,
      });
    if (updateProduct.length == 0)
      throw new NotFoundException('Product ID Not Found');
    return updateProduct;
  }

  async removeProduct(id: string): Promise<{ message: string }> {
    const rowCount = (
      await db
        .update(products)
        .set({ active: false })
        .where(and(eq(products.active, true), eq(products.id, id)))
    ).rowCount;
    if (rowCount == 0) throw new NotFoundException('Product not Found');
    return { message: 'Product deleted Successfuly' };
  }
}
