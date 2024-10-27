import { Injectable } from '@nestjs/common';
import { CartsRepository } from './carts.repository';

@Injectable()
export class CartsService {
  constructor(private readonly cartsRepository: CartsRepository) {}

  async getCartByUserId(userId: string) {
    return await this.cartsRepository.getCartByUserId(userId);
  }

  async createOrAddCart(userId: string, product: string) {
    return await this.cartsRepository.createOrAddCart(userId, product);
  }

  async removeProduct(userId: string, product: string) {
    return await this.cartsRepository.removeProduct(userId, product);
  }
}
