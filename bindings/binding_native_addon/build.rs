use std::{env, fs, path::PathBuf};

use swc_native_addon::format::{NativeTarget, Payload};

fn main() {
    println!("cargo:rerun-if-env-changed=SWC_NATIVE_BINDING_PAYLOAD");
    let output = PathBuf::from(env::var_os("OUT_DIR").unwrap()).join("payload.rs");
    if env::var_os("CARGO_FEATURE_EMBEDDED_PAYLOAD").is_none() {
        fs::write(output, "static PAYLOAD: &[u8] = &[];\n").unwrap();
        return;
    }
    let target = env::var("TARGET").unwrap();
    let target = NativeTarget::parse(&target).expect("native carrier target");
    let path = PathBuf::from(
        env::var_os("SWC_NATIVE_BINDING_PAYLOAD")
            .expect("embedded-payload requires SWC_NATIVE_BINDING_PAYLOAD=/absolute/payload.swcn"),
    );
    assert!(
        path.is_absolute(),
        "SWC_NATIVE_BINDING_PAYLOAD must be absolute"
    );
    println!("cargo:rerun-if-changed={}", path.display());
    let bytes = fs::read(&path).expect("read native addon payload");
    let payload = Payload::parse(&bytes).expect("validate native addon payload header");
    assert_eq!(
        payload.header.target, target,
        "embedded native addon payload target does not match Cargo TARGET"
    );
    let output_parent = output.parent().expect("OUT_DIR has a parent");
    let mut raw = tempfile::Builder::new()
        .prefix(".swc-native-addon-validate-")
        .tempfile_in(output_parent)
        .expect("stage decoded native addon validation");
    payload
        .decode_into(&mut raw)
        .expect("decode embedded native addon bytes");
    payload
        .verify_target(&mut raw)
        .expect("validate embedded native addon target");
    // Copy to OUT_DIR so a later input replacement cannot change the validated
    // payload between build-script validation and rustc's include_bytes call.
    let embedded = output.with_file_name("payload.swcn");
    fs::write(&embedded, bytes).expect("snapshot validated addon payload");
    fs::write(
        output,
        format!("static PAYLOAD: &[u8] = include_bytes!({:?});\n", embedded),
    )
    .unwrap();
}
