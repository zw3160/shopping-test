import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Cart, CartSchema } from '../cart/cart.entity';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: CartSchema }) 
  cart?: Cart; 

  _id?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);


