use swc_common::Span;
use swc_ecma_ast::*;
use swc_ecma_visit::{Fold, FoldWith};

pub fn assert_json_ast_matches_file(actual: &str, expected_path: &std::path::Path) {
    if !expected_path.exists() || expected_path.to_string_lossy().contains("stack-overflow") {
        return;
    }
    let mut actual: serde_json::Value =
        serde_json::from_str(actual).expect("actual parser AST must be valid JSON");
    let expected = std::fs::read_to_string(expected_path)
        .unwrap_or_else(|error| panic!("failed to read {}: {error}", expected_path.display()));
    let mut expected: serde_json::Value = serde_json::from_str(&expected)
        .unwrap_or_else(|error| panic!("invalid JSON in {}: {error}", expected_path.display()));
    remove_spans(&mut actual);
    remove_spans(&mut expected);
    pretty_assertions::assert_eq!(actual, expected, "fixture: {}", expected_path.display());
}

fn remove_spans(value: &mut serde_json::Value) {
    match value {
        serde_json::Value::Array(values) => {
            for value in values {
                remove_spans(value);
            }
        }
        serde_json::Value::Object(object) => {
            object.remove("span");
            for value in object.values_mut() {
                remove_spans(value);
            }
        }
        _ => {}
    }
}

#[allow(dead_code)]
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
            Expr::New(n @ NewExpr { args: None, .. }) if self.is_test262 => NewExpr {
                args: Some(Vec::new()),
                ..n
            }
            .into(),
            // Flatten comma expressions.
            Expr::Seq(SeqExpr { mut exprs, span }) => {
                let need_work = exprs.iter().any(|n| matches!(**n, Expr::Seq(..)));

                if need_work {
                    exprs = exprs.into_iter().fold(Vec::new(), |mut v, e| {
                        match *e {
                            Expr::Seq(SeqExpr { exprs, .. }) => v.extend(exprs),
                            _ => v.push(e),
                        }
                        v
                    });
                }
                SeqExpr { exprs, span }.into()
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
                Expr::Ident(i) => return i.into(),
                _ => {
                    node = expr.into();
                }
            }
        }

        node
    }

    fn fold_prop_name(&mut self, n: PropName) -> PropName {
        let n = n.fold_children_with(self);

        if !self.is_test262 {
            return n;
        }

        match n {
            PropName::Ident(IdentName { span, sym, .. }) => PropName::Str(Str {
                span,
                value: sym.into(),
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

    fn fold_simple_assign_target(&mut self, n: SimpleAssignTarget) -> SimpleAssignTarget {
        let n = n.fold_children_with(self);

        if self.is_test262 {
            match n {
                SimpleAssignTarget::Paren(ParenExpr { expr, .. }) => {
                    SimpleAssignTarget::try_from(expr).unwrap()
                }
                _ => n,
            }
        } else {
            n
        }
    }
}
