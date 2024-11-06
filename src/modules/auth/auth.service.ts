import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { hash } from 'bcrypt';
import { compare } from 'bcrypt';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SelectUserDto, users } from '../../../db/schemas/schema';
import { db } from '../../config/db';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(private readonly mailService: MailService) {}

  async register(registerDto: RegisterDto) {
    const { password, email, name, ...rest } = registerDto;

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .execute();


    if (existingUser.length > 0) {
      throw new NotFoundException('Email already exist');
    }

    const hashedPassword = await hash(password, 10);

    await db.insert(users).values([
      {
        ...rest,
        email,
        password: hashedPassword,
      },
    ]);


    await this.mailService.sendConfirmationMail({ email, name });
    await this.mailService.sendWelcomeMail({ email, name });

    return { message: 'User registration was successful' };
  }
  async login(loginDto: LoginDto): Promise<SelectUserDto> {
    // const selectedUsers = await db
    //   .select()
    //   .from(users)
    //   .where(eq(users.email, loginDto.email))
    //   .limit(1);

    // if (selectedUsers.length === 0) {
    //   throw new Error('User not exists');
    // }

    // const userFound = selectedUsers[0];

    // return selectedUsers[0];

    const userFound = await db.query.users.findFirst({
      where: eq(users.email, loginDto.email),
    });

    if (userFound === undefined) {
      throw new Error('User not exists');
    }

    const valid = await compare(loginDto.password, userFound.password!);

    if (valid === false) {
      throw new Error('Invalid user');
    }

    const { password, ...userRest } = userFound;

    return userRest;
  }
}
