use rayon::prelude::*;
use std::{
    fs::create_dir_all,
    path::{Path, PathBuf},
    sync::Arc,
};
use swc::{
    config::{Config, JscConfig, ModuleConfig, Options, SourceMapsConfig, TransformConfig},
    Compiler,
};
use swc_common::FileName;
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{Syntax, TsConfig};
use testing::{NormalizedOutput, StdErr, Tester};
use walkdir::WalkDir;

fn file(filename: &str) -> Result<NormalizedOutput, StdErr> {
    file_with_opt(
        filename,
        Options {
            swcrc: true,
            ..Default::default()
        },
    )
}

fn file_with_opt(filename: &str, options: Options) -> Result<NormalizedOutput, StdErr> {
    Tester::new().print_errors(|cm, handler| {
        let c = Compiler::new(cm.clone(), Arc::new(handler));

        let fm = cm
            .load_file(Path::new(filename))
            .expect("failed to load file");
        let s = c.process_js_file(
            fm,
            &Options {
                is_module: true,
                ..options
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
            Err(err) => panic!("Error: {:?}", err),
        }
    })
}

fn str_with_opt(content: &str, options: Options) -> Result<NormalizedOutput, StdErr> {
    Tester::new().print_errors(|cm, handler| {
        let c = Compiler::new(cm.clone(), Arc::new(handler));

        let fm = cm.new_source_file(FileName::Anon, content.to_string());
        let s = c.process_js_file(
            fm,
            &Options {
                is_module: true,
                ..options
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
            Err(err) => panic!("Error: {:?}", err),
        }
    })
}

fn project(dir: &str) {
    Tester::new()
        .print_errors(|cm, handler| {
            let c = Compiler::new(cm.clone(), Arc::new(handler));

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

                if c.config_for_file(
                    &Options {
                        swcrc: true,
                        is_module: true,

                        ..Default::default()
                    },
                    &fm.name,
                )
                .expect("failed to read config")
                .is_none()
                {
                    continue;
                }

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
            let c = Compiler::new(cm.clone(), Arc::new(handler));

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
    assert!(s.contains("var _foo = _interopRequireDefault(require(\"foo\"))"));
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

    assert!(s.contains(".default.createElement(\"div\", null);"));
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
    assert!(s1.contains("require(\"foo\")"));

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
//bar
(//baz
b)
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

#[test]
fn issue_763() {
    let f = file("tests/projects/issue-763/input.js").unwrap();
    println!("{}", f);

    assert!(f.contains("_consts.RESOURCE_WEBSITE"));
    assert!(f.contains("_consts.RESOURCE_FACEBOOK"));
    assert!(f.contains("_consts.RESOURCE_INSTAGRAM"));
}

#[test]
fn issue_763_2() {
    let f = file("tests/projects/issue-763-2/input.js").unwrap();
    println!("{}", f);

    assert!(f.contains("_consts.RESOURCE_WEBSITE"));
    assert!(f.contains("_consts.RESOURCE_FACEBOOK"));
    assert!(f.contains("_consts.RESOURCE_INSTAGRAM"));
}

#[test]
fn issue_779_1() {
    let f = file("tests/projects/issue-779-1/input.js").unwrap();
    println!("{}", f);

    assert!(f.contains("require(\"core-js/modules/es.array-buffer.constructor\");"))
}

#[test]
fn issue_779_2() {
    let f = file("tests/projects/issue-779-2/input.js").unwrap();
    println!("{}", f);

    assert!(f.contains("require(\"core-js\");"));
}

#[test]
fn issue_783() {
    let f = file("tests/projects/issue-783/input.js").unwrap();
    println!("{}", f);

    assert!(!f.contains("require(\"core-js\");"));
    assert!(f.contains("require(\"core-js/modules/es.array-buffer.constructor\");"))
}

#[test]
fn issue_783_core_js_2() {
    let f = file_with_opt(
        "tests/projects/issue-783/input.js",
        Options {
            swcrc: false,
            config: Config {
                env: Some(swc_ecma_preset_env::Config {
                    core_js: Some("2".parse().unwrap()),
                    mode: Some(swc_ecma_preset_env::Mode::Entry),
                    ..Default::default()
                }),
                ..Default::default()
            },
            ..Default::default()
        },
    )
    .unwrap();
    println!("{}", f);

    assert!(
        !f.contains("'core-js'"),
        "import of `core-js` should be transformed"
    );
}

#[test]
fn issue_783_core_js_3() {
    let f = file_with_opt(
        "tests/projects/issue-783/input.js",
        Options {
            swcrc: false,
            config: Config {
                env: Some(swc_ecma_preset_env::Config {
                    mode: Some(swc_ecma_preset_env::Mode::Entry),
                    ..Default::default()
                }),
                ..Default::default()
            },
            ..Default::default()
        },
    )
    .unwrap();
    println!("{}", f);

    assert!(
        !f.contains("'core-js'"),
        "import of `core-js` should be transformed"
    );
}

#[test]
fn issue_801() {
    let f = file("tests/projects/issue-801/input.ts").unwrap();
    println!("{}", f);

    assert!(!f.contains("function delete"));
}

#[test]
#[ignore]
fn concurrency() {
    par_project("tests/deno-unit");
}

#[test]
fn issue_879() {
    let f = file_with_opt(
        "tests/projects/issue-879/input.ts",
        Options {
            is_module: true,
            config: Config {
                env: Some(Default::default()),
                module: Some(ModuleConfig::CommonJs(Default::default())),
                jsc: JscConfig {
                    syntax: Some(Syntax::Typescript(TsConfig {
                        tsx: true,
                        decorators: true,
                        ..Default::default()
                    })),
                    transform: Some(TransformConfig {
                        legacy_decorator: true,
                        ..Default::default()
                    }),
                    ..Default::default()
                },
                ..Default::default()
            },
            ..Default::default()
        },
    )
    .unwrap();
    println!("{}", f);

    assert!(f.find("function X").is_some(), "swc should compile class");
    assert_eq!(
        f.find("function X"),
        f.rfind("function X"),
        "swc should not emit `function X` twice"
    );
}

#[test]
fn issue_895() {
    let f = file("tests/projects/issue-895/input.ts").unwrap();
    println!("{}", f);

    assert!(f.contains("_url ="));
    assert!(f.contains("(0, _url).queryString"));
    let s = f.replace("_url =", "").replace("_url.queryString", "");

    assert!(!s.contains("_url."));
    assert!(!s.contains("_url,"));
}

#[test]
fn issue_1052() {
    let f = file("tests/projects/issue-1052/input.ts").unwrap();
    println!("{}", f);

    assert!(!f.contains("_new"))
}

#[test]
fn issue_1203() {
    let f = file("tests/projects/issue-1203/input.js").unwrap();
    println!("{}", f);

    assert!(!f.contains("return //"))
}

#[test]
fn codegen_1() {
    let f = file("tests/projects/codegen-1/input.js").unwrap();
    println!("{}", f);

    assert_eq!(f.to_string(), "\"\\\"\";\n");
}

#[test]
fn issue_1549() {
    let output = str_with_opt(
        "const a = `\r\n`;",
        Options {
            is_module: true,
            config: Config {
                jsc: JscConfig {
                    target: Some(EsVersion::Es2015),
                    ..Default::default()
                },
                ..Default::default()
            },
            ..Default::default()
        },
    )
    .unwrap();
    println!("{}", output);

    assert_eq!(output.to_string(), "var a = \"\\n\";\n");
}

#[testing::fixture("fixture/**/input/")]
fn tests(dir: PathBuf) {
    let output = dir.parent().unwrap().join("output");
    let _ = create_dir_all(&output);

    Tester::new()
        .print_errors(|cm, handler| {
            let c = Compiler::new(cm.clone(), Arc::new(handler));

            for entry in WalkDir::new(&dir) {
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
                    Ok(v) => {
                        NormalizedOutput::from(v.code)
                            .compare_to_file(output.join(entry.file_name()))
                            .unwrap();

                        let map = v.map.map(|json| {
                            let json: serde_json::Value = serde_json::from_str(&json).unwrap();
                            serde_json::to_string_pretty(&json).unwrap()
                        });

                        NormalizedOutput::from(map.unwrap_or_default())
                            .compare_to_file(
                                output
                                    .join(entry.path().with_extension("map").file_name().unwrap()),
                            )
                            .unwrap();
                    }
                    Err(ref err) if format!("{:?}", err).contains("not matched") => {}
                    Err(err) => panic!("Error: {:?}", err),
                }
            }

            Ok(())
        })
        .map(|_| ())
        .expect("failed");
}
