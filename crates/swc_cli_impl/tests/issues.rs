use std::{
    fs::{self, create_dir_all, hard_link},
    path::Path,
    process::{Command, Stdio},
};

use anyhow::Result;
use assert_cmd::prelude::*;
use assert_fs::TempDir;

fn cli() -> Result<Command> {
    let mut cmd = Command::new(assert_cmd::cargo::cargo_bin!("swc"));
    cmd.stderr(Stdio::inherit());
    Ok(cmd)
}

#[test]
fn issue_8265_1() -> Result<()> {
    let pwd = Path::new("tests/fixture-manual/8265").canonicalize()?;
    let tmp = TempDir::new()?;

    create_dir_all(tmp.path().join("src/modules/moduleA"))?;
    create_dir_all(tmp.path().join("src/modules/moduleB"))?;

    symlink(&pwd.join(".swcrc"), &tmp.path().join(".swcrc"));
    symlink(&pwd.join("src/index.ts"), &tmp.path().join("src/index.ts"));
    symlink(
        &pwd.join("src/modules/moduleA/index.ts"),
        &tmp.path().join("src/modules/moduleA/index.ts"),
    );
    symlink(
        &pwd.join("src/modules/moduleB/index.ts"),
        &tmp.path().join("src/modules/moduleB/index.ts"),
    );

    print_ls_alr(&tmp);

    let mut cmd = cli()?;
    cmd.current_dir(&tmp)
        .arg("compile")
        .arg("--source-maps")
        .arg("false")
        .arg("--config-file")
        .arg(".swcrc")
        .arg("--out-file")
        .arg("src/index.js")
        .arg("src/index.ts");

    cmd.assert().success();

    let content = fs::read_to_string(tmp.join("src/index.js"))?;
    assert!(
        content.contains("require(\"./modules/moduleA\")"),
        "{}",
        content
    );

    Ok(())
}

#[test]
fn issue_8495_1() -> Result<()> {
    let pwd = Path::new("tests/fixture-manual/8495").canonicalize()?;

    let mut cmd = cli()?;
    cmd.current_dir(&pwd)
        .arg("compile")
        .arg("--source-maps")
        .arg("true")
        .arg("--source-file-name")
        .arg("input.ts")
        .arg("--config-file")
        .arg(".swcrc")
        .arg("--out-file")
        .arg("dist/input.js")
        .arg("src/input.ts");

    cmd.assert().success();

    fs::read_to_string(pwd.join("dist/input.js"))?;
    Ok(())
}

#[test]
fn issue_8667_1() -> Result<()> {
    let output_base = TempDir::new()?;
    let bin_dir = output_base.path().join("bazel-out/arch/bin");
    let sandbox = output_base.path().join("sandbox/123");

    let pwd = Path::new("tests/fixture-manual/8265").canonicalize()?;

    create_dir_all(bin_dir.join("src/modules/moduleA"))?;
    create_dir_all(bin_dir.join("src/modules/moduleB"))?;
    create_dir_all(sandbox.join("src/modules/moduleA"))?;
    create_dir_all(sandbox.join("src/modules/moduleB"))?;

    // hard links from BINDIR into src
    hard_link(pwd.join(".swcrc"), bin_dir.join(".swcrc"))?;
    hard_link(pwd.join("src/index.ts"), bin_dir.join("src/index.ts"))?;
    hard_link(
        pwd.join("src/modules/moduleA/index.ts"),
        bin_dir.join("src/modules/moduleA/index.ts"),
    )?;
    hard_link(
        pwd.join("src/modules/moduleB/index.ts"),
        bin_dir.join("src/modules/moduleB/index.ts"),
    )?;

    // soft links from sandbox into bazel-bin
    symlink(&bin_dir.join(".swcrc"), &sandbox.join(".swcrc"));
    symlink(&bin_dir.join("src/index.ts"), &sandbox.join("src/index.ts"));
    symlink(
        &bin_dir.join("src/modules/moduleA/index.ts"),
        &sandbox.join("src/modules/moduleA/index.ts"),
    );
    symlink(
        &bin_dir.join("src/modules/moduleB/index.ts"),
        &sandbox.join("src/modules/moduleB/index.ts"),
    );

    //
    print_ls_alr(&sandbox);

    let mut cmd = cli()?;
    cmd.current_dir(&sandbox)
        .arg("compile")
        .arg("--source-maps")
        .arg("false")
        .arg("--config-file")
        .arg(".swcrc")
        .arg("--out-file")
        .arg(bin_dir.join("src/index.js"))
        .arg("src/index.ts");

    cmd.assert().success();

    let content = fs::read_to_string(bin_dir.join("src/index.js"))?;
    assert!(
        content.contains("require(\"./modules/moduleA\")"),
        "{}",
        content
    );

    Ok(())
}

#[test]
fn issue_9559() -> Result<()> {
    let sandbox = TempDir::new()?;
    fs::write(sandbox.path().join("index.ts"), r"console.log('Hello')")?;
    fs::create_dir(sandbox.path().join("chart.js"))?;

    let mut cmd = cli()?;
    cmd.current_dir(&sandbox).arg("compile").arg(sandbox.path());

    cmd.assert().success();

    Ok(())
}

/// Tests that `--root-mode upward` finds a `.swcrc` in a parent directory.
#[test]
fn root_mode_upward_finds_parent_config() -> Result<()> {
    let tmp = TempDir::new()?;

    let subdir = tmp.path().join("subdir");
    create_dir_all(&subdir)?;

    // target: es2022 keeps arrow functions (unlike default es5)
    fs::write(
        tmp.path().join(".swcrc"),
        r#"{
            "jsc": {
                "parser": { "syntax": "ecmascript" },
                "target": "es2022"
            }
        }"#,
    )?;

    fs::write(subdir.join("input.js"), "const arrow = () => 'hello';")?;

    let mut cmd = cli()?;
    cmd.current_dir(&subdir)
        .arg("compile")
        .arg("--root-mode")
        .arg("upward")
        .arg("--out-file")
        .arg("output.js")
        .arg("input.js");

    cmd.assert().success();

    // Verify the config was found: es2022 keeps arrow functions
    let output = fs::read_to_string(subdir.join("output.js"))?;
    assert!(
        output.contains("=>"),
        "Arrow should be kept with es2022 target from parent .swcrc. Got: {output}"
    );

    Ok(())
}

/// Tests that `--root-mode root` does NOT search parent directories for
/// `.swcrc`.
#[test]
fn root_mode_root_ignores_parent_config() -> Result<()> {
    let tmp = TempDir::new()?;

    let subdir = tmp.path().join("subdir");
    create_dir_all(&subdir)?;

    // Parent has .swcrc with es2022 (keeps arrows)
    fs::write(
        tmp.path().join(".swcrc"),
        r#"{
            "jsc": {
                "parser": { "syntax": "ecmascript" },
                "target": "es2022"
            }
        }"#,
    )?;

    fs::write(subdir.join("input.js"), "const arrow = () => 'hello';")?;

    let mut cmd = cli()?;
    cmd.current_dir(&subdir)
        .arg("compile")
        .arg("--root-mode")
        .arg("root")
        .arg("--out-file")
        .arg("output.js")
        .arg("input.js");

    cmd.assert().success();

    // Parent .swcrc should be ignored, so default es5 transforms arrow to function
    let output = fs::read_to_string(subdir.join("output.js"))?;
    assert!(
        output.contains("function"),
        "Parent .swcrc should be ignored with root mode. Got: {output}"
    );

    Ok(())
}

/// Tests that `--root-mode upward` fails when no `.swcrc` is found.
#[test]
fn root_mode_upward_fails_without_config() -> Result<()> {
    let tmp = TempDir::new()?;

    // No .swcrc anywhere
    fs::write(tmp.path().join("input.js"), "const arrow = () => 'hello';")?;

    let mut cmd = cli()?;
    cmd.current_dir(&tmp)
        .arg("compile")
        .arg("--root-mode")
        .arg("upward")
        .arg("--out-file")
        .arg("output.js")
        .arg("input.js");

    cmd.assert().failure();

    Ok(())
}

/// Tests that `--root-mode upward-optional` succeeds even without a `.swcrc`.
#[test]
fn root_mode_upward_optional_succeeds_without_config() -> Result<()> {
    let tmp = TempDir::new()?;

    // No .swcrc anywhere
    fs::write(tmp.path().join("input.js"), "const arrow = () => 'hello';")?;

    let mut cmd = cli()?;
    cmd.current_dir(&tmp)
        .arg("compile")
        .arg("--root-mode")
        .arg("upward-optional")
        .arg("--out-file")
        .arg("output.js")
        .arg("input.js");

    cmd.assert().success();

    // Should compile with defaults (es5 transforms arrow to function)
    let output = fs::read_to_string(tmp.path().join("output.js"))?;
    assert!(
        output.contains("function"),
        "Should use default es5 target without .swcrc. Got: {output}"
    );

    Ok(())
}

/// Tests that `--root-mode upward-optional` uses parent `.swcrc` when found.
#[test]
fn root_mode_upward_optional_finds_parent_config() -> Result<()> {
    let tmp = TempDir::new()?;

    let subdir = tmp.path().join("subdir");
    create_dir_all(&subdir)?;

    // target: es2022 keeps arrow functions
    fs::write(
        tmp.path().join(".swcrc"),
        r#"{
            "jsc": {
                "parser": { "syntax": "ecmascript" },
                "target": "es2022"
            }
        }"#,
    )?;

    fs::write(subdir.join("input.js"), "const arrow = () => 'hello';")?;

    let mut cmd = cli()?;
    cmd.current_dir(&subdir)
        .arg("compile")
        .arg("--root-mode")
        .arg("upward-optional")
        .arg("--out-file")
        .arg("output.js")
        .arg("input.js");

    cmd.assert().success();

    // Verify the config was found: es2022 keeps arrow functions
    let output = fs::read_to_string(subdir.join("output.js"))?;
    assert!(
        output.contains("=>"),
        "Arrow should be kept with es2022 target from parent .swcrc. Got: {output}"
    );

    Ok(())
}

/// ln -s $a $b
fn symlink(a: &Path, b: &Path) {
    #[cfg(unix)]
    {
        std::os::unix::fs::symlink(a, b).unwrap();
    }

    #[cfg(windows)]
    {
        std::os::windows::fs::symlink_file(a, b).unwrap();
    }
}

fn print_ls_alr(path: &Path) {
    let mut cmd = Command::new("ls");
    cmd.arg("-alR").arg(path);
    cmd.status().unwrap();
}
