use swc_ecma_ast::*;

/// "IsValidSimpleAssignmentTarget" from spec.
pub fn is_valid_simple_assignment_target(expr: &Expr, strict: bool) -> bool {
    match expr {
        Expr::Ident(ident) => {
            if strict && ident.is_reserved_in_strict_bind() {
                return false;
            }
            true
        }

        Expr::This(..)
        | Expr::Lit(..)
        | Expr::Array(..)
        | Expr::Object(..)
        | Expr::Fn(..)
        | Expr::Class(..)
        | Expr::Tpl(..)
        | Expr::TaggedTpl(..) => false,
        Expr::Paren(ParenExpr { expr, .. }) => is_valid_simple_assignment_target(expr, strict),

        Expr::Member(MemberExpr { obj, .. }) => match obj.as_ref() {
            Expr::Member(..) => is_valid_simple_assignment_target(obj, strict),
            Expr::OptChain(..) => false,
            _ => true,
        },

        Expr::SuperProp(..) => true,

        Expr::New(..) | Expr::Call(..) => false,
        // TODO: Spec only mentions `new.target`
        Expr::MetaProp(..) => false,

        Expr::Update(..) => false,

        Expr::Unary(..) | Expr::Await(..) => false,

        Expr::Bin(..) => false,

        Expr::Cond(..) => false,

        Expr::Yield(..) | Expr::Arrow(..) | Expr::Assign(..) => false,

        Expr::Seq(..) => false,

        Expr::OptChain(..) => false,

        // MemberExpression is valid assignment target
        Expr::PrivateName(..) => false,

        // jsx
        Expr::JSXMember(..)
        | Expr::JSXNamespacedName(..)
        | Expr::JSXEmpty(..)
        | Expr::JSXElement(..)
        | Expr::JSXFragment(..) => false,

        // typescript
        Expr::TsNonNull(TsNonNullExpr { ref expr, .. })
        | Expr::TsTypeAssertion(TsTypeAssertion { ref expr, .. })
        | Expr::TsAs(TsAsExpr { ref expr, .. })
        | Expr::TsInstantiation(TsInstantiation { ref expr, .. })
        | Expr::TsSatisfies(TsSatisfiesExpr { ref expr, .. }) => {
            is_valid_simple_assignment_target(expr, strict)
        }

        Expr::TsConstAssertion(..) => false,

        Expr::Invalid(..) => false,
    }
}
