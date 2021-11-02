#![allow(unused)]

use anyhow::{Context, Error};
use std::{
    env::temp_dir,
    fs,
    fs::{canonicalize, create_dir_all},
    path::PathBuf,
    process::{Command, Output},
    sync::Arc,
};
use swc::{
    config::{Config, Options, SourceMapsConfig},
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
                    is_module: true,
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
                    is_module: true,
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

#[cfg(feature = "node14-test")]
#[testing::fixture("stacktrace/**/input/")]
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
                        is_module: true,
                        source_maps: Some(SourceMapsConfig::Str("inline".to_string())),
                        ..Default::default()
                    },
                ) {
                    Ok(v) => {
                        // We created a javascript file with inline source map.
                        assert_eq!(v.map, None, "Source maps should be inlined");

                        println!("-----Compiled:\n{}\n-----", v.code);

                        let stack_trace = node_stack_trace(&v.code)
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

fn node_stack_trace(code: &str) -> Result<NormalizedOutput, Error> {
    let thread = std::thread::current();
    let test_name = thread.name().expect("test thread should have a name");

    let dir = temp_dir().join(test_name);

    let _ = create_dir_all(&dir);

    let test_file = dir.join("eval.js");
    fs::write(&test_file, code.as_bytes()).context("faailed to write to test js")?;

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
        .split(|c| c == '\n')
        .map(|s| s.trim())
        .filter(|s| s.starts_with("->"))
        .collect::<Vec<_>>();

    let stacks = stacks.join("\n");
    // println!("{:?}", stacks);

    stacks.into()
}
