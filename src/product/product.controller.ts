import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../user/jwt-auth.guard';
import { ProductService } from './product.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body('name') name: string, @Body('price') price: number, @Body('category') category: string): Promise<Product> {
    return this.productService.create({ name, price, category });
  }

  @UseGuards(JwtAuthGuard)
  @Get('getProducts')
  async getProductsByCategory(@Query('category') category: string): Promise<Product[]> {
    return this.productService.getProducts(category);
  }
}
