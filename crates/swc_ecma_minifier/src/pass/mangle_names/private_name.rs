use crate::util::base54::incr_base54;
use swc_atoms::JsWord;
use swc_common::collections::AHashMap;
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

pub fn private_name_mangler(
    keep_private_props: bool,
    reserved: Vec<String>,
) -> impl Fold + VisitMut {
    as_folder(PrivateNameMangler {
        keep_private_props,
        private_n: Default::default(),
        renamed_private: Default::default(),
        reserved,
    })
}

struct PrivateNameMangler {
    keep_private_props: bool,
    private_n: usize,

    renamed_private: AHashMap<Id, JsWord>,

    reserved: Vec<String>,
}

impl PrivateNameMangler {
    fn rename_private(&mut self, private_name: &mut PrivateName) {
        let id = private_name.id.to_id();

        let new_sym = if let Some(cached) = self.renamed_private.get(&id) {
            cached.clone()
        } else {
            let sym = incr_base54(&mut self.private_n).1;

            let sym: JsWord = sym.into();

            self.renamed_private.insert(id.clone(), sym.clone());

            sym
        };

        private_name.id.sym = new_sym;
    }

    fn is_reserved(&self, ident: &Ident) -> bool {
        self.reserved.contains(&ident.sym.to_string())
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
        if !self.keep_private_props && !self.is_reserved(&private_name.id) {
            self.rename_private(private_name);
        }
    }
}
