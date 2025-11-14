use swc_ecma_ast::Pass;
use swc_ecma_compiler::{TransformOptions, Transformer};

pub fn regexp(config: Config) -> impl Pass {
    let mut transform_options = TransformOptions::default();

    transform_options.env.regexp.dot_all_flag = config.dot_all_regex;
    transform_options.env.regexp.match_indices = config.has_indices;
    transform_options.env.regexp.look_behind_assertions = config.lookbehind_assertion;
    transform_options.env.regexp.named_capture_groups = config.named_capturing_groups_regex;
    transform_options.env.regexp.sticky_flag = config.sticky_regex;
    transform_options.env.regexp.unicode_property_escapes = config.unicode_property_regex;
    transform_options.env.regexp.unicode_flag = config.unicode_regex;
    transform_options.env.regexp.set_notation = config.unicode_sets_regex;

    Transformer::new("".as_ref(), &transform_options)
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
