import { Block } from ".";

test("block toString", () => {
    const ts = Date.now();
    const block = new Block({
        ts,
        prevHash: "foo",
        hash: "bar",
        data: [],
    });

    expect(block.toString()).toEqual(`Block - 
Timestamp: ${ts}
Prev Hash: foo
Hash     : bar
Data     : `);
});
