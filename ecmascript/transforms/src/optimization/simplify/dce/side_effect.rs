use super::Dce;
use fxhash::FxHashSet;
use swc_common::{Visit, VisitWith};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, ExprExt, Id};

impl Dce<'_> {
    pub fn should_include<T>(&self, node: &T) -> bool
    where
        T: for<'any> VisitWith<Visitor<'any>>,
    {
        let mut v = Visitor {
            included: &self.included,
            exports: self.config.used.as_ref().map(|v| &**v),
            found: false,
        };

        node.visit_with(&mut v);

        v.found
    }
}

pub(super) struct Visitor<'a> {
    included: &'a FxHashSet<Id>,
    exports: Option<&'a [Id]>,
    found: bool,
}

impl Visitor<'_> {
    fn include(&self, i: &Ident) -> bool {
        let id = i.to_id();
        if self.included.contains(&id) {
            return true;
        }

        if let Some(exports) = self.exports {
            if exports.contains(&id) {
                return true;
            }
        }

        false
    }
}

impl Visit<Expr> for Visitor<'_> {
    fn visit(&mut self, node: &Expr) {
        log::debug!("Visit<Expr>");

        if self.found || node.is_pure_callee() {
            return;
        }

        match node {
            Expr::Lit(..) | Expr::PrivateName(..) | Expr::TsConstAssertion(..) => return,

            _ => {}
        }

        node.visit_children(self)
    }
}

impl Visit<AssignExpr> for Visitor<'_> {
    fn visit(&mut self, node: &AssignExpr) {
        if self.found {
            return;
        }

        node.left.visit_with(self);

        match &*node.right {
            Expr::Ident(..) => {
                //TODO: Check for alias
            }
            right => right.visit_with(self),
        }
    }
}

impl Visit<MemberExpr> for Visitor<'_> {
    fn visit(&mut self, node: &MemberExpr) {
        if self.found {
            return;
        }

        node.obj.visit_with(self);
        if node.computed {
            node.prop.visit_with(self);
        }
    }
}

impl Visit<Ident> for Visitor<'_> {
    fn visit(&mut self, node: &Ident) {
        if self.found {
            return;
        }

        self.found |= self.include(node);
    }
}

impl Visit<CallExpr> for Visitor<'_> {
    fn visit(&mut self, node: &CallExpr) {
        if self.found {
            return;
        }

        match node.callee {
            ExprOrSuper::Expr(ref e) if e.is_pure_callee() => return,
            _ => {}
        }

        self.found = true;
    }
}

impl Visit<NewExpr> for Visitor<'_> {
    fn visit(&mut self, node: &NewExpr) {
        if self.found {
            return;
        }

        self.found = true;
    }
}
