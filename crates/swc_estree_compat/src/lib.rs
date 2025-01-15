#![deny(clippy::all)]
#![allow(clippy::large_enum_variant)]
#![allow(clippy::upper_case_acronyms)]

use std::convert::Infallible;

pub mod babelify;
pub mod swcify;

pub type Never = Infallible;
