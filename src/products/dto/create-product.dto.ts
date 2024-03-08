import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  author: string;

  @ApiProperty()
  genre: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  publisher: string;

  @ApiProperty({ required: true, default: Date.now() })
  createdAt?: string | Date;

  @ApiProperty({ required: false })
  UpdatedAt?: string | Date;

  @ApiProperty({ required: false })
  deletedAt?: string | Date;
}
