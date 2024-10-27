import { Injectable } from '@nestjs/common';
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
    const { password, ...rest } = registerDto;
    const hashedPassword = await hash(password, 10);

    await db.insert(users).values([
      {
        ...rest,
        password: hashedPassword,
      },
    ]);

    const { email, name } = rest;

    await this.mailService.sendConfirmationMail({ email, name });
    await this.mailService.sendWelcomeMail({ email, name });

    return;
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
      columns: {
        id: true,
        name: true,
        email: true,
        image: true,
        password: true,
      },
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
