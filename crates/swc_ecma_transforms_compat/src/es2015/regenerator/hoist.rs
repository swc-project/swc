use smallvec::SmallVec;
use swc_atoms::js_word;
use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{find_pat_ids, private_ident};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

pub(super) type Vars = SmallVec<[Ident; 12]>;

pub(super) fn hoist<T>(mut node: T) -> (T, Hoister)
where
    T: VisitMutWith<Hoister>,
{
    let mut v = Hoister {
        vars: Default::default(),
        arguments: None,
        functions: Default::default(),
    };
    node.visit_mut_with(&mut v);

    (node, v)
}

#[derive(Debug)]
pub(super) struct Hoister {
    pub vars: Vars,
    pub arguments: Option<Ident>,
    pub functions: Vec<Stmt>,
}

#[swc_trace]
impl Hoister {
    fn var_decl_to_expr(&mut self, mut var: VarDecl) -> Expr {
        var.visit_mut_children_with(self);

        let ids = find_pat_ids(&var);
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

    fn function_to_expr(&mut self, mut func: FnDecl) -> Expr {
        func.visit_mut_children_with(self);

        let FnDecl {
            ident, function, ..
        } = func;

        self.vars.push(ident.clone());

        AssignExpr {
            span: function.span,
            left: PatOrExpr::Pat(Box::new(ident.clone().into())),
            op: op!("="),
            right: Box::new(Expr::Fn(FnExpr {
                ident: Some(Ident::new(format!("_{}", ident.sym).into(), ident.span)),
                function,
            })),
        }
        .into()
    }
}

#[swc_trace]
impl VisitMut for Hoister {
    noop_visit_mut_type!();

    fn visit_mut_function(&mut self, _n: &mut Function) {
        //noop
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        if let Expr::Ident(Ident {
            sym: js_word!("arguments"),
            ..
        }) = e
        {
            if self.arguments.is_none() {
                self.arguments = Some(private_ident!("_args"));
            }
            *e = Expr::Ident(self.arguments.clone().unwrap());
        }
    }

    fn visit_mut_module_decl(&mut self, decl: &mut ModuleDecl) {
        if let ModuleDecl::ExportDecl(ExportDecl {
            span,
            decl: Decl::Var(var),
        }) = decl
        {
            *decl = ModuleDecl::ExportDefaultExpr(ExportDefaultExpr {
                span: *span,
                expr: Box::new(self.var_decl_to_expr(var.take())),
            });
            return;
        }

        decl.visit_mut_children_with(self);
    }

    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
        match s {
            Stmt::Decl(Decl::Var(var)) => {
                let span = var.span;
                let expr = Box::new(self.var_decl_to_expr(var.take()));

                *s = Stmt::Expr(ExprStmt { span, expr });
                return;
            }
            Stmt::Decl(Decl::Fn(func)) => {
                let span = func.function.span;
                let expr = Box::new(self.function_to_expr(func.take()));

                let stmt = ExprStmt { span, expr }.into();

                self.functions.push(stmt);

                // cleanup
                *s = Stmt::dummy();
                return;
            }
            _ => {}
        }

        s.visit_mut_children_with(self);
    }

    fn visit_mut_var_decl(&mut self, var: &mut VarDecl) {
        unreachable!("VarDecl should be removed by other pass: {:?}", var);
    }

    fn visit_mut_var_decl_or_pat(&mut self, v: &mut VarDeclOrPat) {
        match v {
            VarDeclOrPat::Pat(v) => {
                v.visit_mut_children_with(self);
            }

            VarDeclOrPat::VarDecl(var) => {
                if var.decls.len() == 1 && var.decls[0].init.is_none() {
                    let pat = var.decls.remove(0).name;
                    self.vars.extend(find_pat_ids(&pat));

                    *v = pat.into();
                }
            }
        };
    }

    fn visit_mut_var_decl_or_expr(&mut self, var: &mut VarDeclOrExpr) {
        match var {
            VarDeclOrExpr::VarDecl(var_decl) => {
                *var = VarDeclOrExpr::Expr(Box::new(self.var_decl_to_expr(var_decl.take())));
            }
            _ => {
                var.visit_mut_children_with(self);
            }
        };
    }

    fn visit_mut_opt_var_decl_or_expr(&mut self, v: &mut Option<VarDeclOrExpr>) {
        v.visit_mut_children_with(self);

        if let Some(VarDeclOrExpr::Expr(e)) = v {
            if e.is_invalid() {
                *v = None;
            }
        }
    }
}
