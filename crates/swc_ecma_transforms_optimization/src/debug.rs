#![allow(unused)]

use std::{fmt::Debug, mem::forget};

use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

/// Assert in debug mode. This is noop in release build.
#[cfg_attr(not(debug_assertions), inline(always))]
pub fn debug_assert_valid<N>(node: &N)
where
    N: VisitWith<AssertValid>,
{
    #[cfg(debug_assertions)]
    node.visit_with(&mut AssertValid);
}

#[cfg(debug_assertions)]
struct Ctx<'a> {
    v: &'a dyn Debug,
}

#[cfg(debug_assertions)]
impl Drop for Ctx<'_> {
    fn drop(&mut self) {
        eprintln!("Context: {:?}", self.v);
    }
}

pub struct AssertValid;

impl Visit for AssertValid {
    noop_visit_type!(fail);

    #[cfg(debug_assertions)]
    fn visit_expr(&mut self, n: &Expr) {
        let ctx = Ctx { v: n };
        n.visit_children_with(self);
        forget(ctx);
    }

    #[cfg(debug_assertions)]
    fn visit_invalid(&mut self, _: &Invalid) {
        panic!("Invalid node found");
    }

    #[cfg(debug_assertions)]
    fn visit_number(&mut self, n: &Number) {
        assert!(!n.value.is_nan(), "NaN should be an identifier");
    }

    #[cfg(debug_assertions)]
    fn visit_setter_prop(&mut self, p: &SetterProp) {
        p.body.visit_with(self);
    }

    #[cfg(debug_assertions)]
    fn visit_stmt(&mut self, n: &Stmt) {
        let ctx = Ctx { v: n };
        n.visit_children_with(self);
        forget(ctx);
    }

    #[cfg(debug_assertions)]
    fn visit_tpl(&mut self, l: &Tpl) {
        l.visit_children_with(self);

        assert_eq!(l.exprs.len() + 1, l.quasis.len());
    }

    #[cfg(debug_assertions)]
    fn visit_var_declarators(&mut self, v: &[VarDeclarator]) {
        v.visit_children_with(self);

        if v.is_empty() {
            panic!("Found empty var declarators");
        }
    }

    #[cfg(debug_assertions)]
    fn visit_seq_expr(&mut self, v: &SeqExpr) {
        v.visit_children_with(self);

        // TODO(kdy1): Make parser does not create invalid sequential
        // expressions and uncomment this

        // assert!(
        //     v.exprs.len() >= 2,
        //     "SeqExpr(len = {}) is invalid",
        //     v.exprs.len()
        // );
    }
}
