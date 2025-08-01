use swc_ecma_ast::*;
use swc_ecma_visit::{Visit, VisitWith};

use crate::ident::IdentLike;

/// Finds all **binding** idents of `node`.
///
/// If you want to avoid allocation, use [`for_each_binding_ident`] instead.
pub fn find_pat_ids<T, I: IdentLike>(node: &T) -> Vec<I>
where
    T: VisitWith<DestructuringFinder<I>>,
{
    let mut v = DestructuringFinder { found: Vec::new() };
    node.visit_with(&mut v);

    v.found
}

pub fn find_pat_ids_with_idx<'a, T: VisitWith<DestructuringFinderWithIdx<'a>>>(
    node: &T,
    id_map: &'a mut Ids,
) -> Vec<IdIdx> {
    let mut v = DestructuringFinderWithIdx {
        found: Vec::new(),
        id_map,
    };
    node.visit_with(&mut v);
    v.found
}

/// Finds all **binding** idents of variables.
pub struct DestructuringFinderWithIdx<'a> {
    id_map: &'a mut Ids,
    found: Vec<IdIdx>,
}

impl Visit for DestructuringFinderWithIdx<'_> {
    /// No-op (we don't care about expressions)
    fn visit_expr(&mut self, _: &Expr) {}

    fn visit_ident(&mut self, i: &Ident) {
        let id = self.id_map.intern_ident(i);
        self.found.push(id);
    }

    fn visit_jsx_member_expr(&mut self, n: &JSXMemberExpr) {
        n.obj.visit_with(self);
    }

    /// No-op (we don't care about expressions)
    fn visit_prop_name(&mut self, _: &PropName) {}

    fn visit_ts_type(&mut self, _: &TsType) {}
}

/// Finds all **binding** idents of variables.
pub struct DestructuringFinder<I: IdentLike> {
    found: Vec<I>,
}

impl<I: IdentLike> Visit for DestructuringFinder<I> {
    /// No-op (we don't care about expressions)
    fn visit_expr(&mut self, _: &Expr) {}

    fn visit_ident(&mut self, i: &Ident) {
        self.found.push(I::from_ident(i));
    }

    fn visit_jsx_member_expr(&mut self, n: &JSXMemberExpr) {
        n.obj.visit_with(self);
    }

    /// No-op (we don't care about expressions)
    fn visit_prop_name(&mut self, _: &PropName) {}

    fn visit_ts_type(&mut self, _: &TsType) {}
}
