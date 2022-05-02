#![deny(clippy::all)]
#![allow(clippy::vec_box)]

pub use self::{
    decorators::decorators, export_default_from::export_default_from,
    import_assertions::import_assertions,
};

pub mod decorators;
mod export_default_from;
mod import_assertions;
