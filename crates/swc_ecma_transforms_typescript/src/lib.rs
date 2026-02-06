#![deny(clippy::all)]
#![allow(clippy::vec_box)]
#![allow(clippy::mutable_key_type)]

pub use self::typescript::*;
mod config;
mod macros;
mod retain;
mod semantic;
mod shared;
mod transform;
mod ts_enum;
pub mod typescript;
mod utils;
