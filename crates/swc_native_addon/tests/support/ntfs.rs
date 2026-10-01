//! Construct compressed files/directories only for NTFS compatibility fixtures.

use std::{
    fs::{self, OpenOptions},
    io,
    os::windows::{
        fs::{MetadataExt, OpenOptionsExt},
        io::AsRawHandle,
    },
    path::Path,
    ptr,
};

use windows_sys::Win32::{
    Foundation::HANDLE,
    Storage::FileSystem::{
        COMPRESSION_FORMAT_DEFAULT, FILE_ATTRIBUTE_COMPRESSED, FILE_FLAG_BACKUP_SEMANTICS,
        FILE_FLAG_OPEN_REPARSE_POINT,
    },
    System::{Ioctl::FSCTL_SET_COMPRESSION, IO::DeviceIoControl},
};

pub fn is_compressed(path: &Path) -> bool {
    fs::metadata(path).unwrap().file_attributes() & FILE_ATTRIBUTE_COMPRESSED != 0
}

pub fn compress(path: &Path) -> io::Result<()> {
    let file = OpenOptions::new()
        .read(true)
        .write(true)
        .custom_flags(FILE_FLAG_BACKUP_SEMANTICS | FILE_FLAG_OPEN_REPARSE_POINT)
        .open(path)?;
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
