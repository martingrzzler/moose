import { Block } from ".";

describe("block", () => {
    let prevBlock: Block;
    let block: Block;

    beforeAll(() => {
        prevBlock = Block.genesis();
        block = Block.mine(prevBlock, "foo");
    });

    test("block toString", () => {
        const ts = Date.now();
        const block = new Block({
            ts,
            prevHash: "foo",
            hash: "bar",
            data: [],
            nonce: 0,
            difficulty: 0,
        });

        expect(block.toString()).toEqual(`Block - 
Timestamp  : ${ts}
Prev Hash  : foo
Hash       : bar
Data       : 
Nonce      : 0
Difficulty : 0`);
    });

    test("Block's hash is aligned with difficulty level", () => {
        expect(block.hash.substring(0, block.difficulty)).toEqual(
            "0".repeat(block.difficulty)
        );
    });

    test("lowers difficulty for slowly mined block", () => {
        expect(Block.adjustDifficulty(block, block.timestamp + 360000)).toEqual(
            block.difficulty - 1
        );
    });

    test("raises difficulty for quickly mined block", () => {
        expect(Block.adjustDifficulty(block, block.timestamp + 1500)).toEqual(
            block.difficulty + 1
        );
    });
});
