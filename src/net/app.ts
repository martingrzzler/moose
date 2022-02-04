import express from "express";
import { Blockchain } from "../blockchain";
import { Wallet } from "../wallet";
import { TransactionPool } from "../wallet/transaction-pool";
import { P2PServer } from "./p2p-server";

const PORT = process.env.HTTP_PORT || 8001;

const app = express();
app.use(express.json());

const chain = new Blockchain();
const wallet = new Wallet();
const pool = new TransactionPool();
const p2pServer = new P2PServer(chain, pool);

app.get("/blocks", (req, res) => {
    res.json(chain.data);
});

app.post("/mine", (req, res) => {
    const block = chain.add(req.body.data);
    console.log(`New Block added: ${block.toString()}\n`);

    p2pServer.syncChains();

    res.send(block);
});

app.get("/transactions", (req, res) => {
    res.json(pool.transactions);
});

app.post("/transact", (req, res) => {
    const { recipient, amount } = req.body;
    const t = wallet.createTransaction(recipient, amount, pool);
    p2pServer.broadcastTransaction(t);
    res.json(t);
});

app.get("/public-key", (req, res) => {
    res.json({ publicKey: wallet.publicKey });
});
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});

p2pServer.listen();
