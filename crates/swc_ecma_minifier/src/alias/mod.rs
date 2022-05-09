#![allow(clippy::needless_update)]

use rustc_hash::FxHashSet;
use swc_common::collections::AHashSet;
use swc_ecma_ast::*;
use swc_ecma_utils::{collect_decls, ident::IdentLike, BindingCollector};
use swc_ecma_visit::{noop_visit_type, visit_obj_and_computed, Visit, VisitWith};

use self::ctx::Ctx;
use crate::marks::Marks;

mod ctx;

pub(crate) struct AliasConfig {
    #[allow(unused)]
    pub marks: Marks,
}

pub(crate) fn collect_infects<N>(node: &N, config: AliasConfig) -> FxHashSet<Id>
where
    N: for<'aa> VisitWith<InfectionCollector<'aa>>,
    N: VisitWith<BindingCollector<Id>>,
{
    let decls = collect_decls(node);

    let mut visitor = InfectionCollector {
        config,
        exclude: &decls,
        aliases: FxHashSet::default(),
        ctx: Default::default(),
    };

    node.visit_with(&mut visitor);

    visitor.aliases
}

pub(crate) struct InfectionCollector<'a> {
    #[allow(unused)]
    config: AliasConfig,

    exclude: &'a AHashSet<Id>,

    ctx: Ctx,

    aliases: FxHashSet<Id>,
}

impl InfectionCollector<'_> {
    fn add_id(&mut self, e: &Id) {
        if self.exclude.contains(e) {
            return;
        }

        self.aliases.insert(e.clone());
    }
}

impl Visit for InfectionCollector<'_> {
    noop_visit_type!();

    visit_obj_and_computed!();

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
            | op!(">=") => {
                let ctx = Ctx {
                    track_expr_ident: false,
                    ..self.ctx
                };
                e.visit_children_with(&mut *self.with_ctx(ctx));
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
                    ..self.ctx
                };
                e.visit_children_with(&mut *self.with_ctx(ctx));
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
}
