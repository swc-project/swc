use crate::option::MangleOptions;
use swc_common::{collections::AHashSet, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{find_ids, ident::IdentLike, Id};
use swc_ecma_visit::{noop_visit_type, Node, Visit, VisitWith};

pub(super) fn idents_to_preserve<N>(options: MangleOptions, n: &N) -> AHashSet<Id>
where
    N: VisitWith<Preserver>,
{
    let mut v = Preserver {
        options,
        preserved: Default::default(),
        should_preserve: false,
        in_top_level: false,
    };
    n.visit_with(&Invalid { span: DUMMY_SP }, &mut v);
    v.preserved
}
pub(super) struct Preserver {
    options: MangleOptions,
    preserved: AHashSet<Id>,
    should_preserve: bool,
    in_top_level: bool,
}

impl Visit for Preserver {
    noop_visit_type!();

    fn visit_catch_clause(&mut self, n: &CatchClause, _: &dyn Node) {
        let old = self.should_preserve;

        if self.options.ie8 && !self.options.top_level {
            self.should_preserve = true;
            n.param.visit_with(&Invalid { span: DUMMY_SP }, self);
        }

        self.should_preserve = old;
        n.body.visit_with(&Invalid { span: DUMMY_SP }, self);
    }

    fn visit_class_decl(&mut self, n: &ClassDecl, _: &dyn Node) {
        n.visit_children_with(self);

        if (self.in_top_level && !self.options.top_level) || self.options.keep_class_names {
            self.preserved.insert(n.ident.to_id());
        }
    }

    fn visit_export_decl(&mut self, n: &ExportDecl, _: &dyn Node) {
        n.visit_children_with(self);

        match &n.decl {
            Decl::Class(c) => {
                self.preserved.insert(c.ident.to_id());
            }
            Decl::Fn(f) => {
                self.preserved.insert(f.ident.to_id());
            }
            Decl::Var(v) => {
                let ids: Vec<Id> = find_ids(&v.decls);
                self.preserved.extend(ids);
            }
            _ => {}
        }
    }

    fn visit_expr(&mut self, n: &Expr, _: &dyn Node) {
        n.visit_children_with(self);

        match n {
            Expr::Ident(i) => {
                if self.should_preserve {
                    self.preserved.insert(i.to_id());
                }
            }
            _ => {}
        }
    }

    fn visit_fn_decl(&mut self, n: &FnDecl, _: &dyn Node) {
        n.visit_children_with(self);

        if (self.in_top_level && !self.options.top_level) || self.options.keep_fn_names {
            self.preserved.insert(n.ident.to_id());
        }
    }

    fn visit_fn_expr(&mut self, n: &FnExpr, _: &dyn Node) {
        n.visit_children_with(self);

        if self.options.keep_fn_names {
            if let Some(i) = &n.ident {
                self.preserved.insert(i.to_id());
            }
        }
    }

    fn visit_member_expr(&mut self, n: &MemberExpr, _: &dyn Node) {
        n.obj.visit_with(n, self);
        if n.computed {
            n.prop.visit_with(n, self);
        }
    }

    fn visit_module_items(&mut self, n: &[ModuleItem], _: &dyn Node) {
        for n in n {
            self.in_top_level = true;
            n.visit_with(&Invalid { span: DUMMY_SP }, self);
        }
    }

    fn visit_pat(&mut self, n: &Pat, _: &dyn Node) {
        n.visit_children_with(self);

        match n {
            Pat::Ident(i) => {
                if self.should_preserve {
                    self.preserved.insert(i.to_id());
                }
            }
            _ => {}
        }
    }

    fn visit_stmts(&mut self, n: &[Stmt], _: &dyn Node) {
        let old_top_level = self.in_top_level;
        for n in n {
            self.in_top_level = false;
            n.visit_with(&Invalid { span: DUMMY_SP }, self);
        }
        self.in_top_level = old_top_level;
    }

    fn visit_var_declarator(&mut self, n: &VarDeclarator, _: &dyn Node) {
        n.visit_children_with(self);

        if self.in_top_level && !self.options.top_level {
            let old = self.should_preserve;
            self.should_preserve = true;
            n.name.visit_with(n, self);
            self.should_preserve = old;
            return;
        }

        if self.options.keep_fn_names {
            match n.init.as_deref() {
                Some(Expr::Fn(..)) | Some(Expr::Arrow(..)) => {
                    let old = self.should_preserve;
                    self.should_preserve = true;
                    n.name.visit_with(n, self);
                    self.should_preserve = old;
                }
                _ => {}
            }
        }
    }
}
