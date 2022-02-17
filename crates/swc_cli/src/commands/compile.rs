use std::{
    fs,
    path::{Path, PathBuf},
    sync::Arc,
};

use anyhow::Context;
use clap::Parser;
use path_absolutize::Absolutize;
use rayon::prelude::*;
use relative_path::RelativePath;
use swc::{
    config::{Config, Options},
    try_with_handler, Compiler, TransformOutput,
};
use swc_common::{sync::Lazy, FilePathMapping, SourceMap};
use walkdir::WalkDir;

/// Configuration option for transform files.
#[derive(Parser)]
pub struct CompileOptions {
    /// Path to a .swcrc file to use
    #[clap(long = "config")]
    config_file: Option<PathBuf>,

    /// Files to compile
    files: Vec<PathBuf>,

    /// The output directory
    #[clap(long)]
    out_dir: Option<PathBuf>,

    /// Specify specific file extensions to compile.
    #[clap(long)]
    extensions: Option<Vec<String>>,
}

static COMPILER: Lazy<Arc<Compiler>> = Lazy::new(|| {
    let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));

    Arc::new(Compiler::new(cm))
});

/// List of file extensions supported by default.
static DEFAULT_EXTENSIONS: &[&str] = &["js", "jsx", "es6", "es", "mjs", "ts", "tsx"];

/// Infer list of files to be transformed from cli arguments.
/// If given input is a directory, it'll traverse it and collect all supported
/// files.
fn get_files_list(
    raw_files_input: &[PathBuf],
    extensions: &[String],
    _include_dotfiles: bool,
) -> anyhow::Result<Vec<PathBuf>> {
    let input_dir = raw_files_input.iter().find(|p| p.is_dir());

    let files = if let Some(input_dir) = input_dir {
        if raw_files_input.len() > 1 {
            return Err(anyhow::anyhow!(
                "Cannot specify multiple files when using a directory as input"
            ));
        }

        WalkDir::new(input_dir)
            .into_iter()
            .filter_map(|e| e.ok())
            .map(|e| e.into_path())
            .filter(|e| {
                extensions
                    .iter()
                    .any(|ext| e.extension().map(|v| v == &**ext).unwrap_or(false))
            })
            .collect()
    } else {
        raw_files_input.to_owned()
    };

    Ok(files)
}

fn build_transform_options(
    config_file: &Option<PathBuf>,
    file_path: &Path,
) -> anyhow::Result<Options> {
    let base_options = Options::default();
    let base_config = Config::default();

    let config_file = if let Some(config_file_path) = config_file {
        let config_file_contents = fs::read(config_file_path)?;
        serde_json::from_slice(&config_file_contents)
            .map_err(|e| anyhow::anyhow!("{}", e))
            .context("Failed to parse config file")?
    } else {
        None
    };

    Ok(Options {
        config: Config { ..base_config },
        config_file,
        filename: file_path.to_str().unwrap_or_default().to_owned(),
        ..base_options
    })
}

/// Calculate full, absolute path to the file to emit.
/// Currently this is quite naive calculation based on assumption input file's
/// path and output dir are relative to the same directory.
fn resolve_output_file_path(out_dir: &Path, file_path: &Path) -> anyhow::Result<PathBuf> {
    let default = PathBuf::from(".");
    let base = file_path.parent().unwrap_or(&default).display().to_string();

    let dist_absolute_path = out_dir.absolutize()?;

    // These are possible combinations between input to output dir.
    // cwd: /c/github/swc
    //
    // Input
    // 1. Relative to cwd                   : ./crates/swc/tests/serde/a.js
    // 2. Relative to cwd, traverse up      : ../repo/some/dir/b.js
    // 3. Absolute path, relative to cwd: /c/github/swc/crates/swc/tests/serde/a.js
    // 4. Absolute path, not relative to cwd: /c/github/repo/some/dir/b.js
    //
    // OutDir
    // a. Relative to cwd: ./dist
    // b. Relative to cwd, traverse up: ../outer_dist
    // c. Absolute path: /c/github/swc/dist
    // d. Absolute path, not relative to cwd: /c/github/outer_dist
    //
    // It is unclear how to calculate output path when either input or output is not
    // relative to cwd (2,4 and b,d) and it is UB for now.
    let base = RelativePath::new(&*base);
    let output_path = base.to_logical_path(dist_absolute_path).join(
        // Custom output file extension is not supported yet
        file_path
            .with_extension("js")
            .file_name()
            .expect("Filename should be available"),
    );

    Ok(output_path)
}

fn emit_output(
    output: &TransformOutput,
    out_dir: &Option<PathBuf>,
    file_path: &Path,
) -> anyhow::Result<()> {
    if let Some(out_dir) = out_dir {
        let output_file_path = resolve_output_file_path(out_dir, file_path)?;
        let output_dir = output_file_path
            .parent()
            .expect("Parent should be available");

        if !output_dir.is_dir() {
            fs::create_dir_all(output_dir)?;
        }

        fs::write(&output_file_path, &output.code)?;

        if let Some(source_map) = &output.map {
            let source_map_path = output_file_path.with_extension("js.map");
            fs::write(source_map_path, source_map)?;
        }
    } else {
        println!(
            "{}\n{}\n{}",
            file_path.display(),
            output.code,
            output
                .map
                .as_ref()
                .map(|m| m.to_string())
                .unwrap_or_default()
        );
    };
    Ok(())
}

impl super::CommandRunner for CompileOptions {
    fn execute(&self) -> anyhow::Result<()> {
        let included_extensions = if let Some(extensions) = &self.extensions {
            extensions.clone()
        } else {
            DEFAULT_EXTENSIONS.iter().map(|v| v.to_string()).collect()
        };

        let files = get_files_list(&self.files, &included_extensions, false)?;
        let cm = COMPILER.clone();

        if let Some(out_dir) = &self.out_dir {
            fs::create_dir_all(out_dir)?;
        }

        files
            .into_par_iter()
            .try_for_each_with(cm, |compiler, file_path| {
                let result = try_with_handler(compiler.cm.clone(), false, |handler| {
                    let options = build_transform_options(&self.config_file, &file_path)?;
                    let fm = compiler
                        .cm
                        .load_file(&file_path)
                        .context("failed to load file")?;
                    compiler.process_js_file(fm, handler, &options)
                });

                match result {
                    Ok(output) => emit_output(&output, &self.out_dir, &file_path)?,
                    Err(e) => return Err(e),
                };

                Ok(())
            })
    }
}
