#[macro_use]
mod grass_macros;

grass_test!(basic_style, "a {\n  color: red;\n}\n");
grass_test!(two_styles, "a {\n  color: red;\n  color: blue;\n}\n");
grass_test!(
    two_inner_rulesets,
    "a {\n  b {\n  color: red;\n}\n  c {\n  color: white;\n}\n}\n",
    "a b {\n  color: red;\n}\na c {\n  color: white;\n}\n"
);
grass_test!(
    two_rulesets,
    "a {\n  color: red;\n}\n\nc {\n  color: white;\n}\n"
);
grass_test!(
    two_rulesets_first_no_semicolon,
    "a {\n  color: red\n}\nc {\n  color: white;\n}\n",
    "a {\n  color: red;\n}\n\nc {\n  color: white;\n}\n"
);
grass_test!(
    two_inner_outer_rulesets,
    "a {\n  b {\n  color: red;\n}\n  c {\n  color: white;\n}\n}\na {\n  b {\n  color: red;\n}\n  \
     c {\n  color: white;\n}\n}\n",
    "a b {\n  color: red;\n}\na c {\n  color: white;\n}\n\na b {\n  color: red;\n}\na c {\n  \
     color: white;\n}\n"
);
grass_test!(
    removes_empty_outer_styles,
    "a {\n  b {\n    color: red;\n  }\n",
    "a b {\n  color: red;\n}\n"
);
grass_test!(removes_empty_styles, "a {}\n", "");
grass_test!(
    doesnt_eat_style_after_ruleset,
    "a {\n  b {\n  color: red;\n}\n  color: blue;\n}\n",
    "a {\n  color: blue;\n}\na b {\n  color: red;\n}\n"
);
grass_test!(
    multiline_style,
    "a {\n  color: red\n  blue;\n}\n",
    "a {\n  color: red blue;\n}\n"
);
grass_test!(hyphenated_style_property, "a {\n  font-family: Arial;\n}\n");
grass_test!(hyphenated_style_value, "a {\n  color: Open-Sans;\n}\n");
grass_test!(
    space_separated_style_value,
    "a {\n  border: solid red;\n}\n"
);
grass_test!(
    single_quoted_style_value,
    "a {\n  font: 'Open-Sans';\n}\n",
    "a {\n  font: \"Open-Sans\";\n}\n"
);
grass_test!(
    double_quoted_style_value,
    "a {\n  font: \"Open-Sans\";\n}\n"
);
grass_test!(
    comma_style_value,
    "a {\n  font: Open-Sans, sans-serif;\n}\n"
);
grass_test!(
    style_interpolation_start,
    "a {\n  #{c}olor: red;\n}\n",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    style_interpolation_middle,
    "a {\n  co#{l}or: red;\n}\n",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    style_interpolation_end,
    "a {\n  colo#{r}: red;\n}\n",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    style_interpolation_variable,
    "$a: foo;\na {\n  co#{$a}lor: red;\n}\n",
    "a {\n  cofoolor: red;\n}\n"
);
grass_test!(
    style_val_interpolation_start,
    "a {\n  color: #{r}ed;\n}\n",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    style_val_interpolation_middle,
    "a {\n  color: r#{e}d;\n}\n",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    style_val_interpolation_end,
    "a {\n  color: re#{d};\n}\n",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    style_val_interpolation_variable,
    "$a: foo;\na {\n  color: r#{$a}ed;\n}\n",
    "a {\n  color: rfooed;\n}\n"
);
grass_test!(
    style_whitespace,
    "a {\n     color      :       red    ;    \n}\n",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    triple_nested_preceding_ruleset,
    "a {\n  b {\n    foo: bar;\n    c {}\n  }\n}\n",
    "a b {\n  foo: bar;\n}\n"
);
grass_test!(
    triple_nested_following_ruleset,
    "a {\n  b {\n    c {}\n    foo: bar;\n  }\n}\n",
    "a b {\n  foo: bar;\n}\n"
);
grass_test!(
    single_nested_styles,
    "a {\n  webkit: {\n    color: red;\n    color: orange\n  }\n}\n",
    "a {\n  webkit-color: red;\n  webkit-color: orange;\n}\n"
);
grass_test!(
    multiple_nested_styles,
    "a {\n  webkit: {\n    webkit: {\n     color: red;\n    }\n  }\n}\n",
    "a {\n  webkit-webkit-color: red;\n}\n"
);
grass_test!(
    no_space_after_colon_before_nested_style,
    "a {\n    foo:{\n        bar: baz\n    }\n}\n",
    "a {\n  foo-bar: baz;\n}\n"
);
grass_test!(
    no_space_between_colon,
    "a {\n  color:red;\n}\n",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    no_space_between_colon_no_semicolon,
    "a {\n  color:red\n}\n",
    "a {\n  color: red;\n}\n"
);
grass_test!(removes_null_value, "a {\n  color: null;\n}\n", "");
grass_test!(
    namespace_before_open_brace,
    "foo {\n  a: b {\n    c: d;\n  }\n}\n",
    "foo {\n  a: b;\n  a-c: d;\n}\n"
);
grass_test!(
    namespace_before_open_brace_nested,
    "foo {\n  a: b {\n    c: d {\n      e: f;\n    }\n  }\n}\n",
    "foo {\n  a: b;\n  a-c: d;\n  a-c-e: f;\n}\n"
);
grass_test!(curly_braces_in_quotes, "a {\n  color: \"{foo}\";\n}\n");
grass_test!(
    escaped_interpolation,
    "a {\n  color: \"\\#{foo}\";\n}\n",
    "a {\n  color: \"#{foo}\";\n}\n"
);
grass_test!(
    styles_after_quoted,
    "a {\n  color: \"red\";\n  color: blue;\n}\n"
);
grass_test!(
    emits_leading_whitespace,
    "a {\n  color: unquote(\" foo\");\n}\n",
    "a {\n  color:  foo;\n}\n"
);
grass_test!(
    emits_trailing_whitespace,
    "a {\n  color: unquote(\"foo  \");\n}\n",
    "a {\n  color: foo  ;\n}\n"
);
grass_test!(
    multiline_comment_after_style_property,
    "a {\n  color  /**/  : red;\n}\n",
    "a {\n  color: red;\n}\n"
);
