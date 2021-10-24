use self::scope::Scope;
use swc_atoms::JsWord;
use swc_common::collections::AHashMap;
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id};
use swc_ecma_visit::{noop_visit_type, Node, Visit, VisitWith};

mod scope;

pub(super) struct Analyzer {
    pub scope: Scope,

    pub is_pat_decl: bool,
}

impl Analyzer {
    pub(super) fn into_rename_map(mut self) -> AHashMap<Id, JsWord> {
        let mut map = AHashMap::default();

        self.scope.rename(&mut map);

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

    fn visit_member_expr(&mut self, e: &MemberExpr, _: &dyn Node) {
        e.obj.visit_with(e, self);

        if e.computed {
            e.prop.visit_with(e, self);
        }
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

    fn visit_var_declarator(&mut self, v: &VarDeclarator, _: &dyn Node) {
        let old = self.is_pat_decl;

        self.is_pat_decl = true;
        v.name.visit_with(v, self);

        self.is_pat_decl = false;
        v.init.visit_with(v, self);

        self.is_pat_decl = old;
    }
}
