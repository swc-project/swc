use swc_ecma_visit::{Fold, VisitMut};

use crate::decorator_impl::decorator_impl;

pub fn decorator_2023_11() -> impl VisitMut + Fold {
    decorator_impl(crate::DecoratorVersion::V202311)
}
