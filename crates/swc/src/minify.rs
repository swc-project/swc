//! The standalone Terser-compatible minification API.
//!
//! This is independent of the optional minify stage in the compilation
//! pipeline.

use std::sync::Arc;

use anyhow::{Context, Error};
use swc_common::{
    comments::{Comments, SingleThreadedComments},
    errors::Handler,
    Mark, SourceFile,
};
use swc_compiler_base::{PrintArgs, TransformOutput};
use swc_config::types::BoolOr;
use swc_ecma_minifier::option::{MangleCache, MinifyOptions, TopLevelOptions};
use swc_ecma_parser::{EsSyntax, Syntax};
use swc_ecma_transforms::{fixer, hygiene, resolver};
use swc_ecma_transforms_base::fixer::paren_remover;
use swc_ecma_visit::{VisitMutWith, VisitWith};

use crate::{
    config::{JsMinifyCommentOption, JsMinifyOptions, SourceMapsConfig},
    Compiler,
};

/// Additional state used by the standalone minifier.
#[non_exhaustive]
#[derive(Clone, Default)]
pub struct JsMinifyExtras {
    /// Reuses mangled names across minification calls.
    pub mangle_name_cache: Option<Arc<dyn MangleCache>>,
}

impl JsMinifyExtras {
    /// Sets the cache used to reuse mangled names across minification calls.
    pub fn with_mangle_name_cache(
        mut self,
        mangle_name_cache: Option<Arc<dyn MangleCache>>,
    ) -> Self {
        self.mangle_name_cache = mangle_name_cache;
        self
    }
}

impl Compiler {
    #[cfg_attr(debug_assertions, tracing::instrument(target = "swc", skip_all))]
    pub fn minify(
        &self,
        fm: Arc<SourceFile>,
        handler: &Handler,
        opts: &JsMinifyOptions,
        extras: JsMinifyExtras,
    ) -> Result<TransformOutput, Error> {
        self.run(|| {
            let target = opts.ecma.clone().into();

            let (source_map, orig, source_map_url) = opts
                .source_map
                .as_ref()
                .map(|obj| -> Result<_, Error> {
                    let orig = obj.content.as_ref().map(|s| s.to_sourcemap()).transpose()?;

                    Ok((SourceMapsConfig::Bool(true), orig, obj.url.as_deref()))
                })
                .unwrap_as_option(|v| {
                    Some(Ok(match v {
                        Some(true) => (SourceMapsConfig::Bool(true), None, None),
                        _ => (SourceMapsConfig::Bool(false), None, None),
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

            if opts.toplevel == Some(true) || program.is_module() {
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
            let extracted_comments = swc_compiler_base::minify_file_comments(
                &comments,
                preserve_comments,
                opts.extract_comments
                    .clone()
                    .into_inner()
                    .unwrap_or(BoolOr::Bool(false)),
                opts.format.preserve_annotations,
            );

            let ret = self.print(
                &program,
                PrintArgs {
                    source_root: None,
                    source_file_name: Some(&fm.name.to_string()),
                    output_path: opts.output_path.clone().map(From::from),
                    inline_sources_content: opts.inline_sources_content,
                    source_map,
                    source_map_ignore_list: opts.source_map_ignore_list.clone(),
                    source_map_names: &source_map_names,
                    orig,
                    comments: Some(&comments),
                    emit_source_map_columns: opts.emit_source_map_columns,
                    emit_source_map_scopes: false,
                    preamble: &opts.format.preamble,
                    codegen_config: swc_ecma_codegen::Config::default()
                        .with_target(target)
                        .with_minify(true)
                        .with_ascii_only(opts.format.ascii_only)
                        .with_emit_assert_for_import_attributes(
                            opts.format.emit_assert_for_import_attributes,
                        )
                        .with_inline_script(opts.format.inline_script)
                        .with_reduce_escaped_newline(
                            min_opts
                                .compress
                                .unwrap_or_default()
                                .experimental
                                .reduce_escaped_newline,
                        ),
                    output: None,
                    source_map_url,
                },
            );

            ret.map(|mut output| {
                if !extracted_comments.is_empty() {
                    output.extracted_comments = Some(extracted_comments);
                }
                output.diagnostics = handler.take_diagnostics();

                output
            })
        })
    }
}
