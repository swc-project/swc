#![allow(dead_code)]

use std::{fmt::Write, iter::once, mem::take};

use retain_mut::RetainMut;
use rustc_hash::FxHashMap;
use swc_atoms::{js_word, JsWord};
use swc_common::{
    collections::AHashMap, iter::IdentifyLast, pass::Repeated, util::take::Take, Spanned,
    SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    ident::IdentLike, prepend_stmts, undefined, ExprExt, ExprFactory, Id, IsEmpty, ModuleItemLike,
    StmtLike, Type, Value,
};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith, VisitWith};
use tracing::{debug, span, Level};
use Value::Known;

use self::{
    unused::PropertyAccessOpts,
    util::{MultiReplacer, MultiReplacerMode},
};
use super::util::{drop_invalid_stmts, is_fine_for_if_cons};
use crate::{
    analyzer::{ProgramData, UsageAnalyzer},
    compress::util::is_pure_undefined,
    debug::{dump, AssertValid},
    marks::Marks,
    mode::Mode,
    option::CompressOptions,
    util::{contains_leaping_yield, make_number, ExprOptExt, ModuleItemExt},
};

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
    data: &'a mut ProgramData,
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

    Optimizer {
        marks,
        changed: false,
        options,
        prepend_stmts: Default::default(),
        append_stmts: Default::default(),
        vars: Default::default(),
        vars_for_prop_hoisting: Default::default(),
        simple_props: Default::default(),
        _simple_array_values: Default::default(),
        typeofs: Default::default(),
        data,
        ctx: Default::default(),
        label: Default::default(),
        mode,
        debug_infinite_loop,
        functions: Default::default(),
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

    /// `true` only for [Callee::Expr].
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
    prepend_stmts: SynthesizedStmts,
    /// Statements appended to the current statement.
    append_stmts: SynthesizedStmts,

    vars: Vars,

    /// Used for `hoist_props`.
    vars_for_prop_hoisting: FxHashMap<Id, Box<Expr>>,
    /// Used for `hoist_props`.
    simple_props: FxHashMap<(Id, JsWord), Box<Expr>>,
    _simple_array_values: AHashMap<(Id, usize), Box<Expr>>,
    typeofs: AHashMap<Id, JsWord>,
    /// This information is created by analyzing identifier usages.
    ///
    /// This is calculated multiple time, but only once per one
    /// `visit_mut_module`.
    data: &'a mut ProgramData,
    ctx: Ctx,

    /// Closest label.
    ///
    /// Setting this to `None` means the label should be removed.
    label: Option<Id>,

    mode: &'a M,

    debug_infinite_loop: bool,

    functions: FxHashMap<Id, FnMetadata>,
}

#[derive(Default)]
struct Vars {
    /// Cheap to clone.
    ///
    /// Used for inlining.
    lits: AHashMap<Id, Box<Expr>>,

    /// Used for copying functions.
    ///
    /// We use this to distinguish [Callee::Expr] from other [Expr]s.
    simple_functions: FxHashMap<Id, Box<Expr>>,
    vars_for_inlining: FxHashMap<Id, Box<Expr>>,
}

impl Vars {
    fn has_pending_inline_for(&self, id: &Id) -> bool {
        self.lits.contains_key(id) || self.vars_for_inlining.contains_key(id)
    }

    /// Returns true if something is changed.
    fn inline_with_multi_replacer<N>(&mut self, n: &mut N) -> bool
    where
        N: for<'aa> VisitMutWith<MultiReplacer<'aa>>,
    {
        let mut changed = false;
        if !self.simple_functions.is_empty() {
            n.visit_mut_with(&mut MultiReplacer::new(
                &mut self.simple_functions,
                true,
                MultiReplacerMode::OnlyCallee,
                &mut changed,
            ));
        }

        if !self.vars_for_inlining.is_empty() {
            n.visit_mut_with(&mut MultiReplacer::new(
                &mut self.vars_for_inlining,
                false,
                MultiReplacerMode::Normal,
                &mut changed,
            ));
        }

        changed
    }
}

impl<M> Repeated for Optimizer<'_, M> {
    fn changed(&self) -> bool {
        self.changed
    }

    fn reset(&mut self) {
        self.changed = false;
    }
}

#[derive(Debug, Clone, Copy)]
struct FnMetadata {
    len: usize,
}

impl From<&Function> for FnMetadata {
    fn from(f: &Function) -> Self {
        FnMetadata {
            len: f
                .params
                .iter()
                .filter(|p| matches!(&p.pat, Pat::Ident(..) | Pat::Array(..) | Pat::Object(..)))
                .count(),
        }
    }
}

impl<M> Optimizer<'_, M>
where
    M: Mode,
{
    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn handle_stmt_likes<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike + ModuleItemLike + ModuleItemExt + VisitMutWith<Self> + VisitWith<AssertValid>,
        Vec<T>: VisitMutWith<Self> + VisitWith<UsageAnalyzer> + VisitWith<AssertValid>,
    {
        let mut use_asm = false;
        let prepend_stmts = self.prepend_stmts.take();
        let append_stmts = self.append_stmts.take();

        {
            let mut child_ctx = Ctx { ..self.ctx };
            let mut directive_count = 0;

            if !stmts.is_empty() {
                // TODO: Handle multiple directives.
                if let Some(Stmt::Expr(ExprStmt { expr, .. })) = stmts[0].as_stmt() {
                    if let Expr::Lit(Lit::Str(v)) = &**expr {
                        directive_count += 1;

                        match &v.raw {
                            Some(value) if value == "\"use strict\"" || value == "'use strict'" => {
                                child_ctx.in_strict = true;
                            }
                            Some(value) if value == "\"use asm\"" || value == "'use asm'" => {
                                child_ctx.in_asm = true;
                                self.ctx.in_asm = true;
                                use_asm = true;
                            }
                            _ => {}
                        }
                    }
                }
            }

            let mut new = Vec::with_capacity(stmts.len() * 11 / 10);
            for (i, mut stmt) in stmts.take().into_iter().enumerate() {
                // debug_assert_eq!(self.prepend_stmts, vec![]);
                // debug_assert_eq!(self.append_stmts, vec![]);

                if i < directive_count {
                    // Don't set in_strict for directive itself.
                    stmt.visit_mut_with(self);
                } else {
                    stmt.visit_mut_with(&mut *self.with_ctx(child_ctx));
                }

                if cfg!(debug_assertions) {
                    stmt.visit_with(&mut AssertValid);
                }

                new.extend(self.prepend_stmts.drain(..).map(T::from_stmt));

                match stmt.try_into_stmt() {
                    Ok(Stmt::Block(s)) if s.span.has_mark(self.marks.fake_block) => {
                        new.extend(s.stmts.into_iter().map(T::from_stmt));
                    }
                    Ok(s) => {
                        new.push(T::from_stmt(s));
                    }
                    Err(stmt) => {
                        new.push(stmt);
                    }
                }

                new.extend(self.append_stmts.drain(..).map(T::from_stmt));
            }
            *stmts = new;
        }

        self.ctx.in_asm |= use_asm;

        if cfg!(debug_assertions) {
            stmts.visit_with(&mut AssertValid);
        }

        self.reorder_stmts(stmts);

        if cfg!(debug_assertions) {
            stmts.visit_with(&mut AssertValid);
        }

        self.merge_sequences_in_stmts(stmts);

        if cfg!(debug_assertions) {
            stmts.visit_with(&mut AssertValid);
        }

        self.merge_similar_ifs(stmts);

        if cfg!(debug_assertions) {
            stmts.visit_with(&mut AssertValid);
        }

        self.make_sequences(stmts);

        if cfg!(debug_assertions) {
            stmts.visit_with(&mut AssertValid);
        }

        self.drop_else_token(stmts);

        if cfg!(debug_assertions) {
            stmts.visit_with(&mut AssertValid);
        }

        self.break_assignments_in_seqs(stmts);

        if cfg!(debug_assertions) {
            stmts.visit_with(&mut AssertValid);
        }

        // stmts.extend(self.append_stmts.drain(..).map(T::from_stmt));

        drop_invalid_stmts(stmts);

        // debug_assert_eq!(self.prepend_stmts, vec![]);
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
            Callee::Super(_) | Callee::Import(_) => return,
            Callee::Expr(callee) => &mut **callee,
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
                prop: MemberProp::Ident(Ident { sym, .. }),
                ..
            }) if *sym == *"join" => {
                if let Expr::Array(arr) = &mut **obj {
                    arr
                } else {
                    return;
                }
            }
            _ => return,
        };

        if arr.elems.iter().any(|elem| {
            matches!(
                elem,
                Some(ExprOrSpread {
                    spread: Some(..),
                    ..
                })
            )
        }) {
            return;
        }

        let cannot_join_as_str_lit = arr
            .elems
            .iter()
            .filter_map(|v| v.as_ref())
            .any(|v| match &*v.expr {
                e if is_pure_undefined(e) => false,
                Expr::Lit(lit) => !matches!(lit, Lit::Str(..) | Lit::Num(..) | Lit::Null(..)),
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
                    Expr::Lit(lit) => !matches!(lit, Lit::Str(..) | Lit::Num(..) | Lit::Null(..)),
                    // This can change behavior if the value is `undefined` or `null`.
                    Expr::Ident(..) => false,
                    _ => true,
                })
            {
                return;
            }

            let sep = Box::new(Expr::Lit(Lit::Str(Str {
                span: DUMMY_SP,
                raw: None,
                value: separator,
            })));
            let mut res = Expr::Lit(Lit::Str(Str {
                span: DUMMY_SP,
                raw: None,
                value: js_word!(""),
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
                if let Some(ExprOrSpread { spread: None, expr }) = elem {
                    match &*expr {
                        e if is_pure_undefined(e) => {}
                        Expr::Lit(Lit::Null(..)) => {}
                        _ => {
                            add(&mut res, expr);
                        }
                    }
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

        report_change!("Compressing array.join()");

        self.changed = true;
        *e = Expr::Lit(Lit::Str(Str {
            span: call.span,
            raw: None,
            value: res.into(),
        }))
    }

    ///
    /// - `undefined` => `void 0`
    fn compress_undefined(&mut self, e: &mut Expr) {
        if let Expr::Ident(Ident {
            span,
            sym: js_word!("undefined"),
            ..
        }) = e
        {
            *e = *undefined(*span);
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
            if let Lit::Bool(v) = lit {
                self.changed = true;
                report_change!("Compressing boolean literal");
                *e = Expr::Unary(UnaryExpr {
                    span: v.span,
                    op: op!("!"),
                    arg: Box::new(Expr::Lit(Lit::Num(Number {
                        span: v.span,
                        value: if v.value { 0.0 } else { 1.0 },
                        raw: None,
                    }))),
                });
            }
        }
    }

    fn remove_invalid(&mut self, e: &mut Expr) {
        if let Expr::Bin(BinExpr { left, right, .. }) = e {
            self.remove_invalid(left);
            self.remove_invalid(right);

            if left.is_invalid() {
                *e = *right.take();
                self.remove_invalid(e);
            } else if right.is_invalid() {
                *e = *left.take();
                self.remove_invalid(e);
            }
        }
    }

    /// Returns [None] if expression is side-effect-free.
    /// If an expression has a side effect, only side effects are returned.
    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn ignore_return_value(&mut self, e: &mut Expr) -> Option<Expr> {
        self.optimize_bang_within_logical_ops(e, true);

        self.compress_cond_to_logical_ignoring_return_value(e);

        self.drop_unused_update(e);

        self.drop_unused_op_assign(e);

        match e {
            Expr::This(_) | Expr::Invalid(_) | Expr::Lit(..) => {
                report_change!(
                    "ignore_return_value: Dropping unused expr: {}",
                    dump(&*e, false)
                );
                self.changed = true;
                return None;
            }

            Expr::Tpl(t) if t.exprs.is_empty() => {
                report_change!("ignore_return_value: Dropping tpl expr without expr");
                self.changed = true;
                return None;
            }

            // Function expression cannot have a side effect.
            Expr::Fn(_) => {
                report_change!(
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
                        ClassMember::Method(ClassMethod {
                            key: PropName::Computed(key),
                            ..
                        }) => {
                            exprs.extend(self.ignore_return_value(&mut key.expr).map(Box::new));
                        }
                        ClassMember::ClassProp(ClassProp {
                            key,
                            is_static,
                            value,
                            ..
                        }) => {
                            if let PropName::Computed(key) = key {
                                exprs
                                    .extend(self.ignore_return_value(&mut *key.expr).map(Box::new));
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
                callee: Callee::Expr(callee),
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
                report_change!("ignore_return_value: Dropping a pure call");
                self.changed = true;
                return None;
            }

            Expr::Call(CallExpr {
                callee: Callee::Expr(callee),
                args,
                ..
            }) => {
                if let Expr::Fn(FnExpr {
                    ident: None,
                    function,
                }) = &mut **callee
                {
                    if args.is_empty() {
                        for param in &mut function.params {
                            self.drop_unused_param(&mut param.pat, true);
                        }

                        function.params.retain(|p| !p.pat.is_invalid());
                    }
                }

                if args.is_empty() {
                    if let Expr::Fn(f) = &mut **callee {
                        if f.function.body.is_empty() {
                            return None;
                        }
                    }
                }

                if let Expr::Ident(callee) = &**callee {
                    if self.options.reduce_vars && self.options.side_effects {
                        if let Some(usage) = self.data.vars.get(&callee.to_id()) {
                            if !usage.reassigned() && usage.pure_fn {
                                let args = args
                                    .take()
                                    .into_iter()
                                    .filter_map(|mut arg| self.ignore_return_value(&mut arg.expr))
                                    .map(Box::new)
                                    .collect::<Vec<_>>();

                                if args.is_empty() {
                                    return None;
                                }

                                return Some(Expr::Seq(SeqExpr {
                                    span: callee.span,
                                    exprs: args,
                                }));
                            }
                        }
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
            Expr::Member(MemberExpr { obj, prop, .. })
                if !prop.is_computed()
                    && (self.options.top_level() || !self.ctx.in_top_level()) =>
            {
                if self.should_preserve_property_access(
                    obj,
                    PropertyAccessOpts {
                        allow_getter: true,
                        only_ident: true,
                    },
                ) {
                    return Some(e.take());
                } else {
                    return None;
                }
            }

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
                report_change!("ignore_return_value: Inverting an array literal");
                exprs.extend(
                    arr.elems
                        .take()
                        .into_iter()
                        .flatten()
                        .map(|v| v.expr)
                        .filter_map(|mut e| self.ignore_return_value(&mut e))
                        .map(Box::new),
                );

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
                report_change!("ignore_return_value: Inverting an object literal");
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
                        Callee::Expr(callee) => matches!(&**callee, Expr::Fn(..)),
                        _ => false,
                    },
                    _ => false,
                } =>
            {
                let processed_arg = self.ignore_return_value(&mut **arg)?;

                *arg = Box::new(processed_arg);

                log_abort!("ignore_return_value: Preserving negated iife");
                return Some(e.take());
            }

            // `delete` is handled above
            Expr::Unary(expr) => {
                self.changed = true;
                report_change!("ignore_return_value: Reducing unary ({})", expr.op);
                return self.ignore_return_value(&mut expr.arg);
            }

            Expr::Bin(BinExpr {
                span,
                left,
                right,
                op,
                ..
            }) => {
                report_change!("ignore_return_value: Reducing binary ({})", *op);

                let left = self.ignore_return_value(&mut **left).map(Box::new);
                let right = self.ignore_return_value(&mut **right).map(Box::new);

                let mut seq = Expr::Seq(SeqExpr {
                    span: *span,
                    exprs: left.into_iter().chain(right).collect(),
                });
                return self.ignore_return_value(&mut seq);
            }

            Expr::Cond(cond) => {
                trace_op!("ignore_return_value: Cond expr");

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
                        report_change!("ignore_return_value: Dropped `cons`");
                        self.changed = true;
                        undefined(cons_span)
                    }),
                    alt: alt.unwrap_or_else(|| {
                        report_change!("ignore_return_value: Dropped `alt`");
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
                    let is_last_undefined = is_pure_undefined(exprs.last().unwrap());

                    // (foo(), void 0) => void foo()
                    if is_last_undefined {
                        self.changed = true;
                        // Remove `void 0`
                        exprs.pop();

                        // Make return type undefined.
                        if let Some(last) = exprs.last_mut() {
                            report_change!("ignore_return_value: Shifting void");
                            self.changed = true;
                            *last = Box::new(Expr::Unary(UnaryExpr {
                                span: DUMMY_SP,
                                op: op!("void"),
                                arg: last.take(),
                            }));
                        }
                    }

                    if exprs.is_empty() {
                        report_change!("ignore_return_value: Dropping empty seq");
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
        let (span, args) = match e {
            Expr::New(NewExpr {
                span, callee, args, ..
            }) => match &**callee {
                Expr::Ident(Ident {
                    sym: js_word!("RegExp"),
                    ..
                }) => (*span, args),
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
                                && !matches!(c, '%' | '[' | ']' | '(' | ')' | '{' | '}' | '-' | '+')
                        }) {
                            return true;
                        }
                        if s.value.contains("\\\0") || s.value.contains('/') {
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
            Expr::Lit(Lit::Str(s)) => s.value,
            _ => {
                unreachable!()
            }
        };

        if pattern.is_empty() {
            // For some expressions `RegExp()` and `RegExp("")`
            // Theoretically we can use `/(?:)/` to achieve shorter code
            // But some browsers released in 2015 don't support them yet.
            args[0].expr = pattern.into();
            return;
        }

        let flags = args
            .get_mut(1)
            .map(|v| v.expr.take())
            .map(|v| match *v {
                Expr::Lit(Lit::Str(s)) => {
                    assert!(s.value.is_ascii());

                    let s = s.value.to_string();
                    let mut bytes = s.into_bytes();
                    bytes.sort_unstable();

                    String::from_utf8(bytes).unwrap().into()
                }
                _ => {
                    unreachable!()
                }
            })
            .unwrap_or(js_word!(""));

        report_change!("Converting call to RegExp into a regexp literal");
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
            self.negate(&mut cond.test, false);
            self.negate(&mut cond.test, false);
            *expr = *cond.test.take();
            return;
        }

        // `cond ? false : true` => !cond
        if !lb && rb {
            self.negate(&mut cond.test, false);
            *expr = *cond.test.take();
        }
    }

    fn merge_var_decls(&mut self, stmts: &mut Vec<Stmt>) {
        if !self.options.join_vars && !self.options.hoist_vars {
            return;
        }
        if self.ctx.in_asm {
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

            report_change!("Merging variable declarations");
            dump_change_detail!(
                "[Before]: {}",
                dump(
                    &BlockStmt {
                        span: DUMMY_SP,
                        stmts: stmts.clone()
                    },
                    false
                )
            );

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

            dump_change_detail!(
                "[Change] merged: {}",
                dump(
                    &BlockStmt {
                        span: DUMMY_SP,
                        stmts: new.clone()
                    },
                    false
                )
            );

            *stmts = new
        }
    }

    fn try_removing_block(&mut self, s: &mut Stmt, unwrap_more: bool) {
        match s {
            Stmt::Block(bs) => {
                if bs.stmts.is_empty() {
                    *s = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                    return;
                }

                // Remove nested blocks
                if bs.stmts.len() == 1 {
                    if bs.span.has_mark(self.marks.fake_block) {
                        *s = bs.stmts.take().into_iter().next().unwrap();
                        return;
                    }

                    if let Stmt::Block(block) = &mut bs.stmts[0] {
                        if block
                            .stmts
                            .iter()
                            .all(|stmt| !matches!(stmt, Stmt::Decl(..)))
                        {
                            report_change!("optimizer: Removing nested block");
                            self.changed = true;
                            bs.stmts = block.stmts.take();
                        }
                    }
                }

                // Unwrap a block with only `var`s.
                //
                // TODO: Support multiple statements.
                if bs.stmts.len() == 1
                    && bs.stmts.iter().all(|stmt| {
                        matches!(
                            stmt,
                            Stmt::Decl(Decl::Var(VarDecl {
                                kind: VarDeclKind::Var,
                                ..
                            }))
                        )
                    })
                {
                    report_change!("optimizer: Unwrapping a block with variable statements");
                    self.changed = true;
                    *s = bs.stmts[0].take();
                    return;
                }

                for stmt in &mut bs.stmts {
                    if let Stmt::Block(block) = &stmt {
                        if block.stmts.is_empty() {
                            self.changed = true;
                            report_change!("optimizer: Removing empty block");
                            *stmt = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                        }
                    }
                }

                if unwrap_more && bs.stmts.len() == 1 {
                    match &bs.stmts[0] {
                        Stmt::Expr(..) | Stmt::If(..) => {
                            *s = bs.stmts[0].take();
                            report_change!("optimizer: Unwrapping block stmt");
                            self.changed = true;
                        }
                        Stmt::Decl(Decl::Fn(..)) if !self.ctx.in_strict => {
                            *s = bs.stmts[0].take();
                            report_change!("optimizer: Unwrapping block stmt in non strcit mode");
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
                    Stmt::Block(bs) if bs.stmts.len() == 1 => matches!(&bs.stmts[0], Stmt::For(..)),
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
            if let Stmt::Expr(cons) = &mut *stmt.cons {
                self.changed = true;
                report_change!("Converting if statement to a form `test && cons`");
                *s = Stmt::Expr(ExprStmt {
                    span: stmt.span,
                    expr: Box::new(stmt.test.take().make_bin(op!("&&"), *cons.expr.take())),
                });
            }
        }
    }
}

impl<M> VisitMut for Optimizer<'_, M>
where
    M: Mode,
{
    noop_visit_mut_type!();

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_mut_arrow_expr(&mut self, n: &mut ArrowExpr) {
        let prepend = self.prepend_stmts.take();

        let ctx = Ctx {
            can_inline_arguments: true,
            ..self.ctx
        };

        n.visit_mut_children_with(&mut *self.with_ctx(ctx));

        if !self.prepend_stmts.is_empty() {
            let mut stmts = self.prepend_stmts.take().take_stmts();
            match &mut n.body {
                BlockStmtOrExpr::BlockStmt(v) => {
                    prepend_stmts(&mut v.stmts, stmts.into_iter());
                }
                BlockStmtOrExpr::Expr(v) => {
                    self.changed = true;
                    report_change!("Converting a body of an arrow expression to BlockStmt");

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

        if let BlockStmtOrExpr::BlockStmt(body) = &mut n.body {
            drop_invalid_stmts(&mut body.stmts);
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
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

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_mut_assign_pat_prop(&mut self, n: &mut AssignPatProp) {
        n.visit_mut_children_with(self);

        if let Some(value) = &n.value {
            if is_pure_undefined(value) {
                n.value = None;
            }
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_mut_bin_expr(&mut self, n: &mut BinExpr) {
        {
            let ctx = Ctx {
                in_cond: self.ctx.in_cond || matches!(n.op, op!("&&") | op!("||") | op!("??")),
                ..self.ctx
            };

            n.visit_mut_children_with(&mut *self.with_ctx(ctx));
        }

        self.compress_typeof_undefined(n);

        self.optimize_bin_operator(n);

        self.optimize_cmp_with_null_or_undefined(n);

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

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
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

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_mut_call_expr(&mut self, e: &mut CallExpr) {
        let is_this_undefined = match &e.callee {
            Callee::Super(_) | Callee::Import(_) => false,
            Callee::Expr(e) => e.is_ident(),
        };
        {
            let ctx = Ctx {
                is_callee: true,
                is_this_aware_callee: is_this_undefined
                    || match &e.callee {
                        Callee::Super(_) | Callee::Import(_) => false,
                        Callee::Expr(callee) => is_callee_this_aware(callee),
                    },
                ..self.ctx
            };
            e.callee.visit_mut_with(&mut *self.with_ctx(ctx));
        }

        if is_this_undefined {
            if let Callee::Expr(callee) = &mut e.callee {
                if let Expr::Member(..) = &mut **callee {
                    let zero = Box::new(Expr::Lit(Lit::Num(Number {
                        span: DUMMY_SP,
                        value: 0.0,
                        raw: None,
                    })));
                    self.changed = true;
                    report_change!("injecting zero to preserve `this` in call");

                    *callee = Box::new(Expr::Seq(SeqExpr {
                        span: callee.span(),
                        exprs: vec![zero, callee.take()],
                    }));
                }
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

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
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

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_mut_decl(&mut self, decl: &mut Decl) {
        decl.visit_mut_children_with(self);

        self.drop_unused_decl(decl);
        self.store_typeofs(decl);
        self.store_decl_for_inlining(decl);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
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

    fn visit_mut_do_while_stmt(&mut self, n: &mut DoWhileStmt) {
        {
            let ctx = Ctx {
                executed_multiple_time: true,
                ..self.ctx
            };
            n.visit_mut_children_with(&mut *self.with_ctx(ctx));
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_mut_export_decl(&mut self, n: &mut ExportDecl) {
        if let Decl::Fn(f) = &mut n.decl {
            // I don't know why, but terser removes parameters from an exported function if
            // `unused` is true, regardless of keep_fargs or others.
            if self.options.unused {
                self.drop_unused_params(&mut f.function.params);
            }
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

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_mut_expr(&mut self, e: &mut Expr) {
        let ctx = Ctx {
            is_exported: false,
            is_callee: false,
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

        if let Expr::Bin(bin) = e {
            let expr = self.optimize_lit_cmp(bin);
            if let Some(expr) = expr {
                report_change!("Optimizing: Literal comparison");
                self.changed = true;
                *e = expr;
            }
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

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_mut_expr_stmt(&mut self, n: &mut ExprStmt) {
        let was_directive = matches!(&*n.expr, Expr::Lit(Lit::Str(..)));

        n.visit_mut_children_with(self);

        let mut need_ignore_return_value = false;

        // If negate_iife is true, it's already handled by
        // visit_mut_children_with(self) above.
        if !self.options.negate_iife {
            // I(kdy1) don't know why this check if required, but there are two test cases
            // with `options.expressions` as only difference.
            if !self.options.expr && self.negate_iife_in_cond(&mut n.expr) {
                need_ignore_return_value = true
            }
        }

        self.negate_iife_ignoring_ret(&mut n.expr);

        let is_directive = matches!(&*n.expr, Expr::Lit(Lit::Str(..)));

        if is_directive {
            if !was_directive {
                *n = ExprStmt {
                    span: DUMMY_SP,
                    expr: Take::dummy(),
                };
            }
            return;
        }

        if need_ignore_return_value
            || self.options.unused
            || self.options.side_effects
            || self.options.reduce_fns
            || (self.options.sequences() && n.expr.is_seq())
            || (self.options.conditionals
                && matches!(
                    &*n.expr,
                    Expr::Bin(BinExpr {
                        op: op!("||") | op!("&&"),
                        ..
                    })
                ))
        {
            // Preserve top-level negated iifes.
            if let Expr::Unary(unary @ UnaryExpr { op: op!("!"), .. }) = &*n.expr {
                if let Expr::Call(CallExpr {
                    callee: Callee::Expr(callee),
                    ..
                }) = &*unary.arg
                {
                    if let Expr::Fn(..) = &**callee {
                        return;
                    }
                }
            }
            let expr = self.ignore_return_value(&mut n.expr);
            n.expr = expr.map(Box::new).unwrap_or_else(|| {
                report_change!("visit_mut_expr_stmt: Dropped an expression statement");
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

        if cfg!(debug_assertions) {
            n.visit_with(&mut AssertValid);
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_mut_fn_decl(&mut self, f: &mut FnDecl) {
        self.functions
            .entry(f.ident.to_id())
            .or_insert_with(|| FnMetadata::from(&f.function));

        if !self.options.keep_fargs && self.options.evaluate && self.options.unused {
            self.drop_unused_params(&mut f.function.params);
        }

        let ctx = Ctx {
            top_level: false,
            ..self.ctx
        };
        f.visit_mut_children_with(&mut *self.with_ctx(ctx));
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_mut_fn_expr(&mut self, e: &mut FnExpr) {
        if let Some(ident) = &e.ident {
            self.functions
                .entry(ident.to_id())
                .or_insert_with(|| FnMetadata::from(&e.function));
        }

        if !self.options.keep_fnames {
            self.remove_name_if_not_used(&mut e.ident);
        }

        e.visit_mut_children_with(self);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_mut_for_in_stmt(&mut self, n: &mut ForInStmt) {
        n.right.visit_mut_with(self);

        {
            let ctx = Ctx {
                in_var_decl_of_for_in_or_of_loop: true,
                ..self.ctx
            };
            n.left.visit_mut_with(&mut *self.with_ctx(ctx));
        }

        {
            let ctx = Ctx {
                executed_multiple_time: true,
                ..self.ctx
            };
            n.body.visit_mut_with(&mut *self.with_ctx(ctx));
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_mut_for_of_stmt(&mut self, n: &mut ForOfStmt) {
        n.right.visit_mut_with(self);

        {
            let ctx = Ctx {
                in_var_decl_of_for_in_or_of_loop: true,
                ..self.ctx
            };
            n.left.visit_mut_with(&mut *self.with_ctx(ctx));
        }

        {
            let ctx = Ctx {
                executed_multiple_time: true,
                ..self.ctx
            };
            n.body.visit_mut_with(&mut *self.with_ctx(ctx));
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_mut_for_stmt(&mut self, s: &mut ForStmt) {
        let ctx = Ctx {
            executed_multiple_time: true,
            ..self.ctx
        };

        s.init.visit_mut_with(self);
        s.test.visit_mut_with(self);
        s.update.visit_mut_with(self);

        s.body.visit_mut_with(&mut *self.with_ctx(ctx));

        self.with_ctx(ctx).optimize_init_of_for_stmt(s);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
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
                top_level: false,

                ..self.ctx
            };
            let optimizer = &mut *self.with_ctx(ctx);

            n.params.visit_mut_with(optimizer);
            if let Some(body) = n.body.as_mut() {
                // Bypass block scope handler.
                body.visit_mut_children_with(optimizer);
                if cfg!(debug_assertions) {
                    body.visit_with(&mut AssertValid);
                }
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

        if let Some(body) = &mut n.body {
            drop_invalid_stmts(&mut body.stmts);
        }

        if cfg!(debug_assertions) {
            n.visit_with(&mut AssertValid);
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
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

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_mut_labeled_stmt(&mut self, n: &mut LabeledStmt) {
        let ctx = Ctx {
            stmt_labelled: true,
            ..self.ctx
        };
        let old_label = self.label.take();
        self.label = Some(n.label.to_id());
        n.visit_mut_children_with(&mut *self.with_ctx(ctx));

        if self.label.is_none() {
            n.label.take();
        }

        self.label = old_label;
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_mut_member_expr(&mut self, n: &mut MemberExpr) {
        {
            let ctx = Ctx {
                in_obj_of_non_computed_member: !n.prop.is_computed(),
                is_exact_lhs_of_assign: false,
                ..self.ctx
            };
            n.obj.visit_mut_with(&mut *self.with_ctx(ctx));
        }
        if let MemberProp::Computed(c) = &mut n.prop {
            let ctx = Ctx {
                is_exact_lhs_of_assign: false,
                is_lhs_of_assign: false,
                ..self.ctx
            };
            c.visit_mut_with(&mut *self.with_ctx(ctx));
        }
    }

    fn visit_mut_module_item(&mut self, s: &mut ModuleItem) {
        s.visit_mut_children_with(self);

        if let ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
            decl: Decl::Var(v),
            ..
        })) = s
        {
            if v.decls.is_empty() {
                s.take();
            }
        }
    }

    fn visit_mut_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        let ctx = Ctx {
            top_level: true,
            skip_standalone: true,
            ..self.ctx
        };
        self.with_ctx(ctx).handle_stmt_likes(stmts);

        if self.vars.inline_with_multi_replacer(stmts) {
            self.changed = true;
        }

        drop_invalid_stmts(stmts);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
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

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_mut_opt_stmt(&mut self, s: &mut Option<Box<Stmt>>) {
        s.visit_mut_children_with(self);

        if let Some(Stmt::Empty(..)) = s.as_deref() {
            self.changed = true;
            report_change!("misc: Removing empty statement");
            *s = None;
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_mut_opt_var_decl_or_expr(&mut self, n: &mut Option<VarDeclOrExpr>) {
        n.visit_mut_children_with(self);

        match n {
            Some(VarDeclOrExpr::Expr(e)) => match &mut **e {
                Expr::Invalid(..) => {
                    *n = None;
                }
                Expr::Seq(SeqExpr { exprs, .. }) if exprs.is_empty() => {
                    *n = None;
                }
                _ => {}
            },
            Some(VarDeclOrExpr::VarDecl(v)) => {
                if v.decls.is_empty() {
                    *n = None;
                }
            }
            _ => {}
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_mut_param(&mut self, n: &mut Param) {
        let ctx = Ctx {
            var_kind: None,
            ..self.ctx
        };
        let mut o = self.with_ctx(ctx);
        n.visit_mut_children_with(&mut *o);

        o.drop_unused_param(&mut n.pat, false);
    }

    fn visit_mut_params(&mut self, n: &mut Vec<Param>) {
        n.visit_mut_children_with(self);

        n.retain(|p| !p.pat.is_invalid());
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_mut_prop(&mut self, n: &mut Prop) {
        n.visit_mut_children_with(self);

        if let Prop::Shorthand(i) = n {
            if self.vars.has_pending_inline_for(&i.to_id()) {
                let mut e = Box::new(Expr::Ident(i.clone()));
                e.visit_mut_with(self);

                *n = Prop::KeyValue(KeyValueProp {
                    key: PropName::Ident(i.clone()),
                    value: e,
                });
            }
        }

        if cfg!(debug_assertions) {
            n.visit_with(&mut AssertValid);
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_mut_return_stmt(&mut self, n: &mut ReturnStmt) {
        n.visit_mut_children_with(self);

        if let Some(arg) = &mut n.arg {
            self.optimize_in_fn_termination(&mut **arg);
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
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
            let should_preserve_zero = matches!(
                n.exprs.last().map(|v| &**v),
                Some(Expr::Member(..))
                    | Some(Expr::Ident(Ident {
                        sym: js_word!("eval"),
                        ..
                    }))
            );

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

                    if can_remove {
                        // If negate_iife is true, it's already handled by
                        // visit_mut_children_with(self) above.
                        if !self.options.negate_iife {
                            self.negate_iife_in_cond(&mut **expr);
                        }

                        self.ignore_return_value(&mut **expr).map(Box::new)
                    } else {
                        Some(expr.take())
                    }
                })
                .collect::<Vec<_>>();
            n.exprs = exprs;
        }

        self.merge_sequences_in_seq_expr(n);

        self.lift_seqs_of_assign(n);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
        let old_prepend = self.prepend_stmts.take();
        let old_append = self.append_stmts.take();

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
        if self.prepend_stmts.is_empty() && self.append_stmts.is_empty() {
            match s {
                // We use var decl with no declarator to indicate we dropped an decl.
                Stmt::Decl(Decl::Var(VarDecl { decls, .. })) if decls.is_empty() => {
                    *s = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                    return;
                }
                Stmt::Expr(es) => {
                    if es.expr.is_invalid() {
                        *s = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                        return;
                    }
                }
                _ => {}
            }

            if cfg!(debug_assertions) {
                s.visit_with(&mut AssertValid);
            }
        }

        if let Stmt::Labeled(LabeledStmt {
            label: Ident {
                sym: js_word!(""), ..
            },
            body,
            ..
        }) = s
        {
            *s = *body.take();
        }

        self.remove_duplicate_var_decls(s);

        // visit_mut_children_with above may produce easily optimizable block
        // statements.
        self.try_removing_block(s, false);

        // These methods may modify prepend_stmts or append_stmts.
        self.optimize_loops_if_cond_is_false(s);
        self.optimize_loops_with_break(s);

        self.try_removing_block(s, false);

        if !self.prepend_stmts.is_empty() || !self.append_stmts.is_empty() {
            let span = s.span();
            *s = Stmt::Block(BlockStmt {
                span: span.apply_mark(self.marks.fake_block),
                stmts: self
                    .prepend_stmts
                    .take_stmts()
                    .into_iter()
                    .chain(once(s.take()))
                    .chain(self.append_stmts.take_stmts().into_iter())
                    .filter(|s| match s {
                        Stmt::Empty(..) => false,
                        Stmt::Decl(Decl::Var(v)) => !v.decls.is_empty(),
                        _ => true,
                    })
                    .collect(),
            });

            if cfg!(debug_assertions) {
                s.visit_with(&mut AssertValid);
            }
        }

        self.prepend_stmts = old_prepend;
        self.append_stmts = old_append;

        let len = self.prepend_stmts.len();

        if cfg!(feature = "debug") && self.debug_infinite_loop {
            let text = dump(&*s, false);

            if text.lines().count() < 10 {
                debug!("after: visit_mut_children_with: {}", text);
            }
        }

        debug_assert_eq!(self.prepend_stmts.len(), len);

        if let Stmt::Expr(ExprStmt { expr, .. }) = s {
            if is_pure_undefined(expr) {
                *s = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                return;
            }

            let is_directive = matches!(&**expr, Expr::Lit(Lit::Str(..)));

            if self.options.directives
                && is_directive
                && self.ctx.in_strict
                && match &**expr {
                    Expr::Lit(Lit::Str(Str { value, .. })) => *value == *"use strict",
                    _ => false,
                }
            {
                report_change!("Removing 'use strict'");
                *s = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                return;
            }

            if self.options.unused {
                let can_be_removed =
                    !is_directive && !expr.is_ident() && !expr.may_have_side_effects();

                if can_be_removed {
                    self.changed = true;
                    report_change!("unused: Dropping an expression without side effect");
                    dump_change_detail!("unused: Dropping \n{}\n", dump(&*expr, false));
                    *s = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                    return;
                }
            }
        }

        debug_assert_eq!(self.prepend_stmts.len(), len);

        match s {
            // We use var decl with no declarator to indicate we dropped an decl.
            Stmt::Decl(Decl::Var(VarDecl { decls, .. })) if decls.is_empty() => {
                *s = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                return;
            }
            _ => {}
        }

        debug_assert_eq!(self.prepend_stmts.len(), len);

        if cfg!(debug_assertions) {
            s.visit_with(&mut AssertValid);
        }

        debug_assert_eq!(self.prepend_stmts.len(), len);

        self.compress_if_without_alt(s);

        debug_assert_eq!(self.prepend_stmts.len(), len);

        self.compress_if_stmt_as_cond(s);

        debug_assert_eq!(self.prepend_stmts.len(), len);

        self.compress_if_stmt_as_expr(s);

        debug_assert_eq!(self.prepend_stmts.len(), len);

        self.optimize_const_switches(s);

        debug_assert_eq!(self.prepend_stmts.len(), len);

        self.optimize_switches(s);

        debug_assert_eq!(self.prepend_stmts.len(), len);

        if cfg!(feature = "debug") && self.debug_infinite_loop {
            let text = dump(&*s, false);

            if text.lines().count() < 10 {
                debug!("after: visit_mut_stmt: {}", text);
            }
        }

        debug_assert_eq!(self.prepend_stmts.len(), len);

        if cfg!(debug_assertions) {
            s.visit_with(&mut AssertValid);
        }

        debug_assert_eq!(self.prepend_stmts.len(), len);
    }

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        // Skip if `use asm` exists.
        if stmts.iter().any(|stmt| match stmt.as_stmt() {
            Some(Stmt::Expr(stmt)) => match &*stmt.expr {
                Expr::Lit(Lit::Str(Str { raw, .. })) => {
                    matches!(raw, Some(value) if value == "\"use asm\"" || value == "'use asm'")
                }
                _ => false,
            },
            _ => false,
        }) {
            return;
        }

        let ctx = Ctx { ..self.ctx };

        self.with_ctx(ctx).inject_else(stmts);

        self.with_ctx(ctx).handle_stmt_likes(stmts);

        self.with_ctx(ctx).merge_var_decls(stmts);

        drop_invalid_stmts(stmts);

        if stmts.len() == 1 {
            if let Stmt::Expr(ExprStmt { expr, .. }) = &stmts[0] {
                if let Expr::Lit(Lit::Str(s)) = &**expr {
                    if s.value == *"use strict" {
                        stmts.clear();
                    }
                }
            }
        }

        if cfg!(debug_assertions) {
            stmts.visit_with(&mut AssertValid);
        }
    }

    fn visit_mut_str(&mut self, s: &mut Str) {
        s.visit_mut_children_with(self);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_mut_super_prop_expr(&mut self, n: &mut SuperPropExpr) {
        if let SuperProp::Computed(c) = &mut n.prop {
            let ctx = Ctx {
                is_exact_lhs_of_assign: false,
                is_lhs_of_assign: false,
                ..self.ctx
            };
            c.visit_mut_with(&mut *self.with_ctx(ctx));
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_mut_switch_cases(&mut self, n: &mut Vec<SwitchCase>) {
        n.visit_mut_children_with(self);

        self.optimize_switch_cases(n);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_mut_switch_stmt(&mut self, n: &mut SwitchStmt) {
        n.discriminant.visit_mut_with(self);

        self.drop_unreachable_cases(n);

        n.cases.visit_mut_with(self);
    }

    /// We don't optimize [Tpl] contained in [TaggedTpl].
    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_mut_tagged_tpl(&mut self, n: &mut TaggedTpl) {
        n.tag.visit_mut_with(self);

        n.tpl.exprs.visit_mut_with(self);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_mut_throw_stmt(&mut self, n: &mut ThrowStmt) {
        n.visit_mut_children_with(self);

        self.optimize_in_fn_termination(&mut n.arg);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
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

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_mut_try_stmt(&mut self, n: &mut TryStmt) {
        let ctx = Ctx {
            in_try_block: true,
            ..self.ctx
        };
        n.block.visit_mut_with(&mut *self.with_ctx(ctx));

        n.handler.visit_mut_with(self);

        n.finalizer.visit_mut_with(self);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_mut_unary_expr(&mut self, n: &mut UnaryExpr) {
        let ctx = Ctx {
            in_bang_arg: n.op == op!("!"),
            is_delete_arg: n.op == op!("delete"),
            ..self.ctx
        };

        n.visit_mut_children_with(&mut *self.with_ctx(ctx));

        // infinite loop
        if n.op == op!("void") {
            match &*n.arg {
                Expr::Lit(Lit::Num(..)) => {}

                _ => {
                    report_change!("Ignoring arg of `void`");
                    let arg = self.ignore_return_value(&mut n.arg);

                    n.arg = Box::new(arg.unwrap_or_else(|| make_number(DUMMY_SP, 0.0)));
                }
            }
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_mut_update_expr(&mut self, n: &mut UpdateExpr) {
        let ctx = Ctx {
            is_update_arg: true,
            ..self.ctx
        };

        n.visit_mut_children_with(&mut *self.with_ctx(ctx));
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
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
                        report_change!(
                            "Dropping explicit initializer which evaluates to `undefined`"
                        );

                        var.init = None;
                    }
                }
            });
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_mut_var_declarator(&mut self, var: &mut VarDeclarator) {
        var.name.visit_mut_with(self);

        var.init.visit_mut_with(self);

        self.remove_duplicate_name_of_function(var);

        self.store_var_for_inlining(var);
        self.store_var_for_prop_hoisting(var);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
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

        let uses_eval = self.data.scopes.get(&self.ctx.scope).unwrap().has_eval_call;

        if !uses_eval {
            for v in vars.iter_mut() {
                if v.init
                    .as_deref()
                    .map(|e| !e.is_ident() && !e.may_have_side_effects())
                    .unwrap_or(true)
                {
                    self.drop_unused_var_declarator(v, &mut None);
                }
            }

            let mut can_prepend = true;
            let mut side_effects = vec![];

            for v in vars.iter_mut() {
                let mut storage = None;
                self.drop_unused_var_declarator(v, &mut storage);
                side_effects.extend(storage);

                // Dropped. Side effects of the initializer is stored in `side_effects`.
                if v.name.is_invalid() {
                    continue;
                }

                // If initializer is none, we can check next item without thinking about side
                // effects.
                if v.init.is_none() {
                    continue;
                }

                // We can drop the next variable, as we don't have to worry about the side
                // effect.
                if side_effects.is_empty() {
                    can_prepend = false;
                    continue;
                }

                // We now have to handle side effects.

                if can_prepend {
                    can_prepend = false;

                    self.prepend_stmts.push(Stmt::Expr(ExprStmt {
                        span: DUMMY_SP,
                        expr: if side_effects.len() == 1 {
                            side_effects.remove(0)
                        } else {
                            Box::new(Expr::Seq(SeqExpr {
                                span: DUMMY_SP,
                                exprs: side_effects.take(),
                            }))
                        },
                    }));
                } else {
                    // We prepend side effects to the initializer.

                    let seq = v.init.as_mut().unwrap().force_seq();
                    seq.exprs = side_effects
                        .drain(..)
                        .into_iter()
                        .chain(seq.exprs.take())
                        .filter(|e| !e.is_invalid())
                        .collect();
                }
            }

            // We append side effects.
            if !side_effects.is_empty() {
                self.append_stmts.push(Stmt::Expr(ExprStmt {
                    span: DUMMY_SP,
                    expr: if side_effects.len() == 1 {
                        side_effects.remove(0)
                    } else {
                        Box::new(Expr::Seq(SeqExpr {
                            span: DUMMY_SP,
                            exprs: side_effects,
                        }))
                    },
                }));
            }

            vars.retain_mut(|var| {
                if var.name.is_invalid() {
                    self.changed = true;
                    return false;
                }

                if let Some(Expr::Invalid(..)) = var.init.as_deref() {
                    if let Pat::Ident(i) = &var.name {
                        if let Some(usage) = self.data.vars.get(&i.id.to_id()) {
                            if usage.declared_as_catch_param {
                                var.init = None;
                                return true;
                            }
                        }
                    }

                    return false;
                }

                true
            });
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_mut_while_stmt(&mut self, n: &mut WhileStmt) {
        {
            let ctx = Ctx {
                executed_multiple_time: true,
                ..self.ctx
            };
            n.visit_mut_children_with(&mut *self.with_ctx(ctx));
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_mut_yield_expr(&mut self, n: &mut YieldExpr) {
        n.visit_mut_children_with(self);

        if let Some(arg) = &mut n.arg {
            self.compress_undefined(&mut **arg);

            if !n.delegate && is_pure_undefined(arg) {
                n.arg = None;
            }
        }
    }
}

/// If true, `0` in `(0, foo.bar)()` is preserved.
fn is_callee_this_aware(callee: &Expr) -> bool {
    match &*callee {
        Expr::Arrow(..) => return false,
        Expr::Seq(..) => return true,
        Expr::Member(MemberExpr { obj, .. }) => {
            if let Expr::Ident(obj) = &**obj {
                if &*obj.sym == "console" {
                    return false;
                }
            }
        }

        _ => {}
    }

    true
}

fn is_expr_access_to_arguments(l: &Expr) -> bool {
    match l {
        Expr::Member(MemberExpr { obj, .. }) => matches!(
            &**obj,
            Expr::Ident(Ident {
                sym: js_word!("arguments"),
                ..
            })
        ),
        _ => false,
    }
}

fn is_left_access_to_arguments(l: &PatOrExpr) -> bool {
    match l {
        PatOrExpr::Expr(e) => is_expr_access_to_arguments(e),
        PatOrExpr::Pat(pat) => match &**pat {
            Pat::Expr(e) => is_expr_access_to_arguments(e),
            _ => false,
        },
    }
}

#[derive(Debug, Default, PartialEq)]
struct SynthesizedStmts(Vec<Stmt>);

impl SynthesizedStmts {
    fn take_stmts(&mut self) -> Vec<Stmt> {
        take(&mut self.0)
    }
}

impl std::ops::Deref for SynthesizedStmts {
    type Target = Vec<Stmt>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl std::ops::DerefMut for SynthesizedStmts {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}

impl Take for SynthesizedStmts {
    fn dummy() -> Self {
        Self(Take::dummy())
    }
}

impl Drop for SynthesizedStmts {
    fn drop(&mut self) {
        if !self.0.is_empty() {
            panic!("We should not drop synthesized stmts");
        }
    }
}
