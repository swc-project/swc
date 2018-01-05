//! 13.3.3 Destructuring Binding Patterns

use super::*;

impl<I: Input> Parser<I> {
    ///
    /// babel: `parseRest`
    pub(super) fn parse_binding_rest_element(&mut self) -> PResult<Pat> {
        spanned!(self, {
            expect!(self, "...");
            self.parse_binding_element()
                .map(Box::new)
                .map(PatKind::Rest)
        })
    }

    pub(super) fn parse_opt_binding_ident(&mut self) -> PResult<Option<Ident>> {
        match *cur!(self)? {
            Word(..) => self.parse_binding_ident().map(Some),
            _ => Ok(None),
        }
    }

    /// babel: `parseBindingIdentifier`
    ///
    /// spec: `BindingIdentifier`
    pub(super) fn parse_binding_ident(&mut self) -> PResult<Ident> {
        // "yield" and "await" is **lexically** accepted.
        self.parse_ident(true, true).and_then(|ident| {
            if self.ctx.strict {
                if &*ident.sym == "arguments" || &*ident.sym == "eval" {
                    syntax_error!(self, SyntaxError::EvalAndArgumentsInStrict)
                }
            }

            Ok(ident)
        })
    }

    /// babel: `parseBindingAtom`
    pub(super) fn parse_binding_element(&mut self) -> PResult<Pat> {
        let pat = match *cur!(self)? {
            tok!("yield") | Word(..) => self.parse_binding_ident().map(Pat::from),
            tok!('[') => self.parse_array_binding_pat(),
            tok!('{') => self.parse_object(),
            _ => unexpected!(self),
        };

        if is!(self, '=') {
            unimplemented!("optional initializer pattern")
        }
        pat
    }

    fn parse_array_binding_pat(&mut self) -> PResult<Pat> {
        unimplemented!("parse_array_binding_pat")
    }

    /// spec 'FormalParameter'
    pub(super) fn parse_formal_param(&mut self) -> PResult<Pat> {
        self.parse_binding_element()
    }

    pub(super) fn parse_formal_params(&mut self) -> PResult<Vec<Pat>> {
        // FIXME: This is wrong.
        let expr_or_spreads = self.parse_args()?;
        self.parse_exprs_as_params(expr_or_spreads)
    }

    pub(super) fn parse_unique_formal_params(&mut self) -> PResult<Vec<Pat>> {
        // FIXME: This is wrong.
        self.parse_formal_params()
    }
}

impl<I: Input> Parser<I> {
    /// This does not return 'rest' pattern because non-last parameter cannot be
    /// rest.
    fn parse_non_last_expr_as_param(&mut self, expr: Box<Expr>) -> PResult<Pat> {
        match expr.node {
            ExprKind::Ident(ident) => return Ok(ident.into()),
            _ => unimplemented!("parse_non_last_expr_as_param"),
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
                ExprOrSpread::Spread(expr) => syntax_error!(self, SyntaxError::NonLastRestParam),
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
