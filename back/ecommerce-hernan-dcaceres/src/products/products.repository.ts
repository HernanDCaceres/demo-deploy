import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from 'src/entities/categories.entity';
import { Products } from 'src/entities/products.entity';
import { Repository } from 'typeorm';
import * as data from '../utils/data.json';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: boolean;
  imgUrl: string;
};

const products: Product[] = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    name: 'Laptop',
    description: 'A high performance laptop',
    price: 999.99,
    stock: true,
    imgUrl: 'https://example.com/laptop.jpg',
  },
  {
    id: '5a4475d3-8b6b-4b4b-97ed-bdc024ec6f77',
    name: 'Smartphone',
    description: 'A latest model smartphone',
    price: 799.99,
    stock: true,
    imgUrl: 'https://example.com/smartphone.jpg',
  },
  {
    id: '3c62b5e0-9e2b-44f1-9c10-97dff29284b5',
    name: 'Headphones',
    description: 'Noise-cancelling over-ear headphones',
    price: 199.99,
    stock: false,
    imgUrl: 'https://example.com/headphones.jpg',
  },
  {
    id: 'fa87b8e3-7c50-44d2-8c9d-9f7ea714db44',
    name: 'Smartwatch',
    description: 'A stylish smartwatch with various features',
    price: 299.99,
    stock: true,
    imgUrl: 'https://example.com/smartwatch.jpg',
  },
  {
    id: 'cb4d6b6e-06f4-4f16-b3a6-69f8b2fa0e1f',
    name: 'Tablet',
    description: 'A high-resolution screen tablet',
    price: 499.99,
    stock: true,
    imgUrl: 'https://example.com/tablet.jpg',
  },
  {
    id: '1',
    name: 'Laptop',
    description: 'A high performance laptop',
    price: 999.99,
    stock: true,
    imgUrl: 'https://example.com/laptop.jpg',
  },
];

@Injectable()
export class ProductsRepository {
  //* Obtener todos los productos
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  //! Obtener todos los productos

  async getProducts(page: number, limit: number): Promise<Products[]> {
    let products = await this.productsRepository.find({
      relations: {
        category: true,
      },
    });
    const start = (page - 1) * limit;
    const end = start + limit;
    products = products.slice(start, end);

    return products;
  }

  //! Obtener producto por ID

  async getProductById(id: string): Promise<Products | null> {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Producto con ${id} no encontrado`);
    }
    return product;
  }

  //! Crear producto

  async createProduct() {
    //* Verificar la existencia de la categoria
    const categories = await this.categoriesRepository.find();
    data?.map(async (element) => {
      const category = categories.find(
        (category) => category.name === element.category,
      );
      //* Crear nuevo producto y establecer atributos
      const product = new Products();
      product.name = element.name;
      product.description = element.description;
      product.price = element.price;
      product.imgUrl = element.imgUrl;
      product.stock = element.stock;
      product.category = category;

      //*Grabar el nuevo producto en la base de datos

      await this.productsRepository
        .createQueryBuilder()
        .insert()
        .into(Products)
        .values(product)
        .orUpdate(['description', 'price', 'imgUrl', 'stock'], ['name'])
        .execute();
    });
    return 'Productos agregados';
  }

  //! Modificar producto

  async updateProduct(id: string, product: Products) {
    await this.productsRepository.update(id, product);
    const updatedProduct = await this.productsRepository.findOneBy({
      id,
    });
    return updatedProduct;
  }

  //! Eliminar producto

  async deleteProduct(id: string) {
    const productFound = products.findIndex((p) => p.id === id);
    if (productFound === -1) return 'Producto no encontrado';

    products.splice(productFound, 1);
    return `Producto con ID ${id} eliminado`;
  }
}
