import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DatabaseService) {}

  async createUser(chatId: number, username: string) {
    // const user = new this.userModel({ chatId, username });
    // return user.save();
  }

  async deleteUser(chatId: number) {
    // return this.dbService.user.findOneAndDelete({ chatId }).exec();
  }

  async getUsers() {
    // return this.dbService.user.find().exec();
  }

  async getUserByChatId(chatId: number) {
    // return this.dbService.user.findUnique({ where: { chatId } });
  }

  async create(createUserDto: Prisma.UserCreateInput) {
    return this.dbService.user.create({
      data: createUserDto,
    });
  }

  async findAll(role?: 'ADMIN' | 'USER') {
    if (role) {
      return this.dbService.user.findMany({
        where: {
          role,
        },
      });
    }

    return this.dbService.user.findMany();
  }

  async findOne(id: string) {
    return this.dbService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findOneByEmail(email: string) {
    return this.dbService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async update(id: string, updateUserDto: Prisma.UserUpdateInput) {
    return this.dbService.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  async restore(id: string) {
    return this.dbService.user.update({
      where: {
        id,
      },
      data: {
        deletedAt: null,
      },
    });
  }

  async softDelete(id: string) {
    return this.dbService.user.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async remove(id: string) {
    return this.dbService.user.delete({
      where: {
        id,
      },
    });
  }
}
