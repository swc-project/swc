#![allow(clippy::needless_update)]

use rustc_hash::FxHashSet;
use swc_atoms::js_word;
use swc_common::{collections::AHashSet, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::{collect_decls, ident::IdentLike, BindingCollector};
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use self::ctx::Ctx;
use crate::marks::Marks;

mod ctx;

pub(crate) struct AliasConfig {
    #[allow(unused)]
    pub marks: Marks,
}

pub(crate) fn collect_infects_from<N>(node: &N, config: AliasConfig) -> FxHashSet<Id>
where
    N: for<'aa> VisitWith<InfectionCollector<'aa>>,
    N: VisitWith<BindingCollector<Id>>,
{
    let unresolved_ctxt = SyntaxContext::empty().apply_mark(config.marks.unresolved_mark);
    let decls = collect_decls(node);

    let mut visitor = InfectionCollector {
        config,
        unresolved_ctxt,

        exclude: &decls,
        ctx: Default::default(),
        aliases: FxHashSet::default(),
    };

    node.visit_with(&mut visitor);

    visitor.aliases
}

pub(crate) struct InfectionCollector<'a> {
    #[allow(unused)]
    config: AliasConfig,
    unresolved_ctxt: SyntaxContext,

    exclude: &'a AHashSet<Id>,

    ctx: Ctx,

    aliases: FxHashSet<Id>,
}

impl InfectionCollector<'_> {
    fn add_id(&mut self, e: &Id) {
        if self.exclude.contains(e) {
            return;
        }

        if self.unresolved_ctxt == e.1 {
            match e.0 {
                js_word!("String")
                | js_word!("Object")
                | js_word!("Number")
                | js_word!("BigInt")
                | js_word!("Boolean")
                | js_word!("Math") => return,
                _ => {}
            }
        }

        self.aliases.insert(e.clone());
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

    fn visit_cond_expr(&mut self, e: &CondExpr) {
        {
            let ctx = Ctx {
                track_expr_ident: false,
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
                track_expr_ident: false,
                ..self.ctx
            };
            n.obj.visit_with(&mut *self.with_ctx(ctx));
        }

        {
            let ctx = Ctx {
                track_expr_ident: false,
                ..self.ctx
            };
            n.prop.visit_with(&mut *self.with_ctx(ctx));
        }
    }

    fn visit_member_prop(&mut self, n: &MemberProp) {
        if let MemberProp::Computed(c) = &n {
            c.visit_with(self);
        }
    }

    fn visit_super_prop_expr(&mut self, n: &SuperPropExpr) {
        if let SuperProp::Computed(c) = &n.prop {
            c.visit_with(self);
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

    fn visit_update_expr(&mut self, e: &UpdateExpr) {
        let ctx = Ctx {
            track_expr_ident: false,
            ..self.ctx
        };
        e.arg.visit_with(&mut *self.with_ctx(ctx));
    }
}
