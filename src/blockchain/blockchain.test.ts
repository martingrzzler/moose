import { Blockchain } from ".";
import { Block } from "../block";

describe("Blockchain", () => {
    let chain: Blockchain;

    beforeEach(() => {
        chain = new Blockchain();
    });

    test("should start with genesis block", () => {
        expect(chain.at(0)).toEqual(Block.genesis());
    });

    test("valid chain", () => {
        expect(chain.isValid()).toEqual(true);

        chain.add([]);
        expect(chain.isValid()).toEqual(true);
        chain.add(["foo", "bar"]);
        expect(chain.isValid()).toEqual(true);
    });

    test("invalid genesis chain", () => {
        chain.set(
            0,
            new Block({ ts: Date.now(), hash: "", data: [], prevHash: "" })
        );
        expect(chain.isValid()).toEqual(false);
    });

    test("tempered with chain", () => {
        chain.add(["foo"]);
        chain.add(["bar"]);
        chain.add(["omi"]);

        const temperedBlock = Block.mine(chain.last, ["transaction"]);
        temperedBlock.data = ["Weh sagt vergeh! Doch Lust will die Ewigkeit."];

        chain.set(chain.length, temperedBlock);

        expect(chain.isValid()).toEqual(false);
    });
});
