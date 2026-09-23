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

    pub(crate) fn update(&mut self, bytes: &[u8]) {
        match self {
            Self::Sha512(hash, _) => hash.update(bytes),
            Self::Blake3(hash, _) => {
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
