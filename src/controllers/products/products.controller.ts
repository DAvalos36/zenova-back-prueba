import { Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import {
  GetProductsQueryDto,
  ProductResponseDto,
  CreateProductDto,
  CreateProductResponseDto,
} from 'src/DTOS/products';
import { ProductsService } from 'src/services/products/products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  async getProducts(
    @Query() data: GetProductsQueryDto,
  ): Promise<ProductResponseDto> {
    const products = await this.productService.getProducts(data);
    return products;
  }

  @Post()
  async createProduct(
    @Query() data: CreateProductDto,
  ): Promise<CreateProductResponseDto> {
    const product = await this.productService.createProduct(data);
    return new CreateProductResponseDto(
      product.id,
      'Producto creado exitosamente',
    );
  }

  @Put(':id')
  async updateProduct(
    @Query() data: CreateProductDto,
    @Param('id') id: number,
  ): Promise<CreateProductResponseDto> {
    const product = await this.productService.updateProduct(id, data);
    return new CreateProductResponseDto(
      product.id,
      'Producto actualizado exitosamente',
    );
  }
}
