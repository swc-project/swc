#![allow(non_upper_case_globals)]
use bitflags::bitflags;

bitflags! {
    #[derive(PartialEq, Eq, Copy, Clone)]
    pub struct ListFormat: u16 {
        const None = 0;

        // Line separators
        /// Prints the list on a single line (default).
        const SingleLine = 0;
        /// Prints the list on multiple lines.
        const MultiLine = 1 << 0;
        /// Prints the list using line preservation if possible.
        const PreserveLines = 1 << 1;
        const LinesMask = Self::MultiLine.bits() | Self::PreserveLines.bits();

        // Delimiters
        const NotDelimited = 0;
        const SpaceDelimited = 1 << 2;
        /// There is no delimiter between list items (default).
        const SemiDelimited = 1 << 3;
        const CommaDelimited = 1 << 4;
        const DotDelimited = 1 << 5;
        const DelimitersMask = Self::SpaceDelimited.bits()
            | Self::SemiDelimited.bits()
            | Self::CommaDelimited.bits()
            | Self::DotDelimited.bits();
    }
}
