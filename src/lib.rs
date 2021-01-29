#![deny(unused)]

pub use sourcemap;

pub use crate::builder::PassBuilder;
use crate::config::{
    BuiltConfig, Config, ConfigFile, InputSourceMap, JscTarget, Merge, Options, Rc, RootMode,
    SourceMapsConfig,
};
use anyhow::{bail, Context, Error};
use dashmap::DashMap;
use serde::Serialize;
use serde_json::error::Category;
use std::{
    fs::{read_to_string, File},
    path::{Path, PathBuf},
    sync::Arc,
};
use swc_common::{
    chain,
    comments::{Comment, Comments},
    errors::Handler,
    input::StringInput,
    BytePos, FileName, Globals, SourceFile, SourceMap, Spanned, GLOBALS,
};
use swc_ecma_ast::Program;
use swc_ecma_codegen::{self, Emitter, Node};
use swc_ecma_parser::{lexer::Lexer, Parser, Syntax};
use swc_ecma_transforms::{
    helpers::{self, Helpers},
    pass::noop,
};
use swc_ecma_visit::FoldWith;

mod builder;
pub mod config;

pub struct Compiler {
    /// swc uses rustc's span interning.
    ///
    /// The `Globals` struct contains span interner.
    globals: Globals,
    /// CodeMap
    pub cm: Arc<SourceMap>,
    pub handler: Arc<Handler>,
    comments: SwcComments,
}

#[derive(Debug, Serialize)]
pub struct TransformOutput {
    pub code: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub map: Option<String>,
}

/// These are **low-level** apis.
impl Compiler {
    pub fn globals(&self) -> &Globals {
        &self.globals
    }

    pub fn comments(&self) -> &SwcComments {
        &self.comments
    }

    /// Runs `op` in current compiler's context.
    ///
    /// Note: Other methods of `Compiler` already uses this internally.
    pub fn run<R, F>(&self, op: F) -> R
    where
        F: FnOnce() -> R,
    {
        GLOBALS.set(&self.globals, || op())
    }

    fn get_orig_src_map(
        &self,
        fm: &SourceFile,
        input_src_map: &InputSourceMap,
    ) -> Result<Option<sourcemap::SourceMap>, Error> {
        self.run(|| -> Result<_, Error> {
            let name = &fm.name;

            // Load original source map
            match input_src_map {
                InputSourceMap::Bool(false) => Ok(None),
                InputSourceMap::Bool(true) => {
                    let s = "sourceMappingURL=";
                    let idx = fm.src.rfind(s);
                    let src_mapping_url = match idx {
                        None => None,
                        Some(idx) => Some(&fm.src[idx + s.len()..]),
                    };

                    // Load original source map if possible
                    match &name {
                        FileName::Real(filename) => {
                            let dir = match filename.parent() {
                                Some(v) => v,
                                None => {
                                    bail!("unexpected: root directory is given as a input file")
                                }
                            };

                            let path = match src_mapping_url {
                                Some(src_mapping_url) => {
                                    dir.join(src_mapping_url).display().to_string()
                                }
                                None => {
                                    format!("{}.map", dir.join(filename).display())
                                }
                            };

                            let file = File::open(&path)
                                .or_else(|err| {
                                    // Old behavior. This check would prevent regressions.
                                    let f = format!("{}.map", filename.display());

                                    match File::open(&f) {
                                        Ok(v) => Ok(v),
                                        Err(_) => Err(err),
                                    }
                                })
                                .context("failed to open input source map file")?;
                            Ok(Some(sourcemap::SourceMap::from_reader(file).with_context(
                                || format!("failed to read input source map from file at {}", path),
                            )?))
                        }
                        _ => {
                            log::error!("Failed to load source map for non-file input");
                            return Ok(None);
                        }
                    }
                }
                InputSourceMap::Str(ref s) => {
                    if s == "inline" {
                        // Load inline source map by simple string
                        // operations
                        let s = "sourceMappingURL=data:application/json;base64,";
                        let idx = fm.src.rfind(s);
                        let idx = match idx {
                            None => bail!(
                                "failed to parse inline source map: `sourceMappingURL` not found"
                            ),
                            Some(v) => v,
                        };
                        let encoded = &fm.src[idx + s.len()..];

                        let res = base64::decode(encoded.as_bytes())
                            .context("failed to decode base64-encoded source map")?;

                        Ok(Some(sourcemap::SourceMap::from_slice(&res).context(
                            "failed to read input source map from inlined base64 encoded string",
                        )?))
                    } else {
                        // Load source map passed by user
                        Ok(Some(
                            sourcemap::SourceMap::from_slice(s.as_bytes()).context(
                                "failed to read input source map from user-provided sourcemap",
                            )?,
                        ))
                    }
                }
            }
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
    ) -> Result<Program, Error> {
        self.run(|| {
            let lexer = Lexer::new(
                syntax,
                target,
                StringInput::from(&*fm),
                if parse_comments {
                    Some(&self.comments)
                } else {
                    None
                },
            );
            let mut parser = Parser::new_from(lexer);
            let mut error = false;
            let program = if is_module {
                let m = parser.parse_module();

                for e in parser.take_errors() {
                    e.into_diagnostic(&self.handler).emit();
                    error = true;
                }

                m.map_err(|e| {
                    e.into_diagnostic(&self.handler).emit();
                    Error::msg("failed to parse module")
                })
                .map(Program::Module)?
            } else {
                let s = parser.parse_script();

                for e in parser.take_errors() {
                    e.into_diagnostic(&self.handler).emit();
                    error = true;
                }

                s.map_err(|e| {
                    e.into_diagnostic(&self.handler).emit();
                    Error::msg("failed to parse module")
                })
                .map(Program::Script)?
            };

            if error {
                bail!(
                    "failed to parse module: error was recoverable, but proceeding would result \
                     in wrong codegen"
                )
            }

            Ok(program)
        })
    }

    pub fn print<T>(
        &self,
        node: &T,
        target: JscTarget,
        source_map: SourceMapsConfig,
        orig: Option<&sourcemap::SourceMap>,
        minify: bool,
    ) -> Result<TransformOutput, Error>
    where
        T: Node,
    {
        self.run(|| {
            let mut src_map_buf = vec![];

            let src = {
                let mut buf = vec![];
                {
                    let mut emitter = Emitter {
                        cfg: swc_ecma_codegen::Config { minify },
                        comments: if minify { None } else { Some(&self.comments) },
                        cm: self.cm.clone(),
                        wr: Box::new(swc_ecma_codegen::text_writer::JsWriter::with_target(
                            self.cm.clone(),
                            "\n",
                            &mut buf,
                            if source_map.enabled() {
                                Some(&mut src_map_buf)
                            } else {
                                None
                            },
                            target,
                        )),
                    };

                    node.emit_with(&mut emitter)
                        .context("failed to emit module")?;
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
                            .context("failed to write source map")?;
                        let map = String::from_utf8(buf).context("source map is not utf-8")?;
                        (src, Some(map))
                    } else {
                        (src, None)
                    }
                }
                SourceMapsConfig::Str(_) => {
                    let mut src = src;

                    let mut buf = vec![];

                    self.cm
                        .build_source_map_from(&mut src_map_buf, orig)
                        .to_writer(&mut buf)
                        .context("failed to write source map file")?;
                    let map = String::from_utf8(buf).context("source map is not utf-8")?;

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
    pub fn new(cm: Arc<SourceMap>, handler: Arc<Handler>) -> Self {
        Compiler {
            cm,
            handler,
            globals: Globals::new(),
            comments: Default::default(),
        }
    }

    pub fn read_config(&self, opts: &Options, name: &FileName) -> Result<Option<Config>, Error> {
        self.run(|| -> Result<_, Error> {
            let Options {
                ref root,
                root_mode,
                swcrc,
                config_file,
                ..
            } = opts;

            let root = root.clone().unwrap_or_else(|| {
                if cfg!(target_arch = "wasm32") {
                    PathBuf::new()
                } else {
                    ::std::env::current_dir().unwrap()
                }
            });

            let config_file = match config_file {
                Some(ConfigFile::Str(ref s)) => Some(load_swcrc(Path::new(&s))?),
                _ => None,
            };

            match name {
                FileName::Real(ref path) => {
                    if *swcrc {
                        let mut parent = path.parent();
                        while let Some(dir) = parent {
                            let swcrc = dir.join(".swcrc");

                            if swcrc.exists() {
                                let config = load_swcrc(&swcrc)?;

                                let mut config = config
                                    .into_config(Some(path))
                                    .context("failed to process config file")?;

                                if let Some(config_file) = config_file {
                                    config.merge(&config_file.into_config(Some(path))?)
                                }

                                return Ok(config);
                            }

                            if dir == root && *root_mode == RootMode::Root {
                                break;
                            }
                            parent = dir.parent();
                        }
                    }

                    let config_file = config_file.unwrap_or_else(|| Rc::default());
                    let config = config_file.into_config(Some(path))?;

                    return Ok(config);
                }
                _ => {}
            }

            let config = match config_file {
                Some(config_file) => config_file.into_config(None)?,
                None => Rc::default().into_config(None)?,
            };

            match config {
                Some(config) => Ok(Some(config)),
                None => {
                    bail!("no config matched for file ({})", name)
                }
            }
        })
        .with_context(|| format!("failed to read swcrc file ({})", name))
    }

    /// This method returns [None] if a file should be skipped.
    ///
    /// This method handles merging of config.
    ///
    /// This method does **not** parse module.
    pub fn config_for_file<'a>(
        &'a self,
        opts: &Options,
        name: &FileName,
    ) -> Result<Option<BuiltConfig<impl 'a + swc_ecma_visit::Fold>>, Error> {
        self.run(|| -> Result<_, Error> {
            let config = self.read_config(opts, name)?;
            let config = match config {
                Some(v) => v,
                None => return Ok(None),
            };
            let built = opts.build(
                &self.cm,
                &self.handler,
                opts.is_module,
                Some(config),
                Some(&self.comments),
            );
            Ok(Some(built))
        })
        .with_context(|| format!("failed to load config for file '{:?}'", name))
    }

    pub fn run_transform<F, Ret>(&self, external_helpers: bool, op: F) -> Ret
    where
        F: FnOnce() -> Ret,
    {
        self.run(|| {
            helpers::HELPERS.set(&Helpers::new(external_helpers), || {
                swc_ecma_utils::HANDLER.set(&self.handler, || op())
            })
        })
    }

    pub fn transform(
        &self,
        program: Program,
        external_helpers: bool,
        mut pass: impl swc_ecma_visit::Fold,
    ) -> Program {
        self.run_transform(external_helpers, || {
            // Fold module
            program.fold_with(&mut pass)
        })
    }

    /// `custom_after_pass` is applied after swc transforms are applied.
    pub fn process_js_with_custom_pass<P>(
        &self,
        fm: Arc<SourceFile>,
        opts: &Options,
        custom_after_pass: P,
    ) -> Result<TransformOutput, Error>
    where
        P: swc_ecma_visit::Fold,
    {
        self.run(|| -> Result<_, Error> {
            let config = self.run(|| self.config_for_file(opts, &fm.name))?;
            let config = match config {
                Some(v) => v,
                None => {
                    bail!("cannot process file because it's ignored by .swcrc")
                }
            };
            let config = BuiltConfig {
                pass: chain!(config.pass, custom_after_pass),
                syntax: config.syntax,
                target: config.target,
                minify: config.minify,
                external_helpers: config.external_helpers,
                source_maps: config.source_maps,
                input_source_map: config.input_source_map,
                is_module: config.is_module,
            };
            let orig = self.get_orig_src_map(&fm, &opts.input_source_map)?;
            let program = self.parse_js(
                fm.clone(),
                config.target,
                config.syntax,
                config.is_module,
                true,
            )?;

            self.process_js_inner(program, orig.as_ref(), config)
        })
        .context("failed to process js file")
    }

    pub fn process_js_file(
        &self,
        fm: Arc<SourceFile>,
        opts: &Options,
    ) -> Result<TransformOutput, Error> {
        self.process_js_with_custom_pass(fm, opts, noop())
    }

    /// You can use custom pass with this method.
    ///
    /// There exists a [PassBuilder] to help building custom passes.
    pub fn process_js(&self, program: Program, opts: &Options) -> Result<TransformOutput, Error> {
        self.run(|| -> Result<_, Error> {
            let loc = self.cm.lookup_char_pos(program.span().lo());
            let fm = loc.file;
            let orig = self.get_orig_src_map(&fm, &opts.input_source_map)?;

            let config = self.run(|| self.config_for_file(opts, &fm.name))?;

            let config = match config {
                Some(v) => v,
                None => {
                    bail!("cannot process file because it's ignored by .swcrc")
                }
            };

            self.process_js_inner(program, orig.as_ref(), config)
        })
        .context("failed to process js module")
    }

    fn process_js_inner(
        &self,
        program: Program,
        orig: Option<&sourcemap::SourceMap>,
        config: BuiltConfig<impl swc_ecma_visit::Fold>,
    ) -> Result<TransformOutput, Error> {
        self.run(|| {
            if config.minify {
                let preserve_excl = |_: &BytePos, vc: &mut Vec<Comment>| -> bool {
                    vc.retain(|c: &Comment| c.text.starts_with("!"));
                    !vc.is_empty()
                };
                self.comments.leading.retain(preserve_excl);
                self.comments.trailing.retain(preserve_excl);
            }
            let mut pass = config.pass;
            let program = helpers::HELPERS.set(&Helpers::new(config.external_helpers), || {
                swc_ecma_utils::HANDLER.set(&self.handler, || {
                    // Fold module
                    program.fold_with(&mut pass)
                })
            });

            self.print(
                &program,
                config.target,
                config.source_maps,
                orig,
                config.minify,
            )
        })
    }
}

fn load_swcrc(path: &Path) -> Result<Rc, Error> {
    fn convert_json_err(e: serde_json::Error) -> Error {
        let line = e.line();
        let column = e.column();

        let msg = match e.classify() {
            Category::Io => "io error",
            Category::Syntax => "syntax error",
            Category::Data => "unmatched data",
            Category::Eof => "unexpected eof",
        };
        Error::new(e).context(format!(
            "failed to deserialize .swcrc (json) file: {}: {}:{}",
            msg, line, column
        ))
    }

    let content = read_to_string(path).context("failed to read config (.swcrc) file")?;

    match serde_json::from_str(&content) {
        Ok(v) => return Ok(v),
        Err(..) => {}
    }

    serde_json::from_str::<Config>(&content)
        .map(Rc::Single)
        .map_err(convert_json_err)
}

type CommentMap = Arc<DashMap<BytePos, Vec<Comment>>>;

/// Multi-threaded implementation of [Comments]
#[derive(Clone, Default)]
pub struct SwcComments {
    leading: CommentMap,
    trailing: CommentMap,
}

impl Comments for SwcComments {
    fn add_leading(&self, pos: BytePos, cmt: Comment) {
        self.leading.entry(pos).or_default().push(cmt);
    }

    fn add_leading_comments(&self, pos: BytePos, comments: Vec<Comment>) {
        self.leading.entry(pos).or_default().extend(comments);
    }

    fn has_leading(&self, pos: BytePos) -> bool {
        self.leading.contains_key(&pos)
    }

    fn move_leading(&self, from: BytePos, to: BytePos) {
        let cmt = self.leading.remove(&from);

        if let Some(cmt) = cmt {
            self.leading.entry(to).or_default().extend(cmt.1);
        }
    }

    fn take_leading(&self, pos: BytePos) -> Option<Vec<Comment>> {
        self.leading.remove(&pos).map(|v| v.1)
    }

    fn add_trailing(&self, pos: BytePos, cmt: Comment) {
        self.trailing.entry(pos).or_default().push(cmt)
    }

    fn add_trailing_comments(&self, pos: BytePos, comments: Vec<Comment>) {
        self.trailing.entry(pos).or_default().extend(comments)
    }

    fn has_trailing(&self, pos: BytePos) -> bool {
        self.trailing.contains_key(&pos)
    }

    fn move_trailing(&self, from: BytePos, to: BytePos) {
        let cmt = self.trailing.remove(&from);

        if let Some(cmt) = cmt {
            self.trailing.entry(to).or_default().extend(cmt.1);
        }
    }

    fn take_trailing(&self, pos: BytePos) -> Option<Vec<Comment>> {
        self.trailing.remove(&pos).map(|v| v.1)
    }
}
