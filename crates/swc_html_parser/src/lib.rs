#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(unused_must_use)]
#![deny(clippy::all)]
#![allow(clippy::needless_return)]
#![allow(clippy::nonminimal_bool)]
#![allow(clippy::wrong_self_convention)]

use swc_common::{input::StringInput, SourceFile};
use swc_html_ast::{Document, DocumentFragment, Element};

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

pub trait Parse<T> {
    fn parse(&mut self) -> PResult<T>;
}

impl<T, P> Parse<Box<T>> for P
where
    Self: Parse<T>,
{
    fn parse(&mut self) -> PResult<Box<T>> {
        self.parse().map(Box::new)
    }
}

/// Parse a given file as `T`.
///
/// If there are syntax errors but if it was recoverable, it will be appended to
/// `errors`.
pub fn parse_file_as<'a, T>(
    fm: &'a SourceFile,
    config: ParserConfig,
    errors: &mut Vec<Error>,
) -> PResult<T>
where
    Parser<Lexer<StringInput<'a>>>: Parse<T>,
{
    let lexer = Lexer::new(StringInput::from(fm), config);
    let mut parser = Parser::new(lexer, config);
    let result = parser.parse();

    errors.extend(parser.take_errors());

    result
}

/// Parse a given file as `Document`.
///
/// If there are syntax errors but if it was recoverable, it will be appended to
/// `errors`.
pub fn parse_file_as_document(
    fm: &SourceFile,
    config: ParserConfig,
    errors: &mut Vec<Error>,
) -> PResult<Document> {
    let lexer = Lexer::new(StringInput::from(fm), config);
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
    context_element: Element,
    config: ParserConfig,
    errors: &mut Vec<Error>,
) -> PResult<DocumentFragment> {
    let lexer = Lexer::new(StringInput::from(fm), config);
    let mut parser = Parser::new(lexer, config);
    let result = parser.parse_document_fragment(context_element);

    errors.extend(parser.take_errors());

    result
}
