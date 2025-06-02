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
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { Product, ProductStatus } from 'generated/prisma';
import { Decimal } from 'generated/prisma/runtime/library';

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

export class CategoryDto {
  @ApiProperty({ description: 'ID de la categoría', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Electrónicos',
  })
  name: string;

  @ApiProperty({ description: 'Slug de la categoría', example: 'electronicos' })
  slug: string;

  @ApiProperty({
    description: 'ID del padre si es subcategoría',
    example: null,
    required: false,
  })
  parentId?: number;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;
}

export class ProductCategoryDto {
  @ApiProperty({ description: 'ID del producto', example: 1 })
  productId: number;

  @ApiProperty({ description: 'ID de la categoría', example: 1 })
  categoryId: number;

  @ApiProperty({ description: 'Datos de la categoría', type: CategoryDto })
  category: CategoryDto;
}

export class ProductImageDto {
  @ApiProperty({ description: 'ID de la imagen', example: 1 })
  id: number;

  @ApiProperty({ description: 'ID del producto', example: 1 })
  productId: number;

  @ApiProperty({
    description: 'URL de la imagen',
    example: 'https://example.com/image.jpg',
  })
  url: string;

  @ApiProperty({
    description: 'Texto alternativo',
    example: 'Imagen del producto',
    required: false,
  })
  altText?: string;

  @ApiProperty({ description: 'Posición de la imagen', example: 0 })
  position: number;

  @ApiProperty({ description: 'Es imagen principal', example: true })
  isPrimary: boolean;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;
}

export class ProductDto {
  @ApiProperty({ description: 'ID del producto', example: 1 })
  id: number;

  @ApiProperty({ description: 'SKU del producto', example: 'PROD-001' })
  sku: string;

  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Smartphone XYZ',
  })
  name: string;

  @ApiProperty({ description: 'Slug del producto', example: 'smartphone-xyz' })
  slug: string;

  @ApiProperty({
    description: 'Descripción del producto',
    example: 'Un excelente smartphone',
    required: false,
  })
  description?: string;

  @ApiProperty({ description: 'Precio del producto', example: 299.99 })
  price: number;

  @ApiProperty({
    description: 'Precio de comparación',
    example: 399.99,
    required: false,
  })
  comparePrice?: number;

  @ApiProperty({
    description: 'Costo del producto',
    example: 200.0,
    required: false,
  })
  cost?: number;

  @ApiProperty({ description: 'Stock disponible', example: 10 })
  stock: number;

  @ApiProperty({ description: 'Umbral de stock bajo', example: 5 })
  lowStockThreshold: number;

  @ApiProperty({ description: 'Peso en kg', example: 0.2, required: false })
  weight?: number;

  @ApiProperty({
    description: 'Estado del producto',
    enum: ProductStatus,
    example: ProductStatus.active,
  })
  status: ProductStatus;

  @ApiProperty({ description: 'Producto destacado', example: false })
  featured: boolean;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de actualización' })
  updatedAt: Date;

  @ApiProperty({
    description: 'Categorías del producto',
    type: [ProductCategoryDto],
    required: false,
  })
  categories?: ProductCategoryDto[];

  @ApiProperty({
    description: 'Imágenes del producto',
    type: [ProductImageDto],
    required: false,
  })
  images?: ProductImageDto[];

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
  }
}

export class PaginationDto {
  @ApiProperty({ description: 'Página actual', example: 1 })
  currentPage: number;

  @ApiProperty({ description: 'Total de páginas', example: 5 })
  totalPages: number;

  @ApiProperty({ description: 'Total de productos', example: 50 })
  totalProducts: number;

  @ApiProperty({ description: 'Hay página siguiente', example: true })
  hasNextPage: boolean;

  @ApiProperty({ description: 'Hay página anterior', example: false })
  hasPreviousPage: boolean;
}

export class ProductResponseDto {
  @ApiProperty({
    description: 'Lista de productos',
    type: [ProductDto],
  })
  products: ProductDto[];

  @ApiProperty({
    description: 'Información de paginación',
    type: PaginationDto,
  })
  pagination: PaginationDto;

  constructor(
    products: ProductDto[],
    pagination: {
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

export class CreateProductDto {
  @ApiProperty({ description: 'SKU del producto', example: 'PROD-001' })
  sku: string;

  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Smartphone XYZ',
  })
  name: string;

  @ApiProperty({ description: 'Slug del producto', example: 'smartphone-xyz' })
  slug: string;

  @ApiProperty({
    description: 'Descripción del producto',
    example: 'Un excelente smartphone',
    required: false,
  })
  description: string;

  @ApiProperty({ description: 'Precio del producto', example: 299.99 })
  price: Decimal;

  @ApiProperty({
    description: 'Precio de comparación',
    example: 399.99,
    required: false,
  })
  comparePrice: Decimal;

  @ApiProperty({
    description: 'Costo del producto',
    example: 200.0,
    required: false,
  })
  cost: Decimal;

  @ApiProperty({ description: 'Stock disponible', example: 10 })
  stock: number;

  @ApiProperty({ description: 'Umbral de stock bajo', example: 5 })
  lowStockThreshold: number;

  @ApiProperty({ description: 'Peso en kg', example: 0.2, required: false })
  weight: Decimal;

  @ApiProperty({
    description: 'Estado del producto',
    enum: ProductStatus,
    example: ProductStatus.active,
    required: false,
  })
  status: ProductStatus;

  @ApiProperty({
    description: 'Producto destacado',
    example: false,
    required: false,
  })
  featured: boolean;
}

export class CreateProductResponseDto {
  @ApiProperty({ description: 'ID del producto creado', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Mensaje de éxito',
    example: 'Producto creado exitosamente',
  })
  message: string;

  constructor(id: number, message: string) {
    this.id = id;
    this.message = message;
  }
}
