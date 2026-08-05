use anyhow::{bail, Context, Result};
use sha2::{Digest, Sha256, Sha512};

pub const MAGIC_MARKER: &[u8; 32] = b"__SMOL_PRESSED_DATA_MAGIC_MARKER";
pub const CACHE_KEY_LEN: usize = 16;
pub const PLATFORM_METADATA_LEN: usize = 3;
pub const INTEGRITY_HASH_LEN: usize = 64;
pub const SMOL_CONFIG_FLAG_LEN: usize = 1;
pub const MAX_DECOMPRESSED: usize = 2 * 1024 * 1024 * 1024;

pub fn pack_pressed_data(raw_addon: &[u8], level: i32) -> Result<Vec<u8>> {
    if raw_addon.is_empty() {
        bail!("native addon payload is empty");
    }
    if raw_addon.len() > MAX_DECOMPRESSED {
        bail!(
            "native addon payload is {} bytes, exceeding the {MAX_DECOMPRESSED} byte limit",
            raw_addon.len()
        );
    }

    let compressed = zstd::stream::encode_all(raw_addon, level)
        .with_context(|| format!("failed to zstd-compress native addon at level {level}"))?;
    if compressed.len() > MAX_DECOMPRESSED {
        bail!(
            "compressed native addon payload is {} bytes, exceeding the {MAX_DECOMPRESSED} byte \
             limit",
            compressed.len()
        );
    }

    let cache_key = Sha256::digest(raw_addon);
    let integrity = Sha512::digest(&compressed);
    let raw_integrity = Sha512::digest(raw_addon);
    let mut data = Vec::with_capacity(
        MAGIC_MARKER.len()
            + 16
            + CACHE_KEY_LEN
            + PLATFORM_METADATA_LEN
            + INTEGRITY_HASH_LEN
            + SMOL_CONFIG_FLAG_LEN
            + compressed.len()
            + INTEGRITY_HASH_LEN,
    );

    data.extend_from_slice(MAGIC_MARKER);
    data.extend_from_slice(&(compressed.len() as u64).to_le_bytes());
    data.extend_from_slice(&(raw_addon.len() as u64).to_le_bytes());
    data.extend_from_slice(&cache_key[..CACHE_KEY_LEN]);
    data.extend_from_slice(&[0; PLATFORM_METADATA_LEN]);
    data.extend_from_slice(&integrity);
    data.push(0);
    data.extend_from_slice(&compressed);
    data.extend_from_slice(&raw_integrity);

    Ok(data)
}

pub fn pressed_data_sha512_hex(pressed_data: &[u8]) -> Result<String> {
    let integrity_offset = MAGIC_MARKER.len() + 16 + CACHE_KEY_LEN + PLATFORM_METADATA_LEN;
    let integrity = pressed_data
        .get(integrity_offset..integrity_offset + INTEGRITY_HASH_LEN)
        .context("pressed-data buffer is too short to contain the integrity hash")?;
    Ok(hex::encode(integrity))
}

#[cfg(test)]
mod tests {
    use super::*;

    fn pack_fixture() -> Vec<u8> {
        pack_pressed_data(b"raw native addon bytes", 19).unwrap()
    }

    #[test]
    fn round_trips_through_decmpfs_decoder() {
        let data = pack_fixture();

        assert_eq!(
            decmpfs::addon::decode_pressed_data(&data).unwrap(),
            b"raw native addon bytes"
        );
    }

    #[test]
    fn rejects_short_buffer() {
        assert!(decmpfs::addon::decode_pressed_data(&pack_fixture()[..8]).is_none());
    }

    #[test]
    fn rejects_wrong_magic() {
        let mut data = pack_fixture();
        data[0] = b'x';

        assert!(decmpfs::addon::decode_pressed_data(&data).is_none());
    }

    #[test]
    fn rejects_tampered_payload() {
        let mut data = pack_fixture();
        let compressed_len = u64::from_le_bytes(
            data[MAGIC_MARKER.len()..MAGIC_MARKER.len() + 8]
                .try_into()
                .unwrap(),
        ) as usize;
        let payload_offset = MAGIC_MARKER.len()
            + 16
            + CACHE_KEY_LEN
            + PLATFORM_METADATA_LEN
            + INTEGRITY_HASH_LEN
            + SMOL_CONFIG_FLAG_LEN;
        let last = payload_offset + compressed_len - 1;
        data[last] ^= 0xff;

        assert!(decmpfs::addon::decode_pressed_data(&data).is_none());
    }

    #[test]
    fn rejects_wrong_uncompressed_length() {
        let mut data = pack_fixture();
        let offset = MAGIC_MARKER.len() + 8;
        data[offset..offset + 8].copy_from_slice(&123_456u64.to_le_bytes());

        assert!(decmpfs::addon::decode_pressed_data(&data).is_none());
    }

    #[test]
    fn rejects_oversized_payload_claim() {
        let mut data = pack_fixture();
        let offset = MAGIC_MARKER.len() + 8;
        data[offset..offset + 8].copy_from_slice(&((MAX_DECOMPRESSED as u64) + 1).to_le_bytes());

        assert!(decmpfs::addon::decode_pressed_data(&data).is_none());
    }

    #[test]
    fn exposes_payload_sha512() {
        let data = pack_fixture();

        assert_eq!(pressed_data_sha512_hex(&data).unwrap().len(), 128);
    }

    #[test]
    fn appends_raw_sha512_after_compressed_payload() {
        let raw = b"raw native addon bytes";
        let data = pack_pressed_data(raw, 19).unwrap();
        let compressed_len = u64::from_le_bytes(
            data[MAGIC_MARKER.len()..MAGIC_MARKER.len() + 8]
                .try_into()
                .unwrap(),
        ) as usize;
        let raw_hash_offset = MAGIC_MARKER.len()
            + 16
            + CACHE_KEY_LEN
            + PLATFORM_METADATA_LEN
            + INTEGRITY_HASH_LEN
            + SMOL_CONFIG_FLAG_LEN
            + compressed_len;

        let raw_hash = Sha512::digest(raw);
        assert_eq!(
            &data[raw_hash_offset..raw_hash_offset + INTEGRITY_HASH_LEN],
            &raw_hash[..]
        );
    }
}
