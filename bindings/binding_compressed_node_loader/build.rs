use std::{
    env, fs, io,
    path::{Path, PathBuf},
};

fn main() {
    napi_build::setup();

    println!("cargo:rerun-if-env-changed=SWC_COMPRESSED_BINDING_PAYLOAD");

    let out_dir = PathBuf::from(env::var_os("OUT_DIR").expect("OUT_DIR must be set"));
    let generated = out_dir.join("pressed_data.rs");

    match env::var_os("SWC_COMPRESSED_BINDING_PAYLOAD") {
        Some(payload) => {
            let payload = PathBuf::from(payload);
            println!("cargo:rerun-if-changed={}", payload.display());
            let data_path = out_dir.join("pressed-data.bin");
            copy_payload(&payload, &data_path).unwrap_or_else(|err| {
                panic!(
                    "failed to copy compressed binding payload from {}: {err}",
                    payload.display()
                )
            });
            fs::write(
                generated,
                r#"
#[used]
#[cfg_attr(target_os = "macos", link_section = "__SMOL,__PRESSED_DATA")]
#[cfg_attr(all(unix, not(target_os = "macos")), link_section = ".PRESSED_DATA")]
#[cfg_attr(windows, link_section = ".PRESSED")]
pub static PRESSED_DATA: [u8; include_bytes!(concat!(env!("OUT_DIR"), "/pressed-data.bin")).len()] =
  *include_bytes!(concat!(env!("OUT_DIR"), "/pressed-data.bin"));
"#,
            )
            .expect("failed to write generated pressed data module");
        }
        None => {
            fs::write(
                generated,
                r#"
#[used]
pub static PRESSED_DATA: [u8; 0] = [];
"#,
            )
            .expect("failed to write empty pressed data module");
        }
    }
}

fn copy_payload(from: &Path, to: &Path) -> io::Result<()> {
    fs::copy(from, to).map(|_| ())
}
