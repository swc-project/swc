#![allow(dead_code, unused_variables)]
#![deny(non_snake_case)]
pub use self::input::{Capturing, Tokens, TokensInput};
use self::{input::Buffer, util::ParseObject};
use crate::{
    error::SyntaxError,
    parser_macros::parser,
    token::{Token, Word},
    Context, Session, Syntax,
};
use ast::*;
use lexer::Lexer;
use std::ops::{Deref, DerefMut};
use swc_atoms::JsWord;
use swc_common::{comments::Comments, errors::DiagnosticBuilder, input::Input, BytePos, Span};

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
mod typescript;
mod util;

/// When error occurs, error is emitted and parser returns Err(()).
pub type PResult<'a, T> = Result<T, DiagnosticBuilder<'a>>;

/// EcmaScript parser.
#[derive(Clone)]
pub struct Parser<'a, I: Tokens> {
    session: Session<'a>,
    state: State,
    input: Buffer<I>,
}

#[derive(Clone, Default)]
struct State {
    labels: Vec<JsWord>,
    /// Start position of an assignment expression.
    potential_arrow_start: Option<BytePos>,
}

impl<'a, I: Input> Parser<'a, Lexer<'a, I>> {
    pub fn new(
        session: Session<'a>,
        syntax: Syntax,
        input: I,
        comments: Option<&'a Comments>,
    ) -> Self {
        Self::new_from(session, Lexer::new(session, syntax, input, comments))
    }
}

#[parser]
impl<'a, I: Tokens> Parser<'a, I> {
    pub fn new_from(session: Session<'a>, input: I) -> Self {
        Parser {
            session,
            input: Buffer::new(input),
            state: Default::default(),
        }
    }

    pub fn parse_script(&mut self) -> PResult<'a, Script> {
        let ctx = Context {
            module: false,
            ..self.ctx()
        };
        self.set_ctx(ctx);

        let start = cur_pos!();

        let shebang = self.parse_shebang()?;

        self.parse_block_body(true, true, None).map(|body| Script {
            span: span!(start),
            body,
            shebang,
        })
    }

    pub fn parse_module(&mut self) -> PResult<'a, Module> {
        //TODO: parse() -> PResult<'a, Program>
        let ctx = Context {
            module: true,
            strict: true,
            ..self.ctx()
        };
        // Module code is always in strict mode
        self.set_ctx(ctx);

        let start = cur_pos!();
        let shebang = self.parse_shebang()?;

        self.parse_block_body(true, true, None).map(|body| Module {
            span: span!(start),
            body,
            shebang,
        })
    }

    fn parse_shebang(&mut self) -> PResult<'a, Option<JsWord>> {
        match cur!(false) {
            Ok(&Token::Shebang(..)) => match bump!() {
                Token::Shebang(v) => Ok(Some(v)),
                _ => unreachable!(),
            },
            _ => Ok(None),
        }
    }

    fn ctx(&self) -> Context {
        self.input.get_ctx()
    }
}

#[cfg(test)]
pub fn test_parser<F, Ret>(s: &'static str, syntax: Syntax, f: F) -> Ret
where
    F: for<'a> FnOnce(&'a mut Parser<'a, Lexer<'a, ::SourceFileInput>>) -> Result<Ret, ()>,
{
    crate::with_test_sess(s, |sess, input| {
        f(&mut Parser::new(sess, syntax, input, None))
    })
    .unwrap_or_else(|output| panic!("test_parser(): failed to parse \n{}\n{}", s, output))
}
