extern crate swc_ecma_parser;
extern crate testing;
use super::*;
use config::Config;
use std::{
    fs::read_dir, io::Write, path::Path, sync::{Arc, RwLock},
};
use swc_common::errors::{CodeMap, FilePathMapping};

struct Noop;
impl Handlers for Noop {}

struct Builder {
    cfg: Config,
    cm: Rc<CodeMap>,
}

fn test() -> Builder {
    Builder {
        cfg: Default::default(),
        cm: Rc::new(CodeMap::new(FilePathMapping::empty())),
    }
}

impl Builder {
    pub fn with<F, Ret>(self, s: &mut Vec<u8>, op: F) -> Ret
    where
        F: FnOnce(&mut Emitter) -> Ret,
    {
        let mut e = Emitter {
            cfg: self.cfg,
            cm: self.cm,
            srcmap: SourceMapBuilder::new(None),
            wr: Box::new(text_writer::WriterWrapper::new("\n", s)),
            handlers: Box::new(Noop),
            enable_comments: true,
        };

        let ret = op(&mut e);

        ret
    }

    pub fn text<F>(self, op: F) -> String
    where
        F: FnOnce(&mut Emitter),
    {
        let mut buf = vec![];

        self.with(&mut buf, op);

        String::from_utf8(buf).unwrap()
    }
}

#[test]
fn empty_stmt() {
    assert_eq!(
        test().text(|e| {
            e.emit_empty_stmt(&EmptyStmt {
                span: Default::default(),
            }).unwrap();
        }),
        ";"
    );
}

#[test]
fn simple_if_else_stmt() {
    assert_eq!(
        test().text(|e| IfStmt {
            span: Default::default(),
            test: box Expr::Lit(Lit::Bool(Bool {
                value: true,
                span: Default::default(),
            })),
            cons: box Stmt::Empty(EmptyStmt {
                span: Default::default(),
            }),
            alt: Some(box Stmt::Empty(EmptyStmt {
                span: Default::default(),
            })),
        }.emit_with(e)
            .unwrap()),
        "if(true);else;"
    );
}

#[test]
fn identity() {
    let path_to_tests = Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("..")
        .join("parser")
        .join("tests")
        .join("test262-parser")
        .join("pass");

    let files = read_dir(path_to_tests).expect("failed to read test262 parser tests");

    let cm = Rc::new(CodeMap::new(FilePathMapping::empty()));
    let buf = Buf(Arc::new(RwLock::new(vec![])));
    let e =
        ::swc_common::errors::EmitterWriter::new(Box::new(buf.clone()), Some(cm.clone()), false);
    let handler = ::swc_common::errors::Handler::with_emitter(
        Box::new(e),
        ::swc_common::errors::HandlerFlags {
            treat_err_as_bug: true,
            ..Default::default()
        },
    );
    let logger = testing::logger();

    for f in files {
        let f = f.unwrap();
        println!("{:?}", f.file_name());

        let fm = cm.load_file(&f.path()).expect("failed to load the file");

        let mut p = swc_ecma_parser::Parser::new(
            swc_ecma_parser::Session {
                handler: &handler,
                cfg: Default::default(),
                logger: &logger,
            },
            swc_ecma_parser::FileMapInput::from(&*fm),
        );

        if f.file_name().to_str().unwrap().ends_with("module.js") {
            p.parse_module().unwrap_or_else(|err| {
                err.emit();
                unreachable!()
            });
        } else {
            p.parse_script().unwrap_or_else(|err| {
                err.emit();
                unreachable!()
            });
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
