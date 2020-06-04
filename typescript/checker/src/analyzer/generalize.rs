use crate::{analyzer::Analyzer, ty::Type};
use swc_common::{Mark, Span, Spanned};

pub(super) struct Config {
    /// If the mark is applied, it means that the type should not be
    /// generalized.
    mark: Mark,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            mark: Mark::fresh(Mark::root()),
        }
    }
}

impl Analyzer<'_, '_> {
    pub(super) fn may_generalize(&self, ty: &Type) -> bool {
        let mut n = ty.span();
        loop {
            let m = n.remove_mark();
            if m == Mark::root() {
                break;
            }

            if m == self.generalizer.mark {
                return false;
            }
        }

        true
    }

    pub(super) fn prevent_generalize(&self, ty: &mut Type) {
        let span = ty.span();
        let span = span.apply_mark(self.generalizer.mark);

        ty.respan(span)
    }
}
