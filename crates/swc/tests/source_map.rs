#![allow(unused)]

use std::{
    env::temp_dir,
    fs::{self, canonicalize, create_dir_all, File},
    io::Write,
    path::{Path, PathBuf},
    process::{Command, Output},
    sync::Arc,
};

use anyhow::{Context, Error};
use swc::{
    config::{
        Config, InputSourceMap, IsModule, JscConfig, ModuleConfig, Options, SourceMapsConfig,
    },
    Compiler,
};
use swc_ecma_parser::Syntax;
use testing::{assert_eq, NormalizedOutput, StdErr, Tester};
use walkdir::WalkDir;

fn file(f: &str, config: Config) -> Result<(), StdErr> {
    Tester::new().print_errors(|cm, handler| {
        let path = canonicalize(f).expect("failed to canonicalize");

        let c = Compiler::new(cm.clone());

        let fm = cm.load_file(&path).expect("failed to load file");
        let s = c
            .process_js_file(
                fm,
                &handler,
                &Options {
                    config: Config {
                        inline_sources_content: true.into(),
                        ..config
                    },
                    swcrc: true,
                    source_maps: Some(SourceMapsConfig::Bool(true)),
                    ..Default::default()
                },
            )
            .expect("failed to process js file");

        let js_path = path.parent().unwrap().join("index.g.js");
        std::fs::write(&js_path, s.code.as_bytes()).unwrap();

        let map_path = path.parent().unwrap().join("index.js.map");
        std::fs::write(&map_path, s.map.unwrap().as_bytes()).unwrap();

        let output = Command::new("node")
            .arg("-e")
            .arg(include_str!("source_map.js"))
            .arg(js_path)
            .arg(map_path)
            .output()
            .unwrap();

        if output.status.success() {
            return Ok(());
        }

        panic!(
            "Validation failed: \n{}\n{}",
            String::from_utf8_lossy(&output.stdout),
            String::from_utf8_lossy(&output.stderr)
        );
    })
}

#[test]
fn case_inline() {
    inline("tests/srcmap/case-inline/index.js");
}

#[test]
fn case_inline_extra_content() {
    inline("tests/srcmap/case-inline-extra-content/index.js");
}

#[test]
fn case_none_file() {
    file(
        "tests/srcmap/case-none-file/input.js",
        Config {
            input_source_map: Some(InputSourceMap::Bool(true)),
            ..Default::default()
        },
    )
    .unwrap();
}

#[test]
fn issue_622() {
    file("tests/srcmap/issue-622/index.js", Default::default()).unwrap();
}

fn inline(f: &str) -> Result<(), StdErr> {
    Tester::new().print_errors(|cm, handler| {
        let path = canonicalize(f).expect("failed to canonicalize");

        let c = Compiler::new(cm.clone());

        let fm = cm.load_file(&path).expect("failed to load file");
        let s = c
            .process_js_file(
                fm,
                &handler,
                &Options {
                    config: Config {
                        inline_sources_content: true.into(),
                        ..Default::default()
                    },
                    swcrc: true,
                    source_maps: Some(SourceMapsConfig::Str(String::from("inline"))),
                    ..Default::default()
                },
            )
            .expect("failed to process js file");

        let js_path = path.parent().unwrap().join("index.g.js");
        std::fs::write(&js_path, s.code.as_bytes()).unwrap();

        let output = Command::new("node")
            .arg("-e")
            .arg(include_str!("source_map_inline.js"))
            .arg(js_path)
            .output()
            .unwrap();

        if output.status.success() {
            return Ok(());
        }

        panic!(
            "Validation failed: \n{}\n{}",
            String::from_utf8_lossy(&output.stdout),
            String::from_utf8_lossy(&output.stderr)
        );
    })
}
#[test]
fn issue_706() {
    inline("tests/srcmap/issue-706/index.js").unwrap();
}

#[testing::fixture("tests/fixture/**/*.map")]
fn validate_map(map_file: PathBuf) {
    let content = fs::read_to_string(map_file).unwrap();
    if content.is_empty() {
        return;
    }
    sourcemap::SourceMap::from_slice(content.as_bytes()).expect("failed to deserialize sourcemap");
}

#[cfg(not(target_os = "windows"))]
#[testing::fixture("tests/stacktrace/**/input/")]
fn stacktrace(input_dir: PathBuf) {
    let dir = input_dir.parent().unwrap();
    let output_dir = dir.join("output");

    let _ = create_dir_all(&output_dir);

    Tester::new()
        .print_errors(|cm, handler| {
            let c = Compiler::new(cm.clone());

            for entry in WalkDir::new(&input_dir) {
                let entry = entry.unwrap();
                if entry.metadata().unwrap().is_dir() {
                    continue;
                }

                if entry.file_name().to_string_lossy().ends_with("_exec.js")
                    || !entry.file_name().to_string_lossy().ends_with(".js")
                {
                    continue;
                }
                println!("File: {}", entry.path().to_string_lossy());

                let fm = cm.load_file(entry.path()).expect("failed to load file");

                println!("-----Orig:\n{}\n-----", fm.src);

                match c.process_js_file(
                    fm,
                    &handler,
                    &Options {
                        config: Config {
                            is_module: Some(IsModule::Bool(true)),
                            ..Default::default()
                        },
                        swcrc: true,
                        source_maps: Some(SourceMapsConfig::Str("inline".to_string())),
                        ..Default::default()
                    },
                ) {
                    Ok(v) => {
                        // We created a javascript file with inline source map.
                        assert_eq!(v.map, None, "Source maps should be inlined");

                        println!("-----Compiled:\n{}\n-----", v.code);

                        let stack_trace = node_stack_trace(entry.path(), &v.code)
                            .expect("failed to capture output of node -e 'generated code'");

                        stack_trace
                            .compare_to_file(output_dir.join("stacks.txt"))
                            .expect("wrong stack trace");
                    }
                    Err(err) => panic!("Error: {:?}", err),
                }
            }

            Ok(())
        })
        .map(|_| ())
        .expect("failed");
}

fn node_stack_trace(file: &Path, code: &str) -> Result<NormalizedOutput, Error> {
    let test_file = file.with_file_name("_exec.js");

    {
        let mut f = File::create(&test_file).context("failed to open test js")?;
        f.write_all(code.as_bytes())
            .context("failed to write to test js")?;
        f.sync_all()?;
    }

    let stack = Command::new("node")
        .arg("--enable-source-maps")
        .arg(&test_file)
        .output()
        .map(extract_node_stack_trace)?;

    Ok(stack)
}

/// Extract stack trace from output of `node -e 'code'`.
///
/// TODO: Use better type.
fn extract_node_stack_trace(output: Output) -> NormalizedOutput {
    assert!(
        !output.status.success(),
        "Stack trace tests should fail with stack traces"
    );

    let stderr = String::from_utf8_lossy(&output.stderr);

    eprintln!("\n\n\nStderr: {}\n\n\n", stderr);
    //
    let stacks = stderr
        .lines()
        .filter(|s| {
            !s.contains("node:internal") && !s.contains("node_modules") && !s.contains("Node.js v")
        })
        .collect::<Vec<_>>();

    let stacks = stacks.join("\n");
    // println!("{:?}", stacks);

    stacks.into()
}

#[test]
fn issue_4112() {
    Tester::new()
        .print_errors(|cm, handler| {
            let c = Compiler::new(cm.clone());
            let fm = cm.new_source_file(
                swc_common::FileName::Real("./browser.js".into()).into(),
                r#""use strict";

            export { default as Selection } from "./selection";

            export { default as RichTextarea } from "./richTextarea";
            "#
                .to_string(),
            );

            let output1 = c
                .process_js_file(
                    fm,
                    &handler,
                    &Options {
                        config: Config {
                            module: Some(ModuleConfig::CommonJs(Default::default())),
                            ..Default::default()
                        },
                        source_maps: Some(SourceMapsConfig::Bool(true)),
                        ..Default::default()
                    },
                )
                .expect("failed to process js file");
            let fm2 = cm.new_source_file(
                swc_common::FileName::Real("./preamble.js".into()).into(),
                r#""use strict";

            import { React, window } from "easy";

            window.assign({
              React
            });
            "#
                .to_string(),
            );
            let output2 = c
                .process_js_file(
                    fm2,
                    &handler,
                    &Options {
                        config: Config {
                            module: Some(ModuleConfig::CommonJs(Default::default())),
                            emit_source_map_columns: true.into(),
                            ..Default::default()
                        },
                        source_maps: Some(SourceMapsConfig::Bool(true)),
                        ..Default::default()
                    },
                )
                .expect("failed to process js file");
            let source_count = sourcemap::SourceMap::from_slice(output2.map.unwrap().as_bytes())
                .expect("failed to deserialize sourcemap")
                .get_source_count();
            if source_count == 1 {
                return Ok(());
            }
            panic!(
                "Validation failed, should has 1 source, but {}",
                source_count
            );
        })
        .unwrap()
}

#[test]
fn should_work_with_emit_source_map_columns() {
    Tester::new().print_errors(|cm, handler| {
        let c = Compiler::new(cm.clone());
        let fm = cm.new_source_file(
            swc_common::FileName::Real("./app.js".into()).into(),
            r#"import { createElement } from "react";

  createElement('div', null, {});
  /* 패딩에 대 */ /* 한 더 많은 문자. */ "테스트" + "테스트";
  function ƒ() {
  }
"#
            .to_string(),
        );
        let result = c.process_js_file(
            fm.clone(),
            &handler,
            &Options {
                swcrc: false,
                source_maps: Some(SourceMapsConfig::Bool(true)),
                config: Config {
                    inline_sources_content: true.into(),
                    emit_source_map_columns: true.into(),
                    ..Default::default()
                },
                ..Default::default()
            },
        );

        match result {
            Ok(result) => {
                assert!(result.map.is_some());
                let map = result.map.unwrap();

                // lookup createElement(...) function call
                let source_map = sourcemap::SourceMap::from_slice(map.as_bytes())
                    .expect("failed to deserialize sourcemap");
                let token = source_map
                    .lookup_token(1, 14)
                    .expect("failed to find token");
                assert_eq!(token.get_dst_line(), 1);
                assert_eq!(token.get_dst_col(), 14);
                assert_eq!(token.get_src_line(), 2);
                assert_eq!(token.get_src_col(), 16);

                // lookup second string literal
                let token = source_map
                    .lookup_token(2, 37)
                    .expect("failed to find token");
                assert_eq!(token.get_dst_line(), 2);
                assert_eq!(token.get_dst_col(), 37);
                assert_eq!(token.get_src_line(), 3);
                assert_eq!(token.get_src_col(), 39);

                // lookup paren after multi-byte identifier
                let token = source_map
                    .lookup_token(3, 10)
                    .expect("failed to find token");
                assert_eq!(token.get_dst_line(), 3);
                assert_eq!(token.get_dst_col(), 9);
                assert_eq!(token.get_src_line(), 4);
                assert_eq!(token.get_src_col(), 11);
            }
            Err(err) => {
                panic!("Error: {:#?}", err);
            }
        }

        let result2 = c.process_js_file(
            fm,
            &handler,
            &Options {
                swcrc: false,
                source_maps: Some(SourceMapsConfig::Bool(true)),
                config: Config {
                    inline_sources_content: true.into(),
                    emit_source_map_columns: false.into(),
                    ..Default::default()
                },
                ..Default::default()
            },
        );

        match result2 {
            Ok(result) => {
                assert!(result.map.is_some());
                let map = result.map.unwrap();
                let source_map = sourcemap::SourceMap::from_slice(map.as_bytes())
                    .expect("failed to deserialize sourcemap");
                let token = source_map
                    .lookup_token(1, 14)
                    .expect("failed to find token");
                assert_eq!(token.get_dst_line(), 1);
                assert_eq!(token.get_dst_col(), 0);
                assert_eq!(token.get_src_line(), 2);
                assert_eq!(token.get_src_col(), 2);
            }
            Err(err) => {
                panic!("Error: {:#?}", err);
            }
        }

        Ok(())
    });
}

#[test]
fn issue_4578() {
    file(
        "tests/srcmap/issue-4578/after-babel.js",
        Config {
            input_source_map: Some(InputSourceMap::Str("inline".into())),
            ..Default::default()
        },
    )
    .unwrap();
}

#[test]
fn issue_6694() {
    Tester::new().print_errors(|cm, handler| {
        let c = Compiler::new(cm.clone());
        let fm = cm.new_source_file(
            swc_common::FileName::Real("./app.js".into()).into(),
            r#"/**
 * foo
 * @param data foo
 * @returns foo
 */
export const fixupRiskConfigData = (data: any): types.RiskConfigType => {
  if (x) {
    return 123;
  } else {
    return 456;
  }
};"#
            .replace('\n', "\r\n"),
        );
        let result = c.process_js_file(
            fm,
            &handler,
            &Options {
                swcrc: false,
                source_maps: Some(SourceMapsConfig::Bool(true)),
                config: Config {
                    jsc: JscConfig {
                        target: Some(swc_ecma_ast::EsVersion::Es5),
                        syntax: Some(Syntax::Typescript(Default::default())),
                        ..Default::default()
                    },
                    inline_sources_content: true.into(),
                    emit_source_map_columns: true.into(),
                    ..Default::default()
                },
                ..Default::default()
            },
        );

        fn line_col(needle: &str, haystack: &str) -> Option<(u32, u32)> {
            let lines = haystack.lines().enumerate();
            for (i, line) in lines {
                if let Some(c) = line.find(needle) {
                    return Some((i as _, c as _));
                }
            }

            None
        }

        match result {
            Ok(result) => {
                assert!(result.map.is_some());
                let map = result.map.unwrap();

                let source_map = sourcemap::SourceMap::from_slice(map.as_bytes())
                    .expect("failed to deserialize sourcemap");

                // "export"
                let export_line_col =
                    line_col("export", &result.code).expect("failed to find `export`");
                let token = source_map
                    .lookup_token(export_line_col.0, export_line_col.1)
                    .expect("failed to find token");
                assert_eq!(token.get_src(), (5, 0));

                // "if"
                let if_line_col = line_col("if", &result.code).expect("failed to find `export`");
                let token = source_map
                    .lookup_token(if_line_col.0, export_line_col.1)
                    .expect("failed to find token");
                assert_eq!(token.get_src(), (6, 2));
            }
            Err(err) => {
                panic!("Error: {:#?}", err);
            }
        }

        Ok(())
    });
}
