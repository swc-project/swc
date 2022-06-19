use std::{
    fs::{self, File},
    io::{self, BufRead, Write},
    path::{Path, PathBuf},
    sync::Arc,
};

use anyhow::Context;
use clap::Parser;
use glob::glob;
use path_absolutize::Absolutize;
use rayon::prelude::*;
use relative_path::RelativePath;
use swc::{
    config::{Config, Options},
    try_with_handler, Compiler, HandlerOpts, TransformOutput,
};
use swc_common::{
    errors::ColorConfig, sync::Lazy, FileName, FilePathMapping, SourceFile, SourceMap,
};
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

    /// Use a specific extension for the output files
    #[clap(long, default_value_t= String::from("js"))]
    out_file_extension: String,

    /// Enable experimental trace profiling
    /// generates trace compatible with trace event format.
    #[clap(group = "experimental_trace", long)]
    experimental_trace: bool,

    /// Set file name for the trace output. If not specified,
    /// `trace-{unix epoch time}.json` will be used by default.
    #[clap(group = "experimental_trace", long)]
    trace_out_file: Option<String>,
    /*Flags legacy @swc/cli supports, might need some thoughts if we need support same.
     *log_watch_compilation: bool,
     *copy_files: bool,
     *include_dotfiles: bool,
     *only: Option<String>,
     *no_swcrc: bool, */
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
    ignore_pattern: Option<&str>,
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

    if let Some(ignore_pattern) = ignore_pattern {
        let pattern: Vec<PathBuf> = glob(ignore_pattern)?.filter_map(|p| p.ok()).collect();

        return Ok(files
            .into_iter()
            .filter(|file_path| !pattern.iter().any(|p| p.eq(file_path)))
            .collect());
    }

    Ok(files)
}

/// Calculate full, absolute path to the file to emit.
/// Currently this is quite naive calculation based on assumption input file's
/// path and output dir are relative to the same directory.
fn resolve_output_file_path(
    out_dir: &Path,
    file_path: &Path,
    file_extension: PathBuf,
) -> anyhow::Result<PathBuf> {
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
            .with_extension(file_extension)
            .file_name()
            .expect("Filename should be available"),
    );

    Ok(output_path)
}

fn emit_output(
    output: &TransformOutput,
    out_dir: &Option<PathBuf>,
    file_path: &Path,
    file_extension: PathBuf,
) -> anyhow::Result<()> {
    if let Some(out_dir) = out_dir {
        let output_file_path = resolve_output_file_path(out_dir, file_path, file_extension)?;
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

struct InputContext {
    options: Options,
    fm: Arc<SourceFile>,
    compiler: Arc<Compiler>,
    file_path: PathBuf,
    file_extension: PathBuf,
}

#[swc_trace]
impl CompileOptions {
    fn build_transform_options(&self, file_path: &Option<&Path>) -> anyhow::Result<Options> {
        let base_options = Options::default();
        let base_config = Config::default();

        let config_file = if let Some(config_file_path) = &self.config_file {
            let config_file_contents = fs::read(config_file_path)?;
            serde_json::from_slice(&config_file_contents).context("Failed to parse config file")?
        } else {
            None
        };

        let mut ret = Options {
            config: Config { ..base_config },
            config_file,
            ..base_options
        };

        if let Some(file_path) = *file_path {
            ret.filename = file_path.to_str().unwrap_or_default().to_owned();
        }

        if let Some(env_name) = &self.env_name {
            ret.env_name = env_name.to_string();
        }

        Ok(ret)
    }

    /// Create canonical list of inputs to be processed across stdin / single
    /// file / multiple files.
    fn collect_inputs(&self) -> anyhow::Result<Vec<InputContext>> {
        let compiler = COMPILER.clone();

        let stdin_input = collect_stdin_input();
        if stdin_input.is_some() && !self.files.is_empty() {
            anyhow::bail!("Cannot specify inputs from stdin and files at the same time");
        }

        if let Some(stdin_input) = stdin_input {
            let options = self.build_transform_options(&self.filename.as_deref())?;

            let fm = compiler.cm.new_source_file(
                if options.filename.is_empty() {
                    FileName::Anon
                } else {
                    FileName::Real(options.filename.clone().into())
                },
                stdin_input,
            );

            return Ok(vec![InputContext {
                options,
                fm,
                compiler,
                file_path: self
                    .filename
                    .clone()
                    .unwrap_or_else(|| PathBuf::from("unknown")),
                file_extension: self.out_file_extension.clone().into(),
            }]);
        } else if !self.files.is_empty() {
            let included_extensions = if let Some(extensions) = &self.extensions {
                extensions.clone()
            } else {
                DEFAULT_EXTENSIONS.iter().map(|v| v.to_string()).collect()
            };

            return get_files_list(
                &self.files,
                &included_extensions,
                self.ignore.as_deref(),
                false,
            )?
            .iter()
            .map(|file_path| {
                self.build_transform_options(&Some(file_path))
                    .and_then(|options| {
                        let fm = compiler
                            .cm
                            .load_file(file_path)
                            .context("failed to load file");
                        fm.map(|fm| InputContext {
                            options,
                            fm,
                            compiler: compiler.clone(),
                            file_path: file_path.to_path_buf(),
                            file_extension: self.out_file_extension.clone().into(),
                        })
                    })
            })
            .collect::<anyhow::Result<Vec<InputContext>>>();
        }

        anyhow::bail!("Input is empty");
    }

    fn execute_inner(&self) -> anyhow::Result<()> {
        let inputs = self.collect_inputs()?;

        let execute = |compiler: Arc<Compiler>, fm: Arc<SourceFile>, options: Options| {
            try_with_handler(
                compiler.cm.clone(),
                HandlerOpts {
                    color: ColorConfig::Always,
                    skip_filename: false,
                },
                |handler| compiler.process_js_file(fm, handler, &options),
            )
        };

        if let Some(single_out_file) = self.out_file.as_ref() {
            let result: anyhow::Result<Vec<TransformOutput>> = inputs
                .into_par_iter()
                .map(
                    |InputContext {
                         compiler,
                         fm,
                         options,
                         ..
                     }| execute(compiler, fm, options),
                )
                .collect();

            fs::create_dir_all(
                single_out_file
                    .parent()
                    .expect("Parent should be available"),
            )?;
            let mut buf = File::create(single_out_file)?;

            result?
                .iter()
                .try_for_each(|r| buf.write(r.code.as_bytes()).and(Ok(())))?;

            buf.flush()
                .context("Failed to write output into single file")
        } else {
            inputs.into_par_iter().try_for_each(
                |InputContext {
                     compiler,
                     fm,
                     options,
                     file_path,
                     file_extension,
                 }| {
                    let result = execute(compiler, fm, options);

                    match result {
                        Ok(output) => {
                            emit_output(&output, &self.out_dir, &file_path, file_extension)
                        }
                        Err(e) => Err(e),
                    }
                },
            )
        }
    }
}

#[swc_trace]
impl super::CommandRunner for CompileOptions {
    fn execute(&self) -> anyhow::Result<()> {
        let guard = init_trace(self.trace_out_file.as_deref());
        let ret = self.execute_inner();
        guard.flush();
        ret
    }
}
