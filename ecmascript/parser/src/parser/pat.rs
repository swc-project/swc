//! 13.3.3 Destructuring Binding Patterns
use super::*;
use super::util::ExprExt;
use std::iter;

#[parser]
impl<'a, I: Input> Parser<'a, I> {
    pub(super) fn parse_opt_binding_ident(&mut self) -> PResult<'a, Option<Ident>> {
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
        match *cur!()? {
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

    fn parse_array_binding_pat(&mut self) -> PResult<'a, Pat> {
        self.spanned(|p| {
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
                    let pat = p.parse_binding_pat_or_ident()?;
                    let pat = Pat {
                        span: span!(start),
                        node: PatKind::Rest(box pat),
                    };
                    elems.push(Some(pat));
                    // Trailing comma isn't allowed
                    break;
                } else {
                    elems.push(p.parse_binding_element().map(Some)?);
                }
            }

            expect!(']');

            Ok(PatKind::Array(elems))
        })
    }

    /// spec: 'FormalParameter'
    pub(super) fn parse_formal_param(&mut self) -> PResult<'a, Pat> {
        self.parse_binding_element()
    }

    ///
    /// spec: 'FormalParameterList'
    pub(super) fn parse_formal_params(&mut self) -> PResult<'a, Vec<Pat>> {
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

    pub(super) fn parse_unique_formal_params(&mut self) -> PResult<'a, Vec<Pat>> {
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
        box expr: Box<Expr>,
    ) -> PResult<'a, Pat> {
        let span = expr.span;

        if pat_ty == PatType::AssignPat {
            match expr.node {
                ExprKind::Object(..) | ExprKind::Array(..) => {
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
                    match expr.node {
                        ExprKind::Ident(i) => return Ok(i.into()),
                        _ => {
                            return Ok(Pat {
                                span,
                                node: PatKind::Expr(box expr),
                            });
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
            match expr.node {
                ExprKind::Array(..) | ExprKind::Object(..) => {}

                ExprKind::Member(..)
                | ExprKind::Call(..)
                | ExprKind::New(..)
                | ExprKind::Lit(..)
                | ExprKind::Ident(..)
                | ExprKind::Fn(..)
                | ExprKind::Class(..)
                | ExprKind::Tpl(..) => {
                    if !expr.node
                        .is_valid_simple_assignment_target(self.ctx().strict)
                    {
                        syntax_error!(span, SyntaxError::NotSimpleAssign)
                    }
                    match expr.node {
                        ExprKind::Ident(i) => return Ok(i.into()),
                        _ => {
                            return Ok(Pat {
                                span,
                                node: PatKind::Expr(box expr),
                            });
                        }
                    }
                }

                // It's special because of optional intializer
                ExprKind::Assign(..) => {}

                _ => syntax_error!(span, SyntaxError::InvalidPat),
            }
        }

        match expr.node {
            ExprKind::Paren(inner) => {
                if pat_ty == PatType::AssignPat {
                    let inner_pat = self.reparse_expr_as_pat(pat_ty, inner)?;
                    return Ok(Pat {
                        span,
                        node: inner_pat.node,
                    });
                } else {
                    syntax_error!(span, SyntaxError::InvalidPat)
                }
            }
            ExprKind::Assign(AssignExpr {
                left,
                op: Assign,
                right,
            }) => {
                return Ok(Pat {
                    span,
                    node: PatKind::Assign {
                        left: match left {
                            PatOrExpr::Expr(left) => box self.reparse_expr_as_pat(pat_ty, left)?,
                            PatOrExpr::Pat(left) => box left,
                        },
                        right,
                    },
                })
            }
            ExprKind::Object(ObjectLit { props }) => {
                // {}
                return Ok(Pat {
                    span,
                    node: PatKind::Object(props
                        .into_iter()
                        .map(|prop| match prop.node {
                            PropKind::Shorthand(id) => Ok(ObjectPatProp::Assign {
                                key: id.into(),
                                value: None,
                            }),
                            PropKind::KeyValue { key, value } => Ok(ObjectPatProp::KeyValue {
                                key,
                                value: box self.reparse_expr_as_pat(pat_ty.element(), value)?,
                            }),
                            PropKind::Assign { key, value } => Ok(ObjectPatProp::Assign {
                                key,
                                value: Some(value),
                            }),

                            _ => syntax_error!(prop.span, SyntaxError::InvalidPat),
                        })
                        .collect::<PResult<'a, _>>()?),
                });
            }
            ExprKind::Ident(ident) => return Ok(ident.into()),
            ExprKind::Array(ArrayLit { elems: mut exprs }) => {
                if exprs.len() == 0 {
                    return Ok(Pat {
                        span,
                        node: PatKind::Array(vec![]),
                    });
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
                        Some(ExprOrSpread::Spread(expr)) => {
                            syntax_error!(expr.span, SyntaxError::NonLastRestParam)
                        }
                        Some(ExprOrSpread::Expr(expr)) => {
                            params.push(self.reparse_expr_as_pat(pat_ty.element(), expr).map(Some)?)
                        }
                        None => params.push(None),
                    }
                }

                if count_of_trailing_comma == 0 {
                    let expr = exprs.into_iter().next().unwrap();
                    let last = match expr {
                        // Rest
                        Some(ExprOrSpread::Spread(expr)) => {
                            // FIXME: Span should start from ...
                            let span = expr.span;

                            // TODO: is BindingPat correct?
                            self.reparse_expr_as_pat(pat_ty.element(), expr)
                                .map(|pat| Pat {
                                    span,
                                    node: PatKind::Rest(box pat),
                                })
                                .map(Some)?
                        }
                        Some(ExprOrSpread::Expr(expr)) => {
                            // TODO: is BindingPat correct?
                            self.reparse_expr_as_pat(pat_ty.element(), expr).map(Some)?
                        }
                        // TODO: sytax error if last element is ellison and ...rest exists.
                        None => None,
                    };
                    params.push(last);
                }
                return Ok(Pat {
                    span,
                    node: PatKind::Array(params),
                });
            }

            // Invalid patterns.
            // Note that assignment expression with '=' is valid, and handled above.
            ExprKind::Lit(..) | ExprKind::Member(..) | ExprKind::Assign(..) => {
                syntax_error!(span, SyntaxError::InvalidPat);
            }

            ExprKind::Yield(..) if self.ctx().in_generator => {
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
    ) -> PResult<'a, Vec<Pat>> {
        let pat_ty = PatType::BindingPat;

        let len = exprs.len();
        if len == 0 {
            return Ok(vec![]);
        }

        let mut params = Vec::with_capacity(len);

        for expr in exprs.drain(..len - 1) {
            match expr {
                ExprOrSpread::Spread(expr) => {
                    syntax_error!(expr.span, SyntaxError::NonLastRestParam)
                }
                ExprOrSpread::Expr(expr) => params.push(self.reparse_expr_as_pat(pat_ty, expr)?),
            }
        }

        assert_eq!(exprs.len(), 1);
        let expr = exprs.into_iter().next().unwrap();
        let last = match expr {
            // Rest
            ExprOrSpread::Spread(expr) => {
                let span = expr.span; //TODO

                self.reparse_expr_as_pat(pat_ty, expr).map(|pat| Pat {
                    span,
                    node: PatKind::Rest(box pat),
                })?
            }
            ExprOrSpread::Expr(expr) => self.reparse_expr_as_pat(pat_ty, expr)?,
        };
        params.push(last);

        Ok(params)
    }
}
