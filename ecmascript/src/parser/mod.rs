#![allow(dead_code, unused_variables)]
#![deny(non_snake_case)]
pub use self::input::Input;
use self::input::ParserInput;
use ast::*;
use slog::Logger;
use std::option::NoneError;
use swc_common::Span;
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
    /// If true await expression will be parsed, and "await" will be treated
    /// as a keyword.
    in_async: Option<Async>,
    /// If true yield expression will be parsed, and "yield" will be treated
    ///as a keyword.
    in_generator: Option<Generator>,
}

#[derive(Debug, Copy, Clone)]
struct Async;
#[derive(Debug, Copy, Clone)]
struct Generator;

pub type PResult<T> = Result<T, Error>;

#[derive(Debug)]
pub enum Error {
    Eof,
    ExpectedIdent,
    ExpectedSemi,
    Syntax(Option<Token>, Span, SyntaxError),
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
    Expected(&'static Token),

    /// "await* has been removed from the async functions proposal. Use
    /// Promise.all() instead."
    AwaitStar,
    /// "cannot use a reserved word as a shorthand property"
    ReservedWordInShorthand,

    MultipleDefault,
}

/// EcmaScript parser.
pub struct Parser<I: Input> {
    logger: Logger,
    ctx: Context,
    input: ParserInput<I>,
}

impl<I: Input> Parser<I> {
    pub fn new_for_module(logger: Logger, lexer: I) -> Self {
        Parser {
            logger,
            input: ParserInput::new(lexer),
            ctx: Context {
                strict: true,
                module: true,
                in_async: None,
                in_generator: None,
            },
        }
    }

    pub fn new_for_script(logger: Logger, lexer: I, strict: bool) -> Self {
        Parser {
            logger,
            input: ParserInput::new(lexer),
            ctx: Context {
                strict,
                module: false,
                in_async: None,
                in_generator: None,
            },
        }
    }

    pub fn parse_script(&mut self) -> PResult<Vec<Stmt>> {
        self.parse_block_body(true, None)
    }

    /// Call `op` with `ctx`, and restore original context after it.
    fn with_ctx<F, Ret>(&mut self, ctx: Context, op: F) -> Ret
    where
        F: FnOnce(&mut Self) -> Ret,
    {
        let orig = self.ctx;
        self.ctx = ctx;
        let ret = op(self);
        self.ctx = orig;
        ret
    }
}
