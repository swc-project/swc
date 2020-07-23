use crate::util::{ExprFactory, COMMENTS};
use fxhash::FxHashMap;
use swc_common::{
    util::{map::Map, move_map::MoveMap},
    Span, Spanned,
};
use swc_ecma_ast::*;
use swc_ecma_visit::{Fold, FoldWith};

pub fn fixer() -> impl Fold {
    Fixer {
        ctx: Default::default(),
        span_map: Default::default(),
    }
}

#[derive(Debug)]
struct Fixer {
    ctx: Context,
    /// A hash map to preserve original span.
    ///
    /// Key is span of inner expression, and value is span of the paren
    /// expression.
    span_map: FxHashMap<Span, Span>,
}

noop_fold_type!(Fixer);

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
}

impl Default for Context {
    fn default() -> Self {
        Context::Default
    }
}

impl Fold for Fixer {
    fn fold(&mut self, p: Program) -> Program {
        debug_assert!(self.span_map.is_empty());
        self.span_map.clear();

        let p = p.fold_children_with(self);

        COMMENTS.with(|c| {
            for (to, from) in self.span_map.drain() {
                let (from, to) = (from.data(), to.data());
                c.move_leading(from.lo, to.lo);
                c.move_trailing(from.hi, to.hi);
            }
        });

        p
    }
}

impl Fold for Fixer {
    fn fold(&mut self, node: KeyValuePatProp) -> KeyValuePatProp {
        let old = self.ctx;
        self.ctx = Context::ForcedExpr { is_var_decl: false };
        let key = node.key.fold_with(self);
        self.ctx = old;

        let value = node.value.fold_with(self);

        validate!(KeyValuePatProp { key, value })
    }
}

impl Fold for Fixer {
    fn fold(&mut self, node: AssignPatProp) -> AssignPatProp {
        let key = node.key.fold_children_with(self);

        let old = self.ctx;
        self.ctx = Context::ForcedExpr { is_var_decl: false };
        let value = node.value.fold_with(self);
        self.ctx = old;

        validate!(AssignPatProp { key, value, ..node })
    }
}

impl Fold for Fixer {
    fn fold(&mut self, node: VarDeclarator) -> VarDeclarator {
        let name = node.name.fold_children_with(self);

        let old = self.ctx;
        self.ctx = Context::ForcedExpr { is_var_decl: true };
        let init = node.init.fold_with(self);
        self.ctx = old;

        VarDeclarator { name, init, ..node }
    }
}

impl Fold for Fixer {
    fn fold(&mut self, body: BlockStmtOrExpr) -> BlockStmtOrExpr {
        let body = body.fold_children_with(self);

        match body {
            BlockStmtOrExpr::Expr(box expr @ Expr::Object(..)) => {
                BlockStmtOrExpr::Expr(box self.wrap(expr))
            }

            _ => body,
        }
    }
}

impl Fold for Fixer {
    fn fold_stmt(&mut self, stmt: Stmt) -> Stmt {
        let stmt = match stmt {
            Stmt::Expr(expr) => {
                let old = self.ctx;
                self.ctx = Context::Default;
                let expr = expr.fold_with(self);
                self.ctx = old;
                Stmt::Expr(expr)
            }
            _ => stmt.fold_children_with(self),
        };

        let stmt = match stmt {
            Stmt::Expr(ExprStmt { span, expr }) => Stmt::Expr(ExprStmt {
                span,
                expr: expr.map(|e| self.handle_expr_stmt(e)),
            }),

            _ => stmt,
        };

        validate!(stmt)
    }
}

impl Fold for Fixer {
    fn fold(&mut self, node: IfStmt) -> IfStmt {
        let node: IfStmt = node.fold_children_with(self);

        match *node.cons {
            Stmt::If(..) => IfStmt {
                cons: box Stmt::Block(BlockStmt {
                    span: node.cons.span(),
                    stmts: vec![*node.cons],
                }),
                ..node
            },

            _ => node,
        }
    }
}

macro_rules! context_fn_args {
    ($T:tt, $is_new:expr) => {
        impl Fold<$T> for Fixer {
            fn fold(&mut self, node: $T) -> $T {
                let $T {
                    span,
                    callee,
                    args,
                    type_args,
                } = node;

                let old = self.ctx;
                self.ctx = Context::ForcedExpr { is_var_decl: false };
                let args = args.fold_with(self);
                self.ctx = old;

                let old = self.ctx;
                self.ctx = Context::Callee { is_new: $is_new };
                let callee = callee.fold_with(self);
                self.ctx = old;

                $T {
                    span,
                    callee,
                    args,
                    type_args,
                }
            }
        }
    };
}
context_fn_args!(NewExpr, true);
context_fn_args!(CallExpr, false);

macro_rules! array {
    ($T:tt) => {
        impl Fold<$T> for Fixer {
            fn fold(&mut self, e: $T) -> $T {
                let old = self.ctx;
                self.ctx = Context::ForcedExpr { is_var_decl: false }.into();
                let elems = e.elems.fold_with(self);
                self.ctx = old;

                $T { elems, ..e }
            }
        }
    };
}
array!(ArrayLit);
// array!(ArrayPat);

impl Fold for Fixer {
    fn fold(&mut self, prop: KeyValueProp) -> KeyValueProp {
        let prop = prop.fold_children_with(self);

        match *prop.value {
            Expr::Seq(..) => KeyValueProp {
                value: box self.wrap(*prop.value),
                ..prop
            },
            _ => prop,
        }
    }
}

impl Fixer {
    fn wrap<T>(&mut self, e: T) -> Expr
    where
        T: Into<Expr>,
    {
        let expr = box e.into();
        let span = expr.span();

        let span = if let Some(span) = self.span_map.remove(&span) {
            span
        } else {
            span
        };

        Expr::Paren(ParenExpr { expr, span })
    }

    /// Removes paren
    fn unwrap_expr(&mut self, mut e: Expr) -> Expr {
        match e {
            Expr::Seq(SeqExpr { ref mut exprs, .. }) if exprs.len() == 1 => {
                self.unwrap_expr(*exprs.pop().unwrap())
            }
            Expr::Paren(ParenExpr {
                span: paren_span,
                expr,
                ..
            }) => {
                let e = self.unwrap_expr(*expr);

                self.span_map.insert(e.span(), paren_span);
                e
            }
            _ => validate!(e),
        }
    }

    fn handle_expr_stmt(&mut self, expr: Expr) -> Expr {
        match expr {
            // It's important for arrow pass to work properly.
            Expr::Object(..) | Expr::Class(..) | Expr::Fn(..) => self.wrap(expr),

            // ({ a } = foo)
            Expr::Assign(AssignExpr {
                span,
                left: PatOrExpr::Pat(left @ box Pat::Object(..)),
                op,
                right,
            }) => self.wrap(AssignExpr {
                span,
                left: PatOrExpr::Pat(left),
                op,
                right,
            }),

            Expr::Seq(SeqExpr { span, exprs }) => {
                debug_assert!(
                    exprs.len() != 1,
                    "SeqExpr should be unwrapped if exprs.len() == 1, but length is 1"
                );

                let mut i = 0;
                let len = exprs.len();
                Expr::Seq(SeqExpr {
                    span,
                    exprs: exprs.move_map(|expr| {
                        i += 1;
                        let is_last = len == i;

                        if !is_last {
                            expr.map(|e| self.handle_expr_stmt(e))
                        } else {
                            expr
                        }
                    }),
                })
            }

            _ => expr,
        }
    }
}

impl Fold for Fixer {
    fn fold_expr(&mut self, expr: Expr) -> Expr {
        let expr = validate!(expr);
        let expr = expr.fold_children_with(self);
        let expr = validate!(expr);
        let expr = self.unwrap_expr(expr);

        match expr {
            Expr::Member(MemberExpr {
                span,
                computed,
                obj: obj @ ExprOrSuper::Expr(box Expr::Object(..)),
                prop,
            }) if match self.ctx {
                Context::ForcedExpr { is_var_decl: true } => true,
                _ => false,
            } =>
            {
                MemberExpr {
                    span,
                    computed,
                    obj,
                    prop,
                }
                .into()
            }

            Expr::Member(MemberExpr {
                span,
                computed,
                obj: ExprOrSuper::Expr(obj @ box Expr::Fn(_)),
                prop,
            })
            | Expr::Member(MemberExpr {
                span,
                computed,
                obj: ExprOrSuper::Expr(obj @ box Expr::Assign(_)),
                prop,
            })
            | Expr::Member(MemberExpr {
                span,
                computed,
                obj: ExprOrSuper::Expr(obj @ box Expr::Seq(_)),
                prop,
            })
            | Expr::Member(MemberExpr {
                span,
                computed,
                obj: ExprOrSuper::Expr(obj @ box Expr::Update(..)),
                prop,
            })
            | Expr::Member(MemberExpr {
                span,
                computed,
                obj: ExprOrSuper::Expr(obj @ box Expr::Unary(..)),
                prop,
            })
            | Expr::Member(MemberExpr {
                span,
                computed,
                obj: ExprOrSuper::Expr(obj @ box Expr::Bin(..)),
                prop,
            })
            | Expr::Member(MemberExpr {
                span,
                computed,
                obj: ExprOrSuper::Expr(obj @ box Expr::Object(..)),
                prop,
            })
            | Expr::Member(MemberExpr {
                span,
                computed,
                obj: ExprOrSuper::Expr(obj @ box Expr::Cond(..)),
                prop,
            })
            | Expr::Member(MemberExpr {
                span,
                computed,
                obj: ExprOrSuper::Expr(obj @ box Expr::New(NewExpr { args: None, .. })),
                prop,
            })
            | Expr::Member(MemberExpr {
                span,
                computed,
                obj: ExprOrSuper::Expr(obj @ box Expr::Arrow(..)),
                prop,
            })
            | Expr::Member(MemberExpr {
                span,
                computed,
                obj: ExprOrSuper::Expr(obj @ box Expr::Class(..)),
                prop,
            })
            | Expr::Member(MemberExpr {
                span,
                computed,
                obj: ExprOrSuper::Expr(obj @ box Expr::Yield(..)),
                prop,
            })
            | Expr::Member(MemberExpr {
                span,
                computed,
                obj: ExprOrSuper::Expr(obj @ box Expr::Await(..)),
                prop,
            }) => validate!(MemberExpr {
                span,
                computed,
                obj: self.wrap(*obj).as_obj(),
                prop,
            })
            .into(),

            // Flatten seq expr
            Expr::Seq(SeqExpr { span, exprs }) => {
                let len = exprs
                    .iter()
                    .map(|expr| match **expr {
                        Expr::Seq(SeqExpr { ref exprs, .. }) => exprs.len(),
                        _ => 1,
                    })
                    .sum();

                let exprs_len = exprs.len();
                let expr = if len == exprs_len {
                    let mut exprs = exprs
                        .into_iter()
                        .enumerate()
                        .filter_map(|(i, e)| {
                            let is_last = i + 1 == exprs_len;
                            if is_last {
                                Some(e)
                            } else {
                                ignore_return_value(e)
                            }
                        })
                        .collect::<Vec<_>>();
                    if exprs.len() == 1 {
                        return *exprs.pop().unwrap();
                    }
                    validate!(Expr::Seq(SeqExpr { span, exprs }))
                } else {
                    let mut buf = Vec::with_capacity(len);
                    for (i, expr) in exprs.into_iter().enumerate() {
                        let is_last = i + 1 == exprs_len;

                        match *expr {
                            Expr::Seq(SeqExpr { exprs, .. }) => {
                                if !is_last {
                                    buf.extend(exprs.into_iter().filter_map(ignore_return_value));
                                } else {
                                    let exprs_len = exprs.len();
                                    for (i, expr) in exprs.into_iter().enumerate() {
                                        let is_last = i + 1 == exprs_len;
                                        if is_last {
                                            buf.push(expr);
                                        } else {
                                            buf.extend(ignore_return_value(expr));
                                        }
                                    }
                                }
                            }
                            _ => buf.push(expr),
                        }
                    }

                    if buf.len() == 1 {
                        return *buf.pop().unwrap();
                    }
                    buf.shrink_to_fit();
                    validate!(Expr::Seq(SeqExpr { span, exprs: buf }))
                };

                match self.ctx {
                    Context::ForcedExpr { .. } => validate!(Expr::Paren(ParenExpr {
                        span,
                        expr: box expr,
                    })),
                    _ => validate!(expr),
                }
            }

            Expr::Bin(mut expr) => {
                expr.right = match *expr.right {
                    e @ Expr::Assign(..)
                    | e @ Expr::Seq(..)
                    | e @ Expr::Yield(..)
                    | e @ Expr::Cond(..)
                    | e @ Expr::Arrow(..) => box self.wrap(e),
                    Expr::Bin(BinExpr { op: op_of_rhs, .. }) => {
                        if op_of_rhs.precedence() <= expr.op.precedence() {
                            box self.wrap(*expr.right)
                        } else {
                            validate!(expr.right)
                        }
                    }
                    _ => validate!(expr.right),
                };

                match *expr.left {
                    // While simplifying, (1 + x) * Nan becomes `1 + x * Nan`.
                    // But it should be `(1 + x) * Nan`
                    Expr::Bin(BinExpr { op: op_of_lhs, .. }) => {
                        if op_of_lhs.precedence() < expr.op.precedence() {
                            Expr::Bin(validate!(BinExpr {
                                left: box self.wrap(*expr.left),
                                ..expr
                            }))
                        } else {
                            Expr::Bin(validate!(expr))
                        }
                    }

                    e @ Expr::Seq(..)
                    | e @ Expr::Update(..)
                    | e
                    @
                    Expr::Unary(UnaryExpr {
                        op: op!("delete"), ..
                    })
                    | e
                    @
                    Expr::Unary(UnaryExpr {
                        op: op!("void"), ..
                    })
                    | e @ Expr::Yield(..)
                    | e @ Expr::Cond(..)
                    | e @ Expr::Assign(..)
                    | e @ Expr::Arrow(..) => validate!(Expr::Bin(BinExpr {
                        left: box self.wrap(e),
                        ..expr
                    })),
                    e @ Expr::Object(..)
                        if expr.op == op!("instanceof")
                            || expr.op == op!("==")
                            || expr.op == op!("===")
                            || expr.op == op!("!=")
                            || expr.op == op!("!==") =>
                    {
                        validate!(Expr::Bin(BinExpr {
                            left: box e.wrap_with_paren(),
                            ..expr
                        }))
                    }
                    _ => validate!(Expr::Bin(expr)),
                }
            }

            Expr::Cond(expr) => {
                let test = match *expr.test {
                    e @ Expr::Seq(..)
                    | e @ Expr::Assign(..)
                    | e @ Expr::Cond(..)
                    | e @ Expr::Arrow(..) => box self.wrap(e),

                    e @ Expr::Object(..) | e @ Expr::Fn(..) | e @ Expr::Class(..) => {
                        if self.ctx == Context::Default {
                            box self.wrap(e)
                        } else {
                            box e
                        }
                    }
                    _ => expr.test,
                };

                let cons = match *expr.cons {
                    e @ Expr::Seq(..) => box self.wrap(e),
                    _ => expr.cons,
                };

                let alt = match *expr.alt {
                    e @ Expr::Seq(..) => box self.wrap(e),
                    _ => expr.alt,
                };
                let expr = validate!(Expr::Cond(CondExpr {
                    test,
                    cons,
                    alt,
                    ..expr
                }));
                match self.ctx {
                    Context::Callee { is_new: true } => self.wrap(expr),
                    _ => expr,
                }
            }

            Expr::Unary(expr) => {
                let arg = match *expr.arg {
                    e @ Expr::Assign(..)
                    | e @ Expr::Bin(..)
                    | e @ Expr::Seq(..)
                    | e @ Expr::Cond(..)
                    | e @ Expr::Arrow(..)
                    | e @ Expr::Yield(..) => box self.wrap(e),
                    _ => expr.arg,
                };

                validate!(Expr::Unary(UnaryExpr { arg, ..expr }))
            }

            Expr::Assign(expr) => {
                let right = match *expr.right {
                    // `foo = (bar = baz)` => foo = bar = baz
                    Expr::Assign(AssignExpr {
                        left: PatOrExpr::Pat(box Pat::Ident(..)),
                        ..
                    })
                    | Expr::Assign(AssignExpr {
                        left: PatOrExpr::Expr(box Expr::Ident(..)),
                        ..
                    }) => expr.right,

                    // Handle `foo = bar = init()
                    Expr::Seq(right) => box self.wrap(right),
                    _ => expr.right,
                };

                validate!(Expr::Assign(AssignExpr { right, ..expr }))
            }

            Expr::Call(CallExpr {
                span,
                callee: ExprOrSuper::Expr(callee @ box Expr::Arrow(_)),
                args,
                type_args,
            }) => validate!(Expr::Call(CallExpr {
                span,
                callee: self.wrap(*callee).as_callee(),
                args,
                type_args,
            })),

            // Function expression cannot start with `function`
            Expr::Call(CallExpr {
                span,
                callee: ExprOrSuper::Expr(callee @ box Expr::Fn(_)),
                args,
                type_args,
            }) => match self.ctx {
                Context::ForcedExpr { .. } => validate!(Expr::Call(CallExpr {
                    span,
                    callee: callee.as_callee(),
                    args,
                    type_args,
                })),

                Context::Callee { is_new: true } => self.wrap(CallExpr {
                    span,
                    callee: callee.as_callee(),
                    args,
                    type_args,
                }),

                _ => validate!(Expr::Call(CallExpr {
                    span,
                    callee: self.wrap(*callee).as_callee(),
                    args,
                    type_args,
                })),
            },
            Expr::Call(CallExpr {
                span,
                callee: ExprOrSuper::Expr(callee @ box Expr::Assign(_)),
                args,
                type_args,
            }) => validate!(Expr::Call(CallExpr {
                span,
                callee: self.wrap(*callee).as_callee(),
                args,
                type_args,
            })),
            _ => expr,
        }
    }

    fn fold_expr_or_spread(&mut self, e: ExprOrSpread) -> ExprOrSpread {
        let e = e.fold_children_with(self);

        if e.spread.is_none() {
            match *e.expr {
                Expr::Yield(..) => {
                    return ExprOrSpread {
                        spread: None,
                        expr: box self.wrap(*e.expr),
                    }
                }
                _ => {}
            }
        }

        e
    }
}

impl Fold for Fixer {
    fn fold(&mut self, node: ExportDefaultExpr) -> ExportDefaultExpr {
        let old = self.ctx;
        self.ctx = Context::Default;
        let mut node = node.fold_children_with(self);
        node.expr = match *node.expr {
            Expr::Arrow(..) | Expr::Seq(..) => box self.wrap(*node.expr),
            _ => node.expr,
        };
        self.ctx = old;
        node
    }

    fn fold_arrow_expr(&mut self, node: ArrowExpr) -> ArrowExpr {
        let old = self.ctx;
        self.ctx = Context::Default;
        let mut node = node.fold_children_with(self);
        node.body = match node.body {
            BlockStmtOrExpr::Expr(e @ box Expr::Seq(..)) => {
                BlockStmtOrExpr::Expr(box self.wrap(*e))
            }
            _ => node.body,
        };
        self.ctx = old;
        node
    }

    fn fold_class(&mut self, node: Class) -> Class {
        let old = self.ctx;
        self.ctx = Context::Default;
        let mut node: Class = node.fold_children_with(self);
        node.super_class = match node.super_class {
            Some(e @ box Expr::Seq(..)) => Some(box self.wrap(*e)),
            _ => node.super_class,
        };
        self.ctx = old;

        node.body.retain(|m| match m {
            ClassMember::Empty(..) => false,
            _ => true,
        });

        node
    }
}

fn ignore_return_value(expr: Box<Expr>) -> Option<Box<Expr>> {
    match *expr {
        Expr::Ident(..) | Expr::Fn(..) | Expr::Lit(..) => None,
        Expr::Unary(UnaryExpr {
            op: op!("void"),
            arg,
            ..
        }) => ignore_return_value(arg),
        _ => Some(expr),
    }
}

#[cfg(test)]
mod tests {
    struct Noop;

    macro_rules! test_fixer {
        ($name:ident, $from:literal, $to:literal) => {
            // We use noop because fixer is invoked by tests::apply_transform.
            test!(Default::default(), |_| Noop, $name, $from, $to);
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
c() + f()"
    );

    test_fixer!(fixer_02, "(b, c), d;", "d;");

    test_fixer!(fixer_03, "((a, b), (c && d)) && e;", "c && d && e;");

    test_fixer!(fixer_04, "for ((a, b), c;;) ;", "for(c;;);");

    test_fixer!(
        fixer_05,
        "var a, b, c = (1), d, e, f = (2);
((a, b), c) + ((d, e), f);",
        "var a, b, c = 1, d, e, f = 2;
c + f;"
    );

    test_fixer!(
        fixer_06,
        "var a, b, c, d;
a = ((b, c), d);",
        "var a, b, c, d;
a = d;"
    );

    test_fixer!(fixer_07, "a => ((b, c) => ((a, b), c));", "(a)=>(b, c)=>c;");

    test_fixer!(fixer_08, "typeof (((1), a), (2));", "typeof 2");

    test_fixer!(fixer_09, "(((a, b), c), d) ? e : f;", "d ? e : f;");

    test_fixer!(
        fixer_10,
        "
function a() {
  return (((void (1)), (void (2))), a), (void (3));
}
",
        "
function a() {
  return void 3;
}
"
    );

    test_fixer!(fixer_11, "c && ((((2), (3)), d), b);", "c && b");

    test_fixer!(fixer_12, "(((a, b), c), d) + e;", "d + e;");

    test_fixer!(fixer_13, "delete (((1), a), (2));", "delete 2");

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

    test_fixer!(bin_seq_expr_2, "(foo, op) || (seq, foo)", "op || foo");

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
}
