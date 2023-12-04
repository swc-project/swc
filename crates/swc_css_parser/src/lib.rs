#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(unused_must_use)]
#![deny(clippy::all)]
#![allow(clippy::needless_return)]
#![allow(clippy::nonminimal_bool)]
#![allow(clippy::wrong_self_convention)]

use swc_common::{comments::Comments, input::StringInput, SourceFile};

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
pub fn parse_file<'a, 'b, T>(
    fm: &'a SourceFile,
    comments: Option<&'b dyn Comments>,
    config: ParserConfig,
    errors: &mut Vec<Error>,
) -> PResult<T>
where
    Parser<Lexer<'b, StringInput<'a>>>: Parse<T>,
{
    parse_string_input(StringInput::from(fm), comments, config, errors)
}

/// Parse a given [StringInput] as `T`.
///
/// If there are syntax errors but if it was recoverable, it will be appended
/// to `errors`.
pub fn parse_string_input<'a, 'b, T>(
    input: StringInput<'a>,
    comments: Option<&'b dyn Comments>,
    config: ParserConfig,
    errors: &mut Vec<Error>,
) -> PResult<T>
where
    Parser<Lexer<'b, StringInput<'a>>>: Parse<T>,
{
    let lexer = Lexer::new(input, comments, config);
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
