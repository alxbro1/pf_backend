import { Controller, Post, Body, UseGuards, Req, Res } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';
import { AuthGuard } from '../../guards/auth.guard';
import { SelectUserDto } from '../../../db/schemas/users.schema';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('mercadopago')
@ApiTags('Mercado Pago')
export class MercadopagoController {
  constructor(private readonly mercadopagoService: MercadopagoService) {}

  /* @UseGuards(AuthGuard) */
  @Post()
  @ApiOperation({ summary: 'Create MercadoPago payment' })
  /* @ApiBearerAuth() */
  @ApiBody({
    description: 'Request body for Mercado Pago Payment',
    required: true,
    schema: {
      type: 'object',
      properties: {
        products: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              quantity: { type: 'integer', example: 5 },
              id: {
                type: 'string',
                example: '91a2dbc6-20eb-425d-8755-961614c7f2e5',
              },
            },
          },
          example: [
            {
              quantity: 5,
              id: '91a2dbc6-20eb-425d-8755-961614c7f2e5',
            },
            {
              quantity: 5,
              id: '8889729f-eec7-4ae9-9ff6-5a4f740a29d4',
            },
            {
              quantity: 5,
              id: '68149911-23fb-4730-9691-ff3859c7eef4',
            },
            {
              quantity: 5,
              id: '91a2dbc6-20eb-425d-8755-961614c7f2e5',
            },
            {
              quantity: 5,
              id: '71ea2b7c-b20c-4535-8360-af45307d07a5',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Payment created successfully',
    content: {
      'application/json': {
        example: {
          status: 'approved',
          paymentId: '123456789',
          message: 'Payment processed successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid product data',
    content: {
      'application/json': {
        example: {
          message: 'Invalid product data',
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    content: {
      'application/json': {
        example: {
          message: 'Error creating payment',
          error: 'Internal Server Error',
          statusCode: 500,
        },
      },
    },
  })
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
