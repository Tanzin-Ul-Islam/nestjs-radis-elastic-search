import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/repository/abstract.repository';
import { Injectable, Logger } from '@nestjs/common';
import { Brand } from './schemas/brand.schema';

@Injectable()
export class BrandRepository extends BaseRepository<Brand> {
    protected readonly logger = new Logger(Brand.name);
    constructor(
        @InjectModel(Brand.name) private readonly brandModel: Model<Brand>,
    ) {
        super(brandModel);
    }
}
