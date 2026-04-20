use swc_common::{comments::Comments, input::SourceFileInput, SourceFile};
use swc_ecma_ast::EsVersion;

use crate::{error::Error, lexer::Lexer, parser::PResult, Parser, Syntax};

/// Canonical parser runtime used by all public entrypoints.
pub(crate) type FastLexer<'a> = Lexer<'a>;
pub(crate) type FastParserCore<'a> = Parser<FastLexer<'a>>;

pub(crate) fn with_file_parser<T>(
    fm: &SourceFile,
    syntax: Syntax,
    target: EsVersion,
    comments: Option<&dyn Comments>,
    recovered_errors: &mut Vec<Error>,
    op: impl for<'aa> FnOnce(&mut FastParserCore<'aa>) -> PResult<T>,
) -> PResult<T> {
    let lexer = FastLexer::new(syntax, target, SourceFileInput::from(fm), comments);
    let mut parser = FastParserCore::new_from(lexer);
    let ret = op(&mut parser);

    recovered_errors.append(&mut parser.take_errors());

    ret
}
