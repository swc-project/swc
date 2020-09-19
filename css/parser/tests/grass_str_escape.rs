#[macro_use]
mod grass_macros;

grass_test!(
    escape_leading_zeros,
    "a {\n  color: ax \\61x \\61 x \\061x \\0061x \\00061x;\n}\n",
    "a {\n  color: ax ax ax ax ax ax;\n}\n"
);
grass_test!(
    escape_start_non_hex,
    "a {\n  color: \\xx;\n}\n",
    "a {\n  color: xx;\n}\n"
);
grass_test!(
    escape_start_non_ascii,
    "a {\n  color: ☃x \\☃x \\2603x;\n}\n",
    "@charset \"UTF-8\";\na {\n  color: ☃x ☃x ☃x;\n}\n"
);
grass_test!(
    escape_hyphen_in_middle,
    "a {\n  color: a\\2dx a\\-x;\n}\n",
    "a {\n  color: a-x a-x;\n}\n"
);
grass_test!(
    escape_hyphen_at_start,
    "a {\n  color: \\2dx \\-x;\n}\n",
    "a {\n  color: \\-x \\-x;\n}\n"
);
grass_test!(
    escape_digit_in_middle,
    "a {\n  color: a\\31x a\\31 x;\n}\n",
    "a {\n  color: a1x a1x;\n}\n"
);
grass_test!(
    escape_digit_at_start,
    "a {\n  color: \\31x \\31 x;\n}\n",
    "a {\n  color: \\31 x \\31 x;\n}\n"
);
grass_test!(
    escape_non_printable_characters,
    "a {\n  color: \\0x \\1x \\2x \\3x \\4x \\5x \\6x \\7x \\8x \\Bx \\Ex \\Fx \\10x \\11x \\12x \
     \\13x \\14x \\15x \\16x \\17x \\18x \\19x \\1Ax \\1Bx \\1Cx \\1Dx \\1Ex \\1Fx \\7Fx;\n}\n",
    "a {\n  color: \\0 x \\1 x \\2 x \\3 x \\4 x \\5 x \\6 x \\7 x \\8 x \\b x \\e x \\f x \\10 x \
     \\11 x \\12 x \\13 x \\14 x \\15 x \\16 x \\17 x \\18 x \\19 x \\1a x \\1b x \\1c x \\1d x \
     \\1e x \\1f x \\7f x;\n}\n"
);
grass_test!(
    escape_newlines,
    "a {\n  color: \\ax \\cx \\dx;\n}\n",
    "a {\n  color: \\a x \\c x \\d x;\n}\n"
);
grass_test!(
    escape_tabs,
    "a {\n  color: \\	x \\9x;\n}\n",
    "a {\n  color: \\9 x \\9 x;\n}\n"
);
grass_test!(
    escape_interpolation_start,
    "a {\n  color: \\-#{foo};\n}\n",
    "a {\n  color: \\-foo;\n}\n"
);
grass_test!(
    escape_interpolation_middle,
    "a {\n  color: #{foo}\\-#{bar};\n}\n",
    "a {\n  color: foo-bar;\n}\n"
);
grass_test!(
    escape_interpolation_end,
    "a {\n  color: #{foo}\\-;\n}\n",
    "a {\n  color: foo-;\n}\n"
);
grass_test!(
    escape_in_middle,
    "a {\n  color: b\\6cue;\n}\n",
    "a {\n  color: blue;\n}\n"
);
grass_test!(
    escape_at_end,
    "a {\n  color: blu\\65;\n}\n",
    "a {\n  color: blue;\n}\n"
);
grass_test!(double_escape_is_preserved, "a {\n  color: r\\\\65;\n}\n");
grass_test!(semicolon_in_string, "a {\n  color: \";\";\n}\n");
grass_test!(
    single_character_escape_sequence_has_space,
    "a {\n  color: \\fg1;\n}\n",
    "a {\n  color: \\f g1;\n}\n"
);
grass_test!(
    single_character_escape_sequence_removes_slash_when_not_hex_digit,
    "a {\n  color: \\g1;\n}\n",
    "a {\n  color: g1;\n}\n"
);
grass_test!(
    single_character_escape_sequence_has_space_after,
    "a {\n  color: \\a;\n}\n",
    "a {\n  color: \\a ;\n}\n"
);
grass_test!(
    escapes_non_hex_in_string,
    "a {\n  color: \"\\g\";\n}\n",
    "a {\n  color: \"g\";\n}\n"
);
grass_test!(
    escapes_hex_in_string_no_trailing_space,
    "a {\n  color: \
     \"\\b\\c\\d\\e\\f\\g\\h\\i\\j\\k\\l\\m\\n\\o\\p\\q\\r\\s\\t\\u\\v\\w\\x\\y\\z\";\n}\n",
    "a {\n  color: \"\\b\\c\\d\\e\\fghijklmnopqrstuvwxyz\";\n}\n"
);
grass_test!(
    interpolated_inside_string_does_not_produce_unquoted_output,
    "a {\n  color: \"#{\"\\b\"}\";\n}\n",
    "a {\n  color: \"\\b\";\n}\n"
);
grass_test!(
    unquote_quoted_backslash_single_lowercase_hex_char,
    "a {\n  color: #{\"\\b\"};\n}\n",
    "a {\n  color: \x0b;\n}\n"
);
grass_test!(
    unquoted_escape_equality,
    "a {\n  color: foo == f\\6F\\6F;\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_test!(
    quoted_escape_zero,
    "a {\n  color: \"\\0\";\n}\n",
    "@charset \"UTF-8\";\na {\n  color: \"�\";\n}\n"
);
grass_test!(
    unquoted_escape_zero,
    "a {\n  color: \\0;\n}\n",
    "a {\n  color: \\0 ;\n}\n"
);
grass_test!(
    quote_escape,
    "a {\n  color: quote(\\b);\n}\n",
    "a {\n  color: \"\\\\b \";\n}\n"
);
grass_test!(escaped_backslash, "a {\n  color: \"\\\\\";\n}\n");
grass_test!(
    double_quotes_when_containing_single_quote,
    "a {\n  color: '\\\'';\n}\n",
    "a {\n  color: \"'\";\n}\n"
);
grass_test!(
    allows_escaped_quote_at_start_of_ident,
    "a {\n  color: \\\"c\\\";\n}\n"
);
grass_test!(
    quoted_escaped_newline_unchanged,
    "a {\n  color: \"\\a\";\n}\n"
);
grass_test!(
    unquoted_escape_minus_unquoted,
    "a {\n  color: \\a - foo;\n}\n"
);
grass_test!(
    quoted_escaped_tab,
    "a {\n  color: \"\\9\";\n}\n",
    "a {\n  color: \"\t\";\n}\n"
);
grass_test!(
    unquoted_escaped_tab,
    "a {\n  color: \\9;\n}\n",
    "a {\n  color: \\9 ;\n}\n"
);
grass_error!(
    escape_sequence_does_not_fit_inside_char,
    "a {\n  color: \\110000;\n}\n",
    "Error: Invalid escape sequence."
);
grass_test!(
    escaped_newline_in_quoted_string,
    "a {\n  color: \"foo\\\nbar\";\n}\n",
    "a {\n  color: \"foobar\";\n}\n"
);
