#![allow(clippy::let_unit_value)]
#![deny(non_snake_case)]

use rustc_hash::FxHashMap;
use swc_atoms::Atom;
use swc_common::{comments::Comments, input::StringInput, BytePos, Span};
use swc_ecma_ast::*;

use crate::{
    input::Buffer,
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

pub type PResult<T> = Result<T, crate::error::Error>;

pub struct ParserCheckpoint<I: Tokens> {
    lexer: I::Checkpoint,
    buffer_prev_span: Span,
    buffer_cur: TokenAndSpan,
    buffer_next: Option<crate::lexer::NextTokenAndSpan>,
}

/// EcmaScript parser.
#[derive(Clone)]
pub struct Parser<I: self::input::Tokens> {
    state: State,
    input: self::input::Buffer<I>,
    found_module_item: bool,
}

#[derive(Clone, Default)]
struct State {
    pub labels: Vec<Atom>,
    /// Start position of an assignment expression.
    pub potential_arrow_start: Option<BytePos>,
    /// Start position of an AST node and the span of its trailing comma.
    pub trailing_commas: FxHashMap<BytePos, Span>,
}

impl<I: Tokens> Parser<I> {
    // type Buffer = self::input::Buffer<I>;
    // type Checkpoint = ParserCheckpoint<I>;
    // type I = I;
    // type Next = crate::lexer::NextTokenAndSpan;
    // type Token = Token;
    // type TokenAndSpan = TokenAndSpan;

    #[inline(always)]
    fn input(&self) -> &Buffer<I> {
        &self.input
    }

    #[inline(always)]
    fn input_mut(&mut self) -> &mut Buffer<I> {
        &mut self.input
    }

    #[inline(always)]
    fn state(&self) -> &State {
        &self.state
    }

    #[inline(always)]
    fn state_mut(&mut self) -> &mut State {
        &mut self.state
    }

    fn checkpoint_save(&self) -> ParserCheckpoint<I> {
        ParserCheckpoint {
            lexer: self.input.iter.checkpoint_save(),
            buffer_cur: self.input.cur,
            buffer_next: self.input.next.clone(),
            buffer_prev_span: self.input.prev_span,
        }
    }

    fn checkpoint_load(&mut self, checkpoint: ParserCheckpoint<I>) {
        self.input.iter.checkpoint_load(checkpoint.lexer);
        self.input.cur = checkpoint.buffer_cur;
        self.input.next = checkpoint.buffer_next;
        self.input.prev_span = checkpoint.buffer_prev_span;
    }

    #[inline(always)]
    fn mark_found_module_item(&mut self) {
        self.found_module_item = true;
    }

    #[inline(always)]
    fn ts_in_no_context<T>(&mut self, op: impl FnOnce(&mut Self) -> PResult<T>) -> PResult<T> {
        debug_assert!(self.input().syntax().typescript());
        trace_cur!(self, ts_in_no_context__before);
        let res = op(self);
        trace_cur!(self, ts_in_no_context__after);
        res
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

        let shebang = self.parse_shebang()?;

        let ret = self.parse_stmt_block_body(true, None).map(|body| Script {
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
        let shebang = self.parse_shebang()?;

        let ret = self.parse_stmt_block_body(true, None).map(|body| Script {
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
        let shebang = self.parse_shebang()?;

        let ret = self
            .parse_module_item_block_body(true, None)
            .map(|body| Module {
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
        let shebang = self.parse_shebang()?;

        let body: Vec<ModuleItem> = self
            .do_inside_of_context(Context::CanBeModule.union(Context::TopLevel), |p| {
                p.parse_module_item_block_body(true, None)
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
        let shebang = self.parse_shebang()?;

        let ret = self
            .parse_module_item_block_body(true, None)
            .map(|body| Module {
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
