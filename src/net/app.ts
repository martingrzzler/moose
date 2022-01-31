import express from "express";
import { Blockchain } from "../blockchain";
import { P2PServer } from "./p2p-server";

const PORT = process.env.HTTP_PORT || 8001;

const app = express();
app.use(express.json());

const chain = new Blockchain();
const p2pServer = new P2PServer(chain);

app.get("/blocks", (req, res) => {
    res.json(chain.data);
});

app.post("/mine", (req, res) => {
    const block = chain.add(req.body.data);
    console.log(`New Block added: ${block.toString()}\n`);

    p2pServer.syncChains();

    res.statusCode = 200;
    res.send();
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});
p2pServer.listen();
