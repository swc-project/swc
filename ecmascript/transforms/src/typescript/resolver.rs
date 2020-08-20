use swc_common::Mark;
use swc_ecma_ast::TsTypeRef;
use swc_ecma_visit::{as_folder, Fold, VisitMut, VisitMutWith};

#[cfg(test)]
mod tests;

/// A resolver for the typescript. It is recommended to run this right after
/// resolver, if you are going to analyze typescript codes.
///
///
/// # Notes
///
///  - `top_level_mark` should match it provided to resolver.
pub fn resolver(top_level_mark: Mark) -> impl Fold {
    as_folder(Resolver {
        _top_level_mark: top_level_mark,
    })
}

struct Resolver {
    _top_level_mark: Mark,
}

impl Resolver {}

impl VisitMut for Resolver {
    fn visit_mut_ts_type_ref(&mut self, r: &mut TsTypeRef) {
        r.visit_mut_children_with(self);
    }
}
