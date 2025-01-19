use std::{borrow::Cow, iter::once, mem::take};

use swc_common::{
    pass::{CompilerPass, Repeated},
    util::{move_map::MoveMap, take::Take},
    Mark, Spanned, SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::{cpu_count, Parallel, ParallelExt};
use swc_ecma_utils::{
    extract_var_ids, is_literal, prepend_stmt, ExprCtx, ExprExt, ExprFactory, Hoister, IsEmpty,
    StmtExt, StmtLike, Value::Known,
};
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, visit_mut_pass, Visit, VisitMut, VisitMutWith, VisitWith,
};
use tracing::{debug, trace};

#[cfg(test)]
mod tests;

/// Not intended for general use. Use [simplifier] instead.
///
/// Ported from `PeepholeRemoveDeadCode` of google closure compiler.
pub fn dead_branch_remover(
    unresolved_mark: Mark,
) -> impl Repeated + Pass + CompilerPass + VisitMut + 'static {
    visit_mut_pass(Remover {
        changed: false,
        normal_block: Default::default(),
        expr_ctx: ExprCtx {
            unresolved_ctxt: SyntaxContext::empty().apply_mark(unresolved_mark),
            is_unresolved_ref_safe: false,
            in_strict: false,
        },
    })
}

impl CompilerPass for Remover {
    fn name(&self) -> Cow<'static, str> {
        Cow::Borrowed("dead_branch_remover")
    }
}

impl Repeated for Remover {
    fn changed(&self) -> bool {
        self.changed
    }

    fn reset(&mut self) {
        self.changed = false;
    }
}

#[derive(Debug)]
struct Remover {
    changed: bool,
    normal_block: bool,

    expr_ctx: ExprCtx,
}

impl Parallel for Remover {
    fn create(&self) -> Self {
        Self {
            expr_ctx: self.expr_ctx.clone(),
            ..*self
        }
    }

    fn merge(&mut self, _: Self) {}
}

impl VisitMut for Remover {
    noop_visit_mut_type!();

    fn visit_mut_class_members(&mut self, members: &mut Vec<ClassMember>) {
        self.maybe_par(cpu_count(), members, |v, member| {
            member.visit_mut_with(v);
        });
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        match e {
            Expr::Seq(s) => {
                if s.exprs.is_empty() {
                    *e = Expr::dummy();
                } else if s.exprs.len() == 1 {
                    *e = *s.exprs.pop().unwrap();
                }
            }

            Expr::Assign(AssignExpr {
                op: op!("="),
                left: AssignTarget::Simple(l),
                right: r,
                ..
            }) if match &*l {
                SimpleAssignTarget::Ident(l) => match &**r {
                    Expr::Ident(r) => l.sym == r.sym && l.ctxt == r.ctxt,
                    _ => false,
                },
                _ => false,
            } =>
            {
                if cfg!(feature = "debug") {
                    debug!("Dropping assignment to the same variable");
                }
                *e = r.take().ident().unwrap().into();
            }

            Expr::Assign(AssignExpr {
                op: op!("="),
                left: AssignTarget::Pat(left),
                right,
                ..
            }) if match &*left {
                AssignTargetPat::Array(arr) => {
                    arr.elems.is_empty() || arr.elems.iter().all(|v| v.is_none())
                }
                _ => false,
            } =>
            {
                if cfg!(feature = "debug") {
                    debug!("Dropping assignment to an empty array pattern");
                }
                *e = *right.take();
            }

            Expr::Assign(AssignExpr {
                op: op!("="),
                left: AssignTarget::Pat(left),
                right,
                ..
            }) if match &*left {
                AssignTargetPat::Object(obj) => obj.props.is_empty(),
                _ => false,
            } =>
            {
                if cfg!(feature = "debug") {
                    debug!("Dropping assignment to an empty object pattern");
                }
                *e = *right.take();
            }

            Expr::Cond(cond)
                if !cond.test.may_have_side_effects(&self.expr_ctx)
                    && (cond.cons.is_undefined(&self.expr_ctx)
                        || matches!(*cond.cons, Expr::Unary(UnaryExpr {
                                op: op!("void"),
                                ref arg,
                                ..
                            }) if !arg.may_have_side_effects(&self.expr_ctx)))
                    && (cond.alt.is_undefined(&self.expr_ctx)
                        || matches!(*cond.alt, Expr::Unary(UnaryExpr {
                                op: op!("void"),
                                ref arg,
                                ..
                            }) if !arg.may_have_side_effects(&self.expr_ctx))) =>
            {
                if cfg!(feature = "debug") {
                    debug!("Dropping side-effect-free expressions");
                }
                *e = *cond.cons.take();
            }

            Expr::Bin(be) => match (be.left.is_invalid(), be.right.is_invalid()) {
                (true, true) => {
                    *e = Expr::dummy();
                }
                (true, false) => {
                    *e = *be.right.take();
                }
                (false, true) => {
                    *e = *be.left.take();
                }
                _ => {}
            },

            _ => {}
        }
    }

    fn visit_mut_expr_or_spreads(&mut self, n: &mut Vec<ExprOrSpread>) {
        self.maybe_par(cpu_count() * 8, n, |v, n| {
            n.visit_mut_with(v);
        })
    }

    fn visit_mut_exprs(&mut self, n: &mut Vec<Box<Expr>>) {
        self.maybe_par(cpu_count() * 8, n, |v, n| {
            n.visit_mut_with(v);
        })
    }

    fn visit_mut_for_stmt(&mut self, s: &mut ForStmt) {
        s.visit_mut_children_with(self);

        s.init = s.init.take().and_then(|e| match e {
            VarDeclOrExpr::Expr(e) => {
                ignore_result(e, true, &self.expr_ctx).map(VarDeclOrExpr::from)
            }
            _ => Some(e),
        });

        s.update = s
            .update
            .take()
            .and_then(|e| ignore_result(e, true, &self.expr_ctx));

        s.test = s.test.take().and_then(|e| {
            let span = e.span();
            if let Known(value) = e.as_pure_bool(&self.expr_ctx) {
                return if value {
                    None
                } else {
                    Some(Lit::Bool(Bool { span, value: false }).into())
                };
            }

            Some(e)
        });
    }

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        if cfg!(feature = "debug") {
            debug!("Removing dead branches");
        }
        self.fold_stmt_like(n);
    }

    fn visit_mut_object_pat(&mut self, p: &mut ObjectPat) {
        p.visit_mut_children_with(self);

        // Don't remove if there exists a rest pattern
        if p.props.iter().any(|p| matches!(p, ObjectPatProp::Rest(..))) {
            return;
        }

        fn is_computed(k: &PropName) -> bool {
            matches!(k, PropName::Computed(..))
        }

        p.props.retain(|p| match p {
            ObjectPatProp::KeyValue(KeyValuePatProp { key, value, .. })
                if match &**value {
                    Pat::Object(p) => !is_computed(key) && p.props.is_empty(),
                    _ => false,
                } =>
            {
                if cfg!(feature = "debug") {
                    debug!(
                        "Dropping key-value pattern property because it's an empty object pattern"
                    );
                }
                false
            }

            ObjectPatProp::KeyValue(KeyValuePatProp { key, value, .. })
                if match &**value {
                    Pat::Array(p) => !is_computed(key) && p.elems.is_empty(),
                    _ => false,
                } =>
            {
                if cfg!(feature = "debug") {
                    debug!(
                        "Dropping key-value pattern property because it's an empty array pattern"
                    );
                }
                false
            }
            _ => true,
        });
    }

    fn visit_mut_object_pat_prop(&mut self, p: &mut ObjectPatProp) {
        p.visit_mut_children_with(self);

        match p {
            ObjectPatProp::Assign(AssignPatProp {
                span,
                key,
                value: Some(expr),
            }) if expr.is_undefined(&self.expr_ctx)
                || match **expr {
                    Expr::Unary(UnaryExpr {
                        op: op!("void"),
                        ref arg,
                        ..
                    }) => is_literal(&**arg),
                    _ => false,
                } =>
            {
                *p = ObjectPatProp::Assign(AssignPatProp {
                    span: *span,
                    key: key.take(),
                    value: None,
                });
            }

            _ => {}
        }
    }

    fn visit_mut_opt_var_decl_or_expr(&mut self, n: &mut Option<VarDeclOrExpr>) {
        n.visit_mut_children_with(self);

        if let Some(VarDeclOrExpr::Expr(e)) = n {
            if e.is_invalid() {
                *n = None;
            }
        }
    }

    fn visit_mut_opt_vec_expr_or_spreads(&mut self, n: &mut Vec<Option<ExprOrSpread>>) {
        self.maybe_par(cpu_count() * 8, n, |v, n| {
            n.visit_mut_with(v);
        })
    }

    fn visit_mut_pat(&mut self, p: &mut Pat) {
        p.visit_mut_children_with(self);

        match p {
            Pat::Assign(assign)
                if assign.right.is_undefined(&self.expr_ctx)
                    || match *assign.right {
                        Expr::Unary(UnaryExpr {
                            op: op!("void"),
                            ref arg,
                            ..
                        }) => is_literal(&**arg),
                        _ => false,
                    } =>
            {
                *p = *assign.left.take();
            }

            _ => {}
        }
    }

    fn visit_mut_prop_or_spreads(&mut self, n: &mut Vec<PropOrSpread>) {
        self.maybe_par(cpu_count() * 8, n, |v, n| {
            n.visit_mut_with(v);
        })
    }

    fn visit_mut_seq_expr(&mut self, e: &mut SeqExpr) {
        e.visit_mut_children_with(self);
        if e.exprs.is_empty() {
            return;
        }

        let last = e.exprs.pop().unwrap();

        let should_preserved_this = last.directness_maters();

        let mut exprs = if should_preserved_this {
            e.exprs
                .take()
                .into_iter()
                .enumerate()
                .filter_map(|(idx, e)| {
                    if idx == 0 {
                        return Some(e);
                    }

                    ignore_result(e, true, &self.expr_ctx)
                })
                .collect()
        } else {
            e.exprs
                .take()
                .move_flat_map(|e| ignore_result(e, false, &self.expr_ctx))
        };

        exprs.push(last);

        e.exprs = exprs;
    }

    fn visit_mut_stmt(&mut self, stmt: &mut Stmt) {
        stmt.visit_mut_children_with(self);

        stmt.map_with_mut(|stmt| {
            match stmt {
                Stmt::If(IfStmt {
                    span,
                    test,
                    cons,
                    alt,
                }) => {
                    if let Stmt::If(IfStmt { alt: Some(..), .. }) = *cons {
                        return IfStmt {
                            test,
                            cons: Box::new(
                                BlockStmt {
                                    stmts: vec![*cons],
                                    ..Default::default()
                                }
                                .into(),
                            ),
                            alt,
                            span,
                        }
                        .into();
                    }

                    let mut stmts = Vec::new();
                    if let (p, Known(v)) = test.cast_to_bool(&self.expr_ctx) {
                        if cfg!(feature = "debug") {
                            trace!("The condition for if statement is always {}", v);
                        }

                        // Preserve effect of the test
                        if !p.is_pure() {
                            if let Some(expr) = ignore_result(test, true, &self.expr_ctx) {
                                stmts.push(ExprStmt { span, expr }.into())
                            }
                        }

                        if v {
                            // Preserve variables
                            if let Some(var) = alt.and_then(|alt| alt.extract_var_ids_as_var()) {
                                stmts.push(var.into())
                            }
                            stmts.push(*cons);
                        } else {
                            if let Some(var) = cons.extract_var_ids_as_var() {
                                stmts.push(var.into())
                            }

                            if let Some(alt) = alt {
                                stmts.push(*alt)
                            }
                        }

                        if stmts.is_empty() {
                            return EmptyStmt { span }.into();
                        }

                        if cfg!(feature = "debug") {
                            debug!("Optimized an if statement with known condition");
                        }

                        self.changed = true;

                        let mut block: Stmt = BlockStmt {
                            span,
                            stmts,
                            ..Default::default()
                        }
                        .into();
                        block.visit_mut_with(self);
                        return block;
                    }

                    let alt = match &alt {
                        Some(stmt) if stmt.is_empty() => None,
                        _ => alt,
                    };
                    if alt.is_none() {
                        if let Stmt::Empty(..) = *cons {
                            self.changed = true;

                            return if let Some(expr) = ignore_result(test, true, &self.expr_ctx) {
                                ExprStmt { span, expr }.into()
                            } else {
                                EmptyStmt { span }.into()
                            };
                        }
                    }

                    IfStmt {
                        span,
                        test,
                        cons,
                        alt,
                    }
                    .into()
                }

                Stmt::Decl(Decl::Var(v)) if v.decls.is_empty() => {
                    if cfg!(feature = "debug") {
                        debug!("Dropping an empty var declaration");
                    }
                    EmptyStmt { span: v.span }.into()
                }

                Stmt::Labeled(LabeledStmt {
                    label, span, body, ..
                }) if body.is_empty() => {
                    debug!("Dropping an empty label statement: `{}`", label);
                    EmptyStmt { span }.into()
                }

                Stmt::Labeled(LabeledStmt {
                    span,
                    body,
                    ref label,
                    ..
                }) if match &*body {
                    Stmt::Break(BreakStmt { label: Some(b), .. }) => label.sym == b.sym,
                    _ => false,
                } =>
                {
                    debug!("Dropping a label statement with instant break: `{}`", label);
                    EmptyStmt { span }.into()
                }

                // `1;` -> `;`
                Stmt::Expr(ExprStmt { span, expr, .. }) => {
                    // Directives
                    if let Expr::Lit(Lit::Str(..)) = &*expr {
                        return ExprStmt { span, expr }.into();
                    }

                    match ignore_result(expr, false, &self.expr_ctx) {
                        Some(e) => ExprStmt { span, expr: e }.into(),
                        None => EmptyStmt { span: DUMMY_SP }.into(),
                    }
                }

                Stmt::Block(BlockStmt { span, stmts, ctxt }) => {
                    if stmts.is_empty() {
                        if cfg!(feature = "debug") {
                            debug!("Drooping an empty block statement");
                        }

                        EmptyStmt { span }.into()
                    } else if stmts.len() == 1
                        && !is_block_scoped_stuff(&stmts[0])
                        && stmt_depth(&stmts[0]) <= 1
                    {
                        if cfg!(feature = "debug") {
                            debug!("Optimizing a block statement with a single statement");
                        }

                        let mut v = stmts.into_iter().next().unwrap();
                        v.visit_mut_with(self);
                        v
                    } else {
                        BlockStmt { span, stmts, ctxt }.into()
                    }
                }
                Stmt::Try(s) => {
                    let TryStmt {
                        span,
                        block,
                        handler,
                        finalizer,
                    } = *s;

                    // Only leave the finally block if try block is empty
                    if block.is_empty() {
                        let var = handler.and_then(|h| Stmt::from(h.body).extract_var_ids_as_var());

                        return if let Some(mut finalizer) = finalizer {
                            if let Some(var) = var.map(Box::new).map(Decl::from).map(Stmt::from) {
                                prepend_stmt(&mut finalizer.stmts, var);
                            }
                            finalizer.into()
                        } else {
                            var.map(Box::new)
                                .map(Decl::from)
                                .map(Stmt::from)
                                .unwrap_or_else(|| EmptyStmt { span }.into())
                        };
                    }

                    // If catch block is not specified and finally block is empty, fold it to simple
                    // block.
                    if handler.is_none() && finalizer.is_empty() {
                        if cfg!(feature = "debug") {
                            debug!("Converting a try statement to a block statement");
                        }

                        return block.into();
                    }

                    TryStmt {
                        span,
                        block,
                        handler,
                        finalizer,
                    }
                    .into()
                }

                Stmt::Switch(mut s) => {
                    if s.cases
                        .iter()
                        .any(|case| matches!(case.test.as_deref(), Some(Expr::Update(..))))
                    {
                        return s.into();
                    }
                    if let Expr::Update(..) = &*s.discriminant {
                        if s.cases.len() != 1 {
                            return s.into();
                        }
                    }

                    let remove_break = |stmts: Vec<Stmt>| {
                        debug_assert!(
                            !has_conditional_stopper(&stmts) || has_unconditional_stopper(&stmts)
                        );

                        let mut done = false;
                        stmts.move_flat_map(|s| {
                            if done {
                                match s {
                                    Stmt::Decl(Decl::Var(var))
                                        if matches!(
                                            &*var,
                                            VarDecl {
                                                kind: VarDeclKind::Var,
                                                ..
                                            }
                                        ) =>
                                    {
                                        return Some(
                                            VarDecl {
                                                span: DUMMY_SP,
                                                kind: VarDeclKind::Var,
                                                decls: var.decls.move_map(|decl| VarDeclarator {
                                                    init: None,
                                                    ..decl
                                                }),
                                                ..Default::default()
                                            }
                                            .into(),
                                        );
                                    }
                                    _ => (),
                                }

                                return None;
                            }
                            match s {
                                Stmt::Break(BreakStmt { label: None, .. }) => {
                                    done = true;
                                    None
                                }
                                Stmt::Return(..) | Stmt::Throw(..) => {
                                    done = true;
                                    Some(s)
                                }
                                _ => Some(s),
                            }
                        })
                    };

                    let is_matching_literal = match *s.discriminant {
                        Expr::Lit(Lit::Str(..))
                        | Expr::Lit(Lit::Null(..))
                        | Expr::Lit(Lit::Num(..)) => true,
                        ref e if e.is_nan() || e.is_global_ref_to(&self.expr_ctx, "undefined") => {
                            true
                        }
                        _ => false,
                    };

                    // Remove empty switch
                    if s.cases.is_empty() {
                        if cfg!(feature = "debug") {
                            debug!("Removing an empty switch statement");
                        }
                        return match ignore_result(s.discriminant, true, &self.expr_ctx) {
                            Some(expr) => ExprStmt { span: s.span, expr }.into(),
                            None => EmptyStmt { span: s.span }.into(),
                        };
                    }

                    // Handle a switch statement with only default.
                    if s.cases.len() == 1
                        && s.cases[0].test.is_none()
                        && !has_conditional_stopper(&s.cases[0].cons)
                    {
                        if cfg!(feature = "debug") {
                            debug!("Switch -> Block as default is the only case");
                        }

                        let mut stmts = remove_break(s.cases.remove(0).cons);
                        if let Some(expr) = ignore_result(s.discriminant, true, &self.expr_ctx) {
                            prepend_stmt(&mut stmts, expr.into_stmt());
                        }

                        let mut block: Stmt = BlockStmt {
                            span: s.span,
                            stmts,
                            ..Default::default()
                        }
                        .into();
                        block.visit_mut_with(self);
                        return block;
                    }

                    let mut non_constant_case_idx = None;
                    let selected = {
                        let mut i = 0;
                        s.cases.iter().position(|case| {
                            if non_constant_case_idx.is_some() {
                                i += 1;
                                return false;
                            }

                            if let Some(ref test) = case.test {
                                let v = match (&**test, &*s.discriminant) {
                                    (
                                        &Expr::Lit(Lit::Str(Str {
                                            value: ref test, ..
                                        })),
                                        &Expr::Lit(Lit::Str(Str { value: ref d, .. })),
                                    ) => *test == *d,
                                    (
                                        &Expr::Lit(Lit::Num(Number { value: test, .. })),
                                        &Expr::Lit(Lit::Num(Number { value: d, .. })),
                                    ) => (test - d).abs() < 1e-10,
                                    (
                                        &Expr::Lit(Lit::Bool(Bool { value: test, .. })),
                                        &Expr::Lit(Lit::Bool(Bool { value: d, .. })),
                                    ) => test == d,
                                    (&Expr::Lit(Lit::Null(..)), &Expr::Lit(Lit::Null(..))) => true,

                                    _ => {
                                        if !test.is_nan()
                                            && !test.is_global_ref_to(&self.expr_ctx, "undefined")
                                        {
                                            non_constant_case_idx = Some(i);
                                        }

                                        false
                                    }
                                };

                                i += 1;
                                return v;
                            }

                            i += 1;
                            false
                        })
                    };

                    let are_all_tests_known = s
                        .cases
                        .iter()
                        .map(|case| case.test.as_deref())
                        .all(|s| matches!(s, Some(Expr::Lit(..)) | None));

                    let mut var_ids = Vec::new();
                    if let Some(i) = selected {
                        if !has_conditional_stopper(&s.cases[i].cons) {
                            let mut exprs = Vec::new();
                            exprs.extend(ignore_result(s.discriminant, true, &self.expr_ctx));

                            let mut stmts = s.cases[i].cons.take();
                            let mut cases = s.cases.drain((i + 1)..);

                            for case in cases.by_ref() {
                                let should_stop = has_unconditional_stopper(&case.cons);
                                stmts.extend(case.cons);
                                //
                                if should_stop {
                                    break;
                                }
                            }

                            let mut stmts = remove_break(stmts);

                            let decls = cases
                                .flat_map(|case| {
                                    exprs.extend(
                                        case.test
                                            .and_then(|e| ignore_result(e, true, &self.expr_ctx)),
                                    );
                                    case.cons
                                })
                                .flat_map(|stmt| stmt.extract_var_ids())
                                .map(|i| VarDeclarator {
                                    span: DUMMY_SP,
                                    name: i.into(),
                                    init: None,
                                    definite: false,
                                })
                                .collect::<Vec<_>>();

                            if !decls.is_empty() {
                                prepend_stmt(
                                    &mut stmts,
                                    VarDecl {
                                        span: DUMMY_SP,
                                        kind: VarDeclKind::Var,
                                        decls,
                                        declare: false,
                                        ..Default::default()
                                    }
                                    .into(),
                                );
                            }

                            if !exprs.is_empty() {
                                prepend_stmt(
                                    &mut stmts,
                                    ExprStmt {
                                        span: DUMMY_SP,
                                        expr: if exprs.len() == 1 {
                                            exprs.remove(0)
                                        } else {
                                            SeqExpr {
                                                span: DUMMY_SP,
                                                exprs,
                                            }
                                            .into()
                                        },
                                    }
                                    .into(),
                                );
                            }

                            if cfg!(feature = "debug") {
                                debug!("Switch -> Block as we know discriminant");
                            }
                            let mut block: Stmt = BlockStmt {
                                span: s.span,
                                stmts,
                                ..Default::default()
                            }
                            .into();
                            block.visit_mut_with(self);
                            return block;
                        }
                    } else if are_all_tests_known {
                        let mut vars = Vec::new();

                        if let Expr::Lit(..) = *s.discriminant {
                            let idx = s.cases.iter().position(|v| v.test.is_none());

                            if let Some(i) = idx {
                                for case in &s.cases[..i] {
                                    for cons in &case.cons {
                                        vars.extend(cons.extract_var_ids().into_iter().map(
                                            |name| VarDeclarator {
                                                span: DUMMY_SP,
                                                name: name.into(),
                                                init: None,
                                                definite: Default::default(),
                                            },
                                        ));
                                    }
                                }

                                if !has_conditional_stopper(&s.cases[i].cons) {
                                    let stmts = s.cases.remove(i).cons;
                                    let mut stmts = remove_break(stmts);

                                    if !vars.is_empty() {
                                        prepend_stmt(
                                            &mut stmts,
                                            VarDecl {
                                                span: DUMMY_SP,
                                                kind: VarDeclKind::Var,
                                                declare: Default::default(),
                                                decls: take(&mut vars),
                                                ..Default::default()
                                            }
                                            .into(),
                                        )
                                    }

                                    let mut block: Stmt = BlockStmt {
                                        span: s.span,
                                        stmts,
                                        ..Default::default()
                                    }
                                    .into();

                                    block.visit_mut_with(self);

                                    if cfg!(feature = "debug") {
                                        debug!("Switch -> Block as the discriminant is a literal");
                                    }
                                    return block;
                                }
                            }
                        }
                    }

                    if is_matching_literal {
                        let mut idx = 0usize;
                        let mut breaked = false;
                        // Remove unmatchable cases.
                        s.cases = s.cases.move_flat_map(|case| {
                            if non_constant_case_idx.is_some()
                                && idx >= non_constant_case_idx.unwrap()
                            {
                                idx += 1;
                                return Some(case);
                            }

                            // Detect unconditional break;
                            if selected.is_some() && selected <= Some(idx) {
                                // Done.
                                if breaked {
                                    idx += 1;
                                    if cfg!(feature = "debug") {
                                        debug!("Dropping case because it is unreachable");
                                    }
                                    return None;
                                }

                                if !breaked {
                                    // has unconditional break
                                    breaked |= has_unconditional_stopper(&case.cons);
                                }

                                idx += 1;
                                return Some(case);
                            }

                            let res = match case.test {
                                Some(e)
                                    if matches!(
                                        &*e,
                                        Expr::Lit(Lit::Num(..))
                                            | Expr::Lit(Lit::Str(..))
                                            | Expr::Lit(Lit::Null(..))
                                    ) =>
                                {
                                    case.cons
                                        .into_iter()
                                        .for_each(|stmt| var_ids.extend(stmt.extract_var_ids()));

                                    if cfg!(feature = "debug") {
                                        debug!(
                                            "Dropping case because it is unreachable (literal \
                                             test)"
                                        );
                                    }
                                    None
                                }
                                _ => Some(case),
                            };
                            idx += 1;
                            res
                        });
                    }

                    let is_default_last =
                        matches!(s.cases.last(), Some(SwitchCase { test: None, .. }));

                    {
                        // True if all cases except default is empty.
                        let is_all_case_empty = s
                            .cases
                            .iter()
                            .all(|case| case.test.is_none() || case.cons.is_empty());

                        let is_all_case_side_effect_free = s.cases.iter().all(|case| {
                            case.test
                                .as_ref()
                                .map(|e| e.is_ident() || !e.may_have_side_effects(&self.expr_ctx))
                                .unwrap_or(true)
                        });

                        if is_default_last
                            && is_all_case_empty
                            && is_all_case_side_effect_free
                            && !has_conditional_stopper(&s.cases.last().unwrap().cons)
                        {
                            let mut exprs = Vec::new();
                            exprs.extend(ignore_result(s.discriminant, true, &self.expr_ctx));

                            exprs.extend(
                                s.cases
                                    .iter_mut()
                                    .filter_map(|case| case.test.take())
                                    .filter_map(|e| ignore_result(e, true, &self.expr_ctx)),
                            );

                            let stmts = s.cases.pop().unwrap().cons;
                            let mut stmts = remove_break(stmts);

                            if !exprs.is_empty() {
                                prepend_stmt(
                                    &mut stmts,
                                    ExprStmt {
                                        span: DUMMY_SP,
                                        expr: if exprs.len() == 1 {
                                            exprs.remove(0)
                                        } else {
                                            SeqExpr {
                                                span: DUMMY_SP,
                                                exprs,
                                            }
                                            .into()
                                        },
                                    }
                                    .into(),
                                );
                            }

                            if cfg!(feature = "debug") {
                                debug!("Stmt -> Block as all cases are empty");
                            }
                            let mut block: Stmt = BlockStmt {
                                span: s.span,
                                stmts,
                                ..Default::default()
                            }
                            .into();
                            block.visit_mut_with(self);
                            return block;
                        }
                    }

                    if is_matching_literal
                        && s.cases.iter().all(|case| match &case.test {
                            Some(e)
                                if matches!(
                                    &**e,
                                    Expr::Lit(Lit::Str(..))
                                        | Expr::Lit(Lit::Null(..))
                                        | Expr::Lit(Lit::Num(..))
                                ) =>
                            {
                                true
                            }
                            _ => false,
                        })
                    {
                        // No case can be matched.
                        if s.cases
                            .iter()
                            .all(|case| !has_conditional_stopper(&case.cons))
                        {
                            if cfg!(feature = "debug") {
                                debug!("Removing swtich because all cases are unreachable");
                            }

                            // Preserve variables
                            let decls: Vec<_> = s
                                .cases
                                .into_iter()
                                .flat_map(|case| extract_var_ids(&case.cons))
                                .chain(var_ids)
                                .map(|i| VarDeclarator {
                                    span: i.span,
                                    name: i.into(),
                                    init: None,
                                    definite: false,
                                })
                                .collect();
                            if !decls.is_empty() {
                                return VarDecl {
                                    span: DUMMY_SP,
                                    kind: VarDeclKind::Var,
                                    decls,
                                    declare: false,
                                    ..Default::default()
                                }
                                .into();
                            }
                            return EmptyStmt { span: s.span }.into();
                        }
                    }

                    s.into()
                }

                Stmt::For(s)
                    if match &s.test {
                        Some(test) => {
                            matches!(&**test, Expr::Lit(Lit::Bool(Bool { value: false, .. })))
                        }
                        _ => false,
                    } =>
                {
                    if cfg!(feature = "debug") {
                        debug!("Optimizing a for statement with a false test");
                    }

                    let decl = s.body.extract_var_ids_as_var();
                    let body = if let Some(var) = decl {
                        var.into()
                    } else {
                        EmptyStmt { span: s.span }.into()
                    };

                    if s.init.is_some() {
                        ForStmt {
                            body: Box::new(body),
                            update: None,
                            ..s
                        }
                        .into()
                    } else {
                        body
                    }
                }

                Stmt::While(s) => {
                    if let (purity, Known(v)) = s.test.cast_to_bool(&self.expr_ctx) {
                        if v {
                            if purity.is_pure() {
                                WhileStmt {
                                    test: Lit::Bool(Bool {
                                        span: s.test.span(),
                                        value: true,
                                    })
                                    .into(),
                                    ..s
                                }
                                .into()
                            } else {
                                s.into()
                            }
                        } else {
                            let body = s.body.extract_var_ids_as_var();
                            let body = body.map(Box::new).map(Decl::Var).map(Stmt::Decl);
                            let body = body.unwrap_or(EmptyStmt { span: s.span }.into());

                            if purity.is_pure() {
                                body
                            } else {
                                WhileStmt {
                                    body: Box::new(body),
                                    ..s
                                }
                                .into()
                            }
                        }
                    } else {
                        s.into()
                    }
                }

                Stmt::DoWhile(s) => {
                    if has_conditional_stopper(&[s.clone().into()]) {
                        return s.into();
                    }

                    if let Known(v) = s.test.as_pure_bool(&self.expr_ctx) {
                        if v {
                            // `for(;;);` is shorter than `do ; while(true);`
                            ForStmt {
                                span: s.span,
                                init: None,
                                test: None,
                                update: None,
                                body: s.body,
                            }
                            .into()
                        } else {
                            let mut body = prepare_loop_body_for_inlining(*s.body);
                            body.visit_mut_with(self);

                            if let Some(test) = ignore_result(s.test, true, &self.expr_ctx) {
                                BlockStmt {
                                    span: s.span,
                                    stmts: vec![body, test.into_stmt()],
                                    ..Default::default()
                                }
                                .into()
                            } else {
                                body
                            }
                        }
                    } else {
                        s.into()
                    }
                }

                Stmt::Decl(Decl::Var(v)) => {
                    let decls = v.decls.move_flat_map(|v| {
                        if !is_literal(&v.init) {
                            return Some(v);
                        }

                        //
                        match &v.name {
                            Pat::Object(o) if o.props.is_empty() => {
                                if cfg!(feature = "debug") {
                                    debug!("Dropping an object pattern in a var declaration");
                                }

                                None
                            }
                            Pat::Array(a) if a.elems.is_empty() => {
                                if cfg!(feature = "debug") {
                                    debug!("Dropping an array pattern in a var declaration");
                                }

                                None
                            }

                            _ => Some(v),
                        }
                    });

                    if decls.is_empty() {
                        if cfg!(feature = "debug") {
                            debug!("Dropping a useless variable declaration");
                        }

                        return EmptyStmt { span: v.span }.into();
                    }

                    VarDecl { decls, ..*v }.into()
                }

                _ => stmt,
            }
        })
    }

    fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
        self.fold_stmt_like(n)
    }

    fn visit_mut_switch_stmt(&mut self, s: &mut SwitchStmt) {
        s.visit_mut_children_with(self);

        if s.cases
            .iter()
            .any(|case| matches!(case.test.as_deref(), Some(Expr::Update(..))))
        {
            return;
        }

        if s.cases.iter().all(|case| {
            if let Some(test) = case.test.as_deref() {
                if test.may_have_side_effects(&self.expr_ctx) {
                    return false;
                }
            }

            if case.cons.is_empty() {
                return true;
            }

            matches!(case.cons[0], Stmt::Break(BreakStmt { label: None, .. }))
        }) {
            s.cases.clear();
        }
    }

    fn visit_mut_var_declarators(&mut self, n: &mut Vec<VarDeclarator>) {
        self.maybe_par(cpu_count() * 8, n, |v, n| {
            n.visit_mut_with(v);
        })
    }
}

impl Remover {
    fn fold_stmt_like<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike + VisitWith<Hoister> + VisitMutWith<Self>,
    {
        let orig_len = stmts.len();

        let is_block_stmt = self.normal_block;
        self.normal_block = false;

        let mut new_stmts = Vec::with_capacity(stmts.len());

        self.maybe_par(cpu_count() * 8, &mut *stmts, |visitor, stmt| {
            visitor.normal_block = true;
            stmt.visit_mut_with(visitor);
        });

        let mut iter = stmts.take().into_iter();
        while let Some(stmt_like) = iter.next() {
            let stmt_like = match stmt_like.try_into_stmt() {
                Ok(stmt) => {
                    let stmt = match stmt {
                        // Remove empty statements.
                        Stmt::Empty(..) => continue,

                        Stmt::Expr(ExprStmt { ref expr, .. })
                            if match &**expr {
                                Expr::Lit(Lit::Str(..)) => false,
                                Expr::Lit(..) => true,
                                _ => false,
                            } && is_block_stmt =>
                        {
                            continue
                        }

                        // Control flow
                        Stmt::Throw(..)
                        | Stmt::Return { .. }
                        | Stmt::Continue { .. }
                        | Stmt::Break { .. } => {
                            // Hoist function and `var` declarations above return.
                            let mut decls = Vec::new();
                            let mut hoisted_fns = Vec::new();
                            for t in iter {
                                match t.try_into_stmt() {
                                    Ok(Stmt::Decl(Decl::Fn(f))) => {
                                        hoisted_fns.push(T::from(f.into()));
                                    }
                                    Ok(t) => {
                                        let ids = extract_var_ids(&t).into_iter().map(|i| {
                                            VarDeclarator {
                                                span: i.span,
                                                name: i.into(),
                                                init: None,
                                                definite: false,
                                            }
                                        });
                                        decls.extend(ids);
                                    }
                                    Err(item) => new_stmts.push(item),
                                }
                            }

                            if !decls.is_empty() {
                                new_stmts.push(T::from(
                                    VarDecl {
                                        span: DUMMY_SP,
                                        kind: VarDeclKind::Var,
                                        decls,
                                        declare: false,
                                        ..Default::default()
                                    }
                                    .into(),
                                ));
                            }

                            let stmt_like = T::from(stmt);
                            new_stmts.push(stmt_like);
                            new_stmts.extend(hoisted_fns);

                            *stmts = new_stmts;
                            if stmts.len() != orig_len {
                                self.changed = true;

                                if cfg!(feature = "debug") {
                                    debug!("Dropping statements after a control keyword");
                                }
                            }

                            return;
                        }

                        Stmt::Block(BlockStmt {
                            span,
                            mut stmts,
                            ctxt,
                            ..
                        }) => {
                            if stmts.is_empty() {
                                continue;
                            }

                            if !is_ok_to_inline_block(&stmts) {
                                stmts.visit_mut_with(self);
                                BlockStmt { span, stmts, ctxt }.into()
                            } else {
                                new_stmts.extend(
                                    stmts
                                        .into_iter()
                                        .filter(|s| !matches!(s, Stmt::Empty(..)))
                                        .map(T::from),
                                );
                                continue;
                            }
                        }

                        // Optimize if statement.
                        Stmt::If(IfStmt {
                            test,
                            cons,
                            alt,
                            span,
                        }) => {
                            // check if
                            match test.cast_to_bool(&self.expr_ctx) {
                                (purity, Known(val)) => {
                                    self.changed = true;
                                    if !purity.is_pure() {
                                        let expr = ignore_result(test, true, &self.expr_ctx);

                                        if let Some(expr) = expr {
                                            new_stmts.push(T::from(
                                                ExprStmt {
                                                    span: DUMMY_SP,
                                                    expr,
                                                }
                                                .into(),
                                            ));
                                        }
                                    }

                                    if val {
                                        // Hoist vars from alt
                                        if let Some(var) =
                                            alt.and_then(|alt| alt.extract_var_ids_as_var())
                                        {
                                            new_stmts.push(T::from(var.into()))
                                        }
                                        *cons
                                    } else {
                                        // Hoist vars from cons
                                        if let Some(var) = cons.extract_var_ids_as_var() {
                                            new_stmts.push(T::from(var.into()))
                                        }
                                        match alt {
                                            Some(alt) => *alt,
                                            None => continue,
                                        }
                                    }
                                }
                                _ => IfStmt {
                                    test,
                                    cons,
                                    alt,
                                    span,
                                }
                                .into(),
                            }
                        }

                        _ => stmt,
                    };

                    T::from(stmt)
                }
                Err(stmt_like) => stmt_like,
            };

            new_stmts.push(stmt_like);
        }

        *stmts = new_stmts
    }
}

/// Ignores the result.
///
/// Returns
///  - [Some] if `e` has a side effect.
///  - [None] if `e` does not have a side effect.
#[inline(never)]
fn ignore_result(e: Box<Expr>, drop_str_lit: bool, ctx: &ExprCtx) -> Option<Box<Expr>> {
    match *e {
        Expr::Lit(Lit::Num(..))
        | Expr::Lit(Lit::Bool(..))
        | Expr::Lit(Lit::Null(..))
        | Expr::Lit(Lit::Regex(..)) => None,

        Expr::Lit(Lit::Str(ref v)) if drop_str_lit || v.value.is_empty() => None,

        Expr::Paren(ParenExpr { expr, .. }) => ignore_result(expr, true, ctx),

        Expr::Assign(AssignExpr {
            op: op!("="),
            left: AssignTarget::Simple(left),
            right,
            ..
        }) if match &left {
            SimpleAssignTarget::Ident(l) => match &*right {
                Expr::Ident(r) => l.sym == r.sym && l.ctxt == r.ctxt,
                _ => false,
            },
            _ => false,
        } =>
        {
            None
        }

        Expr::Bin(BinExpr {
            span,
            left,
            op,
            right,
        }) if !op.may_short_circuit() => {
            let left = ignore_result(left, true, ctx);
            let right = ignore_result(right, true, ctx);

            match (left, right) {
                (Some(l), Some(r)) => ignore_result(
                    ctx.preserve_effects(span, Expr::undefined(span), vec![l, r]),
                    true,
                    ctx,
                ),
                (Some(l), None) => Some(l),
                (None, Some(r)) => Some(r),
                (None, None) => None,
            }
        }

        Expr::Bin(BinExpr {
            span,
            left,
            op,
            right,
        }) => {
            if op == op!("&&") {
                let right = if let Some(right) = ignore_result(right, true, ctx) {
                    right
                } else {
                    return ignore_result(left, true, ctx);
                };

                let l = left.as_pure_bool(ctx);

                if let Known(l) = l {
                    if l {
                        Some(right)
                    } else {
                        None
                    }
                } else {
                    Some(
                        BinExpr {
                            span,
                            left,
                            op,
                            right,
                        }
                        .into(),
                    )
                }
            } else {
                debug_assert!(op == op!("||") || op == op!("??"));

                let l = left.as_pure_bool(ctx);

                if let Known(l) = l {
                    if l {
                        None
                    } else {
                        ignore_result(right, true, ctx)
                    }
                } else {
                    let right = ignore_result(right, true, ctx);
                    if let Some(right) = right {
                        Some(
                            BinExpr {
                                span,
                                left,
                                op,
                                right,
                            }
                            .into(),
                        )
                    } else {
                        ignore_result(left, true, ctx)
                    }
                }
            }
        }

        Expr::Unary(UnaryExpr { span, op, arg }) => match op {
            // Don't remove ! from negated iifes.
            op!("!")
                if match &*arg {
                    Expr::Call(call) => match &call.callee {
                        Callee::Expr(callee) => matches!(&**callee, Expr::Fn(..)),
                        _ => false,
                    },
                    _ => false,
                } =>
            {
                Some(UnaryExpr { span, op, arg }.into())
            }

            op!("void") | op!(unary, "+") | op!(unary, "-") | op!("!") | op!("~") => {
                ignore_result(arg, true, ctx)
            }
            _ => Some(UnaryExpr { span, op, arg }.into()),
        },

        Expr::Array(ArrayLit { span, elems, .. }) => {
            let mut has_spread = false;
            let elems = elems.move_flat_map(|v| match v {
                Some(ExprOrSpread {
                    spread: Some(..), ..
                }) => {
                    has_spread = true;
                    Some(v)
                }
                None => None,
                Some(ExprOrSpread { spread: None, expr }) => ignore_result(expr, true, ctx)
                    .map(|expr| Some(ExprOrSpread { spread: None, expr })),
            });

            if elems.is_empty() {
                None
            } else if has_spread {
                Some(ArrayLit { span, elems }.into())
            } else {
                ignore_result(
                    ctx.preserve_effects(
                        span,
                        Expr::undefined(span),
                        elems.into_iter().map(|v| v.unwrap().expr),
                    ),
                    true,
                    ctx,
                )
            }
        }

        Expr::Object(ObjectLit { span, props, .. }) => {
            let props = props.move_flat_map(|v| match v {
                PropOrSpread::Spread(..) => Some(v),
                PropOrSpread::Prop(ref p) => {
                    if is_literal(&**p) {
                        None
                    } else {
                        Some(v)
                    }
                }
            });

            if props.is_empty() {
                None
            } else {
                ignore_result(
                    ctx.preserve_effects(
                        span,
                        Expr::undefined(DUMMY_SP),
                        once(ObjectLit { span, props }.into()),
                    ),
                    true,
                    ctx,
                )
            }
        }

        Expr::New(NewExpr {
            span,
            ref callee,
            args,
            ..
        }) if callee.is_pure_callee(ctx) => ignore_result(
            ArrayLit {
                span,
                elems: args
                    .map(|args| args.into_iter().map(Some).collect())
                    .unwrap_or_else(Default::default),
            }
            .into(),
            true,
            ctx,
        ),

        Expr::Call(CallExpr {
            span,
            callee: Callee::Expr(ref callee),
            args,
            ..
        }) if callee.is_pure_callee(ctx) => ignore_result(
            ArrayLit {
                span,
                elems: args.into_iter().map(Some).collect(),
            }
            .into(),
            true,
            ctx,
        ),

        Expr::Tpl(Tpl { span, exprs, .. }) => ignore_result(
            ctx.preserve_effects(span, Expr::undefined(span), exprs),
            true,
            ctx,
        ),

        Expr::TaggedTpl(TaggedTpl { span, tag, tpl, .. }) if tag.is_pure_callee(ctx) => {
            ignore_result(
                ctx.preserve_effects(span, Expr::undefined(span), tpl.exprs),
                true,
                ctx,
            )
        }

        //
        // Function expressions are useless if they are not used.
        //
        // As function expressions cannot start with 'function',
        // this will be reached only if other things
        // are removed while folding children.
        Expr::Fn(..) => None,

        Expr::Seq(SeqExpr {
            span, mut exprs, ..
        }) => {
            if exprs.is_empty() {
                return None;
            }

            let last = ignore_result(exprs.pop().unwrap(), true, ctx);

            exprs.extend(last);

            if exprs.is_empty() {
                return None;
            }

            if exprs.len() == 1 {
                return Some(exprs.pop().unwrap());
            }

            Some(SeqExpr { span, exprs }.into())
        }

        Expr::Cond(CondExpr {
            span,
            test,
            cons,
            alt,
        }) => {
            let alt = if let Some(alt) = ignore_result(alt, true, ctx) {
                alt
            } else {
                return ignore_result(
                    BinExpr {
                        span,
                        left: test,
                        op: op!("&&"),
                        right: cons,
                    }
                    .into(),
                    true,
                    ctx,
                );
            };

            let cons = if let Some(cons) = ignore_result(cons, true, ctx) {
                cons
            } else {
                return ignore_result(
                    BinExpr {
                        span,
                        left: test,
                        op: op!("||"),
                        right: alt,
                    }
                    .into(),
                    true,
                    ctx,
                );
            };

            Some(
                CondExpr {
                    span,
                    test,
                    cons,
                    alt,
                }
                .into(),
            )
        }

        _ => Some(e),
    }
}

/// # Returns true for
///
/// ```js
/// {
///    var x = 1;
/// }
/// ```
///
/// ```js
/// {
///    var x;
///    var y;
///    var z;
///    {
///        var a;
///        var b;
///    }
/// }
/// ```
///
/// ```js
/// {
///    var a = 0;
///    foo();
/// }
/// ```
///
/// # Returns false for
///
/// ```js
/// a: {
///    break a;
///    var x = 1;
/// }
/// ```
fn is_ok_to_inline_block(s: &[Stmt]) -> bool {
    // TODO: This may be inlinable if return / throw / break / continue exists
    if s.iter().any(is_block_scoped_stuff) {
        return false;
    }

    // variable declared as `var` is hoisted
    let last_var = s.iter().rposition(|s| match s {
        Stmt::Decl(Decl::Var(v))
            if matches!(
                &**v,
                VarDecl {
                    kind: VarDeclKind::Var,
                    ..
                },
            ) =>
        {
            true
        }
        _ => false,
    });

    let last_var = if let Some(pos) = last_var {
        pos
    } else {
        return true;
    };

    let last_stopper = s.iter().rposition(|s| {
        matches!(
            s,
            Stmt::Return(..) | Stmt::Throw(..) | Stmt::Break(..) | Stmt::Continue(..)
        )
    });

    if let Some(last_stopper) = last_stopper {
        last_stopper > last_var
    } else {
        true
    }
}

fn is_block_scoped_stuff(s: &Stmt) -> bool {
    match s {
        Stmt::Decl(Decl::Var(v)) if v.kind == VarDeclKind::Const || v.kind == VarDeclKind::Let => {
            true
        }
        Stmt::Decl(Decl::Fn(..)) | Stmt::Decl(Decl::Class(..)) => true,
        _ => false,
    }
}

fn prepare_loop_body_for_inlining(stmt: Stmt) -> Stmt {
    let span = stmt.span();
    let mut stmts = match stmt {
        Stmt::Block(BlockStmt { stmts, .. }) => stmts,
        _ => vec![stmt],
    };

    let mut done = false;
    stmts.retain(|stmt| {
        if done {
            return false;
        }

        match stmt {
            Stmt::Break(BreakStmt { label: None, .. })
            | Stmt::Continue(ContinueStmt { label: None, .. }) => {
                done = true;
                false
            }

            Stmt::Return(..) | Stmt::Throw(..) => {
                done = true;
                true
            }

            _ => true,
        }
    });

    BlockStmt {
        span,
        stmts,
        ..Default::default()
    }
    .into()
}

fn has_unconditional_stopper(s: &[Stmt]) -> bool {
    check_for_stopper(s, false)
}

fn has_conditional_stopper(s: &[Stmt]) -> bool {
    check_for_stopper(s, true)
}

fn check_for_stopper(s: &[Stmt], only_conditional: bool) -> bool {
    struct Visitor {
        in_cond: bool,
        found: bool,
    }

    impl Visit for Visitor {
        noop_visit_type!();

        fn visit_switch_case(&mut self, node: &SwitchCase) {
            let old = self.in_cond;
            self.in_cond = true;
            node.cons.visit_with(self);
            self.in_cond = old;
        }

        fn visit_break_stmt(&mut self, s: &BreakStmt) {
            if self.in_cond && s.label.is_none() {
                self.found = true
            }
        }

        fn visit_continue_stmt(&mut self, s: &ContinueStmt) {
            if self.in_cond && s.label.is_none() {
                self.found = true
            }
        }

        fn visit_return_stmt(&mut self, _: &ReturnStmt) {
            if self.in_cond {
                self.found = true
            }
        }

        fn visit_throw_stmt(&mut self, _: &ThrowStmt) {
            if self.in_cond {
                self.found = true
            }
        }

        fn visit_class(&mut self, _: &Class) {}

        fn visit_function(&mut self, _: &Function) {}

        fn visit_if_stmt(&mut self, node: &IfStmt) {
            let old = self.in_cond;
            self.in_cond = true;
            node.cons.visit_with(self);
            self.in_cond = true;
            node.alt.visit_with(self);
            self.in_cond = old;
        }
    }

    let mut v = Visitor {
        in_cond: !only_conditional,
        found: false,
    };
    v.visit_stmts(s);
    v.found
}

/// Finds the depth of statements without hitting a block
fn stmt_depth(s: &Stmt) -> u32 {
    let mut depth = 0;

    match s {
        // Stop when hitting a statement we know can't increase statement depth.
        Stmt::Block(_) | Stmt::Labeled(_) | Stmt::Switch(_) | Stmt::Decl(_) | Stmt::Expr(_) => {}
        // Take the max depth of if statements
        Stmt::If(i) => {
            depth += 1;
            if let Some(alt) = &i.alt {
                depth += std::cmp::max(stmt_depth(&i.cons), stmt_depth(alt));
            } else {
                depth += stmt_depth(&i.cons);
            }
        }
        // These statements can have bodies without a wrapping block
        Stmt::With(WithStmt { body, .. })
        | Stmt::While(WhileStmt { body, .. })
        | Stmt::DoWhile(DoWhileStmt { body, .. })
        | Stmt::For(ForStmt { body, .. })
        | Stmt::ForIn(ForInStmt { body, .. })
        | Stmt::ForOf(ForOfStmt { body, .. }) => {
            depth += 1;
            depth += stmt_depth(body);
        }
        // All other statements increase the depth by 1
        _ => depth += 1,
    }

    depth
}
