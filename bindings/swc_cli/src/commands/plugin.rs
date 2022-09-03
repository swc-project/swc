use std::{
    fs::{self, create_dir_all, File, OpenOptions},
    io::{BufRead, BufReader, ErrorKind, Write},
    path::{Path, PathBuf},
};

use anyhow::{Context, Result};
use clap::{ArgEnum, Parser, Subcommand};
use swc_core::diagnostics::get_core_engine_diagnostics;

#[derive(Copy, Clone, PartialEq, Eq, PartialOrd, Ord, Debug, ArgEnum)]
pub enum PluginTargetType {
    /// wasm32-unknown-unknown target.
    Wasm32UnknownUnknown,
    /// wasm32-wasi target.
    Wasm32Wasi,
}

#[derive(Parser, Debug)]
pub struct PluginScaffoldOptions {
    /// Set the resulting plugin name, defaults to the directory name
    #[clap(long)]
    pub name: Option<String>,

    /// Sets default build target type of the plugin.
    ///
    /// "wasm32-wasi" enables wasi (https://github.com/WebAssembly/WASI) support for the generated
    /// binary which allows to use macros like 'println!' or 'dbg!' and other
    /// system-related calls.
    ///
    /// "wasm32-unknown-unknown" will makes those calls as no-op, instead
    /// generates slightly smaller binaries.
    #[clap(long, arg_enum)]
    pub target_type: PluginTargetType,

    pub path: PathBuf,
}

/// Infer package name of the plugin if not specified via cli options.
fn get_name(option: &PluginScaffoldOptions) -> Result<&str> {
    if let Some(ref name) = option.name {
        return Ok(name);
    }

    let file_name = option.path.file_name().ok_or_else(|| {
        anyhow::format_err!(
            "cannot auto-detect package name from path {:?} ; use --name to override",
            option.path.as_os_str()
        )
    })?;

    file_name.to_str().ok_or_else(|| {
        anyhow::format_err!(
            "cannot create package with a non-unicode name: {:?}",
            file_name
        )
    })
}

/// Generate ignore file for the project.
///
/// Note: this is slim implementation does not support different vcs other than
/// git at the moment.
fn write_ignore_file(base_path: &Path) -> Result<()> {
    let ignore_list: Vec<String> = vec!["/target", "^target/", "target"]
        .iter()
        .map(|v| v.to_string())
        .collect();

    let ignore_file_path = base_path.join(".gitignore");

    let ignore: String = match File::open(&ignore_file_path) {
        Err(err) => match err {
            io_err if io_err.kind() == ErrorKind::NotFound => ignore_list.join("\n") + "\n",
            _ => return Err(err).context("failed to open .gitignore"),
        },
        Ok(file) => {
            let existing = BufReader::new(file);

            let existing_items = existing.lines().collect::<Result<Vec<_>, _>>().unwrap();
            let mut out = String::new();

            out.push_str("\n\n# Added by swc\n");
            if ignore_list.iter().any(|item| existing_items.contains(item)) {
                out.push_str("#\n# already existing elements were commented out\n");
            }
            out.push('\n');

            for item in &ignore_list {
                if existing_items.contains(item) {
                    out.push('#');
                }
                out.push_str(item);
                out.push('\n');
            }

            out
        }
    };

    let mut f = OpenOptions::new()
        .write(true)
        .append(true)
        .create(true)
        .open(&ignore_file_path)?;

    write!(f, "{}", ignore).context("failed to write to .gitignore file")?;

    Ok(())
}

impl super::CommandRunner for PluginScaffoldOptions {
    /// Create a rust project for the plugin from template.
    /// This largely mimic https://github.com/rust-lang/cargo/blob/master/src/cargo/ops/cargo_new.rs,
    /// but also thinner implementation based on some assumptions like skipping
    /// to support non-git based vcs.
    fn execute(&self) -> Result<()> {
        let path = &self.path;
        if path.exists() {
            anyhow::bail!("destination `{}` already exists", path.display())
        }

        let name = get_name(self)?;

        // Choose to rely on system's git binary instead of depends on git lib for now
        // to avoid bring in large / heavy dependencies into cli binaries.
        // Depends on our usecase grows, we can revisit this.
        let mut base_git_cmd = if cfg!(target_os = "windows") {
            let mut c = std::process::Command::new("cmd");
            c.arg("/C").arg("git");
            c
        } else {
            std::process::Command::new("git")
        };

        // init git repo
        base_git_cmd
            .args(["init", name])
            .output()
            .context("failed to create dir for the plugin")?;

        // generate .gitignore
        write_ignore_file(path)?;

        let core_engine = get_core_engine_diagnostics();
        let swc_core_version: Vec<&str> = core_engine.package_semver.split('.').collect();
        // We'll pick semver major.minor, but allow any patch version.
        let swc_core_version = format!("{}.{}.*", swc_core_version[0], swc_core_version[1]);

        // Create `Cargo.toml` file with necessary sections
        fs::write(
            &path.join("Cargo.toml"),
            format!(
                r#"[package]
name = "{}"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[profile.release]
lto = true

[dependencies]
serde = "1"
swc_core = { version = "{}", features = [
    "ecma_ast",
    "ecma_visit",
    "plugin_transform",
    "swc_atoms",
    "swc_plugin",
    "testing_transform",
] }

# .cargo/config defines few alias to build plugin.
# cargo build-wasi generates wasm-wasi32 binary
# cargo build-wasm32 generates wasm32-unknown-unknown binary.
"#,
                name, swc_core_version
            )
            .as_bytes(),
        )
        .context("failed to write Cargo.toml file")?;

        let build_target = match self.target_type {
            PluginTargetType::Wasm32UnknownUnknown => "wasm32-unknown-unknown",
            PluginTargetType::Wasm32Wasi => "wasm32-wasi",
        };

        let build_alias = match self.target_type {
            PluginTargetType::Wasm32UnknownUnknown => "build-wasm32",
            PluginTargetType::Wasm32Wasi => "build-wasi",
        };

        // Create cargo config for build target
        let cargo_config_path = path.join(".cargo");
        create_dir_all(&cargo_config_path).context("`create_dir_all` failed")?;
        fs::write(
            &cargo_config_path.join("config"),
            r#"# These command aliases are not final, may change
[alias]
# Alias to build actual plugin binary for the specified target.
build-wasi = "build --target wasm32-wasi"
build-wasm32 = "build --target wasm32-unknown-unknown"
"#
            .as_bytes(),
        )
        .context("failed to write config toml file")?;

        // Create package.json for npm package publishing.
        let dist_output_path = format!("target/{}/release/{}.wasm", build_target, name);
        fs::write(
            &path.join("package.json"),
            format!(
                r#"{{
    "name": "{}",
    "version": "0.1.0",
    "description": "",
    "author": "",
    "license": "ISC",
    "keywords": ["swc-plugin"],
    "main": "{}",
    "scripts": {{
        "prepublishOnly": "cargo {} --release"
    }},
    "files": []
}}
"#,
                name, dist_output_path, build_alias
            )
            .as_bytes(),
        )
        .context("failed to write package.json file")?;

        // Create entrypoint src file
        let src_path = path.join("src");
        create_dir_all(&src_path)?;
        fs::write(
            &src_path.join("lib.rs"),
            include_bytes!("../../../../crates/swc_plugin_testing/src/template.rs"),
        )
        .context("failed to write the rust source file")?;

        println!(
            r#"✅ Successfully created {}.
If you haven't, please ensure to add target via "rustup target add {}" "#,
            path.display(),
            build_target
        );
        Ok(())
    }
}

/// Set of subcommands for the plugin subcommand.
#[derive(Subcommand)]
pub enum PluginSubcommand {
    /// Create a new plugin project with minimal scaffolding template.
    New(PluginScaffoldOptions),
}
