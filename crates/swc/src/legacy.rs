//! Compatibility entry points for legacy compiler APIs.
//!
//! [`Compiler::process_js`] preserves its signature while delegating to the
//! direct pipeline. [`Compiler::parse_js_as_input`] and
//! [`Compiler::process_js_with_custom_pass`] remain backed by the frozen
//! pass-building pipeline for embedders that require a delayed pass graph or
//! the legacy custom-pass ABI.

use std::sync::Arc;

use anyhow::{bail, Error};
use swc_common::{
    comments::{Comments, SingleThreadedComments},
    errors::Handler,
    sync::Lrc,
    FileName, SourceFile, Spanned,
};
use swc_compiler_base::{PrintArgs, TransformOutput};
use swc_config::types::BoolOr;
use swc_ecma_ast::{Pass, Program};
use swc_ecma_parser::Syntax;
use swc_ecma_visit::VisitWith;
#[cfg(feature = "isolated-dts")]
use swc_typescript::fast_dts::FastDts;

use crate::{
    config::{BuiltInput, Options, OutputCharset},
    flow::downgrade_script_like_module,
    sourcemap, CompileInput, Compiler,
};

impl Compiler {
    /// Builds a legacy delayed-pass input, or returns [`None`] if the file is
    /// skipped. A pre-parsed program bypasses Flow script/module
    /// classification.
    ///
    /// `before_pass` observes the program after optional React Compiler and the
    /// initial resolver. It is skipped when built-ins are disabled for testing.
    #[cfg_attr(debug_assertions, tracing::instrument(skip_all))]
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
                    Some(v) => Ok((v, false)),
                    _ => self.parse_js_as_transform_input(
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
                config.source_map_ignore_list.clone(),
                handler,
                Some(config),
                comments,
                before_pass,
            )?;
            Ok(Some(built))
        })
    }

    /// Compiles with the legacy custom-pass ABI.
    ///
    /// # Factory and pass timing
    ///
    /// Both factories observe `BuiltInput::program` before delayed passes run.
    ///
    /// The custom-before pass runs after type stripping and the active plugin
    /// checkpoint, before React and compatibility transforms. The custom-after
    /// pass runs after SWC transforms and custom-before, but before the Flow
    /// script downgrade and final comment policy.
    ///
    /// With built-ins disabled, custom-before is skipped and custom-after still
    /// runs. A pre-parsed program bypasses Flow script/module classification.
    #[cfg_attr(debug_assertions, tracing::instrument(skip_all))]
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

            self.apply_transforms(handler, comments.clone(), fm.clone(), orig, config)
        })
    }

    /// Compiles an already parsed program through the direct pipeline while
    /// preserving the legacy method signature.
    ///
    /// New code should use [`Compiler::compile`] with
    /// [`crate::CompileInput::program`] and select an AST or codegen terminal.
    #[cfg_attr(debug_assertions, tracing::instrument(skip_all))]
    pub fn process_js(
        &self,
        handler: &Handler,
        program: Program,
        opts: &Options,
    ) -> Result<TransformOutput, Error> {
        let loc = self.cm.lookup_char_pos(program.span().lo());
        let fm = loc.file;

        self.compile(handler, CompileInput::program(fm, program), opts)
            .codegen()
    }

    #[cfg_attr(
        debug_assertions,
        tracing::instrument(name = "swc::Compiler::apply_transforms", skip_all)
    )]
    fn apply_transforms(
        &self,
        handler: &Handler,
        #[allow(unused)] comments: SingleThreadedComments,
        #[allow(unused)] fm: Arc<SourceFile>,
        orig: Option<sourcemap::SourceMap>,
        config: BuiltInput<impl Pass>,
    ) -> Result<TransformOutput, Error> {
        self.run(|| {
            let program = config.program;
            let is_typescript_syntax = matches!(config.syntax, Syntax::Typescript(..));

            if config.emit_isolated_dts && !is_typescript_syntax {
                handler.warn(
                    "jsc.experimental.emitIsolatedDts is enabled but the syntax is not TypeScript",
                );
            }

            let source_map_names = if config.source_maps.enabled() {
                let mut v = swc_compiler_base::IdentCollector {
                    names: Default::default(),
                };

                program.visit_with(&mut v);

                v.names
            } else {
                Default::default()
            };
            #[cfg(feature = "isolated-dts")]
            let dts_code = if is_typescript_syntax && config.emit_isolated_dts {
                use std::cell::RefCell;

                use swc_ecma_codegen::to_code_with_comments;
                let (leading, trailing) = comments.borrow_all();

                let leading = std::rc::Rc::new(RefCell::new(leading.clone()));
                let trailing = std::rc::Rc::new(RefCell::new(trailing.clone()));

                let comments = SingleThreadedComments::from_leading_and_trailing(leading, trailing);

                let mut checker =
                    FastDts::new(fm.name.clone(), config.unresolved_mark, Default::default());
                let mut program = program.clone();

                #[cfg(feature = "module")]
                if let Some((base, resolver)) = config.resolver {
                    use swc_ecma_transforms_module::rewriter::import_rewriter;

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
                #[cfg(feature = "isolated-dts")]
                {
                    if let Some(dts_code) = dts_code {
                        use swc_transform_common::output::experimental_emit;
                        experimental_emit("__swc_isolated_declarations__".into(), dts_code);
                    }
                }

                self.run_transform(handler, config.external_helpers, || program.apply(pass))
            });

            let program = if config.flow_strip_script_like_module {
                downgrade_script_like_module(program)?
            } else {
                program
            };

            if let Some(comments) = &config.comments {
                swc_compiler_base::minify_file_comments(
                    comments,
                    config.preserve_comments,
                    BoolOr::Bool(false),
                    config.output.preserve_annotations.into_bool(),
                );
            }

            self.print(
                &program,
                PrintArgs {
                    source_root: config.source_root.as_deref(),
                    source_file_name: config.source_file_name.as_deref(),
                    source_map_ignore_list: config.source_map_ignore_list.clone(),
                    output_path: config.output_path,
                    inline_sources_content: config.inline_sources_content,
                    source_map: config.source_maps,
                    source_map_names: &source_map_names,
                    orig,
                    comments: config.comments.as_ref().map(|v| v as _),
                    emit_source_map_columns: config.emit_source_map_columns,
                    emit_source_map_scopes: config.emit_source_map_scopes,
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
                    source_map_url: config.output.source_map_url.as_deref(),
                },
            )
        })
    }
}
