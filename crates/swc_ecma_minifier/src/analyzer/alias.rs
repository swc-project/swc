use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::js_word;
use swc_common::collections::AHashSet;
use swc_ecma_ast::*;
use swc_ecma_utils::{collect_decls, ident::IdentLike};
use swc_ecma_visit::{noop_visit_type, visit_obj_and_computed, Visit, VisitWith};

#[derive(Debug, Default)]
pub(crate) struct AliasData {
    pub(super) aliases: FxHashMap<Id, Vec<Id>>,
}

impl AliasData {
    pub fn is_infected(&self, id: &Id) -> bool {
        self.aliases.contains_key(id)
    }
}

pub(crate) struct AliasAnalyzer<'a> {
    pub data: &'a mut AliasData,
}

impl Visit for AliasAnalyzer<'_> {
    noop_visit_type!();

    fn visit_var_decl(&mut self, n: &VarDecl) {
        n.visit_children_with(self);

        for decl in &n.decls {
            if let (Pat::Ident(var), Some(init)) = (&decl.name, decl.init.as_deref()) {
                let local_bindings = collect_decls(init);

                let used_idents = {
                    let mut v = AliasCollector {
                        ids: Default::default(),
                        excluded: &local_bindings,
                    };
                    init.visit_with(&mut v);
                    v.ids
                };

                // This prints only while testing analyzer
                if cfg!(test) {
                    dbg!(&var.id, &used_idents);
                }

                for id in used_idents {
                    {
                        let v = self.data.aliases.entry(id.clone()).or_default();
                        if !v.contains(&var.id.to_id()) {
                            v.push(var.id.to_id());
                        }
                    }
                    {
                        let v = self.data.aliases.entry(var.id.to_id()).or_default();
                        if !v.contains(&id) {
                            v.push(id);
                        }
                    }
                }
            }
        }
    }
}

struct AliasCollector<'a> {
    ids: FxHashSet<Id>,
    /// Declared bindings are not alias.
    excluded: &'a AHashSet<Id>,
}

impl AliasCollector<'_> {
    fn add(&mut self, id: Id) {
        if id.0 == js_word!("arguments") {
            return;
        }

        if !self.excluded.contains(&id) {
            self.ids.insert(id);
        }
    }
}

/// Note: We should handle nested nodes because of
///
/// ```js
/// function (b) {
///     var a = (function() {
///         return b;
///     });
///
///     return b++ + a
/// }
/// ```
impl Visit for AliasCollector<'_> {
    noop_visit_type!();

    visit_obj_and_computed!();

    fn visit_assign_pat_prop(&mut self, n: &AssignPatProp) {
        n.visit_children_with(self);

        self.add(n.key.to_id());
    }

    fn visit_bin_expr(&mut self, n: &BinExpr) {
        if matches!(
            n.op,
            op!(bin, "+")
                | op!(bin, "-")
                | op!("*")
                | op!("/")
                | op!("%")
                | op!("**")
                | op!("<<")
                | op!(">>")
                | op!(">>>")
                | op!("==")
                | op!("===")
                | op!("!=")
                | op!("!==")
        ) {
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_callee(&mut self, n: &Callee) {
        if let Some(..) = n.as_expr().and_then(|e| e.as_ident()) {
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_cond_expr(&mut self, n: &CondExpr) {
        n.cons.visit_with(self);
        n.alt.visit_with(self);
    }

    fn visit_expr(&mut self, n: &Expr) {
        match n {
            Expr::Ident(i) => {
                self.add(i.to_id());
            }
            _ => n.visit_children_with(self),
        }
    }

    fn visit_new_expr(&mut self, n: &NewExpr) {
        if let Expr::Ident(..) = &*n.callee {
        } else {
            n.callee.visit_with(self);
        }

        n.args.visit_with(self);
    }

    fn visit_pat(&mut self, n: &Pat) {
        match n {
            Pat::Ident(i) => {
                self.add(i.to_id());
            }
            _ => {
                n.visit_children_with(self);
            }
        }
    }

    fn visit_prop_name(&mut self, n: &PropName) {
        if let PropName::Computed(..) = n {
            n.visit_children_with(self);
        }
    }

    fn visit_unary_expr(&mut self, n: &UnaryExpr) {
        // Modifying argument does not affect original value
        if matches!(n.op, op!("typeof") | op!(unary, "+") | op!(unary, "-")) {
            return;
        }

        n.visit_children_with(self);
    }
}
