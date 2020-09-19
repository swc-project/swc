#[macro_use]
mod grass_macros;

grass_test!(
    basic_mixin,
    "@mixin a {\n  color: red;\n}\n\nb {\n  @include a;\n}\n",
    "b {\n  color: red;\n}\n"
);
grass_test!(empty_mixin, "@mixin a {}\n\nb {\n  @include a;\n}\n", "");
grass_test!(
    just_a_comment,
    "@mixin foo() {\n  /* begin foo */\n}\n\na {\n    @include foo();\n}\n",
    "a {\n  /* begin foo */\n}\n"
);
grass_test!(
    mixin_two_styles,
    "@mixin a {\n  color: red;\n  color: blue;\n}\n\nb {\n  @include a;\n}\n",
    "b {\n  color: red;\n  color: blue;\n}\n"
);
grass_test!(
    mixin_ruleset,
    "@mixin a {\n  b {\n    color: red;\n  }\n}\nb {\n  @include a;\n}\n",
    "b b {\n  color: red;\n}\n"
);
grass_test!(
    mixin_two_rulesets,
    "@mixin a {\n  b {\n    color: red;\n  }\n  c {\n    color: blue;\n  }\n}\nd {\n  @include \
     a;\n}\n",
    "d b {\n  color: red;\n}\nd c {\n  color: blue;\n}\n"
);
grass_test!(
    mixin_ruleset_and_style,
    "@mixin a {\n  b {\n    color: red;\n  }\n  color: blue;\n}\nd {\n  @include a;\n}\n",
    "d {\n  color: blue;\n}\nd b {\n  color: red;\n}\n"
);
grass_test!(
    mixin_style_and_ruleset,
    "@mixin a {\n  color: blue;\n  b {\n    color: red;\n}\n}\nd {\n  @include a;\n}\n",
    "d {\n  color: blue;\n}\nd b {\n  color: red;\n}\n"
);
grass_test!(
    mixin_nested_rulesets,
    "@mixin a {\n  b {\n    c {\n      color: red;\n}\n}\n}\nd {\n  @include a;\n}\n",
    "d b c {\n  color: red;\n}\n"
);
grass_test!(
    mixin_removes_empty_ruleset,
    "@mixin a {\n  color: red; b {\n}\n}\nd {\n  @include a;\n}\n",
    "d {\n  color: red;\n}\n"
);
grass_test!(
    mixin_variable_scope_one_ruleset,
    "@mixin a {\n  $a: blue;\nb {\n  $a: red;\n}  color: $a\n}\nd {\n  @include a;\n}\n",
    "d {\n  color: red;\n}\n"
);
grass_test!(
    mixin_no_args,
    "@mixin a {\n  color: red;\n}\nd {\n  @include a();\n}\n",
    "d {\n  color: red;\n}\n"
);
grass_test!(
    mixin_single_arg,
    "@mixin a($b) {\n  color: $b;\n}\nd {\n  @include a(red);\n}\n",
    "d {\n  color: red;\n}\n"
);
grass_test!(
    mixin_two_args,
    "@mixin a($b, $c) {\n  color: $b;\n  color: $c\n}\nd {\n  @include a(red, blue);\n}\n",
    "d {\n  color: red;\n  color: blue;\n}\n"
);
grass_test!(
    mixin_arg_trailing_comma,
    "@mixin a($b, $c,) {\n  color: $b;\n  color: $c\n}\nd {\n  @include a(red, blue);\n}\n",
    "d {\n  color: red;\n  color: blue;\n}\n"
);
grass_test!(
    mixin_property_interpolation,
    "@mixin a($b) {\n  #{$b}: red;\n}\nd {\n  @include a(color);\n}\n",
    "d {\n  color: red;\n}\n"
);
grass_test!(
    mixin_style_interpolation,
    "@mixin a($b) {\n  color: #{$b};\n}\nd {\n  @include a(red);\n}\n",
    "d {\n  color: red;\n}\n"
);
grass_test!(
    mixin_simple_default_value,
    "@mixin a($b: red) {\n  color: $b;\n}\nd {\n  @include a;\n}\n",
    "d {\n  color: red;\n}\n"
);
grass_test!(
    mixin_second_value_default,
    "@mixin a($a, $b: blue) {\n  color: $a $b;\n}\nd {\n  @include a(red);\n}\n",
    "d {\n  color: red blue;\n}\n"
);
grass_test!(
    mixin_two_default_values,
    "@mixin a($a: red, $b: blue) {\n  color: $a $b;\n}\nd {\n  @include a;\n}\n",
    "d {\n  color: red blue;\n}\n"
);
grass_test!(
    mixin_override_default_value_positionally,
    "@mixin a($a: red) {\n  color: $a;\n}\nd {\n  @include a(blue);\n}\n",
    "d {\n  color: blue;\n}\n"
);
grass_test!(
    mixin_keyword_arg,
    "@mixin a($a) {\n  color: $a;\n}\nd {\n  @include a($a: blue);\n}\n",
    "d {\n  color: blue;\n}\n"
);
grass_test!(
    mixin_keyword_arg_override_default,
    "@mixin a($a: red) {\n  color: $a;\n}\nd {\n  @include a($a: blue);\n}\n",
    "d {\n  color: blue;\n}\n"
);
grass_test!(
    mixin_keyword_applies_to_second_arg,
    "@mixin a($a: red, $b) {\n  color: $a $b;\n}\nd {\n  @include a($b: blue);\n}\n",
    "d {\n  color: red blue;\n}\n"
);
grass_test!(
    mixin_two_keywords,
    "@mixin a($a, $b) {\n  color: $a $b;\n}\nd {\n  @include a($a: red, $b: blue);\n}\n",
    "d {\n  color: red blue;\n}\n"
);
grass_test!(
    mixin_two_keywords_wrong_direction,
    "@mixin a($a, $b) {\n  color: $a $b;\n}\nd {\n  @include a($b: blue, $a: red);\n}\n",
    "d {\n  color: red blue;\n}\n"
);
grass_test!(
    variable_in_call_args,
    "@mixin a($a) {\n  color: $a;\n}\nd {\n  $c: red;\n  @include a($c);\n}\n",
    "d {\n  color: red;\n}\n"
);
grass_test!(
    comment_before_positional_call_arg,
    "@mixin a($a) {\n  color: $a;\n}\nd {\n  @include a(/*foo*/red);\n}\n",
    "d {\n  color: red;\n}\n"
);
grass_test!(
    comment_after_positional_call_arg,
    "@mixin a($a) {\n  color: $a;\n}\nd {\n  @include a(red/*foo*/);\n}\n",
    "d {\n  color: red;\n}\n"
);
grass_test!(
    comment_before_keyword_call_arg_val,
    "@mixin a($a) {\n  color: $a;\n}\nd {\n  @include a($a: /*foo*/red);\n}\n",
    "d {\n  color: red;\n}\n"
);
grass_test!(
    comment_after_keyword_call_arg_val,
    "@mixin a($a) {\n  color: $a;\n}\nd {\n  @include a($a: red/*foo*/);\n}\n",
    "d {\n  color: red;\n}\n"
);
grass_test!(
    comment_before_keyword_call_arg_name,
    "@mixin a($a) {\n  color: $a;\n}\nd {\n  @include a(/*foo*/$a: red);\n}\n",
    "d {\n  color: red;\n}\n"
);
grass_test!(
    comment_after_keyword_call_arg_name,
    "@mixin a($a) {\n  color: $a;\n}\nd {\n  @include a($a/*foo*/: red);\n}\n",
    "d {\n  color: red;\n}\n"
);
grass_test!(
    toplevel_include,
    "@mixin a {\n  a {\n    color: red;\n  }\n}\n\n@include a;\n",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    include_list,
    "@mixin foo($x) {\n  color: $x;\n}\na {\n  @include foo(0px 0px 0px 0px #ef8086 inset \
     !important);\n}\n",
    "a {\n  color: 0px 0px 0px 0px #ef8086 inset !important;\n}\n"
);
grass_test!(
    content_without_variable,
    "@mixin foo {\n  @content;\n}\n\na {\n  @include foo {\n    color: red;\n  }\n}\n",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    content_with_variable,
    "@mixin foo($a) {\n  @content;\n}\n\na {\n  @include foo(red) {\n    color: red;\n  }\n}\n",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    mixin_style_does_not_end_with_semicolon,
    "@mixin foo {\n  color: red\n}\n\na {\n  @include foo;\n}\n",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    args_hyphen_arg_allows_underscore,
    "@mixin foo($a-b) {\n  color: $a-b;\n  color: $a_b;\n}\na {\n  @include foo($a_b: a);\n  \
     @include foo($a-b: a);\n}\n",
    "a {\n  color: a;\n  color: a;\n  color: a;\n  color: a;\n}\n"
);
grass_test!(
    args_underscore_arg_allows_hyphen,
    "@mixin foo($a_b) {\n  color: $a-b;\n  color: $a_b;\n}\na {\n  @include foo($a_b: a);\n  \
     @include foo($a-b: a);\n}\n",
    "a {\n  color: a;\n  color: a;\n  color: a;\n  color: a;\n}\n"
);
grass_test!(
    control_flow_in_content,
    "@mixin foo {\n    @content;\n}\n\na {\n    @include foo {@if true {color: red;}}\n}\n",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    content_in_control_flow,
    "@mixin foo() {\n    @if true {\n        @content;\n    }\n}\n\na {\n    @include foo {\n        color: red;\n    }\n}\n",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    content_inside_unknown_at_rule,
    "@mixin foo() {\n    @foo (max-width: max) {\n        @content;\n    }\n}\n\na {\n    \
     @include foo {\n        color: red;\n    }\n}\n",
    "@foo (max-width: max) {\n  a {\n    color: red;\n  }\n}\n"
);
grass_test!(
    content_inside_media,
    "@mixin foo() {\n    @media (max-width: max) {\n        @content;\n    }\n}\n\na {\n    \
     @include foo {\n        color: red;\n    }\n}\n",
    "@media (max-width: max) {\n  a {\n    color: red;\n  }\n}\n"
);
grass_error!(
    function_inside_mixin,
    "@mixin foo() {\n    @function bar() {\n        @return foo;\n    }\n}\n\na {\n    @include \
     foo {\n        color: red;\n    }\n}\n",
    "Error: Mixins may not contain function declarations."
);
grass_error!(
    content_inside_control_flow_outside_mixin,
    "a {\n    @if true {\n        @content;\n    }\n}\n",
    "Error: @content is only allowed within mixin declarations."
);
grass_error!(
    undefined_mixin,
    "a {@include foo;}",
    "Error: Undefined mixin."
);
grass_error!(
    body_missing_closing_curly_brace,
    "@mixin foo() {",
    "Error: expected \"}\"."
);
grass_test!(
    include_empty_args_no_semicolon,
    "@mixin c {}\n\na {\n    @include c()\n}\n",
    ""
);
grass_test!(
    local_variable_declared_before_mixin_is_still_in_scope,
    "@mixin foo {}\n\na {\n    $a: red;\n    @include foo;\n    color: $a;\n}\n",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    empty_content_args,
    "@mixin foo {
        @content()
    }

    a {
        @include foo {
            color: red;
        };
    }",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    empty_content_args_using_empty_args,
    "@mixin foo {
        @content()
    }

    a {
        @include foo using () {
            color: red;
        };
    }",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    content_using_one_arg,
    "@mixin foo {
        @content(red)
    }

    a {
        @include foo using ($a) {
            color: $a;
        }
    }",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    multiple_content_using_different_args,
    "@mixin foo {
        @content(1);
        @content(2);
    }

    @mixin bar {
        @include foo using ($a) {
            color: $a
        }
    }

    a {
        @include bar;
    }",
    "a {\n  color: 1;\n  color: 2;\n}\n"
);
grass_test!(
    chained_content,
    "@mixin foo {
        @content;
    }

    @mixin bar {
        @include foo {
            @content;
        }
    }

    a {
        @include bar {
            color: red;
        }
    }",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    content_can_access_local_variables,
    "@mixin foo {
        @content;
    }

    a {
        $bar: red;

        @include foo {
            color: $bar;
        }
    }",
    "a {\n  color: red;\n}\n"
);
grass_error!(
    content_using_too_many_args,
    "@mixin foo {
        @content(red, blue)
    }

    a {
        @include foo using ($a) {
            color: $a;
        }
    }",
    "Error: Only 1 argument allowed, but 2 were passed."
);
grass_error!(
    content_using_too_few_args,
    "@mixin foo {
        @content()
    }

    a {
        @include foo using ($a) {
            color: $a;
        }
    }",
    "Error: Missing argument $a."
);
grass_test!(
    inner_mixin_can_modify_scope,
    "a {
        $a: red;
        @mixin foo {
            color: $a;
        }
        $a: green;
        @include foo;
    }",
    "a {\n  color: green;\n}\n"
);
grass_test!(
    redeclaration_in_inner_scope,
    "@mixin foo {
        color: foo;
    }

    a {
        @include foo();

        @mixin foo {
            color: bar;
        }

        a {
            @mixin foo {
                color: baz;
            }
        }

        @include foo();
    }",
    "a {\n  color: foo;\n  color: bar;\n}\n"
);
grass_test!(
    three_depth_of_content,
    "@mixin foo($arg) {
        @include bar {
            color: $arg;
        }
    }

    @mixin bar {
        @include baz {
          @content;
        }
    }

    @mixin baz {
        @content;
    }

    @mixin font-size($value) {
      @include foo($value);
    }

    a {
        @include font-size(1rem);
    }",
    "a {\n  color: 1rem;\n}\n"
);
grass_test!(
    can_access_global_variables_set_after_other_include,
    "$x: true;

    @mixin foobar() {
        @if $x {
            $x: false !global;
            color: foo;
        }

        @else {
            $x: true !global;
            color: bar;
        }
    }

    a {
        @include foobar();
        $x: true !global;
        @include foobar();
    }",
    "a {\n  color: foo;\n  color: foo;\n}\n"
);
grass_test!(
    can_access_variables_declared_before_content,
    "@mixin foo {
        $a: red;

        @content;

        color: $a;
    }

    a {
      @include foo;
    }",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    content_contains_variable_declared_in_outer_scope_not_declared_at_root,
    "a {
        $a: red;

        @mixin foo {
            @content;
        }

        @include foo {
            color: $a;
        }
    }",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    content_contains_variable_declared_in_outer_scope_declared_at_root,
    "@mixin foo {
        @content;
    }

    a {
        $a: red;

        @include foo {
            color: $a;
        }
    }",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    content_contains_variable_declared_in_outer_scope_not_declared_at_root_and_modified,
    "a {
        $a: red;

        @mixin foo {
            $a: green;
            @content;
        }

        @include foo {
            color: $a;
        }
    }",
    "a {\n  color: green;\n}\n"
);
grass_test!(
    content_contains_variable_declared_in_outer_scope_declared_at_root_and_modified,
    "@mixin foo {
        $a: green;
        @content;
    }

    a {
        $a: red;


        @include foo {
            color: $a;
        }
    }",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    content_default_arg_value_no_parens,
    "a {
        @mixin foo {
            @content;
        }

        @include foo using ($a: red) {
            color: $a;
        }
    }",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    space_between_content_and_args,
    "space-after-content {
        @mixin mixin {
            @content /**/ (value1, value2);
        }

        @include mixin using ($arg1, $arg2) {
            arg1: $arg1;
            arg2: $arg2;
        }
    }",
    "space-after-content {\n  arg1: value1;\n  arg2: value2;\n}\n"
);
grass_test!(
    space_between_mixin_and_args,
    "@mixin foo /**/ ()  /**/ {
        color: red;
    }

    a {
        @include foo;
    }",
    "a {\n  color: red;\n}\n"
);
grass_error!(
    mixin_in_function,
    "@function foo() {
        @mixin bar {}
    }
    a {
        color: foo();
    }
    ",
    "Error: This at-rule is not allowed here."
);
grass_error!(
    mixin_in_mixin,
    "@mixin foo {
        @mixin bar {}
    }
    a {
        @include foo;
    }
    ",
    "Error: Mixins may not contain mixin declarations."
);
grass_error!(
    mixin_in_control_directives,
    "@if true {
        @mixin bar {}
    }",
    "Error: Mixins may not be declared in control directives."
);
grass_error!(
    does_not_allow_interpolation_in_name_of_declaration,
    "@mixin n#{a}me {
        color: red;
    }

    a {
        @include name;
    }",
    "Error: expected \"{\"."
);
