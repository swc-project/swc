use rayon::prelude::*;
use std::path::Path;
use swc::{
    config::{Options, SourceMapsConfig},
    Compiler,
};
use testing::{NormalizedOutput, StdErr, Tester};
use walkdir::WalkDir;

fn file(f: &str) -> Result<NormalizedOutput, StdErr> {
    Tester::new().print_errors(|cm, handler| {
        let c = Compiler::new(cm.clone(), handler);

        let fm = cm.load_file(Path::new(f)).expect("failed to load file");
        let s = c.process_js_file(
            fm,
            &Options {
                swcrc: true,
                is_module: true,
                ..Default::default()
            },
        );

        match s {
            Ok(v) => {
                if c.handler.has_errors() {
                    Err(())
                } else {
                    Ok(v.code.into())
                }
            }
            Err(err) => panic!("Error: {}", err),
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
                println!("File: {}", entry.path().to_string_lossy());

                if !entry.file_name().to_string_lossy().ends_with(".ts")
                    && !entry.file_name().to_string_lossy().ends_with(".js")
                    && !entry.file_name().to_string_lossy().ends_with(".tsx")
                {
                    continue;
                }

                let fm = cm.load_file(entry.path()).expect("failed to load file");
                match c.process_js_file(
                    fm,
                    &Options {
                        swcrc: true,
                        is_module: true,

                        ..Default::default()
                    },
                ) {
                    Ok(..) => {}
                    Err(ref err) if format!("{:?}", err).contains("not matched") => {}
                    Err(err) => panic!("Error: {:?}", err),
                }
            }

            Ok(())
        })
        .map(|_| ())
        .expect("failed");
}

fn par_project(dir: &str) {
    Tester::new()
        .print_errors(|cm, handler| {
            let c = Compiler::new(cm.clone(), handler);

            let entries = WalkDir::new(dir)
                .into_iter()
                .map(|entry| entry.unwrap())
                .filter(|e| {
                    if e.metadata().unwrap().is_dir() {
                        return false;
                    }

                    if !e.file_name().to_string_lossy().ends_with(".ts")
                        && !e.file_name().to_string_lossy().ends_with(".js")
                        && !e.file_name().to_string_lossy().ends_with(".tsx")
                    {
                        return false;
                    }

                    true
                })
                .collect::<Vec<_>>();

            entries.into_par_iter().for_each(|entry| {
                let fm = cm.load_file(entry.path()).expect(
                    "failed to load
 file",
                );
                let _ = c.process_js_file(
                    fm,
                    &Options {
                        swcrc: true,
                        is_module: true,
                        source_maps: Some(SourceMapsConfig::Bool(true)),
                        ..Default::default()
                    },
                );
            });

            if c.handler.has_errors() {
                Err(())
            } else {
                Ok(())
            }
        })
        .map(|_| ())
        .expect("");
}

#[test]
#[ignore]
fn angular_core() {
    par_project("integration-tests/angular/packages/core/src");
}

//#[test]
//fn rxjs() {
//    par_project("integration-tests/rxjs/repo/src");
//}
//
//#[test]
//fn webpack() {
//    par_project("integration-tests/webpack/repo/lib");
//}

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

#[test]
fn issue_409_1() {
    let s = file("tests/projects/issue-409-1/input.js").unwrap();
    println!("{}", s);

    assert!(s.contains("JSON.parse"));
}

#[test]
fn issue_409_2() {
    let s = file("tests/projects/issue-409-2/input.js").unwrap();
    println!("{}", s);

    assert!(!s.contains("JSON.parse"));
}

/// should handle multiple entries in swcrc
#[test]
fn issue_414() {
    let s1 = file("tests/projects/issue-414/a.js").unwrap();
    println!("{}", s1);
    assert!(s1.contains("require('foo')"));

    let s2 = file("tests/projects/issue-414/b.ts").unwrap();
    println!("{}", s2);
    assert!(s2.contains("define("));
    assert!(s2.contains("function(_bar) {"));
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

#[test]
fn issue_467() {
    project("tests/projects/issue-467/");
}

#[test]
fn issue_468() {
    file("tests/projects/issue-468/input.ts").expect("failed to parse typescript");
}

#[test]
fn issue_528() {
    let f = file("tests/projects/issue-528/input.js")
        .unwrap()
        .replace(" ", "");
    let f = f.trim();

    println!("{}", f);
    assert_eq!(
        f,
        "\
//bar
[
//foo
a,
//baz
//bar
b
];"
    );
}

#[test]
fn env_entry_chrome_49() {
    let f = file("tests/env/entry/chrome-49/input.js")
        .unwrap()
        .replace(" ", "");
    let f = f.trim();

    println!("{}", f);

    assert_eq!(f.lines().count(), 76);
}

#[test]
fn env_entry_chrome_71() {
    let f = file("tests/env/entry/chrome-71/input.js")
        .unwrap()
        .replace(" ", "");
    let f = f.trim();

    println!("{}", f);

    assert_eq!(f.lines().count(), 5);
}

#[test]
fn env_query_chrome_71() {
    let f = file("tests/env/query/chrome-71/input.js")
        .unwrap()
        .replace(" ", "");
    let f = f.trim();

    println!("{}", f);

    assert_eq!(f.lines().count(), 5);
}

#[test]
fn project_env() {
    project("tests/projects/env/");
}

#[test]
fn issue_532() {
    let f = file("tests/projects/issue-532-block/input.js")
        .unwrap()
        .replace(" ", "");
    let f = f.trim();

    println!("{}", f);

    assert_eq!(
        f,
        "\
/*pre:1*/
test();
test(123/*post:3*/
);
test(/*pre:4*/
123);
test(/*pre:5*/
123/*post:6*/
);
test(/*pre:7*/
123,/*pre:8*/
456);
test(123/*post:9*/
,456/*post:10*/
);"
    )
}

#[test]
fn issue_602() {
    let f = file("tests/projects/issue-602/input.js").unwrap();
    println!("{}", f);

    assert!(!f.contains("undefined1"));
}

#[test]
fn issue_604_1() {
    let f = file("tests/projects/issue-604-1/input.js").unwrap();
    println!("{}", f);

    assert!(f.contains("_loop(i)"));
}

#[test]
fn issue_605() {
    let f = file("tests/projects/issue-605/input.js").unwrap();
    println!("{}", f);

    assert!(f.contains("Object.keys(_c)"));
}

#[test]
fn await_expr() {
    let f = file("tests/projects/await-expression/input.js").unwrap();
    println!("{}", f);

    assert!(f.contains("await"));
    assert!(f.contains("test"));
}

#[test]
fn await_expr_2() {
    let f = file("tests/projects/await-expression-2/input.js").unwrap();
    println!("{}", f);

    assert!(f.contains("await"));
    assert!(f.contains("test"));
}

#[test]
fn default_config() {
    project("tests/projects/issue-655")
}

#[test]
fn issue_658() {
    project("tests/projects/issue-658")
}
