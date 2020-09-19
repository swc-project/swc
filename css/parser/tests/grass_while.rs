#[macro_use]
mod macros;

test!(
    inner_increment_var,
    "$a: 4;\n$b: 1;\na {\n  @while $a > $b {\n    color: $b;\n    $b: $b + 1;\n  }\n}",
    "a {\n  color: 1;\n  color: 2;\n  color: 3;\n}\n"
);
test!(
    outer_increment_var,
    "$a: 4;\n$b: 1;\n@while $a > $b {\na {\n    color: $b;\n  }\n  $b: $b + 1;\n}",
    "a {\n  color: 1;\n}\n\na {\n  color: 2;\n}\n\na {\n  color: 3;\n}\n"
);
test!(
    inner_while_false,
    "a {\n  @while false {\n    color: foo;\n  }\n}",
    ""
);
test!(
    outer_while_false,
    "@while false {\na {\n    color: $b;\n  }\n  $b: $b + 1;\n}",
    ""
);
error!(
    while_empty_condition,
    "@while {}", "Error: Expected expression."
);
test!(
    early_return_in_function,
    "@function bar() {\n  @while (true) {\n    @return true;\n  }\n}\n\na {\n  color: bar();\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    nested_while_at_root_scope,
    "$continue_inner: true;\n$continue_outer: true;\n\n@while $continue_outer {\n  @while $continue_inner {\n    $continue_inner: false;\n  }\n\n  $continue_outer: false;\n}\n\nresult {\n  continue_outer: $continue_outer;\n  continue_inner: $continue_inner;\n}\n",
    "result {\n  continue_outer: false;\n  continue_inner: false;\n}\n"
);
test!(
    nested_while_not_at_root_scope,
    "$continue_inner: true;\n$continue_outer: true;\n\nresult {\n  @while $continue_outer {\n    @while $continue_inner {\n      $continue_inner: false;\n    }\n\n    $continue_outer: false;\n  }\n\n  continue_outer: $continue_outer;\n  continue_inner: $continue_inner;\n}\n",
    "result {\n  continue_outer: true;\n  continue_inner: true;\n}\n"
);
test!(
    local_scope_at_root,
    "$continue_inner: true;
    $continue_outer: true;

    @while $continue_outer {
      $local_implicit: outer;
      $local_explicit: outer !global;
      $local_default: outer !default;

      @while $continue_inner {
        $local_implicit: inner;
        $local_explicit: inner !global;
        $local_default: inner !default;
        $continue_inner: false;
      }

      $continue_outer: false;
    }

    result {
      @if variable-exists(local_default) {
        local_default: $local_default;
      }

      @if variable-exists(local_implicit) {
        local_implicit: $local_implicit;
      }

      @if variable-exists(local_explicit) {
        local_explicit: $local_explicit;
      }
    }",
    "result {\n  local_explicit: inner;\n}\n"
);
test!(
    global_scope_at_root,
    "$continue_inner: true;
    $continue_outer: true;
    $root_default: initial;
    $root_implicit: initial;
    $root_explicit: initial !global;

    @while $continue_outer {
    $root_implicit: outer;
    $root_explicit: outer !global;
    $root_default: outer !default;

    @while $continue_inner {
        $root_implicit: inner;
        $root_explicit: inner !global;
        $root_default: inner !default;
        $continue_inner: false;
    }

    $continue_outer: false;
    }

    result {
    root_default: $root_default;
    root_implicit: $root_implicit;
    root_explicit: $root_explicit;
    }",
    "result {\n  root_default: initial;\n  root_implicit: inner;\n  root_explicit: inner;\n}\n"
);
test!(
    if_inside_while,
    "$continue_outer: true;
    @while $continue_outer {
      a {
        color: red;
      }

      @if true {
        $continue_outer: false;
      }

      a {
        color: blue;
      }
    }",
    "a {\n  color: red;\n}\n\na {\n  color: blue;\n}\n"
);
test!(
    multiline_comments_everywhere,
    "  /**/  @while  /**/  false  /**/  {}  /**/  ",
    "/**/\n/**/\n"
);
error!(
    missing_closing_curly_brace,
    "@while true {", "Error: expected \"}\"."
);
