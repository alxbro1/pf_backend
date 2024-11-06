import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto, UserEntity } from '../../../db/schemas/schema';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll({ cursor, limit }: { cursor?: string; limit: number }) {
    return await this.usersRepository.findAllUsers({ cursor, limit });
  }

  async findOneBy(id: string): Promise<UserEntity> {
    return await this.usersRepository.findOneById(id);
  }

  async updateUser(id: string, body: Partial<CreateUserDto>) {
    return await this.usersRepository.updateUserById(id, body);
  }

  async removeUser(id: string) {
    return await this.usersRepository.removeUserById(id);
  }

  async uploadProfileImage(id: string, file: Express.Multer.File) {
    return await this.usersRepository.uploadProfileImage(id, file);
  }

  async removeProfileImage(userId: string, publicId: string) {
    return await this.usersRepository.removeProfileImage(userId, publicId);
  }

  async editPassword(id: string, oldPassword: string, newPassword: string) {
    return await this.usersRepository.editPassword(
      id,
      oldPassword,
      newPassword,
    );
  }
}
