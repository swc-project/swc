use swc_ecma_ast::*;
use swc_ecma_utils::private_ident;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

struct OptionalCatchBinding;

pub fn optional_catch_binding() -> impl Fold + VisitMut {
    as_folder(OptionalCatchBinding)
}

impl VisitMut for OptionalCatchBinding {
    noop_visit_mut_type!();

    fn visit_mut_catch_clause(&mut self, cc: &mut CatchClause) {
        cc.visit_mut_children_with(self);

        if cc.param.is_some() {
            return;
        }
        cc.param = Some(private_ident!("e").into());
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
