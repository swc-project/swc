//! The direct, linear JavaScript compilation pipeline.
//!
//! [`CompileRequest`] terminals use this pipeline. [`Options::build_as_input`]
//! remains a separate delayed-pass compatibility API.

mod api;
mod finalize;
mod hooks;
#[cfg(feature = "lint")]
mod lint;
mod minify;
mod options;
mod parse;
mod plugin;
mod preparation;
mod resolve;
mod state;
mod terminal;
mod transform;

use anyhow::Error;
pub use api::{CompileInput, CompileRequest, PipelineContext, PipelineHooks, TransformedProgram};
use hooks::HookDispatch;
use options::ResolvedPipelineOptions;
use swc_common::errors::Handler;
use terminal::PipelineTerminal;

use crate::{config::Options, Compiler};

pub(super) struct Pipeline<'a> {
    compiler: &'a Compiler,
    handler: &'a Handler,
}

impl<'a> Pipeline<'a> {
    pub(super) fn new(compiler: &'a Compiler, handler: &'a Handler) -> Self {
        Self { compiler, handler }
    }

    fn transform<H, T>(
        self,
        input: CompileInput,
        options: &Options,
        hooks: &mut H,
        terminal: T,
    ) -> Result<T::Output, Error>
    where
        H: HookDispatch,
        T: PipelineTerminal,
    {
        let config = self.resolve_config(&input.source_file, options)?;
        let context = config.context;
        let external_helpers = config.config.jsc.external_helpers.into_bool();
        let mut unit = self.parse(input, &config)?;

        let ((result, helper_data), transform_output) =
            swc_transform_common::output::capture(|| {
                self.compiler
                    .run_transform_with_helpers(self.handler, external_helpers, || {
                        hooks.after_parse(&self, &mut unit, &context)?;
                        self.run_react_compiler(&mut unit, &config);
                        self.run_resolver(&mut unit, &config);
                        hooks.after_resolve(&self, &mut unit, &context)?;

                        let ResolvedPipelineOptions {
                            plugin,
                            #[cfg(feature = "lint")]
                            lint,
                            transform,
                            minify,
                            finalize,
                            terminal: mut terminal_state,
                        } = self.resolve_pipeline_options(config, &unit, &terminal, options)?;
                        let mut plugin = self.create_runtime_plugin(&unit, &context, plugin)?;
                        terminal.prepare(&self, &unit, &context, &mut terminal_state)?;

                        #[cfg(feature = "lint")]
                        let lint = self.prepare_lint(&unit, &context, lint);
                        plugin.process_before_syntax(&mut unit.program);
                        #[cfg(feature = "lint")]
                        self.run_lint(&unit, lint);

                        let mut transform = transform;
                        self.transform_syntax(&mut unit, &context, transform.as_mut());
                        plugin.process_after_syntax(&mut unit.program);
                        hooks.after_typescript(&self, &mut unit, &context)?;
                        self.transform_after_typescript(&mut unit, &context, transform);
                        self.minify(&mut unit, &context, minify);
                        self.finalize(&mut unit, &context, finalize)?;

                        Ok::<_, Error>(terminal_state)
                    })
            });
        let terminal_state = result?;

        Ok(terminal.finish(
            self.compiler,
            unit,
            context,
            terminal_state,
            helper_data,
            transform_output,
        ))
    }
}
