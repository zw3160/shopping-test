import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema()
export class Cart {
  @Prop({ type: [{ productName: String, amount: Number }] })
  items: { productName: string; amount: number }[];

  _id?: Types.ObjectId
}
export const CartSchema = SchemaFactory.createForClass(Cart);