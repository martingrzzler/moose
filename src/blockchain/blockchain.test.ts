import { Blockchain } from ".";
import { Block } from "./block";

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
            new Block({
                ts: Date.now(),
                hash: "",
                data: [],
                prevHash: "",
                nonce: 0,
                difficulty: 0,
            })
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

    test("replace with valid chain", () => {
        let newChain = new Blockchain();
        newChain.add(["So spricht der Herr"]);
        newChain.add(["So spricht der Herr"]);
        expect(() => chain.replace(newChain)).not.toThrow();
        expect(chain.data).toEqual(newChain.data);
    });
    test("replace with invalid chain", () => {
        let newChain = new Blockchain();
        newChain.add(["So spricht der Herr"]);
        newChain.add(["Zarathustra"]);

        newChain.set(
            1,
            new Block({
                ts: Date.now(),
                prevHash: "some",
                hash: "hash",
                data: [],
                nonce: 0,
                difficulty: 0,
            })
        );

        expect(() => chain.replace(newChain)).toThrow();
    });
    test("deserialize", () => {
        chain.add("ad acta");
        chain.add("ad acta");

        const json = chain.toJSON();
        const arr = JSON.parse(json);
        const deseroalizedChain = Blockchain.derserialize(arr);

        expect(deseroalizedChain.data[1].hash).toEqual(chain.data[1].hash);
        expect(deseroalizedChain.isValid()).toEqual(true);
        expect(deseroalizedChain.length).toEqual(3);
    });
});
