#[macro_export]
macro_rules! quote_ident {
    ($s:expr) => {
        quote_ident!(::swc_common::DUMMY_SP, $s)
    };
    ($span:expr, $s:expr) => {{
        ::ast::Ident::new($s.into(), $span)
    }};
}

#[macro_export]
macro_rules! quote_str {
    ($s:expr) => {
        quote_str!(::swc_common::DUMMY_SP, $s)
    };
    ($span:expr, $s:expr) => {{
        ::ast::Str {
            span: $span,
            value: $s.into(),
            has_escape: false,
        }
    }};
}

/// Mark span as `processed` to prevent the emitter from deoptimizing
#[macro_export]
macro_rules! mark {
    ($span:expr) => {{
        let mut span = $span;
        let parent = span.remove_mark();
        $span.apply_mark(::swc_common::hygiene::Mark::fresh(parent))
    }};
}

#[macro_export]
macro_rules! quote_expr {
    ($span:expr, null) => {{
        use ast::*;
        Expr::Lit(Lit::Null(Null { span: $span }))
    }};

    ($span:expr, undefined) => {{
        box Expr::Ident(Ident::new(js_word!("undefined"), $span))
    }};
}

/// Creates a member expression.
///
/// # Usage
/// ```rust,ignore
/// member_expr!(span, Function.bind.apply);
/// ```
///
/// Returns Box<Expr>
#[macro_export]
macro_rules! member_expr {
    ($span:expr, $first:ident) => {{
        use ast::Expr;
        box Expr::Ident(quote_ident!($span, stringify!($first)))
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
        use ast::*;
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
    use ast::*;
    use swc_common::DUMMY_SP as span;
    #[test]
    fn quote_member_expr() {
        assert_eq_ignore_span!(
            member_expr!(span, Function.prototype.bind),
            box Expr::Member(MemberExpr {
                span,
                obj: ExprOrSuper::Expr(box Expr::Member(MemberExpr {
                    span,
                    obj: ExprOrSuper::Expr(member_expr!(span, Function)),
                    computed: false,
                    prop: member_expr!(span, prototype),
                })),
                computed: false,
                prop: member_expr!(span, bind),
            })
        );
    }
}
