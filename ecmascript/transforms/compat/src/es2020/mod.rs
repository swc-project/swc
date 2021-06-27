#[allow(deprecated)]
pub use self::{
    class_properties::{class_properties, typescript_class_properties},
    export_namespace_from::export_namespace_from,
    nullish_coalescing::nullish_coalescing,
    opt_chaining::optional_chaining,
};
use swc_common::chain;
use swc_ecma_visit::Fold;

mod class_properties;
mod export_namespace_from;
mod nullish_coalescing;
mod opt_chaining;

pub fn es2020() -> impl Fold {
    chain!(
        nullish_coalescing(),
        optional_chaining(),
        class_properties(),
        export_namespace_from(),
    )
}
