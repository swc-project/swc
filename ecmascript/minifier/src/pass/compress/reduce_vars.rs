use crate::util::usage::ScopeData;
use crate::util::usage::UsageAnalyzer;
use crate::util::ValueExt;
use fxhash::FxHashMap;
use retain_mut::RetainMut;
use std::mem::swap;
use std::mem::take;
use swc_atoms::JsWord;
use swc_common::pass::Repeated;
use swc_common::SyntaxContext;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_utils::ExprExt;
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
pub(super) fn var_reducer(config: ReducerConfig) -> impl VisitMut + Repeated {
    Reducer {
        changed: false,
        config,
        lits: Default::default(),
        vars: Default::default(),
        simple_props: Default::default(),
        data: Default::default(),
        inline_prevented: false,
    }
}

#[derive(Debug)]
struct Reducer {
    changed: bool,
    config: ReducerConfig,
    /// Cheap to clone.
    lits: FxHashMap<Id, Box<Expr>>,
    vars: FxHashMap<Id, Box<Expr>>,
    simple_props: FxHashMap<(Id, JsWord), Box<Expr>>,
    data: Option<ScopeData>,
    inline_prevented: bool,
}

impl Repeated for Reducer {
    fn changed(&self) -> bool {
        self.changed
    }

    fn reset(&mut self) {
        self.changed = false;
    }
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

    fn optimize_lit_cmp(&mut self, n: &mut BinExpr) -> Option<Expr> {
        match n.op {
            op!("==") | op!("!=") => {
                let l = n.left.as_pure_bool().opt()?;
                let r = n.right.as_pure_bool().opt()?;

                let value = if n.op == op!("==") { l == r } else { l != r };

                self.changed = true;
                return Some(Expr::Lit(Lit::Bool(Bool {
                    span: n.span,
                    value,
                })));
            }
            _ => {}
        }

        None
    }

    /// This method converts `!1` to `0`.
    fn optimize_expr_in_bool_ctx(&mut self, n: &mut Expr) {
        match n {
            Expr::Unary(UnaryExpr {
                span,
                op: op!("!"),
                arg,
            }) => {
                self.optimize_expr_in_bool_ctx(&mut **arg);

                match &**arg {
                    Expr::Lit(Lit::Num(Number { value, .. })) => {
                        self.changed = true;
                        *n = Expr::Lit(Lit::Num(Number {
                            span: *span,
                            value: if *value == 0.0 { 1.0 } else { 0.0 },
                        }))
                    }
                    _ => {}
                }
            }
            _ => {}
        }
    }
}

impl VisitMut for Reducer {
    noop_visit_mut_type!();

    fn visit_mut_fn_expr(&mut self, e: &mut FnExpr) {
        if let Some(i) = &e.ident {
            if let Some(data) = &self.data {
                let can_remove_ident = data
                    .vars
                    .get(&i.to_id())
                    .map(|v| v.ref_count == 0)
                    .unwrap_or(true);

                if can_remove_ident {
                    self.changed = true;
                    e.ident = None;
                }
            }
        }

        e.visit_mut_children_with(self);
    }

    /// Inlines function call.
    fn visit_mut_call_expr(&mut self, n: &mut CallExpr) {
        n.callee.visit_mut_with(self);

        let old = self.inline_prevented;
        self.inline_prevented = true;
        n.args.visit_mut_with(self);
        self.inline_prevented = old;

        let has_spread_arg = n.args.iter().any(|v| v.spread.is_some());

        if !has_spread_arg {
            match &mut n.callee {
                ExprOrSuper::Super(_) => {}
                ExprOrSuper::Expr(callee) => match &mut **callee {
                    Expr::Fn(callee) => {
                        // We check for parameter and argument
                        for (idx, param) in callee.function.params.iter().enumerate() {
                            let arg = n.args.get(idx).map(|v| &v.expr);
                            if let Pat::Ident(param) = &param.pat {
                                if let Some(arg) = arg {
                                    let should_be_inlined = is_clone_cheap(arg);
                                    if should_be_inlined {
                                        self.lits.insert(param.to_id(), arg.clone());
                                    }
                                }
                            }
                        }
                        callee.function.visit_mut_with(self);

                        // TODO: Drop arguments if all usage is inlined. (We
                        // should preserve parameters)
                    }
                    _ => {}
                },
            }
        }
    }

    fn visit_mut_switch_stmt(&mut self, n: &mut SwitchStmt) {
        let old = self.inline_prevented;
        self.inline_prevented = true;
        n.discriminant.visit_mut_with(self);
        self.inline_prevented = old;

        n.cases.visit_mut_with(self);
    }

    fn visit_mut_if_stmt(&mut self, n: &mut IfStmt) {
        n.visit_mut_children_with(self);

        match &mut *n.test {
            Expr::Bin(test) => match (&*test.left, &*test.right) {
                (&Expr::Ident(..), &Expr::Lit(..)) => {
                    self.changed = true;
                    swap(&mut test.left, &mut test.right);
                }
                _ => {}
            },
            _ => {}
        }

        self.optimize_expr_in_bool_ctx(&mut n.test);
    }

    fn visit_mut_var_declarators(&mut self, vars: &mut Vec<VarDeclarator>) {
        vars.retain_mut(|var| {
            let had_init = var.init.is_some();

            var.visit_mut_with(self);

            // It will be inlined.
            if had_init && var.init.is_none() {
                self.changed = true;
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
        // Normalize
        match n {
            Expr::Paren(paren) => {
                self.changed = true;
                *n = *paren.expr.take();
            }
            _ => {}
        }

        if !self.inline_prevented {
            match n {
                Expr::Ident(i) => {
                    //
                    if let Some(value) = self.lits.get(&i.to_id()).cloned() {
                        self.changed = true;

                        *n = *value;
                    } else if let Some(value) = self.vars.remove(&i.to_id()) {
                        self.changed = true;

                        *n = *value;
                    }
                }
                _ => {}
            }
        }

        if self.config.bools {
            match n {
                Expr::Lit(Lit::Bool(v)) => {
                    self.changed = true;
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

        match n {
            Expr::Bin(bin) => {
                let expr = self.optimize_lit_cmp(bin);
                if let Some(expr) = expr {
                    self.changed = true;
                    *n = expr;
                }
            }
            _ => {}
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
                                self.changed = true;
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

            new.extend(var_decl.take().map(Decl::Var).map(Stmt::Decl));

            *stmts = new
        }
    }
}

fn is_clone_cheap(arg: &Expr) -> bool {
    match arg {
        Expr::Lit(..) => true,
        Expr::Unary(UnaryExpr {
            op: op!("!"), arg, ..
        }) => is_clone_cheap(&arg),
        _ => false,
    }
}
