use std::{borrow::Cow, cmp::min, iter::once};
use swc_atoms::js_word;
use swc_common::{
    pass::{CompilerPass, Repeated},
    util::move_map::MoveMap,
    Spanned, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::pass::RepeatedJsPass;
use swc_ecma_utils::extract_var_ids;
use swc_ecma_utils::is_literal;
use swc_ecma_utils::prepend;
use swc_ecma_utils::preserve_effects;
use swc_ecma_utils::undefined;
use swc_ecma_utils::ExprExt;
use swc_ecma_utils::ExprFactory;
use swc_ecma_utils::Hoister;
use swc_ecma_utils::IsEmpty;
use swc_ecma_utils::StmtExt;
use swc_ecma_utils::StmtLike;
use swc_ecma_utils::Value::Known;
use swc_ecma_visit::noop_visit_type;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith, Node, Visit, VisitWith};

#[cfg(test)]
mod tests;

/// Not intended for general use. Use [simplifier] instead.
///
/// Ported from `PeepholeRemoveDeadCode` of google closure compiler.
pub fn dead_branch_remover() -> impl RepeatedJsPass + 'static {
    Remover::default()
}

impl CompilerPass for Remover {
    fn name() -> Cow<'static, str> {
        Cow::Borrowed("branch")
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

#[derive(Debug, Default)]
struct Remover {
    changed: bool,
    normal_block: bool,
}

impl Fold for Remover {
    noop_fold_type!();

    fn fold_array_pat(&mut self, p: ArrayPat) -> ArrayPat {
        let mut p: ArrayPat = p.fold_children_with(self);

        let mut preserved = None;
        let len = p.elems.len();
        for (i, p) in p.elems.iter().enumerate() {
            let can_be_removed = match p {
                Some(Pat::Array(ref p)) if p.elems.is_empty() => true,
                Some(Pat::Object(ref p)) if p.props.is_empty() => true,
                _ => false,
            };

            if !can_be_removed {
                preserved = Some(min(i + 1, len))
            }
        }

        if let Some(i) = preserved {
            p.elems.drain(i..);
        }

        ArrayPat { ..p }
    }

    fn fold_expr(&mut self, e: Expr) -> Expr {
        let e: Expr = e.fold_children_with(self);

        match e {
            Expr::Assign(AssignExpr {
                op: op!("="),
                left: PatOrExpr::Pat(l),
                right: r,
                ..
            }) if match &*l {
                Pat::Ident(l) => match &*r {
                    Expr::Ident(r) => l.id.sym == r.sym && l.id.span.ctxt() == r.span.ctxt(),
                    _ => false,
                },
                _ => false,
            } =>
            {
                return Expr::Ident(r.ident().unwrap())
            }

            Expr::Assign(AssignExpr {
                op: op!("="),
                left: PatOrExpr::Pat(left),
                right,
                ..
            }) if match &*left {
                Pat::Array(arr) => arr.elems.is_empty() || arr.elems.iter().all(|v| v.is_none()),
                _ => false,
            } =>
            {
                return *right;
            }

            Expr::Assign(AssignExpr {
                op: op!("="),
                left: PatOrExpr::Pat(left),
                right,
                ..
            }) if match &*left {
                Pat::Object(obj) => obj.props.is_empty(),
                _ => false,
            } =>
            {
                return *right;
            }

            Expr::Cond(e)
                if !e.test.may_have_side_effects()
                    && (e.cons.is_undefined()
                        || match *e.cons {
                            Expr::Unary(UnaryExpr {
                                op: op!("void"),
                                ref arg,
                                ..
                            }) if !arg.may_have_side_effects() => true,
                            _ => false,
                        })
                    && (e.alt.is_undefined()
                        || match *e.alt {
                            Expr::Unary(UnaryExpr {
                                op: op!("void"),
                                ref arg,
                                ..
                            }) if !arg.may_have_side_effects() => true,
                            _ => false,
                        }) =>
            {
                return *e.cons
            }

            _ => {}
        }

        e
    }

    fn fold_for_stmt(&mut self, s: ForStmt) -> ForStmt {
        let s = s.fold_children_with(self);

        ForStmt {
            init: s.init.and_then(|e| match e {
                VarDeclOrExpr::Expr(e) => ignore_result(*e).map(Box::new).map(VarDeclOrExpr::from),
                _ => Some(e),
            }),
            update: s.update.and_then(|e| ignore_result(*e).map(Box::new)),
            test: s.test.and_then(|e| {
                let span = e.span();
                if let Known(value) = e.as_pure_bool() {
                    return if value {
                        None
                    } else {
                        Some(Box::new(Expr::Lit(Lit::Bool(Bool { span, value: false }))))
                    };
                }

                Some(e)
            }),
            ..s
        }
    }

    fn fold_object_pat(&mut self, p: ObjectPat) -> ObjectPat {
        let mut p = p.fold_children_with(self);

        // Don't remove if there exists a rest pattern
        if p.props.iter().any(|p| match p {
            ObjectPatProp::Rest(..) => true,
            _ => false,
        }) {
            return p;
        }

        fn is_computed(k: &PropName) -> bool {
            match k {
                PropName::Computed(..) => true,
                _ => false,
            }
        }

        p.props.retain(|p| match p {
            ObjectPatProp::KeyValue(KeyValuePatProp { key, value, .. })
                if match &**value {
                    Pat::Object(p) => !is_computed(&key) && p.props.is_empty(),
                    _ => false,
                } =>
            {
                false
            }

            ObjectPatProp::KeyValue(KeyValuePatProp { key, value, .. })
                if match &**value {
                    Pat::Array(p) => !is_computed(&key) && p.elems.is_empty(),
                    _ => false,
                } =>
            {
                false
            }
            _ => true,
        });

        p
    }

    fn fold_object_pat_prop(&mut self, p: ObjectPatProp) -> ObjectPatProp {
        let p = p.fold_children_with(self);

        match p {
            ObjectPatProp::Assign(AssignPatProp {
                span,
                key,
                value: Some(expr),
            }) if expr.is_undefined()
                || match *expr {
                    Expr::Unary(UnaryExpr {
                        op: op!("void"),
                        ref arg,
                        ..
                    }) => is_literal(&**arg),
                    _ => false,
                } =>
            {
                return ObjectPatProp::Assign(AssignPatProp {
                    span,
                    key,
                    value: None,
                });
            }

            _ => {}
        }

        p
    }

    fn fold_pat(&mut self, p: Pat) -> Pat {
        let p = p.fold_children_with(self);

        match p {
            Pat::Assign(p)
                if p.right.is_undefined()
                    || match *p.right {
                        Expr::Unary(UnaryExpr {
                            op: op!("void"),
                            ref arg,
                            ..
                        }) => is_literal(&**arg),
                        _ => false,
                    } =>
            {
                return *p.left;
            }

            Pat::Assign(p)
                if match *p.left {
                    Pat::Object(ref o) => o.props.is_empty(),
                    _ => false,
                } && p.right.is_number() =>
            {
                return *p.left;
            }

            _ => {}
        }

        p
    }

    fn fold_seq_expr(&mut self, e: SeqExpr) -> SeqExpr {
        let mut e: SeqExpr = e.fold_children_with(self);
        if e.exprs.is_empty() {
            return e;
        }

        let last = e.exprs.pop().unwrap();
        let mut exprs = e.exprs.move_flat_map(|e| ignore_result(*e).map(Box::new));
        exprs.push(last);

        SeqExpr { exprs, ..e }
    }

    fn fold_stmt(&mut self, stmt: Stmt) -> Stmt {
        let stmt = stmt.fold_children_with(self);

        match stmt {
            Stmt::If(IfStmt {
                span,
                test,
                cons,
                alt,
            }) => {
                match *cons {
                    Stmt::If(IfStmt { alt: Some(..), .. }) => {
                        return IfStmt {
                            test,
                            cons: Box::new(Stmt::Block(BlockStmt {
                                span: DUMMY_SP,
                                stmts: vec![*cons],
                            })),
                            alt,
                            span,
                        }
                        .into()
                    }
                    _ => {}
                }

                let mut stmts = vec![];
                if let (p, Known(v)) = test.as_bool() {
                    // Preserve effect of the test
                    if !p.is_pure() {
                        match ignore_result(*test).map(Box::new) {
                            Some(expr) => stmts.push(Stmt::Expr(ExprStmt { span, expr })),
                            None => {}
                        }
                    }

                    if v {
                        // Preserve variables
                        if let Some(var) = alt.and_then(|alt| alt.extract_var_ids_as_var()) {
                            stmts.push(Stmt::Decl(Decl::Var(var)))
                        }
                        stmts.push(*cons);
                    } else {
                        if let Some(var) = cons.extract_var_ids_as_var() {
                            stmts.push(Stmt::Decl(Decl::Var(var)))
                        }

                        if let Some(alt) = alt {
                            stmts.push(*alt)
                        }
                    }

                    if stmts.is_empty() {
                        return Stmt::Empty(EmptyStmt { span });
                    }

                    self.changed = true;

                    return Stmt::Block(BlockStmt { span, stmts }).fold_with(self);
                }

                let alt = match &alt {
                    Some(stmt) if stmt.is_empty() => None,
                    _ => alt,
                };
                if alt.is_none() {
                    match *cons {
                        Stmt::Empty(..) => {
                            self.changed = true;

                            return if let Some(expr) = ignore_result(*test) {
                                Stmt::Expr(ExprStmt {
                                    span,
                                    expr: Box::new(expr),
                                })
                            } else {
                                Stmt::Empty(EmptyStmt { span })
                            };
                        }
                        _ => {}
                    }
                }

                return Stmt::If(IfStmt {
                    span,
                    test,
                    cons,
                    alt,
                });
            }

            Stmt::Decl(Decl::Var(v)) if v.decls.is_empty() => {
                Stmt::Empty(EmptyStmt { span: v.span })
            }

            Stmt::Labeled(LabeledStmt { span, body, .. }) if body.is_empty() => {
                Stmt::Empty(EmptyStmt { span })
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
                Stmt::Empty(EmptyStmt { span })
            }

            // `1;` -> `;`
            Stmt::Expr(ExprStmt { span, expr, .. }) => {
                let expr = *expr;
                match ignore_result(expr) {
                    Some(e) => Stmt::Expr(ExprStmt {
                        span,
                        expr: Box::new(e),
                    }),
                    None => Stmt::Empty(EmptyStmt { span: DUMMY_SP }),
                }
            }

            Stmt::Block(BlockStmt { span, stmts }) => {
                if stmts.is_empty() {
                    Stmt::Empty(EmptyStmt { span })
                } else if stmts.len() == 1
                    && !is_block_scoped_stuff(&stmts[0])
                    && stmt_depth(&stmts[0]) <= 1
                {
                    stmts.into_iter().next().unwrap().fold_with(self)
                } else {
                    Stmt::Block(BlockStmt { span, stmts })
                }
            }
            Stmt::Try(TryStmt {
                span,
                block,
                handler,
                finalizer,
            }) => {
                // Only leave the finally block if try block is empty
                if block.is_empty() {
                    let var = handler.and_then(|h| Stmt::from(h.body).extract_var_ids_as_var());

                    return if let Some(mut finalizer) = finalizer {
                        if let Some(var) = var.map(Decl::from).map(Stmt::from) {
                            prepend(&mut finalizer.stmts, var);
                        }
                        finalizer.into()
                    } else {
                        var.map(Decl::from)
                            .map(Stmt::from)
                            .unwrap_or_else(|| Stmt::Empty(EmptyStmt { span }))
                    };
                }

                // If catch block is not specified and finally block is empty, fold it to simple
                // block.
                if handler.is_none() && finalizer.is_empty() {
                    return Stmt::Block(block);
                }

                Stmt::Try(TryStmt {
                    span,
                    block,
                    handler,
                    finalizer,
                })
            }

            Stmt::Switch(mut s) => {
                let remove_break = |stmts: Vec<Stmt>| {
                    debug_assert!(
                        !has_conditional_stopper(&*stmts) || has_unconditional_stopper(&*stmts)
                    );

                    let mut done = false;
                    stmts.move_flat_map(|s| {
                        if done {
                            match s {
                                Stmt::Decl(Decl::Var(
                                    var
                                    @
                                    VarDecl {
                                        kind: VarDeclKind::Var,
                                        ..
                                    },
                                )) => {
                                    return Some(Stmt::Decl(Decl::Var(VarDecl {
                                        span: DUMMY_SP,
                                        kind: VarDeclKind::Var,
                                        decls: var
                                            .decls
                                            .move_map(|decl| VarDeclarator { init: None, ..decl }),
                                        declare: false,
                                    })))
                                }
                                _ => {}
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
                    ref e
                        if e.is_ident_ref_to(js_word!("NaN"))
                            || e.is_ident_ref_to(js_word!("undefined")) =>
                    {
                        true
                    }
                    _ => false,
                };

                // Remove empty switch
                if s.cases.is_empty() {
                    return match ignore_result(*s.discriminant) {
                        Some(expr) => Stmt::Expr(ExprStmt {
                            span: s.span,
                            expr: Box::new(expr),
                        }),
                        None => Stmt::Empty(EmptyStmt { span: s.span }),
                    };
                }

                // Handle a switch statement with only default.
                if s.cases.len() == 1
                    && s.cases[0].test.is_none()
                    && !has_conditional_stopper(&s.cases[0].cons)
                {
                    let mut stmts = remove_break(s.cases.remove(0).cons);
                    if let Some(expr) = ignore_result(*s.discriminant) {
                        prepend(&mut stmts, expr.into_stmt());
                    }

                    return Stmt::Block(BlockStmt {
                        span: s.span,
                        stmts,
                    })
                    .fold_with(self);
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
                                (&Expr::Lit(Lit::Null(..)), &Expr::Lit(Lit::Null(..))) => true,
                                (&Expr::Ident(ref test), &Expr::Ident(ref d)) => {
                                    test.sym == d.sym && test.span.ctxt() == d.span.ctxt()
                                }

                                _ => {
                                    if !test.is_ident_ref_to(js_word!("NaN"))
                                        && !test.is_ident_ref_to(js_word!("undefined"))
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

                let mut var_ids = vec![];
                if let Some(i) = selected {
                    if !has_conditional_stopper(&s.cases[i].cons) {
                        let mut stmts = s.cases.remove(i).cons;
                        let mut cases = s.cases.drain(i..);

                        while let Some(case) = cases.next() {
                            let should_stop = has_unconditional_stopper(&case.cons);
                            stmts.extend(case.cons);
                            //
                            if should_stop {
                                break;
                            }
                        }

                        let mut stmts = remove_break(stmts);

                        let decls = cases
                            .into_iter()
                            .flat_map(|case| case.cons)
                            .flat_map(|stmt| stmt.extract_var_ids())
                            .map(|i| VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(i.into()),
                                init: None,
                                definite: false,
                            })
                            .collect::<Vec<_>>();

                        if !decls.is_empty() {
                            prepend(
                                &mut stmts,
                                Stmt::Decl(Decl::Var(VarDecl {
                                    span: DUMMY_SP,
                                    kind: VarDeclKind::Var,
                                    decls,
                                    declare: false,
                                })),
                            );
                        }

                        return Stmt::Block(BlockStmt {
                            span: s.span,
                            stmts,
                        })
                        .fold_with(self);
                    }
                } else {
                    match *s.discriminant {
                        Expr::Lit(..) => {
                            let idx = s.cases.iter().position(|v| v.test.is_none());
                            if let Some(i) = idx {
                                if !has_conditional_stopper(&s.cases[i].cons) {
                                    let stmts = s.cases.remove(i).cons;
                                    let stmts = remove_break(stmts);

                                    return Stmt::Block(BlockStmt {
                                        span: s.span,
                                        stmts,
                                    })
                                    .fold_with(self);
                                }
                            }
                        }
                        _ => {}
                    }
                }

                if is_matching_literal {
                    let mut idx = 0usize;
                    let mut breaked = false;
                    // Remove unmatchable cases.
                    s.cases = s.cases.move_flat_map(|case| {
                        if non_constant_case_idx.is_some() && idx >= non_constant_case_idx.unwrap()
                        {
                            idx += 1;
                            return Some(case);
                        }

                        // Detect unconditional break;
                        if selected.is_some() && selected <= Some(idx) {
                            // Done.
                            if breaked {
                                idx += 1;
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
                                if match &*e {
                                    Expr::Lit(Lit::Num(..))
                                    | Expr::Lit(Lit::Str(..))
                                    | Expr::Lit(Lit::Null(..)) => true,
                                    _ => false,
                                } =>
                            {
                                case.cons
                                    .into_iter()
                                    .for_each(|stmt| var_ids.extend(stmt.extract_var_ids()));

                                None
                            }
                            _ => Some(case),
                        };
                        idx += 1;
                        res
                    });
                }

                let is_default_last = match s.cases.last() {
                    Some(SwitchCase { test: None, .. }) => true,
                    _ => false,
                };

                {
                    // True if all cases except default is empty.
                    let is_all_case_empty = s
                        .cases
                        .iter()
                        .all(|case| case.test.is_none() || case.cons.is_empty());

                    if is_default_last
                        && is_all_case_empty
                        && !has_conditional_stopper(&s.cases.last().unwrap().cons)
                    {
                        let stmts = s.cases.pop().unwrap().cons;
                        let stmts = remove_break(stmts);
                        return Stmt::Block(BlockStmt {
                            span: s.span,
                            stmts,
                        })
                        .fold_with(self);
                    }
                }

                if is_matching_literal
                    && s.cases.iter().all(|case| match &case.test {
                        Some(e)
                            if match &**e {
                                Expr::Lit(Lit::Str(..))
                                | Expr::Lit(Lit::Null(..))
                                | Expr::Lit(Lit::Num(..)) => true,
                                _ => false,
                            } =>
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
                        // Preserve variables
                        let decls: Vec<_> = s
                            .cases
                            .into_iter()
                            .flat_map(|case| extract_var_ids(&case.cons))
                            .chain(var_ids)
                            .map(|i| VarDeclarator {
                                span: i.span,
                                name: Pat::Ident(i.into()),
                                init: None,
                                definite: false,
                            })
                            .collect();
                        if !decls.is_empty() {
                            return Stmt::Decl(Decl::Var(VarDecl {
                                span: DUMMY_SP,
                                kind: VarDeclKind::Var,
                                decls,
                                declare: false,
                            }));
                        }
                        return Stmt::Empty(EmptyStmt { span: s.span });
                    }
                }

                SwitchStmt { ..s }.into()
            }

            Stmt::For(s)
                if match &s.test {
                    Some(test) => match &**test {
                        Expr::Lit(Lit::Bool(Bool { value: false, .. })) => true,
                        _ => false,
                    },
                    _ => false,
                } =>
            {
                let decl = s.body.extract_var_ids_as_var();
                let body = if let Some(var) = decl {
                    Stmt::Decl(Decl::Var(var))
                } else {
                    Stmt::Empty(EmptyStmt { span: s.span })
                };

                if s.init.is_some() {
                    Stmt::For(ForStmt {
                        body: Box::new(body),
                        update: None,
                        ..s
                    })
                } else {
                    body
                }
            }

            Stmt::While(s) => {
                if let (purity, Known(v)) = s.test.as_bool() {
                    if v {
                        Stmt::While(WhileStmt {
                            test: Box::new(Expr::Lit(Lit::Bool(Bool {
                                span: s.test.span(),
                                value: true,
                            }))),
                            ..s
                        })
                    } else {
                        if purity.is_pure() {
                            Stmt::Empty(EmptyStmt { span: s.span })
                        } else {
                            Stmt::While(WhileStmt {
                                body: Box::new(Stmt::Empty(EmptyStmt { span: s.span })),
                                ..s
                            })
                        }
                    }
                } else {
                    Stmt::While(s)
                }
            }

            Stmt::DoWhile(s) => {
                if let Known(v) = s.test.as_pure_bool() {
                    if v {
                        // `for(;;);` is shorter than `do ; while(true);`
                        Stmt::For(ForStmt {
                            span: s.span,
                            init: None,
                            test: None,
                            update: None,
                            body: s.body,
                        })
                    } else {
                        if let Some(test) = ignore_result(*s.test) {
                            BlockStmt {
                                span: s.span,
                                stmts: vec![
                                    prepare_loop_body_for_inlining(*s.body).fold_with(self),
                                    test.into_stmt(),
                                ],
                            }
                            .into()
                        } else {
                            prepare_loop_body_for_inlining(*s.body).fold_with(self)
                        }
                    }
                } else {
                    Stmt::DoWhile(s)
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
                            return None;
                        }
                        Pat::Array(a) if a.elems.is_empty() => {
                            return None;
                        }

                        _ => Some(v),
                    }
                });

                if decls.is_empty() {
                    return Stmt::Empty(EmptyStmt { span: v.span });
                }

                Stmt::Decl(Decl::Var(VarDecl { decls, ..v }))
            }

            _ => stmt,
        }
    }

    fn fold_switch_stmt(&mut self, s: SwitchStmt) -> SwitchStmt {
        let s: SwitchStmt = s.fold_children_with(self);

        if s.cases.iter().all(|case| {
            if case.cons.is_empty() {
                return true;
            }

            match case.cons[0] {
                Stmt::Break(BreakStmt { label: None, .. }) => true,
                _ => false,
            }
        }) {
            return SwitchStmt { cases: vec![], ..s };
        }

        s
    }

    fn fold_module_items(&mut self, n: Vec<ModuleItem>) -> Vec<ModuleItem> {
        self.fold_stmt_like(n)
    }

    fn fold_stmts(&mut self, n: Vec<Stmt>) -> Vec<Stmt> {
        self.fold_stmt_like(n)
    }
}

impl Remover {
    fn fold_stmt_like<T>(&mut self, stmts: Vec<T>) -> Vec<T>
    where
        T: StmtLike + VisitWith<Hoister> + FoldWith<Self>,
    {
        let is_block_stmt = self.normal_block;
        self.normal_block = false;

        let mut buf = Vec::with_capacity(stmts.len());

        let mut iter = stmts.into_iter();
        while let Some(stmt_like) = iter.next() {
            self.normal_block = true;
            let stmt_like = stmt_like.fold_with(self);
            self.normal_block = false;

            let stmt_like = match stmt_like.try_into_stmt() {
                Ok(stmt) => {
                    let stmt = match stmt {
                        // Remove empty statements.
                        Stmt::Empty(..) => continue,

                        Stmt::Expr(ExprStmt { ref expr, .. }) if expr.is_lit() && is_block_stmt => {
                            continue
                        }

                        // Control flow
                        Stmt::Throw(..)
                        | Stmt::Return { .. }
                        | Stmt::Continue { .. }
                        | Stmt::Break { .. } => {
                            // Hoist function and `var` declarations above return.
                            let mut decls = vec![];
                            let mut hoisted_fns = vec![];
                            for t in iter {
                                match t.try_into_stmt() {
                                    Ok(Stmt::Decl(Decl::Fn(f))) => {
                                        hoisted_fns.push(T::from_stmt(Stmt::Decl(Decl::Fn(f))));
                                    }
                                    Ok(t) => {
                                        let ids = extract_var_ids(&t).into_iter().map(|i| {
                                            VarDeclarator {
                                                span: i.span,
                                                name: Pat::Ident(i.into()),
                                                init: None,
                                                definite: false,
                                            }
                                        });
                                        decls.extend(ids);
                                    }
                                    Err(item) => buf.push(item),
                                }
                            }

                            if !decls.is_empty() {
                                buf.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                                    span: DUMMY_SP,
                                    kind: VarDeclKind::Var,
                                    decls,
                                    declare: false,
                                }))));
                            }

                            buf.extend(hoisted_fns);

                            let stmt_like = T::from_stmt(stmt);
                            buf.push(stmt_like);

                            return buf;
                        }

                        Stmt::Block(BlockStmt { span, stmts, .. }) => {
                            if stmts.len() == 0 {
                                continue;
                            }

                            if !is_ok_to_inline_block(&stmts) {
                                BlockStmt {
                                    span,
                                    stmts: stmts.fold_with(self),
                                }
                                .into()
                            } else {
                                buf.extend(
                                    stmts
                                        .into_iter()
                                        .filter(|s| match s {
                                            Stmt::Empty(..) => false,
                                            _ => true,
                                        })
                                        .map(T::from_stmt),
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
                            match test.as_bool() {
                                (purity, Known(val)) => {
                                    self.changed = true;
                                    if !purity.is_pure() {
                                        let expr = ignore_result(*test);

                                        if let Some(expr) = expr {
                                            buf.push(T::from_stmt(Stmt::Expr(ExprStmt {
                                                span: DUMMY_SP,
                                                expr: Box::new(expr),
                                            })));
                                        }
                                    }

                                    if val {
                                        // Hoist vars from alt
                                        if let Some(var) =
                                            alt.and_then(|alt| alt.extract_var_ids_as_var())
                                        {
                                            buf.push(T::from_stmt(Stmt::Decl(Decl::Var(var))))
                                        }
                                        *cons
                                    } else {
                                        // Hoist vars from cons
                                        if let Some(var) = cons.extract_var_ids_as_var() {
                                            buf.push(T::from_stmt(Stmt::Decl(Decl::Var(var))))
                                        }
                                        match alt {
                                            Some(alt) => *alt,
                                            None => continue,
                                        }
                                    }
                                }
                                _ => Stmt::If(IfStmt {
                                    test,
                                    cons,
                                    alt,
                                    span,
                                }),
                            }
                        }

                        _ => stmt,
                    };

                    T::from_stmt(stmt)
                }
                Err(stmt_like) => stmt_like,
            };

            buf.push(stmt_like);
        }

        buf
    }
}

/// Ignores the result.
///
/// Returns
///  - [Some] if `e` has a side effect.
///  - [None] if `e` does not have a side effect.
#[inline(never)]
fn ignore_result(e: Expr) -> Option<Expr> {
    match e {
        Expr::Lit(Lit::Num(..))
        | Expr::Lit(Lit::Bool(..))
        | Expr::Lit(Lit::Null(..))
        | Expr::Lit(Lit::Regex(..))
        | Expr::Ident(..) => None,

        Expr::Lit(Lit::Str(ref v)) if v.value.is_empty() => None,

        Expr::Paren(ParenExpr { expr, .. }) => ignore_result(*expr),

        Expr::Assign(AssignExpr {
            op: op!("="),
            left: PatOrExpr::Pat(left),
            right,
            ..
        }) if match &*left {
            Pat::Ident(l) => match &*right {
                Expr::Ident(r) => l.id.sym == r.sym && l.id.span.ctxt() == r.span.ctxt(),
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
        }) if op != op!("&&") && op != op!("||") => {
            let left = ignore_result(*left);
            let right = ignore_result(*right);

            match (left, right) {
                (Some(l), Some(r)) => ignore_result(preserve_effects(
                    span,
                    *undefined(span),
                    vec![Box::new(l), Box::new(r)],
                )),
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
                let right = if let Some(right) = ignore_result(*right) {
                    Box::new(right)
                } else {
                    return ignore_result(*left);
                };

                let l = left.as_pure_bool();

                if let Known(l) = l {
                    Some(Expr::Lit(Lit::Bool(Bool { span, value: l })))
                } else {
                    Some(Expr::Bin(BinExpr {
                        span,
                        left,
                        op,
                        right,
                    }))
                }
            } else {
                debug_assert_eq!(op, op!("||"));

                let l = left.as_pure_bool();

                if let Known(l) = l {
                    if l {
                        None
                    } else {
                        ignore_result(*right)
                    }
                } else {
                    let right = ignore_result(*right);
                    if let Some(right) = right {
                        Some(Expr::Bin(BinExpr {
                            span,
                            left,
                            op,
                            right: Box::new(right),
                        }))
                    } else {
                        ignore_result(*left)
                    }
                }
            }
        }

        Expr::Unary(UnaryExpr { span, op, arg }) => match op {
            op!("void")
            | op!("typeof")
            | op!(unary, "+")
            | op!(unary, "-")
            | op!("!")
            | op!("~") => ignore_result(*arg),
            _ => Some(Expr::Unary(UnaryExpr { span, op, arg })),
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
                Some(ExprOrSpread { spread: None, expr }) => ignore_result(*expr).map(|expr| {
                    Some(ExprOrSpread {
                        spread: None,
                        expr: Box::new(expr),
                    })
                }),
            });

            if elems.is_empty() {
                None
            } else {
                if has_spread {
                    Some(Expr::Array(ArrayLit { span, elems }))
                } else {
                    ignore_result(preserve_effects(
                        span,
                        *undefined(span),
                        elems.into_iter().map(|v| v.unwrap().expr),
                    ))
                }
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
                ignore_result(preserve_effects(
                    span,
                    *undefined(DUMMY_SP),
                    once(Box::new(Expr::Object(ObjectLit { span, props }))),
                ))
            }
        }

        Expr::New(NewExpr {
            span,
            ref callee,
            args,
            ..
        }) if callee.is_pure_callee() => ignore_result(Expr::Array(ArrayLit {
            span,
            elems: args
                .map(|args| args.into_iter().map(Some).collect())
                .unwrap_or_else(Default::default),
        })),

        Expr::Call(CallExpr {
            span,
            callee: ExprOrSuper::Expr(ref callee),
            args,
            ..
        }) if callee.is_pure_callee() => ignore_result(Expr::Array(ArrayLit {
            span,
            elems: args.into_iter().map(Some).collect(),
        })),

        Expr::Tpl(Tpl { span, exprs, .. }) => {
            ignore_result(preserve_effects(span, *undefined(span), exprs))
        }

        Expr::TaggedTpl(TaggedTpl {
            span,
            tag,
            tpl: Tpl { exprs, .. },
            ..
        }) if tag.is_pure_callee() => {
            ignore_result(preserve_effects(span, *undefined(span), exprs))
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

            let last = ignore_result(*exprs.pop().unwrap()).map(Box::new);

            exprs.extend(last);

            Some(Expr::Seq(SeqExpr { span, exprs }))
        }

        Expr::Cond(CondExpr {
            span,
            test,
            cons,
            alt,
        }) => {
            let alt = if let Some(alt) = ignore_result(*alt) {
                alt
            } else {
                return ignore_result(Expr::Bin(BinExpr {
                    span,
                    left: test,
                    op: op!("&&"),
                    right: cons,
                }));
            };

            let cons = if let Some(cons) = ignore_result(*cons) {
                cons
            } else {
                return ignore_result(Expr::Bin(BinExpr {
                    span,
                    left: test,
                    op: op!("||"),
                    right: Box::new(alt),
                }));
            };

            Some(Expr::Cond(CondExpr {
                span,
                test,
                cons: Box::new(cons),
                alt: Box::new(alt),
            }))
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
    if s.iter().any(|s| is_block_scoped_stuff(s)) {
        return false;
    }

    // variable declared as `var` is hoisted
    let last_var = s.iter().rposition(|s| match s {
        Stmt::Decl(Decl::Var(VarDecl {
            kind: VarDeclKind::Var,
            ..
        })) => true,
        _ => false,
    });

    let last_var = if let Some(pos) = last_var {
        pos
    } else {
        return true;
    };

    let last_stopper = s.iter().rposition(|s| match s {
        Stmt::Return(..) | Stmt::Throw(..) | Stmt::Break(..) | Stmt::Continue(..) => true,
        _ => false,
    });

    if let Some(last_stopper) = last_stopper {
        last_stopper > last_var
    } else {
        true
    }
}

fn is_block_scoped_stuff(s: &Stmt) -> bool {
    match s {
        Stmt::Decl(Decl::Var(VarDecl { kind, .. }))
            if *kind == VarDeclKind::Const || *kind == VarDeclKind::Let =>
        {
            return true;
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

    BlockStmt { span, stmts }.into()
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

        fn visit_switch_case(&mut self, node: &SwitchCase, _: &dyn Node) {
            let old = self.in_cond;
            self.in_cond = true;
            node.cons.visit_with(node as _, self);
            self.in_cond = old;
        }

        fn visit_break_stmt(&mut self, s: &BreakStmt, _: &dyn Node) {
            if self.in_cond && s.label.is_none() {
                self.found = true
            }
        }

        fn visit_continue_stmt(&mut self, s: &ContinueStmt, _: &dyn Node) {
            if self.in_cond && s.label.is_none() {
                self.found = true
            }
        }

        fn visit_return_stmt(&mut self, _: &ReturnStmt, _: &dyn Node) {
            if self.in_cond {
                self.found = true
            }
        }

        fn visit_throw_stmt(&mut self, _: &ThrowStmt, _: &dyn Node) {
            if self.in_cond {
                self.found = true
            }
        }

        fn visit_class(&mut self, _: &Class, _: &dyn Node) {}

        fn visit_function(&mut self, _: &Function, _: &dyn Node) {}

        fn visit_if_stmt(&mut self, node: &IfStmt, _: &dyn Node) {
            let old = self.in_cond;
            self.in_cond = true;
            node.cons.visit_with(node as _, self);
            self.in_cond = true;
            node.alt.visit_with(node as _, self);
            self.in_cond = old;
        }
    }

    let mut v = Visitor {
        in_cond: !only_conditional,
        found: false,
    };
    v.visit_stmts(s, &Invalid { span: DUMMY_SP } as _);
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
                depth += std::cmp::max(stmt_depth(&i.cons), stmt_depth(&alt));
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
            depth += stmt_depth(&body);
        }
        // All other statements increase the depth by 1
        _ => depth += 1,
    }

    depth
}
