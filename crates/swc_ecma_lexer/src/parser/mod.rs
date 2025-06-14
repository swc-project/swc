#![allow(clippy::let_unit_value)]
#![deny(non_snake_case)]

use std::ops::DerefMut;

use swc_ecma_ast::*;

use crate::{
    common::{
        input::Tokens,
        parser::{
            buffer::Buffer as BufferTrait, module_item::parse_module_item_block_body,
            parse_shebang, stmt::parse_stmt_block_body, Parser as ParserTrait,
        },
    },
    error::Error,
    input::Buffer,
    token::{Token, TokenAndSpan},
    Context, Syntax, TsSyntax, *,
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
    type I = I;
    type Lexer = crate::lexer::Lexer<'a>;
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

    #[inline(always)]
    fn mark_found_module_item(&mut self) {
        self.found_module_item = true;
    }
}

impl<I: Tokens<TokenAndSpan>> Parser<I> {
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
            input: Buffer::new(input),
            found_module_item: false,
        }
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

        parse_stmt_block_body(self, true, None).map(|body| Script {
            span: span!(self, start),
            body,
            shebang,
        })
    }

    pub fn parse_commonjs(&mut self) -> PResult<Script> {
        trace_cur!(self, parse_commonjs);

        // CommonJS module is acctually in a function scope
        let ctx = (self.ctx() & !Context::Module)
            | Context::InFunction
            | Context::InsideNonArrowFunctionScope;
        self.set_ctx(ctx);

        let start = cur_pos!(self);
        let shebang = parse_shebang(self)?;

        parse_stmt_block_body(self, true, None).map(|body| Script {
            span: span!(self, start),
            body,
            shebang,
        })
    }

    #[cfg(test)]
    pub fn parse_typescript_module(&mut self) -> PResult<Module> {
        trace_cur!(self, parse_typescript_module);

        debug_assert!(self.syntax().typescript());

        //TODO: parse() -> PResult<Program>
        let ctx = (self.ctx() | Context::Module | Context::TopLevel) & !Context::Strict; // Module code is always in strict mode
        self.set_ctx(ctx);

        let start = cur_pos!(self);
        let shebang = parse_shebang(self)?;

        parse_module_item_block_body(self, true, None).map(|body| Module {
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
        let shebang = parse_shebang(self)?;
        let ctx = self.ctx() | Context::CanBeModule | Context::TopLevel;

        let body: Vec<ModuleItem> =
            parse_module_item_block_body(self.with_ctx(ctx).deref_mut(), true, None)?;
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
                    ModuleItem::ModuleDecl(_) => unreachable!(
                        "Module is handled
    above"
                    ),
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
        let shebang = parse_shebang(self)?;

        parse_module_item_block_body(self, true, None).map(|body| Module {
            span: span!(self, start),
            body,
            shebang,
        })
    }
}
