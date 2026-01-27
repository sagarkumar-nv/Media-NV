import { Test, TestingModule } from '@nestjs/testing';
import { adminService } from './admin.service';

describe('adminService', () => {
  let service: adminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [adminService],
    }).compile();

    service = module.get<adminService>(adminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
