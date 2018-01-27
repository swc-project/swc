#![allow(dead_code, unused_variables)]
#![deny(non_snake_case)]
use self::input::ParserInput;
use self::util::ParseObject;
use {Context, Session};
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
    state: State,
    input: ParserInput<'a, I>,
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
            state: Default::default(),
        }
    }

    #[parser]
    pub fn parse_script(&mut self) -> PResult<'a, Vec<Stmt>> {
        let ctx = Context {
            module: false,
            ..self.ctx()
        };
        self.set_ctx(ctx);

        self.parse_block_body(true, true, None)
    }

    #[parser]
    pub fn parse_module(&mut self) -> PResult<'a, Module> {
        //TOOD: parse() -> PResult<'a, Program>
        let ctx = Context {
            module: true,
            strict: true,
            ..self.ctx()
        };
        // module code is always in strict mode
        self.set_ctx(ctx);

        self.parse_block_body(true, true, None)
            .map(|body| Module { body })
    }

    const fn ctx(&self) -> Context {
        self.input.get_ctx()
    }
}

#[cfg(test)]
pub fn test_parser<F, Ret>(s: &'static str, f: F) -> Ret
where
    F: FnOnce(&mut Parser<::FileMapInput>) -> Ret,
{
    ::with_test_sess(s, |sess, input| f(&mut Parser::new(sess, input)))
}
