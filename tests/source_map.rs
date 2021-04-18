use std::path::PathBuf;
use std::process::Command;
use std::process::Output;
use std::{fs::canonicalize, sync::Arc};
use swc::{
    config::{Options, SourceMapsConfig},
    Compiler,
};
use testing::assert_eq;
use testing::{StdErr, Tester};
use walkdir::WalkDir;

fn file(f: &str) -> Result<(), StdErr> {
    Tester::new().print_errors(|cm, handler| {
        let path = canonicalize(f).expect("failed to canonicalize");

        let c = Compiler::new(cm.clone(), Arc::new(handler));

        let fm = cm.load_file(&path).expect("failed to load file");
        let s = c
            .process_js_file(
                fm,
                &Options {
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

        let c = Compiler::new(cm.clone(), Arc::new(handler));

        let fm = cm.load_file(&path).expect("failed to load file");
        let s = c
            .process_js_file(
                fm,
                &Options {
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

#[testing::fixture("stacktrace/**/input/")]
fn stacktrace(input_dir: PathBuf) {
    Tester::new()
        .print_errors(|cm, handler| {
            let c = Compiler::new(cm.clone(), Arc::new(handler));

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

                let node_expected = Command::new("node")
                    .arg("-e")
                    .arg(&**fm.src)
                    .output()
                    .map(extract_node_stack_trace)
                    .expect("failed to capture output of node -e 'reference code'");

                let deno_expected = stack_trace_from_deno(&fm.src);

                match c.process_js_file(
                    fm,
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

                        let node_actual = Command::new("node")
                            .arg("-e")
                            .arg(&v.code)
                            .arg("-r")
                            .arg("source-map-support/register")
                            .output()
                            .map(extract_node_stack_trace)
                            .expect("failed to capture output of node -e 'generated code'");

                        assert_eq!(node_expected, node_actual);

                        let deno_actual = stack_trace_from_deno(&v.code);

                        assert_eq!(deno_expected, deno_actual);
                    }
                    Err(err) => panic!("Error: {:?}", err),
                }
            }

            Ok(())
        })
        .map(|_| ())
        .expect("failed");
}

/// Extract stack trace from output of `node -e 'code'`.
///
/// TODO: Use better type.
fn extract_node_stack_trace(output: Output) -> Vec<String> {
    assert!(
        !output.status.success(),
        "Stack trace tests should fail with stack traces"
    );

    assert_eq!(
        output.stdout,
        Vec::<u8>::new(),
        "Sourcemap test file should not print anything to stdout"
    );

    let stderr = String::from_utf8_lossy(&output.stderr);
    //
    let stacks = stderr
        .split(|c| c == '\n')
        .map(|s| s.replace("    at ", "").replace("\r", ""))
        .collect::<Vec<_>>();
    // println!("{:?}", stacks);

    println!("{}", stacks.join("\n"));

    stacks
}

fn stack_trace_from_deno(src: &str) -> Vec<String> {
    let output = Command::new("deno")
        .arg("eval")
        .arg(&src)
        .output()
        .expect("failed to spwan deno");

    assert_eq!(
        output.stdout,
        Vec::<u8>::new(),
        "Sourcemap test file should not print anything to stdout"
    );

    let err = String::from_utf8_lossy(&output.stderr);

    err.lines().map(|s| s.to_string()).collect()
}
