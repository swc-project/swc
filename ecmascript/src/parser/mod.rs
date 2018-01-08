#![allow(dead_code, unused_variables)]
#![deny(non_snake_case)]
pub use self::input::Input;
use self::input::ParserInput;
use self::util::ParseObject;
use ast::*;
use error::SyntaxError;
use parser_macros::parser;
use slog::Logger;
use std::ops::{Deref, DerefMut};
use std::option::NoneError;
use swc_atoms::JsWord;
use swc_common::{BytePos, Span};
use token::*;

#[macro_use]
mod macros;
mod class_and_fn;
mod object;
mod expr;
mod ident;
mod stmt;
mod pat;
pub mod input;
mod util;

pub type PResult<T> = Result<T, Error>;

#[derive(Debug)]
pub enum Error {
    Eof,
    Syntax(Option<Token>, BytePos, SyntaxError, &'static str, u32),
}

impl From<NoneError> for Error {
    fn from(_: NoneError) -> Self {
        Error::Eof
    }
}

#[derive(Debug, Clone, Copy, Default)]
pub struct Config {}

/// EcmaScript parser.
pub struct Parser<I: Input> {
    logger: Logger,
    cfg: Config,
    ctx: Context,
    state: State,
    input: ParserInput<I>,
}
#[derive(Debug, Clone, Copy, Default)]
struct Context {
    strict: bool,
    include_in_expr: bool,
    /// If true, await expression is parsed, and "await" is treated as a
    /// keyword.
    in_async: bool,
    /// If true, yield expression is parsed, and "yield" is treated as a
    /// keyword.
    in_generator: bool,
    in_module: bool,
}

#[derive(Debug, Default)]
struct State {
    labels: Vec<JsWord>,
    potential_arrow_start: Option<BytePos>,
}

impl<I: Input> Parser<I> {
    pub fn new_for_module(logger: Logger, lexer: I) -> Self {
        Parser {
            logger,
            input: ParserInput::new(lexer),
            ctx: Context {
                strict: true,
                in_module: true,
                ..Default::default()
            },
            cfg: Default::default(),
            state: Default::default(),
        }
    }

    pub fn new_for_script(logger: Logger, lexer: I, strict: bool) -> Self {
        Parser {
            logger,
            input: ParserInput::new(lexer),
            ctx: Context {
                strict,
                ..Default::default()
            },
            cfg: Default::default(),
            state: Default::default(),
        }
    }

    #[parser]
    pub fn parse_script(&mut self) -> PResult<Vec<Stmt>> {
        self.parse_block_body(true, None)
    }

    #[parser]
    pub fn parse_module(&mut self) -> PResult<Module> {
        self.parse_block_body(true, None)
            .map(|body| Module { body })
    }
}
