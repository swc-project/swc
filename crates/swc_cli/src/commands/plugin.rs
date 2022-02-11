use std::{
    io::{BufRead, BufReader, ErrorKind},
    path::{Path, PathBuf},
};

use anyhow::{Context, Result};
use cargo_util::paths::{self, create_dir_all};
use clap::{ArgEnum, Parser, Subcommand};

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

    let ignore: String = match paths::open(&ignore_file_path) {
        Err(err) => match err.downcast_ref::<std::io::Error>() {
            Some(io_err) if io_err.kind() == ErrorKind::NotFound => ignore_list.join("\n") + "\n",
            _ => return Err(err),
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

    paths::append(&ignore_file_path, ignore.as_bytes())?;
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

        // Create `Cargo.toml` file with necessary sections
        paths::write(
            &path.join("Cargo.toml"),
            format!(
                r#"[package]
name = "{}"
version = "0.1.0"
edition = "2018"

[lib]
crate-type = ["cdylib"]

# Workaround for https://github.com/Amanieu/parking_lot/issues/269
# (swc_atoms -> string_cache -> parking_lot)
[target.'cfg(target_arch = "wasm32")'.dependencies]
parking_lot_core = "=0.8.0"

[dependencies]
serde = "1"
swc_plugin = "*""#,
                name
            )
            .as_bytes(),
        )?;

        let build_target = match self.target_type {
            PluginTargetType::Wasm32UnknownUnknown => "wasm32-unknown-unknown",
            PluginTargetType::Wasm32Wasi => "wasm32-wasi",
        };

        // Create cargo config for build target
        let cargo_config_path = path.join(".cargo");
        create_dir_all(&cargo_config_path)?;
        paths::write(
            &cargo_config_path.join("config"),
            format!(
                r#"[build]
target = "{}""#,
                build_target
            )
            .as_bytes(),
        )?;

        // Create entrypoint src file
        let src_path = path.join("src");
        create_dir_all(&src_path)?;
        paths::write(
            &src_path.join("lib.rs"),
            r#"use swc_plugin::{ast::*, plugin_transform};

pub struct TransformVisitor;

impl VisitMut for TransformVisitor {
    // Implement necessary visit_mut_* methods for actual custom transform.
}

/// An entrypoint to the SWC's transform plugin.
/// `plugin_transform` macro handles necessary interop to communicate with the host,
/// and entrypoint function name (`process_transform`) can be anything else.
///
/// If plugin need to handle low-level ptr directly,
/// it is possible to opt out from macro by writing transform fn manually via raw interface
///
/// `__plugin_process_impl(
///     ast_ptr: *const u8,
///     ast_ptr_len: i32,
///     config_str_ptr: *const u8,
///     config_str_ptr_len: i32) ->
///     i32 /*  0 for success, fail otherwise.
///             Note this is only for internal pointer interop result,
///             not actual transform result */
///
/// However, this means plugin author need to handle all of serialization/deserialization
/// steps with communicating with host. Refer `swc_plugin_macro` for more details.
#[plugin_transform]
pub fn process_transform(program: Program, _plugin_config: String) -> Program {
    program.fold_with(&mut as_folder(TransformVisitor))
}
"#
            .as_bytes(),
        )?;

        println!(
            r#"Successfully created {}.
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
