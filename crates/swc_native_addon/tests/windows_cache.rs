#![cfg(windows)]

mod support;

use std::{fs, io::Cursor, path::PathBuf, process::Command};

use support::windows::{self, Grant};
use swc_native_addon::{
    cache::{self, CacheMode},
    format::Payload,
    integrity::{RuntimeIntegrity, INTEGRITY_LEN},
    platform, ErrorKind,
};

#[derive(Clone, Copy, Debug, PartialEq)]
enum Scenario {
    Primary,
    AppContainer,
    AuthenticatedUsers,
    CustomFallback,
    Temporary,
    MissingPrimary,
    RelativePrimary,
    LateCacheFailure,
    MissingProfile,
    RelativeProfile,
    BlockedProfile,
    UnsafeProfile,
    Integrity,
}

impl Scenario {
    fn parse(value: &str) -> Self {
        match value {
            "primary" => Self::Primary,
            "appcontainer" => Self::AppContainer,
            "authenticated-users" => Self::AuthenticatedUsers,
            "custom-fallback" => Self::CustomFallback,
            "temporary" => Self::Temporary,
            "missing-primary" => Self::MissingPrimary,
            "relative-primary" => Self::RelativePrimary,
            "late-cache-failure" => Self::LateCacheFailure,
            "missing-profile" => Self::MissingProfile,
            "relative-profile" => Self::RelativeProfile,
            "blocked-profile" => Self::BlockedProfile,
            "unsafe-profile" => Self::UnsafeProfile,
            "integrity" => Self::Integrity,
            _ => panic!("unknown Windows cache fixture {value}"),
        }
    }
}

#[test]
fn windows_cache_fixtures() {
    for case in include_str!("fixtures/windows-cache.txt").lines() {
        if case.is_empty() || case.starts_with('#') {
            continue;
        }
        Scenario::parse(case);
        let root = tempfile::tempdir().unwrap();
        let result = Command::new(std::env::current_exe().unwrap())
            .args(["--exact", "windows_cache_worker", "--nocapture"])
            .env("SWC_TEST_WINDOWS_CACHE_CASE", case)
            .env("SWC_TEST_WINDOWS_CACHE_ROOT", root.path())
            .env("LOCALAPPDATA", root.path().join("local"))
            .env("USERPROFILE", root.path().join("profile"))
            .output()
            .unwrap();
        assert!(
            result.status.success(),
            "{case}: {}\n{}",
            String::from_utf8_lossy(&result.stdout),
            String::from_utf8_lossy(&result.stderr)
        );
    }
}

#[test]
fn windows_cache_worker() {
    let Ok(case) = std::env::var("SWC_TEST_WINDOWS_CACHE_CASE") else {
        return;
    };
    let scenario = Scenario::parse(&case);
    let root = PathBuf::from(std::env::var_os("SWC_TEST_WINDOWS_CACHE_ROOT").unwrap());
    let local = root.join("local");
    let profile = root.join("profile");
    let fallback = profile.join(".swc-cache");
    platform::private_directory(&profile).unwrap();
    let primary_usable = matches!(scenario, Scenario::Primary | Scenario::Integrity);
    if primary_usable || scenario == Scenario::LateCacheFailure {
        platform::private_directory(&local).unwrap();
    } else {
        let grant = if scenario == Scenario::AuthenticatedUsers {
            Grant::AuthenticatedUsers
        } else {
            Grant::AppContainer
        };
        windows::unsafe_directory(&local, grant);
        let rejected = cache::cache_directory(&local.join("swc")).unwrap_err();
        assert_eq!(rejected.kind, ErrorKind::Cache);
        assert!(rejected.to_string().contains(grant.sid()));
    }
    let original_security = windows::security(&local);
    match scenario {
        Scenario::Primary | Scenario::RelativeProfile | Scenario::Integrity => {
            std::env::set_var("USERPROFILE", "relative-profile");
        }
        Scenario::MissingPrimary => std::env::remove_var("LOCALAPPDATA"),
        Scenario::RelativePrimary => std::env::set_var("LOCALAPPDATA", "relative-local"),
        Scenario::MissingProfile => std::env::remove_var("USERPROFILE"),
        Scenario::BlockedProfile => fs::write(&fallback, b"preserve blocked profile").unwrap(),
        Scenario::UnsafeProfile => {
            windows::unsafe_directory(&fallback, Grant::AuthenticatedUsers);
        }
        Scenario::LateCacheFailure => {
            let directory = cache::cache_directory(&local.join("swc")).unwrap();
            fs::create_dir(directory.join(".swc-native-prune.lock")).unwrap();
        }
        _ => {}
    }
    let bytes = support::packed();
    let payload = Payload::parse(&bytes).unwrap();
    let raw = fs::read(support::fixture()).unwrap();
    let mut integrity = RuntimeIntegrity::from_raw(&payload.header, &mut Cursor::new(&raw))
        .unwrap()
        .encode();
    if scenario == Scenario::Integrity {
        integrity[INTEGRITY_LEN - 1] ^= 1;
    }
    let payload = payload
        .with_integrity(RuntimeIntegrity::parse(&integrity).unwrap())
        .unwrap();
    let custom = root.join("custom");
    let mode = match scenario {
        Scenario::CustomFallback => {
            windows::unsafe_directory(&custom, Grant::AuthenticatedUsers);
            CacheMode::Custom(custom.clone())
        }
        Scenario::Temporary => CacheMode::Temporary,
        _ => CacheMode::Default,
    };
    let custom_security =
        (scenario == Scenario::CustomFallback).then(|| windows::security(&custom));
    let result = cache::materialize(&payload, &mode);
    if matches!(
        scenario,
        Scenario::MissingProfile
            | Scenario::RelativeProfile
            | Scenario::BlockedProfile
            | Scenario::UnsafeProfile
            | Scenario::Integrity
    ) {
        let error = result.err().expect("unsafe caches or payload must fail");
        if scenario == Scenario::Integrity {
            assert_eq!(error.kind, ErrorKind::Integrity);
            assert!(!error.to_string().contains("profile cache"));
        } else {
            assert_eq!(error.kind, ErrorKind::Cache);
            let message = error.to_string();
            assert!(message.contains(&local.display().to_string()), "{message}");
            assert!(message.contains(Grant::AppContainer.sid()), "{message}");
            assert!(message.contains("profile cache failed"), "{message}");
            assert!(message.contains("SWC_NATIVE_BINDING_CACHE"), "{message}");
            if matches!(
                scenario,
                Scenario::MissingProfile | Scenario::RelativeProfile
            ) {
                assert!(message.contains("USERPROFILE"), "{message}");
            } else {
                assert!(
                    message.contains(&fallback.display().to_string()),
                    "{message}"
                );
            }
        }
    } else {
        let mut image = result.unwrap();
        let expected_root = if scenario == Scenario::Primary {
            local.join("swc")
        } else {
            fallback.clone()
        };
        assert!(image.path().starts_with(&expected_root));
        assert_eq!(fs::read(image.path()).unwrap(), raw);
        let path = image.path().to_owned();
        let library = unsafe { libloading::Library::new(&path) }.unwrap();
        image.loaded().unwrap();
        drop(library);
        drop(image);
        if scenario == Scenario::Temporary {
            let directory = cache::cache_directory(&fallback).unwrap();
            assert!(!directory
                .join(format!("{}.node", payload.header.cache_key()))
                .exists());
            let second = cache::materialize(&payload, &mode).unwrap();
            assert_ne!(second.path(), path);
            drop(second);
            assert!(!path.exists());
        } else {
            let mut hit = cache::materialize(&payload, &mode).unwrap();
            assert_eq!(hit.path(), path);
            hit.loaded().unwrap();
        }
    }
    assert_eq!(windows::security(&local), original_security);
    if let Some(security) = custom_security {
        assert_eq!(windows::security(&custom), security);
    }
    if scenario == Scenario::BlockedProfile {
        assert_eq!(fs::read(&fallback).unwrap(), b"preserve blocked profile");
    }
    if primary_usable {
        assert!(
            !fallback.exists(),
            "primary success/integrity failure must not try profile"
        );
    }
}
