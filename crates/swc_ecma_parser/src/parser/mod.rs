#![allow(clippy::let_unit_value)]
#![deny(non_snake_case)]

use rustc_hash::FxHashMap;
use swc_common::{comments::Comments, input::StringInput, BytePos, Span};
use swc_ecma_ast::*;

use crate::{
    error::SyntaxError,
    input::Buffer,
    lexer::{Token, TokenAndSpan},
    parser::{
        input::Tokens,
        state::{State, WithState},
    },
    syntax::SyntaxFlags,
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
mod state;
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

        debug_assert!(self.input().cur() == Token::Eof);
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

        debug_assert!(self.input().cur() == Token::Eof);
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

        debug_assert!(self.input().cur() == Token::Eof);
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

        debug_assert!(self.input().cur() == Token::Eof);
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

        debug_assert!(self.input().cur() == Token::Eof);
        self.input_mut().bump();

        Ok(ret)
    }
}

impl<I: Tokens> Parser<I> {
    #[inline(always)]
    pub fn with_state<'w>(&'w mut self, state: State) -> WithState<'w, I> {
        let orig_state = std::mem::replace(self.state_mut(), state);
        WithState {
            orig_state,
            inner: self,
        }
    }

    #[inline(always)]
    pub fn ctx(&self) -> Context {
        self.input().get_ctx()
    }

    #[inline(always)]
    pub fn set_ctx(&mut self, ctx: Context) {
        self.input_mut().set_ctx(ctx);
    }

    #[inline]
    pub fn do_inside_of_context<T>(
        &mut self,
        context: Context,
        f: impl FnOnce(&mut Self) -> T,
    ) -> T {
        let ctx = self.ctx();
        let inserted = ctx.complement().intersection(context);
        if inserted.is_empty() {
            f(self)
        } else {
            self.input_mut().update_ctx(|ctx| ctx.insert(inserted));
            let result = f(self);
            self.input_mut().update_ctx(|ctx| ctx.remove(inserted));
            result
        }
    }

    pub fn do_outside_of_context<T>(
        &mut self,
        context: Context,
        f: impl FnOnce(&mut Self) -> T,
    ) -> T {
        let ctx = self.ctx();
        let removed = ctx.intersection(context);
        if !removed.is_empty() {
            self.input_mut().update_ctx(|ctx| ctx.remove(removed));
            let result = f(self);
            self.input_mut().update_ctx(|ctx| ctx.insert(removed));
            result
        } else {
            f(self)
        }
    }

    #[inline(always)]
    pub fn strict_mode<T>(&mut self, f: impl FnOnce(&mut Self) -> T) -> T {
        self.do_inside_of_context(Context::Strict, f)
    }

    /// Original context is restored when returned guard is dropped.
    #[inline(always)]
    pub fn in_type<T>(&mut self, f: impl FnOnce(&mut Self) -> T) -> T {
        self.do_inside_of_context(Context::InType, f)
    }

    #[inline(always)]
    pub fn allow_in_expr<T>(&mut self, f: impl FnOnce(&mut Self) -> T) -> T {
        self.do_inside_of_context(Context::IncludeInExpr, f)
    }

    #[inline(always)]
    pub fn disallow_in_expr<T>(&mut self, f: impl FnOnce(&mut Self) -> T) -> T {
        self.do_outside_of_context(Context::IncludeInExpr, f)
    }

    #[inline(always)]
    pub fn syntax(&self) -> SyntaxFlags {
        self.input().syntax()
    }

    #[cold]
    pub fn emit_err(&mut self, span: Span, error: SyntaxError) {
        if self.ctx().contains(Context::IgnoreError) || !self.syntax().early_errors() {
            return;
        }
        self.emit_error(crate::error::Error::new(span, error))
    }

    #[cold]
    pub fn emit_error(&mut self, error: crate::error::Error) {
        if self.ctx().contains(Context::IgnoreError) || !self.syntax().early_errors() {
            return;
        }
        let cur = self.input().cur();
        if cur.is_error() {
            let err = self.input_mut().expect_error_token_and_bump();
            self.input_mut().iter_mut().add_error(err);
        }
        self.input_mut().iter_mut().add_error(error);
    }

    #[cold]
    pub fn emit_strict_mode_err(&mut self, span: Span, error: SyntaxError) {
        if self.ctx().contains(Context::IgnoreError) {
            return;
        }
        let error = crate::error::Error::new(span, error);
        if self.ctx().contains(Context::Strict) {
            self.input_mut().iter_mut().add_error(error);
        } else {
            self.input_mut().iter_mut().add_module_mode_error(error);
        }
    }

    pub fn verify_expr(&mut self, expr: Box<Expr>) -> PResult<Box<Expr>> {
        #[cfg(feature = "verify")]
        {
            use swc_ecma_visit::Visit;
            let mut v = self::verifier::Verifier { errors: Vec::new() };
            v.visit_expr(&expr);
            for (span, error) in v.errors {
                self.emit_err(span, error);
            }
        }
        Ok(expr)
    }

    #[inline(always)]
    pub fn cur_pos(&self) -> BytePos {
        self.input().cur_pos()
    }

    #[inline(always)]
    pub fn last_pos(&self) -> BytePos {
        self.input().prev_span().hi
    }

    #[inline]
    pub fn is_general_semi(&mut self) -> bool {
        let cur = self.input().cur();
        cur.is_semi() || cur.is_rbrace() || cur.is_eof() || self.input().had_line_break_before_cur()
    }

    pub fn eat_general_semi(&mut self) -> bool {
        if cfg!(feature = "debug") {
            tracing::trace!("eat(';'): cur={:?}", self.input().cur());
        }
        let cur = self.input().cur();
        if cur.is_semi() {
            self.bump();
            true
        } else {
            cur.is_rbrace() || self.input().had_line_break_before_cur() || cur.is_eof()
        }
    }

    #[inline]
    pub fn expect_general_semi(&mut self) -> PResult<()> {
        if !self.eat_general_semi() {
            let span = self.input().cur_span();
            let cur = self.input_mut().dump_cur();
            syntax_error!(self, span, SyntaxError::Expected(";".to_string(), cur))
        }
        Ok(())
    }

    #[inline]
    pub fn expect(&mut self, t: Token) -> PResult<()> {
        if !self.input_mut().eat(t) {
            let span = self.input().cur_span();
            let cur = self.input_mut().dump_cur();
            syntax_error!(self, span, SyntaxError::Expected(format!("{t:?}"), cur))
        } else {
            Ok(())
        }
    }

    #[inline(always)]
    pub fn expect_without_advance(&mut self, t: Token) -> PResult<()> {
        if !self.input_mut().is(t) {
            let span = self.input().cur_span();
            let cur = self.input_mut().dump_cur();
            syntax_error!(self, span, SyntaxError::Expected(format!("{t:?}"), cur))
        } else {
            Ok(())
        }
    }

    #[inline(always)]
    pub fn bump(&mut self) {
        debug_assert!(
            !self.input().cur().is_eof(),
            "parser should not call bump() without knowing current token"
        );
        self.input_mut().bump()
    }

    #[inline]
    pub fn span(&self, start: BytePos) -> Span {
        let end = self.last_pos();
        debug_assert!(
            start <= end,
            "assertion failed: (span.start <= span.end). start = {start:?}, end = {end:?}",
        );
        Span::new_with_checked(start, end)
    }

    #[inline(always)]
    pub fn assert_and_bump(&mut self, token: Token) {
        debug_assert!(
            self.input().is(token),
            "assertion failed: expected {token:?}, got {:?}",
            self.input().cur()
        );
        self.bump();
    }

    pub fn check_assign_target(&mut self, expr: &Expr, deny_call: bool) {
        if !expr.is_valid_simple_assignment_target(self.ctx().contains(Context::Strict)) {
            self.emit_err(expr.span(), SyntaxError::TS2406);
        }

        // We follow behavior of tsc
        if self.input().syntax().typescript() && self.syntax().early_errors() {
            let is_eval_or_arguments = match expr {
                Expr::Ident(i) => i.is_reserved_in_strict_bind(),
                _ => false,
            };

            if is_eval_or_arguments {
                self.emit_strict_mode_err(expr.span(), SyntaxError::TS1100);
            }

            fn should_deny(e: &Expr, deny_call: bool) -> bool {
                match e {
                    Expr::Lit(..) => false,
                    Expr::Call(..) => deny_call,
                    Expr::Bin(..) => false,
                    Expr::Paren(ref p) => should_deny(&p.expr, deny_call),

                    _ => true,
                }
            }

            // It is an early Reference Error if LeftHandSideExpression is neither
            // an ObjectLiteral nor an ArrayLiteral and
            // IsValidSimpleAssignmentTarget of LeftHandSideExpression is false.
            if !is_eval_or_arguments
                && !expr.is_valid_simple_assignment_target(self.ctx().contains(Context::Strict))
                && should_deny(expr, deny_call)
            {
                self.emit_err(expr.span(), SyntaxError::TS2406);
            }
        }
    }

    pub fn parse_tpl_element(&mut self, is_tagged_tpl: bool) -> PResult<TplElement> {
        let start = self.cur_pos();
        let cur = self.input().cur();
        let (raw, cooked) = if cur.is_template() {
            let (cooked, raw) = self.input_mut().expect_template_token_and_bump();
            match cooked {
                Ok(cooked) => (raw, Some(cooked)),
                Err(err) => {
                    if is_tagged_tpl {
                        (raw, None)
                    } else {
                        return Err(err);
                    }
                }
            }
        } else {
            unexpected!(self, "template token")
        };
        let tail = self.input_mut().is(&Self::Token::BACKQUOTE);
        Ok(TplElement {
            span: self.span(start),
            raw,
            tail,
            cooked,
        })
    }

    /// spec: 'PropertyName'
    pub fn parse_prop_name(&mut self) -> PResult<PropName> {
        trace_cur!(self, parse_prop_name);
        self.do_inside_of_context(Context::InPropertyName, |p| {
            let start = p.input().cur_pos();
            let cur = p.input().cur();
            let v = if cur.is_str() {
                PropName::Str(p.parse_str_lit())
            } else if cur.is_num() {
                let (value, raw) = p.input_mut().expect_number_token_and_bump();
                PropName::Num(Number {
                    span: p.span(start),
                    value,
                    raw: Some(raw),
                })
            } else if cur.is_bigint() {
                let (value, raw) = p.input_mut().expect_bigint_token_and_bump();
                PropName::BigInt(BigInt {
                    span: p.span(start),
                    value,
                    raw: Some(raw),
                })
            } else if cur.is_word() {
                let w = p.input_mut().expect_word_token_and_bump();
                PropName::Ident(IdentName::new(w, p.span(start)))
            } else if cur.is_lbracket() {
                p.bump();
                let inner_start = p.input().cur_pos();
                let mut expr = p.allow_in_expr(Self::parse_assignment_expr)?;
                if p.syntax().typescript() && p.input().is(&Self::Token::COMMA) {
                    let mut exprs = vec![expr];
                    while p.input_mut().eat(&Self::Token::COMMA) {
                        //
                        exprs.push(p.allow_in_expr(Self::parse_assignment_expr)?);
                    }
                    p.emit_err(p.span(inner_start), SyntaxError::TS1171);
                    expr = Box::new(
                        SeqExpr {
                            span: p.span(inner_start),
                            exprs,
                        }
                        .into(),
                    );
                }
                expect!(p, &Self::Token::RBRACKET);
                PropName::Computed(ComputedPropName {
                    span: p.span(start),
                    expr,
                })
            } else {
                unexpected!(
                    p,
                    "identifier, string literal, numeric literal or [ for the computed key"
                )
            };
            Ok(v)
        })
    }

    #[inline]
    pub fn is_ident_ref(&mut self) -> bool {
        let cur = self.input().cur();
        cur.is_word() && !cur.is_reserved(self.ctx())
    }

    #[inline]
    pub fn peek_is_ident_ref(&mut self) -> bool {
        let ctx = self.ctx();
        peek!(self).is_some_and(|peek| peek.is_word() && !peek.is_reserved(ctx))
    }

    #[inline(always)]
    pub fn eat_ident_ref(&mut self) -> bool {
        if self.is_ident_ref() {
            self.bump();
            true
        } else {
            false
        }
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
