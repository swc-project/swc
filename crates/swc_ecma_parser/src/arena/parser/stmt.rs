use swc_allocator::arena::{Box, CloneIn, Vec};
use swc_common::{BytePos, Span, Spanned};
use swc_ecma_ast::arena::*;

use super::Parser;
use crate::{
    arena::parser::pat::PatType,
    error::{Error, SyntaxError},
    token::Token,
    Context, PResult, Tokens,
};

mod module_item;

impl<'a, I: Tokens> Parser<'a, I> {
    pub fn parse_module_item(&mut self) -> PResult<ModuleItem<'a>> {
        self.parse_stmt_like(true, true)
    }

    pub(crate) fn parse_block_body<Type>(
        &mut self,
        mut allow_directives: bool,
        top_level: bool,
        end: Option<&'static Token>,
    ) -> PResult<Vec<'a, Type>>
    where
        Self: StmtLikeParser<'a, Type>,
        Type: IsDirective<'a> + From<Stmt<'a>>,
    {
        trace_cur!(self, parse_block_body);

        let old_ctx = self.ctx();

        let mut stmts = Vec::new_in(self.alloc);
        while {
            if self.input.cur().is_none() && end.is_some() {
                let eof_text = self.input.dump_cur();
                self.emit_err(
                    self.input.cur_span(),
                    SyntaxError::Expected(end.unwrap(), eof_text),
                );
                false
            } else {
                let c = cur!(self, false).ok();
                c != end
            }
        } {
            let stmt = self.parse_stmt_like(true, top_level)?;
            if allow_directives {
                allow_directives = false;
                if stmt.is_use_strict() {
                    let ctx = Context {
                        strict: true,
                        ..old_ctx
                    };
                    self.set_ctx(ctx);

                    if self.input.knows_cur() && !is!(self, ';') {
                        unreachable!(
                            "'use strict'; directive requires parser.input.cur to be empty or \
                             '}}', but current token was: {:?}",
                            self.input.cur()
                        )
                    }
                }
            }

            stmts.push(stmt);
        }

        if self.input.cur().is_some() && end.is_some() {
            bump!(self);
        }

        self.set_ctx(old_ctx);

        Ok(stmts)
    }

    /// Parse a statement but not a declaration.
    pub fn parse_stmt(&mut self, top_level: bool) -> PResult<Stmt<'a>> {
        trace_cur!(self, parse_stmt);
        self.parse_stmt_like(false, top_level)
    }

    /// Parse a statement and maybe a declaration.
    pub fn parse_stmt_list_item(&mut self, top_level: bool) -> PResult<Stmt<'a>> {
        trace_cur!(self, parse_stmt_list_item);
        self.parse_stmt_like(true, top_level)
    }

    /// Parse a statement, declaration or module item.
    fn parse_stmt_like<Type>(&mut self, include_decl: bool, top_level: bool) -> PResult<Type>
    where
        Self: StmtLikeParser<'a, Type>,
        Type: IsDirective<'a> + From<Stmt<'a>>,
    {
        trace_cur!(self, parse_stmt_like);

        let _tracing = debug_tracing!(self, "parse_stmt_like");

        let start = cur_pos!(self);
        let decorators = self.parse_decorators(true)?;

        if is_one_of!(self, "import", "export") {
            return self.handle_import_export(top_level, decorators);
        }

        let ctx = Context {
            will_expect_colon_for_cond: false,
            allow_using_decl: true,
            ..self.ctx()
        };
        self.with_ctx(ctx)
            .parse_stmt_internal(start, include_decl, top_level, decorators)
            .map(From::from)
    }

    /// `parseStatementContent`
    fn parse_stmt_internal(
        &mut self,
        start: BytePos,
        include_decl: bool,
        top_level: bool,
        decorators: Vec<'a, Decorator<'a>>,
    ) -> PResult<Stmt<'a>> {
        trace_cur!(self, parse_stmt_internal);

        let is_typescript = self.input.syntax().typescript();

        if is_typescript && is!(self, "const") && peeked_is!(self, "enum") {
            assert_and_bump!(self, "const");
            assert_and_bump!(self, "enum");
            return self
                .parse_ts_enum_decl(start, true)
                .map(Decl::from)
                .map(|decl| self.ast(decl))
                .map(Stmt::from);
        }

        match cur!(self, true) {
            tok!("await") if include_decl || top_level => {
                if top_level {
                    self.state.found_module_item = true;
                    if !self.ctx().can_be_module {
                        self.emit_err(self.input.cur_span(), SyntaxError::TopLevelAwaitInScript);
                    }
                }

                if peeked_is!(self, "using") {
                    let eaten_await = Some(self.input.cur_pos());
                    assert_and_bump!(self, "await");
                    let v = self.parse_using_decl(start, true)?;
                    if let Some(v) = v {
                        return Ok(Stmt::Decl(self.ast(Decl::Using(v))));
                    }

                    let expr = self.parse_await_expr(eaten_await)?;
                    let expr = self
                        .include_in_expr(true)
                        .parse_bin_op_recursively(expr, 0)?;
                    eat!(self, ';');

                    let span = span!(self, start);
                    return Ok(Stmt::Expr(self.ast(ExprStmt { span, expr })));
                }
            }

            tok!("break") | tok!("continue") => {
                let is_break = is!(self, "break");
                bump!(self);

                let label = if eat!(self, ';') {
                    None
                } else {
                    let i = self.parse_label_ident().map(Some)?;
                    expect!(self, ';');
                    i
                };

                let span = span!(self, start);
                if is_break {
                    if label.is_some() && !self.state.labels.contains(&label.as_ref().unwrap().sym)
                    {
                        self.emit_err(span, SyntaxError::TS1116);
                    } else if !self.ctx().is_break_allowed {
                        self.emit_err(span, SyntaxError::TS1105);
                    }
                } else if !self.ctx().is_continue_allowed {
                    self.emit_err(span, SyntaxError::TS1115);
                } else if label.is_some()
                    && !self.state.labels.contains(&label.as_ref().unwrap().sym)
                {
                    self.emit_err(span, SyntaxError::TS1107);
                }

                return Ok(if is_break {
                    Stmt::Break(self.ast(BreakStmt { span, label }))
                } else {
                    Stmt::Continue(self.ast(ContinueStmt { span, label }))
                });
            }

            tok!("debugger") => {
                bump!(self);
                expect!(self, ';');
                return Ok(Stmt::Debugger(self.ast(DebuggerStmt {
                    span: span!(self, start),
                })));
            }

            tok!("do") => {
                return self.parse_do_stmt();
            }

            tok!("for") => {
                return self.parse_for_stmt();
            }

            tok!("function") => {
                if !include_decl {
                    self.emit_err(self.input.cur_span(), SyntaxError::DeclNotAllowed);
                }

                return self
                    .parse_fn_decl(decorators)
                    .map(|decl| self.ast(decl))
                    .map(Stmt::from);
            }

            tok!("class") => {
                if !include_decl {
                    self.emit_err(self.input.cur_span(), SyntaxError::DeclNotAllowed);
                }
                return self
                    .parse_class_decl(start, start, decorators, false)
                    .map(|decl| self.ast(decl))
                    .map(Stmt::from);
            }

            tok!("if") => {
                return self
                    .parse_if_stmt()
                    .map(|stmt| self.ast(stmt))
                    .map(Stmt::If);
            }

            tok!("return") => {
                return self.parse_return_stmt();
            }

            tok!("switch") => {
                return self.parse_switch_stmt();
            }

            tok!("throw") => {
                return self.parse_throw_stmt();
            }

            // Error recovery
            tok!("catch") => {
                let span = self.input.cur_span();
                self.emit_err(span, SyntaxError::TS1005);

                let _ = self.parse_catch_clause();
                let _ = self.parse_finally_block();

                return Ok(Stmt::Expr(self.ast(ExprStmt {
                    span,
                    expr: Expr::Invalid(self.ast(Invalid { span })),
                })));
            }

            // Error recovery
            tok!("finally") => {
                let span = self.input.cur_span();
                self.emit_err(span, SyntaxError::TS1005);

                let _ = self.parse_finally_block();

                return Ok(Stmt::Expr(self.ast(ExprStmt {
                    span,
                    expr: Expr::Invalid(self.ast(Invalid { span })),
                })));
            }

            tok!("try") => {
                return self.parse_try_stmt();
            }

            tok!("with") => {
                return self.parse_with_stmt();
            }

            tok!("while") => {
                return self.parse_while_stmt();
            }

            tok!("var") => {
                let v = self.parse_var_stmt(false)?;
                return Ok(Stmt::Decl(self.ast(Decl::Var(v))));
            }

            tok!("const") if include_decl => {
                let v = self.parse_var_stmt(false)?;
                return Ok(Stmt::Decl(self.ast(Decl::Var(v))));
            }

            // 'let' can start an identifier reference.
            tok!("let") if include_decl => {
                let strict = self.ctx().strict;
                let is_keyword = match peek!(self) {
                    Some(t) => t.kind().follows_keyword_let(strict),
                    _ => false,
                };

                if is_keyword {
                    let v = self.parse_var_stmt(false)?;
                    return Ok(Stmt::Decl(self.ast(Decl::Var(v))));
                }
            }

            tok!("using") if include_decl => {
                let v = self.parse_using_decl(start, false)?;
                if let Some(v) = v {
                    return Ok(Stmt::Decl(self.ast(Decl::Using(v))));
                }
            }

            tok!("interface") => {
                if is_typescript
                    && peeked_is!(self, IdentName)
                    && !self.input.has_linebreak_between_cur_and_peeked()
                {
                    let start = self.input.cur_pos();
                    bump!(self);
                    let decl = Decl::TsInterface(self.parse_ts_interface_decl(start)?);
                    return Ok(Stmt::Decl(self.ast(decl)));
                }
            }

            tok!("type") => {
                if is_typescript
                    && peeked_is!(self, IdentName)
                    && !self.input.has_linebreak_between_cur_and_peeked()
                {
                    let start = self.input.cur_pos();
                    bump!(self);
                    let decl = Decl::TsTypeAlias(self.parse_ts_type_alias_decl(start)?);
                    return Ok(Stmt::Decl(self.ast(decl)));
                }
            }

            tok!("enum") => {
                if is_typescript
                    && peeked_is!(self, IdentName)
                    && !self.input.has_linebreak_between_cur_and_peeked()
                {
                    let start = self.input.cur_pos();
                    bump!(self);
                    let decl = self.parse_ts_enum_decl(start, false)?;
                    return Ok(Stmt::Decl(self.ast(Decl::TsEnum(decl))));
                }
            }

            tok!('{') => {
                let ctx = Context {
                    allow_using_decl: true,
                    ..self.ctx()
                };
                return self.with_ctx(ctx).parse_with(|p| {
                    p.parse_block(false)
                        .map(|stmt| p.ast(stmt))
                        .map(Stmt::Block)
                });
            }

            _ => {}
        }

        if eat_exact!(self, ';') {
            return Ok(Stmt::Empty(self.ast(EmptyStmt {
                span: span!(self, start),
            })));
        }

        // Handle async function foo() {}
        if is!(self, "async")
            && peeked_is!(self, "function")
            && !self.input.has_linebreak_between_cur_and_peeked()
        {
            return self
                .parse_async_fn_decl(decorators)
                .map(|decl| self.ast(decl))
                .map(From::from);
        }

        // If the statement does not start with a statement keyword or a
        // brace, it's an ExpressionStatement or LabeledStatement. We
        // simply start parsing an expression, and afterwards, if the
        // next token is a colon and the expression was a simple
        // Identifier node, we switch to interpreting it as a label.
        let expr = self.include_in_expr(true).parse_expr()?;

        let expr = match expr {
            Expr::Ident(ident) => {
                if eat!(self, ':') {
                    return self.parse_labelled_stmt(ident.into_inner());
                }
                Expr::Ident(ident)
            }
            _ => self.verify_expr(expr)?,
        };
        if let Expr::Ident(ident) = &expr {
            if &*ident.sym == "interface" && self.input.had_line_break_before_cur() {
                self.emit_strict_mode_err(
                    ident.span,
                    SyntaxError::InvalidIdentInStrict(ident.sym.clone()),
                );

                eat!(self, ';');

                return Ok(Stmt::Expr(self.ast(ExprStmt {
                    span: span!(self, start),
                    expr,
                })));
            }

            if self.input.syntax().typescript() {
                if let Some(decl) =
                    self.parse_ts_expr_stmt(decorators, ident.clone_in(self.alloc).into_inner())?
                {
                    return Ok(Stmt::Decl(self.ast(decl)));
                }
            }
        }

        if let Expr::Ident(ident) = &expr {
            match ident.sym.as_str() {
                "enum" | "interface" => {
                    self.emit_strict_mode_err(
                        ident.span,
                        SyntaxError::InvalidIdentInStrict(ident.sym.clone()),
                    );
                }
                _ => {}
            }
        }

        if self.syntax().typescript() {
            if let Expr::Ident(i) = &expr {
                match i.sym.as_str() {
                    "public" | "static" | "abstract" => {
                        if eat!(self, "interface") {
                            self.emit_err(i.span, SyntaxError::TS2427);
                            return self
                                .parse_ts_interface_decl(start)
                                .map(Decl::from)
                                .map(|decl| self.ast(decl))
                                .map(Stmt::from);
                        }
                    }
                    _ => {}
                }
            }
        }

        if eat!(self, ';') {
            Ok(Stmt::Expr(self.ast(ExprStmt {
                span: span!(self, start),
                expr,
            })))
        } else {
            if let Token::BinOp(..) = *cur!(self, false)? {
                self.emit_err(self.input.cur_span(), SyntaxError::TS1005);
                let expr = self.parse_bin_op_recursively(expr, 0)?;
                return Ok(Stmt::Expr(self.ast(ExprStmt {
                    span: span!(self, start),
                    expr,
                })));
            }

            syntax_error!(
                self,
                SyntaxError::ExpectedSemiForExprStmt { expr: expr.span() }
            );
        }
    }

    /// Utility function used to parse large if else statements iteratively.
    ///
    /// THis function is recursive, but it is very cheap so stack overflow will
    /// not occur.
    fn adjust_if_else_clause(&mut self, cur: &mut Box<'a, IfStmt<'a>>, alt: Stmt<'a>) {
        cur.span = span!(self, cur.span.lo);

        if let Some(Stmt::If(prev_alt)) = cur.alt.as_mut() {
            self.adjust_if_else_clause(prev_alt, alt)
        } else {
            debug_assert_eq!(cur.alt, None);
            cur.alt = Some(alt);
        }
    }

    fn parse_if_stmt(&mut self) -> PResult<IfStmt<'a>> {
        let start = cur_pos!(self);

        assert_and_bump!(self, "if");
        let if_token = self.input.prev_span();

        expect!(self, '(');
        let ctx = Context {
            ignore_else_clause: false,
            ..self.ctx()
        };
        let test = self
            .with_ctx(ctx)
            .include_in_expr(true)
            .parse_expr()
            .map_err(|err| {
                Error::new(
                    err.span(),
                    SyntaxError::WithLabel {
                        inner: std::boxed::Box::new(err),
                        span: if_token,
                        note: "Tried to parse the condition for an if statement",
                    },
                )
            })?;

        expect!(self, ')');

        let cons = {
            // Prevent stack overflow
            crate::maybe_grow(256 * 1024, 1024 * 1024, || {
                // Annex B
                if !self.ctx().strict && is!(self, "function") {
                    // TODO: report error?
                }
                let ctx = Context {
                    ignore_else_clause: false,
                    ..self.ctx()
                };
                self.with_ctx(ctx).parse_stmt(false)
            })?
        };

        // We parse `else` branch iteratively, to avoid stack overflow
        // See https://github.com/swc-project/swc/pull/3961

        let alt = if self.ctx().ignore_else_clause {
            None
        } else {
            let mut cur = None;

            let ctx = Context {
                ignore_else_clause: true,
                ..self.ctx()
            };

            let last = loop {
                if !eat!(self, "else") {
                    break None;
                }

                if !is!(self, "if") {
                    let ctx = Context {
                        ignore_else_clause: false,
                        ..self.ctx()
                    };

                    // As we eat `else` above, we need to parse statement once.
                    let last = self.with_ctx(ctx).parse_stmt(false)?;
                    break Some(last);
                }

                // We encountered `else if`

                let alt = self.with_ctx(ctx).parse_if_stmt()?;

                match &mut cur {
                    Some(cur) => {
                        self.adjust_if_else_clause(cur, Stmt::If(self.ast(alt)));
                    }
                    _ => {
                        cur = Some(self.ast(alt));
                    }
                }
            };

            match cur {
                Some(mut cur) => {
                    if let Some(last) = last {
                        self.adjust_if_else_clause(&mut cur, last);
                    }
                    Some(Stmt::If(cur))
                }
                _ => last,
            }
        };

        let span = span!(self, start);
        Ok(IfStmt {
            span,
            test,
            cons,
            alt,
        })
    }

    fn parse_return_stmt(&mut self) -> PResult<Stmt<'a>> {
        let start = cur_pos!(self);

        let stmt = self.parse_with(|p| {
            assert_and_bump!(p, "return");

            let arg = if is!(p, ';') {
                None
            } else {
                p.include_in_expr(true).parse_expr().map(Some)?
            };
            expect!(p, ';');
            Ok(Stmt::Return(p.ast(ReturnStmt {
                span: span!(p, start),
                arg,
            })))
        });

        if !self.ctx().in_function && !self.input.syntax().allow_return_outside_function() {
            self.emit_err(span!(self, start), SyntaxError::ReturnNotAllowed);
        }

        stmt
    }

    fn parse_switch_stmt(&mut self) -> PResult<Stmt<'a>> {
        let switch_start = cur_pos!(self);

        assert_and_bump!(self, "switch");

        expect!(self, '(');
        let discriminant = self.include_in_expr(true).parse_expr()?;
        expect!(self, ')');

        let mut cases = Vec::new_in(self.alloc);
        let mut span_of_previous_default = None;

        expect!(self, '{');
        let ctx = Context {
            is_break_allowed: true,
            ..self.ctx()
        };

        self.with_ctx(ctx).parse_with(|p| {
            while is_one_of!(p, "case", "default") {
                let mut cons = Vec::new_in(p.alloc);
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
                    cons.push(p.parse_stmt_list_item(false)?);
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

        Ok(Stmt::Switch(self.ast(SwitchStmt {
            span: span!(self, switch_start),
            discriminant,
            cases,
        })))
    }

    fn parse_throw_stmt(&mut self) -> PResult<Stmt<'a>> {
        let start = cur_pos!(self);

        assert_and_bump!(self, "throw");

        if self.input.had_line_break_before_cur() {
            // TODO: Suggest throw arg;
            syntax_error!(self, SyntaxError::LineBreakInThrow);
        }

        let arg = self.include_in_expr(true).parse_expr()?;
        expect!(self, ';');

        let span = span!(self, start);
        Ok(Stmt::Throw(self.ast(ThrowStmt { span, arg })))
    }

    fn parse_try_stmt(&mut self) -> PResult<Stmt<'a>> {
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
        Ok(Stmt::Try(self.ast(TryStmt {
            span,
            block,
            handler,
            finalizer,
        })))
    }

    fn parse_catch_clause(&mut self) -> PResult<Option<CatchClause<'a>>> {
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

    fn parse_finally_block(&mut self) -> PResult<Option<BlockStmt<'a>>> {
        Ok(if eat!(self, "finally") {
            self.parse_block(false).map(Some)?
        } else {
            None
        })
    }

    /// It's optional since es2019
    fn parse_catch_param(&mut self) -> PResult<Option<Pat<'a>>> {
        if eat!(self, '(') {
            let mut pat = self.parse_binding_pat_or_ident(false)?;

            let type_ann_start = cur_pos!(self);

            if self.syntax().typescript() && eat!(self, ':') {
                let ctx = Context {
                    in_type: true,
                    ..self.ctx()
                };

                let ty = self.with_ctx(ctx).parse_with(|p| p.parse_ts_type())?;
                // self.emit_err(ty.span(), SyntaxError::TS1196);

                match &mut pat {
                    Pat::Ident(p) => {
                        p.type_ann = Some(self.ast(TsTypeAnn {
                            span: span!(self, type_ann_start),
                            type_ann: ty,
                        }));
                    }
                    Pat::Array(p) => {
                        p.type_ann = Some(self.ast(TsTypeAnn {
                            span: span!(self, type_ann_start),
                            type_ann: ty,
                        }));
                    }
                    Pat::Rest(p) => {
                        p.type_ann = Some(self.ast(TsTypeAnn {
                            span: span!(self, type_ann_start),
                            type_ann: ty,
                        }));
                    }
                    Pat::Object(p) => {
                        p.type_ann = Some(self.ast(TsTypeAnn {
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

    pub(crate) fn parse_using_decl(
        &mut self,
        start: BytePos,
        is_await: bool,
    ) -> PResult<Option<Box<'a, UsingDecl<'a>>>> {
        // using
        // reader = init()

        // is two statements
        let _ = cur!(self, false);
        if self.input.has_linebreak_between_cur_and_peeked() {
            return Ok(None);
        }

        if !peeked_is!(self, BindingIdent) {
            return Ok(None);
        }

        assert_and_bump!(self, "using");

        let mut decls = Vec::new_in(self.alloc);
        let mut first = true;
        while first || eat!(self, ',') {
            if first {
                first = false;
            }

            // Handle
            //      var a,;
            //
            // NewLine is ok
            if is_exact!(self, ';') || eof!(self) {
                let span = self.input.prev_span();
                self.emit_err(span, SyntaxError::TS1009);
                break;
            }

            decls.push(self.parse_var_declarator(false, VarDeclKind::Var)?);
        }

        if !self.syntax().explicit_resource_management() {
            self.emit_err(span!(self, start), SyntaxError::UsingDeclNotEnabled);
        }

        if !self.ctx().allow_using_decl {
            self.emit_err(span!(self, start), SyntaxError::UsingDeclNotAllowed);
        }

        for decl in &decls {
            match decl.name {
                Pat::Ident(..) => {}
                _ => {
                    self.emit_err(span!(self, start), SyntaxError::InvalidNameInUsingDecl);
                }
            }

            if decl.init.is_none() {
                self.emit_err(span!(self, start), SyntaxError::InitRequiredForUsingDecl);
            }
        }

        Ok(Some(self.ast(UsingDecl {
            span: span!(self, start),
            is_await,
            decls,
        })))
    }

    pub(crate) fn parse_var_stmt(&mut self, for_loop: bool) -> PResult<Box<'a, VarDecl<'a>>> {
        let start = cur_pos!(self);
        let kind = match bump!(self) {
            tok!("const") => VarDeclKind::Const,
            tok!("let") => VarDeclKind::Let,
            tok!("var") => VarDeclKind::Var,
            _ => unreachable!(),
        };
        let var_span = span!(self, start);
        let should_include_in = kind != VarDeclKind::Var || !for_loop;

        if self.syntax().typescript() && for_loop {
            let res = if is_one_of!(self, "in", "of") {
                self.ts_look_ahead(|p| {
                    //
                    if !eat!(p, "of") && !eat!(p, "in") {
                        return Ok(false);
                    }

                    p.parse_assignment_expr()?;
                    expect!(p, ')');

                    Ok(true)
                })
            } else {
                Ok(false)
            };

            match res {
                Ok(true) => {
                    let pos = var_span.hi();
                    let span = Span::new(pos, pos);
                    self.emit_err(span, SyntaxError::TS1123);

                    return Ok(self.ast(VarDecl {
                        span: span!(self, start),
                        kind,
                        declare: false,
                        decls: Vec::new_in(self.alloc),
                        ctxt: Default::default(),
                    }));
                }
                Err(..) => {}
                _ => {}
            }
        }

        let mut decls = Vec::new_in(self.alloc);
        let mut first = true;
        while first || eat!(self, ',') {
            if first {
                first = false;
            }

            let ctx = if should_include_in {
                Context {
                    include_in_expr: true,
                    ..self.ctx()
                }
            } else {
                self.ctx()
            };

            // Handle
            //      var a,;
            //
            // NewLine is ok
            if is_exact!(self, ';') || eof!(self) {
                let prev_span = self.input.prev_span();
                let span = if prev_span == var_span {
                    Span::new(prev_span.hi, prev_span.hi)
                } else {
                    prev_span
                };
                self.emit_err(span, SyntaxError::TS1009);
                break;
            }

            decls.push(self.with_ctx(ctx).parse_var_declarator(for_loop, kind)?);
        }

        if !for_loop && !eat!(self, ';') {
            self.emit_err(self.input.cur_span(), SyntaxError::TS1005);

            let _ = self.parse_expr();

            while !eat!(self, ';') {
                bump!(self);

                if let Some(Token::Error(_)) = self.input.cur() {
                    break;
                }
            }
        }

        Ok(self.ast(VarDecl {
            span: span!(self, start),
            declare: false,
            kind,
            decls,
            ctxt: Default::default(),
        }))
    }

    fn parse_var_declarator(
        &mut self,
        for_loop: bool,
        kind: VarDeclKind,
    ) -> PResult<VarDeclarator<'a>> {
        let start = cur_pos!(self);

        let is_let_or_const = matches!(kind, VarDeclKind::Let | VarDeclKind::Const);

        let mut name = self.parse_binding_pat_or_ident(is_let_or_const)?;

        let definite = if self.input.syntax().typescript() {
            match name {
                Pat::Ident(..) => eat!(self, '!'),
                _ => false,
            }
        } else {
            false
        };

        // Typescript extension
        if self.input.syntax().typescript() && is!(self, ':') {
            let type_annotation = self.try_parse_ts_type_ann()?;
            match &mut name {
                Pat::Array(p) => p.type_ann = type_annotation,
                Pat::Ident(p) => p.type_ann = type_annotation,
                Pat::Object(p) => p.type_ann = type_annotation,
                Pat::Rest(p) => p.type_ann = type_annotation,
                _ => unreachable!("invalid syntax: Pat: {:?}", name),
            }
        }

        //FIXME: This is wrong. Should check in/of only on first loop.
        let init = if !for_loop || !is_one_of!(self, "in", "of") {
            if eat!(self, '=') {
                let expr = self.parse_assignment_expr()?;
                let expr = self.verify_expr(expr)?;

                Some(expr)
            } else {
                // Destructuring bindings require initializers, but
                // typescript allows `declare` vars not to have initializers.
                if self.ctx().in_declare {
                    None
                } else if kind == VarDeclKind::Const && self.ctx().strict && !self.ctx().in_declare
                {
                    self.emit_err(
                        span!(self, start),
                        SyntaxError::ConstDeclarationsRequireInitialization,
                    );

                    None
                } else {
                    match name {
                        Pat::Ident(..) => None,
                        _ => {
                            syntax_error!(self, span!(self, start), SyntaxError::PatVarWithoutInit)
                        }
                    }
                }
            }
        } else {
            // e.g. for(let a;;)
            None
        };

        Ok(VarDeclarator {
            span: span!(self, start),
            name,
            init,
            definite,
        })
    }

    fn parse_do_stmt(&mut self) -> PResult<Stmt<'a>> {
        let start = cur_pos!(self);

        assert_and_bump!(self, "do");

        let ctx = Context {
            is_break_allowed: true,
            is_continue_allowed: true,
            ..self.ctx()
        };
        let body = self.with_ctx(ctx).parse_stmt(false)?;
        expect!(self, "while");
        expect!(self, '(');
        let test = self.include_in_expr(true).parse_expr()?;
        expect!(self, ')');
        // We *may* eat semicolon.
        let _ = eat!(self, ';');

        let span = span!(self, start);

        Ok(Stmt::DoWhile(self.ast(DoWhileStmt { span, test, body })))
    }

    fn parse_while_stmt(&mut self) -> PResult<Stmt<'a>> {
        let start = cur_pos!(self);

        assert_and_bump!(self, "while");

        expect!(self, '(');
        let test = self.include_in_expr(true).parse_expr()?;
        expect!(self, ')');

        let ctx = Context {
            is_break_allowed: true,
            is_continue_allowed: true,
            ..self.ctx()
        };
        let body = self.with_ctx(ctx).parse_stmt(false)?;

        let span = span!(self, start);
        Ok(Stmt::While(self.ast(WhileStmt { span, test, body })))
    }

    fn parse_with_stmt(&mut self) -> PResult<Stmt<'a>> {
        if self.syntax().typescript() {
            let span = self.input.cur_span();
            self.emit_err(span, SyntaxError::TS2410);
        }

        {
            let span = self.input.cur_span();
            self.emit_strict_mode_err(span, SyntaxError::WithInStrict);
        }

        let start = cur_pos!(self);

        assert_and_bump!(self, "with");

        expect!(self, '(');
        let obj = self.include_in_expr(true).parse_expr()?;
        expect!(self, ')');

        let ctx = Context {
            in_function: true,
            ..self.ctx()
        };
        let body = self.with_ctx(ctx).parse_stmt(false)?;

        let span = span!(self, start);
        Ok(Stmt::With(self.ast(WithStmt { span, obj, body })))
    }

    pub(crate) fn parse_block(&mut self, allow_directives: bool) -> PResult<BlockStmt<'a>> {
        let start = cur_pos!(self);

        expect!(self, '{');

        let stmts = self.parse_block_body(allow_directives, false, Some(&tok!('}')))?;

        let span = span!(self, start);
        Ok(BlockStmt {
            span,
            stmts,
            ctxt: Default::default(),
        })
    }

    fn parse_labelled_stmt(&mut self, l: Ident) -> PResult<Stmt<'a>> {
        let ctx = Context {
            is_break_allowed: true,
            allow_using_decl: false,
            ..self.ctx()
        };
        self.with_ctx(ctx).parse_with(|p| {
            let start = l.span.lo();

            let mut errors = Vec::new_in(p.alloc);
            for lb in &p.state.labels {
                if l.sym == *lb {
                    errors.push(Error::new(
                        l.span,
                        SyntaxError::DuplicateLabel(l.sym.clone()),
                    ));
                }
            }
            p.state.labels.push(l.sym.clone());

            let body = if is!(p, "function") {
                let f = p.parse_fn_decl(Vec::new_in(p.alloc))?;
                if let Decl::Fn(fn_decl) = &f {
                    let function = &fn_decl.function;
                    if p.ctx().strict {
                        p.emit_err(function.span, SyntaxError::LabelledFunctionInStrict)
                    }
                    if function.is_generator || function.is_async {
                        p.emit_err(function.span, SyntaxError::LabelledGeneratorOrAsync)
                    }
                }
                Stmt::Decl(p.ast(f))
            } else {
                p.parse_stmt(false)?
            };

            for err in errors {
                p.emit_error(err);
            }

            {
                let pos = p.state.labels.iter().position(|v| v == &l.sym);
                if let Some(pos) = pos {
                    p.state.labels.remove(pos);
                }
            }

            Ok(Stmt::Labeled(p.ast(LabeledStmt {
                span: span!(p, start),
                label: l,
                body,
            })))
        })
    }

    fn parse_for_stmt(&mut self) -> PResult<Stmt<'a>> {
        let start = cur_pos!(self);

        assert_and_bump!(self, "for");
        let await_start = cur_pos!(self);
        let await_token = if eat!(self, "await") {
            Some(span!(self, await_start))
        } else {
            None
        };
        expect!(self, '(');

        let mut ctx = self.ctx();
        ctx.expr_ctx.for_loop_init = true;
        ctx.expr_ctx.for_await_loop_init = await_token.is_some();

        let head = self.with_ctx(ctx).parse_for_head()?;
        expect!(self, ')');
        let ctx = Context {
            is_break_allowed: true,
            is_continue_allowed: true,
            ..self.ctx()
        };
        let body = self.with_ctx(ctx).parse_stmt(false)?;

        let span = span!(self, start);
        Ok(match head {
            TempForHead::For { init, test, update } => {
                if let Some(await_token) = await_token {
                    syntax_error!(self, await_token, SyntaxError::AwaitForStmt);
                }

                Stmt::For(self.ast(ForStmt {
                    span,
                    init,
                    test,
                    update,
                    body,
                }))
            }
            TempForHead::ForIn { left, right } => {
                if let Some(await_token) = await_token {
                    syntax_error!(self, await_token, SyntaxError::AwaitForStmt);
                }

                Stmt::ForIn(self.ast(ForInStmt {
                    span,
                    left,
                    right,
                    body,
                }))
            }
            TempForHead::ForOf { left, right } => Stmt::ForOf(self.ast(ForOfStmt {
                span,
                is_await: await_token.is_some(),
                left,
                right,
                body,
            })),
        })
    }

    fn parse_for_head(&mut self) -> PResult<TempForHead<'a>> {
        let strict = self.ctx().strict;

        if is_one_of!(self, "const", "var")
            || (is!(self, "let")
                && peek!(self).map_or(false, |v| v.kind().follows_keyword_let(strict)))
        {
            let decl = self.parse_var_stmt(true)?;

            if is_one_of!(self, "of", "in") {
                if decl.decls.len() != 1 {
                    for d in decl.decls.iter().skip(1) {
                        self.emit_err(d.name.span(), SyntaxError::TooManyVarInForInHead);
                    }
                } else {
                    if (self.ctx().strict || is!(self, "of")) && decl.decls[0].init.is_some() {
                        self.emit_err(
                            decl.decls[0].name.span(),
                            SyntaxError::VarInitializerInForInHead,
                        );
                    }

                    if self.syntax().typescript() {
                        let type_ann = match decl.decls[0].name {
                            Pat::Ident(ref v) => Some(&v.type_ann),
                            Pat::Array(ref v) => Some(&v.type_ann),
                            Pat::Rest(ref v) => Some(&v.type_ann),
                            Pat::Object(ref v) => Some(&v.type_ann),
                            _ => None,
                        };

                        if let Some(type_ann) = type_ann {
                            if type_ann.is_some() {
                                self.emit_err(decl.decls[0].name.span(), SyntaxError::TS2483);
                            }
                        }
                    }
                }

                return self.parse_for_each_head(ForHead::VarDecl(decl));
            }

            expect_exact!(self, ';');
            return self.parse_normal_for_head(Some(VarDeclOrExpr::VarDecl(decl)));
        }

        if eat_exact!(self, ';') {
            return self.parse_normal_for_head(None);
        }

        let start = cur_pos!(self);
        let init = self.include_in_expr(false).parse_for_head_prefix()?;

        let mut is_using_decl = false;
        let mut is_await_using_decl = false;

        if self.input.syntax().explicit_resource_management() {
            // using foo
            let mut maybe_using_decl = init.is_ident_ref_to("using");
            let mut maybe_await_using_decl = false;

            // await using foo
            if !maybe_using_decl
                && init
                    .as_await_expr()
                    .filter(|e| e.arg.is_ident_ref_to("using"))
                    .is_some()
            {
                maybe_using_decl = true;
                maybe_await_using_decl = true;
            }

            if maybe_using_decl
                && !is!(self, "of")
                && (peeked_is!(self, "of") || peeked_is!(self, "in"))
            {
                is_using_decl = maybe_using_decl;
                is_await_using_decl = maybe_await_using_decl;
            }
        }

        if is_using_decl {
            let name = self.parse_binding_ident(false)?;
            let decl = VarDeclarator {
                name: Pat::Ident(self.ast(name)),
                span: span!(self, start),
                init: None,
                definite: false,
            };

            let mut decls = Vec::new_in(self.alloc);
            decls.push(decl);
            let pat = self.ast(UsingDecl {
                span: span!(self, start),
                is_await: is_await_using_decl,
                decls,
            });

            cur!(self, true);

            return self.parse_for_each_head(ForHead::UsingDecl(pat));
        }

        // for (a of b)
        if is_one_of!(self, "of", "in") {
            let is_in = is!(self, "in");

            let pat = self.reparse_expr_as_pat(PatType::AssignPat, init)?;

            // for ({} in foo) is invalid
            if self.input.syntax().typescript() && is_in {
                match pat {
                    Pat::Ident(..) => {}
                    Pat::Expr(..) => {}
                    ref v => self.emit_err(v.span(), SyntaxError::TS2491),
                }
            }

            return self.parse_for_each_head(ForHead::Pat(pat));
        }

        expect_exact!(self, ';');

        let init = self.verify_expr(init)?;
        self.parse_normal_for_head(Some(VarDeclOrExpr::Expr(init)))
    }

    fn parse_for_each_head(&mut self, left: ForHead<'a>) -> PResult<TempForHead<'a>> {
        let is_of = bump!(self) == tok!("of");
        if is_of {
            let right = self.include_in_expr(true).parse_assignment_expr()?;
            Ok(TempForHead::ForOf { left, right })
        } else {
            if let ForHead::UsingDecl(d) = &left {
                self.emit_err(d.span, SyntaxError::UsingDeclNotAllowedForForInLoop)
            }

            let right = self.include_in_expr(true).parse_expr()?;
            Ok(TempForHead::ForIn { left, right })
        }
    }

    fn parse_normal_for_head(
        &mut self,
        init: Option<VarDeclOrExpr<'a>>,
    ) -> PResult<TempForHead<'a>> {
        let test = if eat_exact!(self, ';') {
            None
        } else {
            let test = self.include_in_expr(true).parse_expr().map(Some)?;
            expect_exact!(self, ';');
            test
        };

        let update = if is!(self, ')') {
            None
        } else {
            self.include_in_expr(true).parse_expr().map(Some)?
        };

        Ok(TempForHead::For { init, test, update })
    }
}

#[allow(clippy::enum_variant_names)]
enum TempForHead<'a> {
    For {
        init: Option<VarDeclOrExpr<'a>>,
        test: Option<Expr<'a>>,
        update: Option<Expr<'a>>,
    },
    ForIn {
        left: ForHead<'a>,
        right: Expr<'a>,
    },
    ForOf {
        left: ForHead<'a>,
        right: Expr<'a>,
    },
}

pub(crate) trait IsDirective<'a> {
    fn as_ref(&self) -> Option<&Stmt<'a>>;
    fn is_use_strict(&self) -> bool {
        self.as_ref().map_or(false, Stmt::is_use_strict)
    }
}

impl<'a, T> IsDirective<'a> for Box<'a, T>
where
    T: IsDirective<'a>,
{
    fn as_ref(&self) -> Option<&Stmt<'a>> {
        T::as_ref(&**self)
    }
}

impl<'a> IsDirective<'a> for Stmt<'a> {
    fn as_ref(&self) -> Option<&Stmt<'a>> {
        Some(self)
    }
}

pub(crate) trait StmtLikeParser<'a, Type: IsDirective<'a>> {
    fn handle_import_export(
        &mut self,
        top_level: bool,
        decorators: Vec<'a, Decorator<'a>>,
    ) -> PResult<Type>;
}

impl<'a, I: Tokens, T> StmtLikeParser<'a, Box<'a, T>> for Parser<'a, I>
where
    T: IsDirective<'a>,
    Self: StmtLikeParser<'a, T>,
{
    fn handle_import_export(
        &mut self,
        top_level: bool,
        decorators: Vec<'a, Decorator<'a>>,
    ) -> PResult<Box<'a, T>> {
        <Self as StmtLikeParser<T>>::handle_import_export(self, top_level, decorators)
            .map(|stmt| self.ast(stmt))
    }
}

impl<'a, I: Tokens> StmtLikeParser<'a, Stmt<'a>> for Parser<'a, I> {
    fn handle_import_export(&mut self, _: bool, _: Vec<'a, Decorator<'a>>) -> PResult<Stmt<'a>> {
        let start = cur_pos!(self);
        if is!(self, "import") && peeked_is!(self, '(') {
            let expr = self.parse_expr()?;

            eat!(self, ';');

            return Ok(Stmt::Expr(self.ast(ExprStmt {
                span: span!(self, start),
                expr,
            })));
        }

        if is!(self, "import") && peeked_is!(self, '.') {
            let expr = self.parse_expr()?;

            eat!(self, ';');

            return Ok(Stmt::Expr(self.ast(ExprStmt {
                span: span!(self, start),
                expr,
            })));
        }

        syntax_error!(self, SyntaxError::ImportExportInScript);
    }
}

#[cfg(test)]
mod tests {
    use swc_allocator::{arena::Allocator, vec};
    use swc_common::{comments::SingleThreadedComments, SyntaxContext, DUMMY_SP as span};
    use swc_ecma_visit::assert_eq_ignore_span_arena;

    use super::*;
    use crate::{
        arena::parser::{test_parser, test_parser_comment},
        EsSyntax, Syntax,
    };

    fn stmt<'a>(alloc: &'a Allocator, s: &'static str) -> Stmt<'a> {
        test_parser(alloc, s, Syntax::default(), |p| p.parse_stmt(true))
    }

    fn module_item<'a>(alloc: &'a Allocator, s: &'static str) -> ModuleItem<'a> {
        test_parser(alloc, s, Syntax::default(), |p| {
            p.parse_stmt_like(true, true)
        })
    }
    fn expr<'a>(alloc: &'a Allocator, s: &'static str) -> Expr<'a> {
        test_parser(alloc, s, Syntax::default(), |p| p.parse_expr())
    }

    #[test]
    fn expr_stmt() {
        let alloc = Allocator::default();
        assert_eq_ignore_span_arena!(
            stmt(&alloc, "a + b + c"),
            Stmt::Expr(Box::new_in(
                ExprStmt {
                    span,
                    expr: expr(&alloc, "a + b + c")
                },
                &alloc
            ))
        )
    }

    #[test]
    fn catch_rest_pat() {
        let alloc = Allocator::default();
        assert_eq_ignore_span_arena!(
            stmt(&alloc, "try {} catch({ ...a34 }) {}"),
            Stmt::Try(Box::new_in(
                TryStmt {
                    span,
                    block: BlockStmt {
                        span,
                        stmts: vec![in &alloc],
                        ctxt: SyntaxContext::default(),
                    },
                    handler: Some(CatchClause {
                        span,
                        param: Some(Pat::Object(Box::new_in(
                            ObjectPat {
                                span,
                                optional: false,
                                props: vec![in &alloc; ObjectPatProp::Rest(Box::new_in(
RestPat {
                                span,
                                dot3_token: span,
                                arg: Pat::Ident(Box::new_in(Ident::new_no_ctxt("a34".into(), span).into(), &alloc)),
                                type_ann: None
                            }
                                , &alloc))],
                                type_ann: None,
                            },
                            &alloc
                        ))),
                        body: BlockStmt {
                            span,
                            stmts: vec![in &alloc],
                            ctxt: SyntaxContext::default(),
                        }
                    }),
                    finalizer: None
                },
                &alloc
            ))
        );
    }

    #[test]
    fn throw_this() {
        let alloc = Allocator::default();
        assert_eq_ignore_span_arena!(
            stmt(&alloc, "throw this"),
            Stmt::Throw(Box::new_in(
                ThrowStmt {
                    span,
                    arg: expr(&alloc, "this"),
                },
                &alloc
            ))
        )
    }

    #[test]
    fn await_for_of() {
        let alloc = Allocator::default();
        assert_eq_ignore_span_arena!(
            stmt(&alloc, "for await (const a of b) ;"),
            Stmt::ForOf(Box::new_in(
                ForOfStmt {
                    span,
                    is_await: true,
                    left: ForHead::VarDecl(Box::new_in(
                        VarDecl {
                            span,
                            kind: VarDeclKind::Const,
                            decls: vec![in &alloc; VarDeclarator {
                                span,
                                init: None,
                                name: Pat::Ident(Box::new_in(Ident::new_no_ctxt("a".into(), span).into(), &alloc)),
                                definite: false,
                            }],
                            ctxt: SyntaxContext::default(),
                            declare: false,
                        },
                        &alloc
                    )),
                    right: Expr::Ident(Box::new_in(Ident::new_no_ctxt("b".into(), span), &alloc)),
                    body: Stmt::Empty(Box::new_in(EmptyStmt { span }, &alloc)),
                },
                &alloc
            ))
        )
    }

    #[test]
    fn no_empty_without_semi() {
        let alloc = Allocator::default();
        assert_eq_ignore_span_arena!(
            stmt(&alloc, "(function foo() { return 1 })"),
            stmt(
                &alloc,
                "(function foo () {
                return 1
            })"
            )
        );

        assert_eq_ignore_span_arena!(
            stmt(&alloc, "{ 1; }"),
            Stmt::Block(Box::new_in(
                BlockStmt {
                    span,
                    stmts: vec![in &alloc; stmt(&alloc, "1")],
                    ctxt: SyntaxContext::default(),
                },
                &alloc
            ))
        );
    }

    #[test]
    fn if_else() {
        let alloc = Allocator::default();
        assert_eq_ignore_span_arena!(
            stmt(&alloc, "if (a) b; else c"),
            Stmt::If(Box::new_in(
                IfStmt {
                    span,
                    test: expr(&alloc, "a"),
                    cons: stmt(&alloc, "b;"),
                    alt: Some(stmt(&alloc, "c")),
                },
                &alloc
            ))
        );
    }

    #[test]
    fn class_decorator() {
        let alloc = Allocator::default();
        assert_eq_ignore_span_arena!(
            test_parser(
                &alloc,
                "
            @decorator
            @dec2
            class Foo {}
            ",
                Syntax::Es(EsSyntax {
                    decorators: true,
                    ..Default::default()
                }),
                |p| p.parse_stmt_list_item(true),
            ),
            Stmt::Decl(Box::new_in(
                Decl::Class(Box::new_in(
                    ClassDecl {
                        ident: Ident::new_no_ctxt("Foo".into(), span),
                        class: Box::new_in(
                            Class {
                                span,
                                decorators: vec![in &alloc;
                                    Decorator {
                                        span,
                                        expr: expr(&alloc, "decorator")
                                    },
                                    Decorator {
                                        span,
                                        expr: expr(&alloc, "dec2")
                                    }
                                ],
                                super_class: None,
                                body: Vec::new_in(&alloc),
                                is_abstract: false,
                                ctxt: SyntaxContext::default(),
                                implements: Vec::new_in(&alloc),
                                super_type_params: None,
                                type_params: None
                            },
                            &alloc
                        ),
                        declare: false,
                    },
                    &alloc
                )),
                &alloc
            ))
        );
    }

    #[test]
    fn example() {
        let src = r#"
import React from 'react'
import ReactDOM from 'react-dom'

function App() {
  return <h1>JSX is working!</h1>
}

ReactDOM.render(<App />, document.getElementById('root'))

"#;
        let alloc = Allocator::default();
        test_parser(
            &alloc,
            src,
            Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn ice() {
        let src = r#"import React from "react"

function App() {
  return <h1>works</h1>
}

export default App"#;
        let alloc = Allocator::default();
        test_parser(
            &alloc,
            src,
            Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn export_default() {
        let src = "export v, { x, y as w } from 'mod';";
        let alloc = Allocator::default();
        test_parser(
            &alloc,
            src,
            Syntax::Es(EsSyntax {
                export_default_from: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn export_default_2() {
        let src = "export foo from 'bar';";
        let alloc = Allocator::default();
        test_parser(
            &alloc,
            src,
            Syntax::Es(EsSyntax {
                export_default_from: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn export_default_3() {
        let src = "export default from 'bar';";
        let alloc = Allocator::default();
        test_parser(
            &alloc,
            src,
            Syntax::Es(EsSyntax {
                export_default_from: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn export_default_4() {
        let src = "export default, {foo} from 'bar';";
        let alloc = Allocator::default();
        test_parser(
            &alloc,
            src,
            Syntax::Es(EsSyntax {
                export_default_from: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn shebang_01() {
        let src = "#!/usr/bin/env node";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Es(Default::default()), |p| {
            p.parse_module()
        });
    }

    #[test]
    fn shebang_02() {
        let src = "#!/usr/bin/env node
let x = 4";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Es(Default::default()), |p| {
            p.parse_module()
        });
    }

    #[test]
    fn empty() {
        let alloc = Allocator::default();
        test_parser(&alloc, "", Syntax::Es(Default::default()), |p| {
            p.parse_module()
        });
    }

    #[test]
    fn issue_226() {
        let alloc = Allocator::default();
        test_parser(
            &alloc,
            "export * as Foo from 'bar';",
            Syntax::Es(EsSyntax {
                export_default_from: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    #[should_panic(expected = "Expected 'from', got ','")]
    fn issue_4369_1() {
        let alloc = Allocator::default();
        test_parser(
            &alloc,
            r#"export * as foo, { bar } from "mod""#,
            Syntax::Es(EsSyntax {
                export_default_from: false,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_4369_2() {
        let alloc = Allocator::default();
        test_parser(
            &alloc,
            r#"export foo, * as bar, { baz } from "mod""#,
            Syntax::Es(EsSyntax {
                export_default_from: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_4369_3() {
        let alloc = Allocator::default();
        test_parser(
            &alloc,
            r#"export foo, * as bar from "mod""#,
            Syntax::Es(EsSyntax {
                export_default_from: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_4369_4() {
        let alloc = Allocator::default();
        test_parser(
            &alloc,
            r#"export * as bar, { baz } from "mod""#,
            Syntax::Es(EsSyntax {
                export_default_from: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_4369_5() {
        let alloc = Allocator::default();
        test_parser(
            &alloc,
            r#"export foo, { baz } from "mod""#,
            Syntax::Es(EsSyntax {
                export_default_from: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_257_var() {
        let alloc = Allocator::default();
        test_parser(
            &alloc,
            "
export default function waitUntil(callback, options = {}) {
  var timeout = 'timeout' in options ? options.timeout : 1000;
}",
            Default::default(),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_257_let() {
        let alloc = Allocator::default();
        test_parser(
            &alloc,
            "
export default function waitUntil(callback, options = {}) {
  let timeout = 'timeout' in options ? options.timeout : 1000;
}",
            Default::default(),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_269() {
        let alloc = Allocator::default();
        test_parser(
            &alloc,
            ";(function() {})(window, window.lib || (window.lib = {}))",
            Default::default(),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_319_2() {
        let alloc = Allocator::default();
        module_item(
            &alloc,
            "export default obj({
    async f() {
        await g();
    }
});",
        );
    }

    #[test]
    fn issue_340_fn() {
        let alloc = Allocator::default();
        test_parser(
            &alloc,
            "export default function(){};",
            Default::default(),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_340_async_fn() {
        let alloc = Allocator::default();
        test_parser(
            &alloc,
            "export default async function(){};",
            Default::default(),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_340_generator_fn() {
        let alloc = Allocator::default();
        test_parser(
            &alloc,
            "export default function*(){};",
            Default::default(),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_340_class() {
        let alloc = Allocator::default();
        test_parser(
            &alloc,
            "export default class {};",
            Default::default(),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_360() {
        let alloc = Allocator::default();
        test_parser(
            &alloc,
            "var IS_IE11 = !global.ActiveXObject && 'ActiveXObject' in global;",
            Default::default(),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_380_1() {
        let alloc = Allocator::default();
        test_parser(
            &alloc,
            "import(filePath).then(bar => {})",
            Syntax::Es(Default::default()),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_380_2() {
        let alloc = Allocator::default();
        test_parser(
            &alloc,
            "class Foo {
                componentDidMount() {
                    const filePath = '../foo/bar'
                    import(filePath).then(bar => {})
                }
            }",
            Syntax::Es(Default::default()),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_411() {
        let alloc = Allocator::default();
        test_parser(
            &alloc,
            "try {
} catch {}",
            Syntax::Es(Default::default()),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn top_level_await() {
        let alloc = Allocator::default();
        test_parser(&alloc, "await foo", Syntax::Es(Default::default()), |p| {
            p.parse_module()
        });
    }

    #[test]
    fn issue_856() {
        let c = SingleThreadedComments::default();
        let s = "class Foo {
    static _extensions: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: (module: Module, filename: string) => any;
    } = Object.create(null);
}
";
        let alloc = Allocator::default();
        let _ = test_parser_comment(&alloc, &c, s, Syntax::Typescript(Default::default()), |p| {
            p.parse_typescript_module()
        });

        let (leading, trailing) = c.take_all();
        assert!(trailing.borrow().is_empty());
        assert_eq!(leading.borrow().len(), 1);
    }

    #[test]
    fn issue_856_2() {
        let c = SingleThreadedComments::default();
        let s = "type ConsoleExamineFunc = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  csl: any,
  out: StringBuffer,
  err?: StringBuffer,
  both?: StringBuffer
) => void;";

        let alloc = Allocator::default();
        let _ = test_parser_comment(&alloc, &c, s, Syntax::Typescript(Default::default()), |p| {
            p.parse_typescript_module()
        });

        let (leading, trailing) = c.take_all();
        assert!(trailing.borrow().is_empty());
        assert_eq!(leading.borrow().len(), 1);
    }

    #[test]
    fn issue_856_3() {
        let c = SingleThreadedComments::default();
        let s = "type RequireWrapper = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  exports: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  require: any,
  module: Module,
  __filename: string,
  __dirname: string
) => void;";
        let alloc = Allocator::default();
        let _ = test_parser_comment(&alloc, &c, s, Syntax::Typescript(Default::default()), |p| {
            p.parse_typescript_module()
        });

        let (leading, trailing) = c.take_all();
        assert!(trailing.borrow().is_empty());
        assert_eq!(leading.borrow().len(), 2);
    }

    #[test]
    fn issue_856_4() {
        let c = SingleThreadedComments::default();
        let s = "const _extensions: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: (module: Module, filename: string) => any;
  } = Object.create(null);";
        let alloc = Allocator::default();
        let _ = test_parser_comment(&alloc, &c, s, Syntax::Typescript(Default::default()), |p| {
            p.parse_typescript_module()
        });

        let (leading, trailing) = c.take_all();
        assert!(trailing.borrow().is_empty());
        assert_eq!(leading.borrow().len(), 1);
    }
    fn parse_for_head<'a>(alloc: &'a Allocator, str: &'static str) -> TempForHead<'a> {
        test_parser(alloc, str, Syntax::default(), |p| p.parse_for_head())
    }

    #[test]
    fn for_array_binding_pattern() {
        let alloc = Allocator::default();
        match parse_for_head(&alloc, "let [, , t] = simple_array; t < 10; t++") {
            TempForHead::For { init: Some(v), .. } => assert_eq_ignore_span_arena!(
                v,
                VarDeclOrExpr::VarDecl(Box::new_in(
                    VarDecl {
                        span,
                        declare: false,
                        kind: VarDeclKind::Let,
                        decls: vec![in &alloc; VarDeclarator {
                            span,
                            name: Pat::Array(Box::new_in(
                                ArrayPat {
                                span,
                                type_ann: None,
                                optional: false,
                                elems: vec![in &alloc;
                                    None,
                                    None,
                                    Some(Pat::Ident(Box::new_in(Ident::new_no_ctxt("t".into(), span).into(), &alloc)))
                                ]
                            }
                                , &alloc)),
                            init: Some(
                                Expr::Ident(Box::new_in(Ident::new_no_ctxt("simple_array".into(), span), &alloc))
                            ),
                            definite: false
                        }],
                        ctxt: SyntaxContext::default(),
                    },
                    &alloc
                ))
            ),
            _ => unreachable!(),
        };
    }
    #[test]
    fn for_object_binding_pattern() {
        let alloc = Allocator::default();
        match parse_for_head(&alloc, "let {num} = obj; num < 11; num++") {
            TempForHead::For { init: Some(v), .. } => assert_eq_ignore_span_arena!(
                v,
                VarDeclOrExpr::VarDecl(Box::new_in(
                    VarDecl {
                        span,
                        kind: VarDeclKind::Let,
                        decls: vec![in &alloc; VarDeclarator {
                                                span,
                                                name: Pat::Object(Box::new_in(
                        ObjectPat {
                                                    optional: false,
                                                    type_ann: None,
                                                    span,
                                                    props: vec![in &alloc; ObjectPatProp::Assign(Box::new_in(
                        AssignPatProp {
                                                        span,
                                                        key: Ident::new_no_ctxt("num".into(), span).into(),
                                                        value: None
                                                    }
                                                        , &alloc))]
                                                }
                                                    , &alloc)),
                                                init: Some(Expr::Ident(Box::new_in(Ident::new_no_ctxt("obj".into(), span), &alloc))),
                                                definite: false
                                            }],
                        ctxt: SyntaxContext::default(),
                        declare: false,
                    },
                    &alloc
                ))
            ),
            _ => unreachable!(),
        };
    }

    #[test]
    #[should_panic(expected = "'import.meta' cannot be used outside of module code.")]
    fn import_meta_in_script() {
        let src = "const foo = import.meta.url;";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Es(Default::default()), |p| {
            p.parse_script()
        });
    }

    #[test]
    fn import_meta_in_program() {
        let src = "const foo = import.meta.url;";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Es(Default::default()), |p| {
            p.parse_program()
        });
    }

    #[test]
    #[should_panic(expected = "'import', and 'export' cannot be used outside of module code")]
    fn import_statement_in_script() {
        let src = "import 'foo';";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Es(Default::default()), |p| {
            p.parse_script()
        });
    }

    #[test]
    #[should_panic(expected = "top level await is only allowed in module")]
    fn top_level_await_in_script() {
        let src = "await promise";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Es(Default::default()), |p| {
            p.parse_script()
        });
    }

    #[test]
    fn top_level_await_in_program() {
        let src = "await promise";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Es(Default::default()), |p| {
            p.parse_program()
        });
    }

    #[test]
    fn for_of_head_lhs_async_dot() {
        let src = "for (async.x of [1]) ;";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Es(Default::default()), |p| {
            p.parse_module()
        });
    }

    #[test]
    fn for_head_init_async_of() {
        let src = "for (async of => {}; i < 10; ++i) { ++counter; }";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Es(Default::default()), |p| {
            p.parse_module()
        });
    }

    #[test]
    #[should_panic(expected = "await isn't allowed in non-async function")]
    fn await_in_function_in_module() {
        let src = "function foo (p) { await p; }";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Es(Default::default()), |p| {
            p.parse_module()
        });
    }

    #[test]
    #[should_panic(expected = "await isn't allowed in non-async function")]
    fn await_in_function_in_script() {
        let src = "function foo (p) { await p; }";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Es(Default::default()), |p| {
            p.parse_script()
        });
    }

    #[test]
    #[should_panic(expected = "await isn't allowed in non-async function")]
    fn await_in_function_in_program() {
        let src = "function foo (p) { await p; }";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Es(Default::default()), |p| {
            p.parse_program()
        });
    }

    #[test]
    #[should_panic(expected = "`await` cannot be used as an identifier in an async context")]
    fn await_in_nested_async_function_in_module() {
        let src = "async function foo () { function bar(x = await) {} }";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Es(Default::default()), |p| {
            p.parse_module()
        });
    }

    #[test]
    fn await_in_nested_async_function_in_script() {
        let src = "async function foo () { function bar(x = await) {} }";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Es(Default::default()), |p| {
            p.parse_script()
        });
    }

    #[test]
    fn await_in_nested_async_function_in_program() {
        let src = "async function foo () { function bar(x = await) {} }";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Es(Default::default()), |p| {
            p.parse_program()
        });
    }

    #[test]
    #[should_panic(expected = "`await` cannot be used as an identifier in an async context")]
    fn await_as_param_ident_in_module() {
        let src = "function foo (x = await) { }";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Es(Default::default()), |p| {
            p.parse_module()
        });
    }

    #[test]
    fn await_as_param_ident_in_script() {
        let src = "function foo (x = await) { }";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Es(Default::default()), |p| {
            p.parse_script()
        });
    }

    #[test]
    #[should_panic(expected = "`await` cannot be used as an identifier in an async context")]
    fn await_as_ident_in_module() {
        let src = "let await = 1";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Es(Default::default()), |p| {
            p.parse_module()
        });
    }

    #[test]
    fn await_as_ident_in_script() {
        let src = "let await = 1";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Es(Default::default()), |p| {
            p.parse_script()
        });
    }

    #[test]
    #[should_panic(expected = "`await` cannot be used as an identifier in an async context")]
    fn await_as_ident_in_async() {
        let src = "async function foo() { let await = 1; }";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Es(Default::default()), |p| {
            p.parse_script()
        });
    }

    #[test]
    fn top_level_await_in_block() {
        let src = "if (true) { await promise; }";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Es(Default::default()), |p| {
            p.parse_module()
        });
    }

    #[test]
    fn class_static_blocks() {
        let src = "class Foo { static { 1 + 1; } }";
        let alloc = Allocator::default();
        assert_eq_ignore_span_arena!(
            test_parser(&alloc, src, Syntax::Es(Default::default()), |p| p
                .parse_expr()),
            Expr::Class(Box::new_in(
                ClassExpr {
                    ident: Some(Ident {
                        span,
                        sym: "Foo".into(),
                        ..Default::default()
                    }),
                    class: Box::new_in(
                        Class {
                            span,
                            decorators: Vec::new_in(&alloc),
                            super_class: None,
                            type_params: None,
                            super_type_params: None,
                            is_abstract: false,
                            implements: Vec::new_in(&alloc),
                            body: vec![in &alloc; ClassMember::StaticBlock(Box::new_in(
StaticBlock {
                        span,
                        body: BlockStmt {
                            span,
                            stmts: vec![in &alloc; stmt(&alloc, "1 + 1;") ],
                            ctxt: SyntaxContext::default(),
                        }
                    }
                        , &alloc)) ],
                            ctxt: SyntaxContext::default(),
                        },
                        &alloc
                    )
                },
                &alloc
            ))
        );
    }

    #[test]
    fn multiple_class_static_blocks() {
        let src = "class Foo { static { 1 + 1; } static { 1 + 1; } }";
        let alloc = Allocator::default();
        assert_eq_ignore_span_arena!(
            test_parser(&alloc, src, Syntax::Es(Default::default()), |p| p
                .parse_expr()),
            Expr::Class(Box::new_in(
                ClassExpr {
                    ident: Some(Ident {
                        span,
                        sym: "Foo".into(),
                        ..Default::default()
                    }),
                    class: Box::new_in(
                        Class {
                            span,
                            decorators: Vec::new_in(&alloc),
                            super_class: None,
                            is_abstract: false,
                            body: vec![in &alloc;
                                                            ClassMember::StaticBlock(Box::new_in(StaticBlock {
                                                                span,
                                                                body: BlockStmt {
                                                                    span,
                                                                    stmts: vec![in &alloc; stmt(&alloc, "1 + 1;") ],
                                                                    ctxt: SyntaxContext::default(),
                                                                },
                                                            }, &alloc)),
                                                            ClassMember::StaticBlock(Box::new_in(
                            StaticBlock {
                                                                span,
                                                                body: BlockStmt {
                                                                    span,
                                                                    stmts: vec![in &alloc; stmt(&alloc, "1 + 1;") ],
                                                                    ctxt: SyntaxContext::default(),
                                                                },
                                                            }
                                                                , &alloc))
                                                        ],
                            ctxt: SyntaxContext::default(),
                            implements: Vec::new_in(&alloc),
                            super_type_params: None,
                            type_params: None,
                        },
                        &alloc
                    )
                },
                &alloc
            ))
        );
    }

    #[test]
    fn class_static_blocks_with_line_breaks_01() {
        let src = "class Foo {
            static
            {
                1 + 1;
            }
        }";
        let alloc = Allocator::default();
        assert_eq_ignore_span_arena!(
            test_parser(&alloc, src, Syntax::Es(Default::default()), |p| p
                .parse_expr()),
            Expr::Class(Box::new_in(
                ClassExpr {
                    ident: Some(Ident {
                        span,
                        sym: "Foo".into(),
                        optional: false,
                        ctxt: SyntaxContext::default(),
                    }),
                    class: Box::new_in(
                        Class {
                            span,
                            is_abstract: false,
                            body: vec![in &alloc; ClassMember::StaticBlock(Box::new_in(
                                StaticBlock {
                        span,
                        body: BlockStmt {
                            span,
                            stmts: vec![in &alloc; stmt(&alloc, "1 + 1;") ],
                            ctxt: SyntaxContext::default(),
                        }
                    }
                                , &alloc)) ],
                            ctxt: SyntaxContext::default(),
                            decorators: Vec::new_in(&alloc),
                            implements: Vec::new_in(&alloc),
                            super_class: None,
                            super_type_params: None,
                            type_params: None,
                        },
                        &alloc
                    )
                },
                &alloc
            ))
        );
    }

    #[test]
    fn class_static_blocks_with_line_breaks_02() {
        let src = "class Foo {
            static
            {}
        }";
        let alloc = Allocator::default();
        assert_eq_ignore_span_arena!(
            test_parser(&alloc, src, Syntax::Es(Default::default()), |p| p
                .parse_expr()),
            Expr::Class(Box::new_in(
                ClassExpr {
                    ident: Some(Ident {
                        span,
                        sym: "Foo".into(),
                        ctxt: SyntaxContext::default(),
                        optional: false,
                    }),
                    class: Box::new_in(
                        Class {
                            span,
                            is_abstract: false,
                            body: vec![in &alloc; ClassMember::StaticBlock(Box::new_in(
                            StaticBlock {
                            span,
                            body: BlockStmt {
                                span,
                                stmts: Vec::new_in(&alloc),
                                ctxt: SyntaxContext::default(),
                            }
                        }
                            , &alloc)) ],
                            ctxt: SyntaxContext::default(),
                            decorators: Vec::new_in(&alloc),
                            implements: Vec::new_in(&alloc),
                            super_class: None,
                            super_type_params: None,
                            type_params: None,
                        },
                        &alloc
                    )
                },
                &alloc
            ))
        );
    }

    #[test]
    fn class_static_blocks_in_ts() {
        let src = "class Foo { static { 1 + 1 }; }";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Typescript(Default::default()), |p| {
            p.parse_expr()
        });
    }

    #[test]
    fn class_static_blocks_with_line_breaks_in_ts_01() {
        let src = "class Foo {
            static
            {
                1 + 1;
            }
        }";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Typescript(Default::default()), |p| {
            p.parse_expr()
        });
    }

    #[test]
    fn class_static_blocks_with_line_breaks_in_ts_02() {
        let src = "class Foo {
            static
            {}
        }";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Typescript(Default::default()), |p| {
            p.parse_expr()
        });
    }

    #[test]
    #[should_panic(expected = "Expected ident")]
    fn class_static_blocks_with_await() {
        let src = "class Foo{
            static {
                var await = 'bar';
            }
        }";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Es(Default::default()), |p| {
            p.parse_expr()
        });
    }

    #[test]
    #[should_panic(expected = "Expected ident")]
    fn class_static_blocks_with_await_in_nested_class() {
        let src = "class Foo{
            static {
                function foo() {
                    class Foo {
                        static {
                            var await = 'bar';
                        }
                    }
                }
            }
        }";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Es(Default::default()), |p| {
            p.parse_expr()
        });
    }

    #[test]
    fn class_static_blocks_with_await_in_fn() {
        let src = "class Foo{
            static {
                function foo() {
                    var await = 'bar';
                }
            }
        }";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Es(Default::default()), |p| {
            p.parse_expr()
        });
    }

    #[test]
    #[should_panic(expected = "Modifiers cannot appear here")]
    fn class_static_blocks_in_ts_with_invalid_modifier_01() {
        let src = "class Foo { abstract static { 1 + 1 }; }";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Typescript(Default::default()), |p| {
            p.parse_expr()
        });
    }

    #[test]
    #[should_panic(expected = "Modifiers cannot appear here")]
    fn class_static_blocks_in_ts_with_invalid_modifier_02() {
        let src = "class Foo { static static { 1 + 1 }; }";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Typescript(Default::default()), |p| {
            p.parse_expr()
        });
    }

    #[test]
    #[should_panic(expected = "Modifiers cannot appear here")]
    fn class_static_blocks_in_ts_with_invalid_modifier_03() {
        let src = "class Foo { declare static { 1 + 1 }; }";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Typescript(Default::default()), |p| {
            p.parse_expr()
        });
    }

    #[test]
    #[should_panic(expected = "Modifiers cannot appear here")]
    fn class_static_blocks_in_ts_with_invalid_modifier_04() {
        let src = "class Foo { private static { 1 + 1 }; }";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Typescript(Default::default()), |p| {
            p.parse_expr()
        });
    }

    #[test]
    #[should_panic(expected = "Trailing comma is disallowed inside import(...) arguments")]
    fn error_for_trailing_comma_inside_dynamic_import() {
        let src = "import('foo',)";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Es(Default::default()), |p| {
            p.parse_expr()
        });
    }

    #[test]
    fn no_error_for_trailing_comma_inside_dynamic_import_with_import_assertions() {
        let src = "import('foo',)";
        let alloc = Allocator::default();
        test_parser(
            &alloc,
            src,
            Syntax::Es(EsSyntax {
                import_attributes: true,
                ..Default::default()
            }),
            |p| p.parse_expr(),
        );
    }

    #[test]
    fn type_only_star_exports_with_name() {
        let src = "export type * as bar from 'mod'";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Typescript(Default::default()), |p| {
            p.parse_module()
        });
    }

    #[test]
    fn type_only_star_exports_without_name() {
        let src = "export type * from 'mod'";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Typescript(Default::default()), |p| {
            p.parse_module()
        });
    }

    #[test]
    #[should_panic(expected = "A string literal cannot be used as an imported binding.")]
    fn error_for_string_literal_is_import_binding() {
        let src = "import { \"str\" } from \"mod\"";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Es(Default::default()), |p| {
            p.parse_module()
        });
    }

    #[test]
    #[should_panic(
        expected = "A string literal cannot be used as an exported binding without `from`."
    )]
    fn error_for_string_literal_is_export_binding() {
        let src = "export { 'foo' };";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Es(Default::default()), |p| {
            p.parse_module()
        });
    }

    #[test]
    #[should_panic(expected = "'const' declarations must be initialized")]
    fn ts_error_for_const_declaration_not_initialized() {
        let src = r#"
"use strict";
const foo;"#;

        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Typescript(Default::default()), |p| {
            p.parse_script()
        });
    }

    #[test]
    #[should_panic(expected = "'const' declarations must be initialized")]
    fn es_error_for_const_declaration_not_initialized() {
        let src = r#"
"use strict";
const foo;"#;

        let alloc = Allocator::default();
        test_parser(&alloc, src, Syntax::Es(Default::default()), |p| {
            p.parse_script()
        });
    }

    #[test]
    fn issue_5557_expr_follow_class() {
        let src = "foo * class {} / bar;";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Default::default(), |p| p.parse_script());
    }

    #[test]
    fn issue_5722_class_keyword_in_tpl() {
        let src = "console.log(`${toStr({class: fn})}`)";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Default::default(), |p| p.parse_script());
    }

    #[test]
    fn issue_6301_await_expr_stmt() {
        let src = "try { await; } catch { console.log('caught'); }";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Default::default(), |p| p.parse_script());
    }

    #[test]
    fn issue_6301_await_expr_stmt_1() {
        let src = "try { await, await; } catch { console.log('caught'); }";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Default::default(), |p| p.parse_script());
    }

    #[test]
    fn issue_6301_await_expr_stmt_2() {
        let src = "function test() { await; }";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Default::default(), |p| p.parse_script());
    }

    #[test]
    fn issue_6301_await_expr_stmt_3() {
        let src = "function test() { await, await; }";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Default::default(), |p| p.parse_script());
    }

    #[test]
    fn issue_6301_await_expr_stmt_4() {
        let src = "function test() { [await]; }";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Default::default(), |p| p.parse_script());
    }

    #[test]
    fn issue_6301_await_expr_stmt_5() {
        let src = "function test() { (await); }";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Default::default(), |p| p.parse_script());
    }

    #[test]
    fn issue_6322() {
        let src = "for ( ; { } / 1 ; ) ;";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Default::default(), |p| p.parse_script());
    }

    #[test]
    fn issue_6323() {
        let src = "let x = 0 < { } / 0 ;";
        let alloc = Allocator::default();
        test_parser(&alloc, src, Default::default(), |p| p.parse_script());
    }
}
