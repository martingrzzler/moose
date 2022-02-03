import { Wallet } from ".";
import { Transaction } from "./transaction";

describe("Transaction", () => {
    let transaction: Transaction;
    let wallet: Wallet;
    let recipient: string;
    let amount: number;

    beforeEach(() => {
        wallet = new Wallet();
        amount = 50;
        recipient = "r3c1p12nt";
        transaction = Transaction.create(wallet, recipient, amount);
    });

    test("outputs are correct", () => {
        expect(
            transaction.outputs.find((o) => o.address === wallet.publicKey)
                ?.amount
        ).toEqual(wallet.balance - amount);
        expect(
            transaction.outputs.find((o) => o.address === recipient)?.amount
        ).toEqual(amount);
    });

    test("transaction exceeding wallet balance throws error", () => {
        amount = 5000;
        expect(() => Transaction.create(wallet, recipient, amount)).toThrow(
            "exceed"
        );
    });

    test("inputs the balance of the wallet", () => {
        expect(transaction.input?.amount).toEqual(wallet.balance);
    });

    test("validates valid transaction", () => {
        expect(transaction.verify()).toEqual(true);
    });

    test("invalidates invalid transaction", () => {
        transaction.outputs[0].amount = 50000;
        expect(transaction.verify()).toEqual(false);
    });

    test("update valid transaction", () => {
        recipient = "new-recipient";
        amount = 100;
        transaction = transaction.update(wallet, recipient, amount);
        expect(transaction.verify()).toEqual(true);
    });

    test("update invalid transaction throws", () => {
        recipient = "new-recipient";
        amount = 100000;
        expect(() => transaction.update(wallet, recipient, amount)).toThrow(
            "exceed"
        );
    });

    test("invalidates invalid updated transaction", () => {
        recipient = "new-recipient";
        amount = 100;
        transaction = transaction.update(wallet, recipient, amount);
        transaction.outputs[0].amount = 10000;
        expect(transaction.verify()).toEqual(false);
    });
});
