pub use self::error::{Error, SyntaxError};
use lexer::Lexer;
pub use parser::{PResult, Parser};
use swc_common::BytePos;
use swc_css_ast::Stylesheet;

#[macro_use]
mod macros;
mod error;
mod lexer;
mod parser;
mod token;

pub fn parse(start_pos: BytePos, src: &str) -> PResult<Stylesheet> {
    let lexer = Lexer::new(start_pos, src);
    let mut parser = Parser::new(lexer);

    parser.parse()
}
