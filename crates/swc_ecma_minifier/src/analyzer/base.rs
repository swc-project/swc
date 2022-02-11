//! Some analysis of AST cannot be easily done in parallel with other analysis,
//! and those analysis are done by this module.
//!
//! Currently, this module performs
//!
//!  - Infection analysis

use swc_common::collections::{AHashMap, AHashSet};
use swc_ecma_ast::*;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_visit::{noop_visit_type, visit_obj_and_computed, Visit, VisitWith};

#[derive(Debug, Default)]
pub(crate) struct BaseData {
    pub(super) infects: AHashMap<Id, Vec<Id>>,
}

pub(crate) struct BaseAnalyzer<'a> {
    pub(super) data: &'a mut BaseData,
}

impl Visit for BaseAnalyzer<'_> {
    fn visit_var_decl(&mut self, n: &VarDecl) {
        n.visit_children_with(self);

        for decl in &n.decls {
            if let (Pat::Ident(var), Some(init)) = (&decl.name, decl.init.as_deref()) {
                let used_idents = {
                    let mut v = AliasCollector::default();
                    init.visit_with(&mut v);
                    v.ids
                };

                for id in used_idents {
                    {
                        let v = self.data.infects.entry(id.clone()).or_default();
                        if !v.contains(&var.id.to_id()) {
                            v.push(var.id.to_id());
                        }
                    }
                    {
                        let v = self.data.infects.entry(var.id.to_id()).or_default();
                        if !v.contains(&id) {
                            v.push(id);
                        }
                    }
                }
            }
        }
    }
}

#[derive(Default)]
struct AliasCollector {
    ids: AHashSet<Id>,
}

impl Visit for AliasCollector {
    noop_visit_type!();

    visit_obj_and_computed!();

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

    fn visit_block_stmt_or_expr(&mut self, _: &BlockStmtOrExpr) {}

    fn visit_constructor(&mut self, _: &Constructor) {}

    fn visit_function(&mut self, _: &Function) {}

    fn visit_ident(&mut self, n: &Ident) {
        self.ids.insert(n.to_id());
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
