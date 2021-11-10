use crate::util::base54::incr_base54;
use swc_atoms::JsWord;
use swc_common::collections::AHashMap;
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

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
            loop {
                let sym = incr_base54(&mut self.private_n).1;

                let sym: JsWord = sym.into();

                self.renamed_private.insert(id.clone(), sym.clone());

                break sym;
            }
        };

        private_name.id.sym = new_sym;
    }
}

impl VisitMut for PrivateNameMangler {
    noop_visit_mut_type!();

    fn visit_mut_member_expr(&mut self, n: &mut MemberExpr) {
        n.obj.visit_mut_with(self);

        if n.computed {
            n.prop.visit_mut_with(self);
        } else {
            match &*n.prop {
                Expr::PrivateName(..) => {
                    n.prop.visit_mut_with(self);
                }
                _ => {}
            }
        }
    }

    fn visit_mut_private_name(&mut self, private_name: &mut PrivateName) {
        if !self.keep_private_props {
            self.rename_private(private_name);
        }
    }
}
