#![allow(dead_code, unused_variables)]
#![deny(non_snake_case)]
use self::input::ParserInput;
use self::util::ParseObject;
use Session;
use ast::*;
use error::SyntaxError;
use lexer::Input;
use lexer::Lexer;
use parser_macros::parser;
use std::ops::{Deref, DerefMut};
use swc_atoms::JsWord;
use swc_common::{BytePos, Span};
use swc_common::errors::Diagnostic;
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

pub type PResult<'a, T> = Result<T, Diagnostic<'a>>;

/// EcmaScript parser.
pub struct Parser<'a, I: Input> {
    session: Session<'a>,
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
    pub fn new(session: Session<'a>, input: I) -> Self {
        Parser {
            session,
            input: ParserInput::new(Lexer::new(session, input)),
            ctx: Default::default(),
            state: Default::default(),
        }
    }

    #[parser]
    pub fn parse_script(&mut self) -> PResult<'a, Vec<Stmt>> {
        self.session.cfg.module = false;

        self.parse_block_body(true, None)
    }

    #[parser]
    pub fn parse_module(&mut self) -> PResult<'a, Module> {
        //TOOD: parse() -> PResult<'a, Program>
        self.session.cfg.module = true;
        self.session.cfg.strict = true;

        self.parse_block_body(true, None)
            .map(|body| Module { body })
    }
}

#[cfg(test)]
fn test_parser<F, Ret>(s: &'static str, f: F) -> Ret
where
    F: FnOnce(&mut Parser<::CharIndices>) -> Ret,
{
    ::with_test_sess(s, |session| {
        f(&mut Parser::new(session, ::CharIndices(s.char_indices())))
    })
}
