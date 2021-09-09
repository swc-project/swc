use swc_atoms::js_word;
use swc_common::{util::take::Take, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::Check;
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_utils::{contains_this_expr, prepend, private_ident};
use swc_ecma_visit::{
    noop_fold_type, noop_visit_mut_type, noop_visit_type, Fold, FoldWith, InjectVars, Node, Visit,
    VisitMut, VisitMutWith,
};

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
pub fn arrow() -> impl Fold + InjectVars {
    Arrow::default()
}

#[derive(Default)]
struct Arrow {
    in_arrow: bool,
    vars: Vec<VarDeclarator>,
}

#[fast_path(ArrowVisitor)]
impl Fold for Arrow {
    noop_fold_type!();

    fn fold_constructor(&mut self, c: Constructor) -> Constructor {
        let in_arrow = self.in_arrow;
        self.in_arrow = false;
        let res = c.fold_children_with(self);
        self.in_arrow = in_arrow;
        res
    }

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
                let params: Vec<Param> = params
                    .fold_with(self)
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
                let body = body.fold_with(self);
                self.in_arrow = in_arrow;

                let mut body = {
                    let mut arguments_replacer = ArgumentsReplacer {
                        arguments: private_ident!("_arguments"),
                        found: false,
                    };
                    let body = body.fold_with(&mut arguments_replacer);

                    if arguments_replacer.found {
                        arguments_var = Some(arguments_replacer.arguments.clone());
                    }
                    body
                };

                let used_this = contains_this_expr(&body);

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

                return fn_expr;
            }
            _ => e.fold_children_with(self),
        }
    }

    fn fold_function(&mut self, f: Function) -> Function {
        let in_arrow = self.in_arrow;
        self.in_arrow = false;
        let res = f.fold_children_with(self);
        self.in_arrow = in_arrow;
        res
    }

    fn fold_module_items(&mut self, stmts: Vec<ModuleItem>) -> Vec<ModuleItem> {
        let mut stmts = stmts.fold_children_with(self);
        if !self.vars.is_empty() {
            prepend(
                &mut stmts,
                ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: self.vars.take(),
                }))),
            );
        }

        stmts
    }

    fn fold_stmts(&mut self, stmts: Vec<Stmt>) -> Vec<Stmt> {
        let old_vars = self.vars.take();

        let mut stmts = stmts.fold_children_with(self);
        if !self.vars.is_empty() {
            prepend(
                &mut stmts,
                Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: self.vars.take(),
                })),
            );
        }

        self.vars = old_vars;

        stmts
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
