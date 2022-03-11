use swc_ecma_ast::*;
use swc_ecma_utils::private_ident;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

struct OptionalCatchBinding;

#[tracing::instrument(level = "info", skip_all)]
pub fn optional_catch_binding() -> impl Fold + VisitMut {
    as_folder(OptionalCatchBinding)
}

#[swc_trace]
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
    use swc_ecma_transforms_testing::test;

    use super::optional_catch_binding as tr;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| tr(),
        issue_411,
        "try {} catch {}",
        "try {} catch(e) {}"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| tr(),
        catch_binding_name_collision_1,
        "try { throw new Error(); } catch { log(e); }",
        "try { throw new Error(); } catch (e1) { log(e); }"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| tr(),
        catch_binding_name_collision_2,
        "var e; try {} catch { log(e); }",
        "var e; try {} catch (e1) { log(e); }"
    );
}
