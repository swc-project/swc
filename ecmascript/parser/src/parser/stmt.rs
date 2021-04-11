use super::{pat::PatType, *};
use crate::error::SyntaxError;
use swc_atoms::js_word;
use swc_common::Spanned;

mod module_item;

impl<'a, I: Tokens> Parser<I> {
    pub(super) fn parse_block_body<Type>(
        &mut self,
        mut allow_directives: bool,
        top_level: bool,
        end: Option<&Token>,
    ) -> PResult<Vec<Type>>
    where
        Self: StmtLikeParser<'a, Type>,
        Type: IsDirective + From<Stmt>,
    {
        trace_cur!(self, parse_block_body);

        let old_ctx = self.ctx();

        let mut stmts = vec![];
        while {
            let c = cur!(self, false).ok();
            c != end
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

        if end.is_some() {
            bump!(self);
        }

        self.set_ctx(old_ctx);

        Ok(stmts)
    }

    pub fn parse_stmt(&mut self, top_level: bool) -> PResult<Stmt> {
        trace_cur!(self, parse_stmt);
        self.parse_stmt_like(false, top_level)
    }

    fn parse_stmt_list_item(&mut self, top_level: bool) -> PResult<Stmt> {
        trace_cur!(self, parse_stmt_list_item);
        self.parse_stmt_like(true, top_level)
    }

    /// Parse a statement, declaration or module item.
    fn parse_stmt_like<Type>(&mut self, include_decl: bool, top_level: bool) -> PResult<Type>
    where
        Self: StmtLikeParser<'a, Type>,
        Type: IsDirective + From<Stmt>,
    {
        trace_cur!(self, parse_stmt_like);
        let start = cur_pos!(self);
        let decorators = self.parse_decorators(true)?;

        if is_one_of!(self, "import", "export") {
            return self.handle_import_export(top_level, decorators);
        }

        self.parse_stmt_internal(start, include_decl, top_level, decorators)
            .map(From::from)
    }

    /// `parseStatementContent`
    #[allow(clippy::cognitive_complexity)]
    fn parse_stmt_internal(
        &mut self,
        start: BytePos,
        include_decl: bool,
        top_level: bool,
        decorators: Vec<Decorator>,
    ) -> PResult<Stmt> {
        trace_cur!(self, parse_stmt_internal);

        if top_level && is!(self, "await") {
            let valid = self.target() >= JscTarget::Es2017 && self.syntax().top_level_await();

            if !valid {
                self.emit_err(self.input.cur_span(), SyntaxError::TopLevelAwait);
            }

            let expr = self.parse_await_expr()?;
            eat!(self, ';');

            let span = span!(self, start);
            return Ok(Stmt::Expr(ExprStmt { span, expr }));
        }

        if self.input.syntax().typescript() && is!(self, "const") && peeked_is!(self, "enum") {
            assert_and_bump!(self, "const");
            assert_and_bump!(self, "enum");
            return self
                .parse_ts_enum_decl(start, true)
                .map(Decl::from)
                .map(Stmt::from);
        }

        match cur!(self, true)? {
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
                } else {
                    if !self.ctx().is_continue_allowed {
                        self.emit_err(span, SyntaxError::TS1115);
                    } else if label.is_some()
                        && !self.state.labels.contains(&label.as_ref().unwrap().sym)
                    {
                        self.emit_err(span, SyntaxError::TS1107);
                    }
                }

                return Ok(if is_break {
                    Stmt::Break(BreakStmt { span, label })
                } else {
                    Stmt::Continue(ContinueStmt { span, label })
                });
            }

            tok!("debugger") => {
                bump!(self);
                expect!(self, ';');
                return Ok(Stmt::Debugger(DebuggerStmt {
                    span: span!(self, start),
                }));
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

                return self.parse_fn_decl(decorators).map(Stmt::from);
            }

            tok!("class") => {
                if !include_decl {
                    self.emit_err(self.input.cur_span(), SyntaxError::DeclNotAllowed);
                }
                return self
                    .parse_class_decl(start, start, decorators)
                    .map(Stmt::from);
            }

            tok!("if") => {
                return self.parse_if_stmt();
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

                return Ok(Stmt::Expr(ExprStmt {
                    span,
                    expr: Box::new(Expr::Invalid(Invalid { span })),
                }));
            }

            // Error recovery
            tok!("finally") => {
                let span = self.input.cur_span();
                self.emit_err(span, SyntaxError::TS1005);

                let _ = self.parse_finally_block();

                return Ok(Stmt::Expr(ExprStmt {
                    span,
                    expr: Box::new(Expr::Invalid(Invalid { span })),
                }));
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
                return Ok(Stmt::Decl(Decl::Var(v)));
            }

            tok!("const") if include_decl => {
                let v = self.parse_var_stmt(false)?;
                return Ok(Stmt::Decl(Decl::Var(v)));
            }

            // 'let' can start an identifier reference.
            tok!("let") if include_decl => {
                let strict = self.ctx().strict;
                let is_keyword = match peek!(self) {
                    Ok(t) => t.follows_keyword_let(strict),
                    _ => false,
                };

                if is_keyword {
                    let v = self.parse_var_stmt(false)?;
                    return Ok(Stmt::Decl(Decl::Var(v)));
                }
            }

            tok!('{') => {
                return self.parse_block(false).map(Stmt::Block);
            }

            _ => {}
        }

        if eat_exact!(self, ';') {
            return Ok(Stmt::Empty(EmptyStmt {
                span: span!(self, start),
            }));
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
                Box::new(Expr::Ident(ident))
            }
            _ => self.verify_expr(expr)?,
        };
        if let Expr::Ident(ref ident) = *expr {
            if *ident.sym == js_word!("interface") && self.input.had_line_break_before_cur() {
                self.emit_strict_mode_err(ident.span, SyntaxError::InvalidIdentInStrict);

                eat!(self, ';');

                return Ok(Stmt::Expr(ExprStmt {
                    span: span!(self, start),
                    expr,
                }));
            }

            if self.input.syntax().typescript() {
                if let Some(decl) = self.parse_ts_expr_stmt(decorators, ident.clone())? {
                    return Ok(Stmt::Decl(decl));
                }
            }
        }

        match *expr {
            Expr::Ident(Ident { ref sym, span, .. }) => match *sym {
                js_word!("enum") | js_word!("interface") => {
                    self.emit_strict_mode_err(span, SyntaxError::InvalidIdentInStrict);
                }
                _ => {}
            },
            _ => {}
        }

        if self.syntax().typescript() {
            match *expr {
                Expr::Ident(ref i) => match i.sym {
                    js_word!("public") | js_word!("static") | js_word!("abstract") => {
                        if eat!(self, "interface") {
                            self.emit_err(i.span, SyntaxError::TS2427);
                            return self
                                .parse_ts_interface_decl(start)
                                .map(Decl::from)
                                .map(Stmt::from);
                        }
                    }
                    _ => {}
                },
                _ => {}
            }
        }

        if eat!(self, ';') {
            Ok(Stmt::Expr(ExprStmt {
                span: span!(self, start),
                expr,
            }))
        } else {
            match *cur!(self, false)? {
                Token::BinOp(..) => {
                    self.emit_err(self.input.cur_span(), SyntaxError::TS1005);
                    let expr = self.parse_bin_op_recursively(expr, 0)?;
                    return Ok(ExprStmt {
                        span: span!(self, start),
                        expr,
                    }
                    .into());
                }

                _ => {}
            }

            syntax_error!(
                self,
                SyntaxError::ExpectedSemiForExprStmt { expr: expr.span() }
            );
        }
    }

    fn parse_if_stmt(&mut self) -> PResult<Stmt> {
        let start = cur_pos!(self);

        assert_and_bump!(self, "if");

        expect!(self, '(');
        let test = self.include_in_expr(true).parse_expr()?;
        if !eat!(self, ')') {
            self.emit_err(self.input.cur_span(), SyntaxError::TS1005);

            let span = span!(self, start);
            return Ok(Stmt::If(IfStmt {
                span,
                test,
                cons: Box::new(Stmt::Expr(ExprStmt {
                    span,
                    expr: Box::new(Expr::Invalid(Invalid { span })),
                })),
                alt: Default::default(),
            }));
        }

        let cons = {
            // Annex B
            if !self.ctx().strict && is!(self, "function") {
                // TODO: report error?
            }
            self.parse_stmt(false).map(Box::new)?
        };

        let alt = if eat!(self, "else") {
            Some(self.parse_stmt(false).map(Box::new)?)
        } else {
            None
        };

        let span = span!(self, start);
        Ok(Stmt::If(IfStmt {
            span,
            test,
            cons,
            alt,
        }))
    }

    fn parse_return_stmt(&mut self) -> PResult<Stmt> {
        let start = cur_pos!(self);

        let stmt = self.parse_with(|p| {
            assert_and_bump!(p, "return");

            let arg = if is!(p, ';') {
                None
            } else {
                p.include_in_expr(true).parse_expr().map(Some)?
            };
            expect!(p, ';');
            Ok(Stmt::Return(ReturnStmt {
                span: span!(p, start),
                arg,
            }))
        });

        if !self.ctx().in_function {
            self.emit_err(span!(self, start), SyntaxError::ReturnNotAllowed);
        }

        stmt
    }

    #[allow(clippy::cognitive_complexity)]
    fn parse_switch_stmt(&mut self) -> PResult<Stmt> {
        let switch_start = cur_pos!(self);

        assert_and_bump!(self, "switch");

        expect!(self, '(');
        let discriminant = self.include_in_expr(true).parse_expr()?;
        expect!(self, ')');

        let mut cases = vec![];
        let mut span_of_previous_default = None;

        expect!(self, '{');
        let ctx = Context {
            is_break_allowed: true,
            ..self.ctx()
        };

        self.with_ctx(ctx).parse_with(|p| {
            while is_one_of!(p, "case", "default") {
                let mut cons = vec![];
                let is_case = is!(p, "case");
                let case_start = cur_pos!(p);
                bump!(p);
                let ctx = Context {
                    in_case_cond: true,
                    ..p.ctx()
                };
                let test = if is_case {
                    p.with_ctx(ctx)
                        .include_in_expr(true)
                        .parse_expr()
                        .map(Some)?
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
                    span: Span::new(case_start, p.input.prev_span().hi, Default::default()),
                    test,
                    cons,
                });
            }

            Ok(())
        })?;

        // eof or rbrace
        expect!(self, '}');

        Ok(Stmt::Switch(SwitchStmt {
            span: span!(self, switch_start),
            discriminant,
            cases,
        }))
    }

    fn parse_throw_stmt(&mut self) -> PResult<Stmt> {
        let start = cur_pos!(self);

        assert_and_bump!(self, "throw");

        if self.input.had_line_break_before_cur() {
            // TODO: Suggest throw arg;
            syntax_error!(self, SyntaxError::LineBreakInThrow);
        }

        let arg = self.include_in_expr(true).parse_expr()?;
        expect!(self, ';');

        let span = span!(self, start);
        Ok(Stmt::Throw(ThrowStmt { span, arg }))
    }

    fn parse_try_stmt(&mut self) -> PResult<Stmt> {
        let start = cur_pos!(self);
        assert_and_bump!(self, "try");

        let block = self.parse_block(false)?;

        let catch_start = cur_pos!(self);
        let handler = self.parse_catch_clause()?;
        let finalizer = self.parse_finally_block()?;

        if handler.is_none() && finalizer.is_none() {
            self.emit_err(
                Span::new(catch_start, catch_start, Default::default()),
                SyntaxError::TS1005,
            );
        }

        let span = span!(self, start);
        Ok(Stmt::Try(TryStmt {
            span,
            block,
            handler,
            finalizer,
        }))
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
            let mut pat = self.parse_binding_pat_or_ident()?;

            let type_ann_start = cur_pos!(self);

            if self.syntax().typescript() && eat!(self, ':') {
                let ctx = Context {
                    in_type: true,
                    ..self.ctx()
                };

                let ty = self.with_ctx(ctx).parse_with(|p| p.parse_ts_type())?;
                // self.emit_err(ty.span(), SyntaxError::TS1196);

                match &mut pat {
                    Pat::Ident(BindingIdent { type_ann, .. })
                    | Pat::Array(ArrayPat { type_ann, .. })
                    | Pat::Rest(RestPat { type_ann, .. })
                    | Pat::Object(ObjectPat { type_ann, .. })
                    | Pat::Assign(AssignPat { type_ann, .. }) => {
                        *type_ann = Some(TsTypeAnn {
                            span: span!(self, type_ann_start),
                            type_ann: ty,
                        });
                    }
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

    pub(super) fn parse_var_stmt(&mut self, for_loop: bool) -> PResult<VarDecl> {
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
                    let span = Span::new(pos, pos, Default::default());
                    self.emit_err(span, SyntaxError::TS1123);

                    return Ok(VarDecl {
                        span: span!(self, start),
                        kind,
                        declare: false,
                        decls: vec![],
                    });
                }
                Err(..) => {}
                _ => {}
            }
        }

        let mut decls = vec![];
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
                    Span::new(prev_span.hi, prev_span.hi, Default::default())
                } else {
                    prev_span
                };
                self.emit_err(span, SyntaxError::TS1009);
                break;
            }

            decls.push(self.with_ctx(ctx).parse_var_declarator(for_loop)?);
        }

        if !for_loop {
            if !eat!(self, ';') {
                self.emit_err(self.input.cur_span(), SyntaxError::TS1005);

                let _ = self.parse_expr();

                while !eat!(self, ';') {
                    bump!(self);
                }
            }
        }

        Ok(VarDecl {
            span: span!(self, start),
            declare: false,
            kind,
            decls,
        })
    }

    fn parse_var_declarator(&mut self, for_loop: bool) -> PResult<VarDeclarator> {
        let start = cur_pos!(self);

        let mut name = self.parse_binding_pat_or_ident()?;

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
            match name {
                Pat::Array(ArrayPat {
                    ref mut type_ann, ..
                })
                | Pat::Assign(AssignPat {
                    ref mut type_ann, ..
                })
                | Pat::Ident(BindingIdent {
                    ref mut type_ann, ..
                })
                | Pat::Object(ObjectPat {
                    ref mut type_ann, ..
                })
                | Pat::Rest(RestPat {
                    ref mut type_ann, ..
                }) => {
                    *type_ann = type_annotation;
                }
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

    #[allow(clippy::cognitive_complexity)]
    fn parse_do_stmt(&mut self) -> PResult<Stmt> {
        let start = cur_pos!(self);

        assert_and_bump!(self, "do");

        let ctx = Context {
            is_break_allowed: true,
            is_continue_allowed: true,
            ..self.ctx()
        };
        let body = self.with_ctx(ctx).parse_stmt(false).map(Box::new)?;
        expect!(self, "while");
        expect!(self, '(');
        let test = self.include_in_expr(true).parse_expr()?;
        expect!(self, ')');
        // We *may* eat semicolon.
        let _ = eat!(self, ';');

        let span = span!(self, start);

        Ok(Stmt::DoWhile(DoWhileStmt { span, test, body }))
    }

    fn parse_while_stmt(&mut self) -> PResult<Stmt> {
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
        let body = self.with_ctx(ctx).parse_stmt(false).map(Box::new)?;

        let span = span!(self, start);
        Ok(Stmt::While(WhileStmt { span, test, body }))
    }

    fn parse_with_stmt(&mut self) -> PResult<Stmt> {
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
        let body = self.with_ctx(ctx).parse_stmt(false).map(Box::new)?;

        let span = span!(self, start);
        Ok(Stmt::With(WithStmt { span, obj, body }))
    }

    pub(super) fn parse_block(&mut self, allow_directives: bool) -> PResult<BlockStmt> {
        let start = cur_pos!(self);

        expect!(self, '{');

        let stmts = self.parse_block_body(allow_directives, false, Some(&tok!('}')))?;

        let span = span!(self, start);
        Ok(BlockStmt { span, stmts })
    }

    fn parse_labelled_stmt(&mut self, l: Ident) -> PResult<Stmt> {
        let ctx = Context {
            is_break_allowed: true,
            ..self.ctx()
        };
        self.with_ctx(ctx).parse_with(|p| {
            let start = l.span.lo();

            for lb in &p.state.labels {
                if l.sym == *lb {
                    p.emit_err(l.span, SyntaxError::DuplicateLabel(l.sym.clone()));
                }
            }
            p.state.labels.push(l.sym.clone());

            let body = Box::new(if is!(p, "function") {
                let f = p.parse_fn_decl(vec![])?;
                match f {
                    Decl::Fn(FnDecl {
                        function:
                            Function {
                                span,
                                is_generator: true,
                                ..
                            },
                        ..
                    }) => syntax_error!(p, span, SyntaxError::LabelledGenerator),
                    _ => {}
                }

                f.into()
            } else {
                p.parse_stmt(false)?
            });

            {
                let pos = p.state.labels.iter().position(|v| v == &l.sym);
                if let Some(pos) = pos {
                    p.state.labels.remove(pos);
                }
            }

            Ok(Stmt::Labeled(LabeledStmt {
                span: span!(p, start),
                label: l,
                body,
            }))
        })
    }

    fn parse_for_stmt(&mut self) -> PResult<Stmt> {
        let start = cur_pos!(self);

        assert_and_bump!(self, "for");
        let await_start = cur_pos!(self);
        let await_token = if eat!(self, "await") {
            Some(span!(self, await_start))
        } else {
            None
        };
        expect!(self, '(');
        let head = self.parse_for_head()?;
        expect!(self, ')');
        let ctx = Context {
            is_break_allowed: true,
            is_continue_allowed: true,
            ..self.ctx()
        };
        let body = self.with_ctx(ctx).parse_stmt(false).map(Box::new)?;

        let span = span!(self, start);
        Ok(match head {
            ForHead::For { init, test, update } => {
                if let Some(await_token) = await_token {
                    syntax_error!(self, await_token, SyntaxError::AwaitForStmt);
                }

                Stmt::For(ForStmt {
                    span,
                    init,
                    test,
                    update,
                    body,
                })
            }
            ForHead::ForIn { left, right } => {
                if let Some(await_token) = await_token {
                    syntax_error!(self, await_token, SyntaxError::AwaitForStmt);
                }

                Stmt::ForIn(ForInStmt {
                    span,
                    left,
                    right,
                    body,
                })
            }
            ForHead::ForOf { left, right } => Stmt::ForOf(ForOfStmt {
                span,
                await_token,
                left,
                right,
                body,
            }),
        })
    }

    fn parse_for_head(&mut self) -> PResult<ForHead> {
        let start = cur_pos!(self);
        let strict = self.ctx().strict;

        if is_one_of!(self, "const", "var")
            || (is!(self, "let") && peek!(self)?.follows_keyword_let(strict))
        {
            let decl = self.parse_var_stmt(true)?;

            if is_one_of!(self, "of", "in") {
                let is_in = is!(self, "in");

                if decl.decls.len() != 1 {
                    for d in decl.decls.iter().skip(1) {
                        self.emit_err(d.name.span(), SyntaxError::TooManyVarInForInHead);
                    }
                } else {
                    if decl.decls[0].init.is_some() {
                        self.emit_err(
                            decl.decls[0].name.span(),
                            SyntaxError::VarInitializerInForInHead,
                        );
                    }

                    if self.syntax().typescript() {
                        let type_ann = match decl.decls[0].name {
                            Pat::Ident(ref v) => Some(&v.type_ann),
                            Pat::Array(ref v) => Some(&v.type_ann),
                            Pat::Assign(ref v) => Some(&v.type_ann),
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

                return self.parse_for_each_head(VarDeclOrPat::VarDecl(decl));
            }

            expect_exact!(self, ';');
            return self.parse_normal_for_head(Some(VarDeclOrExpr::VarDecl(decl)));
        }

        let init = if eat_exact!(self, ';') {
            return self.parse_normal_for_head(None);
        } else {
            self.include_in_expr(false).parse_expr_or_pat()?
        };

        // for (a of b)
        if is_one_of!(self, "of", "in") {
            let is_in = is!(self, "in");

            let pat = self.reparse_expr_as_pat(PatType::AssignPat, init)?;

            // for ({} in foo) is invalid
            if self.input.syntax().typescript() && is_in {
                match pat {
                    Pat::Ident(ref v) => {}
                    Pat::Expr(..) => {}
                    ref v => self.emit_err(v.span(), SyntaxError::TS2491),
                }
            }

            return self.parse_for_each_head(VarDeclOrPat::Pat(pat));
        }

        expect_exact!(self, ';');

        let init = self.verify_expr(init)?;
        self.parse_normal_for_head(Some(VarDeclOrExpr::Expr(init)))
    }

    fn parse_for_each_head(&mut self, left: VarDeclOrPat) -> PResult<ForHead> {
        let of = bump!(self) == tok!("of");
        if of {
            let right = self.include_in_expr(true).parse_assignment_expr()?;
            Ok(ForHead::ForOf { left, right })
        } else {
            let right = self.include_in_expr(true).parse_expr()?;
            Ok(ForHead::ForIn { left, right })
        }
    }

    fn parse_normal_for_head(&mut self, init: Option<VarDeclOrExpr>) -> PResult<ForHead> {
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

        Ok(ForHead::For { init, test, update })
    }
}

enum ForHead {
    For {
        init: Option<VarDeclOrExpr>,
        test: Option<Box<Expr>>,
        update: Option<Box<Expr>>,
    },
    ForIn {
        left: VarDeclOrPat,
        right: Box<Expr>,
    },
    ForOf {
        left: VarDeclOrPat,
        right: Box<Expr>,
    },
}

pub(super) trait IsDirective {
    fn as_ref(&self) -> Option<&Stmt>;
    fn is_use_strict(&self) -> bool {
        match self.as_ref() {
            Some(&Stmt::Expr(ref expr)) => match *expr.expr {
                Expr::Lit(Lit::Str(Str {
                    ref value,
                    has_escape: false,
                    ..
                })) => value == "use strict",
                _ => false,
            },
            _ => false,
        }
    }
}

impl IsDirective for Stmt {
    fn as_ref(&self) -> Option<&Stmt> {
        Some(self)
    }
}

pub(super) trait StmtLikeParser<'a, Type: IsDirective> {
    fn handle_import_export(
        &mut self,
        top_level: bool,
        decorators: Vec<Decorator>,
    ) -> PResult<Type>;
}

impl<'a, I: Tokens> StmtLikeParser<'a, Stmt> for Parser<I> {
    fn handle_import_export(&mut self, top_level: bool, _: Vec<Decorator>) -> PResult<Stmt> {
        let start = cur_pos!(self);
        if self.input.syntax().dynamic_import() && is!(self, "import") {
            let expr = self.parse_expr()?;

            eat!(self, ';');

            return Ok(ExprStmt {
                span: span!(self, start),
                expr,
            }
            .into());
        }

        if self.input.syntax().import_meta() && is!(self, "import") && peeked_is!(self, '.') {
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

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{EsConfig, TsConfig};
    use swc_common::{comments::SingleThreadedComments, DUMMY_SP as span};
    use swc_ecma_visit::assert_eq_ignore_span;

    fn stmt(s: &'static str) -> Stmt {
        test_parser(s, Syntax::default(), |p| p.parse_stmt(true))
    }

    fn module_item(s: &'static str) -> ModuleItem {
        test_parser(s, Syntax::default(), |p| p.parse_stmt_like(true, true))
    }
    fn expr(s: &'static str) -> Box<Expr> {
        test_parser(s, Syntax::default(), |p| p.parse_expr())
    }

    #[test]
    fn expr_stmt() {
        assert_eq_ignore_span!(
            stmt("a + b + c"),
            Stmt::Expr(ExprStmt {
                span,
                expr: expr("a + b + c")
            })
        )
    }

    #[test]
    fn catch_rest_pat() {
        assert_eq_ignore_span!(
            stmt("try {} catch({ ...a34 }) {}"),
            Stmt::Try(TryStmt {
                span,
                block: BlockStmt {
                    span,
                    stmts: vec![]
                },
                handler: Some(CatchClause {
                    span,
                    param: Pat::Object(ObjectPat {
                        span,
                        optional: false,
                        props: vec![ObjectPatProp::Rest(RestPat {
                            span,
                            dot3_token: span,
                            arg: Box::new(Pat::Ident(Ident::new("a34".into(), span).into())),
                            type_ann: None
                        })],
                        type_ann: None,
                    })
                    .into(),
                    body: BlockStmt {
                        span,
                        stmts: vec![]
                    }
                }),
                finalizer: None
            })
        );
    }

    #[test]
    fn throw_this() {
        assert_eq_ignore_span!(
            stmt("throw this"),
            Stmt::Throw(ThrowStmt {
                span,
                arg: expr("this"),
            })
        )
    }

    #[test]
    fn await_for_of() {
        assert_eq_ignore_span!(
            stmt("for await (const a of b) ;"),
            Stmt::ForOf(ForOfStmt {
                span,
                await_token: Some(span),
                left: VarDeclOrPat::VarDecl(VarDecl {
                    span,
                    kind: VarDeclKind::Const,
                    decls: vec![VarDeclarator {
                        span,
                        init: None,
                        name: Pat::Ident(Ident::new("a".into(), span).into()),
                        definite: false,
                    }],
                    declare: false,
                }),
                right: Box::new(Expr::Ident(Ident::new("b".into(), span))),

                body: Box::new(Stmt::Empty(EmptyStmt { span })),
            })
        )
    }

    #[test]
    fn no_empty_without_semi() {
        assert_eq_ignore_span!(
            stmt("(function foo() { return 1 })"),
            stmt(
                "(function foo () {
                return 1
            })"
            )
        );

        assert_eq_ignore_span!(
            stmt("{ 1; }"),
            Stmt::Block(BlockStmt {
                span,
                stmts: vec![stmt("1")],
            })
        );
    }

    #[test]
    fn if_else() {
        assert_eq_ignore_span!(
            stmt("if (a) b; else c"),
            Stmt::If(IfStmt {
                span,
                test: expr("a"),
                cons: Box::new(stmt("b;")),
                alt: Some(Box::new(stmt("c"))),
            })
        );
    }

    #[test]
    fn class_decorator() {
        assert_eq_ignore_span!(
            test_parser(
                "
            @decorator
            @dec2
            class Foo {}
            ",
                Syntax::Es(EsConfig {
                    decorators: true,
                    ..Default::default()
                }),
                |p| p.parse_stmt_list_item(true),
            ),
            Stmt::Decl(Decl::Class(ClassDecl {
                ident: Ident::new("Foo".into(), span),
                class: Class {
                    span,
                    decorators: vec![
                        Decorator {
                            span,
                            expr: expr("decorator")
                        },
                        Decorator {
                            span,
                            expr: expr("dec2")
                        }
                    ],
                    super_class: None,
                    implements: vec![],
                    body: vec![],
                    is_abstract: false,
                    super_type_params: None,
                    type_params: None,
                },
                declare: false,
            }))
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
        test_parser(
            src,
            Syntax::Es(EsConfig {
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
        test_parser(
            src,
            Syntax::Es(EsConfig {
                jsx: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn export_default() {
        let src = "export v, { x, y as w } from 'mod';";
        test_parser(
            src,
            Syntax::Es(EsConfig {
                export_default_from: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn export_default_2() {
        let src = "export foo from 'bar';";
        test_parser(
            src,
            Syntax::Es(EsConfig {
                export_default_from: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn export_default_3() {
        let src = "export default from 'bar';";
        test_parser(
            src,
            Syntax::Es(EsConfig {
                export_default_from: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn export_default_4() {
        let src = "export default, {foo} from 'bar';";
        test_parser(
            src,
            Syntax::Es(EsConfig {
                export_default_from: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn shebang_01() {
        let src = "#!/usr/bin/env node";
        test_parser(
            src,
            Syntax::Es(EsConfig {
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn shebang_02() {
        let src = "#!/usr/bin/env node
let x = 4";
        test_parser(
            src,
            Syntax::Es(EsConfig {
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn empty() {
        test_parser(
            "",
            Syntax::Es(EsConfig {
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_226() {
        test_parser(
            "export * as Foo from 'bar';",
            Syntax::Es(EsConfig {
                export_default_from: true,
                export_namespace_from: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_257_var() {
        test_parser(
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
        test_parser(
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
        test_parser(
            ";(function() {})(window, window.lib || (window.lib = {}))",
            Default::default(),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_319_2() {
        module_item(
            "export default obj({
    async f() {
        await g();
    }
});",
        );
    }

    #[test]
    fn issue_340_fn() {
        test_parser("export default function(){};", Default::default(), |p| {
            p.parse_module()
        });
    }

    #[test]
    fn issue_340_async_fn() {
        test_parser(
            "export default async function(){};",
            Default::default(),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_340_generator_fn() {
        test_parser("export default function*(){};", Default::default(), |p| {
            p.parse_module()
        });
    }

    #[test]
    fn issue_340_class() {
        test_parser("export default class {};", Default::default(), |p| {
            p.parse_module()
        });
    }

    #[test]
    fn issue_360() {
        test_parser(
            "var IS_IE11 = !global.ActiveXObject && 'ActiveXObject' in global;",
            Default::default(),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_380_1() {
        test_parser(
            "import(filePath).then(bar => {})",
            Syntax::Es(EsConfig {
                dynamic_import: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_380_2() {
        test_parser(
            "class Foo {
                componentDidMount() {
                    const filePath = '../foo/bar'
                    import(filePath).then(bar => {})
                }
            }",
            Syntax::Es(EsConfig {
                dynamic_import: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_411() {
        test_parser(
            "try {
} catch {}",
            Syntax::Es(EsConfig {
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn top_level_await() {
        test_parser(
            "await foo",
            Syntax::Es(EsConfig {
                top_level_await: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
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
        let _ = test_parser_comment(
            &c,
            s,
            Syntax::Typescript(TsConfig {
                ..Default::default()
            }),
            |p| p.parse_typescript_module(),
        );

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

        let _ = test_parser_comment(
            &c,
            s,
            Syntax::Typescript(TsConfig {
                ..Default::default()
            }),
            |p| p.parse_typescript_module(),
        );

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

        let _ = test_parser_comment(
            &c,
            s,
            Syntax::Typescript(TsConfig {
                ..Default::default()
            }),
            |p| p.parse_typescript_module(),
        );

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

        let _ = test_parser_comment(
            &c,
            s,
            Syntax::Typescript(TsConfig {
                ..Default::default()
            }),
            |p| p.parse_typescript_module(),
        );

        let (leading, trailing) = c.take_all();
        assert!(trailing.borrow().is_empty());
        assert_eq!(leading.borrow().len(), 1);
    }
    fn parse_for_head(str: &'static str) -> ForHead {
        test_parser(str, Syntax::default(), |p| p.parse_for_head())
    }

    #[test]
    fn for_array_binding_pattern() {
        match parse_for_head("let [, , t] = simple_array; t < 10; t++") {
            ForHead::For { init: Some(v), .. } => assert_eq_ignore_span!(
                v,
                VarDeclOrExpr::VarDecl(VarDecl {
                    span,
                    declare: false,
                    kind: VarDeclKind::Let,
                    decls: vec![VarDeclarator {
                        span,
                        name: Pat::Array(ArrayPat {
                            span,
                            type_ann: None,
                            optional: false,
                            elems: vec![
                                None,
                                None,
                                Some(Pat::Ident(Ident::new("t".into(), span).into()))
                            ]
                        }),
                        init: Some(Box::new(Expr::Ident(Ident::new(
                            "simple_array".into(),
                            span
                        )))),
                        definite: false
                    }]
                })
            ),
            _ => assert!(false),
        }
    }
    #[test]
    fn for_object_binding_pattern() {
        match parse_for_head("let {num} = obj; num < 11; num++") {
            ForHead::For { init: Some(v), .. } => assert_eq_ignore_span!(
                v,
                VarDeclOrExpr::VarDecl(VarDecl {
                    span,
                    declare: false,
                    kind: VarDeclKind::Let,
                    decls: vec![VarDeclarator {
                        span,
                        name: Pat::Object(ObjectPat {
                            optional: false,
                            type_ann: None,
                            span,
                            props: vec![ObjectPatProp::Assign(AssignPatProp {
                                span,
                                key: Ident::new("num".into(), span),
                                value: None
                            })]
                        }),
                        init: Some(Box::new(Expr::Ident(Ident::new("obj".into(), span)))),
                        definite: false
                    }]
                })
            ),
            _ => assert!(false),
        }
    }
}
