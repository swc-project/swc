//! Unix fallback cases use child processes to isolate cache environment
//! changes.

use std::{
    env, fs,
    io::Cursor,
    os::unix::fs::{symlink, PermissionsExt},
    path::PathBuf,
    process::Command,
};

use swc_native_addon::{
    cache::{self, CacheMode},
    format::Payload,
    integrity::{RuntimeIntegrity, INTEGRITY_LEN},
    platform, ErrorKind,
};

use super::support;

#[derive(Clone, Copy, Debug, PartialEq)]
enum Scenario {
    Home,
    Xdg,
    Custom,
    Primary,
    SymlinkTemp,
    UnsafeTemp,
    MissingTemp,
    MissingPrimary,
    PrimaryIntegrity,
    FallbackIntegrity,
    NoexecTemp,
}

impl Scenario {
    fn parse(value: &str) -> Self {
        match value {
            "home" => Self::Home,
            "xdg" => Self::Xdg,
            "custom" => Self::Custom,
            "primary" => Self::Primary,
            "symlink-temp" => Self::SymlinkTemp,
            "unsafe-temp" => Self::UnsafeTemp,
            "missing-temp" => Self::MissingTemp,
            "missing-primary" => Self::MissingPrimary,
            "primary-integrity" => Self::PrimaryIntegrity,
            "fallback-integrity" => Self::FallbackIntegrity,
            "noexec-temp" => Self::NoexecTemp,
            _ => panic!("unknown Unix cache fixture {value}"),
        }
    }
}

#[test]
fn unix_cache_fixtures() {
    for case in include_str!("../fixtures/unix-cache.txt").lines() {
        if case.is_empty() || case.starts_with('#') {
            continue;
        }
        let scenario = Scenario::parse(case);
        if scenario == Scenario::NoexecTemp {
            // Linux exposes a conventional noexec tmpfs without privileged
            // mounts. Other hosts still exercise unsafe and missing fallbacks.
            if !cfg!(target_os = "linux") || !std::path::Path::new("/dev/shm").is_dir() {
                continue;
            }
            if platform::executable_cache_root(std::path::Path::new("/dev/shm")).is_ok() {
                continue;
            }
        }
        let temporary = tempfile::tempdir().unwrap();
        let root = temporary.path().canonicalize().unwrap();
        let output = Command::new(env::current_exe().unwrap())
            .args([
                "--exact",
                "unix_cache_fallback::unix_cache_worker",
                "--nocapture",
            ])
            .env("SWC_TEST_UNIX_CACHE_CASE", case)
            .env("SWC_TEST_UNIX_CACHE_ROOT", &root)
            .env("HOME", root.join("home"))
            .env("XDG_CACHE_HOME", root.join("home/cache"))
            .env("TMPDIR", root.join("tmp"))
            .env_remove("SWC_NATIVE_BINDING_CACHE")
            .env_remove("SWC_NATIVE_BINDING_CACHE_SKIP_SECURITY_CHECK")
            .output()
            .unwrap();
        assert!(
            output.status.success(),
            "{case}: {}{}",
            String::from_utf8_lossy(&output.stdout),
            String::from_utf8_lossy(&output.stderr)
        );
    }
}

#[test]
fn unix_cache_worker() {
    let Ok(case) = env::var("SWC_TEST_UNIX_CACHE_CASE") else {
        return;
    };
    let scenario = Scenario::parse(&case);
    let root = PathBuf::from(env::var_os("SWC_TEST_UNIX_CACHE_ROOT").unwrap());
    let home = root.join("home");
    let fallback = root.join("tmp");
    fs::create_dir(&home).unwrap();
    fs::create_dir(&fallback).unwrap();
    let primary_usable = matches!(scenario, Scenario::Primary | Scenario::PrimaryIntegrity);
    fs::set_permissions(
        &home,
        fs::Permissions::from_mode(if primary_usable { 0o700 } else { 0o775 }),
    )
    .unwrap();
    let bytes = support::packed();
    let payload = Payload::parse(&bytes).unwrap();
    let raw = fs::read(support::fixture()).unwrap();
    match scenario {
        Scenario::Home => env::remove_var("XDG_CACHE_HOME"),
        Scenario::Primary | Scenario::PrimaryIntegrity | Scenario::MissingTemp => {
            env::set_var("TMPDIR", root.join("missing"));
        }
        Scenario::SymlinkTemp => {
            let alias = root.join("alias");
            symlink(&fallback, &alias).unwrap();
            env::set_var("TMPDIR", alias);
        }
        Scenario::UnsafeTemp => {
            fs::set_permissions(&fallback, fs::Permissions::from_mode(0o775)).unwrap();
        }
        Scenario::MissingPrimary => {
            env::remove_var("HOME");
            env::remove_var("XDG_CACHE_HOME");
        }
        Scenario::NoexecTemp => env::set_var("TMPDIR", "/dev/shm"),
        _ => {}
    }
    let primary = platform::user_cache_root().ok();
    let corrupt = matches!(
        scenario,
        Scenario::PrimaryIntegrity | Scenario::FallbackIntegrity
    );
    let mut integrity = RuntimeIntegrity::from_raw(&payload.header, &mut Cursor::new(&raw))
        .unwrap()
        .encode();
    if corrupt {
        integrity[INTEGRITY_LEN - 1] ^= 1;
    }
    let payload = payload
        .with_integrity(RuntimeIntegrity::parse(&integrity).unwrap())
        .unwrap();
    let blocked = root.join("blocked");
    fs::write(&blocked, b"preserve me").unwrap();
    let mut modes = vec![CacheMode::Default, CacheMode::Temporary];
    if scenario == Scenario::Custom {
        modes.push(CacheMode::Custom(blocked.clone()));
    }
    for mode in modes {
        let result = cache::materialize(&payload, &mode);
        if corrupt {
            let error = result.err().expect("corrupt payload must fail");
            assert_eq!(error.kind, ErrorKind::Integrity);
            assert!(!error.to_string().contains("fallback cache failed"));
            continue;
        }
        if matches!(
            scenario,
            Scenario::UnsafeTemp | Scenario::MissingTemp | Scenario::NoexecTemp
        ) {
            let error = result.err().expect("unusable roots must fail");
            assert_eq!(error.kind, ErrorKind::Cache);
            let message = error.to_string();
            assert!(message.contains("user cache failed"), "{message}");
            assert!(message.contains("fallback cache failed"), "{message}");
            assert!(message.contains("SWC_NATIVE_BINDING_CACHE"), "{message}");
            assert!(message.contains(&home.display().to_string()), "{message}");
            if scenario == Scenario::UnsafeTemp {
                assert!(
                    message.contains(&fallback.display().to_string()),
                    "{message}"
                );
            }
            if scenario == Scenario::NoexecTemp {
                assert!(message.contains("noexec"), "{message}");
            }
            continue;
        }
        let selected = if primary_usable {
            primary.as_ref().unwrap()
        } else {
            &fallback
        };
        let mut image = result.unwrap();
        assert!(image.path().starts_with(selected));
        assert_eq!(fs::read(image.path()).unwrap(), raw);
        let directory = image.path().parent().unwrap();
        for private in [directory, directory.parent().unwrap()] {
            assert_eq!(
                fs::metadata(private).unwrap().permissions().mode() & 0o777,
                0o700
            );
        }
        let path = image.path().to_owned();
        let library = unsafe { libloading::Library::new(&path) }.unwrap();
        image.loaded().unwrap();
        assert_eq!(path.exists(), mode != CacheMode::Temporary);
        drop(library);
    }
    assert_eq!(fs::read(&blocked).unwrap(), b"preserve me");
    if primary_usable {
        assert!(!fallback.join(platform::user_namespace().unwrap()).exists());
    }
}
