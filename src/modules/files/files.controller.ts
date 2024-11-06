import {
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
  Res,
  BadRequestException,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsService } from '../products/products.service';

@Controller('files')
@ApiTags('Files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly productsService: ProductsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all images' })
  @ApiResponse({
    status: 200,
    description: 'Retrieve all images successfully',
    content: {
      'application/json': {
        example: [
          {
            id: '3bd4dccb-5fdd-497a-9116-ec6d86211b74',
            productId: '00da55c9-7986-400b-871d-36240d8f30b8',
            publicId: 'nrmm2zkiof8rz6uzo1rp',
            secureUrl:
              'https://res.cloudinary.com/dnfslkgiv/image/upload/v1730837161/nrmm2zkiof8rz6uzo1rp.jpg',
          },
          {
            id: 'd8848356-ffea-4572-9f57-05dcccf76ded',
            productId: '00da55c9-7986-400b-871d-36240d8f30b8',
            publicId: 'lotjoordiw7agnpgdpez',
            secureUrl:
              'https://res.cloudinary.com/dnfslkgiv/image/upload/v1730837162/lotjoordiw7agnpgdpez.jpg',
          },
          {
            id: '9ea6d5e4-2613-4ec8-ad7f-26c2ba83adb6',
            productId: '00da55c9-7986-400b-871d-36240d8f30b8',
            publicId: 'b29gftybr1dkbvxajba4',
            secureUrl:
              'https://res.cloudinary.com/dnfslkgiv/image/upload/v1730837160/b29gftybr1dkbvxajba4.webp',
          },
          {
            id: '1c8f38de-ebe0-4c38-90ba-8bdb594ea9c6',
            productId: 'e6cfb148-b94e-455b-877d-657a685eee5e',
            publicId: 'hjvrez82t9u4nmndatw5',
            secureUrl:
              'https://res.cloudinary.com/dnfslkgiv/image/upload/v1730908863/hjvrez82t9u4nmndatw5.jpg',
          },
          {
            id: 'ebd3674b-c873-4a4d-bbde-b59eedd9baee',
            productId: 'e6cfb148-b94e-455b-877d-657a685eee5e',
            publicId: 'zlytutqzar2th6aemuob',
            secureUrl:
              'https://res.cloudinary.com/dnfslkgiv/image/upload/v1730908863/zlytutqzar2th6aemuob.jpg',
          },
          {
            id: '23765578-6e5f-43fc-af75-b851911c8965',
            productId: 'f8908f20-bd64-4e0c-a4a2-0c2d909d32b3',
            publicId: 'p54qdlmmj218kimapn82',
            secureUrl:
              'https://res.cloudinary.com/dnfslkgiv/image/upload/v1730909204/p54qdlmmj218kimapn82.jpg',
          },
          {
            id: '427f5fd4-7cd0-4fcd-b380-038846253e90',
            productId: 'f8908f20-bd64-4e0c-a4a2-0c2d909d32b3',
            publicId: 'gt9gx4ob2wqqnywecwgy',
            secureUrl:
              'https://res.cloudinary.com/dnfslkgiv/image/upload/v1730909413/gt9gx4ob2wqqnywecwgy.jpg',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Images not Found',
    content: {
      'application/json': {
        example: {
          message: 'Images not Found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  async findAllImages() {
    return this.filesService.getAllImages();
  }

  @Post('uploadMultipleImages/:productId')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({ summary: 'Upload multiple images for a product' })
  @ApiParam({
    name: 'productId',
    description: 'Product ID to associate with the uploaded images',
    type: String,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload files',
    type: 'object',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'List of files to upload',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Images uploaded successfully',
    content: {
      'application/json': {
        example: {
          message: 'Images uploaded successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'No files provided for upload',
    content: {
      'application/json': {
        example: {
          message: 'No files provided for upload.',
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Product not Found',
    content: {
      'application/json': {
        example: {
          message: 'Product not Found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  async createMultipleImages(
    @Param('productId', ParseUUIDPipe) productId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Res() res: Response,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided for upload.');
    }

    const productExists = await this.productsService.findOne(productId);
    if (!productExists) {
      throw new NotFoundException('Product not found');
    }

    const successfulUploads =
      await this.filesService.uploadMultipleImages(files);
    if (successfulUploads.length === 0) {
      return res
        .status(400)
        .json({ message: 'No images were uploaded successfully.' });
    }

    const savedImages = await this.filesService.saveImages(
      successfulUploads,
      productId,
    );

    return res
      .status(201)
      .json({ message: 'Images uploaded successfully', images: savedImages });
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get all images for a specific product' })
  @ApiParam({
    name: 'productId',
    description: 'Product ID to retrieve images',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Retrieve images for the specified product successfully',
    content: {
      'application/json': {
        example: [
          {
            id: '3bd4dccb-5fdd-497a-9116-ec6d86211b74',
            productId: '00da55c9-7986-400b-871d-36240d8f30b8',
            publicId: 'nrmm2zkiof8rz6uzo1rp',
            secureUrl:
              'https://res.cloudinary.com/dnfslkgiv/image/upload/v1730837161/nrmm2zkiof8rz6uzo1rp.jpg',
          },
          {
            id: 'd8848356-ffea-4572-9f57-05dcccf76ded',
            productId: '00da55c9-7986-400b-871d-36240d8f30b8',
            publicId: 'lotjoordiw7agnpgdpez',
            secureUrl:
              'https://res.cloudinary.com/dnfslkgiv/image/upload/v1730837162/lotjoordiw7agnpgdpez.jpg',
          },
          {
            id: '9ea6d5e4-2613-4ec8-ad7f-26c2ba83adb6',
            productId: '00da55c9-7986-400b-871d-36240d8f30b8',
            publicId: 'b29gftybr1dkbvxajba4',
            secureUrl:
              'https://res.cloudinary.com/dnfslkgiv/image/upload/v1730837160/b29gftybr1dkbvxajba4.webp',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No images found for this product',
    content: {
      'application/json': {
        example: {
          message: 'No images found for this product.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  async findAllImagesByProductId(
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    return this.filesService.findAllImagesByProductId(productId);
  }

  @Delete('gallery/:id')
  @ApiOperation({ summary: 'Delete image by ID' })
  @ApiParam({
    name: 'id',
    description: 'Image ID to delete',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Image deleted successfully',
    content: {
      'application/json': {
        example: { message: 'Image deleted successfully' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Image not found',
    content: {
      'application/json': {
        example: {
          message: 'Image not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  async deleteGalleryPhoto(@Param('id') publicId: string) {
    const result = await this.filesService.deleteGalleryImage(publicId);
    if (!result) throw new BadRequestException('Image is already deleted');

    return {
      message: 'Image deleted successfully',
    };
  }
}
