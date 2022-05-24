use std::{
    fs::{create_dir_all, rename},
    path::{Component, Path, PathBuf},
    process::Command,
    sync::Arc,
};

use anyhow::{bail, Context, Error};
use swc::{
    config::{Config, JsMinifyOptions, JscConfig, ModuleConfig, Options, SourceMapsConfig},
    try_with_handler, BoolOrDataConfig, Compiler, HandlerOpts,
};
use swc_common::{errors::ColorConfig, SourceMap};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{EsConfig, Syntax, TsConfig};
use testing::assert_eq;
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
        self.matrix(|| [true, false])
    }
}

impl<I, T> IterExt<T> for I
where
    I: IntoIterator<Item = T>,
    T: Clone,
{
}

fn create_matrix(entry: &Path) -> Vec<Options> {
    [
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
        let default_es = Syntax::Es(EsConfig {
            ..Default::default()
        });

        if let Some(ext) = entry.extension() {
            if ext == "ts" {
                let ts = Syntax::Typescript(TsConfig {
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
        |((((target, syntax), minify), source_map), external_helpers)| {
            // Actual
            Options {
                config: Config {
                    jsc: JscConfig {
                        syntax: Some(syntax),
                        transform: None.into(),
                        external_helpers: external_helpers.into(),
                        target: Some(target),
                        minify: if minify {
                            Some(JsMinifyOptions {
                                compress: BoolOrDataConfig::from_bool(true),
                                mangle: BoolOrDataConfig::from_bool(true),
                                format: Default::default(),
                                ecma: Default::default(),
                                keep_classnames: Default::default(),
                                keep_fnames: Default::default(),
                                module: Default::default(),
                                safari10: Default::default(),
                                toplevel: Default::default(),
                                source_map: Default::default(),
                                output_path: Default::default(),
                                inline_sources_content: Default::default(),
                                emit_source_map_columns: Default::default(),
                            })
                        } else {
                            None
                        },
                        ..Default::default()
                    },
                    module: Some(ModuleConfig::CommonJs(Default::default())),
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

    unignore(&entry);
}

fn get_expected_stdout(input: &Path) -> Result<String, Error> {
    let cm = Arc::new(SourceMap::default());
    let c = Compiler::new(cm.clone());

    try_with_handler(
        cm.clone(),
        HandlerOpts {
            color: ColorConfig::Always,
            skip_filename: true,
        },
        |handler| {
            let fm = cm.load_file(input).context("failed to load file")?;

            let res = c
                .process_js_file(
                    fm,
                    handler,
                    &Options {
                        config: Config {
                            jsc: JscConfig {
                                target: Some(EsVersion::Es2021),
                                syntax: Some(Syntax::Typescript(TsConfig {
                                    decorators: true,
                                    ..Default::default()
                                })),
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
}

/// Rename `foo/.bar/exec.js` => `foo/bar/exec.js`
fn unignore(path: &Path) {
    if path.components().all(|c| {
        !matches!(c, Component::Normal(..)) || !c.as_os_str().to_string_lossy().starts_with('.')
    }) {
        return;
    }
    //

    let mut new_path = PathBuf::new();

    for c in path.components() {
        if let Component::Normal(s) = c {
            if let Some(s) = s.to_string_lossy().strip_prefix('.') {
                new_path.push(s);

                continue;
            }
        }
        new_path.push(c);
    }

    create_dir_all(new_path.parent().unwrap()).expect("failed to create parent dir");

    rename(&path, &new_path).expect("failed to rename");
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
            println!("external_helpers: {:?}", opts.config.jsc.external_helpers);
            println!("target: {:?}", opts.config.jsc.target.unwrap());

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
}

enum NodeModuleType {
    CommonJs,
    Module,
}

fn stdout_of(code: &str, module_type: NodeModuleType) -> Result<String, Error> {
    let module_type = match module_type {
        NodeModuleType::CommonJs => "--input-type=commonjs",
        NodeModuleType::Module => "--input-type=module",
    };
    let actual_output = Command::new("node")
        .arg(module_type)
        .arg("-e")
        .arg(&code)
        .output()
        .context("failed to execute output of minifier")?;

    if !actual_output.status.success() {
        bail!(
            "failed to execute:\n{}\n{}\n{}",
            code,
            String::from_utf8_lossy(&actual_output.stdout),
            String::from_utf8_lossy(&actual_output.stderr)
        )
    }

    let s = String::from_utf8_lossy(&actual_output.stdout).to_string();
    if s.trim().is_empty() {
        bail!("empty stdout");
    }
    Ok(s)
}
