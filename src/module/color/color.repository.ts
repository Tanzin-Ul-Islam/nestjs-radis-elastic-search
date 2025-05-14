import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/repository/abstract.repository';
import { Injectable, Logger } from '@nestjs/common';
import { Color } from './schemas/color.schema';

@Injectable()
export class ColorRepository extends BaseRepository<Color> {
    protected readonly logger = new Logger(Color.name);
    constructor(
        @InjectModel(Color.name) private readonly colorModel: Model<Color>,
    ) {
        super(colorModel);
    }
}
