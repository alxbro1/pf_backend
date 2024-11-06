import { IsInt, IsPositive, IsString, IsUUID } from 'class-validator';

class products {
  @IsUUID()
  productId: string;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsInt()
  @IsPositive()
  price: number;
}
export class CreateOrderDto {
  @IsUUID()
  userId: string;

  @IsString()
  mpOrderID?: string;

  products: products[];

  amount: number;
  

}
