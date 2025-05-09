use std::ops::DerefMut;

use swc_common::Spanned;
use typed_arena::Arena;

use super::*;
use crate::{
    common::parser::{
        class_and_fn::parse_decorators,
        expr::{parse_assignment_expr, parse_await_expr, parse_bin_op_recursively},
        ident::{parse_binding_ident, parse_label_ident},
        is_directive::IsDirective,
        pat::parse_binding_pat_or_ident,
        stmt::{
            parse_for_stmt, parse_if_stmt, parse_return_stmt, parse_throw_stmt, parse_using_decl,
            parse_var_stmt, parse_with_stmt,
        },
        typescript::{
            parse_ts_enum_decl, parse_ts_interface_decl, parse_ts_type, parse_ts_type_alias_decl,
        },
    },
    error::SyntaxError,
    tok,
};

mod module_item;

impl<'a, I: Tokens<TokenAndSpan>> Parser<I> {
    // pub fn parse_module_item(&mut self) -> PResult<ModuleItem> {
    //     self.with_ctx(self.ctx() | Context::TopLevel)
    //         .parse_stmt_like(true)
    // }

    pub(super) fn parse_block_body<Type>(
        &mut self,
        mut allow_directives: bool,
        end: Option<&'static Token>,
    ) -> PResult<Vec<Type>>
    where
        Self: StmtLikeParser<'a, Type>,
        Type: IsDirective + From<Stmt>,
    {
        trace_cur!(self, parse_block_body);

        let old_ctx = self.ctx();

        let stmts = Arena::new();
        while {
            if self.input.cur().is_none() && end.is_some() {
                let eof_text = self.input.dump_cur();
                self.emit_err(
                    self.input.cur_span(),
                    SyntaxError::Expected(format!("{:?}", end.unwrap()), eof_text),
                );
                false
            } else {
                let c = cur!(self, false).ok();
                c != end
            }
        } {
            let stmt = self.parse_stmt_like(true)?;
            if allow_directives {
                allow_directives = false;
                if stmt.is_use_strict() {
                    self.set_ctx(old_ctx | Context::Strict);
                    if self.input.knows_cur() && !is!(self, ';') {
                        unreachable!(
                            "'use strict'; directive requires parser.input.cur to be empty or \
                             '}}', but current token was: {:?}",
                            self.input.cur()
                        )
                    }
                }
            }

            stmts.alloc(stmt);
        }

        if self.input.cur().is_some() && end.is_some() {
            bump!(self);
        }

        self.set_ctx(old_ctx);

        Ok(stmts.into_vec())
    }

    /// Parse a statement but not a declaration.
    pub fn parse_stmt(&mut self) -> PResult<Stmt> {
        trace_cur!(self, parse_stmt);
        self.parse_stmt_like(false)
    }

    /// Parse a statement and maybe a declaration.
    pub fn parse_stmt_list_item(&mut self) -> PResult<Stmt> {
        trace_cur!(self, parse_stmt_list_item);
        self.parse_stmt_like(true)
    }

    /// Parse a statement, declaration or module item.
    fn parse_stmt_like<Type>(&mut self, include_decl: bool) -> PResult<Type>
    where
        Self: StmtLikeParser<'a, Type>,
        Type: IsDirective + From<Stmt>,
    {
        trace_cur!(self, parse_stmt_like);

        let _tracing = debug_tracing!(self, "parse_stmt_like");

        let start = cur_pos!(self);
        let decorators = parse_decorators(self, true)?;

        if is_one_of!(self, "import", "export") {
            return self.handle_import_export(decorators);
        }

        self.with_ctx((self.ctx() & !Context::WillExpectColonForCond) | Context::AllowUsingDecl)
            .parse_stmt_internal(start, include_decl, decorators)
            .map(From::from)
    }

    /// `parseStatementContent`
    fn parse_stmt_internal(
        &mut self,
        start: BytePos,
        include_decl: bool,
        decorators: Vec<Decorator>,
    ) -> PResult<Stmt> {
        trace_cur!(self, parse_stmt_internal);

        let is_typescript = self.input.syntax().typescript();

        if is_typescript && is!(self, "const") && peeked_is!(self, "enum") {
            assert_and_bump!(self, "const");
            assert_and_bump!(self, "enum");
            return parse_ts_enum_decl(self, start, true)
                .map(Decl::from)
                .map(Stmt::from);
        }

        let top_level = self.ctx().contains(Context::TopLevel);
        match cur!(self, true) {
            tok!("await") if include_decl || top_level => {
                if top_level {
                    self.found_module_item = true;
                    if !self.ctx().contains(Context::CanBeModule) {
                        self.emit_err(self.input.cur_span(), SyntaxError::TopLevelAwaitInScript);
                    }
                }

                if peeked_is!(self, "using") {
                    let eaten_await = Some(self.input.cur_pos());
                    assert_and_bump!(self, "await");
                    let v = parse_using_decl(self, start, true)?;
                    if let Some(v) = v {
                        return Ok(v.into());
                    }

                    let expr = parse_await_expr(self, eaten_await)?;
                    let expr =
                        parse_bin_op_recursively(self.include_in_expr(true).deref_mut(), expr, 0)?;
                    eat!(self, ';');

                    let span = span!(self, start);
                    return Ok(ExprStmt { span, expr }.into());
                }
            }

            tok!("break") | tok!("continue") => {
                let is_break = is!(self, "break");
                bump!(self);

                let label = if eat!(self, ';') {
                    None
                } else {
                    let i = parse_label_ident(self).map(Some)?;
                    expect!(self, ';');
                    i
                };

                let span = span!(self, start);
                if is_break {
                    if label.is_some() && !self.state.labels.contains(&label.as_ref().unwrap().sym)
                    {
                        self.emit_err(span, SyntaxError::TS1116);
                    } else if !self.ctx().contains(Context::IsBreakAllowed) {
                        self.emit_err(span, SyntaxError::TS1105);
                    }
                } else if !self.ctx().contains(Context::IsContinueAllowed) {
                    self.emit_err(span, SyntaxError::TS1115);
                } else if label.is_some()
                    && !self.state.labels.contains(&label.as_ref().unwrap().sym)
                {
                    self.emit_err(span, SyntaxError::TS1107);
                }

                return Ok(if is_break {
                    BreakStmt { span, label }.into()
                } else {
                    ContinueStmt { span, label }.into()
                });
            }

            tok!("debugger") => {
                bump!(self);
                expect!(self, ';');
                return Ok(DebuggerStmt {
                    span: span!(self, start),
                }
                .into());
            }

            tok!("do") => {
                return self.parse_do_stmt();
            }

            tok!("for") => {
                return parse_for_stmt(self);
            }

            tok!("function") => {
                if !include_decl {
                    self.emit_err(self.input.cur_span(), SyntaxError::DeclNotAllowed);
                }

                return self.parse_fn_decl(decorators).map(Stmt::from);
            }

            tok!("class") => {
                if !include_decl {
                    self.emit_err(self.input.cur_span(), SyntaxError::DeclNotAllowed);
                }
                return self
                    .parse_class_decl(start, start, decorators, false)
                    .map(Stmt::from);
            }

            tok!("if") => {
                return parse_if_stmt(self).map(Stmt::If);
            }

            tok!("return") => {
                return parse_return_stmt(self);
            }

            tok!("switch") => {
                return self.parse_switch_stmt();
            }

            tok!("throw") => {
                return parse_throw_stmt(self);
            }

            // Error recovery
            tok!("catch") => {
                let span = self.input.cur_span();
                self.emit_err(span, SyntaxError::TS1005);

                let _ = self.parse_catch_clause();
                let _ = self.parse_finally_block();

                return Ok(ExprStmt {
                    span,
                    expr: Invalid { span }.into(),
                }
                .into());
            }

            // Error recovery
            tok!("finally") => {
                let span = self.input.cur_span();
                self.emit_err(span, SyntaxError::TS1005);

                let _ = self.parse_finally_block();

                return Ok(ExprStmt {
                    span,
                    expr: Invalid { span }.into(),
                }
                .into());
            }

            tok!("try") => {
                return self.parse_try_stmt();
            }

            tok!("with") => {
                return parse_with_stmt(self);
            }

            tok!("while") => {
                return self.parse_while_stmt();
            }

            tok!("var") => {
                let v = parse_var_stmt(self, false)?;
                return Ok(v.into());
            }

            tok!("const") if include_decl => {
                let v = parse_var_stmt(self, false)?;
                return Ok(v.into());
            }

            // 'let' can start an identifier reference.
            tok!("let") if include_decl => {
                let strict = self.ctx().contains(Context::Strict);
                let is_keyword = match peek!(self) {
                    Some(t) => t.kind().follows_keyword_let(strict),
                    _ => false,
                };

                if is_keyword {
                    let v = parse_var_stmt(self, false)?;
                    return Ok(v.into());
                }
            }

            tok!("using") if include_decl => {
                let v = parse_using_decl(self, start, false)?;
                if let Some(v) = v {
                    return Ok(v.into());
                }
            }

            tok!("interface") => {
                if is_typescript
                    && peeked_is!(self, IdentName)
                    && !self.input.has_linebreak_between_cur_and_peeked()
                {
                    let start = self.input.cur_pos();
                    bump!(self);
                    return Ok(parse_ts_interface_decl(self, start)?.into());
                }
            }

            tok!("type") => {
                if is_typescript
                    && peeked_is!(self, IdentName)
                    && !self.input.has_linebreak_between_cur_and_peeked()
                {
                    let start = self.input.cur_pos();
                    bump!(self);
                    return Ok(parse_ts_type_alias_decl(self, start)?.into());
                }
            }

            tok!("enum") => {
                if is_typescript
                    && peeked_is!(self, IdentName)
                    && !self.input.has_linebreak_between_cur_and_peeked()
                {
                    let start = self.input.cur_pos();
                    bump!(self);
                    return Ok(parse_ts_enum_decl(self, start, false)?.into());
                }
            }

            tok!('{') => {
                return self
                    .with_ctx(self.ctx() | Context::AllowUsingDecl)
                    .parse_block(false)
                    .map(Stmt::Block);
            }

            _ => {}
        }

        if eat_exact!(self, ';') {
            return Ok(EmptyStmt {
                span: span!(self, start),
            }
            .into());
        }

        // Handle async function foo() {}
        if is!(self, "async")
            && peeked_is!(self, "function")
            && !self.input.has_linebreak_between_cur_and_peeked()
        {
            return self.parse_async_fn_decl(decorators).map(From::from);
        }

        // If the statement does not start with a statement keyword or a
        // brace, it's an ExpressionStatement or LabeledStatement. We
        // simply start parsing an expression, and afterwards, if the
        // next token is a colon and the expression was a simple
        // Identifier node, we switch to interpreting it as a label.
        let expr = self.include_in_expr(true).parse_expr()?;

        let expr = match *expr {
            Expr::Ident(ident) => {
                if eat!(self, ':') {
                    return self.parse_labelled_stmt(ident);
                }
                ident.into()
            }
            _ => self.verify_expr(expr)?,
        };
        if let Expr::Ident(ref ident) = *expr {
            if &*ident.sym == "interface" && self.input.had_line_break_before_cur() {
                self.emit_strict_mode_err(
                    ident.span,
                    SyntaxError::InvalidIdentInStrict(ident.sym.clone()),
                );

                eat!(self, ';');

                return Ok(ExprStmt {
                    span: span!(self, start),
                    expr,
                }
                .into());
            }

            if self.input.syntax().typescript() {
                if let Some(decl) = self.parse_ts_expr_stmt(decorators, ident.clone())? {
                    return Ok(decl.into());
                }
            }
        }

        if let Expr::Ident(Ident { ref sym, span, .. }) = *expr {
            match &**sym {
                "enum" | "interface" => {
                    self.emit_strict_mode_err(span, SyntaxError::InvalidIdentInStrict(sym.clone()));
                }
                _ => {}
            }
        }

        if self.syntax().typescript() {
            if let Expr::Ident(ref i) = *expr {
                match &*i.sym {
                    "public" | "static" | "abstract" => {
                        if eat!(self, "interface") {
                            self.emit_err(i.span, SyntaxError::TS2427);
                            return parse_ts_interface_decl(self, start)
                                .map(Decl::from)
                                .map(Stmt::from);
                        }
                    }
                    _ => {}
                }
            }
        }

        if eat!(self, ';') {
            Ok(ExprStmt {
                span: span!(self, start),
                expr,
            }
            .into())
        } else {
            if let Token::BinOp(..) = *cur!(self, false)? {
                self.emit_err(self.input.cur_span(), SyntaxError::TS1005);
                let expr = parse_bin_op_recursively(self, expr, 0)?;
                return Ok(ExprStmt {
                    span: span!(self, start),
                    expr,
                }
                .into());
            }

            syntax_error!(
                self,
                SyntaxError::ExpectedSemiForExprStmt { expr: expr.span() }
            );
        }
    }

    fn parse_switch_stmt(&mut self) -> PResult<Stmt> {
        let switch_start = cur_pos!(self);

        assert_and_bump!(self, "switch");

        expect!(self, '(');
        let discriminant = self.include_in_expr(true).parse_expr()?;
        expect!(self, ')');

        let mut cases = Vec::new();
        let mut span_of_previous_default = None;

        expect!(self, '{');

        let ctx = self.ctx() | Context::IsBreakAllowed;
        self.with_ctx(ctx).parse_with(|p| {
            while is_one_of!(p, "case", "default") {
                let mut cons = Vec::new();
                let is_case = is!(p, "case");
                let case_start = cur_pos!(p);
                bump!(p);
                let test = if is_case {
                    p.include_in_expr(true).parse_expr().map(Some)?
                } else {
                    if let Some(previous) = span_of_previous_default {
                        syntax_error!(p, SyntaxError::MultipleDefault { previous });
                    }
                    span_of_previous_default = Some(span!(p, case_start));

                    None
                };
                expect!(p, ':');

                while !eof!(p) && !is_one_of!(p, "case", "default", '}') {
                    cons.push(
                        p.with_ctx(p.ctx() & !Context::TopLevel)
                            .parse_stmt_list_item()?,
                    );
                }

                cases.push(SwitchCase {
                    span: Span::new(case_start, p.input.prev_span().hi),
                    test,
                    cons,
                });
            }

            Ok(())
        })?;

        // eof or rbrace
        expect!(self, '}');

        Ok(SwitchStmt {
            span: span!(self, switch_start),
            discriminant,
            cases,
        }
        .into())
    }

    fn parse_try_stmt(&mut self) -> PResult<Stmt> {
        let start = cur_pos!(self);
        assert_and_bump!(self, "try");

        let block = self.parse_block(false)?;

        let catch_start = cur_pos!(self);
        let handler = self.parse_catch_clause()?;
        let finalizer = self.parse_finally_block()?;

        if handler.is_none() && finalizer.is_none() {
            self.emit_err(Span::new(catch_start, catch_start), SyntaxError::TS1005);
        }

        let span = span!(self, start);
        Ok(TryStmt {
            span,
            block,
            handler,
            finalizer,
        }
        .into())
    }

    fn parse_catch_clause(&mut self) -> PResult<Option<CatchClause>> {
        let start = cur_pos!(self);

        Ok(if eat!(self, "catch") {
            let param = self.parse_catch_param()?;

            self.parse_block(false)
                .map(|body| CatchClause {
                    span: span!(self, start),
                    param,
                    body,
                })
                .map(Some)?
        } else {
            None
        })
    }

    fn parse_finally_block(&mut self) -> PResult<Option<BlockStmt>> {
        Ok(if eat!(self, "finally") {
            self.parse_block(false).map(Some)?
        } else {
            None
        })
    }

    /// It's optional since es2019
    fn parse_catch_param(&mut self) -> PResult<Option<Pat>> {
        if eat!(self, '(') {
            let mut pat = parse_binding_pat_or_ident(self, false)?;

            let type_ann_start = cur_pos!(self);

            if self.syntax().typescript() && eat!(self, ':') {
                let ctx = self.ctx() | Context::InType;

                let ty = self.with_ctx(ctx).parse_with(parse_ts_type)?;
                // self.emit_err(ty.span(), SyntaxError::TS1196);

                match &mut pat {
                    Pat::Ident(BindingIdent { type_ann, .. })
                    | Pat::Array(ArrayPat { type_ann, .. })
                    | Pat::Rest(RestPat { type_ann, .. })
                    | Pat::Object(ObjectPat { type_ann, .. }) => {
                        *type_ann = Some(Box::new(TsTypeAnn {
                            span: span!(self, type_ann_start),
                            type_ann: ty,
                        }));
                    }
                    Pat::Assign(..) => {}
                    Pat::Invalid(_) => {}
                    Pat::Expr(_) => {}
                }
            }
            expect!(self, ')');
            Ok(Some(pat))
        } else {
            Ok(None)
        }
    }

    fn parse_do_stmt(&mut self) -> PResult<Stmt> {
        let start = cur_pos!(self);

        assert_and_bump!(self, "do");

        let ctx = (self.ctx() | Context::IsBreakAllowed | Context::IsContinueAllowed)
            & !Context::TopLevel;
        let body = self.with_ctx(ctx).parse_stmt().map(Box::new)?;
        expect!(self, "while");
        expect!(self, '(');
        let test = self.include_in_expr(true).parse_expr()?;
        expect!(self, ')');
        // We *may* eat semicolon.
        let _ = eat!(self, ';');

        let span = span!(self, start);

        Ok(DoWhileStmt { span, test, body }.into())
    }

    fn parse_while_stmt(&mut self) -> PResult<Stmt> {
        let start = cur_pos!(self);

        assert_and_bump!(self, "while");

        expect!(self, '(');
        let test = self.include_in_expr(true).parse_expr()?;
        expect!(self, ')');

        let ctx = (self.ctx() | Context::IsBreakAllowed | Context::IsContinueAllowed)
            & !Context::TopLevel;
        let body = self.with_ctx(ctx).parse_stmt().map(Box::new)?;

        let span = span!(self, start);
        Ok(WhileStmt { span, test, body }.into())
    }

    pub(super) fn parse_block(&mut self, allow_directives: bool) -> PResult<BlockStmt> {
        let start = cur_pos!(self);

        expect!(self, '{');

        let stmts = self
            .with_ctx(self.ctx() & !Context::TopLevel)
            .parse_block_body(allow_directives, Some(&tok!('}')))?;

        let span = span!(self, start);
        Ok(BlockStmt {
            span,
            stmts,
            ctxt: Default::default(),
        })
    }

    fn parse_labelled_stmt(&mut self, l: Ident) -> PResult<Stmt> {
        let ctx = (self.ctx() | Context::IsBreakAllowed) & !Context::AllowUsingDecl;
        self.with_ctx(ctx).parse_with(|p| {
            let start = l.span.lo();

            let mut errors = Vec::new();
            for lb in &p.state.labels {
                if l.sym == *lb {
                    errors.push(Error::new(
                        l.span,
                        SyntaxError::DuplicateLabel(l.sym.clone()),
                    ));
                }
            }
            p.state.labels.push(l.sym.clone());

            let body = Box::new(if is!(p, "function") {
                let f = p.parse_fn_decl(Vec::new())?;
                if let Decl::Fn(FnDecl { function, .. }) = &f {
                    if p.ctx().contains(Context::Strict) {
                        p.emit_err(function.span, SyntaxError::LabelledFunctionInStrict)
                    }
                    if function.is_generator || function.is_async {
                        p.emit_err(function.span, SyntaxError::LabelledGeneratorOrAsync)
                    }
                }

                f.into()
            } else {
                p.with_ctx(p.ctx() & !Context::TopLevel).parse_stmt()?
            });

            for err in errors {
                p.emit_error(err);
            }

            {
                let pos = p.state.labels.iter().position(|v| v == &l.sym);
                if let Some(pos) = pos {
                    p.state.labels.remove(pos);
                }
            }

            Ok(LabeledStmt {
                span: span!(p, start),
                label: l,
                body,
            }
            .into())
        })
    }
}

pub(super) trait StmtLikeParser<'a, Type: IsDirective> {
    fn handle_import_export(&mut self, decorators: Vec<Decorator>) -> PResult<Type>;
}

impl<'a, I: Tokens<TokenAndSpan>, T> StmtLikeParser<'a, Box<T>> for Parser<I>
where
    T: IsDirective,
    Self: StmtLikeParser<'a, T>,
{
    fn handle_import_export(&mut self, decorators: Vec<Decorator>) -> PResult<Box<T>> {
        <Self as StmtLikeParser<T>>::handle_import_export(self, decorators).map(Box::new)
    }
}

impl<I: Tokens<TokenAndSpan>> StmtLikeParser<'_, Stmt> for Parser<I> {
    fn handle_import_export(&mut self, _: Vec<Decorator>) -> PResult<Stmt> {
        let start = cur_pos!(self);
        if is!(self, "import") && peeked_is!(self, '(') {
            let expr = self.parse_expr()?;

            eat!(self, ';');

            return Ok(ExprStmt {
                span: span!(self, start),
                expr,
            }
            .into());
        }

        if is!(self, "import") && peeked_is!(self, '.') {
            let expr = self.parse_expr()?;

            eat!(self, ';');

            return Ok(ExprStmt {
                span: span!(self, start),
                expr,
            }
            .into());
        }

        syntax_error!(self, SyntaxError::ImportExportInScript);
    }
}
