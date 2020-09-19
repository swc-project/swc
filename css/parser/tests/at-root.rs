#[macro_use]
mod macros;

test!(
    simple_nested,
    ".foo {\n  @at-root {\n    .bar {a: b}\n  }\n}\n",
    ".bar {\n  a: b;\n}\n"
);
test!(
    with_selector,
    ".foo {\n  @at-root .bar {a: b}\n}\n",
    ".bar {\n  a: b;\n}\n"
);
test!(
    with_selector_in_mixin,
    "@mixin bar {\n  @at-root .bar {a: b}\n}\n\n.foo {\n  @include bar;\n}\n",
    ".bar {\n  a: b;\n}\n"
);
test!(
    with_super_selector,
    ".foo {\n  @at-root & {\n    a: b;\n  }\n}\n",
    ".foo {\n  a: b;\n}\n"
);
test!(
    nested_with_super_selector,
    ".foo {\n  @at-root & {\n    .bar {\n      @at-root & {\n        a: b;\n      }\n    }\n  }\n}\n",
    ".foo .bar {\n  a: b;\n}\n"
);
test!(
    deeply_nested_with_rulesets_and_styles,
    ".foo {\n  @at-root .bar {\n    a: b;\n    c {\n      d: e;\n      foo {\n        bar: baz;\n      }\n      h: j;\n    }\n    f: g;\n  }\n}\n",
    ".bar {\n  a: b;\n  f: g;\n}\n.bar c {\n  d: e;\n  h: j;\n}\n.bar c foo {\n  bar: baz;\n}\n"
);
test!(
    super_selector_inside_with_nothing,
    "foo {\n  @at-root {\n    & {\n      color: bar;\n    }\n  }\n}\n",
    "foo {\n  color: bar;\n}\n"
);
test!(
    interpolated_super_selector_with_nothing,
    "test {\n  @at-root {\n    #{&}post {\n      foo {\n        bar: baz;\n      }\n    }\n  }\n}\n",
    "testpost foo {\n  bar: baz;\n}\n"
);
test!(
    with_ampersand_single,
    "test {\n  @at-root {\n    #{&}post {\n      foo {\n        bar: baz;\n      }\n    }\n  }\n}\n",
    "testpost foo {\n  bar: baz;\n}\n"
);
test!(
    root_interpolated_ampersand,
    "@at-root {\n  #{&}post {\n    foo {\n      bar: baz;\n    }\n  }\n}\n",
    "post foo {\n  bar: baz;\n}\n"
);
test!(
    nested_prefix_interpolated_ampersand,
    "test {\n  @at-root {\n    pre#{&} {\n      foo {\n        bar: baz;\n      }\n    }\n  }\n}\n",
    "pretest foo {\n  bar: baz;\n}\n"
);
test!(
    nested_alone_interpolated_ampersand,
    "test {\n  @at-root {\n    #{&} {\n      foo {\n        bar: baz;\n      }\n    }\n  }\n}\n",
    "test foo {\n  bar: baz;\n}\n"
);
test!(
    style_before_at_root,
    "a {}\n\n@at-root {\n    @-ms-viewport { width: device-width; }\n}\n",
    "@-ms-viewport {\n  width: device-width;\n}\n"
);
error!(
    #[ignore = "we do not currently validate missing closing curly braces"]
    missing_closing_curly_brace,
    "@at-root {", "Error: expected \"}\"."
);
