use std::{
    env,
    ffi::{c_void, OsString},
    fs::{self, File, OpenOptions},
    io,
    os::windows::{
        ffi::{OsStrExt, OsStringExt},
        fs::{MetadataExt, OpenOptionsExt},
    },
    path::{Path, PathBuf},
    ptr,
};

use windows_sys::Win32::{
    Foundation::{CloseHandle, LocalFree, ERROR_ALREADY_EXISTS, ERROR_LOCK_VIOLATION, HANDLE},
    Security::{
        Authorization::{
            ConvertSidToStringSidW, ConvertStringSecurityDescriptorToSecurityDescriptorW,
            GetNamedSecurityInfoW, GetSecurityInfo, SDDL_REVISION_1, SE_FILE_OBJECT,
        },
        GetTokenInformation, TokenUser, OWNER_SECURITY_INFORMATION, SECURITY_ATTRIBUTES,
        TOKEN_QUERY, TOKEN_USER,
    },
    Storage::FileSystem::{
        CreateDirectoryW, GetFileInformationByHandle, LockFileEx, BY_HANDLE_FILE_INFORMATION,
        COMPRESSION_FORMAT_DEFAULT, FILE_ATTRIBUTE_REPARSE_POINT, FILE_FLAG_DELETE_ON_CLOSE,
        FILE_FLAG_OPEN_REPARSE_POINT, FILE_SHARE_DELETE, FILE_SHARE_READ, FILE_SHARE_WRITE,
        LOCKFILE_EXCLUSIVE_LOCK, LOCKFILE_FAIL_IMMEDIATELY,
    },
    System::{
        Ioctl::FSCTL_SET_COMPRESSION,
        LibraryLoader::{
            GetModuleFileNameW, GetModuleHandleExW, GET_MODULE_HANDLE_EX_FLAG_FROM_ADDRESS,
            GET_MODULE_HANDLE_EX_FLAG_UNCHANGED_REFCOUNT,
        },
        Threading::{GetCurrentProcess, OpenProcessToken},
        IO::{DeviceIoControl, OVERLAPPED},
    },
};

use crate::{Error, ErrorKind, Result};

fn wide(path: &Path) -> Vec<u16> {
    path.as_os_str().encode_wide().chain(Some(0)).collect()
}

struct OwnedHandle(HANDLE);
impl Drop for OwnedHandle {
    fn drop(&mut self) {
        unsafe {
            CloseHandle(self.0);
        }
    }
}

struct LocalAllocation(*mut c_void);
impl Drop for LocalAllocation {
    fn drop(&mut self) {
        unsafe {
            LocalFree(self.0);
        }
    }
}

fn sid_string(sid: *mut c_void) -> io::Result<String> {
    let mut text = ptr::null_mut();
    if unsafe { ConvertSidToStringSidW(sid, &mut text) } == 0 {
        return Err(io::Error::last_os_error());
    }
    let _allocation = LocalAllocation(text.cast());
    let mut len = 0;
    unsafe {
        while *text.add(len) != 0 {
            len += 1;
        }
        Ok(String::from_utf16_lossy(std::slice::from_raw_parts(
            text, len,
        )))
    }
}

fn current_sid() -> io::Result<String> {
    let mut token = 0;
    if unsafe { OpenProcessToken(GetCurrentProcess(), TOKEN_QUERY, &mut token) } == 0 {
        return Err(io::Error::last_os_error());
    }
    let token = OwnedHandle(token);
    let mut size = 0;
    unsafe {
        GetTokenInformation(token.0, TokenUser, ptr::null_mut(), 0, &mut size);
    }
    // TOKEN_USER contains pointers and needs pointer alignment, not Vec<u8>'s
    // nominal alignment. The trailing SID remains inside this allocation.
    let mut storage = vec![0_usize; (size as usize).div_ceil(std::mem::size_of::<usize>())];
    if unsafe {
        GetTokenInformation(
            token.0,
            TokenUser,
            storage.as_mut_ptr().cast(),
            size,
            &mut size,
        )
    } == 0
    {
        return Err(io::Error::last_os_error());
    }
    sid_string(unsafe { (*(storage.as_ptr().cast::<TOKEN_USER>())).User.Sid })
}

pub fn user_namespace() -> Result<String> {
    current_sid()
        .map(|sid| format!("swc-native-{sid}"))
        .map_err(|e| Error::io(ErrorKind::Cache, "identify cache owner", e))
}

pub fn user_cache_root() -> Result<PathBuf> {
    env::var_os("LOCALAPPDATA")
        .filter(|value| Path::new(value).is_absolute())
        .map(|value| PathBuf::from(value).join("swc"))
        .ok_or_else(|| Error::new(ErrorKind::Cache, "cannot determine native addon user cache"))
}

/// Windows does not expose a mount-level `noexec` equivalent for ordinary
/// addon cache paths. Filesystem access is validated during cache creation.
pub fn executable_cache_root(_root: &Path) -> Result<()> {
    Ok(())
}

pub fn secure_cache_root(root: &Path) -> io::Result<()> {
    if !root.is_absolute() {
        return Err(io::Error::new(
            io::ErrorKind::InvalidInput,
            "cache root must be absolute",
        ));
    }
    // A reparse point in any component can redirect a later pathname lookup.
    // Check the full chain before protecting the user-owned root below.
    for directory in root.ancestors() {
        let metadata = fs::symlink_metadata(directory)?;
        if !metadata.is_dir() || metadata.file_attributes() & FILE_ATTRIBUTE_REPARSE_POINT != 0 {
            return Err(io::Error::new(
                io::ErrorKind::PermissionDenied,
                "cache root contains a non-directory or reparse point",
            ));
        }
    }
    // The root itself must have the same owner-only DACL as the namespaces it
    // contains. This prevents a permissive inherited ACL from granting another
    // account FILE_DELETE_CHILD between validation and LoadLibrary.
    private_directory(root)?;
    Ok(())
}

pub fn private_directory(path: &Path) -> io::Result<()> {
    let sid = current_sid()?;
    let sddl: Vec<u16> = format!("O:{sid}D:P(A;;FA;;;{sid})(A;;FA;;;SY)")
        .encode_utf16()
        .chain(Some(0))
        .collect();
    let mut descriptor = ptr::null_mut();
    if unsafe {
        ConvertStringSecurityDescriptorToSecurityDescriptorW(
            sddl.as_ptr(),
            SDDL_REVISION_1,
            &mut descriptor,
            ptr::null_mut(),
        )
    } == 0
    {
        return Err(io::Error::last_os_error());
    }
    let _descriptor = LocalAllocation(descriptor);
    let attributes = SECURITY_ATTRIBUTES {
        nLength: std::mem::size_of::<SECURITY_ATTRIBUTES>() as u32,
        lpSecurityDescriptor: descriptor,
        bInheritHandle: 0,
    };
    if unsafe { CreateDirectoryW(wide(path).as_ptr(), &attributes) } == 0 {
        let error = io::Error::last_os_error();
        if error.raw_os_error() != Some(ERROR_ALREADY_EXISTS as i32) {
            return Err(error);
        }
    }
    let metadata = fs::symlink_metadata(path)?;
    if !metadata.is_dir() || metadata.file_attributes() & FILE_ATTRIBUTE_REPARSE_POINT != 0 {
        return Err(io::Error::new(
            io::ErrorKind::PermissionDenied,
            "cache directory must not be a reparse point",
        ));
    }
    let mut owner = ptr::null_mut();
    let mut security = ptr::null_mut();
    let status = unsafe {
        GetNamedSecurityInfoW(
            wide(path).as_ptr(),
            SE_FILE_OBJECT,
            OWNER_SECURITY_INFORMATION,
            &mut owner,
            ptr::null_mut(),
            ptr::null_mut(),
            ptr::null_mut(),
            &mut security,
        )
    };
    if status != 0 {
        return Err(io::Error::from_raw_os_error(status as i32));
    }
    let _security = LocalAllocation(security);
    if sid_string(owner)? != sid {
        return Err(io::Error::new(
            io::ErrorKind::PermissionDenied,
            "cache directory belongs to another user",
        ));
    }
    // An existing user-owned directory may have inherited a permissive DACL.
    // Restore the protected owner/SYSTEM DACL before using any cache entries.
    use windows_sys::Win32::Security::{
        SetFileSecurityW, DACL_SECURITY_INFORMATION, PROTECTED_DACL_SECURITY_INFORMATION,
    };
    if unsafe {
        SetFileSecurityW(
            wide(path).as_ptr(),
            DACL_SECURITY_INFORMATION | PROTECTED_DACL_SECURITY_INFORMATION,
            descriptor,
        )
    } == 0
    {
        return Err(io::Error::last_os_error());
    }
    Ok(())
}

pub fn open_regular(path: &Path, write: bool, create: bool) -> io::Result<File> {
    use std::os::windows::io::AsRawHandle;
    let file = OpenOptions::new()
        .read(true)
        .write(write)
        .create(create)
        .share_mode(FILE_SHARE_READ | FILE_SHARE_WRITE | FILE_SHARE_DELETE)
        .custom_flags(FILE_FLAG_OPEN_REPARSE_POINT)
        .open(path)?;
    let metadata = file.metadata()?;
    if !metadata.is_file() || metadata.file_attributes() & FILE_ATTRIBUTE_REPARSE_POINT != 0 {
        return Err(io::Error::new(
            io::ErrorKind::PermissionDenied,
            "cache entry must be a regular file without a reparse point",
        ));
    }
    let mut info: BY_HANDLE_FILE_INFORMATION = unsafe { std::mem::zeroed() };
    if unsafe { GetFileInformationByHandle(file.as_raw_handle() as HANDLE, &mut info) } == 0 {
        return Err(io::Error::last_os_error());
    }
    if info.nNumberOfLinks != 1 {
        return Err(io::Error::new(
            io::ErrorKind::PermissionDenied,
            "cache entry must not be hardlinked",
        ));
    }
    let mut owner = ptr::null_mut();
    let mut security = ptr::null_mut();
    let status = unsafe {
        GetSecurityInfo(
            file.as_raw_handle() as HANDLE,
            SE_FILE_OBJECT,
            OWNER_SECURITY_INFORMATION,
            &mut owner,
            ptr::null_mut(),
            ptr::null_mut(),
            ptr::null_mut(),
            &mut security,
        )
    };
    if status != 0 {
        return Err(io::Error::from_raw_os_error(status as i32));
    }
    let _security = LocalAllocation(security);
    if sid_string(owner)? != current_sid()? {
        return Err(io::Error::new(
            io::ErrorKind::PermissionDenied,
            "cache entry belongs to another user",
        ));
    }
    Ok(file)
}

pub fn lock_exclusive(file: &File) -> io::Result<()> {
    use std::os::windows::io::AsRawHandle;
    let mut overlapped: OVERLAPPED = unsafe { std::mem::zeroed() };
    if unsafe {
        LockFileEx(
            file.as_raw_handle() as HANDLE,
            LOCKFILE_EXCLUSIVE_LOCK,
            0,
            1,
            0,
            &mut overlapped,
        )
    } == 0
    {
        return Err(io::Error::last_os_error());
    }
    Ok(())
}

/// Try to acquire an exclusive lock without waiting for an active loader.
pub fn try_lock_exclusive(file: &File) -> io::Result<bool> {
    use std::os::windows::io::AsRawHandle;

    let mut overlapped: OVERLAPPED = unsafe { std::mem::zeroed() };
    if unsafe {
        LockFileEx(
            file.as_raw_handle() as HANDLE,
            LOCKFILE_EXCLUSIVE_LOCK | LOCKFILE_FAIL_IMMEDIATELY,
            0,
            1,
            0,
            &mut overlapped,
        )
    } != 0
    {
        return Ok(true);
    }
    let error = io::Error::last_os_error();
    if error.raw_os_error() == Some(ERROR_LOCK_VIOLATION as i32) {
        Ok(false)
    } else {
        Err(error)
    }
}

pub fn sync_directory(_path: &Path) -> io::Result<()> {
    // Windows does not expose POSIX directory fsync. All file contents are
    // flushed before the same-volume atomic rename; no partial file is visible.
    Ok(())
}

pub fn delete_on_close(path: &Path) -> io::Result<File> {
    // Retain a read/delete handle, not the writable decoder handle, while the
    // image is mapped. Kernel handle teardown also runs after abrupt process exit.
    OpenOptions::new()
        .read(true)
        .access_mode(0x8000_0000 | 0x0001_0000) // GENERIC_READ | DELETE
        .share_mode(FILE_SHARE_READ | FILE_SHARE_WRITE | FILE_SHARE_DELETE)
        .custom_flags(FILE_FLAG_DELETE_ON_CLOSE | FILE_FLAG_OPEN_REPARSE_POINT)
        .open(path)
}

/// # Safety
/// `address` must point into a currently loaded native image.
pub unsafe fn carrier_path(address: *const c_void) -> Result<PathBuf> {
    let mut module = 0;
    if GetModuleHandleExW(
        GET_MODULE_HANDLE_EX_FLAG_FROM_ADDRESS | GET_MODULE_HANDLE_EX_FLAG_UNCHANGED_REFCOUNT,
        address.cast(),
        &mut module,
    ) == 0
    {
        return Err(Error::io(
            ErrorKind::Load,
            "locate native carrier module",
            io::Error::last_os_error(),
        ));
    }
    let mut buffer = vec![0; 256];
    loop {
        let len = GetModuleFileNameW(module, buffer.as_mut_ptr(), buffer.len() as u32) as usize;
        if len == 0 {
            return Err(Error::io(
                ErrorKind::Load,
                "resolve native carrier path",
                io::Error::last_os_error(),
            ));
        }
        if len < buffer.len() {
            return Ok(PathBuf::from(OsString::from_wide(&buffer[..len])));
        }
        if buffer.len() >= 32768 {
            return Err(Error::new(
                ErrorKind::Load,
                "native carrier path exceeds Windows path limit",
            ));
        }
        buffer.resize((buffer.len() * 2).min(32768), 0);
    }
}

pub fn compress_cache(path: &Path) -> io::Result<()> {
    use std::os::windows::io::AsRawHandle;
    let file = open_regular(path, true, false)?;
    let mut format = COMPRESSION_FORMAT_DEFAULT;
    let mut returned = 0;
    if unsafe {
        DeviceIoControl(
            file.as_raw_handle() as HANDLE,
            FSCTL_SET_COMPRESSION,
            (&mut format as *mut u16).cast(),
            2,
            ptr::null_mut(),
            0,
            &mut returned,
            ptr::null_mut(),
        )
    } == 0
    {
        return Err(io::Error::last_os_error());
    }
    Ok(())
}
