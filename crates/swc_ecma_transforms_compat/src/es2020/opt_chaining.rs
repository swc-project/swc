use std::{iter::once, mem};

use serde::Deserialize;
use swc_common::{util::take::Take, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    alias_ident_for, alias_if_required, prepend_stmt, private_ident, quote_ident, undefined,
    ExprFactory, StmtLike,
};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

pub fn optional_chaining(c: Config) -> impl Fold + VisitMut {
    as_folder(OptChaining {
        c,
        ..Default::default()
    })
}

#[derive(Default)]
struct OptChaining {
    vars_without_init: Vec<VarDeclarator>,
    vars_with_init: Vec<VarDeclarator>,
    c: Config,
}

#[derive(Debug, Clone, Copy, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub no_document_all: bool,
    #[serde(default)]
    pub pure_getter: bool,
}

impl VisitMut for OptChaining {
    noop_visit_mut_type!();

    fn visit_mut_block_stmt_or_expr(&mut self, expr: &mut BlockStmtOrExpr) {
        match expr {
            BlockStmtOrExpr::BlockStmt(..) => {
                expr.visit_mut_children_with(self);
            }
            BlockStmtOrExpr::Expr(e) => {
                let mut stmt = BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![Stmt::Return(ReturnStmt {
                        span: e.span(),
                        arg: Some(e.take()),
                    })],
                };

                stmt.visit_mut_with(self);
                *expr = BlockStmtOrExpr::BlockStmt(stmt);
            }
        };
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        if let Expr::OptChain(o) = e {
            *e = match self.handle(o, None) {
                Ok(v) => Expr::Cond(v),
                Err(v) => v,
            };
            return;
        }

        e.visit_mut_children_with(self);
    }

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_like(n);
    }

    fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
        self.visit_mut_stmt_like(n);
    }
}

impl OptChaining {
    /// Returns `(obj, value)`
    fn handle_optional_member(&mut self, m: &mut MemberExpr) -> (Ident, CondExpr) {
        let obj_name = alias_ident_for(&m.obj, "_obj");

        m.obj.visit_mut_with(self);

        self.vars_without_init.push(VarDeclarator {
            span: DUMMY_SP,
            name: obj_name.clone().into(),
            init: None,
            definite: false,
        });

        (
            obj_name.clone(),
            CondExpr {
                span: DUMMY_SP,
                test: init_and_eq_null_or_undefined(&obj_name, m.obj.take()),
                cons: undefined(DUMMY_SP),
                alt: Box::new(Expr::Member(MemberExpr {
                    span: m.span,
                    obj: obj_name.clone().into(),
                    prop: m.prop.take(),
                })),
            },
        )
    }

    /// Returns `(alias, value)`
    fn handle(
        &mut self,
        e: &mut OptChainExpr,
        store_this_to: Option<Ident>,
    ) -> Result<CondExpr, Expr> {
        match &mut *e.base {
            OptChainBase::Member(m) => {
                if e.optional {
                    Ok(self.handle_optional_member(m).1)
                } else {
                    m.obj.visit_mut_with(self);

                    Err(Expr::Member(MemberExpr {
                        span: m.span,
                        obj: match store_this_to {
                            Some(alias) => Box::new(Expr::Assign(AssignExpr {
                                span: DUMMY_SP,
                                op: op!("="),
                                left: alias.clone().into(),
                                right: m.obj.take(),
                            })),
                            _ => m.obj.take(),
                        },
                        prop: m.prop.take(),
                    }))
                }
            }
            OptChainBase::Call(call) => {
                let callee_name = alias_ident_for(&call.callee, "_ref");

                self.vars_without_init.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: callee_name.clone().into(),
                    init: None,
                    definite: false,
                });

                let (this, init) = match &mut *call.callee {
                    Expr::Member(callee) => {
                        let obj_name = private_ident!("_memberObj");

                        callee.visit_mut_with(self);

                        self.vars_without_init.push(VarDeclarator {
                            span: DUMMY_SP,
                            name: obj_name.clone().into(),
                            init: None,
                            definite: false,
                        });

                        (
                            Some(obj_name.clone()),
                            Box::new(Expr::Assign(AssignExpr {
                                span: DUMMY_SP,
                                op: op!("="),
                                left: obj_name.into(),
                                right: Box::new(callee.take().into()),
                            })),
                        )
                    }

                    Expr::OptChain(callee) => {
                        let obj_name = private_ident!("_object");

                        self.vars_without_init.push(VarDeclarator {
                            span: DUMMY_SP,
                            name: obj_name.clone().into(),
                            init: None,
                            definite: false,
                        });

                        let init = Box::new(
                            self.handle(callee, Some(obj_name.clone()))
                                .map(Expr::Cond)
                                .unwrap_or_else(|e| e),
                        );
                        (Some(obj_name.clone()), init)
                    }

                    _ => {
                        call.callee.visit_mut_with(self);

                        (None, call.callee.take())
                    }
                };
                call.args.visit_mut_with(self);

                Ok(CondExpr {
                    span: DUMMY_SP,
                    test: init_and_eq_null_or_undefined(&callee_name, init),
                    cons: undefined(DUMMY_SP),
                    alt: match this {
                        Some(this) => Box::new(Expr::Call(CallExpr {
                            span: call.span,
                            callee: callee_name.make_member(quote_ident!("call")).as_callee(),
                            args: once(this.as_arg()).chain(call.args.take()).collect(),
                            type_args: Default::default(),
                        })),
                        None => Box::new(Expr::Call(CallExpr {
                            span: call.span,
                            callee: callee_name.as_callee(),
                            args: call.args.take(),
                            type_args: Default::default(),
                        })),
                    },
                })
            }
        }
    }

    /// Returned statements are variable declarations without initializer
    fn visit_mut_one_stmt_to<T>(&mut self, mut stmt: T, new: &mut Vec<T>)
    where
        T: StmtLike + VisitMutWith<Self>,
    {
        stmt.visit_mut_with(self);

        if !self.vars_with_init.is_empty() {
            new.push(T::from_stmt(
                VarDecl {
                    span: DUMMY_SP,
                    declare: false,
                    kind: VarDeclKind::Var,
                    decls: mem::take(&mut self.vars_with_init),
                }
                .into(),
            ));
        }
        new.push(stmt);
    }

    fn visit_mut_stmt_like<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: Send + Sync + StmtLike + VisitMutWith<Self>,
        Vec<T>: VisitMutWith<Self>,
    {
        let mut new: Vec<T> = vec![];

        let init = self.vars_with_init.take();
        let uninit = self.vars_without_init.take();
        for stmt in stmts.drain(..) {
            self.visit_mut_one_stmt_to(stmt, &mut new);
        }

        if !self.vars_without_init.is_empty() {
            prepend_stmt(
                &mut new,
                T::from_stmt(
                    VarDecl {
                        span: DUMMY_SP,
                        declare: false,
                        kind: VarDeclKind::Var,
                        decls: mem::take(&mut self.vars_without_init),
                    }
                    .into(),
                ),
            );
        }

        self.vars_with_init = init;
        self.vars_without_init = uninit;
        *stmts = new;
    }
}

fn init_and_eq_null_or_undefined(i: &Ident, init: Box<Expr>) -> Box<Expr> {
    let null_cmp = Box::new(Expr::Bin(BinExpr {
        span: DUMMY_SP,
        left: Box::new(Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            op: op!("="),
            left: PatOrExpr::Pat(i.clone().into()),
            right: init,
        })),
        op: op!("==="),
        right: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
    }));

    let void_cmp = Box::new(Expr::Bin(BinExpr {
        span: DUMMY_SP,
        left: Box::new(Expr::Ident(i.clone())),
        op: op!("==="),
        right: undefined(DUMMY_SP),
    }));

    Box::new(Expr::Bin(BinExpr {
        span: DUMMY_SP,
        left: null_cmp,
        op: op!("||"),
        right: void_cmp,
    }))
}
