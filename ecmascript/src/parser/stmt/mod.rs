use super::*;

impl<I: Input> Parser<I> {
    pub(super) fn parse_block_body(
        &mut self,
        top_level: bool,
        end: Option<&Token>,
    ) -> PResult<Vec<Stmt>> {
        let mut stmts = vec![];
        while {
            let b = self.i.cur() != end;
            b
        } {
            let stmt = self.parse_stmt(true, top_level)?;
            stmts.push(stmt);
        }

        Ok(stmts)
    }

    /// Parse statement or declaration.
    fn parse_stmt(&mut self, include_decl: bool, top_level: bool) -> PResult<Stmt> {
        match *self.i.cur()? {
            Word(Keyword(w)) => match w {
                Break | Continue => {
                    return self.spanned(|p| {
                        p.i.bump();
                        let is_break = w == Break;
                        let label = if p.eat_or_inject_semi() {
                            None
                        } else {
                            let i = p.parse_label_ident().map(Some)?;
                            p.expect_semi()?;
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
                    return self.spanned(|p| {
                        p.i.bump();
                        p.expect_semi()?;
                        Ok(StmtKind::Debugger)
                    })
                }

                Do => unimplemented!("parse_do_stmt"),

                For => unimplemented!("parse_for_stmt"),

                Function => {
                    // if (this.lookahead().type === tt.dot) break;
                    // if (!declaration) this.unexpected();
                    // return this.parseFunctionStatement(node);

                    unimplemented!("parse_function_decl")
                }
                Class if !include_decl => unimplemented!("Error: unexpected token class"),
                Class => {
                    return self.spanned(|p| {
                        p.parse_class_decl().map(Decl::Class).map(StmtKind::Decl)
                    })
                }

                If => return self.parse_if_stmt(),
                Return => return self.parse_return_stmt(),
                Switch => return self.parse_switch_stmt(),
                Throw => return self.parse_throw_stmt(),
                Try => return self.parse_try_stmt(),

                Let | Const if !include_decl => unexpected!(),
                Let | Const | Var => return self.parse_var_stmt(),

                While => return self.parse_while_stmt(),
                With => return self.parse_with_stmt(),

                Import | Export => unimplemented!("import,export"),
                _ => {}
            },
            LBrace => return self.parse_block(),

            Semi => {
                return self.spanned(|p| {
                    p.i.bump();
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
                if self.i.eat(&Colon) {
                    return self.parse_labelled_stmt(ident);
                }
                box Expr {
                    span,
                    node: ExprKind::Ident(ident),
                }
            }
            expr => expr,
        };

        self.expect_semi()?;
        Ok(Stmt {
            span: expr.span + self.i.last_span(),
            node: StmtKind::Expr(expr),
        })
    }

    fn parse_class_decl(&mut self) -> PResult<ClassDecl> {
        unimplemented!("parse_class_decl")
    }

    fn parse_if_stmt(&mut self) -> PResult<Stmt> {
        unimplemented!("parse_if_stmt")
    }

    fn parse_return_stmt(&mut self) -> PResult<Stmt> {
        assert_eq!(self.i.cur(), Some(&Word(Keyword(Return))));

        self.spanned(|p| {
            p.i.bump();

            let arg = if p.eat_or_inject_semi() {
                None
            } else {
                p.parse_expr(true).map(Some)?
            };
            Ok(StmtKind::Return { arg })
        })
    }

    fn parse_switch_stmt(&mut self) -> PResult<Stmt> {
        unimplemented!("parse_switch_stmt")
    }
    fn parse_throw_stmt(&mut self) -> PResult<Stmt> {
        assert_eq!(self.i.cur(), Some(&Word(Keyword(Throw))));

        self.spanned(|p| {
            p.i.bump();
            if p.i.had_line_break_before_cur() {
                syntax_error!(LineBreakInThrow)
            }

            let arg = p.parse_expr(true)?;
            p.expect_semi()?;

            Ok(StmtKind::Throw { arg })
        })
    }

    fn parse_try_stmt(&mut self) -> PResult<Stmt> {
        unimplemented!("try")
    }
    fn parse_var_stmt(&mut self) -> PResult<Stmt> {
        unimplemented!("var stmt")
    }
    fn parse_while_stmt(&mut self) -> PResult<Stmt> {
        unimplemented!("while")
    }
    fn parse_with_stmt(&mut self) -> PResult<Stmt> {
        unimplemented!("with")
    }
    fn parse_block(&mut self) -> PResult<Stmt> {
        unimplemented!("block stmt")
    }
    fn parse_labelled_stmt(&mut self, ident: Ident) -> PResult<Stmt> {
        unimplemented!("labelled stmt")
    }
}
