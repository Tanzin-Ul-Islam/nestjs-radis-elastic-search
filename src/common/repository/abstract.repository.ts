// common/repositories/base.repository.ts
import { Logger } from '@nestjs/common';
import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';
import { AbstractDocument } from '../schema/abstract.schema';

export abstract class BaseRepository<T extends AbstractDocument> {
  protected abstract readonly logger: Logger;
  protected constructor(protected readonly model: Model<T>) {}

  async findAll(): Promise<T[]> {
    return this.model.find({ isDeleted: false }).exec();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findOne({ _id: id, isDeleted: false }).exec();
  }

  async findOne(filterQuery: FilterQuery<T>): Promise<(T & Document) | null> {
    const document = await this.model.findOne(
      { ...filterQuery, isDeleted: false },
      {},
      { lean: false },
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
    update: UpdateQuery<T>,
  ): Promise<(T & Document) | null> {
    const document = await this.model.findOneAndUpdate(
      { ...filterQuery, isDeleted: false },
      update,
      { lean: false, new: true },
    );

    if (!document) {
      this.logger.warn(
        'No document found to update with filterQuery',
        filterQuery,
      );
      return null;
    }
    return document;
  }

  async findWithPagination(params: {
    filterQuery?: FilterQuery<T>;
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
  }): Promise<{
    data: (T & Document)[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { filterQuery = {}, page = 1, limit = 10, sort = {} } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.model
        .find({ ...filterQuery, isDeleted: false }, {}, { lean: false })
        .sort(sort)
        .skip(skip)
        .limit(limit),
      this.model.countDocuments({ ...filterQuery, isDeleted: false }),
    ]);

    return { data, total, page, limit };
  }

  async update(id: string, item: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, item, { new: true }).exec();
  }

  async deleteOne(filterQuery: FilterQuery<T>): Promise<boolean> {
    const result = await this.model.updateOne(filterQuery, { isDeleted: true });
    return result.modifiedCount > 0;
  }
}
