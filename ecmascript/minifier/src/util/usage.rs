use fxhash::FxHashMap;
use std::collections::hash_map::Entry;
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
    /// `true` if it's declared by function parameters or variables declared in
    /// a closest function and used only within it and not used by child
    /// functions.
    pub is_fn_local: bool,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum ScopeKind {
    Fn,
    Block,
}

#[derive(Debug, Default)]
pub(crate) struct ScopeData {
    pub vars: FxHashMap<Id, VarUsageInfo>,
}

impl ScopeData {
    fn merge(&mut self, kind: ScopeKind, child: ScopeData) {
        for (id, var_info) in child.vars {
            match self.vars.entry(id) {
                Entry::Occupied(mut e) => {
                    e.get_mut().ref_count += var_info.ref_count;
                    e.get_mut().reassigned |= var_info.reassigned;
                    e.get_mut().has_property_access |= var_info.has_property_access;
                    e.get_mut().exported |= var_info.exported;
                    e.get_mut().used_above_decl |= var_info.used_above_decl;

                    match kind {
                        ScopeKind::Fn => {
                            e.get_mut().is_fn_local = false;
                        }
                        ScopeKind::Block => {}
                    }
                }
                Entry::Vacant(e) => {
                    e.insert(var_info);
                }
            }
        }
    }
}

/// This assumes there are no two variable with same name and same span hygiene.
#[derive(Debug, Default)]
pub(crate) struct UsageAnalyzer {
    pub data: ScopeData,
    in_pat_of_var_decl: bool,
    in_pat_of_param: bool,
}

impl UsageAnalyzer {
    fn with_child<F, Ret>(&mut self, kind: ScopeKind, op: F) -> Ret
    where
        F: FnOnce(&mut UsageAnalyzer) -> Ret,
    {
        let mut child = UsageAnalyzer {
            data: Default::default(),
            in_pat_of_var_decl: self.in_pat_of_var_decl,
            in_pat_of_param: self.in_pat_of_param,
        };

        let ret = op(&mut child);

        self.data.merge(kind, child.data);

        ret
    }

    fn report_usage(&mut self, i: &Ident, is_assign: bool) {
        match self.data.vars.entry(i.to_id()) {
            Entry::Occupied(mut e) => {
                e.get_mut().ref_count += 1;
                e.get_mut().reassigned |= is_assign;
            }
            Entry::Vacant(e) => {
                e.insert(VarUsageInfo {
                    used_above_decl: true,
                    ref_count: 1,
                    reassigned: is_assign,
                    ..Default::default()
                });
            }
        }
    }

    fn declare_decl(&mut self, i: &Ident) -> &mut VarUsageInfo {
        self.data.vars.entry(i.to_id()).or_default()
    }
}

impl Visit for UsageAnalyzer {
    noop_visit_type!();

    fn visit_function(&mut self, n: &Function, _: &dyn Node) {
        n.decorators.visit_with(n, self);

        self.with_child(ScopeKind::Fn, |child| {
            n.params.visit_with(n, child);

            match &n.body {
                Some(body) => {
                    // We use visit_children_with instead of visit_with to bypass block scope
                    // handler.
                    body.visit_children_with(child);
                }
                None => {}
            }
        })
    }

    fn visit_block_stmt(&mut self, n: &BlockStmt, _: &dyn Node) {
        self.with_child(ScopeKind::Block, |child| {
            n.visit_children_with(child);
        })
    }

    fn visit_var_declarator(&mut self, e: &VarDeclarator, _: &dyn Node) {
        let old_in_pat_of_var_decl = self.in_pat_of_var_decl;
        self.in_pat_of_var_decl = true;
        e.name.visit_with(e, self);
        self.in_pat_of_var_decl = false;

        e.init.visit_with(e, self);
        self.in_pat_of_var_decl = old_in_pat_of_var_decl;
    }

    fn visit_class_decl(&mut self, n: &ClassDecl, _: &dyn Node) {
        self.declare_decl(&n.ident);

        n.visit_children_with(self);
    }

    fn visit_fn_decl(&mut self, n: &FnDecl, _: &dyn Node) {
        self.declare_decl(&n.ident);

        n.visit_children_with(self);
    }

    fn visit_param(&mut self, n: &Param, _: &dyn Node) {
        let old = self.in_pat_of_param;

        self.in_pat_of_param = false;
        n.decorators.visit_with(n, self);
        self.in_pat_of_param = true;
        n.pat.visit_with(n, self);
        self.in_pat_of_param = old;
    }

    fn visit_pat(&mut self, n: &Pat, _: &dyn Node) {
        n.visit_children_with(self);

        match n {
            Pat::Ident(i) => {
                if self.in_pat_of_var_decl || self.in_pat_of_param {
                    self.data
                        .vars
                        .entry(i.to_id())
                        .or_insert_with(|| VarUsageInfo {
                            is_fn_local: true,
                            ..Default::default()
                        });
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
