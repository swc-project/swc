use swc_atoms::{atom, Atom};
use swc_common::{Span, Spanned};
use swc_ecma_ast::{
    BindingIdent, BlockStmt, Decl, Expr, Ident, IdentName, JSXElementName, JSXMemberExpr,
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
    if let Key::Public(PropName::Ident(IdentName { sym, .. })) = key {
        sym.eq("constructor")
    } else if let Key::Public(PropName::Str(Str { value, .. })) = key {
        value.eq("constructor")
    } else {
        false
    }
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
            #[cfg(swc_ast_unknown)]
            _ => unreachable!(),
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
        #[cfg(swc_ast_unknown)]
        _ => unreachable!(),
    }
}

/// Mark as declare
pub fn make_decl_declare(mut decl: Decl) -> Decl {
    match decl {
        Decl::Class(ref mut c) => c.declare = true,
        Decl::Fn(ref mut f) => f.declare = true,
        Decl::Var(ref mut v) => v.declare = true,
        Decl::TsInterface(ref mut i) => i.declare = true,
        Decl::TsTypeAlias(ref mut a) => a.declare = true,
        Decl::TsEnum(ref mut e) => e.declare = true,
        Decl::TsModule(ref mut m) => m.declare = true,
        Decl::Using(..) => unreachable!("Using is not a valid declaration for `declare` keyword"),
        #[cfg(swc_ast_unknown)]
        _ => unreachable!(),
    }
    decl
}
