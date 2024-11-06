import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
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
        example: {
          data: [
            {
              id: '103d0472-b4ac-4502-beb8-f035cb95103b',
              name: 'Agnes Cartwright',
              email: 'Tania_Sanford11@hotmail.com',
              emailVerified: null,
              tokenConfirmation: null,
              username: 'Alena_Harris',
              description: null,
              profileImage: 'https://avatars.githubusercontent.com/u/98174912',
              bannerImage:
                'https://res.cloudinary.com/dnfslkgiv/image/upload/v1730401954/pk3ghbuuvspa1wro9y7k.jpg',
              status: 'active',
              role: 'client',
              bannedReason: null,
            },
            {
              id: '26d4808d-59f0-4e1f-aab4-57dff38832ac',
              name: 'Tamara Kuvalis V',
              email: 'Cassidy89@gmail.com',
              emailVerified: null,
              tokenConfirmation: null,
              username: 'Lily_Ward16',
              description: null,
              profileImage: 'https://avatars.githubusercontent.com/u/28631406',
              bannerImage:
                'https://res.cloudinary.com/dnfslkgiv/image/upload/v1730401954/pk3ghbuuvspa1wro9y7k.jpg',
              status: 'active',
              role: 'client',
              bannedReason: null,
            },
            {
              id: '2b93a00f-f306-479b-b8e5-793ce79af2c8',
              name: 'Kevin Renner V',
              email: 'Dino8@yahoo.com',
              emailVerified: null,
              tokenConfirmation: '1',
              username: 'Ethelyn_Kulas5',
              description: null,
              profileImage: 'https://avatars.githubusercontent.com/u/82591944',
              bannerImage:
                'https://res.cloudinary.com/dnfslkgiv/image/upload/v1730401954/pk3ghbuuvspa1wro9y7k.jpg',
              status: 'active',
              role: 'client',
              bannedReason: null,
            },
            {
              id: '30a4e23a-e364-4212-b67b-b79662d38e87',
              name: 'Ms. Janis Kreiger',
              email: 'Tremaine.Kilback81@hotmail.com',
              emailVerified: null,
              tokenConfirmation: null,
              username: 'Lindsey.Mohr',
              description: null,
              profileImage: 'https://avatars.githubusercontent.com/u/83944725',
              bannerImage:
                'https://res.cloudinary.com/dnfslkgiv/image/upload/v1730401954/pk3ghbuuvspa1wro9y7k.jpg',
              status: 'active',
              role: 'client',
              bannedReason: null,
            },
            {
              id: '36d6aa2f-7cba-4573-9fce-048f0249b6af',
              name: 'Jeanne Rau',
              email: 'Ida_Pfannerstill@gmail.com',
              emailVerified: null,
              tokenConfirmation: null,
              username: 'Noelia_Hirthe85',
              description: null,
              profileImage: 'https://avatars.githubusercontent.com/u/82785249',
              bannerImage:
                'https://res.cloudinary.com/dnfslkgiv/image/upload/v1730401954/pk3ghbuuvspa1wro9y7k.jpg',
              status: 'active',
              role: 'client',
              bannedReason: null,
            },
          ],
          nextCursor: '3c296fe9-8bf4-4449-8f9f-021c89578f69',
        },
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

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get User By ID successfully',
    content: {
      'aplication/json': {
        example: {
          id: '103d0472-b4ac-4502-beb8-f035cb95103b',
          name: 'Agnes Cartwright',
          email: 'Tania_Sanford11@hotmail.com',
          emailVerified: true,
          tokenConfirmation:
            'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..F3pBOAive4TNz6zp.cNe0145bpACdLJqj7tLKbUmTU5IW3oh1O-RB6B134O0uKfsENTbtvpAgH9SdkHAX4PT',
          password: 'E8ib8K0x_qmDpxx',
          username: 'Alena_Harris',
          description: null,
          profileImage: 'https://avatars.githubusercontent.com/u/98174912',
          bannerImage:
            'https://res.cloudinary.com/dnfslkgiv/image/upload/v1730401954/pk3ghbuuvspa1wro9y7k.jpg',
          status: 'active',
          role: 'client',
          bannedReason: null,
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

  @Patch(':id')
  @ApiBody({
    description: 'Request body for updating a User',
    required: true,
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Battola Pablo' },
        username: { type: 'string', example: 'Battola123' },
        description: { type: 'string', example: 'Executive Director' },
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
            email: 'Tania_Sanford11@hotmail.com',
            id: '103d0472-b4ac-4502-beb8-f035cb95103b',
            name: 'Battola Pablo',
            image: 'https://avatars.githubusercontent.com/u/98174912',
            username: 'Battola',
            description: null,
            status: 'active',
            role: 'client',
            profileImage: 'https://avatars.githubusercontent.com/u/98174912',
            bannerImage:
              'https://res.cloudinary.com/dnfslkgiv/image/upload/v1730401954/pk3ghbuuvspa1wro9y7k.jpg',
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
  @ApiResponse({
    status: 200,
    description: 'User Deleted successfully',
    content: {
      'aplication/json': {
        example: {
          message: 'Image upload Succesfuly',
        },
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
  @ApiResponse({
    status: 200,
    description: 'User profile image modified successfuly.',
    content: {
      'aplication/json': {
        example: {
          message: 'User profile image modified successfuly.',
        },
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
  @ApiResponse({
    status: 400,
    description: 'Image not Found or ID not provided',
    content: {
      'aplication/json': {
        example: {
          message: 'Image not Found or ID not provided',
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
          example:
            'pk3ghbuuvspa1wro9y7k',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Delete user profile image' })
  async removeProfileImage(
    @Param('uuid', ParseUUIDPipe) id: string,
    @Body() body: RemoveUserProfileDto,
  ) {
    return await this.usersService.removeProfileImage(id, body.publicId);
  }
}
