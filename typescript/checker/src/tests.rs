use sourcemap::SourceMapBuilder;
use std::{
    io::{self, Write},
    sync::{Arc, RwLock},
};
use swc_common::{errors::Handler, FileName, Fold, FoldWith, SourceMap};
use swc_ecma_ast::*;
use swc_ecma_codegen::Emitter;
use swc_ecma_parser::{Parser, Session, SourceFileInput, Syntax, TsConfig};

pub(crate) struct Tester<'a> {
    pub cm: Arc<SourceMap>,
    pub handler: &'a Handler,
}

struct MyHandlers;

impl swc_ecma_codegen::Handlers for MyHandlers {}

impl<'a> Tester<'a> {
    pub fn run<F, R>(op: F) -> R
    where
        F: FnOnce(&mut Tester) -> Result<R, ()>,
    {
        let out = ::testing::run_test(false, |cm, handler| op(&mut Tester { cm, handler }));

        match out {
            Ok(res) => res,
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
        self.with_parser(
            file_name,
            Syntax::Typescript(TsConfig {
                ..Default::default()
            }),
            src,
            |p| {
                p.parse_module().map_err(|mut e| {
                    e.emit();
                    ()
                })
            },
        )
    }

    pub fn parse_stmts(&mut self, file_name: &str, src: &str) -> Result<Vec<Stmt>, ()> {
        let stmts = self.with_parser(
            file_name,
            Syntax::Typescript(TsConfig {
                ..Default::default()
            }),
            src,
            |p| {
                p.parse_script()
                    .map_err(|mut e| {
                        e.emit();
                        ()
                    })
                    .map(|script| script.body)
            },
        )?;

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
                    Some(&mut src_map_builder),
                ),
                comments: None,
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
