pub(crate) fn is_generic_font_keyword<S: AsRef<str>>(name: S) -> bool {
    let name = name.as_ref();
    name.eq_ignore_ascii_case("serif")
        || name.eq_ignore_ascii_case("sans-serif")
        || name.eq_ignore_ascii_case("cursive")
        || name.eq_ignore_ascii_case("fantasy")
        || name.eq_ignore_ascii_case("monospace")
        || name.eq_ignore_ascii_case("system-ui")
}

/// This function doesn't convert case,
/// so you may need to convert string to lowercase manually.
pub(crate) fn strip_vendor_prefix(s: &str) -> Option<&str> {
    s.strip_prefix("-webkit-")
        .or_else(|| s.strip_prefix("-moz-"))
        .or_else(|| s.strip_prefix("-ms-"))
        .or_else(|| s.strip_prefix("-o-"))
}
