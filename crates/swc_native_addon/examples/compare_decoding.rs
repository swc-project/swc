//! Measure runtime BLAKE3 decoding into a staging file for one fixed zstd
//! frame.
use std::{fs, io::Cursor, time::Instant};

use sha2::{Digest, Sha512};
use swc_native_addon::{
    format::{Header, NativeTarget, Payload, HEADER_LEN},
    integrity::RuntimeIntegrity,
};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args: Vec<_> = std::env::args_os().collect();
    if args.len() != 3 {
        return Err("expected <raw-host-addon.node> <frame.zst>".into());
    }
    let raw = fs::read(&args[1])?;
    let compressed = fs::read(&args[2])?;
    let header = Header {
        target: NativeTarget::host().ok_or("unsupported host")?,
        compressed_len: compressed.len() as u64,
        raw_len: raw.len() as u64,
        digest: Sha512::digest(&raw).into(),
    };
    let integrity = RuntimeIntegrity::from_raw(&header, &mut Cursor::new(&raw))?;
    let mut bytes = Vec::with_capacity(HEADER_LEN + compressed.len());
    bytes.extend_from_slice(&header.encode());
    bytes.extend_from_slice(&compressed);
    drop(compressed);
    drop(raw);
    let payload = Payload::parse(&bytes)?.with_integrity(integrity)?;
    for round in 0..14 {
        let mut output = tempfile::tempfile()?;
        let cpu_start = process_cpu_seconds();
        let start = Instant::now();
        payload.decode_into(&mut output)?;
        let decode_ms = start.elapsed().as_secs_f64() * 1000.0;
        let cpu_ms = cpu_start
            .zip(process_cpu_seconds())
            .map_or(f64::NAN, |(start, end)| (end - start) * 1000.0);
        // Independent full-byte verification is outside the timed region.
        header.verify(&mut output)?;
        println!("round={round} decode_ms={decode_ms:.3} cpu_ms={cpu_ms:.3}");
    }
    Ok(())
}

#[cfg(unix)]
fn process_cpu_seconds() -> Option<f64> {
    let mut time = libc::timespec {
        tv_sec: 0,
        tv_nsec: 0,
    };
    // Measure CPU consumed by this benchmark process, excluding scheduler waits.
    let result = unsafe { libc::clock_gettime(libc::CLOCK_PROCESS_CPUTIME_ID, &mut time) };
    (result == 0).then(|| time.tv_sec as f64 + time.tv_nsec as f64 / 1_000_000_000.0)
}

#[cfg(not(unix))]
fn process_cpu_seconds() -> Option<f64> {
    None
}
