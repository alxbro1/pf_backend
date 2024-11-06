import { IsNotEmpty, IsString } from 'class-validator';

export class EditPasswordDto {
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
