import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Prop } from '@nestjs/mongoose';
import { abstractDocument } from '@app/common/database/abstract.schema';


@Schema()
export class UserDocument extends abstractDocument {
  @Prop({ required: true })
  email!: string;

  @Prop({ required: true })
  password!: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
console.log(UserSchema.obj);