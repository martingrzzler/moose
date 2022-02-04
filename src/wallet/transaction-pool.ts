import { Transaction } from "./transaction";

export class TransactionPool {
    private transactions_: Map<string, Transaction>;

    constructor() {
        this.transactions_ = new Map();
    }

    updateOrAdd(t: Transaction) {
        this.transactions_.set(t.id, t);
    }

    findByPubKey(pubKey: string): Transaction | undefined {
        return new Array(...this.transactions_.values()).find(
            (t) => t.address === pubKey
        );
    }

    get(t: Transaction) {
        return this.transactions_.get(t.id);
    }

    get transactions() {
        return new Array(...this.transactions_.values());
    }
}
