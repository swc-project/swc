#[macro_use]
mod grass_macros;

grass_test!(
    arithmetic_both_space,
    "a {\n  color: url(1 + 2);\n}\n",
    "a {\n  color: url(3);\n}\n"
);
grass_test!(
    arithmetic_space_right,
    "a {\n  color: url(1+ 2);\n}\n",
    "a {\n  color: url(3);\n}\n"
);
grass_test!(
    arithmetic_space_left,
    "a {\n  color: url(1 +2);\n}\n",
    "a {\n  color: url(3);\n}\n"
);
grass_test!(
    arithmetic_no_space,
    "a {\n  color: url(1+2);\n}\n",
    "a {\n  color: url(1+2);\n}\n"
);
grass_test!(
    arithmetic_space_start_of_url,
    "a {\n  color: url( 1+2);\n}\n",
    "a {\n  color: url(1+2);\n}\n"
);
grass_test!(
    arithmetic_space_end_of_url,
    "a {\n  color: url(1+2 );\n}\n",
    "a {\n  color: url(1+2);\n}\n"
);
grass_test!(
    arithmetic_space_start_end_of_url,
    "a {\n  color: url( 1+2 );\n}\n",
    "a {\n  color: url(1+2);\n}\n"
);
grass_test!(
    arithmetic_space_start_end_of_url_and_operands,
    "a {\n  color: url( 1 + 2 );\n}\n",
    "a {\n  color: url(3);\n}\n"
);
grass_test!(
    silent_comment,
    "a {\n  color: url(//some/absolute/path);\n}\n"
);
grass_test!(
    multiline_comment,
    "a {\n  color: url(/*looks-like-a*/comment);\n}\n"
);
grass_test!(plain_css_function, "a {\n  color: url(fn(\"s\"));\n}\n");
grass_test!(
    builtin_function,
    "a {\n  color: url(if(true, \"red.png\", \"blue.png\"));\n}\n",
    "a {\n  color: url(\"red.png\");\n}\n"
);
grass_test!(
    user_defined_function,
    "$file-1x: \"budge.png\";\n@function fudge($str) {\n  @return \"assets/fudge/\"+$str;\n}\n\na \
     {\n  color: url(fudge(\"#{$file-1x}\"));\n}\n",
    "a {\n  color: url(\"assets/fudge/budge.png\");\n}\n"
);
grass_test!(
    unquoted_interpolation,
    "a {\n  color: url(hello-#{world}.png);\n}\n",
    "a {\n  color: url(hello-world.png);\n}\n"
);
grass_test!(
    quoted_interpolation,
    "a {\n  color: url(\"hello-#{world}.png\");\n}\n",
    "a {\n  color: url(\"hello-world.png\");\n}\n"
);
grass_test!(simple_forward_slash, "a {\n  color: url(foo/bar.css);\n}\n");
grass_test!(http_url, "a {\n  color: url(http://foo.bar.com);\n}\n");
grass_test!(
    google_fonts_url,
    "a {\n  color: url(http://fonts.googleapis.com/css?family=Karla:400,700,400italic|Anonymous+Pro:400,700,400italic);\n}\n"
);
grass_test!(
    interpolation_in_http_url,
    "a {\n  color: url(http://blah.com/bar-#{foo}.css);\n}\n",
    "a {\n  color: url(http://blah.com/bar-foo.css);\n}\n"
);
grass_test!(
    many_forward_slashes,
    "a {\n  color: url(http://box_////fudge.css);\n}\n"
);
grass_test!(
    url_whitespace,
    "a {\n  color: url(       1      );\n}\n",
    "a {\n  color: url(1);\n}\n"
);
grass_test!(
    url_newline,
    "a {\n  color: url(\n);\n}\n",
    "a {\n  color: url();\n}\n"
);
grass_test!(url_comma_list, "a {\n  color: url(1, 2, a, b, c);\n}\n");
grass_test!(
    url_contains_only_interpolation,
    "a {\n  color: url(#{1 + 2});\n}\n",
    "a {\n  color: url(3);\n}\n"
);
grass_test!(
    url_begins_with_interpolation,
    "a {\n  color: url(#{http}://foo);\n}\n",
    "a {\n  color: url(http://foo);\n}\n"
);
grass_test!(url_dot_dot, "a {\n  color: url(../foo/bar/..baz/);\n}\n");
grass_test!(
    silent_comment_in_interpolation,
    "$roboto-font-path: \"../fonts/roboto\";\n\na {\n  color: url(#{//}\n  \
     $roboto-font-path});\n}\n",
    "a {\n  color: url(../fonts/roboto);\n}\n"
);
grass_test!(
    interpolation_in_nested_url,
    "a {\n  color: url(url(#{foo}));\n}\n",
    "a {\n  color: url(url(foo));\n}\n"
);
grass_test!(
    no_space_after_colon_and_contains_semicolon,
    "a {\n  color:url(;);\n}\n",
    "a {\n  color: url(;);\n}\n"
);
grass_test!(
    begins_with_single_forward_slash,
    "a {\n  color: url(/rust-logo.png);\n}\n",
    "a {\n  color: url(/rust-logo.png);\n}\n"
);
grass_test!(
    url_uppercase,
    "a {\n  color: URL(http://foo);\n}\n",
    "a {\n  color: url(http://foo);\n}\n"
);
grass_test!(
    url_mixed_casing,
    "a {\n  color: UrL(http://foo);\n}\n",
    "a {\n  color: url(http://foo);\n}\n"
);
grass_test!(
    url_browser_prefixed,
    "a {\n  color: -webkit-url(https://google.com);\n}\n",
    "a {\n  color: url(https://google.com);\n}\n"
);
grass_test!(
    url_hash_no_interpolation,
    "a {\n  color: url(#);\n}\n",
    "a {\n  color: url(#);\n}\n"
);
grass_error!(
    url_nothing_after_forward_slash_in_interpolation,
    "a { color: url(#{/",
    "Error: Expected expression."
);
grass_error!(
    url_nothing_after_backslash_in_interpolation_in_quote,
    "a { color: url(#{\"\\",
    "Error: Expected \"."
);
grass_error!(
    url_nothing_after_hash_in_interpolation_in_quote,
    "a { color: url(#{\"#",
    "Error: Expected \"."
);
