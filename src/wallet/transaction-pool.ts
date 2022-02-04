import { Transaction } from "./transaction";

export class TransactionPool {
    private transactions_: Map<string, Transaction>;

    constructor() {
        this.transactions_ = new Map();
    }

    updateOrAdd(t: Transaction) {
        this.transactions_.set(t.id, t);
    }

    get(t: Transaction) {
        return this.transactions_.get(t.id);
    }
}
