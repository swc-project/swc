use swc_atoms::js_word;
use swc_common::{util::take::Take, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{contains_this_expr, prepend, private_ident};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, InjectVars, VisitMut, VisitMutWith};

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
pub fn arrow() -> impl Fold + VisitMut + InjectVars {
    as_folder(Arrow::default())
}

#[derive(Default)]
struct Arrow {
    in_arrow: bool,
    vars: Vec<VarDeclarator>,
}

impl VisitMut for Arrow {
    noop_visit_mut_type!();

    fn visit_mut_constructor(&mut self, c: &mut Constructor) {
        let in_arrow = self.in_arrow;
        self.in_arrow = false;
        c.visit_mut_children_with(self);
        self.in_arrow = in_arrow;
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

                let params: Vec<Param> = params
                    .take()
                    .into_iter()
                    .map(|pat| Param {
                        span: DUMMY_SP,
                        decorators: Default::default(),
                        pat,
                    })
                    .collect();

                let mut arguments_var = None;

                let in_arrow = self.in_arrow;
                self.in_arrow = true;
                body.visit_mut_with(self);
                self.in_arrow = in_arrow;

                let body = {
                    let mut arguments_replacer = ArgumentsReplacer {
                        arguments: private_ident!("_arguments"),
                        found: false,
                    };
                    body.visit_mut_with(&mut arguments_replacer);

                    if arguments_replacer.found {
                        arguments_var = Some(arguments_replacer.arguments.clone());
                    }
                    body
                };

                let used_this = contains_this_expr(&*body);

                let this_id = if used_this {
                    Some(private_ident!("_this"))
                } else {
                    None
                };

                if let Some(this_id) = this_id.clone() {
                    self.vars.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(this_id.clone().into()),
                        init: Some(Box::new(Expr::This(ThisExpr { span: DUMMY_SP }))),
                        definite: false,
                    });

                    body.visit_mut_with(&mut ThisReplacer { to: &this_id })
                }

                if let Some(id) = arguments_var.clone() {
                    self.vars.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(id.into()),
                        init: Some(Box::new(Expr::Ident(Ident::new(
                            js_word!("arguments"),
                            DUMMY_SP,
                        )))),
                        definite: false,
                    });
                }

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
                                    span: expr.span(),
                                    arg: Some(expr.take()),
                                })],
                            },
                        }),
                        type_params: Default::default(),
                        return_type: Default::default(),
                    },
                });

                *expr = fn_expr;
                return;
            }
            _ => {
                expr.visit_mut_children_with(self);
            }
        }
    }

    fn visit_mut_function(&mut self, f: &mut Function) {
        let in_arrow = self.in_arrow;
        self.in_arrow = false;
        f.visit_mut_children_with(self);
        self.in_arrow = in_arrow;
    }

    fn visit_mut_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        stmts.visit_mut_children_with(self);

        if !self.vars.is_empty() {
            prepend(
                stmts,
                ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: self.vars.take(),
                }))),
            );
        }
    }

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        let old_vars = self.vars.take();

        stmts.visit_mut_children_with(self);
        if !self.vars.is_empty() {
            prepend(
                stmts,
                Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: self.vars.take(),
                })),
            );
        }

        self.vars = old_vars;
    }
}

impl InjectVars for Arrow {
    fn take_vars(&mut self) -> Vec<VarDeclarator> {
        self.vars.take()
    }
}

struct ArgumentsReplacer {
    arguments: Ident,
    found: bool,
}

impl VisitMut for ArgumentsReplacer {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        match e {
            Expr::Ident(id) if id.sym == js_word!("arguments") => {
                self.found = true;
                *e = Expr::Ident(self.arguments.clone());
            }
            _ => e.visit_mut_children_with(self),
        }
    }

    /// Don't recurse into prop of member expression unless computed
    fn visit_mut_member_expr(&mut self, m: &mut MemberExpr) {
        if m.computed {
            m.prop.visit_mut_with(self);
        }

        m.obj.visit_mut_with(self);
    }

    /// Don't recurse into constructor
    fn visit_mut_constructor(&mut self, _: &mut Constructor) {}

    /// Don't recurse into fn
    fn visit_mut_function(&mut self, _: &mut Function) {}
}

struct ThisReplacer<'a> {
    to: &'a Ident,
}

impl VisitMut for ThisReplacer<'_> {
    noop_visit_mut_type!();

    fn visit_mut_arrow_expr(&mut self, _: &mut ArrowExpr) {}

    fn visit_mut_constructor(&mut self, _: &mut Constructor) {}

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        match e {
            Expr::This(..) => {
                *e = Expr::Ident(self.to.clone());
            }

            _ => {}
        }
    }

    fn visit_mut_function(&mut self, _: &mut Function) {}

    /// Don't recurse into fn
    fn visit_mut_getter_prop(&mut self, n: &mut GetterProp) {
        n.key.visit_mut_with(self);
    }

    /// Don't recurse into fn
    fn visit_mut_method_prop(&mut self, n: &mut MethodProp) {
        n.key.visit_mut_with(self);
        n.function.visit_mut_with(self);
    }

    /// Don't recurse into fn
    fn visit_mut_setter_prop(&mut self, n: &mut SetterProp) {
        n.key.visit_mut_with(self);
        n.param.visit_mut_with(self);
    }
}
