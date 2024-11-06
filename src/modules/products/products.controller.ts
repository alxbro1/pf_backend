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
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UploadedFiles,
  NotFoundException,
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
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { RemoveOneImageDto } from './dto/remove.dto';
import { typeEnum } from './dto/type.enum';
import { getProductsSchema } from './dto/get-products.dto';
import { FilesService } from '../files/files.service';
import type { PaginatedProductsDto } from './dto/paginated-products.dto';
import { uuid } from 'drizzle-orm/pg-core';
import { CategoriesService } from '../categories/categories.service';

@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly filesService: FilesService,
    private readonly categoryService: CategoriesService,
  ) {}

  @Post('create')
  @UseInterceptors(FilesInterceptor('images', 10))
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
            id: 'db82d49f-d025-46bb-bdaf-efbc51f49e90',
            price: 1999,
            description: 'Prueba descripcion',
            type: 'digital',
            stock: 25,
            name: 'Prueba producto',
            categoryId: '4a194a05-f3d0-4bcb-9a4b-a1e0fea24d87',
            imageUrl: 'imagen prueba',
            active: 'active',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
    content: {
      'application/json': {
        example: {
          message:
            "Category with uuid 4a194a05-f3d0-4bcb-9a4b-a1e0fea23d87 didn't exist.",
          error: 'Not Found',
          statusCode: 404,
        },
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
  async create(
    @Body() body: InsertProduct,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const parsedBody = {
      ...body,
      price: Number(body.price),
      stock: Number(body.stock),
      categoryId: String(body.categoryId),
    };
    const categoryExists = await this.categoryService.findOne(
      parsedBody.categoryId,
    );
    if (!categoryExists) {
      throw new NotFoundException('Category not found');
    }

    if (isNaN(parsedBody.price) || isNaN(parsedBody.stock)) {
      throw new BadRequestException(
        'El precio y el stock deben ser números válidos.',
      );
    }

    const validation = productInsertSchema.safeParse(parsedBody);
    if (!validation.success) {
      throw new BadRequestException(validation.error.issues);
    }

    let imageResults: { public_id: string; secure_url: string }[] = [];

    try {
      if (files && files.length > 0) {
        imageResults = await this.filesService.uploadMultipleImages(files);
      }
    } catch (error: any) {
      throw new BadRequestException(
        `Error subiendo las imágenes: ${error.message}`,
      );
    }

    const productData = {
      ...validation.data,
    };

    const product = await this.productsService.createProduct(productData);

    try {
      if (imageResults.length > 0) {
        if (product.id) {
          await this.filesService.saveImages(imageResults, product.id);
        } else {
          throw new Error(
            'El producto no se ha creado correctamente y no tiene un ID.',
          );
        }
      }
    } catch (error) {
      throw new BadRequestException(
        'Error guardando las imágenes en el producto.',
      );
    }

    return product;
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get All Paginated Products successfully',
    content: {
      'aplication/json': {
        example: {
          data: [
            {
              id: '91e01092-6fbb-4310-9049-11429d488f94',
              price: 199,
              description:
                'Experience the pinnacle of gaming keyboards with dynamic RGB backlighting and Cherry MX Speed switches.',
              type: 'physical',
              stock: 15,
              name: 'Corsair K95 RGB Platinum XT Mechanical Gaming keyboard',
              imageUrl:
                'https://m.media-amazon.com/images/I/81bU6SBfbIL._SL1500_.jpg',
              active: 'active',
              category: {
                id: 'b7b03dba-f1a3-4b52-a3c2-40d118afced0',
                name: 'keyboard',
              },
            },
            {
              id: 'ae1b3ced-a72f-46b0-b45a-a73935e471d0',
              price: 55,
              description:
                'Race through beautiful, diverse landscapes in Mexico in the latest entry of the popular open-world racing series.',
              type: 'digital',
              stock: 10,
              name: 'Forza Horizon 5',
              imageUrl:
                'https://m.media-amazon.com/images/I/81alOjHfU6L._SL1500_.jpg',
              active: 'active',
              category: {
                id: '3af6e551-48ba-47b2-9e05-addec431c9e6',
                name: 'racing',
              },
            },
          ],
          nextCursor: null,
        },
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
  @ApiOperation({ summary: 'Get All Paginated Products' })
  async findAll(
    @Query('cursor') cursor: string,
    @Query('limit') limit: number,
    @Query('type') typeProduct: typeEnum,
    @Query('search') search: string,
  ): Promise<PaginatedProductsDto> {
    const validation = getProductsSchema.safeParse({
      cursor,
      limit,
      typeProduct,
      search,
    });

    if (validation.success === false) {
      throw new BadRequestException(validation.error.issues);
    }

    return this.productsService.findAll(validation.data);
  }

  @Get('dashboardTable')
  @ApiResponse({
    status: 200,
    description: 'Get All Paginated Products successfully',
    content: {
      'aplication/json': {
        example: {
          data: [
            {
              name: 'Sekiro: Shadows Die Twice',
              price: 45,
              stock: 5,
              id: '50dff90c-ff83-4478-8e8b-c23a13a9b969',
              active: 'active',
              type: 'digital',
              imageUrl:
                'https://m.media-amazon.com/images/I/81QGePML9XL._SL1500_.jpg',
            },
            {
              name: 'Warframe',
              price: 14,
              stock: 10,
              id: '5971003d-4ad3-45d3-8da7-8c5eee2cba68',
              active: 'active',
              type: 'digital',
              imageUrl:
                'https://www.zonammorpg.com/wp-content/uploads/2023/11/warframe-300x300.png',
            },
          ],
          cursor: '5971003d-4ad3-45d3-8da7-8c5eee2cba68',
        },
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
  @ApiOperation({ summary: 'Get All Dashboard Products' })
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
        example: {
          data: [
            {
              id: 'f8908f20-bd64-4e0c-a4a2-0c2d909d32b3',
              price: 19,
              description:
                'Black Myth: Wukong is an action RPG inspired by Chinese mythology. Embark on a perilous journey filled with dangers and wonders to uncover the hidden truth behind a glorious past legend.',
              type: 'digital',
              stock: 10,
              name: 'Black Myth: Wukong',
              imageUrl:
                'https://sm.ign.com/t/ign_ap/cover/b/black-myth/black-myth-wukong_fmws.300.jpg',
              active: 'active',
              category: {
                id: '8e451330-04fd-4b28-aa3f-b32409e4bcc3',
                name: 'action rpg',
              },
            },
            {
              id: '50dff90c-ff83-4478-8e8b-c23a13a9b969',
              price: 45,
              description:
                'A brutally challenging action-adventure game where you play as a ninja seeking revenge in a dangerous, feudal Japan.',
              type: 'digital',
              stock: 5,
              name: 'Sekiro: Shadows Die Twice',
              imageUrl:
                'https://m.media-amazon.com/images/I/81QGePML9XL._SL1500_.jpg',
              active: 'active',
              category: {
                id: '8e451330-04fd-4b28-aa3f-b32409e4bcc3',
                name: 'action rpg',
              },
            },
            {
              id: 'a939bc20-20eb-4bb2-a69b-c5eb72ba13b9',
              price: 30,
              description:
                'Become Geralt of Rivia, a monster hunter, as you explore a vast world filled with quests, monsters, and moral dilemmas.',
              type: 'digital',
              stock: 6,
              name: 'The Witcher 3: Wild Hunt',
              imageUrl:
                'https://m.media-amazon.com/images/I/71OIbEceZQL._SL1500_.jpg',
              active: 'active',
              category: {
                id: '8e451330-04fd-4b28-aa3f-b32409e4bcc3',
                name: 'action rpg',
              },
            },
            {
              id: '994071f3-039e-48e7-964a-88bdff0380e4',
              price: 45,
              description:
                'Lead a Viking invasion of England, raiding villages, building settlements, and engaging in epic battles in this open-world RPG.',
              type: 'digital',
              stock: 7,
              name: "Assassin's Creed Valhalla",
              imageUrl:
                'https://m.media-amazon.com/images/I/81OvbSYBoFL._SL1500_.jpg',
              active: 'active',
              category: {
                id: '8e451330-04fd-4b28-aa3f-b32409e4bcc3',
                name: 'action rpg',
              },
            },
            {
              id: '8329aff1-f04b-466a-8583-b368c5992512',
              price: 40,
              description:
                'Return to the hellish world of Sanctuary in this remaster of the classic action RPG, filled with monsters and loot.',
              type: 'digital',
              stock: 6,
              name: 'Diablo II: Resurrected',
              imageUrl:
                'https://m.media-amazon.com/images/I/81sHZml-v1L._SL1500_.jpg',
              active: 'active',
              category: {
                id: '8e451330-04fd-4b28-aa3f-b32409e4bcc3',
                name: 'action rpg',
              },
            },
            {
              id: '91a2dbc6-20eb-425d-8755-961614c7f2e5',
              price: 35,
              description:
                'Hunt colossal monsters in a vast open world full of adventure. Challenge massive creatures and gather resources to upgrade your gear.',
              type: 'digital',
              stock: 475,
              name: 'Monster Hunter: World',
              imageUrl:
                'https://m.media-amazon.com/images/I/81dMKVm7+pL._SL1500_.jpg',
              active: 'active',
              category: {
                id: '8e451330-04fd-4b28-aa3f-b32409e4bcc3',
                name: 'action rpg',
              },
            },
          ],
          nextCursor: '91a2dbc6-20eb-425d-8755-961614c7f2e5',
        },
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
  @ApiResponse({
    status: 400,
    description: 'Validation failed',
    content: {
      'aplication/json': {
        example: {
          message: 'Validation failed (uuid is expected)',
          error: 'Bad Request',
          statusCode: 400,
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
          id: 'f927067f-4127-4756-bba8-8891b2d0cc1a',
          price: 179,
          description:
            'Stream and record in stunning 1080p60 HDR10 quality with ultra-low latency for smooth gameplay capture.',
          type: 'physical',
          stock: 18,
          name: 'Elgato Game Capture HD60 S+',
          categoryId: '74d95d0a-5faa-4e8b-a1bb-1809ffa88397',
          imageUrl:
            'https://m.media-amazon.com/images/I/51zXNTH7uKL._SL1000_.jpg',
          active: 'active',
          category: {
            id: '74d95d0a-5faa-4e8b-a1bb-1809ffa88397',
            name: 'capture card',
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
  @ApiResponse({
    status: 400,
    description: 'Validation failed',
    content: {
      'aplication/json': {
        example: {
          message: 'Validation failed (uuid is expected)',
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed',
    content: {
      'aplication/json': {
        example: {
          message: 'Validation failed (uuid is expected)',
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    },
  })
  @ApiOperation({ summary: 'Get Product by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productsService.findOne(id);
  }

  @Patch(':id')
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
            id: 'f8908f20-bd64-4e0c-a4a2-0c2d909d32b3',
            price: 19,
            description: 'Example Description',
            type: 'digital',
            stock: 10,
            name: 'Example Name',
            categoryId: '8e451330-04fd-4b28-aa3f-b32409e4bcc3',
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
          message: 'Product ID Not Found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed',
    content: {
      'aplication/json': {
        example: {
          message: 'Validation failed (uuid is expected)',
          error: 'Bad Request',
          statusCode: 400,
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
  @ApiResponse({
    status: 200,
    description: 'Image uploaded successfully',
    content: {
      'aplication/json': {
        example: {
          message: 'Image uploaded Successfuly',
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
          message:
            'Product with a8672166-4a1b-45c8-a8fa-567183aa9a95 uuid not found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'The image must be less than 1mb.',
    content: {
      'aplication/json': {
        example: {
          message: 'The image must be less than 1mb.',
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  @Patch('uploadImage/:uuid')
  @ApiOperation({ summary: 'Upload Product Image' })
  async updateProductImage(
    @Param('uuid', ParseUUIDPipe) productId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 200000, // 200000 bytes = 200kb
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)$/,
          }),
        ],
      }),
    )
    image: Express.Multer.File,
  ) {
    console.log({ image, productId });
    return await this.productsService.updateProductImage(productId, image);
  }

  @Patch('removeImage/:uuid')
  @ApiResponse({
    status: 200,
    description: 'Product image modified successfuly.',
    content: {
      'aplication/json': {
        example: {
          message: 'Product image modified successfuly.',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Product not Found',
    content: {
      'aplication/json': {
        example: {
          message: 'Product not Found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Image is already removed',
    content: {
      'aplication/json': {
        example: {
          message: 'Image is already removed',
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    },
  })
  @ApiBody({
    description: 'Request body for deleting image',
    required: true,
    schema: {
      type: 'object',
      properties: {
        publicId: {
          type: 'string',
          example: 'pk3ghbuuvspa1wro9y7k',
        },
      },
    },
  })
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
