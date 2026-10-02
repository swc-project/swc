//! Check the security opt-out through the real Node registration fixture.

use std::{
    ffi::OsStr,
    fs,
    os::unix::fs::{symlink, PermissionsExt},
    path::Path,
    process::Command,
};

use super::{checked, fixture_source};

pub fn check_cache_security_opt_out(node: &OsStr, carrier: &Path, raw: &[u8], key: &str) {
    let temporary = tempfile::tempdir().unwrap();
    let root = temporary.path().canonicalize().unwrap();
    let shared = root.join("shared");
    fs::create_dir(&shared).unwrap();
    fs::set_permissions(&shared, fs::Permissions::from_mode(0o770)).unwrap();
    let alias = root.join("alias");
    symlink(&shared, &alias).unwrap();
    let default = alias.join("default");
    let custom = alias.join("custom");
    // Keep self-replacement from hiding a cache validation failure on btrfs.
    let installed = root.join("carrier.node");
    fs::hard_link(carrier, &installed).unwrap();

    for mode in [None, Some(custom.as_os_str()), Some(OsStr::new("0"))] {
        for (opt_out, action) in [(None, "loader-error"), (Some("1"), "success")] {
            let mut command = Command::new(node);
            command
                .arg(fixture_source("smoke.cjs"))
                .arg(&installed)
                .arg(action)
                .env("XDG_CACHE_HOME", &default)
                .env_remove("SWC_NATIVE_BINDING_CACHE")
                .env_remove("SWC_NATIVE_BINDING_CACHE_SKIP_SECURITY_CHECK");
            if let Some(mode) = mode {
                command.env("SWC_NATIVE_BINDING_CACHE", mode);
            }
            if let Some(opt_out) = opt_out {
                command.env("SWC_NATIVE_BINDING_CACHE_SKIP_SECURITY_CHECK", opt_out);
            }
            checked(&mut command);
        }

        let selected = if mode == Some(custom.as_os_str()) {
            &custom
        } else {
            &default
        };
        let directory = selected
            .join(swc_native_addon::platform::user_namespace().unwrap())
            .join("v1");
        if mode == Some(OsStr::new("0")) {
            assert!(fs::read_dir(&directory).unwrap().all(|entry| {
                !entry
                    .unwrap()
                    .file_name()
                    .to_string_lossy()
                    .starts_with("process-")
            }));
        } else {
            assert_eq!(
                fs::read(directory.join(format!("{key}.node"))).unwrap(),
                raw
            );
        }
    }
}
