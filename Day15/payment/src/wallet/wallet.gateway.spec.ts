import { Test, TestingModule } from '@nestjs/testing';
import { WalletGateway } from './wallet.gateway';

describe('WalletGateway', () => {
  let gateway: WalletGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletGateway],
    }).compile();

    gateway = module.get<WalletGateway>(WalletGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
