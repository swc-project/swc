use slog::Logger;
use sourcemap::SourceMapBuilder;
use std::{
    io::{self, Write},
    sync::{Arc, RwLock},
};
use swc_common::{errors::Handler, BytePos, FileName, Fold, FoldWith, SourceMap, Spanned};
use swc_ecma_ast::*;
use swc_ecma_codegen::Emitter;
use swc_ecma_parser::{Parser, Session, SourceFileInput};

pub fn fold<F>(module: Module, f: &mut F) -> Module
where
    F: ::swc_common::Folder<Module>,
{
    let module = f.fold(module);
    ::testing::drop_span(module)
}

struct MyHandlers;

impl swc_ecma_codegen::Handlers for MyHandlers {}

pub(crate) struct Noop;

pub(crate) struct Tester<'a> {
    cm: Rc<SourceMap>,
    logger: Logger,
    handler: &'a Handler,
}

impl<'a> Tester<'a> {
    pub fn run<F>(op: F)
    where
        F: FnOnce(&mut Tester),
    {
        let out = ::testing::run_test(|logger, cm, handler| {
            op(&mut Tester {
                cm,
                logger,
                handler,
            })
        });
    }

    pub fn apply_transform<T: Fold<Module>>(
        &mut self,
        mut tr: T,
        name: &'static str,
        src: &'static str,
    ) -> Module {
        let fm = self
            .cm
            .new_source_file(FileName::Real(name.into()), src.into());

        let module = {
            let handler = ::swc_common::errors::Handler::with_tty_emitter(
                ::swc_common::errors::ColorConfig::Auto,
                true,
                false,
                Some(self.cm.clone()),
            );
            let logger = ::testing::logger().new(o!("src" => src));

            let sess = Session {
                handler: &self.handler,
                logger: &logger,
                cfg: Default::default(),
            };

            let module = {
                let mut p = Parser::new(sess, SourceFileInput::from(&*fm));
                p.parse_module().unwrap_or_else(|err| {
                    err.emit();
                    panic!("failed to parse")
                })
            };
            // println!("parsed {} as a module\n{:?}", src, module);

            module
        };

        let module = fold(module, &mut tr);
        let module = ::testing::drop_span(module);
        let module = fold(module, &mut RemoveParen);
        module
    }

    pub fn print(&mut self, module: Module) -> String {
        let handlers = box MyHandlers;

        let sfl = self
            .cm
            .lookup_line(module.span().lo())
            .expect("failed to lookup line");
        let fm = sfl.fm;

        let mut wr = Buf(Arc::new(RwLock::new(vec![])));
        {
            let mut emitter = Emitter {
                cfg: swc_ecma_codegen::config::Config::default(),
                cm: self.cm.clone(),
                file: fm.clone(),
                enable_comments: true,
                srcmap: SourceMapBuilder::new(None),
                wr: box swc_ecma_codegen::text_writer::WriterWrapper::new("\n", &mut wr),
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

/// Test transformation.
#[cfg(test)]
macro_rules! test {
    ($tr:expr, $test_name:ident, $input:expr, $expected:expr) => {
        #[test]
        fn $test_name() {
            crate::tests::Tester::run(|tester| {
                let expected =
                    tester.apply_transform(::testing::DropSpan, stringify!($test_name), $expected);

                let actual = tester.apply_transform($tr, stringify!($test_name), $input);
                let actual = ::testing::drop_span(actual);

                if actual == expected {
                    return;
                }

                assert_eq!(tester.print(actual), tester.print(expected));
            });
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
            });
        }
    };
}

macro_rules! test_expr {
    ($l:expr, $r:expr) => {{
        crate::tests::Tester::run(|tester| {
            let expected = tester.apply_transform(::testing::DropSpan, "expected.js", $r);

            let actual = tester.apply_transform(SimplifyExpr, "actual.js", $l);
            let actual = ::testing::drop_span(actual);

            if actual == expected {
                return;
            }

            assert_eq!(tester.print(actual), tester.print(expected));
        });
    }};
    ($l:expr, $r:expr,) => {
        test_expr!($l, $r);
    };
}

/// Should not modify expression.
macro_rules! same_expr {
    ($l:expr) => {{
        crate::tests::Tester::run(|tester| {
            let expected = tester.apply_transform(::testing::DropSpan, "expected.js", $l);

            let actual = tester.apply_transform(SimplifyExpr, "actual.js", $l);

            if actual == expected {
                return;
            }

            assert_eq!(tester.print(actual), tester.print(expected));
        });
    }};
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

struct RemoveParen;
impl Fold<Expr> for RemoveParen {
    fn fold(&mut self, e: Expr) -> Expr {
        let e = e.fold_children(self);
        match e {
            Expr::Paren(e) => *e.expr,
            _ => e,
        }
    }
}
