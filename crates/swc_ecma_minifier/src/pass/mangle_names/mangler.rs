use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use self::{label_manger::LabelMangler, method_mangler::MethodNameMangler, private_name_manger::PrivateNameMangler};
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
                cache: Default::default(),
                n: Default::default(),
            }
        }

        pub(super) fn mangle(&mut self, label: &mut Ident) {
            let v = self
                .cache
                .entry(label.sym.clone())
                .or_insert_with(|| self.chars.encode(&mut self.n, true))
                .clone();

            label.sym = v;
        }
    }
}

mod method_mangler {
    use rustc_hash::FxHashMap;
    use swc_atoms::Atom;
    use swc_ecma_ast::*;

    use crate::util::base54::Base54Chars;

    pub(super) fn method_name_mangler(
        mangle_methods: bool,
        chars: Base54Chars,
    ) -> MethodNameMangler {
        MethodNameMangler {
            mangle_methods,
            method_n: Default::default(),
            renamed_methods: Default::default(),
            chars,
        }
    }

    pub(super) struct MethodNameMangler {
        chars: Base54Chars,
        mangle_methods: bool,
        method_n: usize,
        renamed_methods: FxHashMap<Atom, Atom>,
    }

    impl MethodNameMangler {
        pub(super) fn rename_method(&mut self, prop_name: &mut PropName) {
            if !self.mangle_methods {
                return;
            }

            match prop_name {
                PropName::Ident(ident) => {
                    // Skip certain method names that should not be mangled
                    let name = &ident.sym;
                    if name == "constructor" || name == "toString" || name == "valueOf" ||
                       name.starts_with("__") || name.starts_with("_") {
                        return;
                    }

                    let new_sym = if let Some(cached) = self.renamed_methods.get(&ident.sym) {
                        cached.clone()
                    } else {
                        let sym = self.chars.encode(&mut self.method_n, true);
                        self.renamed_methods.insert(ident.sym.clone(), sym.clone());
                        sym
                    };

                    ident.sym = new_sym;
                }
                // Don't mangle string, number, bigint or computed property names
                PropName::Str(_) | PropName::Num(_) | PropName::BigInt(_) | PropName::Computed(_) => {
                    return;
                }
            }
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
    method_name_mangler: MethodNameMangler,
}

impl ManglerVisitor {
    pub(super) fn new(keep_private_props: bool, mangle_methods: bool, chars: Base54Chars) -> Self {
        Self {
            label_mangler: LabelMangler::new(chars),
            private_name_mangler: self::private_name_manger::private_name_mangler(
                keep_private_props,
                chars,
            ),
            method_name_mangler: self::method_mangler::method_name_mangler(
                mangle_methods,
                chars,
            ),
        }
    }
}

impl VisitMut for ManglerVisitor {
    noop_visit_mut_type!();

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

    fn visit_mut_class_method(&mut self, n: &mut ClassMethod) {
        self.method_name_mangler.rename_method(&mut n.key);
        
        n.visit_mut_children_with(self);
    }

    fn visit_mut_private_method(&mut self, n: &mut PrivateMethod) {
        // Private methods are already handled by private_name_mangler
        n.visit_mut_children_with(self);
    }

    fn visit_mut_method_prop(&mut self, n: &mut MethodProp) {
        self.method_name_mangler.rename_method(&mut n.key);
        
        n.visit_mut_children_with(self);
    }
}
