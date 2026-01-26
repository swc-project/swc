#![allow(clippy::needless_update)]

use rustc_hash::FxHashSet;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use self::ctx::Ctx;
use crate::{marks::Marks, util::is_global_var_with_pure_property_access};

mod ctx;

#[derive(Default)]
#[non_exhaustive]
pub struct AliasConfig {
    pub marks: Option<Marks>,
    pub ignore_nested: bool,
    /// TODO(kdy1): This field is used for sequential inliner.
    /// It should be renamed to some correct name.
    pub need_all: bool,

    /// We can skip visiting children nodes in some cases.
    ///
    /// Because we recurse in the usage analyzer, we don't need to recurse into
    /// child node that the usage analyzer will invoke [`collect_infects_from`]
    /// on.
    pub ignore_named_child_scope: bool,
}

impl AliasConfig {
    pub fn marks(mut self, arg: Option<Marks>) -> Self {
        self.marks = arg;
        self
    }

    pub fn ignore_nested(mut self, arg: bool) -> Self {
        self.ignore_nested = arg;
        self
    }

    pub fn ignore_named_child_scope(mut self, arg: bool) -> Self {
        self.ignore_named_child_scope = arg;
        self
    }

    pub fn need_all(mut self, arg: bool) -> Self {
        self.need_all = arg;
        self
    }
}

pub trait InfectableNode {
    fn is_fn_or_arrow_expr(&self) -> bool;
}

impl InfectableNode for Function {
    fn is_fn_or_arrow_expr(&self) -> bool {
        false
    }
}

impl InfectableNode for Expr {
    fn is_fn_or_arrow_expr(&self) -> bool {
        matches!(self, Expr::Arrow(..) | Expr::Fn(..))
    }
}

impl<T> InfectableNode for Box<T>
where
    T: InfectableNode,
{
    fn is_fn_or_arrow_expr(&self) -> bool {
        (**self).is_fn_or_arrow_expr()
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]

pub enum AccessKind {
    Reference,
    Call,
}

pub type Access = (Id, AccessKind);

pub fn collect_infects_from<N>(node: &N, config: AliasConfig) -> FxHashSet<Access>
where
    N: InfectableNode + VisitWith<InfectionCollector>,
{
    if config.ignore_nested && node.is_fn_or_arrow_expr() {
        return Default::default();
    }

    let unresolved_ctxt = config
        .marks
        .map(|m| SyntaxContext::empty().apply_mark(m.unresolved_mark));

    let mut visitor = InfectionCollector {
        config,
        unresolved_ctxt,

        ctx: Ctx::TrackExprIdent,

        bindings: FxHashSet::default(),
        accesses: FxHashSet::default(),

        max_entries: None,
    };

    node.visit_with(&mut visitor);

    visitor.accesses
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct TooManyAccesses;

/// If the number of accesses exceeds `max_entries`, it returns `Err(())`.
pub fn try_collect_infects_from<N>(
    node: &N,
    config: AliasConfig,
    max_entries: usize,
) -> Result<FxHashSet<Access>, TooManyAccesses>
where
    N: InfectableNode + VisitWith<InfectionCollector>,
{
    if config.ignore_nested && node.is_fn_or_arrow_expr() {
        return Ok(Default::default());
    }

    let unresolved_ctxt = config
        .marks
        .map(|m| SyntaxContext::empty().apply_mark(m.unresolved_mark));

    let mut visitor = InfectionCollector {
        config,
        unresolved_ctxt,

        ctx: Ctx::TrackExprIdent,

        bindings: FxHashSet::default(),
        accesses: FxHashSet::default(),

        max_entries: Some(max_entries),
    };

    node.visit_with(&mut visitor);

    if visitor.accesses.len() > max_entries {
        return Err(TooManyAccesses);
    }

    Ok(visitor.accesses)
}

pub struct InfectionCollector {
    config: AliasConfig,
    unresolved_ctxt: Option<SyntaxContext>,

    bindings: FxHashSet<Id>,

    ctx: Ctx,

    accesses: FxHashSet<Access>,

    max_entries: Option<usize>,
}

impl InfectionCollector {
    fn add_binding(&mut self, e: &Ident) {
        if self.bindings.insert(e.to_id()) {
            self.accesses.remove(&(e.to_id(), AccessKind::Reference));
            self.accesses.remove(&(e.to_id(), AccessKind::Call));
        }
    }

    fn add_usage(&mut self, e: Id) {
        if self.bindings.contains(&e) {
            return;
        }

        if self.unresolved_ctxt == Some(e.1) && is_global_var_with_pure_property_access(&e.0) {
            return;
        }

        self.accesses.insert((
            e,
            if self.ctx.contains(Ctx::IsCallee) {
                AccessKind::Call
            } else {
                AccessKind::Reference
            },
        ));
    }
}

impl Visit for InfectionCollector {
    noop_visit_type!();

    fn visit_arrow_expr(&mut self, n: &ArrowExpr) {
        let old = self.ctx.contains(Ctx::IsPatDecl);

        for p in &n.params {
            self.ctx.insert(Ctx::IsPatDecl);
            p.visit_with(self);
        }

        n.body.visit_with(self);
        self.ctx.set(Ctx::IsPatDecl, old);
    }

    fn visit_assign_expr(&mut self, n: &AssignExpr) {
        if self.config.ignore_named_child_scope
            && n.op == op!("=")
            && n.left.as_simple().and_then(|l| l.leftmost()).is_some()
        {
            n.left.visit_with(self);
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_assign_pat_prop(&mut self, node: &AssignPatProp) {
        node.value.visit_with(self);

        if self.ctx.contains(Ctx::IsPatDecl) {
            self.add_binding(&node.key.clone().into());
        }
    }

    fn visit_bin_expr(&mut self, e: &BinExpr) {
        match e.op {
            op!("in")
            | op!("instanceof")
            | op!(bin, "-")
            | op!(bin, "+")
            | op!("/")
            | op!("*")
            | op!("%")
            | op!("&")
            | op!("^")
            | op!("|")
            | op!("==")
            | op!("===")
            | op!("!=")
            | op!("!==")
            | op!("<")
            | op!("<=")
            | op!(">")
            | op!(">=")
            | op!("<<")
            | op!(">>")
            | op!(">>>") => {
                let ctx = self.ctx - Ctx::TrackExprIdent - Ctx::IsCallee;
                e.visit_children_with(&mut *self.with_ctx(ctx));
            }
            _ => {
                let ctx = (self.ctx | Ctx::TrackExprIdent) - Ctx::IsCallee;
                e.visit_children_with(&mut *self.with_ctx(ctx));
            }
        }
    }

    fn visit_callee(&mut self, n: &Callee) {
        let ctx = self.ctx | Ctx::IsCallee;
        n.visit_children_with(&mut *self.with_ctx(ctx));
    }

    fn visit_class_decl(&mut self, node: &ClassDecl) {
        self.add_binding(&node.ident);

        node.visit_children_with(self);
    }

    fn visit_cond_expr(&mut self, e: &CondExpr) {
        {
            let ctx = self.ctx - Ctx::TrackExprIdent - Ctx::IsCallee;
            e.test.visit_with(&mut *self.with_ctx(ctx));
        }

        {
            let ctx = self.ctx | Ctx::TrackExprIdent;
            e.cons.visit_with(&mut *self.with_ctx(ctx));
            e.alt.visit_with(&mut *self.with_ctx(ctx));
        }
    }

    fn visit_expr(&mut self, e: &Expr) {
        if let Some(max_entries) = self.max_entries {
            if self.accesses.len() >= max_entries {
                return;
            }
        }

        match e {
            Expr::Ident(i) => {
                if self.ctx.contains(Ctx::TrackExprIdent) {
                    self.add_usage(i.to_id());
                }
            }

            _ => {
                let ctx = (self.ctx | Ctx::TrackExprIdent) - Ctx::IsPatDecl;
                e.visit_children_with(&mut *self.with_ctx(ctx));
            }
        }
    }

    fn visit_fn_decl(&mut self, n: &FnDecl) {
        self.add_binding(&n.ident);

        if self.config.ignore_named_child_scope {
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_fn_expr(&mut self, n: &FnExpr) {
        if self.config.ignore_named_child_scope && n.ident.is_some() {
            return;
        }
        n.visit_children_with(self);
    }

    fn visit_function(&mut self, n: &Function) {
        if let Some(max_entries) = self.max_entries {
            if self.accesses.len() >= max_entries {
                return;
            }
        }

        n.visit_children_with(self);
    }

    fn visit_ident(&mut self, n: &Ident) {
        self.add_usage(n.to_id());
    }

    fn visit_member_expr(&mut self, n: &MemberExpr) {
        {
            let mut ctx = self.ctx;
            ctx.set(Ctx::TrackExprIdent, self.config.need_all);
            n.obj.visit_with(&mut *self.with_ctx(ctx));
        }

        {
            let mut ctx = self.ctx;
            ctx.set(Ctx::TrackExprIdent, self.config.need_all);
            n.prop.visit_with(&mut *self.with_ctx(ctx));
        }
    }

    fn visit_member_prop(&mut self, n: &MemberProp) {
        if let MemberProp::Computed(c) = &n {
            c.visit_with(&mut *self.with_ctx(self.ctx - Ctx::IsCallee));
        }
    }

    fn visit_param(&mut self, node: &Param) {
        let old = self.ctx.contains(Ctx::IsPatDecl);
        self.ctx.insert(Ctx::IsPatDecl);
        node.visit_children_with(self);
        self.ctx.set(Ctx::IsPatDecl, old);
    }

    fn visit_pat(&mut self, node: &Pat) {
        node.visit_children_with(self);

        if self.ctx.contains(Ctx::IsPatDecl) {
            if let Pat::Ident(i) = node {
                self.add_binding(i)
            }
        }
    }

    fn visit_prop_name(&mut self, n: &PropName) {
        if let PropName::Computed(c) = &n {
            c.visit_with(&mut *self.with_ctx(self.ctx - Ctx::IsCallee));
        }
    }

    fn visit_stmt(&mut self, n: &Stmt) {
        if let Some(max_entries) = self.max_entries {
            if self.accesses.len() >= max_entries {
                return;
            }
        }

        n.visit_children_with(self);
    }

    fn visit_super_prop_expr(&mut self, n: &SuperPropExpr) {
        if let SuperProp::Computed(c) = &n.prop {
            c.visit_with(&mut *self.with_ctx(self.ctx - Ctx::IsCallee));
        }
    }

    fn visit_unary_expr(&mut self, e: &UnaryExpr) {
        match e.op {
            op!("~")
            | op!(unary, "-")
            | op!(unary, "+")
            | op!("!")
            | op!("typeof")
            | op!("void") => {
                let ctx = self.ctx - Ctx::TrackExprIdent - Ctx::IsCallee;
                e.visit_children_with(&mut *self.with_ctx(ctx));
            }

            _ => {
                let ctx = (self.ctx | Ctx::TrackExprIdent) - Ctx::IsCallee;
                e.visit_children_with(&mut *self.with_ctx(ctx));
            }
        }
    }

    fn visit_update_expr(&mut self, e: &UpdateExpr) {
        let ctx = self.ctx - Ctx::TrackExprIdent - Ctx::IsCallee;
        e.arg.visit_with(&mut *self.with_ctx(ctx));
    }

    fn visit_var_declarator(&mut self, n: &VarDeclarator) {
        {
            let old = self.ctx.contains(Ctx::IsPatDecl);
            self.ctx.insert(Ctx::IsPatDecl);
            n.name.visit_with(self);
            self.ctx.set(Ctx::IsPatDecl, old);
        }

        if self.config.ignore_named_child_scope {
            if let (Pat::Ident(..), Some(..)) = (&n.name, n.init.as_deref()) {
                return;
            }
        }

        {
            let old = self.ctx.contains(Ctx::IsPatDecl);
            self.ctx.remove(Ctx::IsPatDecl);
            n.init.visit_with(self);
            self.ctx.set(Ctx::IsPatDecl, old);
        }
    }
}
