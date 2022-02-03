import { Wallet } from ".";
import { Cryptography } from "../cryptocgraphy";

interface Output {
    amount: number;
    address: string;
}

export class Transaction {
    private id_: string;
    private outputs_: Output[];

    constructor() {
        this.id_ = Cryptography.id();
        this.outputs_ = [];
    }

    static create(sender: Wallet, recipient: string, amount: number) {
        const transaction = new Transaction();

        if (amount > sender.balance)
            throw new Error(`Amount: ${amount} exceeds balance`);

        transaction.outputs_.push(
            {
                amount: sender.balance - amount,
                address: sender.publicKey,
            },
            {
                amount,
                address: recipient,
            }
        );

        return transaction;
    }
}
