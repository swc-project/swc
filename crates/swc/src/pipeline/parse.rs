use anyhow::Error;

use super::{api::CompileInput, options::PipelineConfig, state::CompilationUnit, Pipeline};

impl Pipeline<'_> {
    /// Parses source input or accepts an already parsed program unchanged.
    pub(super) fn parse(
        &self,
        input: CompileInput,
        config: &PipelineConfig,
    ) -> Result<CompilationUnit, Error> {
        let CompileInput {
            source_file,
            program,
            comments,
        } = input;
        let comments = comments.unwrap_or_default();
        let is_module = config.config.is_module.unwrap_or_default();

        let (program, flow_strip_script_like_module) = match program {
            Some(program) => (program, false),
            None => self.compiler.parse_js_as_transform_input(
                source_file.clone(),
                self.handler,
                config.context.target,
                config.context.syntax,
                is_module,
                Some(&comments),
            )?,
        };

        Ok(CompilationUnit {
            source_file,
            program,
            comments,
            flow_strip_script_like_module,
        })
    }
}
