use std::{path::Path, sync::Arc};
use swc::{config::Options, Compiler};
use testing::{NormalizedOutput, Tester};

fn file(f: &str) -> NormalizedOutput {
    Tester::new()
        .print_errors(|cm, handler| -> Result<NormalizedOutput, _> {
            let c = Compiler::new(cm.clone(), Arc::new(handler));

            let fm = cm.load_file(Path::new(f)).expect("failed to load file");
            let s = c.process_js_file(
                fm,
                &Options {
                    swcrc: true,
                    is_module: true,
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
