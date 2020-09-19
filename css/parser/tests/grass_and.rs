#[macro_use]
mod grass_macros;

test!(
    one_and_two,
    "a {\n  color: 1 and 2;\n}\n",
    "a {\n  color: 2;\n}\n"
);
test!(
    two_and_one,
    "a {\n  color: 2 and 1;\n}\n",
    "a {\n  color: 1;\n}\n"
);
test!(
    true_and_true,
    "a {\n  color: true and true;\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    true_and_false,
    "a {\n  color: true and false;\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    false_and_true,
    "a {\n  color: false and true;\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    false_and_false,
    "a {\n  color: false and false;\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(null_and_one, "a {\n  color: null and 1;\n}\n", "");
test!(one_and_null, "a {\n  color: 1 and null;\n}\n", "");
test!(
    one_and_two_and_three,
    "a {\n  color: 1 and 2 and 3;\n}\n",
    "a {\n  color: 3;\n}\n"
);
test!(
    part_of_binop,
    "a {\n  color: 1 - and;\n}\n",
    "a {\n  color: 1-and;\n}\n"
);
test!(
    part_of_binop_casing,
    "a {\n  color: 1 - AND;\n}\n",
    "a {\n  color: 1-AND;\n}\n"
);
test!(
    short_circuits_when_lhs_is_false,
    "a {\n  color: false and comparable(\"a\", \"b\");\n}\n",
    "a {\n  color: false;\n}\n"
);
error!(
    #[ignore = "blocked on a rewrite of value eval"]
    properly_bubbles_error_when_invalid_char_after_and,
    "a {\n  color: false and? foo;\n}\n", "Error: expected \";\"."
);
