//! Cover Grammar for Destructuring Assignment

use oxc_span::GetSpan;
use swc_ecma_ast::*;

use crate::{diagnostics, diagnostics::Result, ParserImpl};

pub trait CoverGrammar<'a, T>: Sized {
    fn cover(value: T, p: &mut ParserImpl<'a>) -> Result<Self>;
}

impl<'a> CoverGrammar<'a, Expr> for AssignmentTarget<'a> {
    fn cover(expr: Expr, p: &mut ParserImpl<'a>) -> Result<Self> {
        match expr {
            Expr::ArrayExpression(array_expr) => {
                ArrayAssignmentTarget::cover(array_expr.unbox(), p)
                    .map(|pat| p.ast.alloc(pat))
                    .map(AssignmentTarget::ArrayAssignmentTarget)
            }
            Expr::ObjectExpression(object_expr) => {
                ObjectAssignmentTarget::cover(object_expr.unbox(), p)
                    .map(|pat| p.ast.alloc(pat))
                    .map(AssignmentTarget::ObjectAssignmentTarget)
            }
            _ => SimpleAssignmentTarget::cover(expr, p).map(AssignmentTarget::from),
        }
    }
}

impl<'a> CoverGrammar<'a, Expr> for SimpleAssignmentTarget<'a> {
    #[allow(clippy::only_used_in_recursion)]
    fn cover(expr: Expr, p: &mut ParserImpl<'a>) -> Result<Self> {
        match expr {
            Expr::Identifier(ident) => {
                Ok(SimpleAssignmentTarget::AssignmentTargetIdentifier(ident))
            }
            match_member_expression!(Expression) => {
                let member_expr = MemberExpr::try_from(expr).unwrap();
                Ok(SimpleAssignmentTarget::from(member_expr))
            }
            Expr::ParenthesizedExpression(expr) => {
                let span = expr.span;
                match expr.unbox().expression {
                    Expr::ObjectExpression(_) | Expr::ArrayExpression(_) => {
                        Err(diagnostics::invalid_assignment(span))
                    }
                    expr => SimpleAssignmentTarget::cover(expr, p),
                }
            }
            Expr::TSAsExpression(expr) => Ok(SimpleAssignmentTarget::TSAsExpression(expr)),
            Expr::TSSatisfiesExpression(expr) => {
                Ok(SimpleAssignmentTarget::TSSatisfiesExpression(expr))
            }
            Expr::TSNonNullExpression(expr) => {
                Ok(SimpleAssignmentTarget::TSNonNullExpression(expr))
            }
            Expr::TSTypeAssertion(expr) => Ok(SimpleAssignmentTarget::TSTypeAssertion(expr)),
            Expr::TSInstantiationExpression(expr) => {
                Ok(SimpleAssignmentTarget::TSInstantiationExpression(expr))
            }
            expr => Err(diagnostics::invalid_assignment(expr.span())),
        }
    }
}

impl<'a> CoverGrammar<'a, ArrayExpr> for ArrayAssignmentTarget<'a> {
    fn cover(expr: ArrayExpr, p: &mut ParserImpl<'a>) -> Result<Self> {
        let mut elements = p.ast.vec();
        let mut rest = None;

        let len = expr.elements.len();
        for (i, elem) in expr.elements.into_iter().enumerate() {
            match elem {
                match_expression!(ArrayExpressionElement) => {
                    let expr = Expr::try_from(elem).unwrap();
                    let target = AssignmentTargetMaybeDefault::cover(expr, p)?;
                    elements.push(Some(target));
                }
                ArrayExpressionElement::SpreadElement(elem) => {
                    if i == len - 1 {
                        rest = Some(AssignmentTargetRest {
                            span: elem.span,
                            target: AssignmentTarget::cover(elem.unbox().argument, p)?,
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

        Ok(ArrayAssignmentTarget {
            span: expr.span,
            elements,
            rest,
            trailing_comma: expr.trailing_comma,
        })
    }
}

impl<'a> CoverGrammar<'a, Expr> for AssignmentTargetMaybeDefault<'a> {
    fn cover(expr: Expr, p: &mut ParserImpl<'a>) -> Result<Self> {
        match expr {
            Expr::AssignmentExpression(assignment_expr) => {
                let target = AssignmentTargetWithDefault::cover(assignment_expr.unbox(), p)?;
                Ok(AssignmentTargetMaybeDefault::AssignmentTargetWithDefault(
                    p.ast.alloc(target),
                ))
            }
            expr => {
                let target = AssignmentTarget::cover(expr, p)?;
                Ok(AssignmentTargetMaybeDefault::from(target))
            }
        }
    }
}

impl<'a> CoverGrammar<'a, AssignmentExpr> for AssignmentTargetWithDefault<'a> {
    fn cover(expr: AssignmentExpr, _p: &mut ParserImpl<'a>) -> Result<Self> {
        Ok(Self {
            span: expr.span,
            binding: expr.left,
            init: expr.right,
        })
    }
}

impl<'a> CoverGrammar<'a, ObjectExpr> for ObjectAssignmentTarget<'a> {
    fn cover(expr: ObjectExpr, p: &mut ParserImpl<'a>) -> Result<Self> {
        let mut properties = p.ast.vec();
        let mut rest = None;

        let len = expr.properties.len();
        for (i, elem) in expr.properties.into_iter().enumerate() {
            match elem {
                ObjectPropertyKind::ObjectProperty(property) => {
                    let target = AssignmentTargetProperty::cover(property.unbox(), p)?;
                    properties.push(target);
                }
                ObjectPropertyKind::SpreadProperty(spread) => {
                    if i == len - 1 {
                        rest = Some(AssignmentTargetRest {
                            span: spread.span,
                            target: AssignmentTarget::cover(spread.unbox().argument, p)?,
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

impl<'a> CoverGrammar<'a, ObjectProperty<'a>> for AssignmentTargetProperty<'a> {
    fn cover(property: ObjectProperty<'a>, p: &mut ParserImpl<'a>) -> Result<Self> {
        if property.shorthand {
            let binding = match property.key {
                PropertyKey::StaticIdentifier(ident) => {
                    let ident = ident.unbox();
                    IdentifierReference::new(ident.span, ident.name)
                }
                _ => return Err(p.unexpected()),
            };
            // convert `CoverInitializedName`
            let init = match property.init {
                Some(Expr::AssignmentExpression(assignment_expr)) => {
                    Some(assignment_expr.unbox().right)
                }
                _ => None,
            };
            let target = AssignmentTargetPropertyIdentifier {
                span: property.span,
                binding,
                init,
            };
            Ok(AssignmentTargetProperty::AssignmentTargetPropertyIdentifier(p.ast.alloc(target)))
        } else {
            let binding = AssignmentTargetMaybeDefault::cover(property.value, p)?;
            let target = AssignmentTargetPropertyProperty {
                span: property.span,
                name: property.key,
                binding,
            };
            Ok(AssignmentTargetProperty::AssignmentTargetPropertyProperty(
                p.ast.alloc(target),
            ))
        }
    }
}
