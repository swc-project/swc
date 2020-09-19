#[macro_use]
mod grass_macros;
grass_test!(
    map_get_key_exists,
    "a {\n  color: map-get((a: b), a);\n}\n",
    "a {\n  color: b;\n}\n"
);
grass_test!(
    map_get_key_does_not_exist,
    "a {\n  color: map-get((a: b), foo);\n}\n",
    ""
);
grass_test!(
    map_get_empty_list,
    "a {\n  color: map-get((), foo);\n}\n",
    ""
);
grass_error!(
    map_get_non_map,
    "a {\n  color: map-get(foo, foo);\n}\n",
    "Error: $map: foo is not a map."
);
grass_error!(
    map_get_one_arg,
    "a {\n  color: map-get(1);\n}\n",
    "Error: Missing argument $key."
);
grass_test!(
    map_has_key_true,
    "a {\n  color: map-has-key((a: b), a);\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_test!(
    map_has_key_false,
    "a {\n  color: map-has-key((a: b), foo);\n}\n",
    "a {\n  color: false;\n}\n"
);
grass_test!(
    map_has_key_empty_list,
    "a {\n  color: map-has-key((), foo);\n}\n",
    "a {\n  color: false;\n}\n"
);
grass_error!(
    map_has_key_non_map,
    "a {\n  color: map-has-key(foo, foo);\n}\n",
    "Error: $map: foo is not a map."
);
grass_test!(
    map_keys_one,
    "a {\n  color: map-keys((a: b));\n}\n",
    "a {\n  color: a;\n}\n"
);
grass_test!(
    map_keys_are_comma_separated,
    "a {\n  color: map-keys((a: b, c: d));\n}\n",
    "a {\n  color: a, c;\n}\n"
);
grass_test!(
    map_keys_empty,
    "a {\n  color: inspect(map-keys(()));\n}\n",
    "a {\n  color: ();\n}\n"
);
grass_error!(
    map_keys_non_map,
    "a {\n  color: map-keys(foo);\n}\n",
    "Error: $map: foo is not a map."
);
grass_test!(
    map_values_one,
    "a {\n  color: map-values((a: b));\n}\n",
    "a {\n  color: b;\n}\n"
);
grass_test!(
    map_values_empty,
    "a {\n  color: inspect(map-values(()));\n}\n",
    "a {\n  color: ();\n}\n"
);
grass_test!(
    map_values_are_comma_separated,
    "a {\n  color: map-values((a: b, c: d));\n}\n",
    "a {\n  color: b, d;\n}\n"
);
grass_error!(
    map_values_non_map,
    "a {\n  color: map-values(foo);\n}\n",
    "Error: $map: foo is not a map."
);
grass_test!(
    map_merge_one,
    "a {\n  color: inspect(map-merge((a: b), (c: d)));\n}\n",
    "a {\n  color: (a: b, c: d);\n}\n"
);
grass_test!(
    map_merge_both_empty,
    "a {\n  color: inspect(map-merge((), ()));\n}\n",
    "a {\n  color: ();\n}\n"
);
grass_test!(
    map_merge_same_keys,
    "a {\n  color: inspect(map-merge((c: d, e: f), (c: 1, e: 2)));\n}\n",
    "a {\n  color: (c: 1, e: 2);\n}\n"
);
grass_error!(
    map_merge_map1_non_map,
    "a {\n  color: map-merge(foo, (a: b));\n}\n",
    "Error: $map1: foo is not a map."
);
grass_error!(
    map_merge_map2_non_map,
    "a {\n  color: map-merge((a: b), foo);\n}\n",
    "Error: $map2: foo is not a map."
);
grass_test!(
    map_dbl_quoted_key,
    "a {\n  color: map-get((\"a\": b), \"a\");\n}\n",
    "a {\n  color: b;\n}\n"
);
grass_test!(
    map_key_quoting_ignored,
    "a {\n  color: map-get((\"a\": b), 'a');\n}\n",
    "a {\n  color: b;\n}\n"
);
grass_test!(
    map_arbitrary_number_of_entries,
    "a {\n  color: inspect((a: b, c: d, e: f, g: h, i: j, h: k, l: m, n: o));\n}\n",
    "a {\n  color: (a: b, c: d, e: f, g: h, i: j, h: k, l: m, n: o);\n}\n"
);
grass_test!(
    map_length,
    "a {\n  color: length((a: b, c: d, e: f));\n}\n",
    "a {\n  color: 3;\n}\n"
);
grass_error!(
    map_has_key_one_arg,
    "a {\n  color: map-has-key(1);\n}\n",
    "Error: Missing argument $key."
);
grass_test!(
    map_remove_one,
    "a {\n  color: inspect(map-remove((\"foo\": 1, \"bar\": 2), \"bar\"));\n}\n",
    "a {\n  color: (\"foo\": 1);\n}\n"
);
grass_test!(
    map_remove_two,
    "a {\n  color: inspect(map-remove((\"foo\": 1, \"bar\": 2, \"baz\": 3), \"bar\", \
     \"baz\"));\n}\n",
    "a {\n  color: (\"foo\": 1);\n}\n"
);
grass_test!(
    map_remove_empty_list,
    "a {\n  color: inspect(map-remove((), foo));\n}\n",
    "a {\n  color: ();\n}\n"
);
grass_error!(
    duplicate_key_in_declaration,
    "a {\n  $a: (foo: a, foo: b);\n}\n",
    "Error: Duplicate key."
);
grass_error!(
    display_map,
    "a {\n  color: (a: b, c: d);\n}\n",
    "Error: (a: b, c: d) isn't a valid CSS value."
);
grass_test!(
    map_comma_separated_list_as_key,
    "a {\n  color: map-keys(((1, 2): 3));\n}\n",
    "a {\n  color: 1, 2;\n}\n"
);
grass_test!(
    #[ignore = "blocked on rewriting inspect"]
    map_inspect_comma_separated_list_as_key,
    "a {\n  color: inspect(((1, 2): 3));\n}\n",
    "a {\n  color: ((1, 2): 3);\n}\n"
);
grass_test!(
    // todo: this just tests that it compiles, but does not test
    // if it parses correctly
    map_with_map_as_value,
    "$foo: (\"21by9\": (x: 21, y: 9));",
    ""
);
grass_test!(
    // todo: this just tests that it compiles, but does not test
    // if it parses correctly
    paren_with_paren_element_and_trailing_comma,
    "$foo: ((\"<\", \"%3c\"), );",
    ""
);
grass_test!(
    map_with_whitespace_after_trailing_comma,
    "$a: (foo: red, ); a {\n  color: inspect($a);\n}\n",
    "a {\n  color: (foo: red);\n}\n"
);
grass_test!(
    map_merge_not_exactly_equal,
    "a {\n  color: inspect(map-merge((0cm: a), (0mm: b)));\n}\n",
    "a {\n  color: (0cm: b);\n}\n"
);
grass_test!(
    map_equality_is_independent_of_order,
    "a {\n  color: (c: d, a: b)==(a: b, c: d);\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_test!(
    map_equality_considers_both_key_and_value,
    "a {\n  color: (a: b)==(a: c);\n}\n",
    "a {\n  color: false;\n}\n"
);
grass_test!(
    empty_with_single_line_comments,
    "$foo: (\n  \n  // :/a.b\n  \n  );
    a {
        color: inspect($foo);
    }",
    "a {\n  color: ();\n}\n"
);
grass_test!(
    trailing_comma_in_doubly_nested_map,
    r#"$a: (
        foo: (
            a: b,
            c: d,
        )
    );"#,
    ""
);
grass_error!(
    second_map_value_missing_colon,
    "a {\n  color: (a: b, c",
    "Error: expected \":\"."
);
grass_error!(
    second_map_value_missing_closing_paren,
    "$a: (a: b, c: d",
    "Error: expected \")\"."
);
grass_error!(
    first_map_value_missing_closing_paren,
    "$a: (a: b",
    "Error: expected \")\"."
);
grass_error!(
    denies_comma_separated_list_without_parens_as_key,
    "$map: (a: 1, b, c, d: e);",
    "Error: expected \":\"."
);
