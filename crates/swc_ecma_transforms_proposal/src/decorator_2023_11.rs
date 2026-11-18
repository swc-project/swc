use swc_ecma_ast::Pass;

use crate::{decorator_impl::decorator_impl, DecoratorVersion};

pub fn decorator_2023_11() -> impl Pass {
    decorator_impl(DecoratorVersion::V202311)
}
