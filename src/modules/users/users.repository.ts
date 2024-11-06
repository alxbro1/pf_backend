import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateUserDto,
  selectUserSchema,
  UserEntity,
  users,
} from '../../../db/schemas/schema';
import { db } from '../../config/db';
import { eq, and, gte } from 'drizzle-orm';
import { FilesService } from '../files/files.service';
import { FindAllUsersDto } from './dto/findAll.dto';
import { z } from 'zod';
import { compare, hash } from 'bcrypt';

@Injectable()
export class UsersRepository {
  constructor(private readonly filesService: FilesService) {}

  async findAllUsers({
    cursor,
    limit,
  }: {
    cursor?: string;
    limit: number;
  }): Promise<FindAllUsersDto> {
    if (!cursor) cursor = '';
    const usersData = await db.query.users
      .findMany({
        limit: limit + 1,
        where: gte(users.id, cursor),
        orderBy: users.id,
      })
      .catch((err) => {
        throw new BadRequestException('Error fetching users');
      });

    let result = z.array(selectUserSchema).safeParse(usersData);
    const validatedData = result.success ? result.data : [];

    let nextCursor: string | null = null;

    if (validatedData.length === 0)
      return {
        data: [],
        nextCursor,
      };

    if (validatedData.length > limit) {
      nextCursor = validatedData.pop()!.id;
    }

    return { data: validatedData, nextCursor };
  }

  async findOneById(id: string): Promise<UserEntity> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    if (!user) throw new NotFoundException('User by ID not found');
    return user;
  }

  async updateUserById(
    id: string,
    body: Partial<CreateUserDto>,
  ): Promise<Partial<CreateUserDto>[]> {
    const updateUser = await db
      .update(users)
      .set(body)
      .where(eq(users.id, id))
      .returning({
        email: users.email,
        id: users.id,
        name: users.name,
        image: users.profileImage,
      });
    if (updateUser.length == 0) throw new NotFoundException('User Not Found');
    return updateUser;
  }

  async removeUserById(id: string): Promise<{ message: string }> {
    const rowCount = (
      await db
        .update(users)
        .set({ status: 'inactive' })
        .where(and(eq(users.id, id), eq(users.status, 'active')))
    ).rowCount;
    if (rowCount == 0) throw new NotFoundException('User Not Found');
    return { message: 'User deleted Successfuly' };
  }

  async uploadProfileImage(id: string, file: Express.Multer.File) {
    const resultFile = await this.filesService.uploadImage(file);

    const resultUser = await db
      .update(users)
      .set({ profileImage: resultFile.secure_url })
      .where(eq(users.id, id))
      .returning();

    if (resultUser.length === 0)
      throw new NotFoundException(`User with ${id} uuid not found.`);

    return resultFile;
  }

  async removeProfileImage(userId: string, publicId: string) {
    await this.filesService.removeSingleImage(publicId);

    const result = await db
      .update(users)
      .set({ profileImage: 'default_profile_picture.png' })
      .where(eq(users.id, userId))
      .returning();

    if (result.length === 0)
      throw new NotFoundException(`User with ${userId} didn't exist.`);

    return { message: 'User profile image modified successfuly.' };
  }

  async editPassword(id: string, oldPassword: string, newPassword: string) {
    const userFound = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!userFound)
      throw new NotFoundException(`User with ${id} uuid not found.`);

    const valid = await compare(oldPassword, userFound.password!);

    if (valid === false)
      throw new BadRequestException(
        `Old password isn't equal to actual password.`,
      );

    const hashedPassword = await hash(newPassword, 10);

    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, id))
      .returning();

    return { message: 'User password updated.' };
  }
}
