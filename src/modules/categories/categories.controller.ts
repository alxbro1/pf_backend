import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { InsertCategory } from '../../../db/schema';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll(): Promise<InsertCategory[]> {
    return this.categoriesService.findAll();
  }

  @Get(':uuid')
  async findOne(@Param('uuid') id: string): Promise<InsertCategory> {
    return this.categoriesService.findOne(id);
  }

  @Post()
  async create(
    @Body() newCategoryData: InsertCategory,
  ): Promise<InsertCategory[]> {
    return this.categoriesService.create(newCategoryData);
  }

  @Patch(':uuid')
  async update(@Param('uuid') id: string, @Body() updateCategoryDto: any) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':uuid')
  async remove(@Param('uuid') id: string) {
    return this.categoriesService.remove(id);
  }
}
