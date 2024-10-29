use std::mem;

use swc_common::{util::take::Take, Mark, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    function::{init_this, FnEnvHoister},
    prepend_stmt,
};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, InjectVars, VisitMut, VisitMutWith};
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
pub fn arrow(unresolved_mark: Mark) -> impl Pass + VisitMut + InjectVars {
    visit_mut_pass(Arrow {
        in_subclass: false,
        hoister: FnEnvHoister::new(SyntaxContext::empty().apply_mark(unresolved_mark)),
    })
}

#[derive(Default)]
struct Arrow {
    in_subclass: bool,
    hoister: FnEnvHoister,
}

#[swc_trace]
impl VisitMut for Arrow {
    noop_visit_mut_type!(fail);

    fn visit_mut_class(&mut self, c: &mut Class) {
        let old = self.in_subclass;

        if c.super_class.is_some() {
            self.in_subclass = true;
        }
        c.visit_mut_children_with(self);
        self.in_subclass = old;
    }

    fn visit_mut_constructor(&mut self, c: &mut Constructor) {
        c.params.visit_mut_children_with(self);

        if let Some(BlockStmt { span: _, stmts, .. }) = &mut c.body {
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

                let fn_expr = Function {
                    decorators: Vec::new(),
                    span: *span,
                    params,
                    is_async: *is_async,
                    is_generator: *is_generator,
                    body: Some(match &mut **body {
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
                            ..Default::default()
                        },
                    }),
                    ..Default::default()
                }
                .into();

                *expr = fn_expr;
            }
            _ => {
                expr.visit_mut_children_with(self);
            }
        }
    }

    fn visit_mut_function(&mut self, f: &mut Function) {
        let old_rep = self.hoister.take();

        f.visit_mut_children_with(self);

        let decl = mem::replace(&mut self.hoister, old_rep).to_stmt();

        if let (Some(body), Some(stmt)) = (&mut f.body, decl) {
            prepend_stmt(&mut body.stmts, stmt);
        }
    }

    fn visit_mut_getter_prop(&mut self, f: &mut GetterProp) {
        f.key.visit_mut_with(self);

        if let Some(body) = &mut f.body {
            let old_rep = self.hoister.take();

            body.visit_mut_with(self);

            let decl = mem::replace(&mut self.hoister, old_rep).to_stmt();

            if let Some(stmt) = decl {
                prepend_stmt(&mut body.stmts, stmt);
            }
        }
    }

    fn visit_mut_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        stmts.visit_mut_children_with(self);

        let decl = self.hoister.take().to_stmt();

        if let Some(stmt) = decl {
            prepend_stmt(stmts, stmt.into());
        }
    }

    fn visit_mut_script(&mut self, script: &mut Script) {
        script.visit_mut_children_with(self);

        let decl = self.hoister.take().to_stmt();

        if let Some(stmt) = decl {
            prepend_stmt(&mut script.body, stmt);
        }
    }

    fn visit_mut_setter_prop(&mut self, f: &mut SetterProp) {
        f.key.visit_mut_with(self);
        f.param.visit_mut_with(self);

        if let Some(body) = &mut f.body {
            let old_rep = self.hoister.take();

            body.visit_mut_with(self);

            let decl = mem::replace(&mut self.hoister, old_rep).to_stmt();

            if let Some(stmt) = decl {
                prepend_stmt(&mut body.stmts, stmt);
            }
        }
    }
}

impl InjectVars for Arrow {
    fn take_vars(&mut self) -> Vec<VarDeclarator> {
        self.hoister.take().to_decl()
    }
}
