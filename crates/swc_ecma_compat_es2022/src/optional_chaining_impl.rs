use std::mem;

use swc_common::{util::take::Take, Mark, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{alias_ident_for, prepend_stmt, quote_ident, ExprFactory, StmtLike};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

/// Not a public API and may break any time. Don't use it directly.
pub fn optional_chaining_impl(c: Config, unresolved_mark: Mark) -> OptionalChaining {
    OptionalChaining {
        c,
        unresolved_ctxt: SyntaxContext::empty().apply_mark(unresolved_mark),
        ..Default::default()
    }
}

#[derive(Default)]
pub struct OptionalChaining {
    vars: Vec<VarDeclarator>,
    unresolved_ctxt: SyntaxContext,
    c: Config,
}

impl OptionalChaining {
    pub fn take_vars(&mut self) -> Vec<VarDeclarator> {
        mem::take(&mut self.vars)
    }
}

/// Not a public API and may break any time. Don't use it directly.
#[derive(Debug, Clone, Copy, Default)]
pub struct Config {
    pub no_document_all: bool,
    pub pure_getter: bool,
}

impl VisitMut for OptionalChaining {
    noop_visit_mut_type!(fail);

    fn visit_mut_block_stmt_or_expr(&mut self, expr: &mut BlockStmtOrExpr) {
        if let BlockStmtOrExpr::Expr(e) = expr {
            let mut stmt = BlockStmt {
                span: DUMMY_SP,
                stmts: vec![Stmt::Return(ReturnStmt {
                    span: DUMMY_SP,
                    arg: Some(e.take()),
                })],
                ..Default::default()
            };
            stmt.visit_mut_with(self);

            // If there are optional chains in this expression, then the visitor will have
            // injected an VarDecl statement and we need to transform into a
            // block. If not, then we can keep the expression.
            match &mut stmt.stmts[..] {
                [Stmt::Return(ReturnStmt { arg: Some(e), .. })] => {
                    *expr = BlockStmtOrExpr::Expr(e.take())
                }
                _ => *expr = BlockStmtOrExpr::BlockStmt(stmt),
            }
        } else {
            expr.visit_mut_children_with(self);
        }
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        match e {
            // foo?.bar -> foo == null ? void 0 : foo.bar
            Expr::OptChain(v) => {
                let data = self.gather(v.take(), Vec::new());
                *e = self.construct(data, false);
            }

            Expr::Unary(UnaryExpr {
                arg,
                op: op!("delete"),
                ..
            }) => {
                match &mut **arg {
                    // delete foo?.bar -> foo == null ? true : delete foo.bar
                    Expr::OptChain(v) => {
                        let data = self.gather(v.take(), Vec::new());
                        *e = self.construct(data, true);
                    }
                    _ => e.visit_mut_children_with(self),
                }
            }

            e => e.visit_mut_children_with(self),
        }
    }

    fn visit_mut_pat(&mut self, n: &mut Pat) {
        // The default initializer of an assignment pattern must not leak the memo
        // variable into the enclosing scope.
        // function(a, b = a?.b) {} -> function(a, b = (() => var _a; …)()) {}
        let Pat::Assign(a) = n else {
            n.visit_mut_children_with(self);
            return;
        };

        let uninit = self.vars.take();
        a.right.visit_mut_with(self);

        // If we found an optional chain, we need to transform into an arrow IIFE to
        // capture the memo variable.
        if !self.vars.is_empty() {
            let stmts = vec![
                Stmt::Decl(Decl::Var(Box::new(VarDecl {
                    kind: VarDeclKind::Var,
                    decls: mem::take(&mut self.vars),
                    ..Default::default()
                }))),
                Stmt::Return(ReturnStmt {
                    span: DUMMY_SP,
                    arg: Some(a.right.take()),
                }),
            ];
            a.right = CallExpr {
                span: DUMMY_SP,
                callee: ArrowExpr {
                    span: DUMMY_SP,
                    params: Vec::new(),
                    body: Box::new(BlockStmtOrExpr::BlockStmt(BlockStmt {
                        span: DUMMY_SP,
                        stmts,
                        ..Default::default()
                    })),
                    is_async: false,
                    is_generator: false,
                    ..Default::default()
                }
                .as_callee(),
                args: Vec::new(),
                ..Default::default()
            }
            .into();
        }

        self.vars = uninit;
        a.left.visit_mut_with(self);
    }

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_like(n);
    }

    fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
        self.visit_mut_stmt_like(n);
    }
}

#[derive(Debug, Clone)]
enum Memo {
    Cache(Ident),
    Raw(Box<Expr>),
}

impl Memo {
    fn into_expr(self) -> Expr {
        match self {
            Memo::Cache(i) => i.into(),
            Memo::Raw(e) => *e,
        }
    }
}

#[derive(Debug)]
enum Gathering {
    Call(CallExpr),
    Member(MemberExpr),
    OptCall(CallExpr, Memo),
    OptMember(MemberExpr, Memo),
}

impl OptionalChaining {
    /// Transforms the left-nested structure into a flat vec. The obj/callee
    /// of every node in the chain will be Invalid, to be replaced with a
    /// constructed node in the construct step.
    /// The top member/call will be first, and the deepest obj/callee will be
    /// last.
    fn gather(
        &mut self,
        v: OptChainExpr,
        mut chain: Vec<Gathering>,
    ) -> (Expr, usize, Vec<Gathering>) {
        let mut current = v;
        let mut count = 0;
        loop {
            let OptChainExpr {
                optional, mut base, ..
            } = current;

            if optional {
                count += 1;
            }

            let next;
            match &mut *base {
                OptChainBase::Member(m) => {
                    next = m.obj.take();
                    m.prop.visit_mut_with(self);
                    chain.push(if optional {
                        Gathering::OptMember(m.take(), self.memoize(&next, false))
                    } else {
                        Gathering::Member(m.take())
                    });
                }

                OptChainBase::Call(c) => {
                    next = c.callee.take();
                    c.args.visit_mut_with(self);
                    // I don't know why c is an OptCall instead of a CallExpr.
                    chain.push(if optional {
                        Gathering::OptCall(c.take().into(), self.memoize(&next, true))
                    } else {
                        Gathering::Call(c.take().into())
                    });
                }
            }

            match *next {
                Expr::OptChain(next) => {
                    current = next;
                }
                mut base => {
                    base.visit_mut_children_with(self);
                    return (base, count, chain);
                }
            }
        }
    }

    /// Constructs a rightward nested conditional expression out of our
    /// flattened chain.
    fn construct(&mut self, data: (Expr, usize, Vec<Gathering>), is_delete: bool) -> Expr {
        let (mut current, count, chain) = data;

        // Stores partially constructed CondExprs for us to assemble later on.
        let mut committed_cond = Vec::with_capacity(count);

        // Stores the memo used to construct an optional chain, so that it can be used
        // as the this context of an optional call:
        // foo?.bar?.() ->
        // (_foo = foo) == null
        //   ? void 0
        //   : (_foo_bar = _foo.bar) == null
        //     ?  void 0 : _foo_bar.call(_foo)
        let mut ctx = None;

        // In the first pass, we construct a "current" node and several committed
        // CondExprs. The conditionals will have an invalid alt, waiting for the
        // second pass to properly construct them.
        // We reverse iterate so that we can construct a rightward conditional
        // `(_a = a) == null ? void 0 : (_a_b = _a.b) == null ? void 0 : _a_b.c`
        // instead of a leftward one
        // `(_a_b = (_a = a) == null ? void 0 : _a.b) == null ? void 0 : _a_b.c`
        for v in chain.into_iter().rev() {
            current = match v {
                Gathering::Call(mut c) => {
                    c.callee = current.as_callee();
                    ctx = None;
                    c.into()
                }
                Gathering::Member(mut m) => {
                    m.obj = Box::new(current);
                    ctx = None;
                    m.into()
                }
                Gathering::OptCall(mut c, memo) => {
                    let mut call = false;

                    // foo.bar?.() -> (_foo_bar == null) ? void 0 : _foo_bar.call(foo)
                    match &mut current {
                        Expr::Member(m) => {
                            call = true;
                            let this = ctx.unwrap_or_else(|| {
                                let this = self.memoize(&m.obj, true);

                                match &this {
                                    Memo::Cache(i) => {
                                        m.obj = AssignExpr {
                                            span: DUMMY_SP,
                                            op: op!("="),
                                            left: i.clone().into(),
                                            right: m.obj.take(),
                                        }
                                        .into();
                                        this
                                    }
                                    Memo::Raw(_) => this,
                                }
                            });
                            c.args.insert(0, this.into_expr().as_arg());
                        }
                        Expr::SuperProp(s) => {
                            call = true;
                            c.args.insert(0, ThisExpr { span: s.obj.span }.as_arg());
                        }
                        _ => {}
                    }

                    committed_cond.push(CondExpr {
                        span: DUMMY_SP,
                        test: init_and_eq_null_or_undefined(&memo, current, self.c.no_document_all),
                        cons: if is_delete {
                            true.into()
                        } else {
                            Expr::undefined(DUMMY_SP)
                        },
                        alt: Take::dummy(),
                    });
                    c.callee = if call {
                        memo.into_expr()
                            .make_member(quote_ident!("call"))
                            .as_callee()
                    } else {
                        memo.into_expr().as_callee()
                    };
                    ctx = None;
                    c.into()
                }
                Gathering::OptMember(mut m, memo) => {
                    committed_cond.push(CondExpr {
                        span: DUMMY_SP,
                        test: init_and_eq_null_or_undefined(&memo, current, self.c.no_document_all),
                        cons: if is_delete {
                            true.into()
                        } else {
                            Expr::undefined(DUMMY_SP)
                        },
                        alt: Take::dummy(),
                    });
                    ctx = Some(memo.clone());
                    m.obj = memo.into_expr().into();
                    m.into()
                }
            };
        }

        // At this point, `current` is the right-most expression `_a_b.c` in `a?.b?.c`
        if is_delete {
            current = UnaryExpr {
                span: DUMMY_SP,
                op: op!("delete"),
                arg: Box::new(current),
            }
            .into();
        }

        // We now need to reverse iterate the conditionals to construct out tree.
        for mut cond in committed_cond.into_iter().rev() {
            cond.alt = Box::new(current);
            current = cond.into()
        }
        current
    }

    fn should_memo(&self, expr: &Expr, is_call: bool) -> bool {
        fn is_simple_member(e: &Expr) -> bool {
            match e {
                Expr::This(..) => true,
                Expr::Ident(_) => true,
                Expr::SuperProp(s) if !s.prop.is_computed() => true,
                Expr::Member(m) if !m.prop.is_computed() => is_simple_member(&m.obj),
                _ => false,
            }
        }

        match expr {
            Expr::Ident(i) if i.ctxt != self.unresolved_ctxt => false,
            _ => {
                if is_call && self.c.pure_getter {
                    !is_simple_member(expr)
                } else {
                    true
                }
            }
        }
    }

    fn memoize(&mut self, expr: &Expr, is_call: bool) -> Memo {
        if self.should_memo(expr, is_call) {
            let memo = alias_ident_for(expr, "_this");
            self.vars.push(VarDeclarator {
                span: DUMMY_SP,
                name: memo.clone().into(),
                init: None,
                definite: false,
            });
            Memo::Cache(memo)
        } else {
            Memo::Raw(Box::new(expr.to_owned()))
        }
    }

    fn visit_mut_stmt_like<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: Send + Sync + StmtLike + VisitMutWith<Self>,
        Vec<T>: VisitMutWith<Self>,
    {
        let uninit = self.vars.take();
        for stmt in stmts.iter_mut() {
            stmt.visit_mut_with(self);
        }

        if !self.vars.is_empty() {
            prepend_stmt(
                stmts,
                T::from(
                    VarDecl {
                        span: DUMMY_SP,
                        declare: false,
                        kind: VarDeclKind::Var,
                        decls: mem::take(&mut self.vars),
                        ..Default::default()
                    }
                    .into(),
                ),
            );
        }

        self.vars = uninit;
    }
}

fn init_and_eq_null_or_undefined(i: &Memo, init: Expr, no_document_all: bool) -> Box<Expr> {
    let lhs = match i {
        Memo::Cache(i) => AssignExpr {
            span: DUMMY_SP,
            op: op!("="),
            left: i.clone().into(),
            right: Box::new(init),
        }
        .into(),
        Memo::Raw(e) => e.to_owned(),
    };

    if no_document_all {
        return BinExpr {
            span: DUMMY_SP,
            left: lhs,
            op: op!("=="),
            right: Box::new(Lit::Null(Null { span: DUMMY_SP }).into()),
        }
        .into();
    }

    let null_cmp = BinExpr {
        span: DUMMY_SP,
        left: lhs,
        op: op!("==="),
        right: Box::new(Lit::Null(Null { span: DUMMY_SP }).into()),
    }
    .into();

    let left_expr = match i {
        Memo::Cache(i) => Box::new(i.clone().into()),
        Memo::Raw(e) => e.to_owned(),
    };

    let void_cmp = BinExpr {
        span: DUMMY_SP,
        left: left_expr,
        op: op!("==="),
        right: Expr::undefined(DUMMY_SP),
    }
    .into();

    BinExpr {
        span: DUMMY_SP,
        left: null_cmp,
        op: op!("||"),
        right: void_cmp,
    }
    .into()
}
