#[macro_use]
mod macros;

test!(
    subs_idents,
    "a {\n  color: foo - bar;\n}\n",
    "a {\n  color: foo-bar;\n}\n"
);
test!(
    subs_dbl_quoted_idents,
    "a {\n  color: \"foo\" - \"bar\";\n}\n",
    "a {\n  color: \"foo\"-\"bar\";\n}\n"
);
test!(
    subs_sgl_quoted_idents,
    "a {\n  color: 'foo' - 'bar';\n}\n",
    "a {\n  color: \"foo\"-\"bar\";\n}\n"
);
test!(
    subs_dbl_and_un_quoted_idents,
    "a {\n  color: \"foo\" - bar;\n}\n",
    "a {\n  color: \"foo\"-bar;\n}\n"
);
test!(
    subs_sgl_and_un_quoted_idents,
    "a {\n  color: 'foo' - bar;\n}\n",
    "a {\n  color: \"foo\"-bar;\n}\n"
);
test!(
    subs_un_and_dbl_quoted_idents,
    "a {\n  color: foo - \"bar\";\n}\n",
    "a {\n  color: foo-\"bar\";\n}\n"
);
test!(
    subs_un_and_sgl_quoted_idents,
    "a {\n  color: foo - 'bar';\n}\n",
    "a {\n  color: foo-\"bar\";\n}\n"
);
test!(
    subs_sgl_and_dbl_quoted_idents,
    "a {\n  color: 'foo' - \"bar\";\n}\n",
    "a {\n  color: \"foo\"-\"bar\";\n}\n"
);
test!(
    subs_dbl_and_sgl_quoted_idents,
    "a {\n  color: \"foo\" - 'bar';\n}\n",
    "a {\n  color: \"foo\"-\"bar\";\n}\n"
);
test!(
    subs_ident_true,
    "a {\n  color: foo - true;\n}\n",
    "a {\n  color: foo-true;\n}\n"
);
test!(
    subs_dbl_quoted_ident_true,
    "a {\n  color: \"foo\" - true;\n}\n",
    "a {\n  color: \"foo\"-true;\n}\n"
);
test!(
    subs_ident_false,
    "a {\n  color: foo - false;\n}\n",
    "a {\n  color: foo-false;\n}\n"
);
test!(
    subs_dbl_quoted_ident_false,
    "a {\n  color: \"foo\" - false;\n}\n",
    "a {\n  color: \"foo\"-false;\n}\n"
);
test!(
    subs_ident_important,
    "a {\n  color: foo - !important;\n}\n",
    "a {\n  color: foo-!important;\n}\n"
);
test!(
    subs_ident_null,
    "a {\n  color: foo - null;\n}\n",
    "a {\n  color: foo-;\n}\n"
);
test!(
    subs_dbl_quoted_ident_null,
    "a {\n  color: \"foo\" - null;\n}\n",
    "a {\n  color: \"foo\"-;\n}\n"
);
test!(
    subs_sgl_quoted_ident_null,
    "a {\n  color: 'foo' - null;\n}\n",
    "a {\n  color: \"foo\"-;\n}\n"
);
test!(
    subs_ident_number,
    "a {\n  color: foo - 1;\n}\n",
    "a {\n  color: foo-1;\n}\n"
);
test!(
    subs_dbl_quoted_ident_number,
    "a {\n  color: \"foo\" - 1;\n}\n",
    "a {\n  color: \"foo\"-1;\n}\n"
);
test!(
    subs_sgl_quoted_ident_number,
    "a {\n  color: 'foo' - 1;\n}\n",
    "a {\n  color: \"foo\"-1;\n}\n"
);
test!(
    subs_ident_dimension,
    "a {\n  color: foo - 1px;\n}\n",
    "a {\n  color: foo-1px;\n}\n"
);
test!(
    num_minus_list,
    "a {\n  color: 1 - (2 3);\n}\n",
    "a {\n  color: 1-2 3;\n}\n"
);
test!(
    list_minus_num,
    "a {\n  color: (1 2) - 3;\n}\n",
    "a {\n  color: 1 2-3;\n}\n"
);
test!(
    dblquoted_minus_list,
    "a {\n  color: \"1\" - (2 3);\n}\n",
    "a {\n  color: \"1\"-2 3;\n}\n"
);
test!(
    list_minus_dblquoted,
    "a {\n  color: (1 2) - \"3\";\n}\n",
    "a {\n  color: 1 2-\"3\";\n}\n"
);
test!(
    sglquoted_minus_list,
    "a {\n  color: 'a' - (b c);\n}\n",
    "a {\n  color: \"a\"-b c;\n}\n"
);
test!(
    list_minus_sglquoted,
    "a {\n  color: (b c) - 'a';\n}\n",
    "a {\n  color: b c-\"a\";\n}\n"
);
test!(
    list_minus_list,
    "a {\n  color: (a b) - (1 2);\n}\n",
    "a {\n  color: a b-1 2;\n}\n"
);
test!(
    subs_dbl_quoted_ident_dimension,
    "a {\n  color: \"foo\" - 1px;\n}\n",
    "a {\n  color: \"foo\"-1px;\n}\n"
);
test!(
    subs_sgl_quoted_ident_dimension,
    "a {\n  color: 'foo' - 1px;\n}\n",
    "a {\n  color: \"foo\"-1px;\n}\n"
);
test!(
    number_minus_unquoted_ident,
    "a {\n  color: 1 - foo;\n}\n",
    "a {\n  color: 1-foo;\n}\n"
);
test!(
    number_minus_sglquoted_ident,
    "a {\n  color: 1 - 'foo';\n}\n",
    "a {\n  color: 1-\"foo\";\n}\n"
);
test!(
    number_minus_dblquoted_ident,
    "a {\n  color: 1 - \"foo\";\n}\n",
    "a {\n  color: 1-\"foo\";\n}\n"
);
test!(
    number_minus_minus_number,
    "a {\n  color: 1 - - 2;\n}\n",
    "a {\n  color: 3;\n}\n"
);
test!(
    sub_no_space,
    "a {\n  color: 10-10;\n}\n",
    "a {\n  color: 0;\n}\n"
);
test!(
    sub_space_on_left,
    "a {\n  color: 10 -10;\n}\n",
    "a {\n  color: 10 -10;\n}\n"
);
test!(
    sub_space_on_right,
    "a {\n  color: 10- 10;\n}\n",
    "a {\n  color: 0;\n}\n"
);
test!(
    sub_space_on_both,
    "a {\n  color: 10 - 10;\n}\n",
    "a {\n  color: 0;\n}\n"
);
test!(
    sub_no_space_interpolation,
    "a {\n  color: 10-#{10};\n}\n",
    "a {\n  color: 10 -10;\n}\n"
);
test!(
    plus_after_minus,
    "a {\n  plus-after-minus: 1 - + 2;\n}\n",
    "a {\n  plus-after-minus: -1;\n}\n"
);
test!(
    multiline_comments_between_operands,
    "a {\n  color: 1/**/-/**/1;\n}\n",
    "a {\n  color: 0;\n}\n"
);
test!(
    no_space_after_first_unit_and_second_float,
    "a {\n  color: 1em- 0.0em;\n}\n",
    "a {\n  color: 1em- 0em;\n}\n"
);
test!(
    null_minus_number,
    "a {\n  color: null - 1;\n}\n",
    "a {\n  color: -1;\n}\n"
);
test!(
    null_minus_unquoted_string,
    "a {\n  color: null - foo;\n}\n",
    "a {\n  color: -foo;\n}\n"
);
test!(
    number_minus_true,
    "a {\n  color: 1 - true;\n}\n",
    "a {\n  color: 1-true;\n}\n"
);
test!(
    number_minus_false,
    "a {\n  color: 1 - false;\n}\n",
    "a {\n  color: 1-false;\n}\n"
);
test!(
    number_minus_important,
    "a {\n  color: 1 - !important;\n}\n",
    "a {\n  color: 1-!important;\n}\n"
);
test!(
    number_minus_null,
    "a {\n  color: 1 - null;\n}\n",
    "a {\n  color: 1-;\n}\n"
);
test!(
    number_minus_arglist,
    "@function foo($a...) {
        @return 1 - $a;
    }

    a {
        color: foo(a, b);
    }",
    "a {\n  color: 1-a, b;\n}\n"
);
test!(
    color_minus_unquoted,
    "a {\n  color: red - foo;\n}\n",
    "a {\n  color: red-foo;\n}\n"
);
test!(
    color_minus_dblquoted,
    "a {\n  color: red - \"foo\";\n}\n",
    "a {\n  color: red-\"foo\";\n}\n"
);
test!(
    color_minus_sglquoted,
    "a {\n  color: red - 'foo';\n}\n",
    "a {\n  color: red-\"foo\";\n}\n"
);
test!(
    color_minus_important,
    "a {\n  color: red - !important;\n}\n",
    "a {\n  color: red-!important;\n}\n"
);
test!(
    color_minus_null,
    "a {\n  color: red - null;\n}\n",
    "a {\n  color: red-;\n}\n"
);
test!(
    ident_minus_color,
    "a {\n  color: foo - red;\n}\n",
    "a {\n  color: foo-red;\n}\n"
);
test!(
    sub_nan_left,
    "a {\n  left:0/0-0;\n}\n",
    "a {\n  left: NaN;\n}\n"
);
test!(
    sub_nan_right,
    "a {\n  left:0-0/0;\n}\n",
    "a {\n  left: NaN;\n}\n"
);
error!(
    number_minus_color,
    "a {\n  color: 1 - #abc;\n}\n", "Error: Undefined operation \"1 - #abc\"."
);
error!(
    number_minus_hex_color_no_space,
    "a {\n  color: 1-#abc;\n}\n", "Error: Undefined operation \"1 - #abc\"."
);
error!(
    null_minus_function,
    "a {\n  color: null - get-function(lighten);\n}\n",
    "Error: get-function(\"lighten\") isn't a valid CSS value."
);
error!(
    map_lhs_sub,
    "a {color: (a: b) - 1;}", "Error: (a: b) isn't a valid CSS value."
);
error!(
    map_rhs_sub,
    "a {color: 1 - (a: b);}", "Error: (a: b) isn't a valid CSS value."
);
error!(
    function_lhs_sub,
    "a {color: get-function(lighten) - 1;}",
    "Error: get-function(\"lighten\") isn't a valid CSS value."
);
error!(
    function_rhs_sub,
    "a {color: 1 - get-function(lighten);}",
    "Error: get-function(\"lighten\") isn't a valid CSS value."
);
