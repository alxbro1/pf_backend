import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { FilesModule } from './modules/files/files.module';
import { MailModule } from './modules/mail/mail.module';
import { MercadopagoModule } from './modules/mercadopago/mercadopago.module';
import { WebsocketModule } from './modules/websockets/websockets.module';
import { CartsModule } from "./modules/carts/carts.module"

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    ProductsModule,
    OrdersModule,
    CategoriesModule,
    FilesModule,
    MailModule,
    AuthModule,
    MercadopagoModule,
    CartsModule,
    WebsocketModule
  ],
})
export class AppModule {}
