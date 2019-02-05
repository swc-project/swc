use crate::util::ExprFactory;
use ast::*;
use swc_common::{Fold, FoldWith, Visit, VisitWith};

/// `@babel/plugin-transform-typeof-symbol`
///
/// # Example
/// ## In
///
/// ```js
/// typeof Symbol() === "symbol";
/// ```
///
/// ## Out
/// ```js
/// var _typeof = function (obj) {
///  return obj && obj.constructor === Symbol ? "symbol" : typeof obj;
/// };
///
/// _typeof(Symbol()) === "symbol";
/// ```
#[derive(Clone)]
pub struct TypeOfSymbol;

impl Fold<Expr> for TypeOfSymbol {
    fn fold(&mut self, expr: Expr) -> Expr {
        fn should_work(node: &Expr) -> bool {
            struct Visitor {
                found: bool,
            }
            impl Visit<UnaryExpr> for Visitor {
                fn visit(&mut self, e: &UnaryExpr) {
                    if e.op == op!("typeof") {
                        self.found = true
                    }
                }
            }
            let mut v = Visitor { found: false };
            node.visit_with(&mut v);
            v.found
        }
        // fast path
        if !should_work(&expr) {
            return expr;
        }

        let expr = expr.fold_children(self);

        match expr {
            Expr::Unary(UnaryExpr {
                span,
                op: op!("typeof"),
                arg,
            }) => {
                helper!(type_of);
                return Expr::Call(CallExpr {
                    span,
                    callee: quote_ident!(span, "_typeof").as_callee(),
                    args: vec![arg.as_arg()],

                    type_args: Default::default(),
                });
            }
            _ => expr,
        }
    }
}
