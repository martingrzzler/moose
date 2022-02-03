import { ec as EC } from "elliptic";
import { v1 as uuidV1 } from "uuid";
import { SHA256 } from "crypto-js";

export namespace Cryptography {
    const ec = new EC("secp256k1");
    export type KeyPair = EC.KeyPair;
    export type Signature = EC.Signature;

    export function genKeyPair(): KeyPair {
        return ec.genKeyPair();
    }

    export function id() {
        return uuidV1();
    }

    export function hash(data: any): string {
        return SHA256(JSON.stringify(data)).toString();
    }

    export function verifySignature(
        publicKey: string,
        signature: Signature,
        dataDash: string
    ) {
        return ec.keyFromPublic(publicKey, "hex").verify(dataDash, signature);
    }
}
