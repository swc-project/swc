use swc_ecma_ast::*;
use swc_ecma_utils::private_ident;
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

struct OptionalCatchBinding;

pub fn optional_catch_binding() -> impl Pass {
    visit_mut_pass(OptionalCatchBinding)
}

#[swc_trace]
impl VisitMut for OptionalCatchBinding {
    noop_visit_mut_type!(fail);

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
    use swc_common::Mark;
    use swc_ecma_ast::Pass;
    use swc_ecma_transforms_base::resolver;
    use swc_ecma_transforms_testing::test;
    use swc_ecma_visit::visit_mut_pass;

    use crate::optional_catch_binding::OptionalCatchBinding;

    pub fn tr() -> impl Pass {
        (
            resolver(Mark::new(), Mark::new(), false),
            visit_mut_pass(OptionalCatchBinding),
        )
    }

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| tr(),
        issue_411,
        "try {} catch {}"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| tr(),
        catch_binding_name_collision_1,
        "try { throw new Error(); } catch { log(e); }"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| tr(),
        catch_binding_name_collision_2,
        "var e; try {} catch { log(e); }"
    );
}
