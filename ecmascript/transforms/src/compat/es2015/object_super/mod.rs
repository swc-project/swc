use ast::*;
use crate::compat::helpers::Helpers;
use std::sync::Arc;
use swc_common::{Fold, FoldWith};

#[cfg(test)]
mod tests;

/// `@babel/plugin-transform-object-super`
pub fn object_super(helpers: Arc<Helpers>) -> impl Fold<Module> {
    ObjectSuper { helpers }
}

struct ObjectSuper {
    helpers: Arc<Helpers>,
}
