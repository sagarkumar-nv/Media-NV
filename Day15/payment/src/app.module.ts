import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletGateway } from './wallet/wallet.gateway';
import { WalletController } from './wallet/wallet.controller';
import { WalletService } from './wallet/wallet.service';

@Module({
  imports: [],
  controllers: [AppController, WalletController],
  providers: [AppService, WalletGateway, WalletService],
})
export class AppModule {}
