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
//! `swc` has [swc_css](https://docs.rs/swc_css), which re-exports required modules.
//!
//! ## Testing
//!
//! See [testing] and [swc_ecma_transforms_testing](https://docs.rs/swc_ecma_transforms_testing).
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
#![allow(clippy::mutable_key_type)]
#![cfg_attr(docsrs, feature(doc_cfg))]

pub extern crate swc_atoms as atoms;
extern crate swc_common as common;

use std::{
    cell::RefCell,
    fs::{read_to_string, File},
    io::ErrorKind,
    path::{Path, PathBuf},
    sync::Arc,
};

use anyhow::{bail, Context, Error};
use base64::prelude::{Engine, BASE64_STANDARD};
use common::{
    comments::{Comment, SingleThreadedComments},
    errors::HANDLER,
};
use jsonc_parser::{parse_to_serde_value, ParseOptions};
use once_cell::sync::Lazy;
use serde_json::error::Category;
pub use sourcemap;
use swc_common::{
    comments::Comments, errors::Handler, sync::Lrc, FileName, Mark, SourceFile, SourceMap, Spanned,
    GLOBALS,
};
pub use swc_compiler_base::{PrintArgs, TransformOutput};
pub use swc_config::config_types::{BoolConfig, BoolOr, BoolOrDataConfig};
use swc_ecma_ast::{noop_pass, EsVersion, Pass, Program};
use swc_ecma_codegen::{to_code_with_comments, Node};
use swc_ecma_loader::resolvers::{
    lru::CachingResolver, node::NodeModulesResolver, tsc::TsConfigResolver,
};
use swc_ecma_minifier::option::{MangleCache, MinifyOptions, TopLevelOptions};
use swc_ecma_parser::{EsSyntax, Syntax};
use swc_ecma_transforms::{
    fixer,
    helpers::{self, Helpers},
    hygiene,
    modules::{path::NodeImportResolver, rewriter::import_rewriter},
    resolver,
};
use swc_ecma_transforms_base::fixer::paren_remover;
use swc_ecma_visit::{FoldWith, VisitMutWith, VisitWith};
pub use swc_error_reporters::handler::{try_with_handler, HandlerOpts};
pub use swc_node_comments::SwcComments;
use swc_timer::timer;
use swc_transform_common::output::emit;
use swc_typescript::fast_dts::FastDts;
use tracing::warn;
use url::Url;

pub use crate::builder::PassBuilder;
use crate::config::{
    BuiltInput, Config, ConfigFile, InputSourceMap, IsModule, JsMinifyCommentOption,
    JsMinifyOptions, Options, OutputCharset, Rc, RootMode, SourceMapsConfig,
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
            NodeModulesResolver::without_node_modules(target_env, alias, preserve_symlinks),
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

type SwcImportResolver = Arc<
    NodeImportResolver<CachingResolver<TsConfigResolver<CachingResolver<NodeModulesResolver>>>>,
>;

/// All methods accept [Handler], which is a storage for errors.
///
/// The caller should check if the handler contains any errors after calling
/// method.
pub struct Compiler {
    /// CodeMap
    pub cm: Arc<SourceMap>,
    comments: SwcComments,
}

/// These are **low-level** apis.
impl Compiler {
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
        debug_assert!(
            GLOBALS.is_set(),
            "`swc_common::GLOBALS` is required for this operation"
        );

        op()
    }

    fn get_orig_src_map(
        &self,
        fm: &SourceFile,
        input_src_map: &InputSourceMap,
        comments: &[Comment],
        is_default: bool,
    ) -> Result<Option<sourcemap::SourceMap>, Error> {
        self.run(|| -> Result<_, Error> {
            let name = &fm.name;

            let read_inline_sourcemap =
                |data_url: &str| -> Result<Option<sourcemap::SourceMap>, Error> {
                    let url = Url::parse(data_url).with_context(|| {
                        format!("failed to parse inline source map url\n{}", data_url)
                    })?;

                    let idx = match url.path().find("base64,") {
                        Some(v) => v,
                        None => {
                            bail!("failed to parse inline source map: not base64: {:?}", url)
                        }
                    };

                    let content = url.path()[idx + "base64,".len()..].trim();

                    let res = BASE64_STANDARD
                        .decode(content.as_bytes())
                        .context("failed to decode base64-encoded source map")?;

                    Ok(Some(sourcemap::SourceMap::from_slice(&res).context(
                        "failed to read input source map from inlined base64 encoded string",
                    )?))
                };

            let read_file_sourcemap =
                |data_url: Option<&str>| -> Result<Option<sourcemap::SourceMap>, Error> {
                    match &**name {
                        FileName::Real(filename) => {
                            let dir = match filename.parent() {
                                Some(v) => v,
                                None => {
                                    bail!("unexpected: root directory is given as a input file")
                                }
                            };

                            let map_path = match data_url {
                                Some(data_url) => {
                                    let mut map_path = dir.join(data_url);
                                    if !map_path.exists() {
                                        // Old behavior. This check would prevent
                                        // regressions.
                                        // Perhaps it shouldn't be supported. Sometimes
                                        // developers don't want to expose their source
                                        // code.
                                        // Map files are for internal troubleshooting
                                        // convenience.
                                        let fallback_map_path =
                                            PathBuf::from(format!("{}.map", filename.display()));
                                        if fallback_map_path.exists() {
                                            map_path = fallback_map_path;
                                        } else {
                                            bail!(
                                                "failed to find input source map file {:?} in \
                                                 {:?} file as either {:?} or with appended .map",
                                                data_url,
                                                filename.display(),
                                                map_path.display(),
                                            )
                                        }
                                    }

                                    Some(map_path)
                                }
                                None => {
                                    // Old behavior.
                                    let map_path =
                                        PathBuf::from(format!("{}.map", filename.display()));
                                    if map_path.exists() {
                                        Some(map_path)
                                    } else {
                                        None
                                    }
                                }
                            };

                            match map_path {
                                Some(map_path) => {
                                    let path = map_path.display().to_string();
                                    let file = File::open(&path);

                                    // If file is not found, we should return None.
                                    // Some libraries generates source map but omit them from the
                                    // npm package.
                                    //
                                    // See https://github.com/swc-project/swc/issues/8789#issuecomment-2105055772
                                    if file
                                        .as_ref()
                                        .is_err_and(|err| err.kind() == ErrorKind::NotFound)
                                    {
                                        warn!(
                                            "source map is specified by sourceMappingURL but \
                                             there's no source map at `{}`",
                                            path
                                        );
                                        return Ok(None);
                                    }

                                    // Old behavior.
                                    let file = if !is_default {
                                        file?
                                    } else {
                                        match file {
                                            Ok(v) => v,
                                            Err(_) => return Ok(None),
                                        }
                                    };

                                    Ok(Some(sourcemap::SourceMap::from_reader(file).with_context(
                                        || {
                                            format!(
                                                "failed to read input source map
                                from file at {}",
                                                path
                                            )
                                        },
                                    )?))
                                }
                                None => Ok(None),
                            }
                        }
                        _ => Ok(None),
                    }
                };

            let read_sourcemap = || -> Option<sourcemap::SourceMap> {
                let s = "sourceMappingURL=";

                let text = comments.iter().rev().find_map(|c| {
                    let idx = c.text.rfind(s)?;
                    let (_, url) = c.text.split_at(idx + s.len());

                    Some(url.trim())
                });

                // Load original source map if possible
                let result = match text {
                    Some(text) if text.starts_with("data:") => read_inline_sourcemap(text),
                    _ => read_file_sourcemap(text),
                };
                match result {
                    Ok(r) => r,
                    Err(err) => {
                        tracing::error!("failed to read input source map: {:?}", err);
                        None
                    }
                }
            };

            // Load original source map
            match input_src_map {
                InputSourceMap::Bool(false) => Ok(None),
                InputSourceMap::Bool(true) => Ok(read_sourcemap()),
                InputSourceMap::Str(ref s) => {
                    if s == "inline" {
                        Ok(read_sourcemap())
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
        swc_compiler_base::parse_js(
            self.cm.clone(),
            fm,
            handler,
            target,
            syntax,
            is_module,
            comments,
        )
    }

    /// Converts ast node to source string and sourcemap.
    ///
    ///
    /// This method receives target file path, but does not write file to the
    /// path. See: https://github.com/swc-project/swc/issues/1255
    #[allow(clippy::too_many_arguments)]
    pub fn print<T>(&self, node: &T, args: PrintArgs) -> Result<TransformOutput, Error>
    where
        T: Node + VisitWith<swc_compiler_base::IdentCollector>,
    {
        swc_compiler_base::print(self.cm.clone(), node, args)
    }
}

/// High-level apis.
impl Compiler {
    pub fn new(cm: Arc<SourceMap>) -> Self {
        Compiler {
            cm,
            comments: Default::default(),
        }
    }

    #[tracing::instrument(skip_all)]
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

            let swcrc_path = match config_file {
                Some(ConfigFile::Str(s)) => Some(PathBuf::from(s.clone())),
                _ => {
                    if *swcrc {
                        if let FileName::Real(ref path) = name {
                            find_swcrc(path, root, *root_mode)
                        } else {
                            None
                        }
                    } else {
                        None
                    }
                }
            };

            let config_file = match swcrc_path.as_deref() {
                Some(s) => Some(load_swcrc(s)?),
                _ => None,
            };
            let filename_path = match name {
                FileName::Real(p) => Some(&**p),
                _ => None,
            };

            if let Some(filename_path) = filename_path {
                if let Some(config) = config_file {
                    let dir = swcrc_path
                        .as_deref()
                        .and_then(|p| p.parent())
                        .expect(".swcrc path should have parent dir");

                    let mut config = config
                        .into_config(Some(filename_path))
                        .context("failed to process config file")?;

                    if let Some(c) = &mut config {
                        if c.jsc.base_url != PathBuf::new() {
                            let joined = dir.join(&c.jsc.base_url);
                            c.jsc.base_url = if cfg!(target_os = "windows")
                                && c.jsc.base_url.as_os_str() == "."
                            {
                                dir.canonicalize().with_context(|| {
                                    format!(
                                        "failed to canonicalize base url using the path of \
                                         .swcrc\nDir: {}\n(Used logic for windows)",
                                        dir.display(),
                                    )
                                })?
                            } else {
                                joined.canonicalize().with_context(|| {
                                    format!(
                                        "failed to canonicalize base url using the path of \
                                         .swcrc\nPath: {}\nDir: {}\nbaseUrl: {}",
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

                let config_file = config_file.unwrap_or_default();
                let config = config_file.into_config(Some(filename_path))?;

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
        .with_context(|| format!("failed to read .swcrc file for input file at `{}`", name))
    }

    /// This method returns [None] if a file should be skipped.
    ///
    /// This method handles merging of config.
    ///
    /// This method does **not** parse module.
    #[tracing::instrument(skip_all)]
    pub fn parse_js_as_input<'a, P>(
        &'a self,
        fm: Lrc<SourceFile>,
        program: Option<Program>,
        handler: &'a Handler,
        opts: &Options,
        name: &FileName,
        comments: Option<&'a SingleThreadedComments>,
        before_pass: impl 'a + FnOnce(&Program) -> P,
    ) -> Result<Option<BuiltInput<impl 'a + Pass>>, Error>
    where
        P: 'a + Pass,
    {
        self.run(move || {
            let _timer = timer!("Compiler.parse");

            if let FileName::Real(ref path) = name {
                if !opts.config.matches(path)? {
                    return Ok(None);
                }
            }

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
                opts.source_root.clone(),
                opts.source_file_name.clone(),
                handler,
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

    #[tracing::instrument(skip_all)]
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
    #[tracing::instrument(skip_all)]
    pub fn process_js_with_custom_pass<P1, P2>(
        &self,
        fm: Arc<SourceFile>,
        program: Option<Program>,
        handler: &Handler,
        opts: &Options,
        comments: SingleThreadedComments,
        custom_before_pass: impl FnOnce(&Program) -> P1,
        custom_after_pass: impl FnOnce(&Program) -> P2,
    ) -> Result<TransformOutput, Error>
    where
        P1: Pass,
        P2: Pass,
    {
        self.run(|| -> Result<_, Error> {
            let config = self.run(|| {
                self.parse_js_as_input(
                    fm.clone(),
                    program,
                    handler,
                    opts,
                    &fm.name,
                    Some(&comments),
                    |program| custom_before_pass(program),
                )
            })?;
            let config = match config {
                Some(v) => v,
                None => {
                    bail!("cannot process file because it's ignored by .swcrc")
                }
            };

            let after_pass = custom_after_pass(&config.program);

            let config = config.with_pass(|pass| (pass, after_pass));

            let orig = if config.source_maps.enabled() {
                self.get_orig_src_map(
                    &fm,
                    &config.input_source_map,
                    config
                        .comments
                        .get_trailing(config.program.span_hi())
                        .as_deref()
                        .unwrap_or_default(),
                    false,
                )?
            } else {
                None
            };

            self.apply_transforms(handler, comments.clone(), fm.clone(), orig.as_ref(), config)
        })
    }

    #[tracing::instrument(skip(self, handler, opts))]
    pub fn process_js_file(
        &self,
        fm: Arc<SourceFile>,
        handler: &Handler,
        opts: &Options,
    ) -> Result<TransformOutput, Error> {
        self.process_js_with_custom_pass(
            fm,
            None,
            handler,
            opts,
            SingleThreadedComments::default(),
            |_| noop_pass(),
            |_| noop_pass(),
        )
    }

    #[tracing::instrument(skip_all)]
    pub fn minify(
        &self,
        fm: Arc<SourceFile>,
        handler: &Handler,
        opts: &JsMinifyOptions,
        extras: JsMinifyExtras,
    ) -> Result<TransformOutput, Error> {
        self.run(|| {
            let _timer = timer!("Compiler::minify");

            let target = opts.ecma.clone().into();

            let (source_map, orig) = opts
                .source_map
                .as_ref()
                .map(|obj| -> Result<_, Error> {
                    let orig = obj.content.as_ref().map(|s| s.to_sourcemap()).transpose()?;

                    Ok((SourceMapsConfig::Bool(true), orig))
                })
                .unwrap_as_option(|v| {
                    Some(Ok(match v {
                        Some(true) => (SourceMapsConfig::Bool(true), None),
                        _ => (SourceMapsConfig::Bool(false), None),
                    }))
                })
                .unwrap()?;

            let mut min_opts = MinifyOptions {
                compress: opts
                    .compress
                    .clone()
                    .unwrap_as_option(|default| match default {
                        Some(true) | None => Some(Default::default()),
                        _ => None,
                    })
                    .map(|v| v.into_config(self.cm.clone())),
                mangle: opts
                    .mangle
                    .clone()
                    .unwrap_as_option(|default| match default {
                        Some(true) | None => Some(Default::default()),
                        _ => None,
                    }),
                ..Default::default()
            };

            // top_level defaults to true if module is true

            // https://github.com/swc-project/swc/issues/2254

            if opts.keep_fnames {
                if let Some(opts) = &mut min_opts.compress {
                    opts.keep_fnames = true;
                }
                if let Some(opts) = &mut min_opts.mangle {
                    opts.keep_fn_names = true;
                }
            }

            let comments = SingleThreadedComments::default();

            let mut program = self
                .parse_js(
                    fm.clone(),
                    handler,
                    target,
                    Syntax::Es(EsSyntax {
                        jsx: true,
                        decorators: true,
                        decorators_before_export: true,
                        import_attributes: true,
                        ..Default::default()
                    }),
                    opts.module,
                    Some(&comments),
                )
                .context("failed to parse input file")?;

            if program.is_module() {
                if let Some(opts) = &mut min_opts.compress {
                    if opts.top_level.is_none() {
                        opts.top_level = Some(TopLevelOptions { functions: true });
                    }
                }

                if let Some(opts) = &mut min_opts.mangle {
                    if opts.top_level.is_none() {
                        opts.top_level = Some(true);
                    }
                }
            }

            let source_map_names = if source_map.enabled() {
                let mut v = swc_compiler_base::IdentCollector {
                    names: Default::default(),
                };

                program.visit_with(&mut v);

                v.names
            } else {
                Default::default()
            };

            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            let is_mangler_enabled = min_opts.mangle.is_some();

            program = self.run_transform(handler, false, || {
                program.mutate(&mut paren_remover(Some(&comments)));

                program.mutate(&mut resolver(unresolved_mark, top_level_mark, false));

                let mut program = swc_ecma_minifier::optimize(
                    program,
                    self.cm.clone(),
                    Some(&comments),
                    None,
                    &min_opts,
                    &swc_ecma_minifier::option::ExtraOptions {
                        unresolved_mark,
                        top_level_mark,
                        mangle_name_cache: extras.mangle_name_cache,
                    },
                );

                if !is_mangler_enabled {
                    program.visit_mut_with(&mut hygiene())
                }
                program.mutate(&mut fixer(Some(&comments as &dyn Comments)));
                program
            });

            let preserve_comments = opts
                .format
                .comments
                .clone()
                .into_inner()
                .unwrap_or(BoolOr::Data(JsMinifyCommentOption::PreserveSomeComments));
            swc_compiler_base::minify_file_comments(
                &comments,
                preserve_comments,
                opts.format.preserve_annotations,
            );

            self.print(
                &program,
                PrintArgs {
                    source_root: None,
                    source_file_name: Some(&fm.name.to_string()),
                    output_path: opts.output_path.clone().map(From::from),
                    inline_sources_content: opts.inline_sources_content,
                    source_map,
                    source_map_names: &source_map_names,
                    orig: orig.as_ref(),
                    comments: Some(&comments),
                    emit_source_map_columns: opts.emit_source_map_columns,
                    preamble: &opts.format.preamble,
                    codegen_config: swc_ecma_codegen::Config::default()
                        .with_target(target)
                        .with_minify(true)
                        .with_ascii_only(opts.format.ascii_only)
                        .with_emit_assert_for_import_attributes(
                            opts.format.emit_assert_for_import_attributes,
                        )
                        .with_inline_script(opts.format.inline_script),
                    output: None,
                },
            )
        })
    }

    /// You can use custom pass with this method.
    ///
    /// There exists a [PassBuilder] to help building custom passes.
    #[tracing::instrument(skip_all)]
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
            SingleThreadedComments::default(),
            |_| noop_pass(),
            |_| noop_pass(),
        )
    }

    #[tracing::instrument(name = "swc::Compiler::apply_transforms", skip_all)]
    fn apply_transforms(
        &self,
        handler: &Handler,
        comments: SingleThreadedComments,
        fm: Arc<SourceFile>,
        orig: Option<&sourcemap::SourceMap>,
        config: BuiltInput<impl Pass>,
    ) -> Result<TransformOutput, Error> {
        self.run(|| {
            let program = config.program;

            if config.emit_isolated_dts && !config.syntax.typescript() {
                handler.warn(
                    "jsc.experimental.emitIsolatedDts is enabled but the syntax is not TypeScript",
                );
            }

            let emit_dts = config.syntax.typescript() && config.emit_isolated_dts;
            let source_map_names = if config.source_maps.enabled() {
                let mut v = swc_compiler_base::IdentCollector {
                    names: Default::default(),
                };

                program.visit_with(&mut v);

                v.names
            } else {
                Default::default()
            };

            let dts_code = if emit_dts {
                let (leading, trailing) = comments.borrow_all();

                let leading = std::rc::Rc::new(RefCell::new(leading.clone()));
                let trailing = std::rc::Rc::new(RefCell::new(trailing.clone()));

                let comments = SingleThreadedComments::from_leading_and_trailing(leading, trailing);
                let mut checker = FastDts::new(fm.name.clone(), Default::default());
                let mut program = program.clone();

                if let Some((base, resolver)) = config.resolver {
                    program.mutate(import_rewriter(base, resolver));
                }

                let issues = checker.transform(&mut program);

                for issue in issues {
                    handler
                        .struct_span_err(issue.range.span, &issue.message)
                        .emit();
                }

                let dts_code = to_code_with_comments(Some(&comments), &program);
                Some(dts_code)
            } else {
                None
            };

            let pass = config.pass;
            let (program, output) = swc_transform_common::output::capture(|| {
                if let Some(dts_code) = dts_code {
                    emit(
                        "__swc_isolated_declarations__".into(),
                        serde_json::Value::String(dts_code),
                    );
                }

                helpers::HELPERS.set(&Helpers::new(config.external_helpers), || {
                    HANDLER.set(handler, || {
                        // Fold module
                        program.apply(pass)
                    })
                })
            });

            if let Some(comments) = &config.comments {
                swc_compiler_base::minify_file_comments(
                    comments,
                    config.preserve_comments,
                    config.output.preserve_annotations.into_bool(),
                );
            }

            self.print(
                &program,
                PrintArgs {
                    source_root: config.source_root.as_deref(),
                    source_file_name: config.source_file_name.as_deref(),
                    output_path: config.output_path,
                    inline_sources_content: config.inline_sources_content,
                    source_map: config.source_maps,
                    source_map_names: &source_map_names,
                    orig,
                    comments: config.comments.as_ref().map(|v| v as _),
                    emit_source_map_columns: config.emit_source_map_columns,
                    preamble: &config.output.preamble,
                    codegen_config: swc_ecma_codegen::Config::default()
                        .with_target(config.target)
                        .with_minify(config.minify)
                        .with_ascii_only(
                            config
                                .output
                                .charset
                                .map(|v| matches!(v, OutputCharset::Ascii))
                                .unwrap_or(false),
                        )
                        .with_emit_assert_for_import_attributes(
                            config.emit_assert_for_import_attributes,
                        )
                        .with_inline_script(config.codegen_inline_script),
                    output: if output.is_empty() {
                        None
                    } else {
                        Some(output)
                    },
                },
            )
        })
    }
}

#[non_exhaustive]
#[derive(Clone, Default)]
pub struct JsMinifyExtras {
    pub mangle_name_cache: Option<Arc<dyn MangleCache>>,
}

impl JsMinifyExtras {
    pub fn with_mangle_name_cache(
        mut self,
        mangle_name_cache: Option<Arc<dyn MangleCache>>,
    ) -> Self {
        self.mangle_name_cache = mangle_name_cache;
        self
    }
}

fn find_swcrc(path: &Path, root: &Path, root_mode: RootMode) -> Option<PathBuf> {
    let mut parent = path.parent();
    while let Some(dir) = parent {
        let swcrc = dir.join(".swcrc");

        if swcrc.exists() {
            return Some(swcrc);
        }

        if dir == root && root_mode == RootMode::Root {
            break;
        }
        parent = dir.parent();
    }

    None
}

#[tracing::instrument(skip_all)]
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

    let v = parse_to_serde_value(
        s.trim_start_matches('\u{feff}'),
        &ParseOptions {
            allow_comments: true,
            allow_trailing_commas: true,
            allow_loose_object_property_names: false,
        },
    )?
    .ok_or_else(|| Error::msg("failed to deserialize empty .swcrc (json) file"))?;

    if let Ok(rc) = serde_json::from_value(v.clone()) {
        return Ok(rc);
    }

    serde_json::from_value(v)
        .map(Rc::Single)
        .map_err(convert_json_err)
}
