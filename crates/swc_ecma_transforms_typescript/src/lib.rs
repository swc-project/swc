#![deny(clippy::all)]
#![allow(clippy::vec_box)]
#![allow(clippy::mutable_key_type)]

pub use self::typescript::*;
mod config;
mod macros;
pub mod typescript;
mod utils;
