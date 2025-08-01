#![allow(clippy::collapsible_match)]

use std::iter::once;

use bitflags::bitflags;
use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::Atom;
use swc_common::{pass::Repeated, util::take::Take, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::rename::contains_eval;
use swc_ecma_transforms_optimization::debug_assert_valid;
use swc_ecma_usage_analyzer::{analyzer::UsageAnalyzer, marks::Marks};
use swc_ecma_utils::{
    prepend_stmts, ExprCtx, ExprExt, ExprFactory, IdentUsageFinder, IsEmpty, ModuleItemLike,
    StmtLike, Type, Value,
};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith, VisitWith};
#[cfg(feature = "debug")]
use tracing::{span, Level};
use Value::Known;

use self::{
    unused::PropertyAccessOpts,
    util::{extract_class_side_effect, Finalizer, NormalMultiReplacer, SynthesizedStmts},
};
use super::util::{drop_invalid_stmts, is_fine_for_if_cons};
#[cfg(feature = "debug")]
use crate::debug::dump;
use crate::{
    compress::util::is_pure_undefined,
    debug::AssertValid,
    maybe_par,
    mode::Mode,
    option::{CompressOptions, MangleOptions},
    program_data::{ProgramData, ScopeData, VarUsageInfoFlags},
    util::{contains_leaping_continue_with_label, make_number, ExprOptExt, ModuleItemExt},
};

mod arguments;
mod bools;
mod conditionals;
mod dead_code;
mod evaluate;
mod if_return;
mod iife;
mod inline;
mod loops;
mod ops;
mod props;
mod rest_params;
mod sequences;
mod strings;
mod unused;
mod util;

/// This pass is similar to `node.optimize` of terser.
pub(super) fn optimizer<'a>(
    marks: Marks,
    options: &'a CompressOptions,
    mangle_options: Option<&'a MangleOptions>,
    data: &'a mut ProgramData,
    mode: &'a dyn Mode,
) -> impl 'a + VisitMut + Repeated {
    assert!(
        options.top_retain.iter().all(|s| s.trim() != ""),
        "top_retain should not contain empty string"
    );

    let ctx = Ctx {
        expr_ctx: ExprCtx {
            unresolved_ctxt: SyntaxContext::empty().apply_mark(marks.unresolved_mark),
            is_unresolved_ref_safe: false,
            in_strict: options.module,
            remaining_depth: 6,
        },
        scope: SyntaxContext::default(),
        bit_ctx: BitCtx::default(),
    };

    Optimizer {
        marks,
        changed: false,
        options,
        mangle_options,
        prepend_stmts: Default::default(),
        append_stmts: Default::default(),
        vars: Default::default(),
        typeofs: Default::default(),
        data,
        ctx,
        mode,
        functions: Default::default(),
    }
}

/// Syntactic context.
///
/// This should not be modified directly. Use `.with_ctx()` instead.
#[derive(Debug, Clone)]
struct Ctx {
    expr_ctx: ExprCtx,

    /// Current scope.
    scope: SyntaxContext,

    bit_ctx: BitCtx,
}

impl Ctx {
    #[inline]
    pub fn with(mut self, flags: BitCtx, value: bool) -> Self {
        self.bit_ctx = self.bit_ctx.with(flags, value);
        self
    }
}
bitflags! {
    #[derive(Debug, Clone, Copy, Default)]
    pub(crate) struct BitCtx: u32 {
        /// `true` if the [VarDecl] has const annotation.
        const IsConst = 1 << 0;
        const IsVar = 1 << 1;
        const IsLet = 1 << 2;

        const DontUsePrependNorAppend = 1 << 3;

        const InBoolCtx = 1 << 4;

        const InAsm = 1 << 5;

        /// `true` only for [Callee::Expr].
        const IsCallee = 1 << 6;

        /// `true` if we are try block. `true` means we cannot be sure about control
        /// flow.
        const InTryBlock = 1 << 7;

        /// `true` while handling `test` of if / while / for.
        const InCond = 1 << 8;

        /// `true` if we are in `arg` of `delete arg`.
        const IsDeleteArg = 1 << 9;

        /// `true` if we are in `arg` of `++arg` or `--arg`.
        const IsUpdateArg = 1 << 10;

        const IsLhsOfAssign = 1 << 11;

        /// `false` for `d` in `d[0] = foo`.
        const IsExactLhsOfAssign = 1 << 12;

        /// `true` for loop bodies and conditions of loops.
        const ExecutedMultipleTime = 1 << 13;

        /// `true` while handling `expr` of `!expr`
        const InBangArg = 1 << 14;

        const InVarDeclOfForInOrOfLoop = 1 << 15;

        const DontUseNegatedIife = 1 << 16;

        /// `true` while handling top-level export decls.
        const IsExported = 1 << 17;

        /// `true` while handling top level items.
        const TopLevel = 1 << 18;

        /// `true` while we are in a function or something similar.
        const InFnLike = 1 << 19;

        const InBlock = 1 << 20;

        const InObjOfNonComputedMember = 1 << 21;

        const InTplExpr = 1 << 22;

        /// True while handling callee, except an arrow expression in callee.
        const IsThisAwareCallee = 1 << 23;

        const IsNestedIfReturnMerging = 1 << 24;

        const DontInvokeIife = 1 << 25;

        const InWithStmt = 1 << 26;

        const InParam = 1 << 27;

        /// `true` while we are inside a class body.
        const InClass = 1 << 28;
    }
}

impl BitCtx {
    #[inline]
    fn with(mut self, flags: Self, value: bool) -> Self {
        self.set(flags, value);
        self
    }
}

impl Ctx {
    pub fn is_top_level_for_block_level_vars(&self) -> bool {
        if !self.bit_ctx.contains(BitCtx::TopLevel) {
            return false;
        }

        if self.bit_ctx.intersects(BitCtx::InFnLike | BitCtx::InBlock) {
            return false;
        }
        true
    }

    pub fn in_top_level(&self) -> bool {
        self.bit_ctx.contains(BitCtx::TopLevel) || !self.bit_ctx.contains(BitCtx::InFnLike)
    }
}

struct Optimizer<'a> {
    marks: Marks,

    changed: bool,
    options: &'a CompressOptions,
    mangle_options: Option<&'a MangleOptions>,
    /// Statements prepended to the current statement.
    prepend_stmts: SynthesizedStmts,
    /// Statements appended to the current statement.
    append_stmts: SynthesizedStmts,

    vars: Vars,

    typeofs: Box<FxHashMap<Id, Atom>>,
    /// This information is created by analyzing identifier usages.
    ///
    /// This is calculated multiple time, but only once per one
    /// `visit_mut_module`.
    data: &'a mut ProgramData,
    ctx: Ctx,

    mode: &'a dyn Mode,

    functions: Box<FxHashMap<Id, FnMetadata>>,
}

#[derive(Default)]
struct Vars {
    /// Cheap to clone.
    ///
    /// Used for inlining.
    lits: FxHashMap<Id, Box<Expr>>,

    /// Used for `hoist_props`.
    hoisted_props: Box<FxHashMap<(Id, Atom), Ident>>,

    /// Literals which are cheap to clone, but not sure if we can inline without
    /// making output bigger.
    ///
    /// https://github.com/swc-project/swc/issues/4415
    lits_for_cmp: FxHashMap<Id, Box<Expr>>,

    /// This stores [Expr::Array] if all elements are literals.
    lits_for_array_access: FxHashMap<Id, Box<Expr>>,

    /// Used for copying functions.
    ///
    /// We use this to distinguish [Callee::Expr] from other [Expr]s.
    simple_functions: FxHashMap<Id, Box<Expr>>,
    vars_for_inlining: FxHashMap<Id, Box<Expr>>,

    /// Variables which should be removed by [Finalizer] because of the order of
    /// visit.
    removed: FxHashSet<Id>,
}

impl Vars {
    fn has_pending_inline_for(&self, id: &Id) -> bool {
        self.lits.contains_key(id) || self.vars_for_inlining.contains_key(id)
    }

    /// Returns true if something is changed.
    fn inline_with_multi_replacer<N>(&mut self, n: &mut N) -> bool
    where
        N: for<'aa> VisitMutWith<NormalMultiReplacer<'aa>>,
        N: for<'aa> VisitMutWith<Finalizer<'aa>>,
    {
        let mut changed = false;
        if !self.simple_functions.is_empty()
            || !self.lits.is_empty()
            || !self.lits_for_cmp.is_empty()
            || !self.lits_for_array_access.is_empty()
            || !self.hoisted_props.is_empty()
            || !self.removed.is_empty()
        {
            let mut v = Finalizer {
                simple_functions: &self.simple_functions,
                lits_for_cmp: &self.lits_for_cmp,
                lits_for_array_access: &self.lits_for_array_access,
                lits: &self.lits,
                hoisted_props: &self.hoisted_props,
                vars_to_remove: &self.removed,
                changed: false,
            };
            n.visit_mut_with(&mut v);
            changed |= v.changed;
        }

        if !self.vars_for_inlining.is_empty() {
            let mut v = NormalMultiReplacer::new(&mut self.vars_for_inlining);
            n.visit_mut_with(&mut v);
            changed |= v.changed;
        }

        changed
    }
}

impl Repeated for Optimizer<'_> {
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

impl Optimizer<'_> {
    fn may_remove_ident(&self, id: &Ident) -> bool {
        if self
            .data
            .vars
            .get(&id.to_id())
            .is_some_and(|v| v.flags.contains(VarUsageInfoFlags::EXPORTED))
        {
            return false;
        }

        if id.ctxt != self.marks.top_level_ctxt {
            return true;
        }

        if self.options.top_level() {
            return !self.options.top_retain.contains(&id.sym);
        }

        false
    }

    fn may_add_ident(&self) -> bool {
        if self.ctx.in_top_level() && self.data.top.contains(ScopeData::HAS_EVAL_CALL) {
            return false;
        }

        if self
            .data
            .scopes
            .get(&self.ctx.scope)
            .unwrap()
            .contains(ScopeData::HAS_EVAL_CALL)
        {
            return false;
        }

        if !self.ctx.in_top_level() {
            return true;
        }

        self.options.top_level()
    }

    fn at_class_field(&self) -> bool {
        self.ctx.bit_ctx.contains(BitCtx::InClass)
            && !self
                .ctx
                .bit_ctx
                .intersects(BitCtx::InFnLike | BitCtx::InBlock)
    }

    fn ident_reserved(&self, sym: &Atom) -> bool {
        if let Some(MangleOptions { reserved, .. }) = self.mangle_options {
            reserved.contains(sym)
        } else {
            false
        }
    }

    fn handle_stmts(&mut self, stmts: &mut Vec<Stmt>, will_terminate: bool) {
        // Skip if `use asm` exists.
        if maybe_par!(
            stmts.iter().any(|stmt| match stmt.as_stmt() {
                Some(Stmt::Expr(stmt)) => match &*stmt.expr {
                    Expr::Lit(Lit::Str(Str { raw, .. })) => {
                        matches!(raw, Some(value) if value == "\"use asm\"" || value == "'use asm'")
                    }
                    _ => false,
                },
                _ => false,
            }),
            *crate::LIGHT_TASK_PARALLELS
        ) {
            return;
        }

        self.with_ctx(self.ctx.clone()).inject_else(stmts);

        self.with_ctx(self.ctx.clone())
            .handle_stmt_likes(stmts, will_terminate);

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

        #[cfg(debug_assertions)]
        {
            stmts.visit_with(&mut AssertValid);
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn handle_stmt_likes<T>(&mut self, stmts: &mut Vec<T>, will_terminate: bool)
    where
        T: StmtLike + ModuleItemLike + ModuleItemExt + VisitMutWith<Self> + VisitWith<AssertValid>,
        Vec<T>: VisitMutWith<Self> + VisitWith<UsageAnalyzer<ProgramData>> + VisitWith<AssertValid>,
    {
        let mut use_asm = false;
        let prepend_stmts = self.prepend_stmts.take();
        let append_stmts = self.append_stmts.take();

        {
            let mut child_ctx = self.ctx.clone();
            let mut directive_count = 0;

            if !stmts.is_empty() {
                // TODO: Handle multiple directives.
                if let Some(Stmt::Expr(ExprStmt { expr, .. })) = stmts[0].as_stmt() {
                    if let Expr::Lit(Lit::Str(v)) = &**expr {
                        directive_count += 1;

                        match &v.raw {
                            Some(value) if value == "\"use strict\"" || value == "'use strict'" => {
                                child_ctx.expr_ctx.in_strict = true;
                            }
                            Some(value) if value == "\"use asm\"" || value == "'use asm'" => {
                                child_ctx.bit_ctx.insert(BitCtx::InAsm);
                                self.ctx.bit_ctx.insert(BitCtx::InAsm);
                                use_asm = true;
                            }
                            _ => {}
                        }
                    }
                }
            }

            let mut new = Vec::with_capacity(stmts.len() * 11 / 10);
            for (i, mut stmt) in stmts.take().into_iter().enumerate() {
                // debug_assert_eq!(self.prepend_stmts, Vec::new());
                // debug_assert_eq!(self.append_stmts, Vec::new());

                if i < directive_count {
                    // Don't set in_strict for directive itself.
                    stmt.visit_mut_with(self);
                } else {
                    let child_optimizer = &mut *self.with_ctx(child_ctx.clone());
                    stmt.visit_mut_with(child_optimizer);
                }

                #[cfg(debug_assertions)]
                {
                    stmt.visit_with(&mut AssertValid);
                }

                new.extend(self.prepend_stmts.drain(..).map(T::from));

                match stmt.try_into_stmt() {
                    Ok(Stmt::Block(s)) if s.ctxt.has_mark(self.marks.fake_block) => {
                        new.extend(s.stmts.into_iter().map(T::from));
                    }
                    Ok(s) => {
                        new.push(T::from(s));
                    }
                    Err(stmt) => {
                        new.push(stmt);
                    }
                }

                new.extend(self.append_stmts.drain(..).map(T::from));
            }
            *stmts = new;
        }

        if use_asm {
            self.ctx.bit_ctx.insert(BitCtx::InAsm);
        }

        #[cfg(debug_assertions)]
        {
            stmts.visit_with(&mut AssertValid);
        }

        self.merge_sequences_in_stmts(stmts, will_terminate);

        #[cfg(debug_assertions)]
        {
            stmts.visit_with(&mut AssertValid);
        }

        self.merge_similar_ifs(stmts);

        #[cfg(debug_assertions)]
        {
            stmts.visit_with(&mut AssertValid);
        }

        self.make_sequences(stmts);

        #[cfg(debug_assertions)]
        {
            stmts.visit_with(&mut AssertValid);
        }

        self.drop_else_token(stmts);

        #[cfg(debug_assertions)]
        {
            stmts.visit_with(&mut AssertValid);
        }

        // stmts.extend(self.append_stmts.drain(..).map(T::from));

        drop_invalid_stmts(stmts);

        // debug_assert_eq!(self.prepend_stmts, Vec::new());
        self.prepend_stmts = prepend_stmts;
        self.append_stmts = append_stmts;
    }

    ///
    /// - `undefined` => `void 0`
    fn compress_undefined(&mut self, e: &mut Expr) {
        if let Expr::Ident(Ident { span, sym, .. }) = e {
            if &**sym == "undefined" {
                *e = *Expr::undefined(*span);
            }
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
                *e = UnaryExpr {
                    span: v.span,
                    op: op!("!"),
                    arg: Lit::Num(Number {
                        span: v.span,
                        value: if v.value { 0.0 } else { 1.0 },
                        raw: None,
                    })
                    .into(),
                }
                .into();
            }
        }
    }

    /// This function will be costly if the expr is a very long binary expr.
    /// Call it only when necessary.
    /// See also compress::pure::misc::remove_invalid
    fn remove_invalid_bin(&mut self, e: &mut Expr) {
        if let Expr::Bin(BinExpr { left, right, .. }) = e {
            self.remove_invalid_bin(left);
            self.remove_invalid_bin(right);

            if left.is_invalid() {
                *e = *right.take();
                self.remove_invalid_bin(e);
            } else if right.is_invalid() {
                *e = *left.take();
                self.remove_invalid_bin(e);
            }
        }
    }

    /// Returns [None] if expression is side-effect-free.
    /// If an expression has a side effect, only side effects are returned.
    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn ignore_return_value(&mut self, e: &mut Expr) -> Option<Expr> {
        self.compress_cond_to_logical_ignoring_return_value(e);

        self.drop_unused_update(e);

        self.drop_unused_op_assign(e);

        match e {
            Expr::This(_) | Expr::Invalid(_) | Expr::Lit(..) => {
                report_change!(
                    "ignore_return_value: Dropping unused expr: {}",
                    dump(&*e, false)
                );
                // We don't need to run this again
                // self.changed = true;
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
                // Do not remove class if it's self-referencing
                if let Some(id) = &cls.ident {
                    if IdentUsageFinder::find(id, &cls.class.body) {
                        return Some(cls.take().into());
                    }
                }

                if cls
                    .class
                    .body
                    .iter()
                    .any(|m| m.as_static_block().iter().any(|s| !s.body.is_empty()))
                {
                    // there's nothing we can do about it
                    return Some(cls.take().into());
                }

                report_change!(
                    "ignore_return_value: Dropping unused class expr as it does not have any side \
                     effect"
                );
                self.changed = true;

                let exprs: Vec<Box<Expr>> =
                    extract_class_side_effect(self.ctx.expr_ctx, *cls.class.take())
                        .into_iter()
                        .filter_map(|mut e| self.ignore_return_value(&mut e))
                        .map(Box::new)
                        .collect();

                if exprs.is_empty() {
                    return None;
                }

                return Some(
                    SeqExpr {
                        span: cls.class.span,
                        exprs,
                    }
                    .into(),
                );
            }

            Expr::Paren(e) => return self.ignore_return_value(&mut e.expr),

            Expr::Bin(BinExpr {
                op, left, right, ..
            }) if op.may_short_circuit() => {
                let ctx = self.ctx.clone().with(
                    BitCtx::DontUseNegatedIife,
                    self.ctx.bit_ctx.contains(BitCtx::DontUseNegatedIife)
                        || self.options.side_effects,
                );
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
            Expr::Bin(
                bin @ BinExpr {
                    op:
                        op!(bin, "+")
                        | op!(bin, "-")
                        | op!("*")
                        | op!("%")
                        | op!("**")
                        | op!("^")
                        | op!("&")
                        | op!("|")
                        | op!(">>")
                        | op!("<<")
                        | op!(">>>")
                        | op!("===")
                        | op!("!==")
                        | op!("==")
                        | op!("!=")
                        | op!("<")
                        | op!("<=")
                        | op!(">")
                        | op!(">="),
                    ..
                },
            ) => {
                let left = self.ignore_return_value(&mut bin.left);
                let right = self.ignore_return_value(&mut bin.right);
                let span = bin.span;

                if left.is_none() && right.is_none() {
                    return None;
                } else if right.is_none() {
                    return left;
                } else if left.is_none() {
                    return right;
                }

                self.changed = true;
                report_change!("ignore_return_value: Compressing binary as seq");
                return Some(
                    SeqExpr {
                        span,
                        exprs: vec![Box::new(left.unwrap()), Box::new(right.unwrap())],
                    }
                    .into(),
                );
            }

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
                Expr::Arrow(f) => match &*f.body {
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
                            if !usage.flags.contains(VarUsageInfoFlags::REASSIGNED)
                                && usage.flags.contains(VarUsageInfoFlags::PURE_FN)
                            {
                                self.changed = true;
                                report_change!("Reducing function call to a variable");

                                if args.iter().any(|arg| arg.spread.is_some()) {
                                    let elems = args
                                        .take()
                                        .into_iter()
                                        .filter_map(|mut arg| {
                                            if arg.spread.is_some() {
                                                return Some(arg);
                                            }
                                            self.ignore_return_value(&mut arg.expr)
                                                .map(Box::new)
                                                .map(|expr| ExprOrSpread { expr, spread: None })
                                        })
                                        .map(Some)
                                        .collect::<Vec<_>>();

                                    if elems.is_empty() {
                                        return None;
                                    }

                                    return Some(
                                        ArrayLit {
                                            span: callee.span,
                                            elems,
                                        }
                                        .into(),
                                    );
                                }

                                let args = args
                                    .take()
                                    .into_iter()
                                    .filter_map(|mut arg| self.ignore_return_value(&mut arg.expr))
                                    .map(Box::new)
                                    .collect::<Vec<_>>();

                                if args.is_empty() {
                                    return None;
                                }

                                return Some(
                                    SeqExpr {
                                        span: callee.span,
                                        exprs: args,
                                    }
                                    .into(),
                                );
                            }
                        }
                    }
                }

                return Some(e.take());
            }

            Expr::Assign(AssignExpr {
                op: op!("="),
                left: AssignTarget::Simple(SimpleAssignTarget::Ident(i)),
                right,
                ..
            }) => {
                let old = i.id.to_id();
                self.store_var_for_inlining(&mut i.id, right, true);

                if i.is_dummy() && self.options.unused {
                    report_change!("inline: Removed variable ({}{:?})", old.0, old.1);
                    self.vars.removed.insert(old);
                }

                if right.is_invalid() {
                    return None;
                }
            }

            Expr::Assign(AssignExpr {
                op,
                left: left @ AssignTarget::Simple(_),
                right,
                ..
            }) if !op.may_short_circuit() => {
                if let AssignTarget::Simple(expr) = left {
                    if let SimpleAssignTarget::Member(m) = expr {
                        if !m.obj.may_have_side_effects(self.ctx.expr_ctx)
                            && (m.obj.is_object()
                                || m.obj.is_fn_expr()
                                || m.obj.is_arrow()
                                || m.obj.is_class())
                        {
                            if self.should_preserve_property_access(
                                &m.obj,
                                PropertyAccessOpts {
                                    allow_getter: true,
                                    only_ident: false,
                                },
                            ) {
                                return Some(e.take());
                            } else {
                                report_change!(
                                    "ignore_return_value: Dropping unused assign target: {}",
                                    dump(&*expr, false)
                                );
                                return Some(*right.take());
                            }
                        }
                    }
                }
                return Some(e.take());
            }

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

            Expr::MetaProp(_)
            | Expr::Await(_)
            | Expr::New(..)
            | Expr::Call(..)
            | Expr::Yield(_)
            | Expr::Assign(_)
            | Expr::PrivateName(_)
            | Expr::Update(_) => return Some(e.take()),

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
                if arr.elems.iter().any(|e| match e {
                    Some(ExprOrSpread {
                        spread: Some(..), ..
                    }) => true,
                    _ => false,
                }) {
                    return Some(
                        ArrayLit {
                            elems: arr
                                .elems
                                .take()
                                .into_iter()
                                .flatten()
                                .filter_map(|mut e| {
                                    if e.spread.is_some() {
                                        return Some(e);
                                    }

                                    self.ignore_return_value(&mut e.expr)
                                        .map(Box::new)
                                        .map(|expr| ExprOrSpread { expr, spread: None })
                                })
                                .map(Some)
                                .collect(),
                            ..*arr
                        }
                        .into(),
                    );
                }

                let mut exprs = Vec::new();
                self.changed = true;
                report_change!("ignore_return_value: Inverting an array literal");
                exprs.extend(
                    arr.elems
                        .take()
                        .into_iter()
                        .flatten()
                        .map(|e| e.expr)
                        .filter_map(|mut e| self.ignore_return_value(&mut e))
                        .map(Box::new),
                );

                if exprs.is_empty() {
                    return None;
                }

                return Some(
                    SeqExpr {
                        span: arr.span,
                        exprs,
                    }
                    .into(),
                );
            }

            Expr::Object(obj) => {
                let mut exprs = Vec::new();
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

                            Prop::Assign(mut prop) => {
                                exprs.extend(
                                    self.ignore_return_value(&mut prop.value).map(Box::new),
                                );
                            }

                            Prop::Shorthand(_) => {}
                        },
                    }
                }

                if exprs.is_empty() {
                    return None;
                }

                return Some(
                    SeqExpr {
                        span: obj.span,
                        exprs,
                    }
                    .into(),
                );
            }

            // Preserves negated iife
            Expr::Unary(UnaryExpr {
                op: op!("!"), arg, ..
            }) if (self.options.negate_iife
                || self.options.reduce_vars
                || self.options.side_effects)
                && !self.ctx.bit_ctx.contains(BitCtx::DontUseNegatedIife)
                && match &**arg {
                    Expr::Call(arg) => match &arg.callee {
                        Callee::Expr(callee) => matches!(&**callee, Expr::Fn(..)),
                        _ => false,
                    },
                    _ => false,
                } =>
            {
                let processed_arg = self.ignore_return_value(arg)?;

                *arg = Box::new(processed_arg);

                log_abort!("ignore_return_value: Preserving negated iife");
                return Some(e.take());
            }

            // `delete` is handled above
            Expr::Unary(expr) => {
                self.changed = true;
                report_change!("ignore_return_value: Reducing unary ({})", expr.op);

                // We can ignore the identifier in case of typeof
                if expr.op == op!("typeof") && expr.arg.is_ident() {
                    return None;
                }
                return self.ignore_return_value(&mut expr.arg);
            }

            Expr::Bin(BinExpr {
                span,
                left,
                right,
                #[cfg(feature = "debug")]
                op,
                ..
            }) => {
                report_change!("ignore_return_value: Reducing binary ({})", *op);

                let left = self.ignore_return_value(left).map(Box::new);
                let right = self.ignore_return_value(right).map(Box::new);

                let mut seq = SeqExpr {
                    span: *span,
                    exprs: left.into_iter().chain(right).collect(),
                }
                .into();
                return self.ignore_return_value(&mut seq);
            }

            Expr::Cond(cond) => {
                trace_op!("ignore_return_value: Cond expr");

                self.restore_negated_iife(cond);

                let ctx = self.ctx.clone().with(
                    BitCtx::DontUseNegatedIife,
                    self.ctx.bit_ctx.contains(BitCtx::DontUseNegatedIife)
                        || self.options.side_effects,
                );

                let cons_span = cond.cons.span();
                let alt_span = cond.alt.span();
                let cons = self
                    .with_ctx(ctx.clone())
                    .ignore_return_value(&mut cond.cons)
                    .map(Box::new);
                let alt = self
                    .with_ctx(ctx.clone())
                    .ignore_return_value(&mut cond.alt)
                    .map(Box::new);

                // TODO: Remove if test is side effect free.

                return Some(
                    CondExpr {
                        span: cond.span,
                        test: cond.test.take(),
                        cons: cons.unwrap_or_else(|| {
                            report_change!("ignore_return_value: Dropped `cons`");
                            self.changed = true;
                            Expr::undefined(cons_span)
                        }),
                        alt: alt.unwrap_or_else(|| {
                            report_change!("ignore_return_value: Dropped `alt`");
                            self.changed = true;
                            Expr::undefined(alt_span)
                        }),
                    }
                    .into(),
                );
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

                        if idx == 0
                            && self.ctx.bit_ctx.contains(BitCtx::IsThisAwareCallee)
                            && is_injected_zero
                        {
                            return Some(*expr.take());
                        }
                        let ctx = self.ctx.clone().with(BitCtx::DontUseNegatedIife, idx != 0);
                        self.with_ctx(ctx).ignore_return_value(expr)
                    })
                    .map(Box::new)
                    .collect::<Vec<_>>();
                if exprs.len() <= 1 {
                    return exprs.pop().map(|v| *v);
                } else {
                    let is_last_undefined =
                        is_pure_undefined(self.ctx.expr_ctx, exprs.last().unwrap());

                    // (foo(), void 0) => void foo()
                    if is_last_undefined {
                        self.changed = true;
                        // Remove `void 0`
                        exprs.pop();

                        // Make return type undefined.
                        if let Some(last) = exprs.last_mut() {
                            report_change!("ignore_return_value: Shifting void");
                            self.changed = true;
                            *last = UnaryExpr {
                                span: DUMMY_SP,
                                op: op!("void"),
                                arg: last.take(),
                            }
                            .into();
                        }
                    }

                    if exprs.is_empty() {
                        report_change!("ignore_return_value: Dropping empty seq");
                        return None;
                    }

                    return Some(
                        SeqExpr {
                            span: seq.span,
                            exprs,
                        }
                        .into(),
                    );
                }
            }

            Expr::Ident(id) if id.ctxt != self.ctx.expr_ctx.unresolved_ctxt => {
                report_change!("ignore_return_value: Dropping a declared ident {}", id);
                self.changed = true;
                return None;
            }
            _ => {}
        }

        Some(e.take())
    }

    fn try_removing_block(&mut self, s: &mut Stmt, allow_fn_decl: bool) {
        match s {
            Stmt::Block(bs) => {
                if bs.stmts.is_empty() {
                    report_change!("Converting empty block to empty statement");
                    *s = EmptyStmt { span: DUMMY_SP }.into();
                    return;
                }

                // Remove nested blocks
                if bs.stmts.len() == 1 {
                    if let Stmt::Block(block) = &mut bs.stmts[0] {
                        let stmts = &block.stmts;
                        if maybe_par!(
                            stmts.iter().all(|stmt| !matches!(stmt, Stmt::Decl(..))),
                            *crate::LIGHT_TASK_PARALLELS
                        ) {
                            report_change!("optimizer: Removing nested block");
                            self.changed = true;
                            bs.stmts = block.stmts.take();
                        }
                    }
                }

                for stmt in &mut bs.stmts {
                    if let Stmt::Block(block) = &stmt {
                        if block.stmts.is_empty() {
                            self.changed = true;
                            report_change!("optimizer: Removing empty block");
                            *stmt = EmptyStmt { span: DUMMY_SP }.into();
                            return;
                        }
                    }
                }

                if bs.stmts.len() == 1 {
                    match &bs.stmts[0] {
                        Stmt::Expr(..) | Stmt::If(..) => {
                            *s = bs.stmts[0].take();
                            report_change!("optimizer: Unwrapping block stmt");
                            self.changed = true;
                        }
                        // Annex B the darkest part of JS
                        Stmt::Decl(Decl::Fn(f))
                            if allow_fn_decl
                                && !self.ctx.expr_ctx.in_strict
                                && !f.function.is_generator
                                && !f.function.is_async =>
                        {
                            *s = bs.stmts[0].take();
                            report_change!("optimizer: Unwrapping block stmt in non strcit mode");
                            self.changed = true;
                        }
                        Stmt::Decl(Decl::Var(v)) if v.kind == VarDeclKind::Var => {
                            report_change!("optimizer: Unwrapping a block with var decl statement");
                            self.changed = true;
                            *s = bs.stmts[0].take();
                            return;
                        }
                        Stmt::Decl(Decl::Class(_) | Decl::Var(_) | Decl::Fn(_)) => (),
                        _ => {
                            if bs.ctxt.has_mark(self.marks.fake_block) {
                                report_change!("Unwrapping a fake block");
                                *s = bs.stmts.take().into_iter().next().unwrap();
                                return;
                            }
                        }
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
                        self.try_removing_block(alt, false);
                    }
                }
            }

            Stmt::ForIn(s) => {
                self.try_removing_block(&mut s.body, false);
            }

            Stmt::For(s) => {
                self.try_removing_block(&mut s.body, false);
            }

            Stmt::ForOf(s) => {
                self.try_removing_block(&mut s.body, false);
            }

            Stmt::While(s) => {
                self.try_removing_block(&mut s.body, false);
            }

            Stmt::DoWhile(s) => {
                self.try_removing_block(&mut s.body, false);
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
                *s = EmptyStmt { span: block.span }.into();
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
                *s = ExprStmt {
                    span: stmt.span,
                    expr: Box::new(stmt.test.take().make_bin(op!("&&"), *cons.expr.take())),
                }
                .into();
            }
        }
    }

    fn visit_with_prepend<N>(&mut self, n: &mut N)
    where
        N: VisitMutWith<Self>,
    {
        let mut old_prepend_stmts = self.prepend_stmts.take();
        let old_append_stmts = self.append_stmts.take();
        n.visit_mut_with(self);
        old_prepend_stmts.append(&mut self.prepend_stmts);
        old_prepend_stmts.append(&mut self.append_stmts);

        self.prepend_stmts = old_prepend_stmts;
        self.append_stmts = old_append_stmts;
    }
}

impl VisitMut for Optimizer<'_> {
    noop_visit_mut_type!(fail);

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_arrow_expr(&mut self, n: &mut ArrowExpr) {
        self.drop_unused_arrow_params(&mut n.params);

        let prepend = self.prepend_stmts.take();

        {
            let ctx = self.ctx.clone().with(BitCtx::InParam, true);
            n.params.visit_mut_with(&mut *self.with_ctx(ctx));
        }

        n.body.visit_mut_with(self);

        if !self.prepend_stmts.is_empty() {
            let mut stmts = self.prepend_stmts.take().take_stmts();
            match &mut *n.body {
                BlockStmtOrExpr::BlockStmt(v) => {
                    prepend_stmts(&mut v.stmts, stmts.into_iter());
                }
                BlockStmtOrExpr::Expr(v) => {
                    self.changed = true;
                    report_change!("Converting a body of an arrow expression to BlockStmt");

                    stmts.push(
                        ReturnStmt {
                            span: DUMMY_SP,
                            arg: Some(v.take()),
                        }
                        .into(),
                    );
                    n.body = Box::new(BlockStmtOrExpr::BlockStmt(BlockStmt {
                        span: DUMMY_SP,
                        stmts,
                        ..Default::default()
                    }));
                }
            }
        }

        self.prepend_stmts = prepend;

        if let BlockStmtOrExpr::BlockStmt(body) = &mut *n.body {
            drop_invalid_stmts(&mut body.stmts);
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_assign_expr(&mut self, e: &mut AssignExpr) {
        {
            let ctx = self
                .ctx
                .clone()
                .with(BitCtx::IsLhsOfAssign, true)
                .with(BitCtx::IsExactLhsOfAssign, true);
            e.left.visit_mut_with(&mut *self.with_ctx(ctx));
        }
        e.right.visit_mut_with(self);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_assign_pat_prop(&mut self, n: &mut AssignPatProp) {
        n.visit_mut_children_with(self);

        if let Some(value) = &n.value {
            if is_pure_undefined(self.ctx.expr_ctx, value) {
                n.value = None;
            }
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_bin_expr(&mut self, n: &mut BinExpr) {
        {
            let ctx = self.ctx.clone().with(
                BitCtx::InCond,
                self.ctx.bit_ctx.contains(BitCtx::InCond) || n.op.may_short_circuit(),
            );
            n.visit_mut_children_with(&mut *self.with_ctx(ctx));
        }

        self.compress_typeof_undefined(n);

        self.optimize_bin_equal(n);

        self.remove_bin_paren(n);

        self.optimize_optional_chain_generated(n);

        self.optimize_bin_and_or(n);

        if n.op == op!(bin, "+") {
            if let Known(Type::Str) = n.left.get_type(self.ctx.expr_ctx) {
                self.optimize_expr_in_str_ctx(&mut n.right);
            }

            if let Known(Type::Str) = n.right.get_type(self.ctx.expr_ctx) {
                self.optimize_expr_in_str_ctx(&mut n.left);
            }
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_block_stmt(&mut self, n: &mut BlockStmt) {
        let ctx = Ctx {
            bit_ctx: self
                .ctx
                .bit_ctx
                .with(BitCtx::TopLevel, false)
                .with(BitCtx::InBlock, true)
                .with(BitCtx::InParam, false),
            scope: n.ctxt,
            ..self.ctx.clone()
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

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_call_expr(&mut self, e: &mut CallExpr) {
        let is_this_undefined = match &e.callee {
            Callee::Super(_) | Callee::Import(_) => false,
            Callee::Expr(e) => e.is_ident(),
        };
        {
            let ctx = self
                .ctx
                .clone()
                .with(BitCtx::IsCallee, true)
                .with(
                    BitCtx::IsThisAwareCallee,
                    is_this_undefined
                        || match &e.callee {
                            Callee::Super(_) | Callee::Import(_) => false,
                            Callee::Expr(callee) => is_callee_this_aware(callee),
                        },
                )
                .with(BitCtx::IsLhsOfAssign, false)
                .with(BitCtx::IsExactLhsOfAssign, false)
                .with(BitCtx::IsUpdateArg, false);
            e.callee.visit_mut_with(&mut *self.with_ctx(ctx));
        }

        if is_this_undefined {
            if let Callee::Expr(callee) = &mut e.callee {
                if let Expr::Member(..) = &mut **callee {
                    let zero = Lit::Num(Number {
                        span: DUMMY_SP,
                        value: 0.0,
                        raw: None,
                    })
                    .into();
                    self.changed = true;
                    report_change!("injecting zero to preserve `this` in call");

                    *callee = SeqExpr {
                        span: callee.span(),
                        exprs: vec![zero, callee.take()],
                    }
                    .into();
                }
            }
        }

        {
            let ctx = self
                .ctx
                .clone()
                .with(BitCtx::IsThisAwareCallee, false)
                .with(BitCtx::IsLhsOfAssign, false)
                .with(BitCtx::IsExactLhsOfAssign, false)
                .with(BitCtx::IsUpdateArg, false);
            // TODO: Prevent inline if callee is unknown.
            e.args.visit_mut_with(&mut *self.with_ctx(ctx));
        }

        self.ignore_unused_args_of_iife(e);
        self.inline_args_of_iife(e);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_class(&mut self, n: &mut Class) {
        n.decorators.visit_mut_with(self);

        {
            let ctx = self
                .ctx
                .clone()
                .with(BitCtx::DontInvokeIife, true)
                .with(BitCtx::IsUpdateArg, false);
            n.super_class.visit_mut_with(&mut *self.with_ctx(ctx));
        }

        {
            let ctx = Ctx {
                bit_ctx: self.ctx.bit_ctx.with(BitCtx::IsUpdateArg, false),
                expr_ctx: ExprCtx {
                    in_strict: true,
                    ..self.ctx.clone().expr_ctx
                },
                ..self.ctx.clone()
            };
            n.body.visit_mut_with(&mut *self.with_ctx(ctx));
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_class_member(&mut self, n: &mut ClassMember) {
        let ctx = self
            .ctx
            .clone()
            .with(BitCtx::InFnLike, false)
            .with(BitCtx::InClass, true);

        match n {
            ClassMember::ClassProp(class_prop) => {
                class_prop.key.visit_mut_with(self);
                class_prop.value.visit_mut_with(&mut *self.with_ctx(ctx));
            }
            ClassMember::Method(class_method) => {
                class_method.key.visit_mut_with(self);
                class_method
                    .function
                    .visit_mut_with(&mut *self.with_ctx(ctx));
            }
            ClassMember::AutoAccessor(auto_accessor) => {
                auto_accessor.key.visit_mut_with(self);
                auto_accessor.value.visit_mut_with(&mut *self.with_ctx(ctx));
            }
            ClassMember::PrivateProp(private_prop) => {
                private_prop.visit_mut_with(&mut *self.with_ctx(ctx));
            }
            ClassMember::PrivateMethod(private_method) => {
                private_method.visit_mut_with(&mut *self.with_ctx(ctx));
            }

            _ => {
                n.visit_mut_children_with(&mut *self.with_ctx(ctx));
            }
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_class_expr(&mut self, e: &mut ClassExpr) {
        if !self.options.keep_classnames {
            if e.ident.is_some() && !contains_eval(&e.class, true) {
                self.remove_name_if_not_used(&mut e.ident);
            }
        }

        e.visit_mut_children_with(self);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_decl(&mut self, decl: &mut Decl) {
        match decl {
            Decl::Class(class_decl) => self.visit_mut_class(&mut class_decl.class),
            Decl::Fn(fn_decl) => self.visit_mut_fn_decl(fn_decl),
            Decl::Var(var_decl) => self.visit_mut_var_decl(var_decl),
            _ => decl.visit_mut_children_with(self),
        };

        self.drop_unused_decl(decl);
        self.store_typeofs(decl);
        self.store_decl_for_inlining(decl);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_default_decl(&mut self, n: &mut DefaultDecl) {
        match n {
            DefaultDecl::Class(_) => {}
            DefaultDecl::Fn(f) => {
                self.drop_unused_params(&mut f.function.params);
            }
            DefaultDecl::TsInterfaceDecl(_) => {}
        }

        n.visit_mut_children_with(self);
    }

    fn visit_mut_do_while_stmt(&mut self, n: &mut DoWhileStmt) {
        {
            let ctx = self.ctx.clone().with(BitCtx::ExecutedMultipleTime, true);
            n.visit_mut_children_with(&mut *self.with_ctx(ctx));
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_export_decl(&mut self, n: &mut ExportDecl) {
        if let Decl::Fn(f) = &mut n.decl {
            self.drop_unused_params(&mut f.function.params);
        }

        let ctx = self.ctx.clone().with(BitCtx::IsExported, true);
        n.visit_mut_children_with(&mut *self.with_ctx(ctx));
    }

    fn visit_mut_export_default_decl(&mut self, n: &mut ExportDefaultDecl) {
        let ctx = self.ctx.clone().with(BitCtx::IsExported, true);
        n.visit_mut_children_with(&mut *self.with_ctx(ctx));
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        #[cfg(feature = "trace-ast")]
        let _tracing = {
            let s = dump(&*e, true);
            tracing::span!(
                tracing::Level::ERROR,
                "visit_mut_expr",
                src = tracing::field::display(&s)
            )
            .entered()
        };

        let ctx = self
            .ctx
            .clone()
            .with(BitCtx::IsExported, false)
            .with(BitCtx::IsCallee, false);
        e.visit_mut_children_with(&mut *self.with_ctx(ctx));

        #[cfg(feature = "trace-ast")]
        let _tracing = {
            let s = dump(&*e, true);
            tracing::span!(
                tracing::Level::ERROR,
                "visit_mut_expr_after_children",
                src = tracing::field::display(&s)
            )
            .entered()
        };

        match e {
            Expr::Seq(seq) if seq.exprs.len() == 1 => {
                let span = seq.span;
                *e = *seq.exprs[0].take();
                e.set_span(span);
            }

            Expr::Assign(AssignExpr {
                op: op!("="),
                left,
                right,
                ..
            }) => {
                if let Some(i) = left.as_ident_mut() {
                    let old = i.to_id();

                    self.store_var_for_inlining(i, right, false);

                    if i.is_dummy() && self.options.unused {
                        report_change!("inline: Removed variable ({}, {:?})", old.0, old.1);
                        self.vars.removed.insert(old.clone());
                    }

                    if right.is_invalid() {
                        if let Some(lit) = self
                            .vars
                            .lits
                            .get(&old)
                            .or_else(|| self.vars.vars_for_inlining.get(&old))
                        {
                            *e = (**lit).clone();
                        }
                    }
                }

                self.lift_seqs_of_assign(e)
            }

            _ => {}
        }

        if e.is_seq() {
            debug_assert_valid(e);
        }

        // This is not accurate check but avoid some trivial cases.
        if self.changed {
            self.remove_invalid_bin(e);
        }

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.optimize_str_access_to_arguments(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.replace_props(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.drop_unused_assignments(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.compress_lits(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.compress_typeofs(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.compress_logical_exprs_as_bang_bang(e, false);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.inline(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.handle_property_access(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.compress_cond_expr_if_similar(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        if self.options.negate_iife {
            self.negate_iife_in_cond(e);

            if e.is_seq() {
                debug_assert_valid(e);
            }
        }

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.evaluate(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.invoke_iife(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.optimize_bangbang(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        match e {
            Expr::Seq(s) if s.exprs.is_empty() => {
                e.take();
            }
            _ => {}
        }

        self.reduce_escaped_newline_for_str_lit(e);

        #[cfg(feature = "trace-ast")]
        tracing::debug!("Output: {}", dump(e, true));
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
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

            #[cfg(feature = "debug")]
            let start = dump(&n.expr, true);

            // Fix https://github.com/swc-project/swc/issues/6422
            let is_object_lit_with_spread = n
                .expr
                .as_object()
                .map(|object_lit| object_lit.props.iter().any(|prop| prop.is_spread()))
                .unwrap_or(false);

            if !is_object_lit_with_spread {
                let expr = self.ignore_return_value(&mut n.expr);
                n.expr = expr.map(Box::new).unwrap_or_else(|| {
                    report_change!("visit_mut_expr_stmt: Dropped an expression statement");
                    #[cfg(feature = "debug")]
                    dump_change_detail!("Removed {}", start);

                    Expr::undefined(DUMMY_SP)
                });
            }
        }

        self.normalize_expr(&mut n.expr);

        #[cfg(debug_assertions)]
        {
            n.visit_with(&mut AssertValid);
        }
    }

    fn visit_mut_fn_decl(&mut self, f: &mut FnDecl) {
        #[cfg(feature = "debug")]
        let _tracing = tracing::span!(
            Level::ERROR,
            "visit_mut_fn_decl",
            id = tracing::field::display(&f.ident)
        )
        .entered();

        self.functions
            .entry(f.ident.to_id())
            .or_insert_with(|| FnMetadata::from(&*f.function));

        self.drop_unused_params(&mut f.function.params);

        let ctx = self
            .ctx
            .clone()
            .with(BitCtx::TopLevel, false)
            .with(BitCtx::InFnLike, true)
            .with(BitCtx::IsLhsOfAssign, false)
            .with(BitCtx::IsExactLhsOfAssign, false);
        f.visit_mut_children_with(&mut *self.with_ctx(ctx));
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_fn_expr(&mut self, e: &mut FnExpr) {
        if let Some(ident) = &e.ident {
            self.functions
                .entry(ident.to_id())
                .or_insert_with(|| FnMetadata::from(&*e.function));
        }

        if !self.options.keep_fnames {
            if e.ident.is_some() && !contains_eval(&e.function, true) {
                self.remove_name_if_not_used(&mut e.ident);
            }
        }

        let ctx = self
            .ctx
            .clone()
            .with(BitCtx::TopLevel, false)
            .with(BitCtx::IsLhsOfAssign, false)
            .with(BitCtx::IsExactLhsOfAssign, false)
            .with(BitCtx::InFnLike, true);
        e.visit_mut_children_with(&mut *self.with_ctx(ctx));
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_for_in_stmt(&mut self, n: &mut ForInStmt) {
        n.right.visit_mut_with(self);

        {
            let ctx = self
                .ctx
                .clone()
                .with(BitCtx::InVarDeclOfForInOrOfLoop, true)
                .with(BitCtx::IsExactLhsOfAssign, n.left.is_pat());
            self.with_ctx(ctx).visit_with_prepend(&mut n.left);
        }

        {
            let ctx = self.ctx.clone().with(BitCtx::ExecutedMultipleTime, true);
            n.body.visit_mut_with(&mut *self.with_ctx(ctx));
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_for_of_stmt(&mut self, n: &mut ForOfStmt) {
        n.right.visit_mut_with(self);

        {
            let ctx = self
                .ctx
                .clone()
                .with(BitCtx::InVarDeclOfForInOrOfLoop, true)
                .with(BitCtx::IsExactLhsOfAssign, n.left.is_pat());
            self.with_ctx(ctx).visit_with_prepend(&mut n.left);
        }

        {
            let ctx = self.ctx.clone().with(BitCtx::ExecutedMultipleTime, true);
            n.body.visit_mut_with(&mut *self.with_ctx(ctx));
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_for_stmt(&mut self, s: &mut ForStmt) {
        self.visit_with_prepend(&mut s.init);

        debug_assert_valid(&s.init);

        s.test.visit_mut_with(self);
        s.update.visit_mut_with(self);

        let ctx = self.ctx.clone().with(BitCtx::ExecutedMultipleTime, true);
        s.body.visit_mut_with(&mut *self.with_ctx(ctx.clone()));
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_function(&mut self, n: &mut Function) {
        n.decorators.visit_mut_with(self);

        let old_in_asm = self.ctx.bit_ctx.contains(BitCtx::InAsm);

        {
            let ctx = Ctx {
                bit_ctx: self
                    .ctx
                    .bit_ctx
                    .with(BitCtx::InFnLike, true)
                    .with(BitCtx::TopLevel, false),
                scope: n.ctxt,
                ..self.ctx.clone()
            };
            let optimizer = &mut *self.with_ctx(ctx);

            n.params.visit_mut_with(optimizer);
            if let Some(body) = n.body.as_mut() {
                optimizer.handle_stmts(&mut body.stmts, true);
                #[cfg(debug_assertions)]
                {
                    body.visit_with(&mut AssertValid);
                }
            }
        }

        #[cfg(debug_assertions)]
        {
            n.visit_with(&mut AssertValid);
        }

        if let Some(body) = &mut n.body {
            self.merge_if_returns(&mut body.stmts, false, true);

            #[cfg(debug_assertions)]
            {
                body.visit_with(&mut AssertValid);
            }

            self.drop_else_token(&mut body.stmts);
        }

        #[cfg(debug_assertions)]
        {
            n.visit_with(&mut AssertValid);
        }

        {
            self.with_ctx(self.ctx.clone())
                .optimize_usage_of_arguments(n);
        }

        {
            self.with_ctx(self.ctx.clone()).drop_unused_rest_params(n);
        }

        self.ctx.bit_ctx.set(BitCtx::InAsm, old_in_asm);

        if let Some(body) = &mut n.body {
            drop_invalid_stmts(&mut body.stmts);
        }

        #[cfg(debug_assertions)]
        {
            n.visit_with(&mut AssertValid);
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_if_stmt(&mut self, n: &mut IfStmt) {
        n.test.visit_mut_with(self);

        let ctx = self.ctx.clone().with(BitCtx::InCond, true);

        n.cons.visit_mut_with(&mut *self.with_ctx(ctx.clone()));

        n.alt.visit_mut_with(&mut *self.with_ctx(ctx.clone()));

        self.negate_if_stmt(n);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_labeled_stmt(&mut self, n: &mut LabeledStmt) {
        let ctx = self.ctx.clone().with(
            BitCtx::DontUsePrependNorAppend,
            contains_leaping_continue_with_label(&n.body, n.label.sym.clone()),
        );

        n.visit_mut_children_with(&mut *self.with_ctx(ctx));

        self.try_remove_label(n);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_member_expr(&mut self, n: &mut MemberExpr) {
        {
            let ctx = self
                .ctx
                .clone()
                .with(BitCtx::InObjOfNonComputedMember, !n.prop.is_computed())
                .with(BitCtx::IsExactLhsOfAssign, false)
                .with(BitCtx::IsUpdateArg, false);
            n.obj.visit_mut_with(&mut *self.with_ctx(ctx));
        }
        if let MemberProp::Computed(c) = &mut n.prop {
            let ctx = self
                .ctx
                .clone()
                .with(BitCtx::IsExactLhsOfAssign, false)
                .with(BitCtx::IsLhsOfAssign, false)
                .with(BitCtx::IsUpdateArg, false);

            c.visit_mut_with(&mut *self.with_ctx(ctx));
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
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

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        let ctx = self.ctx.clone().with(BitCtx::TopLevel, true);
        self.with_ctx(ctx).handle_stmt_likes(stmts, true);

        if self.vars.inline_with_multi_replacer(stmts) {
            self.changed = true;
        }

        drop_invalid_stmts(stmts);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_new_expr(&mut self, n: &mut NewExpr) {
        {
            let ctx = self
                .ctx
                .clone()
                .with(BitCtx::IsCallee, true)
                .with(BitCtx::IsExactLhsOfAssign, false)
                .with(BitCtx::IsLhsOfAssign, false);
            n.callee.visit_mut_with(&mut *self.with_ctx(ctx));
        }

        {
            let ctx = self
                .ctx
                .clone()
                .with(BitCtx::IsExactLhsOfAssign, false)
                .with(BitCtx::IsLhsOfAssign, false);
            n.args.visit_mut_with(&mut *self.with_ctx(ctx));
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_opt_stmt(&mut self, s: &mut Option<Box<Stmt>>) {
        s.visit_mut_children_with(self);

        if let Some(Stmt::Empty(..)) = s.as_deref() {
            self.changed = true;
            report_change!("misc: Removing empty statement");
            *s = None;
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
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

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_param(&mut self, n: &mut Param) {
        let ctx = Ctx {
            bit_ctx: self.ctx.bit_ctx.with(BitCtx::InParam, true),
            ..self.ctx.clone()
        };
        let mut o = self.with_ctx(ctx);
        n.visit_mut_children_with(&mut *o);

        o.drop_unused_param(&mut n.pat, false);
    }

    fn visit_mut_params(&mut self, n: &mut Vec<Param>) {
        n.visit_mut_children_with(self);

        n.retain(|p| !p.pat.is_invalid());
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_return_stmt(&mut self, n: &mut ReturnStmt) {
        n.visit_mut_children_with(self);

        if let Some(arg) = &mut n.arg {
            self.optimize_last_expr_before_termination(arg);
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_script(&mut self, s: &mut Script) {
        let ctx = self.ctx.clone().with(BitCtx::TopLevel, true);
        s.visit_mut_children_with(&mut *self.with_ctx(ctx));

        if self.vars.inline_with_multi_replacer(s) {
            self.changed = true;
        }

        drop_invalid_stmts(&mut s.body);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_seq_expr(&mut self, n: &mut SeqExpr) {
        n.visit_mut_children_with(self);

        // Enhanced IIFE invocation for arrow functions in sequence expressions
        self.invoke_iife_in_seq_expr(n);

        self.merge_sequences_in_seq_expr(n);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
        let old_prepend = self.prepend_stmts.take();
        let old_append = self.append_stmts.take();

        #[cfg(feature = "debug")]
        let _tracing = {
            let text = dump(&*s, false);

            if text.lines().count() < 10 {
                Some(span!(Level::ERROR, "visit_mut_stmt", "start" = &*text).entered())
            } else {
                None
            }
        };

        let ctx = self
            .ctx
            .clone()
            .with(BitCtx::IsCallee, false)
            .with(BitCtx::IsDeleteArg, false)
            .with(BitCtx::IsUpdateArg, false)
            .with(BitCtx::IsLhsOfAssign, false)
            .with(BitCtx::InBangArg, false)
            .with(BitCtx::IsExported, false)
            .with(BitCtx::InObjOfNonComputedMember, false);
        s.visit_mut_children_with(&mut *self.with_ctx(ctx));

        if self.prepend_stmts.is_empty() && self.append_stmts.is_empty() {
            match s {
                // We use var decl with no declarator to indicate we dropped an decl.
                Stmt::Decl(Decl::Var(v)) if v.decls.is_empty() => {
                    *s = EmptyStmt { span: DUMMY_SP }.into();
                    self.prepend_stmts = old_prepend;
                    self.append_stmts = old_append;
                    return;
                }
                Stmt::Expr(es) => {
                    if es.expr.is_invalid() {
                        *s = EmptyStmt { span: DUMMY_SP }.into();
                        self.prepend_stmts = old_prepend;
                        self.append_stmts = old_append;
                        return;
                    }
                }
                _ => {}
            }

            #[cfg(debug_assertions)]
            {
                s.visit_with(&mut AssertValid);
            }
        }

        match s {
            Stmt::Labeled(LabeledStmt {
                label: Ident { sym, .. },
                body,
                ..
            }) if sym.is_empty() => {
                *s = *body.take();

                debug_assert_valid(s);
            }
            _ => (),
        }

        self.remove_duplicate_var_decls(s);

        match s {
            Stmt::Decl(Decl::Var(v)) if v.decls.is_empty() => {
                s.take();
                if self.prepend_stmts.is_empty() && self.append_stmts.is_empty() {
                    self.prepend_stmts = old_prepend;
                    self.append_stmts = old_append;
                    return;
                }
            }

            _ => {}
        }

        debug_assert_valid(s);

        match s {
            Stmt::Expr(e) => {
                if let Some(block) = self.invoke_iife_stmt(&mut e.expr, false) {
                    *s = Stmt::Block(block)
                }
            }
            Stmt::Return(ReturnStmt { arg: Some(arg), .. }) => {
                if let Some(mut block) = self.invoke_iife_stmt(&mut *arg, true) {
                    if !block
                        .stmts
                        .last()
                        .map(swc_ecma_utils::StmtExt::terminates)
                        .unwrap_or(false)
                    {
                        block.stmts.push(Stmt::Return(ReturnStmt {
                            span: DUMMY_SP,
                            arg: None,
                        }))
                    }
                    *s = Stmt::Block(block)
                }
            }
            _ => (),
        }

        // visit_mut_children_with above may produce easily optimizable block
        // statements.
        self.try_removing_block(s, false);

        debug_assert_valid(s);

        // These methods may modify prepend_stmts or append_stmts.
        self.optimize_loops_if_cond_is_false(s);

        debug_assert_valid(s);

        self.optimize_loops_with_break(s);

        debug_assert_valid(s);

        self.try_removing_block(s, false);

        debug_assert_valid(s);

        if !self.prepend_stmts.is_empty() || !self.append_stmts.is_empty() {
            report_change!("Creating a fake block because of prepend or append");

            let span = s.span();
            *s = BlockStmt {
                span,
                ctxt: SyntaxContext::empty().apply_mark(self.marks.fake_block),
                stmts: self
                    .prepend_stmts
                    .take_stmts()
                    .into_iter()
                    .chain(once(s.take()))
                    .chain(self.append_stmts.take_stmts())
                    .filter(|s| match s {
                        Stmt::Empty(..) => false,
                        Stmt::Decl(Decl::Var(v)) => !v.decls.is_empty(),
                        _ => true,
                    })
                    .collect(),
            }
            .into();

            #[cfg(debug_assertions)]
            {
                s.visit_with(&mut AssertValid);
            }
        }

        self.prepend_stmts = old_prepend;
        self.append_stmts = old_append;

        let prepend_len = self.prepend_stmts.len();
        let append_len = self.append_stmts.len();

        debug_assert_eq!(self.prepend_stmts.len(), prepend_len);
        debug_assert_eq!(self.append_stmts.len(), append_len);

        if let Stmt::Expr(ExprStmt { expr, .. }) = s {
            if is_pure_undefined(self.ctx.expr_ctx, expr) {
                *s = EmptyStmt { span: DUMMY_SP }.into();
                return;
            }

            let is_directive = matches!(&**expr, Expr::Lit(Lit::Str(..)));

            if self.options.directives
                && is_directive
                && self.ctx.expr_ctx.in_strict
                && match &**expr {
                    Expr::Lit(Lit::Str(Str { value, .. })) => *value == *"use strict",
                    _ => false,
                }
            {
                report_change!("Removing 'use strict'");
                *s = EmptyStmt { span: DUMMY_SP }.into();
                return;
            }

            if self.options.unused {
                let can_be_removed = !is_directive
                    && !expr.is_ident()
                    && !expr.may_have_side_effects(self.ctx.expr_ctx);

                if can_be_removed {
                    self.changed = true;
                    report_change!("unused: Dropping an expression without side effect");
                    dump_change_detail!("unused: Dropping \n{}\n", dump(&*expr, false));
                    *s = EmptyStmt { span: DUMMY_SP }.into();
                    return;
                }
            }
        }

        debug_assert_eq!(self.prepend_stmts.len(), prepend_len);
        debug_assert_eq!(self.append_stmts.len(), append_len);

        match s {
            // We use var decl with no declarator to indicate we dropped an decl.
            Stmt::Decl(Decl::Var(v)) if v.decls.is_empty() => {
                *s = EmptyStmt { span: DUMMY_SP }.into();
                return;
            }
            _ => {}
        }

        debug_assert_eq!(self.prepend_stmts.len(), prepend_len);
        debug_assert_eq!(self.append_stmts.len(), append_len);
        debug_assert_valid(s);

        self.compress_if_without_alt(s);

        debug_assert_eq!(self.prepend_stmts.len(), prepend_len);
        debug_assert_eq!(self.append_stmts.len(), append_len);
        debug_assert_valid(s);

        self.compress_if_stmt_as_cond(s);

        debug_assert_eq!(self.prepend_stmts.len(), prepend_len);
        debug_assert_eq!(self.append_stmts.len(), append_len);
        debug_assert_valid(s);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        // Skip if `use asm` exists.
        if maybe_par!(
            stmts.iter().any(|stmt| match stmt.as_stmt() {
                Some(Stmt::Expr(stmt)) => match &*stmt.expr {
                    Expr::Lit(Lit::Str(Str { raw, .. })) => {
                        matches!(raw, Some(value) if value == "\"use asm\"" || value == "'use asm'")
                    }
                    _ => false,
                },
                _ => false,
            }),
            *crate::LIGHT_TASK_PARALLELS
        ) {
            return;
        }

        #[cfg(debug_assertions)]
        {
            stmts.visit_with(&mut AssertValid);
        }
        self.handle_stmts(stmts, false);

        if stmts.len() == 1 {
            if let Stmt::Expr(ExprStmt { expr, .. }) = &stmts[0] {
                if let Expr::Lit(Lit::Str(s)) = &**expr {
                    if s.value == *"use strict" {
                        stmts.clear();
                    }
                }
            }
        }
    }

    fn visit_mut_str(&mut self, s: &mut Str) {
        s.visit_mut_children_with(self);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_super_prop_expr(&mut self, n: &mut SuperPropExpr) {
        if let SuperProp::Computed(c) = &mut n.prop {
            let ctx = self
                .ctx
                .clone()
                .with(BitCtx::IsExactLhsOfAssign, false)
                .with(BitCtx::IsLhsOfAssign, false);
            c.visit_mut_with(&mut *self.with_ctx(ctx));
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_switch_stmt(&mut self, n: &mut SwitchStmt) {
        n.discriminant.visit_mut_with(self);

        n.cases.visit_mut_with(self);
    }

    /// We don't optimize [Tpl] contained in [TaggedTpl].
    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_tagged_tpl(&mut self, n: &mut TaggedTpl) {
        n.tag.visit_mut_with(
            &mut *self.with_ctx(self.ctx.clone().with(BitCtx::IsThisAwareCallee, true)),
        );

        n.tpl.exprs.visit_mut_with(self);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_throw_stmt(&mut self, n: &mut ThrowStmt) {
        n.visit_mut_children_with(self);

        self.optimize_last_expr_before_termination(&mut n.arg);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_tpl(&mut self, n: &mut Tpl) {
        debug_assert_eq!(n.exprs.len() + 1, n.quasis.len());

        {
            let ctx = self.ctx.clone().with(BitCtx::InTplExpr, true);
            let mut o = self.with_ctx(ctx);
            n.visit_mut_children_with(&mut *o);
        }

        n.exprs
            .iter_mut()
            .for_each(|expr| self.optimize_expr_in_str_ctx(expr));
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_try_stmt(&mut self, n: &mut TryStmt) {
        let ctx = self.ctx.clone().with(BitCtx::InTryBlock, true);
        n.block.visit_mut_with(&mut *self.with_ctx(ctx));

        n.handler.visit_mut_with(self);

        n.finalizer.visit_mut_with(self);
    }

    fn visit_mut_catch_clause(&mut self, n: &mut CatchClause) {
        n.visit_mut_children_with(self);

        if self.options.ecma < EsVersion::Es2019 || !self.options.unused {
            return;
        }

        if let Some(param) = &mut n.param {
            self.take_pat_if_unused(param, None, false);
            if param.is_invalid() {
                n.param = None;
            }
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_unary_expr(&mut self, n: &mut UnaryExpr) {
        let ctx = self
            .ctx
            .clone()
            .with(BitCtx::InBangArg, n.op == op!("!"))
            .with(BitCtx::IsDeleteArg, n.op == op!("delete"));

        n.visit_mut_children_with(&mut *self.with_ctx(ctx));

        // infinite loop
        if n.op == op!("void") {
            match &*n.arg {
                Expr::Lit(Lit::Num(..)) => {}

                _ => {
                    let arg = self.ignore_return_value(&mut n.arg);

                    n.arg = Box::new(arg.unwrap_or_else(|| {
                        report_change!("Ignoring arg of `void`");

                        make_number(DUMMY_SP, 0.0)
                    }));
                }
            }
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_update_expr(&mut self, n: &mut UpdateExpr) {
        let ctx = self.ctx.clone().with(BitCtx::IsUpdateArg, true);

        n.visit_mut_children_with(&mut *self.with_ctx(ctx));
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_using_decl(&mut self, n: &mut UsingDecl) {
        let ctx = Ctx {
            bit_ctx: self
                .ctx
                .bit_ctx
                .with(BitCtx::IsUpdateArg, false)
                .with(BitCtx::IsConst, false)
                .with(BitCtx::IsLet, false)
                .with(BitCtx::IsVar, false),
            ..self.ctx.clone()
        };

        for decl in n.decls.iter_mut() {
            decl.init.visit_mut_with(&mut *self.with_ctx(ctx.clone()));
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_var_decl(&mut self, n: &mut VarDecl) {
        {
            let ctx = Ctx {
                bit_ctx: self
                    .ctx
                    .bit_ctx
                    .with(BitCtx::IsUpdateArg, false)
                    .with(
                        BitCtx::IsConst,
                        n.kind == VarDeclKind::Const || self.has_const_ann(n.ctxt),
                    )
                    .with(BitCtx::IsVar, n.kind == VarDeclKind::Var)
                    .with(BitCtx::IsLet, n.kind == VarDeclKind::Let),
                ..self.ctx.clone()
            };

            n.visit_mut_children_with(&mut *self.with_ctx(ctx));
        }

        if n.kind == VarDeclKind::Let {
            n.decls.iter_mut().for_each(|var| {
                if let Some(e) = &var.init {
                    if is_pure_undefined(self.ctx.expr_ctx, e) {
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

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_var_declarator(&mut self, var: &mut VarDeclarator) {
        var.name.visit_mut_with(self);

        var.init.visit_mut_with(self);

        debug_assert_valid(&var.init);

        self.remove_duplicate_name_of_function(var);

        debug_assert_valid(&var.init);

        if let VarDeclarator {
            name: Pat::Ident(id),
            init: Some(init),
            definite: false,
            ..
        } = var
        {
            self.store_var_for_inlining(&mut id.id, init, false);

            if init.is_invalid() {
                var.init = None
            }

            // Dummy check.
            if id.sym.is_empty() {
                var.name = Pat::dummy();
            }
        };

        self.drop_unused_properties(var);

        debug_assert_valid(&var.init);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_var_declarators(&mut self, vars: &mut Vec<VarDeclarator>) {
        vars.retain_mut(|var| {
            if var.name.is_invalid() {
                self.changed = true;
                return false;
            }

            true
        });

        {
            // We loop with index to avoid borrow checker issue.
            // We use splice so we cannot use for _ in vars
            let mut idx = 0;

            while idx < vars.len() {
                let var = &mut vars[idx];
                var.visit_mut_with(self);

                // The varaible is dropped.
                if var.name.is_invalid() {
                    vars.remove(idx);
                    continue;
                }

                let new = self.hoist_props_of_var(var);

                if let Some(new) = new {
                    let len = new.len();
                    vars.splice(idx..=idx, new);
                    idx += len;
                } else {
                    idx += 1;
                }
            }
        }

        vars.retain_mut(|var| {
            if var.name.is_invalid() {
                self.changed = true;
                return false;
            }

            debug_assert_valid(&*var);

            true
        });

        let uses_eval = self
            .data
            .scopes
            .get(&self.ctx.scope)
            .unwrap()
            .contains(ScopeData::HAS_EVAL_CALL);

        if !uses_eval && !self.ctx.bit_ctx.contains(BitCtx::DontUsePrependNorAppend) {
            for v in vars.iter_mut() {
                if v.init
                    .as_deref()
                    .map(|e| !e.is_ident() && !e.may_have_side_effects(self.ctx.expr_ctx))
                    .unwrap_or(true)
                {
                    self.drop_unused_var_declarator(v, &mut None);
                }
            }

            let mut can_prepend = true;
            let mut side_effects = Vec::new();

            for v in vars.iter_mut() {
                let mut storage = None;
                self.drop_unused_var_declarator(v, &mut storage);
                if let Some(expr) = &mut storage {
                    expr.visit_mut_with(self);
                }
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

                    self.prepend_stmts.push(
                        ExprStmt {
                            span: DUMMY_SP,
                            expr: if side_effects.len() == 1 {
                                side_effects.remove(0)
                            } else {
                                SeqExpr {
                                    span: DUMMY_SP,
                                    exprs: side_effects.take(),
                                }
                                .into()
                            },
                        }
                        .into(),
                    );
                } else {
                    // We prepend side effects to the initializer.

                    let seq = v.init.as_mut().unwrap().force_seq();
                    seq.exprs = side_effects
                        .drain(..)
                        .chain(seq.exprs.take())
                        .filter(|e| !e.is_invalid())
                        .collect();
                }
            }

            // We append side effects.
            if !side_effects.is_empty() {
                self.append_stmts.push(
                    ExprStmt {
                        span: DUMMY_SP,
                        expr: if side_effects.len() == 1 {
                            side_effects.remove(0)
                        } else {
                            SeqExpr {
                                span: DUMMY_SP,
                                exprs: side_effects,
                            }
                            .into()
                        },
                    }
                    .into(),
                );
            }

            vars.retain_mut(|var| {
                if var.name.is_invalid() {
                    self.changed = true;
                    return false;
                }

                if let Some(Expr::Invalid(..)) = var.init.as_deref() {
                    if let Pat::Ident(i) = &var.name {
                        if let Some(usage) = self.data.vars.get(&i.id.to_id()) {
                            if usage
                                .flags
                                .contains(VarUsageInfoFlags::DECLARED_AS_CATCH_PARAM)
                            {
                                var.init = None;
                                debug_assert_valid(var);
                                return true;
                            }
                        }
                    }

                    return false;
                }

                debug_assert_valid(var);

                true
            });
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_while_stmt(&mut self, n: &mut WhileStmt) {
        {
            let ctx = self.ctx.clone().with(BitCtx::ExecutedMultipleTime, true);
            n.visit_mut_children_with(&mut *self.with_ctx(ctx));
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_with_stmt(&mut self, n: &mut WithStmt) {
        n.obj.visit_mut_with(self);

        {
            let ctx = self.ctx.clone().with(BitCtx::InWithStmt, true);
            n.body.visit_mut_with(&mut *self.with_ctx(ctx));
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_yield_expr(&mut self, n: &mut YieldExpr) {
        n.visit_mut_children_with(self);

        if let Some(arg) = &mut n.arg {
            self.compress_undefined(arg);

            if !n.delegate && is_pure_undefined(self.ctx.expr_ctx, arg) {
                n.arg = None;
            }
        }
    }
}

/// If true, `0` in `(0, foo.bar)()` is preserved.
fn is_callee_this_aware(callee: &Expr) -> bool {
    match callee {
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

fn is_expr_access_to_arguments(l: &SimpleAssignTarget) -> bool {
    match l {
        SimpleAssignTarget::Member(MemberExpr { obj, .. }) => {
            matches!(&**obj, Expr::Ident(Ident { sym, .. }) if (&**sym == "arguments"))
        }
        _ => false,
    }
}

fn is_left_access_to_arguments(l: &AssignTarget) -> bool {
    match l {
        AssignTarget::Simple(e) => is_expr_access_to_arguments(e),
        _ => false,
    }
}
