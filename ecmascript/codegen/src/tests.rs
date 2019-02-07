extern crate swc_ecma_parser;
use self::swc_ecma_parser::{Parser, Session, SourceFileInput, Syntax};
use super::*;
use crate::config::Config;
use sourcemap::SourceMapBuilder;
use std::{
    fmt::{self, Debug, Display, Formatter},
    io::Write,
    sync::{Arc, RwLock},
};
use swc_common::{comments::Comments, FileName, FilePathMapping, SourceMap};

struct Noop;
impl Handlers for Noop {}

struct Builder {
    cfg: Config,
    cm: Lrc<SourceMap>,
    comments: Comments,
}

fn test(cm: Lrc<SourceMap>, comments: Comments) -> Builder {
    let src = SourceMap::new(FilePathMapping::empty());

    Builder {
        cfg: Default::default(),
        cm,
        comments,
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
            wr: Box::new(text_writer::JsWriter::new(
                self.cm.clone(),
                "\n",
                s,
                &mut src_map_builder,
            )),
            comments: Some(self.comments),
            handlers: Box::new(Noop),
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
    ::testing::run_test(false, |cm, handler| {
        let src = cm.new_source_file(FileName::Real("custom.js".into()), from.to_string());
        println!(
            "Source: \n{}\nPos: {:?} ~ {:?}",
            from, src.start_pos, src.end_pos
        );

        let mut parser = Parser::new(
            Session { handler: &handler },
            Syntax::default(),
            SourceFileInput::from(&*src),
            Some(Default::default()),
        );
        let res = parser.parse_module().map_err(|mut e| {
            e.emit();
            ()
        })?;

        let out = test(cm.clone(), parser.take_comments().unwrap())
            .text(from, |e| e.emit_module(&res).unwrap());
        assert_eq!(DebugUsingDisplay(&out), DebugUsingDisplay(to),);

        Ok(())
    })
    .unwrap();
}

#[test]
fn empty_stmt() {
    test_from_to(";", ";\n");
}

#[test]
fn comment_1() {
    test_from_to(
        "// foo
a",
        "// foo
a;
",
    );
}

#[test]
fn comment_2() {
    test_from_to("a // foo", "a; // foo");
}

#[test]
fn comment_3() {
    test_from_to(
        "// foo
// bar
a
// foo
b // bar",
        "// foo
// bar
a
// foo
b // bar",
    );
}

#[test]
fn comment_4() {
    test_from_to(
        "/** foo */
a",
        "/** foo */
a;
",
    );
}

#[test]
fn comment_5() {
    test_from_to(
        "// foo
// bar
a",
        "// foo
// bar
a;
",
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

#[derive(PartialEq, Eq)]
struct DebugUsingDisplay<'a>(&'a str);

impl<'a> Debug for DebugUsingDisplay<'a> {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        Display::fmt(self.0, f)
    }
}
