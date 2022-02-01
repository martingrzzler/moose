import { Block, TESTING_DIFFICULTY } from ".";

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
    const genesis = Block.genesis();
    const block = Block.mine(genesis, "fooo");

    expect(block.hash.substring(0, TESTING_DIFFICULTY)).toEqual(
        "0".repeat(TESTING_DIFFICULTY)
    );
});
