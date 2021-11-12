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
        SpaceDelimited: 1 << 2,
        SemiDelimited: 1 << 3,
        CommaDelimited: 1 << 4,
        DelimitersMask: SpaceDelimited | SemiDelimited | CommaDelimited,
    },
    Values {
        /// Write a trailing comma (",") if present.
        AllowTrailingComma: 1 << 5,
    },
);
