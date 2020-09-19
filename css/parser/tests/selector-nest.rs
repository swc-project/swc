#[macro_use]
mod macros;

test!(
    nest_one_arg,
    "a {\n  color: selector-nest(\"c\");\n}\n",
    "a {\n  color: c;\n}\n"
);
test!(
    nest_many_args,
    "a {\n  color: selector-nest(\"c\", \"d\", \"e\", \"f\", \"g\");\n}\n",
    "a {\n  color: c d e f g;\n}\n"
);
test!(
    nest_parent_alone,
    "a {\n  color: selector-nest(\"c\", \"&\");\n}\n",
    "a {\n  color: c;\n}\n"
);
test!(
    nest_parent_compound,
    "a {\n  color: selector-nest(\"c\", \"&.d\");\n}\n",
    "a {\n  color: c.d;\n}\n"
);
test!(
    nest_parent_with_suffix,
    "a {\n  color: selector-nest(\"c\", \"&d\");\n}\n",
    "a {\n  color: cd;\n}\n"
);
test!(
    nest_complex_parent_compound,
    "a {\n  color: selector-nest(\"c\", \"d &.e\");\n}\n",
    "a {\n  color: d c.e;\n}\n"
);
test!(
    nest_complex_super_parent_compound,
    "a {\n  color: selector-nest(\"c d\", \"e &.f\");\n}\n",
    "a {\n  color: e c d.f;\n}\n"
);
test!(
    nest_parent_in_special_pseudo,
    "a {\n  color: selector-nest(\"c\", \":matches(&)\");\n}\n",
    "a {\n  color: :matches(c);\n}\n"
);
test!(
    nest_complex_super_parent_in_special_pseudo,
    "a {\n  color: selector-nest(\"c d\", \":matches(&)\");\n}\n",
    "a {\n  color: :matches(c d);\n}\n"
);
test!(
    nest_multiple_parent,
    "a {\n  color: selector-nest(\"c\", \"&.d &.e\");\n}\n",
    "a {\n  color: c.d c.e;\n}\n"
);
test!(
    nest_compound_parent_in_list,
    "a {\n  color: selector-nest(\"c\", \"&.d, e\");\n}\n",
    "a {\n  color: c.d, c e;\n}\n"
);
test!(
    nest_list_super,
    "a {\n  color: selector-nest(\"c, d\", \"e\");\n}\n",
    "a {\n  color: c e, d e;\n}\n"
);
test!(
    nest_list_sub,
    "a {\n  color: selector-nest(\"c\", \"d, e\");\n}\n",
    "a {\n  color: c d, c e;\n}\n"
);
test!(
    nest_three_args_list,
    "a {\n  color: selector-nest(\"c, d\", \"e, f\", \"g, h\");\n}\n",
    "a {\n  color: c e g, c e h, c f g, c f h, d e g, d e h, d f g, d f h;\n}\n"
);
test!(
    nest_super_list_parent_alone,
    "a {\n  color: selector-nest(\"c, d\", \"&\");\n}\n",
    "a {\n  color: c, d;\n}\n"
);
test!(
    nest_super_list_parent_compound,
    "a {\n  color: selector-nest(\"c, d\", \"&.e\");\n}\n",
    "a {\n  color: c.e, d.e;\n}\n"
);
test!(
    nest_super_list_parent_suffix,
    "a {\n  color: selector-nest(\"c, d\", \"&e\");\n}\n",
    "a {\n  color: ce, de;\n}\n"
);
test!(
    nest_super_list_parent_complex,
    "a {\n  color: selector-nest(\"c, d\", \"e &.f\");\n}\n",
    "a {\n  color: e c.f, e d.f;\n}\n"
);
test!(
    nest_super_list_parent_inside_pseudo,
    "a {\n  color: selector-nest(\"c, d\", \":matches(&)\");\n}\n",
    "a {\n  color: :matches(c, d);\n}\n"
);
test!(
    nest_super_list_multiple_parent,
    "a {\n  color: selector-nest(\"c, d\", \"&.e &.f\");\n}\n",
    "a {\n  color: c.e c.f, c.e d.f, d.e c.f, d.e d.f;\n}\n"
);
test!(
    nest_super_list_sub_list_contains_parent,
    "a {\n  color: selector-nest(\"c, d\", \"&.e, f\");\n}\n",
    "a {\n  color: c.e, c f, d.e, d f;\n}\n"
);
test!(
    nest_comma_separated_list_as_super,
    "a {\n  color: selector-nest((c, d e), \"f\");\n}\n",
    "a {\n  color: c f, d e f;\n}\n"
);
test!(
    nest_comma_separated_list_as_sub,
    "a {\n  color: selector-nest(\"c\", (d, e f));\n}\n",
    "a {\n  color: c d, c e f;\n}\n"
);
error!(
    #[ignore = "https://github.com/sass/dart-sass/issues/966"]
    disallows_parent_selector_as_first_arg,
    "a {\n  color: selector-nest(\"&\");\n}\n", "Error: Parent selectors aren't allowed here."
);
error!(
    disallows_parent_not_at_start_of_compound_selector_attribute,
    "a {\n  color: selector-nest(\"[d]&\");\n}\n",
    "Error: \"&\" may only used at the beginning of a compound selector."
);
error!(
    disallows_parent_not_at_start_of_compound_selector_type,
    "a {\n  color: selector-nest(\"d&\");\n}\n",
    "Error: \"&\" may only used at the beginning of a compound selector."
);
error!(
    improperly_terminated_attribute_selector_first_arg,
    "a {\n  color: selector-nest(\"[d\");\n}\n", "Error: expected more input."
);
error!(
    improperly_terminated_attribute_selector_second_arg,
    "a {\n  color: selector-nest(\"c\", \"[d\");\n}\n", "Error: expected more input."
);
error!(
    unquoted_integer_first_arg,
    "a {\n  color: selector-nest(1);\n}\n",
    "Error: $selectors: 1 is not a valid selector: it must be a string, a list of strings, or a list of lists of strings."
);
error!(
    unquoted_integer_second_arg,
    "a {\n  color: selector-nest(\"c\", 1);\n}\n",
    "Error: $selectors: 1 is not a valid selector: it must be a string, a list of strings, or a list of lists of strings."
);
error!(
    empty_args,
    "a {\n  color: selector-nest();\n}\n",
    "Error: $selectors: At least one selector must be passed."
);
