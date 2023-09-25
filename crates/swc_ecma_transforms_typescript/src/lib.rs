#![deny(clippy::all)]
#![allow(clippy::vec_box)]

pub use self::typescript::*;
mod config;
mod macros;
mod strip_import_export;
mod strip_type;
mod transform;
mod ts_enum;
pub mod typescript;
mod utils;
