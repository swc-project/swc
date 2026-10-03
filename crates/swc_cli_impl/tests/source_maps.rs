use std::{
    fs,
    path::{Path, PathBuf},
    process::{Child, Command, Stdio},
    thread::sleep,
    time::{Duration, Instant},
};

use anyhow::{bail, Result};
use assert_cmd::prelude::*;
use assert_fs::TempDir;
use base64::{engine::general_purpose::STANDARD, Engine};
use serde_json::{json, Value};

const INPUTS: [&str; 3] = [
    "src/index.ts",
    "src/nested/context.ts",
    "gendir/generated.ts",
];

struct Fixture {
    _sandbox: TempDir,
    project: PathBuf,
}

impl Fixture {
    fn new() -> Result<Self> {
        let sandbox = TempDir::new()?;
        let project = sandbox.path().join("project");
        let fixture = Path::new(env!("CARGO_MANIFEST_DIR")).join("tests/fixture-manual/12480");

        for file in [".swcrc", "src/view.tsx"].into_iter().chain(INPUTS) {
            let target = project.join(file);
            fs::create_dir_all(target.parent().unwrap())?;
            fs::copy(fixture.join(file), target)?;
        }

        // Match the child process's cwd even when the system temp directory is
        // reached through a symlink, such as /var on macOS.
        #[cfg(unix)]
        let project = project.canonicalize()?;
        Ok(Self {
            _sandbox: sandbox,
            project,
        })
    }

    fn command(&self) -> Command {
        let mut cmd = Command::new(assert_cmd::cargo::cargo_bin!("swc"));
        cmd.current_dir(&self.project)
            .stderr(Stdio::inherit())
            .arg("compile");
        cmd
    }

    fn check_map(&self, output: &str, input: &str, source: &str) -> Result<Value> {
        let output = self.project.join(output);
        let code = fs::read_to_string(&output)?;
        let map_path = output.with_extension(format!(
            "{}.map",
            output.extension().unwrap().to_string_lossy()
        ));
        let map: Value = if let Some((_, encoded)) =
            code.rsplit_once("//# sourceMappingURL=data:application/json;base64,")
        {
            assert!(!map_path.exists(), "Inline maps should not emit a map file");
            serde_json::from_slice(&STANDARD.decode(encoded.trim())?)?
        } else {
            assert!(code.ends_with(&format!(
                "//# sourceMappingURL={}",
                map_path.file_name().unwrap().to_string_lossy()
            )));
            serde_json::from_slice(&fs::read(map_path)?)?
        };
        assert_eq!(map["sources"], json!([source]), "Map for {output:?}");
        assert_eq!(
            map["sourcesContent"],
            json!([fs::read_to_string(self.project.join(input))?])
        );
        assert!(!map["mappings"].as_str().unwrap().is_empty());
        Ok(map)
    }

    fn check_default_maps(&self) -> Result<()> {
        for (input, output, source) in [
            ("src/index.ts", "lib/src/index.js", "../../src/index.ts"),
            (
                "src/nested/context.ts",
                "lib/src/nested/context.js",
                "../../../src/nested/context.ts",
            ),
            (
                "gendir/generated.ts",
                "lib/gendir/generated.js",
                "../../gendir/generated.ts",
            ),
        ] {
            self.check_map(output, input, source)?;
        }
        Ok(())
    }
}

#[test]
fn issue_12480_relative_inputs() -> Result<()> {
    let fixture = Fixture::new()?;
    fixture
        .command()
        .args(INPUTS)
        .args(["--out-dir", "lib", "--source-maps", "true"])
        .assert()
        .success();
    fixture.check_default_maps()
}

#[test]
fn issue_12480_directory_input() -> Result<()> {
    let fixture = Fixture::new()?;
    fixture
        .command()
        .args(["src", "--out-dir", "lib", "--source-maps", "true"])
        .assert()
        .success();
    fixture.check_map("lib/src/index.js", "src/index.ts", "../../src/index.ts")?;
    fixture.check_map(
        "lib/src/nested/context.js",
        "src/nested/context.ts",
        "../../../src/nested/context.ts",
    )?;
    Ok(())
}

#[test]
fn issue_12480_absolute_paths() -> Result<()> {
    let fixture = Fixture::new()?;
    for absolute_input in [false, true] {
        let mut cmd = fixture.command();
        if absolute_input {
            cmd.args(INPUTS.map(|input| fixture.project.join(input)));
        } else {
            cmd.args(INPUTS);
        }
        cmd.arg("--out-dir")
            .arg(fixture.project.join("lib"))
            .args(["--source-maps", "true"])
            .assert()
            .success();
        fixture.check_default_maps()?;
    }
    Ok(())
}

#[test]
fn issue_12480_output_outside_cwd() -> Result<()> {
    let fixture = Fixture::new()?;
    fixture
        .command()
        .args([
            "src/index.ts",
            "--out-dir",
            "../lib",
            "--source-maps",
            "true",
        ])
        .assert()
        .success();
    fixture.check_map(
        "../lib/src/index.js",
        "src/index.ts",
        "../../project/src/index.ts",
    )?;
    Ok(())
}

#[test]
fn issue_12480_strip_leading_paths() -> Result<()> {
    let fixture = Fixture::new()?;
    fixture
        .command()
        .args([
            "src",
            "--out-dir",
            "lib",
            "--strip-leading-paths",
            "--source-maps",
            "true",
        ])
        .assert()
        .success();
    fixture.check_map("lib/index.js", "src/index.ts", "../src/index.ts")?;
    fixture.check_map(
        "lib/nested/context.js",
        "src/nested/context.ts",
        "../../src/nested/context.ts",
    )?;
    Ok(())
}

#[test]
fn issue_12480_output_extension() -> Result<()> {
    let fixture = Fixture::new()?;
    fixture
        .command()
        .args([
            "src/index.ts",
            "--out-dir",
            "lib",
            "--out-file-extension",
            "mjs",
            "--source-maps",
            "true",
        ])
        .assert()
        .success();
    fixture.check_map("lib/src/index.mjs", "src/index.ts", "../../src/index.ts")?;
    Ok(())
}

#[test]
fn issue_12480_inline_maps() -> Result<()> {
    let fixture = Fixture::new()?;
    fixture
        .command()
        .args(INPUTS)
        .args(["--out-dir", "lib", "--source-maps", "inline"])
        .assert()
        .success();
    fixture.check_default_maps()
}

#[test]
fn issue_12480_maps_enabled_by_swcrc() -> Result<()> {
    let fixture = Fixture::new()?;
    fixture
        .command()
        .args(INPUTS)
        .args(["--out-dir", "lib"])
        .assert()
        .success();
    fixture.check_default_maps()
}

#[test]
fn issue_12480_source_overrides() -> Result<()> {
    let fixture = Fixture::new()?;
    for (args, source) in [
        (vec![], "../../src/index.ts"),
        (vec!["--source-file-name", "original.ts"], "original.ts"),
    ] {
        fixture
            .command()
            .args([
                "src/index.ts",
                "--out-dir",
                "lib",
                "--source-maps",
                "true",
                "--source-root",
                "/sources",
            ])
            .args(args)
            .assert()
            .success();
        let map = fixture.check_map("lib/src/index.js", "src/index.ts", source)?;
        assert_eq!(map["sourceRoot"], "/sources");
    }
    Ok(())
}

#[test]
fn issue_12480_jsx_development_filename() -> Result<()> {
    let fixture = Fixture::new()?;
    fixture
        .command()
        .args(["src/view.tsx", "--out-dir", "lib", "--source-maps", "true"])
        .assert()
        .success();
    let code = fs::read_to_string(fixture.project.join("lib/src/view.js"))?;
    assert!(code.contains("fileName: \"src/view.tsx\""), "{code}");
    fixture.check_map("lib/src/view.js", "src/view.tsx", "../../src/view.tsx")?;
    Ok(())
}

#[cfg(unix)]
#[test]
fn issue_12480_symlink_input_filename() -> Result<()> {
    let fixture = Fixture::new()?;
    std::os::unix::fs::symlink("src", fixture.project.join("linked"))?;
    fixture
        .command()
        .args([
            "linked/index.ts",
            "--out-dir",
            "lib",
            "--source-maps",
            "true",
        ])
        .assert()
        .success();
    fixture.check_map(
        "lib/linked/index.js",
        "linked/index.ts",
        "../../linked/index.ts",
    )?;
    Ok(())
}

struct WatchChild(Child);

impl Drop for WatchChild {
    fn drop(&mut self) {
        let _ = self.0.kill();
        let _ = self.0.wait();
    }
}

fn wait_for_map(path: &Path, source_content: &str, child: &mut WatchChild) -> Result<()> {
    let deadline = Instant::now() + Duration::from_secs(10);
    let output_path = path.with_extension("");
    while Instant::now() < deadline {
        if let Some(status) = child.0.try_wait()? {
            bail!("Watch process exited with {status}");
        }
        // Reading can race with the watcher rewriting the map.
        if let Ok(content) = fs::read(path) {
            if let Ok(map) = serde_json::from_slice::<Value>(&content) {
                if map["sourcesContent"] == json!([source_content]) {
                    if let Ok(code) = fs::read_to_string(&output_path) {
                        if code.contains("//# sourceMappingURL=") {
                            return Ok(());
                        }
                    }
                }
            }
        }
        sleep(Duration::from_millis(50));
    }
    bail!("Timed out waiting for source map {path:?}")
}

#[test]
fn issue_12480_watch_rebuild() -> Result<()> {
    let fixture = Fixture::new()?;
    let mut child = WatchChild(
        fixture
            .command()
            .args([
                "src/index.ts",
                "--out-dir",
                "lib",
                "--source-maps",
                "true",
                "--watch",
            ])
            .stdout(Stdio::null())
            .stdin(Stdio::null())
            .spawn()?,
    );
    let map_path = fixture.project.join("lib/src/index.js.map");
    let source_path = fixture.project.join("src/index.ts");
    wait_for_map(&map_path, &fs::read_to_string(&source_path)?, &mut child)?;
    fixture.check_map("lib/src/index.js", "src/index.ts", "../../src/index.ts")?;

    fs::write(&source_path, "export const value: number = 2;\n")?;
    wait_for_map(&map_path, "export const value: number = 2;\n", &mut child)?;
    fixture.check_map("lib/src/index.js", "src/index.ts", "../../src/index.ts")?;
    Ok(())
}
