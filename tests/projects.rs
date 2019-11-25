use std::path::Path;
use swc::{config::Options, Compiler};
use testing::{StdErr, Tester};

fn project(f: &str) -> Result<(), StdErr> {
    Tester::new()
        .print_errors(|cm, handler| {
            let c = Compiler::new(cm.clone(), handler);
            let fm = cm.load_file(Path::new(&f)).expect("failed to load file");
            c.process_js_file(
                fm,
                Options {
                    swcrc: true,
                    ..Default::default()
                },
            )
            .expect("failed to process js file");

            Ok(())
        })
        .map(|_| ())
}

#[test]
fn issue_467() {
    project("tests/projects/issue-467/input.ts").unwrap();
}
