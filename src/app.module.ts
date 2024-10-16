import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CategoriesModule } from './modules/categories/categories.module';

@Module({
  imports: [UsersModule, ProductsModule, OrdersModule, CategoriesModule],
})
export class AppModule {}
