import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  ParseUUIDPipe,
  Put,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiInternalServerErrorResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { LimitPipe } from '../products/pipes/limitPage.pipe';
import { CreateUserDto } from '../../../db/schemas/schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { RemoveUserProfileDto } from './dto/remove.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get All Paginated Users successfully',
    content: {
      'aplication/json': {
        example: [
          {
            id: 'a132aee0-ceba-42d8-8154-6739b44293b3',
            name: 'Salvatore Ward',
            email: 'Tremayne87@gmail.com',
            emailVerified: null,
            password: null,
            image: 'https://avatars.githubusercontent.com/u/43817641',
            active: true,
          },
          {
            id: '94113ad8-4a8e-468a-8f7c-df7f02e3ec37',
            name: 'Francis Ullrich',
            email: 'Orlando49@gmail.com',
            emailVerified: null,
            password: null,
            image: 'https://avatars.githubusercontent.com/u/37748039',
            active: true,
          },
          {
            id: 'deba1532-bafe-4c67-aafb-9650977458e4',
            name: 'Irvin Hartmann',
            email: 'Brooke95@yahoo.com',
            emailVerified: null,
            password: null,
            image: 'https://avatars.githubusercontent.com/u/1769050',
            active: true,
          },
          {
            id: 'f09ea382-ff1c-47d8-b61c-9f604484282d',
            name: 'Sam Vandervort',
            email: 'Erika_Wisozk72@yahoo.com',
            emailVerified: null,
            password: null,
            image: 'https://avatars.githubusercontent.com/u/73052762',
            active: true,
          },
          {
            id: '7a78a581-4b6f-48e4-b70e-36d45ab4b857',
            name: 'Shelia Armstrong',
            email: 'Jarrod.Strosin@hotmail.com',
            emailVerified: null,
            password: null,
            image: 'https://avatars.githubusercontent.com/u/48341592',
            active: true,
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Users not found',
    content: {
      'aplication/json': {
        example: {
          message: 'Users not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Error fetching Users',
    content: {
      'aplication/json': {
        example: {
          message: 'Internal Server Error',
          error: 'Error fetching Users',
          statusCode: 500,
        },
      },
    },
  })
  @ApiOperation({ summary: 'Get All Paginated Users (page/limit)' })
  async findAll(
    @Query('cursor') cursor: string,
    @Query('limit', LimitPipe) limit: number,
  ) {
    return await this.usersService.findAll({ cursor, limit });
  }

  @Get('wishlist/:id')
  async getWishlistByUserId() {}

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get User By ID successfully',
    content: {
      'aplication/json': {
        example: {
          id: 'd3fc4271-cd60-4bae-8da2-fddc5ef532ab',
          name: 'Sam Rippin',
          email: 'Marietta71@hotmail.com',
          emailVerified: null,
          password: null,
          image: 'https://avatars.githubusercontent.com/u/28839465',
          active: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User by ID not found',
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
  @ApiOperation({ summary: 'Get User By ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.findOneBy(id);
  }

  @Put(':id')
  @ApiBody({
    description: 'Request body for updating a User',
    required: true,
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Battola Pablo' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Update User successfully',
    content: {
      'aplication/json': {
        example: [
          {
            email: 'Erika_Wisozk72@yahoo.com',
            id: 'f09ea382-ff1c-47d8-b61c-9f604484282d',
            name: 'Battola Pablo',
            image: 'https://avatars.githubusercontent.com/u/73052762',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not Found',
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
  @ApiOperation({ summary: 'Update User By ID' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: Partial<CreateUserDto>,
  ) {
    return await this.usersService.updateUser(id, body);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'User Deleted successfully',
    content: {
      'aplication/json': {
        example: { message: 'User deleted Successfuly' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not Found',
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
  @ApiOperation({ summary: 'Delete User By ID' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.removeUser(id);
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
  @ApiOperation({ summary: 'Update user profile image' })
  @Patch('uploadImage/:uuid')
  @UseInterceptors(FileInterceptor('image'))
  async uploadProfileImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 100000,
            message: 'The image must be less than 1mb.',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('uuid', ParseUUIDPipe) id: string,
  ) {
    return await this.usersService.uploadProfileImage(id, file);
  }

  @Patch('removeImage/:uuid')
  async removeProfileImage(
    @Param('uuid', ParseUUIDPipe) id: string,
    @Body() body: RemoveUserProfileDto,
  ) {
    return await this.usersService.removeProfileImage(id, body.publicId);
  }
}
