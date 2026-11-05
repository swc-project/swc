#![cfg(windows)]

mod support;

use std::{fs, path::PathBuf, process::Command};

use swc_native_addon::{cache, format::Payload};

#[test]
fn denied_helper_execution_does_not_prevent_loading() {
    let root = tempfile::tempdir().unwrap();
    let result = Command::new(std::env::current_exe().unwrap())
        .args(["--exact", "denied_helper_worker", "--nocapture"])
        .env("LOCALAPPDATA", root.path())
        .env("SWC_TEST_DENIED_HELPER_ROOT", root.path())
        .output()
        .unwrap();
    assert!(
        result.status.success(),
        "{}\n{}",
        String::from_utf8_lossy(&result.stdout),
        String::from_utf8_lossy(&result.stderr)
    );
}

#[test]
fn denied_helper_worker() {
    let Some(root) = std::env::var_os("SWC_TEST_DENIED_HELPER_ROOT") else {
        return;
    };
    let root = PathBuf::from(root).join("swc");
    let bytes = support::packed();
    let payload = Payload::parse(&bytes).unwrap();
    drop(cache::temporary(&payload).unwrap());
    let directory = cache::cache_directory(&root).unwrap();
    let helper = fs::read_dir(&directory)
        .unwrap()
        .map(|entry| entry.unwrap().path())
        .find(|path| path.extension().is_some_and(|extension| extension == "exe"))
        .unwrap();
    // Deny execute only. The same helper must remain readable for full-byte
    // verification, while CreateProcess fails even though LoadLibrary works.
    let result = Command::new("icacls.exe")
        .arg(&helper)
        .args(["/deny", "*S-1-1-0:(X)"])
        .output()
        .unwrap();
    assert!(result.status.success(), "{result:?}");
    assert_eq!(
        Command::new(&helper).spawn().unwrap_err().kind(),
        std::io::ErrorKind::PermissionDenied
    );
    let mut image = cache::temporary(&payload).unwrap();
    let path = image.path().to_owned();
    payload
        .header
        .verify(&mut fs::File::open(&path).unwrap())
        .unwrap();
    let library = unsafe { libloading::Library::new(&path) }.unwrap();
    image.loaded().unwrap();
    drop(library);
    drop(image);
    assert!(
        !path.exists(),
        "Drop still removes an unmapped temporary image"
    );
}
