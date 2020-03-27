#![feature(box_syntax, box_patterns)]

pub use sourcemap;
pub use swc_atoms as atoms;
pub use swc_common as common;
pub use swc_ecmascript as ecmascript;

mod builder;
pub mod config;
pub mod error;

pub use crate::builder::PassBuilder;
use crate::{
    config::{
        BuiltConfig, ConfigFile, InputSourceMap, JscTarget, Merge, Options, Rc, RootMode,
        SourceMapsConfig,
    },
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
        util::COMMENTS,
    },
};
pub use ecmascript::{
    parser::SourceFileInput,
    transforms::{chain_at, pass::Pass},
};
use serde::Serialize;
use std::{fs::File, path::Path, sync::Arc};

pub struct Compiler {
    /// swc uses rustc's span interning.
    ///
    /// The `Globals` struct contains span interner.
    globals: Globals,
    /// CodeMap
    pub cm: Arc<SourceMap>,
    pub handler: Handler,
    comments: Comments,
}

#[derive(Debug, Serialize)]
pub struct TransformOutput {
    pub code: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub map: Option<String>,
}

/// These are **low-level** apis.
impl Compiler {
    pub fn comments(&self) -> &Comments {
        &self.comments
    }

    /// Runs `op` in current compiler's context.
    ///
    /// Note: Other methods of `Compiler` already uses this internally.
    pub fn run<R, F>(&self, op: F) -> R
    where
        F: FnOnce() -> R,
    {
        GLOBALS.set(&self.globals, || {
            //
            COMMENTS.set(&self.comments, || {
                //
                op()
            })
        })
    }

    /// This method parses a javascript / typescript file
    pub fn parse_js(
        &self,
        fm: Arc<SourceFile>,
        target: JscTarget,
        syntax: Syntax,
        is_module: bool,
        parse_comments: bool,
        input_source_map: &InputSourceMap,
    ) -> Result<(Program, Option<sourcemap::SourceMap>), Error> {
        self.run(|| {
            let orig = (|| {
                // Load original source map
                match input_source_map {
                    InputSourceMap::Bool(false) => None,
                    InputSourceMap::Bool(true) => {
                        // Load original source map if possible
                        match &fm.name {
                            FileName::Real(filename) => {
                                let file =
                                    File::open(&format!("{}.map", filename.display())).ok()?;
                                Some(sourcemap::SourceMap::from_reader(file))
                            }
                            _ => {
                                log::error!("Failed to load source map for non-file input");
                                return None;
                            }
                        }
                    }
                    InputSourceMap::Str(ref s) => {
                        if s == "inline" {
                            // Load inline source map by simple string
                            // operations
                            let s = "sourceMappingURL=data:application/json;base64,";
                            let idx = s.rfind(s)?;
                            let encoded = &s[idx + s.len()..];

                            let res = base64::decode(encoded.as_bytes())
                                .map_err(|err| Error::FailedToParseSourceMap)?;

                            Some(sourcemap::SourceMap::from_slice(&res))
                        } else {
                            // Load source map passed by user
                            Some(sourcemap::SourceMap::from_slice(s.as_bytes()))
                        }
                    }
                }
            })();

            let session = ParseSess {
                handler: &self.handler,
            };
            let lexer = Lexer::new(
                session,
                syntax,
                target,
                SourceFileInput::from(&*fm),
                if parse_comments {
                    Some(&self.comments)
                } else {
                    None
                },
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

            Ok((program, orig))
        })
    }

    pub fn print(
        &self,
        program: &Program,
        comments: &Comments,
        source_map: SourceMapsConfig,
        orig: Option<&sourcemap::SourceMap>,
        minify: bool,
    ) -> Result<TransformOutput, Error> {
        self.run(|| {
            let mut src_map_buf = vec![];

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
                            if source_map.enabled() {
                                Some(&mut src_map_buf)
                            } else {
                                None
                            },
                        ),
                        handlers,
                    };

                    emitter
                        .emit_program(&program)
                        .map_err(|err| Error::FailedToEmitModule { err })?;
                }
                // Invalid utf8 is valid in javascript world.
                unsafe { String::from_utf8_unchecked(buf) }
            };
            let (code, map) = match source_map {
                SourceMapsConfig::Bool(v) => {
                    if v {
                        let mut buf = vec![];

                        self.cm
                            .build_source_map_from(&mut src_map_buf, orig)
                            .to_writer(&mut buf)
                            .map_err(|err| Error::FailedToWriteSourceMap { err })?;
                        let map = String::from_utf8(buf)
                            .map_err(|err| Error::SourceMapNotUtf8 { err })?;
                        (src, Some(map))
                    } else {
                        (src, None)
                    }
                }
                SourceMapsConfig::Str(_) => {
                    let mut src = src;

                    let mut buf = vec![];

                    self.cm
                        .build_source_map(&mut src_map_buf)
                        .to_writer(&mut buf)
                        .map_err(|err| Error::FailedToWriteSourceMap { err })?;
                    let map =
                        String::from_utf8(buf).map_err(|err| Error::SourceMapNotUtf8 { err })?;

                    src.push_str("\n//# sourceMappingURL=data:application/json;base64,");
                    base64::encode_config_buf(
                        map.as_bytes(),
                        base64::Config::new(base64::CharacterSet::UrlSafe, true),
                        &mut src,
                    );
                    (src, None)
                }
            };

            Ok(TransformOutput { code, map })
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
            comments: Default::default(),
        }
    }

    /// This method handles merging of config.
    pub fn config_for_file(
        &self,
        opts: &Options,
        fm: &SourceFile,
    ) -> Result<BuiltConfig<impl Pass>, Error> {
        self.run(|| {
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
                    let r =
                        File::open(&path).map_err(|err| Error::FailedToReadConfigFile { err })?;
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

                    let config_file = config_file.unwrap_or_else(|| Rc::default());
                    let built = opts.build(
                        &self.cm,
                        &self.handler,
                        *is_module,
                        Some(config_file.into_config(Some(path))?),
                    );
                    return Ok(built);
                }
                _ => {}
            }

            let built = opts.build(
                &self.cm,
                &self.handler,
                *is_module,
                match config_file {
                    Some(config_file) => Some(config_file.into_config(None)?),
                    None => Some(Rc::default().into_config(None)?),
                },
            );
            Ok(built)
        })
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

            let (module, orig) = self.parse_js(
                fm.clone(),
                config.target,
                config.syntax,
                config.is_module,
                !config.minify,
                &config.input_source_map,
            )?;
            let mut pass = config.pass;
            let module = helpers::HELPERS.set(&Helpers::new(config.external_helpers), || {
                util::HANDLER.set(&self.handler, || {
                    // Fold module
                    module.fold_with(&mut pass)
                })
            });

            self.print(
                &module,
                &self.comments,
                config.source_maps,
                orig.as_ref(),
                config.minify,
            )
        })
    }
}

struct MyHandlers;

impl ecmascript::codegen::Handlers for MyHandlers {}
