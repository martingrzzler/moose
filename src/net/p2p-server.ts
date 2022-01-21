import { Blockchain } from "../blockchain";
import { Server, WebSocket } from "ws";

const P2P_PORT = process.env.P2P_PORT ? parseInt(process.env.P2P_PORT) : 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(",") : [];

export class P2PServer {
    private blockchain_: Blockchain;
    private sockets_: WebSocket[];

    constructor(blockchain: Blockchain) {
        this.blockchain_ = blockchain;
        this.sockets_ = [];
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
        socket.send(JSON.stringify(this.blockchain_.data));
    }

    private connectToPeers() {
        peers.forEach((addr) => {
            const socket = new WebSocket(addr);
            socket.on("open", () => this.connectSocket(socket));
        });
    }

    private handleMessage(socket: WebSocket) {
        socket.on("message", (msg) => {
            const data = JSON.parse(msg.toString());
            console.log("Received Message: ", data);
        });
    }
}
