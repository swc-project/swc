use crate::{
    helpers::Helpers,
    util::{alias_ident_for, prepend, ExprFactory},
};
use ast::*;
use std::{iter, mem};
use swc_common::{Fold, FoldWith, Mark, DUMMY_SP};

pub(super) struct FieldAccessFolder<'a> {
    pub mark: Mark,
    pub vars: Vec<VarDeclarator>,
    pub helpers: &'a Helpers,
}

impl<'a> Fold<Expr> for FieldAccessFolder<'a> {
    fn fold(&mut self, e: Expr) -> Expr {
        match e {
            Expr::Call(CallExpr {
                span,
                callee: ExprOrSuper::Expr(box Expr::Member(callee)),
                args,
                type_args,
            }) => {
                let (e, this) = self.fold_member_expr(callee);

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
            Expr::Member(e) => self.fold_member_expr(e).0,
            _ => return e.fold_children(self),
        }
    }
}

impl<'a> FieldAccessFolder<'a> {
    /// Returns `(expr, thisObject)`
    fn fold_member_expr(&mut self, e: MemberExpr) -> (Expr, Option<Expr>) {
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
                let var = alias_ident_for(&obj, "_ref");
                self.vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(var.clone()),
                    init: None,
                    definite: false,
                });

                (
                    CallExpr {
                        span: DUMMY_SP,
                        callee: get,
                        args: vec![
                            AssignExpr {
                                span: DUMMY_SP,
                                left: PatOrExpr::Pat(box Pat::Ident(var.clone())),
                                op: op!("="),
                                right: obj,
                            }
                            .as_arg(),
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
