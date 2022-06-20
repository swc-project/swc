use std::{
    borrow::Cow,
    collections::HashSet,
    fs,
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
    config::{Config, ConfigFile, Options},
    try_with_handler, Compiler, HandlerOpts, TransformOutput,
};
use swc_common::{
    errors::ColorConfig, sync::Lazy, FileName, FilePathMapping, SourceFile, SourceMap,
};
use swc_trace_macro::swc_trace;
use walkdir::WalkDir;

use crate::util::{clap::parse_hash_set, trace::init_trace};

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
    #[clap(long, default_value = "es,es6,js,jsx,mjs,ts,tsx", value_parser = parse_hash_set::<String>)]
    extensions: HashSet<String>,

    /// Files to compile
    #[clap(group = "input")]
    files: Vec<PathBuf>,

    /// Use a specific extension for the output files
    #[clap(long, default_value = "js")]
    out_file_extension: String,

    /// Enable experimental trace profiling
    /// generates trace compatible with trace event format.
    #[clap(long, group = "experimental_trace")]
    experimental_trace: bool,

    /// Set file name for the trace output. If not specified,
    /// `trace-{unix epoch time}.json` will be used by default.
    #[clap(long, group = "experimental_trace")]
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

/// Calculate full, absolute path to the file to emit.
/// Currently this is quite naive calculation based on assumption input file's
/// path and output dir are relative to the same directory.
fn resolve_output_file_path(
    out_dir: &Path,
    file_path: &Path,
    file_extension: &Path,
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
    out_dir: Option<&Path>,
    file_path: &Path,
    file_extension: &Path,
) -> anyhow::Result<()> {
    if let Some(out_dir) = out_dir {
        let output_file_path = resolve_output_file_path(out_dir, file_path, file_extension)?;
        let output_dir = output_file_path
            .parent()
            .expect("Parent should be available");

        if !output_dir.is_dir() {
            fs::create_dir_all(&output_dir).with_context(|| {
                format!("Failed to create directory '{}'", output_dir.display())
            })?;
        }

        fs::write(&output_file_path, &output.code)
            .with_context(|| format!("Failed to write to '{}'", output_file_path.display()))?;

        if let Some(source_map) = &output.map {
            let source_map_path = output_file_path.with_extension("js.map");
            fs::write(&source_map_path, source_map)
                .with_context(|| format!("Failed to write to '{}'", source_map_path.display()))?;
        }
        return Ok(());
    }

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

struct InputContext<'a> {
    options: Options,
    fm: Arc<SourceFile>,
    compiler: Arc<Compiler>,
    file_path: Cow<'a, Path>,
    file_extension: &'a Path,
}

#[swc_trace]
impl CompileOptions {
    fn build_transform_options(&self, file_path: Option<&Path>) -> anyhow::Result<Options> {
        let base_config = Config::default();
        let base_options = Options::default();

        let config_file = self
            .config_file
            .as_deref()
            .map(ConfigFile::from_path)
            .transpose()?;

        let mut options = Options {
            config: Config { ..base_config },
            config_file,
            ..base_options
        };

        if let Some(file_path) = file_path {
            options.filename = file_path.to_str().unwrap_or_default().to_owned();
        }

        if let Some(env_name) = &self.env_name {
            options.env_name = env_name.to_string();
        }

        Ok(options)
    }

    /// Create canonical list of inputs to be processed across stdin / single
    /// file / multiple files.
    fn collect_inputs(&self) -> anyhow::Result<Vec<InputContext<'_>>> {
        match (collect_stdin_input(), &self.files[..]) {
            (Some(_), files) if !files.is_empty() => {
                anyhow::bail!("Cannot specify inputs from both stdin and files at the same time");
            }
            (Some(stdin_input), _) => {
                let options = self.build_transform_options(self.filename.as_deref())?;
                let fm = COMPILER.cm.new_source_file(
                    if options.filename.is_empty() {
                        FileName::Anon
                    } else {
                        FileName::Real(options.filename.clone().into())
                    },
                    stdin_input,
                );
                Ok(vec![InputContext {
                    options,
                    fm,
                    compiler: Arc::clone(&*COMPILER),
                    file_path: self
                        .filename
                        .as_deref()
                        .unwrap_or_else(|| Path::new("unknown"))
                        .into(),
                    file_extension: Path::new(self.out_file_extension.as_str()),
                }])
            }
            (None, files) if files.is_empty() => {
                anyhow::bail!("Input is empty");
            }
            (None, _files) => self
                .get_files_list(false)?
                .into_iter()
                .map(|file_path| {
                    let options = self.build_transform_options(Some(file_path.as_ref()))?;
                    let fm = COMPILER.cm.load_file(file_path.as_ref()).with_context(|| {
                        format!("Failed to load file '{}'", file_path.display())
                    })?;
                    Ok(InputContext {
                        options,
                        fm,
                        compiler: Arc::clone(&*COMPILER),
                        file_path,
                        file_extension: Path::new(self.out_file_extension.as_str()),
                    })
                })
                .collect(),
        }
    }

    fn execute_inner(&self) -> anyhow::Result<()> {
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

        let inputs = self.collect_inputs()?;

        if let Some(path) = self.out_file.as_ref() {
            let outputs = inputs
                .into_par_iter()
                .map(
                    |InputContext {
                         compiler,
                         fm,
                         options,
                         ..
                     }| execute(compiler, fm, options),
                )
                .collect::<Result<Vec<_>, _>>()?;

            let parent = path.parent().expect("Parent should be available");
            fs::create_dir_all(&parent)
                .with_context(|| format!("Failed to create directory '{}'", parent.display()))?;

            let mut writer = {
                let f = fs::File::create(&path)?;
                io::BufWriter::new(f)
            };

            outputs.iter().try_for_each(|r| {
                writer
                    .write(r.code.as_bytes())
                    .map(|_| ())
                    .with_context(|| format!("Failed to write to '{}'", path.display()))
            })?;

            writer
                .flush()
                .with_context(|| format!("Failed to call flush on '{}'", path.display()))?;

            return Ok(());
        }

        inputs.into_par_iter().try_for_each(
            |InputContext {
                 compiler,
                 fm,
                 options,
                 file_path,
                 file_extension,
             }| {
                execute(compiler, fm, options).and_then(|output| {
                    emit_output(&output, self.out_dir.as_deref(), &file_path, file_extension)
                })
            },
        )
    }

    /// Infer list of files to be transformed from cli arguments.
    /// If given input is a directory, it'll traverse it and collect all
    /// supported files.
    #[tracing::instrument(level = "info", skip_all)]
    fn get_files_list(&self, _include_dotfiles: bool) -> anyhow::Result<Vec<Cow<'_, Path>>> {
        if self.files.is_empty() {
            return Ok(Vec::new());
        }

        if self.files.len() > 1 && self.files.iter().any(|path| path.is_dir()) {
            return Err(anyhow::anyhow!(
                "Cannot specify multiple files when using a directory as input"
            ));
        }

        let paths_to_ignore = self
            .ignore
            .as_deref()
            .map(|pattern| {
                let paths_to_ignore = glob(pattern)
                    .with_context(|| format!("Failed to glob the following pattern: {}", pattern))?
                    .filter_map(|res| res.ok())
                    .collect::<HashSet<_>>();
                Ok::<_, anyhow::Error>(paths_to_ignore)
            })
            .transpose()?
            .unwrap_or_default();

        let should_ignore = |path: &Path| paths_to_ignore.contains(path);

        let has_valid_extension = |path: &Path| {
            path.extension()
                .and_then(|e| e.to_str())
                .map(|ext| self.extensions.contains(ext))
                .unwrap_or_default()
        };

        let mut output = Vec::new();
        for path in &self.files {
            if path.is_dir() {
                let iter = WalkDir::new(path)
                    .into_iter()
                    .filter_map(|entry| Some(entry.ok()?.path().to_path_buf()))
                    .filter(|path| has_valid_extension(path.as_ref()))
                    .filter(|path| !should_ignore(path.as_ref()))
                    .map(Cow::from);
                output.extend(iter);
                continue;
            }
            if !has_valid_extension(path) || should_ignore(path) {
                continue;
            }
            output.push(path.into());
        }

        Ok(output)
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
