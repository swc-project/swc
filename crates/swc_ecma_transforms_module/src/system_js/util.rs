use swc_atoms::Atom;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::{prop_name_from_str, quote_ident, ExprFactory};

use crate::{util::prop_name, SpanCtx};

pub(super) fn context_meta(context_ident: &Ident) -> MemberExpr {
    context_member(context_ident, quote_ident!("meta"))
}

pub(super) fn context_member(context_ident: &Ident, prop: IdentName) -> MemberExpr {
    context_ident.clone().make_member(prop)
}

pub(super) fn export_object_init() -> Expr {
    ObjectLit {
        span: DUMMY_SP,
        props: vec![Prop::KeyValue(KeyValueProp {
            key: quote_ident!("__proto__").into(),
            value: Lit::Null(Null { span: DUMMY_SP }).into(),
        })
        .into()],
    }
    .into()
}

pub(super) fn export_setter_member(export_setters: &Ident, ident: &Ident) -> Pat {
    Pat::Expr(
        export_setters
            .clone()
            .make_member(quote_ident!(ident.sym.clone()))
            .into(),
    )
}

pub(super) fn member_for_export(namespace: Ident, imported: &Atom) -> Expr {
    member_expr_for(namespace, imported, Default::default()).into()
}

pub(super) fn member_expr_for(obj: Ident, prop: &Atom, span: SpanCtx) -> MemberExpr {
    MemberExpr {
        span: span.0,
        obj: obj.into(),
        prop: prop_name(prop, span).into(),
    }
}

pub(super) fn object_lit_prop_name(prop: &Atom, (span, _): SpanCtx) -> PropName {
    prop_name_from_str(span, prop)
}
