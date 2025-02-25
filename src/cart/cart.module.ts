import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { Cart, CartSchema } from './cart.entity';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    UserModule,
    ProductModule,
    ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
