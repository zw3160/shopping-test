import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryService } from '../category/category.service';
import { Product, ProductDocument } from './product.entity';


@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private categoryService: CategoryService,
  ) {}

  async create(productData: { name: string; price: number, category: string }): Promise<Product> {
    const categoryExists = await this.categoryService.findAll();
    const categoryNames = categoryExists.map(category => category.name);

    if (!categoryNames.includes(productData.category)) {
      throw new NotFoundException(`Category ${productData.category} does not exist`);
    }

    const newProduct = new this.productModel({
      ...productData,
    });
    return newProduct.save();
  }

  async getProducts(category: string): Promise<Product[]> {
    return category ? this.productModel.find({ category }) : this.productModel.find();
  }

  async getPrice(name: string): Promise<number | undefined> {
    const product = await this.productModel.findOne({ name }, 'price'); 
    return product?.price;
  }
}
