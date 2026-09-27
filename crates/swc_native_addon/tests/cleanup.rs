#![cfg(windows)]

mod support;

use std::{fs, path::PathBuf, process::Command};

use swc_native_addon::{cache, format::Payload};

#[test]
fn cleanup_helper_is_verified_on_every_launch() {
    let directory = tempfile::tempdir().unwrap();
    // Pipe transport must preserve Unicode and shell metacharacters literally.
    let root = directory.path().join("native cache 日本語 & % ' spaces");
    fs::create_dir(&root).unwrap();
    let result = Command::new(std::env::current_exe().unwrap())
        .args(["--exact", "cleanup_helper_worker", "--nocapture"])
        .env("LOCALAPPDATA", &root)
        .env("SWC_TEST_CLEANUP_ROOT", &root)
        .output()
        .unwrap();
    assert!(
        result.status.success(),
        "{}",
        String::from_utf8_lossy(&result.stderr)
    );
}

#[test]
fn cleanup_helper_worker() {
    let Some(root) = std::env::var_os("SWC_TEST_CLEANUP_ROOT") else {
        return;
    };
    let root = PathBuf::from(root).join("swc");
    let bytes = support::packed();
    let payload = Payload::parse(&bytes).unwrap();
    let file = cache::temporary(&payload).unwrap();
    let path = file.path().to_owned();
    assert!(path.starts_with(&root));
    drop(file);
    assert!(!path.exists());
    let directory = cache::cache_directory(&root).unwrap();
    let helper = fs::read_dir(&directory)
        .unwrap()
        .map(|entry| entry.unwrap().path())
        .find(|path| path.extension().is_some_and(|extension| extension == "exe"))
        .unwrap();
    // Wait for the worker to exit before modifying its image on Windows.
    let deadline = std::time::Instant::now() + std::time::Duration::from_secs(15);
    let original = fs::read(&helper).unwrap();
    loop {
        match fs::write(&helper, b"corrupt helper") {
            Ok(()) => break,
            Err(error) => {
                assert!(std::time::Instant::now() < deadline, "{error}");
                std::thread::sleep(std::time::Duration::from_millis(10));
            }
        }
    }
    let error = match cache::temporary(&payload) {
        Ok(_) => panic!("a corrupt cleanup helper must not execute"),
        Err(error) => error,
    };
    assert!(error.to_string().contains("cleanup helper is corrupt"));
    fs::write(&helper, original).unwrap();
    drop(cache::temporary(&payload).unwrap());
}
