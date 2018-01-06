//! 13.3.3 Destructuring Binding Patterns

use super::*;

#[parser]
impl<I: Input> Parser<I> {
    ///
    /// babel: `parseRest`
    pub(super) fn parse_binding_rest_element(&mut self) -> PResult<Pat> {
        spanned!({
            expect!("...");
            self.parse_binding_element()
                .map(Box::new)
                .map(PatKind::Rest)
        })
    }

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

    /// babel: `parseBindingAtom`
    pub(super) fn parse_binding_element(&mut self) -> PResult<Pat> {
        let pat = match *cur!()? {
            tok!("yield") | Word(..) => self.parse_binding_ident().map(Pat::from),
            tok!('[') => self.parse_array_binding_pat(),
            tok!('{') => self.parse_object(),
            _ => unexpected!(),
        };

        if is!('=') {
            unimplemented!("optional initializer pattern")
        }
        pat
    }

    fn parse_array_binding_pat(&mut self) -> PResult<Pat> {
        unimplemented!("parse_array_binding_pat")
    }

    /// spec: 'FormalParameter'
    pub(super) fn parse_formal_param(&mut self) -> PResult<Pat> {
        self.parse_binding_element()
    }

    ///
    /// spec: 'FormalParameterList'
    pub(super) fn parse_formal_params(&mut self) -> PResult<Vec<Pat>> {
        // FIXME: This is wrong. (copied from parse_args())
        let expr_or_spreads = {
            let mut first = true;
            let mut expr_or_spreads = vec![];

            while !is!(')') {
                if first {
                    first = false;
                } else {
                    expect!(',');
                    // Handle trailing comma.
                    if is!(')') {
                        break;
                    }
                }

                expr_or_spreads.push(self.include_in_expr(true).parse_expr_or_spread()?);
            }

            expr_or_spreads
        };
        self.parse_exprs_as_params(expr_or_spreads)
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
    fn parse_non_last_expr_as_param(&mut self, expr: Box<Expr>) -> PResult<Pat> {
        let span = expr.span;

        match expr.node {
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
                            params.push(self.parse_non_last_expr_as_param(expr).map(Some)?)
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

                        self.parse_non_last_expr_as_param(expr)
                            .map(|pat| Pat {
                                span,
                                node: PatKind::Rest(box pat),
                            })
                            .map(Some)?
                    }
                    Some(ExprOrSpread::Expr(expr)) => {
                        self.parse_non_last_expr_as_param(expr).map(Some)?
                    }
                    // TODO: sytax error if last element is ellison and ...rest exists.
                    None => None,
                };
                params.push(last);

                return Ok(Pat {
                    span,
                    node: PatKind::Array(params),
                });
            }
            _ => unimplemented!("parse_non_last_expr_as_param: {:?}", expr),
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
                ExprOrSpread::Expr(expr) => params.push(self.parse_non_last_expr_as_param(expr)?),
            }
        }

        assert_eq!(exprs.len(), 1);
        let expr = exprs.into_iter().next().unwrap();
        let last = match expr {
            // Rest
            ExprOrSpread::Spread(expr) => {
                let span = expr.span; //TODO

                self.parse_non_last_expr_as_param(expr).map(|pat| Pat {
                    span,
                    node: PatKind::Rest(box pat),
                })?
            }
            ExprOrSpread::Expr(expr) => self.parse_non_last_expr_as_param(expr)?,
        };
        params.push(last);

        Ok(params)
    }
}
