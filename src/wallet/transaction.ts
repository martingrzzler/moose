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
    private input_: Input | null;
    private outputs_: Output[];

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

    update(sender: Wallet, recipient: string, amount: number) {
        const senderOutput = this.outputs_.find(
            (o) => o.address === sender.publicKey
        );
        if (!senderOutput)
            throw new Error(
                "No Output with sender's public key existent in this transactions's outputs"
            );

        if (!this.input_) throw new Error("Input of this transaction is null");

        if (amount > senderOutput.amount)
            throw new Error(`Amount: ${amount} exceeds balance`);

        senderOutput.amount = senderOutput.amount - amount;
        this.outputs_.push({ amount, address: recipient });

        this.input_.signature = sender.sign(this);

        return this;
    }

    verify(): boolean {
        if (!this.input_) throw Error("Input is not defined");
        return Cryptography.verifySignature(
            this.input_.address,
            this.input_.signature,
            Cryptography.hash(this.outputs_)
        );
    }

    static deserialize(data: any): Transaction {
        return Object.assign(new Transaction(), data);
    }

    static toJSON(t: Transaction) {
        return JSON.stringify(t);
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

    get id() {
        return this.id_;
    }

    get address() {
        return this.input_?.address;
    }
}
