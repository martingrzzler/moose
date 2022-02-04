import { Block, BlockProps } from "./block";

export class Blockchain {
    private chain_: Block[];
    constructor() {
        this.chain_ = [Block.genesis()];
    }

    add(data: any) {
        const block = Block.mine(this.last, data);
        this.chain_.push(block);
        return block;
    }

    isValid() {
        if (!this.firstIsGenesis()) return false;

        for (let i = 1; i < this.length; i++) {
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

    get data() {
        return this.chain_;
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

    replace(newChain: Blockchain) {
        if (!this.isLonger(newChain))
            throw new Error("new chain is not longer than the current chain");
        if (!newChain.isValid()) {
            throw new Error("the new chain is not valid");
        }

        this.chain_ = newChain.chain_;
    }

    isLonger(other: Blockchain) {
        return other.length > this.length;
    }

    toJSON() {
        return JSON.stringify(this.chain_);
    }

    static derserialize(data: any): Blockchain {
        const chain = new Blockchain();
        chain.chain_ = data.map((b: BlockProps) =>
            Object.assign(new Block(Block.initProps()), b)
        );
        return chain;
    }
}
