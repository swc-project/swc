use swc_ecma_visit::{Fold, VisitMut};

use crate::{decorator_impl::decorator_impl, DecoratorVersion};

pub fn decorator_2022_03() -> impl VisitMut + Fold {
    decorator_impl(DecoratorVersion::V202203)
}
