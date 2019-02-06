use crate::helpers::{InjectHelpers, HELPERS};
use ast::*;
use sourcemap::SourceMapBuilder;
use std::{
    fmt,
    fs::{create_dir_all, OpenOptions},
    io::{self, Write},
    path::Path,
    process::Command,
    sync::{Arc, RwLock},
};
use swc_common::{errors::Handler, sync::Lrc, FileName, Fold, FoldWith, SourceMap};
use swc_ecma_codegen::Emitter;
use swc_ecma_parser::{Parser, Session, SourceFileInput, Syntax};
use tempfile::tempdir_in;

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
        let out = ::testing::run_test(false, |cm, handler| {
            HELPERS.set(&Default::default(), || op(&mut Tester { cm, handler }))
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
        F: FnOnce(&mut Parser<SourceFileInput>) -> Result<T, ()>,
    {
        let fm = self
            .cm
            .new_source_file(FileName::Real(file_name.into()), src.into());

        let sess = Session {
            handler: &self.handler,
        };

        let mut p = Parser::new(sess, syntax, SourceFileInput::from(&*fm), None);
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
                let mut p = Parser::new(sess, syntax, SourceFileInput::from(&*fm), None);
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

fn make_tr<F, P>(op: F, tester: &mut Tester) -> P
where
    F: FnOnce(&mut Tester) -> P,
    P: Fold<Module>,
{
    op(tester)
}

#[cfg(test)]
macro_rules! test_transform {
    ($syntax:expr, $tr:expr, $input:expr, $expected:expr) => {
        test_transform!($syntax, $tr, $input, $expected, false)
    };

    ($syntax:expr, $tr:expr, $input:expr, $expected:expr, $ok_if_code_eq:expr) => {{
        crate::tests::test_transform($syntax, $tr, $input, $expected, $ok_if_code_eq);
    }};
}

pub(crate) fn test_transform<F, P>(
    syntax: Syntax,
    tr: F,
    input: &str,
    expected: &str,
    ok_if_code_eq: bool,
) where
    F: FnOnce(&mut Tester) -> P,
{
    crate::tests::Tester::run(|tester| {
        let expected =
            tester.apply_transform(::testing::DropSpan, "output.js", syntax, expected)?;

        eprintln!("----- Actual -----");

        let tr = crate::tests::make_tr(tr, tester);
        let actual = tester
            .apply_transform(tr, "input.js", syntax, input)?
            .fold_with(&mut crate::hygiene::hygiene())
            .fold_with(&mut crate::fixer::fixer());

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

        println!(">>>>> Orig <<<<<\n{}", input);
        println!(">>>>> Code <<<<<\n{}", actual_src);
        assert_eq!(
            crate::tests::DebugUsingDisplay(&actual_src),
            crate::tests::DebugUsingDisplay(&expected_src)
        );
        return Err(());
    });
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
        crate::tests::exec_tr(stringify!($test_name), $syntax, $tr, $input);
    }};
}

pub(crate) fn exec_tr<F, P>(test_name: &str, syntax: Syntax, tr: F, input: &str)
where
    F: FnOnce(&mut Tester) -> P,
{
    Tester::run(|tester| {
        let tr = make_tr(tr, tester);

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
        let module = module
            .fold_with(&mut crate::hygiene::hygiene())
            .fold_with(&mut crate::fixer::fixer());

        let src_without_helpers = tester.print(&module);
        let module = module.fold_with(&mut InjectHelpers {
            cm: tester.cm.clone(),
        });

        let src = tester.print(&module);
        let root = Path::new(env!("CARGO_MANIFEST_DIR"))
            .join("target")
            .join("testing")
            .join(test_name);

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
