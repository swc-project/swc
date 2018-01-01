#![allow(dead_code, unused_variables)]
#![deny(non_snake_case)]
pub use self::input::Input;
use self::input::ParserInput;
use ast::*;
use std::option::NoneError;
use swc_common::{Span, Spanned};
use token::*;

#[macro_use]
mod macros;
mod expr;
mod ident;
mod module;
mod stmt;
pub mod input;

#[derive(Debug, Copy, Clone)]
struct Context {
    /// Is in strict mode?
    strict: bool,
    /// Is in module?
    module: bool,
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
    Eof,
    ExpectedIdent,
    ExpectedSemi,
    Syntax(SyntaxError),
}

impl From<NoneError> for Error {
    fn from(_: NoneError) -> Self {
        Error::Eof
    }
}

#[derive(Debug)]
pub enum SyntaxError {
    /// "implements", "interface", "let", "package",\
    ///  "private", "protected",  "public", "static", or "yield"
    InvalidIdentInStrict,
    /// 'eval' and 'arguments' are invalid identfier in strict mode.
    EvalAndArgumentsInStrict,
    UnaryInExp,
    LineBreakInThrow,
}

/// EcmaScript parser.
pub struct Parser<I: Input> {
    ctx: Context,
    i: ParserInput<I>,
}

impl<I: Input> Parser<I> {
    pub const fn new_for_module(lexer: I) -> Self {
        Parser {
            i: ParserInput::new(lexer),
            ctx: Context {
                strict: true,
                module: true,
                is_in_async_fn: false,
                is_in_generator: false,
            },
        }
    }

    pub const fn new_for_script(lexer: I, strict: bool) -> Self {
        Parser {
            i: ParserInput::new(lexer),
            ctx: Context {
                strict,
                module: false,
                is_in_async_fn: false,
                is_in_generator: false,
            },
        }
    }

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

    fn eat_or_inject_semi(&mut self) -> bool {
        self.i.eat(&Semi) || self.i.cur() == None || self.i.is(&RBrace)
            || self.i.had_line_break_before_cur()
    }

    /// eat or inject semicolon if we can.
    fn expect_semi(&mut self) -> PResult<()> {
        if self.eat_or_inject_semi() {
            Ok(())
        } else {
            panic!("expected ';', got {:?}", self.i.cur())
            // Err(Error::ExpectedSemi)
        }
    }

    pub fn parse_script(&mut self) -> PResult<Vec<Stmt>> {
        self.parse_block_body(true, None)
    }
}
