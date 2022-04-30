use std::{fmt::Write, num::FpCategory};

use swc_atoms::{js_word, JsWord};
use swc_common::{iter::IdentifyLast, util::take::Take, EqIgnoreSpan, Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::ident::IdentLike;

use super::Pure;
use crate::compress::util::{is_global_var, is_pure_undefined};

impl Pure<'_> {
    pub(super) fn remove_invalid(&mut self, e: &mut Expr) {
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

    pub(super) fn compress_array_join(&mut self, e: &mut Expr) {
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
            if let Some(new_expr) =
                self.compress_array_join_as_tpl(arr.span, &mut arr.elems, &separator)
            {
                self.changed = true;
                *e = new_expr;
                return;
            }

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

    pub(super) fn drop_undefined_from_return_arg(&mut self, s: &mut ReturnStmt) {
        if let Some(e) = s.arg.as_deref() {
            if is_pure_undefined(e) {
                self.changed = true;
                report_change!("Dropped `undefined` from `return undefined`");
                s.arg.take();
            }
        }
    }

    pub(super) fn remove_duplicate_returns(&mut self, stmts: &mut Vec<Stmt>) {
        fn drop_if_identical(last: &Stmt, check: &mut Stmt) -> bool {
            if check.eq_ignore_span(last) {
                check.take();
                return true;
            }

            match check {
                Stmt::Try(TryStmt {
                    finalizer: Some(finalizer),
                    ..
                }) => {
                    if let Some(check) = finalizer.stmts.last_mut() {
                        if drop_if_identical(last, check) {
                            return true;
                        }
                    }
                }

                Stmt::Try(TryStmt {
                    handler: Some(CatchClause { body, .. }),
                    finalizer: None,
                    ..
                }) => {
                    if let Some(check) = body.stmts.last_mut() {
                        if drop_if_identical(last, check) {
                            return true;
                        }
                    }
                }

                Stmt::If(IfStmt { cons, alt, .. }) => {
                    let mut changed = drop_if_identical(last, cons);
                    if let Some(alt) = alt {
                        if drop_if_identical(last, alt) {
                            changed = true;
                        }
                    }

                    return changed;
                }

                Stmt::Switch(SwitchStmt { cases, .. }) => {
                    for case in cases {
                        if let Some(check) = case.cons.last_mut() {
                            if drop_if_identical(last, check) {
                                return true;
                            }
                        }
                    }
                }

                _ => {}
            }

            false
        }

        if stmts.is_empty() {
            return;
        }

        let orig_len = stmts.len();
        let (a, b) = stmts.split_at_mut(orig_len - 1);

        if let Some(last @ Stmt::Return(..)) = b.last() {
            if let Some(stmt_before_last) = a.last_mut() {
                if drop_if_identical(last, stmt_before_last) {
                    self.changed = true;
                    report_change!("Dropped duplicate return");
                }
            }
        }
    }

    pub(super) fn remove_useless_return(&mut self, stmts: &mut Vec<Stmt>) {
        if !self.options.dead_code && !self.options.reduce_vars {
            return;
        }

        if let Some(Stmt::Return(ReturnStmt { arg: None, .. })) = stmts.last() {
            self.changed = true;
            report_change!("misc: Removing useless return");
            stmts.pop();
        }
    }

    /// Removes last return statement. This should be callled only if the return
    /// value of function is ignored.
    ///
    /// Returns true if something is modified.
    fn drop_return_value(&mut self, stmts: &mut Vec<Stmt>) -> bool {
        for s in stmts.iter_mut() {
            if let Stmt::Return(ReturnStmt {
                arg: arg @ Some(..),
                ..
            }) = s
            {
                self.ignore_return_value(
                    arg.as_deref_mut().unwrap(),
                    DropOpts {
                        drop_global_refs_if_unused: true,
                        drop_zero: true,
                        drop_str_lit: true,
                        ..Default::default()
                    },
                );

                if let Some(Expr::Invalid(..)) = arg.as_deref() {
                    self.changed = true;
                    *arg = None;
                }
            }
        }

        if let Some(last) = stmts.last_mut() {
            self.drop_return_value_of_stmt(last)
        } else {
            false
        }
    }

    fn compress_array_join_as_tpl(
        &mut self,
        span: Span,
        elems: &mut Vec<Option<ExprOrSpread>>,
        sep: &str,
    ) -> Option<Expr> {
        if !self.options.evaluate {
            return None;
        }

        if elems.iter().flatten().any(|elem| match &*elem.expr {
            Expr::Tpl(t) => t.quasis.iter().any(|q| q.cooked.is_none()),
            Expr::Lit(Lit::Str(..)) => false,
            _ => true,
        }) {
            return None;
        }

        self.changed = true;
        report_change!("Compressing array.join() as template literal");

        let mut new_tpl = Tpl {
            span,
            quasis: vec![],
            exprs: vec![],
        };
        let mut cur_str_value = String::new();
        let mut first = true;

        for elem in elems.take().into_iter().flatten() {
            if first {
                first = false;
            } else {
                cur_str_value.push_str(sep);
            }

            match *elem.expr {
                Expr::Tpl(mut tpl) => {
                    //
                    for idx in 0..(tpl.quasis.len() + tpl.exprs.len()) {
                        if idx % 2 == 0 {
                            // quasis
                            let e = tpl.quasis[idx / 2].take();

                            cur_str_value.push_str(&e.cooked.unwrap());
                        } else {
                            let s = JsWord::from(&*cur_str_value);
                            cur_str_value.clear();
                            new_tpl.quasis.push(TplElement {
                                span: DUMMY_SP,
                                tail: false,
                                cooked: Some(s.clone()),
                                raw: s,
                            });

                            let e = tpl.exprs[idx / 2].take();

                            new_tpl.exprs.push(e);
                        }
                    }
                }
                Expr::Lit(Lit::Str(s)) => {
                    cur_str_value.push_str(&s.value);
                }
                _ => {
                    unreachable!()
                }
            }
        }

        let s = JsWord::from(&*cur_str_value);
        new_tpl.quasis.push(TplElement {
            span: DUMMY_SP,
            tail: false,
            cooked: Some(s.clone()),
            raw: s,
        });

        Some(Expr::Tpl(new_tpl))
    }

    /// Returns true if something is modified.
    fn drop_return_value_of_stmt(&mut self, s: &mut Stmt) -> bool {
        match s {
            Stmt::Block(s) => self.drop_return_value(&mut s.stmts),
            Stmt::Return(ret) => {
                self.changed = true;
                report_change!("Dropping `return` token");

                let span = ret.span;
                match ret.arg.take() {
                    Some(arg) => {
                        *s = Stmt::Expr(ExprStmt { span, expr: arg });
                    }
                    None => {
                        *s = Stmt::Empty(EmptyStmt { span });
                    }
                }

                true
            }

            Stmt::Labeled(s) => self.drop_return_value_of_stmt(&mut s.body),
            Stmt::If(s) => {
                let c = self.drop_return_value_of_stmt(&mut s.cons);
                let a = s
                    .alt
                    .as_deref_mut()
                    .map(|s| self.drop_return_value_of_stmt(s))
                    .unwrap_or_default();

                c || a
            }

            Stmt::Try(s) => {
                let a = if s.finalizer.is_none() {
                    self.drop_return_value(&mut s.block.stmts)
                } else {
                    false
                };

                let b = s
                    .finalizer
                    .as_mut()
                    .map(|s| self.drop_return_value(&mut s.stmts))
                    .unwrap_or_default();

                a || b
            }

            _ => false,
        }
    }

    fn make_ignored_expr(&mut self, exprs: impl Iterator<Item = Box<Expr>>) -> Option<Expr> {
        let mut exprs = exprs
            .filter_map(|mut e| {
                self.ignore_return_value(
                    &mut *e,
                    DropOpts {
                        drop_global_refs_if_unused: true,
                        drop_str_lit: true,
                        drop_zero: true,
                    },
                );

                if let Expr::Invalid(..) = &*e {
                    None
                } else {
                    Some(e)
                }
            })
            .collect::<Vec<_>>();

        if exprs.is_empty() {
            return None;
        }
        if exprs.len() == 1 {
            return Some(*exprs.remove(0));
        }

        Some(Expr::Seq(SeqExpr {
            span: DUMMY_SP,
            exprs,
        }))
    }

    #[inline(never)]
    pub(super) fn ignore_return_value(&mut self, e: &mut Expr, opts: DropOpts) {
        self.optimize_expr_in_bool_ctx(e, true);

        match e {
            Expr::Seq(seq) => {
                if seq.exprs.is_empty() {
                    e.take();
                    return;
                }
            }

            Expr::Call(CallExpr { span, args, .. }) if span.has_mark(self.marks.pure) => {
                report_change!("ignore_return_value: Dropping a pure call");
                self.changed = true;

                let new = self.make_ignored_expr(args.take().into_iter().map(|arg| arg.expr));

                *e = new.unwrap_or(Expr::Invalid(Invalid { span: DUMMY_SP }));
                return;
            }

            Expr::TaggedTpl(TaggedTpl {
                span,
                tpl: Tpl { exprs, .. },
                ..
            }) if span.has_mark(self.marks.pure) => {
                report_change!("ignore_return_value: Dropping a pure call");
                self.changed = true;

                let new = self.make_ignored_expr(exprs.take().into_iter());

                *e = new.unwrap_or(Expr::Invalid(Invalid { span: DUMMY_SP }));
                return;
            }

            Expr::New(NewExpr { span, args, .. }) if span.has_mark(self.marks.pure) => {
                report_change!("ignore_return_value: Dropping a pure call");
                self.changed = true;

                let new =
                    self.make_ignored_expr(args.take().into_iter().flatten().map(|arg| arg.expr));

                *e = new.unwrap_or(Expr::Invalid(Invalid { span: DUMMY_SP }));
                return;
            }

            _ => {}
        }

        if self.options.unused {
            if let Expr::Lit(Lit::Num(n)) = e {
                // Skip 0
                if n.value != 0.0 && n.value.classify() == FpCategory::Normal {
                    self.changed = true;
                    *e = Expr::Invalid(Invalid { span: DUMMY_SP });
                    return;
                }
            }
        }

        if let Expr::Ident(i) = e {
            // If it's not a top level, it's a reference to a declared variable.
            if i.span.ctxt.outer() == self.marks.unresolved_mark {
                if self.options.side_effects
                    || (self.options.unused && opts.drop_global_refs_if_unused)
                {
                    if is_global_var(&i.sym) {
                        report_change!("Dropping a reference to a global variable");
                        *e = Expr::Invalid(Invalid { span: DUMMY_SP });
                        return;
                    }
                }
            } else {
                report_change!("Dropping an identifier as it's declared");
                *e = Expr::Invalid(Invalid { span: DUMMY_SP });
                return;
            }
        }

        if self.options.side_effects {
            match e {
                Expr::Unary(UnaryExpr {
                    op: op!("void") | op!("typeof") | op!(unary, "+") | op!(unary, "-"),
                    arg,
                    ..
                }) => {
                    self.ignore_return_value(
                        &mut **arg,
                        DropOpts {
                            drop_str_lit: true,
                            drop_global_refs_if_unused: true,
                            drop_zero: true,
                            ..opts
                        },
                    );

                    if arg.is_invalid() {
                        report_change!("Dropping an unary expression");
                        *e = Expr::Invalid(Invalid { span: DUMMY_SP });
                        return;
                    }
                }

                Expr::Bin(
                    be @ BinExpr {
                        op: op!("||") | op!("&&"),
                        ..
                    },
                ) => {
                    self.ignore_return_value(&mut be.right, opts);

                    if be.right.is_invalid() {
                        report_change!("Dropping the RHS of a binary expression ('&&' / '||')");
                        *e = *be.left.take();
                        return;
                    }
                }

                Expr::Tpl(tpl) => {
                    self.changed = true;
                    report_change!("Dropping a template literal");

                    for expr in tpl.exprs.iter_mut() {
                        self.ignore_return_value(&mut *expr, opts);
                    }
                    tpl.exprs.retain(|expr| !expr.is_invalid());
                    if tpl.exprs.is_empty() {
                        e.take();
                    } else {
                        *e = Expr::Seq(SeqExpr {
                            span: tpl.span,
                            exprs: tpl.exprs.take(),
                        });
                    }

                    return;
                }

                _ => {}
            }
        }

        if self.options.unused || self.options.side_effects {
            match e {
                Expr::Lit(Lit::Num(n)) => {
                    if n.value == 0.0 && opts.drop_zero {
                        self.changed = true;
                        *e = Expr::Invalid(Invalid { span: DUMMY_SP });
                        return;
                    }
                }

                Expr::Ident(i) => {
                    if i.span.ctxt.outer() != self.marks.unresolved_mark {
                        report_change!("Dropping an identifier as it's declared");

                        self.changed = true;
                        *e = Expr::Invalid(Invalid { span: DUMMY_SP });
                        return;
                    }
                }

                Expr::Lit(Lit::Null(..) | Lit::BigInt(..) | Lit::Bool(..) | Lit::Regex(..)) => {
                    report_change!("Dropping literals");

                    self.changed = true;
                    *e = Expr::Invalid(Invalid { span: DUMMY_SP });
                    return;
                }

                Expr::Bin(
                    bin @ BinExpr {
                        op:
                            op!(bin, "+")
                            | op!(bin, "-")
                            | op!("*")
                            | op!("/")
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
                    self.ignore_return_value(
                        &mut bin.left,
                        DropOpts {
                            drop_zero: true,
                            drop_global_refs_if_unused: true,
                            drop_str_lit: true,
                            ..opts
                        },
                    );
                    self.ignore_return_value(
                        &mut bin.right,
                        DropOpts {
                            drop_zero: true,
                            drop_global_refs_if_unused: true,
                            drop_str_lit: true,
                            ..opts
                        },
                    );
                    let span = bin.span;

                    if bin.left.is_invalid() && bin.right.is_invalid() {
                        *e = Expr::Invalid(Invalid { span: DUMMY_SP });
                        return;
                    } else if bin.right.is_invalid() {
                        *e = *bin.left.take();
                        return;
                    } else if bin.left.is_invalid() {
                        *e = *bin.right.take();
                        return;
                    }

                    if matches!(*bin.left, Expr::Await(..) | Expr::Update(..)) {
                        self.changed = true;
                        report_change!("ignore_return_value: Compressing binary as seq");
                        *e = Expr::Seq(SeqExpr {
                            span,
                            exprs: vec![bin.left.take(), bin.right.take()],
                        });
                        return;
                    }
                }

                Expr::Assign(assign @ AssignExpr { op: op!("="), .. }) => {
                    // Convert `a = a` to `a`.
                    if let Some(l) = assign.left.as_ident() {
                        if let Expr::Ident(r) = &*assign.right {
                            if l.to_id() == r.to_id() {
                                self.changed = true;
                                *e = *assign.right.take();
                            }
                        }
                    }
                }

                _ => {}
            }
        }

        match e {
            Expr::Lit(Lit::Str(s)) => {
                if opts.drop_str_lit
                    || (s.value.starts_with("@swc/helpers")
                        || s.value.starts_with("@babel/helpers"))
                {
                    self.changed = true;
                    *e = Expr::Invalid(Invalid { span: DUMMY_SP });
                    return;
                }
            }

            Expr::Seq(e) => {
                self.drop_useless_ident_ref_in_seq(e);

                if let Some(last) = e.exprs.last_mut() {
                    // Non-last elements are already processed.
                    self.ignore_return_value(&mut **last, opts);
                }

                let len = e.exprs.len();
                e.exprs.retain(|e| !e.is_invalid());
                if e.exprs.len() != len {
                    self.changed = true;
                }
                return;
            }

            Expr::Call(CallExpr {
                callee: Callee::Expr(callee),
                ..
            }) if callee.is_fn_expr() => match &mut **callee {
                Expr::Fn(callee) => {
                    if callee.ident.is_none() {
                        if let Some(body) = &mut callee.function.body {
                            if self.options.side_effects {
                                self.drop_return_value(&mut body.stmts);
                            }
                        }
                    }
                }

                _ => {
                    unreachable!()
                }
            },

            _ => {}
        }

        if self.options.side_effects && self.options.pristine_globals {
            if let Expr::New(NewExpr { callee, args, .. }) = e {
                if let Expr::Ident(i) = &**callee {
                    match &*i.sym {
                        "Map" | "Set" | "Array" | "Object" | "Boolean" | "Number" => {
                            if i.span.ctxt.outer() == self.marks.unresolved_mark {
                                report_change!("Dropping a pure new expression");

                                self.changed = true;
                                *e = self
                                    .make_ignored_expr(
                                        args.iter_mut().flatten().map(|arg| arg.expr.take()),
                                    )
                                    .unwrap_or(Expr::Invalid(Invalid { span: DUMMY_SP }));
                                return;
                            }
                        }
                        _ => {}
                    }
                }
            }
        }

        // Remove pure member expressions.
        if self.options.pristine_globals {
            if let Expr::Member(MemberExpr { obj, prop, .. }) = e {
                if let Expr::Ident(obj) = &**obj {
                    if obj.span.ctxt.outer() == self.marks.unresolved_mark {
                        if is_pure_member_access(obj, prop) {
                            self.changed = true;
                            report_change!("Remving pure member access to global var");
                            *e = Expr::Invalid(Invalid { span: DUMMY_SP });
                        }
                    }
                }
            }
        }
    }
}

#[derive(Debug, Default, Clone, Copy)]
pub(super) struct DropOpts {
    /// If true and `unused` option is enabled, references to global variables
    /// will be dropped, even if `side_effects` is false.
    pub drop_global_refs_if_unused: bool,
    pub drop_zero: bool,
    pub drop_str_lit: bool,
}

/// `obj` should have top level syntax context.
fn is_pure_member_access(obj: &Ident, prop: &MemberProp) -> bool {
    macro_rules! check {
        (
            $obj:ident.
            $prop:ident
        ) => {{
            if &*obj.sym == stringify!($obj) {
                if let MemberProp::Ident(prop) = prop {
                    if &*prop.sym == stringify!($prop) {
                        return true;
                    }
                }
            }
        }};
    }

    macro_rules! pure {
        (
            $(
                $(
                  $i:ident
                ).*
            ),*
        ) => {
            $(
                check!($($i).*);
            )*
        };
    }

    pure!(
        Array.isArray,
        ArrayBuffer.isView,
        Boolean.toSource,
        Date.parse,
        Date.UTC,
        Date.now,
        Error.captureStackTrace,
        Error.stackTraceLimit,
        Function.bind,
        Function.call,
        Function.length,
        console.log,
        Error.name,
        Math.random,
        Number.isNaN,
        Object.defineProperty,
        String.fromCharCode
    );

    false
}
