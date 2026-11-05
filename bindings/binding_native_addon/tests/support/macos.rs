//! Exercise the default macOS policy through the real signed carrier fixture.

use std::{
    ffi::OsStr,
    fs,
    os::unix::fs::{MetadataExt, PermissionsExt},
    path::Path,
    process::Command,
};

use super::fixture_source;

#[derive(Clone, Copy, Debug)]
enum Installation {
    Default,
    Empty,
    Custom,
    Fallback,
    Temporary,
    Hardlinked,
    ReadOnly,
}

pub fn check_cache_policy(node: &OsStr, source: &Path, raw: &[u8], key: &str) {
    for installation in [
        Installation::Default,
        Installation::Empty,
        Installation::Custom,
        Installation::Fallback,
        Installation::Temporary,
        Installation::Hardlinked,
        Installation::ReadOnly,
    ] {
        let temporary = tempfile::tempdir().unwrap();
        // Darwin's /var alias is intentionally not accepted by cache validation.
        let root = temporary.path().canonicalize().unwrap();
        let installed = root.join("installed");
        fs::create_dir(&installed).unwrap();
        let carrier = installed.join("carrier.node");
        fs::copy(source, &carrier).unwrap();
        let original = fs::read(&carrier).unwrap();
        let default = root.join("default");
        let custom = root.join("custom");
        let blocked = root.join("blocked");
        fs::write(&blocked, b"unusable cache root").unwrap();
        if matches!(installation, Installation::Hardlinked) {
            fs::hard_link(&carrier, installed.join("carrier-link.node")).unwrap();
        }
        if matches!(installation, Installation::ReadOnly) {
            fs::set_permissions(&carrier, fs::Permissions::from_mode(0o444)).unwrap();
            fs::set_permissions(&installed, fs::Permissions::from_mode(0o555)).unwrap();
        }
        let before = fs::metadata(&carrier).unwrap();
        let mut command = Command::new(node);
        command
            .arg(fixture_source("smoke.cjs"))
            .arg(&carrier)
            .arg("success")
            .env("XDG_CACHE_HOME", &default)
            .env_remove("SWC_NATIVE_BINDING_CACHE");
        let cache_root = match installation {
            Installation::Default => &default,
            Installation::Empty => {
                command.env("SWC_NATIVE_BINDING_CACHE", "");
                &default
            }
            Installation::Fallback => {
                command.env("SWC_NATIVE_BINDING_CACHE", &blocked);
                &default
            }
            Installation::Temporary => {
                command.env("SWC_NATIVE_BINDING_CACHE", "0");
                &default
            }
            _ => {
                command.env("SWC_NATIVE_BINDING_CACHE", &custom);
                &custom
            }
        };
        let mut image_identity = None;
        for load in 0..3 {
            // Each invocation is a fresh Node process: cold, warm, then repair.
            let output = command.output().unwrap();
            if !output.status.success() {
                fs::set_permissions(&installed, fs::Permissions::from_mode(0o755)).unwrap();
                panic!(
                    "{installation:?}: {}",
                    String::from_utf8_lossy(&output.stderr)
                );
            }
            let after = fs::metadata(&carrier).unwrap();
            assert_eq!(after.ino(), before.ino(), "{installation:?}");
            assert_eq!(after.mode(), before.mode(), "{installation:?}");
            assert_eq!(after.nlink(), before.nlink(), "{installation:?}");
            assert_eq!(fs::read(&carrier).unwrap(), original, "{installation:?}");
            let directory = swc_native_addon::cache::cache_directory(cache_root).unwrap();
            let image = directory.join(format!("{key}.node"));
            if matches!(installation, Installation::Temporary) {
                assert!(!image.exists());
                assert!(fs::read_dir(&directory).unwrap().all(|entry| {
                    entry
                        .unwrap()
                        .path()
                        .extension()
                        .map_or(true, |ext| ext != "node")
                }));
            } else {
                assert_eq!(fs::read(&image).unwrap(), raw, "{installation:?}");
                let metadata = fs::metadata(&image).unwrap();
                if load == 0 {
                    image_identity = Some((metadata.ino(), metadata.modified().unwrap()));
                } else if load == 1 {
                    assert_eq!(
                        Some((metadata.ino(), metadata.modified().unwrap())),
                        image_identity,
                        "verified cache hit must reuse the existing image"
                    );
                    // Same-length damage must be detected by the full-byte digest.
                    let mut damaged = raw.to_vec();
                    let last = damaged.last_mut().unwrap();
                    *last ^= 1;
                    fs::write(&image, damaged).unwrap();
                }
            }
        }
        assert_eq!(fs::read(&blocked).unwrap(), b"unusable cache root");
        fs::set_permissions(&installed, fs::Permissions::from_mode(0o755)).unwrap();
    }
}
