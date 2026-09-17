use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::ExprFactory;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

/// Rewrites eager reads of a class's inner name to throw while computed method
/// keys are evaluated.
pub(super) fn rewrite_class_name_reads(expr: &mut Box<Expr>, class_name: &Ident) {
    let mut rewriter = ClassNameTdzRewriter { class_name };
    expr.visit_mut_with(&mut rewriter);
}

struct ClassNameTdzRewriter<'a> {
    class_name: &'a Ident,
}

impl VisitMut for ClassNameTdzRewriter<'_> {
    noop_visit_mut_type!(fail);

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        match expr {
            Expr::Ident(ident) if ident.to_id() == self.class_name.to_id() => {
                *expr = SeqExpr {
                    span: DUMMY_SP,
                    exprs: vec![
                        CallExpr {
                            span: DUMMY_SP,
                            callee: helper!(class_name_tdz_error),
                            args: vec![Str {
                                span: ident.span,
                                value: ident.sym.clone().into(),
                                raw: None,
                            }
                            .as_arg()],
                            ..Default::default()
                        }
                        .into(),
                        ident.clone().into(),
                    ],
                }
                .into();
            }
            Expr::Update(UpdateExpr { arg, .. }) if matches!(&**arg, Expr::Ident(ident) if ident.to_id() == self.class_name.to_id()) =>
            {
                // Assignment and update targets require their own
                // ordering-aware lowering and are intentionally
                // outside this read-only fix.
            }
            _ => expr.visit_mut_children_with(self),
        }
    }

    // Function bodies run after class initialization unless user code invokes
    // them while evaluating the key. Rewriting them unconditionally would make
    // valid delayed class-name reads throw.
    fn visit_mut_arrow_expr(&mut self, _: &mut ArrowExpr) {}

    fn visit_mut_function(&mut self, _: &mut Function) {}
}
