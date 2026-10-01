//! Exercise profile fallback through a real PE carrier and fresh Node
//! processes.

use std::{ffi::OsStr, fs, path::Path, process::Command, time::Duration};

#[path = "../../../../crates/swc_native_addon/tests/support/windows.rs"]
mod acl;

use super::{checked, fixture_source};

#[derive(Clone, Copy, Debug)]
enum Installation {
    Primary,
    Fallback,
    CustomFallback,
    Temporary,
}

pub fn check_cache_policy(node: &OsStr, carrier: &Path, raw: &[u8], key: &str) {
    let original = fs::read(carrier).unwrap();
    for installation in [
        Installation::Primary,
        Installation::Fallback,
        Installation::CustomFallback,
        Installation::Temporary,
    ] {
        let root = tempfile::tempdir().unwrap();
        let local = root.path().join("local with spaces-λ");
        let profile = root.path().join("profile with spaces-λ");
        let custom = root.path().join("custom");
        swc_native_addon::platform::private_directory(&profile).unwrap();
        if matches!(installation, Installation::Primary) {
            swc_native_addon::platform::private_directory(&local).unwrap();
        } else {
            acl::unsafe_directory(&local, acl::Grant::AppContainer);
        }
        acl::unsafe_directory(&custom, acl::Grant::AuthenticatedUsers);
        let local_security = acl::security(&local);
        let custom_security = acl::security(&custom);
        let cache_root = if matches!(installation, Installation::Primary) {
            local.join("swc")
        } else {
            profile.join(".swc-cache")
        };
        let mut command = Command::new(node);
        command
            .arg(fixture_source("smoke.cjs"))
            .arg(carrier)
            .arg("success")
            .env("LOCALAPPDATA", &local)
            .env("USERPROFILE", &profile)
            .env_remove("SWC_NATIVE_BINDING_CACHE");
        match installation {
            Installation::Primary => {
                // A usable primary must not depend on profile resolution.
                command.env("USERPROFILE", "relative-profile");
            }
            Installation::CustomFallback => {
                command.env("SWC_NATIVE_BINDING_CACHE", &custom);
            }
            Installation::Temporary => {
                command.env("SWC_NATIVE_BINDING_CACHE", "0");
            }
            Installation::Fallback => {}
        }
        // Simultaneous first loads must publish one complete image. Each child
        // also exercises exact exports forwarding and a live callback.
        let mut children = Vec::new();
        for _ in 0..4 {
            children.push(
                command
                    .stdout(std::process::Stdio::piped())
                    .stderr(std::process::Stdio::piped())
                    .spawn()
                    .unwrap(),
            );
        }
        for child in children {
            let output = child.wait_with_output().unwrap();
            assert!(
                output.status.success(),
                "{installation:?}: {}\n{}",
                String::from_utf8_lossy(&output.stdout),
                String::from_utf8_lossy(&output.stderr)
            );
        }
        let directory = swc_native_addon::cache::cache_directory(&cache_root).unwrap();
        let image = directory.join(format!("{key}.node"));
        if matches!(installation, Installation::Temporary) {
            assert!(
                !image.exists(),
                "temporary mode published a persistent entry"
            );
            let deadline = std::time::Instant::now() + Duration::from_secs(15);
            loop {
                let images = fs::read_dir(&directory)
                    .unwrap()
                    .map(|entry| entry.unwrap().path())
                    .filter(|path| path.extension().is_some_and(|ext| ext == "node"))
                    .count();
                if images == 0 {
                    break;
                }
                assert!(
                    std::time::Instant::now() < deadline,
                    "temporary images remain"
                );
                std::thread::sleep(Duration::from_millis(10));
            }
        } else {
            assert_eq!(fs::read(&image).unwrap(), raw);
            let modified = fs::metadata(&image).unwrap().modified().unwrap();
            checked(&mut command);
            assert_eq!(fs::metadata(&image).unwrap().modified().unwrap(), modified);
            let mut damaged = raw.to_vec();
            *damaged.last_mut().unwrap() ^= 1;
            fs::write(&image, damaged).unwrap();
            checked(&mut command);
            assert_eq!(fs::read(&image).unwrap(), raw);
        }
        assert_eq!(acl::security(&local), local_security);
        assert_eq!(acl::security(&custom), custom_security);
        assert_eq!(fs::read(carrier).unwrap(), original);
    }
}
