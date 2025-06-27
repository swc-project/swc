use swc_ecma_ast::Pass;
use swc_ecma_visit::{visit_mut_pass, VisitMut};

use crate::DecoratorVersion;

pub(crate) fn decorator_impl(version: DecoratorVersion) -> impl Pass {
    visit_mut_pass(DecoratorPass {
        version,
        ..Default::default()
    })
}

#[derive(Default)]
struct DecoratorPass {
    version: DecoratorVersion,
}

impl VisitMut for DecoratorPass {}
