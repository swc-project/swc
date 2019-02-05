//! Tests related to statements.
use super::Simplifier;

macro_rules! test_stmt {
    ($l:expr, $r:expr) => {
        test_transform!(
            ::swc_ecma_parser::Syntax::default(),
            |_| Simplifier { enable: true },
            $l,
            $r
        )
    };
    ($l:expr, $r:expr,) => {
        test_expr!($l, $r);
    };
}

// /// Should not modify expression.
// macro_rules! same_stmt {
//     ($l:expr) => {
//         test_stmt!($l, $l)
//     };
// }

/// Ensures that it is removed.
macro_rules! compiled_out {
    ($src:expr) => {
        test_stmt!($src, "")
    };
}

#[test]
fn usage() {
    test_stmt!("use(8+8);", "use(16);");
}

#[test]
fn compiled_out_simple() {
    compiled_out!(";");
    compiled_out!("8;");
    compiled_out!("8+8;");
}
