import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';


@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Failed to connect to the database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}