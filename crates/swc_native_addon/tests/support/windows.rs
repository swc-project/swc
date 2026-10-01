//! Real inherited ACL fixtures for the Windows cache and carrier suites.

use std::{ffi::c_void, io, os::windows::ffi::OsStrExt, path::Path, ptr};

use windows_sys::Win32::{
    Foundation::LocalFree,
    Security::{
        Authorization::{
            ConvertSecurityDescriptorToStringSecurityDescriptorW,
            ConvertStringSecurityDescriptorToSecurityDescriptorW, GetNamedSecurityInfoW,
            SDDL_REVISION_1, SE_FILE_OBJECT,
        },
        SetFileSecurityW, DACL_SECURITY_INFORMATION, OWNER_SECURITY_INFORMATION,
        PROTECTED_DACL_SECURITY_INFORMATION,
    },
};

#[derive(Clone, Copy, Debug)]
pub enum Grant {
    AppContainer,
    AuthenticatedUsers,
}

impl Grant {
    pub fn sid(self) -> &'static str {
        match self {
            Self::AppContainer => "S-1-15-3-1",
            Self::AuthenticatedUsers => "S-1-5-11",
        }
    }

    fn mask(self) -> &'static str {
        match self {
            Self::AppContainer => "0x1f01ff",
            Self::AuthenticatedUsers => "0x1301bf",
        }
    }
}

struct Allocation(*mut c_void);

impl Drop for Allocation {
    fn drop(&mut self) {
        unsafe { LocalFree(self.0) };
    }
}

fn wide(path: &Path) -> Vec<u16> {
    path.as_os_str().encode_wide().chain(Some(0)).collect()
}

/// Preserve our ownership while adding the grants inherited on the affected
/// machines. Descendants created by create_dir_all inherit effective copies.
pub fn unsafe_directory(path: &Path, grant: Grant) {
    swc_native_addon::platform::private_directory(path).unwrap();
    let namespace = swc_native_addon::platform::user_namespace().unwrap();
    let sid = namespace.strip_prefix("swc-native-").unwrap();
    let sddl: Vec<_> = format!(
        "D:P(A;OICI;FA;;;{sid})(A;OICI;FA;;;SY)(A;OICI;{};;;{})",
        grant.mask(),
        grant.sid()
    )
    .encode_utf16()
    .chain(Some(0))
    .collect();
    let mut descriptor = ptr::null_mut();
    assert_ne!(
        unsafe {
            ConvertStringSecurityDescriptorToSecurityDescriptorW(
                sddl.as_ptr(),
                SDDL_REVISION_1,
                &mut descriptor,
                ptr::null_mut(),
            )
        },
        0,
        "{}",
        io::Error::last_os_error()
    );
    let _descriptor = Allocation(descriptor);
    assert_ne!(
        unsafe {
            SetFileSecurityW(
                wide(path).as_ptr(),
                DACL_SECURITY_INFORMATION | PROTECTED_DACL_SECURITY_INFORMATION,
                descriptor,
            )
        },
        0,
        "{}",
        io::Error::last_os_error()
    );
}

/// Snapshot ownership and DACL to prove fallback never rewrites a caller root.
pub fn security(path: &Path) -> String {
    let information = OWNER_SECURITY_INFORMATION | DACL_SECURITY_INFORMATION;
    let mut descriptor = ptr::null_mut();
    let status = unsafe {
        GetNamedSecurityInfoW(
            wide(path).as_ptr(),
            SE_FILE_OBJECT,
            information,
            ptr::null_mut(),
            ptr::null_mut(),
            ptr::null_mut(),
            ptr::null_mut(),
            &mut descriptor,
        )
    };
    assert_eq!(status, 0, "{}", io::Error::from_raw_os_error(status as i32));
    let _descriptor = Allocation(descriptor);
    let mut text = ptr::null_mut();
    assert_ne!(
        unsafe {
            ConvertSecurityDescriptorToStringSecurityDescriptorW(
                descriptor,
                SDDL_REVISION_1,
                information,
                &mut text,
                ptr::null_mut(),
            )
        },
        0,
        "{}",
        io::Error::last_os_error()
    );
    let _text = Allocation(text.cast());
    let mut len = 0;
    unsafe {
        while *text.add(len) != 0 {
            len += 1;
        }
        String::from_utf16(std::slice::from_raw_parts(text, len)).unwrap()
    }
}
