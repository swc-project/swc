pub use self::{
    decorators::decorators, export_default_from::export_default_from,
    import_assertions::import_assertions, private_in_object::private_in_object,
    static_blocks::static_blocks,
};

pub mod decorators;
mod export_default_from;
mod import_assertions;
pub mod private_in_object;
pub mod static_blocks;
