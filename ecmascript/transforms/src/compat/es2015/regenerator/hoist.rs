use crate::util::find_ids;
use smallvec::SmallVec;
use swc_atoms::js_word;
use swc_common::{Fold, FoldWith, DUMMY_SP};
use swc_ecma_ast::*;

pub(super) type Vars = SmallVec<[Ident; 32]>;

pub(super) fn hoist<T>(node: T) -> (T, Hoister)
where
    T: FoldWith<Hoister>,
{
    let mut v = Hoister {
        vars: Default::default(),
        arguments: None,
    };
    let t = node.fold_with(&mut v);

    (t, v)
}

#[derive(Debug)]
pub(super) struct Hoister {
    pub vars: Vars,
    pub arguments: Option<Ident>,
}

noop_fold_type!(Hoister);

impl Hoister {
    fn var_decl_to_expr(&mut self, var: VarDecl) -> Expr {
        let var = var.fold_children_with(self);

        let ids = find_ids(&var);
        self.vars.extend(ids);

        let mut exprs = vec![];

        for decl in var.decls {
            if let Some(init) = decl.init {
                exprs.push(
                    box AssignExpr {
                        span: decl.span,
                        left: PatOrExpr::Pat(box decl.name),
                        op: op!("="),
                        right: init,
                    }
                    .into(),
                );
            }
        }

        Expr::Seq(SeqExpr {
            span: DUMMY_SP,
            exprs,
        })
    }
}

impl Fold<VarDeclOrPat> for Hoister {
    fn fold(&mut self, v: VarDeclOrPat) -> VarDeclOrPat {
        match v {
            VarDeclOrPat::Pat(v) => VarDeclOrPat::Pat(v.fold_children_with(self)),

            VarDeclOrPat::VarDecl(mut var) => {
                if var.decls.len() == 1 && var.decls[0].init.is_none() {
                    return var.decls.remove(0).name.into();
                }

                var.into()
            }
        }
    }
}

impl Fold<VarDecl> for Hoister {
    fn fold(&mut self, var: VarDecl) -> VarDecl {
        unreachable!("VarDecl should be removed by other pass: {:?}", var);
    }
}

impl Fold<VarDeclOrExpr> for Hoister {
    fn fold(&mut self, var: VarDeclOrExpr) -> VarDeclOrExpr {
        match var {
            VarDeclOrExpr::VarDecl(var) => VarDeclOrExpr::Expr(box self.var_decl_to_expr(var)),
            _ => var.fold_children_with(self),
        }
    }
}

impl Fold<Stmt> for Hoister {
    fn fold(&mut self, s: Stmt) -> Stmt {
        match s {
            Stmt::Decl(Decl::Var(var)) => {
                let span = var.span;
                let expr = box self.var_decl_to_expr(var);

                return Stmt::Expr(ExprStmt { span, expr });
            }

            _ => {}
        }

        s.fold_children_with(self)
    }
}

impl Fold<ModuleDecl> for Hoister {
    fn fold(&mut self, decl: ModuleDecl) -> ModuleDecl {
        match decl {
            ModuleDecl::ExportDecl(ExportDecl {
                span,
                decl: Decl::Var(var),
            }) => {
                return ModuleDecl::ExportDefaultExpr(ExportDefaultExpr {
                    span,
                    expr: box self.var_decl_to_expr(var),
                })
            }

            _ => {}
        }

        decl.fold_children_with(self)
    }
}

impl Fold<MemberExpr> for Hoister {
    fn fold(&mut self, mut e: MemberExpr) -> MemberExpr {
        e.obj = e.obj.fold_with(self);

        if e.computed {
            e.prop = e.prop.fold_with(self);
        }

        e
    }
}

impl Fold<Expr> for Hoister {
    fn fold(&mut self, e: Expr) -> Expr {
        let e = e.fold_children_with(self);

        match e {
            Expr::Ident(Ident {
                sym: js_word!("arguments"),
                ..
            }) => {
                if self.arguments.is_none() {
                    self.arguments = Some(private_ident!("_args"));
                }

                return Expr::Ident(self.arguments.clone().unwrap());
            }

            _ => {}
        }

        e
    }
}
