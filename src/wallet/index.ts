import { INITIAL_BALANCE } from "../config";
import { Cryptography } from "../cryptocgraphy";
import { Transaction } from "./transaction";
import { TransactionPool } from "./transaction-pool";

export class Wallet {
    private balance_: number;
    private keyPair_: Cryptography.KeyPair;
    private publicKey_: string;

    constructor() {
        this.balance_ = INITIAL_BALANCE;
        this.keyPair_ = Cryptography.genKeyPair();
        this.publicKey_ = this.keyPair_.getPublic().encode("hex", false);
    }

    sign(transaction: Transaction) {
        return this.keyPair_.sign(Cryptography.hash(transaction.outputs));
    }

    createTransaction(recipient: string, amount: number, p: TransactionPool) {
        if (amount > this.balance_)
            throw new Error(
                `Amount: ${amount} exceeds current balance: ${this.balance_}`
            );

        let transaction = p.findByPubKey(this.publicKey_);

        if (transaction) {
            transaction.update(this, recipient, amount);
        } else {
            transaction = Transaction.create(this, recipient, amount);
            p.updateOrAdd(transaction);
        }

        return transaction;
    }

    toString() {
        return `Wallet - 
publicKey: ${this.publicKey_}
balance: ${this.balance_}`;
    }

    get balance() {
        return this.balance_;
    }

    get publicKey() {
        return this.publicKey_;
    }
}
