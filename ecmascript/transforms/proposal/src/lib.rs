pub use self::{
    decorators::decorators, export_default_from::export_default_from,
    import_assertions::import_assertions,
};

pub mod decorators;
#[cfg(feature = "swc_ecma_loader")]
pub mod deps;
mod export_default_from;
mod import_assertions;
