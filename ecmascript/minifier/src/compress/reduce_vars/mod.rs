use crate::util::usage::ScopeData;
use crate::util::usage::UsageAnalyzer;
use fxhash::FxHashMap;
use retain_mut::RetainMut;
use std::fmt::Write;
use std::mem::swap;
use std::mem::take;
use swc_atoms::js_word;
use swc_atoms::JsWord;
use swc_common::iter::IdentifyLast;
use swc_common::pass::Repeated;
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

mod ops;

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
        simple_array_values: Default::default(),
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
    simple_array_values: FxHashMap<(Id, usize), Box<Expr>>,
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

    /// `a = a + 1` => `a += 1`.
    fn compress_bin_assignment_to_left(&mut self, e: &mut AssignExpr) {
        // TODO: Handle pure properties.
        let lhs = match &e.left {
            PatOrExpr::Expr(e) => match &**e {
                Expr::Ident(i) => i,
                _ => return,
            },
            PatOrExpr::Pat(p) => match &**p {
                Pat::Ident(i) => i,
                _ => return,
            },
        };

        // If left operand of a binary expression is not same as lhs, this method has
        // nothing to do.
        let (op, right) = match &mut *e.right {
            Expr::Bin(BinExpr {
                left, op, right, ..
            }) => match &**left {
                Expr::Ident(r) if lhs.sym == r.sym && lhs.span.ctxt == r.span.ctxt => (op, right),
                _ => return,
            },
            _ => return,
        };

        let op = match op {
            BinaryOp::In | BinaryOp::InstanceOf => return,

            BinaryOp::EqEq | BinaryOp::NotEq | BinaryOp::EqEqEq | BinaryOp::NotEqEq => {
                // TODO(kdy1): Check if this is optimizable.
                return;
            }

            BinaryOp::Lt | BinaryOp::LtEq | BinaryOp::Gt | BinaryOp::GtEq => return,

            BinaryOp::LShift => op!("<<="),
            BinaryOp::RShift => {
                op!(">>=")
            }
            BinaryOp::ZeroFillRShift => {
                op!(">>>=")
            }
            BinaryOp::Add => {
                op!("+=")
            }
            BinaryOp::Sub => {
                op!("-=")
            }
            BinaryOp::Mul => {
                op!("*=")
            }
            BinaryOp::Div => {
                op!("/=")
            }
            BinaryOp::Mod => {
                op!("%=")
            }
            BinaryOp::BitOr => {
                op!("|=")
            }
            BinaryOp::BitXor => {
                op!("^=")
            }
            BinaryOp::BitAnd => {
                op!("&=")
            }
            BinaryOp::LogicalOr => {
                op!("||=")
            }
            BinaryOp::LogicalAnd => {
                op!("&&=")
            }
            BinaryOp::Exp => {
                op!("**=")
            }
            BinaryOp::NullishCoalescing => {
                op!("??=")
            }
        };

        e.op = op;
        e.right = right.take();
        // Now we can compress it to an assigment
    }

    fn store_var_for_inining(&mut self, var: &mut VarDeclarator) {
        let init = match &mut var.init {
            Some(v) => v,
            None => return,
        };

        // TODO: Check for side effect between original decl position and inlined
        // position

        // We will inline if possible.
        match &var.name {
            Pat::Ident(i) => {
                // Store variables if it's used only once
                if let Some(data) = &mut self.data {
                    if let Some(usage) = data.vars.get(&i.to_id()) {
                        // No use => doppred
                        if usage.ref_count == 0 {
                            if init.may_have_side_effects() {
                                // TODO: Inline partially
                                return;
                            }

                            // TODO: Remove
                            return;
                        }

                        // Single use => inlined
                        if usage.ref_count == 1 {
                            if init.may_have_side_effects() {
                                // TODO: Inline partially
                                return;
                            }

                            self.vars.insert(i.to_id(), init.take());
                            return;
                        }
                    }
                }
            }
            // TODO
            _ => {}
        }
    }

    /// Inlines function call.
    fn inline_fn_call(&mut self, n: &mut CallExpr) {
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
                        let old = self.inline_prevented;
                        self.inline_prevented = false;
                        callee.function.visit_mut_with(self);
                        self.inline_prevented = old;

                        // TODO: Drop arguments if all usage is inlined. (We
                        // should preserve parameters)
                    }
                    _ => {}
                },
            }
        }
    }

    fn compress_array_join(&mut self, n: &mut Expr) {
        let e = match n {
            Expr::Call(e) => e,
            _ => return,
        };

        let callee = match &mut e.callee {
            ExprOrSuper::Super(_) => return,
            ExprOrSuper::Expr(callee) => &mut **callee,
        };

        let separator = if e.args.is_empty() {
            ",".into()
        } else if e.args.len() == 1 {
            if e.args[0].spread.is_some() {
                return;
            }

            if is_pure_undefind(&e.args[0].expr) {
                ",".into()
            } else {
                match &*e.args[0].expr {
                    Expr::Lit(Lit::Str(s)) => s.value.clone(),
                    Expr::Lit(Lit::Null(..)) => js_word!("null"),
                    _ => return,
                }
            }
        } else {
            return;
        };

        let arr = match callee {
            Expr::Member(MemberExpr {
                obj,
                prop,
                computed: false,
                ..
            }) => match obj {
                ExprOrSuper::Super(_) => return,
                ExprOrSuper::Expr(obj) => match &mut **obj {
                    Expr::Array(arr) => {
                        if arr.elems.iter().filter_map(|v| v.as_ref()).any(|v| {
                            v.spread.is_some()
                                || match &*v.expr {
                                    e if is_pure_undefind(e) => false,
                                    Expr::Lit(lit) => match lit {
                                        Lit::Str(..) | Lit::Num(..) | Lit::Null(..) => false,
                                        _ => true,
                                    },
                                    _ => true,
                                }
                        }) {
                            return;
                        }

                        match &**prop {
                            Expr::Ident(i) if i.sym == *"join" => {}
                            _ => return,
                        }

                        arr
                    }
                    _ => return,
                },
            },
            _ => return,
        };

        let mut res = String::new();
        for (last, elem) in arr.elems.iter().identify_last() {
            if let Some(elem) = elem {
                debug_assert_eq!(elem.spread, None);

                match &*elem.expr {
                    Expr::Lit(Lit::Str(s)) => {
                        res.push_str(&s.value);
                    }
                    Expr::Lit(Lit::Num(n)) => {
                        write!(res, "{}", n.value).unwrap();
                    }
                    e if is_pure_undefind(e) => {}
                    Expr::Lit(Lit::Null(..)) => {}
                    _ => {
                        unreachable!(
                            "Expression {:#?} cannot be joined and it should be filtered out",
                            elem.expr
                        )
                    }
                }
            }

            if !last {
                res.push_str(&separator);
            }
        }

        *n = Expr::Lit(Lit::Str(Str {
            span: e.span,
            value: res.into(),
            has_escape: false,
            kind: Default::default(),
        }))
    }
}

impl VisitMut for Reducer {
    noop_visit_mut_type!();

    fn visit_mut_assign_expr(&mut self, e: &mut AssignExpr) {
        e.visit_mut_children_with(self);

        self.compress_bin_assignment_to_left(e);
        self.compress_bin_assignment_to_right(e);
    }

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

    fn visit_mut_call_expr(&mut self, n: &mut CallExpr) {
        n.callee.visit_mut_with(self);

        // TODO: Prevent inline if callee is unknown.
        n.args.visit_mut_with(self);

        self.inline_fn_call(n);
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

        self.store_var_for_inining(var);
        match &var.init {
            Some(init) => match &**init {
                Expr::Invalid(..) => {
                    var.init = None;
                }
                _ => {}
            },
            _ => {}
        }
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

        self.compress_array_join(n);
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

    fn visit_mut_stmt(&mut self, n: &mut Stmt) {
        n.visit_mut_children_with(self);

        match n {
            Stmt::Expr(ExprStmt { expr, .. }) => {
                //
                if !expr.may_have_side_effects() {
                    self.changed = true;
                    *n = Stmt::Empty(EmptyStmt { span: DUMMY_SP })
                }
            }
            _ => {}
        }
    }

    fn visit_mut_yield_expr(&mut self, n: &mut YieldExpr) {
        n.visit_mut_children_with(self);

        if let Some(arg) = &n.arg {
            match &**arg {
                Expr::Ident(Ident {
                    sym: js_word!("undefined"),
                    ..
                }) => {
                    n.arg = None;
                }
                _ => {}
            }
        }
    }

    fn visit_mut_assign_pat_prop(&mut self, n: &mut AssignPatProp) {
        n.visit_mut_children_with(self);

        match &n.value {
            Some(value) => {
                if is_pure_undefind(&value) {
                    n.value = None;
                }
            }
            _ => {}
        }
    }

    fn visit_mut_cond_expr(&mut self, n: &mut CondExpr) {
        n.visit_mut_children_with(self);

        self.optimize_expr_in_bool_ctx(&mut n.test);
    }
}

fn is_pure_undefind(e: &Expr) -> bool {
    match e {
        Expr::Ident(Ident {
            sym: js_word!("undefined"),
            ..
        }) => true,

        Expr::Unary(UnaryExpr {
            op: UnaryOp::Void,
            arg,
            ..
        }) if !arg.may_have_side_effects() => true,

        _ => false,
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
