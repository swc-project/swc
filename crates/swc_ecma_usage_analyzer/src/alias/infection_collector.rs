use rustc_hash::FxHashSet;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use super::{ctx::Ctx, AliasConfig};
use crate::{
    alias::{Access, AccessKind, InfectableNode},
    util::is_global_var_with_pure_property_access,
};

pub struct InfectionCollector<'a> {
    config: AliasConfig,
    unresolved_ctxt: Option<SyntaxContext>,

    bindings: FxHashSet<IdIdx>,

    pub(super) ctx: Ctx,

    accesses: FxHashSet<Access>,

    max_entries: Option<usize>,

    id_map: &'a mut Ids,
}

impl InfectionCollector<'_> {
    fn add_binding(&mut self, e: &Ident) {
        let id = self.id_map.intern_ident(e);
        if self.bindings.insert(id) {
            self.accesses.remove(&(id, AccessKind::Reference));
            self.accesses.remove(&(id, AccessKind::Call));
        }
    }

    fn add_usage(&mut self, ident: &Ident) {
        let id = self.id_map.intern_ident(ident);
        if self.bindings.contains(&id) {
            return;
        }

        if self.unresolved_ctxt == Some(ident.ctxt)
            && is_global_var_with_pure_property_access(&ident.sym)
        {
            return;
        }

        self.accesses.insert((
            id,
            if self.ctx.contains(Ctx::IsCallee) {
                AccessKind::Call
            } else {
                AccessKind::Reference
            },
        ));
    }
}

impl Visit for InfectionCollector<'_> {
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
                let saved_ctx = self.ctx;
                self.ctx = self.ctx - Ctx::TrackExprIdent - Ctx::IsCallee;
                e.visit_children_with(self);
                self.ctx = saved_ctx;
            }
            _ => {
                let saved_ctx = self.ctx;
                self.ctx = (self.ctx | Ctx::TrackExprIdent) - Ctx::IsCallee;
                e.visit_children_with(self);
                self.ctx = saved_ctx;
            }
        }
    }

    fn visit_callee(&mut self, n: &Callee) {
        let saved_ctx = self.ctx;
        self.ctx = self.ctx - Ctx::TrackExprIdent;
        n.visit_children_with(self);
        self.ctx = saved_ctx;
    }

    fn visit_class_decl(&mut self, node: &ClassDecl) {
        self.add_binding(&node.ident);

        node.visit_children_with(self);
    }

    fn visit_cond_expr(&mut self, e: &CondExpr) {
        {
            let saved_ctx = self.ctx;
            self.ctx = self.ctx - Ctx::TrackExprIdent - Ctx::IsCallee;
            e.test.visit_with(self);
            self.ctx = saved_ctx;
        }

        {
            let saved_ctx = self.ctx;
            self.ctx = self.ctx - Ctx::IsCallee;
            e.cons.visit_with(self);
            self.ctx = saved_ctx - Ctx::IsCallee;
            e.alt.visit_with(self);
            self.ctx = saved_ctx;
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
                    self.add_usage(i);
                }
            }

            _ => {
                let saved_ctx = self.ctx;
                self.ctx = (self.ctx | Ctx::TrackExprIdent) - Ctx::IsPatDecl;
                e.visit_children_with(self);
                self.ctx = saved_ctx;
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
        self.add_usage(n);
    }

    fn visit_member_expr(&mut self, n: &MemberExpr) {
        {
            let saved_ctx = self.ctx;
            self.ctx.set(Ctx::TrackExprIdent, self.config.need_all);
            n.obj.visit_with(self);
            self.ctx = saved_ctx;
        }

        {
            let saved_ctx = self.ctx;
            self.ctx.set(Ctx::TrackExprIdent, self.config.need_all);
            n.prop.visit_with(self);
            self.ctx = saved_ctx;
        }
    }

    fn visit_member_prop(&mut self, n: &MemberProp) {
        if let MemberProp::Computed(c) = &n {
            let saved_ctx = self.ctx;
            self.ctx = self.ctx - Ctx::IsCallee;
            c.visit_with(self);
            self.ctx = saved_ctx;
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
            let saved_ctx = self.ctx;
            self.ctx = self.ctx - Ctx::IsCallee;
            c.visit_with(self);
            self.ctx = saved_ctx;
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
            let saved_ctx = self.ctx;
            self.ctx = self.ctx - Ctx::IsCallee;
            c.visit_with(self);
            self.ctx = saved_ctx;
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
                let saved_ctx = self.ctx;
                self.ctx = self.ctx - Ctx::TrackExprIdent - Ctx::IsCallee;
                e.visit_children_with(self);
                self.ctx = saved_ctx;
            }

            _ => {
                let saved_ctx = self.ctx;
                self.ctx = (self.ctx | Ctx::TrackExprIdent) - Ctx::IsCallee;
                e.visit_children_with(self);
                self.ctx = saved_ctx;
            }
        }
    }

    fn visit_update_expr(&mut self, e: &UpdateExpr) {
        let saved_ctx = self.ctx;
        self.ctx = (self.ctx | Ctx::TrackExprIdent) - Ctx::IsCallee;
        e.arg.visit_with(self);
        self.ctx = saved_ctx;
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

fn collect<'a, N>(
    node: &N,
    config: AliasConfig,
    max_entries: Option<usize>,
    id_map: &'a mut Ids,
) -> FxHashSet<(IdIdx, AccessKind)>
where
    N: InfectableNode + VisitWith<InfectionCollector<'a>>,
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

        max_entries,
        id_map,
    };

    node.visit_with(&mut visitor);

    visitor.accesses
}

pub fn collect_infects_from<'a, N>(
    node: &N,
    config: AliasConfig,
    id_map: &'a mut Ids,
) -> FxHashSet<Access>
where
    N: InfectableNode + VisitWith<InfectionCollector<'a>>,
{
    collect(node, config, None, id_map)
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct TooManyAccesses;

/// If the number of accesses exceeds `max_entries`, it returns `Err(())`.
pub fn try_collect_infects_from<'a, N>(
    node: &N,
    config: AliasConfig,
    max_entries: usize,
    id_map: &'a mut Ids,
) -> Result<FxHashSet<Access>, TooManyAccesses>
where
    N: InfectableNode + VisitWith<InfectionCollector<'a>>,
{
    let ret = collect(node, config, Some(max_entries), id_map);
    if ret.len() > max_entries {
        Err(TooManyAccesses)
    } else {
        Ok(ret)
    }
}
