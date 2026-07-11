use anyhow::{bail, Result};
use swc_common::{errors::Handler, SourceFile};
use swc_ecma_ast::{EsVersion, Program};
use swc_ecma_parser::{ModuleKind, Parser, SourceType, Syntax, TsSyntax};

/// Parses a source file as JavaScript, TypeScript, or TSX and returns the SWC
/// program tree. Recovered parser errors are treated as fatal so the CLI does
/// not print partial ASTs for invalid input.
pub fn parse_source(file: &SourceFile, handler: &Handler) -> Result<Program> {
    let syntax = Syntax::Typescript(TsSyntax {
        tsx: true,
        ..Default::default()
    });
    let (source_type, options) =
        SourceType::from_legacy(syntax, ModuleKind::Unambiguous, EsVersion::latest());
    let parsed = Parser::new(&file.src, source_type)
        .with_options(options)
        .with_start_pos(file.start_pos)
        .parse();

    let has_errors = !parsed.diagnostics.is_empty();
    for err in parsed.diagnostics {
        err.into_diagnostic(handler).emit();
    }

    if parsed.panicked || has_errors {
        bail!("Syntax Error");
    }

    Ok(parsed.program)
}
