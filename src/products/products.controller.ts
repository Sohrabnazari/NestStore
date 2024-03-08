import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ValidationPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Prisma } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  findAll(@Query('price') price?: string, @Query('page') page: number = 1) {
    return this.productService.findALl(+price, +page);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Post()
  create(@Body(ValidationPipe) createProductDto: Prisma.ProductCreateInput) {
    return { createProductDto };
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateProductDto: Prisma.ProductUpdateInput,
  ) {
    return { id, ...updateProductDto };
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return { id };
  }
}
