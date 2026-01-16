import { Body, Controller, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletGateway } from './wallet.gateway';


@Controller('wallet')
export class WalletController {
    constructor(
        private walletService: WalletService,
        private walletGateway: WalletGateway,
    ) {}

    @Post('send-money')
    sendMoney(
        @Body() body: { sender: string; receiver: string; amount: number },
    ) {
        const { sender, receiver, amount } = body;
        const result = this.walletService.transfer(sender, receiver, amount);
    
        if(!result.success)  return result;

        setTimeout(() => {
            if (result.success && result.transactionId) {
                this.completePaymentWebhook({
                    transactionId: result.transactionId,
                    receiver,
                    amount,
                    sender,
                });
            }                  
        }, 2000);

        return {
        message: 'Payment initiated, waiting for confirmation...',
        transactionId: result.transactionId,
        };
  }

  @Post('webhook/payment')
  completePaymentWebhook(@Body() body: { transactionId: string; receiver: string; amount: number; sender: string }) {
    const { receiver, amount, sender } = body;

    this.walletService.completeTransfer(receiver, amount);

    this.walletGateway.notifyUser(sender, ` ₹${amount} sent to ${receiver}`);
    this.walletGateway.notifyUser(receiver, ` ₹${amount} received from ${sender}`);

    console.log('Webhook processed:', body);
    return { status: 'success' };
  }
}
