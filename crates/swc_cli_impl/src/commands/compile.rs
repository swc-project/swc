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

    /// Deprecated no-op. Trace profiling is disabled in production builds.
    #[clap(group = "experimental_trace", long)]
    experimental_trace: bool,

    /// Deprecated no-op. No trace output file will be generated.
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

/// Input path roles captured when watch mode starts.
///
/// Removal events are delivered after filesystem state changes, so directory
/// inputs must not be classified with `Path::is_dir()` while processing each
/// event.
struct WatchInputPaths {
    files: BTreeSet<PathBuf>,
    directories: Vec<PathBuf>,
}

impl WatchInputPaths {
    fn new(raw_inputs: &[PathBuf]) -> anyhow::Result<Self> {
        let mut files = BTreeSet::new();
        let mut directories = Vec::new();

        for input in raw_inputs {
            let input = absolutize_path(input)?;

            if input.is_dir() {
                directories.push(input);
            } else {
                files.insert(input);
            }
        }

        Ok(Self { files, directories })
    }

    fn contains(&self, file_path: &Path) -> bool {
        let Ok(file_path) = absolutize_path(file_path) else {
            return false;
        };

        self.files.contains(&file_path)
            || self
                .directories
                .iter()
                .any(|input_dir| file_path.starts_with(input_dir))
    }

    fn is_explicit_file(&self, file_path: &Path) -> bool {
        is_exact_path(file_path, &self.files)
    }
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

fn absolutize_path(path: &Path) -> anyhow::Result<PathBuf> {
    Ok(path.absolutize()?.into_owned())
}

fn is_same_or_nested_path(path: &Path, base_path: &Path) -> bool {
    let Ok(path) = absolutize_path(path) else {
        return false;
    };

    path.starts_with(base_path)
}

fn is_exact_path(path: &Path, expected_paths: &BTreeSet<PathBuf>) -> bool {
    let Ok(path) = absolutize_path(path) else {
        return false;
    };

    expected_paths.contains(&path)
}

fn collect_absolute_paths(paths: &[PathBuf]) -> BTreeSet<PathBuf> {
    paths
        .iter()
        .filter_map(|path| absolutize_path(path).ok())
        .collect()
}

/// Infer list of files from cli arguments.
#[cfg_attr(debug_assertions, tracing::instrument(level = "info", skip_all))]
fn collect_input_files(
    raw_files_input: &[PathBuf],
    ignore_pattern: Option<&Pattern>,
    excluded_dir: Option<&Path>,
) -> anyhow::Result<Vec<InputFile>> {
    let input_dir = raw_files_input.iter().find(|path| path.is_dir());
    let cwd = std::env::current_dir()?;
    let excluded_dir = excluded_dir.map(absolutize_path).transpose()?;

    let files = if let Some(input_dir) = input_dir {
        if raw_files_input.len() > 1 {
            bail!("Cannot specify multiple files when using a directory as input");
        }

        WalkDir::new(input_dir)
            .into_iter()
            .filter_entry(|entry| {
                // Avoid descending into generated output when --out-dir is
                // nested inside the watched or compiled input tree.
                !excluded_dir
                    .as_deref()
                    .map(|excluded_dir| is_same_or_nested_path(entry.path(), excluded_dir))
                    .unwrap_or(false)
            })
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
            .filter(|path| {
                !excluded_dir
                    .as_deref()
                    .map(|excluded_dir| is_same_or_nested_path(path, excluded_dir))
                    .unwrap_or(false)
            })
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

fn remove_dir_if_exists(path: &Path) -> anyhow::Result<()> {
    if path.is_dir() {
        fs::remove_dir_all(path)?;
    }

    Ok(())
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

    fn collect_compile_file_paths_inner(
        &self,
        existing_only: bool,
        excluded_files: &[PathBuf],
    ) -> anyhow::Result<Vec<PathBuf>> {
        let ignore_pattern = parse_ignore_pattern(self.ignore.as_deref())?;
        let inputs = collect_input_files(&self.files, ignore_pattern.as_ref(), None)?;
        let excluded_files = collect_absolute_paths(excluded_files);

        let is_input_path_enabled = |path: &Path| {
            (!existing_only || path.is_file()) && !is_exact_path(path, &excluded_files)
        };

        if self.has_directory_input() {
            let extensions = self.included_extensions();

            Ok(inputs
                .into_iter()
                .filter(|input| is_input_path_enabled(&input.path))
                .filter(|input| is_compilable_extension(&input.path, &extensions))
                .map(|input| input.path)
                .collect())
        } else {
            Ok(inputs
                .into_iter()
                .filter(|input| is_input_path_enabled(&input.path))
                .map(|input| input.path)
                .collect())
        }
    }

    fn collect_compile_file_paths(&self) -> anyhow::Result<Vec<PathBuf>> {
        self.collect_compile_file_paths_inner(false, &[])
    }

    fn collect_existing_compile_file_paths(
        &self,
        excluded_files: &[PathBuf],
    ) -> anyhow::Result<Vec<PathBuf>> {
        self.collect_compile_file_paths_inner(true, excluded_files)
    }

    fn classify_output_entry(
        &self,
        input: InputFile,
        extensions: &[String],
    ) -> Option<OutputEntry> {
        if is_compilable_extension(&input.path, extensions) {
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

    fn collect_output_dir_entries(&self, out_dir: &Path) -> anyhow::Result<Vec<OutputEntry>> {
        let ignore_pattern = parse_ignore_pattern(self.ignore.as_deref())?;
        let inputs = collect_input_files(&self.files, ignore_pattern.as_ref(), Some(out_dir))?;
        let extensions = self.included_extensions();

        Ok(inputs
            .into_iter()
            .filter_map(|input| self.classify_output_entry(input, &extensions))
            .collect())
    }

    fn collect_file_inputs(
        &self,
        compiler: Arc<Compiler>,
        file_paths: Vec<PathBuf>,
    ) -> anyhow::Result<Vec<InputContext>> {
        file_paths
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
            .collect()
    }

    fn collect_inputs(&self, compiler: Arc<Compiler>) -> anyhow::Result<Vec<InputContext>> {
        if !self.files.is_empty() {
            return self.collect_file_inputs(compiler, self.collect_compile_file_paths()?);
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

    fn remove_output_dir_tree(&self, out_dir: &Path, input_dir: &Path) -> anyhow::Result<()> {
        let output_dir_path = resolve_output_path(
            out_dir,
            &self.files,
            input_dir,
            None,
            self.strip_leading_paths,
        )?;

        remove_dir_if_exists(&output_dir_path)
    }

    fn execute_out_file_with_inputs(
        &self,
        single_out_file: &Path,
        inputs: Vec<InputContext>,
    ) -> anyhow::Result<()> {
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

    fn execute_out_file_once(&self, single_out_file: &Path) -> anyhow::Result<()> {
        let compiler = new_compiler();
        let inputs = self.collect_inputs(compiler)?;

        self.execute_out_file_with_inputs(single_out_file, inputs)
    }

    fn execute_existing_out_file_paths(
        &self,
        single_out_file: &Path,
        file_paths: Vec<PathBuf>,
    ) -> anyhow::Result<()> {
        if file_paths.is_empty() {
            return self.remove_out_file_outputs(single_out_file);
        }

        let compiler = new_compiler();
        let inputs = self.collect_file_inputs(compiler, file_paths)?;

        self.execute_out_file_with_inputs(single_out_file, inputs)
    }

    fn execute_existing_out_file_once(&self, single_out_file: &Path) -> anyhow::Result<()> {
        let output_files = self.out_file_output_paths(single_out_file);
        // Watch mode rebuilds from files that still exist, so deleting one
        // explicit input removes it from the next bundle instead of failing the
        // whole rebuild.
        let file_paths = self.collect_existing_compile_file_paths(&output_files)?;

        self.execute_existing_out_file_paths(single_out_file, file_paths)
    }

    fn execute_out_dir_once(&self, out_dir: &Path) -> anyhow::Result<()> {
        let entries = self.collect_output_dir_entries(out_dir)?;
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

    fn classify_watch_output_entry(
        &self,
        file_path: &Path,
        extensions: &[String],
        watch_inputs: &WatchInputPaths,
    ) -> Option<OutputEntry> {
        let origin = if watch_inputs.is_explicit_file(file_path) {
            InputOrigin::Explicit
        } else {
            InputOrigin::Discovered
        };

        self.classify_output_entry(
            InputFile {
                path: file_path.to_path_buf(),
                origin,
            },
            extensions,
        )
    }

    fn process_out_dir_watch_batch(
        &self,
        out_dir: &Path,
        changed_paths: Vec<PathBuf>,
        removed_paths: Vec<PathBuf>,
        removed_directories: Vec<PathBuf>,
        ignore_pattern: Option<&Pattern>,
        watch_inputs: &WatchInputPaths,
    ) {
        let cwd = match std::env::current_dir() {
            Ok(cwd) => cwd,
            Err(error) => {
                #[cfg(debug_assertions)]
                tracing::warn!(error = %error, "failed to read current directory for watch batch");
                return;
            }
        };
        let output_dir = match absolutize_path(out_dir) {
            Ok(output_dir) => output_dir,
            Err(error) => {
                #[cfg(debug_assertions)]
                tracing::warn!(error = %error, "failed to resolve output directory for watch batch");
                return;
            }
        };
        let extensions = self.included_extensions();

        let relevant_removed: BTreeSet<_> = removed_paths
            .into_iter()
            .filter(|path| {
                watch_inputs.contains(path)
                    && !is_same_or_nested_path(path, &output_dir)
                    && !is_ignored_path(path, ignore_pattern, &cwd)
            })
            .collect();

        for path in relevant_removed {
            if let Some(entry) = self.classify_watch_output_entry(&path, &extensions, watch_inputs)
            {
                if let Err(error) = self.remove_output_dir_entry(out_dir, &entry) {
                    eprintln!("{error:#}");
                }
            }
        }

        let relevant_removed_directories: BTreeSet<_> = removed_directories
            .into_iter()
            .filter(|path| {
                watch_inputs.contains(path)
                    && !is_same_or_nested_path(path, &output_dir)
                    && !is_ignored_path(path, ignore_pattern, &cwd)
            })
            .collect();

        for path in relevant_removed_directories {
            if let Err(error) = self.remove_output_dir_tree(out_dir, &path) {
                eprintln!("{error:#}");
            }
        }

        let relevant_changed: BTreeSet<_> = changed_paths
            .into_iter()
            .filter(|path| {
                path.is_file()
                    && watch_inputs.contains(path)
                    && !is_same_or_nested_path(path, &output_dir)
                    && !is_ignored_path(path, ignore_pattern, &cwd)
            })
            .collect();

        let compiler = new_compiler();

        for path in relevant_changed {
            if let Some(entry) = self.classify_watch_output_entry(&path, &extensions, watch_inputs)
            {
                if let Err(error) = self.emit_output_dir_entry(compiler.clone(), out_dir, &entry) {
                    eprintln!("{error:#}");
                }
            }
        }
    }

    fn should_rebuild_out_file(
        &self,
        file_path: &Path,
        ignore_pattern: Option<&Pattern>,
        cwd: &Path,
        extensions: &[String],
        output_files: &BTreeSet<PathBuf>,
        watch_inputs: &WatchInputPaths,
    ) -> bool {
        if is_exact_path(file_path, output_files) {
            return false;
        }

        if !watch_inputs.contains(file_path) {
            return false;
        }

        if is_ignored_path(file_path, ignore_pattern, cwd) {
            return false;
        }

        if self.has_directory_input() {
            is_compilable_extension(file_path, extensions)
        } else {
            true
        }
    }

    fn should_rebuild_removed_input_dir_out_file(
        &self,
        file_path: &Path,
        ignore_pattern: Option<&Pattern>,
        cwd: &Path,
        output_files: &BTreeSet<PathBuf>,
        watch_inputs: &WatchInputPaths,
    ) -> bool {
        !is_exact_path(file_path, output_files)
            && watch_inputs.contains(file_path)
            && !is_ignored_path(file_path, ignore_pattern, cwd)
    }

    fn out_file_output_paths(&self, single_out_file: &Path) -> Vec<PathBuf> {
        let mut paths = vec![
            single_out_file.to_path_buf(),
            single_out_file.with_extension("d.ts"),
        ];

        if let Some(source_map_target) = &self.source_map_target {
            paths.push(PathBuf::from(source_map_target));
        } else {
            paths.push(resolve_source_map_path(single_out_file));
        }

        paths
    }

    fn remove_out_file_outputs(&self, single_out_file: &Path) -> anyhow::Result<()> {
        remove_file_if_exists(single_out_file)?;
        remove_file_if_exists(&resolve_source_map_path(single_out_file))?;
        if let Some(source_map_target) = &self.source_map_target {
            remove_file_if_exists(Path::new(source_map_target))?;
        }
        remove_file_if_exists(&single_out_file.with_extension("d.ts"))?;
        Ok(())
    }

    fn watch_out_dir(&self, out_dir: &Path) -> anyhow::Result<()> {
        let ignore_pattern = parse_ignore_pattern(self.ignore.as_deref())?;
        let watcher = FileWatcher::new(&self.files)?;
        let watch_inputs = WatchInputPaths::new(&self.files)?;

        if let Err(error) = self.execute_out_dir_once(out_dir) {
            eprintln!("{error:#}");
        }

        loop {
            let changes = watcher.recv_changes()?;
            self.process_out_dir_watch_batch(
                out_dir,
                changes.changed,
                changes.removed,
                changes.removed_directories,
                ignore_pattern.as_ref(),
                &watch_inputs,
            );
        }
    }

    fn watch_out_file(&self, single_out_file: &Path) -> anyhow::Result<()> {
        let ignore_pattern = parse_ignore_pattern(self.ignore.as_deref())?;
        let watcher = FileWatcher::new(&self.files)?;
        let watch_inputs = WatchInputPaths::new(&self.files)?;

        if let Err(error) = self.execute_existing_out_file_once(single_out_file) {
            eprintln!("{error:#}");
        }

        let output_files = self.out_file_output_paths(single_out_file);
        let output_files = collect_absolute_paths(&output_files);
        let extensions = self.included_extensions();

        loop {
            let changes = watcher.recv_changes()?;
            let cwd = match std::env::current_dir() {
                Ok(cwd) => cwd,
                Err(error) => {
                    #[cfg(debug_assertions)]
                    tracing::warn!(error = %error, "failed to read current directory for watch batch");
                    continue;
                }
            };
            let should_rebuild = changes
                .changed
                .iter()
                .chain(changes.removed.iter())
                .any(|path| {
                    self.should_rebuild_out_file(
                        path,
                        ignore_pattern.as_ref(),
                        &cwd,
                        &extensions,
                        &output_files,
                        &watch_inputs,
                    )
                })
                || changes.removed_directories.iter().any(|path| {
                    self.should_rebuild_removed_input_dir_out_file(
                        path,
                        ignore_pattern.as_ref(),
                        &cwd,
                        &output_files,
                        &watch_inputs,
                    )
                });

            if !should_rebuild {
                continue;
            }

            match self
                .collect_existing_compile_file_paths(&self.out_file_output_paths(single_out_file))
            {
                Ok(files) => {
                    // Rebuild the full bundle so the concatenation order and
                    // source map output stay consistent with one-shot mode.
                    if let Err(error) = self.execute_existing_out_file_paths(single_out_file, files)
                    {
                        eprintln!("{error:#}");
                    }
                }
                Err(error) => eprintln!("{error:#}"),
            }
        }
    }
}

impl super::CommandRunner for CompileOptions {
    fn execute(&self) -> anyhow::Result<()> {
        self.validate()?;

        if self.experimental_trace {
            init_trace(&self.trace_out_file);
        }

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

        result
    }
}
