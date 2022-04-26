//! The main crate of the swc project.
//!
//!
//!
//! # Customizing
//!
//!
//! This is documentation for building custom build tools on top of swc.
//!
//! ## Dependency version management
//!
//! `swc` has [swc_ecmascript](https://docs.rs/swc_ecmascript) and [swc_css](https://docs.rs/swc_css), which re-exports required modules.
//!
//! ## Testing
//!
//! See [testing] and [swc_ecma_transform_testing](https://docs.rs/swc_ecmc_transform_testing).
//!
//! ## Custom javascript transforms
//!
//!
//!
//! ### What is [JsWord](swc_atoms::JsWord)?
//!
//! It's basically an interned string. See [swc_atoms].
//!
//! ### Choosing between [JsWord](swc_atoms::JsWord) vs String
//!
//! You should  prefer [JsWord](swc_atoms::JsWord) over [String] if it's going
//! to be stored in an AST node.
//!
//! See [swc_atoms] for detailed description.
//!
//! ### Fold vs VisitMut vs Visit
//!
//! See [swc_visit] for detailed description.
//!
//!
//!  - [Fold](swc_ecma_visit::Fold)
//!  - [VisitMut](swc_ecma_visit::VisitMut)
//!  - [Visit](swc_ecma_visit::Visit)
//!
//!
//! ### Variable management (Scoping)
//!
//! See [swc_ecma_transforms_base::resolver::resolver_with_mark].
//!
//! #### How identifiers work
//!
//! See the doc on [swc_ecma_ast::Ident] or on
//! [swc_ecma_transforms_base::resolver::resolver_with_mark].
//!
//! #### Comparing two identifiers
//!
//! See [swc_ecma_utils::Id]. You can use [swc_ecma_utils::IdentLike::to_id] to
//! extract important parts of an [swc_ecma_ast::Ident].
//!
//! #### Creating a unique identifier
//!
//! See [swc_ecma_utils::private_ident].
//!
//! #### Prepending statements
//!
//! If you want to prepend statements to the beginning of a file, you can use
//! [swc_ecma_utils::prepend_stmts] or [swc_ecma_utils::prepend] if `len == 1`.
//!
//! These methods are aware of the fact that `"use strict"` directive should be
//! first in a file, and insert statements after directives.
//!
//! ### Improving readability
//!
//! Each stuffs are documented at itself.
//!
//!  - If you are creating or binding an [swc_ecma_ast::Expr] with operator, you
//!    can use [swc_ecma_ast::op].
//!
//!  - If you want to create [swc_ecma_ast::CallExpr], you can use
//!    [swc_ecma_utils::ExprFactory::as_callee] to create `callee`.
//!
//!  - If you want to create [swc_ecma_ast::CallExpr] or
//!    [swc_ecma_ast::NewExpr], you can use
//!    [swc_ecma_utils::ExprFactory::as_arg] to create arguments.
//!
//!
//!  - If you want to create [swc_ecma_ast::MemberExpr] where all identifiers
//!    are static (e.g. `Object.prototype.hasOwnProperty`), you can use
//!    [swc_ecma_utils::member_expr].
//!
//!  - If you want to create [swc_ecma_ast::MemberExpr], you can use
//!    [swc_ecma_utils::ExprFactory::as_obj] to create object field.
//!
//!
//! ### Reducing binary size
//!
//! The visitor expands to a lot of code. You can reduce it by using macros like
//!
//!  - [noop_fold_type](swc_ecma_visit::noop_fold_type)
//!  - [noop_visit_mut_type](swc_ecma_visit::noop_visit_mut_type)
//!  - [noop_visit_type](swc_ecma_visit::noop_visit_type)
//!
//! Note that this will make typescript-related nodes not processed, but it's
//! typically fine as `typescript::strip` is invoked at the start and it removes
//! typescript-specific nodes.
//!
//! ### Porting `expr.evaluate()` of babel
//!
//! See [swc_ecma_minifier::eval::Evaluator].
#![deny(unused)]
#![allow(clippy::too_many_arguments)]
#![cfg_attr(docsrs, feature(doc_cfg))]

pub extern crate swc_atoms as atoms;
pub extern crate swc_common as common;
pub extern crate swc_ecmascript as ecmascript;

use std::{
    fs::{read_to_string, File},
    path::{Path, PathBuf},
    sync::Arc,
};

use anyhow::{bail, Context, Error};
use atoms::JsWord;
use common::{collections::AHashMap, comments::SingleThreadedComments, errors::HANDLER, Span};
use config::{util::BoolOrObject, IsModule, JsMinifyCommentOption, JsMinifyOptions};
use json_comments::StripComments;
use once_cell::sync::Lazy;
use serde::Serialize;
use serde_json::error::Category;
pub use sourcemap;
use swc_common::{
    chain,
    comments::{Comment, Comments},
    errors::Handler,
    source_map::SourceMapGenConfig,
    sync::Lrc,
    BytePos, FileName, Globals, Mark, SourceFile, SourceMap, Spanned, GLOBALS,
};
use swc_ecma_ast::{EsVersion, Ident, Program};
use swc_ecma_codegen::{self, text_writer::WriteJs, Emitter, Node};
use swc_ecma_loader::resolvers::{
    lru::CachingResolver, node::NodeModulesResolver, tsc::TsConfigResolver,
};
use swc_ecma_minifier::option::{MinifyOptions, TopLevelOptions};
use swc_ecma_parser::{
    parse_file_as_module, parse_file_as_program, parse_file_as_script, EsConfig, Syntax,
};
use swc_ecma_transforms::{
    fixer,
    helpers::{self, Helpers},
    hygiene,
    modules::path::NodeImportResolver,
    pass::noop,
    resolver,
};
use swc_ecma_visit::{noop_visit_type, FoldWith, Visit, VisitMutWith, VisitWith};
pub use swc_error_reporters::handler::{try_with_handler, HandlerOpts};
pub use swc_node_comments::SwcComments;
use swc_timer::timer;

pub use crate::builder::PassBuilder;
use crate::config::{
    BuiltInput, Config, ConfigFile, InputSourceMap, Merge, Options, Rc, RootMode, SourceMapsConfig,
};

mod builder;
pub mod config;
mod dropped_comments_preserver;
mod plugin;
pub mod resolver {
    use std::path::PathBuf;

    use swc_common::collections::AHashMap;
    use swc_ecma_loader::{
        resolvers::{lru::CachingResolver, node::NodeModulesResolver, tsc::TsConfigResolver},
        TargetEnv,
    };

    use crate::config::CompiledPaths;

    pub type NodeResolver = CachingResolver<NodeModulesResolver>;

    pub fn paths_resolver(
        target_env: TargetEnv,
        alias: AHashMap<String, String>,
        base_url: PathBuf,
        paths: CompiledPaths,
        preserve_symlinks: bool,
    ) -> CachingResolver<TsConfigResolver<NodeModulesResolver>> {
        let r = TsConfigResolver::new(
            NodeModulesResolver::new(target_env, alias, preserve_symlinks),
            base_url,
            paths,
        );
        CachingResolver::new(40, r)
    }

    pub fn environment_resolver(
        target_env: TargetEnv,
        alias: AHashMap<String, String>,
        preserve_symlinks: bool,
    ) -> NodeResolver {
        CachingResolver::new(
            40,
            NodeModulesResolver::new(target_env, alias, preserve_symlinks),
        )
    }
}

type SwcImportResolver =
    Arc<NodeImportResolver<CachingResolver<TsConfigResolver<NodeModulesResolver>>>>;

/// All methods accept [Handler], which is a storage for errors.
///
/// The caller should check if the handler contains any errors after calling
/// method.
pub struct Compiler {
    /// swc uses rustc's span interning.
    ///
    /// The `Globals` struct contains span interner.
    globals: Globals,
    /// CodeMap
    pub cm: Arc<SourceMap>,
    comments: SwcComments,
}

#[cfg(feature = "node")]
#[napi_derive::napi(object)]
#[derive(Debug, Serialize)]
pub struct TransformOutput {
    pub code: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub map: Option<String>,
}

#[cfg(not(feature = "node"))]
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
        GLOBALS.set(&self.globals, op)
    }

    fn get_orig_src_map(
        &self,
        fm: &SourceFile,
        input_src_map: &InputSourceMap,
        is_default: bool,
    ) -> Result<Option<sourcemap::SourceMap>, Error> {
        self.run(|| -> Result<_, Error> {
            let name = &fm.name;

            // Load original source map
            match input_src_map {
                InputSourceMap::Bool(false) => Ok(None),
                InputSourceMap::Bool(true) => {
                    let s = "sourceMappingURL=";
                    let idx = fm.src.rfind(s);
                    let src_mapping_url = idx.map(|idx| &fm.src[idx + s.len()..]);

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
                                .context("failed to open input source map file");

                            let file = if !is_default {
                                file?
                            } else {
                                match file {
                                    Ok(v) => v,
                                    Err(_) => return Ok(None),
                                }
                            };

                            Ok(Some(sourcemap::SourceMap::from_reader(file).with_context(
                                || format!("failed to read input source map from file at {}", path),
                            )?))
                        }
                        _ => {
                            tracing::error!("Failed to load source map for non-file input");
                            Ok(None)
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
        handler: &Handler,
        target: EsVersion,
        syntax: Syntax,
        is_module: IsModule,
        comments: Option<&dyn Comments>,
    ) -> Result<Program, Error> {
        self.run(|| {
            let mut error = false;

            let mut errors = vec![];
            let program_result = match is_module {
                IsModule::Bool(true) => {
                    parse_file_as_module(&fm, syntax, target, comments, &mut errors)
                        .map(Program::Module)
                }
                IsModule::Bool(false) => {
                    parse_file_as_script(&fm, syntax, target, comments, &mut errors)
                        .map(Program::Script)
                }
                IsModule::Unknown => {
                    parse_file_as_program(&fm, syntax, target, comments, &mut errors)
                }
            };

            for e in errors {
                e.into_diagnostic(handler).emit();
                error = true;
            }

            let program = program_result.map_err(|e| {
                e.into_diagnostic(handler).emit();
                Error::msg("Syntax Error")
            })?;

            if error {
                return Err(anyhow::anyhow!("Syntax Error").context(
                    "error was recoverable, but proceeding would result in wrong codegen",
                ));
            }

            Ok(program)
        })
    }

    /// Converts ast node to source string and sourcemap.
    ///
    ///
    /// This method receives target file path, but does not write file to the
    /// path. See: https://github.com/swc-project/swc/issues/1255
    #[allow(clippy::too_many_arguments)]
    pub fn print<T>(
        &self,
        node: &T,
        source_file_name: Option<&str>,
        output_path: Option<PathBuf>,
        inline_sources_content: bool,
        target: EsVersion,
        source_map: SourceMapsConfig,
        source_map_names: &AHashMap<BytePos, JsWord>,
        orig: Option<&sourcemap::SourceMap>,
        minify: bool,
        comments: Option<&dyn Comments>,
    ) -> Result<TransformOutput, Error>
    where
        T: Node + VisitWith<IdentCollector>,
    {
        self.run(|| {
            let _timer = timer!("Compiler.print");

            let mut src_map_buf = vec![];

            let src = {
                let mut buf = vec![];
                {
                    let mut wr = Box::new(swc_ecma_codegen::text_writer::JsWriter::with_target(
                        self.cm.clone(),
                        "\n",
                        &mut buf,
                        if source_map.enabled() {
                            Some(&mut src_map_buf)
                        } else {
                            None
                        },
                        target,
                    )) as Box<dyn WriteJs>;

                    if minify {
                        wr = Box::new(swc_ecma_codegen::text_writer::omit_trailing_semi(wr));
                    }

                    let mut emitter = Emitter {
                        cfg: swc_ecma_codegen::Config { minify },
                        comments,
                        cm: self.cm.clone(),
                        wr,
                    };

                    node.emit_with(&mut emitter)
                        .context("failed to emit module")?;
                }
                // Invalid utf8 is valid in javascript world.
                String::from_utf8(buf).expect("invalid utf8 character detected")
            };

            if cfg!(debug_assertions)
                && !src_map_buf.is_empty()
                && src_map_buf.iter().all(|(bp, _)| *bp == BytePos(0))
                && src.lines().count() >= 3
            {
                panic!("The module contains only dummy spans\n{}", src);
            }

            let (code, map) = match source_map {
                SourceMapsConfig::Bool(v) => {
                    if v {
                        let mut buf = vec![];

                        self.cm
                            .build_source_map_with_config(
                                &mut src_map_buf,
                                orig,
                                SwcSourceMapConfig {
                                    source_file_name,
                                    output_path: output_path.as_deref(),
                                    names: source_map_names,
                                    inline_sources_content,
                                },
                            )
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
                        .build_source_map_with_config(
                            &mut src_map_buf,
                            orig,
                            SwcSourceMapConfig {
                                source_file_name,
                                output_path: output_path.as_deref(),
                                names: source_map_names,
                                inline_sources_content,
                            },
                        )
                        .to_writer(&mut buf)
                        .context("failed to write source map file")?;
                    let map = String::from_utf8(buf).context("source map is not utf-8")?;

                    src.push_str("\n//# sourceMappingURL=data:application/json;base64,");
                    base64::encode_config_buf(
                        map.as_bytes(),
                        base64::Config::new(base64::CharacterSet::Standard, true),
                        &mut src,
                    );
                    (src, None)
                }
            };

            Ok(TransformOutput { code, map })
        })
    }
}

struct SwcSourceMapConfig<'a> {
    source_file_name: Option<&'a str>,
    /// Output path of the `.map` file.
    output_path: Option<&'a Path>,

    names: &'a AHashMap<BytePos, JsWord>,

    inline_sources_content: bool,
}

impl SourceMapGenConfig for SwcSourceMapConfig<'_> {
    fn file_name_to_source(&self, f: &FileName) -> String {
        if let Some(file_name) = self.source_file_name {
            return file_name.to_string();
        }

        let base_path = match self.output_path {
            Some(v) => v,
            None => return f.to_string(),
        };
        let target = match f {
            FileName::Real(v) => v,
            _ => return f.to_string(),
        };

        let rel = pathdiff::diff_paths(&target, base_path);
        match rel {
            Some(v) => {
                let s = v.to_string_lossy().to_string();
                if cfg!(target_os = "windows") {
                    s.replace('\\', "/")
                } else {
                    s
                }
            }
            None => f.to_string(),
        }
    }

    fn name_for_bytepos(&self, pos: BytePos) -> Option<&str> {
        self.names.get(&pos).map(|v| &**v)
    }

    fn inline_sources_content(&self, _: &FileName) -> bool {
        self.inline_sources_content
    }
}

pub fn minify_global_comments(
    comments: &SwcComments,
    span: Span,
    minify: bool,
    preserve_comments: Option<BoolOrObject<JsMinifyCommentOption>>,
) {
    let preserve_comments = preserve_comments.unwrap_or({
        if minify {
            BoolOrObject::Obj(JsMinifyCommentOption::PreserveSomeComments)
        } else {
            BoolOrObject::Obj(JsMinifyCommentOption::PreserveAllComments)
        }
    });

    match preserve_comments {
        BoolOrObject::Bool(true)
        | BoolOrObject::Obj(JsMinifyCommentOption::PreserveAllComments) => {}

        BoolOrObject::Obj(JsMinifyCommentOption::PreserveSomeComments) => {
            let preserve_excl = |pos: &BytePos, vc: &mut Vec<Comment>| -> bool {
                if *pos < span.lo || *pos >= span.hi {
                    return true;
                }

                // Preserve license comments.
                if vc.iter().any(|c| c.text.contains("@license")) {
                    return true;
                }

                vc.retain(|c: &Comment| c.text.starts_with('!'));
                !vc.is_empty()
            };
            comments.leading.retain(preserve_excl);
            comments.trailing.retain(preserve_excl);
        }

        BoolOrObject::Bool(false) => {
            let remove_all_in_range = |pos: &BytePos, _: &mut Vec<Comment>| -> bool {
                if *pos < span.lo || *pos >= span.hi {
                    return true;
                }

                false
            };
            comments.leading.retain(remove_all_in_range);
            comments.trailing.retain(remove_all_in_range);
        }
    }
}

pub fn minify_file_comments(
    comments: &SingleThreadedComments,
    minify: bool,
    preserve_comments: Option<BoolOrObject<JsMinifyCommentOption>>,
) {
    let preserve_comments = preserve_comments.unwrap_or({
        if minify {
            BoolOrObject::Obj(JsMinifyCommentOption::PreserveSomeComments)
        } else {
            BoolOrObject::Obj(JsMinifyCommentOption::PreserveAllComments)
        }
    });

    match preserve_comments {
        BoolOrObject::Bool(true)
        | BoolOrObject::Obj(JsMinifyCommentOption::PreserveAllComments) => {}

        BoolOrObject::Obj(JsMinifyCommentOption::PreserveSomeComments) => {
            let preserve_excl = |_: &BytePos, vc: &mut Vec<Comment>| -> bool {
                // Preserve license comments.
                if vc.iter().any(|c| c.text.contains("@license")) {
                    return true;
                }

                vc.retain(|c: &Comment| c.text.starts_with('!'));
                !vc.is_empty()
            };
            let (mut l, mut t) = comments.borrow_all_mut();

            l.retain(preserve_excl);
            t.retain(preserve_excl);
        }

        BoolOrObject::Bool(false) => {
            let (mut l, mut t) = comments.borrow_all_mut();
            l.clear();
            t.clear();
        }
    }
}

/// High-level apis.
impl Compiler {
    pub fn new(cm: Arc<SourceMap>) -> Self {
        Compiler {
            cm,
            globals: Globals::new(),
            comments: Default::default(),
        }
    }

    #[tracing::instrument(level = "info", skip_all)]
    pub fn read_config(&self, opts: &Options, name: &FileName) -> Result<Option<Config>, Error> {
        static CUR_DIR: Lazy<PathBuf> = Lazy::new(|| {
            if cfg!(target_arch = "wasm32") {
                PathBuf::new()
            } else {
                ::std::env::current_dir().unwrap()
            }
        });

        self.run(|| -> Result<_, Error> {
            let Options {
                ref root,
                root_mode,
                swcrc,
                config_file,
                ..
            } = opts;

            let root = root.as_ref().unwrap_or(&CUR_DIR);

            let config_file = match config_file {
                Some(ConfigFile::Str(ref s)) => Some(load_swcrc(Path::new(&s))?),
                _ => None,
            };

            if let FileName::Real(ref path) = name {
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

                            if let Some(c) = &mut config {
                                if c.jsc.base_url != PathBuf::new() {
                                    let joined = dir.join(&c.jsc.base_url);
                                    c.jsc.base_url = if cfg!(target_os = "windows")
                                        && c.jsc.base_url.as_os_str() == "."
                                    {
                                        dir.canonicalize().with_context(|| {
                                            format!(
                                                "failed to canonicalize base url using the path \
                                                 of .swcrc\nDir: {}\n(Used logic for windows)",
                                                dir.display(),
                                            )
                                        })?
                                    } else {
                                        joined.canonicalize().with_context(|| {
                                            format!(
                                                "failed to canonicalize base url using the path \
                                                 of .swcrc\nPath: {}\nDir: {}\nbaseUrl: {}",
                                                joined.display(),
                                                dir.display(),
                                                c.jsc.base_url.display()
                                            )
                                        })?
                                    };
                                }
                            }

                            return Ok(config);
                        }

                        if dir == root && *root_mode == RootMode::Root {
                            break;
                        }
                        parent = dir.parent();
                    }
                }

                let config_file = config_file.unwrap_or_default();
                let config = config_file.into_config(Some(path))?;

                return Ok(config);
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
    #[tracing::instrument(level = "info", skip_all)]
    pub fn parse_js_as_input<'a, P>(
        &'a self,
        fm: Lrc<SourceFile>,
        program: Option<Program>,
        handler: &'a Handler,
        opts: &Options,
        name: &FileName,
        comments: Option<&'a SingleThreadedComments>,
        before_pass: impl 'a + FnOnce(&Program) -> P,
    ) -> Result<Option<BuiltInput<impl 'a + swc_ecma_visit::Fold>>, Error>
    where
        P: 'a + swc_ecma_visit::Fold,
    {
        self.run(move || {
            let _timer = timer!("Compiler.parse");

            let config = self.read_config(opts, name)?;
            let config = match config {
                Some(v) => v,
                None => return Ok(None),
            };

            let built = opts.build_as_input(
                &self.cm,
                name,
                move |syntax, target, is_module| match program {
                    Some(v) => Ok(v),
                    _ => self.parse_js(
                        fm.clone(),
                        handler,
                        target,
                        syntax,
                        is_module,
                        comments.as_ref().map(|v| v as _),
                    ),
                },
                opts.output_path.as_deref(),
                opts.source_file_name.clone(),
                handler,
                opts.is_module,
                Some(config),
                comments,
                before_pass,
            )?;
            Ok(Some(built))
        })
    }

    pub fn run_transform<F, Ret>(&self, handler: &Handler, external_helpers: bool, op: F) -> Ret
    where
        F: FnOnce() -> Ret,
    {
        self.run(|| {
            helpers::HELPERS.set(&Helpers::new(external_helpers), || HANDLER.set(handler, op))
        })
    }

    #[tracing::instrument(level = "info", skip_all)]
    pub fn transform(
        &self,
        handler: &Handler,
        program: Program,
        external_helpers: bool,
        mut pass: impl swc_ecma_visit::Fold,
    ) -> Program {
        self.run_transform(handler, external_helpers, || {
            // Fold module
            program.fold_with(&mut pass)
        })
    }

    /// `custom_after_pass` is applied after swc transforms are applied.
    ///
    /// `program`: If you already parsed `Program`, you can pass it.
    ///
    /// # Guarantee
    ///
    /// `swc` invokes `custom_before_pass` after
    ///
    ///  - Handling decorators, if configured
    ///  - Applying `resolver`
    ///  - Stripping typescript nodes
    ///
    /// This means, you can use `noop_visit_type`, `noop_fold_type` and
    /// `noop_visit_mut_type` in your visitor to reduce the binary size.
    #[tracing::instrument(level = "info", skip_all)]
    pub fn process_js_with_custom_pass<P1, P2>(
        &self,
        fm: Arc<SourceFile>,
        program: Option<Program>,
        handler: &Handler,
        opts: &Options,
        custom_before_pass: impl FnOnce(&Program, &SingleThreadedComments) -> P1,
        custom_after_pass: impl FnOnce(&Program, &SingleThreadedComments) -> P2,
    ) -> Result<TransformOutput, Error>
    where
        P1: swc_ecma_visit::Fold,
        P2: swc_ecma_visit::Fold,
    {
        self.run(|| -> Result<_, Error> {
            let comments = SingleThreadedComments::default();
            let config = self.run(|| {
                self.parse_js_as_input(
                    fm.clone(),
                    program,
                    handler,
                    opts,
                    &fm.name,
                    Some(&comments),
                    |program| custom_before_pass(program, &comments),
                )
            })?;
            let config = match config {
                Some(v) => v,
                None => {
                    bail!("cannot process file because it's ignored by .swcrc")
                }
            };

            let pass = chain!(config.pass, custom_after_pass(&config.program, &comments));

            let config = BuiltInput {
                program: config.program,
                pass,
                syntax: config.syntax,
                target: config.target,
                minify: config.minify,
                external_helpers: config.external_helpers,
                source_maps: config.source_maps,
                input_source_map: config.input_source_map,
                is_module: config.is_module,
                output_path: config.output_path,
                source_file_name: config.source_file_name,
                preserve_comments: config.preserve_comments,
                inline_sources_content: config.inline_sources_content,
                comments: config.comments,
            };

            let orig = if config.source_maps.enabled() {
                self.get_orig_src_map(&fm, &config.input_source_map, false)?
            } else {
                None
            };

            self.process_js_inner(handler, orig.as_ref(), config)
        })
        .context("failed to process input file")
    }

    #[tracing::instrument(level = "info", skip(self, handler, opts))]
    pub fn process_js_file(
        &self,
        fm: Arc<SourceFile>,
        handler: &Handler,
        opts: &Options,
    ) -> Result<TransformOutput, Error> {
        self.process_js_with_custom_pass(fm, None, handler, opts, |_, _| noop(), |_, _| noop())
    }

    #[tracing::instrument(level = "info", skip_all)]
    pub fn minify(
        &self,
        fm: Arc<SourceFile>,
        handler: &Handler,
        opts: &JsMinifyOptions,
    ) -> Result<TransformOutput, Error> {
        self.run(|| {
            let _timer = timer!("Compiler.minify");

            let target = opts.ecma.clone().into();

            let (source_map, orig) = match &opts.source_map {
                BoolOrObject::Bool(false) => (SourceMapsConfig::Bool(false), None),
                BoolOrObject::Bool(true) => (SourceMapsConfig::Bool(true), None),
                BoolOrObject::Obj(obj) => {
                    let orig = obj
                        .content
                        .as_ref()
                        .map(|s| sourcemap::SourceMap::from_slice(s.as_bytes()));
                    let orig = match orig {
                        Some(v) => Some(v?),
                        None => None,
                    };
                    (SourceMapsConfig::Bool(true), orig)
                }
            };

            let mut min_opts = MinifyOptions {
                compress: opts
                    .compress
                    .clone()
                    .into_obj()
                    .map(|v| v.into_config(self.cm.clone())),
                mangle: opts.mangle.clone().into_obj(),
                ..Default::default()
            };

            // top_level defaults to true if module is true

            // https://github.com/swc-project/swc/issues/2254

            if opts.module {
                if let Some(opts) = &mut min_opts.compress {
                    if opts.top_level.is_none() {
                        opts.top_level = Some(TopLevelOptions { functions: true });
                    }
                }

                if let Some(opts) = &mut min_opts.mangle {
                    opts.top_level = true;
                }
            }

            let comments = SingleThreadedComments::default();

            let module = self
                .parse_js(
                    fm.clone(),
                    handler,
                    target,
                    Syntax::Es(EsConfig {
                        jsx: true,
                        decorators: true,
                        decorators_before_export: true,
                        import_assertions: true,
                        private_in_object: true,
                        ..Default::default()
                    }),
                    IsModule::Bool(true),
                    Some(&comments),
                )
                .context("failed to parse input file")?
                .expect_module();

            let source_map_names = if source_map.enabled() {
                let mut v = IdentCollector {
                    names: Default::default(),
                };

                module.visit_with(&mut v);

                v.names
            } else {
                Default::default()
            };

            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            let is_mangler_enabled = min_opts.mangle.is_some();

            let module = self.run_transform(handler, false, || {
                let module =
                    module.fold_with(&mut resolver(unresolved_mark, top_level_mark, false));

                let mut module = swc_ecma_minifier::optimize(
                    module,
                    self.cm.clone(),
                    Some(&comments),
                    None,
                    &min_opts,
                    &swc_ecma_minifier::option::ExtraOptions { unresolved_mark },
                );

                if !is_mangler_enabled {
                    module.visit_mut_with(&mut hygiene())
                }
                module.fold_with(&mut fixer(Some(&comments as &dyn Comments)))
            });

            minify_file_comments(&comments, true, Some(opts.format.comments.clone()));

            self.print(
                &module,
                Some(&fm.name.to_string()),
                opts.output_path.clone().map(From::from),
                opts.inline_sources_content,
                target,
                source_map,
                &source_map_names,
                orig.as_ref(),
                true,
                Some(&comments),
            )
        })
    }

    /// You can use custom pass with this method.
    ///
    /// There exists a [PassBuilder] to help building custom passes.
    #[tracing::instrument(level = "info", skip_all)]
    pub fn process_js(
        &self,
        handler: &Handler,
        program: Program,
        opts: &Options,
    ) -> Result<TransformOutput, Error> {
        let loc = self.cm.lookup_char_pos(program.span().lo());
        let fm = loc.file;

        self.process_js_with_custom_pass(
            fm,
            Some(program),
            handler,
            opts,
            |_, _| noop(),
            |_, _| noop(),
        )
    }

    #[tracing::instrument(level = "info", skip_all)]
    fn process_js_inner(
        &self,
        handler: &Handler,
        orig: Option<&sourcemap::SourceMap>,
        config: BuiltInput<impl swc_ecma_visit::Fold>,
    ) -> Result<TransformOutput, Error> {
        self.run(|| {
            let program = config.program;
            let source_map_names = if config.source_maps.enabled() {
                let mut v = IdentCollector {
                    names: Default::default(),
                };

                program.visit_with(&mut v);

                v.names
            } else {
                Default::default()
            };

            let mut pass = config.pass;
            let program = helpers::HELPERS.set(&Helpers::new(config.external_helpers), || {
                HANDLER.set(handler, || {
                    // Fold module
                    program.fold_with(&mut pass)
                })
            });

            if let Some(comments) = &config.comments {
                minify_file_comments(comments, config.minify, config.preserve_comments);
            }

            self.print(
                &program,
                config.source_file_name.as_deref(),
                config.output_path,
                config.inline_sources_content,
                config.target,
                config.source_maps,
                &source_map_names,
                orig,
                config.minify,
                config.comments.as_ref().map(|v| v as _),
            )
        })
    }
}

#[tracing::instrument(level = "info", skip_all)]
fn load_swcrc(path: &Path) -> Result<Rc, Error> {
    let content = read_to_string(path).context("failed to read config (.swcrc) file")?;

    parse_swcrc(&content)
}

fn parse_swcrc(s: &str) -> Result<Rc, Error> {
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

    if let Ok(v) = serde_json::from_reader(StripComments::new(
        s.trim_start_matches('\u{feff}').as_bytes(),
    )) {
        return Ok(v);
    }

    serde_json::from_reader::<StripComments<&[u8]>, Config>(StripComments::new(s.as_bytes()))
        .map(Rc::Single)
        .map_err(convert_json_err)
}

pub struct IdentCollector {
    names: AHashMap<BytePos, JsWord>,
}

impl Visit for IdentCollector {
    noop_visit_type!();

    fn visit_ident(&mut self, ident: &Ident) {
        self.names.insert(ident.span.lo, ident.sym.clone());
    }
}
