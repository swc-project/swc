use crate::option::CompressOptions;
use swc_common::{comments::Comments, pass::Repeated};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut};

pub(super) fn pure_optimizer<'a>(
    options: &'a CompressOptions,
    comments: Option<&'a dyn Comments>,
) -> impl 'a + VisitMut + Repeated {
    PureOptimizer {
        options,
        comments,
        run_again: false,
    }
}

struct PureOptimizer<'a> {
    options: &'a CompressOptions,
    comments: Option<&'a dyn Comments>,
    run_again: bool,
}

impl Repeated for PureOptimizer<'_> {
    fn changed(&self) -> bool {
        self.run_again
    }

    fn reset(&mut self) {
        self.run_again = false;
    }
}

impl VisitMut for PureOptimizer<'_> {
    noop_visit_mut_type!();
}
