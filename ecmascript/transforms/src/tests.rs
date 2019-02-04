use crate::helpers::Helpers;
use ast::*;
use sourcemap::SourceMapBuilder;
use std::{
    fmt,
    io::{self, Write},
    sync::{Arc, RwLock},
};
use swc_common::{errors::Handler, sync::Lrc, FileName, Fold, FoldWith, SourceMap};
use swc_ecma_codegen::Emitter;
use swc_ecma_parser::{Parser, Session, SourceFileInput, Syntax};

struct MyHandlers;

impl swc_ecma_codegen::Handlers for MyHandlers {}

pub(crate) struct Tester<'a> {
    pub cm: Lrc<SourceMap>,
    pub handler: &'a Handler,
}

impl<'a> Tester<'a> {
    pub fn run<F>(op: F)
    where
        F: FnOnce(&mut Tester) -> Result<(), ()>,
    {
        let out = ::testing::run_test(false, |cm, handler| op(&mut Tester { cm, handler }));

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
        F: FnOnce(&mut Parser<SourceFileInput>) -> Result<T, ()>,
    {
        let fm = self
            .cm
            .new_source_file(FileName::Real(file_name.into()), src.into());

        let sess = Session {
            handler: &self.handler,
        };

        let mut p = Parser::new(sess, syntax, SourceFileInput::from(&*fm));
        op(&mut p)
    }

    pub fn parse_module(&mut self, file_name: &str, src: &str) -> Result<Module, ()> {
        self.with_parser(file_name, Syntax::default(), src, |p| {
            p.parse_module().map_err(|mut e| {
                e.emit();
                ()
            })
        })
    }

    pub fn parse_stmts(&mut self, file_name: &str, src: &str) -> Result<Vec<Stmt>, ()> {
        let stmts = self.with_parser(file_name, Syntax::default(), src, |p| {
            p.parse_script().map_err(|mut e| {
                e.emit();
                ()
            })
        })?;

        Ok(stmts)
    }

    pub fn parse_stmt(&mut self, file_name: &str, src: &str) -> Result<Stmt, ()> {
        let mut stmts = self.parse_stmts(file_name, src)?;
        assert!(stmts.len() == 1);

        Ok(stmts.pop().unwrap())
    }

    pub fn apply_transform<T: Fold<Module>>(
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

            let module = {
                let mut p = Parser::new(sess, syntax, SourceFileInput::from(&*fm));
                p.parse_module().map_err(|mut e| {
                    e.emit();
                    ()
                })?
            };
            // println!("parsed {} as a module\n{:?}", src, module);

            module
        };

        let module = module
            .fold_with(&mut tr)
            .fold_with(&mut ::testing::DropSpan)
            .fold_with(&mut Normalizer);

        Ok(module)
    }

    pub fn print(&mut self, module: &Module) -> String {
        let handlers = box MyHandlers;

        let mut wr = Buf(Arc::new(RwLock::new(vec![])));
        {
            let mut src_map_builder = SourceMapBuilder::new(None);
            let mut emitter = Emitter {
                cfg: Default::default(),
                cm: self.cm.clone(),
                wr: box swc_ecma_codegen::text_writer::JsWriter::new(
                    self.cm.clone(),
                    "\n",
                    &mut wr,
                    &mut src_map_builder,
                ),
                handlers,
                pos_of_leading_comments: Default::default(),
            };

            // println!("Emitting: {:?}", module);
            emitter.emit_module(&module).unwrap();
        }

        let r = wr.0.read().unwrap();
        let s = String::from_utf8_lossy(&*r);
        s.to_string()
    }
}

pub(crate) fn assert_type<F, P>(v: F) -> F
where
    F: FnOnce(&mut Tester, Arc<Helpers>) -> P,
    P: Fold<Module>,
{
    v
}

#[cfg(test)]
macro_rules! test_transform {
    ($syntax:expr, $tr:expr, $input:expr, $expected:expr) => {
        test_transform!($syntax, $tr, $input, $expected, false)
    };

    ($syntax:expr, $tr:expr, $input:expr, $expected:expr, $ok_if_src_eq:expr) => {{
        use crate::helpers::Helpers;
        use std::sync::Arc;
        use swc_common::FoldWith;

        crate::tests::Tester::run(|tester: &mut crate::tests::Tester| {
            let expected =
                tester.apply_transform(::testing::DropSpan, "expected.js", $syntax, $expected)?;

            eprintln!("----- Actual -----");
            let helpers = Arc::new(Helpers::default());
            let tr = (crate::tests::assert_type($tr))(tester, helpers.clone());
            let actual = tester
                .apply_transform(tr, "actual.js", $syntax, $input)?
                .fold_with(&mut crate::hygiene::hygiene())
                .fold_with(&mut crate::fixer::fixer());

            if actual == expected {
                return Ok(());
            }

            let (actual_src, expected_src) = (tester.print(&actual), tester.print(&expected));

            if actual_src == expected_src {
                if $ok_if_src_eq {
                    return Ok(());
                }
                // Diff it
                println!(">>>>> Code <<<<<\n{}", actual_src);
                assert_eq!(actual, expected, "different ast was detected");
                unreachable!()
            }

            println!(">>>>> Orig <<<<<\n{}", $input);
            println!(">>>>> Code <<<<<\n{}", actual_src);
            assert_eq!(
                crate::tests::DebugUsingDisplay(&actual_src),
                crate::tests::DebugUsingDisplay(&expected_src)
            );
            unreachable!()
            // panic!(
            //     "\n\t>>>>> Code <<<<<\n{}\n\t>>>>> Actual <<<<<\n{}\n\t>>>>> Expected
            // <<<<<\n{}",     $input, actual_src, expected_src
            // );
        });
    }};
}

#[derive(PartialEq, Eq)]
pub(crate) struct DebugUsingDisplay<'a>(pub &'a str);
impl<'a> fmt::Debug for DebugUsingDisplay<'a> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
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
        use crate::helpers::{Helpers, InjectHelpers};
        use std::{
            fs::{create_dir_all, OpenOptions},
            io::Write,
            path::Path,
            process::Command,
            sync::Arc,
        };
        use swc_common::FoldWith;
        use tempfile::tempdir_in;

        crate::tests::Tester::run(|tester| {
            let helpers = Arc::new(Helpers::default());
            let tr = (crate::tests::assert_type($tr))(tester, helpers.clone());

            let module = tester.apply_transform(
                tr,
                "input.js",
                $syntax,
                &format!(
                    "it('should work', function () {{
                    {}
                }})",
                    $input
                ),
            )?;
            let module = module
                .fold_with(&mut crate::hygiene::hygiene())
                .fold_with(&mut crate::fixer::fixer());

            let src_without_helpers = tester.print(&module);
            let module = module.fold_with(&mut InjectHelpers {
                cm: tester.cm.clone(),
                helpers: helpers.clone(),
            });

            let src = tester.print(&module);
            let root = Path::new(env!("CARGO_MANIFEST_DIR"))
                .join("target")
                .join("testing")
                .join(stringify!($test_name));
            create_dir_all(&root).unwrap();

            let tmp_dir = tempdir_in(&root).expect("failed to create a temp directory");
            create_dir_all(&tmp_dir).unwrap();

            let path = tmp_dir
                .path()
                .join(format!("{}.test.js", stringify!($test_name)));

            let mut tmp = OpenOptions::new()
                .create(true)
                .write(true)
                .open(&path)
                .expect("failed to create a temp file");
            write!(tmp, "{}", src).expect("failed to write to temp file");
            tmp.flush().unwrap();

            println!(
                "\t>>>>> Orig <<<<<\n{}\n\t>>>>> Code <<<<<\n{}",
                $input, src_without_helpers
            );

            let status = Command::new("jest")
                .args(&["--testMatch", &format!("{}", path.display())])
                .current_dir(root)
                .status()
                .expect("failed to run jest");
            if status.success() {
                return Ok(());
            }
            panic!("Execution failed")
        });
    }};
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
impl Fold<PatOrExpr> for Normalizer {
    fn fold(&mut self, n: PatOrExpr) -> PatOrExpr {
        match n {
            PatOrExpr::Pat(box Pat::Expr(e)) => PatOrExpr::Expr(e),
            _ => n,
        }
    }
}
