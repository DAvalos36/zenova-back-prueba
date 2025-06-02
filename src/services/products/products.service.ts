import { Injectable } from '@nestjs/common';
import { PrismaDbService } from '../prisma-db/prisma-db.service';
import { Product } from 'generated/prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly db: PrismaDbService) {}

  getProducts() {
    return this.db.product.findMany();
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

  createProduct(product: Product) {
    return this.db.product.create({
      data: {
        ...product,
      },
    });
  }

  updateProduct(id: number, product: Product) {
    return this.db.product.update({
      where: { id },
      data: product,
    });
  }

  deleteProduct(id: number) {
    return this.db.product.delete({
      where: { id },
    });
  }
}
