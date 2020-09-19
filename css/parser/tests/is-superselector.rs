#[macro_use]
mod macros;

test!(
    more_specific_class_compound,
    "a {\n  color: is-superselector(\".foo\", \".foo.bar\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    less_specific_class_compound,
    "a {\n  color: is-superselector(\".foo.bar\", \".foo\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    more_specific_class_complex,
    "a {\n  color: is-superselector(\".bar\", \".foo .bar\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    less_specific_class_complex,
    "a {\n  color: is-superselector(\".foo .bar\", \".bar\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    two_in_sub,
    "a {\n  color: is-superselector(\"c\", \"c, d\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    two_in_super,
    "a {\n  color: is-superselector(\"c, d\", \"c\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    two_in_both_equal,
    "a {\n  color: is-superselector(\"c, d\", \"c, d\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    two_in_both_subset,
    "a {\n  color: is-superselector(\"c, d\", \"c.e, d.f\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    two_in_both_superset,
    "a {\n  color: is-superselector(\"c.e, d.f\", \"c, d\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    two_in_sub_satisfied_by_one_super,
    "a {\n  color: is-superselector(\".c\", \"d.c, e.c\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    three_in_super_match_one,
    "a {\n  color: is-superselector(\"c, d, e\", \"d\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    three_in_super_match_two,
    "a {\n  color: is-superselector(\"c, d, e\", \"e, c\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    three_in_super_match_three,
    "a {\n  color: is-superselector(\"c, d, e\", \"d, c, e\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    three_in_super_miss_one,
    "a {\n  color: is-superselector(\"c, d, e\", \"c, f\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    simple_attribute_equal,
    "a {\n  color: is-superselector(\"[c=d]\", \"[c=d]\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    simple_attribute_different_attr,
    "a {\n  color: is-superselector(\"[c=d]\", \"[e=d]\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    simple_attribute_different_val,
    "a {\n  color: is-superselector(\"[c=d]\", \"[c=e]\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    simple_attribute_different_operator,
    "a {\n  color: is-superselector(\"[c=d]\", \"[c^=e]\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    simple_class_equal,
    "a {\n  color: is-superselector(\".c\", \".c\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    simple_class_not_equal,
    "a {\n  color: is-superselector(\".c\", \".d\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    simple_id_equal,
    "a {\n  color: is-superselector(\"#c\", \"#c\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    simple_id_not_equal,
    "a {\n  color: is-superselector(\"#c\", \"#d\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    simple_placeholder_equal,
    "a {\n  color: is-superselector(\"%c\", \"%c\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    simple_placeholder_not_equal,
    "a {\n  color: is-superselector(\"%c\", \"%d\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    simple_type_equal,
    "a {\n  color: is-superselector(\"c\", \"c\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    simple_type_not_equal,
    "a {\n  color: is-superselector(\"c\", \"d\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    simple_type_and_universal,
    "a {\n  color: is-superselector(\"c\", \"*\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    simple_type_explicit_namespace_equal,
    "a {\n  color: is-superselector(\"c|d\", \"c|d\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    simple_type_different_explicit_namespace,
    "a {\n  color: is-superselector(\"c|d\", \"e|d\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    simple_type_explicit_namespace_and_implicit_namespace,
    "a {\n  color: is-superselector(\"c|d\", \"d\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    simple_type_explicit_namespace_and_empty_namespace,
    "a {\n  color: is-superselector(\"c|d\", \"|d\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    simple_type_explicit_namespace_and_universal_namespace,
    "a {\n  color: is-superselector(\"c|d\", \"*|d\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    simple_type_empty_namespace_and_explicit_namespace,
    "a {\n  color: is-superselector(\"|c\", \"d|c\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    simple_type_empty_namespace_and_empty_namespace,
    "a {\n  color: is-superselector(\"|c\", \"|c\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    #[ignore = "https://github.com/sass/dart-sass/issues/789"]
    simple_type_universal_namespace_and_explicit_namespace,
    "a {\n  color: is-superselector(\"*|c\", \"d|c\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    #[ignore = "https://github.com/sass/dart-sass/issues/789"]
    simple_type_universal_namespace_and_implicit_namespace,
    "a {\n  color: is-superselector(\"*|c\", \"c\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    #[ignore = "https://github.com/sass/dart-sass/issues/789"]
    simple_type_universal_namespace_and_empty_namespace,
    "a {\n  color: is-superselector(\"*|c\", \"|c\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    simple_type_universal_namespace_and_universal_namespace,
    "a {\n  color: is-superselector(\"*|c\", \"*|c\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    simple_pseudo_no_args_equal,
    "a {\n  color: is-superselector(\":c\", \":c\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    simple_pseudo_no_args_different,
    "a {\n  color: is-superselector(\":c\", \":d\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    simple_pseudo_no_args_class_and_element,
    "a {\n  color: is-superselector(\":c\", \"::c\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    simple_pseudo_no_args_element_and_element_equal,
    "a {\n  color: is-superselector(\"::c\", \"::c\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    simple_pseudo_no_args_element_and_element_different,
    "a {\n  color: is-superselector(\"::c\", \"::d\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    simple_pseudo_no_args_element_and_class,
    "a {\n  color: is-superselector(\"::c\", \":c\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    simple_pseudo_arg_class_equal,
    "a {\n  color: is-superselector(\":c(@#$)\", \":c(@#$)\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    simple_pseudo_arg_class_different_name,
    "a {\n  color: is-superselector(\":c(@#$)\", \":d(@#$)\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    simple_pseudo_arg_class_different_arg,
    "a {\n  color: is-superselector(\":c(@#$)\", \":d(*&^)\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    simple_pseudo_arg_class_different_no_arg,
    "a {\n  color: is-superselector(\":c(@#$)\", \":c\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    simple_pseudo_arg_class_and_element,
    "a {\n  color: is-superselector(\":c(@#$)\", \"::c(@#$)\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    simple_pseudo_arg_element_and_element_equal,
    "a {\n  color: is-superselector(\"::c(@#$)\", \"::c(@#$)\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    simple_pseudo_arg_element_and_element_different_name,
    "a {\n  color: is-superselector(\"::c(@#$)\", \"::d(@#$)\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    simple_pseudo_arg_element_and_element_different_arg,
    "a {\n  color: is-superselector(\"::c(@#$)\", \"::c(*&^)\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    simple_pseudo_arg_element_and_element_different_no_arg,
    "a {\n  color: is-superselector(\"::c(@#$)\", \"::c\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    simple_pseudo_arg_element_and_class,
    "a {\n  color: is-superselector(\"::c(@#$)\", \":c(@#$)\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    psuedo_any_superset,
    "a {\n  color: is-superselector(\":any(c d, e f, g h)\", \":any(c d.i, e j f)\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    psuedo_any_subset,
    "a {\n  color: is-superselector(\":any(c d.i, e j f)\", \":any(c d, e f, g h)\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    psuedo_any_prefix_superset,
    "a {\n  color: is-superselector(\":-pfx-any(c d, e f, g h)\", \":-pfx-any(c d.i, e j f)\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    psuedo_any_prefix_subset,
    "a {\n  color: is-superselector(\":-pfx-any(c d.i, e j f)\", \":-pfx-any(c d, e f, g h)\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    psuedo_current_superset,
    "a {\n  color: is-superselector(\":current(c d, e f, g h)\", \":current(c d.i, e j f)\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    psuedo_current_subset,
    "a {\n  color: is-superselector(\":current(c d.i, e j f)\", \":current(c d, e f, g h)\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    psuedo_current_equal,
    "a {\n  color: is-superselector(\":current(c d, e f)\", \":current(c d, e f)\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    psuedo_current_bare_sub,
    "a {\n  color: is-superselector(\":current(c d, e f)\", \"c d, e f\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    psuedo_current_prefix_superset,
    "a {\n  color: is-superselector(\":-pfx-current(c d, e f, g h)\", \":-pfx-current(c d.i, e j f)\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    psuedo_current_prefix_subset,
    "a {\n  color: is-superselector(\":-pfx-current(c d.i, e j f)\", \":-pfx-current(c d, e f, g h)\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    psuedo_current_prefix_equal,
    "a {\n  color: is-superselector(\":-pfx-current(c d, e f)\", \":-pfx-current(c d, e f)\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    psuedo_has_superset,
    "a {\n  color: is-superselector(\":has(c d, e f, g h)\", \":has(c d.i, e j f)\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    psuedo_has_subset,
    "a {\n  color: is-superselector(\":has(c d.i, e j f)\", \":has(c d, e f, g h)\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    psuedo_has_equal,
    "a {\n  color: is-superselector(\":has(c d, e f)\", \":has(c d, e f)\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    psuedo_has_bare_sub,
    "a {\n  color: is-superselector(\":has(c d, e f)\", \"c d, e f\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    psuedo_has_prefix_superset,
    "a {\n  color: is-superselector(\":-pfx-has(c d, e f, g h)\", \":-pfx-has(c d.i, e j f)\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    psuedo_has_prefix_subset,
    "a {\n  color: is-superselector(\":-pfx-has(c d.i, e j f)\", \":-pfx-has(c d, e f, g h)\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    psuedo_has_prefix_equal,
    "a {\n  color: is-superselector(\":-pfx-has(c d, e f)\", \":-pfx-has(c d, e f)\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    psuedo_host_superset,
    "a {\n  color: is-superselector(\":host(c d, e f, g h)\", \":host(c d.i, e j f)\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    psuedo_host_subset,
    "a {\n  color: is-superselector(\":host(c d.i, e j f)\", \":host(c d, e f, g h)\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    psuedo_host_equal,
    "a {\n  color: is-superselector(\":host(c d, e f)\", \":host(c d, e f)\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    psuedo_host_bare_sub,
    "a {\n  color: is-superselector(\":host(c d, e f)\", \"c d, e f\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    psuedo_host_prefix_superset,
    "a {\n  color: is-superselector(\":-pfx-host(c d, e f, g h)\", \":-pfx-host(c d.i, e j f)\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    psuedo_host_prefix_subset,
    "a {\n  color: is-superselector(\":-pfx-host(c d.i, e j f)\", \":-pfx-host(c d, e f, g h)\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    psuedo_host_prefix_equal,
    "a {\n  color: is-superselector(\":-pfx-host(c d, e f)\", \":-pfx-host(c d, e f)\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    psuedo_host_context_superset,
    "a {\n  color: is-superselector(\":host-context(c d, e f, g h)\", \":host-context(c d.i, e j f)\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    psuedo_host_context_subset,
    "a {\n  color: is-superselector(\":host-context(c d.i, e j f)\", \":host-context(c d, e f, g h)\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    psuedo_host_context_equal,
    "a {\n  color: is-superselector(\":host-context(c d, e f)\", \":host-context(c d, e f)\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    psuedo_host_context_bare_sub,
    "a {\n  color: is-superselector(\":host-context(c d, e f)\", \"c d, e f\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    psuedo_host_context_prefix_superset,
    "a {\n  color: is-superselector(\":-pfx-host-context(c d, e f, g h)\", \":-pfx-host-context(c d.i, e j f)\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    psuedo_host_context_prefix_subset,
    "a {\n  color: is-superselector(\":-pfx-host-context(c d.i, e j f)\", \":-pfx-host-context(c d, e f, g h)\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    psuedo_host_context_prefix_equal,
    "a {\n  color: is-superselector(\":-pfx-host-context(c d, e f)\", \":-pfx-host-context(c d, e f)\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    psuedo_slotted_superset,
    "a {\n  color: is-superselector(\"::slotted(c d, e f, g h)\", \"::slotted(c d.i, e j f)\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    psuedo_slotted_subset,
    "a {\n  color: is-superselector(\"::slotted(c d.i, e j f)\", \"::slotted(c d, e f, g h)\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    psuedo_slotted_equal,
    "a {\n  color: is-superselector(\"::slotted(c d, e f)\", \"::slotted(c d, e f)\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    psuedo_slotted_bare_sub,
    "a {\n  color: is-superselector(\"::slotted(c d, e f)\", \"c d, e f\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    psuedo_slotted_prefix_superset,
    "a {\n  color: is-superselector(\"::-pfx-slotted(c d, e f, g h)\", \"::-pfx-slotted(c d.i, e j f)\");\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    psuedo_slotted_prefix_subset,
    "a {\n  color: is-superselector(\"::-pfx-slotted(c d.i, e j f)\", \"::-pfx-slotted(c d, e f, g h)\");\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    psuedo_slotted_prefix_equal,
    "a {\n  color: is-superselector(\"::-pfx-slotted(c d, e f)\", \"::-pfx-slotted(c d, e f)\");\n}\n",
    "a {\n  color: true;\n}\n"
);

// todo: /spec/core_functions/selector/is_superselector/simple/pseudo/selector_arg/
// :not, :matches, :nth-child, :nth-last-child
