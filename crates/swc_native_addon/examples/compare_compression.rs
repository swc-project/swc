//! Compare payload sizes and packing times using the same stripped host addon.
use std::{fs, io::Cursor, time::Instant};

use sha2::{Digest, Sha512};
use swc_native_addon::format::{native_target, pack, Header, NativeTarget, Payload, HEADER_LEN};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let path = std::env::args_os()
        .nth(1)
        .ok_or("expected a stripped native addon path")?;
    let variants = match std::env::args().nth(2).as_deref() {
        None => vec![false, true, true, false],
        Some("--baseline") => vec![false],
        Some("--candidate") => vec![true],
        _ => return Err("expected --baseline or --candidate".into()),
    };
    let raw = fs::read(path)?;
    let target = NativeTarget::host().ok_or("unsupported host")?;
    // Alternate order by default. Single-variant runs allow an external tool
    // to measure peak process memory without carrying over another variant.
    for changed in variants {
        let start = Instant::now();
        let bytes = if changed {
            pack(&raw, target)?
        } else {
            native_target(&mut Cursor::new(&raw), raw.len() as u64, target)?;
            let compressed = zstd::bulk::compress(&raw, 16)?;
            let header = Header {
                target,
                compressed_len: compressed.len() as u64,
                raw_len: raw.len() as u64,
                digest: Sha512::digest(&raw).into(),
            };
            let mut bytes = Vec::with_capacity(HEADER_LEN + compressed.len());
            bytes.extend_from_slice(&header.encode());
            bytes.extend_from_slice(&compressed);
            bytes
        };
        let seconds = start.elapsed().as_secs_f64();
        let mut output = Cursor::new(Vec::new());
        let decode_start = Instant::now();
        Payload::parse(&bytes)?.decode_into(&mut output)?;
        let size = bytes.len() - HEADER_LEN;
        let decode_ms = decode_start.elapsed().as_secs_f64() * 1000.0;
        assert_eq!(output.into_inner(), raw);
        println!(
            "changed={changed} compressed_bytes={size} pack_seconds={seconds:.3} \
             decode_ms={decode_ms:.3}"
        );
    }
    Ok(())
}
