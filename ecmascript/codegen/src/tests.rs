extern crate swc_ecma_parser;
use self::swc_ecma_parser::{Parser, Session, SourceFileInput, Syntax};
use super::*;
use crate::config::Config;
use std::{
    fmt::{self, Debug, Display, Formatter},
    io::Write,
    sync::{Arc, RwLock},
};
use swc_common::{comments::Comments, FileName, SourceMap};

struct Noop;
impl Handlers for Noop {}

struct Builder {
    cfg: Config,
    cm: Arc<SourceMap>,
    comments: Comments,
}

impl Builder {
    pub fn with<F, Ret>(self, src: &str, s: &mut Vec<u8>, op: F) -> Ret
    where
        F: FnOnce(&mut Emitter) -> Ret,
    {
        let mut e = Emitter {
            cfg: self.cfg,
            cm: self.cm.clone(),
            wr: Box::new(text_writer::JsWriter::new(self.cm.clone(), "\n", s, None)),
            comments: Some(&self.comments),
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

fn parse_then_emit(from: &str, cfg: Config) -> String {
    ::testing::run_test(false, |cm, handler| {
        let src = cm.new_source_file(FileName::Real("custom.js".into()), from.to_string());
        println!(
            "--------------------\nSource: \n{}\nPos: {:?} ~ {:?}\n",
            from, src.start_pos, src.end_pos
        );

        let comments = Default::default();
        let res = {
            let mut parser = Parser::new(
                Session { handler: &handler },
                Syntax::default(),
                SourceFileInput::from(&*src),
                Some(&comments),
            );
            parser.parse_module().map_err(|mut e| {
                e.emit();
            })?
        };

        let out = Builder { cfg, cm, comments }.text(from, |e| e.emit_module(&res).unwrap());
        Ok(out)
    })
    .unwrap()
}

pub(crate) fn assert_min(from: &str, to: &str) {
    let out = parse_then_emit(from, Config { minify: true });

    assert_eq!(DebugUsingDisplay(out.trim()), DebugUsingDisplay(to),);
}

pub(crate) fn assert_pretty(from: &str, to: &str) {
    let out = parse_then_emit(from, Config { minify: false });

    assert_eq!(DebugUsingDisplay(&out.trim()), DebugUsingDisplay(to),);
}

fn test_from_to(from: &str, to: &str) {
    let out = parse_then_emit(from, Default::default());

    assert_eq!(DebugUsingDisplay(out.trim()), DebugUsingDisplay(to.trim()),);
}

#[test]
fn empty_stmt() {
    test_from_to(";", ";");
}

#[test]
fn comment_1() {
    test_from_to(
        "// foo
a",
        "// foo
a;",
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
a;
// foo
b; // bar",
    );
}

#[test]
fn comment_4() {
    test_from_to(
        "/** foo */
a",
        "/** foo */
a;",
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
a;",
    );
}

#[test]
fn no_octal_escape() {
    test_from_to(
        r#"'\x00a';
'\x000';
'\x001';
'\x009'"#,
        r#"'\0a';
'\x000';
'\x001';
'\x009';"#,
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
