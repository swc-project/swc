use std::path::PathBuf;
use swc_common::errors::ColorConfig;
use swc_common::errors::Handler;
use swc_common::sync::Lrc;
use swc_common::SourceMap;
use swc_ecma_ast::*;
use swc_ecma_codegen::text_writer::JsWriter;
use swc_ecma_codegen::Emitter;
use swc_ecma_parser::lexer::input::SourceFileInput;
use swc_ecma_parser::lexer::Lexer;
use swc_ecma_parser::Parser;
use walkdir::WalkDir;

/// Tests ported from uglifyjs.
#[allow(dead_code)]
#[testing::fixture("uglifyjs/**/input.js")]
fn uglify_js(path: PathBuf) {}

/// Generate tests using uglify js.
#[test]
#[ignore = "It's a script to update tests and it's not a test"]
fn update_uglifyjs_tests() {
    testing::run_test(false, |cm, _| {
        let handler = Handler::with_tty_emitter(ColorConfig::Always, true, false, Some(cm.clone()));
        // Walk uglifyjs test directories.
        let root = PathBuf::from(env!("CARGO_MANIFEST_DIR").to_string())
            .join("..")
            .join("..")
            .join("vendor")
            .join("UglifyJS")
            .join("test")
            .join("compress")
            .canonicalize()
            .unwrap();

        eprintln!("Loading tests from {}", root.display());

        for entry in WalkDir::new(&root) {
            let entry = entry.unwrap();
            if entry.file_type().is_dir() {
                continue;
            }
            let path = entry.path();
            let path_str = path.to_string_lossy();
            // Useless
            if path_str.contains("tools") || !path_str.ends_with(".js") {
                continue;
            }
            // Parser bug
            if path_str.contains("async.js")
                || path_str.contains("const.js")
                || path_str.contains("let.js")
            {
                continue;
            }
            let rel_path = path.strip_prefix(&root).unwrap().to_path_buf();

            let fm = cm.load_file(&path).unwrap();
            let lexer = Lexer::new(
                Default::default(),
                Default::default(),
                SourceFileInput::from(&*fm),
                None,
            );
            let mut parser = Parser::new_from(lexer);
            let file = parser.parse_script().unwrap_or_else(|err| {
                err.into_diagnostic(&handler).emit();
                panic!(
                    "failed to parser test source as object\nFile: {}",
                    path.display(),
                )
            });

            for test_case in file.body {
                let test_case = test_case.labeled().expect("Expected a labeled statement");
                let test_name = test_case.label;
                let test_def = test_case.body.block().expect("Expected a block statement");

                let dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
                    .join("tests")
                    .join("uglifyjs")
                    .join("compress")
                    .join(&rel_path.with_extension(""))
                    .join(&*test_name.sym);

                // codegne issues.
                if test_name.sym == *"keep_name_of_setter"
                    || test_name.sym == *"unsafe_object_accessor"
                {
                    continue;
                }

                eprintln!("Writing test to  {}", dir.display());

                let _ = std::fs::create_dir_all(&dir);

                let mut input = None;
                let mut expect = None;
                let mut expect_exact = None;
                let mut stdout = None;
                let mut warnings = None;
                for test_config in test_def.stmts {
                    match test_config {
                        Stmt::Labeled(data) => match &*data.label.sym {
                            "input" => {
                                assert_eq!(input, None);
                                input = Some(data.body);
                            }
                            "expect" => {
                                assert_eq!(expect, None);
                                expect = Some(print(
                                    cm.clone(),
                                    &data
                                        .body
                                        .block()
                                        .unwrap_or_else(|| {
                                            panic!(
                                                "Output is not defined for {} -> {}",
                                                rel_path.display(),
                                                test_name.sym
                                            )
                                        })
                                        .stmts,
                                ));
                            }
                            "expect_exact" => {
                                assert_eq!(expect_exact, None);
                                let expr_stmt = data.body.expect_expr();
                                match *expr_stmt.expr {
                                    Expr::Lit(lit) => {
                                        expect_exact = Some(match lit {
                                            Lit::Str(s) => s.value.to_string(),
                                            _ => {
                                                unreachable!()
                                            }
                                        });
                                    }
                                    Expr::Array(arr) => {
                                        let mut buf = String::new();
                                        for elem in arr.elems {
                                            let lit = elem.unwrap().expr.expect_lit();
                                            match lit {
                                                Lit::Str(s) => {
                                                    buf.push_str(&s.value);
                                                    buf.push('\n');
                                                }
                                                _ => {
                                                    unreachable!()
                                                }
                                            }
                                        }

                                        expect_exact = Some(buf);
                                    }
                                    _ => unreachable!("{:?}", expr_stmt.expr),
                                }
                            }
                            "expect_stdout" => {
                                assert_eq!(stdout, None);
                                stdout = Some(print(cm.clone(), &[data.body]));
                            }

                            "expect_warnings" => {
                                assert_eq!(warnings, None);
                                warnings = Some(print(cm.clone(), &[data.body]));
                            }

                            "node_version" => {
                                // ignore
                            }

                            _ => {
                                panic!("unknown label: {}", data.label.sym)
                            }
                        },
                        Stmt::Expr(expr_stmt) => match *expr_stmt.expr {
                            Expr::Assign(_) => {
                                // TOOD: Auto-gerate options
                            }
                            Expr::Seq(_) => {
                                // TOOD: Auto-gerate options
                            }
                            _ => unreachable!("{:?}", expr_stmt.expr),
                        },
                        Stmt::Empty(..) => {}
                        _ => unreachable!("{:?}", test_config),
                    }
                }

                let input = input.unwrap().block().unwrap().stmts;

                let input_str = print(cm.clone(), &input);

                std::fs::write(&dir.join("input.js"), input_str).expect("failed to write input.js");

                if let Some(s) = expect {
                    std::fs::write(&dir.join("output.js"), s).expect("failed to write input.js");
                }

                if let Some(s) = expect_exact {
                    std::fs::write(&dir.join("expect_exact.js"), s)
                        .expect("failed to write input.js");
                }
            }
        }

        Ok(())
    })
    .unwrap();
}

fn print<N: swc_ecma_codegen::Node>(cm: Lrc<SourceMap>, n: &[N]) -> String {
    let mut buf = vec![];

    {
        let mut emitter = Emitter {
            cfg: Default::default(),
            cm: cm.clone(),
            comments: None,
            wr: Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None)),
        };

        for n in n {
            n.emit_with(&mut emitter).unwrap();
        }
    }

    String::from_utf8(buf).unwrap()
}
