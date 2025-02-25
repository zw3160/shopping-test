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
    @Body('productId') productId: string,
    @Body('amount') amount: number,
  ): Promise<Cart> {
    const token = req.headers.authorization.split(' ')[1]; 
    return this.cartService.addProductToCart(token, productId, amount);
  }

  @Post('change')
  async changeProductInCart(
    @Request() req: any, 
    @Body('productId') productId: string,
    @Body('amount') amount: number,
  ): Promise<Cart> {
    const token = req.headers.authorization.split(' ')[1]; 
    return this.cartService.changeProductInCart(token, productId, amount);
  }

  @Post('delete')
  async deleteProductFromCart(
    @Request() req: any, 
    @Body('productId') productId: string,
  ): Promise<Cart> {
    const token = req.headers.authorization.split(' ')[1]; 
    return this.cartService.deleteProductFromCart(token, productId);
  }

  @Get('get')
  async getCart(
    @Request() req: any, 
  ): Promise<Cart> {
    const token = req.headers.authorization.split(' ')[1]; 
    return this.cartService.getCart(token);
  }

}
