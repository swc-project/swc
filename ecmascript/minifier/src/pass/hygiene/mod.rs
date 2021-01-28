use self::scope::Scope;
use swc_ecma_ast::*;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;

mod scope;

/// Create a hygiene optimizer.
///
/// Hygiene optimizer removes span hygiene without renaming if it's ok to do so.
pub fn hygiene_optimizer() -> impl 'static + VisitMut {
    Optimizer {
        scope: Scope::root(),
    }
}

struct Optimizer<'a> {
    scope: Scope<'a>,
}

impl Optimizer<'_> {
    /// `eats_var`: `true` if a scope eats variable declared with `var`.
    fn with_scope<F, Ret>(&mut self, eats_var: bool, op: F) -> Ret
    where
        F: FnOnce(&mut Optimizer) -> Ret,
    {
        //
        let mut child = Optimizer {
            scope: Scope::new(&self.scope),
        };

        let ret = op(&mut child);

        ret
    }

    /// Registers a binding ident.
    ///
    /// If it conflicts
    fn handle_binding_ident(&mut self, i: &mut Ident) {}
}

impl VisitMut for Optimizer<'_> {
    noop_visit_mut_type!();

    fn visit_mut_function(&mut self, n: &mut Function) {
        n.decorators.visit_mut_with(self);

        self.with_scope(true, |child| {
            n.params.visit_mut_with(child);

            match &mut n.body {
                Some(body) => {
                    // We use visit_mut_children_with instead of visit_mut_with to bypass block
                    // scope handler.
                    body.visit_mut_children_with(child);
                }
                _ => {}
            }
        })
    }

    fn visit_mut_fn_decl(&mut self, n: &mut FnDecl) {
        self.handle_binding_ident(&mut n.ident);
        n.function.visit_mut_with(self);
    }

    fn visit_mut_class_decl(&mut self, n: &mut ClassDecl) {
        self.handle_binding_ident(&mut n.ident);
        n.class.visit_mut_with(self);
    }
}
