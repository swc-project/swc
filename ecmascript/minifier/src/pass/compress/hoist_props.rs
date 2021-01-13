use fxhash::FxHashMap;
use retain_mut::RetainMut;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_utils::Id;
use swc_ecma_utils::StmtLike;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;
use swc_ecma_visit::VisitWith;

use crate::util::usage::ScopeData;
use crate::util::usage::UsageAnalyzer;

pub(super) fn property_hoister() -> Hoister {
    Hoister::default()
}

#[derive(Debug, Default)]
pub(super) struct Hoister {
    /// **Inlinable** vars.
    vars: FxHashMap<Id, Box<Expr>>,
    data: Option<ScopeData>,
}

impl Hoister {
    fn handle_stmt_likes<T>(&mut self, n: &mut Vec<T>)
    where
        T: StmtLike,
        Vec<T>: VisitMutWith<Self> + VisitWith<UsageAnalyzer>,
    {
        // Note that we analyze scope everytime because other passes may remove
        // usages and it's fast enough. (Thanks to rust)

        match self.data {
            Some(_) => {
                // User of property hoister didn't called visit_mut for this
                // level.
            }
            None => {
                let mut analyzer = UsageAnalyzer::default();
                n.visit_with(&Invalid { span: DUMMY_SP }, &mut analyzer);
                self.data = Some(analyzer.data)
            }
        }

        n.visit_mut_children_with(self);
    }
}

impl VisitMut for Hoister {
    noop_visit_mut_type!();

    fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
        self.handle_stmt_likes(n)
    }

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        self.handle_stmt_likes(n)
    }

    #[inline]
    fn visit_mut_export_all(&mut self, _: &mut ExportAll) {}

    #[inline]
    fn visit_mut_export_specifier(&mut self, n: &mut ExportSpecifier) {}

    fn visit_mut_var_declarators(&mut self, n: &mut Vec<VarDeclarator>) {
        n.retain_mut(|decl| {
            let had_init = decl.init.is_some();
            decl.visit_mut_children_with(self);

            // It will be inlined.
            if had_init && decl.init.is_none() {
                return false;
            }

            true
        })
    }

    fn visit_mut_var_declarator(&mut self, n: &mut VarDeclarator) {
        n.visit_mut_children_with(self);

        if let Some(usage_data) = &mut self.data {
            match &mut n.name {
                Pat::Ident(name) => {
                    // If the variable is used multiple time, just ignore it.
                    if !usage_data
                        .vars
                        .get(&name.to_id())
                        .map(|v| v.ref_count == 1 && v.has_property_access)
                        .unwrap_or(false)
                    {
                        return;
                    }

                    let init = match n.init.take() {
                        Some(v) => v,
                        None => return,
                    };

                    match self.vars.insert(name.to_id(), init) {
                        Some(prev) => {
                            panic!(
                                "two variable with same name and same span hygiene is \
                                 invalid\nPrevious value: {:?}",
                                prev
                            );
                        }
                        None => {}
                    }
                }
                _ => return,
            }
        }
    }

    fn visit_mut_member_expr(&mut self, e: &mut MemberExpr) {
        e.obj.visit_mut_with(self);
        if e.computed {
            e.prop.visit_mut_with(self);
        }

        // Inline object.
        match &e.obj {
            ExprOrSuper::Super(_) => {}
            ExprOrSuper::Expr(obj) => match &**obj {
                Expr::Ident(obj) => {
                    if let Some(value) = self.vars.remove(&obj.to_id()) {
                        e.obj = ExprOrSuper::Expr(value);
                    }
                }
                _ => {}
            },
        }
    }
}
