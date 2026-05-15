use swc_ecma_ast::Pass;

pub fn regexp(config: Config) -> impl Pass {
    let mut options = swc_ecma_transformer::RegExpOptions::default();
    options.dot_all_regex = config.dot_all_regex;
    options.has_indices = config.has_indices;
    options.lookbehind_assertion = config.lookbehind_assertion;
    options.named_capturing_groups_regex = config.named_capturing_groups_regex;
    options.sticky_regex = config.sticky_regex;
    options.unicode_property_regex = config.unicode_property_regex;
    options.unicode_regex = config.unicode_regex;
    options.unicode_sets_regex = config.unicode_sets_regex;

    swc_ecma_transformer::regexp_pass(options)
}

#[derive(Default, Clone, Copy)]
pub struct Config {
    /// [s/dotAll flag for regular expressions](https://tc39.github.io/proposal-regexp-dotall-flag/)
    pub dot_all_regex: bool,
    /// [RegExp.prototype.hasIndices](https://262.ecma-international.org/13.0/#sec-get-regexp.prototype.hasIndices)
    pub has_indices: bool,
    /// [RegExp Lookbehind Assertions](https://tc39.es/proposal-regexp-lookbehind/)
    pub lookbehind_assertion: bool,
    /// [Named capture groups in regular expressions](https://tc39.es/proposal-regexp-named-groups/)
    pub named_capturing_groups_regex: bool,
    /// [RegExp.prototype.sticky](https://tc39.es/ecma262/multipage/text-processing.html#sec-get-regexp.prototype.sticky)
    pub sticky_regex: bool,
    /// [Unicode property escapes in regular expressions](https://tc39.es/proposal-regexp-unicode-property-escapes/)
    pub unicode_property_regex: bool,
    /// [RegExp.prototype.unicode](https://tc39.es/ecma262/multipage/text-processing.html#sec-get-regexp.prototype.unicode)
    pub unicode_regex: bool,
    // [RegExp.prototype.unicodeSets](https://github.com/tc39/proposal-regexp-v-flag)
    pub unicode_sets_regex: bool,
}
