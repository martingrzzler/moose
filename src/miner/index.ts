import { Blockchain } from "../blockchain";
import { P2PServer } from "../net/p2p-server";
import { Wallet } from "../wallet";
import { Transaction } from "../wallet/transaction";
import { TransactionPool } from "../wallet/transaction-pool";

interface MinerProps {
    chain: Blockchain;
    pool: TransactionPool;
    wallet: Wallet;
    p2pServer: P2PServer;
}

export class Miner {
    private chain_: Blockchain;
    private pool_: TransactionPool;
    private wallet_: Wallet;
    private p2pServer_: P2PServer;

    constructor({ chain, pool, wallet, p2pServer }: MinerProps) {
        this.chain_ = chain;
        this.pool_ = pool;
        this.wallet_ = wallet;
        this.p2pServer_ = p2pServer;
    }

    mine() {
        const validTransactions: Transaction[] = this.pool_.validTransactions();
        // reward for miner - coinbase field
        // create block for transactions
        // synchronize chains
        // clear transaction pool and sync clearance
    }
}
