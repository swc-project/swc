use std::{
    collections::BTreeSet,
    fs::{self, File},
    io::{self, ErrorKind, IsTerminal, Read, Write},
    path::{Component, Path, PathBuf},
    sync::Arc,
};

mod paths;
mod watch;

use anyhow::{bail, Context};
use clap::Parser;
use glob::Pattern;
use par_iter::prelude::*;
use path_absolutize::Absolutize;
use pathdiff::diff_paths;
use paths::resolve_output_path;
use swc_core::{
    base::{
        config::{
            default_swcrc, Config, ConfigFile, Options, PluginConfig, RootMode, SourceMapsConfig,
        },
        try_with_handler, Compiler, HandlerOpts, TransformOutput,
    },
    common::{errors::ColorConfig, FileName, FilePathMapping, SourceFile, SourceMap, GLOBALS},
    trace_macro::swc_trace,
};
use walkdir::WalkDir;
use watch::FileWatcher;

use crate::util::trace::init_trace;

/// Configuration option for transform files.
#[derive(Parser)]
pub struct CompileOptions {
    /// Experimental: provide an additional JSON config object to override the
    /// .swcrc. Can be used to provide experimental plugin configuration,
    /// including plugin imports that are explicitly relative, starting with `.`
    /// or `..`
    #[clap(long = "config-json", value_parser = parse_config)]
    config: Option<Config>,

    /// Path to a .swcrc file to use
    #[clap(long)]
    config_file: Option<PathBuf>,

    /// The mode to use for resolving the project root and .swcrc file.
    /// Values: root (default), upward, upward-optional
    #[clap(long, value_parser = parse_root_mode)]
    root_mode: Option<RootMode>,

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
    source_map_target: Option<String>,

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

    /// When compiling to a directory, copy over non-compilable files.
    #[clap(long)]
    copy_files: bool,

    /// Remove the leading directory from emitted output paths.
    #[clap(long)]
    strip_leading_paths: bool,

    /// Specify specific file extensions to compile.
    #[clap(long)]
    extensions: Option<Vec<String>>,

    /// Files to compile
    #[clap(group = "input")]
    files: Vec<PathBuf>,

    /// Use a specific extension for the output files
    #[clap(long, default_value_t = String::from("js"))]
    out_file_extension: String,

    /// Enable experimental trace profiling
    /// generates trace compatible with trace event format.
    #[clap(group = "experimental_trace", long)]
    experimental_trace: bool,

    /// Set file name for the trace output. If not specified,
    /// `trace-{unix epoch time}.json` will be used by default.
    #[clap(group = "experimental_trace", long)]
    trace_out_file: Option<String>,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
enum InputOrigin {
    Explicit,
    Discovered,
}

struct InputFile {
    path: PathBuf,
    origin: InputOrigin,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
enum OutputEntryKind {
    Compile,
    Copy,
}

struct OutputEntry {
    path: PathBuf,
    kind: OutputEntryKind,
}

struct InputContext {
    options: Options,
    fm: Arc<SourceFile>,
    compiler: Arc<Compiler>,
    file_path: PathBuf,
}

fn parse_config(s: &str) -> Result<Config, serde_json::Error> {
    serde_json::from_str(s)
}

fn parse_root_mode(s: &str) -> Result<RootMode, String> {
    match s {
        "root" => Ok(RootMode::Root),
        "upward" => Ok(RootMode::Upward),
        "upward-optional" => Ok(RootMode::UpwardOptional),
        _ => Err(format!(
            "Invalid root mode '{s}'. Valid values are: root, upward, upward-optional"
        )),
    }
}

/// List of file extensions supported by default.
static DEFAULT_EXTENSIONS: &[&str] = &["js", "jsx", "es6", "es", "mjs", "ts", "tsx", "cts", "mts"];

fn new_compiler() -> Arc<Compiler> {
    let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));
    Arc::new(Compiler::new(cm))
}

fn parse_ignore_pattern(ignore_pattern: Option<&str>) -> anyhow::Result<Option<Pattern>> {
    ignore_pattern
        .map(|ignore_pattern| Pattern::new(ignore_pattern).context("invalid --ignore pattern"))
        .transpose()
}

fn is_compilable_extension(file_path: &Path, extensions: &[String]) -> bool {
    let extension = match file_path.extension().and_then(|ext| ext.to_str()) {
        Some(extension) => extension,
        None => return false,
    };

    extensions
        .iter()
        .map(|value| value.trim_start_matches('.'))
        .any(|value| value == extension)
}

fn is_ignored_path(path: &Path, ignore_pattern: Option<&Pattern>, cwd: &Path) -> bool {
    let Some(ignore_pattern) = ignore_pattern else {
        return false;
    };

    ignore_pattern.matches_path(path)
        || diff_paths(path, cwd)
            .as_ref()
            .map(|relative_path| ignore_pattern.matches_path(relative_path))
            .unwrap_or(false)
}

/// Infer list of files from cli arguments.
#[tracing::instrument(level = "info", skip_all)]
fn collect_input_files(
    raw_files_input: &[PathBuf],
    ignore_pattern: Option<&Pattern>,
) -> anyhow::Result<Vec<InputFile>> {
    let input_dir = raw_files_input.iter().find(|path| path.is_dir());
    let cwd = std::env::current_dir()?;

    let files = if let Some(input_dir) = input_dir {
        if raw_files_input.len() > 1 {
            bail!("Cannot specify multiple files when using a directory as input");
        }

        WalkDir::new(input_dir)
            .into_iter()
            .filter_map(|entry| entry.ok())
            .map(|entry| entry.into_path())
            .filter(|path| path.is_file())
            .filter(|path| !is_ignored_path(path, ignore_pattern, &cwd))
            .map(|path| InputFile {
                path,
                origin: InputOrigin::Discovered,
            })
            .collect()
    } else {
        raw_files_input
            .iter()
            .filter(|path| !is_ignored_path(path, ignore_pattern, &cwd))
            .map(|path| InputFile {
                path: path.clone(),
                origin: InputOrigin::Explicit,
            })
            .collect()
    };

    Ok(files)
}

fn collect_stdin_input() -> Option<String> {
    let stdin = io::stdin();
    if stdin.is_terminal() {
        return None;
    }

    let mut buffer = String::new();
    let result = stdin.lock().read_to_string(&mut buffer);

    if result.is_ok() && !buffer.is_empty() {
        Some(buffer)
    } else {
        None
    }
}

fn execute_transform(
    compiler: Arc<Compiler>,
    fm: Arc<SourceFile>,
    options: Options,
) -> anyhow::Result<TransformOutput> {
    let color = ColorConfig::Always;
    let skip_filename = false;

    try_with_handler(
        compiler.cm.clone(),
        HandlerOpts {
            color,
            skip_filename,
        },
        |handler| {
            GLOBALS.set(&Default::default(), || {
                compiler.process_js_file(fm, handler, &options)
            })
        },
    )
    .map_err(|error| error.to_pretty_error())
}

fn resolve_source_map_path(output_file_path: &Path) -> PathBuf {
    let extension = match output_file_path.extension() {
        Some(extension) => format!("{}.map", extension.to_string_lossy()),
        None => String::from("map"),
    };

    output_file_path.with_extension(extension)
}

fn resolve_declaration_path(output_file_path: &Path) -> PathBuf {
    output_file_path.with_extension("d.ts")
}

fn remove_file_if_exists(path: &Path) -> anyhow::Result<()> {
    match fs::remove_file(path) {
        Ok(()) => Ok(()),
        Err(error) if error.kind() == ErrorKind::NotFound => Ok(()),
        Err(error) => Err(error.into()),
    }
}

fn emit_directory_output(
    mut output: TransformOutput,
    output_file_path: &Path,
) -> anyhow::Result<()> {
    let output_dir = output_file_path
        .parent()
        .expect("Parent should be available");

    if !output_dir.as_os_str().is_empty() && !output_dir.is_dir() {
        fs::create_dir_all(output_dir)?;
    }

    if let Some(ref source_map) = output.map {
        let source_map_path = resolve_source_map_path(output_file_path);

        output.code.push_str("\n//# sourceMappingURL=");
        output
            .code
            .push_str(&source_map_path.file_name().unwrap().to_string_lossy());

        fs::write(source_map_path, source_map)?;
    }

    fs::write(output_file_path, &output.code)?;

    if let Some(extra) = &output.output {
        let mut extra: serde_json::Map<String, serde_json::Value> =
            serde_json::from_str(extra).context("failed to parse extra output")?;

        if let Some(dts_code) = extra.remove("__swc_isolated_declarations__") {
            let declaration_path = resolve_declaration_path(output_file_path);
            fs::write(declaration_path, dts_code.as_str().unwrap())?;
        }
    }

    Ok(())
}

fn emit_stdout_output(file_path: &Path, output: TransformOutput) {
    let source_map = output.map.as_deref().unwrap_or("");

    eprintln!("{}", file_path.display());
    println!("{}\n{}", output.code, source_map);
}

#[swc_trace]
impl CompileOptions {
    fn build_transform_options(&self, file_path: &Option<&Path>) -> anyhow::Result<Options> {
        let config_file = self.config_file.as_ref().map(|config_file_path| {
            ConfigFile::Str(config_file_path.to_string_lossy().to_string())
        });

        let mut options = Options {
            config: self.config.to_owned().unwrap_or_default(),
            config_file,
            swcrc: default_swcrc(),
            ..Options::default()
        };

        options.config.jsc.experimental.plugins =
            options.config.jsc.experimental.plugins.map(|plugins| {
                plugins
                    .into_iter()
                    .map(|plugin| {
                        let path = Path::new(&plugin.0);
                        PluginConfig(
                            match path.components().next() {
                                Some(Component::CurDir) | Some(Component::ParentDir) => {
                                    path.absolutize().unwrap().display().to_string()
                                }
                                _ => plugin.0,
                            },
                            plugin.1,
                        )
                    })
                    .collect()
            });

        if let Some(file_path) = *file_path {
            file_path
                .to_str()
                .unwrap_or_default()
                .clone_into(&mut options.filename);
        }

        if let Some(env_name) = &self.env_name {
            options.env_name = env_name.to_string();
        }

        if let Some(root_mode) = self.root_mode {
            options.root_mode = root_mode;
        }

        if let Some(source_maps) = &self.source_maps {
            options.source_maps = Some(match source_maps.as_str() {
                "false" => SourceMapsConfig::Bool(false),
                "true" => SourceMapsConfig::Bool(true),
                value => SourceMapsConfig::Str(value.to_string()),
            });

            self.source_file_name
                .clone_into(&mut options.source_file_name);
            self.source_root.clone_into(&mut options.source_root);
        }

        Ok(options)
    }

    fn validate(&self) -> anyhow::Result<()> {
        if self.watch && self.out_file.is_none() && self.out_dir.is_none() {
            bail!("--watch requires --out-file or --out-dir");
        }

        if self.watch && self.files.is_empty() {
            bail!("--watch requires input files");
        }

        if self.copy_files && self.out_dir.is_none() {
            bail!("--copy-files requires --out-dir");
        }

        if self.strip_leading_paths && self.out_dir.is_none() {
            bail!("--strip-leading-paths requires --out-dir");
        }

        Ok(())
    }

    fn included_extensions(&self) -> Vec<String> {
        self.extensions.clone().unwrap_or_else(|| {
            DEFAULT_EXTENSIONS
                .iter()
                .map(|value| value.to_string())
                .collect()
        })
    }

    fn has_directory_input(&self) -> bool {
        self.files.iter().any(|path| path.is_dir())
    }

    fn collect_compile_file_paths(&self) -> anyhow::Result<Vec<PathBuf>> {
        let ignore_pattern = parse_ignore_pattern(self.ignore.as_deref())?;
        let inputs = collect_input_files(&self.files, ignore_pattern.as_ref())?;

        if self.has_directory_input() {
            let extensions = self.included_extensions();

            Ok(inputs
                .into_iter()
                .filter(|input| is_compilable_extension(&input.path, &extensions))
                .map(|input| input.path)
                .collect())
        } else {
            Ok(inputs.into_iter().map(|input| input.path).collect())
        }
    }

    fn classify_output_entry(&self, input: InputFile) -> Option<OutputEntry> {
        if is_compilable_extension(&input.path, &self.included_extensions()) {
            return Some(OutputEntry {
                path: input.path,
                kind: OutputEntryKind::Compile,
            });
        }

        if self.copy_files {
            return Some(OutputEntry {
                path: input.path,
                kind: OutputEntryKind::Copy,
            });
        }

        if input.origin == InputOrigin::Explicit {
            return Some(OutputEntry {
                path: input.path,
                kind: OutputEntryKind::Compile,
            });
        }

        None
    }

    fn collect_output_dir_entries(&self) -> anyhow::Result<Vec<OutputEntry>> {
        let ignore_pattern = parse_ignore_pattern(self.ignore.as_deref())?;
        let inputs = collect_input_files(&self.files, ignore_pattern.as_ref())?;

        Ok(inputs
            .into_iter()
            .filter_map(|input| self.classify_output_entry(input))
            .collect())
    }

    fn collect_inputs(&self, compiler: Arc<Compiler>) -> anyhow::Result<Vec<InputContext>> {
        if !self.files.is_empty() {
            return self
                .collect_compile_file_paths()?
                .into_iter()
                .map(|file_path| {
                    self.build_transform_options(&Some(file_path.as_path()))
                        .and_then(|options| {
                            let fm = compiler
                                .cm
                                .load_file(&file_path)
                                .context(format!("Failed to open file {}", file_path.display()))?;

                            Ok(InputContext {
                                options,
                                fm,
                                compiler: compiler.clone(),
                                file_path,
                            })
                        })
                })
                .collect();
        }

        let stdin_input = collect_stdin_input();
        if stdin_input.is_some() && !self.files.is_empty() {
            bail!("Cannot specify inputs from stdin and files at the same time");
        }

        if let Some(stdin_input) = stdin_input {
            let options = self.build_transform_options(&self.filename.as_deref())?;

            let fm = compiler.cm.new_source_file(
                if options.filename.is_empty() {
                    FileName::Anon.into()
                } else {
                    FileName::Real(options.filename.clone().into()).into()
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
            }]);
        }

        bail!("Input is empty");
    }

    fn transform_path(
        &self,
        compiler: Arc<Compiler>,
        file_path: &Path,
    ) -> anyhow::Result<TransformOutput> {
        let options = self.build_transform_options(&Some(file_path))?;
        let fm = compiler
            .cm
            .load_file(file_path)
            .context(format!("Failed to open file {}", file_path.display()))?;

        execute_transform(compiler, fm, options)
    }

    fn emit_output_dir_entry(
        &self,
        compiler: Arc<Compiler>,
        out_dir: &Path,
        entry: &OutputEntry,
    ) -> anyhow::Result<()> {
        match entry.kind {
            OutputEntryKind::Compile => {
                let output = self.transform_path(compiler, &entry.path)?;
                let output_file_path = resolve_output_path(
                    out_dir,
                    &self.files,
                    &entry.path,
                    Some(&self.out_file_extension),
                    self.strip_leading_paths,
                )?;

                emit_directory_output(output, &output_file_path)
            }
            OutputEntryKind::Copy => {
                let output_file_path = resolve_output_path(
                    out_dir,
                    &self.files,
                    &entry.path,
                    None,
                    self.strip_leading_paths,
                )?;
                let output_dir = output_file_path
                    .parent()
                    .expect("Parent should be available");

                if !output_dir.as_os_str().is_empty() && !output_dir.is_dir() {
                    fs::create_dir_all(output_dir)?;
                }

                fs::copy(&entry.path, output_file_path)
                    .with_context(|| format!("Failed to copy {}", entry.path.display()))?;

                Ok(())
            }
        }
    }

    fn remove_output_dir_entry(&self, out_dir: &Path, entry: &OutputEntry) -> anyhow::Result<()> {
        let output_file_path = resolve_output_path(
            out_dir,
            &self.files,
            &entry.path,
            match entry.kind {
                OutputEntryKind::Compile => Some(&self.out_file_extension),
                OutputEntryKind::Copy => None,
            },
            self.strip_leading_paths,
        )?;

        remove_file_if_exists(&output_file_path)?;

        if entry.kind == OutputEntryKind::Compile {
            remove_file_if_exists(&resolve_source_map_path(&output_file_path))?;
            remove_file_if_exists(&resolve_declaration_path(&output_file_path))?;
        }

        Ok(())
    }

    fn execute_out_file_once(&self, single_out_file: &Path) -> anyhow::Result<()> {
        let compiler = new_compiler();
        let inputs = self.collect_inputs(compiler)?;

        let result: anyhow::Result<Vec<TransformOutput>> = inputs
            .into_par_iter()
            .map(
                |InputContext {
                     compiler,
                     fm,
                     options,
                     ..
                 }| execute_transform(compiler, fm, options),
            )
            .collect();

        let parent = single_out_file
            .parent()
            .expect("Parent should be available");
        if !parent.as_os_str().is_empty() {
            fs::create_dir_all(parent)?;
        }

        let mut buf = File::create(single_out_file)?;
        let mut buf_srcmap = None;
        let mut buf_dts = None;
        let mut source_map_path = None;

        for output in result?.iter() {
            if let Some(src_map) = output.map.as_ref() {
                if buf_srcmap.is_none() {
                    let map_out_file = if let Some(source_map_target) = &self.source_map_target {
                        source_map_path = Some(source_map_target.clone());
                        PathBuf::from(source_map_target)
                    } else {
                        let map_out_file = resolve_source_map_path(single_out_file);

                        source_map_path = Some(
                            map_out_file
                                .file_name()
                                .unwrap()
                                .to_string_lossy()
                                .to_string(),
                        );
                        map_out_file
                    };

                    buf_srcmap = Some(File::create(map_out_file)?);
                }

                buf_srcmap
                    .as_ref()
                    .expect("Srcmap buffer should be available")
                    .write(src_map.as_bytes())
                    .and(Ok(()))?;
            }

            if let Some(extra) = &output.output {
                let mut extra: serde_json::Map<String, serde_json::Value> =
                    serde_json::from_str(extra).context("failed to parse extra output")?;

                if let Some(dts_code) = extra.remove("__swc_isolated_declarations__") {
                    if buf_dts.is_none() {
                        let dts_file_path = single_out_file.with_extension("d.ts");
                        buf_dts = Some(File::create(dts_file_path)?);
                    }

                    let dts_code = dts_code.as_str().expect("dts code should be string");
                    buf_dts
                        .as_ref()
                        .expect("dts buffer should be available")
                        .write(dts_code.as_bytes())
                        .and(Ok(()))?;
                }
            }

            buf.write(output.code.as_bytes()).and(Ok(()))?;
        }

        if let Some(source_map_path) = source_map_path {
            buf.write_all(b"\n//# sourceMappingURL=")?;
            buf.write_all(source_map_path.as_bytes())?;
        }

        buf.flush()
            .context("Failed to write output into single file")
    }

    fn execute_out_dir_once(&self, out_dir: &Path) -> anyhow::Result<()> {
        let entries = self.collect_output_dir_entries()?;
        let compiler = new_compiler();

        entries
            .into_par_iter()
            .try_for_each(|entry| self.emit_output_dir_entry(compiler.clone(), out_dir, &entry))
    }

    fn execute_stdout_once(&self) -> anyhow::Result<()> {
        let compiler = new_compiler();
        let inputs = self.collect_inputs(compiler)?;

        inputs.into_par_iter().try_for_each(
            |InputContext {
                 compiler,
                 fm,
                 options,
                 file_path,
                 ..
             }| {
                let output = execute_transform(compiler, fm, options)?;
                emit_stdout_output(&file_path, output);
                Ok(())
            },
        )
    }

    fn execute_once(&self) -> anyhow::Result<()> {
        if let Some(single_out_file) = self.out_file.as_ref() {
            self.execute_out_file_once(single_out_file)
        } else if let Some(out_dir) = self.out_dir.as_ref() {
            self.execute_out_dir_once(out_dir)
        } else {
            self.execute_stdout_once()
        }
    }

    fn is_explicit_input_path(&self, file_path: &Path) -> bool {
        let Ok(file_path) = file_path.absolutize().map(|path| path.into_owned()) else {
            return false;
        };

        self.files
            .iter()
            .filter(|path| !path.is_dir())
            .filter_map(|path| path.absolutize().ok().map(|path| path.into_owned()))
            .any(|path| path == file_path)
    }

    fn is_relevant_input_path(&self, file_path: &Path) -> bool {
        let Ok(file_path) = file_path.absolutize().map(|path| path.into_owned()) else {
            return false;
        };

        self.files.iter().any(|input| {
            let Ok(input) = input.absolutize().map(|path| path.into_owned()) else {
                return false;
            };

            if input.is_dir() {
                file_path.starts_with(&input)
            } else {
                file_path == input
            }
        })
    }

    fn classify_watch_output_entry(&self, file_path: &Path) -> Option<OutputEntry> {
        let origin = if self.is_explicit_input_path(file_path) {
            InputOrigin::Explicit
        } else {
            InputOrigin::Discovered
        };

        self.classify_output_entry(InputFile {
            path: file_path.to_path_buf(),
            origin,
        })
    }

    fn process_out_dir_watch_batch(
        &self,
        out_dir: &Path,
        changed_paths: Vec<PathBuf>,
        removed_paths: Vec<PathBuf>,
        ignore_pattern: Option<&Pattern>,
    ) {
        let relevant_removed: BTreeSet<_> = removed_paths
            .into_iter()
            .filter(|path| {
                self.is_relevant_input_path(path)
                    && !is_ignored_path(path, ignore_pattern, &std::env::current_dir().unwrap())
            })
            .collect();

        for path in relevant_removed {
            if let Some(entry) = self.classify_watch_output_entry(&path) {
                if let Err(error) = self.remove_output_dir_entry(out_dir, &entry) {
                    eprintln!("{error:#}");
                }
            }
        }

        let relevant_changed: BTreeSet<_> = changed_paths
            .into_iter()
            .filter(|path| {
                path.is_file()
                    && self.is_relevant_input_path(path)
                    && !is_ignored_path(path, ignore_pattern, &std::env::current_dir().unwrap())
            })
            .collect();

        let compiler = new_compiler();

        for path in relevant_changed {
            if let Some(entry) = self.classify_watch_output_entry(&path) {
                if let Err(error) = self.emit_output_dir_entry(compiler.clone(), out_dir, &entry) {
                    eprintln!("{error:#}");
                }
            }
        }
    }

    fn should_rebuild_out_file(&self, file_path: &Path, ignore_pattern: Option<&Pattern>) -> bool {
        if !self.is_relevant_input_path(file_path) {
            return false;
        }

        let cwd = match std::env::current_dir() {
            Ok(cwd) => cwd,
            Err(_) => return false,
        };

        if is_ignored_path(file_path, ignore_pattern, &cwd) {
            return false;
        }

        if self.has_directory_input() {
            is_compilable_extension(file_path, &self.included_extensions())
        } else {
            true
        }
    }

    fn remove_out_file_outputs(&self, single_out_file: &Path) -> anyhow::Result<()> {
        remove_file_if_exists(single_out_file)?;
        remove_file_if_exists(&resolve_source_map_path(single_out_file))?;
        remove_file_if_exists(&single_out_file.with_extension("d.ts"))?;
        Ok(())
    }

    fn watch_out_dir(&self, out_dir: &Path) -> anyhow::Result<()> {
        let ignore_pattern = parse_ignore_pattern(self.ignore.as_deref())?;
        let watcher = FileWatcher::new(&self.files)?;

        if let Err(error) = self.execute_out_dir_once(out_dir) {
            eprintln!("{error:#}");
        }

        loop {
            let changes = watcher.recv_changes()?;
            self.process_out_dir_watch_batch(
                out_dir,
                changes.changed,
                changes.removed,
                ignore_pattern.as_ref(),
            );
        }
    }

    fn watch_out_file(&self, single_out_file: &Path) -> anyhow::Result<()> {
        let ignore_pattern = parse_ignore_pattern(self.ignore.as_deref())?;
        let watcher = FileWatcher::new(&self.files)?;

        if let Err(error) = self.execute_out_file_once(single_out_file) {
            eprintln!("{error:#}");
        }

        loop {
            let changes = watcher.recv_changes()?;
            let should_rebuild = changes
                .changed
                .iter()
                .chain(changes.removed.iter())
                .any(|path| self.should_rebuild_out_file(path, ignore_pattern.as_ref()));

            if !should_rebuild {
                continue;
            }

            match self.collect_compile_file_paths() {
                Ok(files) if files.is_empty() => {
                    if let Err(error) = self.remove_out_file_outputs(single_out_file) {
                        eprintln!("{error:#}");
                    }
                }
                Ok(_) => {
                    // Rebuild the full bundle so the concatenation order and
                    // source map output stay consistent with one-shot mode.
                    if let Err(error) = self.execute_out_file_once(single_out_file) {
                        eprintln!("{error:#}");
                    }
                }
                Err(error) => eprintln!("{error:#}"),
            }
        }
    }
}

#[swc_trace]
impl super::CommandRunner for CompileOptions {
    fn execute(&self) -> anyhow::Result<()> {
        self.validate()?;

        let guard = if self.experimental_trace {
            init_trace(&self.trace_out_file)
        } else {
            None
        };

        let result = if self.watch {
            if let Some(out_dir) = self.out_dir.as_ref() {
                self.watch_out_dir(out_dir)
            } else if let Some(out_file) = self.out_file.as_ref() {
                self.watch_out_file(out_file)
            } else {
                bail!("--watch requires --out-file or --out-dir");
            }
        } else {
            self.execute_once()
        };

        if let Some(guard) = guard {
            guard.flush();
            drop(guard);
        }

        result
    }
}
