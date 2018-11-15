#![feature(box_syntax)]

extern crate rayon;
#[macro_use]
extern crate slog;
pub extern crate swc_atoms as atoms;
pub extern crate swc_common as common;
pub extern crate swc_ecmascript as ecmascript;
pub extern crate swc_macros as macros;

use self::{
    common::{errors::Handler, sourcemap::SourceMapBuilder, SourceMap, Spanned},
    ecmascript::{
        ast::Module,
        codegen::{self, Emitter},
        parser::{Parser, Session as ParseSess, SourceFileInput},
    },
};
use rayon::ThreadPool;
use slog::Logger;
use std::{
    io::{self, Write},
    path::Path,
    rc::Rc,
};

pub struct Compiler {
    cm: Rc<SourceMap>,
    logger: Logger,
    handler: Handler,
}

impl Compiler {
    pub fn new(logger: Logger, cm: Rc<SourceMap>, handler: Handler) -> Self {
        Compiler {
            cm,
            logger,
            handler,
        }
    }

    /// TODO
    pub fn parse_js(&self, path: &Path) -> Result<Module, ()> {
        let fm = self.cm.load_file(path).expect("failed to load file");

        let logger = self
            .logger
            .new(o!("input" => format!("{}", path.display())));
        {
            let session = ParseSess {
                handler: &self.handler,
                logger: &logger,
                cfg: Default::default(),
            };
            let module = Parser::new(session, SourceFileInput::from(&*fm))
                .parse_module()
                .map_err(|e| {
                    e.emit();
                    ()
                });
            module
        }
    }

    pub fn emit_module(
        &self,
        module: &Module,
        cfg: codegen::Config,
        wr: &mut Write,
    ) -> io::Result<()> {
        let mut src_map_builder = SourceMapBuilder::new(None);
        {
            let handlers = box MyHandlers;
            let mut emitter = Emitter {
                cfg,
                cm: self.cm.clone(),
                wr: box swc_ecmascript::codegen::text_writer::JsWriter::new(
                    self.cm.clone(),
                    "\n",
                    wr,
                    &mut src_map_builder,
                ),
                handlers,
                pos_of_leading_comments: Default::default(),
            };

            emitter.emit_module(&module)
        }
    }
}

struct MyHandlers;

impl swc_ecmascript::codegen::Handlers for MyHandlers {}
