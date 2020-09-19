#[macro_use]
mod grass_macros;

grass_test!(
    null_in_parens_in_list,
    "a {\n  color: (null), (null), 3, 4;\n}\n",
    "a {\n  color: 3, 4;\n}\n"
);
grass_test!(
    null_counted_in_list_length,
    "a {\n  color: length(null null null);\n}\n",
    "a {\n  color: 3;\n}\n"
);
grass_test!(
    simple_null_list_not_emitted,
    "a {\n  color: null null null;\n}\n",
    ""
);
grass_test!(
    paren_null_list_not_emitted,
    "a {\n  color: (null null null);\n}\n",
    ""
);
grass_test!(
    bracketed_null_list_not_emitted,
    "a {\n  color: [null null null];\n}\n",
    ""
);
grass_test!(
    negative_null_in_var,
    "a {\n  $x: null;\n  color: -$x;\n}\n",
    "a {\n  color: -;\n}\n"
);
grass_test!(
    null_is_case_sensitive,
    "a {\n  color: NULL;\n}\n",
    "a {\n  color: NULL;\n}\n"
);
