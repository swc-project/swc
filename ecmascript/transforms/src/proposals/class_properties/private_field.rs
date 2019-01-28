use crate::{
    helpers::Helpers,
    util::{alias_ident_for, prepend, ExprFactory},
};
use ast::*;
use std::{iter, mem};
use swc_common::{Fold, FoldWith, Mark, Spanned, DUMMY_SP};

pub(super) struct FieldAccessFolder<'a> {
    pub mark: Mark,
    pub vars: Vec<VarDeclarator>,
    pub helpers: &'a Helpers,
}

impl<'a> Fold<Expr> for FieldAccessFolder<'a> {
    fn fold(&mut self, e: Expr) -> Expr {
        match e {
            Expr::Assign(AssignExpr {
                span,
                left: PatOrExpr::Pat(box Pat::Expr(box Expr::Member(left))),
                op,
                right,
            })
            | Expr::Assign(AssignExpr {
                span,
                left: PatOrExpr::Expr(box Expr::Member(left)),
                op,
                right,
            }) => {
                let n = match *left.prop {
                    Expr::PrivateName(ref n) => n.clone(),
                    _ => {
                        return Expr::Assign(AssignExpr {
                            span,
                            left: PatOrExpr::Expr(box Expr::Member(left)),
                            op,
                            right,
                        });
                    }
                };

                let obj = match left.obj {
                    ExprOrSuper::Super(..) => {
                        return Expr::Assign(AssignExpr {
                            span,
                            left: PatOrExpr::Expr(box Expr::Member(MemberExpr {
                                prop: box Expr::PrivateName(n),
                                ..left
                            })),
                            op,
                            right,
                        });
                    }
                    ExprOrSuper::Expr(ref obj) => obj.clone(),
                };

                let ident = Ident::new(n.id.sym, n.id.span.apply_mark(self.mark));

                let var = alias_ident_for(&obj, "_ref");

                let this = if match *obj {
                    Expr::This(..) => true,
                    _ => false,
                } {
                    ThisExpr { span: DUMMY_SP }.as_arg()
                } else {
                    if op == op!("=") {
                        obj.as_arg()
                    } else {
                        self.vars.push(VarDeclarator {
                            span: DUMMY_SP,
                            name: Pat::Ident(var.clone()),
                            init: None,
                            definite: false,
                        });
                        AssignExpr {
                            span: obj.span(),
                            left: PatOrExpr::Pat(box Pat::Ident(var.clone())),
                            op: op!("="),
                            right: obj,
                        }
                        .as_arg()
                    }
                };

                let value = if op == op!("=") {
                    right.as_arg()
                } else {
                    let left = box self.fold_private_get(left, Some(var)).0;

                    BinExpr {
                        span: DUMMY_SP,
                        left,
                        op: match op {
                            op!("=") => unreachable!(),

                            op!("+=") => op!(bin, "+"),
                            op!("-=") => op!(bin, "-"),
                            op!("*=") => op!("*"),
                            op!("/=") => op!("/"),
                            op!("%=") => op!("%"),
                            op!("<<=") => op!("<<"),
                            op!(">>=") => op!(">>"),
                            op!(">>>=") => op!(">>>"),
                            op!("|=") => op!("|"),
                            op!("&=") => op!("&"),
                            op!("^=") => op!("^"),
                            op!("**=") => op!("**"),
                        },
                        right,
                    }
                    .as_arg()
                };

                self.helpers.class_private_field_set();
                let set = quote_ident!("_classPrivateFieldSet").as_callee();

                Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: set,
                    args: vec![this, ident.as_arg(), value],

                    type_args: Default::default(),
                })
            }

            Expr::Call(CallExpr {
                span,
                callee: ExprOrSuper::Expr(box Expr::Member(callee)),
                args,
                type_args,
            }) => {
                let (e, this) = self.fold_private_get(callee, None);

                if let Some(this) = this {
                    Expr::Call(CallExpr {
                        span,
                        callee: MemberExpr {
                            span: DUMMY_SP,
                            obj: e.as_obj(),
                            prop: member_expr!(DUMMY_SP, call),
                            computed: false,
                        }
                        .as_callee(),
                        args: iter::once(this.as_arg()).chain(args).collect(),
                        type_args,
                    })
                } else {
                    Expr::Call(CallExpr {
                        span,
                        callee: ExprOrSuper::Expr(box e),
                        args,
                        type_args,
                    })
                }
            }
            Expr::Member(e) => self.fold_private_get(e, None).0,
            _ => return e.fold_children(self),
        }
    }
}

impl<'a> FieldAccessFolder<'a> {
    /// Returns `(expr, thisObject)`
    ///
    ///   - `obj_alias`: If alias is already declared, this method will use
    ///     `obj_alias` instead of declaring a new one.
    fn fold_private_get(
        &mut self,
        e: MemberExpr,
        obj_alias: Option<Ident>,
    ) -> (Expr, Option<Expr>) {
        let is_alias_initialized = obj_alias.is_some();

        let n = match *e.prop {
            Expr::PrivateName(n) => n,
            _ => return (Expr::Member(e), None),
        };

        let obj = match e.obj {
            ExprOrSuper::Super(..) => {
                return (
                    Expr::Member(MemberExpr {
                        prop: box Expr::PrivateName(n),
                        ..e
                    }),
                    None,
                );
            }
            ExprOrSuper::Expr(obj) => obj,
        };

        let ident = Ident::new(n.id.sym, n.id.span.apply_mark(self.mark));

        self.helpers.class_private_field_get();
        let get = quote_ident!("_classPrivateFieldGet").as_callee();

        match *obj {
            Expr::This(this) => (
                CallExpr {
                    span: DUMMY_SP,
                    callee: get,
                    args: vec![this.as_arg(), ident.as_arg()],

                    type_args: Default::default(),
                }
                .into(),
                Some(Expr::This(this)),
            ),
            _ => {
                let var = obj_alias.unwrap_or_else(|| {
                    let var = alias_ident_for(&obj, "_ref");
                    self.vars.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(var.clone()),
                        init: None,
                        definite: false,
                    });
                    var
                });

                (
                    CallExpr {
                        span: DUMMY_SP,
                        callee: get,
                        args: vec![
                            if is_alias_initialized {
                                var.clone().as_arg()
                            } else {
                                AssignExpr {
                                    span: DUMMY_SP,
                                    left: PatOrExpr::Pat(box Pat::Ident(var.clone())),
                                    op: op!("="),
                                    right: obj,
                                }
                                .as_arg()
                            },
                            ident.as_arg(),
                        ],

                        type_args: Default::default(),
                    }
                    .into(),
                    Some(Expr::Ident(var)),
                )
            }
        }
    }
}

macro_rules! take_vars {
    ($T:tt) => {
        impl<'a> Fold<$T> for FieldAccessFolder<'a> {
            fn fold(&mut self, f: $T) -> $T {
                assert!(self.vars.is_empty());
                if f.body.is_none() {
                    return f;
                }

                let mut f = f.fold_children(self);

                if !self.vars.is_empty() {
                    prepend(
                        &mut f.body.as_mut().unwrap().stmts,
                        Stmt::Decl(Decl::Var(VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            decls: mem::replace(&mut self.vars, vec![]),

                            declare: false,
                        })),
                    )
                }

                f
            }
        }
    };
}

take_vars!(Function);
take_vars!(Constructor);
