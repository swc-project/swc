#[macro_use]
mod grass_macros;

grass_test!(
    one_or_two,
    "a {\n  color: 1 or 2;\n}\n",
    "a {\n  color: 1;\n}\n"
);
grass_test!(
    two_or_one,
    "a {\n  color: 2 or 1;\n}\n",
    "a {\n  color: 2;\n}\n"
);
grass_test!(
    true_or_true,
    "a {\n  color: true or true;\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_test!(
    true_or_false,
    "a {\n  color: true or false;\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_test!(
    false_or_true,
    "a {\n  color: false or true;\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_test!(
    false_or_false,
    "a {\n  color: false or false;\n}\n",
    "a {\n  color: false;\n}\n"
);
grass_test!(
    null_or_one,
    "a {\n  color: null or 1;\n}\n",
    "a {\n  color: 1;\n}\n"
);
grass_test!(
    one_or_null,
    "a {\n  color: 1 or null;\n}\n",
    "a {\n  color: 1;\n}\n"
);
grass_test!(
    one_or_two_or_three,
    "a {\n  color: 1 or 2 or 3;\n}\n",
    "a {\n  color: 1;\n}\n"
);
grass_test!(
    part_of_binop,
    "a {\n  color: 1 - or;\n}\n",
    "a {\n  color: 1-or;\n}\n"
);
grass_test!(
    part_of_binop_casing,
    "a {\n  color: 1 - OR;\n}\n",
    "a {\n  color: 1-OR;\n}\n"
);
grass_test!(
    short_circuits_when_lhs_is_true,
    "a {\n  color: true or red % foo;\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_error!(
    does_not_short_circuit_when_lhs_is_false,
    "a {\n  color: false or red % foo;\n}\n",
    "Error: Undefined operation \"red % foo\"."
);
grass_test!(
    short_circuiting_in_comma_separated_list,
    "a {\n  color: true or red % foo, red;\n}\n",
    "a {\n  color: true, red;\n}\n"
);
grass_error!(
    properly_bubbles_error_when_invalid_char_after_or,
    "a {\n  color: true or? foo;\n}\n",
    "Error: expected \";\"."
);
