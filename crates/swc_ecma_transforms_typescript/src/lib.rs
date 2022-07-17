#![deny(clippy::all)]
#![allow(clippy::vec_box)]

pub use self::strip::*;
mod import_export_assign;
mod inline_enum;
pub mod strip;
