import {
  Controller,
  Get,
  Param,
  Query,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { OrdersService } from './orders.service';

import { ApiTags } from '@nestjs/swagger';
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
  findOne(@Param('id') id: number) {
    return this.ordersService.findOne(id);
  }

  @Get('deliver/:id')
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
