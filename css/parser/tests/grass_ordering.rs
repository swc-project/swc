#[macro_use]
mod grass_macros;

test!(
    two_greater_than_or_equal_one,
    "a {\n  color: 2 >= 1;\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    one_greater_than_or_equal_one,
    "a {\n  color: 1 >= 1;\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    zero_greater_than_or_equal_one,
    "a {\n  color: 0 >= 1;\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    two_greater_than_one,
    "a {\n  color: 2 > 1;\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    one_greater_than_one,
    "a {\n  color: 1 > 1;\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    zero_greater_than_one,
    "a {\n  color: 0 > 1;\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    two_less_than_or_equal_one,
    "a {\n  color: 2 <= 1;\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    one_less_than_or_equal_one,
    "a {\n  color: 1 <= 1;\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    zero_less_than_or_equal_one,
    "a {\n  color: 0 <= 1;\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    two_less_than_one,
    "a {\n  color: 2 < 1;\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    one_less_than_one,
    "a {\n  color: 1 < 1;\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    zero_less_than_one,
    "a {\n  color: 0 < 1;\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    ord_the_same_as_partial_ord,
    "a {\n  color: 2in > 1cm;\n}\n",
    "a {\n  color: true;\n}\n"
);
