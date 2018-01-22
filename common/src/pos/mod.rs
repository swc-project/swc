//! This module is almost copied from [rustc_errors][].
//!
//! Modified a bit because, unlike rustc, we
//!
//!  - work with lot of files (node_modules).
//!  - need source information in every run (I think?)
//!
//!
//!-----
//!
//![rustc_errors]:TODO
pub use self::span::*;
pub use syntax_pos::{FileMap, FileName, MultiSpan};

mod span;
