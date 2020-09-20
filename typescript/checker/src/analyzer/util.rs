use super::Analyzer;
use crate::{analyzer::generic::is_literals, ty, ty::Type};
use std::iter::once;
use swc_ecma_ast::*;
use swc_ecma_visit::Node;
use swc_ts_types::{FoldWith, Id};

#[derive(Debug, Default)]
pub(super) struct Generalizer {
    pub force: bool,
}

impl ty::Fold for Generalizer {
    #[inline(always)]
    fn fold_function(&mut self, node: ty::Function) -> ty::Function {
        node
    }

    fn fold_type(&mut self, mut node: Type) -> Type {
        if !self.force {
            if is_literals(&node) {
                return node;
            }
        }

        let force = match node {
            Type::TypeLit(..) => true,
            _ => false,
        };

        let old = self.force;
        self.force = force;
        node = node.fold_children_with(self);
        self.force = old;

        node.generalize_lit().into_owned()
    }
}

impl Analyzer<'_, '_> {
    //    /// Validates and store errors if required.
    //    pub fn check<T, O>(&mut self, node: &T) -> Option<O>
    //    where
    //        Self: Validate<T, Output = Result<O, Error>>,
    //    {
    //        let res: Result<O, _> = self.validate(node);
    //        match res {
    //            Ok(v) => Some(v),
    //            Err(err) => {
    //                self.info.errors.push(err);
    //                None
    //            }
    //        }
    //    }
}

pub trait ResultExt<T, E>: Into<Result<T, E>> {
    fn store<V>(self, to: &mut V) -> Option<T>
    where
        V: Extend<E>,
    {
        match self.into() {
            Ok(val) => Some(val),
            Err(e) => {
                to.extend(once(e));
                None
            }
        }
    }
}

impl<T, E> ResultExt<T, E> for Result<T, E> {}

/// Simple utility to check (l, r) and (r, l) with same code.
#[derive(Debug, Clone, Copy)]
pub(super) struct Comparator<T>
where
    T: Copy,
{
    pub left: T,
    pub right: T,
}

impl<T> Comparator<T>
where
    T: Copy,
{
    /// TODO: Rename to take_if_any
    pub fn take<F, R>(&self, mut op: F) -> Option<R>
    where
        F: FnMut(T, T) -> Option<R>,
    {
        op(self.left, self.right).or_else(|| op(self.right, self.left))
    }

    pub fn both<F>(&self, mut op: F) -> bool
    where
        F: FnMut(T) -> bool,
    {
        op(self.left) && op(self.right)
    }

    pub fn any<F>(&self, mut op: F) -> bool
    where
        F: FnMut(T) -> bool,
    {
        op(self.left) || op(self.right)
    }
}

pub(super) fn is_prop_name_eq(l: &PropName, r: &PropName) -> bool {
    macro_rules! check {
        ($l:expr, $r:expr) => {{
            let l = $l;
            let r = $r;

            match l {
                PropName::Ident(Ident { ref sym, .. })
                | PropName::Str(Str { value: ref sym, .. }) => match *r {
                    PropName::Ident(Ident { sym: ref r_sym, .. })
                    | PropName::Str(Str {
                        value: ref r_sym, ..
                    }) => return sym == r_sym,
                    PropName::Num(n) => return sym == &*n.value.to_string(),
                    _ => return false,
                },
                PropName::Computed(..) => return false,
                _ => {}
            }
        }};
    }

    check!(l, r);
    check!(r, l);

    false
}

pub(super) struct VarVisitor<'a> {
    pub names: &'a mut Vec<Id>,
}

impl swc_ecma_visit::Visit for VarVisitor<'_> {
    fn visit_expr(&mut self, _: &Expr, _: &dyn Node) {}

    fn visit_ident(&mut self, i: &Ident, _: &dyn Node) {
        self.names.push(i.into())
    }
}
