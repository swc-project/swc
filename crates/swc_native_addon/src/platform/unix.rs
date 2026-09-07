use std::{
    env,
    ffi::CStr,
    fs::{self, File, OpenOptions},
    io,
    os::unix::{
        ffi::OsStrExt,
        fs::{DirBuilderExt, MetadataExt, OpenOptionsExt},
    },
    path::{Path, PathBuf},
};

use crate::{Error, ErrorKind, Result};

#[cfg(target_os = "macos")]
const STICKY_BIT: u32 = libc::S_ISVTX as u32;
#[cfg(not(target_os = "macos"))]
const STICKY_BIT: u32 = libc::S_ISVTX;

pub fn user_namespace() -> Result<String> {
    // The effective identity, not a user-controlled environment variable, owns
    // both the cache and the bytes subsequently passed to dlopen.
    Ok(format!("swc-native-{}", unsafe { libc::geteuid() }))
}

/// Use a per-user location rather than the system temporary directory: hardened
/// Linux installations commonly mount the latter `noexec`, which prevents the
/// dynamic loader from mapping a materialized addon.
pub fn user_cache_root() -> Result<PathBuf> {
    let root = env::var_os("XDG_CACHE_HOME")
        .filter(|value| Path::new(value).is_absolute())
        .or_else(|| {
            env::var_os("HOME").map(|home| {
                if cfg!(target_os = "macos") {
                    PathBuf::from(home).join("Library/Caches")
                } else {
                    PathBuf::from(home).join(".cache")
                }
                .into_os_string()
            })
        })
        .map(PathBuf::from)
        .ok_or_else(|| Error::new(ErrorKind::Cache, "cannot determine native addon user cache"))?;
    executable_cache_root(&root)?;
    Ok(root)
}

/// Reject roots from which the dynamic loader cannot map a materialized addon.
/// This applies to explicit custom roots as well as the user default.
pub fn executable_cache_root(root: &Path) -> Result<()> {
    if noexec_mount(root)? {
        return Err(Error::new(
            ErrorKind::Cache,
            format!(
                "native addon user cache {} is mounted noexec",
                root.display(),
            ),
        ));
    }
    Ok(())
}

/// A cache root and every ancestor must be stable after validation.  A
/// world-writable sticky directory such as /tmp is safe only when it belongs
/// to the effective user or root. A sticky directory owned by another user
/// still lets that owner rename our private namespace after validation.
pub fn secure_cache_root(root: &Path) -> io::Result<()> {
    if !root.is_absolute() {
        return Err(io::Error::new(
            io::ErrorKind::InvalidInput,
            "cache root must be absolute",
        ));
    }
    for directory in root.ancestors() {
        let metadata = fs::symlink_metadata(directory)?;
        if !metadata.is_dir() || metadata.file_type().is_symlink() {
            return Err(io::Error::new(
                io::ErrorKind::PermissionDenied,
                "cache root contains a non-directory or symlink",
            ));
        }
        if !writable_directory_is_secure(metadata.mode(), metadata.uid(), unsafe {
            libc::geteuid()
        }) {
            return Err(io::Error::new(
                io::ErrorKind::PermissionDenied,
                "cache root has a parent writable by another user without trusted sticky \
                 protection",
            ));
        }
    }
    Ok(())
}

fn writable_directory_is_secure(mode: u32, owner: u32, current: u32) -> bool {
    mode & 0o022 == 0 || (mode & STICKY_BIT != 0 && (owner == current || owner == 0))
}

#[cfg(target_os = "linux")]
fn noexec_mount(path: &Path) -> Result<bool> {
    let mut existing = path;
    while !existing.exists() {
        existing = existing
            .parent()
            .ok_or_else(|| Error::new(ErrorKind::Cache, "cache root has no existing ancestor"))?;
    }
    let path = fs::canonicalize(existing)
        .map_err(|e| Error::io(ErrorKind::Cache, "resolve native addon cache", e))?;
    let mounts = fs::read_to_string("/proc/self/mountinfo")
        .map_err(|e| Error::io(ErrorKind::Cache, "read Linux mount table", e))?;
    Ok(noexec_mount_in(&path, &mounts))
}

fn noexec_mount_in(path: &Path, mounts: &str) -> bool {
    let mut selected: Option<(PathBuf, bool)> = None;
    for line in mounts.lines() {
        let Some((before, _)) = line.split_once(" - ") else {
            continue;
        };
        let fields: Vec<_> = before.split_whitespace().collect();
        if fields.len() < 6 {
            continue;
        }
        let mount = PathBuf::from(fields[4].replace("\\040", " ").replace("\\011", "\t"));
        if path.starts_with(&mount)
            && selected.as_ref().map_or(true, |(current, _)| {
                mount.as_os_str().len() > current.as_os_str().len()
            })
        {
            selected = Some((mount, fields[5].split(',').any(|option| option == "noexec")));
        }
    }
    selected.is_some_and(|(_, noexec)| noexec)
}

#[cfg(not(target_os = "linux"))]
#[cfg(not(target_os = "macos"))]
fn noexec_mount(_path: &Path) -> Result<bool> {
    Ok(false)
}

#[cfg(target_os = "macos")]
fn noexec_mount(path: &Path) -> Result<bool> {
    use std::os::fd::AsRawFd;

    let mut existing = path;
    while !existing.exists() {
        existing = existing
            .parent()
            .ok_or_else(|| Error::new(ErrorKind::Cache, "cache root has no existing ancestor"))?;
    }
    let file = File::open(existing)
        .map_err(|e| Error::io(ErrorKind::Cache, "open native addon cache mount", e))?;
    let mut stat: libc::statfs = unsafe { std::mem::zeroed() };
    if unsafe { libc::fstatfs(file.as_raw_fd(), &mut stat) } != 0 {
        return Err(Error::io(
            ErrorKind::Cache,
            "inspect native addon cache mount",
            io::Error::last_os_error(),
        ));
    }
    Ok(mount_is_noexec(stat.f_flags))
}

#[cfg(target_os = "macos")]
fn mount_is_noexec(flags: u32) -> bool {
    flags & libc::MNT_NOEXEC as u32 != 0
}

pub fn private_directory(path: &Path) -> io::Result<()> {
    match fs::DirBuilder::new().mode(0o700).create(path) {
        Ok(()) => {}
        Err(e) if e.kind() == io::ErrorKind::AlreadyExists => {}
        Err(e) => return Err(e),
    }
    let metadata = fs::symlink_metadata(path)?;
    if !metadata.is_dir()
        || metadata.uid() != unsafe { libc::geteuid() }
        || metadata.mode() & 0o077 != 0
    {
        return Err(io::Error::new(
            io::ErrorKind::PermissionDenied,
            "cache directory must be a real directory owned by the current user with mode 0700",
        ));
    }
    Ok(())
}

pub fn open_regular(path: &Path, write: bool, create: bool) -> io::Result<File> {
    let file = OpenOptions::new()
        .read(true)
        .write(write)
        .create(create)
        .mode(0o600)
        .custom_flags(libc::O_NOFOLLOW | libc::O_CLOEXEC | libc::O_NONBLOCK)
        .open(path)?;
    let metadata = file.metadata()?;
    if !metadata.is_file()
        || metadata.uid() != unsafe { libc::geteuid() }
        || metadata.mode() & 0o022 != 0
        || metadata.nlink() != 1
    {
        return Err(io::Error::new(
            io::ErrorKind::PermissionDenied,
            "cache entry must be a private, regular, singly linked file",
        ));
    }
    Ok(file)
}

pub fn lock_exclusive(file: &File) -> io::Result<()> {
    use std::os::fd::AsRawFd;
    loop {
        if unsafe { libc::flock(file.as_raw_fd(), libc::LOCK_EX) } == 0 {
            return Ok(());
        }
        let error = io::Error::last_os_error();
        if error.kind() != io::ErrorKind::Interrupted {
            return Err(error);
        }
    }
}

pub fn sync_directory(path: &Path) -> io::Result<()> {
    File::open(path)?.sync_all()
}

/// Preserve installation permissions, group ownership, and security metadata
/// before replacing an image. Compression forks describe the carrier's bytes,
/// so the new raw image must regenerate those rather than inherit them.
pub fn copy_metadata(source: &File, destination: &File) -> io::Result<()> {
    use std::os::fd::AsRawFd;

    use xattr::FileExt;
    let metadata = source.metadata()?;
    if unsafe { libc::fchown(destination.as_raw_fd(), metadata.uid(), metadata.gid()) } != 0 {
        return Err(io::Error::last_os_error());
    }
    destination.set_permissions(metadata.permissions())?;
    for name in source.list_xattr()? {
        if name == "com.apple.decmpfs" || name == "com.apple.ResourceFork" {
            continue;
        }
        if let Some(value) = source.get_xattr(&name)? {
            // Security labels can be inherited correctly while setting even
            // that same value is forbidden by the host policy. Avoid needless
            // changes, but fail the optimization if a differing label cannot
            // be preserved.
            if destination.get_xattr(&name)?.as_deref() != Some(value.as_slice()) {
                destination.set_xattr(&name, &value)?;
            }
        }
    }
    Ok(())
}

/// Resolve an address within the mapped carrier, even after its directory
/// entry has been atomically replaced. No N-API path API is needed.
///
/// # Safety
/// `address` must point into a currently loaded native image.
pub unsafe fn carrier_path(address: *const std::ffi::c_void) -> Result<PathBuf> {
    let mut info: libc::Dl_info = std::mem::zeroed();
    if libc::dladdr(address, &mut info) == 0 || info.dli_fname.is_null() {
        return Err(Error::new(
            ErrorKind::Load,
            "dladdr could not locate the native carrier",
        ));
    }
    let name = CStr::from_ptr(info.dli_fname).to_bytes();
    let path = Path::new(std::ffi::OsStr::from_bytes(name));
    fs::canonicalize(path).map_err(|e| {
        Error::io(
            ErrorKind::Load,
            &format!("resolve carrier {}", path.display()),
            e,
        )
    })
}

pub fn compress_cache(_path: &Path) -> io::Result<()> {
    Ok(())
}

#[cfg(all(test, target_os = "linux"))]
mod tests {
    use std::path::Path;

    use super::{noexec_mount_in, writable_directory_is_secure};

    #[test]
    fn selects_the_most_specific_mount_option() {
        let mounts = "24 1 0:20 / / rw,relatime - ext4 /dev/root rw\n36 24 0:31 / /custom \
                      rw,noexec - tmpfs tmpfs rw\n";
        assert!(noexec_mount_in(Path::new("/custom/cache"), mounts));
        assert!(!noexec_mount_in(Path::new("/other/cache"), mounts));
    }

    #[test]
    fn rejects_sticky_writable_directory_owned_by_another_user() {
        assert!(writable_directory_is_secure(0o1777, 0, 1000));
        assert!(writable_directory_is_secure(0o1777, 1000, 1000));
        assert!(!writable_directory_is_secure(0o1777, 1001, 1000));
        assert!(!writable_directory_is_secure(0o0777, 1000, 1000));
    }
}

#[cfg(all(test, target_os = "macos"))]
mod macos_tests {
    #[test]
    fn recognizes_noexec_mount_flags() {
        assert!(super::mount_is_noexec(libc::MNT_NOEXEC as u32));
        assert!(!super::mount_is_noexec(0));
    }
}
