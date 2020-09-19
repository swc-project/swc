#[macro_use]
mod grass_macros;

grass_test!(
    removes_double_quotes,
    "a {\n  color: #{\"red\"};\n}\n",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    removes_single_quotes,
    "a {\n  color: #{'red'};\n}\n",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    number_after_interpolation,
    "a {\n  color: a#{foo}1;\n}\n",
    "a {\n  color: afoo1;\n}\n"
);
grass_test!(
    double_hyphen_before_interpolation,
    "a {\n  --#{foo}: red;\n}\n",
    "a {\n  --foo: red;\n}\n"
);
grass_test!(
    preserves_inner_single_quotes,
    "a {\n  color: #{\"''\"};\n}\n",
    "a {\n  color: '';\n}\n"
);
grass_test!(
    single_quotes_converted_to_double_when_interpolated,
    "a {\n  color: '#{foo}';\n}\n",
    "a {\n  color: \"foo\";\n}\n"
);
grass_test!(
    double_quotes_inside_double_quoted_string,
    "a {\n  color: #{\"#{'\"'}\"};\n}\n",
    "a {\n  color: \";\n}\n"
);
grass_test!(
    unquotes_space_separated_list,
    "a {\n  color: #{\"a\" 'b'};\n}\n",
    "a {\n  color: a b;\n}\n"
);
grass_test!(
    interpolated_newline,
    "a {\n  color: \"#{\"\\a\"}\";\n}\n",
    "a {\n  color: \"\\a\";\n}\n"
);
grass_test!(
    double_interpolated_newline,
    "a {\n  color: \"#{#{\"\\a\"}}\";\n}\n",
    "a {\n  color: \"\\a\";\n}\n"
);
grass_test!(
    interpolated_quoted_newline,
    "a {\n  color: #{\"\\a\"};\n}\n",
    "a {\n  color:  ;\n}\n"
);
grass_test!(
    interpolate_escaped_quotes,
    "a {\n  color: #{\\\"\\'};\n}\n",
    "a {\n  color: \\\"\\';\n}\n"
);
grass_test!(
    interpolate_escaped_quotes_in_quotes,
    "a {\n  color: \"#{\\\"\\'}\";\n}\n",
    "a {\n  color: \"\\\\\\\"\\\\'\";\n}\n"
);
grass_test!(
    interpolated_plain_css_fn,
    "$f: foo;\na {\n  color: #{$f}(a, 1+2, c);\n}\n",
    "a {\n  color: foo(a, 3, c);\n}\n"
);
grass_test!(
    #[ignore = "we evaluate interpolation eagerly"]
    interpolated_builtin_fn,
    "a {\n  color: uni#{t}less(1px);\n}\n",
    "a {\n  color: unitless(1px);\n}\n"
);
grass_error!(
    error_message_when_at_start_of_value,
    "a {\n  color: #{2px*5px};\n}\n",
    "Error: 10px*px isn't a valid CSS value."
);
