use super::*;

impl<I: Input> Parser<I> {
    pub(super) fn parse_block_body(
        &mut self,
        top_level: bool,
        end: Option<&Token>,
    ) -> PResult<Vec<Stmt>> {
        let mut stmts = vec![];
        while {
            let b = cur!(self) != end;
            b
        } {
            let stmt = self.parse_stmt(true, top_level)?;
            stmts.push(stmt);
        }
        if end.is_some() {
            bump!(self);
        }

        Ok(stmts)
    }

    /// Parse statement or declaration.
    fn parse_stmt(&mut self, include_decl: bool, top_level: bool) -> PResult<Stmt> {
        match *cur!(self)? {
            Word(Keyword(w)) => match w {
                Break | Continue => {
                    return spanned!(self, {
                        bump!(self);
                        let is_break = w == Break;
                        let label = if eat!(self, ';') {
                            None
                        } else {
                            let i = self.parse_label_ident().map(Some)?;
                            expect!(self, ';');
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
                    return spanned!(self, {
                        bump!(self);
                        expect!(self, ';');
                        Ok(StmtKind::Debugger)
                    })
                }

                Do => return self.parse_do_stmt(),

                For => unimplemented!("parse_for_stmt"),

                Function => {
                    // if (this.lookahead().type === tt.dot) break;
                    // if (!declaration) this.unexpected();
                    // return this.parseFunctionStatement(node);

                    unimplemented!("parse_function_decl")
                }
                Class if !include_decl => unexpected!(self),
                Class => {
                    return spanned!(self, {
                        self.parse_class_decl().map(Decl::Class).map(StmtKind::Decl)
                    })
                }

                If => return self.parse_if_stmt(),
                Return => return self.parse_return_stmt(),
                Switch => return self.parse_switch_stmt(),
                Throw => return self.parse_throw_stmt(),
                Try => return self.parse_try_stmt(),

                Let | Const if !include_decl => unexpected!(self),
                Let | Const | Var => return self.parse_var_stmt(),

                While => return self.parse_while_stmt(),
                With => return self.parse_with_stmt(),

                Import | Export => unimplemented!("import,export"),
                _ => {}
            },
            LBrace => return spanned!(self, { self.parse_block().map(StmtKind::Block) }),

            Semi => {
                return spanned!(self, {
                    bump!(self);
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
        let expr = match self.parse_expr(true)? {
            box Expr {
                span,
                node: ExprKind::Ident(ident),
            } => {
                if eat!(self, ':') {
                    return self.parse_labelled_stmt(ident);
                }
                box Expr {
                    span,
                    node: ExprKind::Ident(ident),
                }
            }
            expr => expr,
        };

        expect!(self, ';');
        Ok(Stmt {
            span: expr.span + prev_span!(self),
            node: StmtKind::Expr(expr),
        })
    }

    fn parse_class_decl(&mut self) -> PResult<ClassDecl> {
        unimplemented!("parse_class_decl")
    }

    fn parse_if_stmt(&mut self) -> PResult<Stmt> {
        spanned!(self, {
            assert_and_bump!(self, "if");

            expect!(self, '(');
            let test = self.parse_expr(true)?;
            expect!(self, ')');

            let consequent = box self.parse_stmt(false, false)?;

            let alt = if eat!(self, "else") {
                Some(box self.parse_stmt(false, false)?)
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
        spanned!(self, {
            assert_and_bump!(self, "return");

            let arg = if eat!(self, ';') {
                None
            } else {
                let arg = self.parse_expr(true).map(Some)?;
                expect!(self, ';');
                arg
            };
            Ok(StmtKind::Return { arg })
        })
    }

    fn parse_switch_stmt(&mut self) -> PResult<Stmt> {
        spanned!(self, {
            assert_and_bump!(self, "switch");

            expect!(self, '(');
            let discriminant = self.parse_expr(true)?;
            expect!(self, ')');

            let mut cur = None;
            let mut cases = vec![];
            let mut has_default = false;

            expect!(self, '{');
            while !is!(self, '}') {
                if is_one_of!(self, "case", "default") {
                    let is_case = is!(self, "case");
                    bump!(self);
                    match cur.take() {
                        Some(case) => cases.push(case),
                        None => {
                            let test = if is_case {
                                self.parse_expr(true).map(Some)?
                            } else {
                                if has_default {
                                    syntax_error!(self, SyntaxError::MultipleDefault)
                                }
                                has_default = true;
                                None
                            };
                            expect!(self, ':');
                            cur = Some(SwitchCase {
                                test,
                                consequent: vec![],
                            });
                        }
                    }
                } else {
                    match cur {
                        Some(ref mut cur) => {
                            cur.consequent.push(self.parse_stmt(false, false)?);
                        }
                        None => unexpected!(self),
                    }
                }
            }
            assert_and_bump!(self, '}');
            cases.extend(cur);

            Ok(StmtKind::Switch {
                discriminant,
                cases,
            })
        })
    }

    fn parse_throw_stmt(&mut self) -> PResult<Stmt> {
        spanned!(self, {
            assert_and_bump!(self, "throw");

            if self.input.had_line_break_before_cur() {
                syntax_error!(self, SyntaxError::LineBreakInThrow)
            }

            let arg = self.parse_expr(true)?;
            expect!(self, ';');

            Ok(StmtKind::Throw { arg })
        })
    }

    fn parse_try_stmt(&mut self) -> PResult<Stmt> {
        spanned!(self, {
            assert_and_bump!(self, "try");

            let block = self.parse_block()?;

            let handler = if eat!(self, "catch") {
                let param = self.parse_binding_pat()?;
                self.parse_block()
                    .map(|body| CatchClause { param, body })
                    .map(Some)?
            } else {
                None
            };

            let finalizer = if eat!(self, "finally") {
                self.parse_block().map(Some)?
            } else {
                if handler.is_none() {
                    unexpected!(self);
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

    fn parse_var_stmt(&mut self) -> PResult<Stmt> {
        unimplemented!("var stmt")
    }

    fn parse_do_stmt(&mut self) -> PResult<Stmt> {
        spanned!(self, {
            assert_and_bump!(self, "do");

            let body = box self.parse_stmt(false, false)?;
            expect!(self, "while");
            let test = self.parse_expr(true)?;
            expect!(self, ';');

            Ok(StmtKind::DoWhile { test, body })
        })
    }

    fn parse_while_stmt(&mut self) -> PResult<Stmt> {
        spanned!(self, {
            assert_and_bump!(self, "while");

            expect!(self, '(');
            let test = self.parse_expr(true)?;
            expect!(self, ')');

            let body = box self.parse_stmt(false, false)?;

            Ok(StmtKind::While { test, body })
        })
    }

    fn parse_with_stmt(&mut self) -> PResult<Stmt> {
        spanned!(self, {
            assert_and_bump!(self, "with");

            expect!(self, '(');
            let obj = self.parse_expr(true)?;
            expect!(self, ')');

            let body = box self.parse_stmt(false, false)?;
            Ok(StmtKind::With { obj, body })
        })
    }

    pub(super) fn parse_block(&mut self) -> PResult<BlockStmt> {
        expect!(self, '{');

        let stmts = self.parse_block_body(false, Some(&RBrace))?;

        Ok(BlockStmt { stmts })
    }

    fn parse_labelled_stmt(&mut self, ident: Ident) -> PResult<Stmt> {
        unimplemented!("labelled stmt")
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
        mk(s)
            .parse_stmt(true, true)
            .expect("failed to parse a statement")
    }
    fn expr(s: &'static str) -> Box<Expr> {
        mk(s)
            .parse_expr(true)
            .expect("failed to parse an expression")
    }
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
                span: Span::DUMMY,
                node: StmtKind::Block(BlockStmt {
                    stmts: vec![stmt("return 1")],
                }),
            }
        );
    }
}
