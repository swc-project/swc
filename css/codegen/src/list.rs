#![allow(non_upper_case_globals)]
use bitflags::bitflags;
use swc_common::add_bitflags;

bitflags! {
    pub struct ListFormat: u16 {
        const None = 0;
    }
}

add_bitflags!(
    ListFormat,
    // Handled by bitflags! macro.
    // Values { None: 0 },
    /// Line separators
    Values {
        /// Prints the list on a single line (default).
        SingleLine: 0,
        /// Prints the list on multiple lines.
        MultiLine: 1 << 0,
        /// Prints the list using line preservation if possible.
        PreserveLines: 1 << 1,
        LinesMask: SingleLine | MultiLine | PreserveLines,
    },
    /// Delimiters
    Values {
        /// There is no delimiter between list items (default).
        NotDelimited: 0,
        /// Each list item is space-and-bar (" |") delimited.
        BarDelimited: 1 << 2,
        /// Each list item is space-and-ampersand (" &") delimited.
        AmpersandDelimited: 1 << 3,
        /// Each list item is comma (",") delimited.
        CommaDelimited: 1 << 4,
        DelimitersMask: BarDelimited | AmpersandDelimited | CommaDelimited,
    },
    Values {
        /// Write a trailing comma (",") if present.
        AllowTrailingComma: 1 << 5,
    },
);
