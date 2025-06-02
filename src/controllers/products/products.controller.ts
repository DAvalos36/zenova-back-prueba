import { Controller, Get, Query } from '@nestjs/common';
import { GetProductsQueryDto, ProductResponseDto } from 'src/DTOS/products';
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
}
