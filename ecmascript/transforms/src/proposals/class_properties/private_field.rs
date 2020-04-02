use crate::util::{alias_ident_for, alias_if_required, prepend, ExprFactory};
use std::collections::HashSet;
use std::{iter, mem};
use swc_atoms::JsWord;
use swc_common::{Fold, FoldWith, Mark, Spanned, DUMMY_SP};
use swc_ecma_ast::*;

pub(super) struct FieldAccessFolder<'a> {
    pub mark: Mark,
    pub class_name: &'a Ident,
    pub vars: Vec<VarDeclarator>,
    pub statics: &'a HashSet<JsWord>,
    pub in_assign_pat: bool,
}

noop_fold_type!(FieldAccessFolder<'_>);

impl<'a> Fold<Expr> for FieldAccessFolder<'a> {
    fn fold(&mut self, e: Expr) -> Expr {
        match e {
            Expr::Update(UpdateExpr {
                span,
                prefix,
                op,
                arg: box Expr::Member(arg),
            }) => {
                let n = match *arg.prop {
                    Expr::PrivateName(ref n) => n,
                    _ => {
                        return Expr::Update(UpdateExpr {
                            span,
                            prefix,
                            op,
                            arg: box Expr::Member(arg),
                        })
                        .fold_children(self);
                    }
                };

                let obj = match arg.obj {
                    ExprOrSuper::Super(..) => {
                        return Expr::Update(UpdateExpr {
                            span,
                            prefix,
                            op,
                            arg: box Expr::Member(arg),
                        })
                        .fold_children(self);
                    }
                    ExprOrSuper::Expr(ref obj) => obj.clone(),
                };

                let is_static = self.statics.contains(&n.id.sym);
                let ident = Ident::new(
                    format!("_{}", n.id.sym).into(),
                    n.id.span.apply_mark(self.mark),
                );

                let var = alias_ident_for(&obj, "_ref");

                let this = if match *obj {
                    Expr::This(..) => true,
                    _ => false,
                } {
                    ThisExpr { span: DUMMY_SP }.as_arg()
                } else if is_static {
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
                };
                // Used iff !prefix
                let old_var = alias_ident_for(&arg.prop, "old");
                if !prefix {
                    self.vars.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(old_var.clone()),
                        init: None,
                        definite: false,
                    });
                }

                let value = {
                    let arg = box self.fold_private_get(arg, Some(var)).0;
                    let left = box Expr::Unary(UnaryExpr {
                        span: DUMMY_SP,
                        op: op!(unary, "+"),
                        arg,
                    });
                    let left = if prefix {
                        left
                    } else {
                        box Expr::Assign(AssignExpr {
                            span: DUMMY_SP,
                            left: PatOrExpr::Pat(box Pat::Ident(old_var.clone())),
                            op: op!("="),
                            right: left,
                        })
                    };

                    BinExpr {
                        span: DUMMY_SP,
                        left,
                        op: match op {
                            op!("++") => op!(bin, "+"),
                            op!("--") => op!(bin, "-"),
                        },
                        right: box Expr::Lit(Lit::Num(Number {
                            span: DUMMY_SP,
                            value: 1.0,
                        })),
                    }
                    .as_arg()
                };

                let expr = if is_static {
                    Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: helper!(
                            class_static_private_field_spec_set,
                            "classStaticPrivateFieldSpecSet"
                        ),
                        args: vec![
                            this,
                            self.class_name.clone().as_arg(),
                            ident.as_arg(),
                            value,
                        ],

                        type_args: Default::default(),
                    })
                } else {
                    Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: helper!(class_private_field_set, "classPrivateFieldSet"),
                        args: vec![this, ident.as_arg(), value],

                        type_args: Default::default(),
                    })
                };

                if prefix {
                    expr
                } else {
                    Expr::Seq(SeqExpr {
                        span: DUMMY_SP,
                        exprs: vec![box expr, box Expr::Ident(old_var)],
                    })
                }
            }

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
                        })
                        .fold_children(self);
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
                        })
                        .fold_children(self);
                    }
                    ExprOrSuper::Expr(ref obj) => obj.clone(),
                };

                let is_static = self.statics.contains(&n.id.sym);
                let ident = Ident::new(
                    format!("_{}", n.id.sym).into(),
                    n.id.span.apply_mark(self.mark),
                );

                let var = alias_ident_for(&obj, "_ref");

                let this = if match *obj {
                    Expr::This(..) => true,
                    _ => false,
                } {
                    ThisExpr { span: DUMMY_SP }.as_arg()
                } else if op == op!("=") {
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

                if is_static {
                    Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: helper!(
                            class_static_private_field_spec_set,
                            "classStaticPrivateFieldSpecSet"
                        ),
                        args: vec![
                            this,
                            self.class_name.clone().as_arg(),
                            ident.as_arg(),
                            value,
                        ],

                        type_args: Default::default(),
                    })
                } else {
                    let set = helper!(class_private_field_set, "classPrivateFieldSet");

                    Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: set,
                        args: vec![this, ident.as_arg(), value],

                        type_args: Default::default(),
                    })
                }
            }

            Expr::Assign(AssignExpr {
                span,
                left: PatOrExpr::Pat(left),
                op,
                right,
            }) => {
                self.in_assign_pat = true;
                let left = left.fold_with(self);
                self.in_assign_pat = false;

                Expr::Assign(AssignExpr {
                    span,
                    left: PatOrExpr::Pat(left),
                    op,
                    right,
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
                        callee: e.member(quote_ident!("call")).as_callee(),
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
                    .fold_children(self)
                }
            }
            Expr::Member(e) => self.fold_private_get(e, None).0,
            _ => e.fold_children(self),
        }
    }
}

impl Fold<Pat> for FieldAccessFolder<'_> {
    fn fold(&mut self, p: Pat) -> Pat {
        match p {
            Pat::Expr(box Expr::Member(MemberExpr {
                prop: box Expr::PrivateName(..),
                ..
            })) => {
                self.in_assign_pat = true;
                let p = p.fold_children(self);
                self.in_assign_pat = false;

                p
            }
            _ => {
                self.in_assign_pat = false;

                p.fold_children(self)
            }
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

        let is_static = self.statics.contains(&n.id.sym);
        let ident = Ident::new(
            format!("_{}", n.id.sym).into(),
            n.id.span.apply_mark(self.mark),
        );

        if is_static {
            let get = helper!(
                class_static_private_field_spec_get,
                "classStaticPrivateFieldSpecGet"
            );

            (
                Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: get,
                    args: vec![
                        obj.as_arg(),
                        self.class_name.clone().as_arg(),
                        ident.as_arg(),
                    ],
                    type_args: Default::default(),
                }),
                Some(Expr::Ident(self.class_name.clone())),
            )
        } else {
            if self.in_assign_pat {
                let set = helper!(
                    class_private_field_destructure,
                    "classPrivateFieldDestructureSet"
                );

                return match *obj {
                    Expr::This(this) => (
                        CallExpr {
                            span: DUMMY_SP,
                            callee: set,
                            args: vec![this.as_arg(), ident.as_arg()],

                            type_args: Default::default(),
                        }
                        .member(quote_ident!("value"))
                        .into(),
                        Some(Expr::This(this)),
                    ),
                    _ => unimplemented!("destructuring set for object except this"),
                };
            }

            let get = helper!(class_private_field_get, "classPrivateFieldGet");

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
                    let mut aliased = false;
                    let var = obj_alias.unwrap_or_else(|| {
                        let (var, a) = alias_if_required(&obj, "_ref");
                        if a {
                            aliased = true;
                            self.vars.push(VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(var.clone()),
                                init: None,
                                definite: false,
                            });
                        }
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
                                    if aliased {
                                        AssignExpr {
                                            span: DUMMY_SP,
                                            left: PatOrExpr::Pat(box Pat::Ident(var.clone())),
                                            op: op!("="),
                                            right: obj,
                                        }
                                        .as_arg()
                                    } else {
                                        var.clone().as_arg()
                                    }
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
