use crate::util::ExprFactory;
use ast::*;
use swc_common::{util::map::Map, Fold, FoldWith, Spanned, Visit, VisitWith, DUMMY_SP};

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

    /// A sparse array whose keys correspond to locations in this.listing
    /// that have been marked as branch/jump targets.
    marked: Vec<bool>,
}

impl<'a> CaseHandler<'a> {
    pub fn new(ctx: &'a Ident) -> Self {
        Self {
            ctx,
            idx: 0,
            temp_idx: 0,
            marked: vec![true],
            listing: vec![],
        }
    }
}

impl CaseHandler<'_> {
    fn emit(&mut self, stmt: Stmt) -> Stmt {
        let span = stmt.span();
        self.listing.push(stmt);

        Stmt::Empty(EmptyStmt { span })
    }

    pub fn final_loc(&self) -> usize {
        self.listing.len()
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
                                    ExprOrSuper::Expr(ref e) => e.clone(),
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

            _ => {}
        }

        e
    }

    pub fn extend_cases(&mut self, cases: &mut Vec<SwitchCase>) {
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

            if self.marked.get(i) == Some(&true) {
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
}

impl Fold<Expr> for CaseHandler<'_> {
    fn fold(&mut self, e: Expr) -> Expr {
        self.fold_expr(e, false)
    }
}

impl Fold<Stmt> for CaseHandler<'_> {
    fn fold(&mut self, s: Stmt) -> Stmt {
        let s: Stmt = s.fold_children(self);

        if !contains_leap(&s) {
            // Technically we should be able to avoid emitting the statement
            // altogether if !meta.hasSideEffects(stmt), but that leads to
            // confusing generated code (for instance, `while (true) {}` just
            // disappears) and is probably a more appropriate job for a dedicated
            // dead code elimination pass.
            return self.emit(s);
        }

        match s {
            Stmt::Expr(ExprStmt { span, expr, .. }) => {
                let expr = expr.map(|expr| self.fold_expr(expr, true));
                return self.emit(Stmt::Expr(ExprStmt { span, expr }));
            }

            Stmt::Return(ret) => {
                return ReturnStmt {
                    arg: Some(
                        box CallExpr {
                            span: DUMMY_SP,
                            callee: self.ctx.clone().member(quote_ident!("abrupt")).as_callee(),
                            args: {
                                let ret_arg = Lit::Str(Str {
                                    span: DUMMY_SP,
                                    value: "return".into(),
                                    has_escape: false,
                                })
                                .as_arg();

                                if let Some(arg) = ret.arg {
                                    vec![ret_arg, arg.as_arg()]
                                } else {
                                    vec![ret_arg]
                                }
                            },
                            type_args: Default::default(),
                        }
                        .into(),
                    ),
                    ..ret
                }
                .into()
            }
            _ => {}
        }

        s
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
