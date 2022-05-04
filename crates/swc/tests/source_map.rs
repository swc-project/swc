#![allow(unused)]

use std::{
    env::temp_dir,
    fs,
    fs::{canonicalize, create_dir_all},
    path::{Path, PathBuf},
    process::{Command, Output},
    sync::Arc,
};

use anyhow::{Context, Error};
use swc::{
    config::{Config, IsModule, ModuleConfig, Options, SourceMapsConfig},
    Compiler,
};
use testing::{assert_eq, NormalizedOutput, StdErr, Tester};
use walkdir::WalkDir;

fn file(f: &str) -> Result<(), StdErr> {
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
                        inline_sources_content: true,
                        ..Default::default()
                    },
                    swcrc: true,
                    is_module: IsModule::Bool(true),
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
fn issue_622() {
    file("tests/srcmap/issue-622/index.js").unwrap();
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
                        inline_sources_content: true,
                        ..Default::default()
                    },
                    swcrc: true,
                    is_module: IsModule::Bool(true),
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
    let content = fs::read_to_string(&map_file).unwrap();
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
                println!("File: {}", entry.path().to_string_lossy());

                if !entry.file_name().to_string_lossy().ends_with(".js") {
                    continue;
                }

                let fm = cm.load_file(entry.path()).expect("failed to load file");

                println!("-----Orig:\n{}\n-----", fm.src);

                match c.process_js_file(
                    fm,
                    &handler,
                    &Options {
                        swcrc: true,
                        is_module: IsModule::Bool(true),
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
    fs::write(&test_file, code.as_bytes()).context("failed to write to test js")?;

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
            !s.contains("(node:internal") && !s.contains("node_modules") && !s.contains("Node.js v")
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
                swc_common::FileName::Real("./browser.js".into()),
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
                swc_common::FileName::Real("./preamble.js".into()),
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
fn issue_3288_1() {
    let input="eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2lucHV0L2lucHV0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gXCLwn5Oj4p2TXCI7XG59Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJlQUFlLFdBQVk7SUFDdkIsT0FBTyxvQkFBSSxDQUFDO0NBQ2YsQ0FBQSJ9";

    let decoded_map =
        base64::decode(input).expect("Unable to decode source map from emitted file.");
    eprintln!("decoded map {:?}", decoded_map);

    let s = sourcemap::SourceMap::from_slice(&decoded_map).unwrap();
    eprintln!("{:#?}", s);
}

#[test]
fn issue_3288_2() {
    let input="eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2lucHV0L2lucHV0LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gXCLwn5Oj4p2TXCI7XG59Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJlQUFlLFdBQVk7SUFDdkIsT0FBTyxvQkFBSSxDQUFDO0NBQ2YsQ0FBQSJ9";

    let decoded_map =
        base64::decode(input).expect("Unable to decode source map from emitted file.");
    eprintln!("decoded map {:?}", decoded_map);

    let s = sourcemap::SourceMap::from_slice(&decoded_map).unwrap();
    eprintln!("{:#?}", s);
}
