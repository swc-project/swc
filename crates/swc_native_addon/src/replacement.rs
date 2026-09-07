//! Self-replacement always publishes a complete, transparently compressed file.
//! The mapped carrier is never edited, and the current process loads a
//! different inode/path: dlopen may otherwise return the already-loaded carrier
//! recursively.

use std::path::Path;

use crate::{cache::Materialized, format::Payload, Result};

/// Try the optional filesystem optimization. Errors leave the carrier intact
/// (except a directory-flush error after a completed atomic replacement) and
/// should be reported as diagnostics before falling back to the verified cache.
pub fn try_replace(payload: &Payload<'_>, carrier: &Path) -> Result<Option<Materialized>> {
    #[cfg(any(target_os = "linux", target_os = "macos"))]
    return supported::replace(payload, carrier);
    #[cfg(not(any(target_os = "linux", target_os = "macos")))]
    {
        let _ = (payload, carrier);
        // In particular, never attempt to replace a mapped Windows DLL.
        Ok(None)
    }
}

#[cfg(any(target_os = "linux", target_os = "macos"))]
mod supported {
    use std::{
        fs::{self, File},
        io::{self, Read},
        os::{fd::AsRawFd, unix::fs::MetadataExt},
        path::Path,
    };

    use tempfile::Builder;

    use crate::{
        cache,
        format::{Payload, MAX_SIZE},
        platform, Error, ErrorKind, Result,
    };

    fn fail(operation: &str, error: io::Error) -> Error {
        Error::io(ErrorKind::Cache, operation, error)
    }

    pub fn replace(payload: &Payload<'_>, carrier: &Path) -> Result<Option<cache::Materialized>> {
        let mut original =
            File::open(carrier).map_err(|e| fail("open carrier for replacement", e))?;
        if !supported_filesystem(&original)? {
            return Ok(None);
        }
        let metadata = original
            .metadata()
            .map_err(|e| fail("inspect carrier", e))?;
        if !metadata.is_file()
            || metadata.nlink() != 1
            || metadata.uid() != unsafe { libc::geteuid() }
        {
            return Ok(None);
        }
        // Lock the original inode. Competing first loads holding that inode must
        // recheck the pathname after acquiring the lock; only one can replace it.
        platform::lock_exclusive(&original).map_err(|e| fail("lock carrier", e))?;
        if !same_file(carrier, &metadata)? {
            return Ok(None);
        }
        // A process may reach registration after another process has already
        // replaced the path. Require this payload's header in the source image
        // before attempting replacement, never overwrite a different raw addon.
        if metadata.len() > MAX_SIZE {
            return Ok(None);
        }
        let mut bytes = Vec::new();
        original
            .read_to_end(&mut bytes)
            .map_err(|e| fail("inspect carrier payload", e))?;
        let header = payload.header.encode();
        if !bytes.windows(header.len()).any(|window| window == header) {
            return Ok(None);
        }
        drop(bytes);
        let parent = carrier
            .parent()
            .ok_or_else(|| Error::new(ErrorKind::Cache, "carrier has no parent directory"))?;
        let mut stage = Builder::new()
            .prefix(".swc-replace-")
            .suffix(".node")
            .tempfile_in(parent)
            .map_err(|e| fail("stage carrier replacement", e))?;
        payload.decode_into(stage.as_file_mut())?;
        stage
            .as_file()
            .set_permissions(metadata.permissions())
            .map_err(|e| fail("preserve carrier permissions", e))?;
        stage
            .as_file()
            .sync_all()
            .map_err(|e| fail("flush replacement", e))?;
        let candidate = compress(stage)?;
        let mut verified =
            File::open(&candidate).map_err(|e| fail("open compressed replacement", e))?;
        payload.header.verify(&mut verified)?;
        verified
            .sync_all()
            .map_err(|e| fail("flush compressed replacement", e))?;
        // Materialize the current process's distinct image before publishing.
        // Failure here leaves the original carrier available for every process.
        let temporary = cache::temporary(payload)?;
        if !same_file(carrier, &metadata)? {
            return Ok(None);
        }
        fs::rename(&candidate, carrier)
            .map_err(|e| fail("atomically replace native carrier", e))?;
        platform::sync_directory(parent).map_err(|e| fail("flush carrier directory", e))?;
        Ok(Some(temporary))
    }

    fn same_file(path: &Path, original: &fs::Metadata) -> Result<bool> {
        let current =
            fs::symlink_metadata(path).map_err(|e| fail("recheck carrier identity", e))?;
        Ok(current.is_file()
            && current.dev() == original.dev()
            && current.ino() == original.ino()
            && current.len() == original.len()
            && current.mtime() == original.mtime()
            && current.mtime_nsec() == original.mtime_nsec())
    }

    fn supported_filesystem(file: &File) -> Result<bool> {
        let mut status: libc::statfs = unsafe { std::mem::zeroed() };
        if unsafe { libc::fstatfs(file.as_raw_fd(), &mut status) } != 0 {
            return Err(fail(
                "identify carrier filesystem",
                io::Error::last_os_error(),
            ));
        }
        #[cfg(target_os = "linux")]
        return Ok(status.f_type as u64 == 0x9123_683e); // BTRFS_SUPER_MAGIC
        #[cfg(target_os = "macos")]
        return Ok(
            unsafe { std::ffi::CStr::from_ptr(status.f_fstypename.as_ptr()) }.to_bytes() == b"apfs",
        );
    }

    #[cfg(target_os = "linux")]
    fn compress(stage: tempfile::NamedTempFile) -> Result<tempfile::TempPath> {
        // These ioctl encodings are shared by the supported 64-bit Linux ABIs.
        // Set the inode policy AND rewrite already-written extents: setting only
        // FS_COMPR_FL does not retroactively compress the decoded file.
        #[repr(C)]
        struct DefragRange {
            start: u64,
            len: u64,
            flags: u64,
            extent_thresh: u32,
            compress_type: u32,
            unused: [u32; 4],
        }
        let fd = stage.as_file().as_raw_fd();
        let mut flags: libc::c_long = 0;
        if unsafe { libc::ioctl(fd, 0x8008_6601_u32 as _, &mut flags) } != 0 {
            return Err(fail("read btrfs inode flags", io::Error::last_os_error()));
        }
        flags = (flags | 0x4) & !0x400; // FS_COMPR_FL, clear FS_NOCOMP_FL
        if unsafe { libc::ioctl(fd, 0x4008_6602, &flags) } != 0 {
            return Err(fail("enable btrfs compression", io::Error::last_os_error()));
        }
        let range = DefragRange {
            start: 0,
            len: u64::MAX,
            flags: 3,
            extent_thresh: 1,
            compress_type: 1,
            unused: [0; 4], // zlib works on all supported btrfs kernels
        };
        if unsafe { libc::ioctl(fd, 0x4030_9410, &range) } != 0 {
            return Err(fail("compress btrfs extents", io::Error::last_os_error()));
        }
        stage
            .as_file()
            .sync_all()
            .map_err(|e| fail("flush btrfs extents", e))?;
        Ok(stage.into_temp_path())
    }

    #[cfg(target_os = "macos")]
    fn compress(stage: tempfile::NamedTempFile) -> Result<tempfile::TempPath> {
        use std::{os::macos::fs::MetadataExt as MacMetadataExt, process::Command};
        let parent = stage.path().parent().unwrap();
        let candidate = Builder::new()
            .prefix(".swc-compressed-")
            .suffix(".node")
            .tempfile_in(parent)
            .map_err(|e| fail("stage APFS compression", e))?
            .into_temp_path();
        // Apple's installed copier maintains the decmpfs resource-fork format.
        // Only a private staging file is passed to it, never the mapped carrier.
        let output = Command::new("/usr/bin/ditto")
            .args(["--hfsCompression", "--rsrc", "--extattr", "--acl", "--qtn"])
            .arg(stage.path())
            .arg(&candidate)
            .env_remove("DITTOABORT")
            .env_remove("DITTONORSRC")
            .env_remove("DITTOKEEPBINARIESPATTERN")
            .env_remove("DITTOKEEPBINARIESDIR")
            .env_remove("DITTO_TEST_OPTIONS")
            .output()
            .map_err(|e| fail("run APFS compression", e))?;
        if !output.status.success() {
            return Err(Error::new(
                ErrorKind::Cache,
                format!(
                    "APFS compression failed: {}",
                    String::from_utf8_lossy(&output.stderr)
                ),
            ));
        }
        let metadata = fs::metadata(&candidate).map_err(|e| fail("inspect APFS compression", e))?;
        if MacMetadataExt::st_flags(&metadata) & 0x20 == 0 {
            // UF_COMPRESSED
            return Err(Error::new(
                ErrorKind::Cache,
                "APFS declined transparent compression",
            ));
        }
        Ok(candidate)
    }
}
