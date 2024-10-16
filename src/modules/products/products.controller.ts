import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
  ParseUUIDPipe,
  Put,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { InsertProduct, productInsertSchema } from '../../../db/schema';
import { ApiTags } from '@nestjs/swagger';
import { number } from 'zod';

@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('createproduct')
  async create(@Body() body: InsertProduct) {
    const validation = productInsertSchema.safeParse(body);
    if (!validation.success) {
      throw new BadRequestException(validation.error.issues);
    }
    return await this.productsService.create(validation.data as InsertProduct);
  }

  @Get()
  async findAll() {
    return await this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: Partial<InsertProduct>,
  ) {
    return await this.productsService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productsService.remove(id);
  }
}
