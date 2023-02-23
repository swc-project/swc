//// [stringMappingOverPatternLiterals.ts]
// non-template
function f1(a, b, c, a_template, b_template, c_template) {
    // non-template versions should be assignable to templated versions (empty string matches string)
    a_template = a;
    b_template = b;
    c_template = c;
    // not the other way around
    a = a_template;
    b = b_template;
    c = c_template;
    // Additionally, all the template versions should be mutually incompatible (they describe differing sets)
    a_template = b_template;
    a_template = c_template;
    b_template = a_template;
    b_template = c_template;
    c_template = a_template;
    c_template = b_template;
}
// Raw string mapping assignability
function f2(x1, x2, x3) {
    // ok
    x1 = x2;
    x1 = x3;
    x2 = "ABC";
    x3 = "abc";
    // should fail (sets do not match)
    x2 = x1;
    x2 = x3;
    x3 = x1;
    x3 = x2;
    x2 = "AbC";
    x3 = "AbC";
}
// Mappings over mappings
function f3(x1, x2, x3) {
    // _ideally_ these would all be equivalent
    x1 = x2;
    x1 = x3;
    x2 = x1;
    x2 = x3;
    // you'd think these were equivalent - the outer `Uppercase` conceptually
    // makes the inner `Lowercase` effectively a noop - but that's not so;
    // the german sharp s makes that not completely true (lowercases to ss,
    // which then uppercases to SS), so arbitrary nestings of mappings make differing sets!
    x3 = x1;
    x3 = x2;
    // and this should also not be equivlent to any others
    var x4 = null;
    x1 = x4;
    x2 = x4;
    x3 = x4;
    x4 = x1;
    x4 = x2;
    x4 = x3;
}
function f4(x1, x2) {
    // Should both work
    x1 = x2;
    x2 = x1;
}
// Capitalize and uncapitalize on template literals
function f5(cap_tem, cap_str, cap_tem_map, cap_tem_map2, uncap_tem, uncap_str, uncap_tem_map, uncap_tem_map2) {
    // All these are capitalized
    cap_str = cap_tem;
    cap_str = cap_tem_map;
    cap_str = cap_tem_map2;
    // these are all equivalent
    cap_tem = cap_tem_map;
    cap_tem = cap_tem_map2;
    cap_tem_map = cap_tem_map2;
    cap_tem_map = cap_tem;
    cap_tem_map2 = cap_tem_map;
    cap_tem_map2 = cap_tem;
    // meanwhile, these all require a `A` prefix
    cap_tem = cap_str;
    cap_tem_map = cap_str;
    cap_tem_map2 = cap_str;
    // All these are uncapitalized
    uncap_str = uncap_tem;
    uncap_str = uncap_tem_map;
    uncap_str = uncap_tem_map2;
    // these are all equivalent
    uncap_tem = uncap_tem_map;
    uncap_tem = uncap_tem_map2;
    uncap_tem_map = uncap_tem_map2;
    uncap_tem_map = uncap_tem;
    uncap_tem_map2 = uncap_tem_map;
    uncap_tem_map2 = uncap_tem;
    // meanwhile, these all require a `a` prefix
    uncap_tem = uncap_str;
    uncap_tem_map = uncap_str;
    uncap_tem_map2 = uncap_str;
}
