use super::*;
use config::Config;
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
