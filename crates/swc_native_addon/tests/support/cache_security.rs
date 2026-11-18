//! Run opt-out cases in child processes so parallel tests never share modified
//! environment variables. Reuse the cache suite's real native payload fixture.

use std::{
    env,
    ffi::{OsStr, OsString},
    fs, io,
    os::unix::{
        ffi::OsStringExt,
        fs::{symlink, PermissionsExt},
    },
    path::{Path, PathBuf},
    process::Command,
};

use swc_native_addon::{
    cache::{self, CacheMode},
    format::Payload,
    platform,
};

use super::support;

const OPT_OUT: &str = "SWC_NATIVE_BINDING_CACHE_SKIP_SECURITY_CHECK";
const TEST_ROOT: &str = "SWC_TEST_CACHE_SECURITY_ROOT";

fn worker(name: &str, root: &Path, value: Option<&OsStr>) {
    let mut command = Command::new(env::current_exe().unwrap());
    command
        .args(["--exact", name, "--nocapture"])
        .env(TEST_ROOT, root)
        .env("XDG_CACHE_HOME", root.join("default"))
        .env_remove("SWC_NATIVE_BINDING_CACHE")
        .env_remove(OPT_OUT);
    if let Some(value) = value {
        command.env(OPT_OUT, value);
    }
    let output = command.output().unwrap();
    assert!(
        output.status.success(),
        "{command:?}\n{}{}",
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
}

#[test]
fn unsafe_roots_require_an_exact_security_opt_out() {
    let temporary = tempfile::tempdir().unwrap();
    // Darwin's temporary directory can contain /var, itself a symlink. Keep
    // each fixture's only unsafe component under our control.
    let base = temporary.path().canonicalize().unwrap();
    let shared = base.join("shared");
    let trusted = base.join("trusted");
    fs::create_dir_all(shared.join("cache")).unwrap();
    fs::create_dir_all(trusted.join("cache")).unwrap();
    fs::set_permissions(&shared, fs::Permissions::from_mode(0o770)).unwrap();
    let alias = base.join("alias");
    symlink(&trusted, &alias).unwrap();

    for root in [shared.join("cache"), alias.join("cache")] {
        for value in [
            None,
            Some(OsString::from("")),
            Some(OsString::from("0")),
            Some(OsString::from("true")),
            Some(OsString::from("01")),
            Some(OsString::from("1 ")),
            Some(OsString::from_vec(vec![0xff])),
        ] {
            worker(
                "cache_security::strict_root_worker",
                &root,
                value.as_deref(),
            );
        }
        worker(
            "cache_security::opt_out_root_worker",
            &root,
            Some(OsStr::new("1")),
        );
    }
}

#[test]
fn strict_root_worker() {
    let Some(root) = env::var_os(TEST_ROOT) else {
        return;
    };
    let root = Path::new(&root);
    assert_eq!(
        platform::secure_cache_root(root).unwrap_err().kind(),
        io::ErrorKind::PermissionDenied
    );
    assert!(cache::cache_directory(root).is_err());
}

#[test]
fn opt_out_root_worker() {
    let Some(root) = env::var_os(TEST_ROOT) else {
        return;
    };
    let root = Path::new(&root);
    platform::secure_cache_root(root).unwrap();
    cache::cache_directory(root).unwrap();
    assert_eq!(
        platform::secure_cache_root(Path::new("relative"))
            .unwrap_err()
            .kind(),
        io::ErrorKind::InvalidInput
    );
    assert!(CacheMode::parse(Some("relative".into())).is_err());
}

#[test]
fn security_opt_out_preserves_cache_modes_and_entry_validation() {
    let temporary = tempfile::tempdir().unwrap();
    let root = temporary.path().canonicalize().unwrap();
    fs::set_permissions(&root, fs::Permissions::from_mode(0o770)).unwrap();
    worker(
        "cache_security::materialization_worker",
        &root,
        Some(OsStr::new("1")),
    );
}

#[test]
fn materialization_worker() {
    let Some(root) = env::var_os(TEST_ROOT).map(PathBuf::from) else {
        return;
    };
    let bytes = support::packed();
    let payload = Payload::parse(&bytes).unwrap();
    let raw = fs::read(support::fixture()).unwrap();
    let default = root.join("default");
    let custom = root.join("custom");
    let blocked = root.join("blocked");
    fs::write(&blocked, b"not a directory").unwrap();

    for (mode, selected) in [
        (CacheMode::Default, &default),
        (CacheMode::Custom(custom.clone()), &custom),
        (CacheMode::Custom(blocked.clone()), &default),
        (CacheMode::Temporary, &default),
    ] {
        let mut image = cache::materialize(&payload, &mode).unwrap();
        assert!(image.path().starts_with(selected));
        assert_eq!(fs::read(image.path()).unwrap(), raw);
        let path = image.path().to_owned();
        image.loaded().unwrap();
        assert_eq!(path.exists(), mode != CacheMode::Temporary);
    }
    assert_eq!(fs::read(&blocked).unwrap(), b"not a directory");

    let directory = cache::cache_directory(&custom).unwrap();
    let path = directory.join(format!("{}.node", payload.header.cache_key()));
    let mut damaged = raw.clone();
    *damaged.last_mut().unwrap() ^= 1;
    fs::write(&path, damaged).unwrap();
    let mut repaired = cache::cached_at(&payload, &custom).unwrap();
    assert_eq!(fs::read(repaired.path()).unwrap(), raw);
    repaired.loaded().unwrap();
    drop(repaired);

    fs::set_permissions(&path, fs::Permissions::from_mode(0o666)).unwrap();
    assert!(cache::cached_at(&payload, &custom).is_err());
    fs::remove_file(&path).unwrap();
    symlink(support::fixture(), &path).unwrap();
    assert!(cache::cached_at(&payload, &custom).is_err());
    fs::remove_file(&path).unwrap();
    let local = root.join("raw.node");
    fs::copy(support::fixture(), &local).unwrap();
    fs::hard_link(&local, &path).unwrap();
    assert!(cache::cached_at(&payload, &custom).is_err());
    fs::remove_file(&path).unwrap();

    fs::set_permissions(&directory, fs::Permissions::from_mode(0o777)).unwrap();
    assert!(cache::cached_at(&payload, &custom).is_err());
    fs::set_permissions(&directory, fs::Permissions::from_mode(0o700)).unwrap();
    let moved = root.join("moved-namespace");
    fs::rename(&directory, &moved).unwrap();
    symlink(&moved, &directory).unwrap();
    assert!(cache::cached_at(&payload, &custom).is_err());
    fs::remove_file(&directory).unwrap();
    fs::rename(&moved, &directory).unwrap();

    // A configured opt-out does not turn corrupt payload bytes into executable
    // code, even when the destination cache is otherwise usable.
    let mut corrupt = bytes;
    *corrupt.last_mut().unwrap() ^= 1;
    let corrupt = Payload::parse(&corrupt).unwrap();
    assert!(cache::cached_at(&corrupt, &root.join("corrupt")).is_err());
}
