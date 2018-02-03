#![feature(box_syntax)]
#![feature(conservative_impl_trait)]
#![feature(specialization)]
#![feature(test)]

#[macro_use]
extern crate slog;
extern crate swc_common;
extern crate swc_ecma_parser;
extern crate test;
extern crate testing;
use slog::Logger;
use std::env;
use std::fs::File;
use std::fs::read_dir;
use std::io::{self, Read};
use std::path::Path;
use std::rc::Rc;
use swc_common::{FoldWith, Folder};
use swc_common::FileName;
use swc_common::Span;
use swc_common::errors::{CodeMap, FilePathMapping};
use swc_common::errors::Handler;
use swc_ecma_parser::{FileMapInput, PResult, Parser, Session};
use swc_ecma_parser::ast::*;
use test::{test_main, Options, TestDesc, TestDescAndFn, TestFn, TestName};
use test::ShouldPanic::No;

const IGNORED_PASS_TESTS: &[&str] = &[
    // Temporalily ignored
    "431ecef8c85d4d24.js",
    "8386fbff927a9e0e.js",
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
    "589dc8ad3b9aa28f.js",
    "598a5cedba92154d.js",
    "72d79750e81ef03d.js",
    "7788d3c1e1247da9.js",
    "7b72d7b43bedc895.js",
    "7dab6e55461806c9.js",
    "82c827ccaecbe22b.js",
    "87a9b0d1d80812cc.js",
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

fn error_tests(tests: &mut Vec<TestDescAndFn>) -> Result<(), io::Error> {
    const IGNORED_ERROR_TESTS: &[&str] = &[
        // Wrong tests
        "0d5e450f1da8a92a.js",
        "748656edbfb2d0bb.js",
        "79f882da06f88c9f.js",
        "92b6af54adef3624.js",
        "ef2d369cccc5386c.js",
        // Temporarily ignore tests for using octal escape before use strict
        "147fa078a7436e0e.js",
        "15a6123f6b825c38.js",
        "3bc2b27a7430f818.js",
    ];

    let root = {
        let mut root = Path::new(env!("CARGO_MANIFEST_DIR")).to_path_buf();
        root.push("tests");
        root.push("test262-parser");
        root
    };

    eprintln!("Loading tests from {}", root.display());

    const TYPES: &[&str] = &[
        "fail" /* TODO
 * "early" */
    ];

    for err_type in TYPES {
        let dir = root.join(err_type);

        for entry in read_dir(&dir)? {
            let entry = entry?;
            let file_name = entry
                .path()
                .strip_prefix(&dir)
                .expect("failed to string prefix")
                .to_str()
                .unwrap()
                .to_string();

            let input = {
                let mut buf = String::new();
                File::open(entry.path())?.read_to_string(&mut buf)?;
                buf
            };

            let ignore = IGNORED_ERROR_TESTS.contains(&&*file_name);

            let module = file_name.contains("module");

            let name = format!("parser::error::{}::{}", err_type, file_name);
            add_test(tests, name, ignore, move || {
                eprintln!(
                    "\n\nRunning error reporting test {}\nSource:\n{}\n",
                    file_name, input
                );

                let mut sess = TestSess::new();

                // Parse source
                let err = if module {
                    sess.parse_module(&file_name, &input)
                        .expect_err("should fail, but parsed as")
                } else {
                    sess.parse_script(&file_name, &input)
                        .expect_err("should fail, but parsed as")
                };

                // Diff it.
                err.emit();
            });
        }
    }

    Ok(())
}

fn identity_tests(tests: &mut Vec<TestDescAndFn>) -> Result<(), io::Error> {
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
        let ignore = IGNORED_PASS_TESTS.contains(&&*file_name);

        let module = file_name.contains("module");

        let name = format!("test262-identity-{}", file_name);
        add_test(tests, name, ignore, move || {
            eprintln!(
                "\n\n\nRunning test {}\nSource:\n{}\nExplicit:\n{}",
                file_name, input, explicit
            );

            let mut sess = TestSess::new();

            if module {
                let mut p = |ty, s| {
                    sess.parse_module(&file_name, s)
                        .map(normalize)
                        .unwrap_or_else(|err| {
                            err.emit();
                            panic!("failed to parse {} code:\n{}", ty, s)
                        })
                };
                let src = p("", &input);
                let expected = p("explicit ", &explicit);
                assert_eq!(src, expected);
            } else {
                let mut p = |ty, s| {
                    sess.parse_script(&file_name, s)
                        .map(normalize)
                        .unwrap_or_else(|err| {
                            err.emit();
                            panic!("failed to parse {} code:\n{}", ty, s)
                        })
                };
                let src = p("", &input);
                let expected = p("explicit ", &explicit);
                assert_eq!(src, expected);
            }
        });
    }

    Ok(())
}

fn logger(file_name: &str, src: &str) -> Logger {
    let (f, s): (String, String) = (file_name.into(), src.into());
    ::testing::logger().new(o!("file name" => f, "src" => s,))
}

struct TestSess {
    cm: Rc<CodeMap>,
    handler: Handler,
    logger: Logger,
}

impl TestSess {
    fn new() -> Self {
        let cm = Rc::new(CodeMap::new(FilePathMapping::empty()));

        let handler = ::swc_common::errors::Handler::with_tty_emitter(
            ::swc_common::errors::ColorConfig::Never,
            true,
            false,
            Some(cm.clone()),
        );
        TestSess {
            cm,
            handler,
            logger: ::testing::logger(),
        }
    }
    fn parse_script<'a>(&'a mut self, file_name: &str, s: &str) -> PResult<'a, Vec<Stmt>> {
        self.with_parser(file_name, s, |p| p.parse_script())
    }
    fn parse_module<'a>(&'a mut self, file_name: &str, s: &str) -> PResult<'a, Module> {
        self.with_parser(file_name, s, |p| p.parse_module())
    }

    fn with_parser<'a, F, Ret>(&'a mut self, file_name: &str, src: &str, f: F) -> PResult<'a, Ret>
    where
        F: FnOnce(&mut Parser<'a, FileMapInput>) -> PResult<'a, Ret>,
    {
        self.logger = logger(file_name, src);
        let fm = self.cm
            .new_filemap(FileName::Real(file_name.into()), src.into());

        f(&mut Parser::new(
            Session {
                logger: &self.logger,
                handler: &self.handler,
                cfg: Default::default(),
            },
            (&*fm).into(),
        ))
    }
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
        Span::default()
    }
}
impl Folder<Lit> for Normalizer {
    fn fold(&mut self, lit: Lit) -> Lit {
        match lit {
            Lit::Str { value, .. } => Lit::Str {
                value,
                has_escape: false,
            },
            _ => lit,
        }
    }
}
impl Folder<ExprKind> for Normalizer {
    fn fold(&mut self, e: ExprKind) -> ExprKind {
        match e {
            ExprKind::Paren(e) => self.fold(e.node),
            ExprKind::New(NewExpr { callee, args: None }) => {
                self.did_something = true;
                ExprKind::New(NewExpr {
                    callee: self.fold(callee),
                    args: Some(vec![]),
                })
            }
            ExprKind::Seq(SeqExpr { exprs }) => {
                let mut exprs = self.fold(exprs);
                let need_work = exprs.iter().map(|e| &e.node).any(|n| match *n {
                    ExprKind::Seq { .. } => true,
                    _ => false,
                });

                if need_work {
                    self.did_something = true;
                    exprs = exprs.into_iter().fold(vec![], |mut v, e| {
                        match e.node {
                            ExprKind::Seq(SeqExpr { exprs }) => v.extend(exprs),
                            _ => v.push(e),
                        }
                        v
                    });
                }
                ExprKind::Seq(SeqExpr { exprs })
            }
            _ => e.fold_children(self),
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
fn identity() {
    let args: Vec<_> = env::args().collect();
    let mut tests = Vec::new();
    identity_tests(&mut tests).unwrap();
    test_main(&args, tests, Options::new());
}

#[test]
fn error() {
    let args: Vec<_> = env::args().collect();
    let mut tests = Vec::new();
    error_tests(&mut tests).unwrap();
    test_main(&args, tests, Options::new());
}
