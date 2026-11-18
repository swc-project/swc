#![cfg(windows)]

mod support;

use std::{fs, io::Cursor, path::PathBuf, process::Command};

use swc_native_addon::{cache, format::Payload, integrity::RuntimeIntegrity};

#[test]
#[ignore = "requires a Windows host and writable NTFS"]
fn new_and_repaired_cache_images_are_uncompressed() {
    let bytes = support::packed();
    let payload = Payload::parse(&bytes).unwrap();
    let raw = fs::read(support::fixture()).unwrap();
    let integrity = RuntimeIntegrity::from_raw(&payload.header, &mut Cursor::new(&raw)).unwrap();
    let payload = payload.with_integrity(integrity).unwrap();
    for compressed_root in [false, true] {
        let root = tempfile::tempdir().unwrap();
        if compressed_root {
            support::ntfs::compress(root.path()).unwrap();
            assert!(support::ntfs::is_compressed(root.path()));
            let probe = root.path().join("inherited-compression");
            fs::write(&probe, b"probe").unwrap();
            assert!(support::ntfs::is_compressed(&probe));
        }
        let mut image = cache::cached_at(&payload, root.path()).unwrap();
        let path = image.path().to_owned();
        assert!(!support::ntfs::is_compressed(&path));
        assert_eq!(fs::read(&path).unwrap(), raw);
        if compressed_root {
            // The file policy must work without clearing the user's directory
            // policy or silently moving the cache onto a different volume.
            assert!(support::ntfs::is_compressed(path.parent().unwrap()));
        }
        image.loaded().unwrap();
        drop(image);

        // Existing compressed entries remain immutable on a verified hit.
        support::ntfs::compress(&path).unwrap();
        assert!(support::ntfs::is_compressed(&path));
        let mut hit = cache::cached_at(&payload, root.path()).unwrap();
        assert_eq!(hit.path(), path);
        assert!(support::ntfs::is_compressed(hit.path()));
        hit.loaded().unwrap();
        drop(hit);

        // A previously successful hit does not exempt the file from hashing.
        // Repair atomically replaces the damaged compressed image with a new
        // uncompressed image, even beneath a compressed cache directory.
        let mut corrupt = raw.clone();
        *corrupt.last_mut().unwrap() ^= 1;
        fs::write(&path, corrupt).unwrap();
        assert!(support::ntfs::is_compressed(&path));
        let mut repaired = cache::cached_at(&payload, root.path()).unwrap();
        assert!(!support::ntfs::is_compressed(repaired.path()));
        assert_eq!(fs::read(repaired.path()).unwrap(), raw);
        repaired.loaded().unwrap();
    }
}

#[test]
#[ignore = "requires a Windows host and writable NTFS"]
fn temporary_images_do_not_inherit_compression() {
    let root = tempfile::tempdir().unwrap();
    support::ntfs::compress(root.path()).unwrap();
    assert!(support::ntfs::is_compressed(root.path()));
    // Isolate process-global LOCALAPPDATA from other concurrently running tests.
    let result = Command::new(std::env::current_exe().unwrap())
        .args(["--exact", "temporary_image_worker", "--nocapture"])
        .env("LOCALAPPDATA", root.path())
        .env("SWC_TEST_NTFS_ROOT", root.path())
        .output()
        .unwrap();
    assert!(
        result.status.success(),
        "{}",
        String::from_utf8_lossy(&result.stderr)
    );
}

#[test]
fn temporary_image_worker() {
    let Some(root) = std::env::var_os("SWC_TEST_NTFS_ROOT") else {
        return;
    };
    let root = PathBuf::from(root);
    let bytes = support::packed();
    let payload = Payload::parse(&bytes).unwrap();
    let image = cache::temporary(&payload).unwrap();
    assert!(image.path().starts_with(&root));
    assert!(support::ntfs::is_compressed(image.path().parent().unwrap()));
    assert!(!support::ntfs::is_compressed(image.path()));
    payload
        .header
        .verify(&mut fs::File::open(image.path()).unwrap())
        .unwrap();
}
