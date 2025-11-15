#[derive(Default, Debug, Clone, Copy)]
pub struct RegExpOptions {
    /// Enables plugin to transform the RegExp literal with a `y` flag
    /// ES2015 <https://babel.dev/docs/babel-plugin-transform-sticky-regex>
    pub sticky_flag: bool,

    /// Enables plugin to transform the RegExp literal with a `u` flag
    /// ES2015 <https://babel.dev/docs/babel-plugin-transform-unicode-regex>
    pub unicode_flag: bool,

    /// Enables plugin to transform the RegExp literal that has `\p{}` and `\P{}` unicode property escapes
    /// ES2018 <https://babel.dev/docs/babel-plugin-transform-unicode-property-regex>
    pub unicode_property_escapes: bool,

    /// Enables plugin to transform the RegExp literal with a `s` flag
    /// ES2018 <https://babel.dev/docs/babel-plugin-transform-dotall-regex>
    pub dot_all_flag: bool,

    /// Enables plugin to transform the RegExp literal that has `(?<name>x)` named capture groups
    /// ES2018 <https://babel.dev/docs/babel-plugin-transform-named-capturing-groups-regex>
    pub named_capture_groups: bool,

    /// Enables plugin to transform the RegExp literal that has `(?<=)` or `(?<!)` lookbehind assertions
    /// ES2018 <https://github.com/tc39/proposal-regexp-lookbehind>
    pub look_behind_assertions: bool,

    /// Enables plugin to transform the `d` flag
    /// ES2022 <https://github.com/tc39/proposal-regexp-match-indices>
    pub match_indices: bool,

    /// Enables plugin to transform the RegExp literal that has `v` flag
    /// ES2024 <https://babel.dev/docs/babel-plugin-transform-unicode-sets-regex>
    pub set_notation: bool,
}
