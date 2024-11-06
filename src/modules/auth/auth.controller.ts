import { Controller, Post, Body, HttpCode } from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiBody({
    description: 'Request body for user registration',
    required: true,
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'newuser@example.com' },
        password: { type: 'string', example: 'password123' },
        username: { type: 'string', example: 'newuser' },
        name: { type: 'string', example: 'Pablo Battola' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Registration successful',
    content: {
      'application/json': {
        example: {
          message: 'User register was successfull',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    content: {
      'application/json': {
        example: {
          message: 'Email or password format is invalid',
          statusCode: 400,
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    content: {
      'application/json': {
        example: {
          message: 'Internal Server Error',
          statusCode: 500,
        },
      },
    },
  })
  @ApiOperation({ summary: 'REGISTER' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('/login')
  @ApiBody({
    description: 'Request body for login',
    required: true,
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    content: {
      'application/json': {
        example: {
          id: '6b13c443-f474-4379-ad7f-aa56e03e10d2',
          name: 'Pablo Battola',
          email: 'newuser@example.com',
          emailVerified: null,
          tokenConfirmation:
            '08dc06feb910aaaed3ba8965de2f09399bd0f5e03290144eb905d5473727',
          username: 'newuser',
          description: null,
          profileImage: 'default_profile_picture.png',
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
    status: 401,
    description: 'Invalid credentials',
    content: {
      'application/json': {
        example: {
          message: 'Invalid email or password',
          statusCode: 401,
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    content: {
      'application/json': {
        example: {
          message: 'Internal Server Error',
          statusCode: 500,
        },
      },
    },
  })
  @ApiOperation({ summary: 'LOGIN' })
  @HttpCode(200)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
