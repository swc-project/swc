use std::{borrow::Cow, iter, iter::once};

use swc_atoms::{atom, Atom};
use swc_common::{
    pass::{CompilerPass, Repeated},
    util::take::Take,
    Mark, Span, Spanned, SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::{cpu_count, Parallel, ParallelExt};
use swc_ecma_utils::{
    is_literal, perform_arithmetic_op, prop_name_eq, ExprCtx, ExprExt, Purity, Type, Value,
};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};
use Value::Known;

use crate::debug::debug_assert_valid;

#[cfg(test)]
mod tests;

/// All [bool] fields defaults to [false].
#[derive(Debug, Clone, Copy, Default, Hash)]
pub struct Config {}

/// Not intended for general use. Use [simplifier] instead.
///
/// Ported from `PeepholeFoldConstants` of google closure compiler.
pub fn expr_simplifier(
    unresolved_mark: Mark,
    config: Config,
) -> impl Repeated + Pass + CompilerPass + VisitMut + 'static {
    visit_mut_pass(SimplifyExpr {
        expr_ctx: ExprCtx {
            unresolved_ctxt: SyntaxContext::empty().apply_mark(unresolved_mark),
            is_unresolved_ref_safe: false,
            in_strict: false,
            remaining_depth: 4,
        },
        config,
        changed: false,
        is_arg_of_update: false,
        is_modifying: false,
        in_callee: false,
    })
}

impl Parallel for SimplifyExpr {
    fn create(&self) -> Self {
        Self { ..*self }
    }

    fn merge(&mut self, other: Self) {
        self.changed |= other.changed;
    }
}

#[derive(Debug)]
struct SimplifyExpr {
    expr_ctx: ExprCtx,
    config: Config,

    changed: bool,
    is_arg_of_update: bool,
    is_modifying: bool,
    in_callee: bool,
}

impl CompilerPass for SimplifyExpr {
    fn name(&self) -> Cow<'static, str> {
        Cow::Borrowed("simplify-expr")
    }
}

impl Repeated for SimplifyExpr {
    fn changed(&self) -> bool {
        self.changed
    }

    fn reset(&mut self) {
        self.changed = false;
    }
}

impl VisitMut for SimplifyExpr {
    noop_visit_mut_type!();

    fn visit_mut_assign_expr(&mut self, n: &mut AssignExpr) {
        let old = self.is_modifying;
        self.is_modifying = true;
        n.left.visit_mut_with(self);
        self.is_modifying = old;

        self.is_modifying = false;
        n.right.visit_mut_with(self);
        self.is_modifying = old;
    }

    /// This is overriden to preserve `this`.
    fn visit_mut_call_expr(&mut self, n: &mut CallExpr) {
        let old_in_callee = self.in_callee;

        self.in_callee = true;
        match &mut n.callee {
            Callee::Super(..) | Callee::Import(..) => {}
            Callee::Expr(e) => {
                let may_inject_zero = !need_zero_for_this(e);

                match &mut **e {
                    Expr::Seq(seq) => {
                        if seq.exprs.len() == 1 {
                            let mut expr = seq.exprs.take().into_iter().next().unwrap();
                            expr.visit_mut_with(self);
                            *e = expr;
                        } else if seq
                            .exprs
                            .last()
                            .map(|v| &**v)
                            .map_or(false, Expr::directness_matters)
                        {
                            match seq.exprs.first().map(|v| &**v) {
                                Some(Expr::Lit(..) | Expr::Ident(..)) => {}
                                _ => {
                                    tracing::debug!("Injecting `0` to preserve `this = undefined`");
                                    seq.exprs.insert(0, 0.0.into());
                                }
                            }

                            seq.visit_mut_with(self);
                        }
                    }

                    _ => {
                        e.visit_mut_with(self);
                    }
                }

                if may_inject_zero && need_zero_for_this(e) {
                    match &mut **e {
                        Expr::Seq(seq) => {
                            seq.exprs.insert(0, 0.into());
                        }
                        _ => {
                            let seq = SeqExpr {
                                span: DUMMY_SP,
                                exprs: vec![0.0.into(), e.take()],
                            };
                            **e = seq.into();
                        }
                    }
                }
            }
        }

        self.in_callee = false;
        n.args.visit_mut_with(self);

        self.in_callee = old_in_callee;
    }

    fn visit_mut_class_members(&mut self, members: &mut Vec<ClassMember>) {
        self.maybe_par(cpu_count(), members, |v, member| {
            member.visit_mut_with(v);
        });
    }

    fn visit_mut_export_default_expr(&mut self, expr: &mut ExportDefaultExpr) {
        fn is_paren_wrap_fn_or_class(expr: &mut Expr, visitor: &mut SimplifyExpr) -> bool {
            match &mut *expr {
                Expr::Fn(..) | Expr::Class(..) => {
                    expr.visit_mut_children_with(visitor);
                    true
                }
                Expr::Paren(p) => is_paren_wrap_fn_or_class(&mut p.expr, visitor),
                _ => false,
            }
        }

        if !is_paren_wrap_fn_or_class(&mut expr.expr, self) {
            expr.visit_mut_children_with(self);
        }
    }

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        if let Expr::Unary(UnaryExpr {
            op: op!("delete"), ..
        }) = expr
        {
            return;
        }
        // fold children before doing something more.
        expr.visit_mut_children_with(self);

        match expr {
            // Do nothing.
            // Note: Paren should be handled in fixer
            Expr::Lit(_) | Expr::This(..) | Expr::Paren(..) => return,

            Expr::Seq(seq) if seq.exprs.is_empty() => return,

            Expr::Unary(..)
            | Expr::Bin(..)
            | Expr::Member(..)
            | Expr::Cond(..)
            | Expr::Seq(..)
            | Expr::Array(..)
            | Expr::Object(..)
            | Expr::New(..) => {}

            _ => return,
        }

        match expr {
            Expr::Unary(_) => {
                optimize_unary_expr(self.expr_ctx, expr, &mut self.changed);
                debug_assert_valid(expr);
            }
            Expr::Bin(_) => {
                optimize_bin_expr(self.expr_ctx, expr, &mut self.changed);
                if expr.is_seq() {
                    expr.visit_mut_with(self);
                }

                debug_assert_valid(expr);
            }
            Expr::Member(_) => {
                if !self.is_modifying {
                    optimize_member_expr(self.expr_ctx, expr, self.in_callee, &mut self.changed);

                    debug_assert_valid(expr);
                }
            }

            Expr::Cond(CondExpr {
                span,
                test,
                cons,
                alt,
            }) => {
                if let (p, Known(val)) = test.cast_to_bool(self.expr_ctx) {
                    self.changed = true;

                    let expr_value = if val { cons } else { alt };
                    *expr = if p.is_pure() {
                        if expr_value.directness_matters() {
                            SeqExpr {
                                span: *span,
                                exprs: vec![0.into(), expr_value.take()],
                            }
                            .into()
                        } else {
                            *expr_value.take()
                        }
                    } else {
                        SeqExpr {
                            span: *span,
                            exprs: vec![test.take(), expr_value.take()],
                        }
                        .into()
                    }
                }
            }

            // Simplify sequence expression.
            Expr::Seq(SeqExpr { exprs, .. }) => {
                if exprs.len() == 1 {
                    //TODO: Respan
                    *expr = *exprs.take().into_iter().next().unwrap()
                } else {
                    assert!(!exprs.is_empty(), "sequence expression should not be empty");
                    //TODO: remove unused
                }
            }

            Expr::Array(ArrayLit { elems, .. }) => {
                let mut e = Vec::with_capacity(elems.len());

                for elem in elems.take() {
                    match elem {
                        Some(ExprOrSpread {
                            spread: Some(..),
                            expr,
                        }) if expr.is_array() => {
                            self.changed = true;

                            e.extend(expr.array().unwrap().elems.into_iter().map(|elem| {
                                Some(elem.unwrap_or_else(|| ExprOrSpread {
                                    spread: None,
                                    expr: Expr::undefined(DUMMY_SP),
                                }))
                            }));
                        }

                        _ => e.push(elem),
                    }
                }
                *elems = e;
            }

            Expr::Object(ObjectLit { props, .. }) => {
                let should_work = props.iter().any(|p| matches!(p, PropOrSpread::Spread(..)));
                if !should_work {
                    return;
                }

                let mut ps = Vec::with_capacity(props.len());

                for p in props.take() {
                    match p {
                        PropOrSpread::Spread(SpreadElement {
                            dot3_token, expr, ..
                        }) if expr.is_object() => {
                            if let Expr::Object(obj) = &*expr {
                                if obj.props.iter().any(|p| match p {
                                    PropOrSpread::Spread(..) => true,
                                    PropOrSpread::Prop(p) => !matches!(
                                        &**p,
                                        Prop::Shorthand(_) | Prop::KeyValue(_) | Prop::Method(_)
                                    ),
                                }) {
                                    ps.push(PropOrSpread::Spread(SpreadElement {
                                        dot3_token,
                                        expr,
                                    }));
                                    continue;
                                }
                            }
                            let props = expr.object().unwrap().props;
                            ps.extend(props);
                            self.changed = true;
                        }

                        _ => ps.push(p),
                    }
                }
                *props = ps;
            }

            // be conservative.
            _ => {}
        };
    }

    fn visit_mut_expr_or_spreads(&mut self, n: &mut Vec<ExprOrSpread>) {
        self.maybe_par(cpu_count(), n, |v, n| {
            n.visit_mut_with(v);
        });
    }

    fn visit_mut_exprs(&mut self, n: &mut Vec<Box<Expr>>) {
        self.maybe_par(cpu_count(), n, |v, n| {
            n.visit_mut_with(v);
        });
    }

    fn visit_mut_for_head(&mut self, n: &mut ForHead) {
        let old = self.is_modifying;
        self.is_modifying = true;
        n.visit_mut_children_with(self);
        self.is_modifying = old;
    }

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        let mut child = SimplifyExpr {
            expr_ctx: self.expr_ctx,
            config: self.config,
            changed: Default::default(),
            is_arg_of_update: Default::default(),
            is_modifying: Default::default(),
            in_callee: Default::default(),
        };

        child.maybe_par(cpu_count(), n, |v, n| {
            n.visit_mut_with(v);
        });
        self.changed |= child.changed;
    }

    /// Currently noop
    #[inline]
    fn visit_mut_opt_chain_expr(&mut self, _: &mut OptChainExpr) {}

    fn visit_mut_opt_var_decl_or_expr(&mut self, n: &mut Option<VarDeclOrExpr>) {
        if let Some(VarDeclOrExpr::Expr(e)) = n {
            match &mut **e {
                Expr::Seq(SeqExpr { exprs, .. }) if exprs.is_empty() => {
                    *n = None;
                    return;
                }
                _ => {}
            }
        }

        n.visit_mut_children_with(self);
    }

    fn visit_mut_opt_vec_expr_or_spreads(&mut self, n: &mut Vec<Option<ExprOrSpread>>) {
        self.maybe_par(cpu_count(), n, |v, n| {
            n.visit_mut_with(v);
        });
    }

    fn visit_mut_pat(&mut self, p: &mut Pat) {
        let old_in_callee = self.in_callee;
        self.in_callee = false;
        p.visit_mut_children_with(self);
        self.in_callee = old_in_callee;

        if let Pat::Assign(a) = p {
            if a.right.is_undefined(self.expr_ctx)
                || match *a.right {
                    Expr::Unary(UnaryExpr {
                        op: op!("void"),
                        ref arg,
                        ..
                    }) => !arg.may_have_side_effects(self.expr_ctx),
                    _ => false,
                }
            {
                self.changed = true;
                *p = *a.left.take();
            }
        }
    }

    fn visit_mut_prop_or_spreads(&mut self, n: &mut Vec<PropOrSpread>) {
        self.maybe_par(cpu_count(), n, |v, n| {
            n.visit_mut_with(v);
        });
    }

    /// Drops unused values
    fn visit_mut_seq_expr(&mut self, e: &mut SeqExpr) {
        if e.exprs.is_empty() {
            return;
        }

        let old_in_callee = self.in_callee;
        let len = e.exprs.len();
        for (idx, e) in e.exprs.iter_mut().enumerate() {
            if idx == len - 1 {
                self.in_callee = old_in_callee;
            } else {
                self.in_callee = false;
            }

            e.visit_mut_with(self);
        }
        self.in_callee = old_in_callee;

        let len = e.exprs.len();

        let last_expr = e.exprs.pop().expect("SeqExpr.exprs must not be empty");

        // Expressions except last one
        let mut exprs = Vec::with_capacity(e.exprs.len() + 1);

        for expr in e.exprs.take() {
            match *expr {
                Expr::Lit(Lit::Num(n)) if self.in_callee && n.value == 0.0 => {
                    if exprs.is_empty() {
                        exprs.push(0.0.into());

                        tracing::trace!("expr_simplifier: Preserving first zero");
                    }
                }

                Expr::Lit(..) | Expr::Ident(..)
                    if self.in_callee && !expr.may_have_side_effects(self.expr_ctx) =>
                {
                    if exprs.is_empty() {
                        self.changed = true;

                        exprs.push(0.0.into());

                        tracing::debug!("expr_simplifier: Injected first zero");
                    }
                }

                // Drop side-effect free nodes.
                Expr::Lit(_) => {}

                // Flatten array
                Expr::Array(ArrayLit { span, elems }) => {
                    let is_simple = elems
                        .iter()
                        .all(|elem| matches!(elem, None | Some(ExprOrSpread { spread: None, .. })));

                    if is_simple {
                        exprs.extend(elems.into_iter().flatten().map(|e| e.expr));
                    } else {
                        exprs.push(Box::new(ArrayLit { span, elems }.into()));
                    }
                }

                // Default case: preserve it
                _ => exprs.push(expr),
            }
        }

        exprs.push(last_expr);

        self.changed |= len != exprs.len();

        e.exprs = exprs;
    }

    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
        let old_is_modifying = self.is_modifying;
        self.is_modifying = false;
        let old_is_arg_of_update = self.is_arg_of_update;
        self.is_arg_of_update = false;
        s.visit_mut_children_with(self);
        self.is_arg_of_update = old_is_arg_of_update;
        self.is_modifying = old_is_modifying;

        debug_assert_valid(s);
    }

    fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
        let mut child = SimplifyExpr {
            expr_ctx: self.expr_ctx,
            config: self.config,
            changed: Default::default(),
            is_arg_of_update: Default::default(),
            is_modifying: Default::default(),
            in_callee: Default::default(),
        };

        child.maybe_par(cpu_count(), n, |v, n| {
            n.visit_mut_with(v);
        });
        self.changed |= child.changed;
    }

    fn visit_mut_tagged_tpl(&mut self, n: &mut TaggedTpl) {
        let old = self.in_callee;
        self.in_callee = true;

        n.tag.visit_mut_with(self);

        self.in_callee = false;
        n.tpl.visit_mut_with(self);

        self.in_callee = old;
    }

    fn visit_mut_update_expr(&mut self, n: &mut UpdateExpr) {
        let old = self.is_modifying;
        self.is_modifying = true;
        n.arg.visit_mut_with(self);
        self.is_modifying = old;
    }

    fn visit_mut_with_stmt(&mut self, n: &mut WithStmt) {
        n.obj.visit_mut_with(self);
    }
}

fn nth_char(s: &str, mut idx: usize) -> Option<Cow<str>> {
    if s.chars().any(|c| c.len_utf16() > 1) {
        return None;
    }

    if !s.contains("\\ud") && !s.contains("\\uD") {
        return Some(Cow::Owned(s.chars().nth(idx).unwrap().to_string()));
    }

    let mut iter = s.chars().peekable();

    while let Some(c) = iter.next() {
        if c == '\\' && iter.peek().copied() == Some('u') {
            if idx == 0 {
                let mut buf = String::new();
                buf.push('\\');
                buf.extend(iter.take(5));
                return Some(Cow::Owned(buf));
            } else {
                for _ in 0..5 {
                    iter.next();
                }
            }
        }

        if idx == 0 {
            return Some(Cow::Owned(c.to_string()));
        }

        idx -= 1;
    }

    unreachable!("string is too short")
}

fn need_zero_for_this(e: &Expr) -> bool {
    e.directness_matters() || e.is_seq()
}

/// Gets the value of the given key from the given object properties, if the key
/// exists. If the key does exist, `Some` is returned and the property is
/// removed from the given properties.
fn get_key_value(key: &str, props: &mut Vec<PropOrSpread>) -> Option<Box<Expr>> {
    // It's impossible to know the value for certain if a spread property exists.
    let has_spread = props.iter().any(|prop| prop.is_spread());

    if has_spread {
        return None;
    }

    for (i, prop) in props.iter_mut().enumerate().rev() {
        let prop = match prop {
            PropOrSpread::Prop(x) => &mut **x,
            PropOrSpread::Spread(_) => unreachable!(),
        };

        match prop {
            Prop::Shorthand(ident) if ident.sym == key => {
                let prop = match props.remove(i) {
                    PropOrSpread::Prop(x) => *x,
                    _ => unreachable!(),
                };
                let ident = match prop {
                    Prop::Shorthand(x) => x,
                    _ => unreachable!(),
                };
                return Some(ident.into());
            }

            Prop::KeyValue(prop) => {
                if key != "__proto__" && prop_name_eq(&prop.key, "__proto__") {
                    // If __proto__ is defined, we need to check the contents of it,
                    // as well as any nested __proto__ objects
                    let Expr::Object(ObjectLit { props, .. }) = &mut *prop.value else {
                        // __proto__ is not an ObjectLiteral. It's unsafe to keep trying to find
                        // a value for this key, since __proto__ might also contain the key.
                        return None;
                    };

                    // Get key value from __props__ object. Only return if
                    // the result is Some. If None, we keep searching in the
                    // parent object.
                    let v = get_key_value(key, props);
                    if v.is_some() {
                        return v;
                    }
                } else if prop_name_eq(&prop.key, key) {
                    let prop = match props.remove(i) {
                        PropOrSpread::Prop(x) => *x,
                        _ => unreachable!(),
                    };
                    let prop = match prop {
                        Prop::KeyValue(x) => x,
                        _ => unreachable!(),
                    };
                    return Some(prop.value);
                }
            }

            _ => {}
        }
    }

    None
}

/// **NOTE**: This is **NOT** a public API. DO NOT USE.
pub fn optimize_member_expr(
    expr_ctx: ExprCtx,
    expr: &mut Expr,
    is_callee: bool,
    changed: &mut bool,
) {
    let MemberExpr { obj, prop, .. } = match expr {
        Expr::Member(member) => member,
        _ => return,
    };

    #[derive(Clone, PartialEq)]
    enum KnownOp {
        /// [a, b].length
        Len,

        /// [a, b][0]
        ///
        /// {0.5: "bar"}[0.5]
        /// Note: callers need to check `v.fract() == 0.0` in some cases.
        /// ie non-integer indexes for arrays result in `undefined`
        /// but not for objects (because indexing an object
        /// returns the value of the key, ie `0.5` will not
        /// return `undefined` if a key `0.5` exists
        /// and its value is not `undefined`).
        Index(f64),

        /// ({}).foo
        IndexStr(Atom),
    }
    let op = match prop {
        MemberProp::Ident(IdentName { sym, .. }) if &**sym == "length" && !obj.is_object() => {
            KnownOp::Len
        }
        MemberProp::Ident(IdentName { sym, .. }) => {
            if is_callee {
                return;
            }

            KnownOp::IndexStr(sym.clone())
        }
        MemberProp::Computed(ComputedPropName { expr, .. }) => {
            if is_callee {
                return;
            }

            if let Expr::Lit(Lit::Num(Number { value, .. })) = &**expr {
                // x[5]
                KnownOp::Index(*value)
            } else if let Known(s) = expr.as_pure_string(expr_ctx) {
                if s == "length" && !obj.is_object() {
                    // Length of non-object type
                    KnownOp::Len
                } else if let Ok(n) = s.parse::<f64>() {
                    // x['0'] is treated as x[0]
                    KnownOp::Index(n)
                } else {
                    // x[''] or x[...] where ... is an expression like [], ie x[[]]
                    KnownOp::IndexStr(s.into())
                }
            } else {
                return;
            }
        }
        _ => return,
    };

    // Note: pristine_globals refers to the compress config option pristine_globals.
    // Any potential cases where globals are not pristine are handled in compress,
    // e.g. x[-1] is not changed as the object's prototype may be modified.
    // For example, Array.prototype[-1] = "foo" will result in [][-1] returning
    // "foo".

    match &mut **obj {
        Expr::Lit(Lit::Str(Str { value, span, .. })) => match op {
            // 'foo'.length
            //
            // Prototype changes do not affect .length, so we don't need to worry
            // about pristine_globals here.
            KnownOp::Len => {
                *changed = true;

                *expr = Lit::Num(Number {
                    value: value.chars().map(|c| c.len_utf16()).sum::<usize>() as _,
                    span: *span,
                    raw: None,
                })
                .into();
            }

            // 'foo'[1]
            KnownOp::Index(idx) => {
                if idx.fract() != 0.0 || idx < 0.0 || idx as usize >= value.len() {
                    // Prototype changes affect indexing if the index is out of bounds, so we
                    // don't replace out-of-bound indexes.
                    return;
                }

                let Some(value) = nth_char(value, idx as _) else {
                    return;
                };

                *changed = true;

                *expr = Lit::Str(Str {
                    raw: None,
                    value: value.into(),
                    span: *span,
                })
                .into()
            }

            // 'foo'['']
            //
            // Handled in compress
            KnownOp::IndexStr(..) => {}
        },

        // [1, 2, 3].length
        //
        // [1, 2, 3][0]
        Expr::Array(ArrayLit { elems, span }) => {
            // do nothing if spread exists
            let has_spread = elems.iter().any(|elem| {
                elem.as_ref()
                    .map(|elem| elem.spread.is_some())
                    .unwrap_or(false)
            });

            if has_spread {
                return;
            }

            match op {
                KnownOp::Len => {
                    // do nothing if replacement will have side effects
                    let may_have_side_effects = elems
                        .iter()
                        .filter_map(|e| e.as_ref())
                        .any(|e| e.expr.may_have_side_effects(expr_ctx));

                    if may_have_side_effects {
                        return;
                    }

                    // Prototype changes do not affect .length
                    *changed = true;

                    *expr = Lit::Num(Number {
                        value: elems.len() as _,
                        span: *span,
                        raw: None,
                    })
                    .into();
                }

                KnownOp::Index(idx) => {
                    // If the fraction part is non-zero, or if the index is out of bounds,
                    // then we handle this in compress as Array's prototype may be modified.
                    if idx.fract() != 0.0 || idx < 0.0 || idx as usize >= elems.len() {
                        return;
                    }

                    // Don't change if after has side effects.
                    let after_has_side_effect =
                        elems
                            .iter()
                            .skip((idx as usize + 1) as _)
                            .any(|elem| match elem {
                                Some(elem) => elem.expr.may_have_side_effects(expr_ctx),
                                None => false,
                            });

                    if after_has_side_effect {
                        return;
                    }

                    *changed = true;

                    // elements before target element
                    let before: Vec<Option<ExprOrSpread>> = elems.drain(..(idx as usize)).collect();
                    let mut iter = elems.take().into_iter();
                    // element at idx
                    let e = iter.next().flatten();
                    // elements after target element
                    let after: Vec<Option<ExprOrSpread>> = iter.collect();

                    // element value
                    let v = match e {
                        None => Expr::undefined(*span),
                        Some(e) => e.expr,
                    };

                    // Replacement expressions.
                    let mut exprs = Vec::new();

                    // Add before side effects.
                    for elem in before.into_iter().flatten() {
                        expr_ctx.extract_side_effects_to(&mut exprs, *elem.expr);
                    }

                    // Element value.
                    let val = v;

                    // Add after side effects.
                    for elem in after.into_iter().flatten() {
                        expr_ctx.extract_side_effects_to(&mut exprs, *elem.expr);
                    }

                    // Note: we always replace with a SeqExpr so that
                    // `this` remains undefined in strict mode.

                    // No side effects exist, replace with:
                    // (0, val)
                    if exprs.is_empty() && val.directness_matters() {
                        exprs.push(0.into());
                    }

                    // Add value and replace with SeqExpr
                    exprs.push(val);
                    *expr = *Expr::from_exprs(exprs);
                }

                // Handled in compress
                KnownOp::IndexStr(..) => {}
            }
        }

        // { foo: true }['foo']
        //
        // { 0.5: true }[0.5]
        Expr::Object(ObjectLit { props, span }) => {
            // get key
            let key = match op {
                KnownOp::Index(i) => Atom::from(i.to_string()),
                KnownOp::IndexStr(key) if key != *"yield" && is_literal(props) => key,
                _ => return,
            };

            // Get `key`s value. Non-existent keys are handled in compress.
            // This also checks if spread exists.
            let Some(v) = get_key_value(&key, props) else {
                return;
            };

            *changed = true;

            *expr = *expr_ctx.preserve_effects(
                *span,
                v,
                once(
                    ObjectLit {
                        props: props.take(),
                        span: *span,
                    }
                    .into(),
                ),
            );
        }

        _ => {}
    }
}

/// **NOTE**: This is **NOT** a public API. DO NOT USE.
pub fn optimize_bin_expr(expr_ctx: ExprCtx, expr: &mut Expr, changed: &mut bool) {
    let Some(bin_expr) = expr.as_mut_bin() else {
        return;
    };

    let op = bin_expr.op;
    let span = bin_expr.span;
    let left_span = bin_expr.left.span();
    let right_span = bin_expr.right.span();

    macro_rules! change {
        ($replacement:expr) => {
            *changed = true;
            *expr = *expr_ctx.preserve_effects(
                span,
                Box::new($replacement),
                iter::once(expr.take().into()),
            );
        };
    }

    let Some(replacement) = (match op {
        op!("&&") | op!("||") => {
            // Logical expressions are handled differently compared to others,
            // as we extract the side effects differently.
            let Some(val) = optimize_logical_expr(expr_ctx, bin_expr) else {
                return;
            };

            *changed = true;
            *expr = val;
            return;
        }
        op!("instanceof") => {
            let (_, Known(value)) = expr.cast_to_bool(expr_ctx) else {
                return;
            };

            Some(Expr::Lit(Lit::Bool(Bool { span, value })))
        }
        op!(bin, "+") => {
            match expr.get_type(expr_ctx) {
                Known(Type::Str) => {
                    // String concatenation
                    let Known(val) = expr.as_pure_string(expr_ctx) else {
                        return;
                    };

                    Some(Expr::Lit(Lit::Str(Str {
                        span,
                        value: val.into(),
                        raw: None,
                    })))
                }
                Known(Type::Num) => {
                    // Arithmetic
                    let (_, Known(val)) = expr.cast_to_number(expr_ctx) else {
                        return;
                    };

                    if will_become_longer(left_span, right_span, val) {
                        return;
                    }

                    Some(make_number_expr(expr_ctx, span, val))
                }
                _ => None,
            }
        }
        op!(bin, "-")
        | op!("/")
        | op!("%")
        | op!("**")
        | op!("<<")
        | op!(">>")
        | op!(">>>")
        | op!("*")
        | op!("&")
        | op!("|")
        | op!("^") => {
            // Arithmetic

            fn try_simplify(
                expr_ctx: ExprCtx,
                expr: &Expr,
                left_span: Span,
                right_span: Span,
                span: Span,
            ) -> Option<Expr> {
                let (_, Known(value)) = expr.cast_to_number(expr_ctx) else {
                    return None;
                };

                if will_become_longer(left_span, right_span, value) {
                    return None;
                }

                Some(make_number_expr(expr_ctx, span, value))
            }

            // Try simplify first.
            if let Some(simplified) = try_simplify(expr_ctx, expr, left_span, right_span, span) {
                change!(simplified);
                return;
            }

            if matches!(op, op!("*") | op!("&") | op!("|") | op!("^")) {
                // If simplification failed, then try fold the expression.
                if let Some(folded) = try_fold_arithmetic_expr(expr_ctx, expr) {
                    // We avoid using `change` here as `preserve_effects` will panic because
                    // of an inner node being taken in `try_fold_arithmetic_expr`.
                    //
                    // Also, it's not necessary to extract side effects in this case,
                    // as the expression is a binary expression.
                    *changed = true;
                    *expr = folded;
                    return;
                }
            }

            None
        }
        op!("<")
        | op!(">")
        | op!("<=")
        | op!(">=")
        | op!("==")
        | op!("!=")
        | op!("!==")
        | op!("===") => {
            // Comparisons
            let (_, Known(value)) = expr.cast_to_bool(expr_ctx) else {
                return;
            };

            Some(Expr::Lit(Lit::Bool(Bool { span, value })))
        }
        _ => None,
    }) else {
        return;
    };

    change!(replacement);
}

/// Optimizes `&&` and `||`.
fn optimize_logical_expr(expr_ctx: ExprCtx, bin_expr: &mut BinExpr) -> Option<Expr> {
    let (_, Known(lhs)) = bin_expr.left.cast_to_bool(expr_ctx) else {
        return None;
    };

    let node = if bin_expr.op == op!("&&") {
        if lhs {
            // true && $right
            &mut bin_expr.right
        } else {
            // false && $right
            return Some(*bin_expr.left.take());
        }
    } else if lhs {
        // true || $right
        return Some(*bin_expr.left.take());
    } else {
        // false || $right
        &mut bin_expr.right
    };

    Some(if bin_expr.left.may_have_side_effects(expr_ctx) {
        Expr::Seq(SeqExpr {
            span: bin_expr.span, // todo: validate
            exprs: vec![bin_expr.left.take(), node.take()],
        })
    } else if node.directness_matters() {
        Expr::Seq(SeqExpr {
            span: node.span(),
            exprs: vec![0.into(), node.take()],
        })
    } else {
        *node.take()
    })
}

/// Optimizes left-hand side of expression, e.g.
/// `(a * 1) * 2` --> `a * (1 * 2)` --> `a * 2`
fn try_fold_arithmetic_expr(expr_ctx: ExprCtx, expr: &mut Expr) -> Option<Expr> {
    let bin_expr = expr.as_mut_bin()?;
    let Expr::Bin(BinExpr {
        span: left_span,
        left: left_lhs,
        op: left_op,
        right: left_rhs,
    }) = &mut *bin_expr.left
    else {
        return None;
    };

    if *left_op != bin_expr.op {
        return None;
    }

    let (Purity::Pure, Known(value)) =
        perform_arithmetic_op(expr_ctx, bin_expr.op, left_rhs, &bin_expr.right)
    else {
        return None;
    };

    // TODO: left_span might not be right here. before it was bin_expr.span, but i'm
    // not sure if this is correct either.

    Some(Expr::Bin(BinExpr {
        span: bin_expr.span,
        op: bin_expr.op,
        left: left_lhs.take(),
        right: Box::new(make_number_expr(expr_ctx, *left_span, value)),
    }))
}

/// **NOTE**: This is **NOT** a public API. DO NOT USE.
pub fn optimize_unary_expr(expr_ctx: ExprCtx, expr: &mut Expr, changed: &mut bool) {
    let val = {
        let UnaryExpr { op, arg, span } = match &expr {
            Expr::Unary(unary) => unary,
            _ => return,
        };

        let may_have_side_effects = arg.may_have_side_effects(expr_ctx);

        match op {
            op!("typeof") if !may_have_side_effects => {
                let Known(val) = expr.as_pure_string(expr_ctx) else {
                    return;
                };

                Expr::Lit(Lit::Str(Str {
                    span: *span,
                    value: val.into(),
                    raw: None,
                }))
            }

            op!("!") => {
                match &**arg {
                    // Don't expand booleans.
                    Expr::Lit(Lit::Num(_)) => return,

                    // Don't remove `!` from negated IIFE's.
                    Expr::Call(call)
                        if call.callee.as_expr().is_some_and(|expr| expr.is_fn_expr()) =>
                    {
                        return;
                    }

                    _ => {}
                };

                let (_, Known(val)) = arg.cast_to_bool(expr_ctx) else {
                    return;
                };
                Expr::Lit(Lit::Bool(Bool {
                    span: *span,
                    value: !val,
                }))
            }

            op!(unary, "+") | op!(unary, "-") | op!("~") => {
                // Don't replace `-Infinity`.
                if *op == op!(unary, "-") && arg.is_global_ref_to(expr_ctx, "Infinity") {
                    return;
                }

                let (_, Known(value)) = expr.cast_to_number(expr_ctx) else {
                    return;
                };

                make_number_expr(expr_ctx, *span, value)
            }

            op!("void")
                if !may_have_side_effects
                    && !matches!(&**arg, Expr::Lit(Lit::Num(n)) if n.value == 0.0) =>
            {
                // Optimize `void x` if `x` doesn't have a side effect and is not 0
                // (longer expressions are shortened, e.g. `void ""`, `void 10` -> `void 0`)
                *Expr::undefined(*span)
            }

            _ => return,
        }
    };

    *changed = true;
    *expr = *expr_ctx.preserve_effects(expr.span(), Box::new(val), iter::once(expr.take().into()));
}

fn make_number_expr(ctx: ExprCtx, span: Span, value: f64) -> Expr {
    // `-NaN` is the same as `NaN`.
    if value.is_nan() && value.is_sign_negative() {
        return make_number_expr(ctx, span, f64::NAN);
    }

    if value.is_nan() {
        Expr::Ident(Ident {
            span,
            ctxt: ctx.unresolved_ctxt,
            sym: atom!("NaN"),
            optional: false,
        })
    } else {
        Expr::Lit(Lit::Num(Number {
            span,
            value,
            raw: None,
        }))
    }
}

/// Checks if replacing a [BinExpr] with the given value would make it longer
/// than the original, based on the given [Span]s of the left and right hand
/// side expressions of the [BinExpr].
fn will_become_longer(left: Span, right: Span, value: f64) -> bool {
    if left.is_dummy() || right.is_dummy() || right.hi <= left.lo {
        // We assume it won't become longer if one of the spans are invalid.
        return false;
    }

    let new_len = format!("{}", value).len();
    let original_len = right.hi - right.lo + left.hi - left.lo;
    new_len > original_len.0 as usize + 1
}
