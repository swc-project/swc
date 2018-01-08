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

const IGNORED_PASS_TESTS: &[&str] = &[
    // Wrong tests (variable name or value is different)
    "0339fa95c78c11bd.js",
    "0426f15dac46e92d.js",
    "0b4d61559ccce0f9.js",
    "0f88c334715d2489.js",
    "1093d98f5fc0758d.js",
    "15d9592709b947a0.js",
    "2179895ec5cc6276.js",
    "247a3a57e8176ebd.js",
    "441a92357939904a.js",
    "47f974d6fc52e3e4.js",
    "4e1a0da46ca45afe.js",
    "5829d742ab805866.js",
    "598a5cedba92154d.js",
    "72d79750e81ef03d.js",
    "7788d3c1e1247da9.js",
    "82c827ccaecbe22b.js",
    "8c80f7ee04352eba.js",
    "96f5d93be9a54573.js",
    "988e362ed9ddcac5.js",
    "9bcae7c7f00b4e3c.js",
    "a8a03a88237c4e8f.js",
    "ad06370e34811a6a.js",
    "b0fdc038ee292aba.js",
    "b62c6dd890bef675.js",
    "cb211fadccb029c7.js",
    "ce968fcdf3a1987c.js",
    "db3c01738aaf0b92.js",
    "e1387fe892984e2b.js",
    "e71c1d5f0b6b833c.js",
    "e8ea384458526db0.js",
    // We don't implement Annex B fully.
    "1c1e2a43fe5515b6.js",
    "3dabeca76119d501.js",
    "52aeec7b8da212a2.js",
    "59ae0289778b80cd.js",
    "a4d62a651f69d815.js",
    "c06df922631aeabc.js",
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

        // TODO: remove this
        let ignore = IGNORED_PASS_TESTS.contains(&&*file_name) || input.contains("`")
            || input.contains("//") || input.contains("/*")
            || input.contains("<!--") || input.contains("-->");

        let module = file_name.contains("module");

        let name = format!("test262_parser_pass_{}", file_name);
        add_test(tests, name, ignore, move || {
            println!(
                "\n\n\nRunning test {}\nSource:\n{}\nExplicit:\n{}",
                file_name, input, explicit
            );

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
                    assert_eq!(src, expected);
                } else {
                    let p = |ty, s| {
                        parse_script(&file_name, s).unwrap_or_else(|err| {
                            panic!("failed to parse {}: {:?}\ncode:\n{}", ty, err, s)
                        })
                    };
                    let src = p("", &input);
                    //FIXME: remove parens
                    let expected = p("explicit ", &explicit);
                    assert_eq!(src, expected);
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
        .map(normalize)
}
fn parse_module(file_name: &str, s: &str) -> PResult<Module> {
    let l = logger(file_name, s);
    Parser::new_for_module(l.clone(), Lexer::new_from_str(l, s))
        .parse_module()
        .map(normalize)
}

fn normalize<T>(mut t: T) -> T
where
    Normalizer: Folder<T>,
{
    loop {
        let mut n = Normalizer {
            did_something: false,
        };
        t = n.fold(t);
        if !n.did_something {
            return t;
        }
    }
}

struct Normalizer {
    did_something: bool,
}
impl Folder<Span> for Normalizer {
    fn fold(&mut self, _: Span) -> Span {
        Span::DUMMY
    }
}
impl Folder<ExprKind> for Normalizer {
    fn fold(&mut self, e: ExprKind) -> ExprKind {
        match e {
            ExprKind::Paren(e) => self.fold(e.node),
            ExprKind::New { callee, args: None } => {
                self.did_something = true;
                ExprKind::New {
                    callee: self.fold(callee),
                    args: Some(vec![]),
                }
            }
            ExprKind::Seq { exprs } => {
                let mut exprs = self.fold(exprs);
                let need_work = exprs.iter().map(|e| &e.node).any(|n| match *n {
                    ExprKind::Seq { .. } => true,
                    _ => false,
                });

                if need_work {
                    self.did_something = true;
                    exprs = exprs.into_iter().fold(vec![], |mut v, e| {
                        match e.node {
                            ExprKind::Seq { exprs } => v.extend(exprs),
                            _ => v.push(e),
                        }
                        v
                    });
                }
                ExprKind::Seq { exprs }
            }
            _ => e.fold_children(self),
        }
    }
}

impl Folder<Number> for Normalizer {
    fn fold(&mut self, n: Number) -> Number {
        match n {
            Number::Decimal(v) | Number::ImplicitOctal(v) => {
                self.did_something = true;
                Number::Float(v as _)
            }
            _ => n,
        }
    }
}

impl Folder<PropName> for Normalizer {
    fn fold(&mut self, n: PropName) -> PropName {
        match n {
            PropName::Ident(Ident { sym, .. }) => {
                self.did_something = true;
                PropName::Str(String::from(&*sym))
            }
            PropName::Num(num) => {
                self.did_something = true;
                PropName::Str(num.to_string())
            }
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
