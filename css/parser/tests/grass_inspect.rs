#[macro_use]
mod macros;

test!(
    inspect_unquoted_string,
    "a {\n  color: inspect(foo)\n}\n",
    "a {\n  color: foo;\n}\n"
);
test!(
    inspect_dbl_quoted_string,
    "a {\n  color: inspect(\"foo\")\n}\n",
    "a {\n  color: \"foo\";\n}\n"
);
test!(
    inspect_sgl_quoted_string,
    "a {\n  color: inspect(\"foo\")\n}\n",
    "a {\n  color: \"foo\";\n}\n"
);
test!(
    inspect_unitless_number,
    "a {\n  color: inspect(1)\n}\n",
    "a {\n  color: 1;\n}\n"
);
test!(
    inspect_px_number,
    "a {\n  color: inspect(1px)\n}\n",
    "a {\n  color: 1px;\n}\n"
);
test!(
    inspect_color_3_hex,
    "a {\n  color: inspect(#fff)\n}\n",
    "a {\n  color: #fff;\n}\n"
);
test!(
    inspect_color_6_hex,
    "a {\n  color: inspect(#ffffff)\n}\n",
    "a {\n  color: #ffffff;\n}\n"
);
test!(
    inspect_color_name,
    "a {\n  color: inspect(red)\n}\n",
    "a {\n  color: red;\n}\n"
);
test!(
    inspect_true,
    "a {\n  color: inspect(true)\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    inspect_false,
    "a {\n  color: inspect(false)\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    inspect_null,
    "a {\n  color: inspect(null)\n}\n",
    "a {\n  color: null;\n}\n"
);
test!(
    inspect_empty_brackets,
    "a {\n  color: inspect([]);\n}\n",
    "a {\n  color: [];\n}\n"
);
test!(
    inspect_comma_separated_one_val,
    "a {\n  color: inspect((1, ));\n}\n",
    "a {\n  color: (1,);\n}\n"
);
test!(
    inspect_comma_separated_one_val_bracketed,
    "a {\n  color: inspect([1, ]);\n}\n",
    "a {\n  color: [1,];\n}\n"
);
test!(
    inspect_space_separated_one_val_bracketed,
    "a {\n  color: inspect(append((), 1, space));\n}\n",
    "a {\n  color: 1;\n}\n"
);
test!(
    inspect_list_of_empty_list,
    "a {\n  color: inspect(((), ()));\n}\n",
    "a {\n  color: (), ();\n}\n"
);
test!(
    #[ignore]
    inspect_comma_separated_list_of_comma_separated_lists,
    "a {\n  color: inspect([(1, 2), (3, 4)]);\n}\n",
    "a {\n  color: [(1, 2), (3, 4)];\n}\n"
);
test!(
    inspect_empty_list,
    "a {\n  color: inspect(())\n}\n",
    "a {\n  color: ();\n}\n"
);
test!(
    inspect_spaced_list,
    "a {\n  color: inspect(1 2 3)\n}\n",
    "a {\n  color: 1 2 3;\n}\n"
);
test!(
    #[ignore]
    inspect_comma_list,
    "a {\n  color: inspect(1, 2, 3)\n}\n",
    "a {\n  color: 1, 2, 3;\n}\n"
);
test!(
    inspect_parens,
    "a {\n  color: inspect((((a))));\n}\n",
    "a {\n  color: a;\n}\n"
);
test!(
    inspect_mul_units,
    "a {\n  color: inspect(1em * 1px);\n}\n",
    "a {\n  color: 1em*px;\n}\n"
);
test!(
    inspect_map_with_map_key_and_value,
    "a {\n  color: inspect(((a: b): (c: d)));\n}\n",
    "a {\n  color: ((a: b): (c: d));\n}\n"
);
test!(
    inspect_map_in_arglist,
    "@function foo($a...) {
        @return inspect($a);
    }

    a {
        color: foo((a: b));
    }",
    "a {\n  color: ((a: b),);\n}\n"
);
