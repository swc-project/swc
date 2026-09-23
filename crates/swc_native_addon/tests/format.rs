mod support;

use std::{fs, io::Cursor};

use sha2::{Digest, Sha512};
use swc_native_addon::{
    format::{pack, Header, NativeTarget, Payload, HEADER_LEN, MAGIC, MAX_SIZE},
    ErrorKind,
};

fn target() -> NativeTarget {
    NativeTarget::host().unwrap()
}

#[test]
fn real_stripped_fixture_roundtrip() {
    let raw = fs::read(support::fixture()).unwrap();
    let bytes = pack(&raw, target()).unwrap();
    assert_eq!(bytes, pack(&raw, target()).unwrap());
    assert_eq!(&bytes[..8], MAGIC);
    assert_eq!(&bytes[8..12], &[1, 0, 96, 0]);
    assert_eq!(bytes[12], target() as u8);
    assert_eq!(&bytes[13..16], &[0, 0, 0]);
    let payload = Payload::parse(&bytes).unwrap();
    assert_eq!(payload.header.raw_len, raw.len() as u64);
    assert_eq!(
        payload.header.compressed_len,
        (bytes.len() - HEADER_LEN) as u64
    );
    assert_eq!(payload.header.digest[..], Sha512::digest(&raw)[..]);
    let mut decoded = Cursor::new(Vec::new());
    payload.decode_into(&mut decoded).unwrap();
    assert_eq!(decoded.get_ref(), &raw);
    payload.header.verify(&mut decoded).unwrap();
}

#[test]
fn rejects_every_header_and_length_class() {
    let bytes = support::packed();
    for length in 0..HEADER_LEN {
        assert!(
            Payload::parse(&bytes[..length]).is_err(),
            "truncation at {length}"
        );
    }
    for offset in [0, 7, 8, 9, 10, 11, 12, 15] {
        let mut bad = bytes.clone();
        bad[offset] ^= 0xff;
        assert!(Payload::parse(&bad).is_err(), "header byte {offset}");
    }
    for offset in [16, 24] {
        for length in [0, MAX_SIZE + 1, u64::MAX] {
            let mut bad = bytes.clone();
            bad[offset..offset + 8].copy_from_slice(&length.to_le_bytes());
            assert!(Payload::parse(&bad).is_err(), "length {length} at {offset}");
        }
    }
    let mut bad = bytes.clone();
    bad.pop();
    assert!(Payload::parse(&bad).is_err());
    let mut bad = bytes.clone();
    bad.push(0);
    assert!(Payload::parse(&bad).is_err());
    let mut bad = bytes.clone();
    bad[24..32].copy_from_slice(&64_u64.to_le_bytes());
    assert!(
        Payload::parse(&bad).is_err(),
        "frame and header content sizes differ"
    );
}

#[test]
fn rejects_zstd_frame_classes() {
    let bytes = support::packed();
    for compressed in [
        vec![0; 32],
        vec![0x50, 0x2a, 0x4d, 0x18, 0, 0, 0, 0],
        bytes[HEADER_LEN..bytes.len() - 1].to_vec(),
    ] {
        let mut bad = bytes[..HEADER_LEN].to_vec();
        bad[16..24].copy_from_slice(&(compressed.len() as u64).to_le_bytes());
        bad.extend(compressed);
        assert!(Payload::parse(&bad).is_err());
    }
    let mut concatenated = bytes.clone();
    concatenated.extend_from_slice(&bytes[HEADER_LEN..]);
    let length = (concatenated.len() - HEADER_LEN) as u64;
    concatenated[16..24].copy_from_slice(&length.to_le_bytes());
    assert!(Payload::parse(&concatenated).is_err());
    let mut dictionary = bytes.clone();
    dictionary[HEADER_LEN + 4] |= 1;
    assert!(Payload::parse(&dictionary).is_err());
}

#[test]
fn rejects_digest_mismatch_and_compressed_corruption() {
    let mut bytes = support::packed();
    bytes[32] ^= 1;
    let error = Payload::parse(&bytes)
        .unwrap()
        .decode_into(&mut Cursor::new(Vec::new()))
        .unwrap_err();
    assert_eq!(error.kind, ErrorKind::Integrity);

    // Preserve the zstd framing while damaging its compressed block. This must
    // fail either frame decoding or SHA-512, never publish a decoded file.
    let mut bytes = support::packed();
    let middle = HEADER_LEN + (bytes.len() - HEADER_LEN) / 2;
    bytes[middle] ^= 0x80;
    if let Ok(payload) = Payload::parse(&bytes) {
        assert!(payload.decode_into(&mut Cursor::new(Vec::new())).is_err());
    }
}

#[test]
fn rejects_hashed_non_native_payloads_and_checks_pe_signature() {
    for raw in [
        vec![0; 128],
        b"MZ".iter().copied().chain([0; 126]).collect(),
    ] {
        assert!(pack(&raw, target()).is_err());
        let compressed = zstd::bulk::compress(&raw, 16).unwrap();
        let header = Header {
            target: target(),
            compressed_len: compressed.len() as u64,
            raw_len: raw.len() as u64,
            digest: Sha512::digest(&raw).into(),
        };
        let bytes: Vec<u8> = header.encode().into_iter().chain(compressed).collect();
        let payload = Payload::parse(&bytes).unwrap();
        assert_eq!(
            payload
                .decode_into(&mut Cursor::new(Vec::new()))
                .unwrap_err()
                .kind,
            ErrorKind::Format
        );
    }
    let mut pe = vec![0; 128];
    pe[..2].copy_from_slice(b"MZ");
    pe[60..64].copy_from_slice(&80_u32.to_le_bytes());
    assert!(pack(&pe, target()).is_err());
    pe[80..84].copy_from_slice(b"PE\0\0");
    pe[84..86].copy_from_slice(&0x8664_u16.to_le_bytes());
    assert!(pack(&pe, NativeTarget::X86_64PcWindowsMsvc).is_ok());
    pe[60..64].copy_from_slice(&u32::MAX.to_le_bytes());
    assert!(pack(&pe, target()).is_err());
}

#[test]
fn rejects_payload_target_mismatch() {
    let raw = fs::read(support::fixture()).unwrap();
    let wrong = match target() {
        NativeTarget::X86_64UnknownLinuxGnu => NativeTarget::Aarch64UnknownLinuxGnu,
        NativeTarget::Aarch64UnknownLinuxGnu => NativeTarget::X86_64UnknownLinuxGnu,
        NativeTarget::X86_64UnknownLinuxMusl => NativeTarget::Aarch64UnknownLinuxMusl,
        NativeTarget::Aarch64UnknownLinuxMusl => NativeTarget::X86_64UnknownLinuxMusl,
        NativeTarget::X86_64AppleDarwin => NativeTarget::Aarch64AppleDarwin,
        NativeTarget::Aarch64AppleDarwin => NativeTarget::X86_64AppleDarwin,
        NativeTarget::X86_64PcWindowsMsvc => NativeTarget::Aarch64PcWindowsMsvc,
        NativeTarget::Aarch64PcWindowsMsvc => NativeTarget::X86_64PcWindowsMsvc,
    };
    assert!(pack(&raw, wrong).is_err());
}

#[test]
fn rejects_decoder_size_and_window_abuse() {
    // Single-segment frame claims 64 decoded bytes but contains a complete raw
    // block of only ten. Framing succeeds; decompression must fail loudly.
    let compressed = [
        vec![0x28, 0xb5, 0x2f, 0xfd, 0x20, 64, 81, 0, 0],
        vec![0; 10],
    ]
    .concat();
    let header = Header {
        target: target(),
        compressed_len: compressed.len() as u64,
        raw_len: 64,
        digest: [0; 64],
    };
    let bytes = [header.encode().to_vec(), compressed].concat();
    assert_eq!(
        Payload::parse(&bytes)
            .unwrap()
            .decode_into(&mut Cursor::new(Vec::new()))
            .unwrap_err()
            .kind,
        ErrorKind::Compression
    );

    // A non-single-segment frame claims a 1 GiB window for 64 output bytes.
    // The decoder must reject its window before allocating based on that claim.
    let compressed = [
        vec![0x28, 0xb5, 0x2f, 0xfd, 0x80, 0xa0, 64, 0, 0, 0, 1, 2, 0],
        vec![0; 64],
    ]
    .concat();
    let header = Header {
        target: target(),
        compressed_len: compressed.len() as u64,
        raw_len: 64,
        digest: [0; 64],
    };
    let bytes = [header.encode().to_vec(), compressed].concat();
    assert_eq!(
        Payload::parse(&bytes)
            .unwrap()
            .decode_into(&mut Cursor::new(Vec::new()))
            .unwrap_err()
            .kind,
        ErrorKind::Compression
    );
}
