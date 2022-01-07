/// Not a public api.
#[doc(hidden)]
#[macro_export]
macro_rules! external_name {
    (apply_decorated_descriptor) => {
        Some("applyDecoratedDescriptor")
    };

    (array_like_to_array) => {
        Some("arrayLikeToArray")
    };

    (array_with_holes) => {
        Some("arrayWithHoles")
    };

    (array_without_holes) => {
        Some("arrayWithoutHoles")
    };

    (assert_this_initialized) => {
        Some("assertThisInitialized")
    };

    (async_generator) => {
        None
    };

    (async_generator_delegate) => {
        Some("asyncGeneratorDelegate")
    };

    (async_iterator) => {
        Some("asyncIterator")
    };

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
    ($field_name:ident, $s:tt) => {{
        helper_expr!(::swc_common::DUMMY_SP, $field_name, $s)
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
            Expr::Ident(swc_ecma_utils::quote_ident!(
                span,
                $crate::external_name!($s)
            ))
        } else {
            Expr::Ident(swc_ecma_utils::quote_ident!(span, concat!('_', $s)))
        }
    }};
}

/// Not a public api.
#[doc(hidden)]
#[macro_export]
macro_rules! helper {
    ($field_name:ident, $s:tt) => {{
        $crate::helper!(::swc_common::DUMMY_SP, $field_name, $s)
    }};

    ($span:expr, $field_name:ident, $s:tt) => {{
        use swc_ecma_utils::ExprFactory;
        $crate::helper_expr!($span, $field_name, $s).as_callee()
    }};
}
