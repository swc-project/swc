#[macro_export]
macro_rules! quote_ident {
    ($span:expr, $s:expr) => {{
        ::swc_ecma_ast::Ident::new($s.into(), $span)
    }};
}

#[macro_export]
macro_rules! expr {
    ($span:expr, null) => {{
        use swc_ecma_ast::*;
        Expr::Lit(Lit::Null(Null { span: $span }))
    }};

    ($span:expr, undefined) => {{
        box Expr::Ident(Ident::new(js_word!("undefined"), $span))
    }};
}

/// Returns Box<Expr>
macro_rules! member_expr {
    ($span:expr, $first:ident) => {{
        use swc_ecma_ast::*;
        box Expr::Ident(Ident::new(stringify!($first).into(), $span))
    }};

    ($span:expr, $first:ident . $($rest:tt)+) => {{
        let obj = member_expr!($span, $first);

        member_expr!(@EXT, $span, obj, $($rest)* )
    }};

    (@EXT, $span:expr, $obj:expr,  $first:ident . $($rest:tt)* ) => {{
        let prop = member_expr!($span, $first);

        member_expr!(@EXT, $span, box Expr::Member(MemberExpr{
            span: $span,
            obj: ExprOrSuper::Expr($obj),
            computed: false,
            prop,
        }), $($rest)*)
    }};

    (@EXT, $span:expr, $obj:expr,  $first:ident) => {{
        use swc_ecma_ast::*;
        let prop = member_expr!($span, $first);

        box Expr::Member(MemberExpr{
            span: $span,
            obj: ExprOrSuper::Expr($obj),
            computed: false,
            prop,
        })
    }};
}

#[cfg(test)]
mod tests {
    use super::*;
    use swc_common::DUMMY_SP as span;
    #[test]
    fn quote_member_expr() {
        assert_eq_ignore_span!(
            member_expr!(span, Function.prototype.bind),
            MemberExpr {
                obj: ExprOrSuper::Expr(MemberExpr {
                    obj: member_expr!(span, Function),
                    computed: false,
                    prop: member_expr!(span, prototype),
                }),
                computed: false,
                prop: member_expr!(span, bind),
            }
        );
    }
}
