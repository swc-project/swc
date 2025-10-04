#![allow(clippy::let_unit_value)]
#![deny(non_snake_case)]

use swc_ecma_ast::*;

use crate::{
    common::{
        input::Tokens,
        parser::{
            buffer::Buffer as BufferTrait,
            expr::{parse_lhs_expr, parse_primary_expr, parse_tagged_tpl, parse_unary_expr},
            jsx::parse_jsx_element,
            module_item::parse_module_item_block_body,
            parse_shebang,
            stmt::parse_stmt_block_body,
            typescript::ts_in_no_context,
            Parser as ParserTrait,
        },
    },
    error::Error,
    input::Buffer,
    token::{Token, TokenAndSpan},
    Context, *,
};

#[macro_use]
mod macros;
#[cfg(feature = "typescript")]
mod typescript;

/// EcmaScript parser.
#[derive(Clone)]
pub struct Parser<I: Tokens<TokenAndSpan>> {
    state: crate::common::parser::state::State,
    input: Buffer<I>,
    found_module_item: bool,
}

impl<'a, I: Tokens<TokenAndSpan>> crate::common::parser::Parser<'a> for Parser<I> {
    type Buffer = Buffer<I>;
    type Checkpoint = Self;
    type I = I;
    type Next = TokenAndSpan;
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
    fn state(&self) -> &common::parser::state::State {
        &self.state
    }

    #[inline(always)]
    fn state_mut(&mut self) -> &mut common::parser::state::State {
        &mut self.state
    }

    fn checkpoint_save(&self) -> Self::Checkpoint {
        self.clone()
    }

    fn checkpoint_load(&mut self, checkpoint: Self::Checkpoint) {
        *self = checkpoint;
    }

    #[inline(always)]
    fn mark_found_module_item(&mut self) {
        self.found_module_item = true;
    }

    #[inline(always)]
    fn parse_unary_expr(&mut self) -> PResult<Box<Expr>> {
        parse_unary_expr(self)
    }

    #[inline(always)]
    fn parse_jsx_element(
        &mut self,
        _in_expr_context: bool,
    ) -> PResult<either::Either<JSXFragment, JSXElement>> {
        parse_jsx_element(self)
    }

    #[inline(always)]
    fn parse_primary_expr(&mut self) -> PResult<Box<Expr>> {
        parse_primary_expr(self)
    }

    #[inline(always)]
    fn ts_in_no_context<T>(&mut self, op: impl FnOnce(&mut Self) -> PResult<T>) -> PResult<T> {
        ts_in_no_context(self, op)
    }

    fn parse_tagged_tpl(
        &mut self,
        tag: Box<Expr>,
        type_params: Option<Box<TsTypeParamInstantiation>>,
    ) -> PResult<TaggedTpl> {
        parse_tagged_tpl(self, tag, type_params)
    }

    fn parse_tagged_tpl_ty(&mut self) -> PResult<TsLitType> {
        unreachable!("use `common::parser::expr::parse_ts_tpl_lit_type` directly");
    }

    fn parse_lhs_expr(&mut self) -> PResult<Box<Expr>> {
        parse_lhs_expr::<Self, true>(self)
    }
}

impl<I: Tokens<TokenAndSpan>> Parser<I> {
    pub fn new_from(mut input: I) -> Self {
        let in_declare = input.syntax().dts();
        let mut ctx = input.ctx() | Context::TopLevel;
        ctx.set(Context::InDeclare, in_declare);
        input.set_ctx(ctx);

        let mut p = Parser {
            state: Default::default(),
            input: Buffer::new(input),
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

    #[cfg(test)]
    pub fn parse_typescript_module(&mut self) -> PResult<Module> {
        trace_cur!(self, parse_typescript_module);

        debug_assert!(self.syntax().typescript());

        //TODO: parse() -> PResult<Program>
        let ctx = (self.ctx() | Context::Module | Context::TopLevel) & !Context::Strict; // Module code is always in strict mode
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
                    ModuleItem::ModuleDecl(_) => unreachable!(
                        "Module is handled
    above"
                    ),
                    ModuleItem::Stmt(stmt) => stmt,
                    #[cfg(swc_ast_unknown)]
                    _ => unreachable!(),
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
