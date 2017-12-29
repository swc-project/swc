pub use self::input::Input;
use self::input::ParserInput;
use ast::*;
use swc_common::{Span, Spanned};
use token::*;

#[macro_use]
mod macros;
mod expr;
mod ident;
mod module;
pub mod input;

#[derive(Debug, Copy, Clone)]
struct Context {
    /// Is in strict mode?
    strict: bool,
    /// If true await expression will be parsed, and "await" will be treated as
    /// a keyword.
    is_in_async_fn: bool,
    /// If true yield expression will be parsed, and "yield" will be treated as
    /// a keyword.
    is_in_generator: bool,
}

pub type PResult<T> = Result<T, Error>;

#[derive(Debug)]
pub enum Error {
    /// From<NoneError> is not implemented to prevent mistake.
    Eof,
    ExpectedIdent,
    Syntax(SyntaxError),
}

#[derive(Debug)]
pub enum SyntaxError {

}

pub struct Parser<I: Input> {
    ctx: Context,
    i: ParserInput<I>,
}

impl<I: Input> Parser<I> {
    fn spanned<F, Node, Sp>(&mut self, parse: F) -> PResult<Sp>
    where
        F: FnOnce(&mut Self) -> PResult<Node>,
        Sp: Spanned<Item = Node>,
    {
        let start = self.i.cur_span().start;
        let val = parse(self)?;
        let end = self.i.last_span().end;
        Ok(Sp::from_unspanned(val, Span { start, end }))
    }
}
