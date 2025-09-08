use std::{hash::BuildHasherDefault, mem, ops::RangeFull};

use indexmap::IndexMap;
use rustc_hash::FxHasher;
use swc_common::{comments::Comments, util::take::Take, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::stack_size::maybe_grow_default;
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

/// Fixes ast nodes before printing so semantics are preserved.
///
/// You don't have to bother to create appropriate parenthesis.
/// The pass will insert parenthesis as needed. In other words, it's
/// okay to store `a * (b + c)` as `Bin { a * Bin { b + c } }`.
pub fn fixer(comments: Option<&dyn Comments>) -> impl '_ + Pass + VisitMut {
    visit_mut_pass(Fixer {
        comments,
        ctx: Default::default(),
        span_map: Default::default(),
        in_for_stmt_head: Default::default(),
        in_opt_chain: Default::default(),
    })
}

struct Fixer<'a> {
    comments: Option<&'a dyn Comments>,
    ctx: Context,
    /// A hash map to preserve original span.
    ///
    /// Key is span of inner expression, and value is span of the paren
    /// expression.
    span_map: IndexMap<Span, Span, BuildHasherDefault<FxHasher>>,

    in_for_stmt_head: bool,
    in_opt_chain: bool,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
enum Context {
    #[default]
    Default,

    Callee,

    NewCallee,

    /// Always treated as expr. (But number of comma-separated expression
    /// matters)
    ///
    ///  - `foo((bar, x))` != `foo(bar, x)`
    ///  - `var foo = (bar, x)` != `var foo = bar, x`
    ///  - `[(foo, bar)]` != `[foo, bar]`
    ForcedExpr,

    /// Always treated as expr and comma does not matter.
    FreeExpr,
}

impl Fixer<'_> {
    fn wrap_callee(&mut self, e: &mut Expr) {
        match e {
            Expr::Lit(Lit::Num(..) | Lit::Str(..)) => (),
            Expr::Cond(..)
            | Expr::Class(..)
            | Expr::Bin(..)
            | Expr::Lit(..)
            | Expr::Unary(..)
            | Expr::Object(..)
            | Expr::Await(..)
            | Expr::Yield(..) => self.wrap(e),
            _ => (),
        }
    }
}

impl VisitMut for Fixer<'_> {
    noop_visit_mut_type!();

    fn visit_mut_array_lit(&mut self, e: &mut ArrayLit) {
        let ctx = mem::replace(&mut self.ctx, Context::ForcedExpr);
        let in_for_stmt_head = mem::replace(&mut self.in_for_stmt_head, false);
        e.elems.visit_mut_with(self);
        self.in_for_stmt_head = in_for_stmt_head;
        self.ctx = ctx;
    }

    fn visit_mut_arrow_expr(&mut self, node: &mut ArrowExpr) {
        let old = self.ctx;
        self.ctx = Context::Default;
        node.visit_mut_children_with(self);
        match &mut *node.body {
            BlockStmtOrExpr::Expr(e) if e.is_seq() => {
                self.wrap(e);
            }

            BlockStmtOrExpr::Expr(e) if e.is_assign() => {
                if let Expr::Assign(assign) = &**e {
                    if let AssignTarget::Pat(..) = &assign.left {
                        self.wrap(e);
                    }
                }
            }

            _ => {}
        };
        self.ctx = old;
    }

    fn visit_mut_assign_expr(&mut self, expr: &mut AssignExpr) {
        expr.left.visit_mut_with(self);

        let ctx = self.ctx;
        self.ctx = Context::FreeExpr;
        expr.right.visit_mut_with(self);
        self.ctx = ctx;

        fn rhs_need_paren(e: &Expr) -> bool {
            match e {
                Expr::Assign(e) => rhs_need_paren(&e.right),
                Expr::Seq(..) => true,
                _ => false,
            }
        }

        if rhs_need_paren(&expr.right) {
            self.wrap(&mut expr.right);
        }

        fn find_nearest_opt_chain_as_obj(e: &mut Expr) -> Option<&mut Expr> {
            match e {
                Expr::Member(MemberExpr { obj, .. }) => {
                    if obj.is_opt_chain() {
                        Some(obj)
                    } else {
                        find_nearest_opt_chain_as_obj(obj)
                    }
                }
                _ => None,
            }
        }

        let lhs_expr = match &mut expr.left {
            AssignTarget::Simple(e) => Some(e),
            AssignTarget::Pat(..) => None,
        };

        if let Some(e) = lhs_expr
            .and_then(|e| e.as_mut_member())
            .and_then(|me| find_nearest_opt_chain_as_obj(&mut me.obj))
        {
            self.wrap(e)
        };
    }

    fn visit_mut_assign_pat(&mut self, node: &mut AssignPat) {
        let in_for_stmt_head = mem::replace(&mut self.in_for_stmt_head, false);
        node.visit_mut_children_with(self);
        self.in_for_stmt_head = in_for_stmt_head;

        if let Expr::Seq(..) = &*node.right {
            self.wrap(&mut node.right);
        }
    }

    fn visit_mut_assign_pat_prop(&mut self, node: &mut AssignPatProp) {
        node.key.visit_mut_children_with(self);

        let old = self.ctx;
        self.ctx = Context::ForcedExpr;
        let in_for_stmt_head = mem::replace(&mut self.in_for_stmt_head, false);
        node.value.visit_mut_with(self);
        self.in_for_stmt_head = in_for_stmt_head;
        self.ctx = old;
    }

    fn visit_mut_assign_target(&mut self, n: &mut AssignTarget) {
        n.visit_mut_children_with(self);

        match n {
            AssignTarget::Simple(a) => {
                if let SimpleAssignTarget::Paren(s) = a {
                    *n = AssignTarget::try_from(s.expr.take()).unwrap();
                }
            }
            AssignTarget::Pat(b) => {
                if let AssignTargetPat::Invalid(_) = b {
                    *n = AssignTarget::Simple(SimpleAssignTarget::Invalid(Invalid {
                        span: DUMMY_SP,
                    }));
                }
            }
        }
    }

    fn visit_mut_await_expr(&mut self, expr: &mut AwaitExpr) {
        let old = self.ctx;
        self.ctx = Context::ForcedExpr;
        expr.arg.visit_mut_with(self);
        self.ctx = old;

        match &*expr.arg {
            Expr::Cond(..)
            | Expr::Assign(..)
            | Expr::Bin(..)
            | Expr::Yield(..)
            | Expr::Arrow(..) => self.wrap(&mut expr.arg),
            _ => {}
        }
    }

    fn visit_mut_bin_expr(&mut self, expr: &mut BinExpr) {
        expr.left.visit_mut_with(self);
        let ctx = self.ctx;
        self.ctx = Context::FreeExpr;
        expr.right.visit_mut_with(self);
        self.ctx = ctx;

        match expr.op {
            op!("||") | op!("&&") => match (&*expr.left, &*expr.right) {
                (Expr::Update(..), Expr::Call(..)) => {
                    return;
                }

                (Expr::Update(..), Expr::Assign(..)) => {
                    self.wrap(&mut expr.right);
                    return;
                }

                _ => {}
            },

            op!(">") | op!(">=") | op!("<") | op!("<=") => {
                if let (Expr::Update(..) | Expr::Lit(..), Expr::Update(..) | Expr::Lit(..)) =
                    (&*expr.left, &*expr.right)
                {
                    return;
                }
            }

            op!("**") => match &*expr.left {
                Expr::Unary(..) => {
                    self.wrap(&mut expr.left);
                }
                Expr::Lit(Lit::Num(v)) if v.value.is_sign_negative() => {
                    self.wrap(&mut expr.left);
                }
                _ => {}
            },

            _ => {}
        }

        match &mut *expr.right {
            Expr::Assign(..)
            | Expr::Seq(..)
            | Expr::Yield(..)
            | Expr::Cond(..)
            | Expr::Arrow(..) => {
                self.wrap(&mut expr.right);
            }
            Expr::Bin(BinExpr { op: op_of_rhs, .. }) => {
                if *op_of_rhs == expr.op {
                    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence#precedence_and_associativity
                    // `**` is the only right associative operator in js
                    if !(expr.op.may_short_circuit() || expr.op == op!("**")) {
                        self.wrap(&mut expr.right);
                    }
                } else if op_of_rhs.precedence() <= expr.op.precedence()
                    || (*op_of_rhs == op!("&&") && expr.op == op!("??"))
                {
                    self.wrap(&mut expr.right);
                }
            }
            _ => {}
        };

        match &mut *expr.left {
            Expr::Bin(BinExpr { op: op!("??"), .. }) if expr.op != op!("??") => {
                self.wrap(&mut expr.left);
            }

            // While simplifying, (1 + x) * Nan becomes `1 + x * Nan`.
            // But it should be `(1 + x) * Nan`
            Expr::Bin(BinExpr { op: op_of_lhs, .. }) => {
                if op_of_lhs.precedence() < expr.op.precedence()
                    || (op_of_lhs.precedence() == expr.op.precedence() && expr.op == op!("**"))
                {
                    self.wrap(&mut expr.left);
                }
            }

            Expr::Unary(UnaryExpr {
                op: op!("void"), ..
            }) if expr.op == op!("==")
                || expr.op == op!("===")
                || expr.op == op!("!=")
                || expr.op == op!("!==") => {}

            Expr::Seq(..)
            | Expr::Unary(UnaryExpr {
                op: op!("delete"), ..
            })
            | Expr::Unary(UnaryExpr {
                op: op!("void"), ..
            })
            | Expr::Yield(..)
            | Expr::Cond(..)
            | Expr::Assign(..)
            | Expr::Arrow(..) => {
                self.wrap(&mut expr.left);
            }
            Expr::Object(..)
                if expr.op == op!("instanceof")
                    || expr.op == op!("==")
                    || expr.op == op!("===")
                    || expr.op == op!("!=")
                    || expr.op == op!("!==") =>
            {
                self.wrap(&mut expr.left)
            }
            _ => {}
        }

        if let op!("??") = expr.op {
            match &*expr.left {
                Expr::Bin(BinExpr { op, .. }) if *op != op!("??") => {
                    self.wrap(&mut expr.left);
                }
                _ => (),
            }
        }
    }

    fn visit_mut_block_stmt(&mut self, n: &mut BlockStmt) {
        let in_for_stmt_head = mem::replace(&mut self.in_for_stmt_head, false);
        n.visit_mut_children_with(self);
        self.in_for_stmt_head = in_for_stmt_head;
    }

    fn visit_mut_block_stmt_or_expr(&mut self, body: &mut BlockStmtOrExpr) {
        body.visit_mut_children_with(self);

        match body {
            BlockStmtOrExpr::Expr(expr) if expr.is_object() => {
                self.wrap(expr);
            }

            _ => {}
        }
    }

    fn visit_mut_call_expr(&mut self, node: &mut CallExpr) {
        let ctx = mem::replace(&mut self.ctx, Context::Callee);

        node.callee.visit_mut_with(self);
        if let Callee::Expr(e) = &mut node.callee {
            match &**e {
                Expr::OptChain(_) if !self.in_opt_chain => self.wrap(e),
                _ => self.wrap_callee(e),
            }
        }

        self.ctx = Context::ForcedExpr;

        node.args.visit_mut_with(self);

        self.ctx = ctx;
    }

    fn visit_mut_class(&mut self, node: &mut Class) {
        let ctx = mem::replace(&mut self.ctx, Context::Default);

        node.super_class.visit_mut_with(self);

        let in_for_stmt_head = mem::replace(&mut self.in_for_stmt_head, false);
        node.body.visit_mut_with(self);
        self.in_for_stmt_head = in_for_stmt_head;

        match &mut node.super_class {
            Some(e)
                if e.is_seq()
                    || e.is_await_expr()
                    || e.is_yield_expr()
                    || e.is_bin()
                    || e.is_assign()
                    || e.is_cond()
                    || e.is_unary() =>
            {
                self.wrap(e)
            }
            _ => {}
        };
        self.ctx = ctx;

        node.body.retain(|m| !matches!(m, ClassMember::Empty(..)));
    }

    fn visit_mut_computed_prop_name(&mut self, name: &mut ComputedPropName) {
        let ctx = self.ctx;
        self.ctx = Context::FreeExpr;
        name.visit_mut_children_with(self);
        self.ctx = ctx;
    }

    fn visit_mut_cond_expr(&mut self, expr: &mut CondExpr) {
        expr.test.visit_mut_with(self);

        let ctx = self.ctx;
        self.ctx = Context::FreeExpr;
        expr.cons.visit_mut_with(self);
        expr.alt.visit_mut_with(self);
        self.ctx = ctx;
    }

    fn visit_mut_export_default_expr(&mut self, node: &mut ExportDefaultExpr) {
        let old = self.ctx;
        self.ctx = Context::Default;
        node.visit_mut_children_with(self);
        match &mut *node.expr {
            Expr::Arrow(..) | Expr::Seq(..) => self.wrap(&mut node.expr),
            Expr::Fn(FnExpr { ident: Some(_), .. })
            | Expr::Class(ClassExpr { ident: Some(_), .. }) => self.wrap(&mut node.expr),
            _ => {}
        };
        self.ctx = old;
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        let ctx = self.ctx;

        if ctx == Context::Default {
            match e {
                // might have a child expr in start of stmt
                Expr::OptChain(_)
                | Expr::Member(_)
                | Expr::Bin(_)
                | Expr::Assign(_)
                | Expr::Seq(_)
                | Expr::Cond(_)
                | Expr::TaggedTpl(_)
                | Expr::Update(UpdateExpr { prefix: false, .. }) => {}
                _ => self.ctx = Context::FreeExpr,
            }
        }
        self.unwrap_expr(e);

        maybe_grow_default(|| e.visit_mut_children_with(self));

        self.ctx = ctx;
        self.wrap_with_paren_if_required(e)
    }

    fn visit_mut_expr_or_spread(&mut self, e: &mut ExprOrSpread) {
        e.visit_mut_children_with(self);

        if e.spread.is_none() {
            if let Expr::Yield(..) = *e.expr {
                self.wrap(&mut e.expr);
            }
        }
    }

    fn visit_mut_expr_stmt(&mut self, s: &mut ExprStmt) {
        let old = self.ctx;
        self.ctx = Context::Default;
        s.expr.visit_mut_with(self);
        self.ctx = old;

        self.handle_expr_stmt(&mut s.expr);
    }

    fn visit_mut_for_head(&mut self, n: &mut ForHead) {
        let in_for_stmt_head = mem::replace(&mut self.in_for_stmt_head, true);
        n.visit_mut_children_with(self);
        self.in_for_stmt_head = in_for_stmt_head;
    }

    fn visit_mut_for_of_stmt(&mut self, s: &mut ForOfStmt) {
        s.visit_mut_children_with(self);

        if !s.is_await {
            match &s.left {
                ForHead::Pat(p)
                    if match &**p {
                        Pat::Ident(BindingIdent {
                            id: Ident { sym, .. },
                            ..
                        }) => &**sym == "async",
                        _ => false,
                    } =>
                {
                    let expr: Pat = p.clone().expect_ident().into();
                    s.left = ForHead::Pat(expr.into());
                }
                _ => (),
            }

            if let ForHead::Pat(e) = &mut s.left {
                if let Pat::Expr(expr) = &mut **e {
                    if expr.is_ident_ref_to("async") {
                        self.wrap(&mut *expr);
                    }
                }
            }
        }

        if let Expr::Seq(..) | Expr::Await(..) = &*s.right {
            self.wrap(&mut s.right)
        }
    }

    fn visit_mut_for_stmt(&mut self, n: &mut ForStmt) {
        let in_for_stmt_head = mem::replace(&mut self.in_for_stmt_head, true);
        n.init.visit_mut_with(self);
        self.in_for_stmt_head = in_for_stmt_head;

        n.test.visit_mut_with(self);
        n.update.visit_mut_with(self);
        n.body.visit_mut_with(self);
    }

    fn visit_mut_if_stmt(&mut self, node: &mut IfStmt) {
        node.visit_mut_children_with(self);

        if will_eat_else_token(&node.cons) {
            node.cons = Box::new(
                BlockStmt {
                    span: node.cons.span(),
                    stmts: vec![*node.cons.take()],
                    ..Default::default()
                }
                .into(),
            );
        }
    }

    fn visit_mut_key_value_pat_prop(&mut self, node: &mut KeyValuePatProp) {
        let old = self.ctx;
        self.ctx = Context::ForcedExpr;
        node.key.visit_mut_with(self);
        self.ctx = old;

        node.value.visit_mut_with(self);
    }

    fn visit_mut_key_value_prop(&mut self, prop: &mut KeyValueProp) {
        prop.visit_mut_children_with(self);

        if let Expr::Seq(..) = *prop.value {
            self.wrap(&mut prop.value)
        }
    }

    fn visit_mut_member_expr(&mut self, n: &mut MemberExpr) {
        n.visit_mut_children_with(self);

        match *n.obj {
            Expr::Object(..) if self.ctx == Context::ForcedExpr => {}
            Expr::Fn(..)
            | Expr::Cond(..)
            | Expr::Unary(..)
            | Expr::Seq(..)
            | Expr::Update(..)
            | Expr::Bin(..)
            | Expr::Object(..)
            | Expr::Assign(..)
            | Expr::Arrow(..)
            | Expr::Class(..)
            | Expr::Yield(..)
            | Expr::Await(..)
            | Expr::New(NewExpr { args: None, .. }) => {
                self.wrap(&mut n.obj);
            }
            Expr::Call(..) if self.ctx == Context::NewCallee => {
                self.wrap(&mut n.obj);
            }
            Expr::OptChain(..) if !self.in_opt_chain => {
                self.wrap(&mut n.obj);
            }
            _ => {}
        }
    }

    fn visit_mut_module(&mut self, n: &mut Module) {
        debug_assert!(self.span_map.is_empty());
        self.span_map.clear();

        n.visit_mut_children_with(self);
        if let Some(c) = self.comments {
            for (to, from) in self.span_map.drain(RangeFull).rev() {
                c.move_leading(from.lo, to.lo);
                c.move_trailing(from.hi, to.hi);
            }
        }
    }

    fn visit_mut_new_expr(&mut self, node: &mut NewExpr) {
        let ctx = mem::replace(&mut self.ctx, Context::ForcedExpr);

        node.args.visit_mut_with(self);

        self.ctx = Context::NewCallee;
        node.callee.visit_mut_with(self);
        match *node.callee {
            Expr::Call(..)
            | Expr::Await(..)
            | Expr::Yield(..)
            | Expr::Bin(..)
            | Expr::Assign(..)
            | Expr::Seq(..)
            | Expr::Unary(..)
            | Expr::Lit(..) => self.wrap(&mut node.callee),
            _ => {}
        }
        self.ctx = ctx;
    }

    fn visit_mut_opt_call(&mut self, node: &mut OptCall) {
        let ctx = mem::replace(&mut self.ctx, Context::Callee);
        let in_opt_chain = mem::replace(&mut self.in_opt_chain, true);

        node.callee.visit_mut_with(self);
        self.wrap_callee(&mut node.callee);

        self.in_opt_chain = in_opt_chain;

        self.ctx = Context::ForcedExpr;
        node.args.visit_mut_with(self);

        self.ctx = ctx;
    }

    fn visit_mut_opt_chain_base(&mut self, n: &mut OptChainBase) {
        if !n.is_member() {
            n.visit_mut_children_with(self);
            return;
        }

        let in_opt_chain = mem::replace(&mut self.in_opt_chain, true);
        n.visit_mut_children_with(self);
        self.in_opt_chain = in_opt_chain;
    }

    fn visit_mut_param(&mut self, node: &mut Param) {
        let old = self.ctx;
        self.ctx = Context::ForcedExpr;
        node.visit_mut_children_with(self);
        self.ctx = old;
    }

    fn visit_mut_prop_name(&mut self, name: &mut PropName) {
        name.visit_mut_children_with(self);

        match name {
            PropName::Computed(c) if c.expr.is_seq() => {
                self.wrap(&mut c.expr);
            }
            _ => {}
        }
    }

    fn visit_mut_script(&mut self, n: &mut Script) {
        debug_assert!(self.span_map.is_empty());
        self.span_map.clear();

        n.visit_mut_children_with(self);
        if let Some(c) = self.comments {
            for (to, from) in self.span_map.drain(RangeFull).rev() {
                c.move_leading(from.lo, to.lo);
                c.move_trailing(from.hi, to.hi);
            }
        }
    }

    fn visit_mut_seq_expr(&mut self, seq: &mut SeqExpr) {
        if seq.exprs.len() > 1 {
            seq.exprs[0].visit_mut_with(self);

            let ctx = self.ctx;
            self.ctx = Context::FreeExpr;
            for expr in seq.exprs.iter_mut().skip(1) {
                expr.visit_mut_with(self)
            }
            self.ctx = ctx;
        } else {
            seq.exprs.visit_mut_children_with(self)
        }
    }

    fn visit_mut_spread_element(&mut self, e: &mut SpreadElement) {
        let old = self.ctx;
        self.ctx = Context::ForcedExpr;
        e.visit_mut_children_with(self);
        self.ctx = old;
    }

    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
        let old = self.ctx;
        // only ExprStmt would have unparented expr,
        // which would be handled in its own visit function
        self.ctx = Context::FreeExpr;
        s.visit_mut_children_with(self);
        self.ctx = old;
    }

    fn visit_mut_tagged_tpl(&mut self, e: &mut TaggedTpl) {
        e.visit_mut_children_with(self);

        match &*e.tag {
            Expr::Object(..) if self.ctx == Context::Default => {
                self.wrap(&mut e.tag);
            }
            Expr::OptChain(..)
            | Expr::Arrow(..)
            | Expr::Cond(..)
            | Expr::Bin(..)
            | Expr::Seq(..)
            | Expr::Fn(..)
            | Expr::Assign(..)
            | Expr::Unary(..) => {
                self.wrap(&mut e.tag);
            }
            _ => {}
        }
    }

    fn visit_mut_unary_expr(&mut self, n: &mut UnaryExpr) {
        let old = self.ctx;
        self.ctx = Context::FreeExpr;
        n.visit_mut_children_with(self);
        self.ctx = old;

        match &*n.arg {
            Expr::Bin(BinExpr {
                op: op!("/") | op!("*"),
                left,
                right,
                ..
            }) if n.op == op!(unary, "-")
                && match (&**left, &**right) {
                    (Expr::Lit(Lit::Num(l)), Expr::Lit(Lit::Num(..))) => {
                        !l.value.is_sign_negative()
                    }
                    _ => false,
                } => {}

            Expr::Assign(..)
            | Expr::Bin(..)
            | Expr::Seq(..)
            | Expr::Cond(..)
            | Expr::Arrow(..)
            | Expr::Yield(..) => self.wrap(&mut n.arg),

            _ => {}
        }
    }

    fn visit_mut_var_declarator(&mut self, node: &mut VarDeclarator) {
        node.name.visit_mut_children_with(self);

        let old = self.ctx;
        self.ctx = Context::ForcedExpr;
        node.init.visit_mut_with(self);
        self.ctx = old;
    }

    fn visit_mut_yield_expr(&mut self, expr: &mut YieldExpr) {
        let old = self.ctx;
        self.ctx = Context::ForcedExpr;
        expr.arg.visit_mut_with(self);
        self.ctx = old;
    }

    fn visit_mut_object_lit(&mut self, n: &mut ObjectLit) {
        let in_for_stmt_head = mem::replace(&mut self.in_for_stmt_head, false);
        n.visit_mut_children_with(self);
        self.in_for_stmt_head = in_for_stmt_head;
    }

    fn visit_mut_params(&mut self, n: &mut Vec<Param>) {
        let in_for_stmt_head = mem::replace(&mut self.in_for_stmt_head, false);
        n.visit_mut_children_with(self);
        self.in_for_stmt_head = in_for_stmt_head;
    }

    // only used in ArrowExpr
    fn visit_mut_pats(&mut self, n: &mut Vec<Pat>) {
        let in_for_stmt_head = mem::replace(&mut self.in_for_stmt_head, false);
        n.visit_mut_children_with(self);
        self.in_for_stmt_head = in_for_stmt_head;
    }

    fn visit_mut_expr_or_spreads(&mut self, n: &mut Vec<ExprOrSpread>) {
        let in_for_stmt_head = mem::replace(&mut self.in_for_stmt_head, false);
        n.visit_mut_children_with(self);
        self.in_for_stmt_head = in_for_stmt_head;
    }
}

impl Fixer<'_> {
    fn wrap_with_paren_if_required(&mut self, e: &mut Expr) {
        let mut has_padding_value = false;
        match e {
            Expr::Bin(BinExpr { op: op!("in"), .. }) if self.in_for_stmt_head => {
                // TODO:
                // if the in expression is in a parentheses, we should not wrap it with a
                // parentheses again. But the parentheses is added later,
                // so we don't have enough information to detect it at this moment.
                // Example:
                // for(var a = 1 + (2 || b in c) in {});
                //                 |~~~~~~~~~~~|
                // this parentheses is removed by unwrap_expr and added again later
                self.wrap(e);
            }

            Expr::Bin(BinExpr { left, .. })
                if self.ctx == Context::Default
                    && matches!(&**left, Expr::Object(..) | Expr::Fn(..) | Expr::Class(..)) =>
            {
                self.wrap(left);
            }

            // Flatten seq expr
            Expr::Seq(SeqExpr { span, exprs }) => {
                let len = exprs
                    .iter()
                    .map(|expr| match **expr {
                        Expr::Paren(ParenExpr { ref expr, .. }) => {
                            if let Expr::Seq(SeqExpr { exprs, .. }) = expr.as_ref() {
                                exprs.len()
                            } else {
                                1
                            }
                        }
                        Expr::Seq(SeqExpr { ref exprs, .. }) => exprs.len(),
                        _ => 1,
                    })
                    .sum();

                let exprs_len = exprs.len();
                // don't has child seq
                let mut exprs = if len == exprs_len {
                    let mut exprs = exprs
                        .iter_mut()
                        .enumerate()
                        .filter_map(|(i, e)| {
                            let is_last = i + 1 == exprs_len;
                            if is_last {
                                Some(e.take())
                            } else {
                                ignore_return_value(e.take(), &mut has_padding_value)
                            }
                        })
                        .collect::<Vec<_>>();
                    if exprs.len() == 1 {
                        *e = *exprs.pop().unwrap();
                        return;
                    }
                    ignore_padding_value(exprs)
                } else {
                    let mut buf = Vec::with_capacity(len);
                    for (i, expr) in exprs.iter_mut().enumerate() {
                        let is_last = i + 1 == exprs_len;

                        match &mut **expr {
                            Expr::Seq(SeqExpr { exprs, .. }) => {
                                let exprs = exprs.take();
                                if !is_last {
                                    buf.extend(exprs.into_iter().filter_map(|expr| {
                                        ignore_return_value(expr, &mut has_padding_value)
                                    }));
                                } else {
                                    let exprs_len = exprs.len();
                                    for (i, expr) in exprs.into_iter().enumerate() {
                                        let is_last = i + 1 == exprs_len;
                                        if is_last {
                                            buf.push(expr);
                                        } else {
                                            buf.extend(ignore_return_value(
                                                expr,
                                                &mut has_padding_value,
                                            ));
                                        }
                                    }
                                }
                            }
                            _ => {
                                if is_last {
                                    buf.push(expr.take());
                                } else {
                                    buf.extend(ignore_return_value(
                                        expr.take(),
                                        &mut has_padding_value,
                                    ));
                                }
                            }
                        }
                    }

                    if buf.len() == 1 {
                        *e = *buf.pop().unwrap();
                        return;
                    }

                    ignore_padding_value(buf)
                };

                if self.ctx == Context::Default {
                    if let Some(expr) = exprs.first_mut() {
                        match &mut **expr {
                            Expr::Call(CallExpr {
                                callee: Callee::Expr(callee_expr),
                                ..
                            }) if callee_expr.is_fn_expr() => self.wrap(callee_expr),
                            _ => (),
                        }
                    }
                }

                let mut expr = SeqExpr { span: *span, exprs }.into();

                if let Context::ForcedExpr = self.ctx {
                    self.wrap(&mut expr);
                };

                *e = expr;
            }

            Expr::Cond(expr) => {
                match &mut *expr.test {
                    Expr::Seq(..)
                    | Expr::Assign(..)
                    | Expr::Cond(..)
                    | Expr::Arrow(..)
                    | Expr::Yield(..) => self.wrap(&mut expr.test),

                    Expr::Object(..) | Expr::Fn(..) | Expr::Class(..) => {
                        if self.ctx == Context::Default {
                            self.wrap(&mut expr.test)
                        }
                    }
                    _ => {}
                };

                if let Expr::Seq(..) = *expr.cons {
                    self.wrap(&mut expr.cons)
                };

                if let Expr::Seq(..) = *expr.alt {
                    self.wrap(&mut expr.alt)
                };

                if let Context::NewCallee = self.ctx {
                    self.wrap(e)
                }
            }

            Expr::Call(CallExpr {
                callee: Callee::Expr(callee),
                ..
            }) if callee.is_seq()
                || callee.is_arrow()
                || callee.is_await_expr()
                || callee.is_assign() =>
            {
                self.wrap(callee);
            }
            Expr::OptChain(OptChainExpr { base, .. }) => match &mut **base {
                OptChainBase::Call(OptCall { callee, .. })
                    if callee.is_seq()
                        || callee.is_arrow()
                        || callee.is_await_expr()
                        || callee.is_assign() =>
                {
                    self.wrap(callee);
                }

                OptChainBase::Call(OptCall { callee, .. }) if callee.is_fn_expr() => match self.ctx
                {
                    Context::ForcedExpr | Context::FreeExpr => {}

                    Context::NewCallee => self.wrap(e),

                    _ => self.wrap(callee),
                },

                _ => {}
            },

            // Function expression cannot start with `function`
            Expr::Call(CallExpr {
                callee: Callee::Expr(callee),
                ..
            }) if callee.is_fn_expr() => match self.ctx {
                Context::ForcedExpr | Context::FreeExpr => {}

                Context::NewCallee => self.wrap(e),

                _ => self.wrap(callee),
            },

            Expr::Member(MemberExpr { obj, .. }) => match &**obj {
                Expr::Lit(Lit::Num(num)) if num.value.signum() == -1. => {
                    self.wrap(obj);
                }
                _ => {}
            },
            _ => {}
        }
    }

    /// Wrap with a paren.
    fn wrap(&mut self, e: &mut Expr) {
        let mut span = e.span();

        if let Some(new_span) = self.span_map.shift_remove(&span) {
            span = new_span;
        }

        if span.is_pure() {
            span = DUMMY_SP;
        }

        let expr = Box::new(e.take());
        *e = ParenExpr { expr, span }.into();
    }

    /// Removes paren
    fn unwrap_expr(&mut self, e: &mut Expr) {
        loop {
            match e {
                Expr::Seq(SeqExpr { exprs, .. }) if exprs.len() == 1 => {
                    *e = *exprs[0].take();
                }

                Expr::Paren(ParenExpr {
                    span: paren_span,
                    expr,
                    ..
                }) => {
                    let expr_span = expr.span();
                    let paren_span = *paren_span;
                    *e = *expr.take();

                    self.span_map.insert(expr_span, paren_span);
                }

                _ => return,
            }
        }
    }

    fn handle_expr_stmt(&mut self, expr: &mut Expr) {
        match expr {
            // It's important for arrow pass to work properly.
            Expr::Object(..) | Expr::Class(..) | Expr::Fn(..) => self.wrap(expr),

            // ({ a } = foo)
            Expr::Assign(AssignExpr {
                left: AssignTarget::Pat(left),
                ..
            }) if left.is_object() => self.wrap(expr),

            Expr::Seq(SeqExpr { exprs, .. }) => {
                debug_assert!(
                    exprs.len() != 1,
                    "SeqExpr should be unwrapped if exprs.len() == 1, but length is 1"
                );

                let len = exprs.len();
                exprs.iter_mut().enumerate().for_each(|(i, expr)| {
                    let is_last = len == i + 1;

                    if !is_last {
                        self.handle_expr_stmt(expr);
                    }
                });
            }

            _ => {}
        }
    }
}

fn ignore_return_value(expr: Box<Expr>, has_padding_value: &mut bool) -> Option<Box<Expr>> {
    match *expr {
        Expr::Fn(..) | Expr::Arrow(..) | Expr::Lit(..) => {
            if *has_padding_value {
                None
            } else {
                *has_padding_value = true;
                Some(expr)
            }
        }
        Expr::Seq(SeqExpr { span, exprs }) => {
            let len = exprs.len();
            let mut exprs: Vec<_> = exprs
                .into_iter()
                .enumerate()
                .filter_map(|(i, expr)| {
                    if i + 1 == len {
                        Some(expr)
                    } else {
                        ignore_return_value(expr, has_padding_value)
                    }
                })
                .collect();

            match exprs.len() {
                0 | 1 => exprs.pop(),
                _ => Some(SeqExpr { span, exprs }.into()),
            }
        }
        Expr::Unary(UnaryExpr {
            op: op!("void"),
            arg,
            ..
        }) => ignore_return_value(arg, has_padding_value),
        _ => Some(expr),
    }
}

// at least 3 element in seq, which means we can safely
// remove that padding, if not at last position
#[allow(clippy::vec_box)]
fn ignore_padding_value(exprs: Vec<Box<Expr>>) -> Vec<Box<Expr>> {
    let len = exprs.len();

    if len > 2 {
        exprs
            .into_iter()
            .enumerate()
            .filter_map(|(i, e)| match e.as_ref() {
                Expr::Fn(..) | Expr::Arrow(..) | Expr::Lit(..) if i + 1 != len => None,
                _ => Some(e),
            })
            .collect()
    } else {
        exprs
    }
}

fn will_eat_else_token(s: &Stmt) -> bool {
    match s {
        Stmt::If(s) => match &s.alt {
            Some(alt) => will_eat_else_token(alt),
            None => true,
        },
        // Ends with `}`.
        Stmt::Block(..) => false,
        Stmt::Labeled(s) => will_eat_else_token(&s.body),
        Stmt::While(s) => will_eat_else_token(&s.body),
        Stmt::For(s) => will_eat_else_token(&s.body),
        Stmt::ForIn(s) => will_eat_else_token(&s.body),
        Stmt::ForOf(s) => will_eat_else_token(&s.body),
        _ => false,
    }
}
