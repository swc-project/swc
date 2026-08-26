//! Parser-private TSRX syntax and standard TSX lowering.
//!
//! TSRX never escapes this module as a public AST node. Parsing, validation,
//! generated identifiers, React helper tracking, and lowering all live here so
//! builds without the `tsrx` feature do not carry TSRX parser state or
//! branches.
//!
//! `@finally` is lowered to a synchronous JavaScript `try/finally` inside the
//! generated content component. It does not represent the asynchronous lifetime
//! of React Suspense work.
//!
//! This is intentionally a lightweight React lowering. It does not perform hook
//! analysis, helper or static hoisting, scoped CSS extraction, or output
//! optimization parity with the canonical `@tsrx/react` compiler. Raw style
//! content remains a string child of a normal `<style>` element.

use rustc_hash::FxHashSet;
use swc_atoms::{atom, Atom};
use swc_common::{BytePos, EqIgnoreSpan, Span, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;

use super::{input::Tokens, stmt::TempForHead, Parser};
use crate::{error::SyntaxError, lexer::Token, Context, PResult};

const REACT_SOURCE: &str = "react";
const ERROR_BOUNDARY_SOURCE: &str = "@tsrx/react/error-boundary";

/// Returns whether an `@` in JSX text starts a complete TSRX directive shape.
pub(crate) fn is_directive_start(source: &str) -> bool {
    fn trim_trivia(mut source: &str) -> (&str, bool) {
        let original_len = source.len();
        loop {
            source = source.trim_start();
            if let Some(rest) = source.strip_prefix("//") {
                source = rest
                    .find(['\r', '\n'])
                    .map_or("", |line_end| &rest[line_end..]);
                continue;
            }
            if let Some(rest) = source.strip_prefix("/*") {
                let Some(comment_end) = rest.find("*/") else {
                    return ("", true);
                };
                source = &rest[comment_end + 2..];
                continue;
            }
            return (source, source.len() != original_len);
        }
    }

    fn followed_by(source: &str, keyword: &str, expected: char) -> bool {
        source
            .strip_prefix(keyword)
            .map(|rest| trim_trivia(rest).0)
            .is_some_and(|rest| rest.starts_with(expected))
    }

    let Some(source) = source.strip_prefix('@') else {
        return false;
    };
    let source = trim_trivia(source).0;
    source.starts_with('{')
        || followed_by(source, "if", '(')
        || followed_by(source, "switch", '(')
        || followed_by(source, "try", '{')
        || followed_by(source, "for", '(')
        || source.strip_prefix("for").is_some_and(|rest| {
            let (rest, had_trivia) = trim_trivia(rest);
            had_trivia
                && rest
                    .strip_prefix("await")
                    .map(|rest| trim_trivia(rest).0)
                    .is_some_and(|rest| rest.starts_with('('))
        })
}

#[derive(Clone, Copy, Default, PartialEq, Eq)]
enum EntryMode {
    #[default]
    StandaloneExpression,
    Module,
    NonModule,
}

#[derive(Clone, Copy)]
enum SuspensionContext {
    Synchronous,
    Async,
    Generator,
    AsyncGenerator,
}

impl SuspensionContext {
    fn is_async(self) -> bool {
        matches!(self, Self::Async | Self::AsyncGenerator)
    }

    fn is_generator(self) -> bool {
        matches!(self, Self::Generator | Self::AsyncGenerator)
    }
}

#[derive(Clone, Copy)]
enum ReactHelper {
    Suspense,
    Fragment,
    ErrorBoundary,
}

#[derive(Clone, Default)]
struct HelperIdents {
    suspense: Option<Ident>,
    fragment: Option<Ident>,
    error_boundary: Option<Ident>,
}

/// State used only while the `tsrx` Cargo feature is enabled.
#[derive(Clone, Default)]
pub(super) struct TsrxState {
    entry_mode: EntryMode,
    generated_index: u32,
    generated_names: FxHashSet<Atom>,
    source_names: Option<FxHashSet<Atom>>,
    render_spans: FxHashSet<u64>,
    helpers: HelperIdents,
}

impl TsrxState {
    #[inline]
    pub(super) fn enter_module(&mut self) {
        self.entry_mode = EntryMode::Module;
    }

    #[inline]
    pub(super) fn enter_non_module(&mut self) {
        self.entry_mode = EntryMode::NonModule;
    }

    fn generated_ctxt(&self) -> SyntaxContext {
        SyntaxContext::empty()
    }

    fn mark_render(&mut self, span: Span) {
        self.render_spans.insert(span_key(span));
    }

    fn is_render(&self, span: Span) -> bool {
        self.render_spans.contains(&span_key(span))
    }
}

fn span_key(span: Span) -> u64 {
    (u64::from(span.lo.0) << 32) | u64::from(span.hi.0)
}

struct CodeBlock {
    span: Span,
    body: Vec<Stmt>,
    render: Option<Box<Expr>>,
}

enum IfAlternate {
    If(Box<IfDirective>),
    CodeBlock(CodeBlock),
}

struct IfDirective {
    span: Span,
    test: Box<Expr>,
    consequent: CodeBlock,
    alternate: Option<IfAlternate>,
}

enum ForDirectiveHead {
    For {
        init: Option<VarDeclOrExpr>,
        test: Option<Box<Expr>>,
        update: Option<Box<Expr>>,
    },
    ForIn {
        left: ForHead,
        right: Box<Expr>,
    },
    ForOf {
        left: ForHead,
        right: Box<Expr>,
    },
}

struct ForDirective {
    span: Span,
    head: ForDirectiveHead,
    is_await: bool,
    body: CodeBlock,
    index: Option<Ident>,
    key: Option<Box<Expr>>,
    empty: Option<CodeBlock>,
}

struct SwitchDirective {
    span: Span,
    discriminant: Box<Expr>,
    cases: Vec<SwitchDirectiveCase>,
}

struct SwitchDirectiveCase {
    span: Span,
    test: Option<Box<Expr>>,
    consequent: CodeBlock,
}

struct CatchDirective {
    param: Option<Pat>,
    reset_param: Option<Pat>,
    body: CodeBlock,
}

struct TryDirective {
    span: Span,
    block: CodeBlock,
    pending: Option<CodeBlock>,
    handler: Option<CatchDirective>,
    finalizer: Option<BlockStmt>,
}

impl<I: Tokens> Parser<I> {
    /// Returns whether the current `@` begins TSRX rather than a decorator.
    pub(super) fn is_tsrx_expr_start(&mut self) -> bool {
        self.input().syntax().tsrx()
            && self.input().is(Token::At)
            && matches!(
                peek!(self),
                Some(Token::LBrace | Token::If | Token::For | Token::Switch | Token::Try)
            )
    }

    fn ensure_tsrx_module(&self, span: Span) -> PResult<()> {
        match self.tsrx.entry_mode {
            EntryMode::Module => Ok(()),
            EntryMode::NonModule => Err(crate::error::Error::new(
                span,
                SyntaxError::Unexpected {
                    got: "TSRX syntax in a script or CommonJS parser entry point".into(),
                    expected: "an ES module parser entry point",
                },
            )),
            EntryMode::StandaloneExpression => Err(crate::error::Error::new(
                span,
                SyntaxError::Unexpected {
                    got: "TSRX syntax in a standalone expression parser entry point".into(),
                    expected: "parse_module or parse_program",
                },
            )),
        }
    }

    /// Parses a TSRX expression and immediately lowers it to the public TSX
    /// AST.
    pub(super) fn parse_tsrx_expr(&mut self) -> PResult<Box<Expr>> {
        let start = self.cur_pos();
        self.ensure_tsrx_module(self.input().cur_span())?;
        self.assert_and_bump(Token::At);

        let expr = match self.input().cur() {
            Token::LBrace => {
                let mut block = self.parse_tsrx_code_block(false)?;
                block.span = Span::new_with_checked(start, block.span.hi);
                self.lower_code_block_expr(block)
            }
            Token::If => {
                let directive = self.parse_tsrx_if(start)?;
                self.lower_if(directive)
            }
            Token::For => {
                let directive = self.parse_tsrx_for(start)?;
                self.lower_for(directive)
            }
            Token::Switch => {
                let directive = self.parse_tsrx_switch(start)?;
                self.lower_switch(directive)
            }
            Token::Try => {
                let directive = self.parse_tsrx_try(start)?;
                self.lower_try(directive)
            }
            _ => unexpected!(self, "a TSRX statement container or template directive"),
        };

        self.tsrx.mark_render(expr.span());
        Ok(expr)
    }

    fn parse_tsrx_code_block(&mut self, is_function_body: bool) -> PResult<CodeBlock> {
        self.parse_tsrx_code_block_with_directives(is_function_body, false)
    }

    fn parse_tsrx_code_block_with_directives(
        &mut self,
        is_function_body: bool,
        allow_directives: bool,
    ) -> PResult<CodeBlock> {
        let block = self.parse_block(allow_directives)?;
        self.tsrx_code_block_from_block(block, is_function_body)
    }

    fn tsrx_code_block_from_block(
        &mut self,
        mut block: BlockStmt,
        _is_function_body: bool,
    ) -> PResult<CodeBlock> {
        if let Some(stmt) = block.stmts.iter().rev().skip(1).find(|stmt| {
            matches!(stmt, Stmt::Expr(ExprStmt { expr, .. }) if self.is_tsrx_render_expr(expr))
        }) {
            syntax_error!(
                self,
                stmt.span(),
                SyntaxError::Unexpected {
                    got: "rendered output before the end of a TSRX code block".into(),
                    expected: "setup statements followed by at most one rendered output"
                }
            );
        }

        let render = match block.stmts.last() {
            Some(Stmt::Expr(ExprStmt { expr, .. })) if self.is_tsrx_render_expr(expr) => {
                let Stmt::Expr(stmt) = block.stmts.pop().expect("last statement was checked")
                else {
                    unreachable!()
                };
                Some(Self::unwrap_tsrx_render_expr(stmt.expr))
            }
            _ => None,
        };

        Ok(CodeBlock {
            span: block.span,
            body: block.stmts,
            render,
        })
    }

    fn is_tsrx_render_expr(&self, expr: &Expr) -> bool {
        matches!(expr, Expr::JSXElement(_) | Expr::JSXFragment(_))
            || self.tsrx.is_render(expr.span())
            || match expr {
                Expr::Paren(expr) => self.is_tsrx_render_expr(&expr.expr),
                Expr::TsAs(expr) => self.is_tsrx_render_expr(&expr.expr),
                Expr::TsSatisfies(expr) => self.is_tsrx_render_expr(&expr.expr),
                Expr::TsNonNull(expr) => self.is_tsrx_render_expr(&expr.expr),
                Expr::TsTypeAssertion(expr) => self.is_tsrx_render_expr(&expr.expr),
                Expr::TsConstAssertion(expr) => self.is_tsrx_render_expr(&expr.expr),
                Expr::TsInstantiation(expr) => self.is_tsrx_render_expr(&expr.expr),
                _ => false,
            }
    }

    fn unwrap_tsrx_render_expr(mut expr: Box<Expr>) -> Box<Expr> {
        loop {
            match *expr {
                Expr::Paren(paren) => expr = paren.expr,
                _ => return expr,
            }
        }
    }

    fn parse_tsrx_condition(&mut self) -> PResult<Box<Expr>> {
        expect!(self, Token::LParen);
        let test = self.parse_expr()?;
        expect!(self, Token::RParen);
        Ok(test)
    }

    fn parse_tsrx_if(&mut self, start: BytePos) -> PResult<IfDirective> {
        self.assert_and_bump(Token::If);
        let test = self.parse_tsrx_condition()?;
        let consequent = self.parse_tsrx_branch()?;
        let alternate = if self.input().is(Token::At)
            && peek!(self).is_some_and(|token| token == Token::Else)
        {
            self.assert_and_bump(Token::At);
            self.assert_and_bump(Token::Else);
            if self.input().is(Token::If) {
                let nested_start = self.cur_pos();
                Some(IfAlternate::If(Box::new(self.parse_tsrx_if(nested_start)?)))
            } else {
                Some(IfAlternate::CodeBlock(self.parse_tsrx_branch()?))
            }
        } else {
            None
        };

        Ok(IfDirective {
            span: self.span(start),
            test,
            consequent,
            alternate,
        })
    }

    fn parse_tsrx_branch(&mut self) -> PResult<CodeBlock> {
        self.do_outside_of_context(
            Context::IsBreakAllowed.union(Context::IsContinueAllowed),
            |parser| parser.parse_tsrx_code_block(false),
        )
    }

    fn parse_tsrx_for(&mut self, start: BytePos) -> PResult<ForDirective> {
        self.assert_and_bump(Token::For);
        let await_start = self.cur_pos();
        let is_await = self.input_mut().eat(Token::Await);
        let await_span = is_await.then(|| self.span(await_start));
        expect!(self, Token::LParen);

        let head = self.do_inside_of_context(Context::ForLoopInit, |p| {
            if is_await {
                p.do_inside_of_context(Context::ForAwaitLoopInit, Self::parse_for_head)
            } else {
                p.do_outside_of_context(Context::ForAwaitLoopInit, Self::parse_for_head)
            }
        })?;

        let mut index = None;
        let mut key = None;
        if self.input_mut().eat(Token::Semi) {
            if self.is_contextual_word("index") {
                self.bump();
                index = Some(self.parse_binding_ident(false)?.id);
                if self.input_mut().eat(Token::Semi) {
                    if !self.is_contextual_word("key") {
                        unexpected!(self, "`key` after `index` in a TSRX @for header")
                    }
                    self.bump();
                    key = Some(self.allow_in_expr(Self::parse_assignment_expr)?);
                }
            } else if self.is_contextual_word("key") {
                self.bump();
                key = Some(self.allow_in_expr(Self::parse_assignment_expr)?);
            } else {
                unexpected!(self, "`index` or `key` in a TSRX @for header")
            }
        }
        expect!(self, Token::RParen);

        let body = self.do_inside_of_context(
            Context::IsBreakAllowed.union(Context::IsContinueAllowed),
            |p| p.parse_tsrx_code_block(false),
        )?;
        let empty = self.parse_tsrx_named_block("empty")?;

        let head = match head {
            TempForHead::For { init, test, update } => {
                if is_await {
                    syntax_error!(self, await_span.unwrap(), SyntaxError::AwaitForStmt);
                }
                if index.is_some() || key.is_some() {
                    return Err(self.invalid_for_options(start));
                }
                ForDirectiveHead::For { init, test, update }
            }
            TempForHead::ForIn { left, right } => {
                if is_await {
                    syntax_error!(self, await_span.unwrap(), SyntaxError::AwaitForStmt);
                }
                if index.is_some() || key.is_some() {
                    return Err(self.invalid_for_options(start));
                }
                ForDirectiveHead::ForIn { left, right }
            }
            TempForHead::ForOf { left, right } => ForDirectiveHead::ForOf { left, right },
        };

        Ok(ForDirective {
            span: self.span(start),
            head,
            is_await,
            body,
            index,
            key,
            empty,
        })
    }

    fn invalid_for_options(&self, start: BytePos) -> crate::error::Error {
        crate::error::Error::new(
            self.span(start),
            SyntaxError::Unexpected {
                got: "TSRX @for options on a non-for-of loop".into(),
                expected: "`index` and `key` options only on a for-of loop",
            },
        )
    }

    fn parse_tsrx_switch(&mut self, start: BytePos) -> PResult<SwitchDirective> {
        self.assert_and_bump(Token::Switch);
        let discriminant = self.parse_tsrx_condition()?;
        expect!(self, Token::LBrace);
        let cases = self.do_inside_of_context(Context::IsBreakAllowed, |p| {
            let mut cases = Vec::new();
            let mut previous_default = None;
            while !p.input().is(Token::RBrace) {
                let case_start = p.cur_pos();
                expect!(p, Token::At);
                let test = if p.input_mut().eat(Token::Case) {
                    Some(p.parse_expr()?)
                } else if p.input_mut().eat(Token::Default) {
                    if let Some(previous) = previous_default {
                        syntax_error!(p, SyntaxError::MultipleDefault { previous });
                    }
                    previous_default = Some(p.span(case_start));
                    None
                } else {
                    unexpected!(p, "`@case` or `@default` in a TSRX @switch")
                };
                expect!(p, Token::Colon);
                cases.push(SwitchDirectiveCase {
                    span: p.span(case_start),
                    test,
                    consequent: p.parse_tsrx_code_block(false)?,
                });
            }
            Ok(cases)
        })?;
        expect!(self, Token::RBrace);
        Ok(SwitchDirective {
            span: self.span(start),
            discriminant,
            cases,
        })
    }

    fn parse_tsrx_try(&mut self, start: BytePos) -> PResult<TryDirective> {
        self.assert_and_bump(Token::Try);
        let block = self.parse_tsrx_code_block(false)?;
        let pending = self.parse_tsrx_named_block("pending")?;
        let handler = if self.input().is(Token::At)
            && peek!(self).is_some_and(|token| token == Token::Catch)
        {
            self.assert_and_bump(Token::At);
            self.assert_and_bump(Token::Catch);
            let (param, reset_param) = if self.input_mut().eat(Token::LParen) {
                if self.input().is(Token::RParen) {
                    unexpected!(self, "a catch binding or a catch block")
                }
                let param = Some(self.parse_tsrx_catch_binding()?);
                let reset_param = if self.input_mut().eat(Token::Comma) {
                    Some(self.parse_tsrx_catch_binding()?)
                } else {
                    None
                };
                expect!(self, Token::RParen);
                (param, reset_param)
            } else {
                (None, None)
            };
            Some(CatchDirective {
                param,
                reset_param,
                body: self.parse_tsrx_code_block(false)?,
            })
        } else {
            None
        };

        let finalizer = if self.is_tsrx_named_clause("finally") {
            let clause_start = self.cur_pos();
            self.assert_and_bump(Token::At);
            self.bump();
            let mut block = self.parse_block(false)?;
            block.span = Span::new_with_checked(clause_start, block.span.hi);
            Some(block)
        } else {
            None
        };

        if pending.is_none() && handler.is_none() && finalizer.is_none() {
            syntax_error!(
                self,
                self.span(start),
                SyntaxError::Unexpected {
                    got: "a bare TSRX @try block".into(),
                    expected: "an `@pending`, `@catch`, or `@finally` clause"
                }
            );
        }
        Ok(TryDirective {
            span: self.span(start),
            block,
            pending,
            handler,
            finalizer,
        })
    }

    fn parse_tsrx_catch_binding(&mut self) -> PResult<Pat> {
        let mut pat = self.parse_binding_pat_or_ident(false)?;
        if self.input().is(Token::Colon) {
            let type_ann = self.parse_ts_type_ann(true, self.cur_pos())?;
            match &mut pat {
                Pat::Ident(binding) => binding.type_ann = Some(type_ann),
                Pat::Array(array) => array.type_ann = Some(type_ann),
                Pat::Object(object) => object.type_ann = Some(type_ann),
                Pat::Rest(rest) => rest.type_ann = Some(type_ann),
                _ => syntax_error!(self, pat.span(), SyntaxError::InvalidPat),
            }
        }
        Ok(pat)
    }

    fn parse_tsrx_named_block(&mut self, name: &str) -> PResult<Option<CodeBlock>> {
        if !self.is_tsrx_named_clause(name) {
            return Ok(None);
        }
        let clause_start = self.cur_pos();
        self.assert_and_bump(Token::At);
        self.bump();
        let mut block = self.parse_tsrx_code_block(false)?;
        block.span = Span::new_with_checked(clause_start, block.span.hi);
        Ok(Some(block))
    }

    fn is_tsrx_named_clause(&mut self, name: &str) -> bool {
        if !self.input().is(Token::At) {
            return false;
        }
        let next_token = self.input_mut().peek();
        next_token.is_some_and(Token::is_word)
            && self.input().next().is_some_and(|next| match &next.value {
                Some(crate::lexer::TokenValue::Word(word)) => word == name,
                None => self.input().iter.read_string(next.span()) == name,
                _ => false,
            })
    }

    fn is_contextual_word(&self, expected: &str) -> bool {
        self.input().cur().is_word() && self.input().cur().take_word(&self.input) == expected
    }

    /// Parses `function C() @{ ... }` directly into a normal function body.
    pub(super) fn parse_tsrx_function_body(
        &mut self,
        is_simple_parameter_list: bool,
    ) -> PResult<FunctionBody> {
        let start = self.cur_pos();
        self.ensure_tsrx_module(self.input().cur_span())?;
        self.assert_and_bump(Token::At);
        let mut block = self.parse_tsrx_code_block_with_directives(true, true)?;
        if !is_simple_parameter_list {
            if let Some(stmt) = block
                .body
                .iter()
                .take_while(|stmt| stmt.can_precede_directive())
                .find(|stmt| stmt.is_use_strict())
            {
                self.emit_err(stmt.span(), SyntaxError::IllegalLanguageModeDirective);
            }
        }
        block.span = Span::new_with_checked(start, block.span.hi);
        let span = block.span;
        block
            .body
            .push(return_stmt(block.render.unwrap_or_else(null_expr)));
        Ok(FunctionBody {
            span,
            stmts: block.body,
        })
    }

    fn lower_code_block_expr(&mut self, mut block: CodeBlock) -> Box<Expr> {
        let span = block.span;
        block
            .body
            .push(return_stmt(block.render.unwrap_or_else(null_expr)));
        self.suspending_iife(span, block.body, false)
    }

    fn lower_branch(&mut self, mut block: CodeBlock) -> Box<Expr> {
        if block.body.is_empty() {
            return block.render.unwrap_or_else(null_expr);
        }
        let span = block.span;
        block
            .body
            .push(return_stmt(block.render.unwrap_or_else(null_expr)));
        self.suspending_iife(span, block.body, false)
    }

    fn lower_if(&mut self, directive: IfDirective) -> Box<Expr> {
        let alt = match directive.alternate {
            Some(IfAlternate::If(nested)) => self.lower_if(*nested),
            Some(IfAlternate::CodeBlock(block)) => self.lower_branch(block),
            None => null_expr(),
        };
        Box::new(Expr::Cond(CondExpr {
            span: directive.span,
            test: directive.test,
            cons: self.lower_branch(directive.consequent),
            alt,
        }))
    }

    fn lower_for(&mut self, directive: ForDirective) -> Box<Expr> {
        let results = self.fresh_tsrx_ident("_TsrxResults");
        let entered = self.fresh_tsrx_ident("_TsrxEntered");
        let counter = directive
            .index
            .as_ref()
            .map(|_| self.fresh_tsrx_ident("_TsrxIndex"));
        let mut statements = vec![
            var_stmt(
                VarDeclKind::Const,
                results.clone(),
                Box::new(Expr::Array(ArrayLit {
                    span: DUMMY_SP,
                    elems: Vec::new(),
                })),
            ),
            var_stmt(VarDeclKind::Let, entered.clone(), false.into()),
        ];
        if let Some(counter) = &counter {
            statements.push(var_stmt(
                VarDeclKind::Let,
                counter.clone(),
                Number {
                    span: DUMMY_SP,
                    value: 0.0,
                    raw: None,
                }
                .into(),
            ));
        }

        let mut body = vec![assign_stmt(entered.clone(), true.into())];
        if let (Some(index), Some(counter)) = (directive.index, counter) {
            body.push(var_stmt(
                VarDeclKind::Let,
                index,
                Box::new(Expr::Update(UpdateExpr {
                    span: DUMMY_SP,
                    op: op!("++"),
                    prefix: false,
                    arg: counter.into(),
                })),
            ));
        }
        body.extend(directive.body.body);
        if let Some(render) = directive.body.render {
            let render = if let Some(key) = directive.key {
                self.apply_tsrx_key(render, key)
            } else {
                render
            };
            body.push(push_stmt(results.clone(), render));
        }
        let body = Box::new(Stmt::Block(BlockStmt {
            span: directive.body.span,
            ctxt: self.tsrx.generated_ctxt(),
            stmts: body,
        }));
        statements.push(match directive.head {
            ForDirectiveHead::For { init, test, update } => Stmt::For(ForStmt {
                span: directive.span,
                init,
                test,
                update,
                body,
            }),
            ForDirectiveHead::ForIn { left, right } => Stmt::ForIn(ForInStmt {
                span: directive.span,
                left,
                right,
                body,
            }),
            ForDirectiveHead::ForOf { left, right } => Stmt::ForOf(ForOfStmt {
                span: directive.span,
                is_await: directive.is_await,
                left,
                right,
                body,
            }),
        });

        let result = if let Some(empty) = directive.empty {
            Box::new(Expr::Cond(CondExpr {
                span: directive.span,
                test: entered.clone().into(),
                cons: results.clone().into(),
                alt: self.lower_branch(empty),
            }))
        } else {
            results.into()
        };
        statements.push(return_stmt(result));
        self.suspending_iife(directive.span, statements, directive.is_await)
    }

    fn lower_switch(&mut self, directive: SwitchDirective) -> Box<Expr> {
        let cases = directive
            .cases
            .into_iter()
            .map(|case| {
                let mut cons = case.consequent.body;
                if let Some(render) = case.consequent.render {
                    cons.push(return_stmt(render));
                }
                SwitchCase {
                    span: case.span,
                    test: case.test,
                    cons: vec![Stmt::Block(BlockStmt {
                        span: case.consequent.span,
                        ctxt: SyntaxContext::empty(),
                        stmts: cons,
                    })],
                }
            })
            .collect();
        let statements = vec![
            Stmt::Switch(SwitchStmt {
                span: directive.span,
                body_ctxt: self.tsrx.generated_ctxt(),
                discriminant: directive.discriminant,
                cases,
            }),
            return_stmt(null_expr()),
        ];
        self.suspending_iife(directive.span, statements, false)
    }

    fn lower_try(&mut self, directive: TryDirective) -> Box<Expr> {
        let content = self.fresh_tsrx_ident("_TsrxContent");
        let mut content_stmts = directive.block.body;
        content_stmts.push(return_stmt(
            directive.block.render.unwrap_or_else(null_expr),
        ));
        if let Some(finalizer) = directive.finalizer {
            content_stmts = vec![Stmt::Try(Box::new(TryStmt {
                span: directive.span,
                block: BlockStmt {
                    span: directive.block.span,
                    ctxt: self.tsrx.generated_ctxt(),
                    stmts: content_stmts,
                },
                handler: None,
                finalizer: Some(finalizer),
            }))];
        }
        let content_arrow = self.arrow_expr(directive.span, Vec::new(), content_stmts, false);
        let mut statements = vec![var_stmt(VarDeclKind::Const, content.clone(), content_arrow)];
        let content_element = jsx_element(content, Vec::new(), Vec::new(), true);
        let mut rendered = content_element;

        if let Some(pending) = directive.pending {
            let suspense = self.tsrx_helper(ReactHelper::Suspense);
            let fallback = self.lower_branch(pending);
            rendered = jsx_element(
                suspense,
                vec![jsx_expr_attr("fallback", fallback)],
                vec![JSXElementChild::JSXElement(Box::new(rendered))],
                false,
            );
        }

        if let Some(handler) = directive.handler {
            let boundary = self.tsrx_helper(ReactHelper::ErrorBoundary);
            let error = handler
                .param
                .unwrap_or_else(|| Pat::Ident(self.fresh_tsrx_ident("_TsrxError").into()));
            let reset = handler
                .reset_param
                .unwrap_or_else(|| Pat::Ident(self.fresh_tsrx_ident("_TsrxReset").into()));
            let mut fallback_stmts = handler.body.body;
            fallback_stmts.push(return_stmt(handler.body.render.unwrap_or_else(null_expr)));
            let fallback =
                self.arrow_expr(handler.body.span, vec![error, reset], fallback_stmts, false);
            rendered = jsx_element(
                boundary,
                vec![jsx_expr_attr("fallback", fallback)],
                vec![JSXElementChild::JSXElement(Box::new(rendered))],
                false,
            );
        }

        statements.push(return_stmt(Box::new(Expr::JSXElement(Box::new(rendered)))));
        self.suspending_iife(directive.span, statements, false)
    }

    fn apply_tsrx_key(&mut self, mut render: Box<Expr>, key: Box<Expr>) -> Box<Expr> {
        if let Expr::JSXElement(element) = &mut *render {
            let has_key = element.opening.attrs.iter().any(|attr| {
                matches!(attr, JSXAttrOrSpread::JSXAttr(JSXAttr {
                    name: JSXAttrName::Ident(name),
                    ..
                }) if name.sym == "key")
            });
            if !has_key {
                element.opening.attrs.push(jsx_expr_attr("key", key));
            }
            return render;
        }

        let fragment = self.tsrx_helper(ReactHelper::Fragment);
        Box::new(Expr::JSXElement(Box::new(jsx_element(
            fragment,
            vec![jsx_expr_attr("key", key)],
            vec![jsx_expr_child(render)],
            false,
        ))))
    }

    pub(super) fn parse_tsrx_shorthand_attr(&mut self, start: BytePos) -> PResult<JSXAttrOrSpread> {
        self.ensure_tsrx_module(self.span(start))?;
        let ident = self.parse_binding_ident(false)?.id;
        expect!(self, Token::RBrace);
        let span = self.span(start);
        Ok(JSXAttrOrSpread::JSXAttr(JSXAttr {
            span,
            name: JSXAttrName::Ident(IdentName::new(ident.sym.clone(), ident.span)),
            value: Some(JSXAttrValue::JSXExprContainer(JSXExprContainer {
                span,
                expr: JSXExpr::Expr(Box::new(Expr::Ident(ident))),
            })),
        }))
    }

    pub(super) fn parse_tsrx_dynamic_jsx_element(
        &mut self,
        start: BytePos,
        in_expr_context: bool,
    ) -> PResult<Box<Expr>> {
        self.ensure_tsrx_module(self.span(start))?;
        let container = self.parse_jsx_expr_container()?;
        let JSXExpr::Expr(tag) = container.expr else {
            syntax_error!(
                self,
                container.span,
                SyntaxError::Unexpected {
                    got: "an empty TSRX dynamic element name".into(),
                    expected: "an identifier, member expression, or static string"
                }
            )
        };
        if !Self::is_valid_tsrx_dynamic_element_name(&tag) {
            syntax_error!(
                self,
                tag.span(),
                SyntaxError::Unexpected {
                    got: "an unsupported TSRX dynamic element name".into(),
                    expected: "an identifier, member expression, or static string"
                }
            );
        }

        let attrs = self.parse_jsx_attrs()?;
        let (children, self_closing) = if self.input().is(Token::Gt) {
            self.input_mut().scan_jsx_token();
            let children = self.parse_jsx_children();
            self.expect(Token::LessSlash)?;
            if !self.input().is(Token::LBrace) {
                unexpected!(self, "a TSRX dynamic closing element name")
            }
            let closing = self.parse_jsx_expr_container()?;
            let JSXExpr::Expr(closing_tag) = closing.expr else {
                syntax_error!(
                    self,
                    closing.span,
                    SyntaxError::Unexpected {
                        got: "an empty TSRX dynamic closing element name".into(),
                        expected: "an identifier, member expression, or static string"
                    }
                )
            };
            if !tag.eq_ignore_span(&closing_tag) {
                syntax_error!(
                    self,
                    closing_tag.span(),
                    SyntaxError::JSXExpectedClosingTag {
                        tag: Atom::new("dynamic TSRX element"),
                    }
                );
            }
            self.input_mut().rescan_jsx_open_el_terminal_token();
            self.expect_without_advance(Token::Gt)?;
            if in_expr_context {
                self.bump();
            } else {
                self.input_mut().scan_jsx_token();
            }
            (children, false)
        } else {
            self.expect(Token::Slash)?;
            self.input_mut().rescan_jsx_open_el_terminal_token();
            self.expect_without_advance(Token::Gt)?;
            if in_expr_context {
                self.bump();
            } else {
                self.input_mut().scan_jsx_token();
            }
            (Vec::new(), true)
        };

        let span = if in_expr_context {
            self.span(start)
        } else {
            Span::new_with_checked(start, self.cur_pos())
        };
        let alias = self.fresh_tsrx_ident("_TsrxTag");
        let element = JSXElement {
            span,
            opening: JSXOpeningElement {
                name: JSXElementName::Ident(alias.clone()),
                span,
                attrs,
                self_closing,
                type_args: None,
            },
            children,
            closing: (!self_closing).then(|| JSXClosingElement {
                span,
                name: JSXElementName::Ident(alias.clone()),
            }),
        };
        let expr = self.suspending_iife(
            span,
            vec![
                var_stmt(VarDeclKind::Const, alias, tag),
                return_stmt(Box::new(Expr::JSXElement(Box::new(element)))),
            ],
            false,
        );
        self.tsrx.mark_render(expr.span());
        Ok(expr)
    }

    fn is_valid_tsrx_dynamic_element_name(expr: &Expr) -> bool {
        match expr {
            Expr::Ident(_) | Expr::Lit(Lit::Str(_)) => true,
            Expr::Tpl(template) => template.exprs.is_empty(),
            Expr::Member(member) => Self::is_valid_tsrx_dynamic_element_name(&member.obj),
            Expr::Paren(paren) => Self::is_valid_tsrx_dynamic_element_name(&paren.expr),
            Expr::TsAs(expr) => Self::is_valid_tsrx_dynamic_element_name(&expr.expr),
            Expr::TsSatisfies(expr) => Self::is_valid_tsrx_dynamic_element_name(&expr.expr),
            Expr::TsTypeAssertion(expr) => Self::is_valid_tsrx_dynamic_element_name(&expr.expr),
            Expr::TsNonNull(expr) => Self::is_valid_tsrx_dynamic_element_name(&expr.expr),
            Expr::OptChain(chain) => match &*chain.base {
                OptChainBase::Member(member) => {
                    Self::is_valid_tsrx_dynamic_element_name(&member.obj)
                }
                OptChainBase::Call(_) => false,
                #[cfg(swc_ast_unknown)]
                _ => false,
            },
            _ => false,
        }
    }

    pub(super) fn parse_tsrx_raw_style_element(
        &mut self,
        start: BytePos,
        opening: JSXOpeningElement,
        in_expr_context: bool,
    ) -> PResult<JSXElement> {
        self.ensure_tsrx_module(self.span(start))?;
        let css_start = self.input().cur_span().hi;
        let remaining = self
            .input()
            .iter
            .read_string(Span::new_with_checked(css_start, self.input().end_pos()));
        let Some(relative_end) = find_style_closing_tag(remaining) else {
            syntax_error!(
                self,
                self.input().cur_span(),
                SyntaxError::JSXExpectedClosingTag {
                    tag: Atom::new("style"),
                }
            )
        };
        let css_end = css_start + BytePos(relative_end as u32);
        let css = self
            .input()
            .iter
            .read_string(Span::new_with_checked(css_start, css_end))
            .into();
        self.input_mut().rescan_jsx_token_from(css_end);
        let closing = self.parse_jsx_closing_element(in_expr_context, &opening.name)?;
        let span = if in_expr_context {
            Span::new_with_checked(start, self.last_pos())
        } else {
            Span::new_with_checked(start, self.cur_pos())
        };
        Ok(JSXElement {
            span,
            opening,
            children: vec![JSXElementChild::JSXExprContainer(JSXExprContainer {
                span: Span::new_with_checked(css_start, css_end),
                expr: JSXExpr::Expr(Box::new(Expr::Lit(Lit::Str(Str {
                    span: Span::new_with_checked(css_start, css_end),
                    value: css,
                    raw: None,
                })))),
            })],
            closing: Some(closing),
        })
    }

    fn suspension_context(&self) -> SuspensionContext {
        let context = self.ctx();
        match (
            context.contains(Context::InAsync),
            context.contains(Context::InGenerator),
        ) {
            (false, false) => SuspensionContext::Synchronous,
            (true, false) => SuspensionContext::Async,
            (false, true) => SuspensionContext::Generator,
            (true, true) => SuspensionContext::AsyncGenerator,
        }
    }

    fn suspending_iife(&mut self, span: Span, stmts: Vec<Stmt>, requires_async: bool) -> Box<Expr> {
        let suspension = self.suspension_context();
        let is_async = suspension.is_async() || requires_async;
        let callee = if suspension.is_generator() {
            Box::new(Expr::Fn(FnExpr {
                ident: None,
                function: Box::new(Function {
                    span,
                    ctxt: self.tsrx.generated_ctxt(),
                    params: Vec::new(),
                    decorators: Vec::new(),
                    body: Some(FunctionBody { span, stmts }),
                    is_generator: true,
                    is_async,
                    type_params: None,
                    return_type: None,
                    this_param: None,
                }),
            }))
        } else {
            Box::new(Expr::Paren(ParenExpr {
                span,
                expr: self.arrow_expr(span, Vec::new(), stmts, is_async),
            }))
        };
        let call = Box::new(Expr::Call(CallExpr {
            span,
            ctxt: self.tsrx.generated_ctxt(),
            callee: Callee::Expr(callee),
            args: Vec::new(),
            type_args: None,
        }));

        match suspension {
            SuspensionContext::Synchronous => call,
            SuspensionContext::Async => Box::new(Expr::Await(AwaitExpr { span, arg: call })),
            SuspensionContext::Generator | SuspensionContext::AsyncGenerator => {
                Box::new(Expr::Yield(YieldExpr {
                    span,
                    arg: Some(call),
                    delegate: true,
                }))
            }
        }
    }

    fn arrow_expr(
        &mut self,
        span: Span,
        params: Vec<Pat>,
        stmts: Vec<Stmt>,
        is_async: bool,
    ) -> Box<Expr> {
        Box::new(Expr::Arrow(ArrowExpr {
            span,
            ctxt: self.tsrx.generated_ctxt(),
            params,
            body: Box::new(ArrowFunctionBody::FunctionBody(FunctionBody {
                span,
                stmts,
            })),
            is_async,
            is_generator: false,
            type_params: None,
            return_type: None,
        }))
    }

    fn fresh_tsrx_ident(&mut self, preferred: &str) -> Ident {
        if self.tsrx.source_names.is_none() {
            let source = self.input().iter.read_string(Span::new_with_checked(
                self.input().iter.start_pos(),
                self.input().end_pos(),
            ));
            self.tsrx.source_names = Some(collect_identifier_names(source));
        }

        let sym = loop {
            let index = self.tsrx.generated_index;
            self.tsrx.generated_index += 1;
            let candidate: Atom = if index == 0 {
                Atom::new(preferred)
            } else {
                format!("{preferred}{index}").into()
            };
            let collides_with_source = self
                .tsrx
                .source_names
                .as_ref()
                .expect("source identifiers were collected")
                .contains(&candidate);
            if !collides_with_source && self.tsrx.generated_names.insert(candidate.clone()) {
                break candidate;
            }
        };
        Ident::new_no_ctxt(sym, DUMMY_SP)
    }

    fn tsrx_helper(&mut self, helper: ReactHelper) -> Ident {
        let existing = match helper {
            ReactHelper::Suspense => &self.tsrx.helpers.suspense,
            ReactHelper::Fragment => &self.tsrx.helpers.fragment,
            ReactHelper::ErrorBoundary => &self.tsrx.helpers.error_boundary,
        };
        if let Some(existing) = existing {
            return existing.clone();
        }
        let preferred = match helper {
            ReactHelper::Suspense => "_TsrxSuspense",
            ReactHelper::Fragment => "_TsrxFragment",
            ReactHelper::ErrorBoundary => "_TsrxErrorBoundary",
        };
        let ident = self.fresh_tsrx_ident(preferred);
        match helper {
            ReactHelper::Suspense => self.tsrx.helpers.suspense = Some(ident.clone()),
            ReactHelper::Fragment => self.tsrx.helpers.fragment = Some(ident.clone()),
            ReactHelper::ErrorBoundary => {
                self.tsrx.helpers.error_boundary = Some(ident.clone());
            }
        }
        ident
    }

    pub(super) fn finish_tsrx_module(&mut self, body: &mut Vec<ModuleItem>) {
        if !self.syntax().tsrx() {
            return;
        }
        let mut imports = Vec::with_capacity(2);
        let mut react = Vec::with_capacity(2);
        if let Some(local) = &self.tsrx.helpers.suspense {
            react.push(import_specifier("Suspense", local.clone()));
        }
        if let Some(local) = &self.tsrx.helpers.fragment {
            react.push(import_specifier("Fragment", local.clone()));
        }
        if !react.is_empty() {
            imports.push(import_decl(REACT_SOURCE, react));
        }
        if let Some(local) = &self.tsrx.helpers.error_boundary {
            imports.push(import_decl(
                ERROR_BOUNDARY_SOURCE,
                vec![import_specifier("TsrxErrorBoundary", local.clone())],
            ));
        }
        if imports.is_empty() {
            return;
        }
        let directive_end = body
            .iter()
            .take_while(|item| {
                matches!(item, ModuleItem::Stmt(Stmt::Expr(ExprStmt {
                    expr,
                    ..
                })) if matches!(&**expr, Expr::Lit(Lit::Str(_))))
            })
            .count();
        body.splice(directive_end..directive_end, imports);
    }
}

/// Collects a conservative superset of source identifiers in one pass.
///
/// Strings and comments are intentionally included: extra names only make a
/// generated identifier slightly longer, while decoding escapes here prevents
/// generated bindings from colliding with identifiers such as `\u005fTsrxTag`.
fn collect_identifier_names(source: &str) -> FxHashSet<Atom> {
    let mut names = FxHashSet::default();
    let mut offset = 0;

    while offset < source.len() {
        let Some((first, next)) = identifier_char(source, offset) else {
            offset += source[offset..]
                .chars()
                .next()
                .expect("offset is within the source")
                .len_utf8();
            continue;
        };
        if !Ident::is_valid_start(first) {
            offset = next;
            continue;
        }

        let mut name = String::new();
        name.push(first);
        offset = next;
        while offset < source.len() {
            let Some((ch, next)) = identifier_char(source, offset) else {
                break;
            };
            if !Ident::is_valid_continue(ch) {
                break;
            }
            name.push(ch);
            offset = next;
        }
        names.insert(name.into());
    }

    names
}

fn identifier_char(source: &str, offset: usize) -> Option<(char, usize)> {
    if source.as_bytes()[offset] != b'\\' {
        let ch = source[offset..].chars().next()?;
        return Some((ch, offset + ch.len_utf8()));
    }

    let escape = source.as_bytes().get(offset + 1..)?;
    if escape.first() != Some(&b'u') {
        return None;
    }

    if escape.get(1) == Some(&b'{') {
        let digits_start = offset + 3;
        let relative_end = source
            .as_bytes()
            .get(digits_start..)?
            .iter()
            .position(|&byte| byte == b'}')?;
        if relative_end == 0 || relative_end > 6 {
            return None;
        }
        let end = digits_start + relative_end;
        let value = u32::from_str_radix(&source[digits_start..end], 16).ok()?;
        return char::from_u32(value).map(|ch| (ch, end + 1));
    }

    let digits_start = offset + 2;
    let end = digits_start.checked_add(4)?;
    let digits = source.get(digits_start..end)?;
    let value = u32::from_str_radix(digits, 16).ok()?;
    char::from_u32(value).map(|ch| (ch, end))
}

fn null_expr() -> Box<Expr> {
    Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP })))
}

fn return_stmt(arg: Box<Expr>) -> Stmt {
    Stmt::Return(ReturnStmt {
        span: arg.span(),
        arg: Some(arg),
    })
}

fn var_stmt(kind: VarDeclKind, ident: Ident, init: Box<Expr>) -> Stmt {
    Stmt::Decl(Decl::Var(Box::new(VarDecl {
        span: DUMMY_SP,
        ctxt: ident.ctxt,
        kind,
        declare: false,
        decls: vec![VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(ident.into()),
            init: Some(init),
            definite: false,
        }],
    })))
}

fn assign_stmt(ident: Ident, value: Box<Expr>) -> Stmt {
    Stmt::Expr(ExprStmt {
        span: DUMMY_SP,
        expr: Box::new(Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            op: op!("="),
            left: ident.into(),
            right: value,
        })),
    })
}

fn push_stmt(results: Ident, value: Box<Expr>) -> Stmt {
    Stmt::Expr(ExprStmt {
        span: DUMMY_SP,
        expr: Box::new(Expr::Call(CallExpr {
            span: DUMMY_SP,
            ctxt: results.ctxt,
            callee: Callee::Expr(Box::new(Expr::Member(MemberExpr {
                span: DUMMY_SP,
                obj: results.into(),
                prop: MemberProp::Ident(IdentName::new(atom!("push"), DUMMY_SP)),
            }))),
            args: vec![value.into()],
            type_args: None,
        })),
    })
}

fn jsx_expr_attr(name: &str, value: Box<Expr>) -> JSXAttrOrSpread {
    JSXAttrOrSpread::JSXAttr(JSXAttr {
        span: DUMMY_SP,
        name: JSXAttrName::Ident(IdentName::new(Atom::new(name), DUMMY_SP)),
        value: Some(JSXAttrValue::JSXExprContainer(JSXExprContainer {
            span: DUMMY_SP,
            expr: JSXExpr::Expr(value),
        })),
    })
}

fn jsx_expr_child(expr: Box<Expr>) -> JSXElementChild {
    JSXElementChild::JSXExprContainer(JSXExprContainer {
        span: expr.span(),
        expr: JSXExpr::Expr(expr),
    })
}

fn jsx_element(
    name: Ident,
    attrs: Vec<JSXAttrOrSpread>,
    children: Vec<JSXElementChild>,
    self_closing: bool,
) -> JSXElement {
    JSXElement {
        span: DUMMY_SP,
        opening: JSXOpeningElement {
            name: JSXElementName::Ident(name.clone()),
            span: DUMMY_SP,
            attrs,
            self_closing,
            type_args: None,
        },
        children,
        closing: (!self_closing).then(|| JSXClosingElement {
            span: DUMMY_SP,
            name: JSXElementName::Ident(name),
        }),
    }
}

fn import_specifier(imported: &str, local: Ident) -> ImportSpecifier {
    ImportSpecifier::Named(ImportNamedSpecifier {
        span: DUMMY_SP,
        local,
        imported: Some(ModuleExportName::Ident(Ident::new_no_ctxt(
            Atom::new(imported),
            DUMMY_SP,
        ))),
        is_type_only: false,
    })
}

fn import_decl(source: &str, specifiers: Vec<ImportSpecifier>) -> ModuleItem {
    ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
        span: DUMMY_SP,
        specifiers,
        src: Box::new(Str {
            span: DUMMY_SP,
            value: source.into(),
            raw: None,
        }),
        type_only: false,
        with: None,
        phase: ImportPhase::Evaluation,
    }))
}

fn find_style_closing_tag(source: &str) -> Option<usize> {
    source
        .match_indices("</style")
        .find_map(|(index, closing)| {
            source
                .as_bytes()
                .get(index + closing.len())
                .is_some_and(|byte| *byte == b'>' || byte.is_ascii_whitespace())
                .then_some(index)
        })
}

#[cfg(test)]
mod tests {
    use swc_ecma_ast::{Decl, ModuleItem, Stmt};

    use super::super::test_parser;
    use crate::{Syntax, TsSyntax};

    fn syntax() -> Syntax {
        Syntax::Typescript(TsSyntax {
            tsrx: true,
            ..Default::default()
        })
    }

    #[test]
    fn lowers_tsrx_to_standard_ast() {
        let module = test_parser(
            r#"
"use client";
function View(items: Item[]) @{
    const visible = true;
    <main {visible}>
        @if (visible) { <Shown /> } @else { <Hidden /> }
        @for (const item of items; index index; key item.id) {
            if (!item) continue;
            <Row item={item} />
        } @empty { <Empty /> }
        @switch (items.length) {
            @case 0: { <Empty /> }
            @default: { break; }
        }
        @try { <Content /> }
        @pending { <Loading /> }
        @catch (error, reset) { <Failure error={error} reset={reset} /> }
        @finally { cleanup(); }
        <{View.Tag}></{View.Tag}>
        <style>.item > button:hover { color: red; }</style>
    </main>
}
"#,
            syntax(),
            |parser| parser.parse_module(),
        );

        assert!(matches!(
            module.body.last(),
            Some(ModuleItem::Stmt(Stmt::Decl(Decl::Fn(_))))
        ));
        assert!(module.body.iter().any(|item| matches!(
            item,
            ModuleItem::ModuleDecl(swc_ecma_ast::ModuleDecl::Import(_))
        )));
    }

    #[test]
    fn parse_program_is_always_a_module() {
        let program = test_parser("const value = 1;", syntax(), |parser| {
            parser.parse_program()
        });
        assert!(program.is_module());
    }
}
