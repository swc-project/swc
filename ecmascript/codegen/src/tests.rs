extern crate swc_ecma_parser;
extern crate testing;
use self::{
    swc_ecma_parser::{PResult, Parser, Session, SourceFileInput},
    testing::NormalizedOutput,
};
use super::*;
use config::Config;
use sourcemap::SourceMapBuilder;
use std::{
    fs::read_dir,
    io::Write,
    path::Path,
    sync::{Arc, RwLock},
};
use swc_common::{
    errors::{EmitterWriter, SourceMapperDyn},
    FileName, FilePathMapping, SourceMap,
};

struct Noop;
impl Handlers for Noop {}

struct Builder {
    cfg: Config,
    cm: Rc<SourceMap>,
}

fn test() -> Builder {
    let src = SourceMap::new(FilePathMapping::empty());

    Builder {
        cfg: Default::default(),
        cm: Rc::new(src),
    }
}

impl Builder {
    pub fn with<F, Ret>(self, src: &str, s: &mut Vec<u8>, op: F) -> Ret
    where
        F: FnOnce(&mut Emitter) -> Ret,
    {
        let mut e = Emitter {
            cfg: self.cfg,
            cm: self.cm.clone(),
            file: self.cm.new_source_file(FileName::Anon, src.to_string()),
            srcmap: SourceMapBuilder::new(None),
            wr: Box::new(text_writer::WriterWrapper::new("\n", s)),
            handlers: Box::new(Noop),
            enable_comments: true,
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
        src: &str,
        f: F,
    ) -> std::result::Result<Ret, NormalizedOutput>
    where
        F: for<'a> FnOnce(&mut Parser<'a, SourceFileInput>) -> PResult<'a, Ret>,
    {
        let output = self::testing::run_test(|logger, cm, handler| {
            let src = cm.new_source_file(FileName::Real(file_name.into()), src.to_string());
            println!("Source: {:?} ~ {:?}", src.start_pos, src.end_pos);

            let res = f(&mut Parser::new(
                Session {
                    logger: &logger,
                    handler: &handler,
                    cfg: Default::default(),
                },
                (&*src).into(),
            ));

            match res {
                Ok(res) => Some(res),
                Err(err) => {
                    err.emit();
                    None
                }
            }
        });

        if output.errors.is_empty() {
            Ok(output.result.unwrap())
        } else {
            Err(output.errors)
        }
    }
    let res = with_parser(Path::new("test.js"), from, |p| p.parse_module()).unwrap();

    assert_eq!(test().text(from, |e| e.emit_module(&res).unwrap()), to,);
}

#[test]
fn empty_stmt() {
    test_from_to(";", ";");
}

#[test]
fn simple_if_else_stmt() {
    test_from_to("if(true);else;", "if (true) ; else ;");
}

#[test]
fn arrow() {
    test_from_to("()=>void a", "()=>void a;");
}

#[test]
fn array() {
    test_from_to("[a, 'b', \"c\"]", "[a, 'b', \"c\"];");
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
