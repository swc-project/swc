use crate::ext::MapWithMut;
use fxhash::FxHashMap;
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

/// This pass is kind of inliner, but it's far faster.
pub fn constant_propagation() -> impl 'static + Fold {
    as_folder(ConstPropagation::default())
}

#[derive(Default)]
struct ConstPropagation<'a> {
    scope: Scope<'a>,
}
#[derive(Default)]
struct Scope<'a> {
    parent: Option<&'a Scope<'a>>,
    /// Stores only inlinable constant variables.
    vars: FxHashMap<Id, Box<Expr>>,
}

impl Scope<'_> {
    fn find_var(&self, id: &Id) -> Option<&Box<Expr>> {
        if let Some(v) = self.vars.get(id) {
            return Some(v);
        }

        self.parent.and_then(|parent| parent.find_var(id))
    }
}

impl VisitMut for ConstPropagation<'_> {
    noop_visit_mut_type!();

    fn visit_mut_var_decl(&mut self, var: &mut VarDecl) {
        var.decls.visit_mut_with(self);

        if let VarDeclKind::Const = var.kind {
            for decl in &var.decls {
                match &decl.name {
                    Pat::Ident(name) => match &decl.init {
                        Some(init) => match &**init {
                            Expr::Lit(Lit::Bool(..))
                            | Expr::Lit(Lit::Num(..))
                            | Expr::Lit(Lit::Null(..))
                            | Expr::Ident(..) => {
                                self.scope.vars.insert(name.to_id(), init.clone());
                            }
                            _ => {}
                        },
                        None => {}
                    },
                    _ => {}
                }
            }
        }
    }

    fn visit_mut_prop(&mut self, p: &mut Prop) {
        p.visit_mut_children_with(self);

        match p {
            Prop::Shorthand(i) => {
                if let Some(expr) = self.scope.find_var(&i.to_id()) {
                    *p = Prop::KeyValue(KeyValueProp {
                        key: PropName::Ident(i.take()),
                        value: expr.clone(),
                    });
                    return;
                }
            }
            _ => {}
        }
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        match e {
            Expr::Ident(i) => {
                if let Some(expr) = self.scope.find_var(&i.to_id()) {
                    *e = *expr.clone();
                    return;
                }
            }
            _ => {}
        }

        e.visit_mut_children_with(self);
    }

    fn visit_mut_member_expr(&mut self, e: &mut MemberExpr) {
        e.obj.visit_mut_with(self);

        if e.computed {
            e.prop.visit_mut_with(self);
        }
    }
}
