#[macro_use]
mod macros;

test!(
    none_div_none,
    "a {\n  color: (35 / 7);\n}\n",
    "a {\n  color: 5;\n}\n"
);
test!(
    unit_div_none,
    "a {\n  color: (35% / 7);\n}\n",
    "a {\n  color: 5%;\n}\n"
);
test!(
    unit_div_unit,
    "a {\n  color: (35% / 7%);\n}\n",
    "a {\n  color: 5;\n}\n"
);
test!(
    unit_conversion,
    "a {\n  color: (35px / 7in);\n}\n",
    "a {\n  color: 0.0520833333;\n}\n"
);
test!(
    slash_after_comma,
    "a {\n  slash-after-comma: (1, / 2);\n}\n",
    "a {\n  slash-after-comma: 1, /2;\n}\n"
);
test!(
    num_div_space_list,
    "a {\n  color: 1 / (a b);\n}\n",
    "a {\n  color: 1/a b;\n}\n"
);
test!(
    num_div_comma_list,
    "a {\n  color: 1 / (a, b);\n}\n",
    "a {\n  color: 1/a, b;\n}\n"
);
test!(
    num_div_true,
    "a {\n  color: 1 / true;\n}\n",
    "a {\n  color: 1/true;\n}\n"
);
test!(
    num_div_false,
    "a {\n  color: 1 / false;\n}\n",
    "a {\n  color: 1/false;\n}\n"
);
test!(
    num_div_important,
    "a {\n  color: 1 / !important;\n}\n",
    "a {\n  color: 1/!important;\n}\n"
);
test!(
    num_div_null,
    "a {\n  color: 1 / null;\n}\n",
    "a {\n  color: 1/;\n}\n"
);
test!(
    num_div_named_color,
    "a {\n  color: 1 / red;\n}\n",
    "a {\n  color: 1/red;\n}\n"
);
test!(
    dblquoted_string_div_space_separated_list,
    "a {\n  color: \"foo\"/(a b);\n}\n",
    "a {\n  color: \"foo\"/a b;\n}\n"
);
test!(
    null_div_number,
    "a {\n  color: null / 1;\n}\n",
    "a {\n  color: /1;\n}\n"
);
test!(
    null_div_dblquoted_string,
    "a {\n  color: null / \"foo\";\n}\n",
    "a {\n  color: /\"foo\";\n}\n"
);
test!(
    number_div_arglist,
    "@function foo($a...) {
        @return 1 / $a;
    }

    a {
        color: foo(a, b);
    }",
    "a {\n  color: 1/a, b;\n}\n"
);
test!(
    string_div_arglist,
    "@function foo($a...) {
        @return foo / $a;
    }

    a {
        color: foo(a, b);
    }",
    "a {\n  color: foo/a, b;\n}\n"
);
error!(
    string_div_map,
    "a {\n  color: foo / (a: b);\n}\n", "Error: (a: b) isn't a valid CSS value."
);
error!(
    string_div_function,
    "a {\n  color: foo / get-function(lighten);\n}\n",
    "Error: get-function(\"lighten\") isn't a valid CSS value."
);
error!(
    num_div_map,
    "a {\n  color: 1 / (a: b);\n}\n", "Error: (a: b) isn't a valid CSS value."
);
error!(
    num_div_function,
    "a {\n  color: 1 / get-function(lighten);\n}\n",
    "Error: get-function(\"lighten\") isn't a valid CSS value."
);
test!(
    does_not_eval_plain,
    "a {\n  color: 1 / 2;\n}\n",
    "a {\n  color: 1/2;\n}\n"
);
test!(
    does_eval_inside_parens,
    "a {\n  color: (1/2);\n}\n",
    "a {\n  color: 0.5;\n}\n"
);
test!(
    does_eval_when_one_is_calculated,
    "a {\n  color: (1*1) / 2;\n}\n",
    "a {\n  color: 0.5;\n}\n"
);
test!(
    does_not_eval_from_unary_minus,
    "a {\n  color: -1 / 2;\n}\n",
    "a {\n  color: -1/2;\n}\n"
);
test!(
    does_eval_from_variable,
    "$a: 1;\na {\n  color: $a / 2;\n}\n",
    "a {\n  color: 0.5;\n}\n"
);
test!(
    does_eval_single_number_in_parens,
    "a {\n  color: (1) / 2;\n}\n",
    "a {\n  color: 0.5;\n}\n"
);
test!(
    does_eval_function_call,
    "@function foo() {
        @return 1;
    }
    
    a {
        color: foo() / 2;
    }",
    "a {\n  color: 0.5;\n}\n"
);
test!(
    does_not_eval_chained_binop_division,
    "a {\n  color: 1 / 3 / 4;\n}\n",
    "a {\n  color: 1/3/4;\n}\n"
);
test!(
    does_not_eval_chained_binop_one_not_division,
    "a {\n  color: 1 + 3 / 4;\n}\n",
    "a {\n  color: 1.75;\n}\n"
);
test!(
    zero_div_zero_is_nan,
    "a {\n  color: (0 / 0);\n}\n",
    "a {\n  color: NaN;\n}\n"
);
