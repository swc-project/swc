use crate::mode::Mode;

use super::{Ctx, Optimizer};
use std::ops::{Deref, DerefMut};
use swc_atoms::JsWord;
use swc_common::{collections::AHashMap, Span};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, prop_name_eq, ExprExt, Id};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};
use tracing::debug;

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

pub(crate) struct MultiReplacer {
    pub vars: AHashMap<Id, Box<Expr>>,
    pub changed: bool,
}

impl VisitMut for MultiReplacer {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        match e {
            Expr::Ident(i) => {
                if let Some(new) = self.vars.remove(&i.to_id()) {
                    debug!("multi-replacer: Replaced `{}`", i);
                    *e = *new;
                    self.changed = true;
                }
            }
            _ => {}
        }
    }

    fn visit_mut_member_expr(&mut self, e: &mut MemberExpr) {
        e.obj.visit_mut_with(self);

        if e.computed {
            e.prop.visit_mut_with(self);
        }
    }

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        loop {
            self.changed = false;
            if self.vars.is_empty() {
                break;
            }
            items.visit_mut_children_with(self);

            if !self.changed {
                if cfg!(feature = "debug") {
                    let keys = self.vars.iter().map(|(k, _)| k.clone()).collect::<Vec<_>>();
                    debug!("Dropping {:?}", keys);
                }
                break;
            }
        }
    }

    fn visit_mut_prop(&mut self, p: &mut Prop) {
        p.visit_mut_children_with(self);

        match p {
            Prop::Shorthand(i) => {
                if let Some(value) = self.vars.remove(&i.to_id()) {
                    debug!("multi-replacer: Replaced `{}` as shorthand", i);
                    self.changed = true;

                    *p = Prop::KeyValue(KeyValueProp {
                        key: PropName::Ident(i.clone()),
                        value,
                    });

                    return;
                }
            }
            _ => {}
        }
    }
}

pub(crate) fn replace_id_with_expr<N>(node: &mut N, from: Id, to: Box<Expr>) -> Option<Box<Expr>>
where
    N: VisitMutWith<ExprReplacer>,
{
    let mut v = ExprReplacer {
        from: from.clone(),
        to: Some(to),
    };
    node.visit_mut_with(&mut v);

    v.to
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
                    } else {
                        unreachable!("`{}` is already taken", i)
                    }
                }
            }
            _ => {}
        }
    }

    fn visit_mut_member_expr(&mut self, e: &mut MemberExpr) {
        e.obj.visit_mut_with(self);

        if e.computed {
            e.prop.visit_mut_with(self);
        }
    }

    fn visit_mut_prop(&mut self, p: &mut Prop) {
        p.visit_mut_children_with(self);

        match p {
            Prop::Shorthand(i) => {
                if self.from.0 == i.sym && self.from.1 == i.span.ctxt {
                    let value = if let Some(new) = self.to.take() {
                        new
                    } else {
                        unreachable!("`{}` is already taken", i)
                    };
                    *p = Prop::KeyValue(KeyValueProp {
                        key: PropName::Ident(i.clone()),
                        value,
                    });

                    return;
                }
            }
            _ => {}
        }
    }
}
