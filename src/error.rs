use once_cell::sync::Lazy;

/// Returns true if `SWC_DEBUG` environment is set to `1` or `true`.
pub(crate) fn debug() -> bool {
    static DEBUG: Lazy<bool> = Lazy::new(|| match ::std::env::var("SWC_DEBUG") {
        Ok(ref v) if v == "1" || v.eq_ignore_ascii_case("true") => true,
        _ => false,
    });

    *DEBUG
}
