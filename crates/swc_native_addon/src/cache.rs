//! Cache entries are immutable once published. The lock covers validation,
//! repair, publication, and dlopen/LoadLibrary, but never addon registration.
//! A digest is checked on every cache hit; a familiar filename is not proof.

use std::{
    env,
    ffi::OsString,
    fs::{self, File},
    io,
    path::{Path, PathBuf},
};

use tempfile::Builder;

use crate::{format::Payload, platform, Error, ErrorKind, Result};

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum CacheMode {
    Default,
    Temporary,
    Custom(PathBuf),
}

impl CacheMode {
    pub fn from_env() -> Result<Self> {
        Self::parse(env::var_os("SWC_NATIVE_BINDING_CACHE"))
    }

    pub fn parse(value: Option<OsString>) -> Result<Self> {
        match value {
            None => Ok(Self::Default),
            Some(value) if value.is_empty() => Ok(Self::Default),
            Some(value) if value == "0" => Ok(Self::Temporary),
            Some(value) => {
                let path = PathBuf::from(value);
                if !path.is_absolute() {
                    return Err(Error::new(
                        ErrorKind::Configuration,
                        "SWC_NATIVE_BINDING_CACHE must be 0 or an absolute directory; unset it to \
                         use the default user cache",
                    ));
                }
                Ok(Self::Custom(path))
            }
        }
    }
}

/// Owns staging cleanup and cache coordination until loading has succeeded.
/// On Windows the cleanup handle must outlive every use of the loaded DLL.
pub struct Materialized {
    path: PathBuf,
    temporary: bool,
    lock: Option<File>,
    #[cfg(windows)]
    _delete_on_close: Option<File>,
}

impl Materialized {
    pub fn path(&self) -> &Path {
        &self.path
    }

    /// Call immediately after successful native loading, before registration.
    pub fn loaded(&mut self) -> Result<()> {
        #[cfg(unix)]
        if self.temporary {
            fs::remove_file(&self.path)
                .map_err(|e| Error::io(ErrorKind::Cache, "unlink loaded temporary addon", e))?;
            self.temporary = false;
        }
        self.lock = None;
        Ok(())
    }
}

impl Drop for Materialized {
    fn drop(&mut self) {
        if self.temporary {
            // On Windows the delete-on-close handle performs final cleanup even
            // when the process exits without running Rust destructors.
            let _ = fs::remove_file(&self.path);
        }
    }
}

fn io_error(operation: &str, path: &Path, error: io::Error) -> Error {
    Error::io(
        ErrorKind::Cache,
        &format!("{operation} {}", path.display()),
        error,
    )
}

/// The user namespace is used for custom roots too, so explicitly shared parent
/// directories cannot accidentally turn the cache into a cross-user code
/// source.
pub fn cache_directory(root: &Path) -> Result<PathBuf> {
    fs::create_dir_all(root).map_err(|e| io_error("create cache root", root, e))?;
    platform::secure_cache_root(root).map_err(|e| io_error("validate cache root", root, e))?;
    let user = root.join(platform::user_namespace()?);
    platform::private_directory(&user).map_err(|e| io_error("secure cache directory", &user, e))?;
    let version = user.join("v1");
    platform::private_directory(&version)
        .map_err(|e| io_error("secure cache directory", &version, e))?;
    Ok(version)
}

pub fn materialize(payload: &Payload<'_>, mode: &CacheMode) -> Result<Materialized> {
    let default_root = platform::user_cache_root()?;
    match mode {
        CacheMode::Temporary => temporary(payload),
        CacheMode::Default => cached_at(payload, &default_root),
        CacheMode::Custom(root) => match cached_at(payload, root) {
            Ok(file) => Ok(file),
            Err(custom) => {
                tracing::debug!(path = %root.display(), error = %custom, "custom native cache unavailable; using user cache");
                cached_at(payload, &default_root).map_err(|default| {
                    Error::new(
                        ErrorKind::Cache,
                        format!(
                            "custom cache failed: {custom}; default cache failed: {default}; make \
                             either directory writable or unset SWC_NATIVE_BINDING_CACHE"
                        ),
                    )
                })
            }
        },
    }
}

/// Materialize without consulting or creating any persistent digest entry.
pub fn temporary(payload: &Payload<'_>) -> Result<Materialized> {
    let root = platform::user_cache_root()?;
    let dir = cache_directory(&root)?;
    let mut file = Builder::new()
        .prefix(&format!("process-{}-", std::process::id()))
        .suffix(".node")
        .tempfile_in(&dir)
        .map_err(|e| io_error("create temporary addon", &dir, e))?;
    payload.decode_into(file.as_file_mut())?;
    file.as_file()
        .sync_all()
        .map_err(|e| io_error("flush temporary addon", file.path(), e))?;
    // Close the writable file before mapping an image on Windows. Retaining a
    // write handle can conflict with the OS image loader's sharing requirements.
    let path = file
        .into_temp_path()
        .keep()
        .map_err(|e| io_error("retain temporary addon", &dir, e.error))?;
    #[cfg(windows)]
    let delete_on_close = match platform::delete_on_close(&path) {
        Ok(file) => file,
        Err(e) => {
            let _ = fs::remove_file(&path);
            return Err(io_error("arm temporary addon cleanup", &path, e));
        }
    };
    Ok(Materialized {
        path,
        temporary: true,
        lock: None,
        #[cfg(windows)]
        _delete_on_close: Some(delete_on_close),
    })
}

/// Public within the private crate API to allow isolated-root concurrency
/// tests.
pub fn cached_at(payload: &Payload<'_>, root: &Path) -> Result<Materialized> {
    let directory = cache_directory(root)?;
    let key = payload.header.cache_key();
    let path = directory.join(format!("{key}.node"));
    let lock_path = directory.join(format!("{key}.lock"));
    let lock = platform::open_regular(&lock_path, true, true)
        .map_err(|e| io_error("open cache lock", &lock_path, e))?;
    platform::lock_exclusive(&lock).map_err(|e| io_error("lock cache entry", &lock_path, e))?;
    let valid = match platform::open_regular(&path, false, false) {
        Ok(mut file) => match payload.header.verify(&mut file) {
            Ok(()) => true,
            Err(error) => {
                tracing::warn!(path = %path.display(), %error, "rejecting corrupt native cache entry; rebuilding from payload");
                false
            }
        },
        Err(e) if e.kind() == io::ErrorKind::NotFound => false,
        // Never follow or repair an attacker-controlled special file. A custom
        // root can still fall back to the private default root.
        Err(e) => return Err(io_error("open cache entry", &path, e)),
    };
    if !valid {
        let mut staged = Builder::new()
            .prefix("publish-")
            .suffix(".tmp")
            .tempfile_in(&directory)
            .map_err(|e| io_error("stage cache entry", &directory, e))?;
        payload.decode_into(staged.as_file_mut())?;
        staged
            .as_file()
            .sync_all()
            .map_err(|e| io_error("flush cache entry", staged.path(), e))?;
        // Compression is an optimization. Its failure must never turn verified
        // bytes into an invalid addon or force a Windows carrier replacement.
        if let Err(error) = platform::compress_cache(staged.path()) {
            tracing::debug!(%error, "native cache filesystem compression unavailable");
        }
        payload.header.verify(staged.as_file_mut())?;
        // All cooperating readers hold the digest lock, including during repair.
        // No writer ever truncates the canonical filename in place.
        let staged = staged.into_temp_path();
        fs::rename(&staged, &path)
            .map_err(|e| io_error("atomically publish cache entry", &path, e))?;
        platform::sync_directory(&directory)
            .map_err(|e| io_error("flush cache directory", &directory, e))?;
    }
    Ok(Materialized {
        path,
        temporary: false,
        lock: Some(lock),
        #[cfg(windows)]
        _delete_on_close: None,
    })
}
