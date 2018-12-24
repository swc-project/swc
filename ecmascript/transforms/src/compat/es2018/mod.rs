pub use self::object_rest_spread::object_rest_spread;

use crate::compat::helpers::Helpers;
use ast::Module;
use std::sync::Arc;
use swc_common::Fold;

mod object_rest_spread;

pub fn es2018(helpers: &Arc<Helpers>) -> impl Fold<Module> {
    object_rest_spread(helpers.clone())
}
