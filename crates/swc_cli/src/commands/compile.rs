use std::{
    fs,
    io::{self, BufRead},
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
    try_with_handler, Compiler, HandlerOpts, TransformOutput,
};
use swc_common::{errors::ColorConfig, sync::Lazy, FileName, FilePathMapping, SourceMap};
use swc_trace_macro::swc_trace;
use walkdir::WalkDir;

use crate::util::trace::init_trace;

/// Configuration option for transform files.
#[derive(Parser)]
pub struct CompileOptions {
    /// Override a config from .swcrc file.
    #[clap(long)]
    config: Option<Vec<String>>,

    /// Path to a .swcrc file to use
    #[clap(long)]
    config_file: Option<PathBuf>,

    /// Filename to use when reading from stdin - this will be used in
    /// source-maps, errors etc
    #[clap(long, short = 'f', group = "input")]
    filename: Option<PathBuf>,

    /// The name of the 'env' to use when loading configs and plugins. Defaults
    /// to the value of SWC_ENV, or else NODE_ENV, or else development.
    #[clap(long)]
    env_name: Option<String>,

    /// List of glob paths to not compile.
    #[clap(long)]
    ignore: Option<String>,

    /// Values: true|false|inline|both
    #[clap(long)]
    source_maps: Option<String>,

    /// Define the file for the source map.
    #[clap(long)]
    source_maps_target: Option<String>,

    /// Set sources[0] on returned source map
    #[clap(long)]
    source_file_name: Option<String>,

    /// The root from which all sources are relative.
    #[clap(long)]
    source_root: Option<String>,

    /// Automatically recompile files on change
    #[clap(long)]
    watch: bool,

    /// Compile all input files into a single file.
    #[clap(long, group = "output")]
    out_file: Option<PathBuf>,

    /// The output directory
    #[clap(long, group = "output")]
    out_dir: Option<PathBuf>,

    /// Specify specific file extensions to compile.
    #[clap(long)]
    extensions: Option<Vec<String>>,

    /// Files to compile
    #[clap(group = "input")]
    files: Vec<PathBuf>,

    /// Enable experimantal trace profiling
    /// generates trace compatible with trace event format.
    #[clap(group = "experimental_trace", long)]
    experimental_trace: bool,

    /// Set file name for the trace output. If not specified,
    /// `trace-{unix epoch time}.json` will be used by default.
    #[clap(group = "experimental_trace", long)]
    trace_out_file: Option<String>,
    //Flags legacy @swc/cli supports, might need some thoughts if we need support same.
    //log_watch_compilation: bool,
    //copy_files: bool,
    //include_dotfiles: bool,
    //only: Option<String>,
    //no_swcrc: bool,
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
#[tracing::instrument(level = "info", skip_all)]
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
    file_path: &Option<&Path>,
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

    let mut ret = Options {
        config: Config { ..base_config },
        config_file,
        ..base_options
    };

    if let Some(file_path) = file_path {
        ret.filename = file_path.to_str().unwrap_or_default().to_owned();
    }

    Ok(ret)
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

fn collect_stdin_input() -> Option<String> {
    if atty::is(atty::Stream::Stdin) {
        return None;
    }

    Some(
        io::stdin()
            .lock()
            .lines()
            .map(|line| line.expect("Not able to read stdin"))
            .collect::<Vec<String>>()
            .join("\n"),
    )
}

#[swc_trace]
impl CompileOptions {
    fn execute_inner(&self) -> anyhow::Result<()> {
        let stdin_input = collect_stdin_input();

        if stdin_input.is_some() && !self.files.is_empty() {
            anyhow::bail!("Cannot specify inputs from stdin and files at the same time");
        }

        if stdin_input.is_none() && self.files.is_empty() {
            anyhow::bail!("Input is empty");
        }

        if let Some(stdin_input) = stdin_input {
            let span = tracing::span!(tracing::Level::INFO, "compile_stdin");
            let stdin_span_guard = span.enter();
            let comp = COMPILER.clone();

            let result = try_with_handler(
                comp.cm.clone(),
                HandlerOpts {
                    color: swc_common::errors::ColorConfig::Always,
                    skip_filename: false,
                },
                |handler| {
                    let options =
                        build_transform_options(&self.config_file, &self.filename.as_deref())?;

                    let fm = comp.cm.new_source_file(
                        if options.filename.is_empty() {
                            FileName::Anon
                        } else {
                            FileName::Real(options.filename.clone().into())
                        },
                        stdin_input,
                    );

                    comp.process_js_file(fm, handler, &options)
                },
            );

            match result {
                Ok(output) => emit_output(
                    &output,
                    &self.out_dir,
                    self.filename.as_ref().unwrap_or(&PathBuf::from("unknown")),
                )?,
                Err(e) => return Err(e),
            };

            drop(stdin_span_guard);
            return Ok(());
        }

        if !self.files.is_empty() {
            let span = tracing::span!(tracing::Level::INFO, "compile_files");
            let files_span_guard = span.enter();
            let included_extensions = if let Some(extensions) = &self.extensions {
                extensions.clone()
            } else {
                DEFAULT_EXTENSIONS.iter().map(|v| v.to_string()).collect()
            };

            let files = get_files_list(&self.files, &included_extensions, false)?;
            let cm = COMPILER.clone();

            let ret = files
                .into_par_iter()
                .try_for_each_with(cm, |compiler, file_path| {
                    let result = try_with_handler(
                        compiler.cm.clone(),
                        HandlerOpts {
                            color: ColorConfig::Always,
                            skip_filename: false,
                        },
                        |handler| {
                            let options =
                                build_transform_options(&self.config_file, &Some(&file_path))?;
                            let fm = compiler
                                .cm
                                .load_file(&file_path)
                                .context("failed to load file")?;
                            compiler.process_js_file(fm, handler, &options)
                        },
                    );

                    match result {
                        Ok(output) => emit_output(&output, &self.out_dir, &file_path)?,
                        Err(e) => return Err(e),
                    };

                    Ok(())
                });
            drop(files_span_guard);
            return ret;
        }

        Ok(())
    }
}

#[swc_trace]
impl super::CommandRunner for CompileOptions {
    fn execute(&self) -> anyhow::Result<()> {
        let guard = if self.experimental_trace {
            init_trace(&self.trace_out_file)
        } else {
            None
        };

        let ret = self.execute_inner();

        if let Some(guard) = guard {
            guard.flush();
            drop(guard);
        }

        ret
    }
}
