use std::path::PathBuf;

use par_iter::prelude::*;
use swc::{
    config::{JsMinifyOptions, JscConfig, Options, SourceMapsConfig},
    BoolOrDataConfig, Compiler, TransformOutput,
};
use swc_common::{
    comments::{Comment, SingleThreadedComments},
    errors::HANDLER,
    sync::Lrc,
    BytePos, FileName,
};
use swc_compiler_base::PrintArgs;
use swc_ecma_ast::*;
use swc_ecma_parser::{EsSyntax, Syntax};
use swc_ecma_transforms::helpers::{self, Helpers};
use swc_ecma_visit::{fold_pass, Fold};
use testing::{NormalizedOutput, StdErr, Tester};
use walkdir::WalkDir;

fn compile_str(
    filename: Lrc<FileName>,
    content: &str,
    options: Options,
) -> Result<TransformOutput, StdErr> {
    Tester::new().print_errors(|cm, handler| {
        let c = Compiler::new(cm.clone());

        let fm = cm.new_source_file(filename, content.to_string());
        let s = c.process_js_file(fm, &handler, &options);

        match s {
            Ok(v) => {
                if handler.has_errors() {
                    Err(())
                } else {
                    Ok(v)
                }
            }
            Err(err) => panic!("Error: {err:?}"),
        }
    })
}

fn par_project(dir: &str) {
    Tester::new()
        .print_errors(|cm, handler| {
            let c = Compiler::new(cm.clone());

            let entries = WalkDir::new(dir)
                .into_iter()
                .map(|entry| entry.unwrap())
                .filter(|e| {
                    if e.metadata().unwrap().is_dir() {
                        return false;
                    }

                    if !e.file_name().to_string_lossy().ends_with(".ts")
                        && !e.file_name().to_string_lossy().ends_with(".js")
                        && !e.file_name().to_string_lossy().ends_with(".tsx")
                    {
                        return false;
                    }

                    true
                })
                .collect::<Vec<_>>();

            entries.into_par_iter().for_each(|entry| {
                let fm = cm.load_file(entry.path()).expect(
                    "failed to load
 file",
                );
                let _ = c.process_js_file(
                    fm,
                    &handler,
                    &Options {
                        swcrc: true,
                        source_maps: Some(SourceMapsConfig::Bool(true)),
                        ..Default::default()
                    },
                );
            });

            if handler.has_errors() {
                Err(())
            } else {
                Ok(())
            }
        })
        .map(|_| ())
        .expect("");
}

#[test]
#[ignore]
fn concurrency() {
    par_project("tests/deno-unit");
}

struct Panicking;

impl Fold for Panicking {
    fn fold_jsx_opening_element(&mut self, node: JSXOpeningElement) -> JSXOpeningElement {
        let JSXOpeningElement { name, .. } = &node;
        println!("HMM");

        if let JSXElementName::Ident(Ident { sym, .. }) = name {
            panic!("visited: {sym}")
        }

        node
    }
}

#[test]
#[should_panic = "visited"]
fn should_visit() {
    Tester::new()
        .print_errors(|cm, handler| {
            let c = Compiler::new(cm.clone());

            let fm = cm.new_source_file(
                FileName::Anon.into(),
                "
                    import React from 'react';
                    const comp = () => <amp-something className='something' />;
                ",
            );
            let comments = SingleThreadedComments::default();
            let config = c
                .parse_js_as_input(
                    fm.clone(),
                    None,
                    &handler,
                    &swc::config::Options {
                        config: swc::config::Config {
                            jsc: JscConfig {
                                syntax: Some(Syntax::Es(EsSyntax {
                                    jsx: true,
                                    ..Default::default()
                                })),
                                ..Default::default()
                            },
                            ..Default::default()
                        },
                        ..Default::default()
                    },
                    &fm.name,
                    Some(&comments),
                    |_| noop_pass(),
                )
                .unwrap()
                .unwrap();

            dbg!(config.syntax);

            let config = config.with_pass(|pass| (fold_pass(Panicking), pass));

            if config.minify {
                let preserve_excl = |_: &BytePos, vc: &mut Vec<Comment>| -> bool {
                    vc.retain(|c: &Comment| c.text.starts_with('!'));
                    !vc.is_empty()
                };
                c.comments().leading.retain(preserve_excl);
                c.comments().trailing.retain(preserve_excl);
            }
            let pass = config.pass;
            let program = config.program;
            let program = helpers::HELPERS.set(&Helpers::new(config.external_helpers), || {
                HANDLER.set(&handler, || {
                    // Fold module
                    program.apply(pass)
                })
            });

            Ok(c.print(
                &program,
                PrintArgs {
                    source_root: None,
                    source_file_name: None,
                    output_path: config.output_path,
                    inline_sources_content: config.inline_sources_content,
                    source_map: config.source_maps,
                    orig: None,
                    // TODO: figure out sourcemaps
                    comments: Some(&comments),
                    emit_source_map_columns: config.emit_source_map_columns,
                    codegen_config: swc_ecma_codegen::Config::default()
                        .with_target(config.target)
                        .with_minify(config.minify),
                    ..Default::default()
                },
            )
            .unwrap()
            .code)
        })
        .unwrap();
}

#[test]
fn opt_source_file_name_1() {
    let map = compile_str(
        FileName::Real(PathBuf::from("not-unique.js")).into(),
        "import Foo from 'foo';",
        Options {
            filename: "unique.js".into(),
            source_file_name: Some("entry-foo".into()),
            source_maps: Some(SourceMapsConfig::Bool(true)),
            ..Default::default()
        },
    )
    .unwrap()
    .map
    .unwrap();

    println!("{map}");

    assert!(map.contains("entry-foo"));
}

#[testing::fixture("tests/minify/**/input.js")]
fn minify(input_js: PathBuf) {
    let input_dir = input_js.parent().unwrap();
    let config_json_path = input_dir.join("config.json");

    testing::run_test2(false, |cm, handler| {
        let c = Compiler::new(cm);
        let fm = c.cm.load_file(&input_js).unwrap();

        let config_str = std::fs::read_to_string(&config_json_path).unwrap();
        let mut config: JsMinifyOptions = serde_json::from_str(&config_str).unwrap();

        if config.source_map.inner().is_none() {
            config.source_map = BoolOrDataConfig::from_bool(true);
        }

        let output = c.minify(fm, &handler, &config, Default::default()).unwrap();

        NormalizedOutput::from(output.code)
            .compare_to_file(input_dir.join("output.js"))
            .unwrap();

        let map = output.map.map(|json| {
            let json: serde_json::Value = serde_json::from_str(&json).unwrap();
            serde_json::to_string_pretty(&json).unwrap()
        });

        NormalizedOutput::from(map.unwrap())
            .compare_to_file(input_dir.join("output.map"))
            .unwrap();

        let extracted_comments_path = input_dir.join("extracted-comments.json");
        let extracted_comments = output.extracted_comments.unwrap_or_default();

        if extracted_comments_path.exists() || !extracted_comments.is_empty() {
            let extracted_comments = serde_json::to_string_pretty(&extracted_comments).unwrap();

            NormalizedOutput::from(extracted_comments)
                .compare_to_file(extracted_comments_path)
                .unwrap();
        }

        Ok(())
    })
    .unwrap()
}
