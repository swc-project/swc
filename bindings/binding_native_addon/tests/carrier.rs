use std::{
    fs,
    path::{Path, PathBuf},
    process::Command,
};

fn fixture_source(name: &str) -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("../../crates/swc_native_addon/tests/fixtures")
        .join(name)
}

fn checked(command: &mut Command) {
    let output = command.output().unwrap();
    assert!(
        output.status.success(),
        "{command:?}\n{}\n{}",
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
}

fn sign(_path: &Path) {
    #[cfg(target_os = "macos")]
    checked(
        Command::new("/usr/bin/codesign")
            .args(["--force", "--sign", "-"])
            .arg(_path),
    );
}

#[test]
fn real_carrier_forwards_registration_and_throws_loader_errors() {
    let directory = tempfile::tempdir().unwrap();
    let raw = directory.path().join("raw.node");
    checked(
        Command::new("rustc")
            .args([
                "--edition=2021",
                "--crate-type=cdylib",
                "-C",
                "opt-level=2",
                "-C",
                "strip=symbols",
            ])
            .arg(fixture_source("node.rs"))
            .arg("-o")
            .arg(&raw),
    );
    sign(&raw);
    let raw_bytes = fs::read(&raw).unwrap();
    let packed = swc_native_addon::format::pack(&raw_bytes).unwrap();
    let payload = directory.path().join("payload.swcn");
    fs::write(&payload, &packed).unwrap();
    let build = directory.path().join("build");
    checked(
        Command::new("cargo")
            .args([
                "build",
                "-p",
                "binding_native_addon",
                "--features",
                "embedded-payload",
                "--target-dir",
            ])
            .arg(&build)
            .env("SWC_NATIVE_BINDING_PAYLOAD", &payload),
    );
    #[cfg(target_os = "linux")]
    let artifact = "libbinding_native_addon.so";
    #[cfg(target_os = "macos")]
    let artifact = "libbinding_native_addon.dylib";
    #[cfg(windows)]
    let artifact = "binding_native_addon.dll";
    let carrier = directory.path().join("carrier with spaces-λ.node");
    fs::copy(build.join("debug").join(artifact), &carrier).unwrap();
    sign(&carrier);
    let original_carrier = fs::read(&carrier).unwrap();
    let cli = directory.path().join("swc");
    fs::write(&cli, b"sibling CLI must be preserved").unwrap();

    let node = std::env::var_os("SWC_TEST_NODE").unwrap_or_else(|| "node".into());
    for action in ["success", "success", "raw-error"] {
        let mut command = Command::new(&node);
        command
            .arg(fixture_source("smoke.cjs"))
            .arg(&carrier)
            .arg(action)
            .env("SWC_NATIVE_BINDING_CACHE", "0");
        if action == "raw-error" {
            command.env("SWC_TEST_RAW_THROW", "1");
        }
        checked(&mut command);
        assert_eq!(
            fs::read(&carrier).unwrap(),
            original_carrier,
            "temporary-only mode replaced carrier"
        );
    }

    // Mutate only the embedded data in a still-valid native carrier. The build
    // script correctly refuses invalid payloads, so corruption tests happen on
    // a copy of the final artifact, with a fresh signature on macOS.
    let offset = original_carrier
        .windows(packed.len())
        .position(|window| window == packed)
        .unwrap();
    for (name, byte) in [
        ("header", 0),
        ("digest", 32),
        (
            "compressed",
            swc_native_addon::format::HEADER_LEN + packed.len() / 3,
        ),
    ] {
        let mut damaged = original_carrier.clone();
        damaged[offset + byte] ^= 0x80;
        let path = directory.path().join(format!("corrupt-{name}.node"));
        fs::write(&path, damaged).unwrap();
        sign(&path);
        checked(
            Command::new(&node)
                .arg(fixture_source("smoke.cjs"))
                .arg(&path)
                .arg("loader-error")
                .env("SWC_NATIVE_BINDING_CACHE", "0"),
        );
    }
    checked(
        Command::new(&node)
            .arg(fixture_source("smoke.cjs"))
            .arg(&carrier)
            .arg("loader-error")
            .env("SWC_NATIVE_BINDING_CACHE", "relative-root"),
    );
    // Each child traverses the real N-API entry point against the same cold
    // cache/carrier. This covers registration as well as atomic materialization.
    let cache = directory.path().join("concurrent cache");
    let mut children = Vec::new();
    for _ in 0..8 {
        children.push(
            Command::new(&node)
                .arg(fixture_source("smoke.cjs"))
                .arg(&carrier)
                .arg("success")
                .env("SWC_NATIVE_BINDING_CACHE", &cache)
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
            "concurrent registration: {}",
            String::from_utf8_lossy(&result.stderr)
        );
    }
    assert_eq!(fs::read(&raw).unwrap(), raw_bytes);
    assert_eq!(fs::read(cli).unwrap(), b"sibling CLI must be preserved");
}
