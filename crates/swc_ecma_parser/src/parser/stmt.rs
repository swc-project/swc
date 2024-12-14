use swc_common::Spanned;
use typed_arena::Arena;

use super::{pat::PatType, *};
use crate::error::SyntaxError;

mod module_item;

impl<'a, I: Tokens> Parser<I> {
    pub fn parse_module_item(&mut self) -> PResult<ModuleItem> {
        self.parse_stmt_like(true, true)
    }

    pub(super) fn parse_block_body<Type>(
        &mut self,
        mut allow_directives: bool,
        top_level: bool,
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

            stmts.alloc(stmt);
        }

        if self.input.cur().is_some() && end.is_some() {
            bump!(self);
        }

        self.set_ctx(old_ctx);

        Ok(stmts.into_vec())
    }

    /// Parse a statement but not a declaration.
    pub fn parse_stmt(&mut self, top_level: bool) -> PResult<Stmt> {
        trace_cur!(self, parse_stmt);
        self.parse_stmt_like(false, top_level)
    }

    /// Parse a statement and maybe a declaration.
    pub fn parse_stmt_list_item(&mut self, top_level: bool) -> PResult<Stmt> {
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
        decorators: Vec<Decorator>,
    ) -> PResult<Stmt> {
        trace_cur!(self, parse_stmt_internal);

        let is_typescript = self.input.syntax().typescript();

        if is_typescript && is!(self, "const") && peeked_is!(self, "enum") {
            assert_and_bump!(self, "const");
            assert_and_bump!(self, "enum");
            return self
                .parse_ts_enum_decl(start, true)
                .map(Decl::from)
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
                        return Ok(v.into());
                    }

                    let expr = self.parse_await_expr(eaten_await)?;
                    let expr = self
                        .include_in_expr(true)
                        .parse_bin_op_recursively(expr, 0)?;
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
                    .parse_class_decl(start, start, decorators, false)
                    .map(Stmt::from);
            }

            tok!("if") => {
                return self.parse_if_stmt().map(Stmt::If);
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
                return self.parse_with_stmt();
            }

            tok!("while") => {
                return self.parse_while_stmt();
            }

            tok!("var") => {
                let v = self.parse_var_stmt(false)?;
                return Ok(v.into());
            }

            tok!("const") if include_decl => {
                let v = self.parse_var_stmt(false)?;
                return Ok(v.into());
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
                    return Ok(v.into());
                }
            }

            tok!("using") if include_decl => {
                let v = self.parse_using_decl(start, false)?;
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
                    return Ok(self.parse_ts_interface_decl(start)?.into());
                }
            }

            tok!("type") => {
                if is_typescript
                    && peeked_is!(self, IdentName)
                    && !self.input.has_linebreak_between_cur_and_peeked()
                {
                    let start = self.input.cur_pos();
                    bump!(self);
                    return Ok(self.parse_ts_type_alias_decl(start)?.into());
                }
            }

            tok!("enum") => {
                if is_typescript
                    && peeked_is!(self, IdentName)
                    && !self.input.has_linebreak_between_cur_and_peeked()
                {
                    let start = self.input.cur_pos();
                    bump!(self);
                    return Ok(self.parse_ts_enum_decl(start, false)?.into());
                }
            }

            tok!('{') => {
                let ctx = Context {
                    allow_using_decl: true,
                    ..self.ctx()
                };
                return self.with_ctx(ctx).parse_block(false).map(Stmt::Block);
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
                            return self
                                .parse_ts_interface_decl(start)
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
                let expr = self.parse_bin_op_recursively(expr, 0)?;
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

    /// Utility function used to parse large if else statements iteratively.
    ///
    /// THis function is recursive, but it is very cheap so stack overflow will
    /// not occur.
    fn adjust_if_else_clause(&mut self, cur: &mut IfStmt, alt: Box<Stmt>) {
        cur.span = span!(self, cur.span.lo);

        if let Some(Stmt::If(prev_alt)) = cur.alt.as_deref_mut() {
            self.adjust_if_else_clause(prev_alt, alt)
        } else {
            debug_assert_eq!(cur.alt, None);
            cur.alt = Some(alt);
        }
    }

    fn parse_if_stmt(&mut self) -> PResult<IfStmt> {
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
                        inner: Box::new(err),
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
                self.with_ctx(ctx).parse_stmt(false).map(Box::new)
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
                        self.adjust_if_else_clause(cur, Box::new(alt.into()));
                    }
                    _ => {
                        cur = Some(alt);
                    }
                }
            };

            match cur {
                Some(mut cur) => {
                    if let Some(last) = last {
                        self.adjust_if_else_clause(&mut cur, Box::new(last));
                    }
                    Some(cur.into())
                }
                _ => last,
            }
        }
        .map(Box::new);

        let span = span!(self, start);
        Ok(IfStmt {
            span,
            test,
            cons,
            alt,
        })
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
            Ok(ReturnStmt {
                span: span!(p, start),
                arg,
            }
            .into())
        });

        if !self.ctx().in_function && !self.input.syntax().allow_return_outside_function() {
            self.emit_err(span!(self, start), SyntaxError::ReturnNotAllowed);
        }

        stmt
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
        let ctx = Context {
            is_break_allowed: true,
            ..self.ctx()
        };

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

        Ok(SwitchStmt {
            span: span!(self, switch_start),
            discriminant,
            cases,
        }
        .into())
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
        Ok(ThrowStmt { span, arg }.into())
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

    pub(super) fn parse_using_decl(
        &mut self,
        start: BytePos,
        is_await: bool,
    ) -> PResult<Option<Box<UsingDecl>>> {
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

        let mut decls = Vec::new();
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

        eat!(self, ';');

        Ok(Some(Box::new(UsingDecl {
            span: span!(self, start),
            is_await,
            decls,
        })))
    }

    pub(super) fn parse_var_stmt(&mut self, for_loop: bool) -> PResult<Box<VarDecl>> {
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

                    return Ok(Box::new(VarDecl {
                        span: span!(self, start),
                        kind,
                        declare: false,
                        decls: Vec::new(),
                        ..Default::default()
                    }));
                }
                Err(..) => {}
                _ => {}
            }
        }

        let mut decls = Vec::new();
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

        Ok(Box::new(VarDecl {
            span: span!(self, start),
            declare: false,
            kind,
            decls,
            ..Default::default()
        }))
    }

    fn parse_var_declarator(
        &mut self,
        for_loop: bool,
        kind: VarDeclKind,
    ) -> PResult<VarDeclarator> {
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
            match name {
                Pat::Array(ArrayPat {
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

        Ok(DoWhileStmt { span, test, body }.into())
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
        Ok(WhileStmt { span, test, body }.into())
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
        Ok(WithStmt { span, obj, body }.into())
    }

    pub(super) fn parse_block(&mut self, allow_directives: bool) -> PResult<BlockStmt> {
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

    fn parse_labelled_stmt(&mut self, l: Ident) -> PResult<Stmt> {
        let ctx = Context {
            is_break_allowed: true,
            allow_using_decl: false,
            ..self.ctx()
        };
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
                    if p.ctx().strict {
                        p.emit_err(function.span, SyntaxError::LabelledFunctionInStrict)
                    }
                    if function.is_generator || function.is_async {
                        p.emit_err(function.span, SyntaxError::LabelledGeneratorOrAsync)
                    }
                }

                f.into()
            } else {
                p.parse_stmt(false)?
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
        let body = self.with_ctx(ctx).parse_stmt(false).map(Box::new)?;

        let span = span!(self, start);
        Ok(match head {
            TempForHead::For { init, test, update } => {
                if let Some(await_token) = await_token {
                    syntax_error!(self, await_token, SyntaxError::AwaitForStmt);
                }

                ForStmt {
                    span,
                    init,
                    test,
                    update,
                    body,
                }
                .into()
            }
            TempForHead::ForIn { left, right } => {
                if let Some(await_token) = await_token {
                    syntax_error!(self, await_token, SyntaxError::AwaitForStmt);
                }

                ForInStmt {
                    span,
                    left,
                    right,
                    body,
                }
                .into()
            }
            TempForHead::ForOf { left, right } => ForOfStmt {
                span,
                is_await: await_token.is_some(),
                left,
                right,
                body,
            }
            .into(),
        })
    }

    fn parse_for_head(&mut self) -> PResult<TempForHead> {
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
                name: name.into(),
                span: span!(self, start),
                init: None,
                definite: false,
            };

            let pat = Box::new(UsingDecl {
                span: span!(self, start),
                is_await: is_await_using_decl,
                decls: vec![decl],
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

            return self.parse_for_each_head(ForHead::Pat(Box::new(pat)));
        }

        expect_exact!(self, ';');

        let init = self.verify_expr(init)?;
        self.parse_normal_for_head(Some(VarDeclOrExpr::Expr(init)))
    }

    fn parse_for_each_head(&mut self, left: ForHead) -> PResult<TempForHead> {
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

    fn parse_normal_for_head(&mut self, init: Option<VarDeclOrExpr>) -> PResult<TempForHead> {
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
enum TempForHead {
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

pub(super) trait IsDirective {
    fn as_ref(&self) -> Option<&Stmt>;
    fn is_use_strict(&self) -> bool {
        self.as_ref().map_or(false, Stmt::is_use_strict)
    }
}

impl<T> IsDirective for Box<T>
where
    T: IsDirective,
{
    fn as_ref(&self) -> Option<&Stmt> {
        T::as_ref(&**self)
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

impl<'a, I: Tokens, T> StmtLikeParser<'a, Box<T>> for Parser<I>
where
    T: IsDirective,
    Self: StmtLikeParser<'a, T>,
{
    fn handle_import_export(
        &mut self,
        top_level: bool,
        decorators: Vec<Decorator>,
    ) -> PResult<Box<T>> {
        <Self as StmtLikeParser<T>>::handle_import_export(self, top_level, decorators).map(Box::new)
    }
}

impl<I: Tokens> StmtLikeParser<'_, Stmt> for Parser<I> {
    fn handle_import_export(&mut self, _: bool, _: Vec<Decorator>) -> PResult<Stmt> {
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

#[cfg(test)]
mod tests {
    use swc_common::{comments::SingleThreadedComments, DUMMY_SP as span};
    use swc_ecma_visit::assert_eq_ignore_span;

    use super::*;
    use crate::EsSyntax;

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
            Stmt::Try(Box::new(TryStmt {
                span,
                block: BlockStmt {
                    span,
                    ..Default::default()
                },
                handler: Some(CatchClause {
                    span,
                    param: Pat::Object(ObjectPat {
                        span,
                        optional: false,
                        props: vec![ObjectPatProp::Rest(RestPat {
                            span,
                            dot3_token: span,
                            arg: Box::new(Pat::Ident(
                                Ident::new_no_ctxt("a34".into(), span).into()
                            )),
                            type_ann: None
                        })],
                        type_ann: None,
                    })
                    .into(),
                    body: BlockStmt {
                        span,
                        ..Default::default()
                    }
                }),
                finalizer: None
            }))
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
                is_await: true,
                left: ForHead::VarDecl(Box::new(VarDecl {
                    span,
                    kind: VarDeclKind::Const,
                    decls: vec![VarDeclarator {
                        span,
                        init: None,
                        name: Pat::Ident(Ident::new_no_ctxt("a".into(), span).into()),
                        definite: false,
                    }],
                    ..Default::default()
                })),
                right: Box::new(Expr::Ident(Ident::new_no_ctxt("b".into(), span))),

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
                ..Default::default()
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
                Syntax::Es(EsSyntax {
                    decorators: true,
                    ..Default::default()
                }),
                |p| p.parse_stmt_list_item(true),
            ),
            Stmt::Decl(Decl::Class(ClassDecl {
                ident: Ident::new_no_ctxt("Foo".into(), span),
                class: Box::new(Class {
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
                    body: Vec::new(),
                    is_abstract: false,
                    ..Default::default()
                }),
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
        test_parser(
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
        test_parser(
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
        test_parser(
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
        test_parser(
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
        test_parser(
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
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_module());
    }

    #[test]
    fn shebang_02() {
        let src = "#!/usr/bin/env node
let x = 4";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_module());
    }

    #[test]
    fn empty() {
        test_parser("", Syntax::Es(Default::default()), |p| p.parse_module());
    }

    #[test]
    fn issue_226() {
        test_parser(
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
        test_parser(
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
        test_parser(
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
        test_parser(
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
        test_parser(
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
        test_parser(
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
            Syntax::Es(Default::default()),
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
            Syntax::Es(Default::default()),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn issue_411() {
        test_parser(
            "try {
} catch {}",
            Syntax::Es(Default::default()),
            |p| p.parse_module(),
        );
    }

    #[test]
    fn top_level_await() {
        test_parser("await foo", Syntax::Es(Default::default()), |p| {
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
        let _ = test_parser_comment(&c, s, Syntax::Typescript(Default::default()), |p| {
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

        let _ = test_parser_comment(&c, s, Syntax::Typescript(Default::default()), |p| {
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

        let _ = test_parser_comment(&c, s, Syntax::Typescript(Default::default()), |p| {
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

        let _ = test_parser_comment(&c, s, Syntax::Typescript(Default::default()), |p| {
            p.parse_typescript_module()
        });

        let (leading, trailing) = c.take_all();
        assert!(trailing.borrow().is_empty());
        assert_eq!(leading.borrow().len(), 1);
    }
    fn parse_for_head(str: &'static str) -> TempForHead {
        test_parser(str, Syntax::default(), |p| p.parse_for_head())
    }

    #[test]
    fn for_array_binding_pattern() {
        match parse_for_head("let [, , t] = simple_array; t < 10; t++") {
            TempForHead::For { init: Some(v), .. } => assert_eq_ignore_span!(
                v,
                VarDeclOrExpr::VarDecl(Box::new(VarDecl {
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
                                Some(Pat::Ident(Ident::new_no_ctxt("t".into(), span).into()))
                            ]
                        }),
                        init: Some(Box::new(Expr::Ident(Ident::new_no_ctxt(
                            "simple_array".into(),
                            span
                        )))),
                        definite: false
                    }],
                    ..Default::default()
                }))
            ),
            _ => unreachable!(),
        }
    }
    #[test]
    fn for_object_binding_pattern() {
        match parse_for_head("let {num} = obj; num < 11; num++") {
            TempForHead::For { init: Some(v), .. } => assert_eq_ignore_span!(
                v,
                VarDeclOrExpr::VarDecl(Box::new(VarDecl {
                    span,
                    kind: VarDeclKind::Let,
                    decls: vec![VarDeclarator {
                        span,
                        name: Pat::Object(ObjectPat {
                            optional: false,
                            type_ann: None,
                            span,
                            props: vec![ObjectPatProp::Assign(AssignPatProp {
                                span,
                                key: Ident::new_no_ctxt("num".into(), span).into(),
                                value: None
                            })]
                        }),
                        init: Some(Box::new(Expr::Ident(Ident::new_no_ctxt(
                            "obj".into(),
                            span
                        )))),
                        definite: false
                    }],
                    ..Default::default()
                }))
            ),
            _ => unreachable!(),
        }
    }

    #[test]
    #[should_panic(expected = "'import.meta' cannot be used outside of module code.")]
    fn import_meta_in_script() {
        let src = "const foo = import.meta.url;";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_script());
    }

    #[test]
    fn import_meta_in_program() {
        let src = "const foo = import.meta.url;";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_program());
    }

    #[test]
    #[should_panic(expected = "'import', and 'export' cannot be used outside of module code")]
    fn import_statement_in_script() {
        let src = "import 'foo';";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_script());
    }

    #[test]
    #[should_panic(expected = "top level await is only allowed in module")]
    fn top_level_await_in_script() {
        let src = "await promise";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_script());
    }

    #[test]
    fn top_level_await_in_program() {
        let src = "await promise";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_program());
    }

    #[test]
    fn for_of_head_lhs_async_dot() {
        let src = "for (async.x of [1]) ;";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_module());
    }

    #[test]
    fn for_head_init_async_of() {
        let src = "for (async of => {}; i < 10; ++i) { ++counter; }";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_module());
    }

    #[test]
    #[should_panic(expected = "await isn't allowed in non-async function")]
    fn await_in_function_in_module() {
        let src = "function foo (p) { await p; }";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_module());
    }

    #[test]
    #[should_panic(expected = "await isn't allowed in non-async function")]
    fn await_in_function_in_script() {
        let src = "function foo (p) { await p; }";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_script());
    }

    #[test]
    #[should_panic(expected = "await isn't allowed in non-async function")]
    fn await_in_function_in_program() {
        let src = "function foo (p) { await p; }";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_program());
    }

    #[test]
    #[should_panic(expected = "`await` cannot be used as an identifier in an async context")]
    fn await_in_nested_async_function_in_module() {
        let src = "async function foo () { function bar(x = await) {} }";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_module());
    }

    #[test]
    fn await_in_nested_async_function_in_script() {
        let src = "async function foo () { function bar(x = await) {} }";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_script());
    }

    #[test]
    fn await_in_nested_async_function_in_program() {
        let src = "async function foo () { function bar(x = await) {} }";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_program());
    }

    #[test]
    #[should_panic(expected = "`await` cannot be used as an identifier in an async context")]
    fn await_as_param_ident_in_module() {
        let src = "function foo (x = await) { }";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_module());
    }

    #[test]
    fn await_as_param_ident_in_script() {
        let src = "function foo (x = await) { }";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_script());
    }

    #[test]
    #[should_panic(expected = "`await` cannot be used as an identifier in an async context")]
    fn await_as_ident_in_module() {
        let src = "let await = 1";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_module());
    }

    #[test]
    fn await_as_ident_in_script() {
        let src = "let await = 1";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_script());
    }

    #[test]
    #[should_panic(expected = "`await` cannot be used as an identifier in an async context")]
    fn await_as_ident_in_async() {
        let src = "async function foo() { let await = 1; }";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_script());
    }

    #[test]
    fn top_level_await_in_block() {
        let src = "if (true) { await promise; }";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_module());
    }

    #[test]
    fn class_static_blocks() {
        let src = "class Foo { static { 1 + 1; } }";
        assert_eq_ignore_span!(
            test_parser(src, Syntax::Es(Default::default()), |p| p.parse_expr()),
            Box::new(Expr::Class(ClassExpr {
                ident: Some(Ident {
                    span,
                    sym: "Foo".into(),
                    ..Default::default()
                }),
                class: Box::new(Class {
                    span,
                    decorators: Vec::new(),
                    super_class: None,
                    type_params: None,
                    super_type_params: None,
                    is_abstract: false,
                    implements: Vec::new(),
                    body: vec!(ClassMember::StaticBlock(StaticBlock {
                        span,
                        body: BlockStmt {
                            span,
                            stmts: vec!(stmt("1 + 1;")),
                            ..Default::default()
                        }
                    })),
                    ..Default::default()
                })
            }))
        );
    }

    #[test]
    fn multiple_class_static_blocks() {
        let src = "class Foo { static { 1 + 1; } static { 1 + 1; } }";
        assert_eq_ignore_span!(
            test_parser(src, Syntax::Es(Default::default()), |p| p.parse_expr()),
            Box::new(Expr::Class(ClassExpr {
                ident: Some(Ident {
                    span,
                    sym: "Foo".into(),
                    ..Default::default()
                }),
                class: Box::new(Class {
                    span,
                    decorators: Vec::new(),
                    super_class: None,
                    is_abstract: false,
                    body: vec!(
                        ClassMember::StaticBlock(StaticBlock {
                            span,
                            body: BlockStmt {
                                span,
                                stmts: vec!(stmt("1 + 1;")),
                                ..Default::default()
                            },
                        }),
                        ClassMember::StaticBlock(StaticBlock {
                            span,
                            body: BlockStmt {
                                span,
                                stmts: vec!(stmt("1 + 1;")),
                                ..Default::default()
                            },
                        })
                    ),
                    ..Default::default()
                })
            }))
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
        assert_eq_ignore_span!(
            test_parser(src, Syntax::Es(Default::default()), |p| p.parse_expr()),
            Box::new(Expr::Class(ClassExpr {
                ident: Some(Ident {
                    span,
                    sym: "Foo".into(),
                    ..Default::default()
                }),
                class: Box::new(Class {
                    span,
                    is_abstract: false,
                    body: vec!(ClassMember::StaticBlock(StaticBlock {
                        span,
                        body: BlockStmt {
                            span,
                            stmts: vec!(stmt("1 + 1;")),
                            ..Default::default()
                        }
                    })),
                    ..Default::default()
                })
            }))
        );
    }

    #[test]
    fn class_static_blocks_with_line_breaks_02() {
        let src = "class Foo {
            static
            {}
        }";
        assert_eq_ignore_span!(
            test_parser(src, Syntax::Es(Default::default()), |p| p.parse_expr()),
            Box::new(Expr::Class(ClassExpr {
                ident: Some(Ident {
                    span,
                    sym: "Foo".into(),
                    ..Default::default()
                }),
                class: Box::new(Class {
                    span,
                    is_abstract: false,
                    body: vec!(ClassMember::StaticBlock(StaticBlock {
                        span,
                        body: BlockStmt {
                            span,
                            stmts: Vec::new(),
                            ..Default::default()
                        }
                    })),
                    ..Default::default()
                })
            }))
        );
    }

    #[test]
    fn class_static_blocks_in_ts() {
        let src = "class Foo { static { 1 + 1 }; }";
        test_parser(src, Syntax::Typescript(Default::default()), |p| {
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
        test_parser(src, Syntax::Typescript(Default::default()), |p| {
            p.parse_expr()
        });
    }

    #[test]
    fn class_static_blocks_with_line_breaks_in_ts_02() {
        let src = "class Foo {
            static
            {}
        }";
        test_parser(src, Syntax::Typescript(Default::default()), |p| {
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
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_expr());
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
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_expr());
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
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_expr());
    }

    #[test]
    #[should_panic(expected = "Modifiers cannot appear here")]
    fn class_static_blocks_in_ts_with_invalid_modifier_01() {
        let src = "class Foo { abstract static { 1 + 1 }; }";
        test_parser(src, Syntax::Typescript(Default::default()), |p| {
            p.parse_expr()
        });
    }

    #[test]
    #[should_panic(expected = "Modifiers cannot appear here")]
    fn class_static_blocks_in_ts_with_invalid_modifier_02() {
        let src = "class Foo { static static { 1 + 1 }; }";
        test_parser(src, Syntax::Typescript(Default::default()), |p| {
            p.parse_expr()
        });
    }

    #[test]
    #[should_panic(expected = "Modifiers cannot appear here")]
    fn class_static_blocks_in_ts_with_invalid_modifier_03() {
        let src = "class Foo { declare static { 1 + 1 }; }";
        test_parser(src, Syntax::Typescript(Default::default()), |p| {
            p.parse_expr()
        });
    }

    #[test]
    #[should_panic(expected = "Modifiers cannot appear here")]
    fn class_static_blocks_in_ts_with_invalid_modifier_04() {
        let src = "class Foo { private static { 1 + 1 }; }";
        test_parser(src, Syntax::Typescript(Default::default()), |p| {
            p.parse_expr()
        });
    }

    #[test]
    #[should_panic(expected = "Trailing comma is disallowed inside import(...) arguments")]
    fn error_for_trailing_comma_inside_dynamic_import() {
        let src = "import('foo',)";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_expr());
    }

    #[test]
    fn no_error_for_trailing_comma_inside_dynamic_import_with_import_assertions() {
        let src = "import('foo',)";
        test_parser(
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
        test_parser(src, Syntax::Typescript(Default::default()), |p| {
            p.parse_module()
        });
    }

    #[test]
    fn type_only_star_exports_without_name() {
        let src = "export type * from 'mod'";
        test_parser(src, Syntax::Typescript(Default::default()), |p| {
            p.parse_module()
        });
    }

    #[test]
    #[should_panic(expected = "A string literal cannot be used as an imported binding.")]
    fn error_for_string_literal_is_import_binding() {
        let src = "import { \"str\" } from \"mod\"";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_module());
    }

    #[test]
    #[should_panic(
        expected = "A string literal cannot be used as an exported binding without `from`."
    )]
    fn error_for_string_literal_is_export_binding() {
        let src = "export { 'foo' };";
        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_module());
    }

    #[test]
    #[should_panic(expected = "'const' declarations must be initialized")]
    fn ts_error_for_const_declaration_not_initialized() {
        let src = r#"
"use strict";
const foo;"#;

        test_parser(src, Syntax::Typescript(Default::default()), |p| {
            p.parse_script()
        });
    }

    #[test]
    #[should_panic(expected = "'const' declarations must be initialized")]
    fn es_error_for_const_declaration_not_initialized() {
        let src = r#"
"use strict";
const foo;"#;

        test_parser(src, Syntax::Es(Default::default()), |p| p.parse_script());
    }

    #[test]
    fn issue_5557_expr_follow_class() {
        let src = "foo * class {} / bar;";

        test_parser(src, Default::default(), |p| p.parse_script());
    }

    #[test]
    fn issue_5722_class_keyword_in_tpl() {
        let src = "console.log(`${toStr({class: fn})}`)";

        test_parser(src, Default::default(), |p| p.parse_script());
    }

    #[test]
    fn issue_6301_await_expr_stmt() {
        let src = "try { await; } catch { console.log('caught'); }";

        test_parser(src, Default::default(), |p| p.parse_script());
    }

    #[test]
    fn issue_6301_await_expr_stmt_1() {
        let src = "try { await, await; } catch { console.log('caught'); }";

        test_parser(src, Default::default(), |p| p.parse_script());
    }

    #[test]
    fn issue_6301_await_expr_stmt_2() {
        let src = "function test() { await; }";

        test_parser(src, Default::default(), |p| p.parse_script());
    }

    #[test]
    fn issue_6301_await_expr_stmt_3() {
        let src = "function test() { await, await; }";

        test_parser(src, Default::default(), |p| p.parse_script());
    }

    #[test]
    fn issue_6301_await_expr_stmt_4() {
        let src = "function test() { [await]; }";

        test_parser(src, Default::default(), |p| p.parse_script());
    }

    #[test]
    fn issue_6301_await_expr_stmt_5() {
        let src = "function test() { (await); }";

        test_parser(src, Default::default(), |p| p.parse_script());
    }

    #[test]
    fn issue_6322() {
        let src = "for ( ; { } / 1 ; ) ;";

        test_parser(src, Default::default(), |p| p.parse_script());
    }

    #[test]
    fn issue_6323() {
        let src = "let x = 0 < { } / 0 ;";

        test_parser(src, Default::default(), |p| p.parse_script());
    }
}
