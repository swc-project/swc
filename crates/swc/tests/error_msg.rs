use std::path::{Path, PathBuf};
use swc::{
    config::{IsModule, Options},
    try_with_handler, Compiler,
};
use swc_common::{sync::Lrc, FilePathMapping, SourceMap};
use testing::{NormalizedOutput, Tester};

fn file(f: impl AsRef<Path>) -> NormalizedOutput {
    Tester::new()
        .print_errors(|cm, handler| -> Result<NormalizedOutput, _> {
            let c = Compiler::new(cm.clone());

            let fm = cm.load_file(f.as_ref()).expect("failed to load file");
            let s = c.process_js_file(
                fm,
                &handler,
                &Options {
                    swcrc: true,
                    is_module: IsModule::Bool(true),
                    ..Default::default()
                },
            );
            if let Err(e) = s {
                return Ok(format!("{:?}", e).into());
            }

            panic!("invalid swcrc should abort build, but got {:?}", s);
        })
        .unwrap()
}

#[test]
fn swcrc_simple() {
    let f = file("tests/swcrc_errors/simple/foo.js");
    println!("{}", f);
}

#[test]
fn issue_1532() {
    let f = file("tests/swcrc_errors/issue-1532/index.js");
    println!("{}", f);

    assert!(f.contains("unknown variant `esnext`"))
}

#[testing::fixture("tests/errors/**/input.js")]
fn fixture(input: PathBuf) {
    let _log = testing::init();
    let output_path = input.parent().unwrap().join("output.swc-stderr");

    let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));
    let err = try_with_handler(cm.clone(), true, |handler| {
        let c = Compiler::new(cm.clone());

        let fm = cm.load_file(&input).expect("failed to load file");

        match c.process_js_file(
            fm,
            handler,
            &Options {
                swcrc: true,
                is_module: IsModule::Bool(true),

                ..Default::default()
            },
        ) {
            Ok(..) => {}
            Err(err) => return Err(err),
        }

        Ok(())
    })
    .expect_err("should fail");

    let output = NormalizedOutput::from(format!("{:?}", err));

    output.compare_to_file(&output_path).unwrap();
}
