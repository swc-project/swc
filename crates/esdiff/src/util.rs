use anyhow::{anyhow, Result};
use swc_common::{input::SourceFileInput, SourceFile};
use swc_ecma_ast::{EsVersion, Module};
use swc_ecma_parser::{lexer::Lexer, Parser};
use swc_ecma_utils::HANDLER;

pub(crate) fn parse(fm: &SourceFile) -> Result<Module> {
    let lexer = Lexer::new(
        Default::default(),
        EsVersion::latest(),
        SourceFileInput::from(fm),
        None,
    );

    let mut parser = Parser::new_from(lexer);

    parser.parse_module().map_err(|err| {
        HANDLER.with(|handler| {
            err.into_diagnostic(&handler).emit();
        });

        anyhow!("failed to parse module")
    })
}
