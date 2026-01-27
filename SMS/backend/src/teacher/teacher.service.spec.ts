import { Test, TestingModule } from '@nestjs/testing';
import { teacherService } from './teacher.service';

describe('teacherService', () => {
  let service: teacherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [teacherService],
    }).compile();

    service = module.get<teacherService>(teacherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
