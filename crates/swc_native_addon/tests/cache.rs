mod support;

use std::{fs, io::Cursor, process::Command};

use swc_native_addon::{
    cache::{self, CacheMode},
    format::Payload,
};

#[test]
fn cache_configuration_is_explicit() {
    assert_eq!(CacheMode::parse(None).unwrap(), CacheMode::Default);
    assert_eq!(
        CacheMode::parse(Some("".into())).unwrap(),
        CacheMode::Default
    );
    assert_eq!(
        CacheMode::parse(Some("0".into())).unwrap(),
        CacheMode::Temporary
    );
    assert!(CacheMode::parse(Some("relative".into())).is_err());
    assert!(CacheMode::parse(Some("false".into())).is_err());
    let root = tempfile::tempdir().unwrap();
    assert_eq!(
        CacheMode::parse(Some(root.path().into())).unwrap(),
        CacheMode::Custom(root.path().into())
    );
}

#[test]
fn verifies_hits_and_recovers_corruption() {
    let root = tempfile::tempdir().unwrap();
    let bytes = support::packed();
    let payload = Payload::parse(&bytes).unwrap();
    let entry = cache::cached_at(&payload, root.path()).unwrap();
    let path = entry.path().to_owned();
    let valid = fs::read(&path).unwrap();
    drop(entry);
    for damaged in [b"truncated".to_vec(), {
        let mut bytes = valid.clone();
        let last = bytes.len() - 1;
        bytes[last] ^= 1;
        bytes
    }] {
        fs::write(&path, &damaged).unwrap();
        assert!(payload.header.verify(&mut Cursor::new(damaged)).is_err());
        let mut recovered = cache::cached_at(&payload, root.path()).unwrap();
        assert_eq!(fs::read(recovered.path()).unwrap(), valid);
        recovered.loaded().unwrap();
    }
    let mut hit = cache::cached_at(&payload, root.path()).unwrap();
    assert_eq!(hit.path(), path);
    hit.loaded().unwrap();
    assert_eq!(fs::read(path).unwrap(), valid);
}

#[test]
fn custom_root_failure_falls_back_to_default() {
    let root = tempfile::tempdir().unwrap();
    let blocked = root.path().join("a-file-not-a-directory");
    fs::write(&blocked, b"preserve me").unwrap();
    let bytes = support::packed();
    let payload = Payload::parse(&bytes).unwrap();
    let mut file = cache::materialize(&payload, &CacheMode::Custom(blocked.clone())).unwrap();
    assert!(file.path().starts_with(
        cache::cache_directory(&swc_native_addon::platform::user_cache_root().unwrap()).unwrap()
    ));
    assert_eq!(fs::read(blocked).unwrap(), b"preserve me");
    file.loaded().unwrap();
}

#[test]
fn custom_root_does_not_require_default_cache() {
    let root = tempfile::tempdir().unwrap();
    let output = Command::new(std::env::current_exe().unwrap())
        .args([
            "--exact",
            "custom_root_without_default_cache_worker",
            "--nocapture",
        ])
        .env("SWC_TEST_CUSTOM_CACHE", root.path())
        .env_remove("XDG_CACHE_HOME")
        .env_remove("HOME")
        .env_remove("LOCALAPPDATA")
        .output()
        .unwrap();
    assert!(
        output.status.success(),
        "custom cache worker failed: {}{}",
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
}

#[test]
fn custom_root_without_default_cache_worker() {
    let Some(root) = std::env::var_os("SWC_TEST_CUSTOM_CACHE") else {
        return;
    };
    let bytes = support::packed();
    let payload = Payload::parse(&bytes).unwrap();
    let mut entry = cache::materialize(&payload, &CacheMode::Custom(root.into())).unwrap();
    entry.loaded().unwrap();
}

#[test]
fn temporary_files_are_unique_and_removed_after_loading() {
    let bytes = support::packed();
    let payload = Payload::parse(&bytes).unwrap();
    let mut first = cache::materialize(&payload, &CacheMode::Temporary).unwrap();
    let second = cache::materialize(&payload, &CacheMode::Temporary).unwrap();
    assert_ne!(first.path(), second.path());
    let first_path = first.path().to_owned();
    let second_path = second.path().to_owned();
    let library = unsafe { libloading::Library::new(first.path()) }.unwrap();
    first.loaded().unwrap();
    #[cfg(unix)]
    assert!(!first_path.exists());
    // The mapped image remains callable after its Unix pathname disappears.
    let register = unsafe {
        library.get::<unsafe extern "C" fn(
            *mut std::ffi::c_void,
            *mut std::ffi::c_void,
        ) -> *mut std::ffi::c_void>(b"napi_register_module_v1\0")
    }
    .unwrap();
    assert_eq!(
        unsafe { register(0x1234_usize as _, 0x2345_usize as _) } as usize,
        0x3456
    );
    drop(library);
    drop(first);
    drop(second);
    assert!(!first_path.exists());
    assert!(!second_path.exists());
}

#[cfg(unix)]
#[test]
fn rejects_symlinks_hardlinks_and_unsafe_directories() {
    use std::os::unix::fs::{symlink, PermissionsExt};
    let root = tempfile::tempdir().unwrap();
    let bytes = support::packed();
    let payload = Payload::parse(&bytes).unwrap();
    let directory = cache::cache_directory(root.path()).unwrap();
    let path = directory.join(format!("{}.node", payload.header.cache_key()));
    symlink(support::fixture(), &path).unwrap();
    assert!(cache::cached_at(&payload, root.path()).is_err());
    fs::remove_file(&path).unwrap();
    let local = root.path().join("raw.node");
    fs::copy(support::fixture(), &local).unwrap();
    fs::hard_link(&local, &path).unwrap();
    assert!(cache::cached_at(&payload, root.path()).is_err());
    fs::remove_file(path).unwrap();
    fs::set_permissions(&directory, fs::Permissions::from_mode(0o777)).unwrap();
    assert!(cache::cached_at(&payload, root.path()).is_err());

    let unsafe_parent = root.path().join("unsafe-parent");
    fs::create_dir(&unsafe_parent).unwrap();
    fs::set_permissions(&unsafe_parent, fs::Permissions::from_mode(0o777)).unwrap();
    assert!(cache::cached_at(&payload, &unsafe_parent).is_err());
}

#[test]
fn concurrent_processes_publish_only_complete_files() {
    let root = tempfile::tempdir().unwrap();
    let payload = root.path().join("payload.swcn");
    fs::write(&payload, support::packed()).unwrap();
    let cache = root.path().join("cache");
    let mut children = Vec::new();
    for _ in 0..8 {
        children.push(
            Command::new(std::env::current_exe().unwrap())
                .args(["--exact", "cache_worker", "--nocapture"])
                .env("SWC_TEST_PAYLOAD", &payload)
                .env("SWC_TEST_CACHE", &cache)
                .stdout(std::process::Stdio::piped())
                .stderr(std::process::Stdio::piped())
                .spawn()
                .unwrap(),
        );
    }
    for child in children {
        let result = child.wait_with_output().unwrap();
        assert!(
            result.status.success(),
            "cache worker failed: {}{}",
            String::from_utf8_lossy(&result.stdout),
            String::from_utf8_lossy(&result.stderr)
        );
    }
    let entries: Vec<_> = fs::read_dir(cache::cache_directory(&cache).unwrap())
        .unwrap()
        .map(|e| e.unwrap().path())
        .collect();
    assert_eq!(
        entries
            .iter()
            .filter(|p| p.extension().is_some_and(|e| e == "node"))
            .count(),
        1
    );
    assert!(!entries
        .iter()
        .any(|p| p.extension().is_some_and(|e| e == "tmp")));
}

#[test]
fn cache_worker() {
    let Some(path) = std::env::var_os("SWC_TEST_PAYLOAD") else {
        return;
    };
    let bytes = fs::read(path).unwrap();
    let payload = Payload::parse(&bytes).unwrap();
    let root = std::env::var_os("SWC_TEST_CACHE").unwrap();
    let mut entry = cache::cached_at(&payload, std::path::Path::new(&root)).unwrap();
    payload
        .header
        .verify(&mut fs::File::open(entry.path()).unwrap())
        .unwrap();
    let library = unsafe { libloading::Library::new(entry.path()) }.unwrap();
    entry.loaded().unwrap();
    drop(library);
}
