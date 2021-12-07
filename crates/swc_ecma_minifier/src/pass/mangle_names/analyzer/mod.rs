use self::scope::Scope;
use swc_atoms::JsWord;
use swc_common::collections::{AHashMap, AHashSet};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id};
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

mod scope;

pub(super) struct Analyzer {
    pub scope: Scope,

    pub is_pat_decl: bool,
}

impl Analyzer {
    pub(super) fn into_rename_map(mut self, preserved: &AHashSet<Id>) -> AHashMap<Id, JsWord> {
        let mut map = AHashMap::default();

        let preserved_symbols = preserved.iter().cloned().map(|v| v.0).collect();
        self.scope.rename(&mut map, preserved, &preserved_symbols);

        map
    }

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

    fn visit_export_named_specifier(&mut self, n: &ExportNamedSpecifier) {
        self.add_usage(n.orig.to_id());
    }

    fn visit_expr(&mut self, e: &Expr) {
        e.visit_children_with(self);

        match e {
            Expr::Ident(i) => self.add_usage(i.to_id()),
            _ => {}
        }
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

        if e.computed {
            e.prop.visit_with(self);
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

        match e {
            Pat::Ident(i) => {
                if self.is_pat_decl {
                    self.add_decl(i.to_id())
                } else {
                    self.add_usage(i.to_id())
                }
            }
            _ => {}
        }
    }

    fn visit_prop(&mut self, p: &Prop) {
        p.visit_children_with(self);

        match p {
            Prop::Shorthand(i) => self.add_usage(i.to_id()),
            _ => {}
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
