use std::path::Path;

use swc::{config::Options, Compiler};
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
                    ..Default::default()
                },
            );
            if let Err(e) = s {
                return Ok(format!("{e:?}").into());
            }

            panic!("invalid swcrc should abort build, but got {s:?}");
        })
        .unwrap()
}

#[test]
fn swcrc_simple() {
    let f = file("tests/swcrc_errors/simple/foo.js");
    println!("{f}");
}
