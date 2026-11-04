use std::{
    env, fs,
    path::{Path, PathBuf},
    process::Command,
    sync::Arc,
};

use anyhow::{Context, Error};
use once_cell::sync::Lazy;
use serde::Deserialize;
use swc::{
    config::{
        Config, JsMinifyOptions, JscConfig, ModuleConfig, Options, SourceMapsConfig,
        TransformConfig,
    },
    try_with_handler, BoolOrDataConfig, Compiler, HandlerOpts,
};
use swc_common::{errors::ColorConfig, FileName, SourceMap, GLOBALS};
use swc_config::merge::Merge;
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{Syntax, TsSyntax};
use swc_ecma_testing::{exec_node_js, JsExecOptions};
use testing::{assert_eq, find_executable, unignore_fixture};
use tracing::{span, Level};

/// Execution policy shared by compiler, Babel, and native async fixtures.
/// Compiler options are loaded normally from the input's complete `.swcrc`.
#[derive(Default, Deserialize)]
#[serde(default, deny_unknown_fields)]
struct ExecConfig {
    /// Restrict the target matrix without changing its other dimensions.
    targets: Option<Vec<EsVersion>>,
    /// Overrides for compiling the reference when Node cannot run the input.
    reference: Config,
}

impl ExecConfig {
    fn load(entry: &Path) -> Self {
        let path = entry
            .parent()
            .unwrap()
            .ancestors()
            .map(|dir| dir.join("exec.json"))
            .find(|path| path.is_file());

        let Some(path) = path else {
            return Self::default();
        };

        let file = fs::File::open(&path)
            .unwrap_or_else(|err| panic!("failed to open {}: {err}", path.display()));
        serde_json::from_reader(file)
            .unwrap_or_else(|err| panic!("failed to parse {}: {err}", path.display()))
    }
}

/// The matrix tests explicit targets and the fixture's environment
/// independently.
#[derive(Clone, Copy)]
enum MatrixTarget {
    Version(EsVersion),
    Env,
}

/// Load the complete fixture configuration once, including normal path
/// resolution.
fn load_swcrc(entry: &Path) -> Option<Config> {
    if !entry
        .parent()
        .unwrap()
        .ancestors()
        .any(|dir| dir.join(".swcrc").is_file())
    {
        return None;
    }

    let compiler = Compiler::new(Default::default());
    let config = GLOBALS
        .set(&Default::default(), || {
            compiler.read_config(
                &Options {
                    swcrc: true,
                    ..Default::default()
                },
                &FileName::Real(entry.to_path_buf()),
            )
        })
        .unwrap_or_else(|err| panic!("failed to read .swcrc for {}: {err:?}", entry.display()));

    Some(config.unwrap_or_else(|| {
        panic!(
            "execution fixture is excluded by .swcrc: {}",
            entry.display()
        )
    }))
}

trait IterExt<T>: Sized + IntoIterator<Item = T>
where
    T: Clone,
{
    fn matrix<F, I, N>(self, mut gen: F) -> Vec<(T, N)>
    where
        F: FnMut() -> I,
        I: IntoIterator<Item = N>,
    {
        self.into_iter()
            .flat_map(|l| gen().into_iter().map(move |r| (l.clone(), r)))
            .collect()
    }

    fn matrix_bool(self) -> Vec<(T, bool)> {
        self.matrix(|| [false, true])
    }
}

impl<I, T> IterExt<T> for I
where
    I: IntoIterator<Item = T>,
    T: Clone,
{
}

fn init_helpers() -> Arc<PathBuf> {
    static BUILD_HELPERS: Lazy<Arc<PathBuf>> = Lazy::new(|| {
        let project_root = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap())
            .parent()
            .unwrap()
            .parent()
            .unwrap()
            .to_path_buf();

        let helper_dir = project_root.join("packages").join("helpers");

        if env::var("SKIP_HELPERS").unwrap_or_default() == "1" {
            return Arc::new(helper_dir);
        }

        let pnpm = find_executable("pnpm").expect("failed to find pnpm");
        {
            let mut cmd = if cfg!(target_os = "windows") {
                let mut c = Command::new("cmd");
                c.arg("/C").arg(&pnpm);
                c
            } else {
                Command::new(&pnpm)
            };
            // Installing from `packages/helpers` can still run workspace
            // lifecycle scripts. In a clean checkout `@swc/core` has not been
            // built yet, so its postinstall validation would fail while trying
            // to resolve generated files such as `index.js`.
            //
            // Use the lockfile as it is, like CI does. A plain `pnpm install`
            // can resolve the workspace again and rewrite `pnpm-lock.yaml`.
            cmd.current_dir(&helper_dir)
                .env("SWC_SKIP_VALIDATION", "1")
                .arg("install")
                .arg("--frozen-lockfile");
            let status = cmd.status().expect("failed to install helper dependencies");
            assert!(status.success());
        }

        {
            let mut cmd = if cfg!(target_os = "windows") {
                let mut c = Command::new("cmd");
                c.arg("/C").arg(&pnpm);
                c
            } else {
                Command::new(&pnpm)
            };
            cmd.current_dir(&helper_dir).arg("build");
            let status = cmd.status().expect("failed to compile helper package");
            assert!(status.success());
        }

        Arc::new(helper_dir)
    });

    BUILD_HELPERS.clone()
}

/// Overlays the matrix dimensions on the complete input configuration.
fn create_matrix(entry: &Path, config: &ExecConfig, swcrc: Option<&Config>) -> Vec<Options> {
    let default_targets = [
        EsVersion::EsNext,
        EsVersion::Es2022,
        EsVersion::Es2021,
        EsVersion::Es2020,
        EsVersion::Es2019,
        EsVersion::Es2018,
        EsVersion::Es2017,
        EsVersion::Es2016,
        EsVersion::Es2015,
        EsVersion::Es5,
    ];
    let targets = config.targets.as_deref().unwrap_or(&default_targets);
    assert!(
        !targets.is_empty(),
        "execution target matrix must not be empty"
    );

    let mut targets = targets
        .iter()
        .copied()
        .map(MatrixTarget::Version)
        .collect::<Vec<_>>();
    if swcrc.is_some_and(|config| config.env.is_some()) {
        targets.push(MatrixTarget::Env);
    }

    targets
        .into_iter()
        .matrix(|| {
            let default_es = Syntax::Es(Default::default());

            if let Some(ext) = entry.extension() {
                if ext == "ts" {
                    let ts = Syntax::Typescript(TsSyntax {
                        decorators: true,
                        ..Default::default()
                    });
                    return vec![ts];
                }
            }

            vec![default_es]
        })
        .matrix_bool()
        .matrix_bool()
        .matrix_bool()
        .into_iter()
        .map(
            |((((target, syntax), minify), external_helpers), source_map)| {
                let mut options = Options {
                    config: Config {
                        jsc: JscConfig {
                            syntax: Some(syntax),
                            external_helpers: (!external_helpers).into(),
                            minify: if minify {
                                Some(JsMinifyOptions {
                                    compress: BoolOrDataConfig::from_bool(true),
                                    mangle: BoolOrDataConfig::from_bool(true),
                                    ..Default::default()
                                })
                            } else {
                                None
                            },
                            ..Default::default()
                        },
                        module: if entry.extension().unwrap() == "mjs" {
                            Some(ModuleConfig::Es6(Default::default()))
                        } else {
                            Some(ModuleConfig::CommonJs(Default::default()))
                        },
                        minify: minify.into(),
                        ..Default::default()
                    },
                    source_maps: Some(if source_map {
                        SourceMapsConfig::Str("inline".into())
                    } else {
                        SourceMapsConfig::Bool(false)
                    }),
                    ..Default::default()
                };
                options.config.merge(swcrc.cloned().unwrap_or_default());

                // `env` and `jsc.target` are mutually exclusive. Keep the file
                // intact and exercise both lowering strategies in separate rows.
                match target {
                    MatrixTarget::Version(version) => {
                        options.config.env = None;
                        options.config.jsc.target = Some(version);
                    }
                    MatrixTarget::Env => options.config.jsc.target = None,
                }
                if !minify {
                    options.config.jsc.minify = None;
                }

                // The complete configuration was already loaded and merged.
                // Reloading it would undo the mutually exclusive target choice.
                options
            },
        )
        .collect::<Vec<_>>()
}

/// Executes compiler, Babel, TypeScript semantic, and native async fixtures,
/// comparing every configuration with the reference stdout.
#[testing::fixture("tests/exec/**/exec.js")]
#[testing::fixture("tests/exec/**/exec.mjs")]
#[testing::fixture("tests/exec/**/exec.ts")]
#[testing::fixture("tests/babel-exec/**/exec.js")]
#[testing::fixture("../swc_ecma_preset_env/tests/fixtures/transform/native-async/**/exec.js")]
fn fixture(entry: PathBuf) {
    let _ = init_helpers();

    let _guard = testing::init();

    let config = ExecConfig::load(&entry);
    let swcrc = load_swcrc(&entry);
    let matrix = create_matrix(&entry, &config, swcrc.as_ref());
    let expected_stdout = get_expected_stdout(&entry, config.reference)
        .unwrap_or_else(|err| panic!("failed to get stdout for {}: {err:?}", entry.display()));

    eprintln!(
        "----- {} -----\n{}\n-----",
        ansi_term::Color::Green.bold().paint("Expected stdout"),
        expected_stdout
    );

    let configured_idx = matrix.len();
    for (idx, opts) in matrix.into_iter().enumerate() {
        test_file_with_opts(&entry, &opts, &expected_stdout, idx).unwrap();
    }

    if let Some(mut config) = swcrc {
        // Also exercise settings overridden by the matrix, such as the file's
        // detailed minifier options, module format, target, and helper mode.
        // An environment specifies its own lowering targets.
        if config.env.is_some() {
            config.jsc.target = None;
        }
        config.module.get_or_insert_with(|| {
            if entry.extension().unwrap() == "mjs" {
                ModuleConfig::Es6(Default::default())
            } else {
                ModuleConfig::CommonJs(Default::default())
            }
        });
        test_file_with_opts(
            &entry,
            &Options {
                config,
                ..Default::default()
            },
            &expected_stdout,
            configured_idx,
        )
        .unwrap();
    }

    unignore_fixture(&entry);
}

fn get_expected_stdout(input: &Path, mut reference: Config) -> Result<String, Error> {
    let cm = Arc::new(SourceMap::default());
    let c = Compiler::new(cm.clone());

    GLOBALS
        .set(&Default::default(), || {
            try_with_handler(
                cm.clone(),
                HandlerOpts {
                    color: ColorConfig::Always,
                    skip_filename: true,
                },
                |handler| {
                    let fm = cm.load_file(input).context("failed to load file")?;

                    if let Ok(output) = stdout_of(&fm.src, NodeModuleType::Module) {
                        return Ok(output);
                    }
                    if let Ok(output) = stdout_of(&fm.src, NodeModuleType::CommonJs) {
                        return Ok(output);
                    }

                    reference.merge(Config {
                        jsc: JscConfig {
                            target: Some(EsVersion::Es2022),
                            syntax: Some(Syntax::Typescript(TsSyntax {
                                decorators: true,
                                ..Default::default()
                            })),
                            transform: Some(TransformConfig {
                                use_define_for_class_fields: true.into(),
                                ..Default::default()
                            })
                            .into(),
                            ..Default::default()
                        },
                        module: match input.extension() {
                            Some(ext) if ext == "ts" => {
                                Some(ModuleConfig::CommonJs(Default::default()))
                            }
                            _ => None,
                        },
                        ..Default::default()
                    });
                    // Keep the reference independent of the configuration under
                    // test, just as the original runner did with swcrc disabled.

                    let res = c
                        .process_js_file(
                            fm,
                            handler,
                            &Options {
                                config: reference,
                                ..Default::default()
                            },
                        )
                        .context("failed to process file")?;

                    let res = stdout_of(
                        &res.code,
                        match input.extension() {
                            Some(ext) if ext == "mjs" => NodeModuleType::Module,
                            _ => NodeModuleType::CommonJs,
                        },
                    )?;

                    Ok(res)
                },
            )
        })
        .map_err(|e| e.to_pretty_error())
}

fn test_file_with_opts(
    entry: &Path,
    opts: &Options,
    expected_stdout: &str,
    idx: usize,
) -> Result<(), Error> {
    let _guard = span!(Level::ERROR, "test_file", idx = idx).entered();

    let cm = Arc::new(SourceMap::default());
    let c = Compiler::new(cm.clone());

    GLOBALS.set(&Default::default(), || {
        try_with_handler(
            cm.clone(),
            HandlerOpts {
                color: ColorConfig::Always,
                ..Default::default()
            },
            |handler| {
                let fm = cm.load_file(entry).context("failed to load file")?;

                let res = c
                    .process_js_file(fm, handler, opts)
                    .context("failed to process file")?;

                println!(
                    "---- {} (#{}) ----\n{}",
                    ansi_term::Color::Green.bold().paint("Code"),
                    idx,
                    res.code
                );

                println!("target: {:?}", opts.config.jsc.target);
                println!(
                    "env: {:?}",
                    opts.config.env.as_ref().map(|env| &env.targets)
                );
                println!("minify: {:?}", opts.config.jsc.minify.is_some());
                println!("external_helpers: {:?}", opts.config.jsc.external_helpers);
                println!(
                    "source_map: {:?}",
                    opts.source_maps
                        .as_ref()
                        .or(opts.config.source_maps.as_ref())
                        .is_some_and(|maps| maps.enabled())
                );

                let actual_stdout = stdout_of(
                    &res.code,
                    if matches!(
                        opts.config.module,
                        Some(ModuleConfig::Es6(_) | ModuleConfig::NodeNext(_))
                    ) {
                        NodeModuleType::Module
                    } else {
                        NodeModuleType::CommonJs
                    },
                )?;

                assert_eq!(
                    expected_stdout,
                    actual_stdout,
                    "\n---- {} -----\n{}\n---- {} -----\n{:#?}",
                    ansi_term::Color::Red.paint("Actual"),
                    actual_stdout,
                    ansi_term::Color::Blue.paint("Options"),
                    opts
                );

                Ok(())
            },
        )
        .map_err(|e| e.to_pretty_error())
        .with_context(|| format!("failed to compile with opts: {opts:#?}"))
    })
}

enum NodeModuleType {
    CommonJs,
    Module,
}

fn stdout_of(code: &str, module_type: NodeModuleType) -> Result<String, Error> {
    let s = exec_node_js(
        &match module_type {
            NodeModuleType::CommonJs => {
                format!(
                    "
                    const expect = require('expect');
                    {code}
                    "
                )
            }
            NodeModuleType::Module => {
                format!(
                    "
                    import expect from 'expect';
                    {code}
                    "
                )
            }
        },
        JsExecOptions {
            cache: true,
            module: matches!(module_type, NodeModuleType::Module),
            ..Default::default()
        },
    )?;

    Ok(s)
}
