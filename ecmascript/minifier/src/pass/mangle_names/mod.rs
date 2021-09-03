use self::preserver::idents_to_preserve;
use super::compute_char_freq::CharFreqInfo;
use crate::{
    analyzer::{analyze, ProgramData},
    marks::Marks,
    option::MangleOptions,
    util::base54::incr_base54,
};
use fxhash::{FxHashMap, FxHashSet};
use swc_atoms::{js_word, JsWord};
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

mod preserver;

pub(crate) fn name_mangler(
    options: MangleOptions,
    _char_freq_info: CharFreqInfo,
    marks: Marks,
) -> impl VisitMut {
    Mangler {
        options,
        n: 0,
        private_n: 0,
        preserved: Default::default(),
        preserved_symbols: Default::default(),
        renamed: Default::default(),
        renamed_private: Default::default(),
        data: Default::default(),
        marks,
    }
}

#[derive(Debug)]
struct Mangler {
    options: MangleOptions,
    n: usize,
    private_n: usize,

    preserved: FxHashSet<Id>,
    preserved_symbols: FxHashSet<JsWord>,
    renamed: FxHashMap<Id, JsWord>,
    renamed_private: FxHashMap<Id, JsWord>,
    data: Option<ProgramData>,

    marks: Marks,
}

impl Mangler {
    fn rename(&mut self, i: &mut Ident) -> bool {
        match i.sym {
            js_word!("arguments") => return false,
            _ => {}
        }

        if self.preserved.contains(&i.to_id()) {
            return false;
        }

        if let Some(var) = self.data.as_ref().unwrap().vars.get(&i.to_id()) {
            if !var.declared {
                return false;
            }
        }

        if let Some(v) = self.renamed.get(&i.to_id()) {
            i.span.ctxt = SyntaxContext::empty();
            i.sym = v.clone();
            return true;
        }

        loop {
            let sym = incr_base54(&mut self.n);

            let sym: JsWord = sym.into();
            if self.preserved_symbols.contains(&sym) {
                continue;
            }

            self.renamed.insert(i.to_id(), sym.clone());

            i.sym = sym.clone();
            i.span.ctxt = SyntaxContext::empty();
            break;
        }

        true
    }

    fn rename_private(&mut self, private_name: &mut PrivateName) {
        let id = private_name.id.to_id();

        let new_sym = if let Some(cached) = self.renamed_private.get(&id) {
            cached.clone()
        } else {
            loop {
                let sym = incr_base54(&mut self.private_n);

                let sym: JsWord = sym.into();

                self.renamed_private.insert(id.clone(), sym.clone());

                break sym;
            }
        };

        private_name.id.sym = new_sym;
    }
}

impl VisitMut for Mangler {
    noop_visit_mut_type!();

    fn visit_mut_class_decl(&mut self, n: &mut ClassDecl) {
        self.rename(&mut n.ident);

        n.class.visit_mut_with(self);
    }
    fn visit_mut_export_named_specifier(&mut self, n: &mut ExportNamedSpecifier) {
        if n.exported.is_none() {
            n.exported = Some(n.orig.clone());
        }

        self.rename(&mut n.orig);
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        match e {
            Expr::Ident(i) => {
                self.rename(i);
            }
            _ => {}
        }
    }

    fn visit_mut_fn_decl(&mut self, n: &mut FnDecl) {
        self.rename(&mut n.ident);
        n.function.visit_mut_with(self);
    }

    fn visit_mut_import_default_specifier(&mut self, n: &mut ImportDefaultSpecifier) {
        self.rename(&mut n.local);
    }

    fn visit_mut_import_named_specifier(&mut self, n: &mut ImportNamedSpecifier) {
        match &n.imported {
            Some(..) => {}
            None => {
                n.imported = Some(n.local.clone());
            }
        }

        self.rename(&mut n.local);
    }

    fn visit_mut_import_star_as_specifier(&mut self, n: &mut ImportStarAsSpecifier) {
        self.rename(&mut n.local);
    }

    fn visit_mut_labeled_stmt(&mut self, n: &mut LabeledStmt) {
        n.body.visit_mut_with(self);
    }

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

    fn visit_mut_named_export(&mut self, n: &mut NamedExport) {
        if n.src.is_some() {
            return;
        }

        n.visit_mut_children_with(self)
    }

    fn visit_mut_object_pat_prop(&mut self, n: &mut ObjectPatProp) {
        match n {
            ObjectPatProp::Assign(AssignPatProp {
                value: None, key, ..
            }) => {
                let key_span = key.span.with_ctxt(SyntaxContext::empty());
                let orig = key.sym.clone();

                if self.rename(key) {
                    *n = ObjectPatProp::KeyValue(KeyValuePatProp {
                        key: PropName::Ident(Ident::new(orig, key_span)),
                        value: Box::new(Pat::Ident(key.clone().into())),
                    });
                }
            }

            ObjectPatProp::Assign(p) => {
                let key_span = p.key.span.with_ctxt(SyntaxContext::empty());
                let orig = p.key.sym.clone();

                if self.rename(&mut p.key) {
                    if let Some(right) = p.value.take() {
                        *n = ObjectPatProp::KeyValue(KeyValuePatProp {
                            key: PropName::Ident(Ident::new(orig, key_span)),
                            value: Box::new(Pat::Assign(AssignPat {
                                span: p.span,
                                left: Box::new(Pat::Ident(p.key.clone().into())),
                                right,
                                type_ann: None,
                            })),
                        });
                    } else {
                        *n = ObjectPatProp::KeyValue(KeyValuePatProp {
                            key: PropName::Ident(Ident::new(orig, key_span)),
                            value: Box::new(Pat::Ident(p.key.clone().into())),
                        });
                    }
                }
            }

            _ => {
                n.visit_mut_children_with(self);
            }
        }
    }

    fn visit_mut_pat(&mut self, n: &mut Pat) {
        n.visit_mut_children_with(self);

        match n {
            Pat::Ident(i) => {
                self.rename(&mut i.id);
            }
            _ => {}
        }
    }

    fn visit_mut_private_name(&mut self, private_name: &mut PrivateName) {
        if !self.options.keep_private_props {
            self.rename_private(private_name);
        }
    }

    fn visit_mut_prop(&mut self, n: &mut Prop) {
        match n {
            Prop::Shorthand(p) => {
                let span = p.span.with_ctxt(SyntaxContext::empty());
                let orig = p.sym.clone();

                if self.rename(p) {
                    *n = Prop::KeyValue(KeyValueProp {
                        key: PropName::Ident(Ident::new(orig, span)),
                        value: Box::new(Expr::Ident(p.clone())),
                    });
                }
            }
            _ => {
                n.visit_mut_children_with(self);
            }
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
