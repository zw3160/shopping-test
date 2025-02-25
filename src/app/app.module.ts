import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import { UserModule } from '../user/user.module'; 
import { CategoryModule } from '../category/category.module';
import { ProductModule } from '../product/product.module';
import { CartModule } from '../cart/cart.module';

config();

const databaseUrl = process.env.DATABASE_URL;
const jwtSecret = process.env.JWT_SECRET;

if (!databaseUrl || !jwtSecret) {
  throw new Error('Please define DATABASE_URL and JWT_SECRET in your .env file');
}

@Module({
  imports: [
    MongooseModule.forRoot(databaseUrl),
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '600s' }, 
    }),
    UserModule,
    CategoryModule,
    ProductModule,
    CartModule,
  ],
})
export class AppModule {}
