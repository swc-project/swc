use std::mem;

use serde::Deserialize;
use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    alias_ident_for, prepend_stmt, quote_ident, undefined, ExprFactory, StmtLike,
};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

pub fn optional_chaining(c: Config) -> impl Fold + VisitMut {
    as_folder(OptChaining {
        c,
        ..Default::default()
    })
}

#[derive(Default)]
struct OptChaining {
    vars: Vec<VarDeclarator>,
    c: Config,
}

#[derive(Debug, Clone, Copy, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub no_document_all: bool,
    #[serde(default)]
    pub pure_getter: bool,
}

impl VisitMut for OptChaining {
    noop_visit_mut_type!();

    fn visit_mut_block_stmt_or_expr(&mut self, expr: &mut BlockStmtOrExpr) {
        if let BlockStmtOrExpr::Expr(e) = expr {
            let mut stmt = BlockStmt {
                span: DUMMY_SP,
                stmts: vec![Stmt::Return(ReturnStmt {
                    span: DUMMY_SP,
                    arg: Some(e.take()),
                })],
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
        }
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        match e {
            // foo?.bar -> foo == null ? void 0 : foo.bar
            Expr::OptChain(v) => {
                let data = self.gather(v.take(), vec![]);
                *e = self.construct(data, false, self.c.no_document_all);
            }

            // delete foo?.bar -> foo == null ? true : delete foo.bar
            Expr::Unary(UnaryExpr {
                arg: box Expr::OptChain(v),
                op: op!("delete"),
                ..
            }) => {
                let data = self.gather(v.take(), vec![]);
                *e = self.construct(data, true, self.c.no_document_all);
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
                    span: DUMMY_SP,
                    declare: false,
                    kind: VarDeclKind::Var,
                    decls: mem::take(&mut self.vars),
                }))),
                Stmt::Return(ReturnStmt {
                    span: DUMMY_SP,
                    arg: Some(a.right.take()),
                }),
            ];
            a.right = Box::new(Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: Expr::Arrow(ArrowExpr {
                    span: DUMMY_SP,
                    params: vec![],
                    body: Box::new(BlockStmtOrExpr::BlockStmt(BlockStmt {
                        span: DUMMY_SP,
                        stmts,
                    })),
                    is_async: false,
                    is_generator: false,
                    type_params: Default::default(),
                    return_type: Default::default(),
                })
                .as_callee(),
                args: vec![],
                type_args: Default::default(),
            }));
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

#[derive(Debug)]
enum Gathering {
    Call(CallExpr),
    Member(MemberExpr),
    OptCall(CallExpr, Ident),
    OptMember(MemberExpr, Ident),
}

impl OptChaining {
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
                        Gathering::OptMember(m.take(), self.memoize(&next))
                    } else {
                        Gathering::Member(m.take())
                    });
                }

                OptChainBase::Call(c) => {
                    next = c.callee.take();
                    c.args.visit_mut_with(self);
                    // I don't know why c is an OptCall instead of a CallExpr.
                    chain.push(if optional {
                        Gathering::OptCall(c.take().into(), self.memoize(&next))
                    } else {
                        Gathering::Call(c.take().into())
                    });
                }
            }

            match *next {
                Expr::OptChain(next) => {
                    current = next;
                }
                base => return (base, count, chain),
            }
        }
    }

    /// Constructs a rightward nested conditional expression out of our
    /// flattened chain.
    fn construct(
        &mut self,
        data: (Expr, usize, Vec<Gathering>),
        is_delete: bool,
        no_document_all: bool,
    ) -> Expr {
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
                    Expr::Call(c)
                }
                Gathering::Member(mut m) => {
                    m.obj = Box::new(current);
                    ctx = None;
                    Expr::Member(m)
                }
                Gathering::OptCall(mut c, memo) => {
                    let mut call = false;

                    // foo.bar?.() -> (_foo_bar == null) ? void 0 : _foo_bar.call(foo)
                    match &mut current {
                        Expr::Member(m) => {
                            call = true;
                            let this = ctx.unwrap_or_else(|| {
                                let this = self.memoize(&m.obj);
                                m.obj = Box::new(Expr::Assign(AssignExpr {
                                    span: DUMMY_SP,
                                    op: op!("="),
                                    left: this.clone().into(),
                                    right: m.obj.take(),
                                }));
                                this
                            });
                            c.args.insert(0, this.as_arg());
                        }
                        Expr::SuperProp(s) => {
                            call = true;
                            c.args.insert(0, ThisExpr { span: s.obj.span }.as_arg());
                        }
                        _ => {}
                    }

                    committed_cond.push(CondExpr {
                        span: DUMMY_SP,
                        test: init_and_eq_null_or_undefined(&memo, current, no_document_all),
                        cons: if is_delete {
                            true.into()
                        } else {
                            undefined(DUMMY_SP)
                        },
                        alt: Take::dummy(),
                    });
                    c.callee = if call {
                        memo.make_member(quote_ident!("call")).as_callee()
                    } else {
                        memo.as_callee()
                    };
                    ctx = None;
                    Expr::Call(c)
                }
                Gathering::OptMember(mut m, memo) => {
                    committed_cond.push(CondExpr {
                        span: DUMMY_SP,
                        test: init_and_eq_null_or_undefined(&memo, current, no_document_all),
                        cons: if is_delete {
                            true.into()
                        } else {
                            undefined(DUMMY_SP)
                        },
                        alt: Take::dummy(),
                    });
                    ctx = Some(memo.clone());
                    m.obj = memo.into();
                    Expr::Member(m)
                }
            };
        }

        // At this point, `current` is the right-most expression `_a_b.c` in `a?.b?.c`
        if is_delete {
            current = Expr::Unary(UnaryExpr {
                span: DUMMY_SP,
                op: op!("delete"),
                arg: Box::new(current),
            });
        }

        // We now need to reverse iterate the conditionals to construct out tree.
        for mut cond in committed_cond.into_iter().rev() {
            cond.alt = Box::new(current);
            current = Expr::Cond(cond)
        }
        current
    }

    fn memoize(&mut self, expr: &Expr) -> Ident {
        let memo = alias_ident_for(expr, "_this");
        self.vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: memo.clone().into(),
            init: None,
            definite: false,
        });
        memo
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
                T::from_stmt(
                    VarDecl {
                        span: DUMMY_SP,
                        declare: false,
                        kind: VarDeclKind::Var,
                        decls: mem::take(&mut self.vars),
                    }
                    .into(),
                ),
            );
        }

        self.vars = uninit;
    }
}

fn init_and_eq_null_or_undefined(i: &Ident, init: Expr, no_document_all: bool) -> Box<Expr> {
    let lhs = Box::new(Expr::Assign(AssignExpr {
        span: DUMMY_SP,
        op: op!("="),
        left: PatOrExpr::Pat(i.clone().into()),
        right: Box::new(init),
    }));

    if no_document_all {
        return Box::new(Expr::Bin(BinExpr {
            span: DUMMY_SP,
            left: lhs,
            op: op!("=="),
            right: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
        }));
    }

    let null_cmp = Box::new(Expr::Bin(BinExpr {
        span: DUMMY_SP,
        left: lhs,
        op: op!("==="),
        right: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
    }));

    let void_cmp = Box::new(Expr::Bin(BinExpr {
        span: DUMMY_SP,
        left: Box::new(Expr::Ident(i.clone())),
        op: op!("==="),
        right: undefined(DUMMY_SP),
    }));

    Box::new(Expr::Bin(BinExpr {
        span: DUMMY_SP,
        left: null_cmp,
        op: op!("||"),
        right: void_cmp,
    }))
}
