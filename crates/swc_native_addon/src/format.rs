//! Version 1 uses a 96-byte little-endian header followed by one zstd frame.
//! Integer fields are decoded explicitly: Rust layout and host byte order are
//! deliberately not part of the file format.

use std::io::{Cursor, Read, Seek, SeekFrom, Write};

use sha2::{Digest, Sha512};

use crate::{Error, ErrorKind, Result};

pub const MAGIC: &[u8; 8] = b"SWCNZSTD";
pub const VERSION: u16 = 1;
pub const HEADER_LEN: usize = 96;
pub const MAX_SIZE: u64 = 2 * 1024 * 1024 * 1024;
pub const COMPRESSION_LEVEL: i32 = 16;

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Header {
    pub compressed_len: u64,
    pub raw_len: u64,
    pub digest: [u8; 64],
}

impl Header {
    pub fn encode(&self) -> [u8; HEADER_LEN] {
        let mut bytes = [0; HEADER_LEN];
        bytes[..8].copy_from_slice(MAGIC);
        bytes[8..10].copy_from_slice(&VERSION.to_le_bytes());
        bytes[10..12].copy_from_slice(&(HEADER_LEN as u16).to_le_bytes());
        bytes[16..24].copy_from_slice(&self.compressed_len.to_le_bytes());
        bytes[24..32].copy_from_slice(&self.raw_len.to_le_bytes());
        bytes[32..].copy_from_slice(&self.digest);
        bytes
    }

    pub fn cache_key(&self) -> String {
        use std::fmt::Write;
        let mut key = String::with_capacity(128);
        for byte in self.digest {
            // Formatting into a String cannot fail.
            let _ = write!(key, "{byte:02x}");
        }
        key
    }

    /// Verify a complete raw file, including cache hits. Never trust a filename
    /// or an earlier successful verification as evidence about today's bytes.
    pub fn verify(&self, input: &mut (impl Read + Seek)) -> Result<()> {
        let len = input
            .seek(SeekFrom::End(0))
            .map_err(|e| Error::io(ErrorKind::Integrity, "measure raw addon", e))?;
        if len != self.raw_len {
            return Err(Error::new(
                ErrorKind::Integrity,
                "raw addon length mismatch",
            ));
        }
        native_kind(input, len)?;
        input
            .rewind()
            .map_err(|e| Error::io(ErrorKind::Integrity, "rewind raw addon", e))?;
        let mut hash = Sha512::new();
        let mut buffer = [0; 64 * 1024];
        let mut count = 0_u64;
        loop {
            let read = input
                .read(&mut buffer)
                .map_err(|e| Error::io(ErrorKind::Integrity, "hash raw addon", e))?;
            if read == 0 {
                break;
            }
            count += read as u64;
            if count > self.raw_len {
                return Err(Error::new(
                    ErrorKind::Integrity,
                    "cache file grew during verification",
                ));
            }
            hash.update(&buffer[..read]);
        }
        if count != self.raw_len {
            return Err(Error::new(
                ErrorKind::Integrity,
                "cache file shrank during verification",
            ));
        }
        if hash.finalize()[..] != self.digest {
            return Err(Error::new(
                ErrorKind::Integrity,
                "raw addon SHA-512 mismatch",
            ));
        }
        Ok(())
    }
}

#[derive(Debug)]
pub struct Payload<'a> {
    pub header: Header,
    compressed: &'a [u8],
}

impl<'a> Payload<'a> {
    pub fn parse(bytes: &'a [u8]) -> Result<Self> {
        let invalid = |message| Error::new(ErrorKind::Format, message);
        if bytes.len() < HEADER_LEN || &bytes[..8] != MAGIC {
            return Err(invalid("missing or truncated SWC native payload header"));
        }
        if bytes[8..10] != VERSION.to_le_bytes()
            || bytes[10..12] != (HEADER_LEN as u16).to_le_bytes()
            || bytes[12..16] != [0; 4]
        {
            return Err(invalid(
                "unsupported payload version, header size, or flags",
            ));
        }
        let compressed_len = u64::from_le_bytes(bytes[16..24].try_into().unwrap());
        let raw_len = u64::from_le_bytes(bytes[24..32].try_into().unwrap());
        if compressed_len == 0 || raw_len == 0 || compressed_len > MAX_SIZE || raw_len > MAX_SIZE {
            return Err(invalid("payload lengths must be nonzero and at most 2 GiB"));
        }
        if compressed_len.checked_add(HEADER_LEN as u64) != Some(bytes.len() as u64) {
            return Err(invalid(
                "payload compressed length does not match its exact size",
            ));
        }
        let compressed = &bytes[HEADER_LEN..];
        // Reject skippable frames, concatenated frames, and trailing bytes before
        // consulting the cache. find_frame_compressed_size does not decompress.
        if !compressed.starts_with(&[0x28, 0xb5, 0x2f, 0xfd]) {
            return Err(invalid("payload is not an ordinary zstd frame"));
        }
        let frame_len = zstd::zstd_safe::find_frame_compressed_size(compressed)
            .map_err(|_| invalid("invalid or truncated zstd frame"))?;
        if frame_len != compressed.len() {
            return Err(invalid("payload must contain exactly one zstd frame"));
        }
        let content_len = zstd::zstd_safe::get_frame_content_size(compressed)
            .map_err(|_| invalid("invalid zstd content size"))?;
        if content_len != Some(raw_len) {
            return Err(invalid(
                "zstd content size must equal the declared raw length",
            ));
        }
        // The packer never uses dictionaries. The complete frame header is at
        // least six bytes after the ordinary magic has been checked above.
        if compressed
            .get(4)
            .map_or(true, |descriptor| descriptor & 3 != 0)
        {
            return Err(invalid("zstd dictionaries are not supported"));
        }
        Ok(Self {
            header: Header {
                compressed_len,
                raw_len,
                digest: bytes[32..96].try_into().unwrap(),
            },
            compressed,
        })
    }

    /// Decode into an empty staging file. A caller must discard the file on any
    /// error; publication is allowed only after this method succeeds.
    pub fn decode_into(&self, output: &mut (impl Read + Write + Seek)) -> Result<()> {
        let window_log = (64 - self.header.raw_len.saturating_sub(1).leading_zeros()).max(10);
        if self.compressed[4] & 0x20 == 0 {
            let descriptor = self.compressed[5];
            let base = 1_u64 << (10 + (descriptor >> 3));
            let window = base + (base / 8) * u64::from(descriptor & 7);
            if window > 1_u64 << window_log {
                return Err(Error::new(
                    ErrorKind::Compression,
                    "zstd window exceeds the bounded raw size",
                ));
            }
        }
        let mut decoder = zstd::stream::read::Decoder::with_buffer(self.compressed)
            .map_err(|e| Error::io(ErrorKind::Compression, "initialize zstd decoder", e))?
            .single_frame();
        // A small claimed output must not allocate a maliciously large window.
        // Also check the descriptor above: zstd's direct-output optimization can
        // bypass its configured window limit when the entire output fits at once.
        decoder
            .window_log_max(window_log)
            .map_err(|e| Error::io(ErrorKind::Compression, "limit zstd window", e))?;
        let mut count = 0_u64;
        let mut hash = Sha512::new();
        let mut buffer = [0; 64 * 1024];
        loop {
            let read = decoder
                .read(&mut buffer)
                .map_err(|e| Error::io(ErrorKind::Compression, "decompress native addon", e))?;
            if read == 0 {
                break;
            }
            count += read as u64;
            if count > self.header.raw_len {
                return Err(Error::new(
                    ErrorKind::Integrity,
                    "decoded addon exceeds declared length",
                ));
            }
            hash.update(&buffer[..read]);
            output
                .write_all(&buffer[..read])
                .map_err(|e| Error::io(ErrorKind::Cache, "write decoded addon", e))?;
        }
        if count != self.header.raw_len {
            return Err(Error::new(
                ErrorKind::Integrity,
                "decoded addon length mismatch",
            ));
        }
        if hash.finalize()[..] != self.header.digest {
            return Err(Error::new(
                ErrorKind::Integrity,
                "decoded addon SHA-512 mismatch",
            ));
        }
        native_kind(output, count)?;
        Ok(())
    }
}

/// Compress the final stripped addon, never a pre-strip intermediate.
pub fn pack(raw: &[u8]) -> Result<Vec<u8>> {
    if raw.is_empty() || raw.len() as u64 > MAX_SIZE {
        return Err(Error::new(
            ErrorKind::Format,
            "raw addon must be nonempty and at most 2 GiB",
        ));
    }
    native_kind(&mut Cursor::new(raw), raw.len() as u64)?;
    let compressed = zstd::bulk::compress(raw, COMPRESSION_LEVEL)
        .map_err(|e| Error::io(ErrorKind::Compression, "compress native addon", e))?;
    if compressed.len() as u64 > MAX_SIZE {
        return Err(Error::new(
            ErrorKind::Format,
            "compressed addon exceeds 2 GiB",
        ));
    }
    let header = Header {
        compressed_len: compressed.len() as u64,
        raw_len: raw.len() as u64,
        digest: Sha512::digest(raw).into(),
    };
    let mut bytes = Vec::with_capacity(HEADER_LEN + compressed.len());
    bytes.extend_from_slice(&header.encode());
    bytes.extend_from_slice(&compressed);
    Ok(bytes)
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum NativeKind {
    Elf,
    MachO,
    Pe,
}

/// Check magic and the minimum structure needed to avoid accepting arbitrary
/// data bearing only a short prefix. The OS loader validates the full image.
pub fn native_kind(input: &mut (impl Read + Seek), len: u64) -> Result<NativeKind> {
    let invalid = || {
        Error::new(
            ErrorKind::Format,
            "raw payload is not a Mach-O, ELF, or PE addon",
        )
    };
    input.rewind().map_err(|_| invalid())?;
    let mut prefix = [0; 64];
    if len < prefix.len() as u64 {
        return Err(invalid());
    }
    input.read_exact(&mut prefix).map_err(|_| invalid())?;
    if &prefix[..4] == b"\x7fELF"
        && matches!(prefix[4], 1 | 2)
        && matches!(prefix[5], 1 | 2)
        && prefix[6] == 1
    {
        return Ok(NativeKind::Elf);
    }
    if matches!(
        u32::from_be_bytes(prefix[..4].try_into().unwrap()),
        0xfeedface
            | 0xcefaedfe
            | 0xfeedfacf
            | 0xcffaedfe
            | 0xcafebabe
            | 0xbebafeca
            | 0xcafebabf
            | 0xbfbafeca
    ) {
        return Ok(NativeKind::MachO);
    }
    if &prefix[..2] == b"MZ" {
        let offset = u32::from_le_bytes(prefix[60..64].try_into().unwrap()) as u64;
        if offset < 64 || offset.checked_add(24).map_or(true, |end| end > len) {
            return Err(invalid());
        }
        input.seek(SeekFrom::Start(offset)).map_err(|_| invalid())?;
        let mut signature = [0; 4];
        input.read_exact(&mut signature).map_err(|_| invalid())?;
        if signature == *b"PE\0\0" {
            return Ok(NativeKind::Pe);
        }
    }
    Err(invalid())
}
