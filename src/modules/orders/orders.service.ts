import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ordersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(private ordersRepository: ordersRepository) {}

  async create(createOrderDto: CreateOrderDto) {
    return await this.ordersRepository.create(createOrderDto);
  }

  async updateToPayment(updateOrderDto: any) {
    const dbResponse =
      await this.ordersRepository.updateToPayment(updateOrderDto);
    if (!dbResponse) throw new Error('Error updating order');
    return dbResponse;
  }

  async findAll(cursor: number | null, limit: number, userId: string) {
    limit++;
    if (!cursor) cursor = 0;
    if (!limit || limit > 20) limit = 20;

    const data = await this.ordersRepository.getOrdersByUser(
      userId,
      cursor,
      limit,
    );

    const prevCursor = cursor ? +cursor : null;

    if (!data[limit - 1]?.id) {
      cursor = null;
    } else {
      cursor = data[limit - 1].id;
    }

    cursor;
    data.splice(limit, 1);
    console.log(cursor);
    return {
      data,
      cursor: cursor,
      prevCursor: prevCursor,
    };
  }

  async findOne(id: number) {
    return await this.ordersRepository.getOrderById(id);
  }

  async findAllAdmin(cursor: number | null, limit: number) {
    limit++;
    if (!cursor) cursor = 0;
    if (!limit || limit > 20) limit = 20;

    const data = await this.ordersRepository.findAllAdmin(cursor, limit);

    const prevCursor = cursor ? +cursor : null;

    if (!data[limit - 1]?.id) {
      cursor = null;
    } else {
      cursor = data[limit - 1].id;
    }

    cursor;
    data.splice(limit, 1);
    console.log(cursor);
    return {
      data,
      cursor: cursor,
      prevCursor: prevCursor,
    };
  }
}
