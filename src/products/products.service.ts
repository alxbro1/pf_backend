import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { InsertProduct } from '../../db/schema';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async create(body: InsertProduct) {
    return await this.productsRepository.createProduct(body);
  }

  async findAll() {
    return await this.productsRepository.findAllProducts();
  }

  async findOne(id: string) {
    return await this.productsRepository.findOneById(id);
  }

  async update(id: string, productData: Partial<InsertProduct>) {
    return await this.productsRepository.updateProduct(id, productData);
  }

  async remove(id: string) {
    return await this.productsRepository.removeProduct(id);
  }
}
