extern crate swc_ecma_parser;
extern crate testing;
use self::{
    swc_ecma_parser::{PResult, Parser, Session, SourceFileInput, Syntax},
    testing::NormalizedOutput,
};
use super::*;
use crate::config::Config;
use sourcemap::SourceMapBuilder;
use std::{
    io::Write,
    path::Path,
    sync::{Arc, RwLock},
};
use swc_common::{FileName, FilePathMapping, SourceMap};

struct Noop;
impl Handlers for Noop {}

struct Builder {
    cfg: Config,
    cm: Lrc<SourceMap>,
}

fn test() -> Builder {
    let src = SourceMap::new(FilePathMapping::empty());

    Builder {
        cfg: Default::default(),
        cm: Lrc::new(src),
    }
}

impl Builder {
    pub fn with<F, Ret>(self, src: &str, s: &mut Vec<u8>, op: F) -> Ret
    where
        F: FnOnce(&mut Emitter) -> Ret,
    {
        let mut src_map_builder = SourceMapBuilder::new(Some(src));
        let mut e = Emitter {
            cfg: self.cfg,
            cm: self.cm.clone(),
            wr: box text_writer::JsWriter::new(self.cm.clone(), "\n", s, &mut src_map_builder),
            handlers: box Noop,
            pos_of_leading_comments: Default::default(),
        };

        let ret = op(&mut e);

        ret
    }

    pub fn text<F>(self, src: &str, op: F) -> String
    where
        F: FnOnce(&mut Emitter),
    {
        let mut buf = vec![];

        self.with(src, &mut buf, op);

        String::from_utf8(buf).unwrap()
    }
}

fn test_from_to(from: &str, to: &str) {
    fn with_parser<F, Ret>(
        file_name: &Path,
        s: &str,
        f: F,
    ) -> std::result::Result<Ret, NormalizedOutput>
    where
        F: for<'a> FnOnce(&mut Parser<'a, SourceFileInput>) -> PResult<'a, Ret>,
    {
        self::testing::run_test(true, |cm, handler| {
            let src = cm.new_source_file(FileName::Real(file_name.into()), s.to_string());
            println!(
                "Source: \n{}\nPos: {:?} ~ {:?}",
                s, src.start_pos, src.end_pos
            );

            let res = f(&mut Parser::new(
                Session { handler: &handler },
                Syntax::Es,
                (&*src).into(),
            ))
            .map_err(|e| {
                e.emit();
                ()
            });

            res
        })
    }
    let res = with_parser(Path::new("test.js"), from, |p| p.parse_module()).unwrap();

    assert_eq!(test().text(from, |e| e.emit_module(&res).unwrap()), to,);
}

#[test]
fn empty_stmt() {
    test_from_to(";", ";\n");
}

#[test]
#[ignore]
fn simple_if_else_stmt() {
    test_from_to("if(true);else;", "if (true) ; else ;\n");
}

#[test]
#[ignore]
fn arrow() {
    test_from_to("()=>void a", "()=>void a;");
}

#[test]
#[ignore]
fn array() {
    test_from_to("[a, 'b', \"c\"]", "[a, 'b', 'c'];");
}

#[test]
#[ignore]
fn comment_1() {
    test_from_to(
        "// foo
a",
        "// foo
a;",
    );
}

#[test]
#[ignore]
fn comment_2() {
    test_from_to("a // foo", "a; // foo");
}

#[test]
#[ignore]
fn comment_3() {
    test_from_to(
        "// foo
        // bar
        a
        // foo
        b
        // bar",
        "// foo
        // bar
        a
        // foo
        b
        // bar",
    );
}

#[test]
#[ignore]
fn comment_4() {
    test_from_to("/** foo */ a", "/** foo */  a;");
}

#[test]
#[ignore]
fn comment_5() {
    test_from_to(
        "// foo
        // bar
        a",
        "// foo
        // bar
        a;",
    );
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
