use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use self::{label_manger::LabelMangler, private_name_manger::PrivateNameMangler};
use crate::util::base54::Base54Chars;

mod label_manger {
    use rustc_hash::FxHashMap;
    use swc_atoms::Atom;
    use swc_ecma_ast::*;

    use crate::util::base54::Base54Chars;

    pub(super) struct LabelMangler {
        chars: Base54Chars,
        cache: FxHashMap<Atom, Atom>,
        n: usize,
    }

    impl LabelMangler {
        pub(super) fn new(chars: Base54Chars) -> Self {
            Self {
                chars,
                cache: FxHashMap::with_capacity_and_hasher(64, Default::default()),
                n: Default::default(),
            }
        }

        pub(super) fn mangle(&mut self, label: &mut Ident) {
            // Avoid cloning the symbol if it's already cached
            if let Some(cached) = self.cache.get(&label.sym) {
                label.sym = cached.clone();
                return;
            }

            let new_sym = self.chars.encode(&mut self.n, true);
            self.cache.insert(label.sym.clone(), new_sym.clone());
            label.sym = new_sym;
        }
    }
}

mod private_name_manger {
    use rustc_hash::FxHashMap;
    use swc_atoms::Atom;
    use swc_ecma_ast::*;

    use crate::util::base54::Base54Chars;

    pub(super) fn private_name_mangler(
        keep_private_props: bool,
        chars: Base54Chars,
    ) -> PrivateNameMangler {
        PrivateNameMangler {
            keep_private_props,
            private_n: Default::default(),
            renamed_private: Default::default(),
            chars,
        }
    }

    pub(super) struct PrivateNameMangler {
        chars: Base54Chars,
        keep_private_props: bool,
        private_n: usize,

        renamed_private: FxHashMap<Atom, Atom>,
    }

    impl PrivateNameMangler {
        pub(super) fn rename_private(&mut self, private_name: &mut PrivateName) {
            if self.keep_private_props {
                return;
            }
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
}

pub(super) struct ManglerVisitor {
    label_mangler: LabelMangler,
    private_name_mangler: PrivateNameMangler,
}

impl ManglerVisitor {
    pub(super) fn new(keep_private_props: bool, chars: Base54Chars) -> Self {
        Self {
            label_mangler: LabelMangler::new(chars),
            private_name_mangler: self::private_name_manger::private_name_mangler(
                keep_private_props,
                chars,
            ),
        }
    }
}

impl VisitMut for ManglerVisitor {
    noop_visit_mut_type!(fail);

    fn visit_mut_private_name(&mut self, n: &mut PrivateName) {
        self.private_name_mangler.rename_private(n);
    }

    fn visit_mut_labeled_stmt(&mut self, n: &mut LabeledStmt) {
        self.label_mangler.mangle(&mut n.label);

        n.visit_mut_children_with(self);
    }

    fn visit_mut_continue_stmt(&mut self, n: &mut ContinueStmt) {
        if let Some(label) = &mut n.label {
            self.label_mangler.mangle(label);
        }

        n.visit_mut_children_with(self);
    }

    fn visit_mut_break_stmt(&mut self, n: &mut BreakStmt) {
        if let Some(label) = &mut n.label {
            self.label_mangler.mangle(label);
        }

        n.visit_mut_children_with(self);
    }
}
