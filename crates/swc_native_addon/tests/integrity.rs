mod support;

use std::{fs, io::Cursor};

use swc_native_addon::{
    cache::{self, CacheMode},
    format::{Payload, HEADER_LEN},
    integrity::{RuntimeIntegrity, INTEGRITY_LEN},
};

#[test]
fn runtime_integrity_matches_blake3_across_parallel_batch_boundaries() {
    for line in include_str!("fixtures/integrity-sizes.txt").lines() {
        let size: usize = line.parse().unwrap();
        let mut raw = fs::read(support::fixture()).unwrap();
        let prefix = raw.len();
        assert!(prefix < size);
        raw.resize(size, 0);
        for (offset, byte) in raw[prefix..].iter_mut().enumerate() {
            *byte = (offset as u8).wrapping_mul(31);
        }
        let packed = swc_native_addon::format::pack(
            &raw,
            swc_native_addon::format::NativeTarget::host().unwrap(),
        )
        .unwrap();
        let payload = Payload::parse(&packed).unwrap();
        let metadata = RuntimeIntegrity::from_raw(&payload.header, &mut Cursor::new(&raw)).unwrap();
        assert_eq!(
            &metadata.encode()[8 + HEADER_LEN..],
            blake3::hash(&raw).as_bytes()
        );
        let payload = payload.with_integrity(metadata).unwrap();
        let mut decoded = Cursor::new(Vec::new());
        payload.decode_into(&mut decoded).unwrap();
        assert_eq!(decoded.into_inner(), raw);
        payload.verify_image(&mut Cursor::new(&raw)).unwrap();
        payload
            .verify_image(&mut ShortRead(Cursor::new(&raw)))
            .unwrap();
        for offset in [prefix, size / 2, size - 1] {
            raw[offset] ^= 1;
            assert!(payload.verify_image(&mut Cursor::new(&raw)).is_err());
            raw[offset] ^= 1;
        }
    }
}

/// Exercise irregular read boundaries as well as full parallel batches.
struct ShortRead<'a>(Cursor<&'a [u8]>);

impl std::io::Read for ShortRead<'_> {
    fn read(&mut self, bytes: &mut [u8]) -> std::io::Result<usize> {
        let len = bytes.len().min(65535);
        std::io::Read::read(&mut self.0, &mut bytes[..len])
    }
}

impl std::io::Seek for ShortRead<'_> {
    fn seek(&mut self, position: std::io::SeekFrom) -> std::io::Result<u64> {
        std::io::Seek::seek(&mut self.0, position)
    }
}

#[test]
fn runtime_integrity_is_required_after_custom_cache_fallback() {
    let raw = fs::read(support::fixture()).unwrap();
    let packed = support::packed();
    let payload = Payload::parse(&packed).unwrap();
    let metadata = RuntimeIntegrity::from_raw(&payload.header, &mut Cursor::new(&raw))
        .unwrap()
        .encode();
    let payload = payload
        .with_integrity(RuntimeIntegrity::parse(&metadata).unwrap())
        .unwrap();
    let root = tempfile::tempdir().unwrap();
    let blocked = root.path().join("not-a-directory");
    fs::write(&blocked, b"preserve blocked cache root").unwrap();
    let mode = CacheMode::Custom(blocked.clone());
    let mut entry = cache::materialize(&payload, &mode).unwrap();
    assert!(entry
        .path()
        .starts_with(swc_native_addon::platform::user_cache_root().unwrap()));
    assert_eq!(fs::read(entry.path()).unwrap(), raw);
    entry.loaded().unwrap();
    drop(entry);
    // A populated SHA-512 cache key cannot make a bad runtime digest acceptable.
    let mut damaged = metadata;
    damaged[INTEGRITY_LEN - 1] ^= 1;
    let invalid = Payload::parse(&packed)
        .unwrap()
        .with_integrity(RuntimeIntegrity::parse(&damaged).unwrap())
        .unwrap();
    assert!(cache::materialize(&invalid, &mode).is_err());
    assert_eq!(fs::read(blocked).unwrap(), b"preserve blocked cache root");
}

#[test]
fn runtime_integrity_preserves_sha512_identity_and_verifies_every_byte() {
    let raw = fs::read(support::fixture()).unwrap();
    let packed = support::packed();
    let payload = Payload::parse(&packed).unwrap();
    let key = payload.header.cache_key();
    let metadata = RuntimeIntegrity::from_raw(&payload.header, &mut Cursor::new(&raw)).unwrap();
    let encoded = metadata.encode();
    assert_eq!(&encoded[8..8 + HEADER_LEN], &packed[..HEADER_LEN]);
    assert_eq!(&encoded[8 + HEADER_LEN..], blake3::hash(&raw).as_bytes());
    let payload = payload
        .with_integrity(RuntimeIntegrity::parse(&encoded).unwrap())
        .unwrap();
    assert_eq!(payload.header.cache_key(), key);
    let mut decoded = Cursor::new(Vec::new());
    payload.decode_into(&mut decoded).unwrap();
    assert_eq!(decoded.get_ref(), &raw);
    payload.header.verify(&mut decoded).unwrap();
    payload.verify_image(&mut decoded).unwrap();

    // A second load of the same filename must read all bytes again. Corruption
    // outside the native header cannot reuse an earlier successful verification.
    let root = tempfile::tempdir().unwrap();
    let entry = cache::cached_at(&payload, root.path()).unwrap();
    let path = entry.path().to_owned();
    assert_eq!(path.file_stem().unwrap(), key.as_str());
    drop(entry);
    for offset in [64, raw.len() / 2, raw.len() - 1] {
        let mut corrupt = raw.clone();
        corrupt[offset] ^= 1;
        assert!(payload.verify_image(&mut Cursor::new(&corrupt)).is_err());
        fs::write(&path, corrupt).unwrap();
        let hit = cache::cached_at(&payload, root.path()).unwrap();
        assert_eq!(fs::read(hit.path()).unwrap(), raw);
    }
}

#[test]
fn runtime_metadata_rejects_truncation_header_changes_and_digest_corruption() {
    let raw = fs::read(support::fixture()).unwrap();
    let packed = support::packed();
    let payload = Payload::parse(&packed).unwrap();
    let metadata = RuntimeIntegrity::from_raw(&payload.header, &mut Cursor::new(&raw))
        .unwrap()
        .encode();
    for len in 0..INTEGRITY_LEN {
        assert!(RuntimeIntegrity::parse(&metadata[..len]).is_err());
    }
    let mut extended = metadata.to_vec();
    extended.push(0);
    assert!(RuntimeIntegrity::parse(&extended).is_err());
    for offset in 0..8 + HEADER_LEN {
        let mut corrupt = metadata;
        corrupt[offset] ^= 1;
        let result = RuntimeIntegrity::parse(&corrupt)
            .and_then(|integrity| Payload::parse(&packed)?.with_integrity(integrity));
        assert!(result.is_err(), "metadata byte {offset}");
    }
    let mut corrupt = metadata;
    corrupt[INTEGRITY_LEN - 1] ^= 1;
    let payload = Payload::parse(&packed)
        .unwrap()
        .with_integrity(RuntimeIntegrity::parse(&corrupt).unwrap())
        .unwrap();
    assert!(payload.decode_into(&mut Cursor::new(Vec::new())).is_err());
    assert!(payload.verify_image(&mut Cursor::new(&raw)).is_err());
    // Opting into runtime verification does not weaken the SHA-512 API.
    payload.header.verify(&mut Cursor::new(&raw)).unwrap();

    let mut wrong_raw = raw.clone();
    wrong_raw[64] ^= 1;
    assert!(RuntimeIntegrity::from_raw(&payload.header, &mut Cursor::new(wrong_raw)).is_err());
    let mut payload = Payload::parse(&packed)
        .unwrap()
        .with_integrity(RuntimeIntegrity::parse(&metadata).unwrap())
        .unwrap();
    payload.header.digest[0] ^= 1;
    assert!(payload.verify_image(&mut Cursor::new(&raw)).is_err());
    assert!(payload.decode_into(&mut Cursor::new(Vec::new())).is_err());
}
