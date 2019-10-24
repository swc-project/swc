#![feature(box_syntax, box_patterns)]

pub extern crate sourcemap;
pub extern crate swc_atoms as atoms;
pub extern crate swc_common as common;
pub extern crate swc_ecmascript as ecmascript;

pub mod config;
pub mod error;

use crate::{
    config::{BuiltConfig, Config, ConfigFile, Merge, Options, RootMode},
    error::Error,
};
use common::{
    comments::Comments, errors::Handler, FileName, FoldWith, Globals, SourceFile, SourceMap,
    GLOBALS,
};
use ecmascript::{
    ast::Module,
    codegen::{self, Emitter},
    parser::{Parser, Session as ParseSess, Syntax},
    transforms::{
        helpers::{self, Helpers},
        util,
    },
};
pub use ecmascript::{parser::SourceFileInput, transforms::chain_at};
use serde::Serialize;
use sourcemap::SourceMapBuilder;
use std::{fs::File, path::Path, sync::Arc};

pub struct Compiler {
    globals: Globals,
    pub cm: Arc<SourceMap>,
    handler: Handler,
}

#[derive(Serialize)]
pub struct TransformOutput {
    pub code: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub map: Option<String>,
}

/// These are **low-level** apis.
impl Compiler {
    /// Runs `op` in current compiler's context.
    ///
    /// Note: Other methods of `Compiler` already uses this internally.
    pub fn run<R, F>(&self, op: F) -> R
    where
        F: FnOnce() -> R,
    {
        GLOBALS.set(&self.globals, op)
    }

    /// This method parses a javascript / typescript file
    pub fn parse_js(
        &self,
        fm: Arc<SourceFile>,
        syntax: Syntax,
        comments: Option<&Comments>,
    ) -> Result<Module, Error> {
        self.run(|| {
            let session = ParseSess {
                handler: &self.handler,
            };
            let mut parser = Parser::new(session, syntax, SourceFileInput::from(&*fm), comments);
            let module = parser.parse_module().map_err(|mut e| {
                e.emit();
                Error::FailedToParseModule {}
            })?;

            Ok(module)
        })
    }

    pub fn print(
        &self,
        module: &Module,
        fm: Arc<SourceFile>,
        comments: &Comments,
        source_map: bool,
        minify: bool,
    ) -> Result<TransformOutput, Error> {
        self.run(|| {
            let mut src_map_builder = SourceMapBuilder::new(None);

            match fm.name {
                FileName::Real(ref p) => {
                    let id = src_map_builder.add_source(&p.display().to_string());
                    src_map_builder.set_source_contents(id, Some(&fm.src));
                }
                _ => {}
            }

            let src = {
                let mut buf = vec![];
                {
                    let handlers = box MyHandlers;
                    let mut emitter = Emitter {
                        cfg: codegen::Config { minify },
                        comments: if minify { None } else { Some(&comments) },
                        cm: self.cm.clone(),
                        wr: box codegen::text_writer::JsWriter::new(
                            self.cm.clone(),
                            "\n",
                            &mut buf,
                            if source_map {
                                Some(&mut src_map_builder)
                            } else {
                                None
                            },
                        ),
                        handlers,
                        pos_of_leading_comments: Default::default(),
                    };

                    emitter
                        .emit_module(&module)
                        .map_err(|err| Error::FailedToEmitModule { err })?;
                }
                // Invalid utf8 is valid in javascript world.
                unsafe { String::from_utf8_unchecked(buf) }
            };
            Ok(TransformOutput {
                code: src,
                map: if source_map {
                    let mut buf = vec![];
                    src_map_builder
                        .into_sourcemap()
                        .to_writer(&mut buf)
                        .map_err(|err| Error::FailedToWriteSourceMap { err })?;
                    let map =
                        String::from_utf8(buf).map_err(|err| Error::SourceMapNotUtf8 { err })?;
                    Some(map)
                } else {
                    None
                },
            })
        })
    }
}

/// High-level apis.
impl Compiler {
    pub fn new(cm: Arc<SourceMap>, handler: Handler) -> Self {
        Compiler {
            cm,
            handler,
            globals: Globals::new(),
        }
    }

    /// Handles config merging.
    pub fn config_for_file(&self, opts: &Options, fm: &SourceFile) -> Result<BuiltConfig, Error> {
        let Options {
            ref root,
            root_mode,
            swcrc,
            config_file,
            ..
        } = opts;
        let root = root
            .clone()
            .unwrap_or_else(|| ::std::env::current_dir().unwrap());

        let config_file = match config_file {
            Some(ConfigFile::Str(ref s)) => {
                let path = Path::new(s);
                let r = File::open(&path).map_err(|err| Error::FailedToReadConfigFile { err })?;
                let config: Config = serde_json::from_reader(r)
                    .map_err(|err| Error::FailedToParseConfigFile { err })?;
                Some(config)
            }
            _ => None,
        };

        if *swcrc {
            match fm.name {
                FileName::Real(ref path) => {
                    let mut parent = path.parent();
                    while let Some(dir) = parent {
                        let swcrc = dir.join(".swcrc");

                        if swcrc.exists() {
                            let r = File::open(&swcrc)
                                .map_err(|err| Error::FailedToReadConfigFile { err })?;
                            let mut config: Config = serde_json::from_reader(r)
                                .map_err(|err| Error::FailedToParseConfigFile { err })?;
                            if let Some(config_file) = config_file {
                                config.merge(&config_file)
                            }
                            let built = opts.build(&self.cm, &self.handler, Some(config));
                            return Ok(built);
                        }

                        if dir == root && *root_mode == RootMode::Root {
                            break;
                        }
                        parent = dir.parent();
                    }
                }
                _ => {}
            }
        }

        let built = opts.build(&self.cm, &self.handler, config_file);
        Ok(built)
    }

    pub fn process_js_file(
        &self,
        fm: Arc<SourceFile>,
        opts: Options,
    ) -> Result<TransformOutput, Error> {
        self.run(|| {
            if error::debug() {
                eprintln!("processing js file: {:?}", fm)
            }

            let config = self.config_for_file(&opts, &*fm)?;

            let comments = Default::default();
            let module = self.parse_js(
                fm.clone(),
                config.syntax,
                if config.minify { None } else { Some(&comments) },
            )?;
            let mut pass = config.pass;
            let module = helpers::HELPERS.set(&Helpers::new(config.external_helpers), || {
                util::HANDLER.set(&self.handler, || {
                    // Fold module
                    module.fold_with(&mut pass)
                })
            });

            self.print(&module, fm, &comments, config.source_maps, config.minify)
        })
    }
}

struct MyHandlers;

impl ecmascript::codegen::Handlers for MyHandlers {}
