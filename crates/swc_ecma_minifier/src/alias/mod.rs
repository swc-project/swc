use rustc_hash::FxHashSet;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_utils::{collect_decls, BindingCollector};
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

mod ctx;

pub(crate) struct AliasConfig {
    pub unresolved_ctxt: SyntaxContext,
}

pub(crate) fn collect_infects<N>(node: &N, config: AliasConfig) -> FxHashSet<Id>
where
    N: for<'aa> VisitWith<InfectionCollector<'aa>>,
    N: VisitWith<BindingCollector<Id>>,
{
    let decls = collect_decls(n);

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
    config: AliasConfig,

    exclude: &'a FxHashSet<Id>,

    ctx: Ctx,

    aliases: FxHashSet<Id>,
}

impl InfectionCollector<'_> {
    fn add_expr(&mut self, e: &Expr) {}
}

impl Visit for InfectionCollector<'_> {
    noop_visit_type!();

    fn visit_expr(&mut self, e: &Expr) {
        match e {
            Expr::Ident(..) => {}
            Expr::Member(MemberExpr { obj, prop, .. }) => {
                collect(obj, infects);

                if let MemberProp::Computed(prop) = prop {
                    collect(&prop.expr, infects)
                }
            }
            Expr::Bin(BinExpr {
                op:
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
                    | op!(">="),
                left,
                right,
                ..
            }) => {
                collect(left, infects);
                collect(right, infects);
            }

            Expr::Unary(UnaryExpr {
                op:
                    op!("~")
                    | op!(unary, "-")
                    | op!(unary, "+")
                    | op!("!")
                    | op!("typeof")
                    | op!("void"),
                arg,
                ..
            }) => {
                collect(arg, infects);
            }

            _ => {
                infects.extend(idents_used_by(e));
            }
        }
    }
}
