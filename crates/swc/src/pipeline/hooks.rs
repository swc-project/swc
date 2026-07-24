use anyhow::Error;
use swc_ecma_ast::Program;

use super::{
    api::{PipelineContext, PipelineHooks},
    state::{CompilationUnit, PipelineContextData},
    Pipeline,
};

/// Invokes optional hooks at the public pipeline boundaries.
pub(super) trait HookDispatch {
    fn after_parse(
        &mut self,
        _pipeline: &Pipeline<'_>,
        _unit: &mut CompilationUnit,
        _context: &PipelineContextData,
    ) -> Result<(), Error> {
        Ok(())
    }

    fn after_resolve(
        &mut self,
        _pipeline: &Pipeline<'_>,
        _unit: &mut CompilationUnit,
        _context: &PipelineContextData,
    ) -> Result<(), Error> {
        Ok(())
    }

    fn after_typescript(
        &mut self,
        _pipeline: &Pipeline<'_>,
        _unit: &mut CompilationUnit,
        _context: &PipelineContextData,
    ) -> Result<(), Error> {
        Ok(())
    }
}

impl HookDispatch for () {}

impl<H> HookDispatch for H
where
    H: PipelineHooks,
{
    fn after_parse(
        &mut self,
        pipeline: &Pipeline<'_>,
        unit: &mut CompilationUnit,
        context: &PipelineContextData,
    ) -> Result<(), Error> {
        invoke_hook(pipeline, unit, context, |program, context| {
            self.inspect_after_parse(program, context)?;
            self.mutate_after_parse(program, context)
        })
    }

    fn after_resolve(
        &mut self,
        pipeline: &Pipeline<'_>,
        unit: &mut CompilationUnit,
        context: &PipelineContextData,
    ) -> Result<(), Error> {
        invoke_hook(pipeline, unit, context, |program, context| {
            self.inspect_after_resolve(program, context)?;
            self.mutate_after_resolve(program, context)
        })
    }

    fn after_typescript(
        &mut self,
        pipeline: &Pipeline<'_>,
        unit: &mut CompilationUnit,
        context: &PipelineContextData,
    ) -> Result<(), Error> {
        invoke_hook(pipeline, unit, context, |program, context| {
            self.inspect_after_typescript(program, context)?;
            self.mutate_after_typescript(program, context)
        })
    }
}

fn invoke_hook(
    pipeline: &Pipeline<'_>,
    unit: &mut CompilationUnit,
    stage_context: &PipelineContextData,
    hook: impl FnOnce(&mut Program, &PipelineContext<'_>) -> Result<(), Error>,
) -> Result<(), Error> {
    let CompilationUnit {
        source_file,
        program,
        comments,
        ..
    } = unit;
    let context = PipelineContext {
        source_map: &pipeline.compiler.cm,
        handler: pipeline.handler,
        comments,
        filename: &source_file.name,
        syntax: stage_context.syntax,
        target: stage_context.target,
        unresolved_mark: stage_context.unresolved_mark,
        top_level_mark: stage_context.top_level_mark,
    };

    hook(program, &context)
}
