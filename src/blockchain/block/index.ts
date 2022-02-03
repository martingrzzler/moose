import { SHA256 } from "crypto-js";
import { MININING_DIFFICULTY } from "../../config";

const MINE_RATE = 3000;

export interface BlockProps {
    ts: number;
    prevHash: string;
    hash: string;
    data: any;
    nonce: number;
    difficulty: number;
}

export class Block {
    private ts_: number;
    private prevHash_: string;
    private hash_: string;
    private data_: any;
    private nonce_: number;
    private difficulty_: number;

    constructor({ ts, prevHash, hash, data, nonce, difficulty }: BlockProps) {
        this.ts_ = ts;
        this.prevHash_ = prevHash;
        this.hash_ = hash;
        this.data_ = data;
        this.nonce_ = nonce;
        this.difficulty_ = difficulty;
    }

    static genesis() {
        return new Block({
            ts: 0,
            prevHash: "GENESIS",
            hash: "GENESIS",
            data: [],
            nonce: 0,
            difficulty: MININING_DIFFICULTY,
        });
    }

    static initProps(): BlockProps {
        return {
            ts: 0,
            hash: "",
            prevHash: "",
            data: "",
            nonce: 0,
            difficulty: MININING_DIFFICULTY,
        };
    }

    private static hash(
        ts: number,
        prevHash: string,
        data: any,
        nonce: number,
        difficulty: number
    ) {
        return SHA256(
            `${ts}${prevHash}${data}${nonce}${difficulty}`
        ).toString();
    }

    static mine(prevBlock: Block, data: any) {
        let nonce = 0;
        let hash: string;
        let ts: number;
        let { hash: prevHash, difficulty } = prevBlock;

        do {
            nonce++;
            ts = Date.now();
            difficulty = Block.adjustDifficulty(prevBlock, ts);
            hash = this.hash(ts, prevHash, data, nonce, difficulty);
        } while (!this.puzzleSolved(hash, difficulty));

        return new Block({
            ts,
            prevHash,
            data,
            hash,
            nonce,
            difficulty,
        });
    }

    private static puzzleSolved(hash: string, difficulty: number) {
        return hash.substring(0, difficulty) === "0".repeat(difficulty);
    }

    static computeHash(block: Block) {
        const { ts_, prevHash_, data_, nonce_, difficulty_ } = block;
        return this.hash(ts_, prevHash_, data_, nonce_, difficulty_);
    }

    static adjustDifficulty(prevBlock: Block, currentTime: number) {
        const { difficulty } = prevBlock;
        return prevBlock.timestamp + MINE_RATE > currentTime
            ? difficulty + 1
            : difficulty - 1;
    }

    toString() {
        return `Block - 
Timestamp  : ${this.ts_}
Prev Hash  : ${this.prevHash_.substring(0, 10)}
Hash       : ${this.hash_.substring(0, 10)}
Data       : ${this.data_}
Nonce      : ${this.nonce_}
Difficulty : ${this.difficulty_}`;
    }

    get hash() {
        return this.hash_;
    }

    get difficulty() {
        return this.difficulty_;
    }

    get prevHash() {
        return this.prevHash_;
    }

    set data(d: any) {
        this.data_ = d;
    }

    get timestamp() {
        return this.ts_;
    }

    set timestamp(ts: number) {
        this.ts_ = ts;
    }
}
