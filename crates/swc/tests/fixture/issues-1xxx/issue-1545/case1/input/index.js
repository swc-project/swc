import { createHash, createHmac } from 'crypto-browserify';

let hash = createHash(algorithm);
let hmac = createHmac(fn, key);