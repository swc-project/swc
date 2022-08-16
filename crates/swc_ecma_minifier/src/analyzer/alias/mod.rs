#![allow(clippy::needless_update)]

use rustc_hash::FxHashSet;
use swc_common::collections::AHashSet;
use swc_ecma_ast::*;
use swc_ecma_utils::{collect_decls, BindingCollector};
use swc_ecma_visit::{noop_visit_type, visit_obj_and_computed, Visit, VisitWith};

use self::ctx::Ctx;

mod ctx;

pub(super) fn get_infects_of<N>(init: &N) -> impl 'static + Iterator<Item = Id>
where
    N: for<'aa> VisitWith<InfectsTo<'aa>> + VisitWith<BindingCollector<Id>>,
{
    let excluded: AHashSet<Id> = collect_decls(init);
    let used_idents = {
        let mut v = InfectsTo {
            excludes: &excluded,
            infects: Default::default(),
            ctx: Ctx {
                track_expr_ident: true,
            },
        };

        init.visit_with(&mut v);

        v.infects
    };

    used_idents
        .into_iter()
        .filter(move |id| !excluded.contains(id))
}

pub(super) struct InfectsTo<'a> {
    excludes: &'a AHashSet<Id>,
    infects: FxHashSet<Id>,

    ctx: Ctx,
}

impl Visit for InfectsTo<'_> {
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
            | op!(">=")
            | op!("<<")
            | op!(">>")
            | op!(">>>") => {
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

    fn visit_ident(&mut self, n: &Ident) {
        if !self.ctx.track_expr_ident {
            return;
        }
        if self.excludes.contains(&n.to_id()) {
            return;
        }
        self.infects.insert(n.to_id());
    }

    fn visit_expr(&mut self, e: &Expr) {
        if let Expr::Ident(..) = e {
            if !self.ctx.track_expr_ident {
                return;
            }
        }

        let ctx = Ctx {
            track_expr_ident: true,
            ..self.ctx
        };
        e.visit_children_with(&mut *self.with_ctx(ctx));
    }

    fn visit_member_prop(&mut self, n: &MemberProp) {
        if let MemberProp::Computed(..) = n {
            n.visit_children_with(self);
        }
    }

    fn visit_prop_name(&mut self, n: &PropName) {
        if let PropName::Computed(..) = n {
            n.visit_children_with(self);
        }
    }
}
