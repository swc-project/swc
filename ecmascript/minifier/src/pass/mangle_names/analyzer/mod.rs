use self::scope::Scope;
use swc_atoms::JsWord;
use swc_common::collections::{AHashMap, AHashSet};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id};
use swc_ecma_visit::{noop_visit_type, Node, Visit, VisitWith};

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

    fn visit_arrow_expr(&mut self, e: &ArrowExpr, _: &dyn Node) {
        self.with_scope(|v| {
            let old = v.is_pat_decl;
            v.is_pat_decl = true;
            e.params.visit_with(e, v);
            v.is_pat_decl = false;
            e.body.visit_with(e, v);
            v.is_pat_decl = old;
        });
    }

    fn visit_assign_pat_prop(&mut self, p: &AssignPatProp, _: &dyn Node) {
        p.visit_children_with(self);

        if self.is_pat_decl {
            self.add_decl(p.key.to_id())
        } else {
            self.add_usage(p.key.to_id())
        }
    }

    fn visit_catch_clause(&mut self, n: &CatchClause, _: &dyn Node) {
        let old = self.is_pat_decl;

        self.is_pat_decl = true;
        n.param.visit_with(n, self);

        self.is_pat_decl = false;
        n.body.visit_with(n, self);

        self.is_pat_decl = old;
    }

    fn visit_class_decl(&mut self, c: &ClassDecl, _: &dyn Node) {
        self.add_decl(c.ident.to_id());

        c.class.visit_with(c, self);
    }

    fn visit_export_named_specifier(&mut self, n: &ExportNamedSpecifier, _: &dyn Node) {
        self.add_usage(n.orig.to_id());
    }

    fn visit_expr(&mut self, e: &Expr, _: &dyn Node) {
        e.visit_children_with(self);

        match e {
            Expr::Ident(i) => self.add_usage(i.to_id()),
            _ => {}
        }
    }

    fn visit_fn_decl(&mut self, f: &FnDecl, _: &dyn Node) {
        self.add_decl(f.ident.to_id());

        self.with_scope(|v| {
            f.function.visit_with(f, v);
        })
    }

    fn visit_fn_expr(&mut self, f: &FnExpr, _: &dyn Node) {
        self.with_scope(|v| {
            if let Some(id) = &f.ident {
                v.add_decl(id.to_id());
            }

            f.function.visit_with(f, v);
        })
    }

    fn visit_import_default_specifier(&mut self, n: &ImportDefaultSpecifier, _: &dyn Node) {
        self.add_decl(n.local.to_id());
    }

    fn visit_import_named_specifier(&mut self, n: &ImportNamedSpecifier, _: &dyn Node) {
        self.add_decl(n.local.to_id());
    }

    fn visit_import_star_as_specifier(&mut self, n: &ImportStarAsSpecifier, _: &dyn Node) {
        self.add_decl(n.local.to_id());
    }

    fn visit_member_expr(&mut self, e: &MemberExpr, _: &dyn Node) {
        e.obj.visit_with(e, self);

        if e.computed {
            e.prop.visit_with(e, self);
        }
    }

    fn visit_method_prop(&mut self, f: &MethodProp, _: &dyn Node) {
        f.key.visit_with(f, self);

        self.with_scope(|v| {
            f.function.visit_with(f, v);
        })
    }

    fn visit_named_export(&mut self, n: &NamedExport, _: &dyn Node) {
        if n.src.is_some() {
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_param(&mut self, e: &Param, _: &dyn Node) {
        let old = self.is_pat_decl;

        self.is_pat_decl = false;
        e.decorators.visit_with(e, self);

        self.is_pat_decl = true;
        e.pat.visit_with(e, self);

        self.is_pat_decl = old;
    }

    fn visit_pat(&mut self, e: &Pat, _: &dyn Node) {
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

    fn visit_prop(&mut self, p: &Prop, _: &dyn Node) {
        p.visit_children_with(self);

        match p {
            Prop::Shorthand(i) => self.add_usage(i.to_id()),
            _ => {}
        }
    }

    fn visit_var_declarator(&mut self, v: &VarDeclarator, _: &dyn Node) {
        let old = self.is_pat_decl;

        self.is_pat_decl = true;
        v.name.visit_with(v, self);

        self.is_pat_decl = false;
        v.init.visit_with(v, self);

        self.is_pat_decl = old;
    }
}
