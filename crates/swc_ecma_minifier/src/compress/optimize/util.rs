use std::ops::{Deref, DerefMut};

use rustc_hash::FxHashMap;
use swc_common::{Span, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprCtx, ExprExt};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};
use tracing::debug;

use super::{Ctx, Optimizer};
use crate::mode::Mode;

impl<'b, M> Optimizer<'b, M>
where
    M: Mode,
{
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

    /// RAII guard to change context temporarically
    #[inline]
    pub(super) fn with_ctx(&mut self, ctx: Ctx) -> WithCtx<'_, 'b, M> {
        if cfg!(debug_assertions) {
            let scope_ctxt = ctx.scope;
            if self.ctx.scope != scope_ctxt {
                self.data.scopes.get(&scope_ctxt).expect("scope not found");
            }
        }

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
        self.reducer
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

pub(crate) fn class_has_side_effect(expr_ctx: &ExprCtx, c: &Class) -> bool {
    if let Some(e) = &c.super_class {
        if e.may_have_side_effects(expr_ctx) {
            return true;
        }
    }

    for m in &c.body {
        match m {
            ClassMember::Method(p) => {
                if let PropName::Computed(key) = &p.key {
                    if key.expr.may_have_side_effects(expr_ctx) {
                        return true;
                    }
                }
            }

            ClassMember::ClassProp(p) => {
                if let PropName::Computed(key) = &p.key {
                    if key.expr.may_have_side_effects(expr_ctx) {
                        return true;
                    }
                }

                if let Some(v) = &p.value {
                    if v.may_have_side_effects(expr_ctx) {
                        return true;
                    }
                }
            }
            ClassMember::PrivateProp(p) => {
                if let Some(v) = &p.value {
                    if v.may_have_side_effects(expr_ctx) {
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
    !matches!(e, Expr::Lit(..) | Expr::Unary(..))
}

/// Variable remapper
///
/// - Used for evaluating IIFEs

pub(crate) struct Remapper {
    pub vars: FxHashMap<Id, SyntaxContext>,
}

impl VisitMut for Remapper {
    noop_visit_mut_type!();

    fn visit_mut_ident(&mut self, i: &mut Ident) {
        if let Some(new_ctxt) = self.vars.get(&i.to_id()).copied() {
            i.span.ctxt = new_ctxt;
        }
    }
}

pub(crate) struct MultiReplacer<'a> {
    vars: &'a mut FxHashMap<Id, Box<Expr>>,
    changed: bool,
    clone: bool,
    mode: MultiReplacerMode,
    worked: &'a mut bool,
}

#[repr(u8)]
#[derive(Debug, Clone, Copy)]

pub enum MultiReplacerMode {
    Normal,
    OnlyCallee,
}

impl<'a> MultiReplacer<'a> {
    /// `worked` will be changed to `true` if any replacement is done
    pub fn new(
        vars: &'a mut FxHashMap<Id, Box<Expr>>,
        clone: bool,
        mode: MultiReplacerMode,
        worked: &'a mut bool,
    ) -> Self {
        MultiReplacer {
            vars,
            changed: false,
            clone,
            mode,
            worked,
        }
    }

    fn var(&mut self, i: &Id) -> Option<Box<Expr>> {
        if self.clone {
            self.vars.get(i).cloned()
        } else {
            self.vars.remove(i)
        }
    }
}

impl VisitMut for MultiReplacer<'_> {
    noop_visit_mut_type!();

    fn visit_mut_callee(&mut self, e: &mut Callee) {
        e.visit_mut_children_with(self);

        if matches!(self.mode, MultiReplacerMode::OnlyCallee) {
            if let Callee::Expr(e) = e {
                if let Expr::Ident(i) = &**e {
                    if let Some(new) = self.var(&i.to_id()) {
                        debug!("multi-replacer: Replaced `{}`", i);
                        *self.worked = true;
                        self.changed = true;

                        **e = *new;
                    }
                }
            }
        }
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        if self.vars.is_empty() {
            return;
        }
        e.visit_mut_children_with(self);

        if self.vars.is_empty() {
            return;
        }

        if matches!(self.mode, MultiReplacerMode::Normal) {
            if let Expr::Ident(i) = e {
                if let Some(new) = self.var(&i.to_id()) {
                    debug!("multi-replacer: Replaced `{}`", i);
                    *self.worked = true;
                    self.changed = true;

                    *e = *new;
                }
            }
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

        if matches!(self.mode, MultiReplacerMode::Normal) {
            if let Prop::Shorthand(i) = p {
                if let Some(value) = self.var(&i.to_id()) {
                    debug!("multi-replacer: Replaced `{}` as shorthand", i);
                    *self.worked = true;
                    self.changed = true;

                    *p = Prop::KeyValue(KeyValueProp {
                        key: PropName::Ident(Ident::new(
                            i.sym.clone(),
                            i.span.with_ctxt(Default::default()),
                        )),
                        value,
                    });
                }
            }
        }
    }
}

pub(crate) fn replace_id_with_expr<N>(node: &mut N, from: Id, to: Box<Expr>) -> Option<Box<Expr>>
where
    N: VisitMutWith<ExprReplacer>,
{
    let mut v = ExprReplacer { from, to: Some(to) };
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

        if let Expr::Ident(i) = e {
            if self.from.0 == i.sym && self.from.1 == i.span.ctxt {
                if let Some(new) = self.to.take() {
                    *e = *new;
                } else {
                    unreachable!("`{}` is already taken", i)
                }
            }
        }
    }

    fn visit_mut_prop(&mut self, p: &mut Prop) {
        p.visit_mut_children_with(self);

        if let Prop::Shorthand(i) = p {
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
            }
        }
    }
}
