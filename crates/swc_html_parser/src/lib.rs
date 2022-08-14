#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(unused_must_use)]
#![deny(clippy::all)]
#![allow(clippy::needless_return)]
#![allow(clippy::nonminimal_bool)]
#![allow(clippy::wrong_self_convention)]
#![allow(clippy::match_like_matches_macro)]

use swc_common::{input::StringInput, SourceFile};
use swc_html_ast::{Document, DocumentFragment, DocumentMode, Element};

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

/// Parse a given file as `DocumentFragment`.
///
/// If there are syntax errors but if it was recoverable, it will be appended to
/// `errors`.
pub fn parse_file_as_document_fragment(
    fm: &SourceFile,
    context_element: &Element,
    mode: DocumentMode,
    form_element: Option<&Element>,
    config: ParserConfig,
    errors: &mut Vec<Error>,
) -> PResult<DocumentFragment> {
    let lexer = Lexer::new(StringInput::from(fm));
    let mut parser = Parser::new(lexer, config);
    let result =
        parser.parse_document_fragment(context_element.clone(), mode, form_element.cloned());

    errors.extend(parser.take_errors());

    result
}
