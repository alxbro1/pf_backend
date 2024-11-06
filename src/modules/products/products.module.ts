import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { FilesModule } from '../files/files.module';
import { CategoriesService } from '../categories/categories.service';
import { CategoriesRepository } from '../categories/categories.repository';

@Module({
  imports: [FilesModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository, CategoriesService, CategoriesRepository],
  exports: [ProductsService, ProductsRepository]
})
export class ProductsModule {}
