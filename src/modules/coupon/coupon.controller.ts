import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  ParseUUIDPipe,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SendCouponsDto, sendCouponsSchema } from './dto/send-coupons-dto';
import type { PaginatedCouponsDto } from './dto/paginated-coupons-dto';
import { getCouponsSchema } from './dto/get-coupons-dto';
import {
  UpdateCouponStatusDto,
  updateCouponStatusSchema,
} from './dto/update-coupon-status-dto';

@Controller('coupons')
@ApiTags('Coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Get()
  @ApiOperation({ summary: 'Get all coupons' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all coupons',
    content: {
      'application/json': {
        example: {
          data: [
            {
              id: '1f18db45-2c2a-414c-ba81-09ef08d30019',
              couponCode: 'ngb7afu9vx',
              discountPercentage: 25,
              expirationDate: '2024-11-25',
              isActive: true,
            },
            {
              id: '76025bcb-5ff1-43e0-beff-7ef37290f7b6',
              couponCode: 'bnfvxz051kh',
              discountPercentage: 25,
              expirationDate: '2024-11-25',
              isActive: true,
            },
            {
              id: 'a1f7bcf6-110d-42d5-88d8-31b30f7e88f7',
              couponCode: 'dup68nf5dzd',
              discountPercentage: 25,
              expirationDate: '2024-11-12',
              isActive: true,
            },
            {
              id: 'f216f03d-5c8e-4e42-ab69-10561a72b89c',
              couponCode: 'bpi9nrl3cp9',
              discountPercentage: 25,
              expirationDate: '2024-11-25',
              isActive: true,
            },
            {
              id: 'fecd15a9-bfcc-4f8f-99ef-17eccc69b57a',
              couponCode: 'w5rep6e97qf',
              discountPercentage: 25,
              expirationDate: '2024-11-12',
              isActive: true,
            },
          ],
          nextCursor: null,
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Coupons not found',
    content: {
      'application/json': {
        example: {
          message: 'Coupons not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  async getAllCoupons(
    @Query('cursor') cursor: string,
    @Query('limit') limit: number,
  ): Promise<PaginatedCouponsDto> {
    const input = getCouponsSchema.safeParse({ cursor, limit });

    if (!input.success) {
      throw new BadRequestException(input.error.errors);
    }

    return this.couponService.findAllCoupons(input.data);
  }

  @Post()
  @ApiOperation({ summary: 'Send coupons to multiple emails' })
  @ApiBody({
    description: 'Request body to send coupons to a list of emails',
    required: true,
    schema: {
      type: 'object',
      properties: {
        emails: {
          type: 'array',
          items: { type: 'string', format: 'email' },
          example: ['user1@example.com', 'user2@example.com'],
        },
        coupon: {
          type: 'object',
          properties: {
            discountPercentage: { type: 'number', example: 20 },
            expirationDate: {
              type: 'string',
              format: 'date',
              example: '2024-12-31',
            },
          },
          required: ['discountPercentage', 'expirationDate'],
        },
      },
      example: {
        emails: ['user1@example.com', 'user2@example.com'],
        coupon: {
          discountPercentage: 20,
          expirationDate: '2024-12-31',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Coupons sent successfully',
    content: {
      'application/json': {
        example: {
          message: 'Coupons sent successfully',
        },
      },
    },
  })
  async sendCoupons(@Body() sendCouponsDto: SendCouponsDto) {
    const input = sendCouponsSchema.safeParse(sendCouponsDto);

    if (!input.success) {
      throw new BadRequestException(input.error.errors);
    }

    return this.couponService.sendCoupons(input.data);
  }

  @Get('validate/:id')
  @ApiOperation({ summary: 'Validate a coupon by ID' })
  @ApiResponse({
    status: 200,
    description: 'Coupon validated successfully',
    content: {
      'application/json': {
        example: { message: 'Validation successful' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Coupon not found',
    content: {
      'application/json': {
        example: {
          message: 'Coupon not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Coupon validation failed (expired or inactive)',
    content: {
      'application/json': {
        example: {
          message: 'Coupon is expired',
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    },
  })
  async validate(@Param('id', ParseUUIDPipe) id: string) {
    return this.couponService.validateCoupon(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a coupon by ID' })
  @ApiResponse({
    status: 200,
    description: 'Coupon retrieved successfully',
    content: {
      'application/json': {
        example: {
          id: '1234-5678-abcd-efgh',
          couponCode: 'SAVE10',
          discountPercentage: 10,
          expirationDate: '2024-11-30',
          isActive: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Coupon not found',
    content: {
      'application/json': {
        example: {
          message: 'Coupon not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  async findOne(@Param('id', ParseUUIDPipe) couponCode: string) {
    return this.couponService.findOneBy(couponCode);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a coupon by ID' })
  @ApiResponse({
    status: 200,
    description: 'Coupon deleted successfully',
    content: {
      'application/json': {
        example: {
          message: 'Coupon deleted successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Coupon not found',
    content: {
      'application/json': {
        example: {
          message: 'Coupon not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.couponService.deleteCoupon(id);
  }

  @Patch('update-discount/:id')
  @ApiOperation({ summary: 'Update discount percentage of a coupon' })
  @ApiBody({
    description: 'Request body to update the discount percentage',
    required: true,
    examples: {
      example1: {
        summary: 'Update Discount Example',
        value: {
          discountPercentage: 15,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Discount percentage updated successfully',
    content: {
      'application/json': {
        example: {
          message: 'Discount percentage updated successfully',
          newDiscountPercentage: 15,
        },
      },
    },
  })
  async updateDiscount(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('discountPercentage') discountPercentage: number,
  ) {
    return this.couponService.updateDiscountPercentage(id, discountPercentage);
  }

  @Patch('status/:id')
  @ApiOperation({ summary: 'Toggle coupon status by ID' })
  @ApiResponse({
    status: 200,
    description: 'Coupon status changed successfully',
    content: {
      'application/json': {
        example: {
          message: 'Coupon status changed successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Coupon not found or invalid body',
    content: {
      'application/json': {
        example: {
          message: 'Coupon not found',
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    },
  })
  async changeCouponStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateCouponStatusDto,
  ) {
    const validation = updateCouponStatusSchema.safeParse(body);

    if (!validation.success) {
      throw new BadRequestException(validation.error.errors);
    }

    return this.couponService.changeStatus(id, validation.data.isActive);
  }

  @Get('code/:couponCode')
  @ApiOperation({ summary: 'Get a coupon by coupon code' })
  @ApiResponse({
    status: 200,
    description: 'Coupon retrieved successfully',
    content: {
      'application/json': {
        example: {
          id: '1234-5678-abcd-efgh',
          couponCode: 'SAVE20',
          discountPercentage: 20,
          expirationDate: '2024-12-31',
          isActive: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Coupon not found',
    content: {
      'application/json': {
        example: {
          message: 'Coupon not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  async findOneByCode(@Param('couponCode') couponCode: string) {
    return this.couponService.findOneByCode(couponCode);
  }

  @Patch('toggle-status/:id')
  @ApiOperation({ summary: 'Toggle coupon status by ID' })
  @ApiResponse({
    status: 200,
    description: 'Coupon status toggled successfully',
    content: {
      'application/json': {
        example: {
          message: 'Coupon has been activated',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Coupon not found',
    content: {
      'application/json': {
        example: {
          message: 'Coupon not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  async toggleStatus(@Param('id', ParseUUIDPipe) id: string) {
    return this.couponService.toggleStatus(id);
  }
}
