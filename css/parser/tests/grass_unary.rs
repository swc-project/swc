#[macro_use]
mod grass_macros;

test!(unary_pos_unquoted_ident, "a {\n  color: +foo;\n}\n");
test!(
    unary_pos_whitespace,
    "a {\n  color: +     foo;\n}\n",
    "a {\n  color: +foo;\n}\n"
);
test!(unary_pos_dblquoted_ident, "a {\n  color: +\"foo\";\n}\n");
test!(
    unary_pos_sglquoted_ident,
    "a {\n  color: +'foo';\n}\n",
    "a {\n  color: +\"foo\";\n}\n"
);
test!(unary_pos_color, "a {\n  color: +\"foo\";\n}\n");
test!(
    unary_pos_number_unit,
    "a {\n  color: +1px;\n}\n",
    "a {\n  color: 1px;\n}\n"
);
test!(
    unary_pos_number,
    "a {\n  color: +10;\n}\n",
    "a {\n  color: 10;\n}\n"
);
test!(
    unary_pos_in_list,
    "a {\n  color: bar,+ \"bar\" - foo;\n}\n",
    "a {\n  color: bar, +\"bar\"-foo;\n}\n"
);
test!(unary_neg_unquoted_ident, "a {\n  color: -foo;\n}\n");
test!(unary_neg_dblquoted_ident, "a {\n  color: -\"foo\";\n}\n");
test!(
    unary_neg_sglquoted_ident,
    "a {\n  color: -'foo';\n}\n",
    "a {\n  color: -\"foo\";\n}\n"
);
test!(unary_neg_color, "a {\n  color: -\"foo\";\n}\n");
test!(unary_neg_number, "a {\n  color: -1px;\n}\n");
test!(
    unary_neg_whitespace,
    "a {\n  color: - 1px;\n}\n",
    "a {\n  color: -1px;\n}\n"
);
test!(
    unary_neg_number_type,
    "a {\n  color: type-of(- 1px);\n}\n",
    "a {\n  color: number;\n}\n"
);
test!(
    unary_neg_variable,
    "$a: 1;\n\na {\n  color: -$a;\n}\n",
    "a {\n  color: -1;\n}\n"
);
test!(
    unary_neg_null_paren,
    "a {\n  color: -(null);\n}\n",
    "a {\n  color: -;\n}\n"
);
test!(negative_null_as_ident, "a {\n  color: -null;\n}\n");
