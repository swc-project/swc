#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(unused_must_use)]
#![deny(clippy::all)]
#![allow(clippy::needless_return)]
#![allow(clippy::nonminimal_bool)]
#![allow(clippy::wrong_self_convention)]

use swc_common::{input::StringInput, SourceFile};

use crate::{
    error::Error,
    lexer::Lexer,
    parser::{
        input::{Input, InputType},
        PResult, Parser, ParserConfig,
    },
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

/// Parse a given file as `T`.
///
/// If there are syntax errors but if it was recoverable, it will be appended
/// to `errors`.
pub fn parse_file<'a, T>(
    fm: &'a SourceFile,
    config: ParserConfig,
    errors: &mut Vec<Error>,
) -> PResult<T>
where
    Parser<Lexer<StringInput<'a>>>: Parse<T>,
{
    parse_string_input(StringInput::from(fm), config, errors)
}

/// Parse a given [StringInput] as `T`.
///
/// If there are syntax errors but if it was recoverable, it will be appended
/// to `errors`.
pub fn parse_string_input<'a, T>(
    input: StringInput<'a>,
    config: ParserConfig,
    errors: &mut Vec<Error>,
) -> PResult<T>
where
    Parser<Lexer<StringInput<'a>>>: Parse<T>,
{
    let lexer = Lexer::new(input, config);
    let mut parser = Parser::new(lexer, config);

    let res = parser.parse();

    errors.extend(parser.take_errors());

    res
}

/// Parse a given file as `T`.
///
/// If there are syntax errors but if it was recoverable, it will be appended
/// to `errors`.
pub fn parse_input<'a, T>(
    input: InputType<'a>,
    config: ParserConfig,
    errors: &mut Vec<Error>,
) -> PResult<T>
where
    Parser<Input<'a>>: Parse<T>,
{
    let lexer = Input::new(input);
    let mut parser = Parser::new(lexer, config);

    let res = parser.parse();

    errors.extend(parser.take_errors());

    res
}
