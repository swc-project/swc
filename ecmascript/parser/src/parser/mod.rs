#![allow(dead_code, unused_variables)]
#![deny(non_snake_case)]
pub use self::input::{Capturing, Tokens, TokensInput};
use self::{input::Buffer, util::ParseObject};
use crate::{
    error::SyntaxError,
    lexer::Lexer,
    token::{Token, Word},
    Context, JscTarget, Syntax,
};
use std::ops::{Deref, DerefMut};
use swc_atoms::JsWord;
use swc_common::{comments::Comments, input::Input, BytePos, Span};
use swc_ecma_ast::*;
#[cfg(test)]
extern crate test;
use crate::error::Error;
#[cfg(test)]
use test::Bencher;

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
#[cfg(test)]
mod tests;
mod typescript;
mod util;

/// When error occurs, error is emitted and parser returns Err(()).
pub type PResult<T> = Result<T, Error>;

/// EcmaScript parser.
#[derive(Clone)]
pub struct Parser<I: Tokens> {
    /// [false] while backtracking
    emit_err: bool,
    state: State,
    input: Buffer<I>,
}

#[derive(Clone, Default)]
struct State {
    labels: Vec<JsWord>,
    /// Start position of an assignment expression.
    potential_arrow_start: Option<BytePos>,
}

impl<'a, I: Input> Parser<Lexer<'a, I>> {
    pub fn new(syntax: Syntax, input: I, comments: Option<&'a dyn Comments>) -> Self {
        Self::new_from(Lexer::new(syntax, Default::default(), input, comments))
    }
}

impl<I: Tokens> Parser<I> {
    pub fn new_from(input: I) -> Self {
        Parser {
            emit_err: true,
            state: Default::default(),
            input: Buffer::new(input),
        }
    }

    pub fn take_errors(&mut self) -> Vec<Error> {
        self.input().take_errors()
    }

    pub(crate) fn target(&self) -> JscTarget {
        self.input.target()
    }

    pub fn parse_script(&mut self) -> PResult<Script> {
        trace_cur!(self, parse_script);

        let ctx = Context {
            module: false,
            ..self.ctx()
        };
        self.set_ctx(ctx);

        let start = cur_pos!(self);

        let shebang = self.parse_shebang()?;

        self.parse_block_body(true, true, None).map(|body| Script {
            span: span!(self, start),
            body,
            shebang,
        })
    }

    pub fn parse_typescript_module(&mut self) -> PResult<Module> {
        trace_cur!(self, parse_typescript_module);

        debug_assert!(self.syntax().typescript());

        //TODO: parse() -> PResult<Program>
        let ctx = Context {
            module: true,
            strict: false,
            ..self.ctx()
        };
        // Module code is always in strict mode
        self.set_ctx(ctx);

        let start = cur_pos!(self);
        let shebang = self.parse_shebang()?;

        self.parse_block_body(true, true, None).map(|body| Module {
            span: span!(self, start),
            body,
            shebang,
        })
    }

    /// Returns [Module] if it's a module and returns [Script] if it's not a
    /// module.
    ///
    /// Note: This is not perfect yet. It means, some strict mode violations may
    /// not be reported even if the method returns [Module].
    pub fn parse_program(&mut self) -> PResult<Program> {
        let start = cur_pos!(self);
        let shebang = self.parse_shebang()?;

        let body: Vec<ModuleItem> = self.parse_block_body(true, true, None)?;
        let has_module_item = body.iter().any(|item| match item {
            ModuleItem::ModuleDecl(..) => true,
            _ => false,
        });
        if has_module_item && !self.ctx().module {
            let ctx = Context {
                module: true,
                strict: true,
                ..self.ctx()
            };
            // Emit buffered strict mode / module code violations
            self.input.set_ctx(ctx);
        }

        Ok(if has_module_item {
            Program::Module(Module {
                span: span!(self, start),
                body,
                shebang,
            })
        } else {
            let body = body
                .into_iter()
                .map(|item| match item {
                    ModuleItem::ModuleDecl(_) => unreachable!("Module is handled above"),
                    ModuleItem::Stmt(stmt) => stmt,
                })
                .collect();
            Program::Script(Script {
                span: span!(self, start),
                body,
                shebang,
            })
        })
    }

    pub fn parse_module(&mut self) -> PResult<Module> {
        let ctx = Context {
            module: true,
            strict: true,
            ..self.ctx()
        };
        // Module code is always in strict mode
        self.set_ctx(ctx);

        let start = cur_pos!(self);
        let shebang = self.parse_shebang()?;

        self.parse_block_body(true, true, None).map(|body| Module {
            span: span!(self, start),
            body,
            shebang,
        })
    }

    fn parse_shebang(&mut self) -> PResult<Option<JsWord>> {
        match cur!(self, false) {
            Ok(&Token::Shebang(..)) => match bump!(self) {
                Token::Shebang(v) => Ok(Some(v)),
                _ => unreachable!(),
            },
            _ => Ok(None),
        }
    }

    fn ctx(&self) -> Context {
        self.input.get_ctx()
    }

    #[cold]
    fn emit_err(&self, span: Span, error: SyntaxError) {
        if !self.emit_err || !self.syntax().early_errors() {
            return;
        }

        self.emit_error(Error {
            error: Box::new((span, error)),
        })
    }

    #[cold]
    fn emit_error(&self, error: Error) {
        if !self.emit_err || !self.syntax().early_errors() {
            return;
        }

        self.input_ref().add_error(error);
    }

    #[cold]
    fn emit_strict_mode_err(&self, span: Span, error: SyntaxError) {
        if !self.emit_err {
            return;
        }
        let error = Error {
            error: Box::new((span, error)),
        };
        self.input_ref().add_module_mode_error(error);
    }
}

#[cfg(test)]
pub fn test_parser<F, Ret>(s: &'static str, syntax: Syntax, f: F) -> Ret
where
    F: FnOnce(&mut Parser<Lexer<crate::StringInput<'_>>>) -> Result<Ret, Error>,
{
    crate::with_test_sess(s, |handler, input| {
        let lexer = Lexer::new(syntax, JscTarget::Es2019, input, None);
        let mut p = Parser::new_from(lexer);
        let ret = f(&mut p);

        for err in p.take_errors() {
            err.into_diagnostic(handler).emit();
        }

        ret.map_err(|err| err.into_diagnostic(handler).emit())
    })
    .unwrap_or_else(|output| panic!("test_parser(): failed to parse \n{}\n{}", s, output))
}

#[cfg(test)]
pub fn test_parser_comment<F, Ret>(c: &dyn Comments, s: &'static str, syntax: Syntax, f: F) -> Ret
where
    F: FnOnce(&mut Parser<Lexer<crate::StringInput<'_>>>) -> Result<Ret, Error>,
{
    crate::with_test_sess(s, |handler, input| {
        let lexer = Lexer::new(syntax, JscTarget::Es2019, input, Some(&c));
        let mut p = Parser::new_from(lexer);
        let ret = f(&mut p);

        for err in p.take_errors() {
            err.into_diagnostic(handler).emit();
        }

        ret.map_err(|err| err.into_diagnostic(handler).emit())
    })
    .unwrap_or_else(|output| panic!("test_parser(): failed to parse \n{}\n{}", s, output))
}

#[cfg(test)]
pub fn bench_parser<F>(b: &mut Bencher, s: &'static str, syntax: Syntax, mut f: F)
where
    F: for<'a> FnMut(&'a mut Parser<Lexer<'a, crate::StringInput<'_>>>) -> PResult<()>,
{
    b.bytes = s.len() as u64;

    let _ = crate::with_test_sess(s, |handler, input| {
        b.iter(|| {
            let lexer = Lexer::new(syntax, Default::default(), input.clone(), None);
            let _ =
                f(&mut Parser::new_from(lexer)).map_err(|err| err.into_diagnostic(handler).emit());
        });

        Ok(())
    });
}
