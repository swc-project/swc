use crate::util::usage::ScopeData;
use crate::util::usage::UsageAnalyzer;
use fxhash::FxHashMap;
use retain_mut::RetainMut;
use std::mem::swap;
use std::mem::take;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_utils::Id;
use swc_ecma_utils::StmtLike;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;
use swc_ecma_visit::VisitWith;

#[derive(Debug)]
pub(super) struct ReducerConfig {
    pub bools: bool,
}

/// Merge varaibles.
pub(super) fn var_reducer(config: ReducerConfig) -> impl VisitMut {
    Reducer {
        config,
        lits: Default::default(),
        vars: Default::default(),
        data: Default::default(),
    }
}

#[derive(Debug)]
struct Reducer {
    config: ReducerConfig,
    /// Cheap to clone.
    lits: FxHashMap<Id, Lit>,
    vars: FxHashMap<Id, Box<Expr>>,
    data: Option<ScopeData>,
}

impl Reducer {
    fn handle_stmt_likes<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike,
        Vec<T>: VisitMutWith<Self> + VisitWith<UsageAnalyzer>,
    {
        match self.data {
            Some(..) => {}
            None => {
                let mut analyzer = UsageAnalyzer::default();
                stmts.visit_with(&Invalid { span: DUMMY_SP }, &mut analyzer);
                self.data = Some(analyzer.data);
            }
        }

        stmts.visit_mut_children_with(self);
    }
}

impl VisitMut for Reducer {
    noop_visit_mut_type!();

    /// Inlines function call.
    fn visit_mut_call_expr(&mut self, n: &mut CallExpr) {
        let has_spread_arg = n.args.iter().any(|v| v.spread.is_some());

        if !has_spread_arg {
            match &mut n.callee {
                ExprOrSuper::Super(_) => {}
                ExprOrSuper::Expr(callee) => match &mut **callee {
                    Expr::Fn(callee) => {
                        // We check for parameter and argument
                        for (idx, param) in callee.function.params.iter().enumerate() {
                            let arg = n.args.get(idx).map(|v| &*v.expr);
                            if let Pat::Ident(param) = &param.pat {
                                if let Some(Expr::Lit(arg)) = arg {
                                    self.lits.insert(param.to_id(), arg.clone());
                                }
                            }
                        }
                        callee.function.visit_mut_with(self);
                    }
                    _ => {}
                },
            }
        }

        n.visit_mut_children_with(self);
    }

    fn visit_mut_if_stmt(&mut self, n: &mut IfStmt) {
        n.visit_mut_children_with(self);

        match &mut *n.test {
            Expr::Bin(test) => match (&*test.left, &*test.right) {
                (&Expr::Ident(..), &Expr::Lit(..)) => {
                    swap(&mut test.left, &mut test.right);
                }
                _ => {}
            },
            _ => {}
        }
    }

    fn visit_mut_var_declarators(&mut self, vars: &mut Vec<VarDeclarator>) {
        vars.retain_mut(|var| {
            let had_init = var.init.is_some();

            var.visit_mut_with(self);

            // It will be inlined.
            if had_init && var.init.is_none() {
                return false;
            }

            true
        })
    }

    fn visit_mut_var_declarator(&mut self, var: &mut VarDeclarator) {
        var.visit_mut_children_with(self);

        // We will inline if possible.
    }

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        n.visit_mut_children_with(self);

        match n {
            Expr::Ident(i) => {
                //
                if let Some(value) = self.lits.get(&i.to_id()).cloned() {
                    *n = Expr::Lit(value);
                } else if let Some(value) = self.vars.remove(&i.to_id()) {
                    *n = *value;
                }
            }
            _ => {}
        }

        if self.config.bools {
            match n {
                Expr::Lit(Lit::Bool(v)) => {
                    //
                    *n = Expr::Unary(UnaryExpr {
                        span: v.span,
                        op: op!("!"),
                        arg: Box::new(Expr::Lit(Lit::Num(Number {
                            span: DUMMY_SP,
                            value: if v.value { 0.0 } else { 1.0 },
                        }))),
                    });
                }
                _ => {}
            }
        }
    }

    fn visit_mut_member_expr(&mut self, n: &mut MemberExpr) {
        n.obj.visit_mut_with(self);
        if n.computed {
            n.prop.visit_mut_with(self);
        }
    }

    fn visit_mut_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        self.handle_stmt_likes(stmts);
    }

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        self.handle_stmt_likes(stmts);

        // Merge var declarations fully, if possible.
        if stmts.windows(2).any(|stmts| match (&stmts[0], &stmts[1]) {
            (Stmt::Decl(Decl::Var(..)), Stmt::Decl(Decl::Var(..))) => true,
            _ => false,
        }) {
            let orig = take(stmts);
            let mut new = Vec::with_capacity(orig.len());

            let mut var_decl: Option<VarDecl> = None;

            for stmt in orig {
                match stmt {
                    Stmt::Decl(Decl::Var(below)) => {
                        //
                        match var_decl.take() {
                            Some(mut upper) if upper.kind == below.kind => {
                                upper.decls.extend(below.decls);
                                var_decl = Some(upper);
                            }
                            _ => {
                                new.extend(var_decl.take().map(Decl::Var).map(Stmt::Decl));
                                var_decl = Some(below);
                            }
                        }
                    }
                    _ => {
                        // If it's not a var decl,

                        new.extend(var_decl.take().map(Decl::Var).map(Stmt::Decl));
                        new.push(stmt);
                    }
                }
            }

            *stmts = new
        }
    }
}
