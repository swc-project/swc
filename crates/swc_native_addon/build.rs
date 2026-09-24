use std::{env, path::PathBuf, process::Command};

fn main() {
    println!("cargo:rerun-if-changed=src/cleanup/windows_helper.rs");
    if env::var("CARGO_CFG_TARGET_OS").as_deref() != Ok("windows") {
        return;
    }
    // Compile for the addon target, not the build-script host. The helper has
    // no external dependencies and is embedded in the carrier, so temporary
    // loading does not depend on a shell, Node executable, or installed tool.
    let output = PathBuf::from(env::var_os("OUT_DIR").unwrap()).join("cleanup.exe");
    let mut compiler = Command::new(env::var_os("RUSTC").unwrap());
    compiler.args([
        "src/cleanup/windows_helper.rs",
        "--edition=2021",
        "--crate-name=swc_native_cleanup",
        "-Copt-level=s",
        "-Cpanic=abort",
        "-Clto",
        "-Ccodegen-units=1",
        "-Cstrip=symbols",
        "--target",
    ]);
    compiler
        .arg(env::var_os("TARGET").unwrap())
        .arg("-o")
        .arg(output);
    if let Some(linker) = env::var_os("RUSTC_LINKER") {
        let mut option = std::ffi::OsString::from("linker=");
        option.push(linker);
        compiler.arg("-C").arg(option);
    }
    assert!(
        compiler.status().unwrap().success(),
        "build native cleanup helper"
    );
}
