#![allow(dead_code, unused_variables)]
#![deny(non_snake_case)]
use self::input::ParserInput;
use self::util::ParseObject;
use Config;
use ast::*;
use error::SyntaxError;
use lexer::Input;
use lexer::Lexer;
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
/// EcmaScript parser.
pub struct Parser<'a, I: Input> {
    logger: &'a Logger,
    cfg: Config,
    ctx: Context,
    state: State,
    input: ParserInput<'a, I>,
}
#[derive(Debug, Clone, Copy, Default)]
struct Context {
    include_in_expr: bool,
    /// If true, await expression is parsed, and "await" is treated as a
    /// keyword.
    in_async: bool,
    /// If true, yield expression is parsed, and "yield" is treated as a
    /// keyword.
    in_generator: bool,
}

#[derive(Debug, Default)]
struct State {
    labels: Vec<JsWord>,
    /// Start position of an assignment expression.
    potential_arrow_start: Option<BytePos>,
}

impl<'a, I: Input> Parser<'a, I> {
    pub fn new(logger: &'a Logger, cfg: Config, input: I) -> Self {
        Parser {
            logger,
            input: ParserInput::new(Lexer::new(logger, cfg, input)),
            ctx: Default::default(),
            cfg: cfg,
            state: Default::default(),
        }
    }

    #[parser]
    pub fn parse_script(&mut self) -> PResult<Vec<Stmt>> {
        self.cfg.module = false;

        self.parse_block_body(true, None)
    }

    #[parser]
    pub fn parse_module(&mut self) -> PResult<Module> {
        //TOOD: parse() -> PResult<Program>
        self.cfg.module = true;
        self.cfg.strict = true;

        self.parse_block_body(true, None)
            .map(|body| Module { body })
    }
}

#[cfg(test)]
fn test_parser<F, Ret>(s: &'static str, f: F) -> Ret
where
    F: FnOnce(&mut Parser<::CharIndices>) -> Ret,
{
    let logger = ::testing::logger().new(o!("src" => s));
    let mut p = Parser::new(&logger, Default::default(), ::CharIndices(s.char_indices()));
    f(&mut p)
}
