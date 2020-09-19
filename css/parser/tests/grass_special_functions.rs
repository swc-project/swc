#[macro_use]
mod grass_macros;

test!(
    calc_whitespace,
    "a {\n  color: calc(       1      );\n}\n",
    "a {\n  color: calc( 1 );\n}\n"
);
test!(
    calc_newline,
    "a {\n  color: calc(\n);\n}\n",
    "a {\n  color: calc( );\n}\n"
);
test!(
    calc_multiple_args,
    "a {\n  color: calc(1, 2, a, b, c);\n}\n"
);
test!(
    calc_does_not_evaluate_arithmetic,
    "a {\n  color: calc(1 + 2);\n}\n"
);
test!(
    calc_evaluates_interpolated_arithmetic,
    "a {\n  color: calc(#{1 + 2});\n}\n",
    "a {\n  color: calc(3);\n}\n"
);
test!(calc_retains_silent_comment, "a {\n  color: calc(//);\n}\n");
test!(
    calc_retains_multiline_comment,
    "a {\n  color: calc(/**/);\n}\n"
);
test!(calc_nested_parens, "a {\n  color: calc((((()))));\n}\n");
test!(
    calc_invalid_arithmetic,
    "a {\n  color: calc(2px + 2px + 5%);\n}\n"
);
test!(
    calc_uppercase,
    "a {\n  color: CALC(1 + 1);\n}\n",
    "a {\n  color: calc(1 + 1);\n}\n"
);
test!(
    calc_mixed_casing,
    "a {\n  color: cAlC(1 + 1);\n}\n",
    "a {\n  color: calc(1 + 1);\n}\n"
);
test!(
    calc_browser_prefixed,
    "a {\n  color: -webkit-calc(1 + 2);\n}\n",
    "a {\n  color: -webkit-calc(1 + 2);\n}\n"
);
test!(
    calc_quoted_string,
    r#"a { color: calc("\ "); }"#,
    "a {\n  color: calc(\" \");\n}\n"
);
test!(
    calc_quoted_string_single_quoted_paren,
    "a {\n  color: calc(\")\");\n}\n",
    "a {\n  color: calc(\")\");\n}\n"
);
test!(
    calc_quoted_string_single_quotes,
    "a {\n  color: calc('a');\n}\n",
    "a {\n  color: calc(\"a\");\n}\n"
);
test!(
    calc_hash_no_interpolation,
    "a {\n  color: calc(#);\n}\n",
    "a {\n  color: calc(#);\n}\n"
);
test!(
    element_whitespace,
    "a {\n  color: element(       1      );\n}\n",
    "a {\n  color: element( 1 );\n}\n"
);
test!(
    element_newline,
    "a {\n  color: element(\n);\n}\n",
    "a {\n  color: element( );\n}\n"
);
test!(
    element_multiple_args,
    "a {\n  color: element(1, 2, a, b, c);\n}\n"
);
test!(
    element_does_not_evaluate_arithmetic,
    "a {\n  color: element(1 + 2);\n}\n"
);
test!(
    element_evaluates_interpolated_arithmetic,
    "a {\n  color: element(#{1 + 2});\n}\n",
    "a {\n  color: element(3);\n}\n"
);
test!(
    element_retains_silent_comment,
    "a {\n  color: element(//);\n}\n"
);
test!(
    element_retains_multiline_comment,
    "a {\n  color: element(/**/);\n}\n"
);
test!(
    element_nested_parens,
    "a {\n  color: element((((()))));\n}\n"
);
test!(
    element_browser_prefixed,
    "a {\n  color: -webkit-element(1 + 2);\n}\n",
    "a {\n  color: -webkit-element(1 + 2);\n}\n"
);
test!(
    expression_whitespace,
    "a {\n  color: expression(       1      );\n}\n",
    "a {\n  color: expression( 1 );\n}\n"
);
test!(
    expression_newline,
    "a {\n  color: expression(\n);\n}\n",
    "a {\n  color: expression( );\n}\n"
);
test!(
    expression_multiple_args,
    "a {\n  color: expression(1, 2, a, b, c);\n}\n"
);
test!(
    expression_does_not_evaluate_arithmetic,
    "a {\n  color: expression(1 + 2);\n}\n"
);
test!(
    expression_evaluates_interpolated_arithmetic,
    "a {\n  color: expression(#{1 + 2});\n}\n",
    "a {\n  color: expression(3);\n}\n"
);
test!(
    expression_retains_silent_comment,
    "a {\n  color: expression(//);\n}\n"
);
test!(
    expression_retains_multiline_comment,
    "a {\n  color: expression(/**/);\n}\n"
);
test!(
    expression_nested_parens,
    "a {\n  color: expression((((()))));\n}\n"
);
test!(
    expression_browser_prefixed,
    "a {\n  color: -webkit-expression(1 + 2);\n}\n",
    "a {\n  color: -webkit-expression(1 + 2);\n}\n"
);
test!(
    progid_whitespace,
    "a {\n  color: progid:(       1      );\n}\n",
    "a {\n  color: progid:( 1 );\n}\n"
);
test!(
    progid_newline,
    "a {\n  color: progid:(\n);\n}\n",
    "a {\n  color: progid:( );\n}\n"
);
test!(
    progid_multiple_args,
    "a {\n  color: progid:(1, 2, a, b, c);\n}\n"
);
test!(
    progid_does_not_evaluate_arithmetic,
    "a {\n  color: progid:(1 + 2);\n}\n"
);
test!(
    progid_evaluates_interpolated_arithmetic,
    "a {\n  color: progid:(#{1 + 2});\n}\n",
    "a {\n  color: progid:(3);\n}\n"
);
test!(
    progid_retains_silent_comment,
    "a {\n  color: progid:(//);\n}\n"
);
test!(
    progid_retains_multiline_comment,
    "a {\n  color: progid:(/**/);\n}\n"
);
test!(
    progid_nested_parens,
    "a {\n  color: progid:((((()))));\n}\n"
);
test!(
    progid_values_after_colon,
    "a {\n  color: progid:apple.bottoM..jeans.boots();\n}\n"
);
error!(
    progid_number_after_colon,
    "a {\n  color: progid:ap1ple.bottoM..jeans.boots();\n}\n", "Error: expected \"(\"."
);
test!(
    progid_uppercase,
    "a {\n  color: PROGID:foo(fff);\n}\n",
    "a {\n  color: progid:foo(fff);\n}\n"
);
test!(
    progid_mixed_casing,
    "a {\n  color: PrOgId:foo(fff);\n}\n",
    "a {\n  color: progid:foo(fff);\n}\n"
);
error!(
    progid_nothing_after,
    "a { color: progid:", "Error: expected \"(\"."
);
