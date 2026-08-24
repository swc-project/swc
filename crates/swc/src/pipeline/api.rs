use std::sync::Arc;

use anyhow::Error;
use swc_common::{
    comments::SingleThreadedComments, errors::Handler, FileName, Mark, SourceFile, SourceMap,
};
use swc_compiler_base::TransformOutput;
use swc_ecma_ast::{EsVersion, Program};
use swc_ecma_parser::Syntax;
use swc_ecma_transforms::helpers::HelperData;

use super::{
    hooks::HookDispatch,
    terminal::{CodegenTerminal, PipelineTerminal, ProgramTerminal},
    Pipeline,
};
use crate::{config::Options, Compiler};

/// Input to [`crate::Compiler::compile`].
///
/// A pre-parsed program, its spans, and any supplied comments must match the
/// source file registered in the [`crate::Compiler`]'s source map.
pub struct CompileInput {
    pub(super) source_file: Arc<SourceFile>,
    pub(super) program: Option<Program>,
    pub(super) comments: Option<SingleThreadedComments>,
}

impl CompileInput {
    /// Creates input that will be parsed by the pipeline.
    pub fn source(file: Arc<SourceFile>) -> Self {
        Self {
            source_file: file,
            program: None,
            comments: None,
        }
    }

    /// Creates input from an already parsed program.
    ///
    /// The supplied [`Program`] variant is not reparsed or reclassified. The
    /// resolved syntax and other options still control later transforms.
    ///
    /// Supply its parser comment storage with [`CompileInput::with_comments`].
    pub fn program(file: Arc<SourceFile>, program: Program) -> Self {
        Self {
            source_file: file,
            program: Some(program),
            comments: None,
        }
    }

    /// Uses the supplied comment storage throughout transformation and, for a
    /// codegen terminal, emit.
    pub fn with_comments(mut self, comments: SingleThreadedComments) -> Self {
        self.comments = Some(comments);
        self
    }
}

/// A lazily executed request for the direct compilation pipeline.
///
/// Creating a request does not resolve configuration, parse input, invoke
/// hooks, or transform the program. One of its terminal methods must be called
/// to perform compilation.
#[must_use = "a CompileRequest does nothing until a terminal method is called"]
pub struct CompileRequest<'a, H = ()> {
    compiler: &'a Compiler,
    handler: &'a Handler,
    input: CompileInput,
    options: &'a Options,
    hooks: H,
}

impl<'a> CompileRequest<'a> {
    pub(crate) fn new(
        compiler: &'a Compiler,
        handler: &'a Handler,
        input: CompileInput,
        options: &'a Options,
    ) -> Self {
        Self {
            compiler,
            handler,
            input,
            options,
            hooks: (),
        }
    }

    /// Attaches hooks that will run when a terminal method executes the
    /// request.
    pub fn with_hooks<H: PipelineHooks>(self, hooks: H) -> CompileRequest<'a, H> {
        CompileRequest {
            compiler: self.compiler,
            handler: self.handler,
            input: self.input,
            options: self.options,
            hooks,
        }
    }

    /// Executes the pipeline and generates source code.
    #[cfg_attr(
        debug_assertions,
        tracing::instrument(target = "swc::pipeline", skip_all)
    )]
    pub fn codegen(self) -> Result<TransformOutput, Error> {
        codegen(self)
    }

    /// Executes the AST pipeline without emit-only preparation or codegen.
    #[cfg_attr(
        debug_assertions,
        tracing::instrument(target = "swc::pipeline", skip_all)
    )]
    pub fn transform(self) -> Result<TransformedProgram, Error> {
        transform(self)
    }

    /// Executes the complete AST pipeline and returns only the transformed
    /// program.
    ///
    /// This discards final comments and recorded helper requirements. Use
    /// [`CompileRequest::transform`] to retain them.
    pub fn into_program(self) -> Result<Program, Error> {
        self.transform().map(TransformedProgram::into_program)
    }
}

impl<'a, H> CompileRequest<'a, H>
where
    H: PipelineHooks,
{
    /// Executes the pipeline with hooks and generates source code.
    #[cfg_attr(
        debug_assertions,
        tracing::instrument(target = "swc::pipeline", skip_all)
    )]
    pub fn codegen(self) -> Result<TransformOutput, Error> {
        codegen(self)
    }

    /// Executes the AST pipeline with hooks, without emit-only preparation or
    /// codegen.
    #[cfg_attr(
        debug_assertions,
        tracing::instrument(target = "swc::pipeline", skip_all)
    )]
    pub fn transform(self) -> Result<TransformedProgram, Error> {
        transform(self)
    }

    /// Executes the complete AST pipeline with hooks and returns only the
    /// transformed program.
    ///
    /// This discards final comments and recorded helper requirements. Use
    /// [`CompileRequest::transform`] to retain them.
    pub fn into_program(self) -> Result<Program, Error> {
        self.transform().map(TransformedProgram::into_program)
    }
}

fn execute<H, T>(request: CompileRequest<'_, H>, terminal: T) -> Result<T::Output, Error>
where
    H: HookDispatch,
    T: PipelineTerminal,
{
    let CompileRequest {
        compiler,
        handler,
        input,
        options,
        mut hooks,
    } = request;

    compiler
        .run(|| Pipeline::new(compiler, handler).transform(input, options, &mut hooks, terminal))
}

fn codegen<H>(request: CompileRequest<'_, H>) -> Result<TransformOutput, Error>
where
    H: HookDispatch,
{
    execute(request, CodegenTerminal)?.codegen()
}

fn transform<H>(request: CompileRequest<'_, H>) -> Result<TransformedProgram, Error>
where
    H: HookDispatch,
{
    execute(request, ProgramTerminal)
}

/// A program produced by the AST-only terminal of [`CompileRequest`].
///
/// This retains final comments and helper requirements. AST-only terminals
/// skip emit preparation, so this type does not provide code generation. Choose
/// [`CompileRequest::codegen`] as the request terminal when emitted output is
/// required.
pub struct TransformedProgram {
    program: Program,
    comments: SingleThreadedComments,
    helper_data: HelperData,
}

impl TransformedProgram {
    pub(super) fn new(
        program: Program,
        comments: SingleThreadedComments,
        helper_data: HelperData,
    ) -> Self {
        Self {
            program,
            comments,
            helper_data,
        }
    }

    /// Returns the transformed program.
    pub fn program(&self) -> &Program {
        &self.program
    }

    /// Returns comments after the pipeline's final comment policy.
    pub fn comments(&self) -> &SingleThreadedComments {
        &self.comments
    }

    /// Returns the helper requirements recorded while transforming the
    /// program.
    ///
    /// This is primarily useful with [`Options::skip_helper_injection`], when
    /// a later bundling or helper-injection phase must consume the
    /// requirements.
    pub fn helper_data(&self) -> HelperData {
        self.helper_data
    }

    /// Returns `(program, comments, helper requirements)`.
    pub fn into_parts(self) -> (Program, SingleThreadedComments, HelperData) {
        (self.program, self.comments, self.helper_data)
    }

    /// Consumes this result and returns the transformed program, discarding
    /// its comments and helper requirements.
    pub fn into_program(self) -> Program {
        self.program
    }
}

/// Borrowed compilation context supplied to pipeline hooks.
pub struct PipelineContext<'a> {
    pub(super) source_map: &'a SourceMap,
    pub(super) handler: &'a Handler,
    pub(super) comments: &'a SingleThreadedComments,
    pub(super) filename: &'a FileName,
    pub(super) syntax: Syntax,
    pub(super) target: EsVersion,
    pub(super) unresolved_mark: Mark,
    pub(super) top_level_mark: Mark,
}

impl PipelineContext<'_> {
    /// Returns the compiler source map.
    pub fn source_map(&self) -> &SourceMap {
        self.source_map
    }

    /// Returns the diagnostic handler for this compilation.
    pub fn handler(&self) -> &Handler {
        self.handler
    }

    /// Returns the compilation's comment storage.
    pub fn comments(&self) -> &SingleThreadedComments {
        self.comments
    }

    /// Returns the input filename.
    pub fn filename(&self) -> &FileName {
        self.filename
    }

    /// Returns the resolved syntax configuration.
    pub fn syntax(&self) -> Syntax {
        self.syntax
    }

    /// Returns the resolved output target.
    pub fn target(&self) -> EsVersion {
        self.target
    }

    /// Returns the mark used for unresolved identifiers.
    ///
    /// The mark has not been applied yet when the after-parse hooks run.
    pub fn unresolved_mark(&self) -> Mark {
        self.unresolved_mark
    }

    /// Returns the mark used for top-level bindings.
    ///
    /// The mark has not been applied yet when the after-parse hooks run.
    pub fn top_level_mark(&self) -> Mark {
        self.top_level_mark
    }
}

/// Inspection and mutation callbacks for the direct compiler pipeline.
///
/// Hooks run only when a [`CompileRequest`] terminal executes. At each stage,
/// the inspection callback runs before its paired mutation callback. If
/// inspection returns an error, the paired mutation and all later hooks are
/// skipped.
pub trait PipelineHooks {
    /// Inspects the parsed or supplied program before React Compiler and the
    /// initial resolver.
    fn inspect_after_parse(
        &mut self,
        _program: &Program,
        _context: &PipelineContext<'_>,
    ) -> Result<(), Error> {
        Ok(())
    }

    /// Mutates the parsed or supplied program before React Compiler and the
    /// initial resolver.
    fn mutate_after_parse(
        &mut self,
        _program: &mut Program,
        _context: &PipelineContext<'_>,
    ) -> Result<(), Error> {
        Ok(())
    }

    /// Inspects the program after React Compiler and the initial resolver,
    /// before codegen-only preparation, plugins, linting, and syntax
    /// transforms.
    fn inspect_after_resolve(
        &mut self,
        _program: &Program,
        _context: &PipelineContext<'_>,
    ) -> Result<(), Error> {
        Ok(())
    }

    /// Mutates the program after React Compiler and the initial resolver,
    /// before codegen-only preparation, plugins, linting, and syntax
    /// transforms.
    ///
    /// Bindings introduced here are not processed by the initial resolver.
    fn mutate_after_resolve(
        &mut self,
        _program: &mut Program,
        _context: &PipelineContext<'_>,
    ) -> Result<(), Error> {
        Ok(())
    }

    /// Inspects the program after the early syntax stage and runtime-plugin
    /// checkpoint, but before React, optimization, compatibility, and module
    /// transforms.
    ///
    /// This boundary is reached for JavaScript, TypeScript, and Flow. With
    /// built-ins enabled, the early syntax stage and type stripping are
    /// complete.
    fn inspect_after_typescript(
        &mut self,
        _program: &Program,
        _context: &PipelineContext<'_>,
    ) -> Result<(), Error> {
        Ok(())
    }

    /// Mutates the program after the early syntax stage and runtime-plugin
    /// checkpoint, but before React, optimization, compatibility, and module
    /// transforms.
    ///
    /// This boundary is reached for JavaScript, TypeScript, and Flow. With
    /// built-ins enabled, the early syntax stage and type stripping are
    /// complete.
    ///
    /// Bindings introduced here are not processed by the initial resolver;
    /// callers must assign any syntax contexts required by later transforms.
    fn mutate_after_typescript(
        &mut self,
        _program: &mut Program,
        _context: &PipelineContext<'_>,
    ) -> Result<(), Error> {
        Ok(())
    }
}

impl<T> PipelineHooks for &mut T
where
    T: PipelineHooks + ?Sized,
{
    fn inspect_after_parse(
        &mut self,
        program: &Program,
        context: &PipelineContext<'_>,
    ) -> Result<(), Error> {
        (**self).inspect_after_parse(program, context)
    }

    fn mutate_after_parse(
        &mut self,
        program: &mut Program,
        context: &PipelineContext<'_>,
    ) -> Result<(), Error> {
        (**self).mutate_after_parse(program, context)
    }

    fn inspect_after_resolve(
        &mut self,
        program: &Program,
        context: &PipelineContext<'_>,
    ) -> Result<(), Error> {
        (**self).inspect_after_resolve(program, context)
    }

    fn mutate_after_resolve(
        &mut self,
        program: &mut Program,
        context: &PipelineContext<'_>,
    ) -> Result<(), Error> {
        (**self).mutate_after_resolve(program, context)
    }

    fn inspect_after_typescript(
        &mut self,
        program: &Program,
        context: &PipelineContext<'_>,
    ) -> Result<(), Error> {
        (**self).inspect_after_typescript(program, context)
    }

    fn mutate_after_typescript(
        &mut self,
        program: &mut Program,
        context: &PipelineContext<'_>,
    ) -> Result<(), Error> {
        (**self).mutate_after_typescript(program, context)
    }
}
