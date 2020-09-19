#[macro_use]
mod grass_macros;

grass_test!(
    removes_inner_comments,
    "a {\n  color: red/* hi */;\n}\n",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    removes_inner_comments_whitespace,
    "a {\n  color: red    /* hi */;\n}\n",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    preserves_outer_comments_before,
    "a {\n  /* hi */\n  color: red;\n}\n"
);
grass_test!(
    preserves_outer_comments_after,
    "a {\n  color: red;\n  /* hi */\n}\n"
);
grass_test!(
    preserves_outer_comments_two,
    "a {\n  /* foo */\n  /* bar */\n  color: red;\n}\n"
);
grass_test!(
    preserves_toplevel_comment_before,
    "/* foo */\na {\n  color: red;\n}\n"
);
grass_test!(
    preserves_toplevel_comment_after,
    "a {\n  color: red;\n}\n/* foo */\n"
);
grass_test!(
    removes_single_line_comment,
    "// a { color: red }\na {\n  height: 1 1px;\n}\n",
    "a {\n  height: 1 1px;\n}\n"
);
grass_test!(
    converts_form_feed_in_comment,
    "a {\n  /*  \x0C*/ color: red;\n}\n",
    "a {\n  /*  \n*/\n  color: red;\n}\n"
);
grass_test!(
    converts_crlf_in_comment,
    "a {\n  /*  \r\n*/ color: red;\n}\n",
    "a {\n  /*  \n*/\n  color: red;\n}\n"
);
grass_test!(
    closing_curly_brace_in_comment,
    "a {\n  color: 1 + // flang }\n  blang }",
    "a {\n  color: 1blang;\n}\n"
);
grass_test!(
    converts_cr_in_comment,
    "a {\n  /*  \r*/ color: red;\n}\n",
    "a {\n  /*  \n*/\n  color: red;\n}\n"
);
grass_test!(
    interpolation_in_multiline_comment,
    "$a: foo;/* interpolation #{1 + 1} in #{$a} comments */",
    "/* interpolation 2 in foo comments */\n"
);
