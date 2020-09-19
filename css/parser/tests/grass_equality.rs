#[macro_use]
mod macros;

test!(
    color_equals_color,
    "a {\n  color: red == red;\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    color_does_not_equal_color,
    "a {\n  color: red != red;\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    unquoted_ident_eq_unquoted_ident,
    "a {\n  color: foo == foo;\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    dblquoted_ident_eq_unquoted_ident,
    "a {\n  color: \"foo\" == foo;\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    dblquoted_ident_eq_sglquoted_ident,
    "a {\n  color: \"foo\" == 'foo';\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    dblquoted_eq_number,
    "a {\n  color: \"foo\" == 1;\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    uncomparable_units,
    "a {\n  color: 1rem==1px;\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    first_unit_none,
    "a {\n  color: 1==1px;\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    second_unit_none,
    "a {\n  color: 1rem==1;\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    different_quoting_inside_list_eq,
    "a {\n  color: (\"foo\",) == (foo,);\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    different_quoting_inside_list_ne,
    "a {\n  color: (\"foo\",) != (foo,);\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    map_keys_equivalent,
    "a {\n  color: (0mm: a)==(0cm: a);\n}\n",
    "a {\n  color: true;\n}\n"
);
