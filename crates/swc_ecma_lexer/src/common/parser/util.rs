use swc_atoms::{atom, Atom};
use swc_common::{Span, Spanned};
use swc_ecma_ast::{
    BindingIdent, BlockStmt, Expr, Ident, IdentName, JSXElementName, JSXMemberExpr,
    JSXNamespacedName, JSXObject, Key, Param, Pat, PropName, Str,
};

pub fn unwrap_ts_non_null(mut expr: &Expr) -> &Expr {
    while let Expr::TsNonNull(ts_non_null) = expr {
        expr = &ts_non_null.expr;
    }
    expr
}

pub fn is_not_this(p: &Param) -> bool {
    !matches!(
        &p.pat,
        Pat::Ident(BindingIdent {
            id: Ident{ sym: this, .. },
            ..
        }) if atom!("this").eq(this)
    )
}

pub fn has_use_strict(block: &BlockStmt) -> Option<Span> {
    block
        .stmts
        .iter()
        .take_while(|s| s.can_precede_directive())
        .find_map(|s| {
            if s.is_use_strict() {
                Some(s.span())
            } else {
                None
            }
        })
}

pub fn is_constructor(key: &Key) -> bool {
    matches!(
        &key,
        Key::Public(PropName::Ident(IdentName {
            sym: constructor,
            ..
        })) | Key::Public(PropName::Str(Str {
            value: constructor,
            ..
        })) if  atom!("constructor").eq(constructor)
    )
}

pub fn get_qualified_jsx_name(name: &JSXElementName) -> Atom {
    fn get_qualified_obj_name(obj: &JSXObject) -> Atom {
        match *obj {
            JSXObject::Ident(ref i) => i.sym.clone(),
            JSXObject::JSXMemberExpr(ref member) => format!(
                "{}.{}",
                get_qualified_obj_name(&member.obj),
                member.prop.sym
            )
            .into(),
        }
    }
    match *name {
        JSXElementName::Ident(ref i) => i.sym.clone(),
        JSXElementName::JSXNamespacedName(JSXNamespacedName {
            ref ns, ref name, ..
        }) => format!("{}:{}", ns.sym, name.sym).into(),
        JSXElementName::JSXMemberExpr(JSXMemberExpr {
            ref obj, ref prop, ..
        }) => format!("{}.{}", get_qualified_obj_name(obj), prop.sym).into(),
    }
}
