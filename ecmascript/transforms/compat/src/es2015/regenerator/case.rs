use super::leap::{CatchEntry, FinallyEntry, TryEntry};
use super::leap::{Entry, LeapManager};
use smallvec::SmallVec;
use std::mem::replace;
use swc_atoms::JsWord;
use swc_common::{
    util::{map::Map, move_map::MoveMap},
    BytePos, Span, Spanned, SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_utils::member_expr;
use swc_ecma_utils::quote_ident;
use swc_ecma_utils::quote_str;
use swc_ecma_utils::undefined;
use swc_ecma_utils::ExprFactory;
use swc_ecma_visit::noop_visit_type;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith, Node, Visit, VisitWith};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub(super) struct Loc {
    id: u32,
    stmt_index: usize,
}

impl Loc {
    pub fn to_stmt_index(&self) -> Expr {
        Expr::Lit(Lit::Num(Number {
            span: DUMMY_SP,
            value: self.stmt_index as _,
        }))
    }

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
    /// that have been marked as stmt/jump targets.
    marked: Vec<Loc>,

    leaps: LeapManager,

    try_entries: SmallVec<[TryEntry; 8]>,
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
            try_entries: Default::default(),
        }
    }
}

impl CaseHandler<'_> {
    fn with_entry<F>(&mut self, entry: Entry, op: F) -> Entry
    where
        F: FnOnce(&mut Self),
    {
        self.leaps.push(entry);
        op(self);
        self.leaps.pop().unwrap()
    }

    pub fn get_try_locs_list(&mut self) -> Option<ArrayLit> {
        if self.try_entries.is_empty() {
            // To avoid adding a needless [] to the majority of runtime.wrap
            // argument lists, force the caller to handle this case specially.
            return None;
        }

        //        let mut last_loc_value = 0;
        Some(ArrayLit {
            span: DUMMY_SP,
            elems: replace(&mut self.try_entries, Default::default())
                .into_iter()
                .map(|entry: TryEntry| {
                    //                    let this_loc_value = entry.first_loc;
                    //                    assert!(
                    //                        this_loc_value.stmt_index >= last_loc_value,
                    //                        "this_loc_value = {:?}; last_loc_value = {};",
                    //                        this_loc_value,
                    //                        last_loc_value
                    //                    );
                    //                    last_loc_value = this_loc_value.stmt_index;

                    let ce = entry.catch_entry;
                    let fe = entry.finally_entry;

                    let mut locs = vec![
                        Some(entry.first_loc),
                        // The null here makes a hole in the array.
                        if let Some(ce) = ce {
                            Some(ce.first_loc)
                        } else {
                            None
                        },
                    ];

                    if let Some(fe) = fe {
                        locs.push(Some(fe.first_loc));
                        locs.push(Some(fe.after_loc));
                    }

                    let elems = locs
                        .into_iter()
                        .map(|loc| {
                            loc.map(|loc| ExprOrSpread {
                                spread: None,
                                expr: Box::new(loc.to_stmt_index()),
                            })
                        })
                        .collect::<Vec<_>>();

                    if elems.is_empty() {
                        return None;
                    }
                    Some(ExprOrSpread {
                        spread: None,
                        expr: Box::new(Expr::Array(ArrayLit {
                            span: DUMMY_SP,
                            elems,
                        })),
                    })
                })
                .collect(),
        })
    }

    /// The context.prev property takes the value of context.next whenever we
    /// evaluate the switch statement discriminant, which is generally good
    /// enough for tracking the last location we jumped to, but sometimes
    /// context.prev needs to be more precise, such as when we fall
    /// successfully out of a try block and into a finally block without
    /// jumping. This method exists to update context.prev to the freshest
    /// available location. If we were implementing a full interpreter, we
    /// would know the location of the current instruction with complete
    /// precision at all times, but we don't have that luxury here, as it would
    /// be costly and verbose to set context.prev before every statement.
    fn update_ctx_prev_loc(&mut self, loc: Option<&mut Loc>) {
        let loc = if let Some(loc) = loc {
            if loc.stmt_index == 0 {
                loc.stmt_index = self.listing.len();
            } else {
                assert_eq!(loc.stmt_index, self.listing.len());
            }

            *loc
        } else {
            self.unmarked_loc()
        };

        self.emit_assign(
            self.ctx.clone().make_member(quote_ident!("prev")),
            loc.expr(),
        );
    }

    fn emit(&mut self, stmt: Stmt) {
        self.listing.push(stmt);
    }

    fn emit_assign(&mut self, lhs: Expr, right: Expr) {
        self.emit(
            AssignExpr {
                span: DUMMY_SP,
                op: op!("="),
                left: PatOrExpr::Expr(Box::new(lhs)),
                right: Box::new(right),
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
            .make_member(quote_ident!(format!("t{}", self.temp_idx)));

        self.temp_idx += 1;

        res
    }

    fn clear_pending_exception(&mut self, try_loc: Loc, assignee: Option<Expr>) {
        let catch_call = Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: self
                .ctx
                .clone()
                .computed_member(quote_str!("catch"))
                .as_callee(),
            args: vec![try_loc.to_stmt_index().as_arg()],
            type_args: Default::default(),
        });

        if let Some(assignee) = assignee {
            self.emit_assign(assignee, catch_call)
        } else {
            self.emit(catch_call.into_stmt())
        }
    }

    /// Not all offsets into emitter.listing are potential jump targets. For
    /// example, execution typically falls into the beginning of a try block
    /// without jumping directly there. This method returns the current offset
    /// without marking it, so that a switch case will not necessarily be
    /// generated for this offset (I say "not necessarily" because the same
    /// location might end up being marked in the process of emitting other
    /// statements). There's no logical harm in marking such locations as jump
    /// targets, but minimizing the number of switch cases keeps the generated
    /// code shorter.
    fn unmarked_loc(&self) -> Loc {
        Loc {
            id: !0,
            stmt_index: self.listing.len(),
        }
    }

    fn explode_expr_via_temp_var(
        &mut self,
        temp_var: Option<Expr>,
        has_leaping_children: bool,
        child: Expr,
        ignore_child_result: bool,
    ) {
        let result = self.explode_expr(child, ignore_child_result);

        if ignore_child_result {
            // Side effects already emitted above.
        } else if temp_var.is_some() || (has_leaping_children && !result.is_lit()) {
            // If tempVar was provided, then the result will always be assigned
            // to it, even if the result does not otherwise need to be assigned
            // to a temporary variable.  When no tempVar is provided, we have
            // the flexibility to decide whether a temporary variable is really
            // necessary.  Unfortunately, in general, a temporary variable is
            // required whenever any child contains a yield expression, since it
            // is difficult to prove (at all, let alone efficiently) whether
            // this result would evaluate to the same value before and after the
            // yield (see #206).  One narrow case where we can prove it doesn't
            // matter (and thus we do not need a temporary variable) is when the
            // result in question is a Literal value.
            let temp_var = temp_var.unwrap_or_else(|| self.make_var());
            self.emit_assign(temp_var, result);
        }
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

        let has_leaping_children = does_a_child_contains_leap(&e);

        //        // If any child contains a leap (such as a yield or labeled continue
        // or        // break statement), then any sibling subexpressions will
        // almost        // certainly have to be exploded in order to maintain
        // the order of their        // side effects relative to the leaping
        // child(ren).        let has_leaping_children = match e {
        //            Expr::Yield(..) => true,
        //            Expr::Seq(ref seq) => seq.exprs.iter().any(|e| match **e {
        //                Expr::Yield(..) => true,
        //                _ => false,
        //            }),
        //            _ => false,
        //        };

        match e {
            Expr::This(..)
            | Expr::Ident(..)
            | Expr::Fn(..)
            | Expr::Lit(..)
            | Expr::Tpl(..)
            | Expr::TaggedTpl(..)
            | Expr::Arrow(..)
            | Expr::Class(..)
            | Expr::MetaProp(..)
            | Expr::JSXMember(..)
            | Expr::JSXNamespacedName(..)
            | Expr::JSXEmpty(..)
            | Expr::JSXElement(..)
            | Expr::JSXFragment(..)
            | Expr::TsTypeAssertion(..)
            | Expr::TsConstAssertion(..)
            | Expr::TsNonNull(..)
            | Expr::TsAs(..)
            | Expr::PrivateName(..)
            | Expr::Invalid(..) => return e,

            Expr::OptChain(e) => {
                return Expr::OptChain(OptChainExpr {
                    expr: e.expr.map(|e| self.explode_expr(e, false)),
                    ..e
                })
            }

            Expr::Await(..) => unimplemented!("regenerator: await in generator"),

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
                    ExprOrSuper::Expr(e) if e.is_member() => {
                        let me = match *e {
                            Expr::Member(me) => me,
                            _ => unreachable!(),
                        };

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

                            ExprOrSuper::Expr(Box::new(
                                MemberExpr {
                                    span: me.span,
                                    obj,
                                    prop,
                                    computed: me.computed,
                                }
                                .make_member(quote_ident!("call")),
                            ))
                        } else {
                            ExprOrSuper::Expr(Box::new(self.explode_expr(Expr::Member(me), false)))
                        }
                    }

                    ExprOrSuper::Expr(callee) => {
                        let callee = *callee;
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
                                ExprOrSuper::Expr(Box::new(Expr::Seq(SeqExpr {
                                    span: DUMMY_SP,
                                    exprs: vec![
                                        Box::new(
                                            Lit::Num(Number {
                                                span: DUMMY_SP,
                                                value: 0.0,
                                            })
                                            .into(),
                                        ),
                                        Box::new(callee),
                                    ],
                                })))
                            }
                            _ => ExprOrSuper::Expr(Box::new(callee)),
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
                            PropOrSpread::Prop(p) => {
                                let p = *p;
                                PropOrSpread::Prop(Box::new(match p {
                                    Prop::Method(_)
                                    | Prop::Setter(_)
                                    | Prop::Getter(_)
                                    | Prop::Shorthand(_) => p,
                                    Prop::KeyValue(p) => Prop::KeyValue(KeyValueProp {
                                        value: p.value.map(|e| self.explode_expr(e, false)),
                                        ..p
                                    }),
                                    Prop::Assign(p) => Prop::Assign(AssignProp {
                                        value: p.value.map(|e| self.explode_expr(e, false)),
                                        ..p
                                    }),
                                }))
                            }
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

                ArrayLit { elems, ..arr }.into()
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
                SeqExpr { exprs, ..e }.into()
            }

            Expr::Bin(e) if e.op == op!("&&") || e.op == op!("||") => {
                let span = e.span;
                let op = e.op;

                let after = self.loc();

                let result = if ignore_result {
                    None
                } else {
                    Some(self.make_var())
                };

                let left = e.left.map(|e| self.explode_expr(e, false));

                match e.op {
                    op!("&&") => self.jump_if_not(left.clone(), after),
                    op!("||") => self.jump_if(left.clone(), after),
                    _ => unreachable!(),
                }

                let right = e.right.map(|e| self.explode_expr(e, false));

                self.mark(after);

                result.unwrap_or_else(|| {
                    Expr::Bin(BinExpr {
                        span,
                        left,
                        op,
                        right,
                    })
                })
            }

            Expr::Cond(e) => {
                let else_loc = self.loc();
                let after = self.loc();

                let test = e.test.map(|e| self.explode_expr(e, false));

                self.jump_if_not(test, else_loc);

                let result = if ignore_result {
                    None
                } else {
                    Some(self.make_var())
                };

                self.explode_expr_via_temp_var(
                    result.clone(),
                    has_leaping_children,
                    *e.cons,
                    ignore_result,
                );
                self.jump(after);

                self.mark(else_loc);
                self.explode_expr_via_temp_var(
                    result.clone(),
                    has_leaping_children,
                    *e.alt,
                    ignore_result,
                );

                self.mark(after);

                result.unwrap_or_else(|| *undefined(DUMMY_SP))
            }

            Expr::Unary(e) => {
                let expr = Expr::Unary(UnaryExpr {
                    arg: e.arg.map(|e| self.explode_expr(e, false)),
                    ..e
                });

                finish!(expr)
            }

            Expr::Bin(e) => {
                let expr = Expr::Bin(BinExpr {
                    left: e.left.map(|e| self.explode_expr(e, false)),
                    right: e.right.map(|e| self.explode_expr(e, false)),
                    ..e
                });

                finish!(expr)
            }

            Expr::Assign(e @ AssignExpr { op: op!("="), .. }) => {
                let expr: Expr = AssignExpr {
                    left: match e.left {
                        PatOrExpr::Expr(e) => e.map(|e| self.explode_expr(e, false)).into(),
                        _ => e.left,
                    },
                    op: op!("="),
                    right: e.right.map(|e| self.explode_expr(e, false)),
                    ..e
                }
                .into();
                finish!(expr)
            }

            Expr::Assign(e) => {
                // For example,
                //
                //   x += yield y
                //
                // becomes
                //
                //   context.t0 = x
                //   x = context.t0 += yield y
                //
                // so that the left-hand side expression is read before the yield.
                // Fixes https://github.com/facebook/regenerator/issues/345.

                let left = match e.left {
                    PatOrExpr::Expr(e) => e.map(|e| self.explode_expr(e, false)),
                    _ => unimplemented!("AssignmentPattern in generator"),
                };
                let tmp = self.make_var();
                self.emit_assign(tmp.clone(), *left.clone());

                let right = e.right.map(|e| self.explode_expr(e, false));

                let expr: Expr = AssignExpr {
                    left: PatOrExpr::Expr(left),
                    op: op!("="),
                    right: Box::new(
                        AssignExpr {
                            span: DUMMY_SP,
                            left: PatOrExpr::Expr(Box::new(tmp)),
                            op: e.op,
                            right,
                        }
                        .into(),
                    ),
                    ..e
                }
                .into();

                finish!(expr)
            }

            Expr::Update(e) => {
                let expr = Expr::Update(UpdateExpr {
                    arg: e.arg.map(|e| self.explode_expr(e, false)),
                    ..e
                });

                finish!(expr)
            }

            Expr::Yield(e) => {
                let span = e.span;
                let after = self.loc();

                let arg = e.arg.map(|e| e.map(|e| self.explode_expr(e, false)));

                if arg.is_some() && e.delegate {
                    let result = self.make_var();

                    let ret = ReturnStmt {
                        // Preserve span
                        span,
                        arg: Some(Box::new(Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: self
                                .ctx
                                .clone()
                                .make_member(quote_ident!("delegateYield"))
                                .as_callee(),
                            args: vec![
                                arg.unwrap().as_arg(),
                                result.clone().as_arg(),
                                after.to_stmt_index().as_arg(),
                            ],
                            type_args: Default::default(),
                        }))),
                    }
                    .into();

                    self.emit(ret);
                    let after = self.mark(after);
                    match self.listing.last_mut().unwrap() {
                        Stmt::Return(ReturnStmt { arg: Some(arg), .. }) => match **arg {
                            Expr::Call(CallExpr { ref mut args, .. }) => {
                                *args.last_mut().unwrap() = after.to_stmt_index().as_arg();
                            }
                            _ => unreachable!(),
                        },
                        _ => unreachable!(),
                    }

                    return result;
                }

                self.emit_assign(
                    self.ctx.clone().make_member(quote_ident!("next")),
                    after.expr(),
                );

                let ret = ReturnStmt {
                    span: DUMMY_SP,
                    arg,
                }
                .into();
                self.emit(ret);
                self.mark(after);

                self.ctx.clone().make_member(quote_ident!("sent"))
            }
        }
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
                test: Some(Box::new(Expr::Lit(Lit::Num(Number {
                    span: DUMMY_SP,
                    value: i as _,
                })))),
                cons: vec![],
            };

            let is_marked = self.marked.iter().any(|loc| i == 0 || loc.stmt_index == i);
            if is_marked || i == 0 {
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
                cases
                    .last_mut()
                    .unwrap()
                    .cons
                    .push(stmt.fold_with(&mut UnmarkedInvalidHandler { case_id: i }));

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

    fn mark(&mut self, mut loc: Loc) -> Loc {
        let idx = self.listing.len();
        loc.stmt_index = idx;

        // Mark
        self.marked.push(loc);
        loc
    }

    fn emit_abrupt_completion(
        &mut self,
        ty: &'static str,
        arg: Option<ExprOrSpread>,
        target: Option<Loc>,
    ) {
        let stmt = ReturnStmt {
            span: DUMMY_SP,
            arg: Some(Box::new(
                CallExpr {
                    span: DUMMY_SP,
                    callee: self
                        .ctx
                        .clone()
                        .make_member(quote_ident!("abrupt"))
                        .as_callee(),
                    args: {
                        let ty_arg = Lit::Str(Str {
                            span: DUMMY_SP,
                            value: ty.into(),
                            has_escape: false,
                            kind: Default::default(),
                        })
                        .as_arg();

                        if ty == "break" || ty == "continue" {
                            vec![ty_arg, target.unwrap().expr().as_arg()]
                        } else {
                            if let Some(arg) = arg {
                                vec![ty_arg, arg]
                            } else {
                                vec![ty_arg]
                            }
                        }
                    },
                    type_args: Default::default(),
                }
                .into(),
            )),
        }
        .into();
        self.emit(stmt)
    }

    /// Emits code for an unconditional jump to the given location, even if the
    /// exact value of the location is not yet known.
    fn jump(&mut self, target: Loc) {
        self.jump_expr(target.expr())
    }

    fn jump_expr(&mut self, next: Expr) {
        self.emit_assign(self.ctx.clone().make_member(quote_ident!("next")), next);
        self.emit(Stmt::Break(BreakStmt {
            span: DUMMY_SP,
            label: None,
        }));
    }

    fn jump_if(&mut self, test: Box<Expr>, to: Loc) {
        self.emit(
            IfStmt {
                span: DUMMY_SP,
                test,
                cons: Box::new(
                    BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![
                            AssignExpr {
                                span: DUMMY_SP,
                                op: op!("="),
                                left: PatOrExpr::Expr(Box::new(
                                    self.ctx.clone().make_member(quote_ident!("next")),
                                )),
                                right: Box::new(to.expr()),
                            }
                            .into_stmt(),
                            Stmt::Break(BreakStmt {
                                span: DUMMY_SP,
                                label: None,
                            }),
                        ],
                    }
                    .into(),
                ),
                alt: None,
            }
            .into(),
        );
    }

    fn jump_if_not(&mut self, test: Box<Expr>, to: Loc) {
        let negated_test = match *test {
            Expr::Unary(UnaryExpr {
                op: op!("!"), arg, ..
            }) => arg,
            _ => Box::new(Expr::Unary(UnaryExpr {
                span: test.span(),
                op: op!("!"),
                arg: test,
            })),
        };

        self.emit(
            IfStmt {
                span: DUMMY_SP,
                test: negated_test,
                cons: Box::new(
                    BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![
                            AssignExpr {
                                span: DUMMY_SP,
                                op: op!("="),
                                left: PatOrExpr::Expr(Box::new(
                                    self.ctx.clone().make_member(quote_ident!("next")),
                                )),
                                right: Box::new(to.expr()),
                            }
                            .into_stmt(),
                            Stmt::Break(BreakStmt {
                                span: DUMMY_SP,
                                label: None,
                            }),
                        ],
                    }
                    .into(),
                ),
                alt: None,
            }
            .into(),
        );
    }

    pub fn explode_stmts(&mut self, stmts: Vec<Stmt>) {
        for s in stmts {
            self.explode_stmt(s, None)
        }
    }

    pub fn explode_stmt(&mut self, s: Stmt, label: Option<JsWord>) {
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

            Stmt::Expr(ExprStmt { expr, .. }) => {
                self.explode_expr(*expr, true);
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
                    |h| h.explode_stmt(*s.body, None),
                );

                self.mark(after);
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

                let test = Box::new(self.explode_expr(*s.test, false));
                self.jump_if_not(test, else_loc.unwrap_or(after));

                self.explode_stmt(*s.cons, None);

                if let Some(else_loc) = else_loc {
                    self.jump(after);
                    self.mark(else_loc);
                    self.explode_stmt(*s.alt.unwrap(), None);
                }

                self.mark(after);
            }

            Stmt::Switch(s) => {
                // Always save the discriminant into a temporary variable in case the
                // test expressions overwrite values like context.sent.
                let disc = self.make_var();
                let discriminant = s.discriminant.map(|e| self.explode_expr(e, false));
                self.emit_assign(disc.clone(), *discriminant);

                let after = self.loc();
                let mut default_loc = self.loc();
                let mut condition = default_loc.expr();
                let len = s.cases.len();
                let mut case_locs = vec![
                    Loc {
                        id: !0,
                        stmt_index: !0
                    };
                    len
                ];

                for (i, c) in s.cases.iter().enumerate().rev() {
                    if let Some(test) = &c.test {
                        case_locs[i] = self.loc();

                        condition = Expr::Cond(CondExpr {
                            span: DUMMY_SP,

                            test: Box::new(Expr::Bin(BinExpr {
                                span: DUMMY_SP,
                                left: Box::new(disc.clone()),
                                op: op!("==="),
                                right: test.clone(),
                            })),
                            cons: Box::new(case_locs[i].expr()),
                            alt: Box::new(condition),
                        });
                    } else {
                        case_locs[i] = default_loc;
                    }
                }

                self.jump_expr(condition);

                let cases = s.cases;
                self.with_entry(Entry::Switch { break_loc: after }, |folder| {
                    for (i, c) in cases.into_iter().enumerate() {
                        case_locs[i] = folder.mark(case_locs[i]);

                        folder.explode_stmts(c.cons);
                    }
                });

                let after = self.mark(after);

                if default_loc.stmt_index == 0 {
                    default_loc = self.mark(default_loc);
                    assert_eq!(default_loc.stmt_index, after.stmt_index);
                }
            }

            Stmt::Throw(s) => {
                let arg = s.arg.map(|e| self.explode_expr(e, false));
                self.emit(Stmt::Throw(ThrowStmt { span: s.span, arg }))
            }

            Stmt::Try(s) => {
                let after = self.loc();

                let TryStmt {
                    mut handler,
                    block,
                    finalizer,
                    ..
                } = s;

                let catch_loc = handler.as_ref().map(|_| self.loc());
                let catch_entry = handler.as_ref().map(|handler| CatchEntry {
                    first_loc: catch_loc.unwrap(),
                    param_id: match handler.param {
                        Some(Pat::Ident(ref i)) => i.to_id(),
                        _ => unimplemented!("regenerator: complex pattern in catch clause"),
                    },
                });

                let finally_loc = finalizer.as_ref().map(|_| self.loc());
                let finally_entry = finalizer.as_ref().map(|_| FinallyEntry {
                    first_loc: finally_loc.unwrap(),
                    after_loc: after,
                });

                let mut try_entry = TryEntry {
                    first_loc: self.unmarked_loc(),
                    catch_entry,
                    finally_entry,
                };

                self.update_ctx_prev_loc(Some(&mut try_entry.first_loc));
                // TODO: Track unmarked entries in a separate field,
                self.with_entry(Entry::TryEntry(try_entry.clone()), |folder| {
                    //
                    folder.explode_stmts(block.stmts);

                    if let Some(catch_loc) = catch_loc {
                        if let Some(finally_loc) = finally_loc {
                            // If we have both a catch block and a finally block, then
                            // because we emit the catch block first, we need to jump over
                            // it to the finally block.
                            folder.jump(finally_loc);
                        } else {
                            // If there is no finally block, then we need to jump over the
                            // catch block to the fall-through location.
                            folder.jump(after);
                        }

                        let mut loc = folder.mark(catch_loc);
                        folder.update_ctx_prev_loc(Some(&mut loc));
                        try_entry.catch_entry.as_mut().unwrap().first_loc = loc;

                        let safe_param = folder.make_var();
                        folder
                            .clear_pending_exception(try_entry.first_loc, Some(safe_param.clone()));

                        //bodyPath.traverse(catchParamVisitor, {
                        //    getSafeParam: () => t.cloneDeep(safeParam),
                        //    catchParamName: handler.param.name
                        //});
                        handler = handler.map(|handler| {
                            let body = handler.body.fold_with(&mut CatchParamHandler {
                                safe_param: &safe_param,
                                param: handler.param.as_ref(),
                            });

                            CatchClause { body, ..handler }
                        });

                        try_entry.catch_entry = match folder.with_entry(
                            Entry::Catch(try_entry.catch_entry.clone().unwrap()),
                            |folder| folder.explode_stmts(handler.unwrap().body.stmts),
                        ) {
                            Entry::Catch(e) => Some(e),
                            _ => unreachable!(),
                        };
                    }

                    if let Some(finally_loc) = finally_loc {
                        let mut loc = folder.mark(finally_loc);
                        folder.update_ctx_prev_loc(Some(&mut loc));
                        try_entry.finally_entry.as_mut().unwrap().first_loc = loc;

                        try_entry.finally_entry = match folder.with_entry(
                            Entry::Finally(try_entry.finally_entry.clone().unwrap()),
                            |folder| folder.explode_stmts(finalizer.unwrap().stmts),
                        ) {
                            Entry::Finally(e) => Some(e),
                            _ => unreachable!(),
                        };

                        let callee = folder
                            .ctx
                            .clone()
                            .make_member(quote_ident!("finish"))
                            .as_callee();
                        folder.emit(
                            ReturnStmt {
                                span: DUMMY_SP,
                                arg: Some(Box::new(Expr::Call(CallExpr {
                                    span: DUMMY_SP,
                                    args: vec![try_entry
                                        .finally_entry
                                        .as_ref()
                                        .unwrap()
                                        .first_loc
                                        .to_stmt_index()
                                        .as_arg()],
                                    callee,
                                    type_args: Default::default(),
                                }))),
                            }
                            .into(),
                        );
                    }
                });

                let after = self.mark(after);

                match &mut try_entry.finally_entry {
                    Some(fe) => {
                        fe.after_loc = after;
                    }
                    None => {}
                }

                self.try_entries.push(try_entry);
            }

            Stmt::While(s) => {
                let body = s.body;

                let before = self.loc();
                let after = self.loc();

                let before = self.mark(before);

                let test = s.test.map(|e| self.explode_expr(e, false));
                self.jump_if_not(test, after);

                self.with_entry(
                    Entry::Loop {
                        break_loc: after,
                        continue_loc: before,
                        label: label.clone(),
                    },
                    |folder| {
                        folder.explode_stmt(*body, None);
                    },
                );

                self.jump(before);
                self.mark(after);
            }

            Stmt::DoWhile(s) => {
                let body = s.body;

                let first = self.loc();
                let test = self.loc();
                let after = self.loc();

                let first = self.mark(first);

                self.with_entry(
                    Entry::Loop {
                        break_loc: after,
                        continue_loc: test,
                        label,
                    },
                    |folder| folder.explode_stmt(*body, None),
                );

                self.mark(test);
                let test = s.test.map(|e| self.explode_expr(e, false));
                self.jump_if(test, first);
                self.mark(after);
            }

            Stmt::For(s) => {
                let body = s.body;

                let head = self.loc();
                let update = self.loc();
                let after = self.loc();

                if let Some(init) = s.init {
                    // We pass true here to indicate that if stmt.init is an
                    // expression then we do not care about
                    // its result.
                    match init {
                        VarDeclOrExpr::Expr(expr) => {
                            self.explode_expr(*expr, true);
                        }
                        _ => unreachable!("VarDeclaration in for loop must be hoisted"),
                    }
                };

                self.mark(head);

                if let Some(test) = s.test {
                    let test = test.map(|e| self.explode_expr(e, false));
                    self.jump_if_not(test, after);
                } else {
                    // No test means continue unconditionally.
                }

                self.with_entry(
                    Entry::Loop {
                        break_loc: after,
                        continue_loc: update,
                        label,
                    },
                    |folder| folder.explode_stmt(*body, None),
                );

                self.mark(update);

                if let Some(update) = s.update {
                    // We pass true here to indicate that if stmt.update is an
                    // expression then we do not care about its result.
                    self.explode_expr(*update, true);
                }

                self.jump(head);

                self.mark(after);
            }

            Stmt::ForIn(s) => {
                let body = s.body;

                let head = self.loc();
                let after = self.loc();

                let key_iter_next_fn = self.make_var();

                let right = s.right.map(|e| self.explode_expr(e, false));
                self.emit_assign(
                    key_iter_next_fn.clone(),
                    CallExpr {
                        span: DUMMY_SP,
                        callee: member_expr!(DUMMY_SP, regeneratorRuntime.keys).as_callee(),
                        args: vec![right.as_arg()],
                        type_args: Default::default(),
                    }
                    .into(),
                );

                let head = self.mark(head);

                let key_info_tmp_var = self.make_var();

                self.jump_if(
                    Box::new(
                        AssignExpr {
                            span: DUMMY_SP,
                            op: op!("="),
                            left: PatOrExpr::Expr(Box::new(key_info_tmp_var.clone().into())),
                            right: Box::new(
                                CallExpr {
                                    span: DUMMY_SP,
                                    callee: key_iter_next_fn.as_callee(),
                                    args: vec![],
                                    type_args: Default::default(),
                                }
                                .into(),
                            ),
                        }
                        .make_member(quote_ident!("done")),
                    ),
                    after,
                );

                {
                    let right =
                        Box::new(key_info_tmp_var.clone().make_member(quote_ident!("value")));
                    match s.left {
                        VarDeclOrPat::VarDecl(var) => unreachable!(
                            "VarDeclaration in for-in statement must be hoisted: {:?}",
                            var
                        ),
                        VarDeclOrPat::Pat(pat) => self.emit(
                            AssignExpr {
                                span: DUMMY_SP,
                                op: op!("="),
                                left: PatOrExpr::Pat(Box::new(pat)),
                                right,
                            }
                            .into_stmt(),
                        ),
                    }
                }

                self.with_entry(
                    Entry::Loop {
                        break_loc: after,
                        continue_loc: head,
                        label,
                    },
                    |folder| {
                        folder.explode_stmt(*body, None);
                    },
                );

                self.jump(head);

                self.mark(after);
            }

            Stmt::ForOf(s) => unreachable!(
                "for-of statement should be removed by es2015::for_of pass\n{:?}",
                s
            ),

            Stmt::Decl(_) => self.emit(s),
        }
    }
}

struct LeapFinder {
    found: bool,
}

macro_rules! leap {
    ($name:ident,$T:ty) => {
        fn $name(&mut self, _: &$T, _: &dyn Node) {
            self.found = true;
        }
    };
}

impl Visit for LeapFinder {
    noop_visit_type!();

    /// Ignored
    fn visit_function(&mut self, _: &Function, _: &dyn Node) {}
    /// Ignored
    fn visit_arrow_expr(&mut self, _: &ArrowExpr, _: &dyn Node) {}

    leap!(visit_yield_expr, YieldExpr);
    leap!(visit_break_stmt, BreakStmt);
    leap!(visit_continue_stmt, ContinueStmt);
    leap!(visit_return_stmt, ReturnStmt);
    leap!(visit_throw_stmt, ThrowStmt);
}

fn contains_leap<T>(node: &T) -> bool
where
    T: VisitWith<LeapFinder>,
{
    let mut v = LeapFinder { found: false };
    node.visit_with(&Invalid { span: DUMMY_SP } as _, &mut v);
    v.found
}

fn does_a_child_contains_leap<T>(node: &T) -> bool
where
    T: VisitWith<LeapFinder>,
{
    let mut v = LeapFinder { found: false };
    node.visit_children_with(&mut v);
    v.found
}

struct UnmarkedInvalidHandler {
    /// Id of the case statement
    case_id: usize,
}

impl Fold for UnmarkedInvalidHandler {
    noop_fold_type!();

    fn fold_expr(&mut self, e: Expr) -> Expr {
        let e = e.fold_children_with(self);

        match e {
            Expr::Invalid(Invalid { span }) => Expr::Lit(Lit::Num(Number {
                span,
                value: self.case_id as _,
            })),
            _ => e,
        }
    }
}

/// Convert <invalid> to case number
struct InvalidToLit<'a> {
    // Map from loc-id to stmt index
    map: &'a [Loc],
}
impl Fold for InvalidToLit<'_> {
    noop_fold_type!();

    fn fold_expr(&mut self, e: Expr) -> Expr {
        let e = e.fold_children_with(self);

        match e {
            Expr::Invalid(Invalid { span }) => {
                //
                if span.lo == span.hi {
                    if let Some(Loc { stmt_index, .. }) =
                        self.map.iter().find(|loc| loc.id == span.lo.0)
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

struct CatchParamHandler<'a> {
    safe_param: &'a Expr,
    param: Option<&'a Pat>,
}

impl Fold for CatchParamHandler<'_> {
    noop_fold_type!();

    fn fold_expr(&mut self, node: Expr) -> Expr {
        match self.param {
            None => return node,
            Some(Pat::Ident(i)) => match &node {
                Expr::Ident(r) => {
                    if r.sym == i.id.sym && i.id.span.ctxt() == r.span.ctxt() {
                        return self.safe_param.clone();
                    }
                }
                _ => {}
            },
            _ => {}
        }

        node.fold_children_with(self)
    }
}
