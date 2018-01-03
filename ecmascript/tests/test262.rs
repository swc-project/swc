#![feature(box_syntax)]
#![feature(conservative_impl_trait)]
#![feature(specialization)]
#![feature(test)]

#[macro_use]
extern crate slog;
#[macro_use]
extern crate swc_common;
extern crate swc_ecmascript;
extern crate test;
extern crate testing;
use slog::Logger;
use std::env;
use std::fmt::Write as FmtWrite;
use std::fs::File;
use std::fs::read_dir;
use std::io::{self, Read};
use std::panic::{catch_unwind, resume_unwind};
use std::path::Path;
use swc_common::Span;
use swc_common::fold::{FoldWith, Folder};
use swc_ecmascript::ast::*;
use swc_ecmascript::lexer::Lexer;
use swc_ecmascript::parser::{PResult, Parser};
use test::{test_main, Options, TestDesc, TestDescAndFn, TestFn, TestName};
use test::ShouldPanic::No;

/// Wrong tests.
const IGNORED_PASS_TESTS: &[&str] = &[
    "0b4d61559ccce0f9.js",
    "247a3a57e8176ebd.js",
    "47f974d6fc52e3e4.js",
    "72d79750e81ef03d.js",
    "db3c01738aaf0b92.js",
];

fn add_test<F: FnOnce() + Send + 'static>(
    tests: &mut Vec<TestDescAndFn>,
    name: String,
    ignore: bool,
    f: F,
) {
    tests.push(TestDescAndFn {
        desc: TestDesc {
            name: TestName::DynTestName(name),
            ignore: ignore,
            should_panic: No,
            allow_fail: false,
        },
        testfn: TestFn::DynTestFn(box f),
    });
}

fn unit_tests(tests: &mut Vec<TestDescAndFn>) -> Result<(), io::Error> {
    let root = {
        let mut root = Path::new(env!("CARGO_MANIFEST_DIR")).to_path_buf();
        root.push("tests");
        root.push("test262-parser");
        root
    };

    eprintln!("Loading tests from {}", root.display());

    let pass_dir = root.join("pass");

    let files = read_dir(&pass_dir)?;

    for entry in files {
        let entry = entry?;
        let file_name = entry
            .path()
            .strip_prefix(&pass_dir)
            .expect("failed to string prefix")
            .to_str()
            .unwrap()
            .to_string();

        let ignore = IGNORED_PASS_TESTS.contains(&&*file_name);

        let input = {
            let mut buf = String::new();
            File::open(entry.path())?.read_to_string(&mut buf)?;
            buf
        };
        let explicit = {
            let mut buf = String::new();
            File::open(root.join("pass-explicit").join(&file_name))?.read_to_string(&mut buf)?;
            buf
        };

        let module = file_name.contains("module");

        let name = format!("test262_parser_pass_{}", file_name);
        add_test(tests, name, ignore, move || {
            let mut s = String::new();
            writeln!(
                s,
                "\nRunning test {}\nSource:\n{}\nExplicit:\n{}",
                file_name, input, explicit
            ).unwrap();

            let res = catch_unwind(move || {
                if module {
                    let p = |ty, s| {
                        parse_module(&file_name, s).unwrap_or_else(|err| {
                            panic!("failed to parse {}: {:?}\ncode:\n{}", ty, err, s)
                        })
                    };
                    let src = p("", &input);
                    //FIXME: remove parens
                    let expected = p("explicit ", &explicit);
                    assert_eq_ignore_span!(src, expected, "{}", s);
                } else {
                    let p = |ty, s| {
                        parse_script(&file_name, s).unwrap_or_else(|err| {
                            panic!("failed to parse {}: {:?}\ncode:\n{}", ty, err, s)
                        })
                    };
                    let src = p("", &input);
                    //FIXME: remove parens
                    let expected = p("explicit ", &explicit);
                    assert_eq_ignore_span!(src, expected, "{}", s);
                }
            });

            match res {
                Ok(()) => {}
                Err(err) => resume_unwind(err),
            }
        });
    }

    Ok(())
}

fn logger(file_name: &str, src: &str) -> Logger {
    let (f, s): (String, String) = (file_name.into(), src.into());
    ::testing::logger().new(o!("file name" => f, "src" => s,))
}

fn parse_script(file_name: &str, s: &str) -> PResult<Vec<Stmt>> {
    let l = logger(file_name, s);
    Parser::new_for_script(l.clone(), Lexer::new_from_str(l, s), false)
        .parse_script()
        .map(|script| Normalizer.fold(script))
}
fn parse_module(file_name: &str, s: &str) -> PResult<Module> {
    let l = logger(file_name, s);
    Parser::new_for_module(l.clone(), Lexer::new_from_str(l, s))
        .parse_module()
        .map(|module| Normalizer.fold(module))
}

struct Normalizer;
impl Folder<Span> for Normalizer {
    fn fold(&mut self, _: Span) -> Span {
        Span::DUMMY
    }
}
impl Folder<ExprKind> for Normalizer {
    fn fold(&mut self, e: ExprKind) -> ExprKind {
        match e {
            ExprKind::Paren(e) => self.fold(e.node),
            ExprKind::New { callee, args: None } => ExprKind::New {
                callee: self.fold(callee),
                args: Some(vec![]),
            },
            _ => e.fold_children(self),
        }
    }
}

impl Folder<Number> for Normalizer {
    fn fold(&mut self, n: Number) -> Number {
        match n {
            Number::Float(..) => n,
            Number::Decimal(v) | Number::ImplicitOctal(v) => Number::Float(v as _),
        }
    }
}

impl Folder<PropName> for Normalizer {
    fn fold(&mut self, n: PropName) -> PropName {
        match n {
            PropName::Ident(Ident { sym, .. }) => PropName::Str(String::from(&*sym)),
            _ => n.fold_children(self),
        }
    }
}

#[test]
// #[main]
fn main() {
    let args: Vec<_> = env::args().collect();
    let mut tests = Vec::new();
    unit_tests(&mut tests).unwrap();
    test_main(&args, tests, Options::new());
}
