//! Cover Grammar for Destructuring Assign

use oxc_span::GetSpan;
use swc_ecma_ast::*;

use crate::v2::{diagnostics, diagnostics::Result, ParserImpl};

pub trait CoverGrammar<'a, T>: Sized {
    fn cover(value: T, p: &mut ParserImpl<'a>) -> Result<Self>;
}

impl<'a> CoverGrammar<'a, Expr> for AssignTarget {
    fn cover(expr: Expr, p: &mut ParserImpl<'a>) -> Result<Self> {
        match expr {
            Expr::Array(array_expr) => ArrayPat::cover(array_expr.unbox(), p)
                .map(|pat| p.ast.alloc(pat))
                .map(AssignTarget::ArrayAssignTarget),
            Expr::Object(object_expr) => ObjectPat::cover(object_expr.unbox(), p)
                .map(|pat| p.ast.alloc(pat))
                .map(AssignTarget::ObjectAssignTarget),
            _ => SimpleAssignTarget::cover(expr, p).map(AssignTarget::from),
        }
    }
}

impl<'a> CoverGrammar<'a, Expr> for SimpleAssignTarget {
    #[allow(clippy::only_used_in_recursion)]
    fn cover(expr: Expr, p: &mut ParserImpl<'a>) -> Result<Self> {
        match expr {
            Expr::Ident(ident) => Ok(SimpleAssignTarget::AssignTargetIdent(ident)),
            match_member_expression!(Expression) => {
                let member_expr = MemberExpr::try_from(expr).unwrap();
                Ok(SimpleAssignTarget::from(member_expr))
            }
            Expr::Parenthesized(expr) => {
                let span = expr.span;
                match expr.unbox().expression {
                    Expr::Object(_) | Expr::Array(_) => Err(diagnostics::invalid_assignment(span)),
                    expr => SimpleAssignTarget::cover(expr, p),
                }
            }
            Expr::TsAs(expr) => Ok(SimpleAssignTarget::TsAs(expr)),
            Expr::TsSatisfies(expr) => Ok(SimpleAssignTarget::TsSatisfies(expr)),
            Expr::TsNonNull(expr) => Ok(SimpleAssignTarget::TsNonNull(expr)),
            Expr::TsTypeAssertion(expr) => Ok(SimpleAssignTarget::TsTypeAssertion(expr)),
            Expr::TsInstantiation(expr) => Ok(SimpleAssignTarget::TsInstantiation(expr)),
            expr => Err(diagnostics::invalid_assignment(expr.span())),
        }
    }
}

impl<'a> CoverGrammar<'a, ArrayExpr> for ArrayPat {
    fn cover(expr: ArrayExpr, p: &mut ParserImpl<'a>) -> Result<Self> {
        let mut elements = p.ast.vec();
        let mut rest = None;

        let len = expr.elements.len();
        for (i, elem) in expr.elements.into_iter().enumerate() {
            match elem {
                match_expression!(ArrayExpressionElement) => {
                    let expr = Expr::try_from(elem).unwrap();
                    let target = AssignTargetMaybeDefault::cover(expr, p)?;
                    elements.push(Some(target));
                }
                ArrayExpressionElement::SpreadElement(elem) => {
                    if i == len - 1 {
                        rest = Some(AssignTargetRest {
                            span: elem.span,
                            target: AssignTarget::cover(elem.unbox().argument, p)?,
                        });
                        if let Some(span) = expr.trailing_comma {
                            p.error(diagnostics::binding_rest_element_trailing_comma(span));
                        }
                    } else {
                        return Err(diagnostics::spread_last_element(elem.span));
                    }
                }
                ArrayExpressionElement::Elision(_) => elements.push(None),
            }
        }

        Ok(ArrayAssignTarget {
            span: expr.span,
            elements,
            rest,
            trailing_comma: expr.trailing_comma,
        })
    }
}

impl<'a> CoverGrammar<'a, Expr> for AssignTargetMaybeDefault<'a> {
    fn cover(expr: Expr, p: &mut ParserImpl<'a>) -> Result<Self> {
        match expr {
            Expr::Assign(assignment_expr) => {
                let target = AssignTargetWithDefault::cover(assignment_expr.unbox(), p)?;
                Ok(AssignTargetMaybeDefault::AssignTargetWithDefault(
                    p.ast.alloc(target),
                ))
            }
            expr => {
                let target = AssignTarget::cover(expr, p)?;
                Ok(AssignTargetMaybeDefault::from(target))
            }
        }
    }
}

impl<'a> CoverGrammar<'a, AssignExpr> for AssignPatProp {
    fn cover(expr: AssignExpr, _p: &mut ParserImpl<'a>) -> Result<Self> {
        Ok(Self {
            span: expr.span,
            binding: expr.left,
            init: expr.right,
        })
    }
}

impl<'a> CoverGrammar<'a, ObjectExpr> for ObjectPat {
    fn cover(expr: ObjectExpr, p: &mut ParserImpl<'a>) -> Result<Self> {
        let mut properties = p.ast.vec();
        let mut rest = None;

        let len = expr.properties.len();
        for (i, elem) in expr.properties.into_iter().enumerate() {
            match elem {
                ObjectPropertyKind::ObjectProperty(property) => {
                    let target = AssignTargetProperty::cover(property.unbox(), p)?;
                    properties.push(target);
                }
                ObjectPropertyKind::SpreadProperty(spread) => {
                    if i == len - 1 {
                        rest = Some(AssignTargetRest {
                            span: spread.span,
                            target: AssignTarget::cover(spread.unbox().argument, p)?,
                        });
                    } else {
                        return Err(diagnostics::spread_last_element(spread.span));
                    }
                }
            }
        }

        Ok(Self {
            span: expr.span,
            properties,
            rest,
        })
    }
}

impl<'a> CoverGrammar<'a, Prop> for ObjectPatProp {
    fn cover(property: Prop, p: &mut ParserImpl<'a>) -> Result<Self> {
        if property.shorthand {
            let binding = match property.key {
                PropertyKey::StaticIdent(ident) => {
                    let ident = ident.unbox();
                    IdentReference::new(ident.span, ident.name)
                }
                _ => return Err(p.unexpected()),
            };
            // convert `CoverInitializedName`
            let init = match property.init {
                Some(Expr::Assign(assignment_expr)) => Some(assignment_expr.unbox().right),
                _ => None,
            };
            let target = AssignTargetPropertyIdent {
                span: property.span,
                binding,
                init,
            };
            Ok(AssignTargetProperty::AssignTargetPropertyIdent(
                p.ast.alloc(target),
            ))
        } else {
            let binding = AssignTargetMaybeDefault::cover(property.value, p)?;
            let target = AssignTargetPropertyProperty {
                span: property.span,
                name: property.key,
                binding,
            };
            Ok(AssignTargetProperty::AssignTargetPropertyProperty(
                p.ast.alloc(target),
            ))
        }
    }
}
