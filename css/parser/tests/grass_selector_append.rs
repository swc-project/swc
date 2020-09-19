#[macro_use]
mod grass_macros;

grass_test!(
    classes_single,
    "a {\n  color: selector-append(\".c\", \".d\");\n}\n",
    "a {\n  color: .c.d;\n}\n"
);
grass_test!(
    classes_multiple,
    "a {\n  color: selector-append(\".c, .d\", \".e, .f\");\n}\n",
    "a {\n  color: .c.e, .c.f, .d.e, .d.f;\n}\n"
);
grass_test!(
    suffix_single,
    "a {\n  color: selector-append(\".c\", \"d\");\n}\n",
    "a {\n  color: .cd;\n}\n"
);
grass_test!(
    suffix_multiple,
    "a {\n  color: selector-append(\".c, .d\", \"e, f\");\n}\n",
    "a {\n  color: .ce, .cf, .de, .df;\n}\n"
);
grass_test!(
    suffix_descendant,
    "a {\n  color: selector-append(\"c d\", \"e f\");\n}\n",
    "a {\n  color: c de f;\n}\n"
);
grass_test!(
    one_arg,
    "a {\n  color: selector-append(\".c.d\");\n}\n",
    "a {\n  color: .c.d;\n}\n"
);
grass_test!(
    many_args,
    "a {\n  color: selector-append(\".c\", \".d\", \".e\");\n}\n",
    "a {\n  color: .c.d.e;\n}\n"
);
grass_test!(
    paren_first_arg,
    "a {\n  color: selector-append((c, d e), f);\n}\n",
    "a {\n  color: cf, d ef;\n}\n"
);
grass_test!(
    paren_second_arg,
    "a {\n  color: selector-append(c, (d, e f));\n}\n",
    "a {\n  color: cd, ce f;\n}\n"
);
grass_test!(
    output_structure,
    "a {\n  color: selector-append(\"c d, e f\", \"g\") == (\"c\" \"dg\", \"e\" \"fg\");\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_error!(
    universal_in_second_arg,
    "a {\n  color: selector-append(\".c\", \"*\");\n}\n",
    "Error: Can't append * to .c."
);
grass_error!(
    parent_in_second_arg,
    "a {\n  color: selector-append(\"c\", \"&\");\n}\n",
    "Error: Parent selectors aren't allowed here."
);
grass_error!(
    malformed_selector_in_first_arg,
    "a {\n  color: selector-append(\"[c\", \".d\");\n}\n",
    "Error: expected more input."
);
grass_error!(
    invalid_type_in_first_arg,
    "a {\n  color: selector-append(\"c\", 1);\n}\n",
    "Error: $selectors: 1 is not a valid selector: it must be a string, a list of strings, or a \
     list of lists of strings."
);
grass_error!(
    no_args,
    "a {\n  color: selector-append();\n}\n",
    "Error: $selectors: At least one selector must be passed."
);
