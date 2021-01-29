use crate::option::CompressOptions;
use crate::util::contains_leaping_yield;
use crate::util::usage::ScopeData;
use crate::util::usage::UsageAnalyzer;
use fxhash::FxHashMap;
use retain_mut::RetainMut;
use std::fmt::Write;
use std::mem::take;
use swc_atoms::js_word;
use swc_atoms::JsWord;
use swc_common::iter::IdentifyLast;
use swc_common::pass::Repeated;
use swc_common::Mark;
use swc_common::Spanned;
use swc_common::SyntaxContext;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_utils::undefined;
use swc_ecma_utils::ExprExt;
use swc_ecma_utils::ExprFactory;
use swc_ecma_utils::Id;
use swc_ecma_utils::StmtLike;
use swc_ecma_utils::Type;
use swc_ecma_utils::Value;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;
use swc_ecma_visit::VisitWith;
use Value::Known;

mod bools;
mod conditionals;
mod if_return;
mod iife;
mod join_vars;
mod ops;
mod sequences;
mod switches;
mod unused;
mod util;

/// This pass is simillar to `node.optimize` of terser.
pub(super) fn optimizer(options: CompressOptions) -> impl VisitMut + Repeated {
    let done = Mark::fresh(Mark::root());
    let done_ctxt = SyntaxContext::empty().apply_mark(done);
    Optimizer {
        changed: false,
        options,
        lits: Default::default(),
        vars: Default::default(),
        simple_props: Default::default(),
        simple_array_values: Default::default(),
        typeofs: Default::default(),
        data: Default::default(),
        ctx: Default::default(),
        done,
        done_ctxt,
    }
}

#[derive(Debug, Default, Clone, Copy)]
struct Ctx {
    inline_prevented: bool,
    in_strict: bool,
    in_try_block: bool,
    /// `true` while handling `expr` of `!expr`
    in_bang_arg: bool,
    in_var_decl_of_for_in_or_of_loop: bool,
    /// `true` while handling inner statements of a labelled statement.
    stmt_lablled: bool,
}

#[derive(Debug)]
struct Optimizer {
    changed: bool,
    options: CompressOptions,
    /// Cheap to clone.
    lits: FxHashMap<Id, Box<Expr>>,
    vars: FxHashMap<Id, Box<Expr>>,
    simple_props: FxHashMap<(Id, JsWord), Box<Expr>>,
    simple_array_values: FxHashMap<(Id, usize), Box<Expr>>,
    typeofs: FxHashMap<Id, JsWord>,
    data: Option<ScopeData>,
    ctx: Ctx,
    done: Mark,
    done_ctxt: SyntaxContext,
}

impl Repeated for Optimizer {
    fn changed(&self) -> bool {
        self.changed
    }

    fn reset(&mut self) {
        self.changed = false;
    }
}

impl Optimizer {
    fn handle_stmt_likes<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike,
        Vec<T>: VisitMutWith<Self> + VisitWith<UsageAnalyzer>,
    {
        match self.data {
            Some(..) => {}
            None => {
                let mut analyzer = UsageAnalyzer::default();
                stmts.visit_with(&Invalid { span: DUMMY_SP }, &mut analyzer);
                self.data = Some(analyzer.data);
            }
        }

        stmts.visit_mut_children_with(self);
        self.merge_simillar_ifs(stmts);
        self.join_vars(stmts);

        stmts.retain(|stmt| match stmt.as_stmt() {
            Some(Stmt::Empty(..)) => false,
            _ => true,
        })
    }

    /// `a = a + 1` => `a += 1`.
    fn compress_bin_assignment_to_left(&mut self, e: &mut AssignExpr) {
        // TODO: Handle pure properties.
        let lhs = match &e.left {
            PatOrExpr::Expr(e) => match &**e {
                Expr::Ident(i) => i,
                _ => return,
            },
            PatOrExpr::Pat(p) => match &**p {
                Pat::Ident(i) => i,
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
        // Now we can compress it to an assigment
    }

    fn store_var_for_inining(&mut self, var: &mut VarDeclarator) {
        let init = match &mut var.init {
            Some(v) => v,
            None => return,
        };

        // TODO: Check for side effect between original decl position and inlined
        // position

        // We will inline if possible.
        match &var.name {
            Pat::Ident(i) => {
                // Store variables if it's used only once
                if let Some(data) = &mut self.data {
                    if let Some(usage) = data.vars.get(&i.to_id()) {
                        if self.options.reduce_vars && self.options.typeofs && !usage.reassigned {
                            match &**init {
                                Expr::Fn(..) | Expr::Arrow(..) => {
                                    self.typeofs.insert(i.to_id(), js_word!("function"));
                                }
                                Expr::Array(..) | Expr::Object(..) => {
                                    self.typeofs.insert(i.to_id(), js_word!("object"));
                                }
                                _ => {}
                            }
                        }
                        // No use => doppred
                        if usage.ref_count == 0 {
                            if init.may_have_side_effects() {
                                // TODO: Inline partially
                                return;
                            }

                            // TODO: Remove
                            return;
                        }

                        // Single use => inlined
                        if (self.options.reduce_vars
                            || self.options.collapse_vars
                            || self.options.inline
                            || self.options.defaults)
                            && usage.ref_count == 1
                        {
                            if init.may_have_side_effects() {
                                // TODO: Inline partially
                                return;
                            }

                            self.vars.insert(i.to_id(), init.take());
                            return;
                        }
                    }
                }
            }
            // TODO
            _ => {}
        }
    }

    fn compress_array_join(&mut self, n: &mut Expr) {
        let e = match n {
            Expr::Call(e) => e,
            _ => return,
        };

        let callee = match &mut e.callee {
            ExprOrSuper::Super(_) => return,
            ExprOrSuper::Expr(callee) => &mut **callee,
        };

        let separator = if e.args.is_empty() {
            ",".into()
        } else if e.args.len() == 1 {
            if e.args[0].spread.is_some() {
                return;
            }

            if is_pure_undefined(&e.args[0].expr) {
                ",".into()
            } else {
                match &*e.args[0].expr {
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
                    Expr::Array(arr) => {
                        if arr.elems.iter().filter_map(|v| v.as_ref()).any(|v| {
                            v.spread.is_some()
                                || match &*v.expr {
                                    e if is_pure_undefined(e) => false,
                                    Expr::Lit(lit) => match lit {
                                        Lit::Str(..) | Lit::Num(..) | Lit::Null(..) => false,
                                        _ => true,
                                    },
                                    _ => true,
                                }
                        }) {
                            return;
                        }

                        match &**prop {
                            Expr::Ident(i) if i.sym == *"join" => {}
                            _ => return,
                        }

                        arr
                    }
                    _ => return,
                },
            },
            _ => return,
        };

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

        log::trace!("Compressing array.join()");

        self.changed = true;
        *n = Expr::Lit(Lit::Str(Str {
            span: e.span,
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
                    log::trace!("Compressing boolean literal");
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

    fn ignore_return_value(&mut self, e: &mut Expr) -> Option<Expr> {
        match e {
            Expr::Ident(..) | Expr::This(_) | Expr::Invalid(_) | Expr::Lit(..) => {
                log::trace!("Dropping unused expr");
                self.changed = true;
                return None;
            }
            // Function expression cannot have a side effect.
            Expr::Fn(_) => {
                log::trace!("Dropping unused fn expr as it does not have any side effect");
                self.changed = true;
                return None;
            }

            Expr::Paren(e) => return self.ignore_return_value(&mut e.expr),

            Expr::Unary(UnaryExpr {
                op: op!("delete"), ..
            }) => return Some(e.take()),

            Expr::Unary(UnaryExpr {
                op: op!("void"), ..
            }) if !self.options.unused => return Some(e.take()),

            // We optimize binary expressions if operation is side-effect-free and lhs and rhs is
            // evaluated regardless of value of lhs.
            //
            // Div is exlcuded because of zero.
            // TOOD: Handle
            Expr::Bin(BinExpr { op, .. })
                if match op {
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
                    | BinaryOp::Mod
                    | BinaryOp::BitOr
                    | BinaryOp::BitXor
                    | BinaryOp::BitAnd
                    | BinaryOp::In
                    | BinaryOp::InstanceOf
                    | BinaryOp::Exp => false,
                    _ => true,
                } =>
            {
                return Some(e.take())
            }

            Expr::MetaProp(_)
            | Expr::Await(_)
            | Expr::Call(_)
            | Expr::New(..)
            | Expr::Yield(_)
            | Expr::Assign(_)
            | Expr::PrivateName(_)
            | Expr::Update(_) => return Some(e.take()),

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
            | Expr::TsTypeCast(_)
            | Expr::TsAs(_) => return Some(e.take()),

            Expr::Array(_arr) => {}
            Expr::Object(_) => {}

            // Preserves negated iife
            Expr::Unary(UnaryExpr {
                op: op!("!"), arg, ..
            }) if (self.options.negate_iife
                || self.options.reduce_vars
                || self.options.side_effects)
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
                log::trace!("ignore_return_value: Preserving negated iife");
                return Some(e.take());
            }

            // `delete` is handled above
            Expr::Unary(expr) => {
                self.changed = true;
                log::trace!("ignore_return_value: Reducing unary ({})", expr.op);
                return self.ignore_return_value(&mut expr.arg);
            }

            Expr::Bin(BinExpr {
                span, left, right, ..
            }) => {
                let left = self.ignore_return_value(&mut **left).map(Box::new);
                let right = self.ignore_return_value(&mut **right).map(Box::new);

                let mut seq = Expr::Seq(SeqExpr {
                    span: *span,
                    exprs: left.into_iter().chain(right).collect(),
                });
                return self.ignore_return_value(&mut seq);
            }

            Expr::Cond(cond) => {
                let cons_span = cond.cons.span();
                let alt_span = cond.alt.span();
                let cons = self.ignore_return_value(&mut cond.cons).map(Box::new);
                let alt = self.ignore_return_value(&mut cond.alt).map(Box::new);

                // TODO: Remove if test is side effect free.

                return Some(Expr::Cond(CondExpr {
                    span: cond.span,
                    test: cond.test.take(),
                    cons: cons.unwrap_or_else(|| {
                        self.changed = true;
                        undefined(cons_span)
                    }),
                    alt: alt.unwrap_or_else(|| {
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
                    .filter_map(|expr| self.ignore_return_value(&mut **expr))
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
                            *last = Box::new(Expr::Unary(UnaryExpr {
                                span: DUMMY_SP,
                                op: op!("void"),
                                arg: last.take(),
                            }));
                        }
                    }

                    return Some(Expr::Seq(SeqExpr {
                        span: seq.span,
                        exprs,
                    }));
                }
            }
            Expr::Tpl(_) => {}
            Expr::TaggedTpl(_) => {}
            Expr::Arrow(_) => {}
            Expr::OptChain(_) => {}

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
                        if s.value.contains(|c: char| !c.is_ascii()) {
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

        log::trace!("Converting call to RegExp into a regexp literal");
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
        // Merge var declarations fully, if possible.
        if stmts.windows(2).any(|stmts| match (&stmts[0], &stmts[1]) {
            (Stmt::Decl(Decl::Var(a)), Stmt::Decl(Decl::Var(b))) => {
                a.kind == b.kind && !contains_leaping_yield(a) && !contains_leaping_yield(b)
            }
            _ => false,
        }) {
            self.changed = true;
            log::trace!("Merging variable declarations");

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
                            _ => {
                                new.extend(var_decl.take().map(Decl::Var).map(Stmt::Decl));
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

            *stmts = new
        }
    }

    /// Optimize return value or argument of throw.
    ///
    /// This methods removes some useless assignments.
    ///
    /// # Example
    ///
    /// Note: `a` being declared in the function is important in the example
    /// below.
    ///
    /// ```ts
    /// function foo(){
    ///     var a;
    ///     throw a = x();
    /// }
    /// ```
    ///
    /// can be optimized as
    ///
    /// ```ts
    /// function foo(){
    ///     var a; // Will be dropped in next pass.
    ///     throw x();
    /// }
    /// ```
    fn optimize_in_fn_termiation(&mut self, e: &mut Expr) {
        if !self.options.dead_code {
            return;
        }

        match e {
            Expr::Assign(assign) => {
                self.optimize_in_fn_termiation(&mut assign.right);

                // We only handle identifiers on lhs for now.
                match &assign.left {
                    PatOrExpr::Pat(lhs) => match &**lhs {
                        Pat::Ident(lhs) => {
                            //
                            if self
                                .data
                                .as_ref()
                                .and_then(|data| data.vars.get(&lhs.to_id()))
                                .map(|var| var.declared_in_fn)
                                .unwrap_or(false)
                            {
                                log::trace!(
                                    "Dropping an assigment to a varaible declared in function \
                                     because function is being terminated"
                                );
                                self.changed = true;
                                *e = *assign.right.take();
                                return;
                            }
                        }
                        _ => {}
                    },
                    _ => {}
                }
            }
            _ => {}
        }
    }

    fn try_removing_block(&mut self, s: &mut Stmt) {
        if !self.options.conditionals
            && !self.options.sequences
            && !self.options.join_vars
            && !self.options.unused
        {
            return;
        }

        match s {
            Stmt::Block(block) if block.stmts.is_empty() => {
                *s = Stmt::Empty(EmptyStmt { span: block.span });
            }
            Stmt::Block(block) if block.stmts.len() == 1 => {
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
                    log::trace!("Converting if statement to a form `test && cons`");
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

    ///
    fn drop_unused_vars_without_init(&mut self, name: &mut Pat) {
        if !self.options.unused || self.ctx.in_var_decl_of_for_in_or_of_loop {
            return;
        }

        match name {
            Pat::Ident(i) => {
                if self
                    .data
                    .as_ref()
                    .and_then(|data| data.vars.get(&i.to_id()))
                    .map(|v| v.ref_count == 0)
                    .unwrap_or(false)
                {
                    log::trace!(
                        "Dropping a variable '{}{:?}' because it is never used",
                        i.sym,
                        i.span.ctxt
                    );
                    *name = Pat::Invalid(Invalid { span: DUMMY_SP });
                    return;
                }
            }
            _ => {}
        }
    }

    /// This compresses a template literal by inlining string literals in
    /// expresions into quasis.
    ///
    /// Note that this pass only cares about string literals and conversion to a
    /// string literal should be done before calling this pass.
    fn compress_tpl(&mut self, tpl: &mut Tpl) {
        debug_assert_eq!(tpl.exprs.len() + 1, tpl.quasis.len());
        let has_str_lit = tpl.exprs.iter().any(|expr| match &**expr {
            Expr::Lit(Lit::Str(..)) => true,
            _ => false,
        });
        if !has_str_lit {
            return;
        }
    }
}

impl VisitMut for Optimizer {
    noop_visit_mut_type!();

    fn visit_mut_tpl(&mut self, n: &mut Tpl) {
        debug_assert_eq!(n.exprs.len() + 1, n.quasis.len());

        n.visit_mut_children_with(self);

        n.exprs
            .iter_mut()
            .for_each(|expr| self.optimize_expr_in_str_ctx(&mut **expr));

        self.compress_tpl(n);

        debug_assert_eq!(
            n.exprs.len() + 1,
            n.quasis.len(),
            "tagged template literal compressor created an invalid template literal"
        );
    }

    fn visit_mut_return_stmt(&mut self, n: &mut ReturnStmt) {
        n.visit_mut_children_with(self);

        if let Some(arg) = &mut n.arg {
            self.optimize_in_fn_termiation(&mut **arg);
        }
    }

    fn visit_mut_throw_stmt(&mut self, n: &mut ThrowStmt) {
        n.visit_mut_children_with(self);

        if !self.ctx.in_try_block {
            self.optimize_in_fn_termiation(&mut n.arg);
        }
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

    fn visit_mut_assign_expr(&mut self, e: &mut AssignExpr) {
        e.visit_mut_children_with(self);

        self.compress_bin_assignment_to_left(e);
        self.compress_bin_assignment_to_right(e);
    }

    fn visit_mut_fn_expr(&mut self, e: &mut FnExpr) {
        if self.options.unused {
            if let Some(i) = &e.ident {
                if let Some(data) = &self.data {
                    let can_remove_ident = data
                        .vars
                        .get(&i.to_id())
                        .map(|v| v.ref_count == 0)
                        .unwrap_or(true);

                    if can_remove_ident {
                        self.changed = true;
                        log::trace!("Removing ident of a function expression");
                        e.ident = None;
                    }
                }
            }
        }

        e.visit_mut_children_with(self);
    }

    fn visit_mut_call_expr(&mut self, n: &mut CallExpr) {
        n.callee.visit_mut_with(self);

        // TODO: Prevent inline if callee is unknown.
        n.args.visit_mut_with(self);

        self.inline_args_of_iife(n);
    }

    fn visit_mut_switch_stmt(&mut self, n: &mut SwitchStmt) {
        let ctx = Ctx {
            inline_prevented: true,
            ..self.ctx
        };
        n.discriminant.visit_mut_with(&mut *self.with_ctx(ctx));

        n.cases.visit_mut_with(self);
    }

    fn visit_mut_if_stmt(&mut self, n: &mut IfStmt) {
        n.visit_mut_children_with(self);

        self.optimize_expr_in_bool_ctx(&mut n.test);
    }

    fn visit_mut_var_declarators(&mut self, vars: &mut Vec<VarDeclarator>) {
        vars.retain_mut(|var| {
            let had_init = var.init.is_some();

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
        })
    }

    fn visit_mut_var_declarator(&mut self, var: &mut VarDeclarator) {
        var.visit_mut_children_with(self);

        self.store_var_for_inining(var);
        match &var.init {
            Some(init) => match &**init {
                Expr::Invalid(..) => {
                    var.init = None;
                }
                _ => {}
            },
            None => {
                self.drop_unused_vars_without_init(&mut var.name);
            }
        }
    }

    fn visit_mut_seq_expr(&mut self, n: &mut SeqExpr) {
        n.visit_mut_children_with(self);

        {
            let exprs = n
                .exprs
                .iter_mut()
                .identify_last()
                .filter_map(|(last, expr)| {
                    if !last {
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

        self.lift_seqs_of_assign(n);
    }

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        n.visit_mut_children_with(self);

        self.swap_bin_operands(n);

        // Normalize
        match n {
            Expr::Paren(paren) => {
                self.changed = true;
                *n = *paren.expr.take();
            }
            _ => {}
        }

        self.compress_regexp(n);

        self.compress_lits(n);

        self.compress_typeofs(n);

        self.compress_useless_deletes(n);

        self.optimize_nullish_coalescing(n);

        self.compress_logical_exprs_as_bang_bang(n);

        self.compress_useless_cond_expr(n);

        self.compress_conds_as_logical(n);

        if !self.ctx.inline_prevented {
            match n {
                Expr::Ident(i) => {
                    //
                    if let Some(value) = self.lits.get(&i.to_id()).cloned() {
                        self.changed = true;

                        *n = *value;
                    } else if let Some(value) = self.vars.remove(&i.to_id()) {
                        self.changed = true;

                        *n = *value;
                    }
                }
                _ => {}
            }
        }

        match n {
            Expr::Bin(bin) => {
                let expr = self.optimize_lit_cmp(bin);
                if let Some(expr) = expr {
                    log::trace!("Optimizing: Literal comparison");
                    self.changed = true;
                    *n = expr;
                }
            }
            _ => {}
        }

        self.compress_cond_expr_if_simillar(n);
        self.compress_cond_with_logical_as_logical(n);

        self.compress_negated_bin_eq(n);
        self.handle_negated_seq(n);
        self.compress_array_join(n);

        self.compress_logical_exprs_with_negated_lhs(n);

        self.remove_useless_pipes(n);

        self.optimize_bools(n);

        self.lift_seqs_of_cond_assign(n);

        if self.options.negate_iife {
            self.negate_iife_in_cond(n);
        }

        self.invoke_iife(n);

        self.optimize_bangbang(n);
    }

    fn visit_mut_member_expr(&mut self, n: &mut MemberExpr) {
        n.obj.visit_mut_with(self);
        if n.computed {
            n.prop.visit_mut_with(self);
        }
    }

    fn visit_mut_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        self.handle_stmt_likes(stmts);

        self.make_sequences(stmts);
    }

    fn visit_mut_function(&mut self, n: &mut Function) {
        let ctx = Ctx {
            stmt_lablled: false,
            ..self.ctx
        };
        n.visit_mut_children_with(&mut *self.with_ctx(ctx));

        if let Some(body) = &mut n.body {
            self.merge_if_returns(&mut body.stmts);
        }
    }

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        self.handle_stmt_likes(stmts);

        self.make_sequences(stmts);

        self.merge_var_decls(stmts);
    }

    fn visit_mut_stmt(&mut self, n: &mut Stmt) {
        let ctx = Ctx {
            in_bang_arg: false,
            ..self.ctx
        };
        n.visit_mut_children_with(&mut *self.with_ctx(ctx));

        self.try_removing_block(n);

        self.compress_if_without_alt(n);

        self.compress_if_stmt_as_cond(n);

        self.optimize_const_switches(n);

        self.optimize_switches(n);

        match n {
            Stmt::Expr(ExprStmt { expr, .. }) => {
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
                        *n = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                        return;
                    }
                }

                if self.options.unused {
                    let can_be_removed = !is_directive && !expr.may_have_side_effects();

                    if can_be_removed {
                        self.changed = true;
                        log::trace!("Dropping an expression without side effect");
                        *n = Stmt::Empty(EmptyStmt { span: DUMMY_SP })
                    }
                }
            }
            _ => {}
        }
    }

    fn visit_mut_switch_cases(&mut self, n: &mut Vec<SwitchCase>) {
        n.visit_mut_children_with(self);

        self.optimize_switch_cases(n);
    }

    fn visit_mut_labeled_stmt(&mut self, n: &mut LabeledStmt) {
        let ctx = Ctx {
            stmt_lablled: true,
            ..self.ctx
        };
        n.visit_mut_children_with(&mut *self.with_ctx(ctx));
    }

    fn visit_mut_block_stmt(&mut self, n: &mut BlockStmt) {
        let ctx = Ctx {
            stmt_lablled: false,
            ..self.ctx
        };
        n.visit_mut_children_with(&mut *self.with_ctx(ctx));
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

    fn visit_mut_cond_expr(&mut self, n: &mut CondExpr) {
        n.visit_mut_children_with(self);

        self.optimize_expr_in_bool_ctx(&mut n.test);
    }

    fn visit_mut_unary_expr(&mut self, n: &mut UnaryExpr) {
        let ctx = Ctx {
            in_bang_arg: n.op == op!("!"),
            ..self.ctx
        };

        n.visit_mut_children_with(&mut *self.with_ctx(ctx));

        if n.op == op!("!") {
            self.with_ctx(ctx).optimize_expr_in_bool_ctx(&mut n.arg);
        }
    }

    fn visit_mut_expr_stmt(&mut self, n: &mut ExprStmt) {
        n.visit_mut_children_with(self);

        self.negate_iife_ignoring_ret(&mut n.expr);

        if self.options.unused
            || self.options.side_effects
            || (self.options.sequences && n.expr.is_seq())
        {
            let expr = self.ignore_return_value(&mut n.expr);
            n.expr = expr.map(Box::new).unwrap_or_else(|| undefined(DUMMY_SP));
        }
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

    fn visit_mut_class(&mut self, n: &mut Class) {
        let ctx = Ctx {
            in_strict: true,
            ..self.ctx
        };
        n.visit_mut_children_with(&mut *self.with_ctx(ctx));
    }
}

fn is_pure_undefined(e: &Expr) -> bool {
    match e {
        Expr::Ident(Ident {
            sym: js_word!("undefined"),
            ..
        }) => true,

        Expr::Unary(UnaryExpr {
            op: UnaryOp::Void,
            arg,
            ..
        }) if !arg.may_have_side_effects() => true,

        _ => false,
    }
}

fn is_clone_cheap(arg: &Expr) -> bool {
    match arg {
        Expr::Lit(..) => true,
        Expr::Unary(UnaryExpr {
            op: op!("!"), arg, ..
        }) => is_clone_cheap(&arg),
        _ => false,
    }
}
