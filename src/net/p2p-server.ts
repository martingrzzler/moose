import { Blockchain } from "../blockchain";
import { Server, WebSocket } from "ws";
import { TransactionPool } from "../wallet/transaction-pool";
import { Transaction } from "../wallet/transaction";

const P2P_PORT = process.env.P2P_PORT ? parseInt(process.env.P2P_PORT) : 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(",") : [];

enum Type {
    CHAIN = "CHAIN",
    TRANSACTION = "TRANSACTION",
}

interface Message {
    type: Type;
    data: any;
}

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
        socket.on("message", (data: string) => {
            try {
                const message: Message = JSON.parse(data);

                switch (message.type) {
                    case Type.CHAIN:
                        this.blockchain_.replace(
                            Blockchain.fromJSON(message.data)
                        );
                        break;
                    case Type.TRANSACTION:
                        this.pool_.updateOrAdd(
                            Transaction.fromJSON(message.data)
                        );
                        break;
                    default:
                        throw new Error(
                            `Unsupported message type: Message: ${data}`
                        );
                }
            } catch (error: any) {
                console.log(`Error with Message: ${error.message}`);
            }
        });
    }

    sendMessage(s: WebSocket, m: Message) {
        s.send(JSON.stringify(m));
    }

    sendChain(socket: WebSocket) {
        const msg: Message = {
            type: Type.CHAIN,
            data: this.blockchain_.toJSON(),
        };
        this.sendMessage(socket, msg);
    }

    sendTransaction(s: WebSocket, t: Transaction) {
        const msg: Message = {
            type: Type.TRANSACTION,
            data: Transaction.toJSON(t),
        };
        this.sendMessage(s, msg);
    }

    syncChains() {
        this.sockets_.forEach((socket) => this.sendChain(socket));
    }

    broadcastTransaction(t: Transaction) {
        this.sockets_.forEach((s) => this.sendTransaction(s, t));
    }
}
