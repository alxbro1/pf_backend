import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { paginationByUserDto } from '../../schemas/pagination.dto';
import { addProductToCartDto } from './dto/addProduct.dto';
import { removeProductFromCartDto } from './dto/deleteProduct.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { mixedLocalStorageDto } from './dto/mixedLocalStorage.dto';

@Controller('carts')
@ApiTags('Carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  /* @UseGuards(AuthGuard) */
  @Get()
  @ApiOperation({ summary: 'Get the cart of a specific user' })
  @ApiQuery({
    name: 'limit',
    required: true,
    type: Number,
    description: 'Limit of items to be returned per page',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: Number,
    description: 'Cursor for pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the user cart',
    content: {
      'application/json': {
        example: {
          data: [
            {
              id: 'b03f0472-b4ac-4502-beb8-f035cb95103b',
              userId: '103d0472-b4ac-4502-beb8-f035cb95103b',
              products: [{ productId: '123456', quantity: 2, price: 15.99 }],
              total: 31.98,
              status: 'active',
            },
          ],
          nextCursor: 'b1c98ef7-01da-4bb3-bb96-0c5e682ff63d',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
    content: {
      'application/json': {
        example: { message: 'Invalid query parameters', error: 'Bad Request' },
      },
    },
  })
  async getCartByUserId(
    @Query('limit') limit: number,
    @Query('cursor') cursor: number,
    @Req()
    request: Request & {
      user: { id: string; email: string; iat: number; exp: number };
    },
  ) {
    const validation = paginationByUserDto.safeParse({
      cursor,
      limit,
      userId: request.user.id,
    });

    if (validation.success === false) {
      throw new BadRequestException(validation.error.issues);
    }

    return await this.cartsService.getCartByUserId(validation.data);
  }

  /* @UseGuards(AuthGuard) */
  @Post()
  @ApiOperation({ summary: 'Add a product to the user’s cart' })
  @ApiQuery({
    name: 'product',
    required: true,
    type: String,
    description: 'Product ID to add to the cart',
  })
  @ApiQuery({
    name: 'quantity',
    required: false,
    type: Number,
    description: 'Quantity of the product to add, defaults to 1',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully added product to cart',
    content: {
      'application/json': {
        example: {
          id: 'b03f0472-b4ac-4502-beb8-f035cb95103b',
          userId: '103d0472-b4ac-4502-beb8-f035cb95103b',
          products: [{ productId: '123456', quantity: 1, price: 15.99 }],
          total: 15.99,
          status: 'active',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data provided for adding product',
    content: {
      'application/json': {
        example: { message: 'Invalid product data', error: 'Bad Request' },
      },
    },
  })
  async addProductInCart(
    @Req()
    req: Request & {
      user: { id: string; email: string; iat: number; exp: number };
    },
    @Query('product') productId: string,
    @Query('quantity') quantity: number,
  ) {
    quantity = Number(quantity) || 1;

    const validation = addProductToCartDto.safeParse({
      userId: req.user.id,
      productId,
      quantity,
    });

    if (validation.success === false) {
      throw new BadRequestException(validation.error.issues);
    }

    return await this.cartsService.addProduct(validation.data);
  }

  /* @UseGuards(AuthGuard) */
  @Post('mixed')
  @ApiOperation({ summary: 'Store cart products in local storage' })
  @ApiBody({
    description: 'Products to store in local storage',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully stored products in local storage',
    content: {
      'application/json': {
        example: {
          message: 'Products saved in local storage',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data for mixed storage',
    content: {
      'application/json': {
        example: { message: 'Invalid storage data', error: 'Bad Request' },
      },
    },
  })
  mixedLocalStorage(
    @Req()
    req: Request & {
      user: { id: string; email: string; iat: number; exp: number };
    },
    @Body() products: object,
  ) {
    const userId = req.user.id;

    const validation = mixedLocalStorageDto.safeParse({
      products,
      userId,
    });
    if (validation.success === false) {
      throw new BadRequestException(validation.error.issues);
    }
    return this.cartsService.mixedLocalStorage(validation.data);
  }

  @UseGuards(AuthGuard)
  @Delete()
  @ApiOperation({ summary: 'Remove a product from the user’s cart' })
  @ApiQuery({
    name: 'product',
    required: true,
    type: String,
    description: 'Product ID to remove from the cart',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully removed product from cart',
    content: {
      'application/json': {
        example: {
          message: 'Product removed from cart',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data provided for removing product',
    content: {
      'application/json': {
        example: { message: 'Invalid product data', error: 'Bad Request' },
      },
    },
  })
  async deleteProductCart(
    @Req()
    req: Request & {
      user: { id: string; email: string; iat: number; exp: number };
    },
    @Query('product') productId: string,
  ) {
    const validation = removeProductFromCartDto.safeParse({
      userId: req.user.id,
      productId,
    });
    if (validation.success === false) {
      throw new BadRequestException(validation.error.issues);
    }

    return await this.cartsService.removeProduct(validation.data);
  }

  @UseGuards(AuthGuard)
  @Patch()
  @ApiOperation({ summary: 'Update quantity of a product in the cart' })
  @ApiQuery({
    name: 'product',
    required: true,
    type: String,
    description: 'Product ID to update in the cart',
  })
  @ApiQuery({
    name: 'quantity',
    required: true,
    type: Number,
    description: 'New quantity for the product',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated the product quantity',
    content: {
      'application/json': {
        example: {
          id: 'b03f0472-b4ac-4502-beb8-f035cb95103b',
          userId: '103d0472-b4ac-4502-beb8-f035cb95103b',
          products: [{ productId: '123456', quantity: 3, price: 15.99 }],
          total: 47.97,
          status: 'active',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid quantity or product data',
    content: {
      'application/json': {
        example: {
          message: 'Invalid quantity or product data',
          error: 'Bad Request',
        },
      },
    },
  })
  async updateQuantity(
    @Req()
    req: Request & {
      user: { id: string; email: string; iat: number; exp: number };
    },
    @Query('product') productId: string,
    @Query('quantity') quantity: string | number,
  ) {
    quantity = Number(quantity) || 1;

    const validation = addProductToCartDto.safeParse({
      userId: req.user.id,
      productId,
      quantity,
    });

    if (validation.success === false) {
      throw new BadRequestException(validation.error.issues);
    }

    return await this.cartsService.updateQuantity(validation.data);
  }
}
