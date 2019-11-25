use std::path::Path;
use swc::{config::Options, Compiler};
use testing::{NormalizedOutput, StdErr, Tester};
use walkdir::WalkDir;

fn file(f: &str) -> Result<NormalizedOutput, StdErr> {
    Tester::new().print_errors(|cm, handler| {
        let c = Compiler::new(cm.clone(), handler);

        let fm = cm.load_file(Path::new(f)).expect("failed to load file");
        let s = c.process_js_file(
            fm,
            Options {
                swcrc: true,
                ..Default::default()
            },
        );
        match s {
            Ok(v) => Ok(v.code.into()),
            Err(..) => Err(()),
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
fn angular_core() {
    project("tests/projects/angular-core");
}

#[test]
fn rxjs() {
    project("tests/projects/rxjs");
}

#[test]
fn webpack() {
    project("tests/projects/webpack");
}

#[test]
fn issue_467() {
    project("tests/projects/issue-467");
}

/// should respect modules config in .swcrc
#[test]
fn issue_225() {
    let s = file("tests/projects/issue-225/input.js").unwrap();
    println!("{}", s);

    assert!(s.contains("function _interopRequireDefault"));
    assert!(s.contains("var _foo = _interopRequireDefault(require('foo'))"));
}

/// should handle exportNamespaceFrom configured by .swcrc
#[test]
fn issue_226() {
    let s = file("tests/projects/issue-226/input.js").unwrap();
    println!("{}", s);

    assert!(s.contains("import * as _Foo from 'bar';"));
    assert!(s.contains("export { _Foo as Foo }"));
}

/// should handle react correctly
#[test]
fn issue_351() {
    let s = file("tests/projects/issue-351/input.js").unwrap();
    println!("{}", s);

    assert!(s.contains(".default.createElement('div', null);"));
}

/// should handle cjs imports
#[test]
fn issue_389() {
    let s = file("tests/projects/issue-389/input.js").unwrap();
    println!("{}", s);

    assert!(s.contains(".default.bar = true"));
}

/// should handle comments in arrow expression
#[test]
fn issue_406() {
    let s = file("tests/projects/issue-406/input.js").unwrap();
    println!("{}", s);

    assert!(s.contains("return true"));
}

/// should handle multiple entries in swcrc
#[test]
fn issue_414() {
    let s1 = file("tests/projects/issue-414/a.js").unwrap();
    println!("{}", s1);
    assert!(s1.contains("require('foo')"));

    let s2 = file("tests/projects/issue-414/b.ts").unwrap();
    println!("{}", s2);
    assert!(s2.contains("define(['bar'], function(_bar) {"));
}

/// should handle comments in return statement
#[test]
fn issue_415() {
    let s = file("tests/projects/issue-415/input.js").unwrap();

    assert!(s.replace(" ", "").contains("return(/*#__PURE__*/"));
}

#[test]
fn issue_466_1() {
    project("tests/projects/issue-466-1");
}

#[test]
fn issue_466_2() {
    project("tests/projects/issue-466-2");
}
