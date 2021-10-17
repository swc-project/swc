use smallvec::SmallVec;
use swc_atoms::js_word;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::{find_ids, private_ident};
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith};

pub(super) type Vars = SmallVec<[Ident; 12]>;

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

impl Hoister {
    fn var_decl_to_expr(&mut self, var: VarDecl) -> Expr {
        let var = var.fold_children_with(self);

        let ids = find_ids(&var);
        self.vars.extend(ids);

        let mut exprs = vec![];

        for decl in var.decls {
            if let Some(init) = decl.init {
                exprs.push(Box::new(
                    AssignExpr {
                        span: decl.span,
                        left: PatOrExpr::Pat(Box::new(decl.name)),
                        op: op!("="),
                        right: init,
                    }
                    .into(),
                ));
            }
        }

        Expr::Seq(SeqExpr {
            span: DUMMY_SP,
            exprs,
        })
    }
}

/// TODO: VisitMut
impl Fold for Hoister {
    noop_fold_type!();

    /// Noop
    fn fold_function(&mut self, n: Function) -> Function {
        n
    }

    fn fold_expr(&mut self, e: Expr) -> Expr {
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

    fn fold_member_expr(&mut self, mut e: MemberExpr) -> MemberExpr {
        e.obj = e.obj.fold_with(self);

        if e.computed {
            e.prop = e.prop.fold_with(self);
        }

        e
    }

    fn fold_module_decl(&mut self, decl: ModuleDecl) -> ModuleDecl {
        match decl {
            ModuleDecl::ExportDecl(ExportDecl {
                span,
                decl: Decl::Var(var),
            }) => {
                return ModuleDecl::ExportDefaultExpr(ExportDefaultExpr {
                    span,
                    expr: Box::new(self.var_decl_to_expr(var)),
                })
            }

            _ => {}
        }

        decl.fold_children_with(self)
    }

    fn fold_stmt(&mut self, s: Stmt) -> Stmt {
        match s {
            Stmt::Decl(Decl::Var(var)) => {
                let span = var.span;
                let expr = Box::new(self.var_decl_to_expr(var));

                return Stmt::Expr(ExprStmt { span, expr });
            }

            _ => {}
        }

        s.fold_children_with(self)
    }

    fn fold_var_decl(&mut self, var: VarDecl) -> VarDecl {
        unreachable!("VarDecl should be removed by other pass: {:?}", var);
    }

    fn fold_var_decl_or_pat(&mut self, v: VarDeclOrPat) -> VarDeclOrPat {
        match v {
            VarDeclOrPat::Pat(v) => VarDeclOrPat::Pat(v.fold_children_with(self)),

            VarDeclOrPat::VarDecl(mut var) => {
                if var.decls.len() == 1 && var.decls[0].init.is_none() {
                    let pat = var.decls.remove(0).name;
                    self.vars.extend(find_ids(&pat));

                    return pat.into();
                }

                var.into()
            }
        }
    }

    fn fold_var_decl_or_expr(&mut self, var: VarDeclOrExpr) -> VarDeclOrExpr {
        match var {
            VarDeclOrExpr::VarDecl(var) => {
                VarDeclOrExpr::Expr(Box::new(self.var_decl_to_expr(var)))
            }
            _ => var.fold_children_with(self),
        }
    }

    fn fold_opt_var_decl_or_expr(&mut self, v: Option<VarDeclOrExpr>) -> Option<VarDeclOrExpr> {
        let v = v.fold_children_with(self);

        match &v {
            Some(VarDeclOrExpr::Expr(e)) => {
                if e.is_invalid() {
                    return None;
                }
            }

            _ => {}
        }

        v
    }
}
