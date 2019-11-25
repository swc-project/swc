use swc::{config::Options, Compiler};
use testing::{NormalizedOutput, StdErr, Tester};
use walkdir::WalkDir;

fn file(f: &str) -> Result<NormalizedOutput, StdErr> {
    Tester::new().print_errors(|cm, handler| {
        let c = Compiler::new(cm.clone(), handler);

        let fm = cm.load_file(entry.path()).expect("failed to load file");
        let s = c.process_js_file(
            fm,
            Options {
                swcrc: true,
                ..Default::default()
            },
        );
        match s {
            Ok(v) => Ok(v.code.into()),
            Err(e) => Err(()),
        }
    })
}

fn project(dir: &str) {
    Tester::new()
        .print_errors(|cm, handler| {
            let c = Compiler::new(cm.clone(), handler);

            for entry in WalkDir::new(dir) {
                let entry = entry.unwrap();
                if entry.metadata().unwrap().is_dir() {
                    continue;
                }
                if !entry.file_name().to_string_lossy().ends_with(".ts")
                    && !entry.file_name().to_string_lossy().ends_with(".js")
                    && !entry.file_name().to_string_lossy().ends_with(".tsx")
                {
                    continue;
                }

                let fm = cm.load_file(entry.path()).expect("failed to load file");
                let _ = c.process_js_file(
                    fm,
                    Options {
                        swcrc: true,
                        ..Default::default()
                    },
                );
            }

            Ok(())
        })
        .map(|_| ())
        .expect("");
}

#[test]
fn issue_467() {
    project("tests/projects/issue-467");
}

#[test]
fn angular_core() {
    project("tests/projects/angular-core");
}

/// should respect modules config in .swcrc
#[test]
fn issue_225() {
    let s = file("tests/issue-225/input.js").unwrap();
    assert!(s.contains("function _interopRequireDefault"));
    assert!(s.contains("var _foo = _interopRequireDefault(require('foo'))"));
}

/// should handle exportNamespaceFrom configured by .swcrc
#[test]
fn issue_226() {
    let s = file("tests/issue-226/input.js").unwrap();

    assert!(s.contains("import * as _Foo from 'bar';"));
    assert!(s.contains("export { _Foo as Foo };"));
}

#[test]
fn issue_466_1() {
    project("tests/projects/issue-466-1");
}

#[test]
fn issue_466_2() {
    project("tests/projects/issue-466-2");
}
