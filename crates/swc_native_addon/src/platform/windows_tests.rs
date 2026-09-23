use windows_sys::Win32::Security::{GetSecurityDescriptorDacl, GetSecurityDescriptorOwner};

use super::*;

#[test]
fn ancestor_acl_fixtures() {
    let path = Path::new(r"C:\Users\fixture");
    for line in include_str!("../../tests/fixtures/windows-acls.txt").lines() {
        if line.is_empty() || line.starts_with('#') {
            continue;
        }
        let fields: Vec<_> = line.split('|').collect();
        let sddl: Vec<u16> = fields[1].encode_utf16().chain(Some(0)).collect();
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
            "{line}: {}",
            io::Error::last_os_error()
        );
        let _descriptor = LocalAllocation(descriptor);
        let mut owner = ptr::null_mut();
        let mut defaulted = 0;
        assert_ne!(
            unsafe { GetSecurityDescriptorOwner(descriptor, &mut owner, &mut defaulted) },
            0
        );
        let mut present = 0;
        let mut dacl = ptr::null_mut();
        assert_ne!(
            unsafe {
                GetSecurityDescriptorDacl(descriptor, &mut present, &mut dacl, &mut defaulted)
            },
            0
        );
        let result = validate_ancestor_security(
            path,
            &sid_string(owner).unwrap(),
            dacl,
            "S-1-5-21-1-2-3-1000",
        );
        if fields[0] == "allow" {
            result.unwrap_or_else(|error| panic!("{line}: {error}"));
        } else {
            let message = result.expect_err(line).to_string();
            assert!(message.contains(&path.display().to_string()), "{message}");
            assert!(message.contains(fields[2]), "{message}");
        }
    }
    assert!(
        validate_ancestor_security(path, SYSTEM_SID, ptr::null_mut(), "S-1-5-21-1-2-3-1000")
            .is_err()
    );
}
