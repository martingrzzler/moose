import { Blockchain } from "../blockchain";
import { Server, WebSocket } from "ws";
import { TransactionPool } from "../wallet/transaction-pool";

const P2P_PORT = process.env.P2P_PORT ? parseInt(process.env.P2P_PORT) : 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(",") : [];

export class P2PServer {
    private blockchain_: Blockchain;
    private sockets_: WebSocket[];
    private pool_: TransactionPool;

    constructor(blockchain: Blockchain, pool: TransactionPool) {
        this.blockchain_ = blockchain;
        this.sockets_ = [];
        this.pool_ = pool;
    }

    listen() {
        const server = new Server({ port: P2P_PORT });
        server.on("connection", (socket) => this.connectSocket(socket));

        this.connectToPeers();
        console.log(
            `Listening for peer-to-peer connections on port: ${P2P_PORT}`
        );
    }

    private connectSocket(socket: WebSocket) {
        this.sockets_.push(socket);
        console.log("Socket connected");

        this.handleMessage(socket);
        this.sendChain(socket);
    }

    private connectToPeers() {
        peers.forEach((addr) => {
            const socket = new WebSocket(addr);
            socket.on("open", () => this.connectSocket(socket));
        });
    }

    private handleMessage(socket: WebSocket) {
        socket.on("message", (msg: string) => {
            const otherChain = Blockchain.fromJSON(msg);
            try {
                this.blockchain_.replace(otherChain);
            } catch (error: any) {
                console.log(`Sync Chain Failure: ${error.message}`);
            }
        });
    }

    sendChain(socket: WebSocket) {
        socket.send(this.blockchain_.toJSON());
    }

    syncChains() {
        this.sockets_.forEach((socket) => this.sendChain(socket));
    }
}
