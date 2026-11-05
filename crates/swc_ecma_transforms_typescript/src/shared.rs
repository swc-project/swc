use swc_atoms::Wtf8Atom;
use swc_ecma_ast::{
    Expr, OptChainBase, ParenExpr, TsAsExpr, TsConstAssertion, TsEnumMemberId, TsInstantiation,
    TsNonNullExpr, TsSatisfiesExpr, TsTypeAssertion,
};

/// Returns an enum member name without discarding lone surrogates.
#[inline]
pub(crate) fn enum_member_name(id: &TsEnumMemberId) -> Wtf8Atom {
    match id {
        TsEnumMemberId::Ident(ident) => ident.sym.clone().into(),
        TsEnumMemberId::Str(str_lit) => str_lit.value.clone(),
        #[cfg(swc_ast_unknown)]
        _ => panic!("unable to access unknown nodes"),
    }
}

/// Whether deleting this expression consumes a JavaScript reference.
/// Grouping and erased TypeScript wrappers preserve the target's identity.
pub(crate) fn is_reference_expr(mut expression: &Expr) -> bool {
    loop {
        expression = match expression {
            Expr::Paren(ParenExpr { expr, .. })
            | Expr::TsAs(TsAsExpr { expr, .. })
            | Expr::TsNonNull(TsNonNullExpr { expr, .. })
            | Expr::TsTypeAssertion(TsTypeAssertion { expr, .. })
            | Expr::TsConstAssertion(TsConstAssertion { expr, .. })
            | Expr::TsInstantiation(TsInstantiation { expr, .. })
            | Expr::TsSatisfies(TsSatisfiesExpr { expr, .. }) => expr,
            _ => break,
        };
    }
    match expression {
        Expr::Ident(_) | Expr::Member(_) | Expr::SuperProp(_) => true,
        Expr::OptChain(chain) => matches!(&*chain.base, OptChainBase::Member(_)),
        _ => false,
    }
}
