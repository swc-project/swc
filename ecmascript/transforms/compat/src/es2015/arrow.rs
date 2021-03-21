use swc_common::{Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::Check;
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_utils::contains_this_expr;
use swc_ecma_utils::quote_ident;
use swc_ecma_utils::ExprFactory;
use swc_ecma_visit::noop_visit_type;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith, Node, Visit};

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
    Arrow::default()
}

#[derive(Default)]
struct Arrow;

#[fast_path(ArrowVisitor)]
impl Fold for Arrow {
    noop_fold_type!();

    fn fold_expr(&mut self, e: Expr) -> Expr {
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

#[derive(Default)]
struct ArrowVisitor {
    found: bool,
}

impl Visit for ArrowVisitor {
    noop_visit_type!();

    fn visit_arrow_expr(&mut self, _: &ArrowExpr, _: &dyn Node) {
        self.found = true;
    }
}

impl Check for ArrowVisitor {
    fn should_handle(&self) -> bool {
        self.found
    }
}
