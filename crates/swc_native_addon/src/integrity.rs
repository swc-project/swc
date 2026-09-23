//! Private carrier metadata, separate from the stable v1 payload format.
//!
//! The build and release verifier establish SHA-512 equality first. Runtime
//! verification uses BLAKE3 over every byte, bound to that complete v1 header.
//! Neither digest authenticates an untrusted carrier or replaces code signing.

use std::io::{Read, Seek};

use sha2::{Digest, Sha512};

use crate::{
    format::{Header, HEADER_LEN},
    Error, ErrorKind, Result,
};

pub const INTEGRITY_MAGIC: &[u8; 8] = b"SWCNB3V1";
pub const INTEGRITY_LEN: usize = 8 + HEADER_LEN + 32;

#[derive(Clone, Debug)]
pub struct RuntimeIntegrity {
    header: [u8; HEADER_LEN],
    digest: [u8; 32],
}

impl RuntimeIntegrity {
    /// Derive runtime metadata only from bytes verified against the SHA-512
    /// payload header. This runs during building, never on a cache hit.
    pub fn from_raw(header: &Header, raw: &mut (impl Read + Seek)) -> Result<Self> {
        header.verify(raw)?;
        raw.rewind()
            .map_err(|e| Error::io(ErrorKind::Integrity, "rewind verified raw addon", e))?;
        let mut hash = blake3::Hasher::new();
        let mut buffer = [0; 64 * 1024];
        loop {
            let len = raw
                .read(&mut buffer)
                .map_err(|e| Error::io(ErrorKind::Integrity, "hash verified raw addon", e))?;
            if len == 0 {
                break;
            }
            hash.update(&buffer[..len]);
        }
        Ok(Self {
            header: header.encode(),
            digest: *hash.finalize().as_bytes(),
        })
    }

    pub fn encode(&self) -> [u8; INTEGRITY_LEN] {
        let mut bytes = [0; INTEGRITY_LEN];
        bytes[..8].copy_from_slice(INTEGRITY_MAGIC);
        bytes[8..8 + HEADER_LEN].copy_from_slice(&self.header);
        bytes[8 + HEADER_LEN..].copy_from_slice(&self.digest);
        bytes
    }

    pub fn parse(bytes: &[u8]) -> Result<Self> {
        if bytes.len() != INTEGRITY_LEN || &bytes[..8] != INTEGRITY_MAGIC {
            return Err(Error::new(
                ErrorKind::Integrity,
                "invalid native runtime integrity metadata",
            ));
        }
        Ok(Self {
            header: bytes[8..8 + HEADER_LEN].try_into().unwrap(),
            digest: bytes[8 + HEADER_LEN..].try_into().unwrap(),
        })
    }

    pub(crate) fn verifier(&self, header: &Header) -> Result<Verifier> {
        if self.header != header.encode() {
            return Err(Error::new(
                ErrorKind::Integrity,
                "runtime integrity metadata does not match payload header",
            ));
        }
        Ok(Verifier::Blake3(Box::default(), self.digest))
    }
}

/// Select a digest once per verification, with no persistent validation cache.
pub(crate) enum Verifier {
    Sha512(Box<Sha512>, [u8; 64]),
    Blake3(Box<blake3::Hasher>, [u8; 32]),
}

impl Verifier {
    pub(crate) fn sha512(header: &Header) -> Self {
        Self::Sha512(Box::default(), header.digest)
    }

    pub(crate) fn buffer_len(&self, _raw_len: u64) -> usize {
        // Larger bounded batches amortize parallel hashing under Rosetta.
        // Small images and the default SHA-512 API keep the streaming buffer.
        #[cfg(all(target_os = "macos", target_arch = "x86_64"))]
        if matches!(self, Self::Blake3(..)) && _raw_len >= 1024 * 1024 {
            return 1024 * 1024;
        }
        64 * 1024
    }

    pub(crate) fn update(&mut self, bytes: &[u8]) {
        match self {
            Self::Sha512(hash, _) => hash.update(bytes),
            Self::Blake3(hash, _) => {
                #[cfg(all(target_os = "macos", target_arch = "x86_64"))]
                if bytes.len() >= 128 * 1024 {
                    if let Some(pool) = verification_pool() {
                        pool.install(|| hash.update_rayon(bytes));
                        return;
                    }
                }
                hash.update(bytes);
            }
        }
    }

    pub(crate) fn finish(self) -> Result<()> {
        let algorithm = match self {
            Self::Sha512(hash, expected) => {
                if hash.finalize()[..] == expected {
                    return Ok(());
                }
                "SHA-512"
            }
            Self::Blake3(hash, expected) => {
                if hash.finalize().as_bytes() == &expected {
                    return Ok(());
                }
                "BLAKE3"
            }
        };
        Err(Error::new(
            ErrorKind::Integrity,
            format!("raw addon {algorithm} mismatch"),
        ))
    }
}

/// Bound Rosetta verification work without using the application's global
/// Rayon pool. Only worker threads are reused: every verification still reads
/// and hashes every file byte. Resource-constrained hosts hash sequentially.
#[cfg(all(target_os = "macos", target_arch = "x86_64"))]
fn verification_pool() -> Option<&'static rayon_core::ThreadPool> {
    static POOL: std::sync::OnceLock<Option<rayon_core::ThreadPool>> = std::sync::OnceLock::new();
    POOL.get_or_init(|| {
        let threads = std::thread::available_parallelism().ok()?.get().min(4);
        if threads < 2 {
            return None;
        }
        rayon_core::ThreadPoolBuilder::new()
            .num_threads(threads)
            .thread_name(|index| format!("swc-native-verify-{index}"))
            .build()
            .ok()
    })
    .as_ref()
}
