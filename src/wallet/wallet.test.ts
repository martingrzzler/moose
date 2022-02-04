import { Wallet } from ".";
import { Transaction } from "./transaction";
import { TransactionPool } from "./transaction-pool";

describe("Transaction", () => {
    let wallet: Wallet;
    let pool: TransactionPool;

    beforeEach(() => {
        wallet = new Wallet();
        pool = new TransactionPool();
    });

    describe("creating a Transaction", () => {
        let transaction: Transaction;
        let recipient: string;
        let amount: number;

        beforeEach(() => {
            recipient = "r2cepient45";
            amount = 60;
            transaction = wallet.createTransaction(recipient, amount, pool);
        });

        test("update existing transaction", () => {
            wallet.createTransaction(recipient, amount, pool);
            expect(
                transaction.outputs.find((o) => o.address === wallet.publicKey)
                    ?.amount
            ).toEqual(wallet.balance - amount * 2);
        });

        test("recipient receives two outputs adding up to `amount` * 2", () => {
            wallet.createTransaction(recipient, amount, pool);
            expect(
                transaction.outputs
                    .filter((o) => o.address === recipient)
                    .reduce((total, o) => total + o.amount, 0)
            ).toEqual(amount * 2);
        });
    });
});
