use std::{fs, io::Write, path::Path, process::Command};

fn checked(command: &mut Command) {
    let result = command.output().unwrap();
    assert!(
        result.status.success(),
        "{command:?}\n{}\n{}",
        String::from_utf8_lossy(&result.stdout),
        String::from_utf8_lossy(&result.stderr)
    );
}

#[test]
fn final_carrier_verification_and_atomic_replacement() {
    let directory = tempfile::tempdir().unwrap();
    let raw = directory.path().join("raw with spaces.node");
    let fixture = Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("../../crates/swc_native_addon/tests/fixtures/node.rs");
    checked(
        Command::new("rustc")
            .args([
                "--edition=2021",
                "--crate-type=cdylib",
                "-C",
                "strip=symbols",
            ])
            .arg(fixture)
            .arg("-o")
            .arg(&raw),
    );
    // Keep this real native fixture larger than the loader on every host.
    // Native loaders ignore the overlay; the payload must reproduce it too.
    fs::OpenOptions::new()
        .append(true)
        .open(&raw)
        .unwrap()
        .write_all(&vec![0; 4 * 1024 * 1024])
        .unwrap();
    #[cfg(target_os = "macos")]
    checked(
        Command::new("/usr/bin/codesign")
            .args(["--force", "--sign", "-"])
            .arg(&raw),
    );
    let original = fs::read(&raw).unwrap();
    let target = swc_native_addon::format::NativeTarget::host()
        .unwrap()
        .as_triple();
    let payload = directory.path().join("payload.swcn");
    checked(
        Command::new(env!("CARGO_BIN_EXE_swc-native-addon-pack"))
            .arg("--input")
            .arg(&raw)
            .arg("--output")
            .arg(&payload)
            .arg("--target")
            .arg(target),
    );
    let build = directory.path().join("build");
    checked(
        Command::new("cargo")
            .args([
                "build",
                "-p",
                "binding_native_addon",
                "--release",
                "--features",
                "embedded-payload",
                "--target-dir",
            ])
            .arg(&build)
            .env("CARGO_PROFILE_RELEASE_STRIP", "symbols")
            .env("SWC_NATIVE_BINDING_PAYLOAD", &payload),
    );
    let library = if cfg!(windows) {
        "binding_native_addon.dll"
    } else if cfg!(target_os = "macos") {
        "libbinding_native_addon.dylib"
    } else {
        "libbinding_native_addon.so"
    };
    let carrier = directory.path().join("carrier.node");
    fs::copy(build.join("release").join(library), &carrier).unwrap();
    #[cfg(target_os = "macos")]
    checked(
        Command::new("/usr/bin/codesign")
            .args(["--force", "--sign", "-"])
            .arg(&carrier),
    );
    let cli = directory.path().join("swc");
    fs::write(&cli, b"unchanged CLI").unwrap();
    let verifier = |input: &Path| {
        let mut command = Command::new(env!("CARGO_BIN_EXE_swc-native-addon-verify"));
        command
            .arg("--input")
            .arg(input)
            .arg("--target")
            .arg(target);
        command
    };
    let extracted = directory.path().join("extracted.node");
    checked(
        verifier(&carrier)
            .arg("--raw")
            .arg(&raw)
            .arg("--extract")
            .arg(&extracted),
    );
    assert_eq!(fs::read(&extracted).unwrap(), original);
    assert!(!verifier(&carrier)
        .arg("--extract")
        .arg(&extracted)
        .status()
        .unwrap()
        .success());
    assert!(
        !verifier(&raw).status().unwrap().success(),
        "raw substitution passed"
    );
    assert!(!verifier(&carrier)
        .arg("--raw")
        .arg(&raw)
        .arg("--replace")
        .arg(&cli)
        .status()
        .unwrap()
        .success());
    let large = directory.path().join("large.node");
    fs::copy(&carrier, &large).unwrap();
    fs::OpenOptions::new()
        .write(true)
        .open(&large)
        .unwrap()
        .set_len(original.len() as u64)
        .unwrap();
    assert!(
        !verifier(&large).status().unwrap().success(),
        "equal-size carrier passed"
    );
    let corrupt = directory.path().join("corrupt.node");
    let mut bytes = fs::read(&carrier).unwrap();
    let packed = fs::read(&payload).unwrap();
    let offset = memchr::memmem::find(&bytes, &packed).unwrap();
    bytes[offset + 32] ^= 1;
    fs::write(&corrupt, &bytes).unwrap();
    assert!(!verifier(&corrupt)
        .arg("--raw")
        .arg(&raw)
        .arg("--replace")
        .arg(&raw)
        .status()
        .unwrap()
        .success());
    assert_eq!(
        fs::read(&raw).unwrap(),
        original,
        "failed verification changed raw"
    );
    checked(
        verifier(&carrier)
            .arg("--raw")
            .arg(&raw)
            .arg("--replace")
            .arg(&raw),
    );
    assert_eq!(fs::read(&raw).unwrap(), fs::read(&carrier).unwrap());
    assert_eq!(fs::read(&cli).unwrap(), b"unchanged CLI");
}
