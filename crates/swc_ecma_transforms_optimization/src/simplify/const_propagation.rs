#![allow(clippy::borrowed_box)]

use swc_common::{collections::AHashMap, util::take::Take};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

/// This pass is kind of inliner, but it's far faster.
pub fn constant_propagation() -> impl 'static + Pass + VisitMut {
    visit_mut_pass(ConstPropagation::default())
}

#[derive(Default)]
struct ConstPropagation<'a> {
    scope: Scope<'a>,
}
#[derive(Default)]
struct Scope<'a> {
    parent: Option<&'a Scope<'a>>,
    /// Stores only inlinable constant variables.
    vars: AHashMap<Id, Box<Expr>>,
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
    noop_visit_mut_type!(fail);

    /// No-op
    fn visit_mut_assign_expr(&mut self, _: &mut AssignExpr) {}

    fn visit_mut_export_named_specifier(&mut self, n: &mut ExportNamedSpecifier) {
        let id = match &n.orig {
            ModuleExportName::Ident(ident) => ident.to_id(),
            ModuleExportName::Str(..) => return,
        };
        if let Some(expr) = self.scope.find_var(&id) {
            if let Expr::Ident(v) = &**expr {
                let orig = n.orig.clone();
                n.orig = ModuleExportName::Ident(v.clone());

                if n.exported.is_none() {
                    n.exported = Some(orig);
                }
            }
        }

        match &n.exported {
            Some(ModuleExportName::Ident(exported)) => match &n.orig {
                ModuleExportName::Ident(orig) => {
                    if exported.sym == orig.sym && exported.ctxt == orig.ctxt {
                        n.exported = None;
                    }
                }
                ModuleExportName::Str(..) => {}
            },
            Some(ModuleExportName::Str(..)) => {}
            None => {}
        }
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        if let Expr::Ident(i) = e {
            if let Some(expr) = self.scope.find_var(&i.to_id()) {
                *e = *expr.clone();
                return;
            }
        }

        e.visit_mut_children_with(self);
    }

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

    fn visit_mut_prop(&mut self, p: &mut Prop) {
        p.visit_mut_children_with(self);

        if let Prop::Shorthand(i) = p {
            if let Some(expr) = self.scope.find_var(&i.to_id()) {
                *p = Prop::KeyValue(KeyValueProp {
                    key: PropName::Ident(i.take().into()),
                    value: expr.clone(),
                });
            }
        }
    }

    fn visit_mut_var_decl(&mut self, var: &mut VarDecl) {
        var.decls.visit_mut_with(self);

        if let VarDeclKind::Const = var.kind {
            for decl in &var.decls {
                if let Pat::Ident(name) = &decl.name {
                    if let Some(init) = &decl.init {
                        match &**init {
                            Expr::Lit(Lit::Bool(..))
                            | Expr::Lit(Lit::Num(..))
                            | Expr::Lit(Lit::Null(..)) => {
                                self.scope.vars.insert(name.to_id(), init.clone());
                            }

                            Expr::Ident(init)
                                if name.span.is_dummy()
                                    || var.span.is_dummy()
                                    || init.span.is_dummy() =>
                            {
                                // This check is required to prevent breaking some codes.
                                if let Some(value) = self.scope.vars.get(&init.to_id()).cloned() {
                                    self.scope.vars.insert(name.to_id(), value);
                                } else {
                                    self.scope.vars.insert(name.to_id(), init.clone().into());
                                }
                            }
                            _ => {}
                        }
                    }
                }
            }
        }
    }
}
