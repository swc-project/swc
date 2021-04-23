use swc_atoms::js_word;
use swc_common::{Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::Check;
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_utils::quote_ident;
use swc_ecma_utils::ExprFactory;
use swc_ecma_utils::{contains_this_expr, private_ident};
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
struct Arrow {
    in_arrow: bool,
}

#[fast_path(ArrowVisitor)]
impl Fold for Arrow {
    noop_fold_type!();

    fn fold_expr(&mut self, e: Expr) -> Expr {
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

                let mut params: Vec<Param> = params
                    .fold_with(self)
                    .into_iter()
                    .map(|pat| Param {
                        span: DUMMY_SP,
                        decorators: Default::default(),
                        pat,
                    })
                    .collect();

                // If we aren't already in an arrow expression, check if there is
                // any arguments references within this function. If so, we need to
                // replace them so that they refer to the parent function environment.
                let (body, used_arguments) = if !self.in_arrow {
                    let mut arguments_replacer = ArgumentsReplacer {
                        arguments: private_ident!("_arguments"),
                        found: false,
                    };
                    let body = body.fold_with(&mut arguments_replacer);

                    if arguments_replacer.found {
                        params.insert(
                            0,
                            Param {
                                span: DUMMY_SP,
                                decorators: Default::default(),
                                pat: Pat::Ident(BindingIdent::from(
                                    arguments_replacer.arguments.clone(),
                                )),
                            },
                        );
                    }
                    (body, arguments_replacer.found)
                } else {
                    (body, false)
                };

                let in_arrow = self.in_arrow;
                self.in_arrow = true;
                let body = body.fold_with(self);
                self.in_arrow = in_arrow;

                let fn_expr = Expr::Fn(FnExpr {
                    ident: None,
                    function: Function {
                        decorators: vec![],
                        span,
                        params,
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

                if !used_this && !used_arguments {
                    return fn_expr;
                }

                let mut args = vec![ThisExpr { span: DUMMY_SP }.as_arg()];
                if used_arguments {
                    args.push(quote_ident!("arguments").as_arg());
                }

                Expr::Call(CallExpr {
                    span,
                    callee: fn_expr.make_member(quote_ident!("bind")).as_callee(),
                    args,
                    type_args: Default::default(),
                })
            }
            _ => e.fold_children_with(self),
        }
    }

    fn fold_constructor(&mut self, c: Constructor) -> Constructor {
        let in_arrow = self.in_arrow;
        self.in_arrow = false;
        let res = c.fold_children_with(self);
        self.in_arrow = in_arrow;
        res
    }

    fn fold_function(&mut self, f: Function) -> Function {
        let in_arrow = self.in_arrow;
        self.in_arrow = false;
        let res = f.fold_children_with(self);
        self.in_arrow = in_arrow;
        res
    }
}

struct ArgumentsReplacer {
    arguments: Ident,
    found: bool,
}

impl Fold for ArgumentsReplacer {
    noop_fold_type!();

    fn fold_expr(&mut self, e: Expr) -> Expr {
        match e {
            Expr::Ident(id) if id.sym == js_word!("arguments") => {
                self.found = true;
                Expr::Ident(self.arguments.clone())
            }
            _ => e.fold_children_with(self),
        }
    }

    /// Don't recurse into prop of member expression unless computed
    fn fold_member_expr(&mut self, m: MemberExpr) -> MemberExpr {
        let prop = match &*m.prop {
            Expr::Ident(id) if !m.computed => Expr::Ident(id.clone()),
            v => v.clone().fold_with(self),
        };

        MemberExpr {
            span: m.span,
            obj: m.obj.fold_with(self),
            prop: Box::new(prop),
            computed: m.computed,
        }
    }

    /// Don't recurse into constructor
    fn fold_constructor(&mut self, c: Constructor) -> Constructor {
        c
    }

    /// Don't recurse into fn
    fn fold_function(&mut self, f: Function) -> Function {
        f
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
