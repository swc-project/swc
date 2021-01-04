use swc_common::DUMMY_SP;
use swc_ecma_ast::{Decorator, Invalid};
use swc_ecma_visit::noop_visit_type;
use swc_ecma_visit::{Node, Visit, VisitWith};

pub(super) fn has_decorator<T: VisitWith<DecoratorFinder>>(node: &T) -> bool {
    let mut v = DecoratorFinder { found: false };
    node.visit_with(&Invalid { span: DUMMY_SP } as _, &mut v);

    v.found
}

pub(super) struct DecoratorFinder {
    found: bool,
}

impl Visit for DecoratorFinder {
    noop_visit_type!();

    fn visit_decorator(&mut self, _: &Decorator, _parent: &dyn Node) {
        self.found = true;
    }
}
