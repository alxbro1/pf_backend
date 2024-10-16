import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { InsertCategory } from '../../../db/schema';

@Injectable()
export class CategoriesService {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async findAll(): Promise<InsertCategory[]> {
    return this.categoriesRepository.findAll();
  }

  async findOne(id: string): Promise<InsertCategory> {
    return this.categoriesRepository.findOne(id);
  }

  async create(newCategoryData: InsertCategory): Promise<InsertCategory[]> {
    return this.categoriesRepository.create(newCategoryData);
  }

  async update(id: string, updateCategoryDto: any) {
    return this.categoriesRepository.update(id, updateCategoryDto);
  }

  async remove(id: string) {
    return this.categoriesRepository.remove(id);
  }
}
