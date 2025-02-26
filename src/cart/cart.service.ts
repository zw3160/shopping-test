import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProductService } from '../product/product.service';
import { Cart, CartDocument } from './cart.entity'; 
import { UserService } from 'src/user/user.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private productService: ProductService,
    private userService: UserService,
  ) {}

  async createCart(user): Promise<CartDocument> {
    const cart = new this.cartModel({ items: [] });
    await cart.save();
    await this.userService.updateUserCart(cart._id, user._id);
    return cart;
}

  async getCartById(cartId: Types.ObjectId): Promise<CartDocument> {
    const cart = await this.cartModel.findById(cartId);
    if (!cart) {
      throw new Error(`Cart ${cartId} not found`);
    }
    return cart;
  }

  async addProductToCart(jwtToken: string, productName: string, amount: number = 1): Promise<Cart> {
    const user = await this.userService.getUserFromToken(jwtToken);

    const cart = user.cart ? await this.getCartById(user.cart) : await this.createCart(user);
    
    const existingItem = cart.items.find(item => item.productName === productName);
    
    if (existingItem) {
      existingItem.amount += amount; 
    } else {
      cart.items.push({ productName, amount }); 
    }
  
    return cart.save(); 
  }

  private async findCart(jwtToken: string) :  Promise<CartDocument>{
    const user = await this.userService.getUserFromToken(jwtToken);
    if (!user.cart) {
      throw new NotFoundException('User not have a cart');
    }
    return this.getCartById(user.cart) 
  }

  private findItemInCart(cart: CartDocument, productName: string) :  { productName: string; amount: number; } {
    const item = cart.items.find(item => item.productName === productName);
    if (!item) {
      throw new NotFoundException('Product not found in cart');
    }
    return item;
  }

  async changeProductInCart(jwtToken: string, productName: string, newAmount: number): Promise<Cart> {
    try {
      const cart = await this.findCart(jwtToken);
      const item = this.findItemInCart(cart, productName);
      item.amount = newAmount;
      return cart.save();
    } catch (error) {
      console.log(`failure during changeProductInCart err: ${error}`)
      throw error;
    }
  }

  async deleteProductFromCart(jwtToken: string, productName: string): Promise<Cart> {
    try {
      const cart = await this.findCart(jwtToken);
      const item = this.findItemInCart(cart, productName);
      cart.items = item && cart.items.filter(item => item.productName !== productName); 
      return cart.save();
    } catch (error) {
      console.log(`failure during deleteProductFromCart err: ${error}`)
      throw error;
    }
  }

  async calculateTotalPrice(items) {
    return Promise.all(
      items.map(async (item) => {
        const price = await this.productService.getPrice(item.productName);
        return price && (item.amount * price);
      })
    ).then(prices => prices.reduce((acc, curr) => acc + curr, 0));
  }
  
  async getCart(jwtToken: string): Promise<{cart: Cart, price: number}> {
    const cart = await this.findCart(jwtToken);
    const price = await this.calculateTotalPrice(cart.items);
    
    return { cart, price }; 
  }


  
}
