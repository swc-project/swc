use super::{pat::PatType, *};
use crate::error::SyntaxError;
use swc_atoms::js_word;
use swc_common::Spanned;
#[cfg(test)]
use testing::assert_eq_ignore_span;

mod module_item;

#[parser]
impl<'a, I: Tokens> Parser<'a, I> {
    pub(super) fn parse_block_body<Type>(
        &mut self,
        mut allow_directives: bool,
        top_level: bool,
        end: Option<&Token>,
    ) -> PResult<'a, Vec<Type>>
    where
        Self: StmtLikeParser<'a, Type>,
        Type: IsDirective + From<Stmt>,
    {
        let old_ctx = self.ctx();

        let mut stmts = vec![];
        while {
            let c = cur!(false).ok();
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

                    if self.input.knows_cur() && !is!(';') {
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
            bump!();
        }

        self.set_ctx(old_ctx);

        Ok(stmts)
    }

    pub fn parse_stmt(&mut self, top_level: bool) -> PResult<'a, Stmt> {
        self.parse_stmt_like(false, top_level)
    }

    fn parse_stmt_list_item(&mut self, top_level: bool) -> PResult<'a, Stmt> {
        self.parse_stmt_like(true, top_level)
    }

    /// Parse a statement, declaration or module item.
    fn parse_stmt_like<Type>(&mut self, include_decl: bool, top_level: bool) -> PResult<'a, Type>
    where
        Self: StmtLikeParser<'a, Type>,
        Type: IsDirective + From<Stmt>,
    {
        let start = cur_pos!();
        let decorators = self.parse_decorators(true)?;

        if is_one_of!("import", "export") {
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
    ) -> PResult<'a, Stmt> {
        if self.input.syntax().typescript() && is!("const") && peeked_is!("enum") {
            assert_and_bump!("const");
            assert_and_bump!("enum");
            return self
                .parse_ts_enum_decl(start, /* is_const */ true)
                .map(Decl::from)
                .map(Stmt::from);
        }

        if is_one_of!("break", "continue") {
            let is_break = is!("break");
            bump!();

            let label = if eat!(';') {
                None
            } else {
                let i = self.parse_label_ident().map(Some)?;
                expect!(';');
                i
            };

            let span = span!(start);
            if is_break {
                if label.is_some() && !self.state.labels.contains(&label.as_ref().unwrap().sym) {
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

        if is!("debugger") {
            bump!();
            expect!(';');
            return Ok(Stmt::Debugger(DebuggerStmt { span: span!(start) }));
        }

        if is!("do") {
            return self.parse_do_stmt();
        }

        if is!("for") {
            return self.parse_for_stmt();
        }

        if is!("function") {
            if !include_decl {
                unexpected!()
            }

            return self.parse_fn_decl(decorators).map(Stmt::from);
        }

        if is!("class") {
            if !include_decl {
                unexpected!()
            }
            return self
                .parse_class_decl(start, start, decorators)
                .map(Stmt::from);
        }

        if is!("if") {
            return self.parse_if_stmt();
        }

        if is!("return") {
            return self.parse_return_stmt();
        }

        if is!("switch") {
            return self.parse_switch_stmt();
        }

        if is!("throw") {
            return self.parse_throw_stmt();
        }

        // Error
        if is!("catch") {
            let span = self.input.cur_span();
            self.emit_err(span, SyntaxError::TS1005);

            let _ = self.parse_catch_clause();
            let _ = self.parse_finally_block();

            return Ok(Stmt::Expr(ExprStmt {
                span,
                expr: Box::new(Expr::Invalid(Invalid { span })),
            }));
        }

        if is!("finally") {
            let span = self.input.cur_span();
            self.emit_err(span, SyntaxError::TS1005);

            let _ = self.parse_finally_block();

            return Ok(Stmt::Expr(ExprStmt {
                span,
                expr: Box::new(Expr::Invalid(Invalid { span })),
            }));
        }

        if is!("try") {
            return self.parse_try_stmt();
        }

        if is!("with") {
            return self.parse_with_stmt();
        }

        if is!("while") {
            return self.parse_while_stmt();
        }

        if is!("var") || (include_decl && is!("const")) {
            let v = self.parse_var_stmt(false)?;
            return Ok(Stmt::Decl(Decl::Var(v)));
        }

        // 'let' can start an identifier reference.
        if include_decl && is!("let") {
            let strict = self.ctx().strict;
            let is_keyword = match peek!() {
                Ok(t) => t.follows_keyword_let(strict),
                _ => false,
            };

            if is_keyword {
                let v = self.parse_var_stmt(false)?;
                return Ok(Stmt::Decl(Decl::Var(v)));
            }
        }

        if is!('{') {
            return self.parse_block(false).map(Stmt::Block);
        }

        if eat_exact!(';') {
            return Ok(Stmt::Empty(EmptyStmt { span: span!(start) }));
        }

        // Handle async function foo() {}
        if is!("async")
            && peeked_is!("function")
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
                if eat!(':') {
                    return self.parse_labelled_stmt(ident);
                }
                Box::new(Expr::Ident(ident))
            }
            _ => self.verify_expr(expr)?,
        };
        if let Expr::Ident(ref ident) = *expr {
            if *ident.sym == js_word!("interface")
                && self.input.had_line_break_before_cur()
                && self.ctx().strict
            {
                self.emit_err(ident.span, SyntaxError::InvalidIdentInStrict);

                eat!(';');

                return Ok(Stmt::Expr(ExprStmt {
                    span: span!(start),
                    expr,
                }));
            }

            if self.input.syntax().typescript() {
                if let Some(decl) = self.parse_ts_expr_stmt(decorators, ident.clone())? {
                    return Ok(Stmt::Decl(decl));
                }
            }
        }

        if self.ctx().strict {
            match *expr {
                Expr::Ident(Ident { ref sym, span, .. }) => match *sym {
                    js_word!("enum") | js_word!("interface") => {
                        self.emit_err(span, SyntaxError::InvalidIdentInStrict);
                    }
                    _ => {}
                },
                _ => {}
            }
        }

        if self.syntax().typescript() {
            match *expr {
                Expr::Ident(ref i) => match i.sym {
                    js_word!("public") | js_word!("static") => {
                        if eat!("interface") {
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

        if eat!(';') {
            Ok(Stmt::Expr(ExprStmt {
                span: span!(start),
                expr,
            }))
        } else {
            match *cur!(false)? {
                Token::BinOp(..) => {
                    self.emit_err(self.input.cur_span(), SyntaxError::TS1005);
                    let expr = self.parse_bin_op_recursively(expr, 0)?;
                    return Ok(ExprStmt {
                        span: span!(start),
                        expr,
                    }
                    .into());
                }

                _ => {}
            }

            syntax_error!(SyntaxError::ExpectedSemiForExprStmt { expr: expr.span() });
        }
    }

    fn parse_if_stmt(&mut self) -> PResult<'a, Stmt> {
        let start = cur_pos!();

        assert_and_bump!("if");

        expect!('(');
        let test = self.include_in_expr(true).parse_expr()?;
        expect!(')');

        let cons = {
            // Annex B
            if !self.ctx().strict && is!("function") {
                // TODO: report error?
            }
            self.parse_stmt(false).map(Box::new)?
        };

        let alt = if eat!("else") {
            Some(self.parse_stmt(false).map(Box::new)?)
        } else {
            None
        };

        let span = span!(start);
        Ok(Stmt::If(IfStmt {
            span,
            test,
            cons,
            alt,
        }))
    }

    fn parse_return_stmt(&mut self) -> PResult<'a, Stmt> {
        let start = cur_pos!();

        let stmt = self.parse_with(|p| {
            assert_and_bump!("return");

            let arg = if is!(';') {
                None
            } else {
                p.include_in_expr(true).parse_expr().map(Some)?
            };
            expect!(';');
            Ok(Stmt::Return(ReturnStmt {
                span: span!(start),
                arg,
            }))
        });

        if !self.ctx().in_function {
            self.emit_err(span!(start), SyntaxError::ReturnNotAllowed);
        }

        stmt
    }

    #[allow(clippy::cognitive_complexity)]
    fn parse_switch_stmt(&mut self) -> PResult<'a, Stmt> {
        let switch_start = cur_pos!();

        assert_and_bump!("switch");

        expect!('(');
        let discriminant = self.include_in_expr(true).parse_expr()?;
        expect!(')');

        let mut cases = vec![];
        let mut span_of_previous_default = None;

        expect!('{');
        let ctx = Context {
            is_break_allowed: true,
            ..self.ctx()
        };

        self.with_ctx(ctx).parse_with(|p| {
            while is_one_of!("case", "default") {
                let mut cons = vec![];
                let is_case = is!("case");
                let case_start = cur_pos!();
                bump!();
                let test = if is_case {
                    p.include_in_expr(true).parse_expr().map(Some)?
                } else {
                    if let Some(previous) = span_of_previous_default {
                        syntax_error!(SyntaxError::MultipleDefault { previous });
                    }
                    span_of_previous_default = Some(span!(case_start));

                    None
                };
                expect!(':');

                while !eof!() && !is_one_of!("case", "default", '}') {
                    cons.push(p.parse_stmt_list_item(false)?);
                }

                cases.push(SwitchCase {
                    span: Span::new(case_start, p.input.prev_span().hi(), Default::default()),
                    test,
                    cons,
                });
            }

            Ok(())
        })?;

        // eof or rbrace
        expect!('}');

        Ok(Stmt::Switch(SwitchStmt {
            span: span!(switch_start),
            discriminant,
            cases,
        }))
    }

    fn parse_throw_stmt(&mut self) -> PResult<'a, Stmt> {
        let start = cur_pos!();

        assert_and_bump!("throw");

        if self.input.had_line_break_before_cur() {
            // TODO: Suggest throw arg;
            syntax_error!(SyntaxError::LineBreakInThrow);
        }

        let arg = self.include_in_expr(true).parse_expr()?;
        expect!(';');

        let span = span!(start);
        Ok(Stmt::Throw(ThrowStmt { span, arg }))
    }

    fn parse_try_stmt(&mut self) -> PResult<'a, Stmt> {
        let start = cur_pos!();
        assert_and_bump!("try");

        let block = self.parse_block(false)?;

        let catch_start = cur_pos!();
        let handler = self.parse_catch_clause()?;
        let finalizer = self.parse_finally_block()?;

        if handler.is_none() && finalizer.is_none() {
            self.emit_err(span!(catch_start), SyntaxError::TS1005);
        }

        let span = span!(start);
        Ok(Stmt::Try(TryStmt {
            span,
            block,
            handler,
            finalizer,
        }))
    }

    fn parse_catch_clause(&mut self) -> PResult<'a, Option<CatchClause>> {
        let start = cur_pos!();

        Ok(if eat!("catch") {
            let param = self.parse_catch_param()?;

            self.parse_block(false)
                .map(|body| CatchClause {
                    span: span!(start),
                    param,
                    body,
                })
                .map(Some)?
        } else {
            None
        })
    }

    fn parse_finally_block(&mut self) -> PResult<'a, Option<BlockStmt>> {
        Ok(if eat!("finally") {
            self.parse_block(false).map(Some)?
        } else {
            None
        })
    }

    /// It's optional since es2019
    fn parse_catch_param(&mut self) -> PResult<'a, Option<Pat>> {
        if eat!('(') {
            let pat = self.parse_binding_pat_or_ident()?;

            if self.syntax().typescript() && eat!(':') {
                let ctx = Context {
                    in_type: true,
                    ..self.ctx()
                };

                let ty = self.with_ctx(ctx).parse_with(|p| p.parse_ts_type())?;
                self.emit_err(ty.span(), SyntaxError::TS1196);
            }
            expect!(')');
            Ok(Some(pat))
        } else {
            Ok(None)
        }
    }

    pub(super) fn parse_var_stmt(&mut self, for_loop: bool) -> PResult<'a, VarDecl> {
        let start = cur_pos!();
        let kind = match bump!() {
            tok!("const") => VarDeclKind::Const,
            tok!("let") => VarDeclKind::Let,
            tok!("var") => VarDeclKind::Var,
            _ => unreachable!(),
        };
        let var_span = span!(start);
        let should_include_in = kind != VarDeclKind::Var || !for_loop;

        if self.syntax().typescript() && for_loop {
            let res = if is_one_of!("in", "of") {
                self.ts_look_ahead(|p| {
                    //
                    if !eat!("of") && !eat!("in") {
                        return Ok(false);
                    }

                    p.parse_assignment_expr()?;
                    expect!(')');

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
                        span: span!(start),
                        kind,
                        declare: false,
                        decls: vec![],
                    });
                }
                Err(mut err) => {
                    err.cancel();
                }
                _ => {}
            }
        }

        let mut decls = vec![];
        let mut first = true;
        while first || eat!(',') {
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
            if is_exact!(';') || eof!() {
                let prev_span = self.input.prev_span();
                let span = if prev_span == var_span {
                    Span::new(prev_span.hi(), prev_span.hi(), Default::default())
                } else {
                    prev_span
                };
                self.emit_err(span, SyntaxError::TS1009);
                break;
            }

            decls.push(self.with_ctx(ctx).parse_var_declarator(for_loop)?);
        }

        if !for_loop {
            if !eat!(';') {
                self.emit_err(self.input.cur_span(), SyntaxError::TS1005);

                let _ = self.parse_expr().map_err(|mut e| {
                    e.emit();
                    ()
                });

                while !eat!(';') {
                    bump!();
                }
            }
        }

        Ok(VarDecl {
            span: span!(start),
            declare: self.ctx().in_declare,
            kind,
            decls,
        })
    }

    fn parse_var_declarator(&mut self, for_loop: bool) -> PResult<'a, VarDeclarator> {
        let start = cur_pos!();

        let mut name = self.parse_binding_pat_or_ident()?;

        let definite = if self.input.syntax().typescript() {
            match name {
                Pat::Ident(..) => eat!('!'),
                _ => false,
            }
        } else {
            false
        };

        // Typescript extension
        if self.input.syntax().typescript() && is!(':') {
            let type_annotation = self.try_parse_ts_type_ann()?;
            match name {
                Pat::Array(ArrayPat {
                    ref mut type_ann, ..
                })
                | Pat::Assign(AssignPat {
                    ref mut type_ann, ..
                })
                | Pat::Ident(Ident {
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
        let init = if !for_loop || !is_one_of!("in", "of") {
            if eat!('=') {
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
                        _ => syntax_error!(span!(start), SyntaxError::PatVarWithoutInit),
                    }
                }
            }
        } else {
            // e.g. for(let a;;)
            None
        };

        Ok(VarDeclarator {
            span: span!(start),
            name,
            init,
            definite,
        })
    }

    #[allow(clippy::cognitive_complexity)]
    fn parse_do_stmt(&mut self) -> PResult<'a, Stmt> {
        let start = cur_pos!();

        assert_and_bump!("do");

        let ctx = Context {
            is_break_allowed: true,
            is_continue_allowed: true,
            ..self.ctx()
        };
        let body = self.with_ctx(ctx).parse_stmt(false).map(Box::new)?;
        expect!("while");
        expect!('(');
        let test = self.include_in_expr(true).parse_expr()?;
        expect!(')');
        // We *may* eat semicolon.
        let _ = eat!(';');

        let span = span!(start);

        Ok(Stmt::DoWhile(DoWhileStmt { span, test, body }))
    }

    fn parse_while_stmt(&mut self) -> PResult<'a, Stmt> {
        let start = cur_pos!();

        assert_and_bump!("while");

        expect!('(');
        let test = self.include_in_expr(true).parse_expr()?;
        expect!(')');

        let ctx = Context {
            is_break_allowed: true,
            is_continue_allowed: true,
            ..self.ctx()
        };
        let body = self.with_ctx(ctx).parse_stmt(false).map(Box::new)?;

        let span = span!(start);
        Ok(Stmt::While(WhileStmt { span, test, body }))
    }

    fn parse_with_stmt(&mut self) -> PResult<'a, Stmt> {
        if self.syntax().typescript() {
            let span = self.input.cur_span();
            self.emit_err(span, SyntaxError::TS2410);
        }

        if self.ctx().strict {
            let span = self.input.cur_span();
            self.emit_err(span, SyntaxError::WithInStrict);
        }

        let start = cur_pos!();

        assert_and_bump!("with");

        expect!('(');
        let obj = self.include_in_expr(true).parse_expr()?;
        expect!(')');

        let ctx = Context {
            in_function: true,
            ..self.ctx()
        };
        let body = self.with_ctx(ctx).parse_stmt(false).map(Box::new)?;

        let span = span!(start);
        Ok(Stmt::With(WithStmt { span, obj, body }))
    }

    pub(super) fn parse_block(&mut self, allow_directives: bool) -> PResult<'a, BlockStmt> {
        let start = cur_pos!();

        expect!('{');

        let stmts = self.parse_block_body(allow_directives, false, Some(&tok!('}')))?;

        let span = span!(start);
        Ok(BlockStmt { span, stmts })
    }

    fn parse_labelled_stmt(&mut self, l: Ident) -> PResult<'a, Stmt> {
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

            let body = Box::new(if is!("function") {
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
                    }) => syntax_error!(span, SyntaxError::LabelledGenerator),
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
                span: span!(start),
                label: l,
                body,
            }))
        })
    }

    fn parse_for_stmt(&mut self) -> PResult<'a, Stmt> {
        let start = cur_pos!();

        assert_and_bump!("for");
        let await_start = cur_pos!();
        let await_token = if eat!("await") {
            Some(span!(await_start))
        } else {
            None
        };
        expect!('(');
        let head = self.parse_for_head()?;
        expect!(')');
        let ctx = Context {
            is_break_allowed: true,
            is_continue_allowed: true,
            ..self.ctx()
        };
        let body = self.with_ctx(ctx).parse_stmt(false).map(Box::new)?;

        let span = span!(start);
        Ok(match head {
            ForHead::For { init, test, update } => {
                if let Some(await_token) = await_token {
                    syntax_error!(await_token, SyntaxError::AwaitForStmt);
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
                    syntax_error!(await_token, SyntaxError::AwaitForStmt);
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

    fn parse_for_head(&mut self) -> PResult<'a, ForHead> {
        let start = cur_pos!();
        let strict = self.ctx().strict;

        if is_one_of!("const", "var") || (is!("let") && peek!()?.follows_keyword_let(strict)) {
            let decl = self.parse_var_stmt(true)?;

            if is_one_of!("of", "in") {
                let is_in = is!("in");

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

                    {
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

            expect_exact!(';');
            return self.parse_normal_for_head(Some(VarDeclOrExpr::VarDecl(decl)));
        }

        let init = if eat_exact!(';') {
            return self.parse_normal_for_head(None);
        } else {
            self.include_in_expr(false).parse_expr_or_pat()?
        };

        // for (a of b)
        if is_one_of!("of", "in") {
            let is_in = is!("in");

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

        expect_exact!(';');

        let init = self.verify_expr(init)?;
        self.parse_normal_for_head(Some(VarDeclOrExpr::Expr(init)))
    }

    fn parse_for_each_head(&mut self, left: VarDeclOrPat) -> PResult<'a, ForHead> {
        let of = bump!() == tok!("of");
        if of {
            let right = self.include_in_expr(true).parse_assignment_expr()?;
            Ok(ForHead::ForOf { left, right })
        } else {
            let right = self.include_in_expr(true).parse_expr()?;
            Ok(ForHead::ForIn { left, right })
        }
    }

    fn parse_normal_for_head(&mut self, init: Option<VarDeclOrExpr>) -> PResult<'a, ForHead> {
        let test = if eat_exact!(';') {
            None
        } else {
            let test = self.include_in_expr(true).parse_expr().map(Some)?;
            expect_exact!(';');
            test
        };

        let update = if is!(')') {
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
    ) -> PResult<'a, Type>;
}

#[parser]
impl<'a, I: Tokens> StmtLikeParser<'a, Stmt> for Parser<'a, I> {
    fn handle_import_export(&mut self, top_level: bool, _: Vec<Decorator>) -> PResult<'a, Stmt> {
        let start = cur_pos!();
        if self.input.syntax().dynamic_import() && is!("import") {
            let expr = self.parse_expr()?;

            eat!(';');

            return Ok(ExprStmt {
                span: span!(start),
                expr,
            }
            .into());
        }

        if self.input.syntax().import_meta() && is!("import") && peeked_is!('.') {
            let expr = self.parse_expr()?;

            eat!(';');

            return Ok(ExprStmt {
                span: span!(start),
                expr,
            }
            .into());
        }

        syntax_error!(SyntaxError::ImportExportInScript);
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::EsConfig;
    use swc_common::DUMMY_SP as span;

    fn stmt(s: &'static str) -> Stmt {
        test_parser(s, Syntax::default(), |p| {
            p.parse_stmt(true).map_err(|mut e| {
                e.emit();
            })
        })
    }

    fn module_item(s: &'static str) -> ModuleItem {
        test_parser(s, Syntax::default(), |p| {
            p.parse_stmt_like(true, true).map_err(|mut e| {
                e.emit();
            })
        })
    }
    fn expr(s: &'static str) -> Box<Expr> {
        test_parser(s, Syntax::default(), |p| {
            p.parse_expr().map_err(|mut e| {
                e.emit();
            })
        })
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
                        props: vec![ObjectPatProp::Rest(RestPat {
                            span,
                            dot3_token: span,
                            arg: box Pat::Ident(Ident::new("a34".into(), span)),
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
                        name: Pat::Ident(Ident::new("a".into(), span)),
                        definite: false,
                    }],
                    declare: false,
                }),
                right: box Expr::Ident(Ident::new("b".into(), span)),

                body: box Stmt::Empty(EmptyStmt { span })
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
                cons: box stmt("b;"),
                alt: Some(box stmt("c")),
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
                |p| p.parse_stmt_list_item(true).map_err(|mut e| {
                    e.emit();
                }),
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
            |p| {
                p.parse_module().map_err(|mut e| {
                    e.emit();
                })
            },
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
            |p| {
                p.parse_module().map_err(|mut e| {
                    e.emit();
                })
            },
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
            |p| {
                p.parse_module().map_err(|mut e| {
                    e.emit();
                })
            },
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
            |p| {
                p.parse_module().map_err(|mut e| {
                    e.emit();
                })
            },
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
            |p| {
                p.parse_module().map_err(|mut e| {
                    e.emit();
                })
            },
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
            |p| {
                p.parse_module().map_err(|mut e| {
                    e.emit();
                })
            },
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
            |p| {
                p.parse_module().map_err(|mut e| {
                    e.emit();
                })
            },
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
            |p| {
                p.parse_module().map_err(|mut e| {
                    e.emit();
                })
            },
        );
    }

    #[test]
    fn empty() {
        test_parser(
            "",
            Syntax::Es(EsConfig {
                ..Default::default()
            }),
            |p| {
                p.parse_module().map_err(|mut e| {
                    e.emit();
                })
            },
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
            |p| {
                p.parse_module().map_err(|mut e| {
                    e.emit();
                })
            },
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
            |p| {
                p.parse_module().map_err(|mut e| {
                    e.emit();
                })
            },
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
            |p| {
                p.parse_module().map_err(|mut e| {
                    e.emit();
                })
            },
        );
    }

    #[test]
    fn issue_269() {
        test_parser(
            ";(function() {})(window, window.lib || (window.lib = {}))",
            Default::default(),
            |p| {
                p.parse_module().map_err(|mut e| {
                    e.emit();
                })
            },
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
            p.parse_module().map_err(|mut e| {
                e.emit();
            })
        });
    }

    #[test]
    fn issue_340_async_fn() {
        test_parser(
            "export default async function(){};",
            Default::default(),
            |p| {
                p.parse_module().map_err(|mut e| {
                    e.emit();
                })
            },
        );
    }

    #[test]
    fn issue_340_generator_fn() {
        test_parser("export default function*(){};", Default::default(), |p| {
            p.parse_module().map_err(|mut e| {
                e.emit();
            })
        });
    }

    #[test]
    fn issue_340_class() {
        test_parser("export default class {};", Default::default(), |p| {
            p.parse_module().map_err(|mut e| {
                e.emit();
            })
        });
    }

    #[test]
    fn issue_360() {
        test_parser(
            "var IS_IE11 = !global.ActiveXObject && 'ActiveXObject' in global;",
            Default::default(),
            |p| {
                p.parse_module().map_err(|mut e| {
                    e.emit();
                })
            },
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
            |p| {
                p.parse_module().map_err(|mut e| {
                    e.emit();
                })
            },
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
            |p| {
                p.parse_module().map_err(|mut e| {
                    e.emit();
                })
            },
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
            |p| {
                p.parse_module().map_err(|mut e| {
                    e.emit();
                })
            },
        );
    }
}
