import { SHA256 } from "crypto-js";

export interface BlockProps {
    ts: number;
    prevHash: string;
    hash: string;
    data: string[];
}

export class Block {
    private ts: number;
    private prevHash: string;
    private hash: string;
    private data: string[];

    constructor({ ts, prevHash, hash, data }: BlockProps) {
        this.ts = ts;
        this.prevHash = prevHash;
        this.hash = hash;
        this.data = data;
    }

    static genesis() {
        return new Block({
            ts: Date.now(),
            prevHash: "GENESIS",
            hash: "GENESIS",
            data: [],
        });
    }

    private static hash(ts: string, prevHash: string, data: string[]) {
        return SHA256(`${ts}${prevHash}${data}`).toString();
    }

    static hashed(prevBlock: Block, data: string[]) {
        const ts = Date.now();
        const { prevHash } = prevBlock;
        const hash = this.hash(ts.toString(), prevHash, data);
        return new Block({
            ts,
            prevHash,
            data,
            hash,
        });
    }

    toString() {
        return `Block - 
Timestamp: ${this.ts}
Prev Hash: ${this.prevHash.substring(0, 10)}
Hash     : ${this.hash.substring(0, 10)}
Data     : ${this.data}`;
    }
}
