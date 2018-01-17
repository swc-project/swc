use super::*;
use swc_macros::ast_node;

mod module_item;

#[parser]
impl<I: Input> Parser<I> {
    pub(super) fn parse_block_body<Type>(
        &mut self,
        top_level: bool,
        end: Option<&Token>,
    ) -> PResult<Vec<Type>>
    where
        Self: StmtLikeParser<Type>,
        Type: From<Stmt>,
    {
        let mut stmts = vec![];
        while {
            let b = cur!() != end;
            b
        } {
            let stmt = self.parse_stmt_like(true, top_level)?;
            stmts.push(stmt);
        }
        if end.is_some() {
            bump!();
        }

        Ok(stmts)
    }

    fn parse_stmt(&mut self, top_level: bool) -> PResult<Stmt> {
        self.parse_stmt_internal(false, top_level)
    }

    fn parse_stmt_list_item(&mut self, top_level: bool) -> PResult<Stmt> {
        self.parse_stmt_internal(true, top_level)
    }

    /// Parse a statement, declaration or module item.
    fn parse_stmt_like<Type>(&mut self, include_decl: bool, top_level: bool) -> PResult<Type>
    where
        Self: StmtLikeParser<Type>,
        Type: From<Stmt>,
    {
        if <Self as StmtLikeParser<Type>>::accept_import_export() {
            if is_one_of!("import", "export") {
                return self.handle_import_export(top_level);
            }
        }
        self.parse_stmt_internal(include_decl, top_level)
            .map(From::from)
    }

    fn parse_stmt_internal(&mut self, include_decl: bool, top_level: bool) -> PResult<Stmt> {
        let start = cur_pos!();

        match *cur!()? {
            Word(Keyword(w)) => match w {
                Break | Continue => {
                    return spanned!({
                        bump!();
                        let is_break = w == Break;
                        let label = if eat!(';') {
                            None
                        } else {
                            let i = self.parse_label_ident().map(Some)?;
                            expect!(';');
                            i
                        };

                        Ok(if is_break {
                            StmtKind::Break(BreakStmt { label })
                        } else {
                            StmtKind::Continue(ContinueStmt { label })
                        })
                    })
                }

                Debugger => {
                    return spanned!({
                        bump!();
                        expect!(';');
                        Ok(StmtKind::Debugger)
                    })
                }

                Do => return self.parse_do_stmt(),

                For => return self.parse_for_stmt(),

                Function => {
                    if !include_decl {
                        unexpected!()
                    }

                    return self.parse_fn_decl().map(Stmt::from);
                }
                Class if !include_decl => unexpected!(),
                Class => return self.parse_class_decl().map(Stmt::from),

                If => return self.parse_if_stmt(),
                Return => return self.parse_return_stmt(),
                Switch => return self.parse_switch_stmt(),
                Throw => return self.parse_throw_stmt(),
                Try => return self.parse_try_stmt(),

                // `let;` is identifier reference.
                Let if include_decl => match peek!() {
                    Some(t) if t.follows_keyword_let(self.ctx.strict) => {
                        let v = self.parse_var_stmt(false)?;
                        return Ok(Stmt {
                            span: v.span,
                            node: StmtKind::Decl(Decl::Var(v)),
                        });
                    }
                    _ => {}
                },

                Const | Var => {
                    if w == Var || include_decl {
                        let v = self.parse_var_stmt(false)?;
                        return Ok(Stmt {
                            span: v.span,
                            node: StmtKind::Decl(Decl::Var(v)),
                        });
                    }
                    // Handle `let;` by forwarding it to expression statement
                }

                While => return self.parse_while_stmt(),
                With => return self.parse_with_stmt(),

                _ => {}
            },
            LBrace => return spanned!({ self.parse_block().map(StmtKind::Block) }),

            Semi => {
                return spanned!({
                    bump!();
                    Ok(StmtKind::Empty)
                })
            }

            _ => {}
        }

        // Handle async function foo() {}
        if is!("async") && peeked_is!("function")
            && !self.input.has_linebreak_between_cur_and_peeked()
        {
            return self.parse_async_fn_decl().map(From::from);
        }

        // If the statement does not start with a statement keyword or a
        // brace, it's an ExpressionStatement or LabeledStatement. We
        // simply start parsing an expression, and afterwards, if the
        // next token is a colon and the expression was a simple
        // Identifier node, we switch to interpreting it as a label.
        let expr = self.include_in_expr(true).parse_expr()?;
        let expr = match expr {
            box Expr {
                span,
                node: ExprKind::Ident(ident),
            } => {
                if eat!(':') {
                    return self.parse_labelled_stmt(ident);
                }
                box Expr {
                    span,
                    node: ExprKind::Ident(ident),
                }
            }
            expr => expr,
        };

        expect!(';');
        Ok(Stmt {
            span: span!(start),
            node: StmtKind::Expr(expr),
        }.into())
    }

    fn parse_if_stmt(&mut self) -> PResult<Stmt> {
        spanned!({
            assert_and_bump!("if");

            expect!('(');
            let test = self.include_in_expr(true).parse_expr()?;
            expect!(')');

            let cons = {
                // Annex B
                if !self.ctx.strict && is!("function") {
                    // TODO: report error?
                }
                box self.parse_stmt(false)?
            };

            let alt = if eat!("else") {
                Some(box self.parse_stmt(false)?)
            } else {
                None
            };

            Ok(StmtKind::If(IfStmt { test, cons, alt }))
        })
    }

    fn parse_return_stmt(&mut self) -> PResult<Stmt> {
        spanned!({
            assert_and_bump!("return");

            let arg = if is!(';') {
                None
            } else {
                self.include_in_expr(true).parse_expr().map(Some)?
            };
            expect!(';');
            Ok(StmtKind::Return(ReturnStmt { arg }))
        })
    }

    fn parse_switch_stmt(&mut self) -> PResult<Stmt> {
        spanned!({
            assert_and_bump!("switch");

            expect!('(');
            let discriminant = self.include_in_expr(true).parse_expr()?;
            expect!(')');

            let mut cur = None;
            let mut cases = vec![];
            let mut has_default = false;

            expect!('{');
            while !eof!() && !is!('}') {
                if is_one_of!("case", "default") {
                    let is_case = is!("case");
                    bump!();
                    cases.extend(cur.take());
                    let test = if is_case {
                        self.include_in_expr(true).parse_expr().map(Some)?
                    } else {
                        if has_default {
                            syntax_error!(SyntaxError::MultipleDefault)
                        }
                        has_default = true;
                        None
                    };
                    expect!(':');

                    cur = Some(SwitchCase { test, cons: vec![] });
                } else {
                    match cur {
                        Some(ref mut cur) => {
                            cur.cons.push(self.parse_stmt_list_item(false)?);
                        }
                        None => unexpected!(),
                    }
                }
            }
            assert_and_bump!('}');
            cases.extend(cur);

            Ok(StmtKind::Switch(SwitchStmt {
                discriminant,
                cases,
            }))
        })
    }

    fn parse_throw_stmt(&mut self) -> PResult<Stmt> {
        spanned!({
            assert_and_bump!("throw");

            if self.input.had_line_break_before_cur() {
                syntax_error!(SyntaxError::LineBreakInThrow)
            }

            let arg = self.include_in_expr(true).parse_expr()?;
            expect!(';');

            Ok(StmtKind::Throw(ThrowStmt { arg }))
        })
    }

    fn parse_try_stmt(&mut self) -> PResult<Stmt> {
        spanned!({
            assert_and_bump!("try");

            let block = self.parse_block()?;

            let handler = if eat!("catch") {
                let param = self.parse_catch_param()?;
                self.parse_block()
                    .map(|body| CatchClause { param, body })
                    .map(Some)?
            } else {
                None
            };

            let finalizer = if eat!("finally") {
                self.parse_block().map(Some)?
            } else {
                if handler.is_none() {
                    unexpected!();
                }
                None
            };

            Ok(StmtKind::Try(TryStmt {
                block,
                handler,
                finalizer,
            }))
        })
    }

    fn parse_catch_param(&mut self) -> PResult<Pat> {
        expect!('(');
        let pat = self.parse_binding_pat_or_ident()?;
        expect!(')');
        Ok(pat)
    }

    fn parse_var_stmt(&mut self, for_loop: bool) -> PResult<VarDecl> {
        let start = cur_pos!();
        let kind = match bump!() {
            tok!("const") => VarDeclKind::Const,
            tok!("let") => VarDeclKind::Let,
            tok!("var") => VarDeclKind::Var,
            _ => unreachable!(),
        };
        let mut decls = vec![];
        let mut first = true;
        while first || eat!(',') {
            if first {
                first = false;
            }
            decls.push(self.parse_var_declarator(for_loop)?);
        }
        if !for_loop {
            expect!(';');
        }

        Ok(VarDecl {
            span: span!(start),
            kind,
            decls,
        })
    }

    fn parse_var_declarator(&mut self, for_loop: bool) -> PResult<VarDeclarator> {
        let start = cur_pos!();
        let name = self.parse_binding_pat_or_ident()?;

        //FIXME: This is wrong. Should check in/of only on first loop.
        let init = if !for_loop || !is_one_of!("in", "of") {
            if eat!('=') {
                Some(self.parse_assignment_expr()?)
            } else {
                // Destructuring bindings require initializers.
                match name.node {
                    PatKind::Ident(..) => None,
                    _ => syntax_error!(SyntaxError::PatVarWithoutInit { span: span!(start) }),
                }
            }
        } else {
            // e.g. for(let a;;)
            None
        };

        return Ok(VarDeclarator {
            span: span!(start),
            name,
            init,
        });
    }

    fn parse_do_stmt(&mut self) -> PResult<Stmt> {
        spanned!({
            assert_and_bump!("do");

            let body = box self.parse_stmt(false)?;
            expect!("while");
            let test = self.include_in_expr(true).parse_expr()?;

            // We *may* eat semicolon.
            let _ = eat!(';');

            Ok(StmtKind::DoWhile(DoWhileStmt { test, body }))
        })
    }

    fn parse_while_stmt(&mut self) -> PResult<Stmt> {
        spanned!({
            assert_and_bump!("while");

            expect!('(');
            let test = self.include_in_expr(true).parse_expr()?;
            expect!(')');

            let body = box self.parse_stmt(false)?;

            Ok(StmtKind::While(WhileStmt { test, body }))
        })
    }

    fn parse_with_stmt(&mut self) -> PResult<Stmt> {
        spanned!({
            assert_and_bump!("with");

            expect!('(');
            let obj = self.include_in_expr(true).parse_expr()?;
            expect!(')');

            let body = box self.parse_stmt(false)?;
            Ok(StmtKind::With(WithStmt { obj, body }))
        })
    }

    pub(super) fn parse_block(&mut self) -> PResult<BlockStmt> {
        spanned!({
            expect!('{');

            let stmts = self.parse_block_body(false, Some(&RBrace))?;

            Ok(stmts)
        })
    }

    fn parse_labelled_stmt(&mut self, label: Ident) -> PResult<Stmt> {
        let start = label.span.start;

        for l in &self.state.labels {
            if label.sym == *l {
                syntax_error!(SyntaxError::DuplicateLabel(label.sym.clone()))
            }
        }
        let body = box if is!("function") {
            self.parse_fn_decl().map(Stmt::from)?
        } else {
            self.parse_stmt(false)?
        };

        Ok(Stmt {
            span: span!(start),
            node: StmtKind::Labeled(LabeledStmt { label, body }),
        })
    }

    fn parse_for_stmt(&mut self) -> PResult<Stmt> {
        spanned!({
            assert_and_bump!("for");
            expect!('(');
            let head = self.parse_for_head()?;
            expect!(')');
            let body = box self.parse_stmt(false)?;

            Ok(match head {
                ForHead::For { init, test, update } => StmtKind::For(ForStmt {
                    init,
                    test,
                    update,
                    body,
                }),
                ForHead::ForIn { left, right } => StmtKind::ForIn(ForInStmt { left, right, body }),
                ForHead::ForOf { left, right } => StmtKind::ForOf(ForOfStmt { left, right, body }),
            })
        })
    }

    fn parse_for_head(&mut self) -> PResult<ForHead> {
        let start = cur_pos!();

        if is_one_of!("const", "var")
            || (is!("let") && peek!()?.follows_keyword_let(self.ctx.strict))
        {
            let decl = self.parse_var_stmt(true)?;

            if is_one_of!("of", "in") {
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
            let pat = self.reparse_expr_as_pat(init)?;
            return self.parse_for_each_head(VarDeclOrPat::Pat(pat));
        }

        expect_exact!(';');

        self.parse_normal_for_head(Some(VarDeclOrExpr::Expr(init)))
    }

    fn parse_for_each_head(&mut self, left: VarDeclOrPat) -> PResult<ForHead> {
        let of = bump!() == tok!("of");
        if of {
            let right = self.include_in_expr(true).parse_assignment_expr()?;
            Ok(ForHead::ForOf { left, right })
        } else {
            let right = self.include_in_expr(true).parse_expr()?;
            Ok(ForHead::ForOf { left, right })
        }
    }

    fn parse_normal_for_head(&mut self, init: Option<VarDeclOrExpr>) -> PResult<ForHead> {
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

#[ast_node]
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

pub(super) trait StmtLikeParser<Type> {
    fn accept_import_export() -> bool;
    fn handle_import_export(&mut self, top_level: bool) -> PResult<Type>;
}

impl<I: Input> StmtLikeParser<Stmt> for Parser<I> {
    fn accept_import_export() -> bool {
        false
    }
    fn handle_import_export(&mut self, top_level: bool) -> PResult<Stmt> {
        unreachable!()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use lexer::Lexer;

    fn mk<'a>(s: &'static str) -> Parser<impl 'a + Input> {
        let logger = ::testing::logger().new(o!("src" => s));
        Parser::new_for_module(logger.clone(), Lexer::new_from_str(logger, s))
    }

    fn stmt(s: &'static str) -> Stmt {
        mk(s).parse_stmt(true).expect("failed to parse a statement")
    }
    fn expr(s: &'static str) -> Box<Expr> {
        mk(s).parse_expr().expect("failed to parse an expression")
    }

    #[allow(non_upper_case_globals)]
    const span: Span = Span::DUMMY;

    #[test]
    fn expr_stmt() {
        assert_eq_ignore_span!(
            stmt("a + b + c"),
            Stmt {
                span: Default::default(),
                node: StmtKind::Expr(expr("a + b + c")),
            }
        )
    }
    #[test]
    fn throw_this() {
        assert_eq_ignore_span!(
            stmt("throw this"),
            Stmt {
                span: Default::default(),
                node: StmtKind::Throw(ThrowStmt { arg: expr("this") }),
            }
        )
    }

    #[test]
    fn no_empty_without_semi() {
        assert_eq_ignore_span!(
            stmt("{ return 1 }"),
            stmt(
                "{
                return 1
            }"
            )
        );

        assert_eq_ignore_span!(
            stmt("{ return 1; }"),
            Stmt {
                span,
                node: StmtKind::Block(BlockStmt {
                    span,
                    stmts: vec![stmt("return 1")],
                }),
            }
        );
    }

    #[test]
    fn if_else() {
        assert_eq_ignore_span!(
            stmt("if (a) b; else c"),
            Stmt {
                span,
                node: StmtKind::If(IfStmt {
                    test: expr("a"),
                    cons: box stmt("b;"),
                    alt: Some(box stmt("c")),
                }),
            }
        );
    }
}
