#[macro_use]
mod macros;

test!(
    selector_nesting_el_mul_el,
    "a, b {\n  a, b {\n  color: red\n}\n}\n",
    "a a, a b, b a, b b {\n  color: red;\n}\n"
);
test!(selector_element, "a {\n  color: red;\n}\n");
test!(selector_id, "#id {\n  color: red;\n}\n");
test!(selector_class, ".class {\n  color: red;\n}\n");
test!(selector_el_descendant, "a a {\n  color: red;\n}\n");
test!(selector_universal, "* {\n  color: red;\n}\n");
test!(selector_el_class_and, "a.class {\n  color: red;\n}\n");
test!(selector_el_id_and, "a#class {\n  color: red;\n}\n");
test!(
    selector_el_class_descendant,
    "a .class {\n  color: red;\n}\n"
);
test!(selector_el_id_descendant, "a #class {\n  color: red;\n}\n");
test!(
    selector_el_universal_descendant,
    "a * {\n  color: red;\n}\n"
);
test!(
    selector_universal_el_descendant,
    "* a {\n  color: red;\n}\n"
);

test!(selector_attribute_any, "[attr] {\n  color: red;\n}\n");
test!(
    selector_attribute_any_lower_case_insensitive,
    "[attr=val i] {\n  color: red;\n}\n"
);
test!(
    selector_attribute_interpolate,
    "[a#{tt}r=v#{a}l] {\n  color: red;\n}\n",
    "[attr=val] {\n  color: red;\n}\n"
);
test!(
    selector_attribute_any_upper_case_insensitive,
    "[attr=val I] {\n  color: red;\n}\n"
);
test!(
    selector_attribute_arbitrary_modifier,
    "[attr=val c] {\n  color: red;\n}\n"
);
test!(
    selector_attribute_i_in_attr,
    "[atitr=val] {\n  color: red;\n}\n"
);
test!(
    selector_attribute_i_in_val,
    "[attr=vail] {\n  color: red;\n}\n"
);
test!(
    selector_attribute_whitespace,
    "[attr   *=   val      ] {\n  color: red;\n}\n",
    "[attr*=val] {\n  color: red;\n}\n"
);
test!(
    selector_attribute_equals,
    "[attr=val] {\n  color: red;\n}\n"
);
test!(
    selector_attribute_removes_single_quotes,
    "[attr='val'] {\n  color: red;\n}\n",
    "[attr=val] {\n  color: red;\n}\n"
);
test!(
    selector_attribute_removes_double_quotes,
    "[attr=\"val\"] {\n  color: red;\n}\n",
    "[attr=val] {\n  color: red;\n}\n"
);
test!(
    selector_attribute_quotes_non_ident,
    "[attr=\"1\"] {\n  color: red;\n}\n"
);
test!(
    selector_attribute_quotes_custom_property,
    "[attr=\"--foo\"] {\n  color: red;\n}\n"
);
test!(
    selector_attribute_unquoted_escape,
    "[attr=v\\al] {\n  color: red;\n}\n",
    "[attr=v\\a l] {\n  color: red;\n}\n"
);
test!(
    selector_attribute_quoted_escape,
    "[attr=\"v\\al\"] {\n  color: red;\n}\n"
);
test!(
    selector_attribute_namespace,
    "[*|foo] {\n  color: red;\n}\n"
);
error!(
    selector_attribute_missing_equal,
    "[a~b] {\n  color: red;\n}\n", "Error: expected \"=\"."
);
test!(
    selector_attribute_maintains_quotes_around_invalid_identifier,
    "[attr=\"val.\"] {\n  color: red;\n}\n"
);
error!(
    attribute_attr_quoted,
    "[\"attr\"=val] {\n  color: red;\n}\n", "Error: Expected identifier."
);
test!(selector_attribute_in, "[attr~=val] {\n  color: red;\n}\n");
test!(
    selector_attribute_begins_hyphen_or_exact,
    "[attr|=val] {\n  color: red;\n}\n"
);
test!(
    selector_attribute_starts_with,
    "[attr^=val] {\n  color: red;\n}\n"
);
test!(
    selector_attribute_ends_with,
    "[attr$=val] {\n  color: red;\n}\n"
);
test!(
    selector_attribute_contains,
    "[attr*=val] {\n  color: red;\n}\n"
);
test!(selector_el_attribute_and, "a[attr] {\n  color: red;\n}\n");
test!(
    selector_el_attribute_descendant,
    "a [attr] {\n  color: red;\n}\n"
);
test!(
    selector_attribute_interpolated,
    "a {\n  [#{&}] {\n    color: red;\n  }\n}\n",
    "a [a] {\n  color: red;\n}\n"
);
test!(selector_el_mul_el, "a, b {\n  color: red;\n}\n");
test!(
    selector_el_immediate_child_el,
    "a > b {\n  color: red;\n}\n"
);
test!(selector_el_following_el, "a + b {\n  color: red;\n}\n");
test!(selector_el_preceding_el, "a ~ b {\n  color: red;\n}\n");
test!(selector_pseudo, ":pseudo {\n  color: red;\n}\n");
test!(selector_el_and_pseudo, "a:pseudo {\n  color: red;\n}\n");
test!(
    selector_el_pseudo_descendant,
    "a :pseudo {\n  color: red;\n}\n"
);
test!(
    selector_pseudo_el_descendant,
    ":pseudo a {\n  color: red;\n}\n"
);
test!(selector_pseudoelement, "::before {\n  color: red;\n}\n");
test!(
    selector_el_and_pseudoelement,
    "a::before {\n  color: red;\n}\n"
);
test!(
    selector_el_pseudoelement_descendant,
    "a ::before {\n  color: red;\n}\n"
);
test!(
    selector_pseudoelement_el_descendant,
    "::before a {\n  color: red;\n}\n"
);
test!(
    selector_pseudo_paren_comma,
    ":pseudo(a, b, c) {\n  color: red;\n}\n"
);
test!(
    selector_pseudo_paren_space,
    ":pseudo(a b c) {\n  color: red;\n}\n"
);
test!(
    selector_pseudo_paren_whitespacespace,
    ":pseudo(  -2n+1 ) {\n  color: red;\n}\n",
    ":pseudo(-2n+1) {\n  color: red;\n}\n"
);
test!(
    selector_el_pseudo_paren_and,
    "a:pseudo(a, b, c) {\n  color: red;\n}\n"
);
test!(
    selector_el_pseudo_paren_descendant,
    "a :pseudo(a, b, c) {\n  color: red;\n}\n"
);
test!(
    selector_pseudo_paren_el_descendant,
    ":pseudo(a, b, c) a {\n  color: red;\n}\n"
);
test!(
    selector_pseudo_paren_el_nested,
    "a {\n  :pseudo(a, b, c) {\n  color: red;\n  }\n}\n",
    "a :pseudo(a, b, c) {\n  color: red;\n}\n"
);
test!(selector_mul, "a, b {\n  color: red;\n}\n");
test!(
    outer_ampersand,
    "a, b {\n& c {\n  color: red;\n}\n}\n",
    "a c, b c {\n  color: red;\n}\n"
);
test!(
    inner_ampersand,
    "a, b {\na & c {\n  color: red;\n}\n}\n",
    "a a c, a b c {\n  color: red;\n}\n"
);
test!(
    ampersand_multiple_whitespace,
    " a  ,  b   {\n&c {\n  color: red;\n}\n}\n",
    "ac, bc {\n  color: red;\n}\n"
);
test!(
    ampersand_alone,
    "a, b {\n& {\n  color: red;\n}\n}\n",
    "a, b {\n  color: red;\n}\n"
);
test!(
    bem_dash_dash_selector,
    "a {\n&--b {\n  color: red;\n}\n}\n",
    "a--b {\n  color: red;\n}\n"
);
test!(
    bem_underscore_selector,
    "a {\n&__b {\n  color: red;\n}\n}\n",
    "a__b {\n  color: red;\n}\n"
);
test!(
    selector_interpolation_addition,
    "#{\"foo\" + \" bar\"}baz {color: red;}",
    "foo barbaz {\n  color: red;\n}\n"
);
test!(
    selector_interpolation_start,
    "#{a}bc {\n  color: red;\n}\n",
    "abc {\n  color: red;\n}\n"
);
test!(
    selector_interpolation_middle,
    "a#{b}c {\n  color: red;\n}\n",
    "abc {\n  color: red;\n}\n"
);
test!(
    selector_interpolation_end,
    "ab#{c} {\n  color: red;\n}\n",
    "abc {\n  color: red;\n}\n"
);
test!(
    selector_interpolation_variable,
    "$a: foo;\nab#{$a} {\n  color: red;\n}\n",
    "abfoo {\n  color: red;\n}\n"
);
test!(
    selector_interpolation_super_selector,
    "a {\nb #{&} { color: red; }}",
    "a b a {\n  color: red;\n}\n"
);
test!(
    selector_interpolation_super_selector_root_postfix,
    "a#{&} {\nb { color: red; }}",
    "a b {\n  color: red;\n}\n"
);
test!(
    selector_interpolation_super_selector_root_prefix,
    "#{&}a {\nb { color: red; }}",
    "a b {\n  color: red;\n}\n"
);
test!(
    selector_whitespace,
    "  a  >  b  ,  c  ~  d  e  .f  #g  :h  i.j  [  k  ]  { color: red }",
    "a > b, c ~ d e .f #g :h i.j [k] {\n  color: red;\n}\n"
);
test!(
    comment_between_selectors,
    "a /* foo */ b {\n  color: red;\n}\n",
    "a b {\n  color: red;\n}\n"
);
test!(
    interpolates_comma,
    "$x: oo, ba;\nf#{$x}r {\n  baz {\n    color: red;\n  }\n}\n",
    "foo baz, bar baz {\n  color: red;\n}\n"
);
test!(
    extra_commas,
    "div,, , span, ,, {\n  color: red;\n}\n",
    "div, span {\n  color: red;\n}\n"
);
test!(
    combinator_following,
    "a + {\n  b {\n    color: red;\n  }\n}\n",
    "a + b {\n  color: red;\n}\n"
);
test!(
    combinator_preceding,
    "a {\n  + b {\n    color: red;\n  }\n}\n",
    "a + b {\n  color: red;\n}\n"
);
test!(
    combinator_alone,
    "a {\n  + {\n    b {\n      color: red;\n  }\n}\n",
    "a + b {\n  color: red;\n}\n"
);
test!(simple_multiple_newline, "a,\nb {\n  color: red;\n}\n");
test!(
    nested_multiple_newline,
    "a,\nb {\n  c {\n    color: blue;\n  }\n  color: red;\n}\n",
    "a,\nb {\n  color: red;\n}\na c,\nb c {\n  color: blue;\n}\n"
);
test!(
    trailing_comma_newline,
    "#foo #bar,,\n,#baz #boom, {a: b}",
    "#foo #bar,\n#baz #boom {\n  a: b;\n}\n"
);
test!(
    trailing_comma_children,
    "a,, {\n  b {\n    color: /**/red;\n  }\n}\n",
    "a b {\n  color: red;\n}\n"
);
test!(simple_placeholder, "%a {\n  color: red;\n}\n", "");
test!(
    placeholder_first,
    "%a, b {\n  color: red;\n}\n",
    "b {\n  color: red;\n}\n"
);
test!(
    placeholder_last,
    "a, %b {\n  color: red;\n}\n",
    "a {\n  color: red;\n}\n"
);
test!(
    placeholder_middle,
    "a, %b, c {\n  color: red;\n}\n",
    "a, c {\n  color: red;\n}\n"
);
test!(
    removes_leading_space,
    "#{&} a {\n  color: red;\n}\n",
    "a {\n  color: red;\n}\n"
);
test!(allows_id_start_with_number, "#2foo {\n  color: red;\n}\n");
test!(allows_id_only_number, "#2 {\n  color: red;\n}\n");
test!(
    id_interpolation,
    "$zzz: zzz;\n##{$zzz} {\n  a: b;\n}\n",
    "#zzz {\n  a: b;\n}\n"
);
test!(
    interpolate_id_selector,
    "$bar: \"#foo\";\nul li#{$bar} {\n  foo: bar;\n}\n",
    "ul li#foo {\n  foo: bar;\n}\n"
);
test!(escaped_space, "a\\ b {\n  color: foo;\n}\n");
test!(
    escaped_bang,
    "\\! {\n  color: red;\n}\n",
    "\\! {\n  color: red;\n}\n"
);
test!(
    multiple_consecutive_immediate_child,
    "> > foo {\n  color: foo;\n}\n"
);
error!(
    modifier_on_any_attr,
    "[attr i] {color: foo;}", "Error: Expected \"]\"."
);
test!(
    psuedo_paren_child_contains_ampersand,
    ".a, .b {\n  :not(&-c) {\n    d: e\n  }\n}\n",
    ":not(.a-c, .b-c) {\n  d: e;\n}\n"
);
test!(
    psuedo_paren_child_no_ampersand_two_newlines__this_test_confounds_me,
    ".a, .b {\n  :not(-c),\n  :not(-c) {\n    d: e\n  }\n}\n",
    ".a :not(-c),\n.a :not(-c), .b :not(-c),\n.b :not(-c) {\n  d: e;\n}\n"
);
test!(
    psuedo_paren_child_ampersand_two_newlines__this_test_confounds_me,
    ".a, .b {\n  :not(&-c, &-d),\n  :not(&-c) {\n    d: e\n  }\n}\n",
    ":not(.a-c, .a-d, .b-c, .b-d), :not(.a-c, .b-c) {\n  d: e;\n}\n"
);
test!(
    psuedo_paren_child_ampersand_inner_psuedo_paren,
    ".a, .b {\n  :not(:not(&-c)) {\n    d: e\n  }\n}\n",
    ":not(:not(.a-c, .b-c)) {\n  d: e;\n}\n"
);
test!(
    psuedo_paren_child_psuedo_paren_ampersand_inner_psuedo_paren,
    ".a, .b {\n  :not(:not(c), &-d) {\n    d: e\n  }\n}\n",
    ":not(:not(c), .a-d, .b-d) {\n  d: e;\n}\n"
);
test!(
    psuedo_paren_child_ampersand_psuedo_paren__inner_psuedo_paren,
    ".a, .b {\n  :not(&-d, :not(c)) {\n    d: e\n  }\n}\n",
    ":not(.a-d, :not(c), .b-d) {\n  d: e;\n}\n"
);
test!(
    sass_spec__nesting_parent_with_newline,
    ".foo,\n.bar {\n  .baz & {\n    color: red;\n  }\n}\n",
    ".baz .foo,\n.baz .bar {\n  color: red;\n}\n"
);
test!(
    not_only_placeholder_is_universal,
    "a :not(%b) {x: y}",
    "a * {\n  x: y;\n}\n"
);
test!(
    not_placeholder_is_removed,
    "a:not(%b, c) {x: y}",
    "a:not(c) {\n  x: y;\n}\n"
);
test!(
    psuedo_paren_removes_inner_placeholder,
    "a:matches(%b, c) {x: y}",
    "a:matches(c) {\n  x: y;\n}\n"
);
test!(
    matches_placeholder_removes_everything,
    "a:matches(%b) {x: y}",
    ""
);
test!(
    touching_universal_stays_the_same,
    "a* {\n  color: red;\n}\n"
);
test!(
    adjacent_not_placeholder_is_ignored,
    "a:not(%b) {x: y}",
    "a {\n  x: y;\n}\n"
);
test!(
    pseudo_paren_placeholder_alone,
    ":not(%b) {x: y}",
    "* {\n  x: y;\n}\n"
);
test!(
    interpolated_super_selector_in_style,
    "a {\n  color: #{&};\n}\n",
    "a {\n  color: a;\n}\n"
);
test!(
    interpolated_super_selector_in_style_symbols,
    "* .a #b:foo() {\n  color: #{&};\n}\n",
    "* .a #b:foo() {\n  color: * .a #b:foo();\n}\n"
);
test!(
    uninterpolated_super_selector,
    "* .a #b:foo() {\n  color: &;\n}\n",
    "* .a #b:foo() {\n  color: * .a #b:foo();\n}\n"
);
test!(
    interpolated_super_selector_in_selector_and_style,
    "a {\n  b #{&} {\n    color: &;\n  }\n}\n",
    "a b a {\n  color: a b a;\n}\n"
);
test!(
    super_selector_treated_as_list,
    "a, b {\n  color: type-of(&);\n}\n",
    "a, b {\n  color: list;\n}\n"
);
test!(
    length_of_comma_separated_super_selector,
    "a, b {\n  color: length(&);\n}\n",
    "a, b {\n  color: 2;\n}\n"
);
test!(
    nth_1_of_comma_separated_super_selector,
    "a, b {\n  color: nth(&, 1);\n}\n",
    "a, b {\n  color: a;\n}\n"
);
test!(
    nth_2_of_comma_separated_super_selector,
    "a, b {\n  color: nth(&, 2);\n}\n",
    "a, b {\n  color: b;\n}\n"
);
test!(
    length_of_space_separated_super_selector,
    "a b {\n  color: length(&);\n}\n",
    "a b {\n  color: 1;\n}\n"
);
test!(
    nth_1_of_space_separated_super_selector,
    "a b {\n  color: nth(&, 1);\n}\n",
    "a b {\n  color: a b;\n}\n"
);
test!(
    length_of_comma_separated_super_selector_has_compound,
    "a:foo, b {\n  color: length(&);\n}\n",
    "a:foo, b {\n  color: 2;\n}\n"
);
test!(
    nth_1_of_comma_separated_super_selector_has_compound,
    "a:foo, b {\n  color: nth(&, 1);\n}\n",
    "a:foo, b {\n  color: a:foo;\n}\n"
);
test!(
    length_of_space_separated_super_selector_has_compound,
    "a:foo b {\n  color: length(&);\n}\n",
    "a:foo b {\n  color: 1;\n}\n"
);
test!(
    nth_1_of_space_separated_super_selector_has_compound,
    "a:foo b {\n  color: nth(&, 1);\n}\n",
    "a:foo b {\n  color: a:foo b;\n}\n"
);
test!(
    length_super_selector_placeholder,
    "a, %b {\n  color: length(&);\n}\n",
    "a {\n  color: 2;\n}\n"
);
test!(
    nth_2_super_selector_placeholder,
    "a, %b {\n  color: nth(&, 2);\n}\n",
    "a {\n  color: %b;\n}\n"
);
test!(
    escape_at_start_of_selector,
    "\\61 {\n    color: red;\n}\n",
    "a {\n  color: red;\n}\n"
);
// this checks for a bug in which the selector
// contents get longer as a result of interpolation,
// which interferes with span information.
test!(
    selector_span_gets_larger,
    "$a: aaaaaaaaaaa;\n\n#{$a} {\n    color: foo;\n}\n",
    "aaaaaaaaaaa {\n  color: foo;\n}\n"
);
test!(
    toplevel_non_ascii_alphabetic,
    "ℓ {\n  color: red;\n}\n",
    "@charset \"UTF-8\";\nℓ {\n  color: red;\n}\n"
);
test!(
    plus_in_selector,
    "+ {\n  color: &;\n}\n",
    "+ {\n  color: +;\n}\n"
);
test!(
    invalid_chars_in_pseudo_parens,
    ":c(@#$) {\n  color: &;\n}\n",
    ":c(@#$) {\n  color: :c(@#$);\n}\n"
);
test!(
    empty_namespace_element,
    "|f {\n  color: &;\n}\n",
    "|f {\n  color: |f;\n}\n"
);
test!(
    universal_with_namespace,
    "a|* {\n  color: &;\n}\n",
    "a|* {\n  color: a|*;\n}\n"
);
test!(
    psuedo_element_slotted_args,
    "::slotted(b, c) {\n  color: &;\n}\n",
    "::slotted(b, c) {\n  color: ::slotted(b, c);\n}\n"
);
test!(
    a_n_plus_b,
    ":nth-child(2n+0) {\n  color: &;\n}\n",
    ":nth-child(2n+0) {\n  color: :nth-child(2n+0);\n}\n"
);
test!(
    a_n_plus_b_leading_negative,
    ":nth-child(-1n+6) {\n  color: &;\n}\n",
    ":nth-child(-1n+6) {\n  color: :nth-child(-1n+6);\n}\n"
);
test!(
    a_n_plus_b_leading_plus,
    ":nth-child(+3n-2) {\n  color: &;\n}\n",
    ":nth-child(+3n-2) {\n  color: :nth-child(+3n-2);\n}\n"
);
test!(
    a_n_plus_b_n_alone,
    ":nth-child(n) {\n  color: &;\n}\n",
    ":nth-child(n) {\n  color: :nth-child(n);\n}\n"
);
test!(
    a_n_plus_b_capital_n,
    ":nth-child(N) {\n  color: &;\n}\n",
    ":nth-child(n) {\n  color: :nth-child(n);\n}\n"
);
test!(
    a_n_plus_b_n_with_leading_number,
    ":nth-child(2n) {\n  color: &;\n}\n",
    ":nth-child(2n) {\n  color: :nth-child(2n);\n}\n"
);
test!(
    a_n_plus_b_n_whitespace_on_both_sides,
    ":nth-child(3n + 1) {\n  color: &;\n}\n",
    ":nth-child(3n+1) {\n  color: :nth-child(3n+1);\n}\n"
);
test!(
    a_n_plus_b_n_of,
    ":nth-child(2n+1 of b, c) {\n  color: &;\n}\n",
    ":nth-child(2n+1 of b, c) {\n  color: :nth-child(2n+1 of b, c);\n}\n"
);
test!(
    a_n_plus_b_n_number_alone,
    ":nth-child(5) {\n  color: &;\n}\n",
    ":nth-child(5) {\n  color: :nth-child(5);\n}\n"
);
test!(
    a_n_plus_b_n_number_leading_negative,
    ":nth-child(-5) {\n  color: &;\n}\n",
    ":nth-child(-5) {\n  color: :nth-child(-5);\n}\n"
);
test!(
    a_n_plus_b_n_number_leading_plus,
    ":nth-child(+5) {\n  color: &;\n}\n",
    ":nth-child(+5) {\n  color: :nth-child(+5);\n}\n"
);
test!(
    a_n_plus_b_n_leading_negative_no_leading_number,
    ":nth-child(-n+ 6) {\n  color: &;\n}\n",
    ":nth-child(-n+6) {\n  color: :nth-child(-n+6);\n}\n"
);
test!(
    a_n_plus_b_n_even_all_lowercase,
    ":nth-child(even) {\n  color: &;\n}\n",
    ":nth-child(even) {\n  color: :nth-child(even);\n}\n"
);
test!(
    a_n_plus_b_n_even_mixed_case,
    ":nth-child(eVeN) {\n  color: &;\n}\n",
    ":nth-child(even) {\n  color: :nth-child(even);\n}\n"
);
test!(
    a_n_plus_b_n_even_uppercase,
    ":nth-child(EVEN) {\n  color: &;\n}\n",
    ":nth-child(even) {\n  color: :nth-child(even);\n}\n"
);
test!(
    a_n_plus_b_n_even_whitespace,
    ":nth-child(    even   ) {\n  color: &;\n}\n",
    ":nth-child(even) {\n  color: :nth-child(even);\n}\n"
);
error!(
    a_n_plus_b_n_value_after_even,
    ":nth-child(even 1) {\n  color: &;\n}\n", "Error: Expected \"of\"."
);
error!(
    a_n_plus_b_n_invalid_even,
    ":nth-child(efven) {\n  color: &;\n}\n", "Error: Expected \"even\"."
);
test!(
    a_n_plus_b_n_odd_all_lowercase,
    ":nth-child(odd) {\n  color: &;\n}\n",
    ":nth-child(odd) {\n  color: :nth-child(odd);\n}\n"
);
test!(
    a_n_plus_b_n_odd_mixed_case,
    ":nth-child(oDd) {\n  color: &;\n}\n",
    ":nth-child(odd) {\n  color: :nth-child(odd);\n}\n"
);
test!(
    a_n_plus_b_n_odd_uppercase,
    ":nth-child(ODD) {\n  color: &;\n}\n",
    ":nth-child(odd) {\n  color: :nth-child(odd);\n}\n"
);
test!(
    escaped_space_at_end_of_selector_immediately_after_pseudo_color,
    "a color:\\  {\n  color: &;\n}\n",
    "a color:\\  {\n  color: a color:\\ ;\n}\n"
);
test!(
    super_selector_is_null_when_at_root,
    "@mixin foo {\n    #{if(&, 'true', 'false')} {\n        color: red;\n    }\n}\n\n@include foo;\n\na {\n    @include foo;\n}\n",
    "false {\n  color: red;\n}\n\na true {\n  color: red;\n}\n"
);
test!(
    newline_is_preserved_when_following_comment,
    "a, // 1\nb,\nc {\n    color: red;\n}\n",
    "a,\nb,\nc {\n  color: red;\n}\n"
);
test!(
    spaces_are_preserved_before_comma_in_pseudo_arg,
    ":a(a , b) {\n  color: &;\n}\n",
    ":a(a , b) {\n  color: :a(a , b);\n}\n"
);
test!(
    parent_selector_is_null_at_root,
    "#{inspect(&)}  {\n  color: &;\n}\n",
    "null {\n  color: null;\n}\n"
);
test!(
    #[ignore = "we do not yet have a good way of consuming a string without converting \\a to a newline"]
    silent_comment_in_quoted_attribute_value,
    ".foo bar[val=\"//\"] {\n  color: &;\n}\n",
    ".foo bar[val=\"//\"] {\n  color: .foo bar[val=\"//\"];\n}\n"
);
error!(
    a_n_plus_b_n_invalid_odd,
    ":nth-child(ofdd) {\n  color: &;\n}\n", "Error: Expected \"odd\"."
);
error!(
    a_n_plus_b_n_invalid_starting_char,
    ":nth-child(f) {\n  color: &;\n}\n", "Error: Expected \"n\"."
);
error!(
    a_n_plus_b_n_nothing_after_open_paren,
    ":nth-child({\n  color: &;\n}\n", "Error: expected more input."
);
error!(
    a_n_plus_b_n_invalid_char_after_even,
    ":nth-child(even#) {\n  color: &;\n}\n", "Error: expected \")\"."
);
error!(nothing_after_period, ". {}", "Error: Expected identifier.");
error!(nothing_after_hash, "# {}", "Error: Expected identifier.");
error!(nothing_after_percent, "% {}", "Error: Expected identifier.");
error!(no_ident_after_colon, ": {}", "Error: Expected identifier.");
error!(double_colon_no_space, "::{}", "Error: Expected identifier.");
error!(
    non_ident_char_after_colon,
    ":#ab {}", "Error: Expected identifier."
);
error!(nothing_after_colon, "a:{}", "Error: Expected identifier.");
error!(
    toplevel_parent_selector_after_combinator,
    "~&{}", "Error: Top-level selectors may not contain the parent selector \"&\"."
);
error!(
    toplevel_parent_selector_after_element,
    "a&{}", "Error: \"&\" may only used at the beginning of a compound selector."
);
error!(
    denies_optional_in_selector,
    "a !optional {}", "Error: expected \"{\"."
);
