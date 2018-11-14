#![feature(box_syntax)]
#![feature(specialization)]
#![feature(test)]
extern crate slog;
extern crate swc_common;
extern crate swc_ecma_codegen;
extern crate swc_ecma_parser;
extern crate test;
extern crate testing;
use std::{
    env,
    fs::{read_dir, File},
    io::{self, Read, Write},
    path::Path,
    rc::Rc,
    sync::{Arc, RwLock},
};
use swc_common::{sourcemap::SourceMapBuilder, Fold, FoldWith, Span};
use swc_ecma_codegen::Emitter;
use swc_ecma_parser::{ast::*, Parser, Session, SourceFileInput};
use test::{test_main, Options, ShouldPanic::No, TestDesc, TestDescAndFn, TestFn, TestName};
use testing::NormalizedOutput;

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
            ignore,
            should_panic: No,
            allow_fail: false,
        },
        testfn: TestFn::DynTestFn(box f),
    });
}

struct MyHandlers;

impl swc_ecma_codegen::Handlers for MyHandlers {}

fn error_tests(tests: &mut Vec<TestDescAndFn>) -> Result<(), io::Error> {
    let ref_dir = Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("tests")
        .join("references");
    let dir = Path::new(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .unwrap()
        .join("parser")
        .join("tests")
        .join("test262-parser")
        .join("pass");

    eprintln!("Loading tests from {}", dir.display());

    for entry in read_dir(&dir).expect("failed to read directory") {
        let entry = entry?;
        let file_name = entry
            .path()
            .strip_prefix(&dir)
            .expect("failed to strip prefix")
            .to_str()
            .expect("to_str() failed")
            .to_string();

        let input = {
            let mut buf = String::new();
            File::open(entry.path())?.read_to_string(&mut buf)?;
            buf
        };

        let ignore = IGNORED_PASS_TESTS.contains(&&*file_name);

        let module = file_name.contains("module");

        let ref_dir = ref_dir.clone();
        let name = format!("test262::golden::{}", file_name);

        add_test(tests, name, ignore, move || {
            let msg = format!(
                "\n\n========== Running codegen test {}\nSource:\n{}\n",
                file_name, input
            );
            let mut wr = Buf(Arc::new(RwLock::new(vec![])));

            let _out = ::testing::run_test(|logger, cm, handler| {
                let src = cm.load_file(&entry.path()).expect("failed to load file");
                eprintln!(
                    "{}\nPos: {:?} ~ {:?} (L{})",
                    msg,
                    src.start_pos,
                    src.end_pos,
                    src.count_lines()
                );

                let handlers = box MyHandlers;
                let mut parser: Parser<SourceFileInput> = Parser::new(
                    Session {
                        logger: &logger,
                        handler: &handler,
                        cfg: Default::default(),
                    },
                    (&*src).into(),
                );

                let s: Rc<String> = src.src.as_ref().map(|s| s.clone()).unwrap();
                let mut src_map_builder = SourceMapBuilder::new(Some(&s));
                {
                    let mut emitter = Emitter {
                        cfg: swc_ecma_codegen::config::Config::default(),
                        cm: cm.clone(),
                        enable_comments: false,
                        wr: box swc_ecma_codegen::text_writer::JsWriter::new(
                            cm.clone(),
                            "\n",
                            &mut wr,
                            &mut src_map_builder,
                        ),
                        handlers,
                        pos_of_leading_comments: Default::default(),
                    };

                    // Parse source
                    if module {
                        emitter
                            .emit_module(
                                &parser
                                    .parse_module()
                                    .map_err(|e| {
                                        e.emit();
                                        ()
                                    })
                                    .expect("failed to parse module"),
                            )
                            .unwrap();
                    } else {
                        emitter
                            .emit_script(
                                &parser
                                    .parse_script()
                                    .map_err(|e| {
                                        e.emit();
                                        ()
                                    })
                                    .expect("failed to parse script"),
                            )
                            .unwrap();
                    }
                }
                let ref_file = format!("{}", ref_dir.join(&file_name).display());

                let code_output = wr.0.read().unwrap();
                let with_srcmap =
                    NormalizedOutput::from(String::from_utf8_lossy(&code_output).into_owned());
                with_srcmap.compare_to_file(ref_file).unwrap();
            });
        });
    }

    Ok(())
}

#[test]
fn identity() {
    let args: Vec<_> = env::args().collect();
    let mut tests = Vec::new();
    error_tests(&mut tests).expect("failed to load testss");
    test_main(&args, tests, Options::new());
}

pub fn normalize<T>(t: T) -> T
where
    Normalizer: Fold<T>,
{
    let mut n = Normalizer;
    n.fold(t)
}

pub struct Normalizer;
impl Fold<Span> for Normalizer {
    fn fold(&mut self, _: Span) -> Span {
        Span::default()
    }
}
impl Fold<Str> for Normalizer {
    fn fold(&mut self, s: Str) -> Str {
        Str {
            span: Default::default(),
            has_escape: false,
            ..s
        }
    }
}
impl Fold<Expr> for Normalizer {
    fn fold(&mut self, e: Expr) -> Expr {
        let e = e.fold_children(self);

        match e {
            Expr::Paren(ParenExpr { expr, .. }) => *expr,
            Expr::New(NewExpr {
                callee,
                args: None,
                span,
            }) => Expr::New(NewExpr {
                span,
                callee,
                args: Some(vec![]),
            }),
            // Flatten comma expressions.
            Expr::Seq(SeqExpr { mut exprs, span }) => {
                let need_work = exprs.iter().any(|n| match **n {
                    Expr::Seq(..) => true,
                    _ => false,
                });

                if need_work {
                    exprs = exprs.into_iter().fold(vec![], |mut v, e| {
                        match *e {
                            Expr::Seq(SeqExpr { exprs, .. }) => v.extend(exprs),
                            _ => v.push(e),
                        }
                        v
                    });
                }
                Expr::Seq(SeqExpr { exprs, span })
            }
            _ => e,
        }
    }
}

impl Fold<PropName> for Normalizer {
    fn fold(&mut self, n: PropName) -> PropName {
        let n = n.fold_children(self);

        match n {
            PropName::Ident(Ident { sym, .. }) => PropName::Str(Str {
                span: Default::default(),
                value: sym,
                has_escape: false,
            }),
            PropName::Num(num) => PropName::Str(Str {
                span: Default::default(),
                value: num.to_string().into(),
                has_escape: false,
            }),
            _ => n,
        }
    }
}

#[derive(Debug, Clone)]
struct Buf(Arc<RwLock<Vec<u8>>>);
impl Write for Buf {
    fn write(&mut self, data: &[u8]) -> io::Result<usize> {
        self.0.write().unwrap().write(data)
    }

    fn flush(&mut self) -> io::Result<()> {
        self.0.write().unwrap().flush()
    }
}
