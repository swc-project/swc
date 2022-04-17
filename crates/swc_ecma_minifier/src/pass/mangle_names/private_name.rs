use swc_atoms::JsWord;
use swc_common::collections::AHashMap;
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

use crate::util::base54;

pub fn private_name_mangler(keep_private_props: bool) -> impl Fold + VisitMut {
    as_folder(PrivateNameMangler {
        keep_private_props,
        private_n: Default::default(),
        renamed_private: Default::default(),
    })
}

struct PrivateNameMangler {
    keep_private_props: bool,
    private_n: usize,

    renamed_private: AHashMap<Id, JsWord>,
}

impl PrivateNameMangler {
    fn rename_private(&mut self, private_name: &mut PrivateName) {
        let id = private_name.id.to_id();

        let new_sym = if let Some(cached) = self.renamed_private.get(&id) {
            cached.clone()
        } else {
            let sym = base54::encode(&mut self.private_n, true);

            self.renamed_private.insert(id.clone(), sym.clone());

            sym
        };

        private_name.id.sym = new_sym;
    }
}

impl VisitMut for PrivateNameMangler {
    noop_visit_mut_type!();

    fn visit_mut_member_expr(&mut self, n: &mut MemberExpr) {
        n.obj.visit_mut_with(self);

        match &mut n.prop {
            MemberProp::Computed(c) => c.visit_mut_with(self),
            MemberProp::PrivateName(p) => p.visit_mut_with(self),
            MemberProp::Ident(_) => (),
        }
    }

    fn visit_mut_private_name(&mut self, private_name: &mut PrivateName) {
        if !self.keep_private_props {
            self.rename_private(private_name);
        }
    }
}
