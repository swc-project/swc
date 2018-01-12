//! 13.3.3 Destructuring Binding Patterns
use super::*;
use std::iter;

#[parser]
impl<I: Input> Parser<I> {
    pub(super) fn parse_opt_binding_ident(&mut self) -> PResult<Option<Ident>> {
        if is!(BindingIdent) {
            self.parse_binding_ident().map(Some)
        } else {
            Ok(None)
        }
    }

    /// babel: `parseBindingIdentifier`
    ///
    /// spec: `BindingIdentifier`
    pub(super) fn parse_binding_ident(&mut self) -> PResult<Ident> {
        // "yield" and "await" is **lexically** accepted.
        let ident = self.parse_ident(true, true)?;
        if self.ctx.strict {
            if &*ident.sym == "arguments" || &*ident.sym == "eval" {
                syntax_error!(SyntaxError::EvalAndArgumentsInStrict)
            }
        }

        Ok(ident)
    }

    pub(super) fn parse_binding_pat_or_ident(&mut self) -> PResult<Pat> {
        match *cur!()? {
            tok!("yield") | Word(..) => self.parse_binding_ident().map(Pat::from),
            tok!('[') => self.parse_array_binding_pat(),
            tok!('{') => self.parse_object(),
            tok!('(') => {
                bump!();
                let pat = self.parse_binding_pat_or_ident()?;
                expect!(')');
                Ok(pat)
            }
            _ => unexpected!(),
        }
    }

    /// babel: `parseBindingAtom`
    pub(super) fn parse_binding_element(&mut self) -> PResult<Pat> {
        let start = cur_pos!();
        let left = self.parse_binding_pat_or_ident()?;

        if eat!('=') {
            let right = self.include_in_expr(true).parse_assignment_expr()?;
            return Ok(Pat {
                span: span!(start),
                node: PatKind::Assign {
                    left: box left,
                    right,
                },
            });
        }

        Ok(left)
    }

    fn parse_array_binding_pat(&mut self) -> PResult<Pat> {
        spanned!({
            assert_and_bump!('[');

            let mut elems = vec![];
            let mut comma = 0;

            while !eof!() && !is!(']') {
                if eat!(',') {
                    comma += 1;
                    continue;
                }

                elems.extend(iter::repeat(None).take(comma));
                comma = 0;
                let start = cur_pos!();

                if eat!("...") {
                    let pat = self.parse_binding_pat_or_ident()?;
                    let pat = Pat {
                        span: span!(start),
                        node: PatKind::Rest(box pat),
                    };
                    elems.push(Some(pat));
                    break;
                } else {
                    elems.push(self.parse_binding_element().map(Some)?);
                }
            }

            expect!(']');

            Ok(PatKind::Array(elems))
        })
    }

    /// spec: 'FormalParameter'
    pub(super) fn parse_formal_param(&mut self) -> PResult<Pat> {
        self.parse_binding_element()
    }

    ///
    /// spec: 'FormalParameterList'
    pub(super) fn parse_formal_params(&mut self) -> PResult<Vec<Pat>> {
        let mut first = true;
        let mut params = vec![];

        while !eof!() && !is!(')') {
            if first {
                first = false;
            } else {
                expect!(',');
                // Handle trailing comma.
                if is!(')') {
                    break;
                }
            }

            let start = cur_pos!();
            let rest = eat!("...");
            if rest {
                let pat = self.parse_binding_pat_or_ident()?;
                let pat = Pat {
                    span: span!(start),
                    node: PatKind::Rest(box pat),
                };
                params.push(pat);
                break;
            } else {
                params.push(self.parse_binding_element()?);
            }
        }

        Ok(params)
    }

    pub(super) fn parse_unique_formal_params(&mut self) -> PResult<Vec<Pat>> {
        // FIXME: This is wrong.
        self.parse_formal_params()
    }
}

#[parser]
impl<I: Input> Parser<I> {
    /// This does not return 'rest' pattern because non-last parameter cannot be
    /// rest.
    pub(super) fn reparse_expr_as_pat(&mut self, box expr: Box<Expr>) -> PResult<Pat> {
        let span = expr.span;

        match expr.node {
            ExprKind::Member { .. } | ExprKind::Call { .. } | ExprKind::New { .. } => {
                return Ok(Pat {
                    span,
                    node: PatKind::Expr(box expr),
                })
            }

            ExprKind::Paren(inner) => {
                // TODO: (maybe) add paren to PatKind.
                let inner_pat = self.reparse_expr_as_pat(inner)?;
                return Ok(Pat {
                    span,
                    node: inner_pat.node,
                });
            }
            ExprKind::Assign {
                left,
                op: Assign,
                right,
            } => {
                return Ok(Pat {
                    span,
                    node: PatKind::Assign {
                        left: match left {
                            PatOrExpr::Expr(left) => box self.reparse_expr_as_pat(left)?,
                            PatOrExpr::Pat(left) => box left,
                        },
                        right,
                    },
                })
            }
            ExprKind::Object { props } => {
                // {}
                return Ok(Pat {
                    span,
                    node: PatKind::Object {
                        props: props
                            .into_iter()
                            .map(|prop| {
                                match prop.node {
                                PropKind::Shorthand(id) => Ok(ObjectPatProp::Assign {
                                    key: id.into(),
                                    value: None,
                                }),
                                PropKind::KeyValue { key, value } => Ok(ObjectPatProp::KeyValue {
                                    key,
                                    value: box self.reparse_expr_as_pat(value)?,
                                }),
                                PropKind::Assign { key, value } => Ok(ObjectPatProp::Assign {
                                    key,
                                    value: Some(value),
                                }),

                                _ => {
                                    unimplemented!("error reporting: object pattern cannot contain method property: {:?}", prop)
                                }
                            }
                            })
                            .collect::<PResult<_>>()?,
                    },
                });
            }
            ExprKind::Ident(ident) => return Ok(ident.into()),
            ExprKind::Array { elems: mut exprs } => {
                if exprs.len() == 0 {
                    return Ok(Pat {
                        span,
                        node: PatKind::Array(vec![]),
                    });
                }

                let len = exprs.len();
                let mut params = Vec::with_capacity(exprs.len());

                for expr in exprs.drain(..len - 1) {
                    match expr {
                        Some(ExprOrSpread::Spread(expr)) => {
                            syntax_error!(SyntaxError::NonLastRestParam)
                        }
                        Some(ExprOrSpread::Expr(expr)) => {
                            params.push(self.reparse_expr_as_pat(expr).map(Some)?)
                        }
                        None => params.push(None),
                    }
                }

                assert_eq!(exprs.len(), 1);
                let expr = exprs.into_iter().next().unwrap();
                let last = match expr {
                    // Rest
                    Some(ExprOrSpread::Spread(expr)) => {
                        let span = expr.span; //TODO

                        self.reparse_expr_as_pat(expr)
                            .map(|pat| Pat {
                                span,
                                node: PatKind::Rest(box pat),
                            })
                            .map(Some)?
                    }
                    Some(ExprOrSpread::Expr(expr)) => self.reparse_expr_as_pat(expr).map(Some)?,
                    // TODO: sytax error if last element is ellison and ...rest exists.
                    None => None,
                };
                params.push(last);

                return Ok(Pat {
                    span,
                    node: PatKind::Array(params),
                });
            }
            _ => unimplemented!("reparse_expr_as_pat: {:?}", expr),
        }
    }

    pub(super) fn parse_exprs_as_params(
        &mut self,
        mut exprs: Vec<ExprOrSpread>,
    ) -> PResult<Vec<Pat>> {
        let len = exprs.len();
        if len == 0 {
            return Ok(vec![]);
        }

        let mut params = Vec::with_capacity(len);

        for expr in exprs.drain(..len - 1) {
            match expr {
                ExprOrSpread::Spread(expr) => syntax_error!(SyntaxError::NonLastRestParam),
                ExprOrSpread::Expr(expr) => params.push(self.reparse_expr_as_pat(expr)?),
            }
        }

        assert_eq!(exprs.len(), 1);
        let expr = exprs.into_iter().next().unwrap();
        let last = match expr {
            // Rest
            ExprOrSpread::Spread(expr) => {
                let span = expr.span; //TODO

                self.reparse_expr_as_pat(expr).map(|pat| Pat {
                    span,
                    node: PatKind::Rest(box pat),
                })?
            }
            ExprOrSpread::Expr(expr) => self.reparse_expr_as_pat(expr)?,
        };
        params.push(last);

        Ok(params)
    }
}
