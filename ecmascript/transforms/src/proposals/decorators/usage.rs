use ast::Decorator;
use swc_common::{Visit, VisitWith};

pub(super) fn has_decorator<T: VisitWith<DecoratorFinder>>(node: &T) -> bool {
    let mut v = DecoratorFinder { found: false };
    node.visit_with(&mut v);

    v.found
}

pub(super) struct DecoratorFinder {
    found: bool,
}

impl Visit<Decorator> for DecoratorFinder {
    fn visit(&mut self, _: &Decorator) {
        self.found = true;
    }
}
