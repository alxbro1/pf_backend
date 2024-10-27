import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrAddCartDto {
  @IsNotEmpty()
  @IsString()
  product: string;
}
