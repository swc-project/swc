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
    })
}

pub fn paren_remover(comments: Option<&dyn Comments>) -> impl '_ + Pass + VisitMut {
    visit_mut_pass(Fixer {
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
    span_map: IndexMap<Span, Span, BuildHasherDefault<FxHasher>>,
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

impl VisitMut for Fixer<'_> {
    noop_visit_mut_type!();

    fn visit_mut_array_lit(&mut self, e: &mut ArrayLit) {
        let ctx = mem::replace(&mut self.ctx, Context::ForcedExpr);
        e.elems.visit_mut_with(self);
        self.ctx = ctx;
    }

    fn visit_mut_arrow_expr(&mut self, node: &mut ArrowExpr) {
        let old = self.ctx;
        self.ctx = Context::Default;
        node.visit_mut_children_with(self);
        self.ctx = old;
    }

    fn visit_mut_assign_expr(&mut self, expr: &mut AssignExpr) {
        expr.left.visit_mut_with(self);

        let ctx = self.ctx;
        self.ctx = Context::FreeExpr;
        expr.right.visit_mut_with(self);
        self.ctx = ctx;
    }

    fn visit_mut_assign_pat_prop(&mut self, node: &mut AssignPatProp) {
        node.key.visit_mut_children_with(self);

        let old = self.ctx;
        self.ctx = Context::ForcedExpr;
        node.value.visit_mut_with(self);
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
    }

    fn visit_mut_bin_expr(&mut self, expr: &mut BinExpr) {
        expr.left.visit_mut_with(self);
        let ctx = self.ctx;
        self.ctx = Context::FreeExpr;
        expr.right.visit_mut_with(self);
        self.ctx = ctx;
    }

    fn visit_mut_call_expr(&mut self, node: &mut CallExpr) {
        let ctx = mem::replace(&mut self.ctx, Context::Callee);
        node.callee.visit_mut_with(self);
        self.ctx = Context::ForcedExpr;
        node.args.visit_mut_with(self);
        self.ctx = ctx;
    }

    fn visit_mut_class(&mut self, node: &mut Class) {
        let ctx = mem::replace(&mut self.ctx, Context::Default);
        node.super_class.visit_mut_with(self);
        node.body.visit_mut_with(self);
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

    fn visit_mut_expr_stmt(&mut self, s: &mut ExprStmt) {
        let old = self.ctx;
        self.ctx = Context::Default;
        s.expr.visit_mut_with(self);
        self.ctx = old;
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
        }
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
        self.ctx = ctx;
    }

    fn visit_mut_opt_call(&mut self, node: &mut OptCall) {
        let ctx = mem::replace(&mut self.ctx, Context::Callee);
        node.callee.visit_mut_with(self);
        self.ctx = Context::ForcedExpr;
        node.args.visit_mut_with(self);
        self.ctx = ctx;
    }

    fn visit_mut_opt_chain_base(&mut self, n: &mut OptChainBase) {
        if !n.is_member() {
            n.visit_mut_children_with(self);
            return;
        }

        n.visit_mut_children_with(self);
    }

    fn visit_mut_param(&mut self, node: &mut Param) {
        let old = self.ctx;
        self.ctx = Context::ForcedExpr;
        node.visit_mut_children_with(self);
        self.ctx = old;
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

    fn visit_mut_unary_expr(&mut self, n: &mut UnaryExpr) {
        let old = self.ctx;
        self.ctx = Context::FreeExpr;
        n.visit_mut_children_with(self);
        self.ctx = old;
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
}

impl Fixer<'_> {
    fn wrap_with_paren_if_required(&mut self, e: &mut Expr) {
        let mut has_padding_value = false;
        if let Expr::Seq(SeqExpr { span, exprs }) = e {
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
            let exprs = if len == exprs_len {
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

            let expr = SeqExpr { span: *span, exprs }.into();

            *e = expr;
        }
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

#[cfg(test)]
mod tests {
    use swc_ecma_ast::noop_pass;

    fn run_test(from: &str, to: &str) {
        crate::tests::test_transform(
            Default::default(),
            // test_transform has alreay included fixer
            |_| noop_pass(),
            from,
            to,
            true,
            Default::default,
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
        "_set(_get_prototype_of(Obj.prototype), _ref = proper.prop, (_superRef = \
         +_get(_get_prototype_of(Obj.prototype), _ref, this)) + 1, this, true), _superRef;"
    );

    identical!(
        regression_02,
        "var obj = (_obj = {}, _define_property(_obj, 'first', 'first'), _define_property(_obj, \
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
    inner: (_obj = {}, _define_property(_obj, ns.EXPORT1, true), _define_property(_obj, \
         ns.EXPORT2, true), _obj)
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

    identical!(member_new_exp_1, "(new Foo).foo");

    identical!(member_new_exp_2, "new ctor().property");

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

    identical!(
        deno_10487_1,
        "var generator = class MultiVector extends (options.baseType||Float32Array) {}"
    );

    identical!(
        deno_10487_2,
        "class MultiVector extends (options.baseType||Float32Array) {}"
    );

    identical!(
        extends_nullish_coalescing,
        "class Foo extends (Bar ?? class{}) {}"
    );

    identical!(extends_assign, "class Foo extends (Bar = class{}) {}");

    identical!(
        extends_logical_or_assin,
        "class Foo extends (Bar ||= class{}) {}"
    );

    identical!(
        extends_logical_and_assin,
        "class Foo extends (Bar &&= class{}) {}"
    );

    identical!(
        extends_logical_nullish_assin,
        "class Foo extends (Bar ??= class{}) {}"
    );

    identical!(extends_cond, "class Foo extends (true ? Bar : Baz) {}");

    identical!(
        extends_await_yield,
        "
        async function* func() {
            class A extends (await p) {}
            class B extends (yield p) {}
        }
        "
    );

    identical!(deno_10668_1, "console.log(null ?? (undefined && true))");

    identical!(deno_10668_2, "console.log(null && (undefined ?? true))");

    identical!(minifier_003, "(four ** one) ** two");

    identical!(minifier_004, "(void 0)(0)");

    identical!(issue_1781, "const n = ~~(Math.PI * 10)");

    identical!(issue_1789, "+(+1 / 4)");

    identical!(new_member_call_1, "new (getObj()).ctor()");
    test_fixer!(
        new_member_call_2,
        "new (getObj().ctor)()",
        "new (getObj()).ctor()"
    );
    test_fixer!(
        new_member_call_3,
        "new (x.getObj().ctor)()",
        "new (x.getObj()).ctor()"
    );
    identical!(new_call, "new (getCtor())");
    test_fixer!(new_member_1, "new obj.ctor()", "new obj.ctor()");
    test_fixer!(new_member_2, "new (obj.ctor)", "new obj.ctor");

    identical!(
        new_await_1,
        "async function foo() { new (await getServerImpl())(options) }"
    );
    test_fixer!(minifier_005, "-(1/0)", "-1/0");

    test_fixer!(minifier_006, "-('s'/'b')", "-('s'/'b')");

    test_fixer!(minifier_007, "(void 0) === value", "void 0 === value");
    test_fixer!(minifier_008, "(size--) && (b = (c))", "size-- && (b = c)");

    test_fixer!(
        minifier_009,
        "(--remaining) || deferred.resolveWith()",
        "--remaining || deferred.resolveWith()"
    );

    test_fixer!(minifier_010, "(--remaining) + ''", "--remaining + ''");

    identical!(
        if_stmt_001,
        "
        export const obj = {
            each: function (obj, callback, args) {
                var i = 0, length = obj.length, isArray = isArraylike(obj);
                if (args) {
                    if (isArray)
                        for (; i < length && !1 !== callback.apply(obj[i], args); i++);
                    else
                        for (i in obj)
                            if (!1 === callback.apply(obj[i], args))
                                break
                } else if (isArray)
                    for (; i < length && !1 !== callback.call(obj[i], i, obj[i]); i++);
                else
                    for (i in obj)
                        if (!1 === callback.call(obj[i], i, obj[i]))
                            break;
                return obj
            }
        };
        "
    );

    identical!(
        issue_2155,
        "
        async function main() {
            let promise;
            await (promise || (promise = Promise.resolve('this is a string')));
        }
        "
    );

    identical!(issue_2163_1, "() => ({foo} = bar());");

    identical!(issue_2163_2, "() => ([foo] = bar());");

    identical!(issue_2191, "(-1) ** h");

    identical!(
        minifier_011,
        "
        function ItemsList() {
            var _ref;

            var _temp, _this, _ret;

            _class_call_check(this, ItemsList);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            return _ret = (_temp = (_this = _possible_constructor_return(this, (_ref = \
         ItemsList.__proto__ || Object.getPrototypeOf(ItemsList)).call.apply(_ref, \
         [this].concat(args))), _this), _this.storeHighlightedItemReference = function \
         (highlightedItem) {
              _this.props.onHighlightedItemChange(highlightedItem === null ? null : \
         highlightedItem.item);
            }, _temp), _possible_constructor_return(_this, _ret);
          }
        "
    );

    identical!(
        minifier_012,
        "
        function ItemsList() {
            for(var _ref, _temp, _this, _len = arguments.length, args = Array(_len), _key = 0; \
         _key < _len; _key++)args[_key] = arguments[_key];
            return _possible_constructor_return(_this, (_temp = (_this = \
         _possible_constructor_return(this, (_ref = ItemsList.__proto__ || \
         Object.getPrototypeOf(ItemsList)).call.apply(_ref, [
                this
            ].concat(args))), _this), _this.storeHighlightedItemReference = \
         function(highlightedItem) {
                _this.props.onHighlightedItemChange(null === highlightedItem ? null : \
         highlightedItem.item);
            }, _temp));
        }
        "
    );

    test_fixer!(issue_2550_1, "(1 && { a: 1 })", "1 && { a:1 }");

    identical!(issue_2550_2, "({ isNewPrefsActive }) && { a: 1 }");

    test_fixer!(paren_of_bin_left_1, "({} && 1)", "({}) && 1");
    identical!(paren_of_bin_left_2, "({}) && 1");
    test_fixer!(
        paren_of_bin_left_3,
        "(function () {} || 2)",
        "(function () {}) || 2"
    );
    identical!(paren_of_bin_left_4, "(function () {}) || 2");

    test_fixer!(paren_of_bin_left_5, "(class{} ?? 3)", "(class{}) ?? 3");
    identical!(paren_of_bin_left_6, "(class{}) ?? 3");

    identical!(issue_4761, "x = { ...(0, foo) }");

    identical!(issue_4914, "(a ?? b)?.()");

    identical!(issue_5109_1, "(0, b)?.()");
    identical!(issue_5109_2, "1 + (0, b)?.()");
    identical!(issue_5109_3, "(0, a)() ? undefined : (0, b)?.()");

    identical!(
        issue_5313,
        "
        async function* foo() {
            (await a)();
            (yield b)();
        }
        "
    );

    identical!(issue_5417, "console.log(a ?? b ?? c)");

    identical!(bin_and_unary, "console.log(a++ && b--)");
}
