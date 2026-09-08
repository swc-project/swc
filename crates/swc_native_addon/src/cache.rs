//! Cache entries are immutable once published. The lock covers validation,
//! repair, publication, and dlopen/LoadLibrary, but never addon registration.
//! A digest is checked on every cache hit; a familiar filename is not proof.

use std::{
    env,
    ffi::OsString,
    fs::{self, File},
    io,
    path::{Path, PathBuf},
    time::SystemTime,
};

use tempfile::Builder;

use crate::{format::Payload, platform, Error, ErrorKind, Result};

const MAX_PERSISTENT_IMAGES: usize = 3;
const PRUNE_LOCK: &str = ".swc-native-prune.lock";

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
/// On Windows the cleanup handle is armed only after the image loader has
/// opened the DLL, then outlives every use of that DLL.
pub struct Materialized {
    path: PathBuf,
    temporary: bool,
    lock: Option<File>,
    cache_directory: Option<PathBuf>,
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
        #[cfg(windows)]
        if self.temporary {
            self._delete_on_close = Some(
                platform::delete_on_close(&self.path)
                    .map_err(|e| io_error("arm temporary addon cleanup", &self.path, e))?,
            );
        }
        self.lock = None;
        if let Some(directory) = &self.cache_directory {
            match namespace_lock(directory) {
                Ok(namespace) => {
                    if let Err(error) = prune(directory, &self.path) {
                        tracing::debug!(path = %directory.display(), %error, "native cache pruning failed");
                    }
                    drop(namespace);
                }
                Err(error) => {
                    tracing::debug!(path = %directory.display(), %error, "native cache pruning lock unavailable");
                }
            }
        }
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
    platform::executable_cache_root(root)?;
    platform::create_cache_root(root).map_err(|e| io_error("create cache root", root, e))?;
    platform::secure_cache_root(root).map_err(|e| io_error("validate cache root", root, e))?;
    let user = root.join(platform::user_namespace()?);
    platform::private_directory(&user).map_err(|e| io_error("secure cache directory", &user, e))?;
    let version = user.join("v1");
    platform::private_directory(&version)
        .map_err(|e| io_error("secure cache directory", &version, e))?;
    Ok(version)
}

pub fn materialize(payload: &Payload<'_>, mode: &CacheMode) -> Result<Materialized> {
    match mode {
        CacheMode::Temporary => temporary(payload),
        CacheMode::Default => cached_at(payload, &platform::user_cache_root()?),
        CacheMode::Custom(root) => match cached_at(payload, root) {
            Ok(file) => Ok(file),
            Err(custom) => {
                tracing::debug!(path = %root.display(), error = %custom, "custom native cache unavailable; using user cache");
                let default_root = platform::user_cache_root()?;
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
    Ok(Materialized {
        path,
        temporary: true,
        lock: None,
        cache_directory: None,
        #[cfg(windows)]
        _delete_on_close: None,
    })
}

fn namespace_lock(directory: &Path) -> Result<File> {
    let path = directory.join(PRUNE_LOCK);
    let lock = platform::open_regular(&path, true, true)
        .map_err(|e| io_error("open cache pruning lock", &path, e))?;
    platform::lock_exclusive(&lock).map_err(|e| io_error("lock cache pruning", &path, e))?;
    Ok(lock)
}

fn is_cache_key(path: &Path) -> bool {
    path.extension()
        .is_some_and(|extension| extension == "node")
        && path.file_stem().is_some_and(|stem| {
            stem.to_str().is_some_and(|stem| {
                stem.len() == 128 && stem.bytes().all(|byte| byte.is_ascii_hexdigit())
            })
        })
}

fn prune(directory: &Path, current: &Path) -> Result<()> {
    let mut entries = Vec::new();
    for entry in
        fs::read_dir(directory).map_err(|e| io_error("enumerate cache entries", directory, e))?
    {
        let entry = entry.map_err(|e| io_error("read cache entry", directory, e))?;
        let path = entry.path();
        if path != current && is_cache_key(&path) {
            let modified = entry
                .metadata()
                .and_then(|metadata| metadata.modified())
                .unwrap_or(SystemTime::UNIX_EPOCH);
            entries.push((modified, path));
        }
    }
    // Include the current image in the budget. Older images are evicted first.
    let mut remaining = entries.len() + 1;
    if remaining <= MAX_PERSISTENT_IMAGES {
        return Ok(());
    }
    entries.sort_unstable_by_key(|(modified, _)| *modified);
    for (_, image) in entries {
        if remaining <= MAX_PERSISTENT_IMAGES {
            break;
        }
        let Some(key) = image.file_stem() else {
            continue;
        };
        let lock_path = directory.join(key).with_extension("lock");
        let lock = match platform::open_regular(&lock_path, true, false) {
            Ok(lock) => lock,
            Err(error) => {
                tracing::debug!(path = %lock_path.display(), %error, "skip cache entry without a usable pruning lock");
                continue;
            }
        };
        match platform::try_lock_exclusive(&lock) {
            Ok(true) => {}
            Ok(false) => continue,
            Err(error) => {
                tracing::debug!(path = %lock_path.display(), %error, "skip cache entry whose pruning lock cannot be acquired");
                continue;
            }
        }
        match fs::remove_file(&image) {
            Ok(()) => {
                remaining -= 1;
                if let Err(error) = fs::remove_file(&lock_path) {
                    tracing::debug!(path = %lock_path.display(), %error, "remove stale native cache lock");
                }
            }
            Err(error) if error.kind() == io::ErrorKind::NotFound => {
                remaining -= 1;
            }
            Err(error) => {
                tracing::debug!(path = %image.display(), %error, "skip native cache entry that cannot be pruned");
            }
        }
    }
    Ok(())
}

/// Public within the private crate API to allow isolated-root concurrency
/// tests.
pub fn cached_at(payload: &Payload<'_>, root: &Path) -> Result<Materialized> {
    let directory = cache_directory(root)?;
    let key = payload.header.cache_key();
    let path = directory.join(format!("{key}.node"));
    let lock_path = directory.join(format!("{key}.lock"));
    // Coordinate lock-file creation with pruning. The per-entry lock remains
    // held after this short critical section, through native loading.
    let namespace = namespace_lock(&directory)?;
    let lock = platform::open_regular(&lock_path, true, true)
        .map_err(|e| io_error("open cache lock", &lock_path, e))?;
    platform::lock_exclusive(&lock).map_err(|e| io_error("lock cache entry", &lock_path, e))?;
    drop(namespace);
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
        platform::replace_file(&staged, &path)
            .map_err(|e| io_error("atomically publish cache entry", &path, e))?;
        platform::sync_directory(&directory)
            .map_err(|e| io_error("flush cache directory", &directory, e))?;
    }
    Ok(Materialized {
        path,
        temporary: false,
        lock: Some(lock),
        cache_directory: Some(directory),
        #[cfg(windows)]
        _delete_on_close: None,
    })
}
