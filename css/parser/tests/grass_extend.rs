#[macro_use]
mod grass_macros;

test!(empty_extend_self, "a { @extend a; }", "");
test!(
    extend_self_with_styles,
    "a {\n  color: red;\n  @extend a;\n}\n",
    "a {\n  color: red;\n}\n"
);
test!(
    list_extends_both_of_compound,
    ".foo.bar {
        a: b
      }

      .x, .y {
        @extend .foo, .bar;
      }
    ",
    ".foo.bar, .x, .y {\n  a: b;\n}\n"
);
test!(
    class_extends_class_placed_second,
    ".foo {a: b}
     .bar {@extend .foo}",
    ".foo, .bar {\n  a: b;\n}\n"
);
test!(
    class_extends_class_placed_first,
    ".bar {@extend .foo}
    .foo {a: b}",
    ".foo, .bar {\n  a: b;\n}\n"
);
test!(
    class_extends_class_style_before_extend,
    ".foo {a: b}
     .bar {c: d; @extend .foo;}",
    ".foo, .bar {\n  a: b;\n}\n\n.bar {\n  c: d;\n}\n"
);
test!(
    class_extends_class_style_after_extend,
    ".foo {a: b}
     .bar {@extend .foo; c: d;}",
    ".foo, .bar {\n  a: b;\n}\n\n.bar {\n  c: d;\n}\n"
);
test!(
    class_extends_class_applies_to_multiple_extendees,
    ".foo {a: b}
    .bar {@extend .foo}
    .blip .foo {c: d}",
    ".foo, .bar {\n  a: b;\n}\n\n.blip .foo, .blip .bar {\n  c: d;\n}\n"
);
test!(
    class_extends_class_one_class_extends_multiple,
    ".foo {a: b}
    .bar {c: d}
    .baz {@extend .foo; @extend .bar}",
    ".foo, .baz {\n  a: b;\n}\n\n.bar, .baz {\n  c: d;\n}\n"
);
test!(
    class_extends_class_multiple_classes_extend_one,
    ".foo {a: b}
    .bar {@extend .foo}
    .baz {@extend .bar}
    .bip {@extend .bar}
    ",
    ".foo, .bar, .bip, .baz {\n  a: b;\n}\n"
);
test!(
    class_extends_class_all_parts_of_complex_selector_extended_by_one,
    ".foo .bar {a: b}
    .baz {@extend .foo; @extend .bar}
    ",
    ".foo .bar, .foo .baz, .baz .bar, .baz .baz {\n  a: b;\n}\n"
);
test!(
    class_extends_class_all_parts_of_compound_selector_extended_by_one,
    ".foo.bar {a: b}
    .baz {@extend .foo; @extend .bar}
    ",
    ".foo.bar, .baz {\n  a: b;\n}\n"
);
test!(
    class_extends_class_all_parts_of_complex_selector_extended_by_different,
    ".foo .bar {a: b}
    .baz {@extend .foo}
    .bang {@extend .bar}
    ",
    ".foo .bar, .foo .bang, .baz .bar, .baz .bang {\n  a: b;\n}\n"
);
test!(
    class_extends_class_all_parts_of_compound_selector_extended_by_different,
    ".foo.bar {a: b}
    .baz {@extend .foo}
    .bang {@extend .bar}
    ",
    ".foo.bar, .foo.bang, .bar.baz, .baz.bang {\n  a: b;\n}\n"
);
test!(
    class_extends_class_simple_selector_extended_chain,
    ".foo {a: b}
    .bar {@extend .foo}
    .baz {@extend .bar}
    .bip {@extend .bar}
    ",
    ".foo, .bar, .bip, .baz {\n  a: b;\n}\n"
);
test!(
    class_extends_class_interpolated,
    ".foo {a: b}
    .bar {@extend #{\".foo\"}}
    ",
    ".foo, .bar {\n  a: b;\n}\n"
);
test!(
    class_extends_class_target_child_of_complex,
    ".foo .bar {a: b}
    .baz {@extend .bar}
    ",
    ".foo .bar, .foo .baz {\n  a: b;\n}\n"
);
test!(
    class_extends_class_target_parent_of_complex,
    ".foo .bar {a: b}
    .baz {@extend .foo}
    ",
    ".foo .bar, .baz .bar {\n  a: b;\n}\n"
);
test!(
    class_unification_1,
    "%-a .foo.bar {a: b}
    .baz {@extend .foo} -a {@extend %-a}
    ",
    "-a .foo.bar, -a .bar.baz {\n  a: b;\n}\n"
);
test!(
    class_unification_2,
    "%-a .foo.baz {a: b}
    .baz {@extend .foo} -a {@extend %-a}
    ",
    "-a .baz {\n  a: b;\n}\n"
);
test!(
    id_unification_1,
    "%-a .foo.bar {a: b}
    #baz {@extend .foo} -a {@extend %-a}
    ",
    "-a .foo.bar, -a .bar#baz {\n  a: b;\n}\n"
);
test!(
    id_unification_2,
    "%-a .foo#baz {a: b}
    #baz {@extend .foo} -a {@extend %-a}
    ",
    "-a #baz {\n  a: b;\n}\n"
);
test!(
    universal_unification_simple_target_1,
    "%-a .foo {a: b}
    * {@extend .foo} -a {@extend %-a}
    ",
    "-a .foo, -a * {\n  a: b;\n}\n"
);
test!(
    universal_unification_simple_target_2,
    "%-a .foo.bar {a: b}
    * {@extend .foo} -a {@extend %-a}
    ",
    "-a .bar {\n  a: b;\n}\n"
);
test!(
    universal_unification_simple_target_3,
    "%-a .foo.bar {a: b}
    *|* {@extend .foo} -a {@extend %-a}
    ",
    "-a .bar {\n  a: b;\n}\n"
);
test!(
    universal_unification_simple_target_4,
    "%-a .foo.bar {a: b}
    ns|* {@extend .foo} -a {@extend %-a}
    ",
    "-a .foo.bar, -a ns|*.bar {\n  a: b;\n}\n"
);
test!(
    universal_unification_universal_target_without_namespace_1,
    "%-a *.foo {a: b}
    * {@extend .foo} -a {@extend %-a}
    ",
    "-a * {\n  a: b;\n}\n"
);
test!(
    universal_unification_universal_target_without_namespace_2,
    "%-a *.foo {a: b}
    *|* {@extend .foo} -a {@extend %-a}
    ",
    "-a * {\n  a: b;\n}\n"
);
test!(
    universal_unification_universal_target_without_namespace_3,
    "%-a *|*.foo {a: b}
    * {@extend .foo} -a {@extend %-a}
    ",
    "-a *|*.foo, -a * {\n  a: b;\n}\n"
);
test!(
    universal_unification_universal_target_without_namespace_4,
    "%-a *|*.foo {a: b}
    *|* {@extend .foo} -a {@extend %-a}
    ",
    "-a *|* {\n  a: b;\n}\n"
);
test!(
    universal_unification_universal_target_without_namespace_5,
    "%-a *.foo {a: b}
    ns|* {@extend .foo} -a {@extend %-a}
    ",
    "-a *.foo {\n  a: b;\n}\n"
);
test!(
    universal_unification_universal_target_without_namespace_6,
    "%-a *|*.foo {a: b}
    ns|* {@extend .foo} -a {@extend %-a}
    ",
    "-a *|*.foo, -a ns|* {\n  a: b;\n}\n"
);
test!(
    universal_unification_universal_target_without_namespace_7,
    "%-a ns|*.foo {a: b}
    * {@extend .foo} -a {@extend %-a}
    ",
    "-a ns|*.foo {\n  a: b;\n}\n"
);
test!(
    universal_unification_universal_target_without_namespace_8,
    "%-a ns|*.foo {a: b}
    *|* {@extend .foo} -a {@extend %-a}
    ",
    "-a ns|* {\n  a: b;\n}\n"
);
test!(
    universal_unification_universal_target_without_namespace_9,
    "%-a ns|*.foo {a: b}
    ns|* {@extend .foo} -a {@extend %-a}
    ",
    "-a ns|* {\n  a: b;\n}\n"
);
test!(
    universal_unification_element_target_without_namespace_1,
    "%-a a.foo {a: b}
    *|* {@extend .foo} -a {@extend %-a}
    ",
    "-a a {\n  a: b;\n}\n"
);
test!(
    universal_unification_element_target_without_namespace_2,
    "%-a *|a.foo {a: b}
    * {@extend .foo} -a {@extend %-a}
    ",
    "-a *|a.foo, -a a {\n  a: b;\n}\n"
);
test!(
    universal_unification_element_target_without_namespace_3,
    "%-a *|a.foo {a: b}
    *|* {@extend .foo} -a {@extend %-a}
    ",
    "-a *|a {\n  a: b;\n}\n"
);
test!(
    universal_unification_element_target_without_namespace_4,
    "%-a a.foo {a: b}
    ns|* {@extend .foo} -a {@extend %-a}
    ",
    "-a a.foo {\n  a: b;\n}\n"
);
test!(
    universal_unification_element_target_without_namespace_5,
    "%-a *|a.foo {a: b}
    ns|* {@extend .foo} -a {@extend %-a}
    ",
    "-a *|a.foo, -a ns|a {\n  a: b;\n}\n"
);
test!(
    universal_unification_element_target_without_namespace_6,
    "%-a ns|a.foo {a: b}
    * {@extend .foo} -a {@extend %-a}
    ",
    "-a ns|a.foo {\n  a: b;\n}\n"
);
test!(
    universal_unification_element_target_without_namespace_7,
    "%-a ns|a.foo {a: b}
    *|* {@extend .foo} -a {@extend %-a}
    ",
    "-a ns|a {\n  a: b;\n}\n"
);
test!(
    universal_unification_element_target_without_namespace_8,
    "%-a ns|a.foo {a: b}
    ns|* {@extend .foo} -a {@extend %-a}
    ",
    "-a ns|a {\n  a: b;\n}\n"
);
test!(
    element_unification_simple_target_1,
    "%-a .foo {a: b}
    a {@extend .foo} -a {@extend %-a}
    ",
    "-a .foo, -a a {\n  a: b;\n}\n"
);
test!(
    element_unification_simple_target_2,
    "%-a .foo.bar {a: b}
    a {@extend .foo} -a {@extend %-a}
    ",
    "-a .foo.bar, -a a.bar {\n  a: b;\n}\n"
);
test!(
    element_unification_simple_target_3,
    "%-a .foo.bar {a: b}
    *|a {@extend .foo} -a {@extend %-a}
    ",
    "-a .foo.bar, -a *|a.bar {\n  a: b;\n}\n"
);
test!(
    element_unification_simple_target_4,
    "%-a .foo.bar {a: b}
    ns|a {@extend .foo} -a {@extend %-a}
    ",
    "-a .foo.bar, -a ns|a.bar {\n  a: b;\n}\n"
);
test!(
    element_unification_universal_without_namespace_1,
    "%-a *.foo {a: b}
    a {@extend .foo} -a {@extend %-a}
    ",
    "-a *.foo, -a a {\n  a: b;\n}\n"
);
test!(
    element_unification_universal_without_namespace_2,
    "%-a *.foo {a: b}
    *|a {@extend .foo} -a {@extend %-a}
    ",
    "-a *.foo, -a a {\n  a: b;\n}\n"
);
test!(
    element_unification_universal_without_namespace_3,
    "%-a *|*.foo {a: b}
    a {@extend .foo} -a {@extend %-a}
    ",
    "-a *|*.foo, -a a {\n  a: b;\n}\n"
);
test!(
    element_unification_universal_without_namespace_4,
    "%-a *|*.foo {a: b}
    *|a {@extend .foo} -a {@extend %-a}
    ",
    "-a *|*.foo, -a *|a {\n  a: b;\n}\n"
);
test!(
    element_unification_universal_without_namespace_5,
    "%-a *.foo {a: b}
    ns|a {@extend .foo} -a {@extend %-a}
    ",
    "-a *.foo {\n  a: b;\n}\n"
);
test!(
    element_unification_universal_without_namespace_6,
    "%-a *|*.foo {a: b}
    ns|a {@extend .foo} -a {@extend %-a}
    ",
    "-a *|*.foo, -a ns|a {\n  a: b;\n}\n"
);
test!(
    element_unification_universal_with_namespace_1,
    "%-a ns|*.foo {a: b}
    a {@extend .foo} -a {@extend %-a}
    ",
    "-a ns|*.foo {\n  a: b;\n}\n"
);
test!(
    element_unification_universal_with_namespace_2,
    "%-a ns|*.foo {a: b}
    *|a {@extend .foo} -a {@extend %-a}
    ",
    "-a ns|*.foo, -a ns|a {\n  a: b;\n}\n"
);
test!(
    element_unification_universal_with_namespace_3,
    "%-a ns|*.foo {a: b}
    ns|a {@extend .foo} -a {@extend %-a}
    ",
    "-a ns|*.foo, -a ns|a {\n  a: b;\n}\n"
);
test!(
    element_unification_element_without_namespace_1,
    "%-a a.foo {a: b}
    a {@extend .foo} -a {@extend %-a}
    ",
    "-a a {\n  a: b;\n}\n"
);
test!(
    element_unification_element_without_namespace_2,
    "%-a a.foo {a: b}
    *|a {@extend .foo} -a {@extend %-a}
    ",
    "-a a {\n  a: b;\n}\n"
);
test!(
    element_unification_element_without_namespace_3,
    "%-a *|a.foo {a: b}
    a {@extend .foo} -a {@extend %-a}
    ",
    "-a *|a.foo, -a a {\n  a: b;\n}\n"
);
test!(
    element_unification_element_without_namespace_4,
    "%-a *|a.foo {a: b}
    *|a {@extend .foo} -a {@extend %-a}
    ",
    "-a *|a {\n  a: b;\n}\n"
);
test!(
    element_unification_element_without_namespace_5,
    "%-a a.foo {a: b}
    ns|a {@extend .foo} -a {@extend %-a}
    ",
    "-a a.foo {\n  a: b;\n}\n"
);
test!(
    element_unification_element_without_namespace_6,
    "%-a *|a.foo {a: b}
    ns|a {@extend .foo} -a {@extend %-a}
    ",
    "-a *|a.foo, -a ns|a {\n  a: b;\n}\n"
);
test!(
    element_unification_element_with_namespace_1,
    "%-a ns|a.foo {a: b}
    a {@extend .foo} -a {@extend %-a}
    ",
    "-a ns|a.foo {\n  a: b;\n}\n"
);
test!(
    element_unification_element_with_namespace_2,
    "%-a ns|a.foo {a: b}
    *|a {@extend .foo} -a {@extend %-a}
    ",
    "-a ns|a {\n  a: b;\n}\n"
);
test!(
    element_unification_element_with_namespace_3,
    "%-a ns|a.foo {a: b}
    ns|a {@extend .foo} -a {@extend %-a}
    ",
    "-a ns|a {\n  a: b;\n}\n"
);
test!(
    attribute_unification_1,
    "%-a [foo=bar].baz {a: b}
    [foo=baz] {@extend .baz} -a {@extend %-a}
    ",
    "-a [foo=bar].baz, -a [foo=bar][foo=baz] {\n  a: b;\n}\n"
);
test!(
    attribute_unification_2,
    "%-a [foo=bar].baz {a: b}
    [foo^=bar] {@extend .baz} -a {@extend %-a}
    ",
    "-a [foo=bar].baz, -a [foo=bar][foo^=bar] {\n  a: b;\n}\n"
);
test!(
    attribute_unification_3,
    "%-a [foo=bar].baz {a: b}
    [foot=bar] {@extend .baz} -a {@extend %-a}
    ",
    "-a [foo=bar].baz, -a [foo=bar][foot=bar] {\n  a: b;\n}\n"
);
test!(
    attribute_unification_4,
    "%-a [foo=bar].baz {a: b}
    [ns|foo=bar] {@extend .baz} -a {@extend %-a}
    ",
    "-a [foo=bar].baz, -a [foo=bar][ns|foo=bar] {\n  a: b;\n}\n"
);
test!(
    attribute_unification_5,
    "%-a %-a [foo=bar].bar {a: b}
    [foo=bar] {@extend .bar} -a {@extend %-a}
    ",
    "-a -a [foo=bar] {\n  a: b;\n}\n"
);
test!(
    pseudo_unification_1,
    "%-a :foo.baz {a: b}
    :foo(2n+1) {@extend .baz} -a {@extend %-a}
    ",
    "-a :foo.baz, -a :foo:foo(2n+1) {\n  a: b;\n}\n"
);
test!(
    pseudo_unification_2,
    "%-a :foo.baz {a: b}
    ::foo {@extend .baz} -a {@extend %-a}
    ",
    "-a :foo.baz, -a :foo::foo {\n  a: b;\n}\n"
);
test!(
    pseudo_unification_3,
    "%-a ::foo.baz {a: b}
    ::foo {@extend .baz} -a {@extend %-a}
    ",
    "-a ::foo {\n  a: b;\n}\n"
);
test!(
    pseudo_unification_4,
    "%-a ::foo(2n+1).baz {a: b}
    ::foo(2n+1) {@extend .baz} -a {@extend %-a}
    ",
    "-a ::foo(2n+1) {\n  a: b;\n}\n"
);
test!(
    pseudo_unification_5,
    "%-a :foo.baz {a: b}
    :bar {@extend .baz} -a {@extend %-a}
    ",
    "-a :foo.baz, -a :foo:bar {\n  a: b;\n}\n"
);
test!(
    pseudo_unification_6,
    "%-a .baz:foo {a: b}
    :after {@extend .baz} -a {@extend %-a}
    ",
    "-a .baz:foo, -a :foo:after {\n  a: b;\n}\n"
);
test!(
    pseudo_unification_7,
    "%-a .baz:after {a: b}
    :foo {@extend .baz} -a {@extend %-a}
    ",
    "-a .baz:after, -a :foo:after {\n  a: b;\n}\n"
);
test!(
    pseudo_unification_8,
    "%-a :foo.baz {a: b}
    :foo {@extend .baz} -a {@extend %-a}
    ",
    "-a :foo {\n  a: b;\n}\n"
);
test!(
    pseudoelement_remains_at_end_of_selector_1,
    ".foo::bar {a: b}
    .baz {@extend .foo}
    ",
    ".foo::bar, .baz::bar {\n  a: b;\n}\n"
);
test!(
    pseudoelement_remains_at_end_of_selector_2,
    "a.foo::bar {a: b}
    .baz {@extend .foo}
    ",
    "a.foo::bar, a.baz::bar {\n  a: b;\n}\n"
);
test!(
    pseudoclass_remains_at_end_of_selector_1,
    ".foo:bar {a: b}
    .baz {@extend .foo}
    ",
    ".foo:bar, .baz:bar {\n  a: b;\n}\n"
);
test!(
    pseudoclass_remains_at_end_of_selector_2,
    "a.foo:bar {a: b}
    .baz {@extend .foo}
    ",
    "a.foo:bar, a.baz:bar {\n  a: b;\n}\n"
);
test!(
    pseudoclass_not_remains_at_end_of_selector,
    ".foo:not(.bar) {a: b}
    .baz {@extend .foo}
    ",
    ".foo:not(.bar), .baz:not(.bar) {\n  a: b;\n}\n"
);
test!(
    pseudoelement_goes_lefter_than_pseudoclass_1,
    ".foo::bar {a: b}
    .baz:bang {@extend .foo}
    ",
    ".foo::bar, .baz:bang::bar {\n  a: b;\n}\n"
);
test!(
    pseudoelement_goes_lefter_than_pseudoclass_2,
    ".foo:bar {a: b}
    .baz::bang {@extend .foo}
    ",
    ".foo:bar, .baz:bar::bang {\n  a: b;\n}\n"
);
test!(
    pseudoelement_goes_lefter_than_not_1,
    ".foo::bar {a: b}
    .baz:not(.bang) {@extend .foo}
    ",
    ".foo::bar, .baz:not(.bang)::bar {\n  a: b;\n}\n"
);
test!(
    pseudoelement_goes_lefter_than_not_2,
    "%a {
        a:b;
      }
      b:after:not(:first-child) {
        @extend %a;
      }
      c:s {
        @extend %a;
      }
      d::e {
        @extend c;
      }
    ",
    "c:s, d:s::e, b:after:not(:first-child) {\n  a: b;\n}\n"
);
test!(
    pseudoelement_goes_lefter_than_not_3,
    ".foo:not(.bang) {a: b}
    .baz::bar {@extend .foo}
    ",
    ".foo:not(.bang), .baz:not(.bang)::bar {\n  a: b;\n}\n"
);
test!(
    negation_unification_1,
    "%-a :not(.foo).baz {a: b}
    :not(.bar) {@extend .baz} -a {@extend %-a}
    ",
    "-a :not(.foo).baz, -a :not(.foo):not(.bar) {\n  a: b;\n}\n"
);
test!(
    negation_unification_2,
    "%-a :not(.foo).baz {a: b}
    :not(.foo) {@extend .baz} -a {@extend %-a}
    ",
    "-a :not(.foo) {\n  a: b;\n}\n"
);
test!(
    negation_unification_3,
    "%-a :not([a=b]).baz {a: b}
    :not([a = b]) {@extend .baz} -a {@extend %-a}
    ",
    "-a :not([a=b]) {\n  a: b;\n}\n"
);
test!(
    comma_extendee,
    ".foo {a: b}
    .bar {c: d}
    .baz {@extend .foo, .bar}
    ",
    ".foo, .baz {\n  a: b;\n}\n\n.bar, .baz {\n  c: d;\n}\n"
);
test!(
    redundant_selector_elimination,
    ".foo.bar {a: b}
    .x {@extend .foo, .bar}
    .y {@extend .foo, .bar}
    ",
    ".foo.bar, .y, .x {\n  a: b;\n}\n"
);
error!(
    extend_compound_selector,
    "ns|*.foo.bar {a: b}
    a.baz {@extend .foo.bar}
    ",
    "Error: compound selectors may no longer be extended."
);
test!(
    compound_extender,
    ".foo.bar {a: b}
    .baz.bang {@extend .foo}
    ",
    ".foo.bar, .bar.baz.bang {\n  a: b;\n}\n"
);
test!(
    compound_extender_unification,
    "ns|*.foo.bar {a: b}
    a.baz {@extend .foo}
    ",
    "ns|*.foo.bar {\n  a: b;\n}\n"
);
test!(
    complex_extender,
    ".foo {a: b}
    foo bar {@extend .foo}
    ",
    ".foo, foo bar {\n  a: b;\n}\n"
);
test!(
    complex_extender_unification,
    ".foo.bar {a: b}
    foo bar {@extend .foo}
    ",
    ".foo.bar, foo bar.bar {\n  a: b;\n}\n"
);
test!(
    complex_extender_alternates_parents,
    ".baz .bip .foo {a: b}
    foo .grank bar {@extend .foo}
    ",
    ".baz .bip .foo, .baz .bip foo .grank bar, foo .grank .baz .bip bar {\n  a: b;\n}\n"
);
test!(
    complex_extender_unifies_identical_parents,
    ".baz .bip .foo {a: b}
    .baz .bip bar {@extend .foo}
    ",
    ".baz .bip .foo, .baz .bip bar {\n  a: b;\n}\n"
);
test!(
    complex_extender_unifies_common_substring,
    ".baz .bip .bap .bink .foo {a: b}
    .brat .bip .bap bar {@extend .foo}
    ",
    ".baz .bip .bap .bink .foo, .baz .brat .bip .bap .bink bar, .brat .baz .bip .bap .bink bar \
     {\n  a: b;\n}\n"
);
test!(
    complex_extender_unifies_common_subsequence,
    ".a .x .b .y .foo {a: b}
    .a .n .b .m bar {@extend .foo}
    ",
    ".a .x .b .y .foo, .a .x .n .b .y .m bar, .a .n .x .b .y .m bar, .a .x .n .b .m .y bar, .a .n \
     .x .b .m .y bar {\n  a: b;\n}\n"
);
test!(
    complex_extender_chooses_first_subsequence,
    ".a .b .c .d .foo {a: b}
    .c .d .a .b .bar {@extend .foo}
    ",
    ".a .b .c .d .foo, .a .b .c .d .a .b .bar {\n  a: b;\n}\n"
);
test!(
    complex_extender_counts_extended_superselectors,
    ".a .bip .foo {a: b}
    .b .bip.bop .bar {@extend .foo}
    ",
    ".a .bip .foo, .a .b .bip.bop .bar, .b .a .bip.bop .bar {\n  a: b;\n}\n"
);
test!(
    complex_extender_child_combinator,
    ".baz .foo {a: b}
    foo > bar {@extend .foo}
    ",
    ".baz .foo, .baz foo > bar {\n  a: b;\n}\n"
);
test!(
    complex_extender_finds_common_selectors_around_child_combinator_1,
    "a > b c .c1 {a: b}
    a c .c2 {@extend .c1}
    ",
    "a > b c .c1, a > b c .c2 {\n  a: b;\n}\n"
);
test!(
    complex_extender_finds_common_selectors_around_child_combinator_2,
    "a > b c .c1 {a: b}
    b c .c2 {@extend .c1}
    ",
    "a > b c .c1, a > b c .c2 {\n  a: b;\n}\n"
);
test!(
    complex_extender_finds_common_selectors_around_adjacent_sibling_combinator_1,
    "a + b c .c1 {a: b}
    a c .c2 {@extend .c1}
    ",
    "a + b c .c1, a + b a c .c2, a a + b c .c2 {\n  a: b;\n}\n"
);
test!(
    complex_extender_finds_common_selectors_around_adjacent_sibling_combinator_2,
    "a + b c .c1 {a: b}
    a b .c2 {@extend .c1}
    ",
    "a + b c .c1, a a + b c .c2 {\n  a: b;\n}\n"
);
test!(
    complex_extender_finds_common_selectors_around_adjacent_sibling_combinator_3,
    "a + b c .c1 {a: b}
    b c .c2 {@extend .c1}
    ",
    "a + b c .c1, a + b c .c2 {\n  a: b;\n}\n"
);
test!(
    complex_extender_finds_common_selectors_around_sibling_combinator_1,
    "a ~ b c .c1 {a: b}
    a c .c2 {@extend .c1}
    ",
    "a ~ b c .c1, a ~ b a c .c2, a a ~ b c .c2 {\n  a: b;\n}\n"
);
test!(
    complex_extender_finds_common_selectors_around_sibling_combinator_2,
    "a ~ b c .c1 {a: b}
    a b .c2 {@extend .c1}
    ",
    "a ~ b c .c1, a a ~ b c .c2 {\n  a: b;\n}\n"
);
test!(
    complex_extender_finds_common_selectors_around_sibling_combinator_3,
    "a ~ b c .c1 {a: b}
    b c .c2 {@extend .c1}
    ",
    "a ~ b c .c1, a ~ b c .c2 {\n  a: b;\n}\n"
);
test!(
    complex_extender_with_early_child_selectors_doesnt_subsequence_them_1,
    ".bip > .bap .foo {a: b}
    .grip > .bap .bar {@extend .foo}
    ",
    ".bip > .bap .foo, .bip > .bap .grip > .bap .bar, .grip > .bap .bip > .bap .bar {\n  a: \
     b;\n}\n"
);
test!(
    complex_extender_with_early_child_selectors_doesnt_subsequence_them_2,
    ".bap > .bip .foo {a: b}
    .bap > .grip .bar {@extend .foo}
    ",
    ".bap > .bip .foo, .bap > .bip .bap > .grip .bar, .bap > .grip .bap > .bip .bar {\n  a: \
     b;\n}\n"
);
test!(
    complex_extender_with_child_selector_unifies_1,
    ".baz.foo {a: b}
    foo > bar {@extend .foo}
    ",
    ".baz.foo, foo > bar.baz {\n  a: b;\n}\n"
);
test!(
    complex_extender_with_child_selector_unifies_2,
    ".baz > {
        .foo {a: b}
        .bar {@extend .foo}
    }
    ",
    ".baz > .foo, .baz > .bar {\n  a: b;\n}\n"
);
test!(
    complex_extender_with_child_selector_unifies_3,
    ".foo {
        .bar {a: b}
        > .baz {@extend .bar}
    }
    ",
    ".foo .bar, .foo > .baz {\n  a: b;\n}\n"
);
test!(
    complex_extender_with_early_child_selector_1,
    ".foo {
        .bar {a: b}
        .bip > .baz {@extend .bar}
    }
    ",
    ".foo .bar, .foo .bip > .baz {\n  a: b;\n}\n"
);
test!(
    complex_extender_with_early_child_selector_2,
    ".foo {
        .bip .bar {a: b}
        > .baz {@extend .bar}
    }
    ",
    ".foo .bip .bar, .foo .bip .foo > .baz {\n  a: b;\n}\n"
);
test!(
    complex_extender_with_early_child_selector_3,
    ".foo > .bar {a: b}
    .bip + .baz {@extend .bar}
    ",
    ".foo > .bar, .foo > .bip + .baz {\n  a: b;\n}\n"
);
test!(
    complex_extender_with_early_child_selector_4,
    ".foo + .bar {a: b}
    .bip > .baz {@extend .bar}
    ",
    ".foo + .bar, .bip > .foo + .baz {\n  a: b;\n}\n"
);
test!(
    complex_extender_with_early_child_selector_5,
    ".foo > .bar {a: b}
    .bip > .baz {@extend .bar}
    ",
    ".foo > .bar, .bip.foo > .baz {\n  a: b;\n}\n"
);
test!(
    complex_extender_with_sibling_selector,
    ".baz .foo {a: b}
    foo + bar {@extend .foo}
    ",
    ".baz .foo, .baz foo + bar {\n  a: b;\n}\n"
);
test!(
    complex_extender_with_hacky_selector_1,
    ".baz .foo {a: b}
    foo + > > + bar {@extend .foo}
    ",
    ".baz .foo, .baz foo + > > + bar, foo .baz + > > + bar {\n  a: b;\n}\n"
);
test!(
    complex_extender_with_hacky_selector_2,
    ".baz .foo {a: b}
    > > bar {@extend .foo}
    ",
    ".baz .foo, > > .baz bar {\n  a: b;\n}\n"
);
test!(
    complex_extender_merges_with_the_same_selector,
    ".foo {
        .bar {a: b}
        .baz {@extend .bar}
    }
    ",
    ".foo .bar, .foo .baz {\n  a: b;\n}\n"
);
test!(
    complex_extender_with_child_selector_merges_with_the_same_selector,
    ".foo > .bar .baz {a: b}
    .foo > .bar .bang {@extend .baz}
    ",
    ".foo > .bar .baz, .foo > .bar .bang {\n  a: b;\n}\n"
);
test!(
    combinator_unification_for_hacky_combinators_1,
    ".a > + x {a: b}
    .b y {@extend x}
    ",
    ".a > + x, .a .b > + y, .b .a > + y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_for_hacky_combinators_2,
    ".a x {a: b}
    .b > + y {@extend x}
    ",
    ".a x, .a .b > + y, .b .a > + y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_for_hacky_combinators_3,
    ".a > + x {a: b}
    .b > + y {@extend x}
    ",
    ".a > + x, .a .b > + y, .b .a > + y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_for_hacky_combinators_4,
    ".a ~ > + x {a: b}
    .b > + y {@extend x}
    ",
    ".a ~ > + x, .a .b ~ > + y, .b .a ~ > + y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_for_hacky_combinators_5,
    ".a + > x {a: b}
    .b > + y {@extend x}
    ",
    ".a + > x {\n  a: b;\n}\n"
);
test!(
    combinator_unification_for_hacky_combinators_6,
    ".a + > x {a: b}
    .b > + y {@extend x}
    ",
    ".a + > x {\n  a: b;\n}\n"
);
test!(
    combinator_unification_for_hacky_combinators_7,
    ".a ~ > + .b > x {a: b}
    .c > + .d > y {@extend x}
    ",
    ".a ~ > + .b > x, .a .c ~ > + .d.b > y, .c .a ~ > + .d.b > y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_double_tilde_1,
    ".a.b ~ x {a: b}
    .a ~ y {@extend x}
    ",
    ".a.b ~ x, .a.b ~ y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_double_tilde_2,
    ".a ~ x {a: b}
    .a.b ~ y {@extend x}
    ",
    ".a ~ x, .a.b ~ y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_double_tilde_3,
    ".a ~ x {a: b}
    .b ~ y {@extend x}
    ",
    ".a ~ x, .a ~ .b ~ y, .b ~ .a ~ y, .b.a ~ y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_double_tilde_4,
    "a.a ~ x {a: b}
    b.b ~ y {@extend x}
    ",
    "a.a ~ x, a.a ~ b.b ~ y, b.b ~ a.a ~ y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_tilde_plus_1,
    ".a.b + x {a: b}
    .a ~ y {@extend x}
    ",
    ".a.b + x, .a.b + y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_tilde_plus_2,
    ".a + x {a: b}
    .a.b ~ y {@extend x}
    ",
    ".a + x, .a.b ~ .a + y, .a.b + y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_tilde_plus_3,
    ".a + x {a: b}
    .b ~ y {@extend x}
    ",
    ".a + x, .b ~ .a + y, .b.a + y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_tilde_plus_4,
    "a.a + x {a: b}
    b.b ~ y {@extend x}
    ",
    "a.a + x, b.b ~ a.a + y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_tilde_plus_5,
    ".a.b ~ x {a: b}
    .a + y {@extend x}
    ",
    ".a.b ~ x, .a.b ~ .a + y, .a.b + y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_tilde_plus_6,
    ".a ~ x {a: b}
    .a.b + y {@extend x}
    ",
    ".a ~ x, .a.b + y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_tilde_plus_7,
    ".a ~ x {a: b}
    .b + y {@extend x}
    ",
    ".a ~ x, .a ~ .b + y, .b.a + y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_angle_sibling_1,
    ".a > x {a: b}
    .b ~ y {@extend x}
    ",
    ".a > x, .a > .b ~ y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_angle_sibling_2,
    ".a > x {a: b}
    .b + y {@extend x}
    ",
    ".a > x, .a > .b + y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_angle_sibling_3,
    ".a ~ x {a: b}
    .b > y {@extend x}
    ",
    ".a ~ x, .b > .a ~ y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_angle_sibling_4,
    ".a + x {a: b}
    .b > y {@extend x}
    ",
    ".a + x, .b > .a + y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_double_angle_1,
    ".a.b > x {a: b}
    .b > y {@extend x}
    ",
    ".a.b > x, .b.a > y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_double_angle_2,
    ".a > x {a: b}
    .a.b > y {@extend x}
    ",
    ".a > x, .a.b > y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_double_angle_3,
    ".a > x {a: b}
    .b > y {@extend x}
    ",
    ".a > x, .b.a > y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_double_angle_4,
    "a.a > x {a: b}
    b.b > y {@extend x}
    ",
    "a.a > x {\n  a: b;\n}\n"
);
test!(
    combinator_unification_double_plus_1,
    ".a.b + x {a: b}
    .b + y {@extend x}
    ",
    ".a.b + x, .b.a + y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_double_plus_2,
    ".a + x {a: b}
    .a.b + y {@extend x}
    ",
    ".a + x, .a.b + y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_double_plus_3,
    ".a + x {a: b}
    .b + y {@extend x}
    ",
    ".a + x, .b.a + y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_double_plus_4,
    "a.a + x {a: b}
    b.b + y {@extend x}
    ",
    "a.a + x {\n  a: b;\n}\n"
);
test!(
    combinator_unification_angle_space_1,
    ".a.b > x {a: b}
    .a y {@extend x}
    ",
    ".a.b > x, .a.b > y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_angle_space_2,
    ".a > x {a: b}
    .a.b y {@extend x}
    ",
    ".a > x, .a.b .a > y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_angle_space_3,
    ".a > x {a: b}
    .b y {@extend x}
    ",
    ".a > x, .b .a > y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_angle_space_4,
    ".a.b x {a: b}
    .a > y {@extend x}
    ",
    ".a.b x, .a.b .a > y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_angle_space_5,
    ".a x {a: b}
    .a.b > y {@extend x}
    ",
    ".a x, .a.b > y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_angle_space_6,
    ".a x {a: b}
    .b > y {@extend x}
    ",
    ".a x, .a .b > y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_plus_space_1,
    ".a.b + x {a: b}
    .a y {@extend x}
    ",
    ".a.b + x, .a .a.b + y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_plus_space_2,
    ".a + x {a: b}
    .a.b y {@extend x}
    ",
    ".a + x, .a.b .a + y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_plus_space_3,
    ".a + x {a: b}
    .b y {@extend x}
    ",
    ".a + x, .b .a + y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_plus_space_4,
    ".a.b x {a: b}
    .a + y {@extend x}
    ",
    ".a.b x, .a.b .a + y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_plus_space_5,
    ".a x {a: b}
    .a.b + y {@extend x}
    ",
    ".a x, .a .a.b + y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_plus_space_6,
    ".a x {a: b}
    .b + y {@extend x}
    ",
    ".a x, .a .b + y {\n  a: b;\n}\n"
);
test!(
    nested_combinator_unification_1,
    ".a > .b + x {a: b}
    .c > .d + y {@extend x}
    ",
    ".a > .b + x, .c.a > .d.b + y {\n  a: b;\n}\n"
);
test!(
    nested_combinator_unification_2,
    ".a > .b + x {a: b}
    .c > y {@extend x}
    ",
    ".a > .b + x, .c.a > .b + y {\n  a: b;\n}\n"
);
test!(
    combinator_unification_with_newlines,
    ".a >\n.b\n+ x {a: b}\n.c\n> .d +\ny {@extend x}\n",
    ".a > .b + x, .c.a > .d.b + y {\n  a: b;\n}\n"
);
test!(
    basic_extend_loop,
    ".foo {a: b; @extend .bar}
    .bar {c: d; @extend .foo}
    ",
    ".foo, .bar {\n  a: b;\n}\n\n.bar, .foo {\n  c: d;\n}\n"
);
test!(
    #[ignore = "Rc<RefCell<Selector>>"]
    three_level_extend_loop,
    ".foo {a: b; @extend .bar}
    .bar {c: d; @extend .baz}
    .baz {e: f; @extend .foo}
    ",
    ".foo, .baz, .bar {\n  a: b;\n}\n\n.bar, .foo, .baz {\n  c: d;\n}\n\n.baz, .bar, .foo {\n  e: \
     f;\n}\n"
);
test!(
    nested_extend_loop,
    ".bar {
        a: b;
        .foo {c: d; @extend .bar}
    }
    ",
    ".bar, .bar .foo {\n  a: b;\n}\n.bar .foo {\n  c: d;\n}\n"
);
test!(
    multiple_extender_merges_with_superset_selector,
    ".foo {@extend .bar; @extend .baz}
    a.bar.baz {a: b}
    ",
    "a.bar.baz, a.foo {\n  a: b;\n}\n"
);
test!(
    inside_control_flow_if,
    ".true  { color: green; }
    .false { color: red;   }
    .also-true {
    @if true { @extend .true;  }
    @else    { @extend .false; }
    }
    .also-false {
    @if false { @extend .true;  }
    @else     { @extend .false; }
    }
    ",
    ".true, .also-true {\n  color: green;\n}\n\n.false, .also-false {\n  color: red;\n}\n"
);
test!(
    inside_control_flow_for,
    "
    .base-0  { color: green; }
    .base-1  { display: block; }
    .base-2  { border: 1px solid blue; }
    .added {
      @for $i from 0 to 3 {
          @extend .base-#{$i};
      }
    }
    ",
    ".base-0, .added {\n  color: green;\n}\n\n.base-1, .added {\n  display: block;\n}\n\n.base-2, \
     .added {\n  border: 1px solid blue;\n}\n"
);
test!(
    inside_control_flow_while,
    "
    .base-0  { color: green; }
    .base-1  { display: block; }
    .base-2  { border: 1px solid blue; }
    .added {
      $i : 0;
      @while $i < 3 {
        @extend .base-#{$i};
        $i : $i + 1;
      }
    }
    ",
    ".base-0, .added {\n  color: green;\n}\n\n.base-1, .added {\n  display: block;\n}\n\n.base-2, \
     .added {\n  border: 1px solid blue;\n}\n"
);
test!(
    basic_placeholder,
    "%foo {a: b}
    .bar {@extend %foo}
    ",
    ".bar {\n  a: b;\n}\n"
);
test!(
    unused_placeholder,
    "%foo {a: b}
    %bar {a: b}
    .baz {@extend %foo}
    ",
    ".baz {\n  a: b;\n}\n"
);
test!(
    placeholder_descendant,
    "#context %foo a {a: b}
    .bar {@extend %foo}
    ",
    "#context .bar a {\n  a: b;\n}\n"
);
test!(
    semi_placeholder,
    "#context %foo, .bar .baz {a: b}

    .bat {
      @extend %foo;
    }
    ",
    "#context .bat, .bar .baz {\n  a: b;\n}\n"
);
test!(
    placeholder_with_multiple_extenders,
    "%foo {a: b}
    .bar {@extend %foo}
    .baz {@extend %foo}
    ",
    ".baz, .bar {\n  a: b;\n}\n"
);
test!(
    placeholder_interpolation,
    "$foo: foo;

    %#{$foo} {a: b}
    .bar {@extend %foo}
    ",
    ".bar {\n  a: b;\n}\n"
);
test!(
    media_inside_placeholder,
    "%foo {bar {@media screen {a {b: c}}}}
    .baz {c: d}
    ",
    ".baz {\n  c: d;\n}\n"
);
test!(
    extend_within_media,
    "@media screen {
        .foo {a: b}
        .bar {@extend .foo}
    }
    ",
    "@media screen {\n  .foo, .bar {\n    a: b;\n  }\n}\n"
);
test!(
    extend_within_unknown_at_rule,
    "@unknown {
        .foo {a: b}
        .bar {@extend .foo}
    }
    ",
    "@unknown {\n  .foo, .bar {\n    a: b;\n  }\n}\n"
);
test!(
    extend_within_nested_at_rules,
    "@media screen {
      @unknown {
        .foo {a: b}
        .bar {@extend .foo}
      }
    }
    ",
    "@media screen {\n  @unknown {\n    .foo, .bar {\n      a: b;\n    }\n  }\n}\n"
);
test!(
    #[ignore = "media queries are not yet parsed correctly"]
    extend_within_separate_media_queries,
    "@media screen {.foo {a: b}}
    @media screen {.bar {@extend .foo}}
    ",
    "@media screen {\n  .foo, .bar {\n    a: b;\n  }\n}\n"
);
test!(
    #[ignore = "media queries are not yet parsed correctly"]
    extend_within_separate_unknown_at_rules,
    "@unknown {.foo {a: b}}
    @unknown {.bar {@extend .foo}}
    ",
    "@unknown {\n  .foo, .bar {\n    a: b;\n  }\n}\n@unknown {}\n"
);
test!(
    #[ignore = "media queries are not yet parsed correctly"]
    extend_within_separate_nested_at_rules,
    "@media screen {@flooblehoof {.foo {a: b}}}
    @media screen {@flooblehoof {.bar {@extend .foo}}}
    ",
    "@media screen {\n  @flooblehoof {\n    .foo, .bar {\n      a: b;\n    }\n  }\n}\n@media \
     screen {\n  @flooblehoof {}\n}\n"
);
test!(
    extend_succeeds_when_one_extend_fails_but_others_dont,
    "a.bar {a: b}
    .bar {c: d}
    b.foo {@extend .bar}
    ",
    "a.bar {\n  a: b;\n}\n\n.bar, b.foo {\n  c: d;\n}\n"
);
test!(
    optional_extend_succeeds_when_extendee_doesnt_exist,
    ".foo {@extend .bar !optional}",
    ""
);
test!(
    optional_extend_succeeds_when_extension_fails,
    "a.bar {a: b}
    b.foo {@extend .bar !optional}
    ",
    "a.bar {\n  a: b;\n}\n"
);
test!(
    psuedo_element_superselector_1,
    "%x#bar {a: b} // Add an id to make the results have high specificity
    %y, %y::fblthp {@extend %x}
    a {@extend %y}
    ",
    "a#bar, a#bar::fblthp {\n  a: b;\n}\n"
);
test!(
    psuedo_element_superselector_2,
    "%x#bar {a: b}
    %y, %y:fblthp {@extend %x}
    a {@extend %y}    
    ",
    "a#bar {\n  a: b;\n}\n"
);
test!(
    psuedo_element_superselector_3,
    "%x#bar {a: b}
    %y, %y:first-line {@extend %x}
    a {@extend %y}       
    ",
    "a#bar, a#bar:first-line {\n  a: b;\n}\n"
);
test!(
    psuedo_element_superselector_4,
    "%x#bar {a: b}
    %y, %y:first-letter {@extend %x}
    a {@extend %y}    
    ",
    "a#bar, a#bar:first-letter {\n  a: b;\n}\n"
);
test!(
    psuedo_element_superselector_5,
    "%x#bar {a: b}
    %y, %y:before {@extend %x}
    a {@extend %y}    
    ",
    "a#bar, a#bar:before {\n  a: b;\n}\n"
);
test!(
    psuedo_element_superselector_6,
    "%x#bar {a: b}
    %y, %y:after {@extend %x}
    a {@extend %y}    
    ",
    "a#bar, a#bar:after {\n  a: b;\n}\n"
);
test!(
    multiple_source_redundancy_elimination,
    "%default-color {color: red}
    %alt-color {color: green}
    
    %default-style {
    @extend %default-color;
    &:hover {@extend %alt-color}
    &:active {@extend %default-color}
    }
    
    .test-case {@extend %default-style}    
    ",
    ".test-case:active, .test-case {\n  color: red;\n}\n\n.test-case:hover {\n  color: green;\n}\n"
);
test!(
    nested_sibling_extend,
    ".foo {@extend .bar}

    .parent {
      .bar {
        a: b;
      }
      .foo {
        @extend .bar
      }
    }    
    ",
    ".parent .bar, .parent .foo {\n  a: b;\n}\n"
);
test!(
    parent_and_sibling_extend,
    "%foo %bar%baz {a: b}

    .parent1 {
      @extend %foo;
      .child1 {@extend %bar}
    }
    
    .parent2 {
      @extend %foo;
      .child2 {@extend %baz}
    }    
    ",
    ".parent1 .parent2 .child1.child2, .parent2 .parent1 .child1.child2 {\n  a: b;\n}\n"
);
test!(
    nested_extend_specificity,
    "%foo {a: b}

    a {
      :b {@extend %foo}
      :b:c {@extend %foo}
    }
    ",
    "a :b:c, a :b {\n  a: b;\n}\n"
);
test!(
    double_extend_optimization,
    "%foo %bar {
        a: b;
    }
        
    .parent1 {
        @extend %foo;
        
        .child {
          @extend %bar;
        }
    }
        
    .parent2 {
        @extend %foo;
    }        
    ",
    ".parent1 .child {\n  a: b;\n}\n"
);
test!(
    #[ignore = "media queries are not yet parsed correctly"]
    extend_inside_double_nested_media,
    "@media all {
        @media (orientation: landscape) {
          %foo {color: blue}
          .bar {@extend %foo}
        }
    }        
    ",
    "@media (orientation: landscape) {\n  .bar {\n    color: blue;\n  }\n}\n"
);
test!(
    partially_failed_extend,
    "test { @extend .rc; }
    .rc {color: white;}
    .prices span.pill span.rc {color: red;}    
    ",
    ".rc, test {\n  color: white;\n}\n\n.prices span.pill span.rc {\n  color: red;\n}\n"
);
test!(
    newline_near_combinator,
    ".a +
    .b x {a: b}
    .c y {@extend x}    
    ",
    ".a + .b x, .a + .b .c y, .c .a + .b y {\n  a: b;\n}\n"
);
test!(
    duplicated_selector_with_newlines,
    ".example-1-1,
    .example-1-2,
    .example-1-3 {
      a: b;
    }
    
    .my-page-1 .my-module-1-1 {@extend .example-1-2}     
    ",
    ".example-1-1,\n.example-1-2,\n.my-page-1 .my-module-1-1,\n.example-1-3 {\n  a: b;\n}\n"
);
test!(
    nested_selector_with_child_selector_hack_extendee,
    "> .foo {a: b}
    foo bar {@extend .foo}    
    ",
    "> .foo, > foo bar {\n  a: b;\n}\n"
);
test!(
    nested_selector_with_child_selector_hack_extender,
    ".foo .bar {a: b}
    > foo bar {@extend .bar}    
    ",
    ".foo .bar, > .foo foo bar, > foo .foo bar {\n  a: b;\n}\n"
);
test!(
    nested_selector_with_child_selector_hack_extender_and_extendee,
    "> .foo {a: b}
    > foo bar {@extend .foo}    
    ",
    "> .foo, > foo bar {\n  a: b;\n}\n"
);
test!(
    nested_selector_with_child_selector_hack_extender_and_sibling_extendee,
    "~ .foo {a: b}
    > foo bar {@extend .foo}    
    ",
    "~ .foo {\n  a: b;\n}\n"
);
test!(
    nested_selector_with_child_selector_hack_extender_and_extendee_newline,
    "> .foo {a: b}\nflip,\n> foo bar {@extend .foo}\n",
    "> .foo, > flip,\n> foo bar {\n  a: b;\n}\n"
);
test!(
    extended_parent_and_child_redundancy_elimination,
    "a {
        b {a: b}
        c {@extend b}
    }
    d {@extend a}
    ",
    "a b, d b, a c, d c {\n  a: b;\n}\n"
);
test!(
    redundancy_elimination_when_it_would_reduce_specificity,
    "a {a: b}
    a.foo {@extend a}    
    ",
    "a, a.foo {\n  a: b;\n}\n"
);
test!(
    redundancy_elimination_when_it_would_preserve_specificity,
    ".bar a {a: b}
    a.foo {@extend a}    
    ",
    ".bar a {\n  a: b;\n}\n"
);
test!(
    redundancy_elimination_never_eliminates_base_selector,
    "a.foo {a: b}
    .foo {@extend a}      
    ",
    "a.foo, .foo {\n  a: b;\n}\n"
);
test!(
    cross_branch_redundancy_elimination_1,
    "%x .c %y {a: b}
    .a, .b {@extend %x}
    .a .d {@extend %y}    
    ",
    ".a .c .d, .b .c .a .d {\n  a: b;\n}\n"
);
test!(
    cross_branch_redundancy_elimination_2,
    ".e %z {a: b}
    %x .c %y {@extend %z}
    .a, .b {@extend %x}
    .a .d {@extend %y}    
    ",
    ".e .a .c .d, .e .b .c .a .d, .a .e .b .c .d, .a .c .e .d, .b .c .e .a .d {\n  a: b;\n}\n"
);
test!(
    extend_with_universal_selector,
    "%-a *.foo1 {a: b}
    a {@extend .foo1}
    -a {@extend %-a}
    
    %-b *|*.foo2 {b: b}
    b {@extend .foo2}
    -b {@extend %-b}    
    ",
    "-a *.foo1, -a a {\n  a: b;\n}\n\n-b *|*.foo2, -b b {\n  b: b;\n}\n"
);
test!(
    extend_with_universal_selector_empty_namespace,
    "%-a |*.foo {a: b}
    a {@extend .foo}
    -a {@extend %-a}    
    ",
    "-a |*.foo {\n  a: b;\n}\n"
);
test!(
    extend_with_universal_selector_different_namespace,
    "%-a ns|*.foo {a: b}
    a {@extend .foo}
    -a {@extend %-a}    
    ",
    "-a ns|*.foo {\n  a: b;\n}\n"
);
test!(
    unify_root_pseudo_element,
    "// We assume that by default classes don't apply to the :root unless marked explicitly.
    :root .foo-1 { test: 1; }
    .bar-1 .baz-1 { @extend .foo-1; }
    
    // We know the two classes must be the same :root element so we can combine them.
    .foo-2:root .bar-2 { test: 2; }
    .baz-2:root .bang-2 { @extend .bar-2; }
    
    // This extend should not apply because the :root elements are different.
    html:root .bar-3 { test: 3; }
    xml:root .bang-3 { @extend .bar-3}
    
    // We assume that direct descendant of the :root is not the same element as a descendant.
    .foo-4:root > .bar-4 .x-4 { test: 4; }
    .baz-4:root .bang-4 .y-4 {@extend .x-4}    
    ",
    ":root .foo-1, :root .bar-1 .baz-1 {\n  test: 1;\n}\n\n.foo-2:root .bar-2, .baz-2.foo-2:root \
     .bang-2 {\n  test: 2;\n}\n\nhtml:root .bar-3 {\n  test: 3;\n}\n\n.foo-4:root > .bar-4 .x-4, \
     .baz-4.foo-4:root > .bar-4 .bang-4 .y-4 {\n  test: 4;\n}\n"
);
test!(
    compound_unification_in_not,
    "// Make sure compound selectors are unified when two :not()s are extended.
    // :not() is special here because it's the only selector that's extended by
    // adding to the compound selector, rather than creating a new selector list.
    .a {@extend .c}
    .b {@extend .d}
    :not(.c):not(.d) {a: b}    
    ",
    ":not(.c):not(.a):not(.d):not(.b) {\n  a: b;\n}\n"
);
test!(
    #[ignore = "media queries are not yet parsed correctly"]
    does_not_move_page_block_in_media,
    "@media screen {
        a { x:y; }
        @page {}
    }      
    ",
    "@media screen {\n  a {\n    x: y;\n  }\n\n  @page {}\n}\n"
);
test!(
    escaped_selector,
    "// Escapes in selectors' identifiers should be normalized before `@extend` is
    // applied.
    .foo {escape: none}
    \\.foo {escape: slash dot}
    \\2E foo {escape: hex}
    
    .bar {@extend \\02e foo}    
    ",
    ".foo {\n  escape: none;\n}\n\n\\.foo, .bar {\n  escape: slash dot;\n}\n\n\\.foo, .bar {\n  \
     escape: hex;\n}\n"
);
test!(
    #[ignore = "Rc<RefCell<Selector>>"]
    extend_extender,
    "// For implementations like Dart Sass that process extensions as they occur,
    // extending rules that contain their own extends needs special handling.
    .b {@extend .a}
    .c {@extend .b}
    .a {x: y}      
    ",
    ".a, .b, .c {\n  x: y;\n}\n"
);
test!(
    extend_result_of_extend,
    "// The result of :not(.c) being extended should itself be extendable.
    .a {@extend :not(.b)}
    .b {@extend .c}
    :not(.c) {x: y}    
    ",
    ":not(.c):not(.b), .a:not(.c) {\n  x: y;\n}\n"
);
test!(
    extend_self,
    "// This shouldn't change the selector.
    .c, .a .b .c, .a .c .b {x: y; @extend .c}    
    ",
    ".c, .a .b .c, .a .c .b {\n  x: y;\n}\n"
);
test!(
    dart_sass_issue_146,
    "%btn-style-default {
        background: green;
        &:hover{
          background: black;
        }
      }
      
      button {
        @extend %btn-style-default;
      }      
    ",
    "button {\n  background: green;\n}\nbutton:hover {\n  background: black;\n}\n"
);
test!(
    nested_compound_unification,
    "// Make sure compound unification properly handles weaving together parent
    // selectors.
    .a .b {@extend .e}
    .c .d {@extend .f}
    .e.f {x: y}    
    ",
    ".e.f, .a .f.b, .c .e.d, .a .c .b.d, .c .a .b.d {\n  x: y;\n}\n"
);
test!(
    not_into_not_not,
    "// Regression test for dart-sass#191.
    :not(:not(.x)) {a: b}
    :not(.y) {@extend .x}    
    ",
    ":not(:not(.x)) {\n  a: b;\n}\n"
);
test!(
    selector_list,
    ".foo {a: b}
    .bar {x: y}
    
    // Extending a selector list is equivalent to writing two @extends.
    .baz {@extend .foo, .bar}
    
    // The selector list should be parsed after interpolation is resolved.
    .bang {@extend .foo #{\",\"} .bar}    
    ",
    ".foo, .bang, .baz {\n  a: b;\n}\n\n.bar, .bang, .baz {\n  x: y;\n}\n"
);
test!(
    selector_list_after_selector,
    "a {
        color: red;
    }

    b,
    c {
        @extend a;
    }",
    "a, b,\nc {\n  color: red;\n}\n"
);
test!(
    selector_list_before_selector,
    "b, c {
        @extend a;
    }

    a {
        color: red;
    }",
    "a, b, c {\n  color: red;\n}\n"
);
test!(
    selector_list_of_selector_pseudo_classes_after_selector,
    "foo {
        color: black;
    }

    a:current(foo),
    :current(foo) {
        @extend foo;
    }",
    "foo, a:current(foo),\n:current(foo) {\n  color: black;\n}\n"
);
test!(
    extend_pseudo_selector_class_containing_combinator_without_rhs_selector,
    ":has(a >) b {
        @extend b;
        color: red;
    }",
    ":has(a >) b, :has(a >) :has(a >) :has(a >) b, :has(a >) :has(a >) :has(a >) b {\n  color: \
     red;\n}\n"
);
error!(
    extend_optional_keyword_not_complete,
    "a {
        @extend a !opt;
    }",
    "Error: Expected \"optional\"."
);
error!(
    extend_contains_parent_in_compound_selector,
    "a {
        @extend &b:c; 
    }",
    "Error: Parent selectors aren't allowed here."
);

// todo: extend_loop (massive test)
// todo: extend tests in folders
