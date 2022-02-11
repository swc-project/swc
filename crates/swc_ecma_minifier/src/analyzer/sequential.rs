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
                    self.data
                        .infects
                        .entry(id.clone())
                        .or_default()
                        .push(var.id.to_id());
                    self.data
                        .infects
                        .entry(var.id.to_id())
                        .or_default()
                        .push(id);
                }
            }
        }
    }
}
