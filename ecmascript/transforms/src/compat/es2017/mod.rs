pub use self::async_to_generator::async_to_generator;
use crate::compat::helpers::Helpers;
use ast::Module;
use std::sync::Arc;
use swc_common::Fold;

mod async_to_generator;

pub fn es2017(helpers: &Arc<Helpers>) -> impl Fold<Module> {
    async_to_generator(helpers.clone())
}
