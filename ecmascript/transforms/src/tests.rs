use slog::Logger;
use sourcemap::SourceMapBuilder;
use std::{
    io::{self, Write},
    rc::Rc,
    sync::{Arc, RwLock},
};
use swc_common::{errors::Handler, FileName, Fold, SourceMap};
use swc_ecma_ast::*;
use swc_ecma_codegen::Emitter;
use swc_ecma_parser::{Parser, Session, SourceFileInput};

pub fn fold<F>(module: Module, f: &mut F) -> Module
where
    F: ::swc_common::Fold<Module>,
{
    f.fold(module)
}

struct MyHandlers;

impl swc_ecma_codegen::Handlers for MyHandlers {}

pub(crate) struct Tester<'a> {
    cm: Rc<SourceMap>,
    logger: Logger,
    handler: &'a Handler,
}

impl<'a> Tester<'a> {
    pub fn run<F>(op: F)
    where
        F: FnOnce(&mut Tester) -> Result<(), ()>,
    {
        let out = ::testing::run_test(|logger, cm, handler| {
            op(&mut Tester {
                cm,
                logger,
                handler,
            })
        });

        match out {
            Ok(()) => {}
            Err(stderr) => panic!("Stderr:\n{}", stderr),
        }
    }

    pub fn apply_transform<T: Fold<Module>>(
        &mut self,
        mut tr: T,
        name: &'static str,
        src: &'static str,
    ) -> Result<Module, ()> {
        let fm = self
            .cm
            .new_source_file(FileName::Real(name.into()), src.into());

        let module = {
            let sess = Session {
                handler: &self.handler,
                logger: &self.logger,
                cfg: Default::default(),
            };

            let module = {
                let mut p = Parser::new(sess, SourceFileInput::from(&*fm));
                p.parse_module().map_err(|err| {
                    err.emit();
                    ()
                })?
            };
            // println!("parsed {} as a module\n{:?}", src, module);

            module
        };

        let module = fold(module, &mut tr);
        let module = ::testing::drop_span(module);
        let module = fold(module, &mut Normalizer);

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

#[cfg(test)]
macro_rules! test_transform {
    ($tr:expr, $input:expr, $expected:expr) => {
        test_transform!($tr, $input, $expected, false)
    };

    ($tr:expr, $input:expr, $expected:expr, $ok_if_src_eq:expr) => {{
        fn run(tester: &mut crate::tests::Tester) -> Result<(), ()> {
            let expected = tester.apply_transform(::testing::DropSpan, "expected.js", $expected)?;

            let actual = tester.apply_transform($tr, "actual.js", $input)?;
            let actual = ::tests::fold(actual, &mut crate::fixer::fixer());

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

            panic!(
                "\n>>>>> Actual <<<<<\n{}\n>>>>> Expected <<<<<\n{}",
                actual_src, expected_src
            );
            // assert_eq!(actual_src, expected_src);
        }
        crate::tests::Tester::run(run);
    }};
}

/// Test transformation.
#[cfg(test)]
macro_rules! test {
    ($tr:expr, $test_name:ident, $input:expr, $expected:expr) => {
        #[test]
        fn $test_name() {
            test_transform!($tr, $input, $expected)
        }
    };

    ($tr:expr, $test_name:ident, $input:expr, $expected:expr, ok_if_code_eq) => {
        #[test]
        fn $test_name() {
            test_transform!($tr, $input, $expected, true)
        }
    };
}

/// Test transformation.
#[cfg(test)]
macro_rules! test_exec {
    ($tr:expr, $test_name:ident, $input:expr) => {
        #[test]
        #[ignore]
        fn $test_name() {
            crate::tests::Tester::run(|tester| {
                let _transformed = tester.apply_transform($tr, stringify!($test_name), $input);

                Ok(())
            });
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
