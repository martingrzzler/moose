import { ec as EC } from "elliptic";
import { v1 as uuidV1 } from "uuid";

export namespace Cryptography {
    const ec = new EC("secp256k1");
    export type KeyPair = EC.KeyPair;

    export function genKeyPair(): KeyPair {
        return ec.genKeyPair();
    }

    export function id() {
        return uuidV1();
    }
}
