#![feature(box_patterns)]
#![allow(clippy::vec_box)]

pub use self::prefixer::prefixer;

pub mod nesting;
pub mod options;
mod prefixer;
