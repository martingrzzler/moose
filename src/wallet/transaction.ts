import { Wallet } from ".";
import { Cryptography } from "../cryptocgraphy";

interface Output {
    amount: number;
    address: string;
}

interface Input {
    timestamp: number;
    amount: number;
    address: string;
    signature: Cryptography.Signature;
}

export class Transaction {
    private id_: string;
    private outputs_: Output[];
    private input_: Input | null;

    private constructor() {
        this.id_ = Cryptography.id();
        this.outputs_ = [];
        this.input_ = null;
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

        transaction.input = {
            timestamp: Date.now(),
            amount: sender.balance,
            address: sender.publicKey,
            signature: sender.sign(transaction),
        };

        return transaction;
    }

    verify(): boolean {
        if (!this.input_) throw Error("Input is not defined");
        return Cryptography.verifySignature(
            this.input_.address,
            this.input_.signature,
            Cryptography.hash(this.outputs_)
        );
    }

    get outputs() {
        return this.outputs_;
    }

    set outputs(o: Output[]) {
        this.outputs_ = o;
    }

    set input(i: Input | null) {
        this.input_ = i;
    }

    get input(): Input | null {
        return this.input_;
    }
}
