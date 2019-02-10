use crate::{
    pass::Pass,
    util::{ExprFactory, State},
};
use ast::*;
use swc_common::{
    util::{map::Map, move_map::MoveMap},
    Fold, FoldWith,
};

pub fn fixer() -> impl Pass + Clone {
    Fixer {
        ctx: Default::default(),
    }
}

#[derive(Clone, Copy)]
struct Fixer {
    ctx: State<Context>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Context {
    Default,
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

impl Fold<KeyValuePatProp> for Fixer {
    fn fold(&mut self, node: KeyValuePatProp) -> KeyValuePatProp {
        let old = self.ctx;
        self.ctx = Context::ForcedExpr { is_var_decl: false }.into();
        let key = node.key.fold_with(self);
        self.ctx = old;

        let value = node.value.fold_with(self);

        KeyValuePatProp { key, value, ..node }
    }
}

impl Fold<AssignPatProp> for Fixer {
    fn fold(&mut self, node: AssignPatProp) -> AssignPatProp {
        let key = node.key.fold_children(self);

        let old = self.ctx;
        self.ctx = Context::ForcedExpr { is_var_decl: false }.into();
        let value = node.value.fold_with(self);
        self.ctx = old;

        AssignPatProp { key, value, ..node }
    }
}

impl Fold<VarDeclarator> for Fixer {
    fn fold(&mut self, node: VarDeclarator) -> VarDeclarator {
        let name = node.name.fold_children(self);

        let old = self.ctx;
        self.ctx = Context::ForcedExpr { is_var_decl: true }.into();
        let init = node.init.fold_with(self);
        self.ctx = old;

        VarDeclarator { name, init, ..node }
    }
}

impl Fold<Stmt> for Fixer {
    fn fold(&mut self, stmt: Stmt) -> Stmt {
        let stmt = match stmt {
            Stmt::Expr(expr) => {
                let old = self.ctx;
                self.ctx = Context::Default.into();
                let expr = expr.fold_with(self);
                self.ctx = old;
                Stmt::Expr(expr)
            }
            _ => stmt.fold_children(self),
        };

        fn handle_expr_stmt(expr: Expr) -> Expr {
            match expr {
                // It's important for arrow pass to work properly.
                Expr::Object(..) | Expr::Fn(..) => expr.wrap_with_paren(),

                // ({ a } = foo)
                Expr::Assign(AssignExpr {
                    span,
                    left: PatOrExpr::Pat(left @ box Pat::Object(..)),
                    op,
                    right,
                }) => AssignExpr {
                    span,
                    left: PatOrExpr::Pat(left),
                    op,
                    right,
                }
                .wrap_with_paren(),

                Expr::Seq(SeqExpr { span, exprs }) => {
                    debug_assert!(
                        exprs.len() != 1,
                        "SeqExpr should be unwrapped if exprs.len() == 1, but length is 1"
                    );

                    let mut first = true;
                    Expr::Seq(SeqExpr {
                        span,
                        exprs: exprs.move_map(|expr| {
                            if first {
                                first = false;
                                expr.map(handle_expr_stmt)
                            } else {
                                expr
                            }
                        }),
                    })
                }

                _ => expr,
            }
        }

        let stmt = match stmt {
            Stmt::Expr(expr) => Stmt::Expr(expr.map(handle_expr_stmt)),

            _ => stmt,
        };

        stmt
    }
}

macro_rules! context_fn_args {
    ($T:tt) => {
        impl Fold<$T> for Fixer {
            fn fold(&mut self, node: $T) -> $T {
                let $T {
                    span,
                    callee,
                    args,
                    type_args,
                } = node;

                let old = self.ctx;
                self.ctx = Context::ForcedExpr { is_var_decl: false }.into();
                let args = args.fold_with(self);
                self.ctx = old;

                $T {
                    span,
                    callee: callee.fold_children(self),
                    args,
                    type_args,
                }
            }
        }
    };
}
context_fn_args!(NewExpr);
context_fn_args!(CallExpr);

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

impl Fold<Expr> for Fixer {
    fn fold(&mut self, expr: Expr) -> Expr {
        fn unwrap_expr(mut e: Expr) -> Expr {
            match e {
                Expr::Seq(SeqExpr { ref mut exprs, .. }) if exprs.len() == 1 => {
                    *exprs.pop().unwrap()
                }
                Expr::Paren(ParenExpr { expr, .. }) => unwrap_expr(*expr),
                _ => e,
            }
        }
        let expr = expr.fold_children(self);
        let expr = unwrap_expr(expr);

        match expr {
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
            }) => MemberExpr {
                span,
                computed,
                obj: obj.wrap_with_paren().as_obj(),
                prop,
            }
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

                let expr = if len == exprs.len() {
                    Expr::Seq(SeqExpr { span, exprs })
                } else {
                    let mut buf = Vec::with_capacity(len);
                    for expr in exprs {
                        match *expr {
                            Expr::Seq(SeqExpr { mut exprs, .. }) => {
                                // Remove useless items
                                while let Some(box Expr::Ident(..)) = exprs.last() {
                                    let _ = exprs.pop();
                                }

                                buf.append(&mut exprs)
                            }
                            _ => buf.push(expr),
                        }
                    }

                    buf.shrink_to_fit();

                    Expr::Seq(SeqExpr { span, exprs: buf })
                };

                match self.ctx.value {
                    Context::ForcedExpr { .. } => Expr::Paren(ParenExpr {
                        span,
                        expr: box expr,
                    }),
                    _ => expr,
                }
            }

            Expr::Bin(expr) => {
                match *expr.left {
                    // While simplifying, (1 + x) * Nan becomes `1 + x * Nan`.
                    // But it should be `(1 + x) * Nan`
                    Expr::Bin(BinExpr { op: op_of_lhs, .. }) => {
                        if op_of_lhs.precedence() < expr.op.precedence() {
                            Expr::Bin(BinExpr {
                                left: box expr.left.wrap_with_paren(),
                                ..expr
                            })
                        } else {
                            Expr::Bin(expr)
                        }
                    }
                    Expr::Cond(cond_expr) => Expr::Bin(BinExpr {
                        left: box cond_expr.wrap_with_paren(),
                        ..expr
                    }),
                    Expr::Assign(left) => Expr::Bin(BinExpr {
                        left: box left.wrap_with_paren(),
                        ..expr
                    }),
                    _ => Expr::Bin(expr),
                }
            }

            Expr::Unary(expr) => {
                let arg = match *expr.arg {
                    Expr::Assign(..) => box expr.arg.wrap_with_paren(),
                    _ => expr.arg,
                };

                Expr::Unary(UnaryExpr { arg, ..expr })
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
                    Expr::Seq(right) => box right.wrap_with_paren(),
                    _ => expr.right,
                };

                Expr::Assign(AssignExpr { right, ..expr })
            }

            // Function expression cannot start with `function`
            Expr::Call(CallExpr {
                span,
                callee: ExprOrSuper::Expr(callee @ box Expr::Fn(_)),
                args,
                type_args,
            }) => match self.ctx.value {
                Context::ForcedExpr { .. } => Expr::Call(CallExpr {
                    span,
                    callee: callee.as_callee(),
                    args,
                    type_args,
                }),

                _ => Expr::Call(CallExpr {
                    span,
                    callee: callee.wrap_with_paren().as_callee(),
                    args,
                    type_args,
                }),
            },
            _ => expr,
        }
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

    identical!(regression_12, "(function{})()");
}
