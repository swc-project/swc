use std::collections::HashMap;

use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::{js_word, JsWord};
use swc_common::{collections::AHashMap, util::take::Take};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

#[derive(Debug, Default)]
pub(super) struct Analyzer {
    pub scope: Scope,

    pub is_pat_decl: bool,
}

impl Analyzer {
    fn add_decl(&mut self, id: Id) {
        self.scope.add_decl(&id);
    }

    fn add_usage(&mut self, id: Id) {
        self.scope.add_usage(&id);
    }

    fn with_scope<F>(&mut self, op: F)
    where
        F: FnOnce(&mut Analyzer),
    {
        {
            let mut v = Analyzer {
                scope: Scope {
                    ..Default::default()
                },
                is_pat_decl: self.is_pat_decl,
            };

            op(&mut v);

            self.scope.children.push(v.scope);
        }
    }
}

impl Visit for Analyzer {
    noop_visit_type!();

    fn visit_arrow_expr(&mut self, e: &ArrowExpr) {
        self.with_scope(|v| {
            let old = v.is_pat_decl;
            v.is_pat_decl = true;
            e.params.visit_with(v);
            v.is_pat_decl = false;
            e.body.visit_with(v);
            v.is_pat_decl = old;
        });
    }

    fn visit_assign_pat_prop(&mut self, p: &AssignPatProp) {
        p.visit_children_with(self);

        if self.is_pat_decl {
            self.add_decl(p.key.to_id())
        } else {
            self.add_usage(p.key.to_id())
        }
    }

    fn visit_catch_clause(&mut self, n: &CatchClause) {
        let old = self.is_pat_decl;

        self.is_pat_decl = true;
        n.param.visit_with(self);

        self.is_pat_decl = false;
        n.body.visit_with(self);

        self.is_pat_decl = old;
    }

    fn visit_class_decl(&mut self, c: &ClassDecl) {
        self.add_decl(c.ident.to_id());

        c.class.visit_with(self);
    }

    fn visit_class_expr(&mut self, c: &ClassExpr) {
        self.with_scope(|v| {
            if let Some(id) = &c.ident {
                v.add_decl(id.to_id());
            }

            c.class.visit_with(v);
        })
    }

    fn visit_class_method(&mut self, f: &ClassMethod) {
        f.key.visit_with(self);

        self.with_scope(|v| {
            f.function.visit_with(v);
        })
    }

    fn visit_constructor(&mut self, f: &Constructor) {
        self.with_scope(|v| {
            f.visit_children_with(v);
        })
    }

    fn visit_default_decl(&mut self, d: &DefaultDecl) {
        match d {
            DefaultDecl::Class(c) => {
                if let Some(id) = &c.ident {
                    self.add_decl(id.to_id());
                }

                self.with_scope(|v| {
                    c.class.visit_with(v);
                })
            }
            DefaultDecl::Fn(f) => {
                if let Some(id) = &f.ident {
                    self.add_decl(id.to_id());
                }

                self.with_scope(|v| {
                    f.function.visit_with(v);
                })
            }
            DefaultDecl::TsInterfaceDecl(_) => {}
        }
    }

    fn visit_export_named_specifier(&mut self, n: &ExportNamedSpecifier) {
        match &n.orig {
            ModuleExportName::Ident(orig) => {
                self.add_usage(orig.to_id());
            }
            ModuleExportName::Str(..) => {}
        };
    }

    fn visit_expr(&mut self, e: &Expr) {
        let old_is_pat_decl = self.is_pat_decl;

        self.is_pat_decl = false;
        e.visit_children_with(self);

        if let Expr::Ident(i) = e {
            self.add_usage(i.to_id())
        }

        self.is_pat_decl = old_is_pat_decl;
    }

    fn visit_fn_decl(&mut self, f: &FnDecl) {
        self.add_decl(f.ident.to_id());

        self.with_scope(|v| {
            f.function.visit_with(v);
        })
    }

    fn visit_fn_expr(&mut self, f: &FnExpr) {
        self.with_scope(|v| {
            if let Some(id) = &f.ident {
                v.add_decl(id.to_id());
            }

            f.function.visit_with(v);
        })
    }

    fn visit_import_default_specifier(&mut self, n: &ImportDefaultSpecifier) {
        self.add_decl(n.local.to_id());
    }

    fn visit_import_named_specifier(&mut self, n: &ImportNamedSpecifier) {
        self.add_decl(n.local.to_id());
    }

    fn visit_import_star_as_specifier(&mut self, n: &ImportStarAsSpecifier) {
        self.add_decl(n.local.to_id());
    }

    fn visit_member_expr(&mut self, e: &MemberExpr) {
        e.obj.visit_with(self);

        if let MemberProp::Computed(c) = &e.prop {
            c.visit_with(self);
        }
    }

    fn visit_method_prop(&mut self, f: &MethodProp) {
        f.key.visit_with(self);

        self.with_scope(|v| {
            f.function.visit_with(v);
        })
    }

    fn visit_named_export(&mut self, n: &NamedExport) {
        if n.src.is_some() {
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_param(&mut self, e: &Param) {
        let old = self.is_pat_decl;

        self.is_pat_decl = false;
        e.decorators.visit_with(self);

        self.is_pat_decl = true;
        e.pat.visit_with(self);

        self.is_pat_decl = old;
    }

    fn visit_pat(&mut self, e: &Pat) {
        e.visit_children_with(self);

        if let Pat::Ident(i) = e {
            if self.is_pat_decl {
                self.add_decl(i.to_id())
            } else {
                self.add_usage(i.to_id())
            }
        }
    }

    fn visit_prop(&mut self, p: &Prop) {
        p.visit_children_with(self);

        if let Prop::Shorthand(i) = p {
            self.add_usage(i.to_id())
        }
    }

    fn visit_super_prop_expr(&mut self, e: &SuperPropExpr) {
        if let SuperProp::Computed(c) = &e.prop {
            c.visit_with(self);
        }
    }

    fn visit_var_declarator(&mut self, v: &VarDeclarator) {
        let old = self.is_pat_decl;

        self.is_pat_decl = true;
        v.name.visit_with(self);

        self.is_pat_decl = false;
        v.init.visit_with(self);

        self.is_pat_decl = old;
    }
}

#[derive(Debug, Default)]
pub(super) struct Scope {
    pub data: ScopeData,

    children: Vec<Scope>,
}

#[derive(Debug, Default)]
pub struct ScopeData {
    /// This is add-only.
    ///
    /// If the add-only contraint is violated, it is very likely to be a bug,
    /// because we merge every items in children to current scope.
    all: FxHashSet<Id>,

    queue: Vec<Id>,
}

impl Scope {
    pub(super) fn add_decl(&mut self, id: &Id) {
        if id.0 == js_word!("arguments") {
            return;
        }

        self.data.all.insert(id.clone());
        self.data.queue.push(id.clone());
    }

    pub(super) fn add_usage(&mut self, id: &Id) {
        if id.0 == js_word!("arguments") {
            return;
        }

        self.data.all.insert(id.clone());
    }

    /// Copy `children.data.all` to `self.data.all`.
    pub(super) fn prepare_renaming(&mut self) {
        self.children.iter_mut().for_each(|child| {
            child.prepare_renaming();

            self.data.all.extend(child.data.all.iter().cloned());
        });
    }

    pub(super) fn rename(
        &mut self,
        to: &mut AHashMap<Id, JsWord>,
        previous: &AHashMap<Id, JsWord>,
        reverse: &FxHashMap<JsWord, Vec<Id>>,
        preserved_symbols: &FxHashSet<JsWord>,
    ) {
        let queue = self.data.queue.take();

        let mut cloned_reverse = reverse.clone();

        self.rename_one_scope(to, previous, &mut cloned_reverse, queue, preserved_symbols);

        #[cfg(feature = "rayon")]
        {
            use rayon::prelude::*;

            use crate::perf::cpu_count;

            if self.children.len() >= cpu_count() {
                let iter = self.children.par_iter_mut();

                let iter = iter
                    .map(|child| {
                        let mut new_map = HashMap::default();
                        child.rename(&mut new_map, to, &cloned_reverse, preserved_symbols);
                        new_map
                    })
                    .collect::<Vec<_>>();

                for (k, v) in iter.into_iter().flatten() {
                    to.entry(k).or_insert(v);
                }
            }
        }

        for child in &mut self.children {
            child.rename(to, &Default::default(), &cloned_reverse, preserved_symbols);
        }
    }

    fn rename_one_scope(
        &self,
        to: &mut AHashMap<Id, JsWord>,
        previous: &AHashMap<Id, JsWord>,
        reverse: &mut FxHashMap<JsWord, Vec<Id>>,
        queue: Vec<Id>,
        preserved_symbols: &FxHashSet<JsWord>,
    ) {
        let mut n = 0;

        for id in queue {
            if to.get(&id).is_some() || previous.get(&id).is_some() {
                continue;
            }

            loop {
                n += 1;
                let sym = format!("{}{}", id.0, n).into();

                // TODO: Use base54::decode
                if preserved_symbols.contains(&sym) {
                    continue;
                }

                if self.can_rename(&id, &sym, reverse) {
                    to.insert(id.clone(), sym.clone());
                    reverse.entry(sym).or_default().push(id.clone());

                    break;
                }
            }
        }
    }

    fn can_rename(&self, id: &Id, symbol: &JsWord, reverse: &FxHashMap<JsWord, Vec<Id>>) -> bool {
        // We can optimize this
        // We only need to check the current scope and parents (ignoring `a` generated
        // for unrelated scopes)
        if let Some(lefts) = reverse.get(symbol) {
            for left in lefts {
                if *left == *id {
                    continue;
                }

                if self.data.all.contains(left) {
                    return false;
                }
            }
        }

        true
    }
}
