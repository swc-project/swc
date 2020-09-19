#[macro_use]
mod macros;

test!(
    removes_double_quotes,
    "a {\n  color: #{\"red\"};\n}\n",
    "a {\n  color: red;\n}\n"
);
test!(
    removes_single_quotes,
    "a {\n  color: #{'red'};\n}\n",
    "a {\n  color: red;\n}\n"
);
test!(
    number_after_interpolation,
    "a {\n  color: a#{foo}1;\n}\n",
    "a {\n  color: afoo1;\n}\n"
);
test!(
    double_hyphen_before_interpolation,
    "a {\n  --#{foo}: red;\n}\n",
    "a {\n  --foo: red;\n}\n"
);
test!(
    preserves_inner_single_quotes,
    "a {\n  color: #{\"''\"};\n}\n",
    "a {\n  color: '';\n}\n"
);
test!(
    single_quotes_converted_to_double_when_interpolated,
    "a {\n  color: '#{foo}';\n}\n",
    "a {\n  color: \"foo\";\n}\n"
);
test!(
    double_quotes_inside_double_quoted_string,
    "a {\n  color: #{\"#{'\"'}\"};\n}\n",
    "a {\n  color: \";\n}\n"
);
test!(
    unquotes_space_separated_list,
    "a {\n  color: #{\"a\" 'b'};\n}\n",
    "a {\n  color: a b;\n}\n"
);
test!(
    interpolated_newline,
    "a {\n  color: \"#{\"\\a\"}\";\n}\n",
    "a {\n  color: \"\\a\";\n}\n"
);
test!(
    double_interpolated_newline,
    "a {\n  color: \"#{#{\"\\a\"}}\";\n}\n",
    "a {\n  color: \"\\a\";\n}\n"
);
test!(
    interpolated_quoted_newline,
    "a {\n  color: #{\"\\a\"};\n}\n",
    "a {\n  color:  ;\n}\n"
);
test!(
    interpolate_escaped_quotes,
    "a {\n  color: #{\\\"\\'};\n}\n",
    "a {\n  color: \\\"\\';\n}\n"
);
test!(
    interpolate_escaped_quotes_in_quotes,
    "a {\n  color: \"#{\\\"\\'}\";\n}\n",
    "a {\n  color: \"\\\\\\\"\\\\'\";\n}\n"
);
test!(
    interpolated_plain_css_fn,
    "$f: foo;\na {\n  color: #{$f}(a, 1+2, c);\n}\n",
    "a {\n  color: foo(a, 3, c);\n}\n"
);
test!(
    #[ignore = "we evaluate interpolation eagerly"]
    interpolated_builtin_fn,
    "a {\n  color: uni#{t}less(1px);\n}\n",
    "a {\n  color: unitless(1px);\n}\n"
);
error!(
    error_message_when_at_start_of_value,
    "a {\n  color: #{2px*5px};\n}\n", "Error: 10px*px isn't a valid CSS value."
);
