import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: String, ref: 'Category' }) 
  category?: string;

  _id?: ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
