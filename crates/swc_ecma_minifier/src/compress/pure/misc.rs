use std::{fmt::Write, iter::once, num::FpCategory};

use swc_atoms::js_word;
use swc_common::{iter::IdentifyLast, util::take::Take, Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_optimization::debug_assert_valid;
use swc_ecma_usage_analyzer::util::is_global_var_with_pure_property_access;
use swc_ecma_utils::{
    ExprExt, ExprFactory, IdentUsageFinder, Type,
    Value::{self, Known},
};

use super::Pure;
use crate::compress::{
    pure::strings::{convert_str_value_to_tpl_cooked, convert_str_value_to_tpl_raw},
    util::is_pure_undefined,
};
impl Pure<'_> {
    pub(super) fn remove_invalid(&mut self, e: &mut Expr) {
        match e {
            Expr::Seq(seq) => {
                for e in &mut seq.exprs {
                    self.remove_invalid(e);
                }

                if seq.exprs.len() == 1 {
                    *e = *seq.exprs.pop().unwrap();
                }
            }

            Expr::Bin(BinExpr { left, right, .. }) => {
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

            _ => {}
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

            if is_pure_undefined(&self.expr_ctx, &call.args[0].expr) {
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
                e if is_pure_undefined(&self.expr_ctx, e) => false,
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
                    e if is_pure_undefined(&self.expr_ctx, e) => false,
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
                        e if is_pure_undefined(&self.expr_ctx, e) => {}
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
                    e if is_pure_undefined(&self.expr_ctx, e) => {}
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
            if is_pure_undefined(&self.expr_ctx, e) {
                self.changed = true;
                report_change!("Dropped `undefined` from `return undefined`");
                s.arg.take();
            }
        }
    }

    pub(super) fn remove_useless_return(&mut self, stmts: &mut Vec<Stmt>) {
        if !self.options.dead_code {
            return;
        }

        if let Some(Stmt::Return(ReturnStmt { arg: None, .. })) = stmts.last() {
            self.changed = true;
            report_change!("misc: Removing useless return");
            stmts.pop();
        }
    }

    /// `new RegExp("([Sap]+)", "ig")` => `/([Sap]+)/gi`
    fn optimize_regex(&mut self, args: &mut Vec<ExprOrSpread>, span: &mut Span) -> Option<Expr> {
        if args.is_empty() || args.len() > 2 {
            return None;
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
            return None;
        }

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
            return None;
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
            .unwrap_or_default();

        report_change!("Optimized regex");

        Some(Expr::Lit(Lit::Regex(Regex {
            span: *span,
            exp: pattern.into(),
            flags,
        })))
    }

    /// Array() -> []
    fn optimize_array(&mut self, args: &mut Vec<ExprOrSpread>, span: &mut Span) -> Option<Expr> {
        if args.len() == 1 {
            if let ExprOrSpread { spread: None, expr } = &args[0] {
                match &**expr {
                    Expr::Lit(Lit::Num(num)) => {
                        if num.value <= 5_f64 && num.value >= 0_f64 {
                            Some(Expr::Array(ArrayLit {
                                span: *span,
                                elems: vec![None; num.value as usize],
                            }))
                        } else {
                            None
                        }
                    }
                    Expr::Lit(_) => Some(Expr::Array(ArrayLit {
                        span: *span,
                        elems: vec![args.take().into_iter().next()],
                    })),
                    _ => None,
                }
            } else {
                None
            }
        } else {
            Some(Expr::Array(ArrayLit {
                span: *span,
                elems: args.take().into_iter().map(Some).collect(),
            }))
        }
    }

    /// Object -> {}
    fn optimize_object(&mut self, args: &mut Vec<ExprOrSpread>, span: &mut Span) -> Option<Expr> {
        if args.is_empty() {
            Some(Expr::Object(ObjectLit {
                span: *span,
                props: Vec::new(),
            }))
        } else {
            None
        }
    }

    pub(super) fn optimize_opt_chain(&mut self, e: &mut Expr) {
        let opt = match e {
            Expr::OptChain(c) => c,
            _ => return,
        };

        if let OptChainBase::Member(base) = &mut opt.base {
            if match &*base.obj {
                Expr::Lit(Lit::Null(..)) => false,
                Expr::Lit(..) | Expr::Object(..) | Expr::Array(..) => true,
                _ => false,
            } {
                self.changed = true;
                report_change!("Optimized optional chaining expression where object is not null");

                *e = Expr::Member(MemberExpr {
                    span: opt.span,
                    obj: base.obj.take(),
                    prop: base.prop.take(),
                });
            }
        }
    }

    /// new Array(...) -> Array(...)
    pub(super) fn optimize_builtin_object(&mut self, e: &mut Expr) {
        if !self.options.pristine_globals {
            return;
        }

        match e {
            Expr::New(NewExpr {
                span,
                callee,
                args: Some(args),
                ..
            })
            | Expr::Call(CallExpr {
                span,
                callee: Callee::Expr(callee),
                args,
                ..
            }) if callee
                .is_one_of_global_ref_to(&self.expr_ctx, &["Array", "Object", "RegExp"]) =>
            {
                let new_expr = match &**callee {
                    Expr::Ident(Ident {
                        sym: js_word!("RegExp"),
                        ..
                    }) => self.optimize_regex(args, span),
                    Expr::Ident(Ident {
                        sym: js_word!("Array"),
                        ..
                    }) => self.optimize_array(args, span),
                    Expr::Ident(Ident {
                        sym: js_word!("Object"),
                        ..
                    }) => self.optimize_object(args, span),
                    _ => unreachable!(),
                };

                if let Some(new_expr) = new_expr {
                    report_change!(
                        "Converting Regexp/Array/Object call to native constructor into literal"
                    );
                    self.changed = true;
                    *e = new_expr;
                    return;
                }
            }
            _ => {}
        };

        match e {
            Expr::New(NewExpr {
                span,
                callee,
                args,
                type_args,
            }) if callee.is_one_of_global_ref_to(
                &self.expr_ctx,
                &[
                    "Object",
                    // https://262.ecma-international.org/12.0/#sec-array-constructor
                    "Array",
                    // https://262.ecma-international.org/12.0/#sec-function-constructor
                    "Function",
                    // https://262.ecma-international.org/12.0/#sec-regexp-constructor
                    "RegExp",
                    // https://262.ecma-international.org/12.0/#sec-error-constructor
                    "Error",
                    // https://262.ecma-international.org/12.0/#sec-aggregate-error-constructor
                    "AggregateError",
                    // https://262.ecma-international.org/12.0/#sec-nativeerror-object-structure
                    "EvalError",
                    "RangeError",
                    "ReferenceError",
                    "SyntaxError",
                    "TypeError",
                    "URIError",
                ],
            ) =>
            {
                self.changed = true;
                report_change!(
                    "new operator: Compressing `new Array/RegExp/..` => `Array()/RegExp()/..`"
                );
                *e = Expr::Call(CallExpr {
                    span: *span,
                    callee: callee.take().as_callee(),
                    args: args.take().unwrap_or_default(),
                    type_args: type_args.take(),
                })
            }
            _ => {}
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
        let mut cur_raw = String::new();
        let mut cur_cooked = String::new();
        let mut first = true;

        for elem in elems.take().into_iter().flatten() {
            if first {
                first = false;
            } else {
                cur_raw.push_str(sep);
                cur_cooked.push_str(sep);
            }

            match *elem.expr {
                Expr::Tpl(mut tpl) => {
                    //
                    for idx in 0..(tpl.quasis.len() + tpl.exprs.len()) {
                        if idx % 2 == 0 {
                            // quasis
                            let e = tpl.quasis[idx / 2].take();

                            cur_cooked.push_str(&e.cooked.unwrap());
                            cur_raw.push_str(&e.raw);
                        } else {
                            new_tpl.quasis.push(TplElement {
                                span: DUMMY_SP,
                                tail: false,
                                cooked: Some((&*cur_cooked).into()),
                                raw: (&*cur_raw).into(),
                            });

                            cur_raw.clear();
                            cur_cooked.clear();

                            let e = tpl.exprs[idx / 2].take();

                            new_tpl.exprs.push(e);
                        }
                    }
                }
                Expr::Lit(Lit::Str(s)) => {
                    cur_cooked.push_str(&convert_str_value_to_tpl_cooked(&s.value));
                    cur_raw.push_str(&convert_str_value_to_tpl_raw(&s.value));
                }
                _ => {
                    unreachable!()
                }
            }
        }

        new_tpl.quasis.push(TplElement {
            span: DUMMY_SP,
            tail: false,
            cooked: Some(cur_cooked.into()),
            raw: cur_raw.into(),
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
                    &mut e,
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

    /// Calls [`Self::ignore_return_value`] on the arguments of return
    /// statemetns.
    ///
    /// This function is recursive but does not go into nested scopes.
    pub(super) fn ignore_return_value_of_return_stmt(&mut self, s: &mut Stmt, opts: DropOpts) {
        match s {
            Stmt::Return(s) => {
                if let Some(arg) = &mut s.arg {
                    self.ignore_return_value(arg, opts);
                    if arg.is_invalid() {
                        report_change!(
                            "Dropped the argument of a return statement because the return value \
                             is ignored"
                        );
                        s.arg = None;
                    }
                }
            }

            Stmt::Block(s) => {
                for stmt in &mut s.stmts {
                    self.ignore_return_value_of_return_stmt(stmt, opts);
                }
            }

            Stmt::If(s) => {
                self.ignore_return_value_of_return_stmt(&mut s.cons, opts);
                if let Some(alt) = &mut s.alt {
                    self.ignore_return_value_of_return_stmt(alt, opts);
                }
            }

            Stmt::Switch(s) => {
                for case in &mut s.cases {
                    for stmt in &mut case.cons {
                        self.ignore_return_value_of_return_stmt(stmt, opts);
                    }
                }
            }

            _ => {}
        }
    }

    pub(super) fn ignore_return_value(&mut self, e: &mut Expr, opts: DropOpts) {
        if e.is_invalid() {
            return;
        }

        debug_assert_valid(e);

        self.optimize_expr_in_bool_ctx(e, true);

        match e {
            Expr::Seq(seq) => {
                if seq.exprs.is_empty() {
                    e.take();
                    return;
                }
                if seq.exprs.len() == 1 {
                    *e = *seq.exprs.remove(0);
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

            Expr::Member(MemberExpr {
                span, obj, prop, ..
            }) if span.has_mark(self.marks.pure) => {
                report_change!("ignore_return_value: Dropping a pure member expression");
                self.changed = true;

                let new = self.make_ignored_expr(
                    once(obj.take()).chain(prop.take().computed().map(|v| v.expr)),
                );

                *e = new.unwrap_or(Expr::Invalid(Invalid { span: DUMMY_SP }));
                return;
            }

            _ => {}
        }

        if let Expr::Call(CallExpr {
            callee: Callee::Expr(callee),
            args,
            ..
        }) = e
        {
            if callee.is_pure_callee(&self.expr_ctx) {
                self.changed = true;
                report_change!("Dropping pure call as callee is pure");
                *e = self
                    .make_ignored_expr(args.take().into_iter().map(|arg| arg.expr))
                    .unwrap_or(Expr::Invalid(Invalid { span: DUMMY_SP }));
                return;
            }
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
                    if is_global_var_with_pure_property_access(&i.sym) {
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
                    op: op!("void") | op!(unary, "+") | op!(unary, "-") | op!("!") | op!("~"),
                    arg,
                    ..
                }) => {
                    self.ignore_return_value(
                        arg,
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
                        if tpl.exprs.len() == 1 {
                            *e = *tpl.exprs.remove(0);
                        } else {
                            *e = Expr::Seq(SeqExpr {
                                span: tpl.span,
                                exprs: tpl.exprs.take(),
                            });
                        }
                    }

                    return;
                }

                Expr::Member(MemberExpr {
                    obj,
                    prop: MemberProp::Ident(prop),
                    ..
                }) => {
                    if let Expr::Ident(Ident {
                        sym: js_word!("arguments"),
                        ..
                    }) = &**obj
                    {
                        if &*prop.sym == "callee" {
                            return;
                        }
                        e.take();
                        return;
                    }
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
                            if l.to_id() == r.to_id()
                                && l.span.ctxt != self.expr_ctx.unresolved_ctxt
                            {
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
                if (self.options.directives && !matches!(&*s.value, "use strict" | "use asm"))
                    || opts.drop_str_lit
                    || (s.value.starts_with("@swc/helpers")
                        || s.value.starts_with("@babel/helpers"))
                {
                    self.changed = true;
                    *e = Expr::Invalid(Invalid { span: DUMMY_SP });

                    return;
                }
            }

            Expr::Seq(seq) => {
                self.drop_useless_ident_ref_in_seq(seq);

                if let Some(last) = seq.exprs.last_mut() {
                    // Non-last elements are already processed.
                    self.ignore_return_value(last, opts);
                }

                let len = seq.exprs.len();
                seq.exprs.retain(|e| !e.is_invalid());
                if seq.exprs.len() != len {
                    self.changed = true;
                }

                if seq.exprs.len() == 1 {
                    *e = *seq.exprs.remove(0);
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

        if self.options.side_effects {
            if let Expr::Call(CallExpr {
                callee: Callee::Expr(callee),
                ..
            }) = e
            {
                match &mut **callee {
                    Expr::Fn(callee) => {
                        if let Some(body) = &mut callee.function.body {
                            if let Some(ident) = &callee.ident {
                                if IdentUsageFinder::find(&ident.to_id(), body) {
                                    return;
                                }
                            }

                            for stmt in &mut body.stmts {
                                self.ignore_return_value_of_return_stmt(stmt, opts);
                            }
                        }
                    }
                    Expr::Arrow(callee) => match &mut callee.body {
                        BlockStmtOrExpr::BlockStmt(body) => {
                            for stmt in &mut body.stmts {
                                self.ignore_return_value_of_return_stmt(stmt, opts);
                            }
                        }
                        BlockStmtOrExpr::Expr(body) => {
                            self.ignore_return_value(body, opts);

                            if body.is_invalid() {
                                *body = 0.into();
                                return;
                            }
                        }
                    },
                    _ => {}
                }
            }
        }

        if self.options.side_effects && self.options.pristine_globals {
            match e {
                Expr::New(NewExpr { callee, args, .. })
                    if callee.is_one_of_global_ref_to(
                        &self.expr_ctx,
                        &[
                            "Map", "Set", "Array", "Object", "Boolean", "Number", "String",
                        ],
                    ) =>
                {
                    report_change!("Dropping a pure new expression");

                    self.changed = true;
                    *e = self
                        .make_ignored_expr(args.iter_mut().flatten().map(|arg| arg.expr.take()))
                        .unwrap_or(Expr::Invalid(Invalid { span: DUMMY_SP }));
                    return;
                }

                Expr::Call(CallExpr {
                    callee: Callee::Expr(callee),
                    args,
                    ..
                }) if callee.is_one_of_global_ref_to(
                    &self.expr_ctx,
                    &["Array", "Object", "Boolean", "Number"],
                ) =>
                {
                    report_change!("Dropping a pure call expression");

                    self.changed = true;
                    *e = self
                        .make_ignored_expr(args.iter_mut().map(|arg| arg.expr.take()))
                        .unwrap_or(Expr::Invalid(Invalid { span: DUMMY_SP }));
                    return;
                }

                Expr::Object(obj) => {
                    if obj.props.iter().all(|p| match p {
                        PropOrSpread::Spread(_) => false,
                        PropOrSpread::Prop(p) => matches!(
                            &**p,
                            Prop::Shorthand(_) | Prop::KeyValue(_) | Prop::Method(..)
                        ),
                    }) {
                        let mut exprs = vec![];

                        for prop in obj.props.take() {
                            if let PropOrSpread::Prop(p) = prop {
                                match *p {
                                    Prop::Shorthand(p) => {
                                        exprs.push(Box::new(Expr::Ident(p)));
                                    }
                                    Prop::KeyValue(p) => {
                                        if let PropName::Computed(e) = p.key {
                                            exprs.push(e.expr);
                                        }

                                        exprs.push(p.value);
                                    }
                                    Prop::Method(p) => {
                                        if let PropName::Computed(e) = p.key {
                                            exprs.push(e.expr);
                                        }
                                    }

                                    _ => unreachable!(),
                                }
                            }
                        }

                        *e = self
                            .make_ignored_expr(exprs.into_iter())
                            .unwrap_or(Expr::Invalid(Invalid { span: DUMMY_SP }));
                        report_change!("Ignored an object literal");
                        self.changed = true;
                        return;
                    }
                }

                Expr::Array(arr) => {
                    if arr.elems.iter().any(|e| match e {
                        Some(ExprOrSpread {
                            spread: Some(..), ..
                        }) => true,
                        _ => false,
                    }) {
                        *e = Expr::Array(ArrayLit {
                            elems: arr
                                .elems
                                .take()
                                .into_iter()
                                .flatten()
                                .filter_map(|mut e| {
                                    if e.spread.is_some() {
                                        return Some(e);
                                    }

                                    self.ignore_return_value(
                                        &mut e.expr,
                                        DropOpts {
                                            drop_global_refs_if_unused: true,
                                            drop_zero: true,
                                            drop_str_lit: true,
                                            ..opts
                                        },
                                    );
                                    if e.expr.is_invalid() {
                                        return None;
                                    }

                                    Some(ExprOrSpread {
                                        spread: None,
                                        expr: e.expr,
                                    })
                                })
                                .map(Some)
                                .collect(),
                            ..*arr
                        });
                        return;
                    }

                    let mut exprs = vec![];

                    //

                    for ExprOrSpread { mut expr, .. } in arr.elems.take().into_iter().flatten() {
                        self.ignore_return_value(
                            &mut expr,
                            DropOpts {
                                drop_str_lit: true,
                                drop_zero: true,
                                drop_global_refs_if_unused: true,
                                ..opts
                            },
                        );
                        if !expr.is_invalid() {
                            exprs.push(expr);
                        }
                    }

                    *e = self
                        .make_ignored_expr(exprs.into_iter())
                        .unwrap_or(Expr::Invalid(Invalid { span: DUMMY_SP }));
                    report_change!("Ignored an array literal");
                    self.changed = true;
                    return;
                }

                // terser compiles
                //
                //  [1,foo(),...bar()][{foo}]
                //
                // as
                //
                //  foo(),basr(),foo;
                Expr::Member(MemberExpr {
                    obj,
                    prop: MemberProp::Computed(prop),
                    ..
                }) => match &**obj {
                    Expr::Object(..) | Expr::Array(..) => {
                        self.ignore_return_value(obj, opts);

                        match &**obj {
                            Expr::Object(..) => {}
                            _ => {
                                *e = self
                                    .make_ignored_expr(
                                        vec![obj.take(), prop.expr.take()].into_iter(),
                                    )
                                    .unwrap_or(Expr::Invalid(Invalid { span: DUMMY_SP }));
                                return;
                            }
                        };
                    }
                    _ => {}
                },
                _ => {}
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

    ///
    /// - `!(x == y)` => `x != y`
    /// - `!(x === y)` => `x !== y`
    pub(super) fn compress_negated_bin_eq(&self, e: &mut Expr) {
        let unary = match e {
            Expr::Unary(e @ UnaryExpr { op: op!("!"), .. }) => e,
            _ => return,
        };

        match &mut *unary.arg {
            Expr::Bin(BinExpr {
                op: op @ op!("=="),
                left,
                right,
                ..
            })
            | Expr::Bin(BinExpr {
                op: op @ op!("==="),
                left,
                right,
                ..
            }) => {
                *e = Expr::Bin(BinExpr {
                    span: unary.span,
                    op: if *op == op!("==") {
                        op!("!=")
                    } else {
                        op!("!==")
                    },
                    left: left.take(),
                    right: right.take(),
                })
            }
            _ => {}
        }
    }

    pub(super) fn optimize_nullish_coalescing(&mut self, e: &mut Expr) {
        let (l, r) = match e {
            Expr::Bin(BinExpr {
                op: op!("??"),
                left,
                right,
                ..
            }) => (&mut **left, &mut **right),
            _ => return,
        };

        match l {
            Expr::Lit(Lit::Null(..)) => {
                report_change!("Removing null from lhs of ??");
                self.changed = true;
                *e = r.take();
            }
            Expr::Lit(Lit::Num(..))
            | Expr::Lit(Lit::Str(..))
            | Expr::Lit(Lit::BigInt(..))
            | Expr::Lit(Lit::Bool(..))
            | Expr::Lit(Lit::Regex(..)) => {
                report_change!("Removing rhs of ?? as lhs cannot be null nor undefined");
                self.changed = true;
                *e = l.take();
            }
            _ => {}
        }
    }

    ///
    /// - `a ? true : false` => `!!a`
    pub(super) fn compress_useless_cond_expr(&mut self, expr: &mut Expr) {
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

        let lb = cond.cons.as_pure_bool(&self.expr_ctx);
        let rb = cond.alt.as_pure_bool(&self.expr_ctx);

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
            self.negate(&mut cond.test, false, false);
            self.negate(&mut cond.test, false, false);
            *expr = *cond.test.take();
            return;
        }

        // `cond ? false : true` => !cond
        if !lb && rb {
            self.negate(&mut cond.test, false, false);
            *expr = *cond.test.take();
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
