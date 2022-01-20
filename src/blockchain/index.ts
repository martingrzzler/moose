import { Block } from "../block";

export class Blockchain {
    private chain: Block[];
    constructor(genesis: Block) {
        this.chain = [genesis];
    }

    add(data: string[]) {
        const prevBlock = this.chain[this.chain.length - 1];
        const block = Block.hashed(prevBlock, data);
        this.chain.push(block);
        return block;
    }

    at(index: number) {
        return this.chain[index];
    }
}
