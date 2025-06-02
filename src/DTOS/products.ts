import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProductStatus } from 'generated/prisma';

export enum ProductSortBy {
  PRICE = 'price',
  NAME = 'name',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  FEATURED = 'featured',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class GetProductsQueryDto {
  @ApiPropertyOptional({
    description: 'Precio mínimo del producto',
    example: 10.0,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El precio mínimo debe ser un número' })
  @Min(0, { message: 'El precio mínimo debe ser mayor o igual a 0' })
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Precio máximo del producto',
    example: 100.0,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El precio máximo debe ser un número' })
  @Min(0, { message: 'El precio máximo debe ser mayor o igual a 0' })
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Stock mínimo del producto',
    example: 1,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El stock debe ser un número' })
  @Min(0, { message: 'El stock debe ser mayor o igual a 0' })
  minStock?: number;

  @ApiPropertyOptional({
    description: 'Estado del producto',
    enum: ProductStatus,
    example: ProductStatus.active,
  })
  @IsOptional()
  @IsEnum(ProductStatus, {
    message: 'El estado debe ser: active, inactive o draft',
  })
  status?: ProductStatus;

  @ApiPropertyOptional({
    description: 'Filtrar solo productos destacados',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  })
  @IsBoolean({ message: 'Featured debe ser true o false' })
  featured?: boolean;

  @ApiPropertyOptional({
    description: 'Texto de búsqueda para nombre y descripción',
    example: 'smartphone',
  })
  @IsOptional()
  @IsString({ message: 'El texto de búsqueda debe ser una cadena' })
  search?: string;

  @ApiPropertyOptional({
    description: 'Campo por el cual ordenar',
    enum: ProductSortBy,
    example: ProductSortBy.PRICE,
  })
  @IsOptional()
  @IsEnum(ProductSortBy, {
    message:
      'El campo de ordenamiento debe ser: price, name, createdAt, updatedAt o featured',
  })
  sortBy?: ProductSortBy;

  @ApiPropertyOptional({
    description: 'Orden de clasificación',
    enum: SortOrder,
    example: SortOrder.ASC,
  })
  @IsOptional()
  @IsEnum(SortOrder, { message: 'El orden debe ser: asc o desc' })
  sortOrder?: SortOrder;

  @ApiPropertyOptional({
    description: 'Incluir categorías en la respuesta',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  })
  @IsBoolean({ message: 'includeCategories debe ser true o false' })
  includeCategories?: boolean;

  @ApiPropertyOptional({
    description: 'Incluir imágenes en la respuesta',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  })
  @IsBoolean({ message: 'includeImages debe ser true o false' })
  includeImages?: boolean;

  @ApiPropertyOptional({
    description: 'Número de página',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'La página debe ser un número' })
  @Min(1, { message: 'La página debe ser mayor a 0' })
  page?: number;

  @ApiPropertyOptional({
    description: 'Número de elementos por página',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El límite debe ser un número' })
  @Min(1, { message: 'El límite debe ser mayor a 0' })
  @Max(100, { message: 'El límite no puede ser mayor a 100' })
  limit?: number;
}

export class ProductResponseDto {
  @ApiPropertyOptional({
    description: 'Lista de productos',
    type: 'array',
  })
  products: any[];

  @ApiPropertyOptional({
    description: 'Información de paginación',
    type: 'object',
    properties: {
      currentPage: { type: 'number', example: 1 },
      totalPages: { type: 'number', example: 5 },
      totalProducts: { type: 'number', example: 50 },
      hasNextPage: { type: 'boolean', example: true },
      hasPreviousPage: { type: 'boolean', example: false },
    },
  })
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };

  constructor(
    products: any[],
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalProducts: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    },
  ) {
    this.products = products;
    this.pagination = pagination;
  }
}
