use anyhow::Error;
use rustc_hash::FxHashMap;
use swc_ecma_transforms::helpers::HelperData;

use super::{
    preparation::PreparationOptions,
    state::{CompilationUnit, PipelineContextData},
    Pipeline, TransformedProgram,
};
use crate::{
    codegen::{CodegenInput, CodegenMetadata, CodegenOptions},
    Compiler,
};

/// Defines the output boundary selected before pipeline execution.
pub(super) trait PipelineTerminal {
    type State;
    type Output;

    fn resolve_state<F>(&self, resolve: F) -> Self::State
    where
        F: FnOnce() -> CodegenTerminalState;

    fn prepare(
        &self,
        _pipeline: &Pipeline<'_>,
        _unit: &CompilationUnit,
        _context: &PipelineContextData,
        _state: &mut Self::State,
    ) -> Result<(), Error> {
        Ok(())
    }

    fn finish(
        self,
        compiler: &Compiler,
        unit: CompilationUnit,
        context: PipelineContextData,
        state: Self::State,
        helper_data: HelperData,
        transform_output: FxHashMap<String, String>,
    ) -> Self::Output;
}

/// Emit configuration and metadata for the code-generation terminal.
pub(super) struct CodegenTerminalState {
    pub(super) preparation: PreparationOptions,
    pub(super) codegen: CodegenOptions,
    pub(super) metadata: CodegenMetadata,
}

pub(super) struct ProgramTerminal;

impl PipelineTerminal for ProgramTerminal {
    type Output = TransformedProgram;
    type State = ();

    fn resolve_state<F>(&self, _resolve: F)
    where
        F: FnOnce() -> CodegenTerminalState,
    {
    }

    fn finish(
        self,
        _compiler: &Compiler,
        unit: CompilationUnit,
        _context: PipelineContextData,
        _state: (),
        helper_data: HelperData,
        _transform_output: FxHashMap<String, String>,
    ) -> TransformedProgram {
        TransformedProgram::new(unit.program, unit.comments, helper_data)
    }
}

pub(super) struct CodegenTerminal;

impl PipelineTerminal for CodegenTerminal {
    type Output = CodegenInput;
    type State = CodegenTerminalState;

    fn resolve_state<F>(&self, resolve: F) -> CodegenTerminalState
    where
        F: FnOnce() -> CodegenTerminalState,
    {
        resolve()
    }

    fn prepare(
        &self,
        pipeline: &Pipeline<'_>,
        unit: &CompilationUnit,
        context: &PipelineContextData,
        state: &mut CodegenTerminalState,
    ) -> Result<(), Error> {
        state.metadata = pipeline.prepare_codegen_metadata(unit, &state.preparation)?;
        pipeline.emit_isolated_declarations(unit, context, &state.preparation);
        Ok(())
    }

    fn finish(
        self,
        compiler: &Compiler,
        unit: CompilationUnit,
        context: PipelineContextData,
        state: CodegenTerminalState,
        _helper_data: HelperData,
        transform_output: FxHashMap<String, String>,
    ) -> CodegenInput {
        let CodegenTerminalState {
            codegen: options,
            metadata,
            ..
        } = state;

        CodegenInput {
            source_map: compiler.cm.clone(),
            program: unit.program,
            comments: unit.comments,
            metadata,
            transform_output,
            target: context.target,
            options,
        }
    }
}
