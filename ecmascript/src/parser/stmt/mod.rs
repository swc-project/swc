use super::*;
use swc_common::Spanned;

mod module_item;

impl<I: Input> Parser<I> {
    pub(super) fn parse_block_body<Type>(
        &mut self,
        top_level: bool,
        end: Option<&Token>,
    ) -> PResult<Vec<Type>>
    where
        Self: StmtLikeParser<Type>,
        Type: Spanned<StmtKind> + From<Stmt>,
    {
        let mut stmts = vec![];
        while {
            let b = cur!(self) != end;
            b
        } {
            let stmt = self.parse_stmt_like(true, top_level)?;
            stmts.push(stmt);
        }
        if end.is_some() {
            bump!(self);
        }

        Ok(stmts)
    }

    fn parse_stmt(&mut self, top_level: bool) -> PResult<Stmt> {
        self.parse_stmt_like(false, top_level)
    }

    fn parse_stmt_list_item(&mut self, top_level: bool) -> PResult<Stmt> {
        self.parse_stmt_like(true, top_level)
    }

    /// Parse a statement, declaration or module item.
    fn parse_stmt_like<Type>(&mut self, include_decl: bool, top_level: bool) -> PResult<Type>
    where
        Self: StmtLikeParser<Type>,
        Type: Spanned<StmtKind> + From<Stmt>,
    {
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

                Do => return self.parse_do_stmt().map(From::from),

                For => unimplemented!("parse_for_stmt"),

                Function => {
                    if !include_decl {
                        unexpected!(self)
                    }

                    return self.parse_fn_decl().map(From::from);
                }
                Class if !include_decl => unexpected!(self),
                Class => {
                    return spanned!(self, {
                        self.parse_class_decl().map(Decl::Class).map(StmtKind::Decl)
                    })
                }

                If => return self.parse_if_stmt().map(From::from),
                Return => return self.parse_return_stmt().map(From::from),
                Switch => return self.parse_switch_stmt().map(From::from),
                Throw => return self.parse_throw_stmt().map(From::from),
                Try => return self.parse_try_stmt().map(From::from),

                Let | Const | Var => match peek!(self) {
                    Some(&Word(..)) | Some(&tok!('{')) | Some(&tok!('[')) => {
                        if w == Var || include_decl {
                            return self.parse_var_stmt().map(From::from);
                        } else {
                            unexpected!(self)
                        }
                    }
                    _ => {}
                },

                While => return self.parse_while_stmt().map(From::from),
                With => return self.parse_with_stmt().map(From::from),

                Import | Export => return self.handle_import_export(top_level),
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
        let expr = self.include_in_expr(true).parse_expr()?;
        let expr = match expr {
            box Expr {
                span,
                node: ExprKind::Ident(ident),
            } => {
                if eat!(self, ':') {
                    return self.parse_labelled_stmt(ident).map(From::from);
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
        }.into())
    }

    fn parse_class_decl(&mut self) -> PResult<ClassDecl> {
        unimplemented!("parse_class_decl")
    }

    fn parse_if_stmt(&mut self) -> PResult<Stmt> {
        spanned!(self, {
            assert_and_bump!(self, "if");

            expect!(self, '(');
            let test = self.include_in_expr(true).parse_expr()?;
            expect!(self, ')');

            let consequent = box self.parse_stmt(false)?;

            let alt = if eat!(self, "else") {
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
        spanned!(self, {
            assert_and_bump!(self, "return");

            let arg = if eat!(self, ';') {
                None
            } else {
                let arg = self.include_in_expr(true).parse_expr().map(Some)?;
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
            let discriminant = self.include_in_expr(true).parse_expr()?;
            expect!(self, ')');

            let mut cur = None;
            let mut cases = vec![];
            let mut has_default = false;

            expect!(self, '{');
            while !is!(self, '}') {
                if is_one_of!(self, "case", "default") {
                    let is_case = is!(self, "case");
                    bump!(self);
                    cases.extend(cur.take());
                    let test = if is_case {
                        self.include_in_expr(true).parse_expr().map(Some)?
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
                } else {
                    match cur {
                        Some(ref mut cur) => {
                            cur.consequent.push(self.parse_stmt(false)?);
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

            let arg = self.include_in_expr(true).parse_expr()?;
            expect!(self, ';');

            Ok(StmtKind::Throw { arg })
        })
    }

    fn parse_try_stmt(&mut self) -> PResult<Stmt> {
        spanned!(self, {
            assert_and_bump!(self, "try");

            let block = self.parse_block()?;

            let handler = if eat!(self, "catch") {
                let param = self.parse_catch_param()?;
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

    fn parse_catch_param(&mut self) -> PResult<Pat> {
        expect!(self, '(');
        let pat = self.parse_binding_element()?;
        expect!(self, ')');
        Ok(pat)
    }

    fn parse_var_stmt(&mut self) -> PResult<Stmt> {
        unimplemented!("var_stmt")
    }

    fn parse_do_stmt(&mut self) -> PResult<Stmt> {
        spanned!(self, {
            assert_and_bump!(self, "do");

            let body = box self.parse_stmt(false)?;
            expect!(self, "while");
            let test = self.include_in_expr(true).parse_expr()?;

            // We *may* eat semicolon.
            let _ = eat!(self, ';');

            Ok(StmtKind::DoWhile { test, body })
        })
    }

    fn parse_while_stmt(&mut self) -> PResult<Stmt> {
        spanned!(self, {
            assert_and_bump!(self, "while");

            expect!(self, '(');
            let test = self.include_in_expr(true).parse_expr()?;
            expect!(self, ')');

            let body = box self.parse_stmt(false)?;

            Ok(StmtKind::While { test, body })
        })
    }

    fn parse_with_stmt(&mut self) -> PResult<Stmt> {
        spanned!(self, {
            assert_and_bump!(self, "with");

            expect!(self, '(');
            let obj = self.include_in_expr(true).parse_expr()?;
            expect!(self, ')');

            let body = box self.parse_stmt(false)?;
            Ok(StmtKind::With { obj, body })
        })
    }

    pub(super) fn parse_block(&mut self) -> PResult<BlockStmt> {
        spanned!(self, {
            expect!(self, '{');

            let stmts = self.parse_block_body(false, Some(&RBrace))?;

            Ok(stmts)
        })
    }

    fn parse_labelled_stmt(&mut self, label: Ident) -> PResult<Stmt> {
        for l in &self.state.labels {
            if label.sym == *l {
                syntax_error!(self, SyntaxError::DuplicateLabel(label.sym.clone()))
            }
        }
        unimplemented!("labelled stmt")
    }

    pub(super) fn parse_fn_decl(&mut self) -> PResult<Stmt> {
        unimplemented!("parse_fn_decl")
    }
}

pub(super) trait StmtLikeParser<Type> {
    fn handle_import_export(&mut self, top_level: bool) -> PResult<Type>;
}

impl<I: Input> StmtLikeParser<Stmt> for Parser<I> {
    fn handle_import_export(&mut self, top_level: bool) -> PResult<Stmt> {
        unexpected!(self)
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
}
