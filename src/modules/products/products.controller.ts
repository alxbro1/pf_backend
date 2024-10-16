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
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { InsertProduct, productInsertSchema } from '../../../db/schema';
import { number } from 'zod';
import { LimitPipe } from './pipes/limitPage.pipe';

@Controller('products')
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
  async findAll(@Query('page', ParseIntPipe) page: number, @Query('limit', LimitPipe) limit: number) {
    return await this.productsService.findAll({page,limit});
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
