import { BadRequestException, Injectable } from '@nestjs/common';
import { categories, InsertCategory } from '../../../db/schema';
import { db } from '../../config/db';
import { eq } from 'drizzle-orm';

@Injectable()
export class CategoriesRepository {
  async findAll(): Promise<InsertCategory[]> {
    return await db.query.categories.findMany({ with: { products: true } });
  }

  async findOne(id: string): Promise<InsertCategory> {
    const category = await db.query.categories.findFirst({
      where: (fields) => eq(fields.id, id),
    });

    if (!category)
      throw new BadRequestException(`Category with uuid ${id} didn't exist.`);

    return category;
  }

  async create(newCategoryData: InsertCategory): Promise<InsertCategory[]> {
    const newCategory = await db
      .insert(categories)
      .values(newCategoryData)
      .returning();

    if (!newCategory) throw new BadRequestException(`error creating category.`);

    return newCategory;
  }

  async update(id: string, updateCategoryDto: any) {}

  async remove(id: string) {}
}
