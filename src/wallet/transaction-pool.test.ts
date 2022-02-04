import { Wallet } from ".";
import { Transaction } from "./transaction";
import { TransactionPool } from "./transaction-pool";

describe("TransactionPool", () => {
    let pool: TransactionPool;
    let transaction: Transaction;
    let wallet: Wallet;

    beforeEach(() => {
        pool = new TransactionPool();
        wallet = new Wallet();
        transaction = Transaction.create(wallet, "*&$BSAJHhsdfhj", 30);
        pool.updateOrAdd(transaction);
    });

    test("adds transaction in the pool", () => {
        expect(pool.get(transaction)).toMatchObject(transaction);
    });

    test("updates transaction", () => {
        transaction = transaction.update(wallet, "new recipient", 50);
        pool.updateOrAdd(transaction);
        expect(pool.get(transaction)).toMatchObject(transaction);
    });
    test("valid transaction", () => {
        expect(pool.validTransactions()[0]).toEqual(transaction);
    });
    test("invalid transaction is not included", () => {
        let invalidTransaction = Transaction.create(
            wallet,
            "*H#Chdsu087328",
            50
        );
        invalidTransaction.input = { ...invalidTransaction.input!, amount: 10 };
        expect(
            pool.validTransactions().find((t) => t.id === invalidTransaction.id)
        ).toBeUndefined();
    });
});
