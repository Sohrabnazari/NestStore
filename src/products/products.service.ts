import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ProductsService {
  constructor(private readonly dbService: DatabaseService) {}

  async create(createProductDTO: Prisma.ProductCreateInput) {
    return this.dbService.product.create({
      data: createProductDTO,
    });
  }

  async findPublished() {
    // return this.dbService.product.findMany({ where: { publishedAt: isNotNull } });
  }

  async findDrafts() {
    // return this.dbService.product.findMany({ where: { publishedAt: null } });
  }

  async findDeleted() {
    // return this.dbService.product.findMany({ where: { deletedAt: isNotNull } });
  }

  async findUpdated() {
    // return this.dbService.product.findMany({ where: { updatedAt: isNotNull } });
  }

  async findAvailable() {
    // return this.dbService.product.findMany({ where: { publishedAt: isNotNull } });
  }

  async findRented() {
    // return this.dbService.product.findMany({ where: { publishedAt: null } });
  }

  async findUnavailable() {
    // return this.dbService.product.findMany({ where: { deletedAt: isNotNull } });
  }

  async findSelled() {
    // return this.dbService.product.findMany({ where: { updatedAt: isNotNull } });
  }

  async permanentlyDeleteRecord(id) {
    return this.dbService.product.delete({
      where: { id },
    });
  }

  async softDeleteRecord(id) {
    return this.dbService.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restoreRecord(id) {
    return this.dbService.product.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async getActiveRecords() {
    return this.dbService.product.findMany({
      where: { deletedAt: null },
    });
  }

  async findALl(price?: number, page: number = 1, limit: number = 20) {
    if (price) {
      return this.dbService.product.findMany({
        where: {
          price: {
            lte: price,
          },
        },
        take: limit,
        skip: limit * (page - 1),
      });
    }
    return this.dbService.product.findMany({
      where: {},
      take: limit,
      skip: limit * (page - 1),
      orderBy: {
        price: 'asc',
      },
    });
  }

  async findAllOrderByPrice(
    price?: number,
    page: number = 1,
    limit: number = 20,
  ) {
    if (price) {
      return this.dbService.product.findMany({
        where: {
          price: {
            lte: price,
          },
        },
        take: limit,
        skip: limit * (page - 1),
        orderBy: {
          price: 'asc',
        },
      });
    }
    return this.dbService.product.findMany({
      where: {},
      take: limit,
      skip: limit * (page - 1),
      orderBy: {
        price: 'asc',
      },
    });
  }

  async findOne(id: number) {
    return this.dbService.product.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateProductDTO: Prisma.ProductUpdateInput) {
    return this.dbService.product.update({
      where: {
        id,
      },
      data: updateProductDTO,
    });
  }

  async remove(id: number) {
    return this.dbService.product.delete({
      where: {
        id,
      },
    });
  }
}
