import { abstractDocument } from "@app/common/database/abstract.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ versionKey: false })
export class ReservationDocument extends abstractDocument {

    @Prop({ required: true })
    timestamp!: Date;
    @Prop({ required: true })
    startDate!: Date;
    @Prop({ required: true })
    endDate!: Date;
    @Prop({ required: true })
    userId!: string;
}
export const ReservationSchema = SchemaFactory.createForClass(ReservationDocument);