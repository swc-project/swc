/// Shortcut for `quote_ident!(span.apply_mark(Mark::fresh(Mark::root())), s)`
macro_rules! private_ident {
    ($s:expr) => {
        private_ident!(::swc_common::DUMMY_SP, $s)
    };
    ($span:expr, $s:expr) => {{
        use swc_common::Mark;
        let mark = Mark::fresh(Mark::root());
        let span = $span.apply_mark(mark);
        ::ast::Ident::new($s.into(), span)
    }};
}

macro_rules! external_name {
    ("typeof") => {
        "_typeof"
    };
    ("instanceof") => {
        "_instanceof"
    };
    ("throw") => {
        "_throw"
    };
    ($s:literal) => {
        $s
    };
}

macro_rules! helper {
    ($field_name:ident, $s:tt) => {{
        helper!(::swc_common::DUMMY_SP, $field_name, $s)
    }};

    ($span:expr, $field_name:ident, $s:tt) => {{
        debug_assert!(
            !$s.starts_with("_"),
            "helper! macro should not invoked with '_' prefix"
        );
        let mark = enable_helper!($field_name);
        let span = $span.apply_mark(mark);
        let external = crate::helpers::HELPERS.with(|helper| helper.external());

        if external {
            quote_ident!(span, "swcHelpers")
                .member(quote_ident!($span, external_name!($s)))
                .as_callee()
        } else {
            quote_ident!(span, concat!('_', $s)).as_callee()
        }
    }};
}

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

    (@EXT, $span:expr, $obj:expr, $first:ident . $($rest:tt)* ) => {{
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
        let expr: Box<Expr> = member_expr!(span, Function.prototype.bind);

        assert_eq_ignore_span!(
            expr,
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
