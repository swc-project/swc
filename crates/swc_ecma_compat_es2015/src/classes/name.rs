use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::private_ident;
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, Visit, VisitMut, VisitMutWith, VisitWith,
};

mod analysis;
pub(super) use analysis::prepare;

/// Keep an anonymous class assignment's inferred name when its methods refer
/// to the assignment binding. A separate function-expression name scope lets
/// hygiene rename the IIFE's constructor variable without renaming the
/// function.
pub(super) fn preserve_assignment_name(stmts: &mut [Stmt]) {
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
    constructor.function.visit_mut_with(&mut ConstructorName {
        old: constructor.ident.to_id(),
        new: &name,
    });
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

    // Original nested class bodies were checked by the shared analysis. Super
    // lowering can still insert outer-constructor references into their keys.
    fn visit_class(&mut self, class: &Class) {
        class.super_class.visit_with(self);
        class.decorators.visit_with(self);
        for member in &class.body {
            match member {
                ClassMember::Method(member) => member.key.visit_with(self),
                ClassMember::PrivateMethod(member) => member.key.visit_with(self),
                ClassMember::ClassProp(member) => member.key.visit_with(self),
                ClassMember::PrivateProp(member) => member.key.visit_with(self),
                _ => {}
            }
        }
    }

    fn visit_ident(&mut self, ident: &Ident) {
        if ident.sym == "eval" || (ident.sym == self.name.sym && ident.ctxt != self.name.ctxt) {
            self.has_conflict = true;
        }
    }
}

struct ConstructorName<'a> {
    old: Id,
    new: &'a Ident,
}

impl VisitMut for ConstructorName<'_> {
    noop_visit_mut_type!();

    fn visit_mut_class(&mut self, class: &mut Class) {
        class.super_class.visit_mut_with(self);
        class.decorators.visit_mut_with(self);
        for member in &mut class.body {
            match member {
                ClassMember::Method(member) => member.key.visit_mut_with(self),
                ClassMember::PrivateMethod(member) => member.key.visit_mut_with(self),
                ClassMember::ClassProp(member) => member.key.visit_mut_with(self),
                ClassMember::PrivateProp(member) => member.key.visit_mut_with(self),
                _ => {}
            }
        }
    }

    fn visit_mut_ident(&mut self, ident: &mut Ident) {
        if ident.to_id() == self.old {
            ident.sym = self.new.sym.clone();
            ident.ctxt = self.new.ctxt;
        }
    }
}
