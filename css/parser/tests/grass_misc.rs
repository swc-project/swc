#[macro_use]
mod grass_macros;

grass_test!(
    ident_starts_with_hyphen,
    "a {\n  foo: -webkit-bar-baz;\n}\n"
);
grass_test!(
    ident_starts_with_double_hyphen,
    "a {\n  foo: --webkit-bar-baz;\n}\n"
);
grass_test!(ident_with_num, "el1 {\n  a: b;\n}\n");
grass_test!(
    emits_double_newline_between_unrelated_styles,
    "a {\n  color: red;\n}\n\nb {\n  color: blue;\n}\n"
);
grass_test!(
    variable_interchangable_hypen_dash,
    "$a-b: red; $a_b: green; a {\n  color: $a-b;\n}\n",
    "a {\n  color: green;\n}\n"
);
grass_test!(
    two_semicolons,
    "a {\n  color: red;;\n}\n",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    five_semicolons,
    "a {\n  color: red;;;;;\n}\n",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    two_semicolons_whitespace,
    "a {\n  color: red; ;\n}\n",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    utf8_ident_before_len,
    "a {\n  color: length(😀red);\n}\n",
    "a {\n  color: 1;\n}\n"
);
grass_test!(
    utf8_ident_before,
    "a {\n  color: 😀red;\n}\n",
    "@charset \"UTF-8\";\na {\n  color: 😀red;\n}\n"
);
grass_test!(
    utf8_ident_after_len,
    "a {\n  color: length(red😁)\n}\n",
    "a {\n  color: 1;\n}\n"
);
grass_test!(
    utf8_ident_after,
    "a {\n  color: red😁\n}\n",
    "@charset \"UTF-8\";\na {\n  color: red😁;\n}\n"
);
grass_test!(
    no_space_before_style,
    "a {\n  color:red\n}\n",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    does_not_combine_idents_with_leading_hyphen,
    "a {\n  color: a -b;\n}\n"
);
grass_test!(
    does_not_combine_idents_with_leading_hyphen_list,
    "a {\n  color: a -b c;\n}\n"
);
grass_test!(
    does_not_combine_idents_with_leading_hyphen_all,
    "a {\n  color: -a -b -c;\n}\n"
);
grass_test!(
    args_handles_arbitrary_number_of_parens,
    "a {\n  color: inspect((((((a))))));\n}\n",
    "a {\n  color: a;\n}\n"
);
grass_test!(
    no_space_between_colon_and_style_variable,
    "$base-color: #036;\na {\n  color:lighten($base-color, 5%);\n}",
    "a {\n  color: #004080;\n}\n"
);
grass_test!(
    semicolon_after_closing_brace,
    "a {\n  color: foo;\n};",
    "a {\n  color: foo;\n}\n"
);
grass_test!(
    builtin_functions_interchangeable_underscore_hyphen,
    "a {\n  color: ie_hex-str(rgba(0, 255, 0, 0.5));\n}\n",
    "a {\n  color: #8000FF00;\n}\n"
);
grass_test!(
    empty_style_after_style_emits_one_newline,
    "a {\n  a: b\n}\n\nb {}\n",
    "a {\n  a: b;\n}\n"
);
grass_test!(
    file_begins_with_utf8_bom,
    "\u{feff}a {\n  color: red\n}\n",
    "a {\n  color: red;\n}\n"
);
