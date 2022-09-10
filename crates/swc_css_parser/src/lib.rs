#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(unused_must_use)]
#![deny(clippy::all)]
#![allow(clippy::needless_return)]
#![allow(clippy::nonminimal_bool)]
#![allow(clippy::wrong_self_convention)]

use swc_common::{comments::Comments, input::StringInput, BytePos, SourceFile};
use swc_css_ast::Tokens;

use crate::{
    error::Error,
    lexer::Lexer,
    parser::{input::TokensInput, PResult, Parser, ParserConfig},
};

#[macro_use]
mod macros;
pub mod error;
pub mod lexer;
pub mod parser;
#[cfg(test)]
mod tests;

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

/// Parse a given string as `T`.
///
/// If there are syntax errors but if it was recoverable, it will be appended
/// to `errors`.
pub fn parse_str<'a, T>(
    src: &'a str,
    start_pos: BytePos,
    end_pos: BytePos,
    config: ParserConfig,
    comments: Option<&'a dyn Comments>,
    errors: &mut Vec<Error>,
) -> PResult<T>
where
    Parser<Lexer<'a, StringInput<'a>>>: Parse<T>,
{
    let lexer = Lexer::new(StringInput::new(src, start_pos, end_pos), config, comments);
    let mut parser = Parser::new(lexer, config);
    let res = parser.parse();

    errors.extend(parser.take_errors());

    res
}

/// Parse a given file as `T`.
///
/// If there are syntax errors but if it was recoverable, it will be appended
/// to `errors`.
pub fn parse_file<'a, T>(
    fm: &'a SourceFile,
    config: ParserConfig,
    comments: Option<&'a dyn Comments>,
    errors: &mut Vec<Error>,
) -> PResult<T>
where
    Parser<Lexer<'a, StringInput<'a>>>: Parse<T>,
{
    let lexer = Lexer::new(StringInput::from(fm), config, comments);
    let mut parser = Parser::new(lexer, config);
    let res = parser.parse();

    errors.extend(parser.take_errors());

    res
}

/// Parse a given file as `T`.
///
/// If there are syntax errors but if it was recoverable, it will be appended
/// to `errors`.
pub fn parse_tokens<'a, T>(
    tokens: &'a Tokens,
    config: ParserConfig,
    errors: &mut Vec<Error>,
) -> PResult<T>
where
    Parser<TokensInput<'a>>: Parse<T>,
{
    let lexer = TokensInput::new(tokens);
    let mut parser = Parser::new(lexer, config);
    let res = parser.parse();

    errors.extend(parser.take_errors());

    res
}
