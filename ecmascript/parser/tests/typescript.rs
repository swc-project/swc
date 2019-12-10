#![feature(box_syntax)]
#![feature(box_patterns)]
#![feature(specialization)]
#![feature(test)]

extern crate test;

use swc_ecma_ast::*;
use pretty_assertions::assert_eq;
use std::{
    env,
    fs::File,
    io::{self, Read},
    path::Path,
};
use swc_common::{Fold, FoldWith, CM};
use swc_ecma_parser::{
    lexer::Lexer, JscTarget, PResult, Parser, Session, SourceFileInput, Syntax, TsConfig,
};
use test::{
    test_main, DynTestFn, Options, ShouldPanic::No, TestDesc, TestDescAndFn, TestName, TestType,
};
use testing::StdErr;
use walkdir::WalkDir;

fn add_test<F: FnOnce() + Send + 'static>(
    tests: &mut Vec<TestDescAndFn>,
    name: String,
    ignore: bool,
    f: F,
) {
    if ignore {
        return;
    }
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

fn reference_tests(tests: &mut Vec<TestDescAndFn>, errors: bool) -> Result<(), io::Error> {
    let root = {
        let mut root = Path::new(env!("CARGO_MANIFEST_DIR")).to_path_buf();
        root.push("tests");
        root.push(if errors {
            "typescript-errors"
        } else {
            "typescript"
        });
        root
    };

    eprintln!("Loading tests from {}", root.display());

    let dir = root;

    for entry in WalkDir::new(&dir).into_iter() {
        let entry = entry?;
        if entry.file_type().is_dir()
            || !(entry.file_name().to_string_lossy().ends_with(".ts")
                || entry.file_name().to_string_lossy().ends_with(".tsx"))
        {
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

        let ignore = false;

        let dir = dir.clone();
        let name = format!(
            "typescript::{}::{}",
            if errors { "error" } else { "reference" },
            file_name
        );
        add_test(tests, name, ignore, move || {
            eprintln!(
                "\n\n========== Running reference test {}\nSource:\n{}\n",
                file_name, input
            );

            let path = dir.join(&file_name);
            if errors {
                let module = with_parser(false, &path, |p| p.parse_module());

                let err = module.expect_err("should fail, but parsed as");
                if err
                    .compare_to_file(format!("{}.stderr", path.display()))
                    .is_err()
                {
                    panic!()
                }
            } else {
                with_parser(is_backtrace_enabled(), &path, |p| {
                    let module = p.parse_module()?.fold_with(&mut Normalizer);

                    let json = serde_json::to_string_pretty(&module)
                        .expect("failed to serialize module as json");

                    if StdErr::from(json.clone())
                        .compare_to_file(format!("{}.json", path.display()))
                        .is_err()
                    {
                        panic!()
                    }

                    let deser = serde_json::from_str::<Module>(&json)
                        .unwrap_or_else(|err| {
                            panic!(
                                "failed to deserialize json back to module: {}\n{}",
                                err, json
                            )
                        })
                        .fold_with(&mut Normalizer);
                    assert_eq!(module, deser, "JSON:\n{}", json);

                    Ok(())
                })
                .unwrap();
            }
        });
    }

    Ok(())
}

fn with_parser<F, Ret>(treat_error_as_bug: bool, file_name: &Path, f: F) -> Result<Ret, StdErr>
where
    F: for<'a> FnOnce(&mut Parser<'a, Lexer<'a, SourceFileInput<'_>>>) -> PResult<'a, Ret>,
{
    let fname = file_name.display().to_string();
    let output = ::testing::run_test(treat_error_as_bug, |cm, handler| {
        CM.set(&cm, || {
            let fm = cm
                .load_file(file_name)
                .unwrap_or_else(|e| panic!("failed to load {}: {}", file_name.display(), e));

            let lexer = Lexer::new(
                Session { handler: &handler },
                Syntax::Typescript(TsConfig {
                    tsx: fname.contains("tsx"),
                    dynamic_import: true,
                    decorators: true,
                    ..Default::default()
                }),
                JscTarget::Es2015,
                (&*fm).into(),
                None,
            );

            let res =
                f(&mut Parser::new_from(Session { handler: &handler }, lexer)).map_err(|mut e| {
                    e.emit();
                });

            if handler.has_errors() {
                return Err(());
            }

            res
        })
    });

    output
}

#[test]
fn references() {
    let args: Vec<_> = env::args().collect();
    let mut tests = Vec::new();
    reference_tests(&mut tests, false).unwrap();
    test_main(&args, tests, Some(Options::new()));
}

#[test]
fn errors() {
    let args: Vec<_> = env::args().collect();
    let mut tests = Vec::new();
    reference_tests(&mut tests, true).unwrap();
    test_main(&args, tests, Some(Options::new()));
}

fn is_backtrace_enabled() -> bool {
    match ::std::env::var("RUST_BACKTRACE") {
        Ok(val) => val == "1" || val == "full",
        _ => false,
    }
}

struct Normalizer;

impl Fold<PatOrExpr> for Normalizer {
    fn fold(&mut self, node: PatOrExpr) -> PatOrExpr {
        let node = node.fold_children(self);

        match node {
            PatOrExpr::Pat(box Pat::Expr(e)) => PatOrExpr::Expr(e),
            PatOrExpr::Expr(box Expr::Ident(i)) => PatOrExpr::Pat(box Pat::Ident(i)),
            _ => node,
        }
    }
}

impl Fold<PropName> for Normalizer {
    fn fold(&mut self, node: PropName) -> PropName {
        let node = node.fold_children(self);

        match node {
            PropName::Computed(ComputedPropName {
                expr: box Expr::Lit(ref l),
                ..
            }) => match l {
                Lit::Str(s) => s.clone().into(),
                Lit::Num(v) => v.clone().into(),

                _ => node,
            },

            _ => node,
        }
    }
}
