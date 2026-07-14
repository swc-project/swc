#[cfg(feature = "react-compiler")]
use swc_common::Spanned;
use swc_ecma_transforms::resolver;
use swc_ecma_visit::VisitMutWith;

use super::{options::PipelineConfig, state::CompilationUnit, Pipeline};
#[cfg(feature = "react-compiler")]
use crate::config::{emit_react_compiler_diagnostics, react_compiler_options};

impl Pipeline<'_> {
    /// Applies React Compiler before SWC assigns resolver contexts.
    pub(super) fn run_react_compiler(&self, unit: &mut CompilationUnit, config: &PipelineConfig) {
        #[cfg(not(feature = "react-compiler"))]
        let _ = unit;

        #[cfg(feature = "react-compiler")]
        if let Some(options) = react_compiler_options(
            config
                .config
                .jsc
                .transform
                .as_ref()
                .map(|transform| transform.react_compiler.clone())
                .unwrap_or_default(),
            &unit.source_file.name,
        ) {
            let source_file = if unit.program.span().is_dummy() {
                self.compiler.cm.get_source_file(&unit.source_file.name)
            } else {
                self.compiler
                    .cm
                    .try_lookup_byte_offset(unit.program.span().lo)
                    .ok()
                    .map(|source| source.sf)
            };

            if let Some(source_file) = source_file {
                let source_type = swc_ecma_react_compiler::SourceType::from_program(&unit.program)
                    .with_typescript(config.context.syntax.typescript());
                let result = swc_ecma_react_compiler::transform(
                    &unit.program,
                    source_type,
                    &source_file.src,
                    Some(&unit.comments),
                    options,
                );
                emit_react_compiler_diagnostics(self.handler, &result.diagnostics);

                if let Some(program) = result.program {
                    unit.program = program;
                }
            } else {
                self.handler
                    .struct_warn("React Compiler is enabled, but the source text is unavailable")
                    .emit();
            }
        }

        #[cfg(not(feature = "react-compiler"))]
        if config
            .config
            .jsc
            .transform
            .as_ref()
            .is_some_and(|transform| {
                transform.react_compiler.is_true() || transform.react_compiler.is_obj()
            })
        {
            self.handler
                .struct_warn(
                    "React Compiler is configured, but swc was built without the `react-compiler` \
                     feature",
                )
                .emit();
        }
    }

    /// Assigns the initial syntax contexts consumed by later stages.
    pub(super) fn run_resolver(&self, unit: &mut CompilationUnit, config: &PipelineConfig) {
        unit.program.visit_mut_with(&mut resolver(
            config.context.unresolved_mark,
            config.context.top_level_mark,
            config.context.syntax.typescript(),
        ));
    }
}
