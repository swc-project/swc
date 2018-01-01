#![feature(box_syntax)]
#![feature(conservative_impl_trait)]
#![feature(test)]

extern crate pretty_env_logger;
#[macro_use]
extern crate swc_common;
extern crate swc_ecmascript;
extern crate test;
use std::env;
use std::fmt::Write as FmtWrite;
use std::fs::File;
use std::fs::read_dir;
use std::io::{self, stdout, Read, Write};
use std::panic::{catch_unwind, resume_unwind};
use std::path::Path;
use swc_ecmascript::ast::*;
use swc_ecmascript::lexer::Lexer;
use swc_ecmascript::parser::{Input, PResult, Parser};
use test::{test_main, Options, TestDesc, TestDescAndFn, TestFn, TestName};
use test::ShouldPanic::No;

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

        let module = file_name.contains("module");

        let name = format!("test262_parser_pass_{}", file_name);
        add_test(tests, name, false, move || {
            let mut s = String::new();
            writeln!(s, "\nSource:\n{}\nExplicit:\n{}", input, explicit).unwrap();

            let res = catch_unwind(move || {
                if module {
                    let p = |ty, s| {
                        parse_module(s).unwrap_or_else(|err| {
                            panic!("failed to parse {}: {:?}\ncode:\n{}", ty, err, s)
                        })
                    };
                    let src = p("", &input);
                    //FIXME: remove parens
                    let expected = p("explicit ", &explicit);
                    assert_eq_ignore_span!(src, expected, "{}", s);
                } else {
                    let p = |ty, s| {
                        parse_script(s).unwrap_or_else(|err| {
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

fn parse_script(s: &str) -> PResult<Vec<Stmt>> {
    Parser::new_for_script(Lexer::from(s), false)
        .parse_script()
        .map(Normalize::normalize)
}
fn parse_module(s: &str) -> PResult<Module> {
    Parser::new_for_module(Lexer::from(s)).parse_module()
}

trait Normalize {
    fn normalize(self) -> Self;
}
impl<T: Normalize> Normalize for Box<T> {
    fn normalize(self) -> Self {
        box <T as Normalize>::normalize(*self)
    }
}

impl<T: Normalize> Normalize for Vec<T> {
    fn normalize(self) -> Self {
        self.into_iter().map(|t| t.normalize()).collect()
    }
}

impl Normalize for Stmt {
    fn normalize(self) -> Self {
        Stmt {
            node: self.node.normalize(),
            ..self
        }
    }
}

impl Normalize for StmtKind {
    fn normalize(self) -> Self {
        match self {
            StmtKind::Expr(expr) => StmtKind::Expr(expr.normalize()),
            //TODO
            _ => self,
        }
    }
}

impl Normalize for Expr {
    fn normalize(self) -> Self {
        Expr {
            node: self.node.normalize(),
            ..self
        }
    }
}

impl Normalize for ExprKind {
    fn normalize(self) -> Self {
        match self {
            ExprKind::Lit(lit) => ExprKind::Lit(lit.normalize()),
            ExprKind::New { callee, args: None } => ExprKind::New {
                callee,
                args: Some(vec![]),
            },
            // TODO
            _ => self,
        }
    }
}

impl Normalize for Lit {
    fn normalize(self) -> Self {
        match self {
            Lit::Num(num) => Lit::Num(num.normalize()),
            // TODO
            _ => self,
        }
    }
}
impl Normalize for Number {
    fn normalize(self) -> Self {
        match self {
            Number::Float(..) => self,
            Number::Decimal(v) | Number::ImplicitOctal(v) => Number::Float(v as _),
        }
    }
}

#[test]
fn main() {
    let _ = ::pretty_env_logger::init();

    println!("Preparing test..");
    let args: Vec<_> = env::args().collect();
    let mut tests = Vec::new();
    unit_tests(&mut tests).unwrap();
    test_main(&args, tests, Options::new());
}
