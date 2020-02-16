use std::fs::canonicalize;
use swc::{
    config::{Options, SourceMapsConfig},
    Compiler,
};
use testing::{NormalizedOutput, StdErr, Tester};

fn file(f: &str) -> Result<(), StdErr> {
    Tester::new().print_errors(|cm, handler| {
        let path = canonicalize(f).expect("failed to canonicalize");

        let c = Compiler::new(cm.clone(), handler);

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

        NormalizedOutput::from(s.code)
            .compare_to_file(path.parent().unwrap().join("index.g.js"))
            .unwrap();

        NormalizedOutput::from(s.map.unwrap())
            .compare_to_file(path.parent().unwrap().join("index.js.map"))
            .unwrap();

        Ok(())
    })
}

#[test]
fn issue_622() {
    file("tests/srcmap/issue-622/index.js").unwrap();
}
