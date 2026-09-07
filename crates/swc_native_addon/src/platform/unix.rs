use std::{
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

pub fn user_namespace() -> Result<String> {
    // The effective identity, not a user-controlled environment variable, owns
    // both the cache and the bytes subsequently passed to dlopen.
    Ok(format!("swc-native-{}", unsafe { libc::geteuid() }))
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
