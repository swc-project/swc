#![allow(clippy::let_unit_value)]
#![deny(non_snake_case)]

use swc_atoms::Atom;
use swc_common::{comments::Comments, input::StringInput, BytePos, Span};
use swc_ecma_ast::*;
use swc_ecma_lexer::{
    common::parser::{
        buffer::Buffer as BufferTrait, parse_object::ParseObject, Parser as ParserTrait,
    },
    error::SyntaxError,
};

use crate::{
    lexer::{Token, TokenAndSpan},
    parser::input::Tokens,
    Context, EsVersion, Syntax, TsSyntax,
};
#[cfg(test)]
extern crate test;
#[cfg(test)]
use test::Bencher;

use crate::error::Error;

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
#[cfg(feature = "typescript")]
mod typescript;

pub use swc_ecma_lexer::common::parser::PResult;

/// EcmaScript parser.
#[derive(Clone)]
pub struct Parser<I: self::input::Tokens> {
    state: swc_ecma_lexer::common::parser::state::State,
    input: self::input::Buffer<I>,
    found_module_item: bool,
}

impl<I: Tokens> swc_ecma_lexer::common::parser::Parser<TokenAndSpan, I> for Parser<I> {
    #[inline(always)]
    fn input(&self) -> &I {
        &self.input.iter
    }

    #[inline(always)]
    fn input_mut(&mut self) -> &mut I {
        &mut self.input.iter
    }

    #[inline(always)]
    fn state_mut(&mut self) -> &mut swc_ecma_lexer::common::parser::state::State {
        &mut self.state
    }
}

impl<'a> Parser<crate::lexer::Lexer<'a>> {
    pub fn new(syntax: Syntax, input: StringInput<'a>, comments: Option<&'a dyn Comments>) -> Self {
        let lexer = crate::lexer::Lexer::new(syntax, Default::default(), input, comments);
        Self::new_from(lexer)
    }
}

impl<I: Tokens> Parser<I> {
    pub fn new_from(mut input: I) -> Self {
        #[cfg(feature = "typescript")]
        let in_declare = matches!(
            input.syntax(),
            Syntax::Typescript(TsSyntax { dts: true, .. })
        );
        #[cfg(not(feature = "typescript"))]
        let in_declare = false;
        let mut ctx = input.ctx() | Context::TopLevel;
        ctx.set(Context::InDeclare, in_declare);
        input.set_ctx(ctx);

        Parser {
            state: Default::default(),
            input: crate::parser::input::Buffer::new(input),
            found_module_item: false,
        }
    }

    pub fn take_errors(&mut self) -> Vec<Error> {
        self.input().take_errors()
    }

    pub fn take_script_module_errors(&mut self) -> Vec<Error> {
        self.input().take_script_module_errors()
    }

    pub fn parse_script(&mut self) -> PResult<Script> {
        trace_cur!(self, parse_script);

        let ctx = (self.ctx() & !Context::Module) | Context::TopLevel;
        self.set_ctx(ctx);

        let start = cur_pos!(self);

        let shebang = self.parse_shebang()?;

        self.parse_block_body(true, None).map(|body| Script {
            span: span!(self, start),
            body,
            shebang,
        })
    }

    pub fn parse_typescript_module(&mut self) -> PResult<Module> {
        trace_cur!(self, parse_typescript_module);

        debug_assert!(self.syntax().typescript());

        //TODO: parse() -> PResult<Program>
        let ctx = (self.ctx() | Context::Module | Context::TopLevel) & !Context::Strict;
        // Module code is always in strict mode
        self.set_ctx(ctx);

        let start = cur_pos!(self);
        let shebang = self.parse_shebang()?;

        self.parse_block_body(true, None).map(|body| Module {
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
        let ctx = self.ctx() | Context::CanBeModule | Context::TopLevel;

        let body: Vec<ModuleItem> = self.with_ctx(ctx).parse_block_body(true, None)?;
        let has_module_item = self.found_module_item
            || body
                .iter()
                .any(|item| matches!(item, ModuleItem::ModuleDecl(..)));
        if has_module_item && !self.ctx().contains(Context::Module) {
            let ctx = self.ctx()
                | Context::Module
                | Context::CanBeModule
                | Context::TopLevel
                | Context::Strict;
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
        let ctx = self.ctx()
            | Context::Module
            | Context::CanBeModule
            | Context::TopLevel
            | Context::Strict;
        // Module code is always in strict mode
        self.set_ctx(ctx);

        let start = cur_pos!(self);
        let shebang = self.parse_shebang()?;

        self.parse_block_body(true, None).map(|body| Module {
            span: span!(self, start),
            body,
            shebang,
        })
    }

    fn parse_shebang(&mut self) -> PResult<Option<Atom>> {
        match cur!(self, false) {
            Ok(Token::Shebang) => match bump!(self) {
                Token::Shebang => {
                    let v = self.input.expect_word_token_value();
                    Ok(Some(v))
                }
                _ => unreachable!(),
            },
            _ => Ok(None),
        }
    }

    fn ctx(&self) -> Context {
        self.input.get_ctx()
    }

    #[cold]
    fn emit_err(&mut self, span: Span, error: SyntaxError) {
        if self.ctx().contains(Context::IgnoreError) || !self.syntax().early_errors() {
            return;
        }

        self.emit_error(Error::new(span, error))
    }

    #[cold]
    fn emit_error(&mut self, error: Error) {
        if self.ctx().contains(Context::IgnoreError) || !self.syntax().early_errors() {
            return;
        }

        if matches!(self.input.cur(), Some(Token::Error)) {
            let err = self.input.bump();
            match err {
                Token::Error => {
                    let err = self.input.expect_error_token_value();
                    self.input_ref().add_error(err);
                }
                _ => unreachable!(),
            }
        }

        self.input_ref().add_error(error);
    }

    #[cold]
    fn emit_strict_mode_err(&self, span: Span, error: SyntaxError) {
        if self.ctx().contains(Context::IgnoreError) {
            return;
        }
        let error = Error::new(span, error);
        self.input_ref().add_module_mode_error(error);
    }
}

#[cfg(test)]
pub fn test_parser<F, Ret>(s: &'static str, syntax: Syntax, f: F) -> Ret
where
    F: FnOnce(&mut Parser<crate::lexer::Lexer>) -> Result<Ret, Error>,
{
    crate::with_test_sess(s, |handler, input| {
        let lexer = crate::lexer::Lexer::new(syntax, EsVersion::Es2019, input, None);
        let mut p = Parser::new_from(lexer);
        let ret = f(&mut p);
        let mut error = false;

        for err in p.take_errors() {
            error = true;
            err.into_diagnostic(handler).emit();
        }

        let res = ret.map_err(|err| err.into_diagnostic(handler).emit())?;

        if error {
            return Err(());
        }

        Ok(res)
    })
    .unwrap_or_else(|output| panic!("test_parser(): failed to parse \n{s}\n{output}"))
}

#[cfg(test)]
pub fn test_parser_comment<F, Ret>(c: &dyn Comments, s: &'static str, syntax: Syntax, f: F) -> Ret
where
    F: FnOnce(&mut Parser<crate::lexer::Lexer>) -> Result<Ret, Error>,
{
    crate::with_test_sess(s, |handler, input| {
        let lexer = crate::lexer::Lexer::new(syntax, EsVersion::Es2019, input, Some(&c));
        let mut p = Parser::new_from(lexer);
        let ret = f(&mut p);

        for err in p.take_errors() {
            err.into_diagnostic(handler).emit();
        }

        ret.map_err(|err| err.into_diagnostic(handler).emit())
    })
    .unwrap_or_else(|output| panic!("test_parser(): failed to parse \n{s}\n{output}"))
}

#[cfg(test)]
pub fn bench_parser<F>(b: &mut Bencher, s: &'static str, syntax: Syntax, mut f: F)
where
    F: for<'a> FnMut(&'a mut Parser<crate::lexer::Lexer<'a>>) -> PResult<()>,
{
    b.bytes = s.len() as u64;

    let _ = crate::with_test_sess(s, |handler, input| {
        b.iter(|| {
            let lexer = crate::lexer::Lexer::new(syntax, Default::default(), input.clone(), None);
            let _ =
                f(&mut Parser::new_from(lexer)).map_err(|err| err.into_diagnostic(handler).emit());
        });

        Ok(())
    });
}
