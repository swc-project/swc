use std::{env, path::Path, process::Command};

fn build(crate_name: &str) {
    let status = Command::new("cargo")
        .arg("build")
        .arg("-p")
        .current_dir(
            env::current_dir()
                .unwrap()
                .parent()
                .unwrap()
                .join("examples")
                .join(crate_name),
        )
        .arg(crate_name)
        .status()
        .expect("failed to run cargo build");

    assert!(status.success());
}

#[test]
fn drop_console() {
    build("drop_console");
}
