#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(unused_must_use)]
#![deny(clippy::all)]
#![allow(clippy::needless_return)]
#![allow(clippy::nonminimal_bool)]
#![allow(clippy::wrong_self_convention)]

use swc_common::{input::StringInput, SourceFile};
use swc_xml_ast::Document;

use crate::{
    error::Error,
    lexer::Lexer,
    parser::{PResult, Parser, ParserConfig},
};

#[macro_use]
mod macros;
pub mod error;
pub mod lexer;
pub mod parser;

/// Parse a given file as `Document`.
///
/// If there are syntax errors but if it was recoverable, it will be appended to
/// `errors`.
pub fn parse_file_as_document(
    fm: &SourceFile,
    config: ParserConfig,
    errors: &mut Vec<Error>,
) -> PResult<Document> {
    let lexer = Lexer::new(StringInput::from(fm));
    let mut parser = Parser::new(lexer, config);
    let result = parser.parse_document();

    errors.extend(parser.take_errors());

    result
}
