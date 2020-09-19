#[macro_use]
mod grass_macros;

grass_test!(
    single_quote,
    "a {\n  color: 'foo';\n}\n",
    "a {\n  color: \"foo\";\n}\n"
);
grass_test!(double_quote, "a {\n  color: \"foo\";\n}\n");
grass_test!(comma_list_ident, "a {\n  color: foo, bar, baz;\n}\n");
grass_test!(space_list_ident, "a {\n  color: foo bar baz;\n}\n");
grass_test!(comma_list_number, "a {\n  color: 1, 2, 3;\n}\n");
grass_test!(space_list_number, "a {\n  color: 1 2 3;\n}\n");
grass_test!(comma_space_list_number, "a {\n  color: 1 1, 2 2, 3 3;\n}\n");
grass_test!(preserves_keyword_true, "a {\n  color: true;\n}\n");
grass_test!(preserves_keyword_false, "a {\n  color: false;\n}\n");
grass_test!(
    does_not_preserve_keyword_null,
    "a {\n  color: null;\n}\n",
    ""
);
grass_test!(preserves_keyword_auto, "a {\n  color: auto;\n}\n");
grass_test!(preserves_keyword_initial, "a {\n  color: initial;\n}\n");
grass_test!(preserves_keyword_infinity, "a {\n  color: infinity;\n}\n");
grass_error!(
    keyword_not_expects_expression,
    "a {\n  color: not;\n}\n",
    "Error: Expected expression."
);
grass_test!(preserves_keyword_and, "a {\n  color: and;\n}\n");
grass_test!(preserves_keyword_or, "a {\n  color: or;\n}\n");
grass_test!(preserves_keyword_unset, "a {\n  color: unset;\n}\n");
grass_test!(preserves_keyword_nan, "a {\n  color: NaN;\n}\n");
grass_test!(preserves_keyword_from, "a {\n  color: FRoM;\n}\n");
grass_test!(preserves_keyword_to, "a {\n  color: To;\n}\n");
grass_test!(preserves_keyword_through, "a {\n  color: ThRouGh;\n}\n");
grass_test!(
    preserves_quotes,
    "a {\n  color: \"'foo' \\\"bar\\\"\";\n}\n"
);
grass_test!(
    whitespace_space_list_number,
    "a {\n  color:  1  2  3  ;\n}\n",
    "a {\n  color: 1 2 3;\n}\n"
);
grass_test!(
    whitespace_comma_list_number,
    "a {\n  color:  1 ,  2 ,  3  ;\n}\n",
    "a {\n  color: 1, 2, 3;\n}\n"
);
grass_test!(number, "a {\n  color: 1;\n}\n");
grass_test!(
    removes_paren_around_single_value,
    "a {\n  color: (foo);\n}\n",
    "a {\n  color: foo;\n}\n"
);
grass_test!(
    undefined_function_call_is_ident,
    "a {\n  color: foo();\n}\n"
);
grass_test!(hash_identifier_is_not_color, "a {\n  color: #foo;\n}\n");
grass_test!(
    hash_identifier_is_string,
    "a {\n  color: type-of(#foo);\n}\n",
    "a {\n  color: string;\n}\n"
);
grass_test!(
    adjacent_strings_get_spaced,
    "a {\n  color: \"f\"foo;\n}\n",
    "a {\n  color: \"f\" foo;\n}\n"
);
grass_test!(
    many_parens,
    "a {\n  color: (((((red)))));\n}\n",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    negative_number_times_number,
    "a {\n  color: -1 * 2;\n}\n",
    "a {\n  color: -2;\n}\n"
);
grass_error!(
    value_missing_closing_paren,
    "a {\n  color: (red;\n}\n",
    "Error: expected \")\"."
);
