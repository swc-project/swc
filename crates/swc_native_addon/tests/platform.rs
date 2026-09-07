mod support;

use std::{fs, path::PathBuf};

use swc_native_addon::{cache, format::Payload, replacement};

#[test]
fn unsupported_filesystem_keeps_carrier() {
    let root = tempfile::tempdir().unwrap();
    let bytes = support::packed();
    let payload = Payload::parse(&bytes).unwrap();
    // A raw addon contains no embedded header; even a supported filesystem must
    // not rewrite an unrelated raw image discovered after another first load.
    let carrier = root.path().join("carrier.node");
    fs::copy(support::fixture(), &carrier).unwrap();
    let original = fs::read(&carrier).unwrap();
    assert!(replacement::try_replace(&payload, &carrier)
        .unwrap()
        .is_none());
    assert_eq!(fs::read(carrier).unwrap(), original);
}

#[cfg(unix)]
#[test]
fn replacement_metadata_preserves_permissions_and_user_attributes() {
    use std::os::unix::fs::{MetadataExt, PermissionsExt};

    use xattr::FileExt;
    let source = tempfile::tempfile().unwrap();
    let destination = tempfile::tempfile().unwrap();
    source
        .set_permissions(fs::Permissions::from_mode(0o750))
        .unwrap();
    source
        .set_xattr("user.swc-native-test", b"preserved")
        .unwrap();
    swc_native_addon::platform::copy_metadata(&source, &destination).unwrap();
    assert_eq!(destination.metadata().unwrap().mode() & 0o777, 0o750);
    assert_eq!(
        destination.metadata().unwrap().gid(),
        source.metadata().unwrap().gid()
    );
    assert_eq!(
        destination
            .get_xattr("user.swc-native-test")
            .unwrap()
            .unwrap(),
        b"preserved"
    );
}

fn replacement_on_explicit_volume() {
    let root = PathBuf::from(
        std::env::var_os("SWC_TEST_VOLUME")
            .expect("set SWC_TEST_VOLUME to a writable APFS/btrfs test directory"),
    );
    let directory = tempfile::tempdir_in(root).unwrap();
    let bytes = support::packed();
    let payload = Payload::parse(&bytes).unwrap();
    let carrier = directory.path().join("carrier.node");
    // The production path originates in dladdr. This isolated unit fixture
    // models the matching embedded header while exercising real filesystem IO.
    fs::write(&carrier, &bytes).unwrap();
    let cli = directory.path().join("swc");
    fs::write(&cli, b"CLI sentinel").unwrap();
    let mut temporary = replacement::try_replace(&payload, &carrier)
        .unwrap()
        .expect("the selected volume must support transparent self-replacement");
    assert_ne!(temporary.path(), carrier);
    assert_eq!(
        fs::read(&carrier).unwrap(),
        fs::read(support::fixture()).unwrap()
    );
    assert_eq!(fs::read(cli).unwrap(), b"CLI sentinel");
    let library = unsafe { libloading::Library::new(temporary.path()) }.unwrap();
    temporary.loaded().unwrap();
    drop(library);
}

#[test]
#[ignore = "requires SWC_TEST_VOLUME on writable APFS"]
fn apfs_self_replacement() {
    assert_eq!(std::env::consts::OS, "macos", "requires a macOS host");
    replacement_on_explicit_volume();
}

#[test]
#[ignore = "requires SWC_TEST_VOLUME on writable btrfs"]
fn btrfs_self_replacement() {
    assert_eq!(std::env::consts::OS, "linux", "requires a Linux host");
    replacement_on_explicit_volume();
}

#[test]
#[ignore = "requires a Windows host and writable NTFS"]
fn ntfs_compression() {
    assert_eq!(std::env::consts::OS, "windows", "requires a Windows host");
    let root = tempfile::tempdir().unwrap();
    let bytes = support::packed();
    let payload = Payload::parse(&bytes).unwrap();
    let mut file = cache::cached_at(&payload, root.path()).unwrap();
    #[cfg(windows)]
    {
        use std::os::windows::fs::MetadataExt;

        use windows_sys::Win32::Storage::FileSystem::FILE_ATTRIBUTE_COMPRESSED;
        assert_ne!(
            fs::metadata(file.path()).unwrap().file_attributes() & FILE_ATTRIBUTE_COMPRESSED,
            0
        );
    }
    payload
        .header
        .verify(&mut fs::File::open(file.path()).unwrap())
        .unwrap();
    file.loaded().unwrap();
}

#[cfg(windows)]
#[test]
fn temporary_cleanup_after_process_exit() {
    use std::{
        process::{Command, Stdio},
        time::{Duration, Instant},
    };
    for abrupt in [false, true] {
        let directory = tempfile::tempdir().unwrap();
        let payload = directory.path().join("payload.swcn");
        let marker = directory.path().join("materialized-path.txt");
        fs::write(&payload, support::packed()).unwrap();
        let mut command = Command::new(std::env::current_exe().unwrap());
        command
            .args(["--exact", "temporary_exit_worker", "--nocapture"])
            .env("SWC_TEST_EXIT_PAYLOAD", &payload)
            .env("SWC_TEST_EXIT_MARKER", &marker)
            .stdout(Stdio::piped())
            .stderr(Stdio::piped());
        if abrupt {
            command.env("SWC_TEST_ABRUPT_EXIT", "1");
        }
        let mut child = command.spawn().unwrap();
        let deadline = Instant::now() + Duration::from_secs(30);
        while !marker.exists() && Instant::now() < deadline {
            if let Some(status) = child.try_wait().unwrap() {
                assert!(
                    marker.exists(),
                    "cleanup worker exited before loading: {status}"
                );
                break;
            }
            std::thread::sleep(Duration::from_millis(10));
        }
        assert!(marker.exists(), "cleanup worker did not finish loading");
        let path = PathBuf::from(fs::read_to_string(&marker).unwrap());
        if abrupt {
            child.kill().unwrap();
        }
        let result = child.wait_with_output().unwrap();
        assert!(
            abrupt || result.status.success(),
            "{}",
            String::from_utf8_lossy(&result.stderr)
        );
        assert!(
            !path.exists(),
            "delete-on-close left {} after process exit",
            path.display()
        );
    }
}

#[cfg(windows)]
#[test]
fn temporary_exit_worker() {
    let Some(input) = std::env::var_os("SWC_TEST_EXIT_PAYLOAD") else {
        return;
    };
    let bytes = fs::read(input).unwrap();
    let payload = Payload::parse(&bytes).unwrap();
    let mut file = cache::temporary(&payload).unwrap();
    let library = unsafe { libloading::Library::new(file.path()) }.unwrap();
    file.loaded().unwrap();
    let marker = PathBuf::from(std::env::var_os("SWC_TEST_EXIT_MARKER").unwrap());
    let pending = marker.with_extension("pending");
    fs::write(&pending, file.path().to_str().unwrap()).unwrap();
    fs::rename(pending, marker).unwrap();
    std::mem::forget(library);
    std::mem::forget(file);
    if std::env::var_os("SWC_TEST_ABRUPT_EXIT").is_some() {
        loop {
            std::thread::sleep(std::time::Duration::from_secs(1));
        }
    }
    std::process::exit(0);
}
