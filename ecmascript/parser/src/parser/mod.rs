#![allow(dead_code, unused_variables)]
#![deny(non_snake_case)]
use self::{input::ParserInput, util::ParseObject};
use crate::{
    error::SyntaxError,
    lexer::{Input, Lexer},
    parser_macros::parser,
    token::*,
    Context, Session, Syntax,
};
use ast::*;
use std::ops::{Deref, DerefMut};
use swc_atoms::JsWord;
use swc_common::{BytePos, Span};

#[macro_use]
mod macros;
mod class_and_fn;
mod expr;
mod ident;
pub mod input;
mod jsx;
mod object;
mod pat;
mod stmt;
mod util;

/// When error ocurred, error is emiited and parser returnes Err(()).
pub type PResult<'a, T> = Result<T, ()>;

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
    pub fn new(session: Session<'a>, syntax: Syntax, input: I) -> Self {
        Parser {
            session,
            input: ParserInput::new(Lexer::new(session, syntax, input)),
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
pub fn test_parser<F, Ret>(s: &'static str, syntax: Syntax, f: F) -> Ret
where
    F: for<'a> FnOnce(&'a mut Parser<'a, ::SourceFileInput>) -> Result<Ret, ()>,
{
    ::with_test_sess(s, |sess, input| f(&mut Parser::new(sess, syntax, input))).unwrap()
}

#[test]
fn module_legacy() {
    test_parser("<!--", Syntax::Es2019, |f| {
        let res = f.parse_module();
        assert!(f.ctx().module);
        assert!(f.ctx().strict);
        let _ = res.expect_err("!");
        Ok(())
    });
}
