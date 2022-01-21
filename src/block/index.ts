import { SHA256 } from "crypto-js";

export interface BlockProps {
    ts: number;
    prevHash: string;
    hash: string;
    data: string[];
}

export class Block {
    private ts_: number;
    private prevHash_: string;
    private hash_: string;
    private data_: string[];

    constructor({ ts, prevHash, hash, data }: BlockProps) {
        this.ts_ = ts;
        this.prevHash_ = prevHash;
        this.hash_ = hash;
        this.data_ = data;
    }

    static genesis() {
        return new Block({
            ts: 0,
            prevHash: "GENESIS",
            hash: "GENESIS",
            data: [],
        });
    }

    private static hash(ts: number, prevHash: string, data: string[]) {
        return SHA256(`${ts}${prevHash}${data}`).toString();
    }

    static mine(prevBlock: Block, data: string[]) {
        const ts = Date.now();
        const { hash: prevHash } = prevBlock;
        const hash = this.hash(ts, prevHash, data);
        return new Block({
            ts,
            prevHash,
            data,
            hash,
        });
    }

    static computeHash(block: Block) {
        const { ts_, prevHash_, data_ } = block;
        return this.hash(ts_, prevHash_, data_);
    }

    toString() {
        return `Block - 
Timestamp: ${this.ts_}
Prev Hash: ${this.prevHash_.substring(0, 10)}
Hash     : ${this.hash_.substring(0, 10)}
Data     : ${this.data_}`;
    }

    get hash() {
        return this.hash_;
    }

    get prevHash() {
        return this.prevHash_;
    }

    set data(d: string[]) {
        this.data_ = d;
    }
}
