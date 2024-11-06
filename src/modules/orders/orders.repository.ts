import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { db } from '../../config/db';
import {
  orders,
  ordersDetails,
  selectOrders,
} from '../../../db/schemas/orders.schema';
import { and, asc, eq, gte } from 'drizzle-orm';
import {
  PaginationByUserDto,
  PaginationCursorNumberDto,
} from '../../schemas/pagination.dto';
import { UserEntity, users } from '../../../db/schemas/users.schema';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ordersRepository {
  constructor(private readonly mailService: MailService){}
  async create(data: CreateOrderDto) {
    const order = (await db
      .insert(orders)
      .values({
        userId: data.userId,
        mpOrderId: data.mpOrderID,
        amount: data.amount,
      })
      .returning()) as any;
    if (!order[0] || !order[0].id)
      throw new BadRequestException('Error creating order');
    const ordersDetailsObj = data.products.map((product) => {
      return {
        orderId: order[0].id,
        productId: product.productId,
        quantity: product.quantity,
        price: product.price,
      };
    });

    const orderDetails = await db
      .insert(ordersDetails)
      .values(ordersDetailsObj)
      .execute();

    if (!orderDetails) {
      throw new BadGatewayException('Error creating order details');
    }

    return order[0].id;
  }

  async updateToPayment(data: any) {
    const dbResponse = await db
      .update(orders)
      .set({
        mpOrderId: data.mpOrder,
        isPaid: data.paid,
        orderEstatus: data.status,
      })
      .where(eq(orders.id, data.order))
      .execute();
    console.log(dbResponse);
    return dbResponse;
  }

  async getOrdersByUser({
    userId,
    limit,
    cursor,
  }: PaginationByUserDto): Promise<{
    data: selectOrders[] | [];
    nextCursor: number | null;
  }> {
    const where = [eq(orders.userId, userId)];

    if (cursor) where.push(gte(orders.id, cursor));

    const NEXT_CURSOR_ITEM = 1;

    const selectedOrders = await db.query.orders
      .findMany({
        where: and(...where),
        limit: limit + NEXT_CURSOR_ITEM,
        orderBy: asc(orders.id),
      })
      .catch((err) => {
        throw new BadRequestException('There are no more orders available');
      });
    let nextCursor: number | null = null;

    if (selectedOrders.length === 0)
      return {
        data: [],
        nextCursor,
      };

    if (selectedOrders.length > limit) {
      nextCursor = selectedOrders.pop()!.id;
    }

    return {
      data: selectedOrders,
      nextCursor,
    };
  }

  async getOrderById(orderId: number) {
    const dbResponse = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        ordersDetails: {
          with: {
            product: true,
          },
        },
      },
    });
    return dbResponse;
  }

  async findAllAdmin({ cursor, limit }: PaginationCursorNumberDto): Promise<{
    data: selectOrders[] | [];
    nextCursor: number | null;
  }> {
    let where: any = undefined;

    if (cursor) where = gte(orders.id, cursor);

    const NEXT_CURSOR_ITEM = 1;
    const selectedOrders = await db.query.orders
      .findMany({
        where,
        limit: limit + NEXT_CURSOR_ITEM,
        orderBy: asc(orders.id),
      })
      .catch((err) => {
        throw new BadRequestException('There are no more orders available');
      });

    let nextCursor: number | null = null;

    if (selectedOrders.length === 0)
      return {
        data: [],
        nextCursor,
      };

    if (selectedOrders.length > limit) {
      nextCursor = selectedOrders.pop()!.id;
    }

    return {
      data: selectedOrders,
      nextCursor,
    };
  }

  async markOrderAsDelivered(orderId: number) {
    if(!orderId) throw new NotFoundException("Order not found")
    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .execute();

    if (order.length === 0) {
      throw new BadRequestException('Order not found');
    }

    if (order[0].shippingStatus === 'delivered') {

      return {
        order: order[0],
        message: 'Order was already marked as delivered',
      };
    }

    const dbResponse = await db
      .update(orders)
      .set({ shippingStatus: 'delivered' })
      .where(eq(orders.id, orderId))
      .execute();

    if (dbResponse.rowCount === 0) {
      throw new BadRequestException('Error updating order status');
    }

    let user: UserEntity | null = null;
    if (order[0].userId !== null) {
      const userResponse = await db
        .select()
        .from(users)
        .where(eq(users.id, order[0].userId))
        .execute();

      if (userResponse.length > 0) {
        user = userResponse[0];
      }
    }

    if (user) {
      await this.mailService.sendDeliveredConfirmationMail(user);
    }

    return { order: order[0], user: user || null };
  }
}
