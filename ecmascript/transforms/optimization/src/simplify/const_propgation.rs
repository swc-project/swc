use fxhash::FxHashMap;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
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

impl<'a> Scope<'a> {
    fn new(parent: &'a Scope<'a>) -> Self {
        Self {
            parent: Some(parent),
            vars: Default::default(),
        }
    }

    fn find_var(&self, id: &Id) -> Option<&Box<Expr>> {
        if let Some(v) = self.vars.get(id) {
            return Some(v);
        }

        self.parent.and_then(|parent| parent.find_var(id))
    }
}

impl VisitMut for ConstPropagation<'_> {
    noop_visit_mut_type!();

    /// Although span hygiene is magic, bundler creates invalid code in aspect
    /// of span hygiene. (The bundled code can have two variables with
    /// identical name with each other, with respect to span hygiene.)
    ///
    /// We avoid bugs caused by the bundler's wrong behavior by
    /// scoping variables.
    fn visit_mut_function(&mut self, n: &mut Function) {
        let scope = Scope::new(&self.scope);
        let mut v = ConstPropagation { scope };
        n.visit_mut_children_with(&mut v);
    }

    fn visit_mut_var_decl(&mut self, var: &mut VarDecl) {
        var.decls.visit_mut_with(self);

        if let VarDeclKind::Const = var.kind {
            for decl in &var.decls {
                match &decl.name {
                    Pat::Ident(name) => match &decl.init {
                        Some(init) => match &**init {
                            Expr::Lit(Lit::Bool(..))
                            | Expr::Lit(Lit::Num(..))
                            | Expr::Lit(Lit::Null(..)) => {
                                self.scope.vars.insert(name.to_id(), init.clone());
                            }

                            Expr::Ident(init)
                                if name.id.span.is_dummy()
                                    || var.span.is_dummy()
                                    || init.span.is_dummy() =>
                            {
                                // This check is required to prevent breaking some codes.
                                if let Some(value) = self.scope.vars.get(&init.to_id()).cloned() {
                                    self.scope.vars.insert(name.to_id(), value);
                                } else {
                                    self.scope
                                        .vars
                                        .insert(name.to_id(), Box::new(Expr::Ident(init.clone())));
                                }
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

    /// No-op
    fn visit_mut_assign_expr(&mut self, _: &mut AssignExpr) {}

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

    fn visit_mut_export_named_specifier(&mut self, n: &mut ExportNamedSpecifier) {
        if let Some(expr) = self.scope.find_var(&n.orig.to_id()) {
            match &**expr {
                Expr::Ident(v) => {
                    let orig = n.orig.clone();
                    n.orig = v.clone();

                    if n.exported.is_none() {
                        n.exported = Some(orig);
                    }
                }
                _ => {}
            }
        }

        match &n.exported {
            Some(exported) => {
                if exported.sym == n.orig.sym && exported.span.ctxt == n.orig.span.ctxt {
                    n.exported = None;
                }
            }
            None => {}
        }
    }
}
