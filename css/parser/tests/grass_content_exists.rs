#[macro_use]
mod grass_macros;

error!(
    outside_mixin,
    "a {\n    color: content-exists();\n}\n",
    "Error: content-exists() may only be called within a mixin."
);
test!(
    include_no_braces_no_args,
    "@mixin foo {\n    color: content-exists();\n}\n\na {\n    @include foo;\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    include_no_braces_empty_args,
    "@mixin foo {\n    color: content-exists();\n}\n\na {\n    @include foo();\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    include_empty_braces_no_args,
    "@mixin foo {\n    color: content-exists();\n    @content;\n}\n\na {\n    @include foo{};\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    include_style_inside_braces_no_args,
    "@mixin foo {\n    color: content-exists();\n    @content;\n}\n\na {\n    @include foo{color: \
     red;};\n}\n",
    "a {\n  color: true;\n  color: red;\n}\n"
);
test!(
    include_style_inside_braces_missing_semicolon_no_args,
    "@mixin foo {\n    color: content-exists();\n    @content;\n}\n\na {\n    @include foo{color: \
     red};\n}\n",
    "a {\n  color: true;\n  color: red;\n}\n"
);
test!(
    chained_mixin_second_doesnt_have_content,
    "@mixin foo {
        color: content-exists();
    }

    @mixin bar {
        @include foo;
        @content;
    }

    a {
        @include bar {}
    }",
    "a {\n  color: false;\n}\n"
);
error!(
    #[ignore = "haven't yet figured out a good way to check for whether an @content block exists"]
    include_empty_braces_no_args_no_at_content,
    "@mixin foo {\n    color: content-exists();\n}\n\na {\n    @include foo{};\n}\n",
    "Error: Mixin doesn't accept a content block."
);
