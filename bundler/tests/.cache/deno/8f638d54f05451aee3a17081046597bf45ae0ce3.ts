// Loaded from https://deno.land/x/sodium/basic_types.ts


// Type definitions for libsodium-wrappers 0.7
// Project: https://github.com/jedisct1/libsodium.js
// Definitions by: Florian Keller <https://github.com/ffflorian>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.1

// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

export type Uint8ArrayOutputFormat = "uint8array";

export type StringOutputFormat = "text" | "hex" | "base64";

export type KeyType = "curve25519" | "ed25519" | "x25519";

export enum base64_variants {
  ORIGINAL,
  ORIGINAL_NO_PADDING,
  URLSAFE,
  URLSAFE_NO_PADDING,
}

export interface CryptoBox {
  ciphertext: Uint8Array;
  mac: Uint8Array;
}

export interface StringCryptoBox {
  ciphertext: string;
  mac: string;
}

export interface CryptoKX {
  sharedRx: Uint8Array;
  sharedTx: Uint8Array;
}

export interface StringCryptoKX {
  sharedRx: string;
  sharedTx: string;
}

export interface KeyPair {
  keyType: KeyType;
  privateKey: Uint8Array;
  publicKey: Uint8Array;
}

export interface StringKeyPair {
  keyType: KeyType;
  privateKey: string;
  publicKey: string;
}

export interface SecretBox {
  cipher: Uint8Array;
  mac: Uint8Array;
}

export interface StringSecretBox {
  cipher: string;
  mac: string;
}

export interface StateAddress {
  name: string;
}

export interface MessageTag {
  message: Uint8Array;
  tag: number;
}

export interface StringMessageTag {
  message: string;
  tag: number;
}

export interface Sodium {
  readonly crypto_aead_chacha20poly1305_ABYTES: number;
  readonly crypto_aead_chacha20poly1305_ietf_ABYTES: number;
  readonly crypto_aead_chacha20poly1305_ietf_KEYBYTES: number;
  readonly crypto_aead_chacha20poly1305_ietf_MESSAGEBYTES_MAX: number;
  readonly crypto_aead_chacha20poly1305_ietf_NPUBBYTES: number;
  readonly crypto_aead_chacha20poly1305_ietf_NSECBYTES: number;
  readonly crypto_aead_chacha20poly1305_KEYBYTES: number;
  readonly crypto_aead_chacha20poly1305_MESSAGEBYTES_MAX: number;
  readonly crypto_aead_chacha20poly1305_NPUBBYTES: number;
  readonly crypto_aead_chacha20poly1305_NSECBYTES: number;
  readonly crypto_aead_xchacha20poly1305_ietf_ABYTES: number;
  readonly crypto_aead_xchacha20poly1305_ietf_KEYBYTES: number;
  readonly crypto_aead_xchacha20poly1305_ietf_MESSAGEBYTES_MAX: number;
  readonly crypto_aead_xchacha20poly1305_ietf_NPUBBYTES: number;
  readonly crypto_aead_xchacha20poly1305_ietf_NSECBYTES: number;
  readonly crypto_auth_BYTES: number;
  readonly crypto_auth_KEYBYTES: number;
  readonly crypto_box_BEFORENMBYTES: number;
  readonly crypto_box_MACBYTES: number;
  readonly crypto_box_MESSAGEBYTES_MAX: number;
  readonly crypto_box_NONCEBYTES: number;
  readonly crypto_box_PUBLICKEYBYTES: number;
  readonly crypto_box_SEALBYTES: number;
  readonly crypto_box_SECRETKEYBYTES: number;
  readonly crypto_box_SEEDBYTES: number;
  readonly crypto_generichash_BYTES_MAX: number;
  readonly crypto_generichash_BYTES_MIN: number;
  readonly crypto_generichash_BYTES: number;
  readonly crypto_generichash_KEYBYTES_MAX: number;
  readonly crypto_generichash_KEYBYTES_MIN: number;
  readonly crypto_generichash_KEYBYTES: number;
  readonly crypto_hash_BYTES: number;
  readonly crypto_kdf_BYTES_MAX: number;
  readonly crypto_kdf_BYTES_MIN: number;
  readonly crypto_kdf_CONTEXTBYTES: number;
  readonly crypto_kdf_KEYBYTES: number;
  readonly crypto_kx_PUBLICKEYBYTES: number;
  readonly crypto_kx_SECRETKEYBYTES: number;
  readonly crypto_kx_SEEDBYTES: number;
  readonly crypto_kx_SESSIONKEYBYTES: number;
  readonly crypto_pwhash_ALG_ARGON2I13: number;
  readonly crypto_pwhash_ALG_ARGON2ID13: number;
  readonly crypto_pwhash_ALG_DEFAULT: number;
  readonly crypto_pwhash_BYTES_MAX: number;
  readonly crypto_pwhash_BYTES_MIN: number;
  readonly crypto_pwhash_MEMLIMIT_INTERACTIVE: number;
  readonly crypto_pwhash_MEMLIMIT_MAX: number;
  readonly crypto_pwhash_MEMLIMIT_MIN: number;
  readonly crypto_pwhash_MEMLIMIT_MODERATE: number;
  readonly crypto_pwhash_MEMLIMIT_SENSITIVE: number;
  readonly crypto_pwhash_OPSLIMIT_INTERACTIVE: number;
  readonly crypto_pwhash_OPSLIMIT_MAX: number;
  readonly crypto_pwhash_OPSLIMIT_MIN: number;
  readonly crypto_pwhash_OPSLIMIT_MODERATE: number;
  readonly crypto_pwhash_OPSLIMIT_SENSITIVE: number;
  readonly crypto_pwhash_PASSWD_MAX: number;
  readonly crypto_pwhash_PASSWD_MIN: number;
  readonly crypto_pwhash_SALTBYTES: number;
  readonly crypto_pwhash_STR_VERIFY: number;
  readonly crypto_pwhash_STRBYTES: number;
  readonly crypto_pwhash_STRPREFIX: string;
  readonly crypto_scalarmult_BYTES: number;
  readonly crypto_scalarmult_SCALARBYTES: number;
  readonly crypto_secretbox_KEYBYTES: number;
  readonly crypto_secretbox_MACBYTES: number;
  readonly crypto_secretbox_MESSAGEBYTES_MAX: number;
  readonly crypto_secretbox_NONCEBYTES: number;
  readonly crypto_secretstream_xchacha20poly1305_ABYTES: number;
  readonly crypto_secretstream_xchacha20poly1305_HEADERBYTES: number;
  readonly crypto_secretstream_xchacha20poly1305_KEYBYTES: number;
  readonly crypto_secretstream_xchacha20poly1305_MESSAGEBYTES_MAX: number;
  readonly crypto_secretstream_xchacha20poly1305_TAG_FINAL: number;
  readonly crypto_secretstream_xchacha20poly1305_TAG_MESSAGE: number;
  readonly crypto_secretstream_xchacha20poly1305_TAG_PUSH: number;
  readonly crypto_secretstream_xchacha20poly1305_TAG_REKEY: number;
  readonly crypto_shorthash_BYTES: number;
  readonly crypto_shorthash_KEYBYTES: number;
  readonly crypto_sign_BYTES: number;
  readonly crypto_sign_MESSAGEBYTES_MAX: number;
  readonly crypto_sign_PUBLICKEYBYTES: number;
  readonly crypto_sign_SECRETKEYBYTES: number;
  readonly crypto_sign_SEEDBYTES: number;
  readonly randombytes_SEEDBYTES: number;
  readonly SODIUM_LIBRARY_VERSION_MAJOR: number;
  readonly SODIUM_LIBRARY_VERSION_MINOR: number;
  readonly SODIUM_VERSION_STRING: string;

  readonly ready: Promise<void>;

  add(a: Uint8Array, b: Uint8Array): void;

  compare(b1: Uint8Array, b2: Uint8Array): number;

  crypto_aead_chacha20poly1305_decrypt(
    secret_nonce: string | Uint8Array | null,
    ciphertext: string | Uint8Array,
    additional_data: string | Uint8Array | null,
    public_nonce: Uint8Array,
    key: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_aead_chacha20poly1305_decrypt(
    secret_nonce: string | Uint8Array | null,
    ciphertext: string | Uint8Array,
    additional_data: string | Uint8Array | null,
    public_nonce: Uint8Array,
    key: Uint8Array,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_aead_chacha20poly1305_decrypt_detached(
    secret_nonce: string | Uint8Array | null,
    ciphertext: string | Uint8Array,
    mac: Uint8Array,
    additional_data: string | Uint8Array | null,
    public_nonce: Uint8Array,
    key: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_aead_chacha20poly1305_decrypt_detached(
    secret_nonce: string | Uint8Array | null,
    ciphertext: string | Uint8Array,
    mac: Uint8Array,
    additional_data: string | Uint8Array | null,
    public_nonce: Uint8Array,
    key: Uint8Array,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_aead_chacha20poly1305_encrypt(
    message: string | Uint8Array,
    additional_data: string | Uint8Array | null,
    secret_nonce: string | Uint8Array | null,
    public_nonce: Uint8Array,
    key: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_aead_chacha20poly1305_encrypt(
    message: string | Uint8Array,
    additional_data: string | Uint8Array | null,
    secret_nonce: string | Uint8Array | null,
    public_nonce: Uint8Array,
    key: Uint8Array,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_aead_chacha20poly1305_encrypt_detached(
    message: string | Uint8Array,
    additional_data: string | Uint8Array | null,
    secret_nonce: string | Uint8Array | null,
    public_nonce: Uint8Array,
    key: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): CryptoBox;
  crypto_aead_chacha20poly1305_encrypt_detached(
    message: string | Uint8Array,
    additional_data: string | Uint8Array | null,
    secret_nonce: string | Uint8Array | null,
    public_nonce: Uint8Array,
    key: Uint8Array,
    outputFormat: StringOutputFormat,
  ): StringCryptoBox;

  crypto_aead_chacha20poly1305_ietf_decrypt(
    secret_nonce: string | Uint8Array | null,
    ciphertext: string | Uint8Array,
    additional_data: string | Uint8Array | null,
    public_nonce: Uint8Array,
    key: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_aead_chacha20poly1305_ietf_decrypt(
    secret_nonce: string | Uint8Array | null,
    ciphertext: string | Uint8Array,
    additional_data: string | Uint8Array | null,
    public_nonce: Uint8Array,
    key: Uint8Array,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_aead_chacha20poly1305_ietf_decrypt_detached(
    secret_nonce: string | Uint8Array | null,
    ciphertext: string | Uint8Array,
    mac: Uint8Array,
    additional_data: string | Uint8Array | null,
    public_nonce: Uint8Array,
    key: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_aead_chacha20poly1305_ietf_decrypt_detached(
    secret_nonce: string | Uint8Array | null,
    ciphertext: string | Uint8Array,
    mac: Uint8Array,
    additional_data: string | Uint8Array | null,
    public_nonce: Uint8Array,
    key: Uint8Array,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_aead_chacha20poly1305_ietf_encrypt(
    message: string | Uint8Array,
    additional_data: string | Uint8Array | null,
    secret_nonce: string | Uint8Array | null,
    public_nonce: Uint8Array,
    key: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_aead_chacha20poly1305_ietf_encrypt(
    message: string | Uint8Array,
    additional_data: string | Uint8Array | null,
    secret_nonce: string | Uint8Array | null,
    public_nonce: Uint8Array,
    key: Uint8Array,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_aead_chacha20poly1305_ietf_encrypt_detached(
    message: string | Uint8Array,
    additional_data: string | Uint8Array | null,
    secret_nonce: string | Uint8Array | null,
    public_nonce: Uint8Array,
    key: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): CryptoBox;
  crypto_aead_chacha20poly1305_ietf_encrypt_detached(
    message: string | Uint8Array,
    additional_data: string | Uint8Array | null,
    secret_nonce: string | Uint8Array | null,
    public_nonce: Uint8Array,
    key: Uint8Array,
    outputFormat: StringOutputFormat,
  ): StringCryptoBox;

  crypto_aead_chacha20poly1305_ietf_keygen(
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_aead_chacha20poly1305_ietf_keygen(
    outputFormat: StringOutputFormat,
  ): string;

  crypto_aead_chacha20poly1305_keygen(
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_aead_chacha20poly1305_keygen(outputFormat: StringOutputFormat): string;

  crypto_aead_xchacha20poly1305_ietf_decrypt(
    secret_nonce: string | Uint8Array | null,
    ciphertext: string | Uint8Array,
    additional_data: string | Uint8Array | null,
    public_nonce: Uint8Array,
    key: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_aead_xchacha20poly1305_ietf_decrypt(
    secret_nonce: string | Uint8Array | null,
    ciphertext: string | Uint8Array,
    additional_data: string | Uint8Array | null,
    public_nonce: Uint8Array,
    key: Uint8Array,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_aead_xchacha20poly1305_ietf_decrypt_detached(
    secret_nonce: string | Uint8Array | null,
    ciphertext: string | Uint8Array,
    mac: Uint8Array,
    additional_data: string | Uint8Array | null,
    public_nonce: Uint8Array,
    key: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_aead_xchacha20poly1305_ietf_decrypt_detached(
    secret_nonce: string | Uint8Array | null,
    ciphertext: string | Uint8Array,
    mac: Uint8Array,
    additional_data: string | Uint8Array | null,
    public_nonce: Uint8Array,
    key: Uint8Array,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_aead_xchacha20poly1305_ietf_encrypt(
    message: string | Uint8Array,
    additional_data: string | Uint8Array | null,
    secret_nonce: string | Uint8Array | null,
    public_nonce: Uint8Array,
    key: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_aead_xchacha20poly1305_ietf_encrypt(
    message: string | Uint8Array,
    additional_data: string | Uint8Array | null,
    secret_nonce: string | Uint8Array | null,
    public_nonce: Uint8Array,
    key: Uint8Array,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_aead_xchacha20poly1305_ietf_encrypt_detached(
    message: string | Uint8Array,
    additional_data: string | Uint8Array | null,
    secret_nonce: string | Uint8Array | null,
    public_nonce: Uint8Array,
    key: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): CryptoBox;
  crypto_aead_xchacha20poly1305_ietf_encrypt_detached(
    message: string | Uint8Array,
    additional_data: string | Uint8Array | null,
    secret_nonce: string | Uint8Array | null,
    public_nonce: Uint8Array,
    key: Uint8Array,
    outputFormat: StringOutputFormat,
  ): StringCryptoBox;

  crypto_aead_xchacha20poly1305_ietf_keygen(
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_aead_xchacha20poly1305_ietf_keygen(
    outputFormat: StringOutputFormat,
  ): string;

  crypto_auth(
    message: string | Uint8Array,
    key: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_auth(
    message: string | Uint8Array,
    key: Uint8Array,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_auth_keygen(outputFormat?: Uint8ArrayOutputFormat | null): Uint8Array;
  crypto_auth_keygen(outputFormat: StringOutputFormat): string;

  crypto_auth_verify(
    tag: Uint8Array,
    message: string | Uint8Array,
    key: Uint8Array,
  ): boolean;

  crypto_box_beforenm(
    publicKey: Uint8Array,
    privateKey: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_box_beforenm(
    publicKey: Uint8Array,
    privateKey: Uint8Array,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_box_detached(
    message: string | Uint8Array,
    nonce: Uint8Array,
    publicKey: Uint8Array,
    privateKey: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): CryptoBox;
  crypto_box_detached(
    message: string | Uint8Array,
    nonce: Uint8Array,
    publicKey: Uint8Array,
    privateKey: Uint8Array,
    outputFormat: StringOutputFormat,
  ): StringCryptoBox;

  crypto_box_easy(
    message: string | Uint8Array,
    nonce: Uint8Array,
    publicKey: Uint8Array,
    privateKey: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_box_easy(
    message: string | Uint8Array,
    nonce: Uint8Array,
    publicKey: Uint8Array,
    privateKey: Uint8Array,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_box_easy_afternm(
    message: string | Uint8Array,
    nonce: Uint8Array,
    sharedKey: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_box_easy_afternm(
    message: string | Uint8Array,
    nonce: Uint8Array,
    sharedKey: Uint8Array,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_box_keypair(outputFormat?: Uint8ArrayOutputFormat | null): KeyPair;
  crypto_box_keypair(outputFormat: StringOutputFormat): StringKeyPair;

  crypto_box_open_detached(
    ciphertext: string | Uint8Array,
    mac: Uint8Array,
    nonce: Uint8Array,
    publicKey: Uint8Array,
    privateKey: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_box_open_detached(
    ciphertext: string | Uint8Array,
    mac: Uint8Array,
    nonce: Uint8Array,
    publicKey: Uint8Array,
    privateKey: Uint8Array,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_box_open_easy(
    ciphertext: string | Uint8Array,
    nonce: Uint8Array,
    publicKey: Uint8Array,
    privateKey: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_box_open_easy(
    ciphertext: string | Uint8Array,
    nonce: Uint8Array,
    publicKey: Uint8Array,
    privateKey: Uint8Array,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_box_open_easy_afternm(
    ciphertext: string | Uint8Array,
    nonce: Uint8Array,
    sharedKey: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_box_open_easy_afternm(
    ciphertext: string | Uint8Array,
    nonce: Uint8Array,
    sharedKey: Uint8Array,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_box_seal(
    message: string | Uint8Array,
    publicKey: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_box_seal(
    message: string | Uint8Array,
    publicKey: Uint8Array,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_box_seal_open(
    ciphertext: string | Uint8Array,
    publicKey: Uint8Array,
    privateKey: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_box_seal_open(
    ciphertext: string | Uint8Array,
    publicKey: Uint8Array,
    privateKey: Uint8Array,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_box_seed_keypair(
    seed: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): KeyPair;
  crypto_box_seed_keypair(
    seed: Uint8Array,
    outputFormat: StringOutputFormat,
  ): StringKeyPair;

  crypto_generichash(
    hash_length: number,
    message: string | Uint8Array,
    key?: string | Uint8Array | null,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_generichash(
    hash_length: number,
    message: string | Uint8Array,
    key: string | Uint8Array | null,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_generichash_final(
    state_address: StateAddress,
    hash_length: number,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_generichash_final(
    state_address: StateAddress,
    hash_length: number,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_generichash_init(
    key: string | Uint8Array | null,
    hash_length: number,
  ): StateAddress;

  crypto_generichash_keygen(
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_generichash_keygen(outputFormat: StringOutputFormat): string;

  crypto_generichash_update(
    state_address: StateAddress,
    message_chunk: string | Uint8Array,
  ): void;

  crypto_hash(
    message: string | Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_hash(
    message: string | Uint8Array,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_kdf_derive_from_key(
    subkey_len: number,
    subkey_id: number,
    ctx: string,
    key: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_kdf_derive_from_key(
    subkey_len: number,
    subkey_id: number,
    ctx: string,
    key: Uint8Array,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_kdf_keygen(outputFormat?: Uint8ArrayOutputFormat | null): Uint8Array;
  crypto_kdf_keygen(outputFormat: StringOutputFormat): string;

  crypto_kx_client_session_keys(
    clientPublicKey: Uint8Array,
    clientSecretKey: Uint8Array,
    serverPublicKey: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): CryptoKX;
  crypto_kx_client_session_keys(
    clientPublicKey: Uint8Array,
    clientSecretKey: Uint8Array,
    serverPublicKey: Uint8Array,
    outputFormat: StringOutputFormat,
  ): StringCryptoKX;

  crypto_kx_keypair(outputFormat?: Uint8ArrayOutputFormat | null): KeyPair;
  crypto_kx_keypair(outputFormat: StringOutputFormat): StringKeyPair;

  crypto_kx_seed_keypair(
    seed: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): KeyPair;
  crypto_kx_seed_keypair(
    seed: Uint8Array,
    outputFormat: StringOutputFormat,
  ): StringKeyPair;

  crypto_kx_server_session_keys(
    serverPublicKey: Uint8Array,
    serverSecretKey: Uint8Array,
    clientPublicKey: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): CryptoKX;
  crypto_kx_server_session_keys(
    serverPublicKey: Uint8Array,
    serverSecretKey: Uint8Array,
    clientPublicKey: Uint8Array,
    outputFormat: StringOutputFormat,
  ): StringCryptoKX;

  crypto_pwhash(
    keyLength: number,
    password: string | Uint8Array,
    salt: Uint8Array,
    opsLimit: number,
    memLimit: number,
    algorithm: number,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_pwhash(
    keyLength: number,
    password: string | Uint8Array,
    salt: Uint8Array,
    opsLimit: number,
    memLimit: number,
    algorithm: number,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_pwhash_str(
    password: string | Uint8Array,
    opsLimit: number,
    memLimit: number,
  ): string;

  crypto_pwhash_str_needs_rehash(
    hashed_password: string | Uint8Array,
    opsLimit: number,
    memLimit: number,
  ): boolean;

  crypto_pwhash_str_verify(
    hashed_password: string,
    password: string | Uint8Array,
  ): boolean;

  crypto_scalarmult(
    privateKey: Uint8Array,
    publicKey: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_scalarmult(
    privateKey: Uint8Array,
    publicKey: Uint8Array,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_scalarmult_base(
    privateKey: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_scalarmult_base(
    privateKey: Uint8Array,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_secretbox_detached(
    message: string | Uint8Array,
    nonce: Uint8Array,
    key: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): SecretBox;
  crypto_secretbox_detached(
    message: string | Uint8Array,
    nonce: Uint8Array,
    key: Uint8Array,
    outputFormat: StringOutputFormat,
  ): StringSecretBox;

  crypto_secretbox_easy(
    message: string | Uint8Array,
    nonce: Uint8Array,
    key: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_secretbox_easy(
    message: string | Uint8Array,
    nonce: Uint8Array,
    key: Uint8Array,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_secretbox_keygen(
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_secretbox_keygen(outputFormat: StringOutputFormat): string;

  crypto_secretbox_open_detached(
    ciphertext: string | Uint8Array,
    mac: Uint8Array,
    nonce: Uint8Array,
    key: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_secretbox_open_detached(
    ciphertext: string | Uint8Array,
    mac: Uint8Array,
    nonce: Uint8Array,
    key: Uint8Array,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_secretbox_open_easy(
    ciphertext: string | Uint8Array,
    nonce: Uint8Array,
    key: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_secretbox_open_easy(
    ciphertext: string | Uint8Array,
    nonce: Uint8Array,
    key: Uint8Array,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_secretstream_xchacha20poly1305_init_pull(
    header: Uint8Array,
    key: Uint8Array,
  ): StateAddress;

  crypto_secretstream_xchacha20poly1305_init_push(
    key: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): { state: StateAddress; header: Uint8Array };
  crypto_secretstream_xchacha20poly1305_init_push(
    key: Uint8Array,
    outputFormat: StringOutputFormat,
  ): { state: StateAddress; header: string };

  crypto_secretstream_xchacha20poly1305_keygen(
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_secretstream_xchacha20poly1305_keygen(
    outputFormat: StringOutputFormat,
  ): string;

  crypto_secretstream_xchacha20poly1305_pull(
    state_address: StateAddress,
    cipher: string | Uint8Array,
    ad?: string | Uint8Array | null,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): MessageTag;
  crypto_secretstream_xchacha20poly1305_pull(
    state_address: StateAddress,
    cipher: string | Uint8Array,
    ad: string | Uint8Array | null,
    outputFormat: StringOutputFormat,
  ): StringMessageTag;

  crypto_secretstream_xchacha20poly1305_push(
    state_address: StateAddress,
    message_chunk: string | Uint8Array,
    ad: string | Uint8Array | null,
    tag: number,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_secretstream_xchacha20poly1305_push(
    state_address: StateAddress,
    message_chunk: string | Uint8Array,
    ad: string | Uint8Array | null,
    tag: number,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_secretstream_xchacha20poly1305_rekey(
    state_address: StateAddress,
  ): true;

  crypto_shorthash(
    message: string | Uint8Array,
    key: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_shorthash(
    message: string | Uint8Array,
    key: Uint8Array,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_shorthash_keygen(
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_shorthash_keygen(outputFormat: StringOutputFormat): string;

  crypto_sign(
    message: string | Uint8Array,
    privateKey: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_sign(
    message: string | Uint8Array,
    privateKey: Uint8Array,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_sign_detached(
    message: string | Uint8Array,
    privateKey: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_sign_detached(
    message: string | Uint8Array,
    privateKey: Uint8Array,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_sign_ed25519_pk_to_curve25519(
    edPk: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_sign_ed25519_pk_to_curve25519(
    edPk: Uint8Array,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_sign_ed25519_sk_to_curve25519(
    edSk: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_sign_ed25519_sk_to_curve25519(
    edSk: Uint8Array,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_sign_final_create(
    state_address: StateAddress,
    privateKey: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_sign_final_create(
    state_address: StateAddress,
    privateKey: Uint8Array,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_sign_final_verify(
    state_address: StateAddress,
    signature: Uint8Array,
    publicKey: Uint8Array,
  ): boolean;

  crypto_sign_init(): StateAddress;

  crypto_sign_keypair(outputFormat?: Uint8ArrayOutputFormat | null): KeyPair;
  crypto_sign_keypair(outputFormat: StringOutputFormat): StringKeyPair;

  crypto_sign_open(
    signedMessage: string | Uint8Array,
    publicKey: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  crypto_sign_open(
    signedMessage: string | Uint8Array,
    publicKey: Uint8Array,
    outputFormat: StringOutputFormat,
  ): string;

  crypto_sign_seed_keypair(
    seed: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): KeyPair;
  crypto_sign_seed_keypair(
    seed: Uint8Array,
    outputFormat: StringOutputFormat,
  ): StringKeyPair;

  crypto_sign_update(
    state_address: StateAddress,
    message_chunk: string | Uint8Array,
  ): void;

  crypto_sign_verify_detached(
    signature: Uint8Array,
    message: string | Uint8Array,
    publicKey: Uint8Array,
  ): boolean;

  from_base64(input: string, variant?: base64_variants): Uint8Array;

  from_hex(input: string): Uint8Array;

  from_string(str: string): Uint8Array;

  increment(bytes: Uint8Array): void;

  is_zero(bytes: Uint8Array): boolean;

  memcmp(b1: Uint8Array, b2: Uint8Array): boolean;

  memzero(bytes: Uint8Array): void;

  output_formats(): Array<Uint8ArrayOutputFormat | StringOutputFormat>;

  pad(buf: Uint8Array, blocksize: number): Uint8Array;

  randombytes_buf(
    length: number,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  randombytes_buf(length: number, outputFormat: StringOutputFormat): string;

  randombytes_buf_deterministic(
    length: number,
    seed: Uint8Array,
    outputFormat?: Uint8ArrayOutputFormat | null,
  ): Uint8Array;
  randombytes_buf_deterministic(
    length: number,
    seed: Uint8Array,
    outputFormat: StringOutputFormat,
  ): string;

  randombytes_close(): void;

  randombytes_random(): number;

  randombytes_stir(): void;

  randombytes_uniform(upper_bound: number): number;

  sodium_version_string(): string;

  symbols(): string[];

  to_base64(input: string | Uint8Array, variant?: base64_variants): string;

  to_hex(input: string | Uint8Array): string;

  to_string(bytes: Uint8Array): string;

  unpad(buf: Uint8Array, blocksize: number): Uint8Array;
}
