use swc_common::Mark;
use swc_ecma_visit::{as_folder, Fold, VisitMut, VisitMutWith};

pub fn resolver(top_level_mark: Mark) -> impl Fold {
    as_folder(Resolver { top_level_mark })
}

struct Resolver {
    top_level_mark: Mark,
}

impl Resolver {}

impl VisitMut for Resolver {}
