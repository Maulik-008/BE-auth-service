import crypto from "crypto";
import fs from "fs";

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
    },
    privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
    },
});

fs.writeFileSync("certs/public.pem", publicKey, "utf8");
fs.writeFileSync("certs/private.pem", privateKey, "utf8");

console.log(publicKey);
console.log(privateKey);
