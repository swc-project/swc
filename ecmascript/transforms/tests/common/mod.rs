#![allow(unused_macros)]
#![allow(dead_code)]

use std::{
    fmt,
    fs::{create_dir_all, remove_dir_all, OpenOptions},
    io::{self, Write},
    path::Path,
    process::Command,
    sync::{Arc, RwLock},
};
use swc_common::{chain, comments::Comments, errors::Handler, FileName, SourceMap};
use swc_ecma_ast::*;
use swc_ecma_codegen::Emitter;
use swc_ecma_parser::{lexer::Lexer, Parser, Session, SourceFileInput, Syntax};
use swc_ecma_transforms::helpers::{InjectHelpers, HELPERS};
use swc_ecma_utils::{DropSpan, COMMENTS};
use swc_ecma_visit::{Fold, FoldWith};
use tempfile::tempdir_in;

pub fn validating(name: &'static str, tr: impl Fold + 'static) -> Box<dyn Fold> {
    Box::new(chain!(
        tr,
        swc_ecma_transforms::debug::validator::Validator { name },
    ))
}

macro_rules! validating {
    ($folder:expr) => {{
        common::validating(stringify!($folder), $folder)
    }};
}

macro_rules! validate {
    ($e:expr) => {{
        use swc_ecma_visit::FoldWith;
        if cfg!(debug_assertions) {
            $e.fold_with(&mut swc_ecma_transforms::debug::validator::Validator {
                name: concat!(file!(), ':', line!(), ':', column!()),
            })
        } else {
            $e
        }
    }};
}

struct MyHandlers;

impl swc_ecma_codegen::Handlers for MyHandlers {}

pub struct Tester<'a> {
    pub cm: Arc<SourceMap>,
    pub handler: &'a Handler,
    pub comments: Comments,
}

impl<'a> Tester<'a> {
    pub fn run<F>(op: F)
    where
        F: FnOnce(&mut Tester<'_>) -> Result<(), ()>,
    {
        let out = ::testing::run_test(false, |cm, handler| {
            swc_ecma_transforms::util::HANDLER.set(handler, || {
                HELPERS.set(&Default::default(), || {
                    op(&mut Tester {
                        cm,
                        handler,
                        comments: Comments::default(),
                    })
                })
            })
        });

        match out {
            Ok(()) => {}
            Err(stderr) => panic!("Stderr:\n{}", stderr),
        }
    }

    pub fn with_parser<F, T>(
        &mut self,
        file_name: &str,
        syntax: Syntax,
        src: &str,
        op: F,
    ) -> Result<T, ()>
    where
        F: FnOnce(&mut Parser<'_, Lexer<'_, SourceFileInput<'_>>>) -> Result<T, ()>,
    {
        let fm = self
            .cm
            .new_source_file(FileName::Real(file_name.into()), src.into());

        let sess = Session {
            handler: &self.handler,
        };

        let mut p = Parser::new(
            sess,
            syntax,
            SourceFileInput::from(&*fm),
            Some(&self.comments),
        );
        op(&mut p)
    }

    pub fn parse_module(&mut self, file_name: &str, src: &str) -> Result<Module, ()> {
        self.with_parser(file_name, Syntax::default(), src, |p| {
            p.parse_module().map_err(|mut e| {
                e.emit();
            })
        })
    }

    pub fn apply_transform<T: Fold>(
        &mut self,
        mut tr: T,
        name: &str,
        syntax: Syntax,
        src: &str,
    ) -> Result<Module, ()> {
        let fm = self
            .cm
            .new_source_file(FileName::Real(name.into()), src.into());

        let module = {
            let sess = Session {
                handler: &self.handler,
            };

            let mut p = Parser::new(sess, syntax, SourceFileInput::from(&*fm), None);
            p.parse_module().map_err(|mut e| {
                e.emit();
            })?
        };

        let module = COMMENTS.set(&Comments::default(), || {
            validate!(module)
                .fold_with(&mut tr)
                .fold_with(&mut DropSpan {
                    preserve_ctxt: true,
                })
                .fold_with(&mut Normalizer)
        });

        Ok(module)
    }

    pub fn print(&mut self, module: &Module) -> String {
        let handlers = Box::new(MyHandlers);

        let mut wr = Buf(Arc::new(RwLock::new(vec![])));
        {
            let mut emitter = Emitter {
                cfg: Default::default(),
                cm: self.cm.clone(),
                wr: Box::new(swc_ecma_codegen::text_writer::JsWriter::new(
                    self.cm.clone(),
                    "\n",
                    &mut wr,
                    None,
                )),
                comments: None,
                handlers,
            };

            // println!("Emitting: {:?}", module);
            emitter.emit_module(&module).unwrap();
        }

        let r = wr.0.read().unwrap();
        let s = String::from_utf8_lossy(&*r);
        s.to_string()
    }
}

fn make_tr<F, P>(_: &'static str, op: F, tester: &mut Tester<'_>) -> impl Fold
where
    F: FnOnce(&mut Tester<'_>) -> P,
    P: Fold,
{
    op(tester)
}

#[cfg(test)]
macro_rules! test_transform {
    ($syntax:expr, $tr:expr, $input:expr, $expected:expr) => {
        test_transform!($syntax, $tr, $input, $expected, false)
    };

    ($syntax:expr, $tr:expr, $input:expr, $expected:expr, $ok_if_code_eq:expr) => {{
        common::test_transform($syntax, $tr, $input, $expected, $ok_if_code_eq);
    }};
}

pub fn test_transform<F, P>(syntax: Syntax, tr: F, input: &str, expected: &str, ok_if_code_eq: bool)
where
    F: FnOnce(&mut Tester<'_>) -> P,
    P: Fold,
{
    Tester::run(|tester| {
        let expected = tester.apply_transform(
            DropSpan {
                preserve_ctxt: true,
            },
            "output.js",
            syntax,
            expected,
        )?;

        println!(">>>>> Orig <<<<<\n{}", input);
        println!("----- Actual -----");

        let tr = make_tr("actual", tr, tester);
        let actual = tester.apply_transform(tr, "input.js", syntax, input)?;

        match ::std::env::var("PRINT_HYGIENE") {
            Ok(ref s) if s == "1" => {
                let hygiene_src = tester.print(&actual.clone().fold_with(&mut HygieneVisualizer));
                println!("----- Hygiene -----\n{}", hygiene_src);
            }
            _ => {}
        }

        let actual = COMMENTS.set(&Comments::default(), || {
            actual
                .fold_with(&mut swc_ecma_transforms::debug::validator::Validator {
                    name: "actual-1",
                })
                .fold_with(&mut swc_ecma_transforms::hygiene())
                .fold_with(&mut swc_ecma_transforms::debug::validator::Validator {
                    name: "actual-2",
                })
                .fold_with(&mut swc_ecma_transforms::fixer())
                .fold_with(&mut swc_ecma_transforms::debug::validator::Validator {
                    name: "actual-3",
                })
        });

        if actual == expected {
            return Ok(());
        }

        let (actual_src, expected_src) = (tester.print(&actual), tester.print(&expected));

        if actual_src == expected_src {
            if ok_if_code_eq {
                return Ok(());
            }
            // Diff it
            println!(">>>>> Code <<<<<\n{}", actual_src);
            assert_eq!(actual, expected, "different ast was detected");
            return Err(());
        }

        println!(">>>>> Code <<<<<\n{}", actual_src);
        if actual_src != expected_src {
            panic!(
                r#"assertion failed: `(left == right)`
            {}"#,
                ::testing::diff(&actual_src, &expected_src),
            );
        }

        Err(())
    });
}

#[derive(PartialEq, Eq)]
pub struct DebugUsingDisplay<'a>(pub &'a str);
impl<'a> fmt::Debug for DebugUsingDisplay<'a> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        fmt::Display::fmt(self.0, f)
    }
}

/// Test transformation.
#[cfg(test)]
macro_rules! test {
    (ignore, $syntax:expr, $tr:expr, $test_name:ident, $input:expr, $expected:expr) => {
        #[test]
        #[ignore]
        fn $test_name() {
            test_transform!($syntax, $tr, $input, $expected)
        }
    };

    ($syntax:expr, $tr:expr, $test_name:ident, $input:expr, $expected:expr) => {
        #[test]
        fn $test_name() {
            test_transform!($syntax, $tr, $input, $expected)
        }
    };

    ($syntax:expr, $tr:expr, $test_name:ident, $input:expr, $expected:expr, ok_if_code_eq) => {
        #[test]
        fn $test_name() {
            test_transform!($syntax, $tr, $input, $expected, true)
        }
    };
}

macro_rules! exec_tr {
    ($syntax:expr, $tr:expr, $test_name:ident, $input:expr) => {{
        common::exec_tr(stringify!($test_name), $syntax, $tr, $input);
    }};
}

pub fn exec_tr<F, P>(test_name: &'static str, syntax: Syntax, tr: F, input: &str)
where
    F: FnOnce(&mut Tester<'_>) -> P,
    P: Fold,
{
    Tester::run(|tester| {
        let tr = make_tr(test_name, tr, tester);

        let module = tester.apply_transform(
            tr,
            "input.js",
            syntax,
            &format!(
                "it('should work', function () {{
                    {}
                }})",
                input
            ),
        )?;
        match ::std::env::var("PRINT_HYGIENE") {
            Ok(ref s) if s == "1" => {
                let hygiene_src = tester.print(&module.clone().fold_with(&mut HygieneVisualizer));
                println!("----- Hygiene -----\n{}", hygiene_src);
            }
            _ => {}
        }

        let module = COMMENTS.set(&Comments::default(), || {
            module
                .fold_with(&mut swc_ecma_transforms::debug::validator::Validator {
                    name: "actual-1",
                })
                .fold_with(&mut swc_ecma_transforms::hygiene())
                .fold_with(&mut swc_ecma_transforms::debug::validator::Validator {
                    name: "actual-2",
                })
                .fold_with(&mut swc_ecma_transforms::fixer())
                .fold_with(&mut swc_ecma_transforms::debug::validator::Validator {
                    name: "actual-3",
                })
        });

        let src_without_helpers = tester.print(&module);
        let module = module.fold_with(&mut InjectHelpers {});

        let src = tester.print(&module);
        let root = Path::new(env!("CARGO_MANIFEST_DIR"))
            .join("target")
            .join("testing")
            .join(test_name);

        // Remove outputs from previous tests
        let _ = remove_dir_all(&root);

        create_dir_all(&root).expect("failed to create parent directory for temp directory");

        let tmp_dir = tempdir_in(&root).expect("failed to create a temp directory");
        create_dir_all(&tmp_dir).unwrap();

        let path = tmp_dir.path().join(format!("{}.test.js", test_name));

        let mut tmp = OpenOptions::new()
            .create(true)
            .write(true)
            .open(&path)
            .expect("failed to create a temp file");
        write!(tmp, "{}", src).expect("failed to write to temp file");
        tmp.flush().unwrap();

        println!(
            "\t>>>>> Orig <<<<<\n{}\n\t>>>>> Code <<<<<\n{}",
            input, src_without_helpers
        );

        let status = Command::new("jest")
            .args(&["--testMatch", &format!("{}", path.display())])
            .current_dir(root)
            .status()
            .expect("failed to run jest");
        if status.success() {
            return Ok(());
        }
        ::std::mem::forget(tmp_dir);
        panic!("Execution failed")
    })
}

/// Test transformation.
#[cfg(test)]
macro_rules! test_exec {
    (ignore, $syntax:expr, $tr:expr, $test_name:ident, $input:expr) => {
        #[test]
        #[ignore]
        fn $test_name() {
            exec_tr!($syntax, $tr, $test_name, $input)
        }
    };

    ($syntax:expr, $tr:expr, $test_name:ident, $input:expr) => {
        #[test]
        fn $test_name() {
            if ::std::env::var("EXEC").unwrap_or(String::from("")) == "0" {
                return;
            }

            exec_tr!($syntax, $tr, $test_name, $input)
        }
    };
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

struct Normalizer;
impl Fold for Normalizer {
    fn fold_pat_or_expr(&mut self, n: PatOrExpr) -> PatOrExpr {
        match n {
            PatOrExpr::Pat(box Pat::Expr(e)) => PatOrExpr::Expr(e),
            _ => n,
        }
    }
}

struct HygieneVisualizer;
impl Fold for HygieneVisualizer {
    fn fold_ident(&mut self, ident: Ident) -> Ident {
        Ident {
            sym: format!("{}{:?}", ident.sym, ident.span.ctxt()).into(),
            ..ident
        }
    }
}
