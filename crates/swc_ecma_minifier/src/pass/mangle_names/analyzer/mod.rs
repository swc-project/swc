use rustc_hash::FxHashSet;
use swc_atoms::JsWord;
use swc_common::collections::AHashMap;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};
#[cfg(feature = "debug")]
use tracing::trace;

use self::scope::Scope;

mod scope;

pub(super) struct Analyzer {
    pub scope: Scope,

    pub is_pat_decl: bool,
}

impl Analyzer {
    pub(super) fn into_rename_map(
        mut self,
        preserved: &FxHashSet<Id>,
        unresolved: &FxHashSet<JsWord>,
    ) -> AHashMap<Id, JsWord> {
        let mut map = Default::default();

        self.scope.prepare_renaming();

        let mut preserved_symbols = preserved
            .iter()
            .cloned()
            .map(|v| v.0)
            .collect::<FxHashSet<_>>();
        preserved_symbols.extend(unresolved.iter().cloned());

        let cost = self.scope.rename_cost();

        self.scope.rename(
            &mut map,
            &Default::default(),
            &Default::default(),
            preserved,
            &preserved_symbols,
            cost > 1024,
        );

        map
    }

    fn add_decl(&mut self, id: Id) {
        #[cfg(feature = "debug")]
        {
            trace!("add_decl({:?})", id);
        }
        self.scope.add_decl(&id);
    }

    fn add_usage(&mut self, id: Id) {
        #[cfg(feature = "debug")]
        {
            trace!("add_usage({:?})", id);
        }
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
