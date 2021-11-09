// Loaded from https://raw.githubusercontent.com/nats-io/nkeys.js/v1.0.0-9/src/helper.ts


/*
 * Copyright 2020 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @ignore
 */
interface SignPair {
  publicKey: Uint8Array;
  secretKey: Uint8Array;
}
/**
 * @ignore
 */
export interface Ed25519Helper {
  fromSeed(seed: Uint8Array): SignPair;
  sign(data: Uint8Array, key: Uint8Array): Uint8Array;
  verify(data: Uint8Array, sig: Uint8Array, pub: Uint8Array): boolean;
  randomBytes(len: number): Uint8Array;
}
/**
 * @ignore
 */
let helper: Ed25519Helper;
/**
 * @ignore
 */
export function setEd25519Helper(lib: Ed25519Helper) {
  helper = lib;
}
/**
 * @ignore
 */
export function getEd25519Helper() {
  return helper;
}
