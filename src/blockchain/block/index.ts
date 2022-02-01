import { SHA256 } from "crypto-js";

const DIFFICULTY = 4;

export interface BlockProps {
    ts: number;
    prevHash: string;
    hash: string;
    data: any;
    nonce: number;
}

export class Block {
    private ts_: number;
    private prevHash_: string;
    private hash_: string;
    private data_: any;
    private nonce_: number;

    constructor({ ts, prevHash, hash, data, nonce }: BlockProps) {
        this.ts_ = ts;
        this.prevHash_ = prevHash;
        this.hash_ = hash;
        this.data_ = data;
        this.nonce_ = nonce;
    }

    static genesis() {
        return new Block({
            ts: 0,
            prevHash: "GENESIS",
            hash: "GENESIS",
            data: [],
            nonce: 0,
        });
    }

    static initProps(): BlockProps {
        return { ts: 0, hash: "", prevHash: "", data: "", nonce: 0 };
    }

    private static hash(
        ts: number,
        prevHash: string,
        data: any,
        nonce: number
    ) {
        return SHA256(`${ts}${prevHash}${data}${nonce}`).toString();
    }

    static mine(prevBlock: Block, data: any) {
        let nonce = 0;
        let hash: string;
        let ts: number;
        const { hash: prevHash } = prevBlock;

        do {
            nonce++;
            ts = Date.now();
            hash = this.hash(ts, prevHash, data, nonce);
        } while (!this.puzzleSolved(hash));

        return new Block({
            ts,
            prevHash,
            data,
            hash,
            nonce,
        });
    }

    private static puzzleSolved(hash: string) {
        return hash.substring(0, DIFFICULTY) === "0".repeat(DIFFICULTY);
    }

    static computeHash(block: Block) {
        const { ts_, prevHash_, data_, nonce_ } = block;
        return this.hash(ts_, prevHash_, data_, nonce_);
    }

    toString() {
        return `Block - 
Timestamp: ${this.ts_}
Prev Hash: ${this.prevHash_.substring(0, 10)}
Hash     : ${this.hash_.substring(0, 10)}
Data     : ${this.data_}
Nonce    : ${this.nonce_}`;
    }

    get hash() {
        return this.hash_;
    }

    get prevHash() {
        return this.prevHash_;
    }

    set data(d: any) {
        this.data_ = d;
    }
}
