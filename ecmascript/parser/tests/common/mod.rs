use swc_common::Span;
use swc_ecma_ast::*;
use swc_ecma_visit::{Fold, FoldWith};

pub struct Normalizer;
impl Fold for Normalizer {
    fn fold_expr(&mut self, e: Expr) -> Expr {
        let e = e.fold_children_with(self);

        match e {
            Expr::Paren(ParenExpr { expr, .. }) => *expr,
            Expr::New(n @ NewExpr { args: None, .. }) => Expr::New(NewExpr {
                args: Some(vec![]),
                ..n
            }),
            // Flatten comma expressions.
            Expr::Seq(SeqExpr { mut exprs, span }) => {
                let need_work = exprs.iter().any(|n| match **n {
                    Expr::Seq(..) => true,
                    _ => false,
                });

                if need_work {
                    exprs = exprs.into_iter().fold(vec![], |mut v, e| {
                        match *e {
                            Expr::Seq(SeqExpr { exprs, .. }) => v.extend(exprs),
                            _ => v.push(e),
                        }
                        v
                    });
                }
                Expr::Seq(SeqExpr { exprs, span })
            }
            _ => e,
        }
    }

    fn fold_pat(&mut self, mut node: Pat) -> Pat {
        node = node.fold_children_with(self);

        if let Pat::Expr(expr) = node {
            match *expr {
                Expr::Ident(i) => return Pat::Ident(i),
                _ => {
                    node = Pat::Expr(expr);
                }
            }
        }

        node
    }

    fn fold_pat_or_expr(&mut self, node: PatOrExpr) -> PatOrExpr {
        let node = node.fold_children_with(self);

        match node {
            PatOrExpr::Pat(pat) => match *pat {
                Pat::Expr(expr) => PatOrExpr::Expr(expr),
                _ => PatOrExpr::Pat(pat),
            },
            _ => node,
        }
    }

    fn fold_prop_name(&mut self, n: PropName) -> PropName {
        let n = n.fold_children_with(self);

        match n {
            PropName::Ident(Ident { sym, .. }) => PropName::Str(Str {
                span: Default::default(),
                value: sym,
                has_escape: false,
            }),
            PropName::Num(num) => PropName::Str(Str {
                span: Default::default(),
                value: num.to_string().into(),
                has_escape: false,
            }),
            _ => n,
        }
    }

    fn fold_str(&mut self, s: Str) -> Str {
        Str {
            span: Default::default(),
            has_escape: false,
            ..s
        }
    }

    fn fold_span(&mut self, _: Span) -> Span {
        Span::default()
    }

    fn fold_class_members(&mut self, mut node: Vec<ClassMember>) -> Vec<ClassMember> {
        node = node.fold_children_with(self);

        node.retain(|v| match v {
            ClassMember::Empty(..) => false,
            _ => true,
        });

        node
    }
}
