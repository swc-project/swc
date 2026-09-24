//! Windows cannot unlink a mapped DLL. A small verified native worker waits
//! for a pipe to close at process teardown, then removes that unique image.

use std::{
    fs::File,
    io::{self, Read, Write},
    os::windows::{ffi::OsStrExt, process::CommandExt},
    path::Path,
    process::{Child, ChildStdin, Command, Stdio},
};

use crate::platform;

const HELPER: &[u8] = include_bytes!(concat!(env!("OUT_DIR"), "/cleanup.exe"));

pub(crate) struct Cleanup {
    // Closing stdin triggers the helper; dropping Child does not wait for it.
    _input: ChildStdin,
    _child: Child,
}

fn verified_helper(directory: &Path) -> io::Result<(std::path::PathBuf, File)> {
    let digest = blake3::hash(HELPER);
    let path = directory.join(format!("cleanup-{digest}.exe"));
    let lock = platform::open_regular(&directory.join(".cleanup.lock"), true, true)?;
    platform::lock_exclusive(&lock)?;
    let mut file = match platform::open_regular(&path, false, false) {
        Ok(file) => file,
        Err(error) if error.kind() == io::ErrorKind::NotFound => {
            let mut stage = platform::temporary_file(directory, "cleanup-", ".tmp")?;
            stage.write_all(HELPER)?;
            let stage = stage.into_temp_path();
            platform::replace_file(&stage, &path)?;
            platform::open_regular(&path, false, false)?
        }
        Err(error) => return Err(error),
    };
    // The filename alone never establishes trust, including on later starts.
    let mut bytes = Vec::new();
    (&mut file)
        .take(HELPER.len() as u64 + 1)
        .read_to_end(&mut bytes)?;
    if bytes.len() != HELPER.len() || blake3::hash(&bytes) != digest {
        return Err(io::Error::new(
            io::ErrorKind::InvalidData,
            "native cleanup helper is corrupt",
        ));
    }
    Ok((path, file))
}

pub(crate) fn arm(path: &Path) -> io::Result<Option<Cleanup>> {
    let directory = path.parent().ok_or(io::ErrorKind::InvalidInput)?;
    let (helper, _verified) = verified_helper(directory)?;
    let mut child = match Command::new(&helper)
        .stdin(Stdio::piped())
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .creation_flags(0x0800_0000) // CREATE_NO_WINDOW; never flash a console.
        .spawn()
    {
        Ok(child) => child,
        Err(error) => {
            // Application-control policies can allow a DLL while blocking a
            // child executable. Keep loading available with in-process Drop
            // cleanup only; a mapped image may remain after forced termination.
            // Helper integrity errors above still fail before any execution.
            tracing::warn!(path = %path.display(), helper = %helper.display(), %error,
                "native cleanup worker unavailable; temporary cleanup is best effort");
            return Ok(None);
        }
    };
    let mut input = child.stdin.take().unwrap();
    let bytes: Vec<_> = path
        .as_os_str()
        .encode_wide()
        .flat_map(u16::to_le_bytes)
        .collect();
    input.write_all(&bytes)?;
    tracing::debug!(path = %path.display(), helper_pid = child.id(), "armed native temporary cleanup");
    Ok(Some(Cleanup {
        _input: input,
        _child: child,
    }))
}
