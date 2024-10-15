use std::{
    env, fs,
    path::{Path, PathBuf},
    process::Command,
    sync::Arc,
};

use anyhow::{Context, Error};
use once_cell::sync::Lazy;
use swc::{
    config::{
        Config, JsMinifyOptions, JscConfig, ModuleConfig, Options, SourceMapsConfig,
        TransformConfig,
    },
    try_with_handler, BoolOrDataConfig, Compiler, HandlerOpts,
};
use swc_common::{errors::ColorConfig, SourceMap, GLOBALS};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{Syntax, TsSyntax};
use swc_ecma_testing::{exec_node_js, JsExecOptions};
use testing::{assert_eq, find_executable, unignore_fixture};
use tracing::{span, Level};

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

        let yarn = find_executable("yarn").expect("failed to find yarn");
        {
            let mut cmd = if cfg!(target_os = "windows") {
                let mut c = Command::new("cmd");
                c.arg("/C").arg(&yarn);
                c
            } else {
                Command::new(&yarn)
            };
            cmd.current_dir(&helper_dir);
            let status = cmd.status().expect("failed to update swc core");
            assert!(status.success());
        }

        {
            let mut cmd = if cfg!(target_os = "windows") {
                let mut c = Command::new("cmd");
                c.arg("/C").arg(&yarn);
                c
            } else {
                Command::new(&yarn)
            };
            cmd.current_dir(&helper_dir).arg("build");
            let status = cmd.status().expect("failed to compile helper package");
            assert!(status.success());
        }

        Arc::new(helper_dir)
    });

    BUILD_HELPERS.clone()
}

fn create_matrix(entry: &Path) -> Vec<Options> {
    let use_define_for_class_fields = entry
        .parent()
        .map(|parent| parent.join(".swcrc"))
        .and_then(|path| fs::read_to_string(path).ok())
        .and_then(|content| {
            jsonc_parser::parse_to_serde_value(
                &content,
                &jsonc_parser::ParseOptions {
                    allow_comments: true,
                    allow_trailing_commas: true,
                    allow_loose_object_property_names: false,
                },
            )
            .ok()?
        })
        .and_then(|content| serde_json::from_value::<Config>(content).ok())
        .and_then(|config| config.jsc.transform.into_inner())
        .map(|c| c.use_define_for_class_fields)
        .unwrap_or_default();

    [
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
    ]
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
            // Actual
            Options {
                config: Config {
                    jsc: JscConfig {
                        syntax: Some(syntax),
                        transform: Some(TransformConfig {
                            use_define_for_class_fields,
                            ..Default::default()
                        })
                        .into(),
                        // true, false
                        external_helpers: (!external_helpers).into(),
                        target: Some(target),
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
                source_maps: if source_map {
                    Some(SourceMapsConfig::Str("inline".into()))
                } else {
                    None
                },
                ..Default::default()
            }
        },
    )
    .collect::<Vec<_>>()
}

#[testing::fixture("tests/exec/**/exec.js")]
#[testing::fixture("tests/exec/**/exec.mjs")]
#[testing::fixture("tests/exec/**/exec.ts")]
fn run_fixture_test(entry: PathBuf) {
    let _ = init_helpers();

    let _guard = testing::init();

    let matrix = create_matrix(&entry);
    let expected_stdout = get_expected_stdout(&entry).expect("failed to get stdout");

    eprintln!(
        "----- {} -----\n{}\n-----",
        ansi_term::Color::Green.bold().paint("Expected stdout"),
        expected_stdout
    );

    let _ = matrix
        .into_iter()
        .enumerate()
        .map(|(idx, opts)| test_file_with_opts(&entry, &opts, &expected_stdout, idx).unwrap())
        .collect::<Vec<_>>();

    // Test was successful.

    unignore_fixture(&entry);
}

#[testing::fixture("tests/babel-exec/**/exec.js")]
fn run_babel_fixture_exec_test(entry: PathBuf) {
    let _ = init_helpers();

    let _guard = testing::init();

    let matrix = create_matrix(&entry);
    let expected_stdout = get_expected_stdout(&entry).unwrap_or_else(|_| {
        fs::remove_file(&entry).unwrap();
        panic!("Removed")
    });

    eprintln!(
        "----- {} -----\n{}\n-----",
        ansi_term::Color::Green.bold().paint("Expected stdout"),
        expected_stdout
    );

    let _ = matrix
        .into_iter()
        .enumerate()
        .map(|(idx, opts)| test_file_with_opts(&entry, &opts, &expected_stdout, idx).unwrap())
        .collect::<Vec<_>>();

    // Test was successful.

    unignore_fixture(&entry);
}

fn get_expected_stdout(input: &Path) -> Result<String, Error> {
    let cm = Arc::new(SourceMap::default());
    let c = Compiler::new(cm.clone());

    GLOBALS.set(&Default::default(), || {
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

                let res = c
                    .process_js_file(
                        fm,
                        handler,
                        &Options {
                            config: Config {
                                jsc: JscConfig {
                                    target: Some(EsVersion::Es2022),
                                    syntax: Some(Syntax::Typescript(TsSyntax {
                                        decorators: true,
                                        ..Default::default()
                                    })),
                                    transform: Some(TransformConfig {
                                        use_define_for_class_fields: (!input
                                            .to_string_lossy()
                                            .contains("set_public_class_fields"))
                                        .into(),
                                        ..Default::default()
                                    })
                                    .into(),
                                    ..Default::default()
                                },
                                module: match input.extension() {
                                    Some(ext) if ext == "ts" => {
                                        Some(ModuleConfig::CommonJs(Default::default()))
                                    }
                                    Some(ext) if ext == "mjs" => None,
                                    _ => None,
                                },
                                ..Default::default()
                            },
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

                println!("target: {:?}", opts.config.jsc.target.unwrap());
                println!("minify: {:?}", opts.config.jsc.minify.is_some());
                println!("external_helpers: {:?}", opts.config.jsc.external_helpers);
                println!("source_map: {:?}", opts.source_maps.is_some());

                let actual_stdout = stdout_of(
                    &res.code,
                    if entry.extension().unwrap() == "mjs" {
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
        .with_context(|| format!("failed to compile with opts: {:#?}", opts))
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
                    {}
                    ",
                    code
                )
            }
            NodeModuleType::Module => {
                format!(
                    "
                    import expect from 'expect';
                    {}
                    ",
                    code
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
