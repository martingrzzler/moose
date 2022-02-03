import { INITIAL_BALANCE } from "../config";
import { Cryptography } from "../cryptocgraphy";

export class Wallet {
    private balance_: number;
    private keyPair_: Cryptography.KeyPair;
    private publicKey_: string;

    constructor() {
        this.balance_ = INITIAL_BALANCE;
        this.keyPair_ = Cryptography.genKeyPair();
        this.publicKey_ = this.keyPair_.getPublic().encode("hex", false);
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
