//! A private, single-file cleanup worker. EOF on the noninherited writer means
//! that the owning materialization was dropped or its process terminated.
//! Windows may release an image section slightly later, so deletion is retried.
#![windows_subsystem = "windows"]

use std::{
    ffi::OsString,
    fs,
    io::{self, Read},
    os::windows::ffi::OsStringExt,
    path::PathBuf,
    time::{Duration, Instant},
};

fn cleanup() -> io::Result<()> {
    let mut bytes = Vec::new();
    // Windows paths have at most 32,767 UTF-16 code units. Read one extra unit
    // to detect oversized input instead of deleting a truncated pathname.
    io::stdin().take(65_536).read_to_end(&mut bytes)?;
    if bytes.is_empty() || bytes.len() >= 65_536 || bytes.len() % 2 != 0 {
        return Err(io::ErrorKind::InvalidInput.into());
    }
    let wide: Vec<_> = bytes
        .chunks_exact(2)
        .map(|pair| u16::from_le_bytes([pair[0], pair[1]]))
        .collect();
    let path = PathBuf::from(OsString::from_wide(&wide));
    if !path.is_absolute() || wide.contains(&0) {
        return Err(io::ErrorKind::InvalidInput.into());
    }
    let deadline = Instant::now() + Duration::from_secs(10);
    loop {
        match fs::remove_file(&path) {
            Ok(()) => return Ok(()),
            Err(error) if error.kind() == io::ErrorKind::NotFound => return Ok(()),
            Err(error) if Instant::now() >= deadline => return Err(error),
            Err(_) => std::thread::sleep(Duration::from_millis(25)),
        }
    }
}

fn main() {
    if cleanup().is_err() {
        std::process::exit(1);
    }
}
