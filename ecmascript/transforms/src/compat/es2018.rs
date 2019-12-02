pub use self::{
    object_rest_spread::object_rest_spread, optional_catch_binding::optional_catch_binding,
};
use crate::pass::Pass;
use ast::Module;

mod object_rest_spread;
mod optional_catch_binding;

pub fn es2018() -> impl Pass {
    chain_at!(Module, object_rest_spread(), optional_catch_binding())
}
