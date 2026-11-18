//! Errors of the lowering transforms.

use std::fmt;

/// The reason why a pattern cannot be lowered.
///
/// When a transform returns an error, the pattern may be partially modified
/// and must be discarded. The caller keeps the original pattern.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[non_exhaustive]
pub enum LowerError {
    /// The pattern uses a Unicode property that this crate has no data for,
    /// for example `\p{RGI_Emoji}`.
    UnsupportedProperty,
    /// A backreference is in a case-insensitive part of the pattern. Its
    /// case-insensitive comparison cannot be expressed without the `i` flag.
    CaseInsensitiveBackreference,
    /// The pattern still has the `v` flag. Lower it with
    /// [`crate::transform_unicode_sets`] first.
    UnicodeSetsFlag,
}

impl fmt::Display for LowerError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(match self {
            Self::UnsupportedProperty => "unsupported unicode property",
            Self::CaseInsensitiveBackreference => {
                "backreference in a case-insensitive modifier group"
            }
            Self::UnicodeSetsFlag => "the `v` flag must be lowered before modifiers",
        })
    }
}

impl std::error::Error for LowerError {}
