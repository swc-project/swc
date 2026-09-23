use std::{fs, io::Cursor, path::Path, process::Command};

#[test]
fn packs_final_fixture_without_changing_raw_or_cli() {
    let directory = tempfile::tempdir().unwrap();
    let input = directory.path().join("raw.node");
    let source = Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("../../crates/swc_native_addon/tests/fixtures/abi.rs");
    let result = Command::new("rustc")
        .args([
            "--edition=2021",
            "--crate-type=cdylib",
            "-C",
            "strip=symbols",
        ])
        .arg(source)
        .arg("-o")
        .arg(&input)
        .output()
        .unwrap();
    assert!(
        result.status.success(),
        "{}",
        String::from_utf8_lossy(&result.stderr)
    );
    let raw = fs::read(&input).unwrap();
    let cli = directory.path().join("swc");
    fs::write(&cli, b"CLI sentinel").unwrap();
    let output = directory.path().join("addon.swcn");
    let command = |output: &Path| {
        Command::new(env!("CARGO_BIN_EXE_swc-native-addon-pack"))
            .arg("--input")
            .arg(&input)
            .arg("--output")
            .arg(output)
            .arg("--target")
            .arg(
                swc_native_addon::format::NativeTarget::host()
                    .unwrap()
                    .as_triple(),
            )
            .output()
            .unwrap()
    };
    let result = command(&output);
    assert!(
        result.status.success(),
        "{}",
        String::from_utf8_lossy(&result.stderr)
    );
    let bytes = fs::read(&output).unwrap();
    let payload = swc_native_addon::format::Payload::parse(&bytes).unwrap();
    let mut decoded = Cursor::new(Vec::new());
    payload.decode_into(&mut decoded).unwrap();
    assert_eq!(decoded.into_inner(), raw);
    let result = command(&output);
    assert!(
        result.status.success(),
        "repacking an existing payload failed: {}",
        String::from_utf8_lossy(&result.stderr)
    );
    assert!(!command(&input).status.success());
    assert!(!command(&cli).status.success());
    fs::write(&input, b"invalid native data").unwrap();
    assert!(!command(&output).status.success());
    assert_eq!(
        fs::read(output).unwrap(),
        bytes,
        "failed packing overwrote existing output"
    );
    assert_eq!(fs::read(cli).unwrap(), b"CLI sentinel");
}
