use super::leap::{Entry, LeapManager};
use crate::util::ExprFactory;
use ast::*;
use fxhash::FxHashSet;
use swc_common::{util::map::Map, Fold, FoldWith, Spanned, Visit, VisitWith, DUMMY_SP};

pub(super) type Loc = Number;

#[derive(Debug)]
pub(super) struct CaseHandler<'a> {
    /// In order to make sure the context object does not collide with  anything
    /// in the local scope, we might have to rename it, so we refer to it
    /// symbolically instead of just assuming that it will be called "context".
    pub ctx: &'a Ident,
    idx: u32,
    temp_idx: u32,
    /// An append-only list of Statements that grows each time this.emit is
    /// called.
    listing: Vec<Stmt>,
    /// Computed on .extend_cases
    listing_len: usize,

    /// A sparse array whose keys correspond to locations in this.listing
    /// that have been marked as branch/jump targets.
    marked: FxHashSet<usize>,

    leaps: LeapManager,
}

impl<'a> CaseHandler<'a> {
    pub fn new(ctx: &'a Ident) -> Self {
        Self {
            ctx,
            idx: 0,
            temp_idx: 0,
            listing_len: 0,
            marked: {
                let mut set = FxHashSet::default();
                set.insert(0);
                set
            },
            listing: vec![],

            leaps: Default::default(),
        }
    }
}

impl CaseHandler<'_> {
    fn emit(&mut self, stmt: Stmt) -> Stmt {
        let span = stmt.span();
        self.listing.push(stmt);

        Stmt::Empty(EmptyStmt { span })
    }

    fn emit_assign(&mut self, lhs: Expr, right: Expr) {
        self.emit(
            AssignExpr {
                span: DUMMY_SP,
                op: op!("="),
                left: PatOrExpr::Expr(box lhs),
                right: box right,
            }
            .into_stmt(),
        );
    }

    pub fn final_loc(&self) -> usize {
        self.listing_len
    }

    fn fold_expr(&mut self, e: Expr, ignore_result: bool) -> Expr {
        let span = e.span();

        macro_rules! finish {
            ($e:expr) => {{
                if ignore_result {
                    self.emit($e.into_stmt());
                    return Expr::Invalid(Invalid { span });
                } else {
                    return $e;
                }
            }};
        }

        // If the expression does not contain a leap, then we either emit the
        // expression as a standalone statement or return it whole.
        if !contains_leap(&e) {
            finish!(e)
        }

        // If any child contains a leap (such as a yield or labeled continue or
        // break statement), then any sibling subexpressions will almost
        // certainly have to be exploded in order to maintain the order of their
        // side effects relative to the leaping child(ren).
        let has_leaping_children = match e {
            Expr::Yield(..) => true,
            Expr::Seq(ref seq) => seq.exprs.iter().any(|e| match **e {
                Expr::Yield(..) => true,
                _ => false,
            }),
            _ => false,
        };

        match e {
            Expr::Member(me) => {
                let obj = me.obj.fold_with(self);
                let prop = if me.computed {
                    me.prop.map(|prop| self.fold_expr(prop, false))
                } else {
                    me.prop
                };

                finish!(Expr::Member(MemberExpr { obj, prop, ..me }));
            }

            Expr::Call(CallExpr {
                span,
                callee,
                args,
                type_args,
            }) => {
                let has_leaping_args = args.iter().any(|t| contains_leap(t));
                let mut new_args = vec![];

                let callee = match callee {
                    ExprOrSuper::Expr(box Expr::Member(me)) => {
                        if has_leaping_args {
                            // If the arguments of the CallExpression contained any yield
                            // expressions, then we need to be sure to evaluate the callee
                            // before evaluating the arguments, but if the callee was a member
                            // expression, then we must be careful that the object of the
                            // member expression still gets bound to `this` for the call.

                            let obj = me.obj.fold_with(self);

                            let prop = if me.computed {
                                me.prop.fold_with(self)
                            } else {
                                me.prop
                            };

                            new_args.insert(
                                0,
                                match obj {
                                    ExprOrSuper::Expr(ref e) => e.clone().as_arg(),
                                    _ => unreachable!("super as callee in a generator function"),
                                },
                            );

                            ExprOrSuper::Expr(
                                box MemberExpr {
                                    span: me.span,
                                    obj,
                                    prop,
                                    computed: me.computed,
                                }
                                .member(quote_ident!("call")),
                            )
                        } else {
                            ExprOrSuper::Expr(box Expr::Member(me)).fold_with(self)
                        }
                    }

                    ExprOrSuper::Expr(box callee) => {
                        let callee = callee.fold_with(self);

                        let callee = match callee {
                            Expr::Member(..) => {
                                // If the callee was not previously a MemberExpression, then the
                                // CallExpression was "unqualified," meaning its `this` object
                                // should be the global object. If the exploded expression has
                                // become a MemberExpression (e.g. a context property, probably a
                                // temporary variable), then we need to force it to be unqualified
                                // by using the (0, object.property)(...) trick; otherwise, it
                                // will receive the object of the MemberExpression as its `this`
                                // object.
                                ExprOrSuper::Expr(box Expr::Seq(SeqExpr {
                                    span: DUMMY_SP,
                                    exprs: vec![
                                        box Lit::Num(Number {
                                            span: DUMMY_SP,
                                            value: 0.0,
                                        })
                                        .into(),
                                        box callee,
                                    ],
                                }))
                            }
                            _ => ExprOrSuper::Expr(box callee),
                        };

                        callee
                    }
                    ExprOrSuper::Super(..) => {
                        unreachable!("super as callee in a generator function")
                    }
                };

                new_args.extend(args.fold_with(self));

                finish!(Expr::Call(CallExpr {
                    span,
                    callee,
                    args: new_args,
                    type_args
                }))
            }

            Expr::New(NewExpr { .. }) => {
                //return finish(t.newExpression(
                //    explodeViaTempVar(null, path.get("callee")),
                //    path.get("arguments").map(function(argPath) {
                //        return explodeViaTempVar(null, argPath);
                //    })
                //));
            }

            Expr::Object(..) => {}

            Expr::Array(..) => {}

            Expr::Seq(..) => {}

            Expr::Bin(ref e) if e.op == op!("&&") || e.op == op!("||") => {}

            Expr::Cond(..) => {}

            Expr::Unary(..) => {}

            Expr::Bin(..) => {}

            Expr::Assign(AssignExpr { op: op!("="), .. }) => {}

            Expr::Update(..) => {}

            Expr::Yield(e) => {
                let after = self.loc();

                let arg = e.arg.fold_with(self);

                if arg.is_some() && e.delegate {
                    // https://github.com/facebook/regenerator/blob/master/packages/regenerator-transform/src/emit.js#L1220-L1235
                    unimplemented!("regenerator: yield* ")
                }

                // TODO: Move this to after emit(ret).
                let after = self.mark(after);

                self.emit_assign(self.ctx.clone().member(quote_ident!("next")), after);

                let ret = ReturnStmt {
                    span: DUMMY_SP,
                    arg,
                }
                .into();
                self.emit(ret);

                return self.ctx.clone().member(quote_ident!("sent"));
            }

            _ => {}
        }

        e
    }

    pub fn extend_cases(&mut self, cases: &mut Vec<SwitchCase>) {
        if self.listing_len != 0 {
            panic!("CaseHandler.extend_cases can be called only once")
        }

        self.listing_len = self.listing.len();
        // If we encounter a break, continue, or return statement in a switch
        // case, we can skip the rest of the statements until the next case.
        let mut already_ended = false;

        for (i, stmt) in self.listing.drain(..).enumerate() {
            let mut case = SwitchCase {
                span: DUMMY_SP,
                test: Some(box Expr::Lit(Lit::Num(Number {
                    span: DUMMY_SP,
                    value: i as _,
                }))),
                cons: vec![],
            };

            if self.marked.contains(&i) {
                cases.push(case);
                already_ended = false;
            }

            if !already_ended {
                cases.last_mut().unwrap().cons.push(stmt);
                //                if isCompletionStatement(stmt) {
                already_ended = true;
                //                }
            }
        }
    }

    fn loc(&self) -> Number {
        Number {
            span: DUMMY_SP,
            value: -1.0,
        }
    }

    fn mark(&mut self, mut n: Number) -> Expr {
        let idx = self.listing.len();
        if n.value == -1.0 {
            n.value = (idx + 1) as _;
        } else {
            assert_eq!(n.value, (idx + 1) as f64);
        }

        // Mark
        self.marked.insert(idx + 1);

        Expr::Lit(Lit::Num(n))
    }

    fn emit_abrupt_completion(
        &mut self,
        ty: &'static str,
        arg: Option<ExprOrSpread>,
        target: Option<Loc>,
    ) -> Stmt {
        let stmt = ReturnStmt {
            span: DUMMY_SP,
            arg: Some(
                box CallExpr {
                    span: DUMMY_SP,
                    callee: self.ctx.clone().member(quote_ident!("abrupt")).as_callee(),
                    args: {
                        let ty_arg = Lit::Str(Str {
                            span: DUMMY_SP,
                            value: ty.into(),
                            has_escape: false,
                        })
                        .as_arg();

                        if let Some(arg) = arg {
                            vec![ty_arg, arg]
                        } else {
                            vec![ty_arg]
                        }
                    },
                    type_args: Default::default(),
                }
                .into(),
            ),
        }
        .into();
        self.emit(stmt)
    }

    /// Emits code for an unconditional jump to the given location, even if the
    /// exact value of the location is not yet known.
    fn jump(&mut self, n: Number) {
        self.emit_assign(
            self.ctx.clone().member(quote_ident!("next")),
            Expr::Lit(Lit::Num(n)),
        );
        self.emit(Stmt::Break(BreakStmt {
            span: DUMMY_SP,
            label: None,
        }));
    }

    fn jump_if(&mut self, test: Box<Expr>, to: Number) {
        self.emit(
            IfStmt {
                span: DUMMY_SP,
                test,
                cons: box BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![
                        AssignExpr {
                            span: DUMMY_SP,
                            op: op!("="),
                            left: PatOrExpr::Expr(
                                box self.ctx.clone().member(quote_ident!("next")),
                            ),
                            right: box Expr::Lit(Lit::Num(to)),
                        }
                        .into_stmt(),
                        Stmt::Break(BreakStmt {
                            span: DUMMY_SP,
                            label: None,
                        }),
                    ],
                }
                .into(),
                alt: None,
            }
            .into(),
        );
    }

    fn jump_if_not(&mut self, test: Box<Expr>, to: Number) {
        let negated_test = match *test {
            Expr::Unary(UnaryExpr {
                op: op!("!"), arg, ..
            }) => arg,
            _ => box Expr::Unary(UnaryExpr {
                span: test.span(),
                op: op!("!"),
                arg: test,
            }),
        };

        self.emit(
            IfStmt {
                span: DUMMY_SP,
                test: negated_test,
                cons: box BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![
                        AssignExpr {
                            span: DUMMY_SP,
                            op: op!("="),
                            left: PatOrExpr::Expr(
                                box self.ctx.clone().member(quote_ident!("next")),
                            ),
                            right: box Expr::Lit(Lit::Num(to)),
                        }
                        .into_stmt(),
                        Stmt::Break(BreakStmt {
                            span: DUMMY_SP,
                            label: None,
                        }),
                    ],
                }
                .into(),
                alt: None,
            }
            .into(),
        );
    }
}

impl Fold<Expr> for CaseHandler<'_> {
    fn fold(&mut self, e: Expr) -> Expr {
        self.fold_expr(e, false)
    }
}

impl Fold<Stmt> for CaseHandler<'_> {
    fn fold(&mut self, s: Stmt) -> Stmt {
        if !contains_leap(&s) {
            // Technically we should be able to avoid emitting the statement
            // altogether if !meta.hasSideEffects(stmt), but that leads to
            // confusing generated code (for instance, `while (true) {}` just
            // disappears) and is probably a more appropriate job for a dedicated
            // dead code elimination pass.
            return self.emit(s);
        }

        let s: Stmt = s.fold_children(self);

        match s {
            Stmt::Block(..) | Stmt::Empty(..) | Stmt::Debugger(..) => s,
            Stmt::With(..) => panic!("WithStatement not supported in generator functions"),

            Stmt::Expr(ExprStmt { span, expr, .. }) => {
                let expr = expr.map(|expr| self.fold_expr(expr, true));
                self.emit(Stmt::Expr(ExprStmt { span, expr }))
            }

            Stmt::Return(ret) => {
                self.emit_abrupt_completion("return", ret.arg.map(|arg| arg.as_arg()), None)
            }

            Stmt::Labeled(s) => {
                let after = self.loc();

                // Did you know you can break from any labeled block statement or
                // control structure? Well, you can! Note: when a labeled loop is
                // encountered, the leap.LabeledEntry created here will immediately
                // enclose a leap.LoopEntry on the leap manager's stack, and both
                // entries will have the same label. Though this works just fine, it
                // may seem a bit redundant. In theory, we could check here to
                // determine if stmt knows how to handle its own label; for example,
                // stmt happens to be a WhileStatement and so we know it's going to
                // establish its own LoopEntry when we explode it (below). Then this
                // LabeledEntry would be unnecessary. Alternatively, we might be
                // tempted not to pass stmt.label down into self.explodeStatement,
                // because we've handled the label here, but that's a mistake because
                // labeled loops may contain labeled continue statements, which is not
                // something we can handle in this generic case. All in all, I think a
                // little redundancy greatly simplifies the logic of this case, since
                // it's clear that we handle all possible LabeledStatements correctly
                // here, regardless of whether they interact with the leap manager
                // themselves. Also remember that labels and break/continue-to-label
                // statements are rare, and all of this logic happens at transform
                // time, so it has no additional runtime cost.

                self.leaps.with(
                    Entry::Labeled {
                        label: s.label.sym.clone(),
                        break_loc: after,
                    },
                    |leaps| s.body.fold_with(self),
                );

                self.mark(after);

                Stmt::Empty(EmptyStmt { span: DUMMY_SP })
            }

            Stmt::Break(s) => {
                let target = self.leaps.find_break_loc(s.label.as_ref().map(|i| &i.sym));
                self.emit_abrupt_completion("break", None, target)
            }

            Stmt::Continue(s) => {
                let target = self
                    .leaps
                    .find_continue_loc(s.label.as_ref().map(|i| &i.sym));
                self.emit_abrupt_completion("continue", None, target)
            }

            Stmt::If(s) => {
                let else_loc = if s.alt.is_some() {
                    Some(self.loc())
                } else {
                    None
                };
                let after = self.loc();

                let test = s.test.fold_with(self);
                self.jump_if_not(test, else_loc.unwrap_or(after));

                s.cons.fold_with(self);

                if let Some(else_loc) = else_loc {
                    self.jump(after);
                    self.mark(else_loc);
                    s.alt.fold_with(self);
                }

                self.mark(after);

                Stmt::Empty(EmptyStmt { span: DUMMY_SP })
            }

            Stmt::Switch(_) => unimplemented!("regenerator: switch statement"),

            Stmt::Throw(s) => {
                let arg = s.arg.fold_with(self);
                self.emit(Stmt::Throw(ThrowStmt { span: s.span, arg }))
            }

            Stmt::Try(_) => unimplemented!("regenerator: try statement"),

            Stmt::While(_) => unimplemented!("regenerator: while statement"),

            Stmt::DoWhile(_) => unimplemented!("regenerator: do while statement"),

            Stmt::For(_) => unimplemented!("regenerator: for statement"),

            Stmt::ForIn(_) => unimplemented!("regenerator: for-in statement"),

            Stmt::ForOf(_) => unimplemented!("regenerator: for-of statement"),

            Stmt::Decl(_) => unimplemented!("Decl"),
        }
    }
}

impl Fold<Function> for CaseHandler<'_> {
    #[inline(always)]
    fn fold(&mut self, f: Function) -> Function {
        f
    }
}

impl Fold<ArrowExpr> for CaseHandler<'_> {
    #[inline(always)]
    fn fold(&mut self, f: ArrowExpr) -> ArrowExpr {
        f
    }
}

struct LeapFinder {
    found: bool,
}

macro_rules! leap {
    ($T:ty) => {
        impl Visit<$T> for LeapFinder {
            fn visit(&mut self, _: &$T) {
                self.found = true;
            }
        }
    };
}

leap!(YieldExpr);
leap!(BreakStmt);
leap!(ContinueStmt);
leap!(ReturnStmt);
leap!(ThrowStmt);

fn contains_leap<T>(node: &T) -> bool
where
    T: VisitWith<LeapFinder>,
{
    let mut v = LeapFinder { found: false };
    node.visit_with(&mut v);
    v.found
}
