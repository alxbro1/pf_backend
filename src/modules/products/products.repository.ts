import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { db } from '../../config/db';
import {
  InsertProduct,
  ProductEntity,
  products,
} from '../../../db/schemas/schema';
import { eq, and, gte, inArray, gt, sql, asc, ilike } from 'drizzle-orm';
import { FilesService } from '../files/files.service';
import type { GetProductsDto } from './dto/get-products.dto';
import type { PaginatedProductsDto } from './dto/paginated-products.dto';

@Injectable()
export class ProductsRepository {
  constructor(private readonly filesService: FilesService) {}

  async findAllProducts({
    limit,
    cursor,
    search,
    type,
  }: GetProductsDto): Promise<PaginatedProductsDto> {
    const where = [gte(products.stock, 1), eq(products.active, 'active')];

    if (type !== undefined) {
      where.push(eq(products.type, type));
    }

    if (search && search.trim() != '') {
      where.push(ilike(products.name, `%${search}%`));
    }

    if (cursor !== undefined) {
      where.push(gte(products.id, cursor));
    }

    const NEXT_CURSOR_ITEM = 1;
    const selectedProducts = await db.query.products
      .findMany({
        with: { category: { columns: { id: true, name: true } } },
        where: and(...where),
        columns: {
          categoryId: false,
          // description: false,
          // stock: false,
          // active: false,
          // type: false,
        },
        limit: limit + NEXT_CURSOR_ITEM,
        orderBy: asc(products.id),
      })
      .catch((err) => {
        throw new BadRequestException('There are no more products available');
      });

    let nextCursor: string | null = null;

    if (selectedProducts.length === 0)
      return {
        data: [],
        nextCursor,
      };

    if (selectedProducts.length > limit) {
      nextCursor = selectedProducts.pop()!.id;
    }

    return {
      data: selectedProducts,
      nextCursor,
    };
  }

  async findAllDashboardProducts({
    limit,
    cursor,
  }: {
    limit: number;
    cursor: string;
  }): Promise<Omit<ProductEntity, 'description' | 'categoryId'>[]> {
    const data = db.query.products.findMany({
      columns: {
        name: true,
        price: true,
        stock: true,
        id: true,
        active: true,
        type: true,
        imageUrl: true,
      },
      where: gte(products.id, cursor),
      limit: limit,
      orderBy: products.id,
    });
    return data;
  }

  async findProductsByCategory({
    category,
    cursor,
    limit,
  }: {
    category: string;
    cursor: string;
    limit: number;
  }): Promise<Omit<InsertProduct, 'description' | 'categoryId' | 'stock'>[]> {
    const productsArr = await db.query.products
      .findMany({
        with: { category: { columns: { id: true, name: true } } },
        where: and(
          gt(products.stock, 1),
          eq(products.active, 'active'),
          eq(products.categoryId, category),
          gte(products.id, cursor),
        ),
        columns: { categoryId: false },
        limit: limit,
      })
      .catch((err) => {
        throw new BadRequestException(
          'There are no products available for this category',
        );
      });
    if (productsArr.length === 0) {
      throw new NotFoundException('Products Not Found for this category');
    }
    return productsArr;
  }

  async createProduct(productData: InsertProduct): Promise<InsertProduct> {
    const product = await db.insert(products).values([productData]).returning();

    if (!product) throw new BadRequestException('Error creando el producto');

    return product[0]!;
  }

  async findOneById(id: string): Promise<InsertProduct> {
    const product = await db.query.products.findFirst({
      where: and(
        eq(products.id, id),
        eq(products.active, 'active'),
        gt(products.stock, 1),
      ),
      with: { category: true },
    });
    if (!product) throw new NotFoundException('Product not Found');
    return product;
  }

  async findManyByIds(
    idArray: string[],
  ): Promise<
    Omit<ProductEntity, 'description' | 'type' | 'imageUrl' | 'active'>[]
  > {
    const data = await db.query.products.findMany({
      where: inArray(products.id, idArray),
      columns: {
        id: true,
        name: true,
        price: true,
        stock: true,
        categoryId: true,
      },
    });
    if (!data) throw new NotFoundException('Product not Found');
    return data;
  }
  async updateProduct(
    id: string,
    productData: Partial<InsertProduct>,
  ): Promise<Partial<InsertProduct>[]> {
    const updateProduct = await db
      .update(products)
      .set(productData)
      .where(and(eq(products.id, id), eq(products.active, 'active')))
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

  async updateStock(count: number, productId: string) {
    const result = await db
      .update(products)
      .set({
        stock: sql`${products.stock}  + ${count}`,
      })
      .where(eq(products.id, productId))
      .returning();
  }

  async removeProduct(id: string): Promise<{ message: string }> {
    const rowCount = (
      await db
        .update(products)
        .set({ active: 'inactive' })
        .where(and(eq(products.active, 'active'), eq(products.id, id)))
    ).rowCount;
    if (rowCount == 0) throw new NotFoundException('Product not Found');
    return { message: 'Product deleted Successfuly' };
  }

  async updateProductImage(productId: string, file: Express.Multer.File) {
    const resultFile = await this.filesService.uploadImage(file);

    const resultProduct = await db
      .update(products)
      .set({ imageUrl: resultFile.secure_url })
      .where(eq(products.id, productId))
      .returning();

    if (resultProduct.length === 0)
      throw new NotFoundException(`User with ${productId} uuid not found.`);

    return resultFile;
  }

  async removeProductImage(productId: string, publicId: string) {
    await this.filesService.removeSingleImage(publicId);

    const result = await db
      .update(products)
      .set({
        imageUrl:
          'https://res.cloudinary.com/dnfslkgiv/image/upload/v1726516516/muft4cnobocgkvbgj215.png',
      })
      .where(eq(products.id, productId))
      .returning();

    if (result.length === 0)
      throw new NotFoundException(
        `Product with ${productId} uuid didn't exist.`,
      );

    return { message: 'Product image modified successfuly.' };
  }

  async count() {
    const count = await db.$count(products);

    return count;
  }
}
