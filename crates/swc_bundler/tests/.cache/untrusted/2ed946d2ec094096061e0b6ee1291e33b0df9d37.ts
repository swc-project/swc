// Loaded from https://raw.githubusercontent.com/nats-io/nkeys.js/v1.0.0-7/src/nkeys.ts


/*
 * Copyright 2018-2020 The NATS Authors
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
import { KP } from "./kp.ts";
import { PublicKey } from "./public.ts";
import { Codec } from "./codec.ts";
import { getEd25519Helper } from "./helper.ts";

/**
 * @ignore
 */
export function createPair(prefix: Prefix): KeyPair {
  const rawSeed = getEd25519Helper().randomBytes(32);
  let str = Codec.encodeSeed(prefix, new Uint8Array(rawSeed));
  return new KP(str);
}

/**
 * Creates a KeyPair with an operator prefix
 * @returns {KeyPair} Returns the created KeyPair.
 */
export function createOperator(): KeyPair {
  return createPair(Prefix.Operator);
}

/**
 * Creates a KeyPair with an account prefix
 * @returns {KeyPair} Returns the created KeyPair.
 */
export function createAccount(): KeyPair {
  return createPair(Prefix.Account);
}

/**
 * Creates a KeyPair with an user prefix
 * @returns {KeyPair} Returns the created KeyPair.
 */
export function createUser(): KeyPair {
  return createPair(Prefix.User);
}

/**
 * @ignore
 */
export function createCluster(): KeyPair {
  return createPair(Prefix.Cluster);
}

/**
 * @ignore
 */
export function createServer(): KeyPair {
  return createPair(Prefix.Server);
}

/**
 * Creates a KeyPair from a specified public key
 * @param {string} Public key in string format
 * @returns {KeyPair} Returns the created KeyPair.
 * @see KeyPair#getPublicKey
 */
export function fromPublic(src: string): KeyPair {
  const ba = new TextEncoder().encode(src);
  const raw = Codec._decode(ba);
  const prefix = Prefixes.parsePrefix(raw[0]);
  if (Prefixes.isValidPublicPrefix(prefix)) {
    return new PublicKey(ba);
  }
  throw new NKeysError(NKeysErrorCode.InvalidPublicKey);
}

/**
 * Creates a KeyPair from a specified seed.
 * @param {Uint8Array} The seed key in Uint8Array
 * @returns {KeyPair} Returns the created KeyPair.
 * @see KeyPair#getSeed
 */
export function fromSeed(src: Uint8Array): KeyPair {
  Codec.decodeSeed(src);
  // if we are here it decoded
  return new KP(src);
}

export interface KeyPair {
  /**
   * Returns the public key associated with the KeyPair
   * @returns {string}
   * @throws NKeysError
   */
  getPublicKey(): string;

  /**
   * Returns the private key associated with the KeyPair
   * @returns Uint8Array
   * @throws NKeysError
   */
  getPrivateKey(): Uint8Array;

  /**
     * Returns the PrivateKey's seed.
     * @returns Uint8Array
     * @throws NKeysError
     */
  getSeed(): Uint8Array;

  /**
   * Returns the digital signature of signing the input with the
   * the KeyPair's private key.
   * @param {Uint8Array} input
   * @returns Uint8Array
   * @throws NKeysError
   */
  sign(input: Uint8Array): Uint8Array;

  /**
   * Returns true if the signature can be verified with the KeyPair
   * @param {Uint8Array} input
   * @param {Uint8Array} sig
   * @returns {boolean}
   * @throws NKeysError
   */
  verify(input: Uint8Array, sig: Uint8Array): boolean;

  /**
   * Clears the secret stored in the keypair. After clearing
   * a keypair cannot be used or recovered.
   */
  clear(): void;
}

/**
 * @ignore
 */
export enum Prefix {
  //Seed is the version byte used for encoded NATS Seeds
  Seed = 18 << 3, // Base32-encodes to 'S...'

  //PrefixBytePrivate is the version byte used for encoded NATS Private keys
  Private = 15 << 3, // Base32-encodes to 'P...'

  //PrefixByteOperator is the version byte used for encoded NATS Operators
  Operator = 14 << 3, // Base32-encodes to 'O...'

  //PrefixByteServer is the version byte used for encoded NATS Servers
  Server = 13 << 3, // Base32-encodes to 'N...'

  //PrefixByteCluster is the version byte used for encoded NATS Clusters
  Cluster = 2 << 3, // Base32-encodes to 'C...'

  //PrefixByteAccount is the version byte used for encoded NATS Accounts
  Account = 0, // Base32-encodes to 'A...'

  //PrefixByteUser is the version byte used for encoded NATS Users
  User = 20 << 3, // Base32-encodes to 'U...'
}

/**
 * @private
 */
export class Prefixes {
  static isValidPublicPrefix(prefix: Prefix): boolean {
    return prefix == Prefix.Server ||
      prefix == Prefix.Operator ||
      prefix == Prefix.Cluster ||
      prefix == Prefix.Account ||
      prefix == Prefix.User;
  }

  static startsWithValidPrefix(s: string) {
    let c = s[0];
    return c == "S" || c == "P" || c == "O" || c == "N" || c == "C" ||
      c == "A" || c == "U";
  }

  static isValidPrefix(prefix: Prefix): boolean {
    let v = this.parsePrefix(prefix);
    return v != -1;
  }

  static parsePrefix(v: number): Prefix {
    switch (v) {
      case Prefix.Seed:
        return Prefix.Seed;
      case Prefix.Private:
        return Prefix.Private;
      case Prefix.Operator:
        return Prefix.Operator;
      case Prefix.Server:
        return Prefix.Server;
      case Prefix.Cluster:
        return Prefix.Cluster;
      case Prefix.Account:
        return Prefix.Account;
      case Prefix.User:
        return Prefix.User;
      default:
        return -1;
    }
  }
}

/**
 * Possible error codes on exceptions thrown by the library.
 */
export enum NKeysErrorCode {
  InvalidPrefixByte = "nkeys: invalid prefix byte",
  InvalidKey = "nkeys: invalid key",
  InvalidPublicKey = "nkeys: invalid public key",
  InvalidSeedLen = "nkeys: invalid seed length",
  InvalidSeed = "nkeys: invalid seed",
  InvalidEncoding = "nkeys: invalid encoded key",
  InvalidSignature = "nkeys: signature verification failed",
  CannotSign = "nkeys: cannot sign, no private key available",
  PublicKeyOnly = "nkeys: no seed or private key available",
  InvalidChecksum = "nkeys: invalid checksum",
  SerializationError = "nkeys: serialization error",
  ApiError = "nkeys: api error",
  ClearedPair = "nkeys: pair is cleared",
}

export class NKeysError extends Error {
  name: string;
  code: string;
  chainedError?: Error;

  /**
   * @param {NKeysErrorCode} code
   * @param {Error} [chainedError]
   * @constructor
   *
   * @api private
   */
  constructor(code: NKeysErrorCode, chainedError?: Error) {
    super(code);
    this.name = "NKeysError";
    this.code = code;
    this.chainedError = chainedError;
  }
}
