import { Controller, Post, Body, Request, UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../user/jwt-auth.guard';
import { CartService } from './cart.service';
import { Cart } from './cart.entity';

@Controller('cart')
@UseGuards(JwtAuthGuard)

export class CartController {
  constructor(private readonly cartService: CartService) {}


  @Post('add')
  async addProductToCart(
    @Request() req: any, 
    @Body('productName') productName: string,
    @Body('amount') amount: number,
  ): Promise<Cart> {
    const token = req.headers.authorization.split(' ')[1]; 
    return this.cartService.addProductToCart(token, productName, amount);
  }

  @Post('change')
  async changeProductInCart(
    @Request() req: any, 
    @Body('productName') productName: string,
    @Body('amount') amount: number,
  ): Promise<Cart> {
    const token = req.headers.authorization.split(' ')[1]; 
    return this.cartService.changeProductInCart(token, productName, amount);
  }

  @Post('delete')
  async deleteProductFromCart(
    @Request() req: any, 
    @Body('productName') productName: string,
  ): Promise<Cart> {
    const token = req.headers.authorization.split(' ')[1]; 
    return this.cartService.deleteProductFromCart(token, productName);
  }

  @Get('get')
  async getCart(
    @Request() req: any, 
  ): Promise<{cart: Cart, price: number}> {
    const token = req.headers.authorization.split(' ')[1]; 
    return this.cartService.getCart(token);
  }

}
