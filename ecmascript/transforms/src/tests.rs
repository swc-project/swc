use sourcemap::SourceMapBuilder;
use std::{
    io::{self, Write},
    rc::Rc,
    sync::{Arc, RwLock},
};
use swc_common::{BytePos, FileName, Fold};
use swc_ecma_ast::*;
use swc_ecma_codegen::Emitter;
use swc_ecma_parser::{Parser, Session, SourceFileInput};

pub fn fold<F>(module: ::swc_ecma_ast::Module, f: &mut F) -> ::swc_ecma_ast::Module
where
    F: ::swc_common::Folder<::swc_ecma_ast::Module>,
{
    let module = f.fold(module);
    // normalize (remove span)
    ::testing::drop_span(module)
}

struct MyHandlers;

impl swc_ecma_codegen::Handlers for MyHandlers {}

pub(crate) struct Noop;

pub fn apply_transform<T: Fold<Module>>(
    mut tr: T,
    name: &'static str,
    src: &'static str,
) -> String {
    let out = ::testing::run_test(|logger, cm, handler| {
        let fm = cm.new_source_file(FileName::Real(name.into()), src.into());

        let module = {
            let handler = ::swc_common::errors::Handler::with_tty_emitter(
                ::swc_common::errors::ColorConfig::Auto,
                true,
                false,
                Some(cm.clone()),
            );
            let logger = ::testing::logger().new(o!("src" => src));

            let sess = Session {
                handler: &handler,
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

        let handlers = box MyHandlers;

        let mut wr = Buf(Arc::new(RwLock::new(vec![])));
        {
            let mut emitter = Emitter {
                cfg: swc_ecma_codegen::config::Config::default(),
                cm,
                file: fm.clone(),
                enable_comments: true,
                srcmap: SourceMapBuilder::new(Some(&src)),
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
    });

    out.result
}

/// Test transformation.
#[cfg(test)]
macro_rules! test {
    ($tr:expr, $test_name:ident, $input:expr, $expected:expr) => {
        #[test]
        fn $test_name() {
            let actual = $crate::tests::apply_transform($tr, stringify!($test_name), $input);
            let expected = $crate::tests::apply_transform(
                $crate::tests::Noop,
                stringify!($test_name),
                $expected,
            );

            assert_eq_ignore_span!(actual, expected);
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
            let _transformed = $crate::tests::apply_transform($tr, stringify!($test_name), $input);
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
