use crate::ext::{AsOptExpr, MapWithMut, PatOrExprExt};
use fxhash::FxHashMap;
use swc_common::{comments::Comments, Span, Spanned};
use swc_ecma_ast::*;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

pub fn fixer<'a>(comments: Option<&'a dyn Comments>) -> impl 'a + Fold {
    as_folder(Fixer {
        comments,
        ctx: Default::default(),
        span_map: Default::default(),
    })
}

struct Fixer<'a> {
    comments: Option<&'a dyn Comments>,
    ctx: Context,
    /// A hash map to preserve original span.
    ///
    /// Key is span of inner expression, and value is span of the paren
    /// expression.
    span_map: FxHashMap<Span, Span>,
}

#[repr(u8)]
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Context {
    Default,

    Callee {
        is_new: bool,
    },
    /// Always treated as expr. (But number of comma-separated expression
    /// matters)
    ///
    ///  - `foo((bar, x))` != `foo(bar, x)`
    ///  - `var foo = (bar, x)` != `var foo = bar, x`
    ///  - `[(foo, bar)]` != `[foo, bar]`
    ForcedExpr {
        is_var_decl: bool,
    },

    /// Always treated as expr and comma does not matter.
    FreeExpr,
}

impl Default for Context {
    fn default() -> Self {
        Context::Default
    }
}

macro_rules! array {
    ($name:ident, $T:tt) => {
        fn $name(&mut self, e: &mut $T) {
            let old = self.ctx;
            self.ctx = Context::ForcedExpr { is_var_decl: false }.into();
            e.elems.visit_mut_with(self);
            self.ctx = old;
        }
    };
}

impl VisitMut for Fixer<'_> {
    noop_visit_mut_type!();

    array!(visit_mut_array_lit, ArrayLit);
    // array!(ArrayPat);

    fn visit_mut_new_expr(&mut self, node: &mut NewExpr) {
        let old = self.ctx;
        self.ctx = Context::ForcedExpr { is_var_decl: false };
        node.args.visit_mut_with(self);
        self.ctx = old;

        let old = self.ctx;
        self.ctx = Context::Callee { is_new: true };
        node.callee.visit_mut_with(self);
        match *node.callee {
            Expr::Call(..)
            | Expr::Bin(..)
            | Expr::Assign(..)
            | Expr::Seq(..)
            | Expr::Unary(..)
            | Expr::Lit(..) => self.wrap(&mut node.callee),
            _ => {}
        }
        self.ctx = old;
    }

    fn visit_mut_await_expr(&mut self, expr: &mut AwaitExpr) {
        let old = self.ctx;
        self.ctx = Context::ForcedExpr { is_var_decl: false };
        expr.arg.visit_mut_with(self);
        self.ctx = old;

        match &*expr.arg {
            Expr::Cond(..) | Expr::Assign(..) => self.wrap(&mut expr.arg),
            _ => {}
        }
    }

    fn visit_mut_call_expr(&mut self, node: &mut CallExpr) {
        let old = self.ctx;
        self.ctx = Context::ForcedExpr { is_var_decl: false };
        node.args.visit_mut_with(self);
        self.ctx = old;

        let old = self.ctx;
        self.ctx = Context::Callee { is_new: false };
        node.callee.visit_mut_with(self);
        match &mut node.callee {
            ExprOrSuper::Expr(e) if e.is_cond() || e.is_bin() || e.is_lit() => {
                self.wrap(&mut **e);
            }
            _ => {}
        }

        self.ctx = old;
    }

    fn visit_mut_param(&mut self, node: &mut Param) {
        let old = self.ctx;
        self.ctx = Context::ForcedExpr { is_var_decl: false };
        node.visit_mut_children_with(self);
        self.ctx = old;
    }

    fn visit_mut_assign_expr(&mut self, expr: &mut AssignExpr) {
        expr.visit_mut_children_with(self);

        match &mut *expr.right {
            // `foo = (bar = baz)` => foo = bar = baz
            Expr::Assign(AssignExpr { ref left, .. }) if left.as_ident().is_some() => {}

            Expr::Seq(..) => self.wrap(&mut expr.right),
            _ => {}
        }
    }

    fn visit_mut_arrow_expr(&mut self, node: &mut ArrowExpr) {
        let old = self.ctx;
        self.ctx = Context::Default;
        node.visit_mut_children_with(self);
        match &mut node.body {
            BlockStmtOrExpr::Expr(ref mut e) if e.is_seq() => {
                self.wrap(&mut **e);
            }
            _ => {}
        };
        self.ctx = old;
    }

    fn visit_mut_bin_expr(&mut self, expr: &mut BinExpr) {
        expr.visit_mut_children_with(self);

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
                    match expr.op {
                        op!("&&") | op!("||") => {}
                        _ => {
                            self.wrap(&mut expr.right);
                        }
                    }
                } else if op_of_rhs.precedence() <= expr.op.precedence() {
                    self.wrap(&mut expr.right);
                }
            }
            _ => {}
        };

        match &mut *expr.left {
            Expr::Bin(BinExpr { op: op!("??"), .. }) => {
                self.wrap(&mut expr.left);
            }

            // While simplifying, (1 + x) * Nan becomes `1 + x * Nan`.
            // But it should be `(1 + x) * Nan`
            Expr::Bin(BinExpr { op: op_of_lhs, .. }) => {
                if op_of_lhs.precedence() < expr.op.precedence() {
                    self.wrap(&mut expr.left);
                }
            }

            Expr::Seq(..)
            | Expr::Update(..)
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

        match expr.op {
            op!("??") => match &mut *expr.left {
                Expr::Bin(..) => {
                    self.wrap(&mut expr.left);
                }
                _ => {}
            },
            _ => {}
        }
    }

    fn visit_mut_member_expr(&mut self, n: &mut MemberExpr) {
        n.obj.visit_mut_with(self);
        n.prop.visit_mut_with(self);

        match n {
            MemberExpr { obj, .. }
                if obj.as_expr().map(|e| e.is_object()).unwrap_or(false)
                    && match self.ctx {
                        Context::ForcedExpr { .. } => true,
                        _ => false,
                    } => {}

            MemberExpr {
                obj: ExprOrSuper::Expr(ref mut obj),
                ..
            } if obj.is_fn_expr()
                || obj.is_cond()
                || obj.is_unary()
                || obj.is_seq()
                || obj.is_update()
                || obj.is_bin()
                || obj.is_object()
                || obj.is_assign()
                || obj.is_arrow()
                || obj.is_class()
                || obj.is_yield_expr()
                || obj.is_await_expr()
                || match **obj {
                    Expr::New(NewExpr { args: None, .. }) => true,
                    _ => false,
                } =>
            {
                self.wrap(&mut **obj);
                return;
            }

            _ => {}
        }
    }

    fn visit_mut_unary_expr(&mut self, n: &mut UnaryExpr) {
        let old = self.ctx;
        self.ctx = Context::FreeExpr;
        n.visit_mut_children_with(self);
        self.ctx = old;

        match *n.arg {
            Expr::Assign(..)
            | Expr::Bin(..)
            | Expr::Seq(..)
            | Expr::Cond(..)
            | Expr::Arrow(..)
            | Expr::Yield(..) => self.wrap(&mut n.arg),

            _ => {}
        }
    }

    fn visit_mut_assign_pat_prop(&mut self, node: &mut AssignPatProp) {
        node.key.visit_mut_children_with(self);

        let old = self.ctx;
        self.ctx = Context::ForcedExpr { is_var_decl: false };
        node.value.visit_mut_with(self);
        self.ctx = old;
    }

    fn visit_mut_block_stmt_or_expr(&mut self, body: &mut BlockStmtOrExpr) {
        body.visit_mut_children_with(self);

        match body {
            BlockStmtOrExpr::Expr(ref mut expr) if expr.is_object() => {
                self.wrap(&mut **expr);
            }

            _ => {}
        }
    }

    fn visit_mut_class(&mut self, node: &mut Class) {
        let old = self.ctx;
        self.ctx = Context::Default;
        node.visit_mut_children_with(self);
        match &mut node.super_class {
            Some(ref mut e) if e.is_seq() || e.is_await_expr() => self.wrap(&mut **e),
            _ => {}
        };
        self.ctx = old;

        node.body.retain(|m| match m {
            ClassMember::Empty(..) => false,
            _ => true,
        });
    }

    fn visit_mut_export_default_expr(&mut self, node: &mut ExportDefaultExpr) {
        let old = self.ctx;
        self.ctx = Context::Default;
        node.visit_mut_children_with(self);
        match &mut *node.expr {
            Expr::Arrow(..) | Expr::Seq(..) => self.wrap(&mut node.expr),
            _ => {}
        };
        self.ctx = old;
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        self.unwrap_expr(e);
        e.visit_mut_children_with(self);

        self.wrap_with_paren_if_required(e)
    }
    fn visit_mut_expr_or_spread(&mut self, e: &mut ExprOrSpread) {
        e.visit_mut_children_with(self);

        if e.spread.is_none() {
            match *e.expr {
                Expr::Yield(..) => {
                    self.wrap(&mut e.expr);
                }
                _ => {}
            }
        }
    }

    fn visit_mut_if_stmt(&mut self, node: &mut IfStmt) {
        node.visit_mut_children_with(self);

        match *node.cons {
            Stmt::If(..) => {
                node.cons = Box::new(Stmt::Block(BlockStmt {
                    span: node.cons.span(),
                    stmts: vec![*node.cons.take()],
                }));
            }

            _ => {}
        }
    }

    fn visit_mut_key_value_pat_prop(&mut self, node: &mut KeyValuePatProp) {
        let old = self.ctx;
        self.ctx = Context::ForcedExpr { is_var_decl: false };
        node.key.visit_mut_with(self);
        self.ctx = old;

        node.value.visit_mut_with(self);
    }

    fn visit_mut_key_value_prop(&mut self, prop: &mut KeyValueProp) {
        prop.visit_mut_children_with(self);

        match *prop.value {
            Expr::Seq(..) => self.wrap(&mut prop.value),
            _ => {}
        }
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

    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
        let old = self.ctx;
        self.ctx = Context::Default;
        s.visit_mut_children_with(self);
        self.ctx = old;
    }

    fn visit_mut_expr_stmt(&mut self, s: &mut ExprStmt) {
        let old = self.ctx;
        self.ctx = Context::Default;
        s.expr.visit_mut_with(self);
        self.ctx = old;

        self.handle_expr_stmt(&mut *s.expr);
    }

    fn visit_mut_var_declarator(&mut self, node: &mut VarDeclarator) {
        node.name.visit_mut_children_with(self);

        let old = self.ctx;
        self.ctx = Context::ForcedExpr { is_var_decl: true };
        node.init.visit_mut_with(self);
        self.ctx = old;
    }

    fn visit_mut_module(&mut self, n: &mut Module) {
        debug_assert!(self.span_map.is_empty());
        self.span_map.clear();

        let n = n.visit_mut_children_with(self);
        if let Some(c) = self.comments {
            for (to, from) in self.span_map.drain() {
                c.move_leading(from.lo, to.lo);
                c.move_trailing(from.hi, to.hi);
            }
        }

        n
    }

    fn visit_mut_script(&mut self, n: &mut Script) {
        debug_assert!(self.span_map.is_empty());
        self.span_map.clear();

        let n = n.visit_mut_children_with(self);
        if let Some(c) = self.comments {
            for (to, from) in self.span_map.drain() {
                c.move_leading(from.lo, to.lo);
                c.move_trailing(from.hi, to.hi);
            }
        }

        n
    }
}

impl Fixer<'_> {
    fn wrap_with_paren_if_required(&mut self, e: &mut Expr) {
        let mut has_padding_value = false;
        match e {
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
                let expr = if len == exprs_len {
                    let mut exprs = exprs
                        .into_iter()
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
                    let exprs = ignore_padding_value(exprs);
                    Expr::Seq(SeqExpr { span: *span, exprs })
                } else {
                    let mut buf = Vec::with_capacity(len);
                    for (i, expr) in exprs.into_iter().enumerate() {
                        let is_last = i + 1 == exprs_len;

                        match **expr {
                            Expr::Seq(SeqExpr { ref mut exprs, .. }) => {
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

                    let exprs = ignore_padding_value(buf);

                    Expr::Seq(SeqExpr { span: *span, exprs })
                };

                match self.ctx {
                    Context::ForcedExpr { .. } => {
                        *e = Expr::Paren(ParenExpr {
                            span: *span,
                            expr: Box::new(expr),
                        })
                    }
                    _ => *e = expr,
                };
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

                match *expr.cons {
                    Expr::Seq(..) => self.wrap(&mut expr.cons),
                    _ => {}
                };

                match *expr.alt {
                    Expr::Seq(..) => self.wrap(&mut expr.alt),
                    _ => {}
                };

                match self.ctx {
                    Context::Callee { is_new: true } => self.wrap(e),
                    _ => {}
                }
            }

            Expr::Call(CallExpr {
                callee: ExprOrSuper::Expr(ref mut callee),
                ..
            }) if callee.is_seq() => {
                *callee = Box::new(Expr::Paren(ParenExpr {
                    span: callee.span(),
                    expr: callee.take(),
                }))
            }

            Expr::Call(CallExpr {
                callee: ExprOrSuper::Expr(ref mut callee),
                ..
            }) if callee.is_arrow() || callee.is_await_expr() => {
                self.wrap(&mut **callee);
            }

            // Function expression cannot start with `function`
            Expr::Call(CallExpr {
                callee: ExprOrSuper::Expr(ref mut callee),
                ..
            }) if callee.is_fn_expr() => match self.ctx {
                Context::ForcedExpr { .. } | Context::FreeExpr => {}

                Context::Callee { is_new: true } => self.wrap(e),

                _ => self.wrap(&mut **callee),
            },
            Expr::Call(CallExpr {
                callee: ExprOrSuper::Expr(ref mut callee),
                ..
            }) if callee.is_assign() => self.wrap(&mut **callee),
            _ => {}
        }
    }

    /// Wrap with a paren.
    fn wrap(&mut self, e: &mut Expr) {
        let span = e.span();

        let span = if let Some(span) = self.span_map.remove(&span) {
            span
        } else {
            span
        };

        let expr = Box::new(e.take());
        *e = Expr::Paren(ParenExpr { expr, span })
    }

    /// Removes paren
    fn unwrap_expr(&mut self, e: &mut Expr) {
        match &*e {
            Expr::Paren(paren) => {
                let inner_span = paren.span;
                if let Some(comments) = self.comments {
                    if comments.has_leading(inner_span.lo) {
                        return;
                    }
                }
            }
            _ => {}
        }

        match e {
            Expr::Seq(SeqExpr { ref mut exprs, .. }) if exprs.len() == 1 => {
                self.unwrap_expr(exprs.last_mut().unwrap());
                *e = *exprs.last_mut().unwrap().take();
            }
            Expr::Paren(ParenExpr {
                span: paren_span,
                ref mut expr,
                ..
            }) => {
                let expr_span = expr.span();
                let paren_span = *paren_span;
                self.unwrap_expr(&mut **expr);
                *e = *expr.take();

                self.span_map.insert(expr_span, paren_span);
            }
            _ => {}
        }
    }

    fn handle_expr_stmt(&mut self, expr: &mut Expr) {
        match expr {
            // It's important for arrow pass to work properly.
            Expr::Object(..) | Expr::Class(..) | Expr::Fn(..) => self.wrap(expr),

            // ({ a } = foo)
            Expr::Assign(AssignExpr {
                left: PatOrExpr::Pat(left),
                ..
            }) if left.is_object() => self.wrap(expr),

            Expr::Seq(SeqExpr { exprs, .. }) => {
                debug_assert!(
                    exprs.len() != 1,
                    "SeqExpr should be unwrapped if exprs.len() == 1, but length is 1"
                );

                let len = exprs.len();
                exprs.into_iter().enumerate().for_each(|(i, mut expr)| {
                    let is_last = len == i + 1;

                    if !is_last {
                        self.handle_expr_stmt(&mut expr);
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
                _ => Some(Box::new(Expr::Seq(SeqExpr { span, exprs }))),
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

#[cfg(test)]
mod tests {
    use super::fixer;

    fn run_test(from: &str, to: &str) {
        crate::tests::test_transform(
            Default::default(),
            |_| fixer(None),
            from,
            to,
            true,
            Default::default(),
        );
    }

    macro_rules! test_fixer {
        ($name:ident, $from:literal, $to:literal) => {
            #[test]
            fn $name() {
                run_test($from, $to);
            }
        };
    }

    macro_rules! identical {
        ($name:ident, $src:literal) => {
            test_fixer!($name, $src, $src);
        };
    }

    identical!(fn_expr_position, r#"foo(function(){}())"#);

    identical!(fn_decl, r#"function foo(){}"#);

    identical!(iife, r#"(function(){})()"#);

    identical!(paren_seq_arg, "foo(( _temp = _this = init(), _temp));");

    identical!(
        regression_01,
        "_set(_getPrototypeOf(Obj.prototype), _ref = proper.prop, (_superRef = \
         +_get(_getPrototypeOf(Obj.prototype), _ref, this)) + 1, this, true), _superRef;"
    );

    identical!(
        regression_02,
        "var obj = (_obj = {}, _defineProperty(_obj, 'first', 'first'), _defineProperty(_obj, \
         'second', 'second'), _obj);"
    );

    identical!(
        regression_03,
        "_iteratorNormalCompletion = (_step = _iterator.next()).done"
    );

    identical!(
        regression_04,
        "var _tmp;
const _ref = {}, { c =( _tmp = {}, d = _extends({}, _tmp), _tmp)  } = _ref;"
    );

    identical!(
        regression_05,
        "for (var _iterator = arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step \
         = _iterator.next()).done); _iteratorNormalCompletion = true) {
    i = _step.value;
}"
    );

    identical!(
        regression_06,
        "
        var _tmp;
        const { [( _tmp = {}, d = _extends({}, _tmp), _tmp)]: c  } = _ref;
        "
    );

    identical!(
        regression_07,
        "( _temp = super(), _initialize(this), _temp).method();"
    );

    identical!(regression_08, "exports.bar = exports.default = void 0;");

    identical!(regression_09, "({x} = { x: 1 });");

    identical!(regression_10, "({x} = { x: 1 }), exports.x = x;");

    identical!(regression_11, "(void 0).foo();");

    identical!(regression_12, "(function(){})()");

    identical!(regression_13, "a || (a = 1);");

    identical!(issue_192, "a === true && (a = true)");

    identical!(issue_199, "(i - 1).toString()");

    identical!(
        issue_201_01,
        "outer = {
    inner: (_obj = {}, _defineProperty(_obj, ns.EXPORT1, true), _defineProperty(_obj, ns.EXPORT2, \
         true), _obj)
};"
    );

    identical!(issue_207, "a => ({x: 'xxx', y: {a}});");

    test_fixer!(
        fixer_01,
        "var a, b, c, d, e, f;
((a, b), (c())) + ((d, e), (f()));
",
        "var a, b, c, d, e, f;
(a, b, c()) + (d, e, f())"
    );

    test_fixer!(fixer_02, "(b, c), d;", "b, c, d;");

    test_fixer!(fixer_03, "((a, b), (c && d)) && e;", "(a, b, c && d) && e;");

    test_fixer!(fixer_04, "for ((a, b), c;;) ;", "for(a, b, c;;);");

    test_fixer!(
        fixer_05,
        "var a, b, c = (1), d, e, f = (2);
((a, b), c) + ((d, e), f);",
        "var a, b, c = 1, d, e, f = 2;
(a, b, c) + (d, e, f);"
    );

    test_fixer!(
        fixer_06,
        "var a, b, c, d;
a = ((b, c), d);",
        "var a, b, c, d;
a = (b, c, d);"
    );

    test_fixer!(
        fixer_07,
        "a => ((b, c) => ((a, b), c));",
        "(a)=>(b, c)=>(a, b, c);"
    );

    test_fixer!(fixer_08, "typeof (((1), a), (2));", "typeof (a, 2)");

    test_fixer!(
        fixer_09,
        "(((a, b), c), d) ? e : f;",
        "(a, b, c, d) ? e : f;"
    );

    test_fixer!(
        fixer_10,
        "
function a() {
  return (((void (1)), (void (2))), a), (void (3));
}
",
        "
function a() {
  return a, void 3;
}
"
    );

    test_fixer!(fixer_11, "c && ((((2), (3)), d), b);", "c && (d, b)");

    test_fixer!(fixer_12, "(((a, b), c), d) + e;", "(a, b, c, d) + e;");

    test_fixer!(fixer_13, "delete (((1), a), (2));", "delete (a, 2)");

    test_fixer!(fixer_14, "(1, 2, a)", "1, a");

    identical!(issue_231, "'' + (truthy && '?') + truthy;");

    identical!(issue_252, "!!(a && b);");

    identical!(issue_255, "b < 0 ? (t = b, b = 1) : (t = -b, b = 0);");

    identical!(
        issue_266_1,
        "'Q' + +x1 + ',' + +y1 + ',' + (this._x1 = +x) + ',' + (this._y1 = +y);"
    );

    test_fixer!(
        issue_266_2,
        "'Q' + (+x1) + ',' + (+y1) + ',' + (this._x1 = +x) + ',' + (this._y1 = +y);",
        "'Q' + +x1 + ',' + +y1 + ',' + (this._x1 = +x) + ',' + (this._y1 = +y);"
    );

    identical!(
        issue_280,
        "e.hasOwnProperty(a) && (t = e[a] ? this[a] = t(n) : 'target' === a ? this.target = r : \
         this[a] = n[a]);"
    );

    identical!(
        issue_282,
        "!(A = [], B = (function () { return classNames; }).apply(exports, A), B !== undefined && \
         (module.exports = B));"
    );

    identical!(
        issue_286,
        "var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__(39) ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});"
    );

    identical!(
        issue_293_1,
        "for (var e in a) a.hasOwnProperty(e) && ((b = a[e]) ? this[e] = b(c) : 'target' === e ? \
         this.target = d : this[e] = c[e]);"
    );

    identical!(
        issue_293_2,
        "(a = rb ? zb(a, c) : Ab(a, c)) ? (b = nb.getPooled(ub.beforeInput, b, c, d), b.data = a, \
         Ra(b)) : b = null;"
    );

    identical!(member_object_lit, "({}).foo");

    identical!(member_cond_expr, "(foo ? 1 : 2).foo");

    identical!(member_new_exp, "(new Foo).foo");

    identical!(member_tagged_tpl, "tag``.foo");

    identical!(member_arrow_expr_1, "(a => a).foo");

    identical!(member_arrow_expr_2, "((a) => a).foo");

    identical!(member_class, "(class Foo{}).foo");

    identical!(member_yield, "function* foo(){ (yield bar).baz }");

    identical!(member_await, "async function foo(){ (await bar).baz }");

    identical!(bin_yield_expr_1, "function* foo(){ (yield foo) && bar }");

    identical!(bin_yield_expr_2, "function* foo(){ bar && (yield foo) }");

    identical!(bin_seq_expr_1, "(foo(), op) || (seq(), foo)");

    identical!(bin_seq_expr_2, "(foo, op) || (seq, foo)");

    identical!(cond_object_1, "let foo = {} ? 1 : 2;");

    identical!(cond_object_2, "({}) ? 1 : 2;");

    identical!(cond_in_cond, "(foo ? 1 : 2) ? 3 : 4");

    identical!(arrow_in_cond, "(() => {}) ? 3 : 4");

    identical!(unary_cond_arg, "void (foo ? 1 : 2)");

    identical!(unary_arrow_arg, "void ((foo) => foo)");

    identical!(unary_yield_arg, "(function* foo() { void (yield foo); })()");

    identical!(
        issue_365,
        "const foo = (() => {
  return 1
})();"
    );

    identical!(
        issue_382_1,
        "const myFilter = (arr, filter) => arr.filter(((x) => x) || filter);"
    );

    identical!(
        issue_382_2,
        "const myFilter = (arr, filter) => arr.filter(filter || ((x) => x));"
    );

    identical!(issue_418, "const a = 1 - (1 - 1)");

    test_fixer!(
        issue_439,
        "() => {
  return (
    Promise.resolve('foo')
      // Interfering comment
      .then(() => {})
  );
};",
        "() => {
  return Promise.resolve('foo')
      // Interfering comment
      .then(() => {})
  ;
};"
    );

    test_fixer!(
        issue_451,
        "const instance = new (
  function() {
    function klass(opts) {
      this.options = opts;
    }
    return (Object.assign(klass.prototype, {
      method() {}
    }), klass);
  }()
)({ foo: 1 });",
        "const instance = new (function() {
    function klass(opts) {
        this.options = opts;
    }
    return Object.assign(klass.prototype, {
        method () {
        }
    }), klass;
}())({
    foo: 1
});"
    );

    test_fixer!(void_and_bin, "(void 0) * 2", "(void 0) * 2");

    test_fixer!(new_cond, "new (a ? B : C)()", "new (a ? B : C)()");

    identical!(issue_931, "new (eval('Date'))();");

    identical!(issue_1002, "new (P || (P = Promise))");

    identical!(
        issue_1050,
        "
        (a) => (set) => (elemE(a, set) ? removeE : insertE)(a)(set)
        "
    );

    identical!(
        deno_001,
        "
    var Status;
    (function init(Status1) {
    })(Status || (Status = {
    }));
"
    );

    identical!(issue_1093, "const x = (fnA || fnB)();");

    identical!(
        issue_1133,
        "async function foo() {
            const item = await (data === null || data === void 0 ? void 0 : data.foo());
        }"
    );

    identical!(deno_8722, "console.log((true || false) ?? true);");

    identical!(
        deno_8597,
        "
        biasInitializer = new (_a = class CustomInit extends Initializer {})();
        "
    );

    test_fixer!(
        minifier_001,
        "var bitsLength = 3, bitsOffset = 3, what = (len = 0)",
        "var bitsLength = 3, bitsOffset = 3, what = len = 0"
    );

    test_fixer!(minifier_002, "!(function(){})()", "!function(){}()");

    identical!(
        issue_1397,
        "const main = async () => await (await server)()"
    );

    identical!(deno_9810, "await (bar = Promise.resolve(2));");

    identical!(issue_1493, "('a' ?? 'b') || ''");
    identical!(call_seq, "let x = ({}, () => 2)();");

    test_fixer!(
        call_seq_with_padding,
        "let x = ({}, (1, 2), () => 2)();",
        "let x = ({}, () => 2)();"
    );

    identical!(
        param_seq,
        "function t(x = ({}, 2)) {
            return x;
        }"
    );

    identical!(
        yield_expr_cond,
        "function *test1(foo) {
            return (yield foo) ? 'bar' : 'baz';
        }"
    );
}
