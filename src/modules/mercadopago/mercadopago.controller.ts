import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';
import { CreateMercadopagoDto } from './dto/create-mercadopago.dto';
import { MercadoPagoPreApproval } from 'mercadopago/resources/preapproval';
import { MercadoPagoMerchantOrder } from 'mercadopago/resources/merchantOrders';

@Controller('mercadopago')
export class MercadopagoController {
  constructor(private readonly mercadopagoService: MercadopagoService) {}

  @Post()
  async create(@Body() createMercadopagoDto: any) {
    return await this.mercadopagoService
      .create(createMercadopagoDto)
      .then((res) => res)
  }

  @Post('webhook')
  async webhook(@Body() body: any) {
    await this.mercadopagoService.webhook(body);
  }
}
