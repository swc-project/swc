#![allow(dead_code, unused_variables)]
#![deny(non_snake_case)]
use self::{input::ParserInput, util::ParseObject};
use ast::*;
use error::SyntaxError;
use lexer::{Input, Lexer};
use parser_macros::parser;
use std::ops::{Deref, DerefMut};
use swc_atoms::JsWord;
use swc_common::{errors::DiagnosticBuilder, BytePos, Span};
use token::*;
use Context;
use Session;

#[macro_use]
mod macros;
mod class_and_fn;
mod expr;
mod ident;
pub mod input;
mod object;
mod pat;
mod stmt;
mod util;

pub type PResult<'a, T> = Result<T, DiagnosticBuilder<'a>>;

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

#[parser]
impl<'a, I: Input> Parser<'a, I> {
    pub fn new(session: Session<'a>, input: I) -> Self {
        Parser {
            session,
            input: ParserInput::new(Lexer::new(session, input)),
            state: Default::default(),
        }
    }

    pub fn parse_script(&mut self) -> PResult<'a, (Vec<Stmt>)> {
        let ctx = Context {
            module: false,
            ..self.ctx()
        };
        self.set_ctx(ctx);

        self.parse_block_body(true, true, None)
    }

    pub fn parse_module(&mut self) -> PResult<'a, Module> {
        //TOOD: parse() -> PResult<'a, Program>
        let ctx = Context {
            module: true,
            strict: true,
            ..self.ctx()
        };
        // module code is always in strict mode
        self.set_ctx(ctx);

        let start = cur_pos!();
        self.parse_block_body(true, true, None).map(|body| Module {
            span: span!(start),
            body,
        })
    }

    const fn ctx(&self) -> Context {
        self.input.get_ctx()
    }
}

#[cfg(test)]
pub fn test_parser<F, Ret>(s: &'static str, f: F) -> Ret
where
    F: for<'a> FnOnce(&'a mut Parser<'a, ::SourceFileInput>) -> Ret,
{
    ::with_test_sess(s, |sess, input| Ok(f(&mut Parser::new(sess, input)))).unwrap()
}

#[test]
fn module_legacy() {
    test_parser("<!--", |f| {
        let res = f.parse_module();
        assert!(f.ctx().module);
        assert!(f.ctx().strict);
        let _ = res.expect_err("!").cancel();
    });
}
