use swc_common::Span;
use swc_ecma_ast::*;
use swc_ecma_visit::{Fold, FoldWith};

pub struct Normalizer {
    pub drop_span: bool,
    pub is_test262: bool,
}

impl Fold for Normalizer {
    fn fold_class_members(&mut self, mut node: Vec<ClassMember>) -> Vec<ClassMember> {
        node = node.fold_children_with(self);

        if !self.is_test262 {
            return node;
        }

        node.retain(|v| !matches!(v, ClassMember::Empty(..)));

        node
    }

    fn fold_expr(&mut self, e: Expr) -> Expr {
        let e = e.fold_children_with(self);

        match e {
            Expr::Paren(ParenExpr { expr, .. }) if self.is_test262 => *expr,
            Expr::New(n @ NewExpr { args: None, .. }) if self.is_test262 => Expr::New(NewExpr {
                args: Some(vec![]),
                ..n
            }),
            // Flatten comma expressions.
            Expr::Seq(SeqExpr { mut exprs, span }) => {
                let need_work = exprs.iter().any(|n| matches!(**n, Expr::Seq(..)));

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

    fn fold_number(&mut self, n: Number) -> Number {
        let mut n = n.fold_children_with(self);

        let val = serde_json::Number::from_f64(n.value);
        let val = match val {
            Some(v) => v,
            None => {
                if self.is_test262 {
                    n.raw = None;
                }

                return n;
            }
        };

        match val.as_f64() {
            Some(value) => {
                if self.is_test262 {
                    Number {
                        value,
                        raw: None,
                        ..n
                    }
                } else {
                    Number { value, ..n }
                }
            }
            None => n,
        }
    }

    fn fold_pat(&mut self, mut node: Pat) -> Pat {
        node = node.fold_children_with(self);

        if let Pat::Expr(expr) = node {
            match *expr {
                Expr::Ident(i) => return Pat::Ident(i.into()),
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
            PatOrExpr::Expr(expr) => match *expr {
                Expr::Ident(i) => PatOrExpr::Pat(Box::new(Pat::Ident(i.into()))),
                _ => PatOrExpr::Expr(expr),
            },
            PatOrExpr::Pat(pat) => match *pat {
                Pat::Expr(expr) => PatOrExpr::Expr(expr),
                _ => PatOrExpr::Pat(pat),
            },
        }
    }

    fn fold_prop_name(&mut self, n: PropName) -> PropName {
        let n = n.fold_children_with(self);

        if !self.is_test262 {
            return n;
        }

        match n {
            PropName::Ident(Ident { span, sym, .. }) => PropName::Str(Str {
                span,
                value: sym,
                raw: None,
            }),
            PropName::Num(num) => PropName::Str(Str {
                span: num.span,
                value: num.to_string().into(),
                raw: None,
            }),
            _ => n,
        }
    }

    fn fold_span(&mut self, span: Span) -> Span {
        if self.drop_span {
            Span::default()
        } else {
            span
        }
    }

    fn fold_str(&mut self, s: Str) -> Str {
        let span = s.span.fold_with(self);

        if self.is_test262 {
            Str {
                span,
                value: s.value,
                raw: None,
            }
        } else {
            Str { span, ..s }
        }
    }
}
