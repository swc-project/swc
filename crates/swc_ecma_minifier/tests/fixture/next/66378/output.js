import { concat, fromString, toString } from "uint8arrays";
import { x25519 } from "@noble/curves/ed25519";
import { varint } from "multiformats";
import { decode, encode } from "multibase";
import { secp256k1 } from "@noble/curves/secp256k1";
import { p256 } from "@noble/curves/p256";
const u8a = {
    toString,
    fromString,
    concat
};
export function bytesToBase64url(b) {
    return u8a.toString(b, 'base64url');
}
export function base64ToBytes(s) {
    const inputBase64Url = s.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    return u8a.fromString(inputBase64Url, 'base64url');
}
export function bytesToBase64(b) {
    return u8a.toString(b, 'base64pad');
}
export function base58ToBytes(s) {
    return u8a.fromString(s, 'base58btc');
}
export function bytesToBase58(b) {
    return u8a.toString(b, 'base58btc');
}
export const SUPPORTED_PUBLIC_KEY_TYPES = {
    ES256: [
        'JsonWebKey2020',
        'Multikey',
        'EcdsaSecp256r1VerificationKey2019'
    ],
    ES256K: [
        'EcdsaSecp256k1VerificationKey2019',
        /**
     * Equivalent to EcdsaSecp256k1VerificationKey2019 when key is an ethereumAddress
     */ 'EcdsaSecp256k1RecoveryMethod2020',
        /**
     * @deprecated, supported for backward compatibility. Equivalent to EcdsaSecp256k1VerificationKey2019 when key is
     *   not an ethereumAddress
     */ 'Secp256k1VerificationKey2018',
        /**
     * @deprecated, supported for backward compatibility. Equivalent to EcdsaSecp256k1VerificationKey2019 when key is
     *   not an ethereumAddress
     */ 'Secp256k1SignatureVerificationKey2018',
        /**
     * @deprecated, supported for backward compatibility. Equivalent to EcdsaSecp256k1VerificationKey2019 when key is
     *   not an ethereumAddress
     */ 'EcdsaPublicKeySecp256k1',
        /**
     *  TODO - support R1 key as well
     *   'ConditionalProof2022',
     */ 'JsonWebKey2020',
        'Multikey'
    ],
    'ES256K-R': [
        'EcdsaSecp256k1VerificationKey2019',
        /**
     * Equivalent to EcdsaSecp256k1VerificationKey2019 when key is an ethereumAddress
     */ 'EcdsaSecp256k1RecoveryMethod2020',
        /**
     * @deprecated, supported for backward compatibility. Equivalent to EcdsaSecp256k1VerificationKey2019 when key is
     *   not an ethereumAddress
     */ 'Secp256k1VerificationKey2018',
        /**
     * @deprecated, supported for backward compatibility. Equivalent to EcdsaSecp256k1VerificationKey2019 when key is
     *   not an ethereumAddress
     */ 'Secp256k1SignatureVerificationKey2018',
        /**
     * @deprecated, supported for backward compatibility. Equivalent to EcdsaSecp256k1VerificationKey2019 when key is
     *   not an ethereumAddress
     */ 'EcdsaPublicKeySecp256k1',
        'ConditionalProof2022',
        'JsonWebKey2020',
        'Multikey'
    ],
    Ed25519: [
        'ED25519SignatureVerification',
        'Ed25519VerificationKey2018',
        'Ed25519VerificationKey2020',
        'JsonWebKey2020',
        'Multikey'
    ],
    EdDSA: [
        'ED25519SignatureVerification',
        'Ed25519VerificationKey2018',
        'Ed25519VerificationKey2020',
        'JsonWebKey2020',
        'Multikey'
    ]
};
export const VM_TO_KEY_TYPE = {
    Secp256k1SignatureVerificationKey2018: 'Secp256k1',
    Secp256k1VerificationKey2018: 'Secp256k1',
    EcdsaSecp256k1VerificationKey2019: 'Secp256k1',
    EcdsaPublicKeySecp256k1: 'Secp256k1',
    EcdsaSecp256k1RecoveryMethod2020: 'Secp256k1',
    EcdsaSecp256r1VerificationKey2019: 'P-256',
    Ed25519VerificationKey2018: 'Ed25519',
    Ed25519VerificationKey2020: 'Ed25519',
    ED25519SignatureVerification: 'Ed25519',
    X25519KeyAgreementKey2019: 'X25519',
    X25519KeyAgreementKey2020: 'X25519',
    ConditionalProof2022: void 0,
    JsonWebKey2020: void 0,
    Multikey: void 0
};
// this is from the multicodec table https://github.com/multiformats/multicodec/blob/master/table.csv
export const supportedCodecs = {
    'ed25519-pub': 0xed,
    'x25519-pub': 0xec,
    'secp256k1-pub': 0xe7,
    'bls12_381-g1-pub': 0xea,
    'bls12_381-g2-pub': 0xeb,
    'p256-pub': 0x1200
};
export const CODEC_TO_KEY_TYPE = {
    'bls12_381-g1-pub': 'Bls12381G1',
    'bls12_381-g2-pub': 'Bls12381G2',
    'ed25519-pub': 'Ed25519',
    'p256-pub': 'P-256',
    'secp256k1-pub': 'Secp256k1',
    'x25519-pub': 'X25519'
};
/**
 * Extracts the raw byte representation of a public key from a VerificationMethod along with an inferred key type
 * @param pk a VerificationMethod entry from a DIDDocument
 * @return an object containing the `keyBytes` of the public key and an inferred `keyType`
 */ export function extractPublicKeyBytes(pk) {
    if (pk.publicKeyBase58) return {
        keyBytes: base58ToBytes(pk.publicKeyBase58),
        keyType: VM_TO_KEY_TYPE[pk.type]
    };
    if (pk.publicKeyBase64) return {
        keyBytes: base64ToBytes(pk.publicKeyBase64),
        keyType: VM_TO_KEY_TYPE[pk.type]
    };
    if (pk.publicKeyHex) return {
        keyBytes: hexToBytes(pk.publicKeyHex),
        keyType: VM_TO_KEY_TYPE[pk.type]
    };
    if (pk.publicKeyJwk && 'secp256k1' === pk.publicKeyJwk.crv && pk.publicKeyJwk.x && pk.publicKeyJwk.y) return {
        keyBytes: secp256k1.ProjectivePoint.fromAffine({
            x: bytesToBigInt(base64ToBytes(pk.publicKeyJwk.x)),
            y: bytesToBigInt(base64ToBytes(pk.publicKeyJwk.y))
        }).toRawBytes(!1),
        keyType: 'Secp256k1'
    };
    if (pk.publicKeyJwk && 'P-256' === pk.publicKeyJwk.crv && pk.publicKeyJwk.x && pk.publicKeyJwk.y) return {
        keyBytes: p256.ProjectivePoint.fromAffine({
            x: bytesToBigInt(base64ToBytes(pk.publicKeyJwk.x)),
            y: bytesToBigInt(base64ToBytes(pk.publicKeyJwk.y))
        }).toRawBytes(!1),
        keyType: 'P-256'
    };
    if (pk.publicKeyJwk && 'OKP' === pk.publicKeyJwk.kty && [
        'Ed25519',
        'X25519'
    ].includes(pk.publicKeyJwk.crv ?? '') && pk.publicKeyJwk.x) return {
        keyBytes: base64ToBytes(pk.publicKeyJwk.x),
        keyType: pk.publicKeyJwk.crv
    };
    if (pk.publicKeyMultibase) {
        const { keyBytes, keyType } = multibaseToBytes(pk.publicKeyMultibase);
        return {
            keyBytes,
            keyType: keyType ?? VM_TO_KEY_TYPE[pk.type]
        };
    }
    return {
        keyBytes: new Uint8Array()
    };
}
/**
 * Encodes the given byte array to a multibase string (defaulting to base58btc).
 * If a codec is provided, the corresponding multicodec prefix will be added.
 *
 * @param b - the Uint8Array to be encoded
 * @param base - the base to use for encoding (defaults to base58btc)
 * @param codec - the codec to use for encoding (defaults to no codec)
 *
 * @returns the multibase encoded string
 *
 * @public
 */ export function bytesToMultibase(b, base = 'base58btc', codec) {
    if (!codec) return u8a.toString(encode(base, b), 'utf-8');
    {
        const codecCode = 'string' == typeof codec ? supportedCodecs[codec] : codec, prefixLength = varint.encodingLength(codecCode), multicodecEncoding = new Uint8Array(prefixLength + b.length);
        return varint.encodeTo(codecCode, multicodecEncoding) // set prefix
        , multicodecEncoding.set(b, prefixLength) // add the original bytes
        , u8a.toString(encode(base, multicodecEncoding), 'utf-8');
    }
}
/**
 * Converts a multibase string to the Uint8Array it represents.
 * This method will assume the byte array that is multibase encoded is a multicodec and will attempt to decode it.
 *
 * @param s - the string to be converted
 *
 * @throws if the string is not formatted correctly.
 *
 * @public
 */ export function multibaseToBytes(s) {
    const bytes = decode(s);
    // look for known key lengths first
    // Ed25519/X25519, secp256k1/P256 compressed or not, BLS12-381 G1/G2 compressed
    if ([
        32,
        33,
        48,
        64,
        65,
        96
    ].includes(bytes.length)) return {
        keyBytes: bytes
    };
    // then assume multicodec, otherwise return the bytes
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [codec, length] = varint.decode(bytes), possibleCodec = Object.entries(supportedCodecs).filter(([, code])=>code === codec)?.[0][0] ?? '';
        return {
            keyBytes: bytes.slice(length),
            keyType: CODEC_TO_KEY_TYPE[possibleCodec]
        };
    } catch (e) {
        // not a multicodec, return the bytes
        return {
            keyBytes: bytes
        };
    }
}
export function hexToBytes(s, minLength) {
    let input = s.startsWith('0x') ? s.substring(2) : s;
    if (input.length % 2 != 0 && (input = `0${input}`), minLength) {
        const paddedLength = Math.max(input.length, 2 * minLength);
        input = input.padStart(paddedLength, '00');
    }
    return u8a.fromString(input.toLowerCase(), 'base16');
}
export function encodeBase64url(s) {
    return bytesToBase64url(u8a.fromString(s));
}
export function decodeBase64url(s) {
    return u8a.toString(base64ToBytes(s));
}
export function bytesToHex(b) {
    return u8a.toString(b, 'base16');
}
export function bytesToBigInt(b) {
    return BigInt("0x" + u8a.toString(b, 'base16'));
}
export function bigintToBytes(n, minLength) {
    return hexToBytes(n.toString(16), minLength);
}
export function stringToBytes(s) {
    return u8a.fromString(s, 'utf-8');
}
export function toJose({ r, s, recoveryParam }, recoverable) {
    const jose = new Uint8Array(recoverable ? 65 : 64);
    if (jose.set(u8a.fromString(r, 'base16'), 0), jose.set(u8a.fromString(s, 'base16'), 32), recoverable) {
        if (void 0 === recoveryParam) throw Error('Signer did not return a recoveryParam');
        jose[64] = recoveryParam;
    }
    return bytesToBase64url(jose);
}
export function fromJose(signature) {
    const signatureBytes = base64ToBytes(signature);
    if (signatureBytes.length < 64 || signatureBytes.length > 65) throw TypeError(`Wrong size for signature. Expected 64 or 65 bytes, but got ${signatureBytes.length}`);
    return {
        r: bytesToHex(signatureBytes.slice(0, 32)),
        s: bytesToHex(signatureBytes.slice(32, 64)),
        recoveryParam: 65 === signatureBytes.length ? signatureBytes[64] : void 0
    };
}
export function toSealed(ciphertext, tag) {
    return u8a.concat([
        base64ToBytes(ciphertext),
        tag ? base64ToBytes(tag) : new Uint8Array(0)
    ]);
}
export function leftpad(data, size = 64) {
    return data.length === size ? data : '0'.repeat(size - data.length) + data;
}
/**
 * Generate random x25519 key pair.
 */ export function generateKeyPair() {
    const secretKey = x25519.utils.randomPrivateKey(), publicKey = x25519.getPublicKey(secretKey);
    return {
        secretKey: secretKey,
        publicKey: publicKey
    };
}
/**
 * Generate private-public x25519 key pair from `seed`.
 */ export function generateKeyPairFromSeed(seed) {
    if (32 !== seed.length) throw Error("x25519: seed must be 32 bytes");
    return {
        publicKey: x25519.getPublicKey(seed),
        secretKey: seed
    };
}
export function genX25519EphemeralKeyPair() {
    const epk = generateKeyPair();
    return {
        publicKeyJWK: {
            kty: 'OKP',
            crv: 'X25519',
            x: bytesToBase64url(epk.publicKey)
        },
        secretKey: epk.secretKey
    };
}
/**
 * Checks if a variable is defined and not null.
 * After this check, typescript sees the variable as defined.
 *
 * @param arg - The input to be verified
 *
 * @returns true if the input variable is defined.
 */ export function isDefined(arg) {
    return null != arg;
}
