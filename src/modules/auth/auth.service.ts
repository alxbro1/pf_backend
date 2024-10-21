import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { hash } from 'bcrypt';
import { compare } from 'bcrypt';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SelectUserDto, users } from '../../../db/schemas/schema';
import { db } from '../../config/db';

@Injectable()
export class AuthService {
  async register(registerDto: RegisterDto) {
    const { password, ...rest } = registerDto;
    const hashedPassword = await hash(password, 15);

    return db.insert(users).values([
      {
        ...rest,
        password: hashedPassword,
      },
    ]);
  }

  async login(loginDto: LoginDto): Promise<SelectUserDto> {
    // const selectedUsers = await db
    //   .select()
    //   .from(users)
    //   .where(
    //     and(
    //       eq(users.email, loginDto.email),
    //       eq(users.password, loginDto.password),
    //     ),
    //   )
    //   .limit(1);

    // if (selectedUsers.length === 0) {
    //   throw new Error('User not exists');
    // }

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

    // if (userFound.password === null) {
    //   // Manejar en caso de que se use una autentication de terceros que no use contrasena.
    // } else {
    const valid = await compare(loginDto.password, userFound.password!);

    if (valid === false) {
      throw new Error('Invalid user');
    }

    const { password, ...userRest } = userFound;

    return userRest;
    // }
  }
}
