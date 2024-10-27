import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { InsertProduct, ProductEntity } from '../../../db/schemas/schema';
import { typeEnum } from './dto/type.enum';
import { throwError } from 'rxjs';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async create(body: InsertProduct) {
    return await this.productsRepository.createProduct(body);
  }

  async findAll( cursor: string | undefined | null, limit: number, typeProduct: typeEnum | undefined, search: string | undefined) {
    limit++;
    const prevCursor = cursor != undefined ? +cursor : null;
    if (!cursor) cursor = '0';
    if (!limit || limit > 20) limit = 20;
    if (typeProduct != typeEnum.digital && typeProduct != typeEnum.physical && typeProduct != undefined) throw new BadRequestException('Invalid type product');
      const data = await this.productsRepository.findAllProducts(
        cursor,
        limit,
        typeProduct,
        search
      );


    if (!data[limit - 1]?.id) {
      cursor = null;
    } else {
      cursor = data[limit - 1].id;
    }

    cursor;
    data.splice(limit, 1);
    return {
      products:[...data],
      nextCursor: cursor,
      prevCursor: prevCursor,
    };
  }

  async findAllDashboardProducts({
    limit,
    cursor,
  }: {
    limit: number;
    cursor: string | undefined | null;
  }) {
    limit++;
    const prevCursor = cursor ? +cursor : null;
    if (!cursor) cursor = '0';
    if (!limit || limit > 20) limit = 20;

    const data = await this.productsRepository
      .findAllDashboardProducts({
        limit,
        cursor,
      })
      .catch((err) => {
        throw new BadRequestException('There are no more products available');
      });

    if (!data[limit - 1]?.id) {
      cursor = null;
    } else {
      cursor = data[limit - 1].id;
    }

    cursor;
    data.splice(limit, 1);
    return {
      data,
      cursor: cursor,
      prevCursor: prevCursor,
    };
  }

  async findByCategory({
    category,
    cursor,
    limit,
  }: {
    category: string;
    cursor: string | null | undefined;
    limit: number;
  }) {
    limit++;
    const prevCursor = cursor ? +cursor : null;
    if (!cursor) cursor = '0';
    if (!limit || limit > 20) limit = 20;
    const data = await this.productsRepository.findProductsByCategory({
      category,
      cursor,
      limit,
    });


    if (!data[limit - 1]?.id) {
      cursor = null;
    } else {
      cursor = data[limit - 1].id;
    }

    cursor;
    data.splice(limit, 1);
    return {
      data,
      cursor: cursor,
      prevCursor: prevCursor,
    };
  }

  async findOne(id: string) {
    return await this.productsRepository.findOneById(id);
  }

  async findManyByIds(
    ids: string[],
  ): Promise<
    Omit<ProductEntity, 'description' | 'type' | 'imageUrl' | 'active'>[]
  > {
    return await this.productsRepository.findManyByIds(ids);
  }

  async update(id: string, productData: Partial<InsertProduct>) {
    return await this.productsRepository.updateProduct(id, productData);
  }

  async updateStock(count: number, id: string) {
    return await this.productsRepository.updateStock(count, id);
  }

  async remove(id: string) {
    return await this.productsRepository.removeProduct(id);
  }

  async updateProductImage(productId: string, file: Express.Multer.File) {
    return await this.productsRepository.updateProductImage(productId, file);
  }

  async removeProductImage(productId: string, publicId: string) {
    return await this.productsRepository.removeProductImage(
      productId,
      publicId,
    );
  }
}
