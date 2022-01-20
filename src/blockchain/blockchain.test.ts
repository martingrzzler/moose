import { Blockchain } from ".";
import { Block } from "../block";

describe("Blockchain", () => {
    let chain: Blockchain;
    let genesis: Block;

    beforeEach(() => {
        genesis = Block.genesis();
        chain = new Blockchain(genesis);
    });

    test("should start with genesis block", () => {
        expect(chain.at(0)).toEqual(genesis);
    });
});
