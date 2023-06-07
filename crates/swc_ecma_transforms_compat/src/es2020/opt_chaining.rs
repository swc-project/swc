use std::mem;

use serde::Deserialize;
use swc_common::{util::take::Take, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{alias_ident_for, prepend_stmt, StmtLike};
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
            *e = self.handle(o);
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
    fn handle(&mut self, e: &mut OptChainExpr) -> Expr {
        match &mut *e.base {
            OptChainBase::Member(m) => {
                m.obj.visit_mut_with(self);

                if e.optional {
                    let obj_var = alias_ident_for(&m.obj, "_obj");

                    self.vars_without_init.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: obj_var.clone().into(),
                        init: None,
                        definite: false,
                    });

                    Expr::Member(MemberExpr {
                        span: m.span,
                        obj: obj_var.into(),
                        prop: m.prop.take(),
                    })
                } else {
                    Expr::Member(m.take())
                }
            }
            OptChainBase::Call(_) => todo!(),
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
