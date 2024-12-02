use std::{
    env::current_dir,
    fs::create_dir_all,
    path::{Path, PathBuf},
};

use anyhow::Context;
use rayon::prelude::*;
use swc::{
    config::{
        Config, FileMatcher, JsMinifyOptions, JscConfig, ModuleConfig, Options, Paths,
        SourceMapsConfig, TransformConfig,
    },
    try_with_handler, BoolOrDataConfig, Compiler, TransformOutput,
};
use swc_common::{
    comments::{Comment, SingleThreadedComments},
    errors::{EmitterWriter, Handler, HANDLER},
    sync::Lrc,
    BytePos, FileName, Globals, SourceMap, GLOBALS,
};
use swc_compiler_base::{IsModule, PrintArgs};
use swc_ecma_ast::*;
use swc_ecma_minifier::option::MangleOptions;
use swc_ecma_parser::{EsSyntax, Syntax, TsSyntax};
use swc_ecma_transforms::helpers::{self, Helpers};
use swc_ecma_visit::{fold_pass, Fold};
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
        let s = c.process_js_file(fm, &handler, &options);

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
    compile_str(
        if options.filename.is_empty() {
            FileName::Anon.into()
        } else {
            FileName::Real(PathBuf::from(&options.filename)).into()
        },
        content,
        options,
    )
    .map(|v| v.code.into())
}

fn compile_str(
    filename: Lrc<FileName>,
    content: &str,
    options: Options,
) -> Result<TransformOutput, StdErr> {
    Tester::new().print_errors(|cm, handler| {
        let c = Compiler::new(cm.clone());

        let fm = cm.new_source_file(filename, content.to_string());
        let s = c.process_js_file(fm, &handler, &options);

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
                        config: Default::default(),
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

    assert!(s.contains("function _interop_require_default"));
    assert!(s.contains("_interop_require_default(require(\"foo\"))"));
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
    assert!(s2.contains("__esModule"));
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
//baz
b
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

    assert_eq!(f.lines().count(), 84);
}

#[test]
fn env_entry_chrome_71() {
    let f = file("tests/env/entry/chrome-71/input.js")
        .unwrap()
        .replace(' ', "");
    let f = f.trim();

    println!("{}", f);

    assert_eq!(f.lines().count(), 10);
}

#[test]
fn env_query_chrome_71() {
    let f = file("tests/env/query/chrome-71/input.js")
        .unwrap()
        .replace(' ', "");
    let f = f.trim();

    println!("{}", f);

    assert_eq!(f.lines().count(), 10);
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

    assert!(f.contains(r#"_export_star(require("c"), exports);"#));
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
            config: Config {
                env: Some(Default::default()),
                module: Some(ModuleConfig::CommonJs(Default::default())),
                jsc: JscConfig {
                    syntax: Some(Syntax::Typescript(TsSyntax {
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
    assert!(f.contains("(0, _url.queryString)"));
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
fn issue_9663() {
    let f = file("tests/projects/issue-9663/input.js").unwrap();
    println!("{}", f);

    assert!(f.contains("set = Reflect.set"));
    assert!(!f.contains("function set1("));
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

        node
    }
}

#[test]
#[should_panic = "visited"]
fn should_visit() {
    Tester::new()
        .print_errors(|cm, handler| {
            let c = Compiler::new(cm.clone());

            let fm = cm.new_source_file(
                FileName::Anon.into(),
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
                        config: swc::config::Config {
                            jsc: JscConfig {
                                syntax: Some(Syntax::Es(EsSyntax {
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
                    |_| noop_pass(),
                )
                .unwrap()
                .unwrap();

            dbg!(config.syntax);

            let config = config.with_pass(|pass| (fold_pass(Panicking), pass));

            if config.minify {
                let preserve_excl = |_: &BytePos, vc: &mut Vec<Comment>| -> bool {
                    vc.retain(|c: &Comment| c.text.starts_with('!'));
                    !vc.is_empty()
                };
                c.comments().leading.retain(preserve_excl);
                c.comments().trailing.retain(preserve_excl);
            }
            let pass = config.pass;
            let program = config.program;
            let program = helpers::HELPERS.set(&Helpers::new(config.external_helpers), || {
                HANDLER.set(&handler, || {
                    // Fold module
                    program.apply(pass)
                })
            });

            Ok(c.print(
                &program,
                PrintArgs {
                    source_root: None,
                    source_file_name: None,
                    output_path: config.output_path,
                    inline_sources_content: config.inline_sources_content,
                    source_map: config.source_maps,
                    orig: None,
                    // TODO: figure out sourcemaps
                    comments: Some(&comments),
                    emit_source_map_columns: config.emit_source_map_columns,
                    codegen_config: swc_ecma_codegen::Config::default()
                        .with_target(config.target)
                        .with_minify(config.minify),
                    ..Default::default()
                },
            )
            .unwrap()
            .code)
        })
        .unwrap();
}

#[testing::fixture("tests/fixture/**/input/")]
#[testing::fixture("tests/vercel/**/input/")]
fn fixture(input_dir: PathBuf) {
    tests(input_dir, Some(IsModule::Unknown));
}

#[testing::fixture("tests/typescript/**/input/")]
fn ts_id(input_dir: PathBuf) {
    tests(input_dir, Some(IsModule::Bool(true)));
}

fn tests(input_dir: PathBuf, is_module: Option<IsModule>) {
    let output_dir = input_dir.parent().unwrap().join("output");

    for entry in WalkDir::new(&input_dir) {
        let entry = entry.unwrap();

        let errors = Tester::new().print_errors(|cm, handler| {
            let c = Compiler::new(cm.clone());

            if entry.metadata().unwrap().is_dir() {
                return Ok(());
            }
            println!("File: {}", entry.path().to_string_lossy());

            if !entry.file_name().to_string_lossy().ends_with(".ts")
                && !entry.file_name().to_string_lossy().ends_with(".js")
                && !entry.file_name().to_string_lossy().ends_with(".jsx")
                && !entry.file_name().to_string_lossy().ends_with(".tsx")
            {
                return Ok(());
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
                    output_path: Some(output_dir.join(entry.file_name())),
                    config: Config {
                        jsc: JscConfig {
                            external_helpers: true.into(),
                            ..Default::default()
                        },
                        is_module,
                        ..Default::default()
                    },

                    ..Default::default()
                },
            ) {
                Ok(v) => {
                    NormalizedOutput::from(v.code)
                        .compare_to_file(output_dir.join(rel_path))
                        .unwrap();

                    let _ = create_dir_all(output_dir.join(rel_path).parent().unwrap());

                    let map = v.map.map(|json| {
                        let json: serde_json::Value = serde_json::from_str(&json).unwrap();
                        serde_json::to_string_pretty(&json).unwrap()
                    });

                    NormalizedOutput::from(map.unwrap_or_default())
                        .compare_to_file(
                            output_dir.join(rel_path.with_extension("map").file_name().unwrap()),
                        )
                        .unwrap();

                    if let Some(extra) = v.output {
                        let mut value: serde_json::Map<_, serde_json::Value> =
                            serde_json::from_str(&extra).unwrap();

                        if let Some(v) = value.remove("__swc_isolated_declarations__") {
                            let code = v
                                .as_str()
                                .expect("isolated declaration pass should emit string");

                            NormalizedOutput::from(code.to_string())
                                .compare_to_file(output_dir.join(rel_path).with_extension("d.ts"))
                                .unwrap();
                        }

                        if !value.is_empty() {
                            let extra = serde_json::to_string_pretty(&value).unwrap();

                            NormalizedOutput::from(extra)
                                .compare_to_file(
                                    output_dir.join(rel_path.with_extension("extra.json")),
                                )
                                .unwrap();
                        }
                    }
                }
                Err(ref err) if format!("{:?}", err).contains("not matched") => {}
                Err(ref err) if format!("{:?}", err).contains("Syntax Error") => return Err(()),
                Err(err) => panic!("Error: {:?}", err),
            }
            if handler.has_errors() {
                Err(())
            } else {
                Ok(())
            }
        });

        if let Err(err) = errors {
            err.compare_to_file(output_dir.join(entry.path().with_extension("swc-stderr")))
                .unwrap();
        }
    }
}

#[test]
fn issue_1984() {
    testing::run_test2(false, |cm, handler| {
        let c = Compiler::new(cm);
        let fm = c.cm.new_source_file(
            FileName::Anon.into(),
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

        c.minify(
            fm,
            &handler,
            &serde_json::from_str("{}").unwrap(),
            Default::default(),
        )
        .unwrap();

        Ok(())
    })
    .unwrap()
}
//
#[test]
fn opt_source_file_name_1() {
    let map = compile_str(
        FileName::Real(PathBuf::from("not-unique.js")).into(),
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
            config: Config {
                jsc: JscConfig {
                    syntax: Some(Syntax::Typescript(TsSyntax {
                        decorators: true,
                        ..Default::default()
                    })),
                    transform: Some(TransformConfig {
                        use_define_for_class_fields: false.into(),
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

#[test]
fn issue_6009() {
    // any of the files to not be excluded should contains
    // `export function hello(){`
    let files_to_not_excludes = ["input.ts"];
    // file to be excluded should contain the pattern `.*.spec.ts`
    let files_to_exclude = ["input.spec.ts"];

    testing::run_test2(false, |cm, handler| {
        let c = swc::Compiler::new(cm.clone());

        let get_fm = |file_name: &str| {
            let full_path_str = format!("{}{}", "tests/projects/issue-6009/", file_name);
            let file_path = Path::new(&full_path_str);
            cm.load_file(file_path).expect("failed to load file")
        };

        let get_options = |exclude: Option<FileMatcher>| Options {
            config: Config {
                exclude,
                jsc: JscConfig {
                    syntax: Some(Syntax::Typescript(Default::default())),
                    ..Default::default()
                },
                ..Default::default()
            },
            ..Default::default()
        };

        for file in files_to_not_excludes {
            let result = c.process_js_file(
                get_fm(file),
                &handler,
                &get_options(Some(FileMatcher::Regex(".*\\.spec.ts$".into()))),
            );

            match result {
                Ok(r) => {
                    assert!(
                        r.code.contains("export function hello() {"),
                        "Failed to compile! it doesn't contain the right code! `export function \
                         hello() {{`"
                    );
                }
                Err(out) => panic!("Failed to compile where it should not!\nErr:{:?}", out),
            }
        }

        for file in files_to_exclude {
            let fm = get_fm(file);
            let options = get_options(Some(FileMatcher::Regex(".*\\.spec.ts$".into())));

            let result = c.process_js_file(fm.clone(), &handler, &options);

            match result {
                Ok(out) => {
                    panic!(
                        "Expected to return an error because the file is being excluded. And that \
                         didn't happen!\nTransformOutput: {:?}",
                        out
                    );
                }
                Err(err) => {
                    let expected_error_msg = "cannot process file because";

                    assert!(
                        err.to_string().contains(expected_error_msg),
                        "Not expected error! received: {}, expected: {}",
                        &err.to_string(),
                        expected_error_msg
                    )
                }
            }

            // test parsing input
            let config = c
                .parse_js_as_input(fm.clone(), None, &handler, &options, &fm.name, None, |_| {
                    noop_pass()
                })
                .unwrap();

            assert!(
                config.is_none(),
                "config should be None when file excluded. But got a no None value instead!"
            );
        }

        Ok(())
    })
    .unwrap()
}

#[test]
fn issue_7513_1() {
    static TEST_CODE: &str = r#"
function test() {
    return {
        a: 1,
        b: 2,
        c: 3,
    }
}
"#;

    let globals = Globals::default();
    let cm: Lrc<SourceMap> = Default::default();
    let compiler = Compiler::new(cm.clone());
    let handler = Handler::with_emitter(
        true,
        false,
        Box::new(EmitterWriter::new(
            Box::new(std::io::stderr()),
            None,
            false,
            false,
        )),
    );

    GLOBALS.set(&globals, || {
        let fm = cm.new_source_file(
            FileName::Custom(String::from("Test")).into(),
            TEST_CODE.to_string(),
        );
        let options = Options {
            config: Config {
                jsc: JscConfig {
                    target: Some(EsVersion::Es2022),
                    minify: Some(JsMinifyOptions {
                        compress: BoolOrDataConfig::from_bool(false),
                        mangle: BoolOrDataConfig::from_bool(true),
                        ..Default::default()
                    }),
                    ..Default::default()
                },
                minify: true.into(),
                ..Default::default()
            },
            ..Default::default()
        };
        let program = compiler.process_js_file(fm, &handler, &options).unwrap();

        eprintln!("{}", program.code);
        assert_eq!(program.code, "function n(){return{a:1,b:2,c:3}}");
    })
}

#[test]
fn issue_7513_2() {
    static INPUT: &str = "export const cachedTextDecoder = { ignoreBOM: true, fatal: true };";

    let cm = Lrc::<SourceMap>::default();
    let c = swc::Compiler::new(cm.clone());
    let output = GLOBALS
        .set(&Default::default(), || {
            try_with_handler(cm.clone(), Default::default(), |handler| {
                let fm = cm.new_source_file(FileName::Anon.into(), INPUT.to_string());

                c.minify(
                    fm,
                    handler,
                    &JsMinifyOptions {
                        module: IsModule::Bool(true),
                        compress: BoolOrDataConfig::from_bool(true),
                        mangle: BoolOrDataConfig::from_obj(MangleOptions {
                            props: None,
                            top_level: Some(true),
                            keep_class_names: false,
                            keep_fn_names: false,
                            keep_private_props: false,
                            ..Default::default()
                        }),
                        keep_classnames: false,
                        keep_fnames: false,
                        toplevel: Some(true),
                        ..Default::default()
                    },
                    Default::default(),
                )
                .context("failed to minify")
            })
        })
        .unwrap();

    println!("{}", output.code);
    assert_eq!(
        output.code,
        "export const cachedTextDecoder={ignoreBOM:!0,fatal:!0};"
    );
}

#[test]
fn issue_8674_1() {
    static INPUT: &str = "import { foo } from 'src/foo'";

    let base_url = current_dir()
        .unwrap()
        .join("../../packages/core/tests/issue-8674")
        .canonicalize()
        .unwrap();

    dbg!(&base_url);

    let output = str_with_opt(
        INPUT,
        Options {
            config: Config {
                jsc: JscConfig {
                    base_url,
                    ..Default::default()
                },
                ..Default::default()
            },
            ..Default::default()
        },
    )
    .unwrap();
    println!("{}", output);

    assert_eq!(output.to_string(), "import { foo } from \"./src/foo\";\n");
}

#[test]
fn issue_8701_1() {
    static INPUT: &str = "import { AppController } from '@app/app.controller';
    import { AppService } from '@app/app.service';
    
    console.log(AppController, AppService);";

    let base_url = current_dir()
        .unwrap()
        .join("tests/projects/issue-8701")
        .canonicalize()
        .unwrap();

    dbg!(&base_url);

    let output = str_with_opt(
        INPUT,
        Options {
            filename: "src/app.module.ts".into(),
            config: Config {
                jsc: JscConfig {
                    base_url,
                    paths: {
                        let mut paths = Paths::default();
                        paths.insert("@app/*".into(), vec!["./src/*".into()]);
                        paths
                    },
                    ..Default::default()
                },
                ..Default::default()
            },
            ..Default::default()
        },
    )
    .unwrap();
    println!("{}", output);

    assert_eq!(
        output.to_string(),
        "import { AppController } from \"./app.controller\";\nimport { AppService } from \
         \"./app.service\";\nconsole.log(AppController, AppService);\n"
    );
}

#[testing::fixture("tests/minify/**/input.js")]
fn minify(input_js: PathBuf) {
    let input_dir = input_js.parent().unwrap();
    let config_json_path = input_dir.join("config.json");

    testing::run_test2(false, |cm, handler| {
        let c = Compiler::new(cm);
        let fm = c.cm.load_file(&input_js).unwrap();

        let config_str = std::fs::read_to_string(&config_json_path).unwrap();
        let mut config: JsMinifyOptions = serde_json::from_str(&config_str).unwrap();

        if config.source_map.inner().is_none() {
            config.source_map = BoolOrDataConfig::from_bool(true);
        }

        let output = c.minify(fm, &handler, &config, Default::default()).unwrap();

        NormalizedOutput::from(output.code)
            .compare_to_file(input_dir.join("output.js"))
            .unwrap();

        let map = output.map.map(|json| {
            let json: serde_json::Value = serde_json::from_str(&json).unwrap();
            serde_json::to_string_pretty(&json).unwrap()
        });

        NormalizedOutput::from(map.unwrap())
            .compare_to_file(input_dir.join("output.map"))
            .unwrap();

        Ok(())
    })
    .unwrap()
}
