import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { InsertProduct, ProductEntity } from '../../../db/schemas/schema';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async create(body: InsertProduct) {
    return await this.productsRepository.createProduct(body);
  }

  findAll({ cursor, limit }: PaginationDto) {
    return this.productsRepository.findAllProducts({
      cursor,
      limit,
    });
  }

  async findAllDashboardProducts({
    limit,
    cursor,
  }: {
    limit: number;
    cursor: string;
  }) {
    limit++;
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
    if (data.length === 0) return { data: [], cursor: null };
    cursor = data[limit - 1]?.id;
    data.pop();
    const returnObject = {
      data: data,
      cursor,
    };
    return returnObject;
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

  async findByCategory({
    category,
    cursor,
    limit,
  }: {
    category: string;
    cursor: string | undefined;
    limit: number;
  }) {
    limit++;
    if (!cursor) cursor = '0';
    if (!limit || limit > 20) limit = 20;
    const data = await this.productsRepository.findProductsByCategory({
      category,
      cursor,
      limit,
    });
    cursor = data[limit - 1]?.id;
    data.pop();
    return {
      data,
      cursor: cursor,
    };
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
