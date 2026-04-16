use std::{
    fs::{self, create_dir_all, hard_link},
    path::Path,
    process::{Child, Command, Stdio},
    thread::sleep,
    time::{Duration, Instant},
};

use anyhow::{bail, Result};
use assert_cmd::prelude::*;
use assert_fs::TempDir;

fn cli() -> Result<Command> {
    let mut cmd = Command::new(assert_cmd::cargo::cargo_bin!("swc"));
    cmd.stderr(Stdio::inherit());
    Ok(cmd)
}

struct ChildGuard {
    child: Child,
}

impl ChildGuard {
    fn try_wait(&mut self) -> Result<Option<std::process::ExitStatus>> {
        Ok(self.child.try_wait()?)
    }
}

impl Drop for ChildGuard {
    fn drop(&mut self) {
        let _ = self.child.kill();
        let _ = self.child.wait();
    }
}

fn spawn_watch_command(cmd: &mut Command) -> Result<ChildGuard> {
    let child = cmd.stdout(Stdio::null()).stdin(Stdio::null()).spawn()?;

    Ok(ChildGuard { child })
}

fn wait_for<F>(message: &str, mut check: F) -> Result<()>
where
    F: FnMut() -> Result<bool>,
{
    let deadline = Instant::now() + Duration::from_secs(10);

    while Instant::now() < deadline {
        if check()? {
            return Ok(());
        }

        sleep(Duration::from_millis(50));
    }

    bail!("Timed out while waiting for {message}")
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

#[test]
fn issue_11643_external_helpers_false_respected() -> Result<()> {
    let sandbox = TempDir::new()?;
    fs::write(
        sandbox.path().join(".swcrc"),
        r#"{
            "jsc": {
                "externalHelpers": false
            },
            "module": {
                "type": "commonjs"
            }
        }"#,
    )?;
    fs::write(
        sandbox.path().join("index.ts"),
        r#"export * from "./my-file";"#,
    )?;
    fs::write(sandbox.path().join("my-file.ts"), "export const foo = 1;")?;

    let mut cmd = cli()?;
    cmd.current_dir(&sandbox)
        .arg("compile")
        .arg("--config-file")
        .arg(".swcrc")
        .arg("--out-file")
        .arg("index.js")
        .arg("index.ts");

    cmd.assert().success();

    let output = fs::read_to_string(sandbox.path().join("index.js"))?;
    assert!(
        !output.contains("@swc/helpers"),
        "Expected no external helper imports/requires when externalHelpers is false. Got: {output}",
    );
    assert!(
        output.contains("function _export_star("),
        "Expected inline _export_star helper when externalHelpers is false. Got: {output}",
    );
    assert!(
        output.contains("_export_star(require(\"./my-file\"), exports);"),
        "Expected re-export call to use inline helper. Got: {output}",
    );

    Ok(())
}

#[test]
fn issue_flow_strip_enabled_via_parser_syntax_flow() -> Result<()> {
    let sandbox = TempDir::new()?;
    fs::write(
        sandbox.path().join(".swcrc"),
        r#"{
            "jsc": {
                "parser": {
                    "syntax": "flow"
                }
            }
        }"#,
    )?;
    fs::write(
        sandbox.path().join("input.js"),
        r#"// @flow
function add(a: number): number {
  return a;
}
const value: string = "ok";
"#,
    )?;

    let mut cmd = cli()?;
    cmd.current_dir(&sandbox)
        .arg("compile")
        .arg("--config-file")
        .arg(".swcrc")
        .arg("--out-file")
        .arg("output.js")
        .arg("input.js");

    cmd.assert().success();

    let output = fs::read_to_string(sandbox.path().join("output.js"))?;
    assert!(
        output.contains("function add(a)"),
        "Expected Flow type annotations to be stripped. Got: {output}"
    );
    assert!(
        !output.contains(": number"),
        "Flow function type annotation should be stripped. Got: {output}"
    );
    assert!(
        !output.contains(": string"),
        "Flow variable type annotation should be stripped. Got: {output}"
    );

    Ok(())
}

#[test]
fn issue_4017_out_dir_preserves_leading_directory() -> Result<()> {
    let sandbox = TempDir::new()?;
    create_dir_all(sandbox.path().join("src"))?;
    fs::write(
        sandbox.path().join("src/index.ts"),
        "export const value = 1;\n",
    )?;

    let mut cmd = cli()?;
    cmd.current_dir(&sandbox)
        .arg("compile")
        .arg("--out-dir")
        .arg("dist")
        .arg("src");

    cmd.assert().success();

    assert!(
        sandbox.path().join("dist/src/index.js").exists(),
        "Expected output at dist/src/index.js"
    );

    Ok(())
}

#[test]
fn issue_4017_strip_leading_paths_flattens_output() -> Result<()> {
    let sandbox = TempDir::new()?;
    create_dir_all(sandbox.path().join("src"))?;
    fs::write(
        sandbox.path().join("src/index.ts"),
        "export const value = 1;\n",
    )?;

    let mut cmd = cli()?;
    cmd.current_dir(&sandbox)
        .arg("compile")
        .arg("--out-dir")
        .arg("dist")
        .arg("--strip-leading-paths")
        .arg("src");

    cmd.assert().success();

    assert!(
        sandbox.path().join("dist/index.js").exists(),
        "Expected output at dist/index.js"
    );
    assert!(
        !sandbox.path().join("dist/src/index.js").exists(),
        "Did not expect output at dist/src/index.js"
    );

    Ok(())
}

#[test]
fn issue_4017_absolute_directory_input_is_normalized() -> Result<()> {
    let sandbox = TempDir::new()?;
    create_dir_all(sandbox.path().join("src"))?;
    fs::write(
        sandbox.path().join("src/index.ts"),
        "export const value = 1;\n",
    )?;

    let out_dir = sandbox.path().join("dist");
    let absolute_input = sandbox.path().join("src").canonicalize()?;

    let mut cmd = cli()?;
    cmd.arg("compile")
        .arg("--out-dir")
        .arg(&out_dir)
        .arg(&absolute_input);

    cmd.assert().success();

    assert!(
        out_dir.join("src/index.js").exists(),
        "Expected absolute directory input to emit dist/src/index.js"
    );
    assert!(
        !out_dir.join("var").exists(),
        "Absolute input should not recreate host paths under out-dir"
    );

    Ok(())
}

#[test]
fn issue_4017_copy_files_copies_non_compilable_assets() -> Result<()> {
    let sandbox = TempDir::new()?;
    create_dir_all(sandbox.path().join("src"))?;
    fs::write(
        sandbox.path().join("src/index.ts"),
        "export const value = 1;\n",
    )?;
    fs::write(sandbox.path().join("src/data.json"), "{\"ok\":true}\n")?;

    let mut cmd = cli()?;
    cmd.current_dir(&sandbox)
        .arg("compile")
        .arg("--out-dir")
        .arg("dist")
        .arg("--copy-files")
        .arg("src");

    cmd.assert().success();

    let copied = fs::read_to_string(sandbox.path().join("dist/src/data.json"))?;
    assert_eq!(copied, "{\"ok\":true}\n");

    Ok(())
}

#[test]
fn issue_4017_watch_out_dir_updates_and_removes_outputs() -> Result<()> {
    let sandbox = TempDir::new()?;
    create_dir_all(sandbox.path().join("src"))?;

    let source_path = sandbox.path().join("src/index.ts");
    let output_path = sandbox.path().join("dist/src/index.js");

    fs::write(&source_path, "export const value = 1;\n")?;

    let mut cmd = cli()?;
    cmd.current_dir(&sandbox)
        .arg("compile")
        .arg("--watch")
        .arg("--out-dir")
        .arg("dist")
        .arg("src");

    let mut child = spawn_watch_command(&mut cmd)?;

    wait_for("initial watch output", || Ok(output_path.exists()))?;
    wait_for("watch process to stay alive", || {
        Ok(child.try_wait()?.is_none())
    })?;

    let initial = fs::read_to_string(&output_path)?;
    assert!(initial.contains('1'));

    fs::write(&source_path, "export const value = 2;\n")?;
    wait_for("updated watch output", || {
        Ok(fs::read_to_string(&output_path)
            .map(|content| content.contains('2'))
            .unwrap_or(false))
    })?;

    fs::remove_file(&source_path)?;
    wait_for("compiled output removal after deleting source", || {
        Ok(!output_path.exists())
    })?;

    Ok(())
}

#[test]
fn issue_4017_copy_files_watch_adds_updates_and_removes_assets() -> Result<()> {
    let sandbox = TempDir::new()?;
    create_dir_all(sandbox.path().join("src"))?;

    fs::write(
        sandbox.path().join("src/index.ts"),
        "export const value = 1;\n",
    )?;
    let asset_path = sandbox.path().join("src/data.json");
    let copied_path = sandbox.path().join("dist/src/data.json");

    let mut cmd = cli()?;
    cmd.current_dir(&sandbox)
        .arg("compile")
        .arg("--watch")
        .arg("--out-dir")
        .arg("dist")
        .arg("--copy-files")
        .arg("src");

    let mut child = spawn_watch_command(&mut cmd)?;

    wait_for("initial watch compilation", || {
        Ok(sandbox.path().join("dist/src/index.js").exists())
    })?;
    wait_for("watch process to stay alive", || {
        Ok(child.try_wait()?.is_none())
    })?;

    fs::write(&asset_path, "{\"version\":1}\n")?;
    wait_for("copied asset creation", || Ok(copied_path.exists()))?;

    let copied = fs::read_to_string(&copied_path)?;
    assert_eq!(copied, "{\"version\":1}\n");

    fs::write(&asset_path, "{\"version\":2}\n")?;
    wait_for("copied asset update", || {
        Ok(fs::read_to_string(&copied_path)
            .map(|content| content.contains("\"version\":2"))
            .unwrap_or(false))
    })?;

    fs::remove_file(&asset_path)?;
    wait_for("copied asset removal", || Ok(!copied_path.exists()))?;

    Ok(())
}

#[test]
fn issue_4017_watch_out_file_rebuilds_single_output() -> Result<()> {
    let sandbox = TempDir::new()?;
    let source_path = sandbox.path().join("input.ts");
    let output_path = sandbox.path().join("output.js");

    fs::write(&source_path, "export const value = 1;\n")?;

    let mut cmd = cli()?;
    cmd.current_dir(&sandbox)
        .arg("compile")
        .arg("--watch")
        .arg("--out-file")
        .arg("output.js")
        .arg("input.ts");

    let mut child = spawn_watch_command(&mut cmd)?;

    wait_for("initial out-file watch output", || Ok(output_path.exists()))?;
    wait_for("watch process to stay alive", || {
        Ok(child.try_wait()?.is_none())
    })?;

    fs::write(&source_path, "export const value = 2;\n")?;
    wait_for("rebuilt out-file output", || {
        Ok(fs::read_to_string(&output_path)
            .map(|content| content.contains('2'))
            .unwrap_or(false))
    })?;

    Ok(())
}

#[test]
fn issue_4017_watch_requires_output() -> Result<()> {
    let sandbox = TempDir::new()?;
    fs::write(sandbox.path().join("input.ts"), "export const value = 1;\n")?;

    let mut cmd = cli()?;
    cmd.current_dir(&sandbox)
        .arg("compile")
        .arg("--watch")
        .arg("input.ts");

    cmd.assert().failure();

    Ok(())
}

#[test]
fn issue_4017_copy_files_requires_out_dir() -> Result<()> {
    let sandbox = TempDir::new()?;
    fs::write(sandbox.path().join("input.json"), "{\"ok\":true}\n")?;

    let mut cmd = cli()?;
    cmd.current_dir(&sandbox)
        .arg("compile")
        .arg("--copy-files")
        .arg("input.json");

    cmd.assert().failure();

    Ok(())
}

#[test]
fn issue_4017_strip_leading_paths_requires_out_dir() -> Result<()> {
    let sandbox = TempDir::new()?;
    fs::write(sandbox.path().join("input.ts"), "export const value = 1;\n")?;

    let mut cmd = cli()?;
    cmd.current_dir(&sandbox)
        .arg("compile")
        .arg("--strip-leading-paths")
        .arg("input.ts");

    cmd.assert().failure();

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

/// `--out-file file.min.js` (no directory component) should not fail with
/// EEXIST when trying to mkdir the current directory.
#[test]
fn issue_11717_out_file_same_directory() -> Result<()> {
    let sandbox = TempDir::new()?;
    fs::write(
        sandbox.path().join("file.js"),
        "const x = 1;\nconsole.log(x);\n",
    )?;

    let mut cmd = cli()?;
    cmd.current_dir(&sandbox)
        .arg("compile")
        .arg("--out-file")
        .arg("file.min.js")
        .arg("file.js");

    cmd.assert().success();

    let output = fs::read_to_string(sandbox.path().join("file.min.js"))?;
    assert!(
        output.contains("console.log"),
        "Output file should contain compiled code. Got: {output}"
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
