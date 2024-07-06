import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { Products } from 'src/entities/products.entity';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  getProducts(page: number, limit: number) {
    return this.productsRepository.getProducts(page, limit);
  }

  async getProductById(id: string) {
    const product = await this.productsRepository.getProductById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  createProduct() {
    return this.productsRepository.createProduct();
  }

  updateProduct(id: string, product: any) {
    return this.productsRepository.updateProduct(id, product);
  }

  async updateProductImage(productId: string, imgUrl: string) {
    const product = await this.getProductById(productId);
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    product.imgUrl = imgUrl;
    await this.productsRepository.updateProduct(productId, product);
  }

  deleteProduct(id: string) {
    return this.productsRepository.deleteProduct(id);
  }
}
