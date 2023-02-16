#![deny(clippy::all)]
#![allow(clippy::vec_box)]

pub use self::{
    decorators::decorators, export_default_from::export_default_from,
    import_assertions::import_assertions,
};

mod decorator_2022_03;
pub mod decorators;
mod export_default_from;
mod import_assertions;
