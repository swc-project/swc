use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{contains_ident_ref, private_ident, replace_ident};
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

/// Keep an anonymous class assignment's inferred name when its methods refer
/// to the assignment binding. A separate function-expression name scope lets
/// hygiene rename the IIFE's constructor variable without renaming the
/// function.
pub(super) fn preserve_assignment_name(stmts: &mut [Stmt], binding: &Ident) {
    if !stmts.iter().any(|stmt| contains_ident_ref(stmt, binding)) {
        return;
    }
    let Some(stmt) = stmts
        .iter_mut()
        .find(|stmt| matches!(stmt, Stmt::Decl(Decl::Fn(_))))
    else {
        return;
    };
    let Stmt::Decl(Decl::Fn(constructor)) = stmt else {
        unreachable!();
    };
    // A new function-name binding must not shadow another constructor binding,
    // an outer reference, or a name looked up by eval in the constructor.
    let mut scope = ConstructorScope {
        name: &constructor.ident,
        has_conflict: false,
    };
    constructor.function.visit_with(&mut scope);
    if scope.has_conflict {
        return;
    }

    let mut constructor = constructor.take();
    let name = private_ident!(constructor.ident.sym.clone());
    replace_ident(&mut constructor.function, constructor.ident.to_id(), &name);
    *stmt = VarDecl {
        span: constructor.ident.span,
        kind: VarDeclKind::Var,
        decls: vec![VarDeclarator {
            span: DUMMY_SP,
            name: constructor.ident.into(),
            init: Some(
                FnExpr {
                    ident: Some(name),
                    function: constructor.function,
                }
                .into(),
            ),
            definite: false,
        }],
        ..Default::default()
    }
    .into();
}

struct ConstructorScope<'a> {
    name: &'a Ident,
    has_conflict: bool,
}

impl Visit for ConstructorScope<'_> {
    noop_visit_type!();

    fn visit_ident(&mut self, ident: &Ident) {
        if ident.sym == "eval" || (ident.sym == self.name.sym && ident.ctxt != self.name.ctxt) {
            self.has_conflict = true;
        }
    }
}
