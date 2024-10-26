import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('orders')
@ApiTags('Orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('findAllByUser')
  findAll(@Query('limit', ParseIntPipe) limit: number, @Query('cursor') cursor: number, @Query('userId') userId:string) {
    return this.ordersService.findAll(+cursor, limit, userId);
  }

  @Get()
  findAllAdmin(@Query('limit', ParseIntPipe) limit: number, @Query('cursor') cursor: number) {
    return this.ordersService.findAllAdmin(+cursor, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.ordersService.findOne(id);
  }
}
