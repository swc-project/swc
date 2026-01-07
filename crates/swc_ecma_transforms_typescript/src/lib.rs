#![deny(clippy::all)]
#![allow(clippy::vec_box)]
#![allow(clippy::mutable_key_type)]

pub use self::typescript::*;
mod config;
mod macros;
pub mod strip_import_export;
pub mod strip_type;
mod transform;
mod ts_enum;
pub mod typescript;
mod utils;
