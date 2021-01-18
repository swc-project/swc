use std::collections::hash_map::Entry;

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
    /// True if used **above** the declaration. (Not eval order).
    pub used_above_decl: bool,
}

#[derive(Debug, Default)]
pub(crate) struct ScopeData {
    pub vars: FxHashMap<Id, VarUsageInfo>,
}

/// This assumes there are no two variable with same name and same span hygiene.
#[derive(Debug, Default)]
pub(crate) struct UsageAnalyzer {
    pub data: ScopeData,
    in_pat_of_var_decl: bool,
}

impl UsageAnalyzer {
    fn report_usage(&mut self, i: &Ident, is_assign: bool) {
        match self.data.vars.entry(i.to_id()) {
            Entry::Occupied(mut e) => {
                e.get_mut().ref_count += 1;
            }
            Entry::Vacant(e) => {
                e.insert(VarUsageInfo {
                    used_above_decl: true,
                    ref_count: 1,
                    ..Default::default()
                });
            }
        }
    }
}

impl Visit for UsageAnalyzer {
    noop_visit_type!();

    fn visit_var_declarator(&mut self, e: &VarDeclarator, _: &dyn Node) {
        let old_in_pat_of_var_decl = self.in_pat_of_var_decl;
        self.in_pat_of_var_decl = true;
        e.name.visit_with(e, self);
        self.in_pat_of_var_decl = false;

        e.init.visit_with(e, self);
        self.in_pat_of_var_decl = old_in_pat_of_var_decl;
    }

    fn visit_pat(&mut self, n: &Pat, _: &dyn Node) {
        n.visit_children_with(self);

        match n {
            Pat::Ident(i) => {
                if self.in_pat_of_var_decl {
                    self.data.vars.entry(i.to_id()).or_default();
                } else {
                    self.report_usage(i, true);
                }
            }
            _ => {}
        }
    }

    fn visit_expr(&mut self, e: &Expr, _: &dyn Node) {
        e.visit_children_with(self);

        match e {
            Expr::Ident(i) => {
                self.report_usage(i, false);
            }
            _ => {}
        }
    }

    fn visit_prop(&mut self, n: &Prop, _: &dyn Node) {
        n.visit_children_with(self);

        match n {
            Prop::Shorthand(i) => {
                self.report_usage(i, false);
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
