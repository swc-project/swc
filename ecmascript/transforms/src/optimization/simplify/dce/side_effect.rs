use fxhash::FxHashSet;
use swc_common::{Visit, VisitWith};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id};

pub(super) fn may_have_side_effects_to<T>(
    node: &T,
    included: &FxHashSet<Id>,
    exports: Option<&[Id]>,
) -> bool
where
    T: for<'any> VisitWith<Visitor<'any>>,
{
    let mut v = Visitor {
        included,
        exports,
        found: false,
    };

    node.visit_with(&mut v);

    v.found
}

pub(super) struct Visitor<'a> {
    included: &'a FxHashSet<Id>,
    exports: Option<&'a [Id]>,
    found: bool,
}

impl Visit<AssignExpr> for Visitor<'_> {
    fn visit(&mut self, node: &AssignExpr) {
        unimplemented!()
    }
}

impl Visit<MemberExpr> for Visitor<'_> {
    fn visit(&mut self, node: &MemberExpr) {
        node.obj.visit_with(self);
        if node.computed {
            node.prop.visit_with(self);
        }
    }
}

impl Visit<Expr> for Visitor<'_> {
    fn visit(&mut self, node: &Expr) {
        unimplemented!()
    }
}

impl Visit<Ident> for Visitor<'_> {
    fn visit(&mut self, node: &Ident) {
        if self.found {
            return;
        }

        if self.included_ids.contains(&node.to_id()) {
            self.found = true;
            return;
        }

        if let Some(exported_ids) = self.exported_ids.as_ref() {
            if exported_ids.iter().any(|exported| exported.0 == node.sym) {
                self.found = true;
                return;
            }
        }
    }
}
