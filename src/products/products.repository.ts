import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { db } from '../config/db';
import { InsertProduct, products } from '../../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ProductsRepository {
  constructor() {}

  async findAllProducts() {
    const products = await db.query.products.findMany({
      with: { category: { columns: { name: true } } },
      where: (products: any, { gt }: any) => gt(products.stock, 1),
      columns: { categoryId: false, description: false },
    });
    if (!products) throw new NotFoundException('Products Not Found');
    return products;
  }

  async createProduct(productData: InsertProduct) {
    const product = await db.insert(products).values(productData).returning();
    if (!product) throw new BadRequestException('Error creando el producto');
    return product;
  }

  async findOneById(id: string): Promise<InsertProduct> {
    const product = await db.query.products.findFirst({
      where: (fields) => eq(fields.id, id),
    });
    if (!product) throw new NotFoundException("Product not Found")
    return product;
  }

  async updateProduct(id: string, productData: Partial<InsertProduct>) {
    const updateProduct = await db
      .update(products)
      .set(productData)
      .where(eq(products.id, id))
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

  async removeProduct(id: string) {
    const rowCount = (await db.delete(products).where(eq(products.id, id)))
      .rowCount;
    if (rowCount == 0) throw new NotFoundException('Product not Found');
    return { message: 'Product deleted Successfuly' };
  }
}
