use swc_atoms::JsWord;
use swc_common::collections::AHashMap;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use super::Base54Chars;

pub(crate) fn private_name_mangler(keep_private_props: bool, chars: Base54Chars) -> impl VisitMut {
    PrivateNameMangler {
        keep_private_props,
        private_n: Default::default(),
        renamed_private: Default::default(),
        chars,
    }
}

struct PrivateNameMangler {
    chars: Base54Chars,
    keep_private_props: bool,
    private_n: usize,

    renamed_private: AHashMap<JsWord, JsWord>,
}

impl PrivateNameMangler {
    fn rename_private(&mut self, private_name: &mut PrivateName) {
        let new_sym = if let Some(cached) = self.renamed_private.get(&private_name.name) {
            cached.clone()
        } else {
            let sym = self.chars.encode(&mut self.private_n, true);

            self.renamed_private
                .insert(private_name.name.clone(), sym.clone());

            sym
        };

        private_name.name = new_sym;
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
