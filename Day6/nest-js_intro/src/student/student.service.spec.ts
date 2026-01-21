import { Test, TestingModule } from '@nestjs/testing';
import { STUDENTService } from './student.service';

describe('STUDENTService', () => {
  let service: STUDENTService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [STUDENTService],
    }).compile();

    service = module.get<STUDENTService>(STUDENTService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
