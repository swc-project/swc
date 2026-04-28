use anyhow::{anyhow, bail, Result};
use swc_common::{errors::Handler, SourceFile};
use swc_ecma_ast::{EsVersion, Program};
use swc_ecma_parser::{parse_file_as_program, Syntax, TsSyntax};

/// Parses a source file as JavaScript, TypeScript, or TSX and returns the SWC
/// program tree. Recovered parser errors are treated as fatal so the CLI does
/// not print partial ASTs for invalid input.
pub fn parse_source(file: &SourceFile, handler: &Handler) -> Result<Program> {
    let syntax = Syntax::Typescript(TsSyntax {
        tsx: true,
        ..Default::default()
    });
    let mut errors = Vec::new();
    let program = parse_file_as_program(file, syntax, EsVersion::latest(), None, &mut errors)
        .map_err(|err| {
            err.into_diagnostic(handler).emit();
            anyhow!("Syntax Error")
        })?;

    let mut has_recovered_error = false;
    for err in errors {
        err.into_diagnostic(handler).emit();
        has_recovered_error = true;
    }

    if has_recovered_error {
        bail!("Syntax Error");
    }

    Ok(program)
}
