#[macro_use]
mod macros;

test!(
    two_classes,
    "a {\n  color: simple-selectors(\".foo.bar\");\n}\n",
    "a {\n  color: .foo, .bar;\n}\n"
);
test!(
    three_classes,
    "a {\n  color: simple-selectors(\".foo.bar.baz\");\n}\n",
    "a {\n  color: .foo, .bar, .baz;\n}\n"
);
