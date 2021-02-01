use crate::option::MangleOptions;
use fxhash::FxHashSet;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_utils::Id;
use swc_ecma_visit::noop_visit_type;
use swc_ecma_visit::Node;
use swc_ecma_visit::Visit;
use swc_ecma_visit::VisitWith;

pub(super) fn idents_to_preserve<N>(options: MangleOptions, n: &N) -> FxHashSet<Id>
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
    preserved: FxHashSet<Id>,
    should_preserve: bool,
    in_top_level: bool,
}

impl Visit for Preserver {
    noop_visit_type!();

    fn visit_stmts(&mut self, n: &[Stmt], _: &dyn Node) {
        for n in n {
            self.in_top_level = false;
            n.visit_with(&Invalid { span: DUMMY_SP }, self);
        }
    }

    fn visit_module_items(&mut self, n: &[ModuleItem], _: &dyn Node) {
        for n in n {
            self.in_top_level = true;
            n.visit_with(&Invalid { span: DUMMY_SP }, self);
        }
    }

    fn visit_fn_decl(&mut self, n: &FnDecl, _: &dyn Node) {
        n.visit_children_with(self);

        if self.options.keep_fn_names {
            self.preserved.insert(n.ident.to_id());
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

    fn visit_var_declarator(&mut self, n: &VarDeclarator, _: &dyn Node) {
        n.visit_children_with(self);

        if self.options.keep_fn_names || (self.in_top_level && !self.options.top_level) {
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

    fn visit_member_expr(&mut self, n: &MemberExpr, _: &dyn Node) {
        n.obj.visit_with(n, self);
        if n.computed {
            n.prop.visit_with(n, self);
        }
    }
}
