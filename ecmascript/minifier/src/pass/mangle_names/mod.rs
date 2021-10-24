use self::preserver::idents_to_preserve;
use super::compute_char_freq::CharFreqInfo;
use crate::{
    analyzer::{analyze, ProgramData},
    marks::Marks,
    option::MangleOptions,
    util::base54::incr_base54,
};
use swc_atoms::JsWord;
use swc_common::collections::{AHashMap, AHashSet};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

mod analyzer;
mod preserver;
mod v2;

pub(crate) fn name_mangler(
    options: MangleOptions,
    char_freq_info: CharFreqInfo,
    marks: Marks,
) -> impl VisitMut {
    self::v2::name_mangler(options, char_freq_info, marks)
}

#[derive(Debug)]
struct PrivateNameMangler {
    options: MangleOptions,
    private_n: usize,

    preserved: AHashSet<Id>,
    preserved_symbols: AHashSet<JsWord>,
    renamed_private: AHashMap<Id, JsWord>,
    data: Option<ProgramData>,
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

    fn visit_mut_module(&mut self, n: &mut Module) {
        let data = analyze(&*n, None);
        self.data = Some(data);
        self.preserved = idents_to_preserve(self.options.clone(), n);
        self.preserved_symbols = self.preserved.iter().map(|v| v.0.clone()).collect();
        n.visit_mut_children_with(self);
    }

    fn visit_mut_private_name(&mut self, private_name: &mut PrivateName) {
        if !self.options.keep_private_props {
            self.rename_private(private_name);
        }
    }

    fn visit_mut_script(&mut self, n: &mut Script) {
        let data = analyze(&*n, None);
        self.data = Some(data);
        self.preserved = idents_to_preserve(self.options.clone(), n);
        self.preserved_symbols = self.preserved.iter().map(|v| v.0.clone()).collect();
        n.visit_mut_children_with(self);
    }
}
