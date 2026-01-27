import { Test, TestingModule } from '@nestjs/testing';
import { adminController } from './admin.controller';

describe('adminController', () => {
  let controller: adminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [adminController],
    }).compile();

    controller = module.get<adminController>(adminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
