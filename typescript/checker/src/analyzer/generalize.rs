use crate::{analyzer::Analyzer, ty::Type};
use swc_common::{Mark, Spanned};

#[derive(Debug, Clone, Copy)]
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
        log::trace!("may_generalize({:?})", ty);
        match ty {
            Type::Function(f) => {
                if !self.may_generalize(&f.ret_ty) {
                    return false;
                }
                for param in &f.params {
                    if !self.may_generalize(&param.ty) {
                        return false;
                    }
                }
            }
            Type::Union(u) => {
                if u.types.iter().any(|ty| !self.may_generalize(ty)) {
                    return false;
                }
            }
            _ => {}
        }

        let mut ctxt = ty.span().ctxt().clone();
        loop {
            let m = ctxt.remove_mark();
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
