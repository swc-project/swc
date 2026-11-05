use windows_sys::Win32::Security::{GetSecurityDescriptorDacl, GetSecurityDescriptorOwner};

use super::*;

#[test]
fn volume_root_fixtures() {
    use windows_sys::Win32::Storage::FileSystem::{
        DefineDosDeviceW, GetLogicalDrives, DDD_EXACT_MATCH_ON_REMOVE, DDD_NO_BROADCAST_SYSTEM,
        DDD_REMOVE_DEFINITION,
    };

    struct DosDevice {
        name: Vec<u16>,
        target: Vec<u16>,
    }

    impl Drop for DosDevice {
        fn drop(&mut self) {
            assert_ne!(
                unsafe {
                    DefineDosDeviceW(
                        DDD_REMOVE_DEFINITION | DDD_EXACT_MATCH_ON_REMOVE | DDD_NO_BROADCAST_SYSTEM,
                        self.name.as_ptr(),
                        self.target.as_ptr(),
                    )
                },
                0,
                "{}",
                io::Error::last_os_error()
            );
        }
    }

    let directory = tempfile::tempdir().unwrap();
    let drives = unsafe { GetLogicalDrives() };
    assert_ne!(drives, 0, "{}", io::Error::last_os_error());
    let letter = (b'D'..=b'Z')
        .rev()
        .find(|letter| drives & (1 << (letter - b'A')) == 0)
        .expect("a free drive letter for the SUBST fixture");
    let name = wide(Path::new(&format!("{}:", char::from(letter))));
    let target = wide(directory.path());
    assert_ne!(
        unsafe { DefineDosDeviceW(DDD_NO_BROADCAST_SYSTEM, name.as_ptr(), target.as_ptr()) },
        0,
        "{}",
        io::Error::last_os_error()
    );
    let device = DosDevice { name, target };
    let volume = fs::canonicalize(directory.path())
        .unwrap()
        .ancestors()
        .last()
        .unwrap()
        .to_path_buf();
    for line in include_str!("../../tests/fixtures/windows-volume-roots.txt").lines() {
        if line.is_empty() || line.starts_with('#') {
            continue;
        }
        let fields: Vec<_> = line.split('|').collect();
        let kind = fields[0];
        let expected = fields[1] == "root";
        let path = match kind {
            "volume" => volume.clone(),
            "directory" => directory.path().to_path_buf(),
            "subst" => PathBuf::from(format!("{}:\\", char::from(letter))),
            "verbatim-subst" => PathBuf::from(format!(r"\\?\{}:\", char::from(letter))),
            _ => panic!("unknown volume root fixture: {line}"),
        };
        let is_volume_root = ancestor_is_volume_root(&path).unwrap();
        assert_eq!(is_volume_root, expected, "{line}");
        let sddl: Vec<u16> = fields[2].encode_utf16().chain(Some(0)).collect();
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
        let mut present = 0;
        let mut defaulted = 0;
        let mut dacl = ptr::null_mut();
        assert_ne!(
            unsafe {
                GetSecurityDescriptorDacl(descriptor, &mut present, &mut dacl, &mut defaulted)
            },
            0
        );
        let result = validate_ancestor_security(
            &path,
            SYSTEM_SID,
            dacl,
            "S-1-5-21-1-2-3-1000",
            is_volume_root,
        );
        assert_eq!(result.is_ok(), expected, "{line}: {result:?}");
    }
    drop(device);
}

#[test]
fn newly_created_files_have_the_explicit_user_owner() {
    let root = tempfile::tempdir().unwrap();
    let directory = root.path().join("private");
    private_directory(&directory).unwrap();
    let path = directory.join("entry");
    let file = new_private_file(&path).unwrap();
    assert_eq!(
        new_private_file(&path).unwrap_err().kind(),
        io::ErrorKind::AlreadyExists
    );
    drop(file);
    // Reopening validates ownership, DACL, file kind, and hardlink count.
    open_regular(&path, false, false).unwrap();
    open_regular(&directory.join("lock"), true, true).unwrap();
    let stage = super::super::temporary_file(&directory, "stage-", ".tmp").unwrap();
    open_regular(stage.path(), false, false).unwrap();
}

#[test]
fn ancestor_acl_fixtures() {
    let path = Path::new(r"C:\Users\fixture");
    for line in include_str!("../../tests/fixtures/windows-acls.txt").lines() {
        if line.is_empty() || line.starts_with('#') {
            continue;
        }
        let fields: Vec<_> = line.split('|').collect();
        let path = Path::new(fields.get(3).copied().unwrap_or(r"C:\Users\fixture"));
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
            path.is_absolute() && path.parent().is_none(),
        );
        if fields[0] == "allow" {
            result.unwrap_or_else(|error| panic!("{line}: {error}"));
        } else {
            let message = result.expect_err(line).to_string();
            assert!(message.contains(&path.display().to_string()), "{message}");
            assert!(message.contains(fields[2]), "{message}");
        }
    }
    assert!(validate_ancestor_security(
        path,
        SYSTEM_SID,
        ptr::null_mut(),
        "S-1-5-21-1-2-3-1000",
        false
    )
    .is_err());
}
