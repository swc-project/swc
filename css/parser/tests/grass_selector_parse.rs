#[macro_use]
mod macros;

test!(
    named_args,
    "a {\n  color: selector-parse($selector: \"c\");\n}\n",
    "a {\n  color: c;\n}\n"
);
test!(
    simple_class,
    "a {\n  color: selector-parse(\".c\");\n}\n",
    "a {\n  color: .c;\n}\n"
);
test!(
    simple_id,
    "a {\n  color: selector-parse(\"#c\");\n}\n",
    "a {\n  color: #c;\n}\n"
);
test!(
    simple_placeholder,
    "a {\n  color: selector-parse(\"%c\");\n}\n",
    "a {\n  color: %c;\n}\n"
);
test!(
    simple_attribute,
    "a {\n  color: selector-parse(\"[c^=d]\");\n}\n",
    "a {\n  color: [c^=d];\n}\n"
);
test!(
    simple_universal,
    "a {\n  color: selector-parse(\"*\");\n}\n",
    "a {\n  color: *;\n}\n"
);
test!(
    simple_pseudo,
    "a {\n  color: selector-parse(\":c\");\n}\n",
    "a {\n  color: :c;\n}\n"
);
test!(
    pseudo_weird_args,
    "a {\n  color: selector-parse(\":c(@#$)\");\n}\n",
    "a {\n  color: :c(@#$);\n}\n"
);
test!(
    pseudo_matches_with_list_args,
    "a {\n  color: selector-parse(\":matches(b, c)\");\n}\n",
    "a {\n  color: :matches(b, c);\n}\n"
);
test!(
    pseudo_element,
    "a {\n  color: selector-parse(\"::c\");\n}\n",
    "a {\n  color: ::c;\n}\n"
);
test!(
    pseudo_element_args,
    "a {\n  color: selector-parse(\"::c(@#$)\");\n}\n",
    "a {\n  color: ::c(@#$);\n}\n"
);
test!(
    pseudo_element_slotted_list_args_output,
    "a {\n  color: selector-parse(\"::slotted(b, c)\");\n}\n",
    "a {\n  color: ::slotted(b, c);\n}\n"
);
test!(
    pseudo_element_slotted_list_args_structure,
    "a {\n  color: selector-parse(\"::slotted(b, c)\") == (append((), \"::slotted(b, c)\"),);\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    multiple_compound,
    "a {\n  color: selector-parse(\"b.c:d\");\n}\n",
    "a {\n  color: b.c:d;\n}\n"
);
test!(
    multiple_complex,
    "a {\n  color: selector-parse(\"b c d\");\n}\n",
    "a {\n  color: b c d;\n}\n"
);
test!(
    sibling_combinator,
    "a {\n  color: selector-parse(\"b ~ c ~ d\");\n}\n",
    "a {\n  color: b ~ c ~ d;\n}\n"
);
test!(
    adjacent_combinator,
    "a {\n  color: selector-parse(\"b + c + d\");\n}\n",
    "a {\n  color: b + c + d;\n}\n"
);
test!(
    child_combinator,
    "a {\n  color: selector-parse(\"b > c > d\");\n}\n",
    "a {\n  color: b > c > d;\n}\n"
);
test!(
    comma_and_space_list,
    "a {\n  color: selector-parse(\"b c, d e, f g\");\n}\n",
    "a {\n  color: b c, d e, f g;\n}\n"
);
error!(
    invalid_selector,
    "a {\n  color: selector-parse(\"!!!!!!!!\");\n}\n", "Error: $selector: expected selector."
);
error!(
    selector_contains_curly_brace,
    "a {\n  color: selector-parse(\"a {\");\n}\n", "Error: $selector: expected selector."
);
