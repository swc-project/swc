use std::{
    fs::{File, OpenOptions},
    io::{self, ErrorKind, Write},
    path::{Path, PathBuf},
    sync::atomic::{AtomicU64, Ordering},
};

static TEMP_FILE_COUNTER: AtomicU64 = AtomicU64::new(0);

/// Writes a serialized module without exposing a partially-written cache file.
///
/// Jest and other parallel runners can load the same plugin from multiple
/// processes. Writing directly to the final path allows one process to observe
/// another process's incomplete Wasmer artifact. A temporary file in the same
/// directory keeps the final rename atomic.
pub(crate) fn write_atomic(path: &Path, data: &[u8]) -> io::Result<()> {
    let (temporary_path, mut file) = create_temporary_file(path)?;

    if let Err(err) = file.write_all(data) {
        drop(file);
        let _ = std::fs::remove_file(&temporary_path);
        return Err(err);
    }
    drop(file);

    match std::fs::rename(&temporary_path, path) {
        Ok(()) => Ok(()),
        // Windows does not replace an existing file with rename. Another process
        // publishing the same content first is a successful cache write for us.
        Err(_) if path.is_file() => {
            let _ = std::fs::remove_file(&temporary_path);
            Ok(())
        }
        Err(err) => {
            let _ = std::fs::remove_file(&temporary_path);
            Err(err)
        }
    }
}

fn create_temporary_file(path: &Path) -> io::Result<(PathBuf, File)> {
    loop {
        let id = TEMP_FILE_COUNTER.fetch_add(1, Ordering::Relaxed);
        let mut temporary_path = path.as_os_str().to_os_string();
        temporary_path.push(format!(".{}.{}.tmp", std::process::id(), id));
        let temporary_path = PathBuf::from(temporary_path);

        match OpenOptions::new()
            .create_new(true)
            .write(true)
            .open(&temporary_path)
        {
            Ok(file) => return Ok((temporary_path, file)),
            Err(err) if err.kind() == ErrorKind::AlreadyExists => continue,
            Err(err) => return Err(err),
        }
    }
}

#[cfg(test)]
mod tests {
    use std::sync::{Arc, Barrier};

    use super::*;

    #[test]
    fn concurrent_writers_only_publish_complete_cache_files() {
        const WRITER_COUNT: usize = 8;
        const PAYLOAD_SIZE: usize = 2 * 1024 * 1024;

        let directory = tempfile::tempdir().unwrap();
        let cache_path = directory.path().join("plugin.wasmer");
        let barrier = Arc::new(Barrier::new(WRITER_COUNT + 1));
        let payloads: Vec<_> = (0..WRITER_COUNT)
            .map(|index| Arc::new(vec![index as u8; PAYLOAD_SIZE]))
            .collect();

        let handles: Vec<_> = payloads
            .iter()
            .map(|payload| {
                let barrier = barrier.clone();
                let cache_path = cache_path.clone();
                let payload = payload.clone();
                std::thread::spawn(move || {
                    barrier.wait();
                    write_atomic(&cache_path, &payload)
                })
            })
            .collect();

        barrier.wait();
        while handles.iter().any(|handle| !handle.is_finished()) {
            if let Ok(data) = std::fs::read(&cache_path) {
                assert!(payloads.iter().any(|payload| payload.as_slice() == data));
            }
        }

        for handle in handles {
            handle.join().unwrap().unwrap();
        }

        let data = std::fs::read(&cache_path).unwrap();
        assert!(payloads.iter().any(|payload| payload.as_slice() == data));
        assert_eq!(std::fs::read_dir(directory.path()).unwrap().count(), 1);
    }
}
