import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateOrAddCartDto } from './dto/createoraddcart.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Carts')
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get(':uuid')
  async getCartByUserId(@Param('uuid', ParseUUIDPipe) userId: string) {
    return await this.cartsService.getCartByUserId(userId);
  }

  @Post(':uuid')
  async createOrAddCart(
    @Param('uuid', ParseUUIDPipe) userId: string,
    @Body() body: CreateOrAddCartDto,
  ) {
    const { product } = body;
    return await this.cartsService.createOrAddCart(userId, product);
  }

  @Delete(':uuid')
  async removeProduct(
    @Param('uuid', ParseUUIDPipe) userId: string,
    @Body() body: CreateOrAddCartDto,
  ) {
    const { product } = body;
    return await this.cartsService.removeProduct(userId, product);
  }
}
