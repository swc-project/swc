use std::mem;

use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    function::{init_this, FnEnvHoister},
    prepend_stmt,
};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, InjectVars, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

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
#[tracing::instrument(level = "info", skip_all)]
pub fn arrow() -> impl Fold + VisitMut + InjectVars {
    as_folder(Arrow::default())
}

#[derive(Default)]
struct Arrow {
    in_subclass: bool,
    hoister: FnEnvHoister,
}

#[swc_trace]
impl VisitMut for Arrow {
    noop_visit_mut_type!();

    fn visit_mut_class(&mut self, c: &mut Class) {
        if c.super_class.is_some() {
            self.in_subclass = true;
        }
        c.visit_mut_children_with(self);
        self.in_subclass = false;
    }

    fn visit_mut_constructor(&mut self, c: &mut Constructor) {
        c.params.visit_mut_children_with(self);

        if let Some(BlockStmt { span: _, stmts }) = &mut c.body {
            let old_rep = self.hoister.take();

            stmts.visit_mut_children_with(self);

            if self.in_subclass {
                let (decl, this_id) =
                    mem::replace(&mut self.hoister, old_rep).to_stmt_in_subclass();

                if let Some(stmt) = decl {
                    if let Some(this_id) = this_id {
                        init_this(stmts, &this_id)
                    }
                    prepend_stmt(stmts, stmt);
                }
            } else {
                let decl = mem::replace(&mut self.hoister, old_rep).to_stmt();

                if let Some(stmt) = decl {
                    prepend_stmt(stmts, stmt);
                }
            }
        }
    }

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        match expr {
            Expr::Arrow(ArrowExpr {
                span,
                params,
                body,
                is_async,
                is_generator,
                ..
            }) => {
                params.visit_mut_with(self);
                params.visit_mut_with(&mut self.hoister);

                let params: Vec<Param> = params
                    .take()
                    .into_iter()
                    .map(|pat| Param {
                        span: DUMMY_SP,
                        decorators: Default::default(),
                        pat,
                    })
                    .collect();

                body.visit_mut_with(self);

                body.visit_mut_with(&mut self.hoister);

                let fn_expr = Expr::Fn(FnExpr {
                    ident: None,
                    function: Function {
                        decorators: vec![],
                        span: *span,
                        params,
                        is_async: *is_async,
                        is_generator: *is_generator,
                        body: Some(match body {
                            BlockStmtOrExpr::BlockStmt(block) => block.take(),
                            BlockStmtOrExpr::Expr(expr) => BlockStmt {
                                span: DUMMY_SP,
                                stmts: vec![Stmt::Return(ReturnStmt {
                                    // this is needed so
                                    // () => /* 123 */ 1 would become
                                    // function { return /*123 */ 123 }
                                    span: DUMMY_SP,
                                    arg: Some(expr.take()),
                                })],
                            },
                        }),
                        type_params: Default::default(),
                        return_type: Default::default(),
                    },
                });

                *expr = fn_expr;
            }
            _ => {
                expr.visit_mut_children_with(self);
            }
        }
    }

    fn visit_mut_function(&mut self, f: &mut Function) {
        f.visit_mut_children_with(self);
    }

    fn visit_mut_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        stmts.visit_mut_children_with(self);

        let decl = self.hoister.take().to_stmt();

        if let Some(stmt) = decl {
            prepend_stmt(stmts, ModuleItem::Stmt(stmt));
        }
    }

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        let old_rep = self.hoister.take();

        stmts.visit_mut_children_with(self);

        let decl = mem::replace(&mut self.hoister, old_rep).to_stmt();

        if let Some(stmt) = decl {
            prepend_stmt(stmts, stmt);
        }
    }
}

impl InjectVars for Arrow {
    fn take_vars(&mut self) -> Vec<VarDeclarator> {
        self.hoister.take().to_decl()
    }
}
