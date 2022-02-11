//! Some analysis of AST cannot be easily done in parallel with other analysis,
//! and those analysis are done by this module.
//!
//! Currently, this module performs
//!
//!  - Infection analysis

use swc_common::collections::AHashMap;
use swc_ecma_ast::*;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_visit::{Visit, VisitWith};

use crate::util::idents_used_by;

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
                let used_idents = idents_used_by(init);

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
