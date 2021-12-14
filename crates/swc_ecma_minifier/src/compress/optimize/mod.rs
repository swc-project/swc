#![allow(dead_code)]

use self::util::MultiReplacer;
use super::util::is_fine_for_if_cons;
use crate::{
    analyzer::{ProgramData, UsageAnalyzer},
    compress::util::is_pure_undefined,
    debug::{dump, AssertValid},
    marks::Marks,
    mode::Mode,
    option::CompressOptions,
    util::{contains_leaping_yield, make_number, ModuleItemExt},
};
use retain_mut::RetainMut;
use std::{fmt::Write, mem::take};
use swc_atoms::{js_word, JsWord};
use swc_common::{
    collections::AHashMap, iter::IdentifyLast, pass::Repeated, util::take::Take, Mark, Spanned,
    SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    ident::IdentLike, prepend_stmts, undefined, ExprExt, ExprFactory, Id, IsEmpty, ModuleItemLike,
    StmtLike, Type, Value,
};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith, VisitWith};
use tracing::{span, Level};
use Value::Known;

mod arguments;
mod bools;
mod collapse_vars;
mod conditionals;
mod dead_code;
mod evaluate;
mod fns;
mod hoist_props;
mod if_return;
mod iife;
mod inline;
mod join_vars;
mod loops;
mod ops;
mod sequences;
mod strings;
mod switches;
mod unused;
mod util;

/// This pass is similar to `node.optimize` of terser.
pub(super) fn optimizer<'a, M>(
    marks: Marks,
    options: &'a CompressOptions,
    data: &'a ProgramData,
    mode: &'a M,
    debug_infinite_loop: bool,
) -> impl 'a + VisitMut + Repeated
where
    M: Mode,
{
    assert!(
        options.top_retain.iter().all(|s| s.trim() != ""),
        "top_retain should not contain empty string"
    );

    let done = Mark::fresh(Mark::root());
    let done_ctxt = SyntaxContext::empty().apply_mark(done);
    Optimizer {
        marks,
        changed: false,
        options,
        prepend_stmts: Default::default(),
        append_stmts: Default::default(),
        lits: Default::default(),
        vars_for_inlining: Default::default(),
        inlined_vars: Default::default(),
        vars_for_prop_hoisting: Default::default(),
        simple_props: Default::default(),
        _simple_array_values: Default::default(),
        typeofs: Default::default(),
        data: Some(data),
        ctx: Default::default(),
        done,
        done_ctxt,
        label: Default::default(),
        mode,
        debug_infinite_loop,
    }
}

/// Syntactic context.
///
/// This should not be modified directly. Use `.with_ctx()` instead.
#[derive(Debug, Default, Clone, Copy)]
struct Ctx {
    /// See [crate::marks::Marks]
    skip_standalone: bool,

    /// `true` if the [VarDecl] has const annotation.
    has_const_ann: bool,

    in_bool_ctx: bool,

    in_asm: bool,

    is_callee: bool,
    in_call_arg: bool,

    var_kind: Option<VarDeclKind>,

    /// `true` if we are in the strict mode. This will be set to `true` for
    /// statements **after** `'use strict'`
    in_strict: bool,
    /// `true` if we are try block. `true` means we cannot be sure about control
    /// flow.
    in_try_block: bool,
    /// `true` while handling `test` of if / while / for.
    in_cond: bool,

    /// `true` if we are in `arg` of `delete arg`.
    is_delete_arg: bool,
    /// `true` if we are in `arg` of `++arg` or `--arg`.
    is_update_arg: bool,
    is_lhs_of_assign: bool,
    /// `false` for `d` in `d[0] = foo`.
    is_exact_lhs_of_assign: bool,

    /// `true` for loop bodies and conditions of loops.
    executed_multiple_time: bool,

    /// `true` while handling `expr` of `!expr`
    in_bang_arg: bool,
    in_var_decl_of_for_in_or_of_loop: bool,
    /// `true` while handling inner statements of a labelled statement.
    stmt_labelled: bool,

    dont_use_negated_iife: bool,

    /// `true` while handling top-level export decls.
    is_exported: bool,

    /// `true` while handling top level items.
    top_level: bool,

    /// `true` while we are in a function or something similar.
    in_fn_like: bool,

    in_block: bool,

    in_obj_of_non_computed_member: bool,

    in_tpl_expr: bool,

    /// True while handling callee, except an arrow expression in callee.
    is_this_aware_callee: bool,

    can_inline_arguments: bool,

    is_nested_if_return_merging: bool,

    dont_invoke_iife: bool,

    /// Current scope.
    scope: SyntaxContext,
}

impl Ctx {
    pub fn is_top_level_for_block_level_vars(self) -> bool {
        if self.top_level {
            return true;
        }

        if self.in_fn_like || self.in_block {
            return false;
        }
        true
    }

    pub fn in_top_level(self) -> bool {
        self.top_level || !self.in_fn_like
    }
}

struct Optimizer<'a, M> {
    marks: Marks,

    changed: bool,
    options: &'a CompressOptions,

    /// Statements prepended to the current statement.
    prepend_stmts: Vec<Stmt>,
    /// Statements appended to the current statement.
    append_stmts: Vec<Stmt>,

    /// Cheap to clone.
    ///
    /// Used for inlining.
    lits: AHashMap<Id, Box<Expr>>,

    vars_for_inlining: AHashMap<Id, Box<Expr>>,
    inlined_vars: AHashMap<Id, Box<Expr>>,

    vars_for_prop_hoisting: AHashMap<Id, Box<Expr>>,
    /// Used for `hoist_props`.
    simple_props: AHashMap<(Id, JsWord), Box<Expr>>,
    _simple_array_values: AHashMap<(Id, usize), Box<Expr>>,
    typeofs: AHashMap<Id, JsWord>,
    /// This information is created by analyzing identifier usages.
    ///
    /// This is calculated multiple time, but only once per one
    /// `visit_mut_module`.
    data: Option<&'a ProgramData>,
    ctx: Ctx,
    /// In future: This will be used to `mark` node as done.
    done: Mark,
    done_ctxt: SyntaxContext,

    /// Closest label.
    label: Option<Id>,

    mode: &'a M,

    debug_infinite_loop: bool,
}

impl<M> Repeated for Optimizer<'_, M> {
    fn changed(&self) -> bool {
        self.changed
    }

    fn reset(&mut self) {
        self.changed = false;
    }
}

impl<M> Optimizer<'_, M>
where
    M: Mode,
{
    fn handle_stmt_likes<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike + ModuleItemLike + ModuleItemExt + VisitMutWith<Self>,
        Vec<T>: VisitMutWith<Self> + VisitWith<UsageAnalyzer>,
    {
        match self.data {
            Some(..) => {}
            None => {
                unreachable!()
            }
        }
        let mut use_asm = false;
        let prepend_stmts = self.prepend_stmts.take();
        let append_stmts = self.append_stmts.take();

        {
            let mut child_ctx = Ctx { ..self.ctx };
            let mut directive_count = 0;

            if stmts.len() >= 1 {
                // TODO: Handle multiple directives.
                match stmts[0].as_stmt() {
                    Some(Stmt::Expr(ExprStmt { expr, .. })) => match &**expr {
                        Expr::Lit(Lit::Str(v)) => {
                            directive_count += 1;

                            if v.value == *"use strict" && !v.has_escape {
                                child_ctx.in_strict = true;
                            }

                            if v.value == *"use asm" && !v.has_escape {
                                child_ctx.in_asm = true;
                                self.ctx.in_asm = true;
                                use_asm = true;
                            }
                        }
                        _ => {}
                    },
                    _ => {}
                }
            }

            let mut new = Vec::with_capacity(stmts.len() * 11 / 10);
            for (i, mut stmt) in stmts.take().into_iter().enumerate() {
                debug_assert_eq!(self.prepend_stmts, vec![]);
                debug_assert_eq!(self.append_stmts, vec![]);

                if i < directive_count {
                    // Don't set in_strict for directive itself.
                    stmt.visit_mut_with(self);
                } else {
                    stmt.visit_mut_with(&mut *self.with_ctx(child_ctx));
                }

                new.extend(self.prepend_stmts.drain(..).map(T::from_stmt));
                new.push(stmt);
                new.extend(self.append_stmts.drain(..).map(T::from_stmt));
            }
            *stmts = new;
        }

        self.ctx.in_asm |= use_asm;

        self.reorder_stmts(stmts);

        self.merge_sequences_in_stmts(stmts);

        self.merge_similar_ifs(stmts);
        self.join_vars(stmts);

        self.make_sequences(stmts);

        self.drop_else_token(stmts);

        self.break_assignments_in_seqs(stmts);

        stmts.extend(self.append_stmts.drain(..).map(T::from_stmt));

        stmts.retain(|stmt| match stmt.as_stmt() {
            Some(Stmt::Empty(..)) => false,
            _ => true,
        });

        debug_assert_eq!(self.prepend_stmts, vec![]);
        self.prepend_stmts = prepend_stmts;
        self.append_stmts = append_stmts;
    }

    /// `a = a + 1` => `a += 1`.
    fn compress_bin_assignment_to_left(&mut self, e: &mut AssignExpr) {
        if e.op != op!("=") {
            return;
        }

        // TODO: Handle pure properties.
        let lhs = match &e.left {
            PatOrExpr::Expr(e) => match &**e {
                Expr::Ident(i) => i,
                _ => return,
            },
            PatOrExpr::Pat(p) => match &**p {
                Pat::Ident(i) => &i.id,
                _ => return,
            },
        };

        // If left operand of a binary expression is not same as lhs, this method has
        // nothing to do.
        let (op, right) = match &mut *e.right {
            Expr::Bin(BinExpr {
                left, op, right, ..
            }) => match &**left {
                Expr::Ident(r) if lhs.sym == r.sym && lhs.span.ctxt == r.span.ctxt => (op, right),
                _ => return,
            },
            _ => return,
        };

        // Don't break code for old browsers.
        match op {
            BinaryOp::LogicalOr => return,
            BinaryOp::LogicalAnd => return,
            BinaryOp::Exp => return,
            BinaryOp::NullishCoalescing => return,
            _ => {}
        }

        let op = match op {
            BinaryOp::In | BinaryOp::InstanceOf => return,

            BinaryOp::EqEq | BinaryOp::NotEq | BinaryOp::EqEqEq | BinaryOp::NotEqEq => {
                // TODO(kdy1): Check if this is optimizable.
                return;
            }

            BinaryOp::Lt | BinaryOp::LtEq | BinaryOp::Gt | BinaryOp::GtEq => return,

            BinaryOp::LShift => op!("<<="),
            BinaryOp::RShift => {
                op!(">>=")
            }
            BinaryOp::ZeroFillRShift => {
                op!(">>>=")
            }
            BinaryOp::Add => {
                op!("+=")
            }
            BinaryOp::Sub => {
                op!("-=")
            }
            BinaryOp::Mul => {
                op!("*=")
            }
            BinaryOp::Div => {
                op!("/=")
            }
            BinaryOp::Mod => {
                op!("%=")
            }
            BinaryOp::BitOr => {
                op!("|=")
            }
            BinaryOp::BitXor => {
                op!("^=")
            }
            BinaryOp::BitAnd => {
                op!("&=")
            }
            BinaryOp::LogicalOr => {
                op!("||=")
            }
            BinaryOp::LogicalAnd => {
                op!("&&=")
            }
            BinaryOp::Exp => {
                op!("**=")
            }
            BinaryOp::NullishCoalescing => {
                op!("??=")
            }
        };

        e.op = op;
        e.right = right.take();
        // Now we can compress it to an assignment
    }

    fn compress_array_join(&mut self, e: &mut Expr) {
        let call = match e {
            Expr::Call(e) => e,
            _ => return,
        };

        let callee = match &mut call.callee {
            ExprOrSuper::Super(_) => return,
            ExprOrSuper::Expr(callee) => &mut **callee,
        };

        let separator = if call.args.is_empty() {
            ",".into()
        } else if call.args.len() == 1 {
            if call.args[0].spread.is_some() {
                return;
            }

            if is_pure_undefined(&call.args[0].expr) {
                ",".into()
            } else {
                match &*call.args[0].expr {
                    Expr::Lit(Lit::Str(s)) => s.value.clone(),
                    Expr::Lit(Lit::Null(..)) => js_word!("null"),
                    _ => return,
                }
            }
        } else {
            return;
        };

        let arr = match callee {
            Expr::Member(MemberExpr {
                obj,
                prop,
                computed: false,
                ..
            }) => match obj {
                ExprOrSuper::Super(_) => return,
                ExprOrSuper::Expr(obj) => match &mut **obj {
                    Expr::Array(arr) => match &**prop {
                        Expr::Ident(i) if i.sym == *"join" => arr,
                        _ => return,
                    },
                    _ => return,
                },
            },
            _ => return,
        };

        if arr.elems.iter().any(|elem| match elem {
            Some(ExprOrSpread {
                spread: Some(..), ..
            }) => true,
            _ => false,
        }) {
            return;
        }

        let cannot_join_as_str_lit = arr
            .elems
            .iter()
            .filter_map(|v| v.as_ref())
            .any(|v| match &*v.expr {
                e if is_pure_undefined(e) => false,
                Expr::Lit(lit) => match lit {
                    Lit::Str(..) | Lit::Num(..) | Lit::Null(..) => false,
                    _ => true,
                },
                _ => true,
            });

        if cannot_join_as_str_lit {
            if !self.options.unsafe_passes {
                return;
            }

            // TODO: Partial join

            if arr
                .elems
                .iter()
                .filter_map(|v| v.as_ref())
                .any(|v| match &*v.expr {
                    e if is_pure_undefined(e) => false,
                    Expr::Lit(lit) => match lit {
                        Lit::Str(..) | Lit::Num(..) | Lit::Null(..) => false,
                        _ => true,
                    },
                    // This can change behavior if the value is `undefined` or `null`.
                    Expr::Ident(..) => false,
                    _ => true,
                })
            {
                return;
            }

            let sep = Box::new(Expr::Lit(Lit::Str(Str {
                span: DUMMY_SP,
                value: separator,
                has_escape: false,
                kind: Default::default(),
            })));
            let mut res = Expr::Lit(Lit::Str(Str {
                span: DUMMY_SP,
                value: js_word!(""),
                has_escape: false,
                kind: Default::default(),
            }));

            fn add(to: &mut Expr, right: Box<Expr>) {
                let lhs = to.take();
                *to = Expr::Bin(BinExpr {
                    span: DUMMY_SP,
                    left: Box::new(lhs),
                    op: op!(bin, "+"),
                    right,
                });
            }

            for (last, elem) in arr.elems.take().into_iter().identify_last() {
                match elem {
                    Some(ExprOrSpread { spread: None, expr }) => match &*expr {
                        e if is_pure_undefined(e) => {}
                        Expr::Lit(Lit::Null(..)) => {}
                        _ => {
                            add(&mut res, expr);
                        }
                    },
                    _ => {}
                }

                if !last {
                    add(&mut res, sep.clone());
                }
            }

            *e = res;

            return;
        }

        let mut res = String::new();
        for (last, elem) in arr.elems.iter().identify_last() {
            if let Some(elem) = elem {
                debug_assert_eq!(elem.spread, None);

                match &*elem.expr {
                    Expr::Lit(Lit::Str(s)) => {
                        res.push_str(&s.value);
                    }
                    Expr::Lit(Lit::Num(n)) => {
                        write!(res, "{}", n.value).unwrap();
                    }
                    e if is_pure_undefined(e) => {}
                    Expr::Lit(Lit::Null(..)) => {}
                    _ => {
                        unreachable!(
                            "Expression {:#?} cannot be joined and it should be filtered out",
                            elem.expr
                        )
                    }
                }
            }

            if !last {
                res.push_str(&separator);
            }
        }

        tracing::debug!("Compressing array.join()");

        self.changed = true;
        *e = Expr::Lit(Lit::Str(Str {
            span: call.span,
            value: res.into(),
            has_escape: false,
            kind: Default::default(),
        }))
    }

    ///
    /// - `undefined` => `void 0`
    fn compress_undefined(&mut self, e: &mut Expr) {
        match e {
            Expr::Ident(Ident {
                span,
                sym: js_word!("undefined"),
                ..
            }) => {
                *e = *undefined(*span);
                return;
            }
            _ => {}
        }
    }

    ///
    /// - `true` => `!1`
    /// - `false` => `!0`
    fn compress_lits(&mut self, e: &mut Expr) {
        let lit = match e {
            Expr::Lit(lit) => lit,
            _ => return,
        };

        if self.options.bools_as_ints || self.options.bools {
            match lit {
                Lit::Bool(v) => {
                    self.changed = true;
                    tracing::debug!("Compressing boolean literal");
                    *e = Expr::Unary(UnaryExpr {
                        span: v.span,
                        op: op!("!"),
                        arg: Box::new(Expr::Lit(Lit::Num(Number {
                            span: v.span,
                            value: if v.value { 0.0 } else { 1.0 },
                        }))),
                    });
                }
                _ => {}
            }
        }
    }

    fn remove_invalid(&mut self, e: &mut Expr) {
        match e {
            Expr::Bin(BinExpr { left, right, .. }) => {
                self.remove_invalid(left);
                self.remove_invalid(right);

                if left.is_invalid() {
                    *e = *right.take();
                    self.remove_invalid(e);
                    return;
                } else if right.is_invalid() {
                    *e = *left.take();
                    self.remove_invalid(e);
                    return;
                }
            }
            _ => {}
        }
    }

    /// Returns [None] if expression is side-effect-free.
    /// If an expression has a side effect, only side effects are returned.
    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, e)))]
    fn ignore_return_value(&mut self, e: &mut Expr) -> Option<Expr> {
        self.optimize_bang_within_logical_ops(e, true);

        self.compress_cond_to_logical_ignoring_return_value(e);

        match e {
            Expr::Ident(..) | Expr::This(_) | Expr::Invalid(_) | Expr::Lit(..) => {
                if cfg!(feature = "debug") {
                    tracing::debug!(
                        "ignore_return_value: Dropping unused expr: {}",
                        dump(&*e, false)
                    );
                }
                self.changed = true;
                return None;
            }

            Expr::Tpl(t) if t.exprs.is_empty() => {
                if cfg!(feature = "debug") {
                    tracing::debug!("ignore_return_value: Dropping tpl expr without expr");
                }
                self.changed = true;
                return None;
            }

            // Function expression cannot have a side effect.
            Expr::Fn(_) => {
                tracing::debug!(
                    "ignore_return_value: Dropping unused fn expr as it does not have any side \
                     effect"
                );
                self.changed = true;
                return None;
            }

            Expr::Class(cls) => {
                let mut exprs = vec![];
                exprs.extend(
                    cls.class
                        .super_class
                        .as_mut()
                        .and_then(|e| self.ignore_return_value(e))
                        .map(Box::new),
                );

                for member in &mut cls.class.body {
                    match member {
                        ClassMember::Method(ClassMethod { key, .. }) => match key {
                            PropName::Computed(key) => {
                                exprs.extend(self.ignore_return_value(&mut key.expr).map(Box::new));
                            }
                            _ => {}
                        },
                        ClassMember::ClassProp(ClassProp {
                            key,
                            is_static,
                            value,
                            ..
                        }) => {
                            if let PropName::Computed(key) = key {
                                exprs.extend(
                                    self.ignore_return_value(key.expr.as_mut()).map(Box::new),
                                );
                            }

                            if *is_static {
                                if let Some(v) = value {
                                    exprs.extend(self.ignore_return_value(v).map(Box::new));
                                }
                            }
                        }

                        _ => {}
                    }
                }

                if exprs.is_empty() {
                    return None;
                }

                return Some(Expr::Seq(SeqExpr {
                    span: cls.class.span,
                    exprs,
                }));
            }

            Expr::Paren(e) => return self.ignore_return_value(&mut e.expr),

            Expr::Bin(BinExpr {
                op: op!("&&") | op!("||"),
                left,
                right,
                ..
            }) => {
                let ctx = Ctx {
                    dont_use_negated_iife: self.ctx.dont_use_negated_iife
                        || self.options.side_effects,
                    ..self.ctx
                };
                let new_r = self.with_ctx(ctx).ignore_return_value(right);

                match new_r {
                    Some(r) => {
                        *right = Box::new(r);
                    }
                    None => return self.ignore_return_value(left),
                }

                return Some(e.take());
            }

            Expr::Unary(UnaryExpr {
                op: op!("delete"), ..
            }) => return Some(e.take()),

            Expr::Unary(UnaryExpr {
                op: op!("void"), ..
            }) if !self.options.unused => return Some(e.take()),

            // We optimize binary expressions if operation is side-effect-free and lhs and rhs is
            // evaluated regardless of value of lhs.
            //
            // Div is excluded because of zero.
            // TODO: Handle
            Expr::Bin(BinExpr {
                op:
                    BinaryOp::EqEq
                    | BinaryOp::NotEq
                    | BinaryOp::EqEqEq
                    | BinaryOp::NotEqEq
                    | BinaryOp::Lt
                    | BinaryOp::LtEq
                    | BinaryOp::Gt
                    | BinaryOp::GtEq
                    | BinaryOp::LShift
                    | BinaryOp::RShift
                    | BinaryOp::ZeroFillRShift
                    | BinaryOp::Add
                    | BinaryOp::Sub
                    | BinaryOp::Mul
                    | BinaryOp::Div
                    | BinaryOp::Mod
                    | BinaryOp::BitOr
                    | BinaryOp::BitXor
                    | BinaryOp::BitAnd
                    | BinaryOp::In
                    | BinaryOp::InstanceOf
                    | BinaryOp::Exp,
                ..
            }) => return Some(e.take()),

            // Pure calls can be removed
            Expr::Call(CallExpr {
                callee: ExprOrSuper::Expr(callee),
                args,
                ..
            }) if match &**callee {
                Expr::Fn(f) => f
                    .function
                    .body
                    .as_ref()
                    .map(|body| body.stmts.is_empty())
                    .unwrap_or(false),
                Expr::Arrow(f) => match &f.body {
                    BlockStmtOrExpr::BlockStmt(body) => body.stmts.is_empty(),
                    BlockStmtOrExpr::Expr(_) => false,
                },
                _ => false,
            } && args.is_empty() =>
            {
                tracing::debug!("ignore_return_value: Dropping a pure call");
                self.changed = true;
                return None;
            }

            Expr::Call(CallExpr {
                callee: ExprOrSuper::Expr(callee),
                args,
                ..
            }) => {
                match &mut **callee {
                    Expr::Fn(FnExpr {
                        ident: None,
                        function,
                    }) => {
                        if args.is_empty() {
                            for param in &mut function.params {
                                self.drop_unused_param(&mut param.pat, true);
                            }

                            function.params.retain(|p| !p.pat.is_invalid());
                        }
                    }
                    _ => {}
                }

                if args.is_empty() {
                    match &mut **callee {
                        Expr::Fn(f) => {
                            if f.function.body.is_none()
                                || f.function.body.as_ref().unwrap().is_empty()
                            {
                                return None;
                            }
                        }
                        _ => {}
                    }
                }

                return Some(e.take());
            }

            Expr::MetaProp(_)
            | Expr::Await(_)
            | Expr::New(..)
            | Expr::Call(..)
            | Expr::Yield(_)
            | Expr::Assign(_)
            | Expr::PrivateName(_)
            | Expr::Update(_) => return Some(e.take()),

            // We drop `f.g` in
            //
            // function f() {
            //      return f.g, 1
            // }
            Expr::Member(MemberExpr {
                obj: ExprOrSuper::Expr(obj),
                computed: false,
                ..
            }) if self.options.top_level() || !self.ctx.in_top_level() => match &**obj {
                Expr::Ident(obj) => {
                    if let Some(usage) = self
                        .data
                        .as_ref()
                        .and_then(|data| data.vars.get(&obj.to_id()))
                    {
                        if !usage.declared_as_fn_param && usage.var_kind.is_none() {
                            return None;
                        }

                        if !usage.reassigned && usage.no_side_effect_for_member_access {
                            return None;
                        }
                    }
                }
                _ => {}
            },

            // TODO: Check if it is a pure property access.
            Expr::Member(_) => return Some(e.take()),

            // Not supported. (At least at the moment)
            Expr::JSXMember(_)
            | Expr::JSXNamespacedName(_)
            | Expr::JSXEmpty(_)
            | Expr::JSXElement(_)
            | Expr::JSXFragment(_)
            | Expr::TsTypeAssertion(_)
            | Expr::TsConstAssertion(_)
            | Expr::TsNonNull(_)
            | Expr::TsAs(_) => return Some(e.take()),

            Expr::Array(arr) => {
                let mut exprs = vec![];
                self.changed = true;
                tracing::debug!("ignore_return_value: Inverting an array literal");
                for elem in arr.elems.take() {
                    match elem {
                        Some(mut elem) => {
                            exprs.extend(self.ignore_return_value(&mut elem.expr).map(Box::new));
                        }
                        None => {}
                    }
                }

                if exprs.is_empty() {
                    return None;
                }

                return Some(Expr::Seq(SeqExpr {
                    span: arr.span,
                    exprs,
                }));
            }

            Expr::Object(obj) => {
                let mut exprs = vec![];
                self.changed = true;
                tracing::debug!("ignore_return_value: Inverting an object literal");
                for prop in obj.props.take() {
                    match prop {
                        PropOrSpread::Spread(mut e) => {
                            exprs.extend(self.ignore_return_value(&mut e.expr).map(Box::new));
                        }
                        PropOrSpread::Prop(prop) => match *prop {
                            Prop::KeyValue(KeyValueProp { key, mut value, .. }) => {
                                match key {
                                    PropName::Ident(_) => {}
                                    PropName::Str(_) => {}
                                    PropName::Num(_) => {}
                                    PropName::Computed(mut key) => {
                                        exprs.extend(
                                            self.ignore_return_value(&mut key.expr).map(Box::new),
                                        );
                                    }
                                    PropName::BigInt(_) => {}
                                }

                                exprs.extend(self.ignore_return_value(&mut value).map(Box::new));
                            }
                            Prop::Getter(GetterProp { key, .. })
                            | Prop::Setter(SetterProp { key, .. })
                            | Prop::Method(MethodProp { key, .. }) => match key {
                                PropName::Ident(_) => {}
                                PropName::Str(_) => {}
                                PropName::Num(_) => {}
                                PropName::Computed(mut key) => {
                                    exprs.extend(
                                        self.ignore_return_value(&mut key.expr).map(Box::new),
                                    );
                                }
                                PropName::BigInt(_) => {}
                            },

                            Prop::Shorthand(_) | Prop::Assign(..) => {}
                        },
                    }
                }

                if exprs.is_empty() {
                    return None;
                }

                return Some(Expr::Seq(SeqExpr {
                    span: obj.span,
                    exprs,
                }));
            }

            // Preserves negated iife
            Expr::Unary(UnaryExpr {
                op: op!("!"), arg, ..
            }) if (self.options.negate_iife
                || self.options.reduce_vars
                || self.options.side_effects)
                && !self.ctx.dont_use_negated_iife
                && match &**arg {
                    Expr::Call(arg) => match &arg.callee {
                        ExprOrSuper::Expr(callee) => match &**callee {
                            Expr::Fn(..) => true,
                            _ => false,
                        },
                        _ => false,
                    },
                    _ => false,
                } =>
            {
                let processed_arg = self.ignore_return_value(&mut **arg);

                if processed_arg.is_none() {
                    return None;
                }
                *arg = Box::new(processed_arg.unwrap());

                tracing::trace!("ignore_return_value: Preserving negated iife");
                return Some(e.take());
            }

            // `delete` is handled above
            Expr::Unary(expr) => {
                self.changed = true;
                tracing::debug!("ignore_return_value: Reducing unary ({})", expr.op);
                return self.ignore_return_value(&mut expr.arg);
            }

            Expr::Bin(BinExpr {
                span,
                left,
                right,
                op,
                ..
            }) => {
                tracing::debug!("ignore_return_value: Reducing binary ({})", *op);

                let left = self.ignore_return_value(&mut **left).map(Box::new);
                let right = self.ignore_return_value(&mut **right).map(Box::new);

                let mut seq = Expr::Seq(SeqExpr {
                    span: *span,
                    exprs: left.into_iter().chain(right).collect(),
                });
                return self.ignore_return_value(&mut seq);
            }

            Expr::Cond(cond) => {
                tracing::trace!("ignore_return_value: Cond expr");

                self.restore_negated_iife(cond);

                let ctx = Ctx {
                    dont_use_negated_iife: self.ctx.dont_use_negated_iife
                        || self.options.side_effects,
                    ..self.ctx
                };

                let cons_span = cond.cons.span();
                let alt_span = cond.alt.span();
                let cons = self
                    .with_ctx(ctx)
                    .ignore_return_value(&mut cond.cons)
                    .map(Box::new);
                let alt = self
                    .with_ctx(ctx)
                    .ignore_return_value(&mut cond.alt)
                    .map(Box::new);

                // TODO: Remove if test is side effect free.

                return Some(Expr::Cond(CondExpr {
                    span: cond.span,
                    test: cond.test.take(),
                    cons: cons.unwrap_or_else(|| {
                        tracing::debug!("ignore_return_value: Dropped `cons`");
                        self.changed = true;
                        undefined(cons_span)
                    }),
                    alt: alt.unwrap_or_else(|| {
                        tracing::debug!("ignore_return_value: Dropped `alt`");
                        self.changed = true;
                        undefined(alt_span)
                    }),
                }));
            }

            Expr::Seq(seq) => {
                if seq.exprs.is_empty() {
                    return None;
                }
                //
                let mut exprs = seq
                    .exprs
                    .iter_mut()
                    .enumerate()
                    .filter_map(|(idx, expr)| {
                        let is_injected_zero = match &**expr {
                            Expr::Lit(Lit::Num(v)) => v.span.is_dummy(),
                            _ => false,
                        };

                        if idx == 0 && self.ctx.is_this_aware_callee && is_injected_zero {
                            return Some(*expr.take());
                        }
                        let ctx = Ctx {
                            dont_use_negated_iife: idx != 0,
                            ..self.ctx
                        };
                        self.with_ctx(ctx).ignore_return_value(&mut **expr)
                    })
                    .map(Box::new)
                    .collect::<Vec<_>>();
                if exprs.len() <= 1 {
                    return exprs.pop().map(|v| *v);
                } else {
                    let is_last_undefined = is_pure_undefined(&exprs.last().unwrap());

                    // (foo(), void 0) => void foo()
                    if is_last_undefined {
                        self.changed = true;
                        // Remove `void 0`
                        exprs.pop();

                        // Make return type undefined.
                        if let Some(last) = exprs.last_mut() {
                            tracing::debug!("ignore_return_value: Shifting void");
                            self.changed = true;
                            *last = Box::new(Expr::Unary(UnaryExpr {
                                span: DUMMY_SP,
                                op: op!("void"),
                                arg: last.take(),
                            }));
                        }
                    }

                    if exprs.is_empty() {
                        tracing::debug!("ignore_return_value: Dropping empty seq");
                        return None;
                    }

                    return Some(Expr::Seq(SeqExpr {
                        span: seq.span,
                        exprs,
                    }));
                }
            }

            _ => {}
        }

        Some(e.take())
    }

    /// `new RegExp("([Sap]+)", "ig")` => `/([Sap]+)/gi`
    fn compress_regexp(&mut self, e: &mut Expr) {
        let span = e.span();
        let args = match e {
            Expr::New(NewExpr { callee, args, .. }) => match &**callee {
                Expr::Ident(Ident {
                    sym: js_word!("RegExp"),
                    ..
                }) => args,
                _ => return,
            },
            _ => return,
        };

        let args = match args {
            Some(v) => v,
            None => return,
        };
        if args.is_empty() || args.len() > 2 {
            return;
        }

        // We aborts the method if arguments are not literals.
        if args.iter().any(|v| {
            v.spread.is_some()
                || match &*v.expr {
                    Expr::Lit(Lit::Str(s)) => {
                        if s.value.contains(|c: char| {
                            // whitelist
                            !c.is_ascii_alphanumeric()
                                && match c {
                                    '%' | '[' | ']' | '(' | ')' | '{' | '}' | '-' | '+' => false,
                                    _ => true,
                                }
                        }) {
                            return true;
                        }
                        if s.value.contains("\\\0") || s.value.contains("/") {
                            return true;
                        }

                        false
                    }
                    _ => true,
                }
        }) {
            return;
        }

        //
        let pattern = args[0].expr.take();

        let pattern = match *pattern {
            Expr::Lit(Lit::Str(s)) => s.value.clone(),
            _ => {
                unreachable!()
            }
        };

        let flags = args
            .get_mut(1)
            .map(|v| v.expr.take())
            .map(|v| match *v {
                Expr::Lit(Lit::Str(s)) => {
                    assert!(s.value.is_ascii());

                    let s = s.value.to_string();
                    let mut bytes = s.into_bytes();
                    bytes.sort();

                    String::from_utf8(bytes).unwrap().into()
                }
                _ => {
                    unreachable!()
                }
            })
            .unwrap_or(js_word!(""));

        tracing::debug!("Converting call to RegExp into a regexp literal");
        self.changed = true;
        *e = Expr::Lit(Lit::Regex(Regex {
            span,
            exp: pattern,
            flags,
        }))
    }

    ///
    /// - `a ? true : false` => `!!a`
    fn compress_useless_cond_expr(&mut self, expr: &mut Expr) {
        let cond = match expr {
            Expr::Cond(c) => c,
            _ => return,
        };

        let lt = cond.cons.get_type();
        let rt = cond.alt.get_type();
        match (lt, rt) {
            (Known(Type::Bool), Known(Type::Bool)) => {}
            _ => return,
        }

        let lb = cond.cons.as_pure_bool();
        let rb = cond.alt.as_pure_bool();

        let lb = match lb {
            Value::Known(v) => v,
            Value::Unknown => return,
        };
        let rb = match rb {
            Value::Known(v) => v,
            Value::Unknown => return,
        };

        // `cond ? true : false` => !!cond
        if lb && !rb {
            self.negate(&mut cond.test);
            self.negate(&mut cond.test);
            *expr = *cond.test.take();
            return;
        }

        // `cond ? false : true` => !cond
        if !lb && rb {
            self.negate(&mut cond.test);
            *expr = *cond.test.take();
            return;
        }
    }

    fn merge_var_decls(&mut self, stmts: &mut Vec<Stmt>) {
        if !self.options.join_vars && !self.options.hoist_vars {
            return;
        }

        // Merge var declarations fully, if possible.
        if stmts.windows(2).any(|stmts| match (&stmts[0], &stmts[1]) {
            (Stmt::Decl(Decl::Var(a)), Stmt::Decl(Decl::Var(b))) => {
                a.kind == b.kind && !contains_leaping_yield(a) && !contains_leaping_yield(b)
            }
            _ => false,
        }) {
            self.changed = true;

            if cfg!(feature = "debug") {
                tracing::debug!("Merging variable declarations");
                tracing::trace!(
                    "[Before]: {}",
                    dump(
                        &BlockStmt {
                            span: DUMMY_SP,
                            stmts: stmts.clone()
                        },
                        false
                    )
                )
            }

            let orig = take(stmts);
            let mut new = Vec::with_capacity(orig.len());

            let mut var_decl: Option<VarDecl> = None;

            for stmt in orig {
                match stmt {
                    Stmt::Decl(Decl::Var(below)) => {
                        //
                        match var_decl.take() {
                            Some(mut upper) if upper.kind == below.kind => {
                                upper.decls.extend(below.decls);
                                var_decl = Some(upper);
                            }
                            d => {
                                new.extend(d.map(Decl::Var).map(Stmt::Decl));
                                var_decl = Some(below);
                            }
                        }
                    }
                    _ => {
                        // If it's not a var decl,

                        new.extend(var_decl.take().map(Decl::Var).map(Stmt::Decl));
                        new.push(stmt);
                    }
                }
            }

            new.extend(var_decl.take().map(Decl::Var).map(Stmt::Decl));

            if cfg!(feature = "debug") {
                tracing::trace!(
                    "[Change] merged: {}",
                    dump(
                        &BlockStmt {
                            span: DUMMY_SP,
                            stmts: new.clone()
                        },
                        false
                    )
                )
            }
            *stmts = new
        }
    }

    fn try_removing_block(&mut self, s: &mut Stmt, unwrap_more: bool) {
        match s {
            Stmt::Block(bs) => {
                if bs.stmts.len() == 0 {
                    *s = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                    return;
                }

                // Remove nested blocks
                if bs.stmts.len() == 1 {
                    if let Stmt::Block(block) = &mut bs.stmts[0] {
                        if block.stmts.iter().all(|stmt| match stmt {
                            Stmt::Decl(..) => false,
                            _ => true,
                        }) {
                            tracing::debug!("optimizer: Removing nested block");
                            self.changed = true;
                            bs.stmts = block.stmts.take();
                        }
                    }
                }

                // Unwrap a block with only `var`s.
                //
                // TODO: Support multiple statements.
                if bs.stmts.len() == 1
                    && bs.stmts.iter().all(|stmt| match stmt {
                        Stmt::Decl(Decl::Var(VarDecl {
                            kind: VarDeclKind::Var,
                            ..
                        })) => true,
                        _ => false,
                    })
                {
                    tracing::debug!("optimizer: Unwrapping a block with variable statements");
                    self.changed = true;
                    *s = bs.stmts[0].take();
                    return;
                }

                for stmt in &mut bs.stmts {
                    if let Stmt::Block(block) = &stmt {
                        if block.stmts.is_empty() {
                            self.changed = true;
                            tracing::debug!("optimizer: Removing empty block");
                            *stmt = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                        }
                    }
                }

                if unwrap_more && bs.stmts.len() == 1 {
                    match &bs.stmts[0] {
                        Stmt::Expr(..) | Stmt::If(..) => {
                            *s = bs.stmts[0].take();
                            tracing::debug!("optimizer: Unwrapping block stmt");
                            self.changed = true;
                        }
                        Stmt::Decl(Decl::Fn(..)) if !self.ctx.in_strict => {
                            *s = bs.stmts[0].take();
                            tracing::debug!("optimizer: Unwrapping block stmt in non strcit mode");
                            self.changed = true;
                        }
                        _ => {}
                    }
                }
            }

            Stmt::If(s) => {
                self.try_removing_block(&mut s.cons, true);
                let can_remove_block_of_alt = match &*s.cons {
                    Stmt::Expr(..) | Stmt::If(..) => true,
                    Stmt::Block(bs) if bs.stmts.len() == 1 => match &bs.stmts[0] {
                        Stmt::For(..) => true,
                        _ => false,
                    },
                    _ => false,
                };
                if can_remove_block_of_alt {
                    if let Some(alt) = &mut s.alt {
                        self.try_removing_block(alt, true);
                    }
                }
            }

            Stmt::ForIn(s) => {
                self.try_removing_block(&mut s.body, true);
            }

            Stmt::For(s) => {
                self.try_removing_block(&mut s.body, true);
            }

            Stmt::ForOf(s) => {
                self.try_removing_block(&mut s.body, true);
            }

            _ => {}
        }

        if !self.options.conditionals
            && !self.options.sequences()
            && !self.options.join_vars
            && !self.options.unused
        {
            return;
        }

        match s {
            Stmt::Block(block) if block.stmts.is_empty() => {
                *s = Stmt::Empty(EmptyStmt { span: block.span });
            }
            Stmt::Block(block)
                if block.stmts.len() == 1 && is_fine_for_if_cons(&block.stmts[0]) =>
            {
                *s = block.stmts.take().into_iter().next().unwrap();
            }
            _ => {}
        }
    }

    fn compress_if_without_alt(&mut self, s: &mut Stmt) {
        if !self.options.conditionals {
            return;
        }

        let stmt = match s {
            Stmt::If(v) => v,
            _ => return,
        };

        if stmt.alt.is_none() {
            match &mut *stmt.cons {
                Stmt::Expr(cons) => {
                    self.changed = true;
                    tracing::debug!("Converting if statement to a form `test && cons`");
                    *s = Stmt::Expr(ExprStmt {
                        span: stmt.span,
                        expr: Box::new(stmt.test.take().make_bin(op!("&&"), *cons.expr.take())),
                    });
                    return;
                }
                _ => {}
            }
        }
    }
}

impl<M> VisitMut for Optimizer<'_, M>
where
    M: Mode,
{
    noop_visit_mut_type!();

    fn visit_mut_arrow_expr(&mut self, n: &mut ArrowExpr) {
        let prepend = self.prepend_stmts.take();

        let ctx = Ctx {
            can_inline_arguments: true,
            ..self.ctx
        };

        n.visit_mut_children_with(&mut *self.with_ctx(ctx));

        if !self.prepend_stmts.is_empty() {
            let mut stmts = self.prepend_stmts.take();
            match &mut n.body {
                BlockStmtOrExpr::BlockStmt(v) => {
                    prepend_stmts(&mut v.stmts, stmts.into_iter());
                }
                BlockStmtOrExpr::Expr(v) => {
                    self.changed = true;
                    if cfg!(feature = "debug") {
                        tracing::debug!("Converting a body of an arrow expression to BlockStmt");
                    }
                    stmts.push(Stmt::Return(ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(v.take()),
                    }));
                    n.body = BlockStmtOrExpr::BlockStmt(BlockStmt {
                        span: DUMMY_SP,
                        stmts,
                    });
                }
            }
        }

        self.prepend_stmts = prepend;
    }

    fn visit_mut_assign_expr(&mut self, e: &mut AssignExpr) {
        {
            let ctx = Ctx {
                is_lhs_of_assign: true,
                is_exact_lhs_of_assign: true,
                ..self.ctx
            };
            e.left.visit_mut_with(&mut *self.with_ctx(ctx));

            if is_left_access_to_arguments(&e.left) {
                // self.ctx.can_inline_arguments = false;
            }
        }
        e.right.visit_mut_with(self);

        self.compress_bin_assignment_to_left(e);
        self.compress_bin_assignment_to_right(e);
    }

    fn visit_mut_assign_pat_prop(&mut self, n: &mut AssignPatProp) {
        n.visit_mut_children_with(self);

        match &n.value {
            Some(value) => {
                if is_pure_undefined(&value) {
                    n.value = None;
                }
            }
            _ => {}
        }
    }

    fn visit_mut_bin_expr(&mut self, n: &mut BinExpr) {
        {
            let ctx = Ctx {
                in_cond: self.ctx.in_cond
                    || match n.op {
                        op!("&&") | op!("||") | op!("??") => true,
                        _ => false,
                    },
                ..self.ctx
            };

            n.visit_mut_children_with(&mut *self.with_ctx(ctx));
        }

        self.compress_typeof_undefined(n);

        self.optimize_bin_operator(n);

        self.optimize_bin_and_or(n);

        if n.op == op!(bin, "+") {
            if let Known(Type::Str) = n.left.get_type() {
                self.optimize_expr_in_str_ctx(&mut n.right);
            }

            if let Known(Type::Str) = n.right.get_type() {
                self.optimize_expr_in_str_ctx(&mut n.left);
            }
        }
    }

    fn visit_mut_block_stmt(&mut self, n: &mut BlockStmt) {
        let ctx = Ctx {
            stmt_labelled: false,
            top_level: false,
            in_block: true,
            scope: n.span.ctxt,
            ..self.ctx
        };
        n.visit_mut_children_with(&mut *self.with_ctx(ctx));
    }

    fn visit_mut_block_stmt_or_expr(&mut self, n: &mut BlockStmtOrExpr) {
        n.visit_mut_children_with(self);

        match n {
            BlockStmtOrExpr::BlockStmt(n) => {
                self.merge_if_returns(&mut n.stmts, false, true);
                self.drop_else_token(&mut n.stmts);
            }
            BlockStmtOrExpr::Expr(_) => {}
        }
    }

    fn visit_mut_call_expr(&mut self, e: &mut CallExpr) {
        let is_this_undefined = match &e.callee {
            ExprOrSuper::Super(_) => false,
            ExprOrSuper::Expr(e) => e.is_ident(),
        };
        {
            let ctx = Ctx {
                is_callee: true,
                is_this_aware_callee: is_this_undefined
                    || match &e.callee {
                        ExprOrSuper::Super(_) => false,
                        ExprOrSuper::Expr(callee) => is_callee_this_aware(&callee),
                    },
                ..self.ctx
            };
            e.callee.visit_mut_with(&mut *self.with_ctx(ctx));
        }

        if is_this_undefined {
            match &mut e.callee {
                ExprOrSuper::Expr(callee) => match &mut **callee {
                    Expr::Member(..) => {
                        let zero = Box::new(Expr::Lit(Lit::Num(Number {
                            span: DUMMY_SP,
                            value: 0.0,
                        })));
                        self.changed = true;
                        tracing::debug!("injecting zero to preserve `this` in call");

                        *callee = Box::new(Expr::Seq(SeqExpr {
                            span: callee.span(),
                            exprs: vec![zero, callee.take()],
                        }));
                    }
                    _ => {}
                },
                _ => {}
            }
        }

        {
            let ctx = Ctx {
                in_call_arg: true,
                is_this_aware_callee: false,
                ..self.ctx
            };
            // TODO: Prevent inline if callee is unknown.
            e.args.visit_mut_with(&mut *self.with_ctx(ctx));
        }

        self.inline_args_of_iife(e);
    }

    fn visit_mut_class(&mut self, n: &mut Class) {
        n.decorators.visit_mut_with(self);

        {
            let ctx = Ctx {
                dont_invoke_iife: true,
                ..self.ctx
            };
            n.super_class.visit_mut_with(&mut *self.with_ctx(ctx));
        }

        {
            let ctx = Ctx {
                in_strict: true,
                ..self.ctx
            };
            n.body.visit_mut_with(&mut *self.with_ctx(ctx));
        }
    }

    fn visit_mut_class_expr(&mut self, e: &mut ClassExpr) {
        if !self.options.keep_classnames {
            self.remove_name_if_not_used(&mut e.ident);
        }

        e.visit_mut_children_with(self);
    }

    fn visit_mut_decl(&mut self, decl: &mut Decl) {
        decl.visit_mut_children_with(self);

        self.drop_unused_decl(decl);
        self.store_typeofs(decl);
        self.store_decl_for_inlining(decl);
    }

    fn visit_mut_default_decl(&mut self, n: &mut DefaultDecl) {
        match n {
            DefaultDecl::Class(_) => {}
            DefaultDecl::Fn(f) => {
                if !self.options.keep_fargs && self.options.evaluate && self.options.unused {
                    self.drop_unused_params(&mut f.function.params);
                }
            }
            DefaultDecl::TsInterfaceDecl(_) => {}
        }

        n.visit_mut_children_with(self);
    }

    fn visit_mut_export_decl(&mut self, n: &mut ExportDecl) {
        match &mut n.decl {
            Decl::Fn(f) => {
                // I don't know why, but terser removes parameters from an exported function if
                // `unused` is true, regardless of keep_fargs or others.
                if self.options.unused {
                    self.drop_unused_params(&mut f.function.params);
                }
            }
            _ => {}
        }

        let ctx = Ctx {
            is_exported: true,
            ..self.ctx
        };
        n.visit_mut_children_with(&mut *self.with_ctx(ctx));
    }

    fn visit_mut_export_default_decl(&mut self, n: &mut ExportDefaultDecl) {
        let ctx = Ctx {
            is_exported: true,
            ..self.ctx
        };
        n.visit_mut_children_with(&mut *self.with_ctx(ctx));
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        let ctx = Ctx {
            is_exported: false,
            ..self.ctx
        };
        e.visit_mut_children_with(&mut *self.with_ctx(ctx));

        match e {
            Expr::Seq(seq) if seq.exprs.len() == 1 => {
                *e = *seq.exprs[0].take();
            }

            _ => {}
        }

        self.remove_invalid(e);

        self.optimize_str_access_to_arguments(e);

        self.replace_props(e);

        self.drop_unused_assignments(e);

        self.compress_regexp(e);

        self.compress_lits(e);

        self.compress_typeofs(e);

        self.optimize_nullish_coalescing(e);

        self.compress_logical_exprs_as_bang_bang(e, false);

        self.compress_useless_cond_expr(e);

        self.inline(e);

        match e {
            Expr::Bin(bin) => {
                let expr = self.optimize_lit_cmp(bin);
                if let Some(expr) = expr {
                    tracing::debug!("Optimizing: Literal comparison");
                    self.changed = true;
                    *e = expr;
                }
            }
            _ => {}
        }

        self.compress_cond_expr_if_similar(e);

        self.compress_negated_bin_eq(e);
        self.compress_array_join(e);

        if self.options.negate_iife {
            self.negate_iife_in_cond(e);
        }

        self.collapse_assignment_to_vars(e);

        self.evaluate(e);

        self.invoke_iife(e);

        self.optimize_bangbang(e);

        match e {
            Expr::Seq(s) if s.exprs.is_empty() => {
                e.take();
            }
            _ => {}
        }
    }

    fn visit_mut_expr_stmt(&mut self, n: &mut ExprStmt) {
        n.visit_mut_children_with(self);

        let mut need_ignore_return_value = false;

        // If negate_iife is true, it's already handled by
        // visit_mut_children_with(self) above.
        if !self.options.negate_iife {
            // I(kdy1) don't know why this check if required, but there are two test cases
            // with `options.expressions` as only difference.
            if !self.options.expr {
                need_ignore_return_value |= self.negate_iife_in_cond(&mut n.expr);
            }
        }

        self.negate_iife_ignoring_ret(&mut n.expr);

        let is_directive = match &*n.expr {
            Expr::Lit(Lit::Str(..)) => true,
            _ => false,
        };

        if is_directive {
            return;
        }

        if need_ignore_return_value
            || self.options.unused
            || self.options.side_effects
            || self.options.reduce_fns
            || (self.options.sequences() && n.expr.is_seq())
            || (self.options.conditionals
                && match &*n.expr {
                    Expr::Bin(BinExpr {
                        op: op!("||") | op!("&&"),
                        ..
                    }) => true,
                    _ => false,
                })
        {
            // Preserve top-level negated iifes.
            match &*n.expr {
                Expr::Unary(unary @ UnaryExpr { op: op!("!"), .. }) => match &*unary.arg {
                    Expr::Call(CallExpr {
                        callee: ExprOrSuper::Expr(callee),
                        ..
                    }) => match &**callee {
                        Expr::Fn(..) => return,
                        _ => {}
                    },

                    _ => {}
                },
                _ => {}
            }
            let expr = self.ignore_return_value(&mut n.expr);
            n.expr = expr.map(Box::new).unwrap_or_else(|| {
                if cfg!(feature = "debug") {
                    tracing::debug!("visit_mut_expr_stmt: Dropped an expression statement");
                }
                undefined(DUMMY_SP)
            });
        } else {
            match &mut *n.expr {
                Expr::Seq(e) => {
                    // Non-last items are handled by visit_mut_seq_expr
                    if let Some(e) = e.exprs.last_mut() {
                        self.optimize_bang_within_logical_ops(e, true);
                    }
                }
                _ => {
                    self.optimize_bang_within_logical_ops(&mut *n.expr, true);
                }
            }
        }

        if cfg!(feature = "debug") && cfg!(debug_assertions) {
            n.visit_with(&mut AssertValid);
        }
    }

    fn visit_mut_fn_decl(&mut self, f: &mut FnDecl) {
        if !self.options.keep_fargs && self.options.evaluate && self.options.unused {
            self.drop_unused_params(&mut f.function.params);
        }

        let ctx = Ctx { ..self.ctx };
        f.visit_mut_children_with(&mut *self.with_ctx(ctx));
    }

    fn visit_mut_fn_expr(&mut self, e: &mut FnExpr) {
        if !self.options.keep_fnames {
            self.remove_name_if_not_used(&mut e.ident);
        }

        e.visit_mut_children_with(self);
    }

    fn visit_mut_for_in_stmt(&mut self, n: &mut ForInStmt) {
        n.right.visit_mut_with(self);

        let ctx = Ctx {
            in_var_decl_of_for_in_or_of_loop: true,
            ..self.ctx
        };
        n.left.visit_mut_with(&mut *self.with_ctx(ctx));

        n.body.visit_mut_with(self);
    }

    fn visit_mut_for_of_stmt(&mut self, n: &mut ForOfStmt) {
        n.right.visit_mut_with(self);

        let ctx = Ctx {
            in_var_decl_of_for_in_or_of_loop: true,
            ..self.ctx
        };
        n.left.visit_mut_with(&mut *self.with_ctx(ctx));

        n.body.visit_mut_with(self);
    }

    fn visit_mut_for_stmt(&mut self, s: &mut ForStmt) {
        let ctx = Ctx {
            executed_multiple_time: true,
            ..self.ctx
        };

        s.visit_mut_children_with(&mut *self.with_ctx(ctx));

        self.with_ctx(ctx).optimize_init_of_for_stmt(s);

        self.with_ctx(ctx).drop_if_break(s);
    }

    fn visit_mut_function(&mut self, n: &mut Function) {
        {
            let ctx = Ctx {
                stmt_labelled: false,
                ..self.ctx
            };
            n.decorators.visit_mut_with(&mut *self.with_ctx(ctx));
        }

        let is_standalone = n.span.has_mark(self.marks.standalone);

        // We don't dig into standalone function, as it does not share any variable with
        // outer scope.
        if self.ctx.skip_standalone && is_standalone {
            return;
        }

        let old_in_asm = self.ctx.in_asm;

        {
            let ctx = Ctx {
                skip_standalone: self.ctx.skip_standalone || is_standalone,
                stmt_labelled: false,
                in_fn_like: true,
                scope: n.span.ctxt,
                can_inline_arguments: true,
                ..self.ctx
            };
            let optimizer = &mut *self.with_ctx(ctx);

            n.params.visit_mut_with(optimizer);
            match n.body.as_mut() {
                Some(body) => {
                    // Bypass block scope handler.
                    body.visit_mut_children_with(optimizer);
                }
                None => {}
            }
        }

        if let Some(body) = &mut n.body {
            self.merge_if_returns(&mut body.stmts, false, true);
            self.drop_else_token(&mut body.stmts);
        }

        {
            let ctx = Ctx {
                can_inline_arguments: true,
                ..self.ctx
            };
            self.with_ctx(ctx).optimize_usage_of_arguments(n);
        }

        self.ctx.in_asm = old_in_asm;

        if cfg!(feature = "debug") && cfg!(debug_assertions) {
            n.visit_with(&mut AssertValid);
        }
    }

    fn visit_mut_if_stmt(&mut self, n: &mut IfStmt) {
        n.test.visit_mut_with(self);

        let ctx = Ctx {
            in_cond: true,
            ..self.ctx
        };

        n.cons.visit_mut_with(&mut *self.with_ctx(ctx));

        n.alt.visit_mut_with(&mut *self.with_ctx(ctx));

        self.negate_if_stmt(n);

        self.merge_nested_if(n);

        self.merge_else_if(n);
    }

    fn visit_mut_labeled_stmt(&mut self, n: &mut LabeledStmt) {
        let ctx = Ctx {
            stmt_labelled: true,
            ..self.ctx
        };
        let old_label = self.label.take();
        self.label = Some(n.label.to_id());
        n.visit_mut_children_with(&mut *self.with_ctx(ctx));
        self.label = old_label;
    }

    fn visit_mut_member_expr(&mut self, n: &mut MemberExpr) {
        {
            let ctx = Ctx {
                in_obj_of_non_computed_member: !n.computed,
                is_exact_lhs_of_assign: false,
                ..self.ctx
            };
            n.obj.visit_mut_with(&mut *self.with_ctx(ctx));
        }
        if n.computed {
            let ctx = Ctx {
                is_exact_lhs_of_assign: false,
                is_lhs_of_assign: false,
                ..self.ctx
            };
            n.prop.visit_mut_with(&mut *self.with_ctx(ctx));
        }
    }

    fn visit_mut_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        let ctx = Ctx {
            top_level: true,
            skip_standalone: true,
            ..self.ctx
        };
        self.with_ctx(ctx).handle_stmt_likes(stmts);

        stmts.visit_mut_with(&mut MultiReplacer {
            vars: take(&mut self.inlined_vars),
            changed: false,
        });

        stmts.retain(|s| match s {
            ModuleItem::Stmt(Stmt::Empty(..)) => false,
            _ => true,
        });
    }

    fn visit_mut_new_expr(&mut self, n: &mut NewExpr) {
        {
            let ctx = Ctx {
                is_callee: true,
                ..self.ctx
            };
            n.callee.visit_mut_with(&mut *self.with_ctx(ctx));
        }

        {
            let ctx = Ctx {
                in_call_arg: true,
                ..self.ctx
            };
            n.args.visit_mut_with(&mut *self.with_ctx(ctx));
        }
    }

    fn visit_mut_opt_stmt(&mut self, s: &mut Option<Box<Stmt>>) {
        s.visit_mut_children_with(self);

        match s.as_deref() {
            Some(Stmt::Empty(..)) => {
                self.changed = true;
                tracing::debug!("misc: Removing empty statement");
                *s = None;
            }
            _ => {}
        }
    }

    fn visit_mut_opt_var_decl_or_expr(&mut self, n: &mut Option<VarDeclOrExpr>) {
        n.visit_mut_children_with(self);

        match n {
            Some(VarDeclOrExpr::Expr(e)) => match &mut **e {
                Expr::Seq(SeqExpr { exprs, .. }) if exprs.is_empty() => {
                    *n = None;
                    return;
                }
                _ => {}
            },
            Some(VarDeclOrExpr::VarDecl(v)) => {
                if v.decls.is_empty() {
                    *n = None;
                    return;
                }
            }
            _ => {}
        }
    }

    fn visit_mut_param(&mut self, n: &mut Param) {
        n.visit_mut_children_with(self);

        self.drop_unused_param(&mut n.pat, false);
    }

    fn visit_mut_params(&mut self, n: &mut Vec<Param>) {
        n.visit_mut_children_with(self);

        n.retain(|p| !p.pat.is_invalid());
    }

    fn visit_mut_prop(&mut self, n: &mut Prop) {
        n.visit_mut_children_with(self);

        match n {
            Prop::Shorthand(i) => {
                if self.lits.contains_key(&i.to_id())
                    || self.vars_for_inlining.contains_key(&i.to_id())
                {
                    let mut e = Box::new(Expr::Ident(i.clone()));
                    e.visit_mut_with(self);

                    *n = Prop::KeyValue(KeyValueProp {
                        key: PropName::Ident(i.clone()),
                        value: e,
                    });
                }
            }
            _ => {}
        }

        if cfg!(feature = "debug") && cfg!(debug_assertions) {
            n.visit_with(&mut AssertValid);
        }
    }

    fn visit_mut_return_stmt(&mut self, n: &mut ReturnStmt) {
        n.visit_mut_children_with(self);

        if let Some(arg) = &mut n.arg {
            self.optimize_in_fn_termination(&mut **arg);
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_mut_seq_expr(&mut self, n: &mut SeqExpr) {
        {
            let ctx = Ctx {
                dont_use_negated_iife: true,
                ..self.ctx
            };

            n.visit_mut_children_with(&mut *self.with_ctx(ctx));
        }

        self.shift_void(n);

        self.shift_assignment(n);

        {
            let should_preserve_zero = match n.exprs.last().map(|v| &**v) {
                Some(Expr::Member(..)) => true,
                Some(Expr::Ident(Ident {
                    sym: js_word!("eval"),
                    ..
                })) => true,
                _ => false,
            };

            let exprs = n
                .exprs
                .iter_mut()
                .enumerate()
                .identify_last()
                .filter_map(|(last, (idx, expr))| {
                    let is_injected_zero = match &**expr {
                        Expr::Lit(Lit::Num(v)) => v.span.is_dummy(),
                        _ => false,
                    };

                    let can_remove = !last
                        && (idx != 0
                            || !is_injected_zero
                            || !self.ctx.is_this_aware_callee
                            || !should_preserve_zero);

                    let ret = if can_remove {
                        // If negate_iife is true, it's already handled by
                        // visit_mut_children_with(self) above.
                        if !self.options.negate_iife {
                            self.negate_iife_in_cond(&mut **expr);
                        }

                        self.ignore_return_value(&mut **expr).map(Box::new)
                    } else {
                        Some(expr.take())
                    };

                    ret
                })
                .collect::<Vec<_>>();
            n.exprs = exprs;
        }

        self.merge_sequences_in_seq_expr(n);

        self.lift_seqs_of_assign(n);
    }

    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
        let _tracing = if cfg!(feature = "debug") && self.debug_infinite_loop {
            let text = dump(&*s, false);

            if text.lines().count() < 10 {
                Some(span!(Level::ERROR, "visit_mut_stmt", "start" = &*text).entered())
            } else {
                None
            }
        } else {
            None
        };

        let ctx = Ctx {
            is_callee: false,
            is_delete_arg: false,
            is_update_arg: false,
            is_lhs_of_assign: false,
            in_bang_arg: false,
            is_exported: false,
            in_obj_of_non_computed_member: false,
            ..self.ctx
        };
        s.visit_mut_children_with(&mut *self.with_ctx(ctx));

        if cfg!(feature = "debug") && self.debug_infinite_loop {
            let text = dump(&*s, false);

            if text.lines().count() < 10 {
                tracing::debug!("after: visit_mut_children_with: {}", text);
            }
        }

        match s {
            Stmt::Expr(ExprStmt { expr, .. }) => {
                if is_pure_undefined(expr) {
                    *s = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                    return;
                }

                let is_directive = match &**expr {
                    Expr::Lit(Lit::Str(..)) => true,
                    _ => false,
                };

                if self.options.directives && is_directive {
                    if self.ctx.in_strict
                        && match &**expr {
                            Expr::Lit(Lit::Str(Str { value, .. })) => *value == *"use strict",
                            _ => false,
                        }
                    {
                        tracing::debug!("Removing 'use strict'");
                        *s = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                        return;
                    }
                }

                if self.options.unused {
                    let can_be_removed = !is_directive && !expr.may_have_side_effects();

                    if can_be_removed {
                        self.changed = true;
                        tracing::debug!("unused: Dropping an expression without side effect");
                        if cfg!(feature = "debug") {
                            tracing::trace!(
                                "unused: [Change] Dropping \n{}\n",
                                dump(&*expr, false)
                            );
                        }
                        *s = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                        return;
                    }
                }
            }
            _ => {}
        }

        self.optimize_loops_if_cond_is_false(s);
        self.optimize_loops_with_break(s);

        match s {
            // We use var decl with no declarator to indicate we dropped an decl.
            Stmt::Decl(Decl::Var(VarDecl { decls, .. })) if decls.is_empty() => {
                *s = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                return;
            }
            _ => {}
        }

        self.try_removing_block(s, false);

        self.extract_vars_in_subscopes(s);

        self.compress_if_without_alt(s);

        self.compress_if_stmt_as_cond(s);

        self.compress_if_stmt_as_expr(s);

        self.optimize_const_switches(s);

        self.optimize_switches(s);

        if cfg!(feature = "debug") && self.debug_infinite_loop {
            let text = dump(&*s, false);

            if text.lines().count() < 10 {
                tracing::debug!("after: visit_mut_stmt: {}", text);
            }
        }

        if cfg!(feature = "debug") && cfg!(debug_assertions) {
            s.visit_with(&mut AssertValid);
        }
    }

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        let ctx = Ctx {
            top_level: false,
            ..self.ctx
        };

        self.with_ctx(ctx).inject_else(stmts);

        self.with_ctx(ctx).handle_stmt_likes(stmts);

        self.with_ctx(ctx).merge_var_decls(stmts);

        stmts.retain(|s| match s {
            Stmt::Empty(..) => false,
            _ => true,
        });

        if stmts.len() == 1 {
            match &stmts[0] {
                Stmt::Expr(ExprStmt { expr, .. }) => match &**expr {
                    Expr::Lit(Lit::Str(s)) => {
                        if s.value == *"use strict" {
                            stmts.clear();
                        }
                    }
                    _ => {}
                },
                _ => {}
            }
        }

        if cfg!(feature = "debug") && cfg!(debug_assertions) {
            stmts.visit_with(&mut AssertValid);
        }
    }

    fn visit_mut_str(&mut self, s: &mut Str) {
        s.visit_mut_children_with(self);

        s.kind = Default::default()
    }

    fn visit_mut_switch_cases(&mut self, n: &mut Vec<SwitchCase>) {
        n.visit_mut_children_with(self);

        self.optimize_switch_cases(n);
    }

    fn visit_mut_switch_stmt(&mut self, n: &mut SwitchStmt) {
        n.discriminant.visit_mut_with(self);

        self.drop_unreachable_cases(n);

        n.cases.visit_mut_with(self);
    }

    /// We don't optimize [Tpl] contained in [TaggedTpl].
    fn visit_mut_tagged_tpl(&mut self, n: &mut TaggedTpl) {
        n.tag.visit_mut_with(self);
    }

    fn visit_mut_throw_stmt(&mut self, n: &mut ThrowStmt) {
        n.visit_mut_children_with(self);

        self.optimize_in_fn_termination(&mut n.arg);
    }

    fn visit_mut_tpl(&mut self, n: &mut Tpl) {
        debug_assert_eq!(n.exprs.len() + 1, n.quasis.len());

        {
            let ctx = Ctx {
                in_tpl_expr: true,
                ..self.ctx
            };
            let mut o = self.with_ctx(ctx);
            n.visit_mut_children_with(&mut *o);
        }

        n.exprs
            .iter_mut()
            .for_each(|expr| self.optimize_expr_in_str_ctx(&mut **expr));
    }

    fn visit_mut_try_stmt(&mut self, n: &mut TryStmt) {
        let ctx = Ctx {
            in_try_block: true,
            ..self.ctx
        };
        n.block.visit_mut_with(&mut *self.with_ctx(ctx));

        n.handler.visit_mut_with(self);

        n.finalizer.visit_mut_with(self);
    }

    fn visit_mut_unary_expr(&mut self, n: &mut UnaryExpr) {
        let ctx = Ctx {
            in_bang_arg: n.op == op!("!"),
            is_delete_arg: n.op == op!("delete"),
            ..self.ctx
        };

        n.visit_mut_children_with(&mut *self.with_ctx(ctx));

        // infinite loop
        match n.op {
            op!("void") => match &*n.arg {
                Expr::Lit(Lit::Num(..)) => {}

                _ => {
                    let arg = self.ignore_return_value(&mut n.arg);

                    n.arg = Box::new(arg.unwrap_or_else(|| make_number(DUMMY_SP, 0.0)));
                }
            },

            _ => {}
        }
    }

    fn visit_mut_update_expr(&mut self, n: &mut UpdateExpr) {
        let ctx = Ctx {
            is_update_arg: true,
            ..self.ctx
        };

        n.visit_mut_children_with(&mut *self.with_ctx(ctx));
    }

    fn visit_mut_var_decl(&mut self, n: &mut VarDecl) {
        {
            let ctx = Ctx {
                is_update_arg: false,
                has_const_ann: self.has_const_ann(n.span),
                var_kind: Some(n.kind),
                ..self.ctx
            };

            n.visit_mut_children_with(&mut *self.with_ctx(ctx));
        }

        if n.kind == VarDeclKind::Let {
            n.decls.iter_mut().for_each(|var| {
                if let Some(e) = &var.init {
                    if is_pure_undefined(e) {
                        self.changed = true;
                        tracing::debug!(
                            "Dropping explicit initializer which evaluates to `undefined`"
                        );

                        var.init = None;
                    }
                }
            });
        }
    }

    fn visit_mut_var_declarator(&mut self, var: &mut VarDeclarator) {
        var.name.visit_mut_with(self);

        var.init.visit_mut_with(self);

        self.remove_duplicate_names(var);

        self.store_var_for_inlining(var);
        self.store_var_for_prop_hoisting(var);
    }

    fn visit_mut_var_declarators(&mut self, vars: &mut Vec<VarDeclarator>) {
        vars.retain_mut(|var| {
            let had_init = var.init.is_some();

            if var.name.is_invalid() {
                self.changed = true;
                return false;
            }

            var.visit_mut_with(self);

            if var.name.is_invalid() {
                // It will be inlined.
                self.changed = true;
                return false;
            }

            // It will be inlined.
            if had_init && var.init.is_none() {
                self.changed = true;
                return false;
            }

            true
        });

        for idx in 0..vars.len() {
            let v = &mut vars[idx];
            if v.init
                .as_deref()
                .map(|e| !e.may_have_side_effects())
                .unwrap_or(true)
            {
                self.drop_unused_var_declarator(v, true);
            }
        }

        for idx in 0..vars.len() {
            let v = &mut vars[idx];
            self.drop_unused_var_declarator(v, true);
            if v.name.is_invalid() {
                continue;
            }

            break;
        }

        for idx in (0..vars.len()).rev() {
            let v = &mut vars[idx];
            self.drop_unused_var_declarator(v, false);
            if v.name.is_invalid() {
                continue;
            }

            break;
        }

        vars.retain(|var| {
            if var.name.is_invalid() {
                self.changed = true;
                return false;
            }

            if let Some(Expr::Invalid(..)) = var.init.as_deref() {
                return false;
            }

            true
        });
    }

    fn visit_mut_while_stmt(&mut self, n: &mut WhileStmt) {
        {
            let ctx = Ctx {
                executed_multiple_time: true,
                ..self.ctx
            };
            n.visit_mut_children_with(&mut *self.with_ctx(ctx));
        }
    }

    fn visit_mut_yield_expr(&mut self, n: &mut YieldExpr) {
        n.visit_mut_children_with(self);

        if let Some(arg) = &mut n.arg {
            self.compress_undefined(&mut **arg);

            if !n.delegate {
                if is_pure_undefined(&arg) {
                    n.arg = None;
                }
            }
        }
    }
}

/// If true, `0` in `(0, foo.bar)()` is preserved.
fn is_callee_this_aware(callee: &Expr) -> bool {
    match &*callee {
        Expr::Arrow(..) => return false,
        Expr::Seq(..) => return true,
        Expr::Member(MemberExpr {
            obj: ExprOrSuper::Expr(obj),
            ..
        }) => match &**obj {
            Expr::Ident(obj) => {
                if &*obj.sym == "console" {
                    return false;
                }
            }
            _ => {}
        },

        _ => {}
    }

    true
}

fn is_expr_access_to_arguments(l: &Expr) -> bool {
    match l {
        Expr::Member(MemberExpr {
            obj: ExprOrSuper::Expr(obj),
            ..
        }) => match &**obj {
            Expr::Ident(Ident {
                sym: js_word!("arguments"),
                ..
            }) => true,
            _ => false,
        },
        _ => false,
    }
}

fn is_left_access_to_arguments(l: &PatOrExpr) -> bool {
    match l {
        PatOrExpr::Expr(e) => is_expr_access_to_arguments(&e),
        PatOrExpr::Pat(pat) => match &**pat {
            Pat::Expr(e) => is_expr_access_to_arguments(&e),
            _ => false,
        },
    }
}
