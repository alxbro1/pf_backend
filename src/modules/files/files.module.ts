import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesRepository } from './files.repository';
import { FilesController } from './files.controller';
import { ProductsService } from '../products/products.service';
import { ProductsRepository } from '../products/products.repository';

@Module({
  controllers:[FilesController],
  providers: [FilesService, FilesRepository, ProductsService, ProductsRepository],
  exports: [FilesService, FilesRepository],
})
export class FilesModule {}
