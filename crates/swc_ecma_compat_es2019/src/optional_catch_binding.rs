use swc_ecma_ast::*;
use swc_ecma_utils::private_ident;
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

pub fn optional_catch_binding() -> impl Pass {
    let mut options = swc_ecma_transformer::Options::default();
    options.env.es2019.optional_catch_binding = true;
    options.into_pass()
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
