#![allow(clippy::needless_update)]

use rustc_hash::FxHashSet;
use swc_common::{collections::AHashSet, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::{collect_decls, BindingCollector};
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use self::ctx::Ctx;
use crate::{marks::Marks, util::is_global_var_with_pure_property_access};

mod ctx;

#[derive(Default)]
pub struct AliasConfig {
    pub marks: Option<Marks>,
    pub ignore_nested: bool,
    /// TODO(kdy1): This field is used for sequential inliner.
    /// It should be renamed to some correct name.
    pub need_all: bool,
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
    N: InfectableNode
        + VisitWith<BindingCollector<Id>>
        + for<'aa> VisitWith<InfectionCollector<'aa>>,
{
    if config.ignore_nested && node.is_fn_or_arrow_expr() {
        return Default::default();
    }

    let unresolved_ctxt = config
        .marks
        .map(|m| SyntaxContext::empty().apply_mark(m.unresolved_mark));
    let decls = collect_decls(node);

    let mut visitor = InfectionCollector {
        config,
        unresolved_ctxt,

        exclude: &decls,
        ctx: Ctx {
            track_expr_ident: true,
            ..Default::default()
        },
        accesses: FxHashSet::default(),
    };

    node.visit_with(&mut visitor);

    visitor.accesses
}

pub struct InfectionCollector<'a> {
    #[allow(unused)]
    config: AliasConfig,
    unresolved_ctxt: Option<SyntaxContext>,

    exclude: &'a AHashSet<Id>,

    ctx: Ctx,

    accesses: FxHashSet<Access>,
}

impl InfectionCollector<'_> {
    fn add_id(&mut self, e: &Id) {
        if self.exclude.contains(e) {
            return;
        }

        if self.unresolved_ctxt == Some(e.1) && is_global_var_with_pure_property_access(&e.0) {
            return;
        }

        self.accesses.insert((
            e.clone(),
            if self.ctx.is_callee {
                AccessKind::Call
            } else {
                AccessKind::Reference
            },
        ));
    }
}

impl Visit for InfectionCollector<'_> {
    noop_visit_type!();

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
                let ctx = Ctx {
                    track_expr_ident: false,
                    is_callee: false,
                    ..self.ctx
                };
                e.visit_children_with(&mut *self.with_ctx(ctx));
            }
            _ => {
                let ctx = Ctx {
                    track_expr_ident: true,
                    is_callee: false,
                    ..self.ctx
                };
                e.visit_children_with(&mut *self.with_ctx(ctx));
            }
        }
    }

    fn visit_cond_expr(&mut self, e: &CondExpr) {
        {
            let ctx = Ctx {
                track_expr_ident: false,
                is_callee: false,
                ..self.ctx
            };
            e.test.visit_with(&mut *self.with_ctx(ctx));
        }

        {
            let ctx = Ctx {
                track_expr_ident: true,
                ..self.ctx
            };
            e.cons.visit_with(&mut *self.with_ctx(ctx));
            e.alt.visit_with(&mut *self.with_ctx(ctx));
        }
    }

    fn visit_ident(&mut self, n: &Ident) {
        self.add_id(&n.to_id());
    }

    fn visit_expr(&mut self, e: &Expr) {
        match e {
            Expr::Ident(i) => {
                if self.ctx.track_expr_ident {
                    self.add_id(&i.to_id());
                }
            }

            _ => {
                let ctx = Ctx {
                    track_expr_ident: true,
                    ..self.ctx
                };
                e.visit_children_with(&mut *self.with_ctx(ctx));
            }
        }
    }

    fn visit_member_expr(&mut self, n: &MemberExpr) {
        {
            let ctx = Ctx {
                track_expr_ident: self.config.need_all,
                ..self.ctx
            };
            n.obj.visit_with(&mut *self.with_ctx(ctx));
        }

        {
            let ctx = Ctx {
                track_expr_ident: self.config.need_all,
                ..self.ctx
            };
            n.prop.visit_with(&mut *self.with_ctx(ctx));
        }
    }

    fn visit_member_prop(&mut self, n: &MemberProp) {
        if let MemberProp::Computed(c) = &n {
            c.visit_with(&mut *self.with_ctx(Ctx {
                is_callee: false,
                ..self.ctx
            }));
        }
    }

    fn visit_super_prop_expr(&mut self, n: &SuperPropExpr) {
        if let SuperProp::Computed(c) = &n.prop {
            c.visit_with(&mut *self.with_ctx(Ctx {
                is_callee: false,
                ..self.ctx
            }));
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
                let ctx = Ctx {
                    track_expr_ident: false,
                    is_callee: false,
                    ..self.ctx
                };
                e.visit_children_with(&mut *self.with_ctx(ctx));
            }

            _ => {
                let ctx = Ctx {
                    track_expr_ident: true,
                    is_callee: false,
                    ..self.ctx
                };
                e.visit_children_with(&mut *self.with_ctx(ctx));
            }
        }
    }

    fn visit_update_expr(&mut self, e: &UpdateExpr) {
        let ctx = Ctx {
            track_expr_ident: false,
            is_callee: false,
            ..self.ctx
        };
        e.arg.visit_with(&mut *self.with_ctx(ctx));
    }

    fn visit_prop_name(&mut self, n: &PropName) {
        if let PropName::Computed(c) = &n {
            c.visit_with(&mut *self.with_ctx(Ctx {
                is_callee: false,
                ..self.ctx
            }));
        }
    }

    fn visit_callee(&mut self, n: &Callee) {
        let ctx = Ctx {
            is_callee: true,
            ..self.ctx
        };
        n.visit_children_with(&mut *self.with_ctx(ctx));
    }
}
