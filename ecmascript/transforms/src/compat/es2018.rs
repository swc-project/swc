pub use self::{
    object_rest_spread::object_rest_spread, optional_catch_binding::optional_catch_binding,
};
use swc_common::chain;
use swc_ecma_visit::Fold;

mod object_rest_spread;
mod optional_catch_binding;

pub fn es2018() -> impl Fold {
    chain!(object_rest_spread(), optional_catch_binding())
}
