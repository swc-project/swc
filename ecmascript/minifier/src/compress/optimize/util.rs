use crate::mode::Mode;

use super::{Ctx, Optimizer};
use std::ops::{Deref, DerefMut};
use swc_atoms::JsWord;
use swc_common::Span;
use swc_ecma_ast::*;
use swc_ecma_utils::{prop_name_eq, ExprExt, Id};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

impl<'b, M> Optimizer<'b, M>
where
    M: Mode,
{
    pub(super) fn access_property<'e>(
        &mut self,
        expr: &'e mut Expr,
        prop: &JsWord,
    ) -> Option<&'e mut Expr> {
        match expr {
            Expr::Object(obj) => {
                for obj_prop in obj.props.iter_mut() {
                    match obj_prop {
                        PropOrSpread::Spread(_) => {}
                        PropOrSpread::Prop(p) => match &mut **p {
                            Prop::Shorthand(_) => {}
                            Prop::KeyValue(p) => {
                                if prop_name_eq(&p.key, &prop) {
                                    return Some(&mut *p.value);
                                }
                            }
                            Prop::Assign(_) => {}
                            Prop::Getter(_) => {}
                            Prop::Setter(_) => {}
                            Prop::Method(_) => {}
                        },
                    }
                }
            }
            _ => {}
        }

        None
    }

    pub(super) fn access_property_with_prop_name<'e>(
        &mut self,
        expr: &'e mut Expr,
        prop: &PropName,
    ) -> Option<&'e mut Expr> {
        match prop {
            PropName::Ident(p) => self.access_property(expr, &p.sym),
            PropName::Str(p) => self.access_property(expr, &p.value),
            PropName::Num(p) => self.access_numeric_property(expr, p.value as _),
            PropName::Computed(_) => None,
            PropName::BigInt(_) => None,
        }
    }

    pub(super) fn access_numeric_property<'e>(
        &mut self,
        _expr: &'e mut Expr,
        _idx: usize,
    ) -> Option<&'e mut Expr> {
        None
    }

    /// Check for `/** @const */`.
    pub(super) fn has_const_ann(&self, span: Span) -> bool {
        span.has_mark(self.marks.const_ann)
    }

    /// Check for `/*#__NOINLINE__*/`
    pub(super) fn has_noinline(&self, span: Span) -> bool {
        span.has_mark(self.marks.noinline)
    }

    #[allow(unused)]
    pub(super) fn is_done(&mut self, span: Span) -> bool {
        span.has_mark(self.done)
    }

    /// RAII guard to change context temporarically
    #[inline]
    pub(super) fn with_ctx(&mut self, ctx: Ctx) -> WithCtx<'_, 'b, M> {
        let orig_ctx = self.ctx;
        self.ctx = ctx;
        WithCtx {
            reducer: self,
            orig_ctx,
        }
    }
}

pub(super) struct WithCtx<'a, 'b, M> {
    reducer: &'a mut Optimizer<'b, M>,
    orig_ctx: Ctx,
}

impl<'b, M> Deref for WithCtx<'_, 'b, M> {
    type Target = Optimizer<'b, M>;

    fn deref(&self) -> &Self::Target {
        &self.reducer
    }
}

impl<M> DerefMut for WithCtx<'_, '_, M> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        self.reducer
    }
}

impl<M> Drop for WithCtx<'_, '_, M> {
    fn drop(&mut self) {
        self.reducer.ctx = self.orig_ctx;
    }
}

pub(crate) fn class_has_side_effect(c: &Class) -> bool {
    if let Some(e) = &c.super_class {
        if e.may_have_side_effects() {
            return true;
        }
    }

    for m in &c.body {
        match m {
            ClassMember::Method(p) => {
                if let PropName::Computed(key) = &p.key {
                    if key.expr.may_have_side_effects() {
                        return true;
                    }
                }
            }

            ClassMember::ClassProp(p) => {
                if p.computed {
                    if p.key.may_have_side_effects() {
                        return true;
                    }
                }

                if let Some(v) = &p.value {
                    if v.may_have_side_effects() {
                        return true;
                    }
                }
            }
            ClassMember::PrivateProp(p) => {
                if let Some(v) = &p.value {
                    if v.may_have_side_effects() {
                        return true;
                    }
                }
            }

            _ => {}
        }
    }

    false
}

pub(crate) fn is_valid_for_lhs(e: &Expr) -> bool {
    match e {
        Expr::Lit(..) => return false,
        Expr::Unary(..) => return false,
        _ => true,
    }
}

pub(crate) fn replace_id_with_expr<N>(node: &mut N, from: Id, to: Box<Expr>)
where
    N: VisitMutWith<ExprReplacer>,
{
    node.visit_mut_with(&mut ExprReplacer { from, to: Some(to) })
}

pub(crate) struct ExprReplacer {
    from: Id,
    to: Option<Box<Expr>>,
}

impl VisitMut for ExprReplacer {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        match e {
            Expr::Ident(i) => {
                if self.from.0 == i.sym && self.from.1 == i.span.ctxt {
                    if let Some(new) = self.to.take() {
                        *e = *new;
                    }
                }
            }
            _ => {}
        }
    }
}
