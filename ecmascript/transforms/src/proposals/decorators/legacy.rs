use crate::util::{alias_if_required, prepend, ExprFactory, StmtLike};
use ast::*;
use smallvec::SmallVec;
use std::mem::replace;
use swc_common::{util::move_map::MoveMap, Fold, FoldWith, Spanned, DUMMY_SP};

#[derive(Debug, Default)]
pub(super) struct Legacy {
    vars: Vec<VarDeclarator>,
}

impl<T> Fold<Vec<T>> for Legacy
where
    T: FoldWith<Self> + StmtLike + ::std::fmt::Debug,
{
    fn fold(&mut self, stmts: Vec<T>) -> Vec<T> {
        let mut stmts = stmts.fold_children(self);

        if !self.vars.is_empty() {
            prepend(
                &mut stmts,
                T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: replace(&mut self.vars, Default::default()),
                    declare: false,
                }))),
            );
        }

        stmts
    }
}

impl Fold<Expr> for Legacy {
    fn fold(&mut self, e: Expr) -> Expr {
        let e: Expr = e.fold_children(self);

        match e {
            Expr::Class(e) if !e.class.decorators.is_empty() => {
                let expr = self.handle(e);

                return *expr;
            }

            _ => {}
        }

        e
    }
}

impl Fold<Decl> for Legacy {
    fn fold(&mut self, decl: Decl) -> Decl {
        let decl: Decl = decl.fold_children(self);

        match decl {
            Decl::Class(c) if !c.class.decorators.is_empty() => {
                let expr = self.handle(ClassExpr {
                    class: c.class,
                    ident: Some(c.ident.clone()),
                });

                return Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Let,
                    declare: false,
                    decls: vec![VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(c.ident),
                        init: Some(expr),
                        definite: false,
                    }],
                });
            }

            _ => {}
        }

        decl
    }
}

impl Legacy {
    fn handle(&mut self, mut c: ClassExpr) -> Box<Expr> {
        let cls_ident = private_ident!("_class");

        let mut extra_exprs = vec![];

        c.class.body = c.class.body.move_flat_map(|m| match m {
            ClassMember::Method(m) if !m.function.decorators.is_empty() => {
                // _applyDecoratedDescriptor(_class2.prototype, "method2", [_dec7, _dec8],
                // Object.getOwnPropertyDescriptor(_class2.prototype, "method2"),
                // _class2.prototype)

                let mut dec_exprs = vec![];
                for dec in m.function.decorators.into_iter() {
                    let (i, aliased) = alias_if_required(&dec.expr, "_dec");
                    if aliased {
                        self.vars.push(VarDeclarator {
                            span: DUMMY_SP,
                            name: Pat::Ident(i.clone()),
                            init: Some(dec.expr),
                            definite: false,
                        });
                    }

                    dec_exprs.push(Some(i.as_arg()))
                }

                let callee = helper!(apply_decorated_descriptor, "applyDecoratedDescriptor");

                let prototype = MemberExpr {
                    span: DUMMY_SP,
                    obj: ExprOrSuper::Expr(box Expr::Ident(cls_ident.clone())),
                    prop: box quote_ident!("prototype").into(),
                    computed: false,
                };
                let name = Lit::Str(Str {
                    span: m.key.span(),
                    value: match m.key {
                        PropName::Ident(ref i) => i.sym.clone(),
                        PropName::Str(ref v) => v.value.clone(),
                        _ => unimplemented!(
                            "decorators on methods with key other than ident / string"
                        ),
                    },
                    has_escape: false,
                });

                extra_exprs.push(box Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee,
                    // (_class2.prototype, "method2", [_dec7, _dec8],
                    // Object.getOwnPropertyDescriptor(_class2.prototype, "method2"),
                    // _class2.prototype)
                    args: vec![
                        // _class2.prototype,
                        prototype.clone().as_arg(),
                        // "method2"
                        name.clone().as_arg(),
                        // [_dec7, _dec8],
                        ArrayLit {
                            span: DUMMY_SP,
                            elems: dec_exprs,
                        }
                        .as_arg(),
                        // Object.getOwnPropertyDescriptor(_class2.prototype, "method2"),
                        CallExpr {
                            span: DUMMY_SP,
                            callee: member_expr!(DUMMY_SP, Object.getOwnPropertyDescriptor)
                                .as_callee(),
                            args: vec![prototype.clone().as_arg(), name.as_arg()],
                            type_args: None,
                        }
                        .as_arg(),
                        // _class2.prototype
                        prototype.as_arg(),
                    ],
                    type_args: None,
                }));

                Some(ClassMember::Method(ClassMethod {
                    function: Function {
                        decorators: vec![],
                        ..m.function
                    },
                    ..m
                }))
            }

            _ => Some(m),
        });

        let cls_assign = box Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            op: op!("="),
            left: PatOrExpr::Pat(box Pat::Ident(cls_ident.clone())),
            right: box Expr::Class(ClassExpr {
                ident: c.ident.clone(),
                class: Class {
                    decorators: vec![],
                    ..c.class
                },
            }),
        });

        let var_init = box Expr::Bin(BinExpr {
            span: DUMMY_SP,
            left: cls_assign,
            op: op!("||"),
            right: box Expr::Ident(cls_ident.clone()),
        });

        let expr = self.apply(
            if extra_exprs.is_empty() {
                var_init
            } else {
                extra_exprs.insert(0, var_init);
                // Return value.
                extra_exprs.push(box Expr::Ident(cls_ident));

                box Expr::Seq(SeqExpr {
                    span: DUMMY_SP,
                    exprs: extra_exprs,
                })
            },
            c.class.decorators,
        );

        expr
    }

    fn apply(&mut self, mut expr: Box<Expr>, decorators: Vec<Decorator>) -> Box<Expr> {
        for dec in decorators.into_iter().rev() {
            let (i, aliased) = alias_if_required(&dec.expr, "_dec");
            if aliased {
                self.vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(i.clone()),
                    init: Some(dec.expr),
                    definite: false,
                });
            }

            expr = box Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: i.as_callee(),
                args: vec![expr.as_arg()],
                type_args: None,
            });
        }

        expr
    }
}
