use crate::util::{ident::IdentLike, Id};
use swc_common::{Visit, VisitWith};
use swc_ecma_ast::*;

/// Finds all variables declared as `var` of a function (before full analysis)
pub(super) fn find_vars<T>(f: &T) -> Vec<Id>
where
    T: for<'any> VisitWith<Hoister<'any>>,
{
    let mut vars = vec![];
    let mut v = Hoister { vars: &mut vars };
    f.visit_children(&mut v);

    vars
}

pub(super) struct Hoister<'a> {
    vars: &'a mut Vec<Id>,
}

/// Don't recurse into function
impl Visit<Function> for Hoister<'_> {
    fn visit(&mut self, _: &Function) {}
}

impl Visit<Pat> for Hoister<'_> {
    fn visit(&mut self, p: &Pat) {
        match *p {
            Pat::Ident(ref i) => self.vars.push(i.to_id()),
            _ => p.visit_children(self),
        }
    }
}

impl Visit<VarDecl> for Hoister<'_> {
    fn visit(&mut self, v: &VarDecl) {
        for d in &v.decls {
            if v.kind == VarDeclKind::Var {
                d.name.visit_with(self);
            }

            d.init.visit_with(self);
        }
    }
}

/// no-op, as vars are handled from `Visit<VarDecl>`.
impl Visit<VarDeclarator> for Hoister<'_> {
    fn visit(&mut self, _: &VarDeclarator) {
        unreachable!("Hoister: Visit<VarDeclarator>")
    }
}
