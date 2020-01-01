use super::leap::{Entry, LeapManager};
use crate::util::{undefined, ExprFactory};
use ast::*;
use std::mem::replace;
use swc_common::{
    util::{map::Map, move_map::MoveMap},
    BytePos, Fold, FoldWith, Span, Spanned, SyntaxContext, Visit, VisitWith, DUMMY_SP,
};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub(super) struct Loc {
    id: u32,
    stmt_index: usize,
}

impl Loc {
    /// Creates an invalid expression pointing `self`
    fn expr(&self) -> Expr {
        Expr::Invalid(Invalid {
            span: Span::new(BytePos(self.id), BytePos(self.id), SyntaxContext::empty()),
        })
    }
}

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

    listing_len: usize,

    /// A sparse array whose keys correspond to locations in this.listing
    /// that have been marked as branch/jump targets.
    marked: Vec<Loc>,

    leaps: LeapManager,
}

impl<'a> CaseHandler<'a> {
    pub fn new(ctx: &'a Ident) -> Self {
        Self {
            ctx,
            idx: 0,
            temp_idx: 0,
            listing_len: 0,
            marked: vec![],
            listing: vec![],

            leaps: Default::default(),
        }
    }
}

impl CaseHandler<'_> {
    fn with_entry<F, Ret>(&mut self, entry: Entry, op: F) -> Ret
    where
        F: FnOnce(&mut Self) -> Ret,
    {
        self.leaps.push(entry);
        let ret = op(self);
        self.leaps.pop();

        ret
    }

    fn emit(&mut self, stmt: Stmt) {
        self.listing.push(stmt);
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

    fn make_var(&mut self) -> Expr {
        let res = self
            .ctx
            .clone()
            .member(quote_ident!(format!("t{}", self.temp_idx)));

        self.temp_idx += 1;

        res
    }

    fn explode_expr(&mut self, e: Expr, ignore_result: bool) -> Expr {
        let span = e.span();

        macro_rules! finish {
            ($e:expr) => {{
                if ignore_result {
                    self.emit($e.into_stmt());
                    return *undefined(span);
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
            Expr::Paren(ParenExpr { span, expr }) => {
                return Expr::Paren(ParenExpr {
                    span,
                    expr: expr.map(|e| self.explode_expr(e, ignore_result)),
                })
            }

            Expr::Member(me) => {
                let obj = match me.obj {
                    ExprOrSuper::Expr(obj) => {
                        ExprOrSuper::Expr(obj.map(|e| self.explode_expr(e, false)))
                    }
                    _ => me.obj,
                };
                let prop = if me.computed {
                    me.prop.map(|prop| self.explode_expr(prop, false))
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

                            let obj = match me.obj {
                                ExprOrSuper::Expr(e) => {
                                    ExprOrSuper::Expr(e.map(|e| self.explode_expr(e, false)))
                                }
                                _ => me.obj,
                            };

                            let prop = if me.computed {
                                me.prop.map(|e| self.explode_expr(e, false))
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
                            ExprOrSuper::Expr(box self.explode_expr(Expr::Member(me), false))
                        }
                    }

                    ExprOrSuper::Expr(box callee) => {
                        let callee = self.explode_expr(callee, false);

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

                new_args.extend(args.into_iter().map(|arg| ExprOrSpread {
                    expr: arg.expr.map(|e| self.explode_expr(e, false)),
                    ..arg
                }));

                finish!(Expr::Call(CallExpr {
                    span,
                    callee,
                    args: new_args,
                    type_args
                }))
            }

            Expr::New(e) => {
                let callee = e.callee.map(|e| self.explode_expr(e, false));
                let args = if let Some(args) = e.args {
                    Some(
                        args.into_iter()
                            .map(|arg| ExprOrSpread {
                                expr: arg.expr.map(|e| self.explode_expr(e, false)),
                                ..arg
                            })
                            .collect(),
                    )
                } else {
                    None
                };
                return NewExpr { callee, args, ..e }.into();
            }

            Expr::Object(obj) => {
                let props = obj
                    .props
                    .into_iter()
                    .map(|prop| {
                        //
                        match prop {
                            PropOrSpread::Prop(box p) => PropOrSpread::Prop(box match p {
                                Prop::Shorthand(_) => {
                                    unimplemented!("regenerator: shorthand property")
                                }
                                Prop::KeyValue(p) => Prop::KeyValue(KeyValueProp {
                                    value: p.value.map(|e| self.explode_expr(e, false)),
                                    ..p
                                }),
                                Prop::Assign(p) => Prop::Assign(AssignProp {
                                    value: p.value.map(|e| self.explode_expr(e, false)),
                                    ..p
                                }),
                                Prop::Getter(_) => unimplemented!("regenerator: getter property"),
                                Prop::Setter(_) => unimplemented!("regenerator: setter property"),
                                Prop::Method(_) => unimplemented!("regenerator: method property"),
                            }),
                            _ => prop,
                        }
                    })
                    .collect();

                let expr = Expr::Object(ObjectLit { props, ..obj });
                finish!(expr)
            }

            Expr::Array(arr) => {
                let elems = arr.elems.move_map(|opt| {
                    opt.map(|elem| ExprOrSpread {
                        expr: elem.expr.map(|e| self.explode_expr(e, false)),
                        ..elem
                    })
                });

                return ArrayLit { elems, ..arr }.into();
            }

            Expr::Seq(e) => {
                let len = e.exprs.len();
                let exprs = e
                    .exprs
                    .into_iter()
                    .enumerate()
                    .map(|(i, e)| {
                        e.map(|e| {
                            self.explode_expr(e, if len - 1 == i { ignore_result } else { true })
                        })
                    })
                    .collect();
                return SeqExpr { exprs, ..e }.into();
            }

            Expr::Bin(ref e) if e.op == op!("&&") || e.op == op!("||") => {
                unimplemented!("regenerator: logical expression")
            }

            Expr::Cond(e) => {
                let else_loc = self.loc();
                let after = self.loc();

                let test = e.test.map(|e| self.explode_expr(e, false));

                self.jump_if_not(test, &else_loc);

                let result = if ignore_result {
                    None
                } else {
                    Some(self.make_var())
                };

                self.explode_expr(*e.cons, ignore_result);
                self.jump(&after);

                self.mark(else_loc);
                self.explode_expr(*e.alt, ignore_result);

                self.mark(after);

                return result.map(|e| e).unwrap_or_else(|| *undefined(DUMMY_SP));
            }

            Expr::Unary(..) => unimplemented!("regenerator: unary expression"),

            Expr::Bin(..) => unimplemented!("regenerator: binary expression"),

            Expr::Assign(AssignExpr { op: op!("="), .. }) => {
                unimplemented!("regenerator: assign expression with =")
            }

            Expr::Update(..) => unimplemented!("regenerator: update expression"),

            Expr::Yield(e) => {
                let after = self.loc();

                let arg = e.arg.map(|e| e.map(|e| self.explode_expr(e, false)));

                if arg.is_some() && e.delegate {
                    // https://github.com/facebook/regenerator/blob/master/packages/regenerator-transform/src/emit.js#L1220-L1235
                    unimplemented!("regenerator: yield* ")
                }

                self.emit_assign(self.ctx.clone().member(quote_ident!("next")), after.expr());

                let ret = ReturnStmt {
                    span: DUMMY_SP,
                    arg,
                }
                .into();
                self.emit(ret);
                self.mark(after);

                return self.ctx.clone().member(quote_ident!("sent"));
            }

            _ => {}
        }

        e
    }

    pub fn extend_cases(&mut self, cases: &mut Vec<SwitchCase>) {
        self.listing_len = self.listing.len();
        // If we encounter a break, continue, or return statement in a switch
        // case, we can skip the rest of the statements until the next case.
        let mut already_ended = false;

        let stmts = {
            let stmts = replace(&mut self.listing, vec![]);
            let mut v = InvalidToLit { map: &self.marked };

            stmts.fold_with(&mut v)
        };

        for (i, stmt) in stmts.into_iter().enumerate() {
            let case = SwitchCase {
                span: DUMMY_SP,
                test: Some(box Expr::Lit(Lit::Num(Number {
                    span: DUMMY_SP,
                    value: i as _,
                }))),
                cons: vec![],
            };

            let is_marked = self.marked.iter().any(|loc| i == 0 || loc.stmt_index == i);
            if is_marked {
                cases.push(case);
                already_ended = false;
            }

            if !already_ended {
                let is_completion = match stmt {
                    Stmt::Return(..) | Stmt::Throw(..) | Stmt::Break(..) | Stmt::Continue(..) => {
                        true
                    }
                    _ => false,
                };
                cases.last_mut().unwrap().cons.push(stmt);

                if is_completion {
                    already_ended = true;
                }
            }
        }
    }

    fn loc(&mut self) -> Loc {
        let loc = Loc {
            id: self.idx,
            stmt_index: 0,
        };
        self.idx += 1;
        loc
    }

    fn mark(&mut self, mut loc: Loc) {
        let idx = self.listing.len();

        loc.stmt_index = idx;

        // Mark
        self.marked.push(loc);
    }

    fn emit_abrupt_completion(
        &mut self,
        ty: &'static str,
        arg: Option<ExprOrSpread>,
        target: Option<&Loc>,
    ) {
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
    fn jump(&mut self, target: &Loc) {
        self.emit_assign(self.ctx.clone().member(quote_ident!("next")), target.expr());
        self.emit(Stmt::Break(BreakStmt {
            span: DUMMY_SP,
            label: None,
        }));
    }

    fn jump_if(&mut self, test: Box<Expr>, to: &Loc) {
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
                            right: box to.expr(),
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

    fn jump_if_not(&mut self, test: Box<Expr>, to: &Loc) {
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
                            right: box to.expr(),
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

    pub fn explode_stmts(&mut self, stmts: Vec<Stmt>) {
        for s in stmts {
            self.explode_stmt(s)
        }
    }

    pub fn explode_stmt(&mut self, s: Stmt) {
        if !contains_leap(&s) {
            // Technically we should be able to avoid emitting the statement
            // altogether if !meta.hasSideEffects(stmt), but that leads to
            // confusing generated code (for instance, `while (true) {}` just
            // disappears) and is probably a more appropriate job for a dedicated
            // dead code elimination pass.
            return self.emit(s);
        }

        match s {
            Stmt::Empty(..) | Stmt::Debugger(..) => {}
            Stmt::Block(s) => self.explode_stmts(s.stmts),

            Stmt::With(..) => panic!("WithStatement not supported in generator functions"),

            Stmt::Expr(ExprStmt { span, expr, .. }) => {
                let expr = expr.map(|expr| self.explode_expr(expr, true));
                self.emit(Stmt::Expr(ExprStmt { span, expr }))
            }

            Stmt::Return(ret) => {
                let arg = ret.arg.map(|e| e.map(|e| self.explode_expr(e, false)));
                self.emit_abrupt_completion("return", arg.map(|arg| arg.as_arg()), None)
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

                self.with_entry(
                    Entry::Labeled {
                        label: s.label.sym.clone(),
                        break_loc: after,
                    },
                    |h| h.explode_stmt(*s.body),
                );

                self.mark(after);
            }

            Stmt::Break(s) => {
                let target = self.leaps.find_break_loc(s.label.as_ref().map(|i| &i.sym));
                self.emit_abrupt_completion("break", None, target.as_ref())
            }

            Stmt::Continue(s) => {
                let target = self
                    .leaps
                    .find_continue_loc(s.label.as_ref().map(|i| &i.sym));
                self.emit_abrupt_completion("continue", None, target.as_ref())
            }

            Stmt::If(s) => {
                let else_loc = if s.alt.is_some() {
                    Some(self.loc())
                } else {
                    None
                };
                let after = self.loc();

                let test = box self.explode_expr(*s.test, false);
                self.jump_if_not(test, else_loc.as_ref().unwrap_or(&after));

                self.explode_stmt(*s.cons);

                if let Some(else_loc) = else_loc {
                    self.jump(&after);
                    self.mark(else_loc);
                    self.explode_stmt(*s.alt.unwrap());
                }

                self.mark(after);
            }

            Stmt::Switch(_) => unimplemented!("regenerator: switch statement"),

            Stmt::Throw(s) => {
                let arg = s.arg.map(|e| self.explode_expr(e, false));
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

/// Convert <invalid> to number
struct InvalidToLit<'a> {
    // Map from loc-id to stmt index
    map: &'a [Loc],
}
impl Fold<Expr> for InvalidToLit<'_> {
    fn fold(&mut self, e: Expr) -> Expr {
        let e = e.fold_children(self);

        match e {
            Expr::Invalid(Invalid { span }) => {
                //
                let data = span.data();
                if data.lo == data.hi {
                    if let Some(Loc { stmt_index, .. }) =
                        self.map.iter().find(|loc| loc.id == data.lo.0)
                    {
                        return Expr::Lit(Lit::Num(Number {
                            span: DUMMY_SP,
                            value: (*stmt_index) as _,
                        }));
                    }
                }

                Expr::Invalid(Invalid { span })
            }
            _ => e,
        }
    }
}
