#[macro_use]
mod macros;

test!(
    classes_single,
    "a {\n  color: selector-append(\".c\", \".d\");\n}\n",
    "a {\n  color: .c.d;\n}\n"
);
test!(
    classes_multiple,
    "a {\n  color: selector-append(\".c, .d\", \".e, .f\");\n}\n",
    "a {\n  color: .c.e, .c.f, .d.e, .d.f;\n}\n"
);
test!(
    suffix_single,
    "a {\n  color: selector-append(\".c\", \"d\");\n}\n",
    "a {\n  color: .cd;\n}\n"
);
test!(
    suffix_multiple,
    "a {\n  color: selector-append(\".c, .d\", \"e, f\");\n}\n",
    "a {\n  color: .ce, .cf, .de, .df;\n}\n"
);
test!(
    suffix_descendant,
    "a {\n  color: selector-append(\"c d\", \"e f\");\n}\n",
    "a {\n  color: c de f;\n}\n"
);
test!(
    one_arg,
    "a {\n  color: selector-append(\".c.d\");\n}\n",
    "a {\n  color: .c.d;\n}\n"
);
test!(
    many_args,
    "a {\n  color: selector-append(\".c\", \".d\", \".e\");\n}\n",
    "a {\n  color: .c.d.e;\n}\n"
);
test!(
    paren_first_arg,
    "a {\n  color: selector-append((c, d e), f);\n}\n",
    "a {\n  color: cf, d ef;\n}\n"
);
test!(
    paren_second_arg,
    "a {\n  color: selector-append(c, (d, e f));\n}\n",
    "a {\n  color: cd, ce f;\n}\n"
);
test!(
    output_structure,
    "a {\n  color: selector-append(\"c d, e f\", \"g\") == (\"c\" \"dg\", \"e\" \"fg\");\n}\n",
    "a {\n  color: true;\n}\n"
);
error!(
    universal_in_second_arg,
    "a {\n  color: selector-append(\".c\", \"*\");\n}\n", "Error: Can't append * to .c."
);
error!(
    parent_in_second_arg,
    "a {\n  color: selector-append(\"c\", \"&\");\n}\n",
    "Error: Parent selectors aren't allowed here."
);
error!(
    malformed_selector_in_first_arg,
    "a {\n  color: selector-append(\"[c\", \".d\");\n}\n", "Error: expected more input."
);
error!(
    invalid_type_in_first_arg,
    "a {\n  color: selector-append(\"c\", 1);\n}\n",
    "Error: $selectors: 1 is not a valid selector: it must be a string, a list of strings, or a list of lists of strings."
);
error!(
    no_args,
    "a {\n  color: selector-append();\n}\n",
    "Error: $selectors: At least one selector must be passed."
);
