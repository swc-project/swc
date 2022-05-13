use std::{
    fs::create_dir_all,
    path::{Path, PathBuf},
};

use rayon::prelude::*;
use swc::{
    config::{
        BuiltInput, Config, IsModule, JscConfig, ModuleConfig, Options, SourceMapsConfig,
        TransformConfig,
    },
    Compiler, TransformOutput,
};
use swc_common::{
    chain,
    comments::{Comment, SingleThreadedComments},
    errors::HANDLER,
    BytePos, FileName,
};
use swc_ecma_ast::{EsVersion, *};
use swc_ecma_parser::{EsConfig, Syntax, TsConfig};
use swc_ecma_transforms::{
    helpers::{self, Helpers},
    pass::noop,
};
use swc_ecma_visit::{Fold, FoldWith};
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
        let c = Compiler::new(cm.clone());

        let fm = cm
            .load_file(Path::new(filename))
            .expect("failed to load file");
        let s = c.process_js_file(
            fm,
            &handler,
            &Options {
                is_module: IsModule::Bool(true),
                ..options
            },
        );

        match s {
            Ok(v) => {
                if handler.has_errors() {
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
    compile_str(FileName::Anon, content, options).map(|v| v.code.into())
}

fn compile_str(
    filename: FileName,
    content: &str,
    options: Options,
) -> Result<TransformOutput, StdErr> {
    Tester::new().print_errors(|cm, handler| {
        let c = Compiler::new(cm.clone());

        let fm = cm.new_source_file(filename, content.to_string());
        let s = c.process_js_file(
            fm,
            &handler,
            &Options {
                is_module: IsModule::Bool(true),
                ..options
            },
        );

        match s {
            Ok(v) => {
                if handler.has_errors() {
                    Err(())
                } else {
                    Ok(v)
                }
            }
            Err(err) => panic!("Error: {:?}", err),
        }
    })
}

fn project(dir: &str) {
    Tester::new()
        .print_errors(|cm, handler| {
            let c = Compiler::new(cm.clone());

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

                if c.read_config(
                    &Options {
                        swcrc: true,
                        is_module: IsModule::Bool(true),

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
                    &handler,
                    &Options {
                        swcrc: true,
                        is_module: IsModule::Bool(true),

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
            let c = Compiler::new(cm.clone());

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
                    &handler,
                    &Options {
                        swcrc: true,
                        is_module: IsModule::Bool(true),
                        source_maps: Some(SourceMapsConfig::Bool(true)),
                        ..Default::default()
                    },
                );
            });

            if handler.has_errors() {
                Err(())
            } else {
                Ok(())
            }
        })
        .map(|_| ())
        .expect("");
}

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

    assert!(s.contains("import * as _Foo from \"bar\";"));
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

    assert!(s.contains("return("));
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

    assert!(s.replace(' ', "").contains("return/*#__PURE__*/"));
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
        .replace(' ', "");
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
        .replace(' ', "");
    let f = f.trim();

    println!("{}", f);

    assert_eq!(f.lines().count(), 83);
}

#[test]
fn env_entry_chrome_71() {
    let f = file("tests/env/entry/chrome-71/input.js")
        .unwrap()
        .replace(' ', "");
    let f = f.trim();

    println!("{}", f);

    assert_eq!(f.lines().count(), 9);
}

#[test]
fn env_query_chrome_71() {
    let f = file("tests/env/query/chrome-71/input.js")
        .unwrap()
        .replace(' ', "");
    let f = f.trim();

    println!("{}", f);

    assert_eq!(f.lines().count(), 9);
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

    assert!(f.contains("require(\"core-js/modules/es.array-buffer.constructor.js\");"))
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
    assert!(f.contains("require(\"core-js/modules/es.array-buffer.constructor.js\");"))
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
            is_module: IsModule::Bool(true),
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
                        legacy_decorator: true.into(),
                        ..Default::default()
                    })
                    .into(),
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

    assert_eq!(f.to_string(), "'\"';\n");
}

#[test]
fn issue_1549() {
    let output = str_with_opt(
        "const a = `\r\n`;",
        Options {
            is_module: IsModule::Bool(true),
            config: Config {
                jsc: JscConfig {
                    target: Some(EsVersion::Es5),
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

#[test]
fn deno_10282_1() {
    let output = str_with_opt(
        "const a = `\r\n`;",
        Options {
            is_module: IsModule::Bool(true),
            config: Config {
                jsc: JscConfig {
                    target: Some(EsVersion::Es3),
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

#[test]
fn deno_10282_2() {
    let output = str_with_opt(
        "const a = `\r\n`;",
        Options {
            is_module: IsModule::Bool(true),
            config: Config {
                jsc: JscConfig {
                    target: Some(EsVersion::Es2020),
                    ..Default::default()
                },
                ..Default::default()
            },
            ..Default::default()
        },
    )
    .unwrap();
    println!("{}", output);

    assert_eq!(output.to_string(), "const a = `\n`;\n");
}

struct Panicking;

impl Fold for Panicking {
    fn fold_jsx_opening_element(&mut self, node: JSXOpeningElement) -> JSXOpeningElement {
        let JSXOpeningElement { name, .. } = &node;
        println!("HMM");

        if let JSXElementName::Ident(Ident { sym, .. }) = name {
            panic!("visited: {}", sym)
        }

        JSXOpeningElement { ..node }
    }
}

#[test]
#[should_panic = "visited"]
fn should_visit() {
    Tester::new()
        .print_errors(|cm, handler| {
            let c = Compiler::new(cm.clone());

            let fm = cm.new_source_file(
                FileName::Anon,
                "
                    import React from 'react';
                    const comp = () => <amp-something className='something' />;
                "
                .into(),
            );
            let comments = SingleThreadedComments::default();
            let config = c
                .parse_js_as_input(
                    fm.clone(),
                    None,
                    &handler,
                    &swc::config::Options {
                        is_module: IsModule::Bool(true),
                        config: swc::config::Config {
                            jsc: JscConfig {
                                syntax: Some(Syntax::Es(EsConfig {
                                    jsx: true,
                                    ..Default::default()
                                })),
                                ..Default::default()
                            },
                            ..Default::default()
                        },
                        ..Default::default()
                    },
                    &fm.name,
                    Some(&comments),
                    |_| noop(),
                )
                .unwrap()
                .unwrap();

            dbg!(config.syntax);

            let config = BuiltInput {
                program: config.program,
                pass: chain!(Panicking, config.pass),
                syntax: config.syntax,
                target: config.target,
                minify: config.minify,
                external_helpers: config.external_helpers,
                source_maps: config.source_maps,
                input_source_map: config.input_source_map,
                is_module: config.is_module,
                output_path: config.output_path,
                source_file_name: config.source_file_name,
                preserve_comments: config.preserve_comments,
                inline_sources_content: config.inline_sources_content,
                comments: config.comments,
                emit_source_map_columns: config.emit_source_map_columns,
            };

            if config.minify {
                let preserve_excl = |_: &BytePos, vc: &mut Vec<Comment>| -> bool {
                    vc.retain(|c: &Comment| c.text.starts_with('!'));
                    !vc.is_empty()
                };
                c.comments().leading.retain(preserve_excl);
                c.comments().trailing.retain(preserve_excl);
            }
            let mut pass = config.pass;
            let program = config.program;
            let program = helpers::HELPERS.set(&Helpers::new(config.external_helpers), || {
                HANDLER.set(&handler, || {
                    // Fold module
                    program.fold_with(&mut pass)
                })
            });

            Ok(c.print(
                &program,
                None,
                config.output_path,
                config.inline_sources_content,
                config.target,
                config.source_maps,
                &Default::default(),
                None,
                // TODO: figure out sourcemaps
                config.minify,
                Some(&comments),
                config.emit_source_map_columns,
            )
            .unwrap()
            .code)
        })
        .unwrap();
}

#[testing::fixture("tests/fixture/**/input/")]
#[testing::fixture("tests/vercel/**/input/")]
fn tests(input_dir: PathBuf) {
    let output = input_dir.parent().unwrap().join("output");

    Tester::new()
        .print_errors(|cm, handler| {
            let c = Compiler::new(cm.clone());

            for entry in WalkDir::new(&input_dir) {
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

                let rel_path = entry
                    .path()
                    .strip_prefix(&input_dir)
                    .expect("failed to strip prefix");

                let fm = cm.load_file(entry.path()).expect("failed to load file");
                match c.process_js_file(
                    fm,
                    &handler,
                    &Options {
                        swcrc: true,
                        is_module: IsModule::Bool(true),
                        output_path: Some(output.join(entry.file_name())),
                        config: Config {
                            jsc: JscConfig {
                                external_helpers: true.into(),
                                ..Default::default()
                            },
                            ..Default::default()
                        },

                        ..Default::default()
                    },
                ) {
                    Ok(v) => {
                        NormalizedOutput::from(v.code)
                            .compare_to_file(output.join(rel_path))
                            .unwrap();

                        let _ = create_dir_all(output.join(rel_path).parent().unwrap());

                        let map = v.map.map(|json| {
                            let json: serde_json::Value = serde_json::from_str(&json).unwrap();
                            serde_json::to_string_pretty(&json).unwrap()
                        });

                        NormalizedOutput::from(map.unwrap_or_default())
                            .compare_to_file(
                                output.join(rel_path.with_extension("map").file_name().unwrap()),
                            )
                            .unwrap();
                    }
                    Err(ref err) if format!("{:?}", err).contains("not matched") => {}
                    Err(ref err) if format!("{:?}", err).contains("Syntax Error") => return Err(()),
                    Err(err) => panic!("Error: {:?}", err),
                }
            }

            Ok(())
        })
        .map(|_| ())
        .expect("failed");
}

#[test]
fn issue_1984() {
    testing::run_test2(false, |cm, handler| {
        let c = Compiler::new(cm);
        let fm = c.cm.new_source_file(
            FileName::Anon,
            "
            function Set() {}
            function useSelection(selectionType, derivedHalfSelectedKeys) {
                return selectionType === 'radio'
                    ? new Set()
                    : new Set(derivedHalfSelectedKeys);
            }
            "
            .into(),
        );

        c.minify(fm, &handler, &serde_json::from_str("{}").unwrap())
            .unwrap();

        Ok(())
    })
    .unwrap()
}

#[test]
fn opt_source_file_name_1() {
    let map = compile_str(
        FileName::Real(PathBuf::from("not-unique.js")),
        "import Foo from 'foo';",
        Options {
            filename: "unique.js".into(),
            source_file_name: Some("entry-foo".into()),
            source_maps: Some(SourceMapsConfig::Bool(true)),
            ..Default::default()
        },
    )
    .unwrap()
    .map
    .unwrap();

    println!("{}", map);

    assert!(map.contains("entry-foo"));
}

#[test]
fn issue_2224() {
    let output = str_with_opt(
        r#"
        const Injectable = () => {};

        @Injectable
        export class TestClass {
            private readonly property = TestClass.name;
        }"#,
        Options {
            is_module: IsModule::Bool(true),
            config: Config {
                jsc: JscConfig {
                    syntax: Some(Syntax::Typescript(TsConfig {
                        decorators: true,
                        ..Default::default()
                    })),
                    ..Default::default()
                },
                ..Default::default()
            },
            ..Default::default()
        },
    )
    .unwrap();
    println!("{}", output);

    assert!(output.contains("this.property = TestClass.name"));
}

#[test]
fn bom() {
    project("tests/projects/bom")
}
#[test]
fn json_schema() {
    project("tests/projects/json-schema")
}
