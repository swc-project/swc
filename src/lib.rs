#![feature(box_syntax)]
#![feature(box_patterns)]

extern crate fnv;
extern crate rayon;
extern crate serde;
extern crate serde_json;
pub extern crate sourcemap;
pub extern crate swc_atoms as atoms;
pub extern crate swc_common as common;
pub extern crate swc_ecmascript as ecmascript;

use self::{
    common::{errors::Handler, sync::Lrc, FileName, Globals, SourceMap, GLOBALS},
    config::Config,
    ecmascript::{
        ast::Module,
        codegen::{self, Emitter},
        parser::{Parser, Session as ParseSess, SourceFileInput, Syntax},
    },
};
use sourcemap::SourceMapBuilder;
use std::{
    cell::RefCell,
    collections::HashMap,
    fs::File,
    io,
    path::{Path, PathBuf},
    sync::Arc,
};

pub mod config;

pub struct Compiler {
    pub globals: Globals,
    pub cm: Lrc<SourceMap>,
    handler: Handler,
    config_caches: RefCell<HashMap<PathBuf, Arc<Config>>>,
}

impl Compiler {
    pub fn new(cm: Lrc<SourceMap>, handler: Handler) -> Self {
        Compiler {
            cm,
            handler,
            globals: Globals::new(),
            config_caches: Default::default(),
        }
    }

    pub fn config_for_file(&self, path: &Path) -> Result<Arc<Config>, io::Error> {
        assert!(!path.is_file());

        let mut parent = path.parent();
        while let Some(dir) = parent {
            let swcrc = dir.join(".swcrc");
            if let Some(c) = self.config_caches.borrow().get(&swcrc) {
                return Ok(c.clone());
            }

            if swcrc.exists() {
                let mut r = File::open(&swcrc)?;
                let config: Config = serde_json::from_reader(r)?;
                let arc = Arc::new(config);
                self.config_caches.borrow_mut().insert(swcrc, arc.clone());
                return Ok(arc);
            }

            parent = dir.parent();
        }

        Ok(Default::default())
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
            };
            Parser::new(session, syntax, SourceFileInput::from(&*fm))
                .parse_module()
                .map_err(|e| {
                    e.emit();
                    ()
                })
        })
    }

    /// TODO
    pub fn parse_js_file(&self, syntax: Option<Syntax>, path: &Path) -> Result<Module, ()> {
        self.run(|| {
            let syntax = syntax.unwrap_or_else(|| {
                self.config_for_file(path)
                    .map(|c| c.jsc.syntax)
                    .expect("failed to load config")
            });

            let fm = self.cm.load_file(path).expect("failed to load file");

            let session = ParseSess {
                handler: &self.handler,
            };
            Parser::new(session, syntax, SourceFileInput::from(&*fm))
                .parse_module()
                .map_err(|e| {
                    e.emit();
                    ()
                })
        })
    }

    /// Returns code, sourcemap
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
