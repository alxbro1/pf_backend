import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { categories, InsertCategory } from '../../../db/schemas/schema';
import { db } from '../../config/db';
import { eq } from 'drizzle-orm';

@Injectable()
export class CategoriesRepository {

  async findAll(): Promise<InsertCategory[]> {
    try {
      const categories = await db.query.categories.findMany();
      if (categories.length == 0) return []
      return categories;
    } catch {
      throw new InternalServerErrorException('Error fetching Categories');
    }
  }

  async findOne(id: string): Promise<InsertCategory> {
    const category = await db.query.categories.findFirst({
      where: (fields) => eq(fields.id, id),
    });

    if (!category)
      throw new NotFoundException(`Category with uuid ${id} didn't exist.`);

    return category;
  }

  async create(newCategoryData: InsertCategory): Promise<InsertCategory[]> {
    const newCategory = await db
      .insert(categories)
      .values(newCategoryData)
      .returning();
    if (!newCategory) throw new BadRequestException("Error Creating Category");

    return newCategory;
  }

  async update(
    id: string,
    newCategoryData: Partial<InsertCategory>,
  ): Promise<InsertCategory[]> {
    const updatedCategory = await db
      .update(categories)
      .set(newCategoryData)
      .where(eq(categories.id, id))
      .returning({ id: categories.id, name: categories.name });

    if (updatedCategory.length == 0)
      throw new NotFoundException(`Category with uuid ${id} didn't exist.`);

    return updatedCategory;
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const rowCount = (
        await db.delete(categories).where(eq(categories.id, id))
      ).rowCount;
      if (rowCount == 0) throw new NotFoundException('Category not Found');
      return { message: 'Category deleted Successfuly.' };
    } catch {
      throw new BadRequestException(
        'Category is already exists in products relations, cannot be deleted',
      );
    }
  }
}
