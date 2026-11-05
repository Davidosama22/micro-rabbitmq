import {
    Model,
    Types,
    UpdateQuery,
    QueryFilter,
} from 'mongoose';
import { abstractDocument } from "./abstract.schema";
import { Logger, NotFoundException } from "@nestjs/common";

export abstract class abstractRepo<TDoument extends abstractDocument> {
    protected abstract readonly logger: Logger
    constructor(protected readonly model: Model<TDoument>) { }

async create(document: Omit<TDoument, '_id'>): Promise<TDoument> {
  console.log('DOCUMENT:', document);

  const createdDocument = new this.model({
    ...document,
    _id: new Types.ObjectId(),
  });

  console.log('CREATED:', createdDocument.toObject());

  return (await createdDocument.save()).toJSON();
}
async findOneOptional(
    filterQuery: QueryFilter<TDoument>,
): Promise<TDoument | null> {
    const document = await this.model
        .findOne(filterQuery)
        .lean<TDoument>(true);

    if (!document) {
        this.logger.warn(
            `Document not found with filterQuery ${JSON.stringify(filterQuery)}`,
        );
        return null;
    }

    return document;
}

    async findOne(filterQuery: QueryFilter<TDoument>): Promise<TDoument> {
        const document = await this.model.findOne(filterQuery).lean<TDoument>(true);
        if (!document) {
            this.logger.warn(`Document not found with filterQuery ${JSON.stringify(filterQuery)}`);
            throw new NotFoundException(`Document not found with filterQuery ${JSON.stringify(filterQuery)}`);
        }
        return document;
    }

    async findOneAndUpdate(filterQuery: QueryFilter<TDoument>, update: UpdateQuery<TDoument>): Promise<TDoument> {
        const document = await this.model.findOneAndUpdate(filterQuery, update, { new: true }).lean<TDoument>(true);
        if (!document) {
            this.logger.warn(`Document not found with filterQuery ${JSON.stringify(filterQuery)}`);
            throw new NotFoundException(`Document not found with filterQuery ${JSON.stringify(filterQuery)}`);
        }
        return document;
    }

    async find(filterQuery: QueryFilter<TDoument>): Promise<TDoument[]> {
        const documents = await this.model.find(filterQuery).lean<TDoument[]>(true);
        if (!documents) {
            this.logger.warn(`Document not found with filterQuery ${JSON.stringify(filterQuery)}`);
            throw new NotFoundException(`Document not found with filterQuery ${JSON.stringify(filterQuery)}`);
        }
        return documents;
    }

    async findOneAndDelete(filterQuery: QueryFilter<TDoument>): Promise<TDoument> {
        const document = await this.model.findOneAndDelete(filterQuery).lean<TDoument>(true);
        if (!document) {
            this.logger.warn(`Document not found with filterQuery ${JSON.stringify(filterQuery)}`);
            throw new NotFoundException(`Document not found with filterQuery ${JSON.stringify(filterQuery)}`);
        }
        return document;
    }
}