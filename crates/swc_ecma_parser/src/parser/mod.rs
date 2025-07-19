#![allow(clippy::let_unit_value)]
#![deny(non_snake_case)]

use swc_common::{comments::Comments, input::StringInput};
use swc_ecma_ast::*;
use swc_ecma_lexer::common::parser::{
    buffer::Buffer as BufferTrait, expr::parse_lhs_expr, module_item::parse_module_item_block_body,
    parse_shebang, stmt::parse_stmt_block_body, Parser as ParserTrait,
};

use crate::{
    lexer::{Token, TokenAndSpan},
    parser::input::Tokens,
    Context, Syntax,
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
pub mod input;
mod jsx;
mod pat;
mod stmt;
#[cfg(test)]
mod tests;
mod tpl;
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

impl<'a, I: Tokens> swc_ecma_lexer::common::parser::Parser<'a> for Parser<I> {
    type Buffer = self::input::Buffer<I>;
    type I = I;
    type Lexer = crate::lexer::Lexer<'a>;
    type Next = crate::lexer::NextTokenAndSpan;
    type Token = Token;
    type TokenAndSpan = TokenAndSpan;

    #[inline(always)]
    fn input(&self) -> &Self::Buffer {
        &self.input
    }

    #[inline(always)]
    fn input_mut(&mut self) -> &mut Self::Buffer {
        &mut self.input
    }

    #[inline(always)]
    fn state(&self) -> &swc_ecma_lexer::common::parser::state::State {
        &self.state
    }

    #[inline(always)]
    fn state_mut(&mut self) -> &mut swc_ecma_lexer::common::parser::state::State {
        &mut self.state
    }

    #[inline(always)]
    fn mark_found_module_item(&mut self) {
        self.found_module_item = true;
    }

    #[inline(always)]
    fn parse_unary_expr(&mut self) -> PResult<Box<Expr>> {
        self.parse_unary_expr()
    }

    #[inline(always)]
    fn parse_jsx_element(
        &mut self,
        in_expr_context: bool,
    ) -> PResult<either::Either<JSXFragment, JSXElement>> {
        self.parse_jsx_element(in_expr_context)
    }

    #[inline(always)]
    fn parse_primary_expr(&mut self) -> PResult<Box<Expr>> {
        self.parse_primary_expr()
    }

    #[inline(always)]
    fn ts_in_no_context<T>(&mut self, op: impl FnOnce(&mut Self) -> PResult<T>) -> PResult<T> {
        debug_assert!(self.input().syntax().typescript());
        trace_cur!(self, ts_in_no_context__before);
        let res = op(self);
        trace_cur!(self, ts_in_no_context__after);
        res
    }

    #[inline(always)]
    fn parse_tagged_tpl(
        &mut self,
        tag: Box<Expr>,
        type_params: Option<Box<TsTypeParamInstantiation>>,
    ) -> PResult<TaggedTpl> {
        self.parse_tagged_tpl(tag, type_params)
    }

    #[inline(always)]
    fn parse_tagged_tpl_ty(&mut self) -> PResult<TsLitType> {
        let start = self.cur_pos();
        self.parse_tagged_tpl_ty().map(|tpl_ty| {
            let lit = TsLit::Tpl(tpl_ty);
            TsLitType {
                span: self.span(start),
                lit,
            }
        })
    }

    #[inline(always)]
    fn parse_lhs_expr(&mut self) -> PResult<Box<Expr>> {
        parse_lhs_expr::<Self, false>(self)
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
        let in_declare = input.syntax().dts();
        let mut ctx = input.ctx() | Context::TopLevel;
        ctx.set(Context::InDeclare, in_declare);
        input.set_ctx(ctx);

        let mut p = Parser {
            state: Default::default(),
            input: crate::parser::input::Buffer::new(input),
            found_module_item: false,
        };
        p.input.bump(); // consume EOF
        p
    }

    pub fn take_errors(&mut self) -> Vec<Error> {
        self.input.iter.take_errors()
    }

    pub fn take_script_module_errors(&mut self) -> Vec<Error> {
        self.input.iter.take_script_module_errors()
    }

    pub fn parse_script(&mut self) -> PResult<Script> {
        trace_cur!(self, parse_script);

        let ctx = (self.ctx() & !Context::Module) | Context::TopLevel;
        self.set_ctx(ctx);

        let start = self.cur_pos();

        let shebang = parse_shebang(self)?;

        let ret = parse_stmt_block_body(self, true, None).map(|body| Script {
            span: self.span(start),
            body,
            shebang,
        })?;

        debug_assert!(self.input().cur() == &Token::Eof);
        self.input_mut().bump();

        Ok(ret)
    }

    pub fn parse_commonjs(&mut self) -> PResult<Script> {
        trace_cur!(self, parse_commonjs);

        // CommonJS module is acctually in a function scope
        let ctx = (self.ctx() & !Context::Module)
            | Context::InFunction
            | Context::InsideNonArrowFunctionScope;
        self.set_ctx(ctx);

        let start = self.cur_pos();
        let shebang = parse_shebang(self)?;

        let ret = parse_stmt_block_body(self, true, None).map(|body| Script {
            span: self.span(start),
            body,
            shebang,
        })?;

        debug_assert!(self.input().cur() == &Token::Eof);
        self.input_mut().bump();

        Ok(ret)
    }

    pub fn parse_typescript_module(&mut self) -> PResult<Module> {
        trace_cur!(self, parse_typescript_module);

        debug_assert!(self.syntax().typescript());

        //TODO: parse() -> PResult<Program>
        let ctx = (self.ctx() | Context::Module | Context::TopLevel) & !Context::Strict;
        // Module code is always in strict mode
        self.set_ctx(ctx);

        let start = self.cur_pos();
        let shebang = parse_shebang(self)?;

        let ret = parse_module_item_block_body(self, true, None).map(|body| Module {
            span: self.span(start),
            body,
            shebang,
        })?;

        debug_assert!(self.input().cur() == &Token::Eof);
        self.input_mut().bump();

        Ok(ret)
    }

    /// Returns [Module] if it's a module and returns [Script] if it's not a
    /// module.
    ///
    /// Note: This is not perfect yet. It means, some strict mode violations may
    /// not be reported even if the method returns [Module].
    pub fn parse_program(&mut self) -> PResult<Program> {
        let start = self.cur_pos();
        let shebang = parse_shebang(self)?;

        let body: Vec<ModuleItem> = self
            .do_inside_of_context(Context::CanBeModule.union(Context::TopLevel), |p| {
                parse_module_item_block_body(p, true, None)
            })?;
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

        let ret = if has_module_item {
            Program::Module(Module {
                span: self.span(start),
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
                span: self.span(start),
                body,
                shebang,
            })
        };

        debug_assert!(self.input().cur() == &Token::Eof);
        self.input_mut().bump();

        Ok(ret)
    }

    pub fn parse_module(&mut self) -> PResult<Module> {
        let ctx = self.ctx()
            | Context::Module
            | Context::CanBeModule
            | Context::TopLevel
            | Context::Strict;
        // Module code is always in strict mode
        self.set_ctx(ctx);

        let start = self.cur_pos();
        let shebang = parse_shebang(self)?;

        let ret = parse_module_item_block_body(self, true, None).map(|body| Module {
            span: self.span(start),
            body,
            shebang,
        })?;

        debug_assert!(self.input().cur() == &Token::Eof);
        self.input_mut().bump();

        Ok(ret)
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
