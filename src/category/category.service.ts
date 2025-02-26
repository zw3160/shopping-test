import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}

  async create(name: string): Promise<Category> {
    const category = new this.categoryModel({ name });
    return category.save();
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find({}, 'name');
  }
}
