#![deny(clippy::all)]
#![allow(clippy::vec_box)]

pub use self::{
    decorators::decorators, export_default_from::export_default_from,
    import_assertions::import_assertions,
};

pub mod decorator_2022_03;
pub mod decorators;
pub mod explicit_resource_management;
mod export_default_from;
mod import_assertions;
