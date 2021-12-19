use crate::rule::Rule;
use std::sync::Arc;

mod const_assign;
mod duplicated_binding;

pub fn all() -> Vec<Arc<dyn Rule>> {
    vec![self::const_assign::const_assign()]
}
