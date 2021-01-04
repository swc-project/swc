use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::Check;
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_utils::private_ident;
use swc_ecma_visit::{noop_fold_type, noop_visit_type, Fold, FoldWith, Node, Visit, VisitWith};

struct OptionalCatchBinding;

pub fn optional_catch_binding() -> impl Fold {
    OptionalCatchBinding
}

#[fast_path(ShouldWork)]
impl Fold for OptionalCatchBinding {
    noop_fold_type!();

    fn fold_catch_clause(&mut self, mut cc: CatchClause) -> CatchClause {
        cc = cc.fold_children_with(self);

        if cc.param.is_some() {
            return cc;
        }

        CatchClause {
            param: Some(private_ident!("e").into()),
            ..cc
        }
    }
}
#[derive(Default)]
struct ShouldWork {
    found: bool,
}

impl Visit for ShouldWork {
    noop_visit_type!();

    fn visit_catch_clause(&mut self, n: &CatchClause, _: &dyn Node) {
        if n.param.is_none() {
            self.found = true;
            return;
        }
        n.visit_children_with(self)
    }
}

impl Check for ShouldWork {
    fn should_handle(&self) -> bool {
        self.found
    }
}

#[cfg(test)]
mod tests {
    use super::optional_catch_binding as tr;
    use swc_ecma_transforms_testing::test;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| tr(),
        issue_411,
        "try {} catch {}",
        "try {} catch(e) {}"
    );
}
