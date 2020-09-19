#[macro_use]
mod macros;

error!(
    variable_after_varargs,
    "@function foo($a..., $b) {\n  @return $a;\n}\n", "Error: expected \")\"."
);
error!(
    varargs_one_period,
    "@function foo($a.) {\n  @return $a;\n}\n", "Error: expected \".\"."
);
error!(
    varargs_two_periods,
    "@function foo($a..) {\n  @return $a;\n}\n", "Error: expected \".\"."
);
test!(
    mixin_varargs_are_comma_separated,
    "@mixin foo($a...) {\n  color: $a;\n}\n\na {\n  @include foo(1, 2, 3, 4, 5);\n}\n",
    "a {\n  color: 1, 2, 3, 4, 5;\n}\n"
);
test!(
    function_varargs_are_comma_separated,
    "@function foo($a...) {\n  @return $a;\n}\n\na {\n  color: foo(1, 2, 3, 4, 5);\n}\n",
    "a {\n  color: 1, 2, 3, 4, 5;\n}\n"
);
test!(
    default_args_are_lazily_evaluated,
    "$da: a;\n\n@mixin foo($x: $da) {\n  color: $x;\n}\n$da: b;\n\na {\n  @include foo();\n}\n",
    "a {\n  color: b;\n}\n"
);
test!(
    variable_being_subtracted,
    "$index: 1;\n\n@function foo($a) {\n  @return $a;\n}\n\na {\n  color: foo($index - 1);\n}\n",
    "a {\n  color: 0;\n}\n"
);
test!(
    parens_in_default_arg_value,
    "@function foo($arg1: bar()) {\n    @return true;\n}\n\na {\n    color: foo();\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    self_referential_default_arg_value,
    "@function foo($a, $b: $a) {\n    @return $b;\n}\n\na {\n    color: foo(2);\n}\n",
    "a {\n  color: 2;\n}\n"
);
test!(
    arg_errors_are_lazy_for_if,
    "a {\n  color: if(false, unit(foo), red);\n}\n",
    "a {\n  color: red;\n}\n"
);
error!(
    #[ignore = "expects incorrect char, '{'"]
    nothing_after_open,
    "a { color:rgb(; }", "Error: expected \")\"."
);
error!(
    nothing_after_open_paren_in_fn_args,
    "@function foo(", "Error: expected \")\"."
);
error!(
    args_are_evaluated_eagerly,
    "@function foo($a) {\n    @return foo;\n}\n\na {\n    color: foo(unit(bar));\n}\n",
    "Error: $number: bar is not a number."
);
test!(
    variable_is_only_hyphens,
    "$--: red;

    a {
        color: foo($--);
    }",
    "a {\n  color: foo(red);\n}\n"
);
test!(
    no_space_after_colon_in_keyword_arg,
    "@function foo($a) {
        @return $a;
    }

    $b: red;

    a {
        color: foo($a:$b);
    }",
    "a {\n  color: red;\n}\n"
);
test!(
    comment_after_comma_in_func_args,
    "@mixin a(
      $foo,//foo
    ) {
        color: $foo;
    }

    a {
        @include a(red);
    }",
    "a {\n  color: red;\n}\n"
);
test!(
    filter_one_arg,
    "a {\n  color: foo(a=a);\n}\n",
    "a {\n  color: foo(a=a);\n}\n"
);
test!(
    filter_two_args,
    "a {\n  color: foo(a=a, b=b);\n}\n",
    "a {\n  color: foo(a=a, b=b);\n}\n"
);
test!(
    filter_whitespace,
    "a {\n  color: foo(   a  =  a  );\n}\n",
    "a {\n  color: foo(a=a);\n}\n"
);
test!(
    filter_whitespace_list,
    "a {\n  color: foo( A  a  =  a  );\n}\n",
    "a {\n  color: foo(A a=a);\n}\n"
);
test!(
    filter_function_call,
    "a {\n  color: foo(hue(green)=hue(green));\n}\n",
    "a {\n  color: foo(120deg=120deg);\n}\n"
);
test!(
    filter_addition,
    "a {\n  color: foo(1+1=1+1);\n}\n",
    "a {\n  color: foo(2=2);\n}\n"
);
test!(
    filter_splat_of_single_value,
    "a {\n  color: foo(a=a...);\n}\n",
    "a {\n  color: foo(a=a);\n}\n"
);
test!(
    filter_splat_of_list,
    "a {\n  color: foo(a=[a, b]...);\n}\n",
    "a {\n  color: foo(a=[a, b]);\n}\n"
);
test!(
    filter_both_null,
    "a {\n  color: foo(null=null);\n}\n",
    "a {\n  color: foo(=);\n}\n"
);
error!(
    filter_splat_missing_third_period,
    "a {\n  color: foo(1 + 1 = a..);\n}\n", "Error: expected \".\"."
);
error!(
    filter_invalid_css_value,
    "a {\n  color: foo((a: b)=a);\n}\n", "Error: (a: b) isn't a valid CSS value."
);
error!(
    filter_nothing_before_equal,
    "a {\n  color: foo(=a);\n}\n", "Error: Expected expression."
);
error!(
    filter_nothing_after_equal,
    "a {\n  color: foo(a=);\n}\n", "Error: Expected expression."
);
error!(
    filter_equal_is_last_char,
    "a {\n  color: foo(a=", "Error: Expected expression."
);
error!(
    filter_value_after_equal_is_last_char,
    "a {\n  color: foo(a=a", "Error: expected \")\"."
);
error!(
    unclosed_paren_in_nested_args,
    "a { color: a(b(red); }", "Error: expected \")\"."
);
error!(
    filter_rhs_missing_closing_paren,
    "a { color: lighten(red=(green); }", "Error: expected \")\"."
);
test!(
    space_after_loud_comment,
    "@mixin foo($x) {
        color: $x;
    }

    a {
      @include foo($x /* blah */ : kwd-y);
    }",
    "a {\n  color: kwd-y;\n}\n"
);
test!(
    quoted_string_as_default_argument_value,
    r#"@function foo($font-family: 'Roboto, "Helvetica Neue", sans-serif') {
        @return $font-family;
    }

    a {
        color: foo();
    }"#,
    "a {\n  color: 'Roboto, \"Helvetica Neue\", sans-serif';\n}\n"
);
test!(
    args_do_not_affect_existing_outer_variables,
    "@mixin mixin2($a) {
        color: $a;
    }

    @mixin mixin1($a) {
        color: $a;
        @include mixin2(bar);
        color: $a;
    }

    a {
        @include mixin1(foo);
    }",
    "a {\n  color: foo;\n  color: bar;\n  color: foo;\n}\n"
);
