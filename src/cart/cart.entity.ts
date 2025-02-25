import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema()
export class Cart {
  @Prop({ type: [{ productId: String, amount: Number }] })
  items: { productId: string; amount: number }[];

  @Prop({ required: true })
  price: number;
}
export const CartSchema = SchemaFactory.createForClass(Cart);