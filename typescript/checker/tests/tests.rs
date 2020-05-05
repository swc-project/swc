#![recursion_limit = "256"]
#![feature(vec_remove_item)]
#![feature(box_syntax)]
#![feature(box_patterns)]
#![feature(specialization)]
#![feature(test)]

extern crate test;

use once_cell::sync::Lazy;
use serde::Deserialize;
use std::{
    collections::HashSet,
    env,
    fs::File,
    io::{self, Read},
    path::Path,
    sync::Arc,
};
use swc_common::{
    comments::Comments, errors::DiagnosticBuilder, FileName, Fold, FoldWith, Span, Spanned,
};
use swc_ecma_ast::{Module, *};
use swc_ecma_parser::{JscTarget, Parser, Session, SourceFileInput, Syntax, TsConfig};
use swc_ts_checker::{Lib, Rule};
use test::{test_main, DynTestFn, ShouldPanic::No, TestDesc, TestDescAndFn, TestName, TestType};
use testing::{StdErr, Tester};
use walkdir::WalkDir;

fn should_ignore(name: &str, content: &str) -> bool {
    // These tests are postponed because they are useless in real world.
    let postponed_tests = &[
        // Using such requires modifying global object.
        "extendBooleanInterface.ts",
        "extendNumberInterface.ts",
        "extendStringInterface.ts",
        "assignFromBooleanInterface2.ts",
        "assignFromNumberInterface2.ts",
        "assignFromStringInterface2.ts",
        "ES5SymbolProperty1.ts",
        "symbolType16.ts",
        // Ignored as this requires **using** eval.
        "scannerS7.2_A1.5_T2.ts",
        // Ignored just because it requires lots of work while being not important
        "parserTypeQuery8",
        "parserForInStatement2",
        "parserES5ForOfStatement2.ts",
        "parserES5ForOfStatement21.ts",
        "parserShorthandPropertyAssignment2.ts",
        "bitwiseNotOperatorInvalidOperations.ts",
        "negateOperatorInvalidOperations.ts",
        "plusOperatorInvalidOperations.ts",
        "logicalNotOperatorInvalidOperations.ts",
        "commaOperatorWithoutOperand.ts",
        "scannerNumericLiteral8.ts",
        "scannerS7.4_A2_T2.ts",
        //
        //
        // Temporarily ignored - inference of generic arguments is not implemented
        "invalidEnumAssignments.ts",
        "invalidAssignmentsToVoid.ts",
        "invalidVoidValues.ts",
        "invalidVoidAssignments.ts",
        "invalidBooleanAssignments.ts",
        "invalidNumberAssignments.ts",
        "invalidStringAssignments.ts",
        // Temporarily ignored - module system does not work while testing,
        "RealSource",
        "RealWorld",
        // Temporarily ignored - .d.ts tests are postponed.
        ".d.ts",
        // Ignored - Errors reported vscode / typescript playground does not match errors.json
        "parserStrictMode8.ts",
        "wideningTuples7.ts",
        // Temporarily ignored - overloading is not implemented yet
        "parserParameterList15",
        "parserParameterList16",
        "parserParameterList17",
        // Temporarily ignored - scope analysis is not implemented yet
        "symbolProperty11.ts",
        // Temporarily ignored - libraries for es2019 is not included yet (to reduce compile time)
        "parserArrowFunctionExpression7.ts",
        // Temporarily ignored - we need to determine enum handling logic.
        "negateOperatorWithEnumType.ts",
        "bitwiseNotOperatorWithEnumType.ts",
        "deleteOperatorWithEnumType.ts",
        // Temporarily ignored - needs changing ast types
        // See: https://github.com/swc-project/swc/issues/597
        "parserES5ComputedPropertyName5.ts",
        "parserES5ComputedPropertyName8.ts",
        "parserComputedPropertyName8.ts",
    ];

    if postponed_tests.iter().any(|p| name.contains(p)) {
        return true;
    }

    if IGNORED.iter().any(|p| *p == name) {
        return true;
    }

    if env::var("TEST").ok() == Some(String::from("DONE")) && DONE.contains(&&*name) {
        return false;
    }

    name.contains("circular")
        || name.contains(".d.ts")
        || content.contains("<reference path")
        || content.contains("@filename")
        || content.contains("@Filename")
        || content.contains("@module")
        || !name.starts_with(&env::var("TEST").ok().unwrap_or(String::from("")))
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
struct Error {
    pub line: usize,
    pub column: usize,
    pub msg: String,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Mode {
    Error,
    Pass,
    Conformance,
}

/// We are done and I don't want regression.
static DONE: Lazy<Vec<&'static str>> = Lazy::new(|| {
    let mut f = File::open(&format!("{}/tests/done.txt", env!("CARGO_MANIFEST_DIR")))
        .expect("failed to open file");
    let mut s = String::new();
    f.read_to_string(&mut s).expect("failed to read file");
    s.lines()
        .filter(|s| *s != "")
        .map(String::from)
        .map(|s| &*Box::leak(s.into_boxed_str()))
        .collect::<Vec<_>>()
});

/// We are done and I don't want regression.
static IGNORED: Lazy<Vec<&'static str>> = Lazy::new(|| {
    let mut f = File::open(&format!(
        "{}/tests/ignored-parser-recovery-tests.txt",
        env!("CARGO_MANIFEST_DIR")
    ))
    .expect("failed to open file");
    let mut s = String::new();
    f.read_to_string(&mut s).expect("failed to read file");
    s.lines()
        .filter(|s| *s != "")
        .map(String::from)
        .map(|s| &*Box::leak(s.into_boxed_str()))
        .collect::<Vec<_>>()
});

#[test]
#[ignore] // I copied (and splitted) all tests from conformance to `fixture`
fn conformance() {
    let args: Vec<_> = env::args().collect();
    let mut tests = Vec::new();
    add_tests(&mut tests, Mode::Conformance).unwrap();
    test_main(&args, tests, Default::default());
}

#[test]
fn passes() {
    let args: Vec<_> = env::args().collect();
    let mut tests = Vec::new();
    add_tests(&mut tests, Mode::Pass).unwrap();
    test_main(&args, tests, Default::default());
}

#[test]
fn errors() {
    let args: Vec<_> = env::args().collect();
    let mut tests = Vec::new();
    add_tests(&mut tests, Mode::Error).unwrap();
    test_main(&args, tests, Default::default());
}

fn add_tests(tests: &mut Vec<TestDescAndFn>, mode: Mode) -> Result<(), io::Error> {
    let test_kind = match mode {
        Mode::Error => "errors",
        Mode::Conformance => "conformance",
        Mode::Pass => "pass",
    };

    let root = {
        let mut root = Path::new(env!("CARGO_MANIFEST_DIR")).to_path_buf();
        root.push("tests");
        root.push(test_kind);

        root
    };

    eprintln!("Loading tests from {}", root.display());

    let dir = root;

    for entry in WalkDir::new(&dir).into_iter() {
        let entry = entry?;
        let is_ts = entry.file_name().to_string_lossy().ends_with(".ts")
            || entry.file_name().to_string_lossy().ends_with(".tsx");
        if entry.file_type().is_dir() || !is_ts {
            continue;
        }

        let is_not_index = !entry.file_name().to_string_lossy().ends_with("index.d.ts")
            && !entry.file_name().to_string_lossy().ends_with("index.ts")
            && !entry.file_name().to_string_lossy().ends_with("index.tsx");
        if is_not_index && mode != Mode::Conformance {
            continue;
        }

        let file_name = entry
            .path()
            .strip_prefix(&dir)
            .expect("failed to strip prefix")
            .to_str()
            .unwrap()
            .to_string();

        let input = {
            let mut buf = String::new();
            File::open(entry.path())?.read_to_string(&mut buf)?;
            buf
        };

        let test_name = file_name.replace("/", "::");
        let ignore = should_ignore(&test_name, &input);

        let dir = dir.clone();
        let name = format!("tsc-{}::{}", test_kind, test_name);
        add_test(tests, name, ignore, move || {
            if mode == Mode::Error || mode == Mode::Conformance {
                eprintln!(
                    "\n\n========== Running error reporting test {}\nSource:\n{}\n",
                    file_name, input
                );
            } else {
                eprintln!(
                    "\n\n========== Running test {}\nSource:\n{}\n",
                    file_name, input
                );
            }

            let path = dir.join(&file_name);
            do_test(false, &path, mode).unwrap();
        });
    }

    Ok(())
}

fn do_test(treat_error_as_bug: bool, file_name: &Path, mode: Mode) -> Result<(), StdErr> {
    let _ = env_logger::try_init();

    let fname = file_name.display().to_string();
    let mut ref_errors = match mode {
        Mode::Conformance => {
            let fname = file_name.file_name().unwrap();
            let errors_file =
                file_name.with_file_name(format!("{}.errors.json", fname.to_string_lossy()));
            if !errors_file.exists() {
                println!("errors file does not exists: {}", errors_file.display());
                Some(vec![])
            } else {
                let errors: Vec<Error> = serde_json::from_reader(
                    File::open(errors_file).expect("failed to open error sfile"),
                )
                .expect("failed to parse errors.txt.json");

                // TODO: Match column and message

                Some(
                    errors
                        .into_iter()
                        .map(|e| (e.line, e.column))
                        .collect::<Vec<_>>(),
                )
            }
        }
        _ => None,
    };
    let full_ref_errors = ref_errors.clone();
    let full_ref_err_cnt = full_ref_errors.as_ref().map(Vec::len).unwrap_or(0);

    let mut fm = None;
    let (libs, rule, ts_config, target) = ::testing::run_test(treat_error_as_bug, |cm, handler| {
        fm = Some(cm.load_file(file_name).expect("failed to read file"));

        Ok(match mode {
            Mode::Pass | Mode::Error => (
                vec![Lib::Es5],
                Default::default(),
                Default::default(),
                JscTarget::Es5,
            ),
            Mode::Conformance => {
                // We parse files twice. At first, we read comments and detect
                // configurations for following parse.

                let session = Session { handler: &handler };

                let comments = Comments::default();

                let fm = fm.clone().unwrap().clone();
                let mut parser = Parser::new(
                    session,
                    Syntax::Typescript(TsConfig {
                        tsx: fname.contains("tsx"),
                        ..Default::default()
                    }),
                    SourceFileInput::from(&*fm),
                    Some(&comments),
                );
                let mut target = JscTarget::default();

                let module = parser.parse_module().map_err(|mut e| {
                    e.emit();
                    ()
                })?;
                let module = if mode == Mode::Conformance {
                    make_test(&comments, module)
                } else {
                    module
                };

                let mut libs = vec![Lib::Es5];
                let mut rule = Rule::default();
                let ts_config = TsConfig::default();

                let span = module.span;
                let cmts = comments.leading_comments(span.lo());
                match cmts {
                    Some(ref cmts) => {
                        for cmt in cmts.iter() {
                            let s = cmt.text.trim();
                            if !s.starts_with("@") {
                                continue;
                            }
                            let s = &s[1..]; // '@'

                            if s.starts_with("target:") || s.starts_with("Target:") {
                                let s = s["target:".len()..].trim().to_lowercase();
                                target = match &*s {
                                    "es3" => JscTarget::Es3,
                                    "es5" => JscTarget::Es5,
                                    "es2015" => JscTarget::Es2015,
                                    "es6" => JscTarget::Es2015,
                                    "es2016" => JscTarget::Es2016,
                                    "es2017" => JscTarget::Es2017,
                                    "es2018" => JscTarget::Es2018,
                                    "es2019" => JscTarget::Es2019,
                                    "esnext" => JscTarget::Es2019,
                                    _ => unimplemented!("target: {:?}", s),
                                };
                                libs = match target {
                                    JscTarget::Es3 | JscTarget::Es5 => vec![Lib::Es5],
                                    JscTarget::Es2015 => Lib::load("es2015"),
                                    JscTarget::Es2016 => Lib::load("es2016"),
                                    JscTarget::Es2017 => Lib::load("es2017"),
                                    JscTarget::Es2018 => Lib::load("es2018"),
                                    JscTarget::Es2019 => Lib::load("es2019"),
                                };
                            } else if s.starts_with("strict:") {
                                let strict = s["strict:".len()..].trim().parse().unwrap();
                                rule.no_implicit_any = strict;
                                rule.no_implicit_this = strict;
                                rule.always_strict = strict;
                                rule.strict_null_checks = strict;
                                rule.strict_function_types = strict;
                            } else if s.starts_with("noLib:") {
                                let v = s["noLib:".len()..].trim().parse().unwrap();
                                if v {
                                    libs = vec![];
                                }
                            } else if s.starts_with("noImplicitAny:") {
                                let v = s["noImplicitAny:".len()..].trim().parse().unwrap();
                                rule.no_implicit_any = v;
                            } else if s.starts_with("noImplicitReturns:") {
                                let v = s["noImplicitReturns:".len()..].trim().parse().unwrap();
                                rule.no_implicit_returns = v;
                            } else if s.starts_with("declaration") {
                            } else if s.starts_with("stripInternal:") {
                                // TODO: Handle
                            } else if s.starts_with("traceResolution") {
                                // no-op
                            } else if s.starts_with("allowUnusedLabels:") {
                                let v = s["allowUnusedLabels:".len()..].trim().parse().unwrap();
                                rule.allow_unused_labels = v;
                            } else if s.starts_with("noEmitHelpers") {
                                // TODO
                            } else if s.starts_with("downlevelIteration: ") {
                                // TODO
                            } else if s.starts_with("sourceMap:") || s.starts_with("sourcemap:") {
                                // TODO
                            } else if s.starts_with("isolatedModules:") {
                                // TODO
                            } else if s.starts_with("lib:") {
                                let mut ls = HashSet::<_>::default();
                                for v in s["lib:".len()..].trim().split(",") {
                                    ls.extend(Lib::load(v))
                                }
                                libs = ls.into_iter().collect()
                            } else if s.starts_with("allowUnreachableCode:") {
                                let v = s["allowUnreachableCode:".len()..].trim().parse().unwrap();
                                rule.allow_unreachable_code = v;
                            } else if s.starts_with("strictNullChecks:") {
                                let v = s["strictNullChecks:".len()..].trim().parse().unwrap();
                                rule.strict_null_checks = v;
                            } else if s.starts_with("noImplicitThis:") {
                                let v = s["noImplicitThis:".len()..].trim().parse().unwrap();
                                rule.no_implicit_this = v;
                            } else if s.starts_with("skipDefaultLibCheck") {
                                // TODO
                            } else {
                                panic!("Comment is not handled: {}", s);
                            }
                        }
                    }
                    None => {}
                }

                (libs, rule, ts_config, target)
            }
        })
    })
    .ok()
    .unwrap_or_default();

    match mode {
        Mode::Error => {
            let res = ::testing::run_test2(false, |cm, handler| {
                let handler = Arc::new(handler);
                let checker = swc_ts_checker::Checker::new(
                    Default::default(),
                    cm.clone(),
                    handler.clone(),
                    libs,
                    rule,
                    TsConfig {
                        tsx: fname.contains("tsx"),
                        ..ts_config
                    },
                    target,
                );

                let errors = ::swc_ts_checker::errors::Error::flatten(
                    checker.check(Arc::new(file_name.into())).1.errors.into(),
                );

                checker.run(|| {
                    for e in errors {
                        e.emit(&handler);
                    }
                });

                if handler.has_errors() {
                    return Err(());
                }

                Ok(())
            });

            let err = res.expect_err("should fail, but parsed as");
            if err
                .compare_to_file(format!("{}.stderr", file_name.display()))
                .is_err()
            {
                panic!()
            }
        }
        Mode::Pass => {
            let res = ::testing::run_test2(false, |cm, handler| {
                let handler = Arc::new(handler);
                let checker = swc_ts_checker::Checker::new(
                    Default::default(),
                    cm.clone(),
                    handler.clone(),
                    libs,
                    rule,
                    TsConfig {
                        tsx: fname.contains("tsx"),
                        ..ts_config
                    },
                    target,
                );

                let errors = ::swc_ts_checker::errors::Error::flatten(
                    checker.check(Arc::new(file_name.into())).1.errors.into(),
                );

                checker.run(|| {
                    for e in errors {
                        e.emit(&handler);
                    }
                });

                if handler.has_errors() {
                    return Err(());
                }

                Ok(())
            });

            res.expect("should be parsed and validated");
        }

        Mode::Conformance => {
            let ref_errors = if let Some(ref mut ref_errors) = ref_errors {
                ref_errors
            } else {
                unreachable!()
            };

            let tester = Tester::new();
            let diagnostics = tester
                .errors(|cm, handler| {
                    let handler = Arc::new(handler);
                    let checker = swc_ts_checker::Checker::new(
                        Default::default(),
                        cm.clone(),
                        handler.clone(),
                        libs,
                        rule,
                        TsConfig {
                            tsx: fname.contains("tsx"),
                            ..ts_config
                        },
                        target,
                    );

                    let errors = ::swc_ts_checker::errors::Error::flatten(
                        checker.check(Arc::new(file_name.into())).1.errors.into(),
                    );

                    checker.run(|| {
                        for e in errors {
                            e.emit(&handler);
                        }
                    });

                    if false {
                        return Ok(());
                    }

                    return Err(());
                })
                .expect_err("");

            let mut actual_error_lines = diagnostics
                .iter()
                .map(|d| {
                    let span = d.span.primary_span().unwrap();
                    let cp = tester.cm.lookup_char_pos(span.lo());

                    (cp.line, cp.col.0 + 1)
                })
                .collect::<Vec<_>>();

            let full_actual_error_lc = actual_error_lines.clone();

            for line_col in full_actual_error_lc.clone() {
                if let Some(..) = ref_errors.remove_item(&line_col) {
                    actual_error_lines.remove_item(&line_col);
                }
            }

            //
            //      - All reference errors are matched
            //      - Actual errors does not remain
            let success = ref_errors.is_empty() && actual_error_lines.is_empty();

            let res: Result<(), _> = tester.print_errors(|_, handler| {
                // If we failed, we only emit errors which has wrong line.

                for (d, line_col) in diagnostics.into_iter().zip(full_actual_error_lc.clone()) {
                    if success
                        || env::var("PRINT_ALL").unwrap_or(String::from("")) == "1"
                        || actual_error_lines.contains(&line_col)
                    {
                        DiagnosticBuilder::new_diagnostic(&handler, d).emit();
                    }
                }

                Err(())
            });

            let err = match res {
                Ok(_) => StdErr::from(String::from("")),
                Err(err) => err,
            };

            let err_count = actual_error_lines.len();

            if !success {
                panic!(
                    "\n============================================================\n
                     {}\n============================================================\n{:?}
============================================================\n{} unmatched errors out of {} \
                     errors. Got {} extra errors.\nWanted: {:?}\nUnwanted: {:?}\n\nAll required \
                     errors: {:?}\nAll actual errors: {:?}",
                    fm.unwrap().src,
                    err,
                    ref_errors.len(),
                    full_ref_err_cnt,
                    err_count,
                    ref_errors,
                    actual_error_lines,
                    full_ref_errors.as_ref().unwrap(),
                    full_actual_error_lc,
                );
            }

            if err
                .compare_to_file(format!("{}.stderr", file_name.display()))
                .is_err()
            {
                panic!()
            }
        }
    }

    Ok(())
}

fn add_test<F: FnOnce() + Send + 'static>(
    tests: &mut Vec<TestDescAndFn>,
    name: String,
    ignore: bool,
    f: F,
) {
    tests.push(TestDescAndFn {
        desc: TestDesc {
            test_type: TestType::UnitTest,
            name: TestName::DynTestName(name),
            ignore,
            should_panic: No,
            allow_fail: false,
        },
        testfn: DynTestFn(box f),
    });
}

fn make_test(c: &Comments, module: Module) -> Module {
    let mut m = TestMaker {
        c,
        stmts: Default::default(),
    };

    module.fold_with(&mut m)
}

struct TestMaker<'a> {
    c: &'a Comments,
    stmts: Vec<Stmt>,
}

impl Fold<Vec<ModuleItem>> for TestMaker<'_> {
    fn fold(&mut self, stmts: Vec<ModuleItem>) -> Vec<ModuleItem> {
        let mut ss = vec![];
        for stmt in stmts {
            let stmt = stmt.fold_with(self);
            ss.push(stmt);
            ss.extend(self.stmts.drain(..).map(ModuleItem::Stmt));
        }

        ss
    }
}

impl Fold<Vec<Stmt>> for TestMaker<'_> {
    fn fold(&mut self, stmts: Vec<Stmt>) -> Vec<Stmt> {
        let mut ss = vec![];
        for stmt in stmts {
            let stmt = stmt.fold_with(self);
            ss.push(stmt);
            ss.extend(self.stmts.drain(..));
        }

        ss
    }
}

impl Fold<TsTypeAliasDecl> for TestMaker<'_> {
    fn fold(&mut self, decl: TsTypeAliasDecl) -> TsTypeAliasDecl {
        let cmts = self.c.trailing_comments(decl.span.hi());

        match cmts {
            Some(cmts) => {
                assert!(cmts.len() == 1);
                let cmt = cmts.iter().next().unwrap();
                let t = cmt.text.trim().replace("\n", "").replace("\r", "");

                let cmt_type = match parse_type(cmt.span, &t) {
                    Some(ty) => ty,
                    None => return decl,
                };

                //  {
                //      let _value: ty = (Object as any as Alias)
                //  }
                //
                //
                let span = decl.span();
                self.stmts.push(Stmt::Block(BlockStmt {
                    span,
                    stmts: vec![Stmt::Decl(Decl::Var(VarDecl {
                        span,
                        decls: vec![VarDeclarator {
                            span,
                            name: Pat::Ident(Ident {
                                span,
                                sym: "_value".into(),
                                type_ann: Some(TsTypeAnn {
                                    span,
                                    type_ann: box cmt_type,
                                }),
                                optional: false,
                            }),
                            init: Some(box Expr::TsAs(TsAsExpr {
                                span,
                                expr: box Expr::TsAs(TsAsExpr {
                                    span,
                                    expr: box Expr::Ident(Ident::new("Object".into(), span)),
                                    type_ann: box TsType::TsKeywordType(TsKeywordType {
                                        span,
                                        kind: TsKeywordTypeKind::TsAnyKeyword,
                                    }),
                                }),
                                type_ann: box TsType::TsTypeRef(TsTypeRef {
                                    span,
                                    type_name: TsEntityName::Ident(decl.id.clone()),
                                    type_params: None,
                                }),
                            })),
                            definite: false,
                        }],
                        kind: VarDeclKind::Const,
                        declare: false,
                    }))],
                }));
            }
            None => {}
        }

        decl
    }
}

fn parse_type(span: Span, s: &str) -> Option<TsType> {
    let s = s.trim();

    if s.starts_with("error") || s.starts_with("Error") {
        return None;
    }

    let ty = ::testing::run_test(true, |cm, handler| {
        let session = Session { handler: &handler };

        let fm = cm.new_source_file(FileName::Anon, s.into());

        let mut parser = Parser::new(
            session,
            Syntax::Typescript(Default::default()),
            SourceFileInput::from(&*fm),
            None,
        );
        let ty = match parser.parse_type() {
            Ok(v) => v,
            Err(..) => return Err(()),
        };
        Ok(ty)
    });

    let mut spanner = Spanner { span };

    Some(*ty.ok()?.fold_with(&mut spanner))
}

struct Spanner {
    span: Span,
}

impl Fold<Span> for Spanner {
    fn fold(&mut self, _: Span) -> Span {
        self.span
    }
}
