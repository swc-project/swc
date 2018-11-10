//! Tests related to statements.

macro_rules! test_stmt {
    ($l:expr, $r:expr) => {{
        crate::tests::Tester::run(|tester| {
            let expected = tester.apply_transform(::testing::DropSpan, "expected.js", $r);

            let actual = tester.apply_transform(crate::simplifier(), "actual.js", $l);
            let actual = ::testing::drop_span(actual);

            if actual == expected {
                return;
            }

            assert_eq!(tester.print(actual), tester.print(expected));
        });
    }};
    ($l:expr, $r:expr,) => {
        test_expr!($l, $r);
    };
}

/// Should not modify expression.
macro_rules! same_stmt {
    ($l:expr) => {{
        crate::tests::Tester::run(|tester| {
            let expected = tester.apply_transform(::testing::DropSpan, "expected.js", $l);

            let actual = tester.apply_transform(crate::simplifier(), "actual.js", $l);

            if actual == expected {
                return;
            }

            assert_eq!(tester.print(actual), tester.print(expected));
        });
    }};
}

/// Ensures that it is removed.
macro_rules! compiled_out {
    ($src:expr) => {
        crate::tests::Tester::run(|tester| {
            let expected = tester.apply_transform(::testing::DropSpan, "empty.js", "");

            let actual = tester.apply_transform(crate::simplifier(), "actual.js", $src);

            if actual == expected {
                return;
            }

            assert_eq!(tester.print(actual), tester.print(expected));
        });
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
