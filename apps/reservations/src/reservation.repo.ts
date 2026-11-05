import { abstractRepo } from "@app/common/database/abstract.repo";
import { Injectable } from "@nestjs/common";
import  { Logger } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ReservationDocument } from "./entities/reservation.schema";
@Injectable()
export class ReservationRepo extends abstractRepo<ReservationDocument> {
    protected readonly logger = new Logger(ReservationRepo.name);
    constructor(
        @InjectModel(ReservationDocument.name) private readonly reservation: Model<ReservationDocument>
    ) {
        super(reservation);
    }
}