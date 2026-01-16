import { Injectable } from '@nestjs/common';


interface UserWallet {
    userId: string;
    balance: number;
}

@Injectable()
export class WalletService {
    wallets: UserWallet[] = [
        { userId: 'user1', balance: 1000 },
        { userId: 'user2', balance: 500 },
    ];

    getBalance(userId: string) {
        return this.wallets.find(w => w.userId === userId)?.balance || 0;
    }

    transfer(sender: string, receiver: string, amount: number) {
        const from = this.wallets.find(w => w.userId === sender);
        const to = this.wallets.find(w => w.userId === receiver);

        if(!from || !to) {
            return { success: false, message: 'No user found' };
        }

        if(from.balance < amount) {
            return { success: false, message: 'Insufficient Balance'};
        }

        from.balance -= amount;

        return { success: true, transactionId: 'TX' + Date.now() };
    }

    completeTransfer(receiver: string, amount: number) {
        const to = this.wallets.find(w => w.userId === receiver);
        if(to){
            to.balance += amount;
        }
    }
}
