import { Blockchain } from "../src/blockchain";

describe("Blockchain Block creation", () => {
    let chain: Blockchain;

    beforeAll(() => {
        chain = new Blockchain();
    });

    test("Block creation of 10 Block takes roughly 30 seconds", async () => {
        const start = performance.now();
        for (let i = 0; i < 10; i++) {
            chain.add(`foo bar ${i}`);
        }
        const end = performance.now();
        const elapsed = end - start;
        expect(elapsed).toBeGreaterThanOrEqual(14000);
        expect(elapsed).toBeLessThan(31000);
    });
});
