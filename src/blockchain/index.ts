import { Block } from "../block";

export class Blockchain {
    private chain_: Block[];
    constructor() {
        this.chain_ = [Block.genesis()];
    }

    add(data: string[]) {
        const block = Block.mine(this.last, data);
        this.chain_.push(block);
        return block;
    }

    isValid() {
        if (!this.firstIsGenesis()) return false;

        for (let i = 1; i < this.chain_.length; i++) {
            const block = this.chain_[i];
            const prevBlock = this.chain_[i - 1];

            if (
                block.prevHash !== prevBlock.hash ||
                block.hash !== Block.computeHash(block)
            ) {
                return false;
            }
        }
        return true;
    }

    at(index: number) {
        return this.chain_[index];
    }

    set(index: number, block: Block) {
        this.chain_[index] = block;
    }

    get last() {
        return this.chain_[this.length - 1];
    }

    get length() {
        return this.chain_.length;
    }

    private firstIsGenesis() {
        if (JSON.stringify(this.chain_[0]) === JSON.stringify(Block.genesis()))
            return true;

        return false;
    }
}
