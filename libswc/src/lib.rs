#![feature(box_syntax)]

extern crate rayon;
pub extern crate slog;
pub extern crate sourcemap;
pub extern crate swc_atoms as atoms;
pub extern crate swc_common as common;
pub extern crate swc_ecmascript as ecmascript;

use self::{
    common::{errors::Handler, sync::Lrc, FileName, SourceMap},
    ecmascript::{
        ast::Module,
        codegen::{self, Emitter},
        parser::{Parser, Session as ParseSess, SourceFileInput},
    },
};
use sourcemap::SourceMapBuilder;
use std::{
    io::{self, Write},
    path::Path,
};

pub struct Compiler {
    pub cm: Lrc<SourceMap>,
    handler: Handler,
}

impl Compiler {
    pub fn new(cm: Lrc<SourceMap>, handler: Handler) -> Self {
        Compiler { cm, handler }
    }

    pub fn parse_js(&self, name: FileName, src: &str) -> Result<Module, ()> {
        let fm = self.cm.new_source_file(name, src.into());

        let session = ParseSess {
            handler: &self.handler,
            cfg: Default::default(),
        };
        Parser::new(session, SourceFileInput::from(&*fm)).parse_module()
    }

    /// TODO
    pub fn parse_js_file(&self, path: &Path) -> Result<Module, ()> {
        let fm = self.cm.load_file(path).expect("failed to load file");

        let session = ParseSess {
            handler: &self.handler,
            cfg: Default::default(),
        };
        Parser::new(session, SourceFileInput::from(&*fm)).parse_module()
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
