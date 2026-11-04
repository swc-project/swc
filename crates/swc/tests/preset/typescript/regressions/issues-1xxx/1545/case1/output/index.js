import { createHash, createHmac } from "crypto-browserify";
var hash = createHash(algorithm);
var hmac = createHmac(fn, key);
