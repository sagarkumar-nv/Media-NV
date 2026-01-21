import { Test, TestingModule } from '@nestjs/testing';
import { STUDENTController } from './student.controller';

describe('STUDENTController', () => {
  let controller: STUDENTController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [STUDENTController],
    }).compile();

    controller = module.get<STUDENTController>(STUDENTController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
