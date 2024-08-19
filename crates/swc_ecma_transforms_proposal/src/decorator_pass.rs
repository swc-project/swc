use swc_ecma_visit::{as_folder, Fold, VisitMut};

use crate::DecoratorVersion;

pub(crate) fn decorator_pass(version: DecoratorVersion) -> impl Fold + VisitMut {
    as_folder(DecoratorPass {
        version,
        state: Default::default(),
    })
}

struct DecoratorPass {
    version: DecoratorVersion,
    state: State,
}

#[derive(Default)]
struct State {}

impl DecoratorPass {}

impl VisitMut for DecoratorPass {}
