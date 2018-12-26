#![feature(box_syntax)]

extern crate rayon;
pub extern crate sourcemap;
pub extern crate swc_atoms as atoms;
pub extern crate swc_common as common;
pub extern crate swc_ecmascript as ecmascript;

use self::{
    common::{errors::Handler, sync::Lrc, FileName, Globals, SourceMap, GLOBALS},
    ecmascript::{
        ast::Module,
        codegen::{self, Emitter},
        parser::{Parser, Session as ParseSess, SourceFileInput, Syntax},
    },
};
use sourcemap::SourceMapBuilder;
use std::{io, path::Path};

pub struct Compiler {
    pub globals: Globals,
    pub cm: Lrc<SourceMap>,
    handler: Handler,
}

impl Compiler {
    pub fn new(cm: Lrc<SourceMap>, handler: Handler) -> Self {
        Compiler {
            cm,
            handler,
            globals: Globals::new(),
        }
    }

    pub fn run<F, T>(&self, op: F) -> T
    where
        F: FnOnce() -> T,
    {
        GLOBALS.set(&self.globals, op)
    }

    pub fn parse_js(&self, name: FileName, syntax: Syntax, src: &str) -> Result<Module, ()> {
        self.run(|| {
            let fm = self.cm.new_source_file(name, src.into());

            let session = ParseSess {
                handler: &self.handler,
                cfg: Default::default(),
            };
            Parser::new(session, syntax, SourceFileInput::from(&*fm)).parse_module()
        })
    }

    /// TODO
    pub fn parse_js_file(&self, syntax: Syntax, path: &Path) -> Result<Module, ()> {
        self.run(|| {
            let fm = self.cm.load_file(path).expect("failed to load file");

            let session = ParseSess {
                handler: &self.handler,
                cfg: Default::default(),
            };
            Parser::new(session, syntax, SourceFileInput::from(&*fm)).parse_module()
        })
    }

    /// Returns code, sourcemap (if config is file)
    pub fn emit_module(
        &self,
        module: &Module,
        cfg: codegen::Config,
    ) -> io::Result<(String, sourcemap::SourceMap)> {
        self.run(|| {
            let mut src_map_builder = SourceMapBuilder::new(None);
            let src = {
                let mut buf = vec![];
                {
                    let handlers = box MyHandlers;
                    let mut emitter = Emitter {
                        cfg,
                        cm: self.cm.clone(),
                        wr: box swc_ecmascript::codegen::text_writer::JsWriter::new(
                            self.cm.clone(),
                            "\n",
                            &mut buf,
                            &mut src_map_builder,
                        ),
                        handlers,
                        pos_of_leading_comments: Default::default(),
                    };

                    emitter.emit_module(&module)?;
                }
                String::from_utf8(buf).unwrap()
            };
            Ok((src, src_map_builder.into_sourcemap()))
        })
    }
}

struct MyHandlers;

impl swc_ecmascript::codegen::Handlers for MyHandlers {}
