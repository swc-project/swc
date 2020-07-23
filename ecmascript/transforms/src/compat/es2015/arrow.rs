use crate::util::{contains_this_expr, ExprFactory};
use swc_common::{Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::quote_ident;
use swc_ecma_visit::{Fold, FoldWith, Node, Visit, VisitWith};

/// Compile ES2015 arrow functions to ES5
///
///# Example
///
///## In
/// ```js
/// var a = () => {};
/// var a = (b) => b;ß
///
/// const double = [1,2,3].map((num) => num * 2);
/// console.log(double); // [2,4,6]
///
/// var bob = {
///   _name: "Bob",
///   _friends: ["Sally", "Tom"],
///   printFriends() {
///     this._friends.forEach(f =>
///       console.log(this._name + " knows " + f));
///   }
/// };
/// console.log(bob.printFriends());
/// ```
///
///## Out
///```js
/// var a = function () {};
/// var a = function (b) {
///   return b;
/// };
///
/// const double = [1, 2, 3].map(function (num) {
///   return num * 2;
/// });
/// console.log(double); // [2,4,6]
///
/// var bob = {
///   _name: "Bob",
///   _friends: ["Sally", "Tom"],
///   printFriends() {
///     var _this = this;
///
///     this._friends.forEach(function (f) {
///       return console.log(_this._name + " knows " + f);
///     });
///   }
/// };
/// console.log(bob.printFriends());
/// ```
pub fn arrow() -> impl Fold {
    Arrow
}

struct Arrow;

noop_fold_type!(Arrow);

impl Fold for Arrow {
    fn fold_expr(&mut self, e: Expr) -> Expr {
        // fast path
        if !contains_arrow_expr(&e) {
            return e;
        }

        let e = validate!(e);
        let e = e.fold_children_with(self);

        match e {
            Expr::Arrow(ArrowExpr {
                span,
                params,
                body,
                is_async,
                is_generator,
                type_params,
                return_type,
            }) => {
                let used_this = contains_this_expr(&body);

                let fn_expr = Expr::Fn(FnExpr {
                    ident: None,
                    function: Function {
                        decorators: vec![],
                        span,
                        params: params
                            .into_iter()
                            .map(|pat| Param {
                                span: DUMMY_SP,
                                decorators: Default::default(),
                                pat,
                            })
                            .collect(),
                        is_async,
                        is_generator,
                        body: Some(match body {
                            BlockStmtOrExpr::BlockStmt(block) => block,
                            BlockStmtOrExpr::Expr(expr) => BlockStmt {
                                span: DUMMY_SP,
                                stmts: vec![Stmt::Return(ReturnStmt {
                                    span: expr.span(),
                                    arg: Some(expr),
                                })],
                            },
                        }),
                        type_params,
                        return_type,
                    },
                });

                if !used_this {
                    return fn_expr;
                }

                Expr::Call(CallExpr {
                    span,
                    callee: fn_expr.make_member(quote_ident!("bind")).as_callee(),
                    args: vec![ThisExpr { span: DUMMY_SP }.as_arg()],
                    type_args: Default::default(),
                })
            }
            _ => e,
        }
    }
}

fn contains_arrow_expr<N>(node: &N) -> bool
where
    N: VisitWith<ArrowVisitor>,
{
    let mut v = ArrowVisitor { found: false };
    node.visit_with(&Invalid { span: DUMMY_SP } as _, &mut v);
    v.found
}

struct ArrowVisitor {
    found: bool,
}
impl Visit for ArrowVisitor {
    fn visit_arrow_expr(&mut self, _: &ArrowExpr, _: &dyn Node) {
        self.found = true;
    }
}
