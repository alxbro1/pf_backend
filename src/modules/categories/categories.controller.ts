import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { InsertCategory, insertCategorySchema } from '../../../db/schema';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll(): Promise<InsertCategory[]> {
    return await this.categoriesService.findAll();
  }

  @Get(':uuid')
  async findOne(
    @Param('uuid', ParseUUIDPipe) id: string,
  ): Promise<InsertCategory> {
    return await this.categoriesService.findOne(id);
  }

  @Post()
  async create(@Body() body: InsertCategory): Promise<InsertCategory[]> {
    const validation = insertCategorySchema.safeParse(body);
    if (!validation.success)
      throw new BadRequestException(validation.error.issues);
    return await this.categoriesService.create(body);
  }

  @Patch(':uuid')
  async update(
    @Param('uuid', ParseUUIDPipe) id: string,
    @Body() body: Partial<InsertCategory>,
  ): Promise<InsertCategory[]> {
    return await this.categoriesService.update(id, body);
  }

  @Delete(':uuid')
  async remove(
    @Param('uuid', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    return await this.categoriesService.remove(id);
  }
}
