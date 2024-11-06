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
  Query,
  HttpException,
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
import { paginationDto } from '../../schemas/pagination.dto';
import { PaginatedCategoriesDto } from './dto/paginated-categories.dto';

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
        example: {
          data: [
            {
              id: '277aeb13-d095-4dc5-b866-7babe401ecc7',
              name: 'survival horror',
            },
            {
              id: '3af6e551-48ba-47b2-9e05-addec431c9e6',
              name: 'racing',
            },
            {
              id: '4a194a05-f3d0-4bcb-9a4b-a1e0fea24d87',
              name: 'battle royale',
            },
            {
              id: '56c322e5-db58-49de-8891-bbcb14d9c3de',
              name: 'mmorpg',
            },
            {
              id: '593c4a3e-0568-409f-a0c4-abf0dab28697',
              name: 'controller',
            },
          ],
          nextCursor: '5bd367fc-1daa-41e8-8524-b20ae19de2c3',
        },
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
  async findAll(
    @Query('cursor') cursor: string,
    @Query('limit') limit: number,
  ): Promise<PaginatedCategoriesDto> {
    const validation = paginationDto.safeParse({ cursor, limit });

    if (validation.success === false) {
      throw new HttpException(validation.error, 400);
    }

    return await this.categoriesService.findAll(validation.data);
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
  async create(@Body() body: InsertCategory): Promise<InsertCategory> {
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
  ): Promise<InsertCategory> {
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
