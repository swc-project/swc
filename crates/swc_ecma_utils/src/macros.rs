/// Shortcut for `quote_ident!(span.apply_mark(Mark::fresh(Mark::root())), s)`
#[macro_export]
macro_rules! private_ident {
    ($s:expr) => {
        private_ident!($crate::swc_common::DUMMY_SP, $s)
    };
    ($span:expr, $s:expr) => {{
        let mark = $crate::swc_common::Mark::new();
        let ctxt = $crate::swc_common::SyntaxContext::empty().apply_mark(mark);
        $crate::swc_ecma_ast::Ident::new($s.into(), $span, ctxt)
    }};
}

#[macro_export]
macro_rules! quote_ident {
    ($s:expr) => {
        quote_ident!(Default::default(), $crate::swc_common::DUMMY_SP, $s)
    };
    ($ctxt:expr, $s:expr) => {{
        quote_ident!($ctxt, $crate::swc_common::DUMMY_SP, $s)
    }};

    ($ctxt:expr, $span:expr, $s:expr) => {{
        $crate::swc_ecma_ast::Ident::new($s.into(), $span, $ctxt)
    }};
}

#[macro_export]
macro_rules! quote_str {
    ($s:expr) => {
        quote_str!($crate::swc_common::DUMMY_SP, $s)
    };
    ($span:expr, $s:expr) => {{
        $crate::swc_ecma_ast::Str {
            span: $span,
            raw: None,
            value: $s.into(),
        }
    }};
}

#[macro_export]
macro_rules! quote_expr {
    ($span:expr, null) => {{
        use $crate::swc_ecma_ast::*;
        Expr::Lit(Lit::Null(Null { span: $span }))
    }};

    ($span:expr, undefined) => {{
        box Expr::Ident(Ident::new("undefined", $span))
    }};
}

/// Creates a member expression.
///
/// # Usage
/// ```rust,ignore
/// member_expr!(span, Function.bind.apply);
/// ```
///
/// Returns Box<[Expr](swc_ecma_ast::Expr)>.
#[macro_export]
macro_rules! member_expr {
    ($span:expr, $first:ident) => {{
        use $crate::swc_ecma_ast::Expr;
        Box::new(Expr::Ident($crate::quote_ident!($crate::swc_common::SyntaxContext::empty(), $span, stringify!($first))))
    }};

    ($span:expr, $first:ident . $($rest:tt)+) => {{
        let obj = member_expr!($span, $first);

        member_expr!(@EXT, $span, obj, $($rest)* )
    }};

    (@EXT, $span:expr, $obj:expr, $first:ident . $($rest:tt)* ) => {{
        use $crate::swc_ecma_ast::MemberProp;
        let prop = MemberProp::Ident($crate::quote_ident!(Default::default(), $span, stringify!($first)));

        member_expr!(@EXT, $span, Box::new(Expr::Member(MemberExpr{
            span: $crate::swc_common::DUMMY_SP,
            obj: $obj,
            prop,
        })), $($rest)*)
    }};

    (@EXT, $span:expr, $obj:expr,  $first:ident) => {{
        use $crate::swc_ecma_ast::*;
        let prop = MemberProp::Ident($crate::quote_ident!(Default::default(), $span, stringify!($first)));

        MemberExpr{
            span: $crate::swc_common::DUMMY_SP,
            obj: $obj,
            prop,
        }
    }};
}

#[cfg(test)]
mod tests {
    use swc_common::DUMMY_SP as span;
    use swc_ecma_ast::*;

    use crate::drop_span;

    #[test]
    fn quote_member_expr() {
        let expr: Box<Expr> =
            drop_span(member_expr!(Default::default(), Function.prototype.bind)).into();

        assert_eq!(
            expr,
            Box::new(Expr::Member(MemberExpr {
                span,
                obj: Box::new(Expr::Member(MemberExpr {
                    span,
                    obj: member_expr!(span, Function),
                    prop: MemberProp::Ident(quote_ident!("prototype")),
                })),
                prop: MemberProp::Ident(quote_ident!("bind")),
            }))
        );
    }
}
