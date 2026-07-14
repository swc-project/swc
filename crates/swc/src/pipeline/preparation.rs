#[cfg(feature = "isolated-dts")]
use std::{cell::RefCell, rc::Rc};

use anyhow::Error;
#[cfg(feature = "isolated-dts")]
use swc_common::comments::SingleThreadedComments;
use swc_common::{comments::Comments, Spanned};
#[cfg(feature = "isolated-dts")]
use swc_ecma_codegen::to_code_with_comments;
use swc_ecma_parser::Syntax;
#[cfg(all(feature = "isolated-dts", feature = "module"))]
use swc_ecma_transforms_module::rewriter::import_rewriter;
use swc_ecma_visit::VisitWith;
#[cfg(feature = "isolated-dts")]
use swc_typescript::fast_dts::FastDts;

#[cfg(all(feature = "isolated-dts", feature = "module"))]
use super::state::ModuleResolver;
use super::{
    state::{CompilationUnit, PipelineContextData},
    Pipeline,
};
use crate::{codegen::CodegenMetadata, config::InputSourceMap};

/// Configuration for emit-only work after resolver hooks and before runtime
/// plugins and built-in transforms.
pub(super) struct PreparationOptions {
    pub(super) input_source_map: Option<InputSourceMap>,
    pub(super) emit_isolated_dts: bool,
    #[cfg(all(feature = "isolated-dts", feature = "module"))]
    pub(super) module_resolver: ModuleResolver,
}

impl Pipeline<'_> {
    /// Captures source-map metadata before runtime plugins and built-ins run.
    pub(super) fn prepare_codegen_metadata(
        &self,
        unit: &CompilationUnit,
        options: &PreparationOptions,
    ) -> Result<CodegenMetadata, Error> {
        let Some(input_source_map) = &options.input_source_map else {
            return Ok(CodegenMetadata::default());
        };
        let trailing_comments = unit
            .comments
            .get_trailing(unit.program.span_hi())
            .unwrap_or_default();
        let original_source_map = self.compiler.get_orig_src_map(
            &unit.source_file,
            input_source_map,
            &trailing_comments,
            false,
        )?;
        let mut collector = swc_compiler_base::IdentCollector {
            names: Default::default(),
        };
        unit.program.visit_with(&mut collector);

        Ok(CodegenMetadata {
            source_map_names: collector.names,
            original_source_map,
        })
    }

    /// Emits isolated declarations before runtime plugins and built-ins run.
    pub(super) fn emit_isolated_declarations(
        &self,
        _unit: &CompilationUnit,
        context: &PipelineContextData,
        options: &PreparationOptions,
    ) {
        let is_typescript_syntax = matches!(context.syntax, Syntax::Typescript(..));

        if options.emit_isolated_dts && !is_typescript_syntax {
            self.handler.warn(
                "jsc.experimental.emitIsolatedDts is enabled but the syntax is not TypeScript",
            );
        }

        #[cfg(feature = "isolated-dts")]
        if is_typescript_syntax && options.emit_isolated_dts {
            let (leading, trailing) = _unit.comments.borrow_all();
            let leading = Rc::new(RefCell::new(leading.clone()));
            let trailing = Rc::new(RefCell::new(trailing.clone()));
            let comments = SingleThreadedComments::from_leading_and_trailing(leading, trailing);

            let mut checker = FastDts::new(
                _unit.source_file.name.clone(),
                context.unresolved_mark,
                Default::default(),
            );
            let mut program = _unit.program.clone();

            #[cfg(feature = "module")]
            if let Some((base, resolver)) = &options.module_resolver {
                program.mutate(import_rewriter(base.clone(), resolver.clone()));
            }

            let issues = checker.transform(&mut program);
            for issue in issues {
                self.handler
                    .struct_span_err(issue.range.span, &issue.message)
                    .emit();
            }

            let dts_code = to_code_with_comments(Some(&comments), &program);
            swc_transform_common::output::experimental_emit(
                "__swc_isolated_declarations__".into(),
                dts_code,
            );
        }
    }
}
