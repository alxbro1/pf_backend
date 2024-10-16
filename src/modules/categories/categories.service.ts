import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { InsertCategory } from '../../../db/schema';

@Injectable()
export class CategoriesService {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async findAll(): Promise<InsertCategory[]> {
    return await this.categoriesRepository.findAll();
  }

  async findOne(id: string): Promise<InsertCategory> {
    return await this.categoriesRepository.findOne(id);
  }

  async create(newCategoryData: InsertCategory): Promise<InsertCategory[]> {
    return await this.categoriesRepository.create(newCategoryData);
  }

  async update(
    id: string,
    newCategoryData: Partial<InsertCategory>,
  ): Promise<InsertCategory[]> {
    return await this.categoriesRepository.update(id, newCategoryData);
  }

  async remove(id: string): Promise<{ message: string }> {
    return await this.categoriesRepository.remove(id);
  }
}
