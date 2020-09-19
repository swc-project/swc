#[macro_use]
mod grass_macros;

grass_test!(
    if_toplevel_true,
    "@if true {\n  a {\n    color: foo;\n}\n}\n",
    "a {\n  color: foo;\n}\n"
);
grass_test!(
    if_inner_true,
    "a {\n  @if true {\n    color: foo;\n}\n}\n",
    "a {\n  color: foo;\n}\n"
);
grass_test!(
    if_toplevel_false,
    "@if false {\n  a {\n    color: foo;\n}\n}\n",
    ""
);
grass_test!(
    if_inner_false,
    "a {\n  @if false {\n    color: foo;\n}\n}\n",
    ""
);
grass_test!(
    if_else_toplevel_true,
    "@if true {\n  a {\n    color: foo;\n}\n} @else {\n  b {\n    color: bar;\n}\n}\n",
    "a {\n  color: foo;\n}\n"
);
grass_test!(
    if_else_inner_true,
    "a {\n  @if true {\n    color: foo;\n} @else {\n    color: bar;\n}\n}\n",
    "a {\n  color: foo;\n}\n"
);
grass_test!(
    if_else_toplevel_false,
    "@if false {\n  a {\n    color: foo;\n}\n} @else {\n  a {\n    color: bar;\n}\n}\n",
    "a {\n  color: bar;\n}\n"
);
grass_test!(
    if_else_inner_false,
    "a {\n  @if false {\n    color: foo;\n} @else {\n    color: bar;\n}\n}\n",
    "a {\n  color: bar;\n}\n"
);
grass_error!(
    no_brace_after_else,
    "@if false {} @else -}",
    "Error: expected \"{\"."
);
grass_test!(
    if_else_if_no_else,
    "a {\n  @if false {\n    color: red;\n} @else if true {\n    color: blue;\n}\n}\n",
    "a {\n  color: blue;\n}\n"
);
grass_test!(
    if_false_else_if_false_else,
    "a {\n  @if false {\n    color: red;\n} @else if false {\n    color: blue;\n} @else {\n    \
     color: green;\n}\n}\n",
    "a {\n  color: green;\n}\n"
);
grass_test!(
    if_false_else_if_true_else,
    "a {\n  @if false {\n    color: red;\n} @else if true {\n    color: blue;\n} @else {\n    \
     color: green;\n}\n}\n",
    "a {\n  color: blue;\n}\n"
);
grass_test!(
    if_inner_style_missing_semicolon,
    "a {\n  @if true {\n    color: red\n  }\n}\n",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    atrule_other_than_else_immediately_following,
    "a {\n  @if true {\n    b {\n      background: gray;\n    }\n  }\n\n  @if true {\n    b {\n      background: gray;\n    }\n  }\n}\n",
    "a b {\n  background: gray;\n}\na b {\n  background: gray;\n}\n"
);
grass_test!(
    nested_if_in_function,
    "@function foo($value) {\n  @if true {\n    @if false {\n      @error foo;\n    }\n\n    \
     @else {\n      @return $value;\n    }\n  }\n}
    a { color: foo(bar); }",
    "a {\n  color: bar;\n}\n"
);
grass_test!(
    multiline_comments_surrounding_condition_empty,
    "@if/**/true/**/{ a { color: red; } }",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    multiline_comments_surrounding_condition,
    "@if/* pre 1 */true/* post 1 */{ a { color: red; } }",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    escaped_if,
    "@\\69 f true {\n  a {\n    color: red;\n  }\n}\n",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    uppercase_escaped_if,
    "@\\49 f true {\n  a {\n    color: red;\n  }\n}\n",
    "@If true {\n  a {\n    color: red;\n  }\n}\n"
);
grass_test!(
    escaped_else,
    "@if false {}\n\n@\\65lse {\n  a {\n    color: red;\n  }\n}\n",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    uppercase_escaped_else,
    "@if false {}\n\n@\\45lse {\n  a {\n    color: red;\n  }\n}\n",
    "@Else {\n  a {\n    color: red;\n  }\n}\n"
);
grass_test!(
    uppercase_else,
    "@if false {}\n\n@Else {\n  a {\n    color: red;\n  }\n}\n",
    "@Else {\n  a {\n    color: red;\n  }\n}\n"
);
grass_test!(uppercase_if, "@If true {\n  a {\n    color: red;\n  }\n}\n");
grass_error!(nothing_after_if, "@if", "Error: Expected expression.");
grass_error!(
    nothing_after_dollar,
    "@if ${}",
    "Error: Expected identifier."
);
grass_error!(no_condition, "@if{}", "Error: Expected expression.");
grass_error!(
    nothing_after_open_curly,
    "@if foo {",
    "Error: expected \"}\"."
);
grass_error!(
    first_condition_error,
    "@if 1 + 1 =s {\n}",
    "Error: expected \"=\"."
);
grass_test!(
    conditions_evaluated_lazily,
    "$p: null;
    @if $p==null {}
    @else if not comparable($p, 0) {}",
    ""
);
grass_test!(
    at_rule_inside_ruleset,
    "@mixin foo {\n    color: red;\n}\n\n@if true {\n    a {\n        @include foo;\n    }\n}\n",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    crazy_interpolation,
    "a {
        @if true {
            a: #{\"#{\"\\\\}}}{{{\"}#\"};
        }

        @if false {
            a: #{\"#{\"\\\\}}}{{{\"}#\"};
        } @else if true {
            b: #{\"#{\"\\\\}}}{{{\"}#\"};
        }

        @if false {
            a: #{\"#{\"\\\\}}}{{{\"}#\"};
        } @else if false {
            b: #{\"#{\"\\\\}}}{{{\"}#\"};
        } @else {
            c: #{\"#{\"\\\\}}}{{{\"}#\"};
        }
    }",
    "a {\n  a: \\}}}{{{#;\n  b: \\}}}{{{#;\n  c: \\}}}{{{#;\n}\n"
);
grass_test!(
    multiline_comments_everywhere,
    "  /**/  @if  /**/  false  /**/  {}  /**/  
    /**/  
    /**/  @else  /**/  if  /**/  false  /**/  {}  /**/  
    /**/  
    /**/  @else  /**/  {}  /**/  
      /**/  ",
    "/**/\n/**/\n/**/\n"
);
grass_test!(
    parent_selector_is_null_at_root,
    "@if & {
        a {
            color: red;
        }
    }",
    ""
);
grass_error!(
    nothing_after_escape,
    "@if \\",
    "Error: Expected expression."
);
grass_error!(unclosed_dbl_quote, "@if true \" {}", "Error: Expected \".");
grass_error!(unclosed_sgl_quote, "@if true ' {}", "Error: Expected '.");
grass_error!(
    unclosed_call_args,
    "@if a({}",
    "Error: Expected expression."
);
grass_error!(nothing_after_div, "@if a/", "Error: Expected expression.");
grass_error!(multiline_error, "@if \"\n\"{}", "Error: Expected \".");
grass_error!(
    nothing_after_i_after_else,
    "@if true {} @else i",
    "Error: expected \"{\"."
);
grass_error!(
    invalid_toplevel_selector,
    "@if true { & { } }",
    "Error: Top-level selectors may not contain the parent selector \"&\"."
);
