#![feature(box_syntax, box_patterns)]

pub use atoms;
pub use common;
pub use ecmascript;
pub use sourcemap;

mod builder;
pub mod config;
pub mod error;

pub use crate::builder::PassBuilder;
use crate::{
    config::{BuiltConfig, ConfigFile, JscTarget, Merge, Options, Rc, RootMode},
    error::Error,
};
use common::{
    comments::Comments, errors::Handler, FileName, FoldWith, Globals, SourceFile, SourceMap,
    GLOBALS,
};
use ecmascript::{
    ast::Program,
    codegen::{self, Emitter},
    parser::{lexer::Lexer, Parser, Session as ParseSess, Syntax},
    transforms::{
        helpers::{self, Helpers},
        util,
    },
};
pub use ecmascript::{
    parser::SourceFileInput,
    transforms::{chain_at, pass::Pass},
};
use serde::Serialize;
use sourcemap::SourceMapBuilder;
use std::{fs::File, path::Path, sync::Arc};

pub struct Compiler {
    /// swc uses rustc's span interning.
    ///
    /// The `Globals` struct contains span interner.
    globals: Globals,
    /// CodeMap
    pub cm: Arc<SourceMap>,
    pub handler: Handler,
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
        GLOBALS.set(&self.globals, || op())
    }

    /// This method parses a javascript / typescript file
    pub fn parse_js(
        &self,
        fm: Arc<SourceFile>,
        target: JscTarget,
        syntax: Syntax,
        is_module: bool,
        comments: Option<&Comments>,
    ) -> Result<Program, Error> {
        self.run(|| {
            let session = ParseSess {
                handler: &self.handler,
            };
            let lexer = Lexer::new(
                session,
                syntax,
                target,
                SourceFileInput::from(&*fm),
                comments,
            );
            let mut parser = Parser::new_from(session, lexer);
            let program = if is_module {
                parser
                    .parse_module()
                    .map_err(|mut e| {
                        e.emit();
                        Error::FailedToParseModule {}
                    })
                    .map(Program::Module)?
            } else {
                parser
                    .parse_script()
                    .map_err(|mut e| {
                        e.emit();
                        Error::FailedToParseModule {}
                    })
                    .map(Program::Script)?
            };

            Ok(program)
        })
    }

    pub fn print(
        &self,
        program: &Program,
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
                        .emit_program(&program)
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

    /// This method handles merging of config.
    pub fn config_for_file(
        &self,
        opts: &Options,
        fm: &SourceFile,
    ) -> Result<BuiltConfig<impl Pass>, Error> {
        let Options {
            ref root,
            root_mode,
            swcrc,
            config_file,
            is_module,
            ..
        } = opts;
        let root = root
            .clone()
            .unwrap_or_else(|| ::std::env::current_dir().unwrap());

        let config_file = match config_file {
            Some(ConfigFile::Str(ref s)) => {
                let path = Path::new(s);
                let r = File::open(&path).map_err(|err| Error::FailedToReadConfigFile { err })?;
                let config: Rc = serde_json::from_reader(r)
                    .map_err(|err| Error::FailedToParseConfigFile { err })?;
                Some(config)
            }
            _ => None,
        };

        match fm.name {
            FileName::Real(ref path) => {
                if *swcrc {
                    let mut parent = path.parent();
                    while let Some(dir) = parent {
                        let swcrc = dir.join(".swcrc");

                        if swcrc.exists() {
                            let r = File::open(&swcrc)
                                .map_err(|err| Error::FailedToReadConfigFile { err })?;
                            let mut config = serde_json::from_reader(r)
                                .map_err(|err| Error::FailedToParseConfigFile { err })
                                .and_then(|rc: Rc| rc.into_config(Some(path)))?;

                            if let Some(config_file) = config_file {
                                config.merge(&config_file.into_config(Some(path))?)
                            }
                            let built =
                                opts.build(&self.cm, &self.handler, *is_module, Some(config));
                            return Ok(built);
                        }

                        if dir == root && *root_mode == RootMode::Root {
                            break;
                        }
                        parent = dir.parent();
                    }
                }

                if let Some(config_file) = config_file {
                    let built = opts.build(
                        &self.cm,
                        &self.handler,
                        *is_module,
                        Some(config_file.into_config(Some(path))?),
                    );
                    return Ok(built);
                }
            }
            _ => {}
        }

        let built = opts.build(
            &self.cm,
            &self.handler,
            *is_module,
            match config_file {
                Some(config_file) => Some(config_file.into_config(None)?),
                None => None,
            },
        );
        Ok(built)
    }

    pub fn process_js_file(
        &self,
        fm: Arc<SourceFile>,
        opts: &Options,
    ) -> Result<TransformOutput, Error> {
        let config = self.run(|| self.config_for_file(opts, &*fm))?;

        self.process_js(fm, config)
    }

    /// You can use custom pass with this method.
    ///
    /// There exists a [PassBuilder] to help building custom passes.
    pub fn process_js(
        &self,
        fm: Arc<SourceFile>,
        config: BuiltConfig<impl Pass>,
    ) -> Result<TransformOutput, Error> {
        self.run(|| {
            if error::debug() {
                eprintln!("processing js file: {:?}", fm)
            }

            let comments = Default::default();
            let module = self.parse_js(
                fm.clone(),
                config.target,
                config.syntax,
                config.is_module,
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
