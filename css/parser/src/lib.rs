#![deny(unused_must_use)]

use lexer::Lexer;
use parser::{input::TokensInput, PResult, Parser, ParserConfig};
use swc_common::{input::StringInput, BytePos, SourceFile};
use swc_css_ast::Tokens;

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

/// Parse a given file as `T`.
pub fn parse_file<'a, T>(fm: &'a SourceFile, config: ParserConfig) -> PResult<T>
where
    Parser<Lexer<StringInput<'a>>>: Parse<T>,
{
    let lexer = Lexer::new(StringInput::from(fm));
    let mut parser = Parser::new(lexer, config);

    parser.parse()
}

/// Parse a given file as `T`.
pub fn parse_tokens<'a, T>(tokens: &'a Tokens, config: ParserConfig) -> PResult<T>
where
    Parser<TokensInput<'a>>: Parse<T>,
{
    let lexer = TokensInput::new(tokens);
    let mut parser = Parser::new(lexer, config);

    parser.parse()
}
