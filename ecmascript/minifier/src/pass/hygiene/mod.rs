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
        pat_mode: PatMode::Asssignment,
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum PatMode {
    VarDecl,
    Param,
    Asssignment,
    OtherDecl,
}

impl PatMode {
    /// Returns true if a pattern handle should create a new variable.
    pub fn is_decl(self) -> bool {
        match self {
            PatMode::VarDecl | PatMode::Param | PatMode::OtherDecl => true,
            PatMode::Asssignment => false,
        }
    }
}

struct Optimizer<'a> {
    scope: Scope<'a>,
    pat_mode: PatMode,
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
            pat_mode: self.pat_mode,
        };

        let ret = op(&mut child);

        ret
    }

    /// Registers a binding ident. This is treated as [PatMode::OtherDecl].
    ///
    /// If it conflicts
    fn register_binding_ident(&mut self, i: &mut Ident) {}
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

    fn visit_mut_block_stmt(&mut self, n: &mut BlockStmt) {
        self.with_scope(false, |child| {
            n.visit_mut_children_with(child);
        })
    }

    fn visit_mut_fn_decl(&mut self, n: &mut FnDecl) {
        self.register_binding_ident(&mut n.ident);
        n.function.visit_mut_with(self);
    }

    fn visit_mut_class_decl(&mut self, n: &mut ClassDecl) {
        self.register_binding_ident(&mut n.ident);
        n.class.visit_mut_with(self);
    }
}
