use std::{cell::RefCell, cmp::Reverse, collections::BinaryHeap, mem::take};

use self::preserver::idents_to_preserve;
use super::compute_char_freq::CharFreqInfo;
use crate::{
    analyzer::{analyze, ProgramData},
    marks::Marks,
    option::MangleOptions,
    util::{base54::incr_base54, idents_used_by, idents_used_by_ordered},
};
use indexmap::IndexSet;
use swc_atoms::{js_word, JsWord};
use swc_common::{
    collections::{AHashMap, AHashSet},
    SyntaxContext,
};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};
use tracing::debug;

mod analyzer;
mod preserver;

pub(crate) fn name_mangler(
    options: MangleOptions,
    _char_freq_info: CharFreqInfo,
    _marks: Marks,
) -> impl VisitMut {
    Mangler {
        options,
        data: Default::default(),
        cur: Default::default(),
    }
}

#[derive(Debug)]
struct Mangler<'a> {
    options: MangleOptions,

    data: Data,

    cur: Scope<'a>,
}

#[derive(Debug, Default)]
struct Data {
    preserved: AHashSet<Id>,
    preserved_symbols: AHashSet<JsWord>,
    data: Option<ProgramData>,

    n: usize,

    renamed: AHashMap<Id, JsWord>,
    renamed_ids: AHashMap<usize, Vec<Id>>,

    // TODO: Reuse number
    renamed_private: AHashMap<Id, JsWord>,
    private_n: usize,
    is_pat_decl: bool,
}

#[derive(Debug, Default)]
struct Scope<'a> {
    parent: Option<&'a Scope<'a>>,

    used: IndexSet<Id, ahash::RandomState>,

    /// Decls in current scope.
    decls: Vec<usize>,
}

impl Scope<'_> {
    fn cannot_reuse(&self, n: usize, id: &Id) -> bool {
        if self.decls.contains(&n) || self.used.contains(id) {
            return true;
        }

        match self.parent {
            Some(s) => s.cannot_reuse(n, id),
            None => false,
        }
    }
}

impl Mangler<'_> {
    fn exit_scope(&mut self) {}

    fn with_scope<F>(&mut self, used: IndexSet<Id, ahash::RandomState>, op: F)
    where
        F: for<'aa> FnOnce(&mut Mangler<'aa>),
    {
        let mut reusable_n = vec![];
        'outer: for n in 0..self.data.n {
            let ids_of_n = self.data.renamed_ids.get(&n).cloned();

            let ids_of_n = match ids_of_n {
                Some(v) => v,
                None => continue,
            };

            for id_of_n in ids_of_n {
                if used.contains(&id_of_n) || self.cur.cannot_reuse(n, &id_of_n) {
                    continue 'outer;
                }
            }

            reusable_n.push(n);
        }
        dbg!(&reusable_n, &used);
        reusable_n.reverse();

        for id in used.iter() {
            if self.data.renamed.contains_key(id) {
                continue;
            }

            if let Some(mut n) = reusable_n.pop() {
                let (n, sym) = incr_base54(&mut n);

                debug!("Reuse `{}` for `{}{:?}`", sym, id.0, id.1);
                self.data.renamed.insert(id.clone(), sym.into());
                self.data.renamed_ids.entry(n).or_default().push(id.clone());
            }
        }

        let data = take(&mut self.data);
        let parent = take(&mut self.cur);
        {
            let scope = Scope {
                parent: Some(&parent),
                used,
                decls: Default::default(),
            };

            let mut v = Mangler {
                options: self.options.clone(),
                data,
                cur: scope,
            };

            op(&mut v);

            v.exit_scope();

            self.data = v.data;
        }

        self.cur = parent;
    }
}

impl Mangler<'_> {
    /// Returns `true` if renamed.
    fn rename_decl(&mut self, i: &mut Ident) -> bool {
        self.rename_new(i, true)
    }

    /// Returns `true` if renamed.
    fn rename_usage(&mut self, i: &mut Ident) -> bool {
        self.rename_new(i, false)
    }

    fn rename_new(&mut self, i: &mut Ident, is_decl: bool) -> bool {
        match i.sym {
            js_word!("arguments") => return false,
            _ => {}
        }

        if self.data.preserved.contains(&i.to_id()) {
            return false;
        }

        if let Some(var) = self.data.data.as_ref().unwrap().vars.get(&i.to_id()) {
            if !var.declared {
                return false;
            }
        }

        if let Some(v) = self.data.renamed.get(&i.to_id()) {
            i.span.ctxt = SyntaxContext::empty();
            i.sym = v.clone();
            return true;
        }

        loop {
            let (used_n, sym) = incr_base54(&mut self.data.n);

            if is_decl {
                if !self.cur.decls.contains(&used_n) {
                    self.cur.decls.push(used_n);
                }
            }

            let sym: JsWord = sym.into();
            if self.data.preserved_symbols.contains(&sym) {
                continue;
            }

            debug!("Using symbol `{}` for `{}{:?}`", sym, i.sym, i.span.ctxt);
            self.data.renamed.insert(i.to_id(), sym.clone());
            self.data
                .renamed_ids
                .entry(used_n)
                .or_default()
                .push(i.to_id());

            i.sym = sym.clone();
            i.span.ctxt = SyntaxContext::empty();
            break;
        }

        true
    }

    fn rename_private(&mut self, private_name: &mut PrivateName) {
        let id = private_name.id.to_id();

        let new_sym = if let Some(cached) = self.data.renamed_private.get(&id) {
            cached.clone()
        } else {
            loop {
                let sym = incr_base54(&mut self.data.private_n).1;

                let sym: JsWord = sym.into();

                self.data.renamed_private.insert(id.clone(), sym.clone());

                break sym;
            }
        };

        private_name.id.sym = new_sym;
    }
}

impl VisitMut for Mangler<'_> {
    noop_visit_mut_type!();

    fn visit_mut_arrow_expr(&mut self, n: &mut ArrowExpr) {
        let used = idents_used_by_ordered(&*n);

        self.with_scope(used, |v| {
            let old = v.data.is_pat_decl;
            v.data.is_pat_decl = true;
            n.params.visit_mut_with(v);

            v.data.is_pat_decl = false;
            n.body.visit_mut_children_with(v);

            v.data.is_pat_decl = old;
        })
    }

    fn visit_mut_catch_clause(&mut self, n: &mut CatchClause) {
        let used = idents_used_by_ordered(&*n);

        self.with_scope(used, |v| {
            let old = v.data.is_pat_decl;

            v.data.is_pat_decl = true;
            n.param.visit_mut_with(v);

            v.data.is_pat_decl = true;
            n.body.visit_mut_with(v);

            v.data.is_pat_decl = old;
        })
    }

    fn visit_mut_class_decl(&mut self, n: &mut ClassDecl) {
        self.rename_decl(&mut n.ident);

        n.class.visit_mut_with(self);
    }

    fn visit_mut_export_named_specifier(&mut self, n: &mut ExportNamedSpecifier) {
        if n.exported.is_none() {
            n.exported = Some(n.orig.clone());
        }

        self.rename_usage(&mut n.orig);
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        let old = self.data.is_pat_decl;
        self.data.is_pat_decl = false;
        e.visit_mut_children_with(self);

        match e {
            Expr::Ident(i) => {
                self.rename_usage(i);
            }
            _ => {}
        }

        self.data.is_pat_decl = old;
    }

    fn visit_mut_fn_decl(&mut self, n: &mut FnDecl) {
        let used = idents_used_by_ordered(&n.function);

        self.rename_decl(&mut n.ident);

        self.with_scope(used, |v| {
            n.function.visit_mut_with(v);
        });
    }

    fn visit_mut_fn_expr(&mut self, n: &mut FnExpr) {
        let used = idents_used_by_ordered(&*n);

        self.with_scope(used, |v| {
            if let Some(i) = &mut n.ident {
                v.rename_decl(i);
            }

            n.function.visit_mut_with(v);
        })
    }

    fn visit_mut_function(&mut self, n: &mut Function) {
        n.params.visit_mut_with(self);

        n.body.visit_mut_with(self);

        n.decorators.visit_mut_with(self);
    }

    fn visit_mut_import_default_specifier(&mut self, n: &mut ImportDefaultSpecifier) {
        self.rename_decl(&mut n.local);
    }

    fn visit_mut_import_named_specifier(&mut self, n: &mut ImportNamedSpecifier) {
        match &n.imported {
            Some(..) => {}
            None => {
                n.imported = Some(n.local.clone());
            }
        }

        self.rename_decl(&mut n.local);
    }

    fn visit_mut_import_star_as_specifier(&mut self, n: &mut ImportStarAsSpecifier) {
        self.rename_decl(&mut n.local);
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
        self.data.data = Some(data);
        self.data.preserved = idents_to_preserve(self.options.clone(), n);
        self.data.preserved_symbols = self.data.preserved.iter().map(|v| v.0.clone()).collect();
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
                let renamed = if self.data.is_pat_decl {
                    self.rename_decl(key)
                } else {
                    self.rename_usage(key)
                };

                if renamed {
                    *n = ObjectPatProp::KeyValue(KeyValuePatProp {
                        key: PropName::Ident(Ident::new(orig, key_span)),
                        value: Box::new(Pat::Ident(key.clone().into())),
                    });
                }
            }

            ObjectPatProp::Assign(p) => {
                p.value.visit_mut_with(self);

                let key_span = p.key.span.with_ctxt(SyntaxContext::empty());
                let orig = p.key.sym.clone();
                let renamed = if self.data.is_pat_decl {
                    self.rename_decl(&mut p.key)
                } else {
                    self.rename_usage(&mut p.key)
                };

                if renamed {
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

    fn visit_mut_param(&mut self, n: &mut Param) {
        let old = self.data.is_pat_decl;
        self.data.is_pat_decl = false;
        n.decorators.visit_mut_with(self);

        self.data.is_pat_decl = true;
        n.pat.visit_mut_with(self);

        self.data.is_pat_decl = old;
    }

    fn visit_mut_pat(&mut self, n: &mut Pat) {
        n.visit_mut_children_with(self);

        match n {
            Pat::Ident(i) => {
                if self.data.is_pat_decl {
                    self.rename_decl(&mut i.id);
                } else {
                    self.rename_usage(&mut i.id);
                }
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

                if self.rename_usage(p) {
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
        self.data.data = Some(data);
        self.data.preserved = idents_to_preserve(self.options.clone(), n);
        self.data.preserved_symbols = self.data.preserved.iter().map(|v| v.0.clone()).collect();
        n.visit_mut_children_with(self);
    }

    fn visit_mut_var_declarator(&mut self, n: &mut VarDeclarator) {
        let old = self.data.is_pat_decl;

        self.data.is_pat_decl = true;
        n.name.visit_mut_with(self);

        self.data.is_pat_decl = false;
        n.init.visit_mut_with(self);

        self.data.is_pat_decl = old;
    }
}
