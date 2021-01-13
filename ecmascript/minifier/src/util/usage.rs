use fxhash::FxHashMap;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_utils::Id;
use swc_ecma_visit::noop_visit_type;
use swc_ecma_visit::Node;
use swc_ecma_visit::Visit;
use swc_ecma_visit::VisitWith;

#[derive(Debug, Default)]
pub(crate) struct VarUsageInfo {
    /// # of reference to this identifier.
    pub ref_count: usize,
    pub reassigned: bool,
    pub has_property_access: bool,
    pub exported: bool,
}

#[derive(Debug, Default)]
pub(crate) struct ScopeData {
    pub vars: FxHashMap<Id, VarUsageInfo>,
}

/// This assumes there are no two variable with same name and same span hygiene.
#[derive(Debug, Default)]
pub(crate) struct UsageAnalyzer {
    pub data: ScopeData,
}

impl Visit for UsageAnalyzer {
    noop_visit_type!();

    fn visit_expr(&mut self, e: &Expr, _: &dyn Node) {
        e.visit_children_with(self);

        match e {
            Expr::Ident(i) => {
                self.data.vars.entry(i.to_id()).or_default().ref_count += 1;
            }
            _ => {}
        }
    }

    fn visit_prop(&mut self, n: &Prop, _: &dyn Node) {
        n.visit_children_with(self);

        match n {
            Prop::Shorthand(i) => {
                self.data.vars.entry(i.to_id()).or_default().ref_count += 1;
            }
            _ => {}
        }
    }

    fn visit_member_expr(&mut self, e: &MemberExpr, _: &dyn Node) {
        e.obj.visit_with(&Invalid { span: DUMMY_SP }, self);

        if e.computed {
            e.prop.visit_with(&Invalid { span: DUMMY_SP }, self);
        }

        match &e.obj {
            ExprOrSuper::Super(_) => {}
            ExprOrSuper::Expr(obj) => match &**obj {
                Expr::Ident(obj) => {
                    self.data
                        .vars
                        .entry(obj.to_id())
                        .or_default()
                        .has_property_access = true;
                }
                _ => {}
            },
        }
    }
}
