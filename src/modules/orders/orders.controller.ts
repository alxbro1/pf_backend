import {
  Controller,
  Get,
  Param,
  Query,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { OrdersService } from './orders.service';

import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  paginationByUserDto,
  paginationCursorNumberDto,

} from '../../schemas/pagination.dto';
import { Response } from 'express';

@Controller('orders')
@ApiTags('Orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('findAllByUser')
  @ApiOperation({ summary: 'Get all orders for a user' })
  @ApiQuery({
    name: 'limit',
    required: true,
    description: 'Limit number of orders to return',
    type: Number,
  })
  @ApiQuery({
    name: 'cursor',
    required: true,
    description: 'Cursor for pagination (for continuation)',
    type: Number,
  })
  @ApiQuery({
    name: 'userId',
    required: true,
    description: 'User ID to get orders for',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Get All Orders By User successfuly.',
    content: {
      'aplication/json': {
        example: {
          data: [
            {
              id: 5,
              mpOrderId: '24643590047',
              userId: '3c296fe9-8bf4-4449-8f9f-021c89578f69',
              orderEstatus: 'paid',
              isPaid: true,
              amount: 2245,
              createdAt: '2024-11-05T13:04:46.947Z',
              discountPercentage: 0,
              shippingStatus: 'delivered',
            },
            {
              id: 6,
              mpOrderId: '24643758409',
              userId: '3c296fe9-8bf4-4449-8f9f-021c89578f69',
              orderEstatus: 'paid',
              isPaid: true,
              amount: 2245,
              createdAt: '2024-11-05T13:04:46.947Z',
              discountPercentage: 0,
              shippingStatus: 'pending',
            },
            {
              id: 7,
              mpOrderId: '24658444828',
              userId: '3c296fe9-8bf4-4449-8f9f-021c89578f69',
              orderEstatus: 'paid',
              isPaid: true,
              amount: 2245,
              createdAt: '2024-11-05T13:04:46.947Z',
              discountPercentage: 0,
              shippingStatus: 'delivered',
            },
            {
              id: 8,
              mpOrderId: '24644158983',
              userId: '3c296fe9-8bf4-4449-8f9f-021c89578f69',
              orderEstatus: 'paid',
              isPaid: true,
              amount: 2245,
              createdAt: '2024-11-05T13:04:46.947Z',
              discountPercentage: 0,
              shippingStatus: 'pending',
            },
            {
              id: 9,
              mpOrderId: '24644271971',
              userId: '3c296fe9-8bf4-4449-8f9f-021c89578f69',
              orderEstatus: 'paid',
              isPaid: true,
              amount: 2245,
              createdAt: '2024-11-05T13:04:46.947Z',
              discountPercentage: 0,
              shippingStatus: 'pending',
            },
          ],
          nextCursor: 10,
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Order not Found',
    content: {
      'aplication/json': {
        example: {
          message: 'Order not Found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  findAllByUser(
    @Query('limit') limit: number,
    @Query('cursor') cursor: number,
    @Query('userId') userId: string,
  ) {
    const validation = paginationByUserDto.safeParse({ cursor, limit, userId });

    if (validation.success === false) {
      throw new BadRequestException(validation.error.issues);
    }

    return this.ordersService.findAllByUser(validation.data);
  }

  @Get('findAll')
  @ApiResponse({
    status: 200,
    description: 'Get All Orders By User successfuly.',
    content: {
      'aplication/json': {
        example: {
          data: [
            {
              id: 5,
              mpOrderId: '24643590047',
              userId: '3c296fe9-8bf4-4449-8f9f-021c89578f69',
              orderEstatus: 'paid',
              isPaid: true,
              amount: 2245,
              createdAt: '2024-11-05T13:04:46.947Z',
              discountPercentage: 0,
              shippingStatus: 'delivered',
            },
            {
              id: 6,
              mpOrderId: '24643758409',
              userId: '3c296fe9-8bf4-4449-8f9f-021c89578f69',
              orderEstatus: 'paid',
              isPaid: true,
              amount: 2245,
              createdAt: '2024-11-05T13:04:46.947Z',
              discountPercentage: 0,
              shippingStatus: 'pending',
            },
            {
              id: 7,
              mpOrderId: '24658444828',
              userId: '3c296fe9-8bf4-4449-8f9f-021c89578f69',
              orderEstatus: 'paid',
              isPaid: true,
              amount: 2245,
              createdAt: '2024-11-05T13:04:46.947Z',
              discountPercentage: 0,
              shippingStatus: 'delivered',
            },
            {
              id: 8,
              mpOrderId: '24644158983',
              userId: '3c296fe9-8bf4-4449-8f9f-021c89578f69',
              orderEstatus: 'paid',
              isPaid: true,
              amount: 2245,
              createdAt: '2024-11-05T13:04:46.947Z',
              discountPercentage: 0,
              shippingStatus: 'pending',
            },
            {
              id: 9,
              mpOrderId: '24644271971',
              userId: '3c296fe9-8bf4-4449-8f9f-021c89578f69',
              orderEstatus: 'paid',
              isPaid: true,
              amount: 2245,
              createdAt: '2024-11-05T13:04:46.947Z',
              discountPercentage: 0,
              shippingStatus: 'pending',
            },
          ],
          nextCursor: 10,
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Order not Found',
    content: {
      'aplication/json': {
        example: {
          message: 'Order not Found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  @ApiOperation({ summary: 'Get all orders (Admin)' })
  @ApiQuery({
    name: 'limit',
    required: true,
    description: 'Limit number of orders to return',
    type: Number,
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: 'Cursor for pagination (for continuation)',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'List of all orders (for admin)',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
  })
  findAllAdmin(
    @Query('limit') limit: number,
    @Query('cursor') cursor?: number,
  ) {
    const validation = paginationCursorNumberDto.safeParse({ cursor, limit });
    if (validation.success === false) {
      throw new BadRequestException(validation.error.issues);
    }
    return this.ordersService.findAllAdmin(validation.data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific order by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Order ID to retrieve the order details',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Get a specific order by ID successfuly.',
    content: {
      'aplication/json': {
        example: {
          id: 5,
          mpOrderId: '24643590047',
          userId: '3c296fe9-8bf4-4449-8f9f-021c89578f69',
          orderEstatus: 'paid',
          isPaid: true,
          amount: 2245,
          createdAt: '2024-11-05T13:04:46.947Z',
          discountPercentage: 0,
          shippingStatus: 'delivered',
          ordersDetails: {
            id: 9,
            orderId: 5,
            productId: '3e749b6d-0a54-4bad-99c6-310a6d77d59c',
            quantity: 5,
            price: 50,
            product: {
              id: '3e749b6d-0a54-4bad-99c6-310a6d77d59c',
              price: 50,
              description:
                'Paint your way to victory in the chaotic and colorful multiplayer battles of Splatoon 3.',
              type: 'digital',
              stock: 85,
              name: 'Splatoon 3',
              categoryId: '6a35e8d1-cf8f-4d89-b498-91db44396074',
              imageUrl:
                'https://m.media-amazon.com/images/I/81iLLP4qRLL._SL1500_.jpg',
              active: 'active',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Order not Found',
    content: {
      'aplication/json': {
        example: {
          message: 'Order not Found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  findOne(@Param('id') id: number) {
    return this.ordersService.findOne(id);
  }

  @Get('deliver/:id')
  @ApiOperation({ summary: 'Mark order as delivered' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Order ID to mark as delivered',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Redirect after marking order as delivered',
  })
  @ApiResponse({
    status: 400,
    description: 'Error while marking order as delivered',
  })
  async markOrderAsDelivered(
    @Param('id') orderId: number,
    @Res() res: Response,
  ) {
    try {
      const order = await this.ordersService.markOrderAsDelivered(orderId);

      if (order) {
        return res.redirect('http://localhost:3000');
      }

      return res.redirect('http://localhost:3000');
    } catch (error) {
      console.error('Error:', error);
      return res.redirect('http://localhost:3000');
    }
  }
}
