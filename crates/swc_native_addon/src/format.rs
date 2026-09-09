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
    pub target: NativeTarget,
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
        bytes[12] = self.target as u8;
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

/// Targets supported by the private carrier build.  The payload records this
/// explicitly because an ELF shared object does not encode whether it was
/// linked for the GNU or musl runtime.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
#[repr(u8)]
pub enum NativeTarget {
    X86_64AppleDarwin = 1,
    Aarch64AppleDarwin = 2,
    X86_64PcWindowsMsvc = 3,
    Aarch64PcWindowsMsvc = 4,
    X86_64UnknownLinuxGnu = 5,
    Aarch64UnknownLinuxGnu = 6,
    X86_64UnknownLinuxMusl = 7,
    Aarch64UnknownLinuxMusl = 8,
}

impl NativeTarget {
    pub fn host() -> Option<Self> {
        #[cfg(all(target_arch = "x86_64", target_os = "macos"))]
        return Some(Self::X86_64AppleDarwin);
        #[cfg(all(target_arch = "aarch64", target_os = "macos"))]
        return Some(Self::Aarch64AppleDarwin);
        #[cfg(all(target_arch = "x86_64", target_os = "windows"))]
        return Some(Self::X86_64PcWindowsMsvc);
        #[cfg(all(target_arch = "aarch64", target_os = "windows"))]
        return Some(Self::Aarch64PcWindowsMsvc);
        #[cfg(all(target_arch = "x86_64", target_os = "linux", target_env = "gnu"))]
        return Some(Self::X86_64UnknownLinuxGnu);
        #[cfg(all(target_arch = "aarch64", target_os = "linux", target_env = "gnu"))]
        return Some(Self::Aarch64UnknownLinuxGnu);
        #[cfg(all(target_arch = "x86_64", target_os = "linux", target_env = "musl"))]
        return Some(Self::X86_64UnknownLinuxMusl);
        #[cfg(all(target_arch = "aarch64", target_os = "linux", target_env = "musl"))]
        return Some(Self::Aarch64UnknownLinuxMusl);
        #[allow(unreachable_code)]
        None
    }

    pub fn as_triple(self) -> &'static str {
        match self {
            Self::X86_64AppleDarwin => "x86_64-apple-darwin",
            Self::Aarch64AppleDarwin => "aarch64-apple-darwin",
            Self::X86_64PcWindowsMsvc => "x86_64-pc-windows-msvc",
            Self::Aarch64PcWindowsMsvc => "aarch64-pc-windows-msvc",
            Self::X86_64UnknownLinuxGnu => "x86_64-unknown-linux-gnu",
            Self::Aarch64UnknownLinuxGnu => "aarch64-unknown-linux-gnu",
            Self::X86_64UnknownLinuxMusl => "x86_64-unknown-linux-musl",
            Self::Aarch64UnknownLinuxMusl => "aarch64-unknown-linux-musl",
        }
    }

    pub fn parse(value: &str) -> Result<Self> {
        match value {
            "x86_64-apple-darwin" => Ok(Self::X86_64AppleDarwin),
            "aarch64-apple-darwin" => Ok(Self::Aarch64AppleDarwin),
            "x86_64-pc-windows-msvc" => Ok(Self::X86_64PcWindowsMsvc),
            "aarch64-pc-windows-msvc" => Ok(Self::Aarch64PcWindowsMsvc),
            "x86_64-unknown-linux-gnu" => Ok(Self::X86_64UnknownLinuxGnu),
            "aarch64-unknown-linux-gnu" => Ok(Self::Aarch64UnknownLinuxGnu),
            "x86_64-unknown-linux-musl" => Ok(Self::X86_64UnknownLinuxMusl),
            "aarch64-unknown-linux-musl" => Ok(Self::Aarch64UnknownLinuxMusl),
            _ => Err(Error::new(
                ErrorKind::Format,
                format!("native carriers are not supported for {value}"),
            )),
        }
    }

    fn kind(self) -> NativeKind {
        match self {
            Self::X86_64AppleDarwin | Self::Aarch64AppleDarwin => NativeKind::MachO,
            Self::X86_64PcWindowsMsvc | Self::Aarch64PcWindowsMsvc => NativeKind::Pe,
            Self::X86_64UnknownLinuxGnu
            | Self::Aarch64UnknownLinuxGnu
            | Self::X86_64UnknownLinuxMusl
            | Self::Aarch64UnknownLinuxMusl => NativeKind::Elf,
        }
    }

    fn machine(self) -> u32 {
        match self {
            Self::X86_64AppleDarwin
            | Self::X86_64PcWindowsMsvc
            | Self::X86_64UnknownLinuxGnu
            | Self::X86_64UnknownLinuxMusl => 0x3e,
            Self::Aarch64AppleDarwin
            | Self::Aarch64PcWindowsMsvc
            | Self::Aarch64UnknownLinuxGnu
            | Self::Aarch64UnknownLinuxMusl => 0xb7,
        }
    }

    fn from_byte(value: u8) -> Option<Self> {
        Some(match value {
            1 => Self::X86_64AppleDarwin,
            2 => Self::Aarch64AppleDarwin,
            3 => Self::X86_64PcWindowsMsvc,
            4 => Self::Aarch64PcWindowsMsvc,
            5 => Self::X86_64UnknownLinuxGnu,
            6 => Self::Aarch64UnknownLinuxGnu,
            7 => Self::X86_64UnknownLinuxMusl,
            8 => Self::Aarch64UnknownLinuxMusl,
            _ => return None,
        })
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
            || bytes[13..16] != [0; 3]
        {
            return Err(invalid(
                "unsupported payload version, header size, or target flags",
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
                target: NativeTarget::from_byte(bytes[12])
                    .ok_or_else(|| invalid("unsupported native carrier target"))?,
                compressed_len,
                raw_len,
                digest: bytes[32..96].try_into().unwrap(),
            },
            compressed,
        })
    }

    /// Check that the decoded image agrees with the target stamped by the
    /// trusted packer before a carrier embeds or loads it.
    pub fn verify_target(&self, input: &mut (impl Read + Seek)) -> Result<()> {
        native_target(input, self.header.raw_len, self.header.target)
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
pub fn pack(raw: &[u8], target: NativeTarget) -> Result<Vec<u8>> {
    if raw.is_empty() || raw.len() as u64 > MAX_SIZE {
        return Err(Error::new(
            ErrorKind::Format,
            "raw addon must be nonempty and at most 2 GiB",
        ));
    }
    native_target(&mut Cursor::new(raw), raw.len() as u64, target)?;
    let compressed = zstd::bulk::compress(raw, COMPRESSION_LEVEL)
        .map_err(|e| Error::io(ErrorKind::Compression, "compress native addon", e))?;
    if compressed.len() as u64 > MAX_SIZE {
        return Err(Error::new(
            ErrorKind::Format,
            "compressed addon exceeds 2 GiB",
        ));
    }
    let header = Header {
        target,
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

/// Validate the executable format and machine type for a supported carrier.
/// Target metadata supplies the otherwise-unobservable Linux libc ABI.
pub fn native_target(input: &mut (impl Read + Seek), len: u64, target: NativeTarget) -> Result<()> {
    let invalid = || {
        Error::new(
            ErrorKind::Format,
            "raw addon does not match native carrier target",
        )
    };
    if native_kind(input, len)? != target.kind() {
        return Err(invalid());
    }
    input.rewind().map_err(|_| invalid())?;
    let mut prefix = [0; 64];
    input.read_exact(&mut prefix).map_err(|_| invalid())?;
    let machine = match target.kind() {
        NativeKind::Elf => {
            if prefix[4] != 2 || prefix[5] != 1 {
                return Err(invalid());
            }
            u32::from(u16::from_le_bytes(prefix[18..20].try_into().unwrap()))
        }
        NativeKind::MachO => {
            let magic = u32::from_le_bytes(prefix[..4].try_into().unwrap());
            let cpu = match magic {
                0xfeedface | 0xfeedfacf => u32::from_le_bytes(prefix[4..8].try_into().unwrap()),
                0xcefaedfe | 0xcffaedfe => u32::from_be_bytes(prefix[4..8].try_into().unwrap()),
                _ => return Err(invalid()),
            };
            match cpu {
                0x0100_0007 => 0x3e,
                0x0100_000c => 0xb7,
                _ => return Err(invalid()),
            }
        }
        NativeKind::Pe => {
            let offset = u32::from_le_bytes(prefix[60..64].try_into().unwrap()) as u64;
            input
                .seek(SeekFrom::Start(offset + 4))
                .map_err(|_| invalid())?;
            let mut bytes = [0; 2];
            input.read_exact(&mut bytes).map_err(|_| invalid())?;
            match u16::from_le_bytes(bytes) {
                0x8664 => 0x3e,
                0xaa64 => 0xb7,
                _ => return Err(invalid()),
            }
        }
    };
    if machine == target.machine() {
        Ok(())
    } else {
        Err(invalid())
    }
}
