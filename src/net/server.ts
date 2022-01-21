import express from "express";
import { Blockchain } from "../blockchain";
import { Block } from "../blockchain/block";

const PORT = process.env || 1234;

const app = express();
const chain = new Blockchain();

app.get("/blocks", (req, res) => {
    res.json(chain.data);
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});
