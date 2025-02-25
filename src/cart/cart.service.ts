import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/user.entity'; 
import { ProductService } from '../product/product.service';
import { Cart } from './cart.entity'; 

@Injectable()
export class CartService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private productService: ProductService,
  ) {}

  private async getUserFromToken(jwtToken: string): Promise<UserDocument> {
    const userId = this.extractUserIdFromToken(jwtToken);
    const user = await this.userModel.findById(userId).exec();
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  async addProductToCart(jwtToken: string, productName: string, amount: number = 1): Promise<Cart> {
    const user = await this.getUserFromToken(jwtToken);
    
    user.cart = user.cart || { items: [], price: 0 };
    const existingItem = user.cart.items.find(item => item.productName === productName);
    
    if (existingItem) {
      existingItem.amount += amount; 
    } else {
      user.cart.items.push({ productName, amount }); 
    }

    const price = await this.productService.getPrice(productName);
    price && (user.cart.price += amount * price);

    await user.save();
    return user.cart;
  }

  async changeProductInCart(jwtToken: string, productName: string, newAmount: number): Promise<Cart> {
    const user = await this.getUserFromToken(jwtToken);

    if (!user.cart) {
      throw new NotFoundException('Cart not found');
    }

    const item = user.cart.items.find(item => item.productName === productName);
    if (!item) {
      throw new NotFoundException('Product not found in cart');
    }

    const price = await this.productService.getPrice(productName);
    price && (user.cart.price += (newAmount - item.amount) * price)
    item.amount = newAmount;
    
    await user.save();
    return user.cart;
  }

  async deleteProductFromCart(jwtToken: string, productName: string): Promise<Cart> {
    const user = await this.getUserFromToken(jwtToken);
  
    if (!user.cart) {
      throw new NotFoundException('Cart not found');
    }
  
    const item = user.cart.items.find(item => item.productName === productName);
    if (!item) {
      throw new NotFoundException('Product not found in cart');
    }
  
    const price = await this.productService.getPrice(productName);
    price && (user.cart.price -= item.amount * price)
  
    user.cart.items = user.cart.items.filter(item => item.productName !== productName); 
    await user.save();
    return user.cart;
  }

  async getCart(jwtToken: string): Promise<Cart> {
    const user = await this.getUserFromToken(jwtToken);
    
    if (!user.cart) {
      throw new NotFoundException('Cart not found');
    }
    
    return user.cart; 
  }

  private extractUserIdFromToken(token: string): string | undefined {
    try {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined');
      }
  
      const decoded = jwt.verify(token, jwtSecret); 
      return typeof decoded['sub'] === 'string' ? decoded['sub'] : undefined;
    } catch (error) {
      console.error('Error verifying token:', error);
      throw new NotFoundException('Invalid token: ' + error.message);
    }
  }
  
}
