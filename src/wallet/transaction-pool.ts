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

    validTransactions(): Transaction[] {
        return this.transactions.filter((t) => {
            if (!this.inputMatchesOuput(t)) return false;
            if (!t.verify()) return false;

            return true;
        });
    }

    private inputMatchesOuput(t: Transaction): boolean {
        const outputTotal = t.outputs.reduce(
            (total, output) => total + output.amount,
            0
        );

        return t.input?.amount === outputTotal;
    }

    get(t: Transaction) {
        return this.transactions_.get(t.id);
    }

    get transactions() {
        return new Array(...this.transactions_.values());
    }
}
