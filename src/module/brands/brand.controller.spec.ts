import { Test, TestingModule } from '@nestjs/testing';
import { BrandsController } from './brand.controller';
import { BrandsService } from './brand.service';

describe('BrandsController', () => {
  let controller: BrandsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandsController],
      providers: [BrandsService],
    }).compile();

    controller = module.get<BrandsController>(BrandsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
