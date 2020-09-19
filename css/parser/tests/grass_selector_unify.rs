#[macro_use]
mod grass_macros;

test!(
    no_overlap,
    "a {\n  color: selector-unify(\".c.d\", \".e.f\");\n}\n",
    "a {\n  color: .c.d.e.f;\n}\n"
);
test!(
    partial_overlap,
    "a {\n  color: selector-unify(\".c.d\", \".d.e\");\n}\n",
    "a {\n  color: .c.d.e;\n}\n"
);
test!(
    full_overlap,
    "a {\n  color: selector-unify(\".c.d\", \".c.d\");\n}\n",
    "a {\n  color: .c.d;\n}\n"
);
test!(
    order_element_at_start,
    "a {\n  color: selector-unify(\".c\", \"d\");\n}\n",
    "a {\n  color: d.c;\n}\n"
);
test!(
    order_pseudo_element_at_end,
    "a {\n  color: selector-unify(\"::c\", \".d\");\n}\n",
    "a {\n  color: .d::c;\n}\n"
);
test!(
    order_pseudo_class_at_end,
    "a {\n  color: selector-unify(\":c\", \".d\");\n}\n",
    "a {\n  color: .d:c;\n}\n"
);
test!(
    order_pseudo_element_after_pseudo_class,
    "a {\n  color: selector-unify(\"::c\", \":d\");\n}\n",
    "a {\n  color: :d::c;\n}\n"
);
test!(
    attribute_identical,
    "a {\n  color: selector-unify(\"[a]\", \"[a]\");\n}\n",
    "a {\n  color: [a];\n}\n"
);
test!(
    attribute_distinct,
    "a {\n  color: selector-unify(\"[a]\", \"[b]\");\n}\n",
    "a {\n  color: [a][b];\n}\n"
);
test!(
    class_identical,
    "a {\n  color: selector-unify(\".a\", \".a\");\n}\n",
    "a {\n  color: .a;\n}\n"
);
test!(
    class_distinct,
    "a {\n  color: selector-unify(\".a\", \".b\");\n}\n",
    "a {\n  color: .a.b;\n}\n"
);
test!(
    element_id,
    "a {\n  color: selector-unify(\"a\", \"#b\");\n}\n",
    "a {\n  color: a#b;\n}\n"
);
test!(
    id_identical,
    "a {\n  color: selector-unify(\"#a\", \"#a\");\n}\n",
    "a {\n  color: #a;\n}\n"
);
test!(
    id_distinct,
    "a {\n  color: selector-unify(\"#a\", \"#b\");\n}\n",
    ""
);
test!(
    placeholder_identical,
    "a {\n  color: selector-unify(\"%a\", \"%a\");\n}\n",
    "a {\n  color: %a;\n}\n"
);
test!(
    placeholder_distinct,
    "a {\n  color: selector-unify(\"%a\", \"%b\");\n}\n",
    "a {\n  color: %a%b;\n}\n"
);
test!(
    universal_and_namespace,
    "a {\n  color: selector-unify(\"*\", \"a|b\");\n}\n",
    ""
);
test!(
    universal_and_empty_namespace,
    "a {\n  color: selector-unify(\"*\", \"|b\");\n}\n",
    ""
);
test!(
    universal_and_type,
    "a {\n  color: selector-unify(\"*\", \"a\");\n}\n",
    "a {\n  color: a;\n}\n"
);
test!(
    universal_and_asterisk_namespace,
    "a {\n  color: selector-unify(\"*\", \"*|a\");\n}\n",
    "a {\n  color: a;\n}\n"
);
test!(
    universal_with_namespace_and_same_namespace,
    "a {\n  color: selector-unify(\"a|*\", \"a|b\");\n}\n",
    "a {\n  color: a|b;\n}\n"
);
test!(
    universal_with_namespace_and_different_namespace,
    "a {\n  color: selector-unify(\"a|*\", \"c|b\");\n}\n",
    ""
);
test!(
    universal_with_namespace_and_no_namespace,
    "a {\n  color: selector-unify(\"a|*\", \"|b\");\n}\n",
    ""
);
test!(
    universal_with_namespace_and_asterisk_namespace,
    "a {\n  color: selector-unify(\"a|*\", \"*|b\");\n}\n",
    "a {\n  color: a|b;\n}\n"
);
test!(
    universal_with_empty_namespace_and_empty_namespace,
    "a {\n  color: selector-unify(\"|*\", \"|b\");\n}\n",
    "a {\n  color: |b;\n}\n"
);
test!(
    universal_with_empty_namespace_and_no_namespace,
    "a {\n  color: selector-unify(\"|*\", \"b\");\n}\n",
    ""
);
test!(
    universal_with_empty_namespace_and_asterisk_namespace,
    "a {\n  color: selector-unify(\"|*\", \"*|b\");\n}\n",
    "a {\n  color: |b;\n}\n"
);
test!(
    universal_with_asterisk_namespace_and_namespace,
    "a {\n  color: selector-unify(\"*|*\", \"a|b\");\n}\n",
    "a {\n  color: a|b;\n}\n"
);
test!(
    universal_with_asterisk_namespace_and_empty_namespace,
    "a {\n  color: selector-unify(\"*|*\", \"|b\");\n}\n",
    "a {\n  color: |b;\n}\n"
);
test!(
    universal_with_asterisk_namespace_and_no_namespace,
    "a {\n  color: selector-unify(\"*|*\", \"b\");\n}\n",
    "a {\n  color: b;\n}\n"
);
test!(
    universal_with_asterisk_namespace_and_asterisk_namespace,
    "a {\n  color: selector-unify(\"*|*\", \"*|b\");\n}\n",
    "a {\n  color: *|b;\n}\n"
);
test!(
    universal_with_no_namespace_and_namespace_on_universal,
    "a {\n  color: selector-unify(\"*\", \"a|*\");\n}\n",
    ""
);
test!(
    universal_with_no_namespace_and_empty_namespace_on_universal,
    "a {\n  color: selector-unify(\"*\", \"|*\");\n}\n",
    ""
);
test!(
    universal_with_no_namespace_and_universal_with_no_namespace,
    "a {\n  color: selector-unify(\"*\", \"*\");\n}\n",
    "a {\n  color: *;\n}\n"
);
test!(
    universal_with_no_namespace_and_universal_with_asterisk_namespace,
    "a {\n  color: selector-unify(\"*\", \"*|*\");\n}\n",
    "a {\n  color: *;\n}\n"
);
test!(
    universal_with_namespace_and_universal_with_namespace,
    "a {\n  color: selector-unify(\"c|*\", \"c|*\");\n}\n",
    "a {\n  color: c|*;\n}\n"
);
test!(
    universal_with_namespace_and_universal_with_empty_namespace,
    "a {\n  color: selector-unify(\"c|*\", \"|*\");\n}\n",
    ""
);
test!(
    universal_with_namespace_and_universal_with_no_namespace,
    "a {\n  color: selector-unify(\"c|*\", \"*\");\n}\n",
    ""
);
test!(
    universal_with_namespace_and_universal_with_asterisk_namespace,
    "a {\n  color: selector-unify(\"c|*\", \"*|*\");\n}\n",
    "a {\n  color: c|*;\n}\n"
);
test!(
    universal_with_empty_namespace_and_universal_with_namespace,
    "a {\n  color: selector-unify(\"|*\", \"b|*\");\n}\n",
    ""
);
test!(
    universal_with_empty_namespace_and_universal_with_empty_namespace,
    "a {\n  color: selector-unify(\"|*\", \"|*\");\n}\n",
    "a {\n  color: |*;\n}\n"
);
test!(
    universal_with_empty_namespace_and_universal_with_no_namespace,
    "a {\n  color: selector-unify(\"|*\", \"*\");\n}\n",
    ""
);
test!(
    universal_with_empty_namespace_and_universal_with_asterisk_namespace,
    "a {\n  color: selector-unify(\"|*\", \"*|*\");\n}\n",
    "a {\n  color: |*;\n}\n"
);
test!(
    universal_with_asterisk_namespace_and_universal_with_namespace,
    "a {\n  color: selector-unify(\"*|*\", \"a|*\");\n}\n",
    "a {\n  color: a|*;\n}\n"
);
test!(
    universal_with_asterisk_namespace_and_universal_with_empty_namespace,
    "a {\n  color: selector-unify(\"*|*\", \"|*\");\n}\n",
    "a {\n  color: |*;\n}\n"
);
test!(
    universal_with_asterisk_namespace_and_universal_with_asterisk_namespace,
    "a {\n  color: selector-unify(\"*|*\", \"*|*\");\n}\n",
    "a {\n  color: *|*;\n}\n"
);
test!(
    universal_with_asterisk_namespace_and_universal_with_no_namespace,
    "a {\n  color: selector-unify(\"*|*\", \"*\");\n}\n",
    "a {\n  color: *;\n}\n"
);
test!(
    complex_two_levels_same_first,
    "a {\n  color: selector-unify(\".c .s1\", \".c .s2\");\n}\n",
    "a {\n  color: .c .s1.s2;\n}\n"
);
test!(
    complex_three_levels_same_first,
    "a {\n  color: selector-unify(\".c .s1-1 .s1-2\", \".c .s2-1 .s2-2\");\n}\n",
    "a {\n  color: .c .s1-1 .s2-1 .s1-2.s2-2, .c .s2-1 .s1-1 .s1-2.s2-2;\n}\n"
);
test!(
    complex_three_levels_same_second,
    "a {\n  color: selector-unify(\".s1-1 .d .s1-2\", \".s2-1 .d .s2-2\");\n}\n",
    "a {\n  color: .s1-1 .s2-1 .d .s1-2.s2-2, .s2-1 .s1-1 .d .s1-2.s2-2;\n}\n"
);
test!(
    second_is_super_selector,
    "a {\n  color: selector-unify(\"c\", \"d c.e\");\n}\n",
    "a {\n  color: d c.e;\n}\n"
);
test!(
    first_is_super_selector,
    "a {\n  color: selector-unify(\"d c.e\", \"c\");\n}\n",
    "a {\n  color: d c.e;\n}\n"
);
test!(
    second_parent_is_super_selector,
    "a {\n  color: selector-unify(\"c d\", \"c.e .f\");\n}\n",
    "a {\n  color: c.e d.f;\n}\n"
);
test!(
    first_parent_is_super_selector,
    "a {\n  color: selector-unify(\"c.e .f\", \"c d\");\n}\n",
    "a {\n  color: c.e d.f;\n}\n"
);
test!(
    two_level_distinct,
    "a {\n  color: selector-unify(\".c .d\", \".e .f\");\n}\n",
    "a {\n  color: .c .e .d.f, .e .c .d.f;\n}\n"
);
test!(
    three_level_distinct,
    "a {\n  color: selector-unify(\".c .d .e\", \".f .g .h\");\n}\n",
    "a {\n  color: .c .d .f .g .e.h, .f .g .c .d .e.h;\n}\n"
);
test!(
    two_level_super_selector,
    "a {\n  color: selector-unify(\".c.s1-1 .s1-2\", \".c .s2\");\n}\n",
    "a {\n  color: .c.s1-1 .s1-2.s2;\n}\n"
);
test!(
    three_level_outer_super_selector,
    "a {\n  color: selector-unify(\".c.s1-1 .s1-2 .s1-3\", \".c .s2-1 .s2-2\");\n}\n",
    "a {\n  color: .c.s1-1 .s1-2 .s2-1 .s1-3.s2-2, .c.s1-1 .s2-1 .s1-2 .s1-3.s2-2;\n}\n"
);
test!(
    three_level_inner_super_selector,
    "a {\n  color: selector-unify(\".s1-1 .c.s1-2 .s1-3\", \".s2-1 .c .s2-2\");\n}\n",
    "a {\n  color: .s1-1 .s2-1 .c.s1-2 .s1-3.s2-2, .s2-1 .s1-1 .c.s1-2 .s1-3.s2-2;\n}\n"
);
test!(
    combinator_child_and_descendant_distinct,
    "a {\n  color: selector-unify(\".c > .d\", \".e .f\");\n}\n",
    "a {\n  color: .e .c > .d.f;\n}\n"
);
test!(
    combinator_child_and_descendant_same,
    "a {\n  color: selector-unify(\".c > .s1\", \".c .s2\");\n}\n",
    "a {\n  color: .c > .s1.s2;\n}\n"
);
test!(
    combinator_child_and_descendant_super_selector,
    "a {\n  color: selector-unify(\".c.s1-1 > .s1-2\", \".c .s2\");\n}\n",
    "a {\n  color: .c.s1-1 > .s1-2.s2;\n}\n"
);
test!(
    combinator_child_and_descendant_overlap,
    "a {\n  color: selector-unify(\".c.s1-1 > .s1-2\", \".c.s2-1 .s2-2\");\n}\n",
    "a {\n  color: .c.s2-1 .c.s1-1 > .s1-2.s2-2;\n}\n"
);
test!(
    combinator_child_and_child_distinct,
    "a {\n  color: selector-unify(\".c > .d\", \".e > .f\");\n}\n",
    "a {\n  color: .e.c > .d.f;\n}\n"
);
test!(
    combinator_child_and_child_super_selector,
    "a {\n  color: selector-unify(\".c.s1-1 > .s1-2\", \".c > .s2\");\n}\n",
    "a {\n  color: .c.s1-1 > .s1-2.s2;\n}\n"
);
test!(
    combinator_child_and_child_overlap,
    "a {\n  color: selector-unify(\".c.s1-1 > .s1-2\", \".c.s2-1 > .s2-2\");\n}\n",
    "a {\n  color: .c.s2-1.s1-1 > .s1-2.s2-2;\n}\n"
);
test!(
    combinator_child_and_child_conflict,
    "a {\n  color: selector-unify(\"#s1-1 > .s1-2\", \"#s2-1 > .s2-2\");\n}\n",
    ""
);
test!(
    combinator_child_and_sibling,
    "a {\n  color: selector-unify(\".c > .s1\", \".c ~ .s2\");\n}\n",
    "a {\n  color: .c > .c ~ .s1.s2;\n}\n"
);
test!(
    combinator_child_and_next_sibling,
    "a {\n  color: selector-unify(\".c > .s1\", \".c + .s2\");\n}\n",
    "a {\n  color: .c > .c + .s1.s2;\n}\n"
);
test!(
    combinator_sibling_and_descendant,
    "a {\n  color: selector-unify(\".c ~ .s1\", \".c .s2\");\n}\n",
    "a {\n  color: .c .c ~ .s1.s2;\n}\n"
);
test!(
    combinator_sibling_and_child,
    "a {\n  color: selector-unify(\".c ~ .s1\", \".c > .s2\");\n}\n",
    "a {\n  color: .c > .c ~ .s1.s2;\n}\n"
);
test!(
    combinator_sibling_and_sibling_distinct,
    "a {\n  color: selector-unify(\".c ~ .d\", \".e ~ .f\");\n}\n",
    "a {\n  color: .c ~ .e ~ .d.f, .e ~ .c ~ .d.f, .e.c ~ .d.f;\n}\n"
);
test!(
    combinator_sibling_and_sibling_same,
    "a {\n  color: selector-unify(\".c ~ .s1\", \".c ~ .s2\");\n}\n",
    "a {\n  color: .c ~ .s1.s2;\n}\n"
);
test!(
    combinator_sibling_and_sibling_super_selector,
    "a {\n  color: selector-unify(\".c.s1-1 ~ .s1-2\", \".c ~ .s2\");\n}\n",
    "a {\n  color: .c.s1-1 ~ .s1-2.s2;\n}\n"
);
test!(
    combinator_sibling_and_sibling_overlap,
    "a {\n  color: selector-unify(\".c.s1-1 ~ .s1-2\", \".c.s2-1 ~ .s2-2\");\n}\n",
    "a {\n  color: .c.s1-1 ~ .c.s2-1 ~ .s1-2.s2-2, .c.s2-1 ~ .c.s1-1 ~ .s1-2.s2-2, .c.s2-1.s1-1 ~ \
     .s1-2.s2-2;\n}\n"
);
test!(
    combinator_sibling_and_sibling_conflict,
    "a {\n  color: selector-unify(\"#s1-1 ~ .s1-2\", \"#s2-1 ~ .s2-2\");\n}\n",
    "a {\n  color: #s1-1 ~ #s2-1 ~ .s1-2.s2-2, #s2-1 ~ #s1-1 ~ .s1-2.s2-2;\n}\n"
);
test!(
    combinator_sibling_and_next_sibling_distinct,
    "a {\n  color: selector-unify(\".c ~ .d\", \".e + .f\");\n}\n",
    "a {\n  color: .c ~ .e + .d.f, .e.c + .d.f;\n}\n"
);
test!(
    combinator_sibling_and_next_sibling_identical,
    "a {\n  color: selector-unify(\".c ~ .s1\", \".c + .s2\");\n}\n",
    "a {\n  color: .c + .s1.s2;\n}\n"
);
test!(
    combinator_sibling_and_next_sibling_super_selector,
    "a {\n  color: selector-unify(\".c.s1-1 ~ .s1-2\", \".c + .s2\");\n}\n",
    "a {\n  color: .c.s1-1 ~ .c + .s1-2.s2, .c.s1-1 + .s1-2.s2;\n}\n"
);
test!(
    combinator_sibling_and_next_sibling_overlap,
    "a {\n  color: selector-unify(\".c.s1-1 ~ .s1-2\", \".c.s2-1 + .s2-2\");\n}\n",
    "a {\n  color: .c.s1-1 ~ .c.s2-1 + .s1-2.s2-2, .c.s2-1.s1-1 + .s1-2.s2-2;\n}\n"
);
test!(
    combinator_sibling_and_next_sibling_conflict,
    "a {\n  color: selector-unify(\"#s1-1 ~ .s1-2\", \"#s2-1 + .s2-2\");\n}\n",
    "a {\n  color: #s1-1 ~ #s2-1 + .s1-2.s2-2;\n}\n"
);
test!(
    combinator_next_sibling_and_descendant,
    "a {\n  color: selector-unify(\".c + .s1\", \".c .s2\");\n}\n",
    "a {\n  color: .c .c + .s1.s2;\n}\n"
);
test!(
    combinator_next_sibling_and_sibling_distinct,
    "a {\n  color: selector-unify(\".c + .d\", \".e ~ .f\");\n}\n",
    "a {\n  color: .e ~ .c + .d.f, .e.c + .d.f;\n}\n"
);
test!(
    combinator_next_sibling_and_sibling_identical,
    "a {\n  color: selector-unify(\".c + .s1\", \".c ~ .s2\");\n}\n",
    "a {\n  color: .c + .s1.s2;\n}\n"
);
test!(
    combinator_next_sibling_and_sibling_super_selector,
    "a {\n  color: selector-unify(\".c.s1-1 + .s1-2\", \".c ~ .s2\");\n}\n",
    "a {\n  color: .c.s1-1 + .s1-2.s2;\n}\n"
);
test!(
    combinator_next_sibling_and_sibling_overlap,
    "a {\n  color: selector-unify(\".c.s1-1 + .s1-2\", \".c.s2-1 ~ .s2-2\");\n}\n",
    "a {\n  color: .c.s2-1 ~ .c.s1-1 + .s1-2.s2-2, .c.s2-1.s1-1 + .s1-2.s2-2;\n}\n"
);
test!(
    combinator_next_sibling_and_sibling_conflict,
    "a {\n  color: selector-unify(\"#s1-1 + .s1-2\", \"#s2-1 ~ .s2-2\");\n}\n",
    "a {\n  color: #s2-1 ~ #s1-1 + .s1-2.s2-2;\n}\n"
);
test!(
    combinator_next_sibling_and_next_sibling_distinct,
    "a {\n  color: selector-unify(\".c + .d\", \".e + .f\");\n}\n",
    "a {\n  color: .e.c + .d.f;\n}\n"
);
test!(
    combinator_next_sibling_and_next_sibling_super_selector,
    "a {\n  color: selector-unify(\".c.s1-1 + .s1-2\", \".c + .s2\");\n}\n",
    "a {\n  color: .c.s1-1 + .s1-2.s2;\n}\n"
);
test!(
    combinator_next_sibling_and_next_sibling_overlap,
    "a {\n  color: selector-unify(\".c.s1-1 + .s1-2\", \".c.s2-1 + .s2-2\");\n}\n",
    "a {\n  color: .c.s2-1.s1-1 + .s1-2.s2-2;\n}\n"
);
test!(
    combinator_next_sibling_and_next_sibling_conflict,
    "a {\n  color: selector-unify(\"#s1-1 + .s1-2\", \"#s2-1 + .s2-2\");\n}\n",
    ""
);
test!(
    combinator_at_start_first,
    "a {\n  color: selector-unify(\"> .c\", \".d\");\n}\n",
    "a {\n  color: > .c.d;\n}\n"
);
test!(
    combinator_at_start_second,
    "a {\n  color: selector-unify(\".c\", \"~ .d\");\n}\n",
    "a {\n  color: ~ .c.d;\n}\n"
);
test!(
    combinator_at_start_both_identical,
    "a {\n  color: selector-unify(\"+ .c\", \"+ .d\");\n}\n",
    "a {\n  color: + .c.d;\n}\n"
);
test!(
    combinator_at_start_contiguous_super_sequence,
    "a {\n  color: selector-unify(\"+ ~ > .c\", \"> + ~ > > .d\");\n}\n",
    "a {\n  color: > + ~ > > .c.d;\n}\n"
);
test!(
    combinator_at_start_non_contiguous_super_sequence,
    "a {\n  color: selector-unify(\"+ ~ > .c\", \"+ > ~ ~ > .d\");\n}\n",
    "a {\n  color: + > ~ ~ > .c.d;\n}\n"
);
test!(
    combinator_at_start_distinct,
    "a {\n  color: selector-unify(\"+ ~ > .c\", \"+ > ~ ~ .d\");\n}\n",
    ""
);
test!(
    combinator_multiple,
    "a {\n  color: selector-unify(\".c > .d + .e\", \".f .g ~ .h\");\n}\n",
    "a {\n  color: .f .c > .g ~ .d + .e.h, .f .c > .g.d + .e.h;\n}\n"
);
test!(
    combinator_multiple_in_a_row_same,
    "a {\n  color: selector-unify(\".c + ~ > .d\", \".e + ~ > .f\");\n}\n",
    "a {\n  color: .c .e + ~ > .d.f, .e .c + ~ > .d.f;\n}\n"
);
test!(
    combinator_multiple_in_a_row_contiguous_super_sequence,
    "a {\n  color: selector-unify(\".c + ~ > .d\", \".e > + ~ > > .f\");\n}\n",
    "a {\n  color: .c .e > + ~ > > .d.f, .e .c > + ~ > > .d.f;\n}\n"
);
test!(
    combinator_multiple_in_a_row_non_contiguous_super_sequence,
    "a {\n  color: selector-unify(\".c + ~ > .d\", \".e + > ~ ~ > .f\");\n}\n",
    "a {\n  color: .c .e + > ~ ~ > .d.f, .e .c + > ~ ~ > .d.f;\n}\n"
);
test!(
    combinator_multiple_in_a_row_distinct,
    "a {\n  color: selector-unify(\".c + ~ > .d\", \".e + > ~ ~ .f\");\n}\n",
    ""
);
test!(
    lcs_two_vs_one,
    "a {\n  color: selector-unify(\".c .d .e .s1\", \".e .c .d .s2\");\n}\n",
    "a {\n  color: .e .c .d .e .s1.s2;\n}\n"
);
test!(
    lcs_three_vs_two,
    "a {\n  color: selector-unify(\".c .d .e .f .g .s1\", \".f .g .c .d .e .s2\");\n}\n",
    "a {\n  color: .f .g .c .d .e .f .g .s1.s2;\n}\n"
);
test!(
    lcs_non_contiguous_same_position,
    "a {\n  color: selector-unify(\".s1-1 .c .d .s1-2 .e .s1-3\", \".s2-1 .c .d .s2-2 .e \
     .s2-3\");\n}\n",
    "a {\n  color: .s1-1 .s2-1 .c .d .s1-2 .s2-2 .e .s1-3.s2-3, .s2-1 .s1-1 .c .d .s1-2 .s2-2 .e \
     .s1-3.s2-3, .s1-1 .s2-1 .c .d .s2-2 .s1-2 .e .s1-3.s2-3, .s2-1 .s1-1 .c .d .s2-2 .s1-2 .e \
     .s1-3.s2-3;\n}\n"
);
test!(
    lcs_non_contiguous_different_positions,
    "a {\n  color: selector-unify(\".s1-1 .c .d .s1-2 .e .s1-3\", \".c .s2-1 .d .e .s2-2 \
     .s2-3\");\n}\n",
    "a {\n  color: .s1-1 .c .s2-1 .d .s1-2 .e .s2-2 .s1-3.s2-3;\n}\n"
);
test!(
    root_in_first_two_layers,
    "a {\n  color: selector-unify(\":root .c\", \".d .e\");\n}\n",
    "a {\n  color: :root .d .c.e;\n}\n"
);
test!(
    #[ignore = "https://github.com/sass/dart-sass/issues/969"]
    root_in_first_three_layers,
    "a {\n  color: selector-unify(\":root .c .d\", \".e .f\");\n}\n",
    "a {\n  color: :root .c .e .d.f, :root .e .c .d.f;\n}\n"
);
test!(
    root_in_second_two_layers,
    "a {\n  color: selector-unify(\".c .d\", \":root .e\");\n}\n",
    "a {\n  color: :root .c .d.e;\n}\n"
);
test!(
    #[ignore = "https://github.com/sass/dart-sass/issues/969"]
    root_in_second_three_layers,
    "a {\n  color: selector-unify(\".c .d\", \":root .e .f\");\n}\n",
    "a {\n  color: :root .c .e .d.f, :root .e .c .d.f;\n}\n"
);
test!(
    root_in_both_cant_unify,
    "a {\n  color: selector-unify(\"c:root .d\", \"e:root .f\");\n}\n",
    ""
);
test!(
    root_in_both_super_selector,
    "a {\n  color: selector-unify(\"c:root .d\", \":root .e\");\n}\n",
    "a {\n  color: c:root .d.e;\n}\n"
);
test!(
    root_in_both_can_unify,
    "a {\n  color: selector-unify(\".c:root .d\", \".e:root .f\");\n}\n",
    "a {\n  color: .e.c:root .d.f;\n}\n"
);
error!(
    parent_in_first_arg,
    "a {\n  color: selector-unify(\"&\", \"c\");\n}\n",
    "Error: $selector1: Parent selectors aren't allowed here."
);
error!(
    parent_in_second_arg,
    "a {\n  color: selector-unify(\"c\", \"&\");\n}\n",
    "Error: $selector2: Parent selectors aren't allowed here."
);
error!(
    #[ignore = "we don't include the name of the arg in the error message"]
    malformed_selector_in_first_arg,
    "a {\n  color: selector-unify(\"[c\", \"c\");\n}\n", "Error: $selector1: expected more input."
);
error!(
    #[ignore = "we don't include the name of the arg in the error message"]
    malformed_selector_in_second_arg,
    "a {\n  color: selector-unify(\"c\", \"[c\");\n}\n", "Error: $selector2: expected more input."
);
error!(
    invalid_type_in_first_arg,
    "a {\n  color: selector-unify(1, \"c\");\n}\n",
    "Error: $selector1: 1 is not a valid selector: it must be a string, a list of strings, or a \
     list of lists of strings."
);
error!(
    invalid_type_in_second_arg,
    "a {\n  color: selector-unify(\"c\", 1);\n}\n",
    "Error: $selector2: 1 is not a valid selector: it must be a string, a list of strings, or a \
     list of lists of strings."
);
test!(
    simple_pseudo_no_arg_class_same,
    "a {\n  color: selector-unify(\":c\", \":c\");\n}\n",
    "a {\n  color: :c;\n}\n"
);
test!(
    simple_pseudo_no_arg_class_different,
    "a {\n  color: selector-unify(\":c\", \":d\");\n}\n",
    "a {\n  color: :c:d;\n}\n"
);
test!(
    simple_pseudo_no_arg_element_same,
    "a {\n  color: selector-unify(\"::c\", \"::c\");\n}\n",
    "a {\n  color: ::c;\n}\n"
);
test!(
    simple_pseudo_no_arg_element_different,
    "a {\n  color: inspect(selector-unify(\"::c\", \"::d\"));\n}\n",
    "a {\n  color: null;\n}\n"
);
test!(
    simple_pseudo_no_arg_element_and_class_same_before,
    "a {\n  color: selector-unify(\":before\", \"::before\");\n}\n",
    "a {\n  color: :before;\n}\n"
);
test!(
    simple_pseudo_no_arg_element_and_class_same_after,
    "a {\n  color: selector-unify(\":after\", \"::after\");\n}\n",
    "a {\n  color: :after;\n}\n"
);
test!(
    simple_pseudo_no_arg_element_and_class_same_first_line,
    "a {\n  color: selector-unify(\":first-line\", \"::first-line\");\n}\n",
    "a {\n  color: :first-line;\n}\n"
);
test!(
    simple_pseudo_no_arg_element_and_class_same_first_letter,
    "a {\n  color: selector-unify(\":first-letter\", \"::first-letter\");\n}\n",
    "a {\n  color: :first-letter;\n}\n"
);
test!(
    simple_pseudo_arg_class_same,
    "a {\n  color: selector-unify(\":c(@#$)\", \":c(@#$)\");\n}\n",
    "a {\n  color: :c(@#$);\n}\n"
);
test!(
    simple_pseudo_arg_class_different_arg,
    "a {\n  color: selector-unify(\":c(@#$)\", \":c(*&^)\");\n}\n",
    "a {\n  color: :c(@#$):c(*&^);\n}\n"
);
test!(
    simple_pseudo_arg_element_same,
    "a {\n  color: selector-unify(\"::c(@#$)\", \"::c(@#$)\");\n}\n",
    "a {\n  color: ::c(@#$);\n}\n"
);
test!(
    simple_pseudo_arg_element_different_arg,
    "a {\n  color: inspect(selector-unify(\"::c(@#$)\", \"::c(*&^)\"));\n}\n",
    "a {\n  color: null;\n}\n"
);
test!(
    simple_pseudo_arg_matches_same_selector_arg,
    "a {\n  color: selector-unify(\":matches(.c)\", \":matches(.c)\");\n}\n",
    "a {\n  color: :matches(.c);\n}\n"
);
test!(
    simple_pseudo_arg_matches_different_selector_arg,
    "a {\n  color: selector-unify(\":matches(.c)\", \":matches(.d)\");\n}\n",
    "a {\n  color: :matches(.c):matches(.d);\n}\n"
);
