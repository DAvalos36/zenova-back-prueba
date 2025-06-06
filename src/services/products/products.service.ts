import { Injectable } from '@nestjs/common';
import { PrismaDbService } from '../prisma-db/prisma-db.service';
import { Prisma, Product } from '@prisma/client';
import {
  GetProductsQueryDto,
  ProductDto,
  ProductResponseDto,
  CreateProductDto,
  CreateProductResponseDto,
} from 'src/DTOS/products';

@Injectable()
export class ProductsService {
  constructor(private readonly db: PrismaDbService) {}

  async getProducts(query?: GetProductsQueryDto): Promise<ProductResponseDto> {
    const {
      minPrice,
      maxPrice,
      minStock,
      status,
      featured,
      search,
      includeCategories = false,
      includeImages = false,
      page = 1,
      limit = 10,
    } = query || {};

    // Construir filtros dinámicamente
    const where: Prisma.ProductWhereInput = {};

    // Filtros de precio
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    // Filtro de stock
    if (minStock !== undefined) {
      where.stock = {
        gte: minStock,
      };
    }

    // Filtro de estado
    if (status) {
      where.status = status;
    }

    // Filtro de productos destacados
    if (featured !== undefined) {
      where.featured = featured;
    }

    // Búsqueda full-text
    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            // mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            // mode: 'insensitive',
          },
        },
      ];
    }

    // Configurar includes dinámicamente

    const include: Prisma.ProductInclude = {};
    if (includeCategories) {
      include.categories = {
        include: {
          category: true,
        },
      };
    }
    if (includeImages) {
      include.images = {
        orderBy: {
          position: 'asc',
        },
      };
    }

    // Configurar ordenamiento

    // Calcular paginación
    const skip = (page - 1) * limit;
    const take = limit;

    // Ejecutar consultas en paralelo para mejor rendimiento
    const [products, totalProducts] = await Promise.all([
      this.db.product.findMany({
        where,
        include: Object.keys(include).length > 0 ? include : undefined,
        skip,
        take,
      }),
      this.db.product.count({ where }),
    ]);

    // Calcular información de paginación
    const totalPages = Math.ceil(totalProducts / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    const pagination = {
      currentPage: page,
      totalPages,
      totalProducts,
      hasNextPage,
      hasPreviousPage,
    };

    const idk: ProductDto[] = products.map((product) => {
      return new ProductDto(product);
    });

    return new ProductResponseDto(idk, pagination);
  }

  getProductById(id: number) {
    return this.db.product.findUnique({
      where: { id },
      include: {
        categories: true,
        images: true,
      },
    });
  }

  async createProduct(product: CreateProductDto): Promise<Product> {
    const producto = await this.db.product.create({
      data: {
        ...product,
      },
    });
    return producto;
  }

  async updateProduct(id: number, product: CreateProductDto): Promise<Product> {
    const producto = this.db.product.update({
      where: { id },
      data: product,
    });
    return producto;
  }

  deleteProduct(id: number) {
    return this.db.product.delete({
      where: { id },
    });
  }

  createImages(productId: number, images: Prisma.ProductImageCreateInput[]) {
    return this.db.productImage.createMany({
      data: images.map((image) => ({
        ...image,
        productId,
      })),
    });
  }
}
