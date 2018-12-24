use crate::compat::helpers::Helpers;
use ast::Module;
use std::sync::Arc;
use swc_common::Fold;

#[cfg(test)]
mod tests;

pub fn object_rest_spread(helpers: Arc<Helpers>) -> impl Fold<Module> {
    ObjectRestSpread { helpers }
}

struct ObjectRestSpread {
    helpers: Arc<Helpers>,
}
