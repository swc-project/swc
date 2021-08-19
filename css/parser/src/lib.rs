#![deny(unused_must_use)]

use lexer::Lexer;
use parser::{PResult, Parser, ParserConfig};
use swc_common::{input::StringInput, BytePos, SourceFile};

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

pub fn parse_str<'a, T>(
    src: &'a str,
    start_pos: BytePos,
    end_pos: BytePos,
    config: ParserConfig,
) -> PResult<T>
where
    Parser<Lexer<StringInput<'a>>>: Parse<T>,
{
    let lexer = Lexer::new(StringInput::new(src, start_pos, end_pos));
    let mut parser = Parser::new(lexer, config);

    parser.parse()
}

pub fn parse_file<'a, T>(fm: &'a SourceFile, config: ParserConfig) -> PResult<T>
where
    Parser<Lexer<StringInput<'a>>>: Parse<T>,
{
    let lexer = Lexer::new(StringInput::from(fm));
    let mut parser = Parser::new(lexer, config);

    parser.parse()
}
