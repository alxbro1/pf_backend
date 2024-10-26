import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
  ParseUUIDPipe,
  Put,
  Query,
  ParseIntPipe,
  Patch,
  UseInterceptors,
} from '@nestjs/common';

import { ProductsService } from './products.service';
import { InsertProduct, productInsertSchema } from '../../../db/schemas/schema';
import { LimitPipe } from './pipes/limitPage.pipe';
import {
  ApiTags,
  ApiOperation,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { RemoveOneImageDto } from './dto/remove.dto';
import { paginationDto } from './dto/pagination.dto';
import { typeEnum } from './dto/type.enum';

@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create')
  @ApiBody({
    description: 'Request body for creating a Category',
    required: true,
    examples: {
      example1: {
        summary: 'Create Category example',
        value: {
          name: 'Prueba producto',
          price: 1999,
          description: 'Prueba descripcion',
          type: 'digital',
          stock: 25,
          imageUrl: 'imagen prueba',
          categoryId: 'c65397d5-6f4e-4173-bc16-6861585e0db6',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    content: {
      'aplication/json': {
        example: [
          {
            id: '53c08a82-b37f-413c-8cfe-6a2ef697e82a',
            price: 1999,
            description: 'Prueba descripcion',
            type: 'digital',
            stock: 25,
            name: 'Prueba producto',
            categoryId: 'c65397d5-6f4e-4173-bc16-6861585e0db6',
            imageUrl: 'imagen prueba',
            active: true,
          },
        ],
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Error creating Product',
    content: {
      'aplication/json': {
        example: {
          message: 'Internal Server Error',
          error: 'Error creating product',
          statusCode: 500,
        },
      },
    },
  })
  @ApiOperation({ summary: 'Create Product' })
  async create(@Body() body: InsertProduct) {
    const validation = productInsertSchema.safeParse(body);
    if (!validation.success) {
      throw new BadRequestException(validation.error.issues);
    }
    return await this.productsService.create(validation.data as InsertProduct);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get All Paginated Products successfully',
    content: {
      'aplication/json': {
        example: [
          {
            id: '9e8f808f-4dc3-4cce-ab3b-ee7d0f59396e',
            price: 182,
            type: 'digital',
            name: 'that morning',
            imageUrl: 'https://loremflickr.com/900/900?lock=2327064722111630',
            active: true,
            category: {
              name: 'grocery',
            },
          },
          {
            id: 'f56c2000-c541-4f08-ba94-e18f83af17f4',
            price: 956,
            type: 'PHISICAL',
            name: 'unfinished hierarchy',
            imageUrl: 'https://loremflickr.com/900/900?lock=8733586377715857',
            active: true,
            category: {
              name: 'baby',
            },
          },
          {
            id: '82619689-2657-4e50-8960-0f3edf1931f4',
            price: 320,
            type: 'digital',
            name: 'precious packaging',
            imageUrl: 'https://loremflickr.com/900/900?lock=4483356518871534',
            active: true,
            category: {
              name: 'Electronics',
            },
          },
          {
            id: '8e65da54-41f6-4e26-8645-abbcb14218ed',
            price: 640,
            type: 'PHISICAL',
            name: 'frightened order',
            imageUrl: 'https://loremflickr.com/900/900?lock=803921208177898',
            active: true,
            category: {
              name: 'home',
            },
          },
          {
            id: '433b0239-9ac2-43a0-8933-6d893a316d1a',
            price: 237,
            type: 'PHISICAL',
            name: 'triangular oil',
            imageUrl: 'https://loremflickr.com/900/900?lock=1098080330168131',
            active: true,
            category: {
              name: 'computers',
            },
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Products not found',
    content: {
      'aplication/json': {
        example: {
          message: 'Products not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Error fetching Products',
    content: {
      'aplication/json': {
        example: {
          message: 'Internal Server Error',
          error: 'Error fetching Products',
          statusCode: 500,
        },
      },
    },
  })
  @ApiOperation({ summary: 'Get All Paginated Products (Page/Limit)' })
  async findAll(
    @Query('cursor') cursor: string,
    @Query('limit', LimitPipe) limit: number,
    @Query('type') typeProduct: typeEnum
  ) {
    return await this.productsService.findAll(cursor, limit, typeProduct);
  }

  @Get('dashboardTable')
  async findDashboard(
    @Query('limit', ParseIntPipe) limit: number,
    @Query('cursor') cursor: string,
  ) {
    return await this.productsService.findAllDashboardProducts({
      limit,
      cursor,
    });
  }

  @Get('category')
  @ApiResponse({
    status: 200,
    description: 'Get All Paginated Products by Category successfully',
    content: {
      'aplication/json': {
        example: [
          {
            id: 'df7062aa-e9bc-49dd-8d29-07244244fad3',
            price: 158,
            type: 'PHISICAL',
            name: 'oily handle',
            imageUrl: 'https://loremflickr.com/900/900?lock=8688651007005508',
            active: true,
            category: {
              name: 'shoes',
            },
          },
          {
            id: '9cf0e360-7cc8-4529-913f-bca60f79c85f',
            price: 519,
            type: 'digital',
            name: 'mad pleasure',
            imageUrl: 'https://loremflickr.com/900/900?lock=1807641517456240',
            active: true,
            category: {
              name: 'shoes',
            },
          },
          {
            id: '08dcb356-041e-4d02-9810-3b645bb8bd07',
            price: 588,
            type: 'digital',
            name: 'difficult arcade',
            imageUrl: 'https://loremflickr.com/900/900?lock=1368951004200504',
            active: true,
            category: {
              name: 'shoes',
            },
          },
          {
            id: 'ef2298f0-378e-419a-b1e6-c0fcb751debe',
            price: 10,
            type: 'digital',
            name: 'excited alb',
            imageUrl: 'https://loremflickr.com/900/900?lock=7193111634341298',
            active: true,
            category: {
              name: 'shoes',
            },
          },
          {
            id: '8a51b600-c841-4ff1-bb67-fc961aa1ee4b',
            price: 732,
            type: 'PHISICAL',
            name: 'medium strategy',
            imageUrl: 'https://loremflickr.com/900/900?lock=7441407100760783',
            active: true,
            category: {
              name: 'shoes',
            },
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Products not found',
    content: {
      'aplication/json': {
        example: {
          message: 'Products not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Error fetching Products',
    content: {
      'aplication/json': {
        example: {
          message: 'Internal Server Error',
          error: 'Error fetching Products',
          statusCode: 500,
        },
      },
    },
  })
  @ApiOperation({ summary: 'Get All Products By Category' })
  async findByCategory(
    @Query('category') category: string,
    @Query('cursor') cursor: string,
    @Query('limit', LimitPipe) limit: number,
  ) {
    return await this.productsService.findByCategory({
      category,
      cursor,
      limit,
    });
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get Product By ID successfully',
    content: {
      'aplication/json': {
        example: {
          id: '98a00aa3-b9b2-4a06-9571-aa749ae7fe4d',
          price: 435,
          description: 'Vestrum abeo alias adflicto vir alienus vado.',
          type: 'digital',
          stock: 29,
          name: 'monumental cafe',
          categoryId: '3559389f-22f3-4e32-b94b-31a068f8a383',
          imageUrl: 'https://loremflickr.com/900/900?lock=4666758142334750',
          active: true,
          category: {
            id: '3559389f-22f3-4e32-b94b-31a068f8a383',
            name: 'clothing',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Product by ID not found',
    content: {
      'aplication/json': {
        example: {
          message: 'User by ID not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  @ApiOperation({ summary: 'Get Product by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productsService.findOne(id);
  }

  @Put(':id')
  @ApiBody({
    description: 'Request body for updating a User',
    required: true,
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Example Name' },
        description: { type: 'string', example: 'Example Description' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Update Product successfully',
    content: {
      'aplication/json': {
        example: [
          {
            id: '98a00aa3-b9b2-4a06-9571-aa749ae7fe4d',
            price: 435,
            description: 'Example Description',
            type: 'digital',
            stock: 29,
            name: 'Example Name',
            categoryId: '3559389f-22f3-4e32-b94b-31a068f8a383',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Product not Found',
    content: {
      'aplication/json': {
        example: {
          message: 'User not Found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  @ApiOperation({ summary: 'Update Product by ID' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: Partial<InsertProduct>,
  ) {
    return await this.productsService.update(id, body);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Delete Product By ID successfully',
    content: {
      'aplication/json': {
        example: {
          message: 'Product deleted Successfuly',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    content: {
      'aplication/json': {
        example: {
          message: 'Product not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  @ApiOperation({ summary: 'Delete Product by ID' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productsService.remove(id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description:
            'El archivo de imagen que se desea subir (jpg, jpeg, png, webp)',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  @Patch('uploadImage/:uuid')
  async updateProductImage(
    @Param('uuid', ParseUUIDPipe) productId: string,
    file: Express.Multer.File,
  ) {
    return await this.productsService.updateProductImage(productId, file);
  }

  @Patch('removeImage/:uuid')
  async removeProductImage(
    @Param('uuid', ParseUUIDPipe) productId: string,
    @Body() body: RemoveOneImageDto,
  ) {
    return await this.productsService.removeProductImage(
      productId,
      body.publicId,
    );
  }
}
