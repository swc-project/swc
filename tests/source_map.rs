use std::{fs::canonicalize, process::Command, sync::Arc};
use swc::{
    config::{Options, SourceMapsConfig},
    Compiler,
};
use testing::{StdErr, Tester};

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
