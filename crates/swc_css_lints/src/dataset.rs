pub(crate) fn is_generic_font_keyword<S: AsRef<str>>(name: S) -> bool {
    let name = name.as_ref();
    name.eq_ignore_ascii_case("serif")
        || name.eq_ignore_ascii_case("sans-serif")
        || name.eq_ignore_ascii_case("cursive")
        || name.eq_ignore_ascii_case("fantasy")
        || name.eq_ignore_ascii_case("monospace")
        || name.eq_ignore_ascii_case("system-ui")
}
