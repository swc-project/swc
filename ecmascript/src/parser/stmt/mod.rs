use super::*;

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
            return self.handle_import_export(top_level);
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
                            StmtKind::Break { label }
                        } else {
                            StmtKind::Continue { label }
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

                For => unimplemented!("parse_for_stmt"),

                Function => {
                    if !include_decl {
                        unexpected!()
                    }

                    return self.parse_fn_decl();
                }
                Class if !include_decl => unexpected!(),
                Class => return self.parse_class_decl(),

                If => return self.parse_if_stmt(),
                Return => return self.parse_return_stmt(),
                Switch => return self.parse_switch_stmt(),
                Throw => return self.parse_throw_stmt(),
                Try => return self.parse_try_stmt(),

                Let | Const | Var => match peek!() {
                    Some(&Word(..)) | Some(&tok!('{')) | Some(&tok!('[')) => {
                        if w == Var || include_decl {
                            return self.parse_var_stmt();
                        }
                        // Handle `let;` by forwarding it to expression statement
                    }
                    _ => {}
                },

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
            Word(Ident(js_word!("async"))) => unimplemented!("(maybe) async function"),

            _ => {}
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

            let consequent = box self.parse_stmt(false)?;

            let alt = if eat!("else") {
                Some(box self.parse_stmt(false)?)
            } else {
                None
            };

            Ok(StmtKind::If {
                test,
                consequent,
                alt,
            })
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
            Ok(StmtKind::Return { arg })
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
            while !is!('}') {
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

                    cur = Some(SwitchCase {
                        test,
                        consequent: vec![],
                    });
                } else {
                    match cur {
                        Some(ref mut cur) => {
                            cur.consequent.push(self.parse_stmt(false)?);
                        }
                        None => unexpected!(),
                    }
                }
            }
            assert_and_bump!('}');
            cases.extend(cur);

            Ok(StmtKind::Switch {
                discriminant,
                cases,
            })
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

            Ok(StmtKind::Throw { arg })
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

            Ok(StmtKind::Try {
                block,
                handler,
                finalizer,
            })
        })
    }

    fn parse_catch_param(&mut self) -> PResult<Pat> {
        expect!('(');
        let pat = self.parse_binding_element()?;
        expect!(')');
        Ok(pat)
    }

    fn parse_var_stmt(&mut self) -> PResult<Stmt> {
        unimplemented!("var_stmt")
    }

    fn parse_do_stmt(&mut self) -> PResult<Stmt> {
        spanned!({
            assert_and_bump!("do");

            let body = box self.parse_stmt(false)?;
            expect!("while");
            let test = self.include_in_expr(true).parse_expr()?;

            // We *may* eat semicolon.
            let _ = eat!(';');

            Ok(StmtKind::DoWhile { test, body })
        })
    }

    fn parse_while_stmt(&mut self) -> PResult<Stmt> {
        spanned!({
            assert_and_bump!("while");

            expect!('(');
            let test = self.include_in_expr(true).parse_expr()?;
            expect!(')');

            let body = box self.parse_stmt(false)?;

            Ok(StmtKind::While { test, body })
        })
    }

    fn parse_with_stmt(&mut self) -> PResult<Stmt> {
        spanned!({
            assert_and_bump!("with");

            expect!('(');
            let obj = self.include_in_expr(true).parse_expr()?;
            expect!(')');

            let body = box self.parse_stmt(false)?;
            Ok(StmtKind::With { obj, body })
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
            self.parse_fn_decl()?
        } else {
            self.parse_stmt(false)?
        };

        Ok(Stmt {
            span: span!(start),
            node: StmtKind::Labeled { label, body },
        })
    }
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
                node: StmtKind::Throw { arg: expr("this") },
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
                node: StmtKind::If {
                    test: expr("a"),
                    consequent: box stmt("b;"),
                    alt: Some(box stmt("c")),
                },
            }
        );
    }
}
