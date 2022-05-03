/// Not a public api.
#[doc(hidden)]
#[macro_export]
macro_rules! external_name {
    ("typeof") => {
        "typeOf"
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

/// Not a public api.
#[doc(hidden)]
#[macro_export]
macro_rules! helper_expr {
    (ts, $field_name:ident, $s:tt) => {{
        $crate::helper_expr!(ts, ::swc_common::DUMMY_SP, $field_name, $s)
    }};

    (ts, $span:expr, $field_name:ident, $s:tt) => {{
        use swc_ecma_utils::{quote_ident, ExprFactory};

        debug_assert!(
            $s.starts_with("__"),
            "ts helper! macro should be invoked with '__' prefix"
        );
        let mark = $crate::enable_helper!($field_name);
        let span = $span.apply_mark(mark);
        let external = $crate::helpers::HELPERS.with(|helper| helper.external());

        if external {
            swc_ecma_utils::quote_ident!(span, "swcHelpers").make_member(
                swc_ecma_utils::quote_ident!($span, $crate::external_name!($s)),
            )
        } else {
            Expr::from(swc_ecma_utils::quote_ident!(span, $s))
        }
    }};

    ($field_name:ident, $s:tt) => {{
        $crate::helper_expr!(::swc_common::DUMMY_SP, $field_name, $s)
    }};

    ($span:expr, $field_name:ident, $s:tt) => {{
        use swc_ecma_utils::{quote_ident, ExprFactory};

        debug_assert!(
            !$s.starts_with("_"),
            "helper! macro should not invoked with '_' prefix"
        );
        let mark = $crate::enable_helper!($field_name);
        let span = $span.apply_mark(mark);
        let external = $crate::helpers::HELPERS.with(|helper| helper.external());

        if external {
            swc_ecma_utils::quote_ident!(span, "swcHelpers").make_member(
                swc_ecma_utils::quote_ident!($span, $crate::external_name!($s)),
            )
        } else {
            Expr::from(swc_ecma_utils::quote_ident!(span, concat!('_', $s)))
        }
    }};
}

/// Not a public api.
#[doc(hidden)]
#[macro_export]
macro_rules! helper {
    ($($t:tt)*) => {{
        use swc_ecma_utils::ExprFactory;
        $crate::helper_expr!($($t)*).as_callee()
    }};
}
