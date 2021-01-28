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
    fn handle_binding_ident(&mut self, i: &mut Ident) {}
}

impl VisitMut for Optimizer<'_> {
    noop_visit_mut_type!();

    fn visit_mut_function(&mut self, n: &mut Function) {
        n.visit_mut_children_with(self);
    }

    fn visit_mut_fn_decl(&mut self, n: &mut FnDecl) {
        self.handle_binding_ident(&mut n.ident);
    }
}
