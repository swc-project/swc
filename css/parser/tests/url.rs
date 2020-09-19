#[macro_use]
mod macros;

test!(
    arithmetic_both_space,
    "a {\n  color: url(1 + 2);\n}\n",
    "a {\n  color: url(3);\n}\n"
);
test!(
    arithmetic_space_right,
    "a {\n  color: url(1+ 2);\n}\n",
    "a {\n  color: url(3);\n}\n"
);
test!(
    arithmetic_space_left,
    "a {\n  color: url(1 +2);\n}\n",
    "a {\n  color: url(3);\n}\n"
);
test!(
    arithmetic_no_space,
    "a {\n  color: url(1+2);\n}\n",
    "a {\n  color: url(1+2);\n}\n"
);
test!(
    arithmetic_space_start_of_url,
    "a {\n  color: url( 1+2);\n}\n",
    "a {\n  color: url(1+2);\n}\n"
);
test!(
    arithmetic_space_end_of_url,
    "a {\n  color: url(1+2 );\n}\n",
    "a {\n  color: url(1+2);\n}\n"
);
test!(
    arithmetic_space_start_end_of_url,
    "a {\n  color: url( 1+2 );\n}\n",
    "a {\n  color: url(1+2);\n}\n"
);
test!(
    arithmetic_space_start_end_of_url_and_operands,
    "a {\n  color: url( 1 + 2 );\n}\n",
    "a {\n  color: url(3);\n}\n"
);
test!(
    silent_comment,
    "a {\n  color: url(//some/absolute/path);\n}\n"
);
test!(
    multiline_comment,
    "a {\n  color: url(/*looks-like-a*/comment);\n}\n"
);
test!(plain_css_function, "a {\n  color: url(fn(\"s\"));\n}\n");
test!(
    builtin_function,
    "a {\n  color: url(if(true, \"red.png\", \"blue.png\"));\n}\n",
    "a {\n  color: url(\"red.png\");\n}\n"
);
test!(
    user_defined_function,
    "$file-1x: \"budge.png\";\n@function fudge($str) {\n  @return \"assets/fudge/\"+$str;\n}\n\na {\n  color: url(fudge(\"#{$file-1x}\"));\n}\n",
    "a {\n  color: url(\"assets/fudge/budge.png\");\n}\n"
);
test!(
    unquoted_interpolation,
    "a {\n  color: url(hello-#{world}.png);\n}\n",
    "a {\n  color: url(hello-world.png);\n}\n"
);
test!(
    quoted_interpolation,
    "a {\n  color: url(\"hello-#{world}.png\");\n}\n",
    "a {\n  color: url(\"hello-world.png\");\n}\n"
);
test!(simple_forward_slash, "a {\n  color: url(foo/bar.css);\n}\n");
test!(http_url, "a {\n  color: url(http://foo.bar.com);\n}\n");
test!(
    google_fonts_url,
    "a {\n  color: url(http://fonts.googleapis.com/css?family=Karla:400,700,400italic|Anonymous+Pro:400,700,400italic);\n}\n"
);
test!(
    interpolation_in_http_url,
    "a {\n  color: url(http://blah.com/bar-#{foo}.css);\n}\n",
    "a {\n  color: url(http://blah.com/bar-foo.css);\n}\n"
);
test!(
    many_forward_slashes,
    "a {\n  color: url(http://box_////fudge.css);\n}\n"
);
test!(
    url_whitespace,
    "a {\n  color: url(       1      );\n}\n",
    "a {\n  color: url(1);\n}\n"
);
test!(
    url_newline,
    "a {\n  color: url(\n);\n}\n",
    "a {\n  color: url();\n}\n"
);
test!(url_comma_list, "a {\n  color: url(1, 2, a, b, c);\n}\n");
test!(
    url_contains_only_interpolation,
    "a {\n  color: url(#{1 + 2});\n}\n",
    "a {\n  color: url(3);\n}\n"
);
test!(
    url_begins_with_interpolation,
    "a {\n  color: url(#{http}://foo);\n}\n",
    "a {\n  color: url(http://foo);\n}\n"
);
test!(url_dot_dot, "a {\n  color: url(../foo/bar/..baz/);\n}\n");
test!(
    silent_comment_in_interpolation,
    "$roboto-font-path: \"../fonts/roboto\";\n\na {\n  color: url(#{//}\n  $roboto-font-path});\n}\n",
    "a {\n  color: url(../fonts/roboto);\n}\n"
);
test!(
    interpolation_in_nested_url,
    "a {\n  color: url(url(#{foo}));\n}\n",
    "a {\n  color: url(url(foo));\n}\n"
);
test!(
    no_space_after_colon_and_contains_semicolon,
    "a {\n  color:url(;);\n}\n",
    "a {\n  color: url(;);\n}\n"
);
test!(
    begins_with_single_forward_slash,
    "a {\n  color: url(/rust-logo.png);\n}\n",
    "a {\n  color: url(/rust-logo.png);\n}\n"
);
test!(
    url_uppercase,
    "a {\n  color: URL(http://foo);\n}\n",
    "a {\n  color: url(http://foo);\n}\n"
);
test!(
    url_mixed_casing,
    "a {\n  color: UrL(http://foo);\n}\n",
    "a {\n  color: url(http://foo);\n}\n"
);
test!(
    url_browser_prefixed,
    "a {\n  color: -webkit-url(https://google.com);\n}\n",
    "a {\n  color: url(https://google.com);\n}\n"
);
test!(
    url_hash_no_interpolation,
    "a {\n  color: url(#);\n}\n",
    "a {\n  color: url(#);\n}\n"
);
error!(
    url_nothing_after_forward_slash_in_interpolation,
    "a { color: url(#{/", "Error: Expected expression."
);
error!(
    url_nothing_after_backslash_in_interpolation_in_quote,
    "a { color: url(#{\"\\", "Error: Expected \"."
);
error!(
    url_nothing_after_hash_in_interpolation_in_quote,
    "a { color: url(#{\"#", "Error: Expected \"."
);
