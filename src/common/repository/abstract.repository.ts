// common/repositories/base.repository.ts
import { Logger } from '@nestjs/common';
import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';
import { AbstractDocument } from '../schema/abstract.schema';

export abstract class BaseRepository<T extends AbstractDocument> {
  protected abstract readonly logger: Logger;
  protected constructor(protected readonly model: Model<T>) { }

  async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findOne(filterQuery: FilterQuery<T>): Promise<(T & Document) | null> {
    const document = await this.model.findOne(
      { ...filterQuery, isDeleted: false },
      {},
      { lean: false }
    );

    if (!document) {
      this.logger.warn('No document found with filterQuery', filterQuery);
      return null;
    }

    return document;
  }

  async find(filterQuery: FilterQuery<T>): Promise<(T & Document)[]> {
    return this.model.find(
      { ...filterQuery, isDeleted: false },
      {},
      { lean: false },
    ) as Promise<(T & Document)[]>;
  }

  async create(item: Partial<T>): Promise<T> {
    const createdItem = new this.model(item);
    return createdItem.save();
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<T>,
    update: UpdateQuery<T>
  ): Promise<(T & Document) | null> {
    const document = await this.model.findOneAndUpdate(
      { ...filterQuery, isDeleted: false },
      update,
      { lean: false, new: true }
    );

    if (!document) {
      this.logger.warn('No document found to update with filterQuery', filterQuery);
      return null;
    }
    return document;
  }

  async update(id: string, item: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, item, { new: true }).exec();
  }

  async deleteOne(filterQuery: FilterQuery<T>): Promise<boolean> {
    const result = await this.model.updateOne(filterQuery, { isDeleted: true });
    return result.modifiedCount > 0;
  }
}