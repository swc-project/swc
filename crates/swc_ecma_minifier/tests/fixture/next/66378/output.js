function bytesToBase64(b) {
    return u8a.toString(b, 'base64pad');
}
function bytesToBase58(b) {
    return u8a.toString(b, 'base58btc');
}
const SUPPORTED_PUBLIC_KEY_TYPES = {
    ES256: [
        'JsonWebKey2020',
        'Multikey',
        'EcdsaSecp256r1VerificationKey2019'
    ],
    ES256K: [
        'EcdsaSecp256k1VerificationKey2019',
        'EcdsaSecp256k1RecoveryMethod2020',
        'Secp256k1VerificationKey2018',
        'Secp256k1SignatureVerificationKey2018',
        'EcdsaPublicKeySecp256k1',
        'JsonWebKey2020',
        'Multikey'
    ],
    'ES256K-R': [
        'EcdsaSecp256k1VerificationKey2019',
        'EcdsaSecp256k1RecoveryMethod2020',
        'Secp256k1VerificationKey2018',
        'Secp256k1SignatureVerificationKey2018',
        'EcdsaPublicKeySecp256k1',
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
import { secp256k1 } from "@noble/curves/secp256k1";
import { p256 } from "@noble/curves/p256";
function extractPublicKeyBytes(pk) {
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
import { varint } from "multiformats";
import { encode } from "multibase";
function bytesToMultibase(b, base = 'base58btc', codec) {
    if (!codec) return u8a.toString(encode(base, b), 'utf-8');
    {
        const codecCode = 'string' == typeof codec ? supportedCodecs[codec] : codec, prefixLength = varint.encodingLength(codecCode), multicodecEncoding = new Uint8Array(prefixLength + b.length);
        return varint.encodeTo(codecCode, multicodecEncoding), multicodecEncoding.set(b, prefixLength), u8a.toString(encode(base, multicodecEncoding), 'utf-8');
    }
}
function encodeBase64url(s) {
    return bytesToBase64url(u8a.fromString(s));
}
function decodeBase64url(s) {
    return u8a.toString(base64ToBytes(s));
}
function bigintToBytes(n, minLength) {
    return hexToBytes(n.toString(16), minLength);
}
function stringToBytes(s) {
    return u8a.fromString(s, 'utf-8');
}
function toJose({ r, s, recoveryParam }, recoverable) {
    const jose = new Uint8Array(recoverable ? 65 : 64);
    if (jose.set(u8a.fromString(r, 'base16'), 0), jose.set(u8a.fromString(s, 'base16'), 32), recoverable) {
        if (void 0 === recoveryParam) throw Error('Signer did not return a recoveryParam');
        jose[64] = recoveryParam;
    }
    return bytesToBase64url(jose);
}
function fromJose(signature) {
    const signatureBytes = base64ToBytes(signature);
    if (signatureBytes.length < 64 || signatureBytes.length > 65) throw TypeError(`Wrong size for signature. Expected 64 or 65 bytes, but got ${signatureBytes.length}`);
    return {
        r: bytesToHex(signatureBytes.slice(0, 32)),
        s: bytesToHex(signatureBytes.slice(32, 64)),
        recoveryParam: 65 === signatureBytes.length ? signatureBytes[64] : void 0
    };
}
function toSealed(ciphertext, tag) {
    return u8a.concat([
        base64ToBytes(ciphertext),
        tag ? base64ToBytes(tag) : new Uint8Array(0)
    ]);
}
function leftpad(data, size = 64) {
    return data.length === size ? data : '0'.repeat(size - data.length) + data;
}
import { x25519 } from "@noble/curves/ed25519";
function generateKeyPairFromSeed(seed) {
    if (32 !== seed.length) throw Error("x25519: seed must be 32 bytes");
    return {
        publicKey: x25519.getPublicKey(seed),
        secretKey: seed
    };
}
function genX25519EphemeralKeyPair() {
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
function isDefined(arg) {
    return null != arg;
}
import "uint8arrays";
import "@noble/curves/ed25519";
import "multiformats";
import "multibase";
import "@noble/curves/secp256k1";
import "@noble/curves/p256";
import { concat } from "uint8arrays";
import { fromString } from "uint8arrays";
import { toString } from "uint8arrays";
const u8a = {
    toString,
    fromString,
    concat
}, VM_TO_KEY_TYPE = {
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
}, supportedCodecs = {
    'ed25519-pub': 0xed,
    'x25519-pub': 0xec,
    'secp256k1-pub': 0xe7,
    'bls12_381-g1-pub': 0xea,
    'bls12_381-g2-pub': 0xeb,
    'p256-pub': 0x1200
}, CODEC_TO_KEY_TYPE = {
    'bls12_381-g1-pub': 'Bls12381G1',
    'bls12_381-g2-pub': 'Bls12381G2',
    'ed25519-pub': 'Ed25519',
    'p256-pub': 'P-256',
    'secp256k1-pub': 'Secp256k1',
    'x25519-pub': 'X25519'
};
function bytesToBase64url(b) {
    return u8a.toString(b, 'base64url');
}
function base64ToBytes(s) {
    const inputBase64Url = s.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    return u8a.fromString(inputBase64Url, 'base64url');
}
function base58ToBytes(s) {
    return u8a.fromString(s, 'base58btc');
}
import { varint } from "multiformats";
import { decode } from "multibase";
function multibaseToBytes(s) {
    const bytes = decode(s);
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
    try {
        const [codec, length] = varint.decode(bytes), possibleCodec = Object.entries(supportedCodecs).filter(([, code])=>code === codec)?.[0][0] ?? '';
        return {
            keyBytes: bytes.slice(length),
            keyType: CODEC_TO_KEY_TYPE[possibleCodec]
        };
    } catch (e) {
        return {
            keyBytes: bytes
        };
    }
}
function hexToBytes(s, minLength) {
    let input = s.startsWith('0x') ? s.substring(2) : s;
    if (input.length % 2 != 0 && (input = `0${input}`), minLength) {
        const paddedLength = Math.max(input.length, 2 * minLength);
        input = input.padStart(paddedLength, '00');
    }
    return u8a.fromString(input.toLowerCase(), 'base16');
}
function bytesToHex(b) {
    return u8a.toString(b, 'base16');
}
function bytesToBigInt(b) {
    return BigInt("0x" + u8a.toString(b, 'base16'));
}
import { x25519 } from "@noble/curves/ed25519";
function generateKeyPair() {
    const secretKey = x25519.utils.randomPrivateKey(), publicKey = x25519.getPublicKey(secretKey);
    return {
        secretKey: secretKey,
        publicKey: publicKey
    };
}
export { bytesToBase64url, base64ToBytes, bytesToBase64, base58ToBytes, bytesToBase58, SUPPORTED_PUBLIC_KEY_TYPES, VM_TO_KEY_TYPE, supportedCodecs, CODEC_TO_KEY_TYPE, extractPublicKeyBytes, bytesToMultibase, multibaseToBytes, hexToBytes, encodeBase64url, decodeBase64url, bytesToHex, bytesToBigInt, bigintToBytes, stringToBytes, toJose, fromJose, toSealed, leftpad, generateKeyPair, generateKeyPairFromSeed, genX25519EphemeralKeyPair, isDefined };
