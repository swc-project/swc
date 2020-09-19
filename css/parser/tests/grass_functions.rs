#[macro_use]
mod grass_macros;

test!(
    return_num,
    "@function a() {\n  @return 1;\n}\n\nb {\ncolor: a();\n}\n",
    "b {\n  color: 1;\n}\n"
);
test!(
    return_spaced_list,
    "@function a() {\n  @return a b;\n}\n\nb {\ncolor: a();\n}\n",
    "b {\n  color: a b;\n}\n"
);
test!(
    single_arg,
    "@function a($c) {\n  @return $c;\n}\n\nb {\ncolor: a(1);\n}\n",
    "b {\n  color: 1;\n}\n"
);
test!(
    return_variable,
    "@function a($a) {\n  @return $a;\n}\n\nb {\ncolor: a(1);\n}\n",
    "b {\n  color: 1;\n}\n"
);
test!(
    function_call_as_arg,
    "@function a($a) {\n  @return $a;\n}\n\nb {\ncolor: a(a(2));\n}\n",
    "b {\n  color: 2;\n}\n"
);
test!(
    function_named_arg_value_variable,
    "$x: red;\n\n@function a($a) {\n  @return $a;\n}\n\nb {\ncolor: a($a: $x);\n}\n",
    "b {\n  color: red;\n}\n"
);
test!(
    function_trailing_comma,
    "@function a($a) {\n  @return $a;\n}\n\nb {\ncolor: a(red,);\n}\n",
    "b {\n  color: red;\n}\n"
);
test!(
    return_no_semicolon,
    "@function a() {\n  @return 1\n}\n\nb {\ncolor: a();\n}\n",
    "b {\n  color: 1;\n}\n"
);
test!(
    two_returns,
    "@function a() {\n  @return 1; @return 2;\n}\n\nb {\ncolor: a();\n}\n",
    "b {\n  color: 1;\n}\n"
);
test!(
    value_after_variable,
    "$x: 0;\na {\n  color: if($x != 0, a, b);\n}\n",
    "a {\n  color: b;\n}\n"
);
test!(
    function_decl_in_ruleset,
    "a {\n  @function foo() {\n    @return 3;\n  }\n  color: foo();\n}\n",
    "a {\n  color: 3;\n}\n"
);
test!(
    function_decl_in_foreign_ruleset,
    "a {\n  @function foo() {\n    @return 3;\n  }\n}\nb {\n  color: foo();\n}\n",
    "b {\n  color: foo();\n}\n"
);
test!(
    global_function_in_scope,
    "@function f() {\n  @return g();\n}\n@function g() {\n  @return false;\n}\na {\n  color: \
     f();\n  color: g();\n}\n",
    "a {\n  color: false;\n  color: false;\n}\n"
);
test!(
    square_bracket_comma_separated,
    "@function foo($a) {\n  @return $a;\n}\n\na {\n  color: foo([a, b]);\n}\n",
    "a {\n  color: [a, b];\n}\n"
);
test!(
    eats_quoted_content,
    "a {\n  color: unquote(\"a, b, c, d\");\n}\n",
    "a {\n  color: a, b, c, d;\n}\n"
);
test!(
    variable_declaration,
    "@function str-replace($string, $search, $replace: \"\") {\n  $index: $string;\n  @return \
     $index;\n}\n\na {\n  color: str-replace(\"a#b#c\", \"#\", \":\");\n}",
    "a {\n  color: \"a#b#c\";\n}\n"
);
error!(
    missing_name,
    "@function() {}", "Error: Expected identifier."
);
error!(
    args_do_not_start_with_var,
    "@function foo(FOO) {}", "Error: expected \")\"."
);
error!(
    double_comma_args,
    "@function foo($a,$b,,) {}", "Error: expected \")\"."
);
error!(
    body_missing_closing_curly_brace,
    "@function foo() {", "Error: expected \"}\"."
);
test!(
    does_not_modify_local_variables,
    "@function bar($color-name) {
        @if $color-name==bar {
            @error bar;
        }

        $color: bar;
        @return null;
    }

    @function foo($a, $b) {
        @return \"success!\";
    }

    a {
        $color: foo;
    
        color: foo(bar($color), bar($color));
    }",
    "a {\n  color: \"success!\";\n}\n"
);
error!(
    denies_function_declaration_in_control_flow,
    "@if true {\n    @function foo() {}\n}\n",
    "Error: Functions may not be declared in control directives."
);
error!(
    denies_function_declaration_with_reserved_name,
    "@function url() {}", "Error: Invalid function name."
);
test!(
    function_finds_outer_local_variable,
    "a {
        $a: red;
    
        @function foo() {
            @return $a;
        }
    
        color: foo();
    }",
    "a {\n  color: red;\n}\n"
);
test!(
    function_ignores_the_scope_with_which_it_was_defined,
    "a {
        $a: red;
        @function foo() {
            @return $a;
        }
        $a: green;
        color: foo();
    }",
    "a {\n  color: green;\n}\n"
);
test!(
    function_defined_and_called_at_toplevel_can_recognize_inner_variables,
    "@function foo($level) {
        $level: abs($level);
      
        @return $level;
    }
    
    @mixin bar($a) {
        a {
            color: $a;
        }
    }
    
    @include bar(foo(-9));",
    "a {\n  color: 9;\n}\n"
);
test!(
    redeclaration_in_inner_scope,
    "@function foo() {
        @return foo;
    }

    a {
        color: foo();
    
        @function foo() {
            @return bar;
        }

        a {
            @function foo() {
                @return baz;
            }
        }

        color: foo();
    }",
    "a {\n  color: foo;\n  color: bar;\n}\n"
);
error!(
    disallows_unknown_at_rule,
    "@function foo() {
        @foo;
    }
    
    a {
        color: foo();
    }",
    "Error: This at-rule is not allowed here."
);
error!(
    disallows_media_query,
    "@function foo() {
        @media screen {};
    }
    
    a {
        color: foo();
    }",
    "Error: This at-rule is not allowed here."
);
error!(
    disallows_at_root,
    "@function foo() {
        @at-root {};
    }
    
    a {
        color: foo();
    }",
    "Error: This at-rule is not allowed here."
);
error!(
    disallows_charset,
    "@function foo() {
        @charset 'utf-8';
    }
    
    a {
        color: foo();
    }",
    "Error: This at-rule is not allowed here."
);
error!(
    disallows_extend,
    "@function foo() {
        @extend a;
    }
    
    a {
        color: foo();
    }",
    "Error: This at-rule is not allowed here."
);
error!(
    disallows_keyframes,
    "@function foo() {
        @keyframes foo {}
    }
    
    a {
        color: foo();
    }",
    "Error: This at-rule is not allowed here."
);
error!(
    disallows_supports,
    "@function foo() {
        @supports foo {}
    }
    
    a {
        color: foo();
    }",
    "Error: This at-rule is not allowed here."
);
error!(
    disallows_import,
    "@function foo() {
        @import \"foo.css\";
    }
    
    a {
        color: foo();
    }",
    "Error: This at-rule is not allowed here."
);
error!(
    disallows_inner_function_declaration,
    "@function foo() {
        @function bar() {}
    }
    
    a {
        color: foo();
    }",
    "Error: This at-rule is not allowed here."
);
error!(
    disallows_include,
    "@function foo() {
        @include bar;
    }
    
    a {
        color: foo();
    }",
    "Error: This at-rule is not allowed here."
);
error!(
    disallows_selectors,
    "@function foo($a) {
        functiona {
            @return $a;
        }
    }

    a {
        color: foo(nul);
    }",
    "Error: Functions can only contain variable declarations and control directives."
);
test!(
    allows_multiline_comment,
    "@function foo($a) {
        /* foo */
        @return $a;
    }

    a {
        color: foo(nul);
    }",
    "a {\n  color: nul;\n}\n"
);
test!(
    allows_multiline_comment_between_args,
    "@function foo /**/ ()  /**/ {
        @return red;
    }

    a {
        color: foo();
    }",
    "a {\n  color: red;\n}\n"
);
