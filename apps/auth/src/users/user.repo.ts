import { abstractRepo } from "@app/common/database/abstract.repo";
import { Injectable, Logger } from "@nestjs/common";
import { UserDocument } from "./models/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class UserRepo extends abstractRepo<UserDocument> {
    protected readonly logger = new Logger(UserRepo.name);

    constructor(@InjectModel(UserDocument.name) private readonly userModel: Model<UserDocument>) {
        super(userModel);
    }

 

}