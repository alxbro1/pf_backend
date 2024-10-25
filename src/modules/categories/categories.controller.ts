import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
  InsertCategory,
  insertCategorySchema,
} from '../../../db/schemas/schema';
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('categories')
@ApiTags('Categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get All Categories successfully',
    content: {
      'aplication/json': {
        example: [
          {
            id: 'b2498ca4-fae1-4091-93c5-db39007fef35',
            name: 'baby',
            products: [
              {
                id: 'f56c2000-c541-4f08-ba94-e18f83af17f4',
                price: 956,
                description: 'Dicta ab aestas.',
                type: 'PHISICAL',
                stock: 51,
                name: 'unfinished hierarchy',
                categoryId: 'b2498ca4-fae1-4091-93c5-db39007fef35',
                imageUrl:
                  'https://loremflickr.com/900/900?lock=8733586377715857',
                active: true,
              },
              {
                id: '0df1ae09-6b2a-4bb8-9c96-458b4f1bd45e',
                price: 983,
                description: 'Deorsum aegre sono subito.',
                type: 'PHISICAL',
                stock: 24,
                name: 'worst decryption',
                categoryId: 'b2498ca4-fae1-4091-93c5-db39007fef35',
                imageUrl:
                  'https://loremflickr.com/900/900?lock=6660772209393861',
                active: true,
              },
              {
                id: 'e77122d7-2998-4534-a0ba-6af93a2dbb72',
                price: 904,
                description:
                  'Repellendus vehemens defaeco accommodo somniculosus conventus recusandae.',
                type: 'digital',
                stock: 54,
                name: 'avaricious luck',
                categoryId: 'b2498ca4-fae1-4091-93c5-db39007fef35',
                imageUrl:
                  'https://loremflickr.com/900/900?lock=169568707334508',
                active: true,
              },
            ],
          },
          {
            id: '21a270d5-d0a0-4051-8a3e-a0df75f871c0',
            name: 'shoes',
            products: [
              {
                id: 'df7062aa-e9bc-49dd-8d29-07244244fad3',
                price: 158,
                description:
                  'Exercitationem pecus coniuratio tabgo voluptatum tersus.',
                type: 'PHISICAL',
                stock: 65,
                name: 'oily handle',
                categoryId: '21a270d5-d0a0-4051-8a3e-a0df75f871c0',
                imageUrl:
                  'https://loremflickr.com/900/900?lock=8688651007005508',
                active: true,
              },
              {
                id: '9cf0e360-7cc8-4529-913f-bca60f79c85f',
                price: 519,
                description:
                  'Ventosus adversus dolor appono demulceo crepusculum currus defero.',
                type: 'digital',
                stock: 49,
                name: 'mad pleasure',
                categoryId: '21a270d5-d0a0-4051-8a3e-a0df75f871c0',
                imageUrl:
                  'https://loremflickr.com/900/900?lock=1807641517456240',
                active: true,
              },
              {
                id: '08dcb356-041e-4d02-9810-3b645bb8bd07',
                price: 588,
                description:
                  'Tabesco allatus votum concedo cresco terreo vesco amplitudo eligendi.',
                type: 'digital',
                stock: 57,
                name: 'difficult arcade',
                categoryId: '21a270d5-d0a0-4051-8a3e-a0df75f871c0',
                imageUrl:
                  'https://loremflickr.com/900/900?lock=1368951004200504',
                active: true,
              },
              {
                id: 'ef2298f0-378e-419a-b1e6-c0fcb751debe',
                price: 10,
                description:
                  'Aequitas candidus avarus veritatis arcesso uter usus textor.',
                type: 'digital',
                stock: 31,
                name: 'excited alb',
                categoryId: '21a270d5-d0a0-4051-8a3e-a0df75f871c0',
                imageUrl:
                  'https://loremflickr.com/900/900?lock=7193111634341298',
                active: true,
              },
              {
                id: '8a51b600-c841-4ff1-bb67-fc961aa1ee4b',
                price: 732,
                description: 'Anser carpo condico.',
                type: 'PHISICAL',
                stock: 89,
                name: 'medium strategy',
                categoryId: '21a270d5-d0a0-4051-8a3e-a0df75f871c0',
                imageUrl:
                  'https://loremflickr.com/900/900?lock=7441407100760783',
                active: true,
              },
              {
                id: 'a8e26180-bdb1-490a-84c8-ac458827f58e',
                price: 25,
                description:
                  'Quas curiositas apostolus baiulus claudeo atqui comparo.',
                type: 'digital',
                stock: 48,
                name: 'brilliant illusion',
                categoryId: '21a270d5-d0a0-4051-8a3e-a0df75f871c0',
                imageUrl:
                  'https://loremflickr.com/900/900?lock=3856100615489031',
                active: true,
              },
              {
                id: '36640ec2-beeb-418d-a4c5-2798b2a6ea3a',
                price: 757,
                description: 'Bibo desolo non video theca colligo.',
                type: 'PHISICAL',
                stock: 84,
                name: 'mammoth stitcher',
                categoryId: '21a270d5-d0a0-4051-8a3e-a0df75f871c0',
                imageUrl:
                  'https://loremflickr.com/900/900?lock=1342520399730387',
                active: true,
              },
            ],
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Categories not found',
    content: {
      'aplication/json': {
        example: {
          message: 'Categories not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Error fetching Categories',
    content: {
      'aplication/json': {
        example: {
          message: 'Internal Server Error',
          error: 'Error fetching Categories',
          statusCode: 500,
        },
      },
    },
  })
  @ApiOperation({ summary: 'Get All Categories' })
  async findAll(): Promise<InsertCategory[]> {
    return await this.categoriesService.findAll();
  }

  @Get(':uuid')
  @ApiResponse({
    status: 200,
    description: 'Get Category By ID successfully',
    content: {
      'aplication/json': {
        example: {
          id: 'c93ddfc9-e97c-45d9-ad5d-118da7683651',
          name: 'computers',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
    content: {
      'aplication/json': {
        example: {
          message: 'Category not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  @ApiOperation({ summary: 'Get Category by ID' })
  async findOne(
    @Param('uuid', ParseUUIDPipe) id: string,
  ): Promise<InsertCategory> {
    return await this.categoriesService.findOne(id);
  }

  @Post()
  @ApiBody({
    description: 'Request body for creating a Category',
    required: true,
    examples: {
      example1: {
        summary: 'Create Category example',
        value: {
          name: 'Mechanical Keyboard',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    content: {
      'aplication/json': {
        example: [
          {
            id: '7ca3cc21-e68e-4bac-afa9-1dd11de07f3d',
            name: 'Mechanical Keyboard',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error Creating Category',
    content: {
      'aplication/json': {
        example: {
          message: 'Error Creating Category',
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    },
  })
  @ApiOperation({ summary: 'Create Category' })
  async create(@Body() body: InsertCategory): Promise<InsertCategory[]> {
    const validation = insertCategorySchema.safeParse(body);
    if (!validation.success)
      throw new BadRequestException(validation.error.issues);
    return await this.categoriesService.create(body);
  }

  @Put(':uuid')
  @ApiBody({
    description: 'Request body for updating a product',
    required: true,
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Electronics' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Update Category successfully',
    content: {
      'aplication/json': {
        example: [
          {
            id: 'cdfdc4c7-8c02-4a49-8fe1-a0e2e32b68e0',
            name: 'Electronics',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Category not Found',
    content: {
      'aplication/json': {
        example: {
          message: 'Category not Found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  @ApiOperation({ summary: 'Update Category' })
  @Patch(':uuid')
  async update(
    @Param('uuid', ParseUUIDPipe) id: string,
    @Body() body: Partial<InsertCategory>,
  ): Promise<InsertCategory[]> {
    return await this.categoriesService.update(id, body);
  }

  @Delete(':uuid')
  @ApiResponse({
    status: 200,
    description: 'Category Deleted successfully',
    content: {
      'aplication/json': {
        example: { message: 'Category deleted Successfuly.' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Category not Found',
    content: {
      'aplication/json': {
        example: {
          message: 'Category not Found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error Deleting',
    content: {
      'aplication/json': {
        example: {
          message:
            'Category is already exists in products relations, cannot be deleted',
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    },
  })
  @ApiOperation({ summary: 'Delete Category' })
  async remove(
    @Param('uuid', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    return await this.categoriesService.remove(id);
  }
}
