import { Controller, Post, Body, UseGuards, Req, Res } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';
import { AuthGuard } from '../../guards/auth.guard';
import { SelectUserDto } from '../../../db/schemas/users.schema';
import { Response } from 'express';

@Controller('mercadopago')
export class MercadopagoController {
  constructor(private readonly mercadopagoService: MercadopagoService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() products: any,
    @Req() request: Request & { user: SelectUserDto },
  ) {
    return await this.mercadopagoService
      .create(products, request.user)
      .then((res) => res);
  }

  @Post('webhook')
  async webhook(@Body() body: any, @Res() res: Response) {
    await this.mercadopagoService.webhook(body);
    console.log(body);
    return res.status(200).send();
  }
}
