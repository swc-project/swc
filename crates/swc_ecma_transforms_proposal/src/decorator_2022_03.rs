use swc_ecma_ast::Pass;

use crate::{decorator_impl::decorator_impl, DecoratorVersion};

pub fn decorator_2022_03() -> impl Pass {
    decorator_impl(DecoratorVersion::V202203)
}
