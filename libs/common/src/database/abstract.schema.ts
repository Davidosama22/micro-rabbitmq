import { Logger } from "@nestjs/common";
import { Prop, Schema } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

@Schema({})
export abstract class abstractDocument {

    @Prop({type: SchemaTypes.ObjectId,})
    _id!: Types.ObjectId
}