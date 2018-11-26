//! 13.3.3 Destructuring Binding Patterns
use super::{util::ExprExt, *};
use std::iter;
use swc_common::Spanned;

#[parser]
impl<'a, I: Input> Parser<'a, I> {
    pub(super) fn parse_opt_binding_ident(&mut self) -> PResult<'a, (Option<Ident>)> {
        if is!(BindingIdent) {
            self.parse_binding_ident().map(Some)
        } else {
            Ok(None)
        }
    }

    /// babel: `parseBindingIdentifier`
    ///
    /// spec: `BindingIdentifier`
    pub(super) fn parse_binding_ident(&mut self) -> PResult<'a, Ident> {
        // "yield" and "await" is **lexically** accepted.
        let ident = self.parse_ident(true, true)?;
        if self.ctx().strict {
            if &*ident.sym == "arguments" || &*ident.sym == "eval" {
                syntax_error!(SyntaxError::EvalAndArgumentsInStrict);
            }
        }
        if self.ctx().in_async && ident.sym == js_word!("await") {
            syntax_error!(ident.span, SyntaxError::ExpectedIdent)
        }
        if self.ctx().in_generator && ident.sym == js_word!("yield") {
            syntax_error!(ident.span, SyntaxError::ExpectedIdent)
        }

        Ok(ident)
    }

    pub(super) fn parse_binding_pat_or_ident(&mut self) -> PResult<'a, Pat> {
        match *cur!(true)? {
            tok!("yield") | Word(..) => self.parse_binding_ident().map(Pat::from),
            tok!('[') => self.parse_array_binding_pat(),
            tok!('{') => self.parse_object(),
            // tok!('(') => {
            //     bump!();
            //     let pat = self.parse_binding_pat_or_ident()?;
            //     expect!(')');
            //     Ok(pat)
            // }
            _ => unexpected!(),
        }
    }

    /// babel: `parseBindingAtom`
    pub(super) fn parse_binding_element(&mut self) -> PResult<'a, Pat> {
        let start = cur_pos!();
        let left = self.parse_binding_pat_or_ident()?;

        if eat!('=') {
            let right = self.include_in_expr(true).parse_assignment_expr()?;
            return Ok(Pat::Assign(AssignPat {
                span: span!(start),
                left: box left,
                right,
            }));
        }

        Ok(left)
    }

    fn parse_array_binding_pat(&mut self) -> PResult<'a, Pat> {
        let start = cur_pos!();

        assert_and_bump!('[');

        let mut elems = vec![];
        let mut comma = 0;

        while !eof!() && !is!(']') {
            if eat!(',') {
                comma += 1;
                continue;
            }
            if comma > 0 {
                // One comma is used for separating elements
                let cnt = if elems.is_empty() { comma } else { comma - 1 };
                elems.extend(iter::repeat(None).take(cnt));
                comma = 0;
            }
            let start = cur_pos!();

            if eat!("...") {
                let dot3_token = span!(start);

                let pat = self.parse_binding_pat_or_ident()?;
                let pat = Pat::Rest(RestPat {
                    dot3_token,
                    arg: box pat,
                });
                elems.push(Some(pat));
                // Trailing comma isn't allowed
                break;
            } else {
                elems.push(self.parse_binding_element().map(Some)?);
            }
        }

        expect!(']');

        Ok(Pat::Array(ArrayPat {
            span: span!(start),
            elems,
        }))
    }

    /// spec: 'FormalParameter'
    pub(super) fn parse_formal_param(&mut self) -> PResult<'a, Pat> {
        self.parse_binding_element()
    }

    ///
    /// spec: 'FormalParameterList'
    pub(super) fn parse_formal_params(&mut self) -> PResult<'a, (Vec<Pat>)> {
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

            if eat!("...") {
                let dot3_token = span!(start);

                let pat = self.parse_binding_pat_or_ident()?;
                let pat = Pat::Rest(RestPat {
                    dot3_token,
                    arg: box pat,
                });
                params.push(pat);
                break;
            } else {
                params.push(self.parse_binding_element()?);
            }
        }

        Ok(params)
    }

    pub(super) fn parse_unique_formal_params(&mut self) -> PResult<'a, (Vec<Pat>)> {
        // FIXME: This is wrong.
        self.parse_formal_params()
    }
}
///
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum PatType {
    BindingPat,
    BindingElement,
    /// AssigmentPattern
    AssignPat,
    AssignElement,
}
impl PatType {
    pub fn element(self) -> Self {
        match self {
            PatType::BindingPat | PatType::BindingElement => PatType::BindingElement,
            PatType::AssignPat | PatType::AssignElement => PatType::AssignElement,
        }
    }
}

#[parser]
impl<'a, I: Input> Parser<'a, I> {
    /// This does not return 'rest' pattern because non-last parameter cannot be
    /// rest.
    pub(super) fn reparse_expr_as_pat(
        &mut self,
        pat_ty: PatType,
        expr: Box<Expr>,
    ) -> PResult<'a, Pat> {
        let span = expr.span();

        if pat_ty == PatType::AssignPat {
            match *expr {
                Expr::Object(..) | Expr::Array(..) => {
                    // It is a Syntax Error if LeftHandSideExpression is either an
                    // ObjectLiteral or an ArrayLiteral and LeftHandSideExpression cannot
                    // be reparsed as an AssignmentPattern.

                }

                _ => {
                    // It is an early Reference Error if LeftHandSideExpression is neither
                    // an ObjectLiteral nor an ArrayLiteral and
                    // IsValidSimpleAssignmentTarget of LeftHandSideExpression is false.
                    if !expr.is_valid_simple_assignment_target(self.ctx().strict) {
                        syntax_error!(span, SyntaxError::NotSimpleAssign)
                    }
                    match *expr {
                        // It is a Syntax Error if the LeftHandSideExpression is
                        // CoverParenthesizedExpressionAndArrowParameterList:(Expression) and
                        // Expression derives a phrase that would produce a Syntax Error according
                        // to these rules if that phrase were substituted for
                        // LeftHandSideExpression. This rule is recursively applied.
                        Expr::Paren(ParenExpr { expr, .. }) => {
                            return self.reparse_expr_as_pat(pat_ty, expr)
                        }
                        Expr::Ident(i) => return Ok(i.into()),
                        _ => {
                            return Ok(Pat::Expr(expr));
                        }
                    }
                }
            }
        }

        // AssignmentElement:
        //      DestructuringAssignmentTarget Initializer[+In]?
        //
        // DestructuringAssignmentTarget:
        //      LeftHandSideExpression
        if pat_ty == PatType::AssignElement {
            match *expr {
                Expr::Array(..) | Expr::Object(..) => {}

                Expr::Member(..)
                | Expr::Call(..)
                | Expr::New(..)
                | Expr::Lit(..)
                | Expr::Ident(..)
                | Expr::Fn(..)
                | Expr::Class(..)
                | Expr::Tpl(..) => {
                    if !expr.is_valid_simple_assignment_target(self.ctx().strict) {
                        syntax_error!(span, SyntaxError::NotSimpleAssign)
                    }
                    match *expr {
                        Expr::Ident(i) => return Ok(i.into()),
                        _ => {
                            return Ok(Pat::Expr(expr));
                        }
                    }
                }

                // It's special because of optional intializer
                Expr::Assign(..) => {}

                _ => syntax_error!(span, SyntaxError::InvalidPat),
            }
        }

        match *expr {
            Expr::Paren(inner) => syntax_error!(span, SyntaxError::InvalidPat),
            Expr::Assign(assign_expr @ AssignExpr { op: Assign, .. }) => {
                let AssignExpr {
                    span, left, right, ..
                } = assign_expr;
                return Ok(Pat::Assign(AssignPat {
                    span,
                    left: match left {
                        PatOrExpr::Expr(left) => box self.reparse_expr_as_pat(pat_ty, left)?,
                        PatOrExpr::Pat(left) => left,
                    },
                    right,
                }));
            }
            Expr::Object(ObjectLit { span, props }) => {
                // {}
                return Ok(Pat::Object(ObjectPat {
                    span,
                    props: props
                        .into_iter()
                        .map(|prop| {
                            let span = prop.span();
                            match prop {
                                PropOrSpread::Prop(box Prop::Shorthand(id)) => {
                                    Ok(ObjectPatProp::Assign(AssignPatProp {
                                        span: id.span(),
                                        key: id.into(),
                                        value: None,
                                    }))
                                }
                                PropOrSpread::Prop(box Prop::KeyValue(kv_prop)) => {
                                    Ok(ObjectPatProp::KeyValue(KeyValuePatProp {
                                        key: kv_prop.key,
                                        value: box self
                                            .reparse_expr_as_pat(pat_ty.element(), kv_prop.value)?,
                                    }))
                                }
                                PropOrSpread::Prop(box Prop::Assign(assign_prop)) => {
                                    Ok(ObjectPatProp::Assign(AssignPatProp {
                                        span,
                                        key: assign_prop.key,
                                        value: Some(assign_prop.value),
                                    }))
                                }
                                PropOrSpread::Spread(SpreadElement { dot3_token, expr }) => {
                                    Ok(ObjectPatProp::Rest(RestPat {
                                        dot3_token,
                                        // FIXME: is BindingPat correct?
                                        arg: box self
                                            .reparse_expr_as_pat(PatType::BindingPat, expr)?,
                                    }))
                                }

                                _ => syntax_error!(prop.span(), SyntaxError::InvalidPat),
                            }
                        })
                        .collect::<(PResult<'a, _>)>()?,
                }));
            }
            Expr::Ident(ident) => return Ok(ident.into()),
            Expr::Array(ArrayLit {
                elems: mut exprs, ..
            }) => {
                if exprs.len() == 0 {
                    return Ok(Pat::Array(ArrayPat {
                        span,
                        elems: vec![],
                    }));
                }

                // Trailing comma may exist. We should remove those commas.
                let count_of_trailing_comma =
                    exprs.iter().rev().take_while(|e| e.is_none()).count();

                let len = exprs.len();
                let mut params = Vec::with_capacity(exprs.len() - count_of_trailing_comma);

                // Comma or other pattern cannot follow a rest pattern.
                let idx_of_rest_not_allowed = if count_of_trailing_comma == 0 {
                    len - 1
                } else {
                    // last element is comma, so rest is not allowed for every pattern element.
                    len - count_of_trailing_comma
                };

                for expr in exprs.drain(..idx_of_rest_not_allowed) {
                    match expr {
                        Some(
                            expr @ ExprOrSpread {
                                spread: Some(..), ..
                            },
                        ) => syntax_error!(expr.span(), SyntaxError::NonLastRestParam),
                        Some(ExprOrSpread { expr, .. }) => {
                            params.push(self.reparse_expr_as_pat(pat_ty.element(), expr).map(Some)?)
                        }
                        None => params.push(None),
                    }
                }

                if count_of_trailing_comma == 0 {
                    let expr = exprs.into_iter().next().unwrap();
                    let last = match expr {
                        // Rest
                        Some(ExprOrSpread {
                            spread: Some(dot3_token),
                            expr,
                        }) => {
                            // TODO: is BindingPat correct?
                            self.reparse_expr_as_pat(pat_ty.element(), expr)
                                .map(|pat| {
                                    Pat::Rest(RestPat {
                                        dot3_token,
                                        arg: box pat,
                                    })
                                })
                                .map(Some)?
                        }
                        Some(ExprOrSpread { expr, .. }) => {
                            // TODO: is BindingPat correct?
                            self.reparse_expr_as_pat(pat_ty.element(), expr).map(Some)?
                        }
                        // TODO: sytax error if last element is ellison and ...rest exists.
                        None => None,
                    };
                    params.push(last);
                }
                return Ok(Pat::Array(ArrayPat {
                    span,
                    elems: params,
                }));
            }

            // Invalid patterns.
            // Note that assignment expression with '=' is valid, and handled above.
            Expr::Lit(..) | Expr::Member(..) | Expr::Assign(..) => {
                syntax_error!(span, SyntaxError::InvalidPat);
            }

            Expr::Yield(..) if self.ctx().in_generator => {
                syntax_error!(span, SyntaxError::YieldParamInGen);
            }

            _ => {
                //  syntax_error!(span, SyntaxError::InvalidPat)

                unimplemented!(
                    "reparse_expr_as_pat, pat_ty = {:?}, expr = {:?}",
                    pat_ty,
                    expr
                )
            }
        }
    }

    pub(super) fn parse_exprs_as_params(
        &mut self,
        mut exprs: Vec<ExprOrSpread>,
    ) -> PResult<'a, (Vec<Pat>)> {
        let pat_ty = PatType::BindingPat;

        let len = exprs.len();
        if len == 0 {
            return Ok(vec![]);
        }

        let mut params = Vec::with_capacity(len);

        for expr in exprs.drain(..len - 1) {
            match expr {
                ExprOrSpread {
                    spread: Some(..), ..
                } => syntax_error!(expr.span(), SyntaxError::NonLastRestParam),
                ExprOrSpread { expr, .. } => params.push(self.reparse_expr_as_pat(pat_ty, expr)?),
            }
        }

        assert_eq!(exprs.len(), 1);
        let expr = exprs.into_iter().next().unwrap();
        let last = match expr {
            // Rest
            ExprOrSpread {
                spread: Some(dot3_token),
                expr,
            } => self.reparse_expr_as_pat(pat_ty, expr).map(|pat| {
                Pat::Rest(RestPat {
                    dot3_token,
                    arg: box pat,
                })
            })?,
            ExprOrSpread { expr, .. } => self.reparse_expr_as_pat(pat_ty, expr)?,
        };
        params.push(last);

        Ok(params)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use swc_common::DUMMY_SP as span;

    fn array_pat(s: &'static str) -> Pat {
        test_parser(s, |p| {
            p.parse_array_binding_pat()
                .unwrap_or_else(|()| unreachable!("failed to parse an pattern"))
        })
    }

    fn ident(s: &str) -> Ident {
        Ident {
            sym: s.into(),
            span,
        }
    }

    #[test]
    fn array_pat_simple() {
        assert_eq_ignore_span!(
            array_pat("[a, [b], [c]]"),
            Pat::Array(ArrayPat {
                span,
                elems: vec![
                    Some(Pat::Ident(ident("a"))),
                    Some(Pat::Array(ArrayPat {
                        span,
                        elems: vec![Some(Pat::Ident(ident("b")))]
                    })),
                    Some(Pat::Array(ArrayPat {
                        span,
                        elems: vec![Some(Pat::Ident(ident("c")))]
                    }))
                ]
            })
        );
    }

    #[test]
    fn array_pat_empty_start() {
        assert_eq_ignore_span!(
            array_pat("[, a, [b], [c]]"),
            Pat::Array(ArrayPat {
                span,
                elems: vec![
                    None,
                    Some(Pat::Ident(ident("a"))),
                    Some(Pat::Array(ArrayPat {
                        span,
                        elems: vec![Some(Pat::Ident(ident("b")))]
                    })),
                    Some(Pat::Array(ArrayPat {
                        span,
                        elems: vec![Some(Pat::Ident(ident("c")))]
                    }))
                ]
            })
        );
    }

    #[test]
    fn array_pat_empty() {
        assert_eq_ignore_span!(
            array_pat("[a, , [b], [c]]"),
            Pat::Array(ArrayPat {
                span,
                elems: vec![
                    Some(Pat::Ident(ident("a"))),
                    None,
                    Some(Pat::Array(ArrayPat {
                        span,
                        elems: vec![Some(Pat::Ident(ident("b")))]
                    })),
                    Some(Pat::Array(ArrayPat {
                        span,
                        elems: vec![Some(Pat::Ident(ident("c")))]
                    }))
                ]
            })
        );
    }
}
