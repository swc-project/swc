use std::collections::{HashMap, HashSet};

use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    op, AssignExpr, AssignTarget, Decl, Expr, Lit, Pat, SimpleAssignTarget, Stmt, VarDecl,
    VarDeclKind,
};
use swc_ecma_visit::{Visit, VisitWith};

use crate::hir::HirFunction;

/// Runs a conservative dead-code elimination pass over top-level statements
/// in the lowered function body.
pub fn dead_code_elimination(hir: &mut HirFunction) {
    let Some(body) = hir.function.body.as_mut() else {
        return;
    };
    let originally_declared = collect_declared_bindings_in_stmts(&body.stmts);

    let function_captures = collect_function_like_captures(&body.stmts);
    let assigned_bindings = collect_assigned_bindings_in_stmts(&body.stmts);
    let mut live = HashSet::<String>::new();
    prune_stmts_with_liveness(
        &mut body.stmts,
        &mut live,
        &function_captures,
        &assigned_bindings,
    );

    let mut read_bindings = collect_read_bindings(&body.stmts);
    let mut written_bindings = collect_assigned_bindings_in_stmts(&body.stmts);
    prune_dead_writes_with_known_reads(&mut body.stmts, &read_bindings, &written_bindings);
    // Re-run once after statement pruning so declaration retention can reflect
    // writes that survived the first pass.
    read_bindings = collect_read_bindings(&body.stmts);
    written_bindings = collect_assigned_bindings_in_stmts(&body.stmts);
    prune_dead_writes_with_known_reads(&mut body.stmts, &read_bindings, &written_bindings);
    ensure_uninitialized_declarations_for_assigned_reads(
        &mut body.stmts,
        &read_bindings,
        &originally_declared,
    );
    simplify_overwritten_pure_assignments_in_stmts(&mut body.stmts);
    prune_empty_statements(&mut body.stmts);
}

fn prune_stmts_with_liveness(
    stmts: &mut Vec<Stmt>,
    live: &mut HashSet<String>,
    function_captures: &HashMap<String, HashSet<String>>,
    assigned_bindings: &HashSet<String>,
) {
    let original = std::mem::take(stmts);
    let mut kept_rev = Vec::with_capacity(original.len());

    for mut stmt in original.into_iter().rev() {
        if keep_statement(&mut stmt, live, function_captures, assigned_bindings) {
            kept_rev.push(stmt);
        }
    }

    kept_rev.reverse();
    *stmts = kept_rev;
}

fn keep_statement(
    stmt: &mut Stmt,
    live: &mut HashSet<String>,
    function_captures: &HashMap<String, HashSet<String>>,
    assigned_bindings: &HashSet<String>,
) -> bool {
    match stmt {
        Stmt::Return(return_stmt) => {
            if let Some(arg) = &return_stmt.arg {
                collect_expr_reads(arg, live);
            }
            true
        }
        Stmt::Decl(Decl::Var(var_decl)) => keep_var_decl(var_decl, live, assigned_bindings),
        Stmt::Expr(expr_stmt) => match &mut *expr_stmt.expr {
            Expr::Assign(assign) => keep_assign_expr(assign, live, function_captures),
            Expr::Update(update) => {
                let Expr::Ident(ident) = &*update.arg else {
                    collect_expr_reads(&expr_stmt.expr, live);
                    return true;
                };

                let name = ident.sym.to_string();
                if live.contains(&name) {
                    live.insert(name);
                    true
                } else {
                    false
                }
            }
            other => {
                if expr_is_pure(other) {
                    false
                } else {
                    collect_expr_reads(other, live);
                    true
                }
            }
        },
        Stmt::Block(block) => {
            prune_stmts_with_liveness(&mut block.stmts, live, function_captures, assigned_bindings);
            !block.stmts.is_empty()
        }
        Stmt::If(if_stmt) => {
            let mut cons_live = live.clone();
            if !keep_statement(
                &mut if_stmt.cons,
                &mut cons_live,
                function_captures,
                assigned_bindings,
            ) {
                if_stmt.cons = Box::new(Stmt::Empty(swc_ecma_ast::EmptyStmt { span: DUMMY_SP }));
            }

            let mut alt_live = live.clone();
            if let Some(alt) = &mut if_stmt.alt {
                if !keep_statement(alt, &mut alt_live, function_captures, assigned_bindings) {
                    if_stmt.alt = None;
                }
            }

            *live = cons_live;
            live.extend(alt_live);
            collect_expr_reads(&if_stmt.test, live);
            true
        }
        Stmt::Switch(switch_stmt) => {
            let mut merged_live = live.clone();

            for case in &mut switch_stmt.cases {
                let mut case_live = live.clone();
                prune_stmts_with_liveness(
                    &mut case.cons,
                    &mut case_live,
                    function_captures,
                    assigned_bindings,
                );
                merged_live.extend(case_live);
                if let Some(test) = &case.test {
                    collect_expr_reads(test, &mut merged_live);
                }
            }

            *live = merged_live;
            collect_expr_reads(&switch_stmt.discriminant, live);
            true
        }
        Stmt::While(_) | Stmt::DoWhile(_) | Stmt::For(_) | Stmt::ForIn(_) | Stmt::ForOf(_) => {
            // Loop-carried values require fixed-point liveness. Keep conservative
            // statement-level behavior here to avoid pruning assignments that are
            // read on subsequent iterations.
            collect_stmt_reads(stmt, live);
            true
        }
        Stmt::Labeled(labeled) => {
            if !keep_statement(
                &mut labeled.body,
                live,
                function_captures,
                assigned_bindings,
            ) {
                return false;
            }
            true
        }
        Stmt::Try(_) => {
            // Conservatively retain try/catch/finally structure. Reordering or
            // pruning inside exception regions can change observable behavior.
            collect_stmt_reads(stmt, live);
            true
        }
        other => {
            collect_stmt_reads(other, live);
            true
        }
    }
}

fn collect_pat_names(pat: &Pat, out: &mut HashSet<String>) {
    match pat {
        Pat::Ident(binding) => {
            out.insert(binding.id.sym.to_string());
        }
        Pat::Array(array) => {
            for element in array.elems.iter().flatten() {
                collect_pat_names(element, out);
            }
        }
        Pat::Object(object) => {
            for prop in &object.props {
                match prop {
                    swc_ecma_ast::ObjectPatProp::Assign(assign) => {
                        out.insert(assign.key.id.sym.to_string());
                    }
                    swc_ecma_ast::ObjectPatProp::KeyValue(key_value) => {
                        collect_pat_names(&key_value.value, out);
                    }
                    swc_ecma_ast::ObjectPatProp::Rest(rest) => {
                        collect_pat_names(&rest.arg, out);
                    }
                }
            }
        }
        Pat::Assign(assign) => collect_pat_names(&assign.left, out),
        Pat::Rest(rest) => collect_pat_names(&rest.arg, out),
        Pat::Expr(_) | Pat::Invalid(_) => {}
    }
}

fn keep_var_decl(
    var_decl: &mut VarDecl,
    live: &mut HashSet<String>,
    assigned_bindings: &HashSet<String>,
) -> bool {
    if var_decl.kind == VarDeclKind::Var || var_decl.decls.len() != 1 {
        collect_stmt_reads(&Stmt::Decl(Decl::Var(Box::new(var_decl.clone()))), live);
        return true;
    }

    let decl = &var_decl.decls[0];
    let Some(name) = pat_ident_name(&decl.name) else {
        collect_stmt_reads(&Stmt::Decl(Decl::Var(Box::new(var_decl.clone()))), live);
        return true;
    };

    if live.contains(&name) {
        live.remove(&name);
        if let Some(init) = &decl.init {
            collect_expr_reads(init, live);
        }
        return true;
    }
    if decl.init.is_none() && assigned_bindings.contains(&name) {
        return true;
    }

    match &decl.init {
        Some(init) if !expr_is_pure(init) => {
            collect_expr_reads(init, live);
            true
        }
        _ => false,
    }
}

fn keep_assign_expr(
    assign: &AssignExpr,
    live: &mut HashSet<String>,
    function_captures: &HashMap<String, HashSet<String>>,
) -> bool {
    let Some(name) = assign_target_ident_name(&assign.left) else {
        collect_expr_reads(&assign.right, live);
        return true;
    };

    let rhs_pure = expr_is_pure(&assign.right);
    if live.contains(&name) {
        live.remove(&name);
        if assign.op != op!("=") {
            live.insert(name);
        }
        collect_expr_reads(&assign.right, live);
        true
    } else if rhs_pure {
        let captured_by_live_function = live.iter().any(|binding| {
            function_captures
                .get(binding.as_str())
                .is_some_and(|captures| captures.contains(name.as_str()))
        });
        if captured_by_live_function {
            live.insert(name);
            collect_expr_reads(&assign.right, live);
            true
        } else {
            false
        }
    } else {
        collect_expr_reads(&assign.right, live);
        true
    }
}

fn collect_function_like_captures(stmts: &[Stmt]) -> HashMap<String, HashSet<String>> {
    let mut captures = HashMap::new();

    for stmt in stmts {
        let Stmt::Decl(Decl::Var(var_decl)) = stmt else {
            continue;
        };
        let [decl] = var_decl.decls.as_slice() else {
            continue;
        };
        let Pat::Ident(binding) = &decl.name else {
            continue;
        };
        let Some(init) = &decl.init else {
            continue;
        };
        if !matches!(&**init, Expr::Arrow(_) | Expr::Fn(_)) {
            continue;
        }

        let mut refs = HashSet::new();
        collect_expr_reads(init, &mut refs);
        refs.remove(binding.id.sym.as_ref());
        captures.insert(binding.id.sym.to_string(), refs);
    }

    captures
}

fn pat_ident_name(pat: &Pat) -> Option<String> {
    match pat {
        Pat::Ident(binding) => Some(binding.id.sym.to_string()),
        _ => None,
    }
}

fn assign_target_ident_name(target: &AssignTarget) -> Option<String> {
    match target {
        AssignTarget::Simple(SimpleAssignTarget::Ident(binding)) => {
            Some(binding.id.sym.to_string())
        }
        _ => None,
    }
}

fn collect_stmt_reads(stmt: &Stmt, out: &mut HashSet<String>) {
    struct Collector<'a> {
        out: &'a mut HashSet<String>,
    }

    impl Visit for Collector<'_> {
        fn visit_ident(&mut self, ident: &swc_ecma_ast::Ident) {
            self.out.insert(ident.sym.to_string());
        }
    }

    stmt.visit_with(&mut Collector { out });
}

fn collect_expr_reads(expr: &Expr, out: &mut HashSet<String>) {
    struct Collector<'a> {
        out: &'a mut HashSet<String>,
    }

    impl Visit for Collector<'_> {
        fn visit_ident(&mut self, ident: &swc_ecma_ast::Ident) {
            self.out.insert(ident.sym.to_string());
        }
    }

    expr.visit_with(&mut Collector { out });
}

fn expr_is_pure(expr: &Expr) -> bool {
    match expr {
        Expr::This(_)
        | Expr::Ident(_)
        | Expr::Lit(_)
        | Expr::Fn(_)
        | Expr::Arrow(_)
        | Expr::Class(_)
        | Expr::MetaProp(_) => true,
        Expr::Paren(expr) => expr_is_pure(&expr.expr),
        Expr::TsAs(expr) => expr_is_pure(&expr.expr),
        Expr::TsTypeAssertion(expr) => expr_is_pure(&expr.expr),
        Expr::TsNonNull(expr) => expr_is_pure(&expr.expr),
        Expr::TsConstAssertion(expr) => expr_is_pure(&expr.expr),
        Expr::TsInstantiation(expr) => expr_is_pure(&expr.expr),
        Expr::TsSatisfies(expr) => expr_is_pure(&expr.expr),
        Expr::Array(array) => array.elems.iter().all(|elem| {
            elem.as_ref().map_or(true, |elem| {
                elem.spread.is_none() && expr_is_pure(&elem.expr)
            })
        }),
        Expr::Object(object) => object.props.iter().all(|prop| match prop {
            swc_ecma_ast::PropOrSpread::Spread(_) => false,
            swc_ecma_ast::PropOrSpread::Prop(prop) => match &**prop {
                swc_ecma_ast::Prop::Shorthand(_) => true,
                swc_ecma_ast::Prop::KeyValue(prop) => expr_is_pure(&prop.value),
                swc_ecma_ast::Prop::Assign(_) => true,
                swc_ecma_ast::Prop::Getter(_) | swc_ecma_ast::Prop::Setter(_) => true,
                swc_ecma_ast::Prop::Method(_) => true,
            },
        }),
        Expr::Unary(unary) => unary.op != swc_ecma_ast::UnaryOp::Delete && expr_is_pure(&unary.arg),
        Expr::Bin(bin) => expr_is_pure(&bin.left) && expr_is_pure(&bin.right),
        Expr::Cond(cond) => {
            expr_is_pure(&cond.test) && expr_is_pure(&cond.cons) && expr_is_pure(&cond.alt)
        }
        Expr::Seq(seq) => seq.exprs.iter().all(|expr| expr_is_pure(expr)),
        Expr::Call(_) => false,
        // Conservative fallback for expressions with potential side-effects.
        Expr::New(_)
        | Expr::Update(_)
        | Expr::Assign(_)
        | Expr::Await(_)
        | Expr::Yield(_)
        | Expr::Member(_)
        | Expr::SuperProp(_)
        | Expr::OptChain(_)
        | Expr::Tpl(_)
        | Expr::TaggedTpl(_)
        | Expr::PrivateName(_)
        | Expr::Invalid(_)
        | Expr::JSXMember(_)
        | Expr::JSXNamespacedName(_)
        | Expr::JSXEmpty(_)
        | Expr::JSXElement(_)
        | Expr::JSXFragment(_) => false,
    }
}

fn collect_read_bindings(stmts: &[Stmt]) -> HashSet<String> {
    struct Collector {
        reads: HashSet<String>,
        in_lhs: bool,
        in_pat: bool,
    }

    impl Visit for Collector {
        fn visit_ident(&mut self, ident: &swc_ecma_ast::Ident) {
            if self.in_lhs || self.in_pat {
                return;
            }
            self.reads.insert(ident.sym.to_string());
        }

        fn visit_var_declarator(&mut self, decl: &swc_ecma_ast::VarDeclarator) {
            let prev_pat = self.in_pat;
            self.in_pat = true;
            decl.name.visit_with(self);
            self.in_pat = prev_pat;

            if let Some(init) = &decl.init {
                init.visit_with(self);
            }
        }

        fn visit_assign_expr(&mut self, assign: &AssignExpr) {
            if assign.left.as_ident().is_some() {
                let prev_lhs = self.in_lhs;
                self.in_lhs = true;
                assign.left.visit_with(self);
                self.in_lhs = prev_lhs;
            } else {
                assign.left.visit_with(self);
            }
            assign.right.visit_with(self);
        }

        fn visit_update_expr(&mut self, update: &swc_ecma_ast::UpdateExpr) {
            if matches!(&*update.arg, Expr::Ident(_)) {
                let prev_lhs = self.in_lhs;
                self.in_lhs = true;
                update.arg.visit_with(self);
                self.in_lhs = prev_lhs;
            } else {
                update.arg.visit_with(self);
            }
        }
    }

    let mut collector = Collector {
        reads: HashSet::new(),
        in_lhs: false,
        in_pat: false,
    };
    for stmt in stmts {
        stmt.visit_with(&mut collector);
    }
    collector.reads
}

fn prune_dead_writes_with_known_reads(
    stmts: &mut Vec<Stmt>,
    reads: &HashSet<String>,
    written: &HashSet<String>,
) {
    let mut rewritten = Vec::with_capacity(stmts.len());
    let original = std::mem::take(stmts);

    for mut stmt in original {
        match &mut stmt {
            Stmt::Decl(Decl::Var(var_decl)) => {
                rewrite_var_decl_dropping_dead_writes(var_decl, reads, written, &mut rewritten);
            }
            Stmt::Expr(expr_stmt) => match &mut *expr_stmt.expr {
                Expr::Assign(assign) => {
                    let Some(name) = assign_target_ident_name(&assign.left) else {
                        rewritten.push(stmt);
                        continue;
                    };
                    if reads.contains(&name) {
                        rewritten.push(stmt);
                        continue;
                    }

                    let rhs = assign.right.clone();
                    if !expr_is_pure(&rhs) {
                        rewritten.push(Stmt::Expr(swc_ecma_ast::ExprStmt {
                            span: expr_stmt.span,
                            expr: rhs,
                        }));
                    }
                }
                Expr::Update(update) => {
                    let Expr::Ident(ident) = &*update.arg else {
                        rewritten.push(stmt);
                        continue;
                    };
                    if reads.contains(ident.sym.as_ref()) {
                        rewritten.push(stmt);
                    }
                }
                _ => rewritten.push(stmt),
            },
            Stmt::Block(block) => {
                prune_dead_writes_with_known_reads(&mut block.stmts, reads, written);
                rewritten.push(stmt);
            }
            Stmt::If(if_stmt) => {
                prune_dead_writes_in_nested_stmt(&mut if_stmt.cons, reads, written);
                if let Some(alt) = &mut if_stmt.alt {
                    prune_dead_writes_in_nested_stmt(alt, reads, written);
                }
                rewritten.push(stmt);
            }
            Stmt::While(while_stmt) => {
                prune_dead_writes_in_nested_stmt(&mut while_stmt.body, reads, written);
                rewritten.push(stmt);
            }
            Stmt::DoWhile(do_while_stmt) => {
                prune_dead_writes_in_nested_stmt(&mut do_while_stmt.body, reads, written);
                rewritten.push(stmt);
            }
            Stmt::For(for_stmt) => {
                prune_dead_writes_in_nested_stmt(&mut for_stmt.body, reads, written);
                rewritten.push(stmt);
            }
            Stmt::ForIn(for_in_stmt) => {
                prune_dead_writes_in_nested_stmt(&mut for_in_stmt.body, reads, written);
                rewritten.push(stmt);
            }
            Stmt::ForOf(for_of_stmt) => {
                prune_dead_writes_in_nested_stmt(&mut for_of_stmt.body, reads, written);
                rewritten.push(stmt);
            }
            Stmt::Switch(switch_stmt) => {
                for case in &mut switch_stmt.cases {
                    prune_dead_writes_with_known_reads(&mut case.cons, reads, written);
                }
                rewritten.push(stmt);
            }
            Stmt::Labeled(labeled) => {
                prune_dead_writes_in_nested_stmt(&mut labeled.body, reads, written);
                rewritten.push(stmt);
            }
            _ => rewritten.push(stmt),
        }
    }

    *stmts = rewritten;
}

fn rewrite_var_decl_dropping_dead_writes(
    var_decl: &mut Box<VarDecl>,
    reads: &HashSet<String>,
    written: &HashSet<String>,
    out: &mut Vec<Stmt>,
) {
    let mut kept_decls = Vec::with_capacity(var_decl.decls.len());

    for decl in &var_decl.decls {
        let Some(name) = pat_ident_name(&decl.name) else {
            kept_decls.push(decl.clone());
            continue;
        };

        if reads.contains(&name) {
            kept_decls.push(decl.clone());
            continue;
        }
        if written.contains(&name) {
            kept_decls.push(decl.clone());
            continue;
        }

        if let Some(init) = &decl.init {
            if expr_is_outlineable_hook_call(init) {
                kept_decls.push(decl.clone());
                continue;
            }
            if !expr_is_pure(init) {
                out.push(Stmt::Expr(swc_ecma_ast::ExprStmt {
                    span: decl.span,
                    expr: init.clone(),
                }));
            }
        }
    }

    if kept_decls.is_empty() {
        return;
    }

    let mut kept = (**var_decl).clone();
    kept.decls = kept_decls;
    out.push(Stmt::Decl(Decl::Var(Box::new(kept))));
}

fn expr_is_outlineable_hook_call(expr: &Expr) -> bool {
    let Expr::Call(call) = expr else {
        return false;
    };

    let swc_ecma_ast::Callee::Expr(callee_expr) = &call.callee else {
        return false;
    };
    match &**callee_expr {
        Expr::Ident(callee) => matches!(callee.sym.as_ref(), "useCallback" | "useMemo"),
        Expr::Member(member) => {
            matches!(&*member.obj, Expr::Ident(object) if object.sym == "React")
                && matches!(
                    &member.prop,
                    swc_ecma_ast::MemberProp::Ident(property)
                        if matches!(property.sym.as_ref(), "useCallback" | "useMemo")
                )
        }
        _ => false,
    }
}

fn prune_dead_writes_in_nested_stmt(
    stmt: &mut Box<Stmt>,
    reads: &HashSet<String>,
    written: &HashSet<String>,
) {
    match &mut **stmt {
        Stmt::Block(block) => prune_dead_writes_with_known_reads(&mut block.stmts, reads, written),
        Stmt::If(if_stmt) => {
            prune_dead_writes_in_nested_stmt(&mut if_stmt.cons, reads, written);
            if let Some(alt) = &mut if_stmt.alt {
                prune_dead_writes_in_nested_stmt(alt, reads, written);
            }
        }
        Stmt::While(while_stmt) => {
            prune_dead_writes_in_nested_stmt(&mut while_stmt.body, reads, written)
        }
        Stmt::DoWhile(do_while_stmt) => {
            prune_dead_writes_in_nested_stmt(&mut do_while_stmt.body, reads, written)
        }
        Stmt::For(for_stmt) => prune_dead_writes_in_nested_stmt(&mut for_stmt.body, reads, written),
        Stmt::ForIn(for_in_stmt) => {
            prune_dead_writes_in_nested_stmt(&mut for_in_stmt.body, reads, written)
        }
        Stmt::ForOf(for_of_stmt) => {
            prune_dead_writes_in_nested_stmt(&mut for_of_stmt.body, reads, written)
        }
        Stmt::Switch(switch_stmt) => {
            for case in &mut switch_stmt.cases {
                prune_dead_writes_with_known_reads(&mut case.cons, reads, written);
            }
        }
        Stmt::Labeled(labeled) => {
            prune_dead_writes_in_nested_stmt(&mut labeled.body, reads, written);
        }
        _ => {}
    }
}

fn collect_assigned_bindings_in_stmts(stmts: &[Stmt]) -> HashSet<String> {
    let mut assigned = HashSet::new();
    for stmt in stmts {
        collect_assigned_bindings(stmt, &mut assigned);
    }
    assigned
}

fn ensure_uninitialized_declarations_for_assigned_reads(
    stmts: &mut Vec<Stmt>,
    reads: &HashSet<String>,
    originally_declared: &HashSet<String>,
) {
    let mut declared = HashSet::new();
    let mut assigned = HashSet::new();

    for stmt in stmts.iter() {
        collect_declared_bindings(stmt, &mut declared);
        collect_assigned_bindings(stmt, &mut assigned);
    }

    let mut missing = assigned
        .into_iter()
        .filter(|name| {
            reads.contains(name) && !declared.contains(name) && originally_declared.contains(name)
        })
        .collect::<Vec<_>>();
    if missing.is_empty() {
        return;
    }
    missing.sort();

    let mut decls = missing
        .into_iter()
        .map(|name| swc_ecma_ast::VarDeclarator {
            span: swc_common::DUMMY_SP,
            name: Pat::Ident(swc_ecma_ast::BindingIdent {
                id: swc_ecma_ast::Ident::new_no_ctxt(name.into(), swc_common::DUMMY_SP),
                type_ann: None,
            }),
            init: None,
            definite: false,
        })
        .collect::<Vec<_>>();
    if decls.is_empty() {
        return;
    }

    let directive_end = stmts
        .iter()
        .take_while(|stmt| matches!(stmt, Stmt::Expr(expr_stmt) if matches!(&*expr_stmt.expr, Expr::Lit(Lit::Str(_)))))
        .count();

    let missing_set = decls
        .iter()
        .filter_map(|decl| pat_ident_name(&decl.name))
        .collect::<HashSet<_>>();
    let first_use_index = stmts.iter().position(|stmt| {
        let mut read = HashSet::new();
        let mut assigned = HashSet::new();
        collect_stmt_reads(stmt, &mut read);
        collect_assigned_bindings(stmt, &mut assigned);
        read.iter()
            .chain(assigned.iter())
            .any(|name| missing_set.contains(name))
    });
    let insert_index = first_use_index.map_or(directive_end, |index| index.max(directive_end));
    stmts.insert(
        insert_index,
        Stmt::Decl(Decl::Var(Box::new(VarDecl {
            span: swc_common::DUMMY_SP,
            ctxt: Default::default(),
            kind: VarDeclKind::Let,
            declare: false,
            decls: std::mem::take(&mut decls),
        }))),
    );
}

fn collect_declared_bindings_in_stmts(stmts: &[Stmt]) -> HashSet<String> {
    let mut declared = HashSet::new();
    for stmt in stmts {
        collect_declared_bindings(stmt, &mut declared);
    }
    declared
}

fn collect_declared_bindings(stmt: &Stmt, out: &mut HashSet<String>) {
    struct Collector<'a> {
        out: &'a mut HashSet<String>,
    }

    impl Visit for Collector<'_> {
        fn visit_var_declarator(&mut self, decl: &swc_ecma_ast::VarDeclarator) {
            if let Some(name) = pat_ident_name(&decl.name) {
                self.out.insert(name);
            }
            decl.visit_children_with(self);
        }

        fn visit_fn_decl(&mut self, decl: &swc_ecma_ast::FnDecl) {
            self.out.insert(decl.ident.sym.to_string());
            decl.visit_children_with(self);
        }

        fn visit_class_decl(&mut self, decl: &swc_ecma_ast::ClassDecl) {
            self.out.insert(decl.ident.sym.to_string());
            decl.visit_children_with(self);
        }
    }

    stmt.visit_with(&mut Collector { out });
}

fn collect_assigned_bindings(stmt: &Stmt, out: &mut HashSet<String>) {
    struct Collector<'a> {
        out: &'a mut HashSet<String>,
    }

    impl Visit for Collector<'_> {
        fn visit_assign_expr(&mut self, assign: &AssignExpr) {
            if let Some(name) = assign_target_ident_name(&assign.left) {
                self.out.insert(name);
            }
            assign.visit_children_with(self);
        }

        fn visit_update_expr(&mut self, update: &swc_ecma_ast::UpdateExpr) {
            if let Expr::Ident(ident) = &*update.arg {
                self.out.insert(ident.sym.to_string());
            }
            update.visit_children_with(self);
        }
    }

    stmt.visit_with(&mut Collector { out });
}

fn simplify_overwritten_pure_assignments_in_stmts(stmts: &mut [Stmt]) {
    for stmt in stmts {
        simplify_overwritten_pure_assignments_in_stmt(stmt);
    }
}

fn simplify_overwritten_pure_assignments_in_stmt(stmt: &mut Stmt) {
    match stmt {
        Stmt::Expr(expr_stmt) => simplify_overwritten_pure_assignments_in_expr(&mut expr_stmt.expr),
        Stmt::Decl(Decl::Var(var_decl)) => {
            for decl in &mut var_decl.decls {
                if let Some(init) = &mut decl.init {
                    simplify_overwritten_pure_assignments_in_expr(init);
                }
            }
        }
        Stmt::Return(return_stmt) => {
            if let Some(arg) = &mut return_stmt.arg {
                simplify_overwritten_pure_assignments_in_expr(arg);
            }
        }
        Stmt::Throw(throw_stmt) => {
            simplify_overwritten_pure_assignments_in_expr(&mut throw_stmt.arg);
        }
        Stmt::If(if_stmt) => {
            simplify_overwritten_pure_assignments_in_expr(&mut if_stmt.test);
            simplify_overwritten_pure_assignments_in_stmt(&mut if_stmt.cons);
            if let Some(alt) = &mut if_stmt.alt {
                simplify_overwritten_pure_assignments_in_stmt(alt);
            }
        }
        Stmt::Block(block) => simplify_overwritten_pure_assignments_in_stmts(&mut block.stmts),
        Stmt::Switch(switch_stmt) => {
            simplify_overwritten_pure_assignments_in_expr(&mut switch_stmt.discriminant);
            for case in &mut switch_stmt.cases {
                if let Some(test) = &mut case.test {
                    simplify_overwritten_pure_assignments_in_expr(test);
                }
                simplify_overwritten_pure_assignments_in_stmts(&mut case.cons);
            }
        }
        Stmt::Labeled(labeled) => simplify_overwritten_pure_assignments_in_stmt(&mut labeled.body),
        Stmt::For(for_stmt) => {
            if let Some(init) = &mut for_stmt.init {
                match init {
                    swc_ecma_ast::VarDeclOrExpr::VarDecl(var_decl) => {
                        for decl in &mut var_decl.decls {
                            if let Some(init) = &mut decl.init {
                                simplify_overwritten_pure_assignments_in_expr(init);
                            }
                        }
                    }
                    swc_ecma_ast::VarDeclOrExpr::Expr(expr) => {
                        simplify_overwritten_pure_assignments_in_expr(expr);
                    }
                }
            }
            if let Some(test) = &mut for_stmt.test {
                simplify_overwritten_pure_assignments_in_expr(test);
            }
            if let Some(update) = &mut for_stmt.update {
                simplify_overwritten_pure_assignments_in_expr(update);
            }
            simplify_overwritten_pure_assignments_in_stmt(&mut for_stmt.body);
        }
        Stmt::ForIn(for_in_stmt) => {
            simplify_overwritten_pure_assignments_in_expr(&mut for_in_stmt.right);
            simplify_overwritten_pure_assignments_in_stmt(&mut for_in_stmt.body);
        }
        Stmt::ForOf(for_of_stmt) => {
            simplify_overwritten_pure_assignments_in_expr(&mut for_of_stmt.right);
            simplify_overwritten_pure_assignments_in_stmt(&mut for_of_stmt.body);
        }
        Stmt::While(while_stmt) => {
            simplify_overwritten_pure_assignments_in_expr(&mut while_stmt.test);
            simplify_overwritten_pure_assignments_in_stmt(&mut while_stmt.body);
        }
        Stmt::DoWhile(do_while_stmt) => {
            simplify_overwritten_pure_assignments_in_stmt(&mut do_while_stmt.body);
            simplify_overwritten_pure_assignments_in_expr(&mut do_while_stmt.test);
        }
        Stmt::Try(try_stmt) => {
            simplify_overwritten_pure_assignments_in_stmts(&mut try_stmt.block.stmts);
            if let Some(handler) = &mut try_stmt.handler {
                simplify_overwritten_pure_assignments_in_stmts(&mut handler.body.stmts);
            }
            if let Some(finalizer) = &mut try_stmt.finalizer {
                simplify_overwritten_pure_assignments_in_stmts(&mut finalizer.stmts);
            }
        }
        _ => {}
    }
}

fn simplify_overwritten_pure_assignments_in_expr(expr: &mut Expr) {
    match expr {
        Expr::Paren(paren) => simplify_overwritten_pure_assignments_in_expr(&mut paren.expr),
        Expr::TsAs(ts_as) => simplify_overwritten_pure_assignments_in_expr(&mut ts_as.expr),
        Expr::TsTypeAssertion(type_assertion) => {
            simplify_overwritten_pure_assignments_in_expr(&mut type_assertion.expr)
        }
        Expr::TsNonNull(ts_non_null) => {
            simplify_overwritten_pure_assignments_in_expr(&mut ts_non_null.expr)
        }
        Expr::TsConstAssertion(ts_const) => {
            simplify_overwritten_pure_assignments_in_expr(&mut ts_const.expr)
        }
        Expr::TsInstantiation(ts_instantiation) => {
            simplify_overwritten_pure_assignments_in_expr(&mut ts_instantiation.expr)
        }
        Expr::TsSatisfies(ts_satisfies) => {
            simplify_overwritten_pure_assignments_in_expr(&mut ts_satisfies.expr)
        }
        Expr::Cond(cond) => {
            simplify_overwritten_pure_assignments_in_expr(&mut cond.test);
            simplify_overwritten_pure_assignments_in_expr(&mut cond.cons);
            simplify_overwritten_pure_assignments_in_expr(&mut cond.alt);
        }
        Expr::Seq(seq) => {
            for expr in &mut seq.exprs {
                simplify_overwritten_pure_assignments_in_expr(expr);
            }

            let original = std::mem::take(&mut seq.exprs);
            let mut needed = HashSet::<String>::new();
            let mut kept_rev = Vec::with_capacity(original.len());

            for expr in original.into_iter().rev() {
                if let Expr::Assign(assign) = unwrap_transparent_expr(expr.as_ref()) {
                    if assign.op == op!("=") {
                        if let Some(name) = assign_target_single_binding_name(&assign.left) {
                            if !needed.contains(&name) && expr_is_pure(&assign.right) {
                                continue;
                            }
                        }
                    }
                }

                update_needed_bindings_from_expr(&expr, &mut needed);
                kept_rev.push(expr);
            }

            kept_rev.reverse();
            seq.exprs = kept_rev;
        }
        Expr::Array(array) => {
            for elem in array.elems.iter_mut().flatten() {
                simplify_overwritten_pure_assignments_in_expr(&mut elem.expr);
            }
        }
        Expr::Object(object) => {
            for prop in &mut object.props {
                match prop {
                    swc_ecma_ast::PropOrSpread::Spread(spread) => {
                        simplify_overwritten_pure_assignments_in_expr(&mut spread.expr);
                    }
                    swc_ecma_ast::PropOrSpread::Prop(prop) => match &mut **prop {
                        swc_ecma_ast::Prop::Shorthand(_) => {}
                        swc_ecma_ast::Prop::KeyValue(key_value) => {
                            simplify_overwritten_pure_assignments_in_expr(&mut key_value.value);
                        }
                        swc_ecma_ast::Prop::Assign(assign) => {
                            simplify_overwritten_pure_assignments_in_expr(&mut assign.value);
                        }
                        swc_ecma_ast::Prop::Getter(getter) => {
                            if let Some(body) = &mut getter.body {
                                simplify_overwritten_pure_assignments_in_stmts(&mut body.stmts);
                            }
                        }
                        swc_ecma_ast::Prop::Setter(setter) => {
                            if let Some(body) = &mut setter.body {
                                simplify_overwritten_pure_assignments_in_stmts(&mut body.stmts);
                            }
                        }
                        swc_ecma_ast::Prop::Method(method) => {
                            if let Some(body) = &mut method.function.body {
                                simplify_overwritten_pure_assignments_in_stmts(&mut body.stmts);
                            }
                        }
                    },
                }
            }
        }
        Expr::Call(call) => {
            if let swc_ecma_ast::Callee::Expr(callee_expr) = &mut call.callee {
                simplify_overwritten_pure_assignments_in_expr(callee_expr);
            }
            for arg in &mut call.args {
                simplify_overwritten_pure_assignments_in_expr(&mut arg.expr);
            }
        }
        Expr::OptChain(opt_chain) => {
            simplify_overwritten_pure_assignments_in_opt_chain_base(&mut opt_chain.base);
        }
        Expr::Bin(bin) => {
            simplify_overwritten_pure_assignments_in_expr(&mut bin.left);
            simplify_overwritten_pure_assignments_in_expr(&mut bin.right);
        }
        Expr::Unary(unary) => simplify_overwritten_pure_assignments_in_expr(&mut unary.arg),
        Expr::Assign(assign) => {
            simplify_overwritten_pure_assignments_in_expr(&mut assign.right);
            if let AssignTarget::Simple(SimpleAssignTarget::Member(member)) = &mut assign.left {
                simplify_overwritten_pure_assignments_in_expr(&mut member.obj);
                if let swc_ecma_ast::MemberProp::Computed(computed) = &mut member.prop {
                    simplify_overwritten_pure_assignments_in_expr(&mut computed.expr);
                }
            }
        }
        Expr::Member(member) => {
            simplify_overwritten_pure_assignments_in_expr(&mut member.obj);
            if let swc_ecma_ast::MemberProp::Computed(computed) = &mut member.prop {
                simplify_overwritten_pure_assignments_in_expr(&mut computed.expr);
            }
        }
        Expr::New(new_expr) => {
            simplify_overwritten_pure_assignments_in_expr(&mut new_expr.callee);
            if let Some(args) = &mut new_expr.args {
                for arg in args {
                    simplify_overwritten_pure_assignments_in_expr(&mut arg.expr);
                }
            }
        }
        Expr::Await(await_expr) => {
            simplify_overwritten_pure_assignments_in_expr(&mut await_expr.arg)
        }
        Expr::Yield(yield_expr) => {
            if let Some(arg) = &mut yield_expr.arg {
                simplify_overwritten_pure_assignments_in_expr(arg);
            }
        }
        Expr::Tpl(tpl) => {
            for expr in &mut tpl.exprs {
                simplify_overwritten_pure_assignments_in_expr(expr);
            }
        }
        Expr::TaggedTpl(tagged_tpl) => {
            simplify_overwritten_pure_assignments_in_expr(&mut tagged_tpl.tag);
            for expr in &mut tagged_tpl.tpl.exprs {
                simplify_overwritten_pure_assignments_in_expr(expr);
            }
        }
        Expr::Fn(function) => {
            if let Some(body) = &mut function.function.body {
                simplify_overwritten_pure_assignments_in_stmts(&mut body.stmts);
            }
        }
        Expr::Arrow(arrow) => match &mut *arrow.body {
            swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) => {
                simplify_overwritten_pure_assignments_in_stmts(&mut block.stmts)
            }
            swc_ecma_ast::BlockStmtOrExpr::Expr(expr) => {
                simplify_overwritten_pure_assignments_in_expr(expr)
            }
        },
        Expr::Class(class_expr) => {
            if let Some(super_class) = &mut class_expr.class.super_class {
                simplify_overwritten_pure_assignments_in_expr(super_class);
            }
        }
        Expr::This(_)
        | Expr::Ident(_)
        | Expr::Lit(_)
        | Expr::MetaProp(_)
        | Expr::Update(_)
        | Expr::SuperProp(_)
        | Expr::PrivateName(_)
        | Expr::Invalid(_)
        | Expr::JSXMember(_)
        | Expr::JSXNamespacedName(_)
        | Expr::JSXEmpty(_)
        | Expr::JSXElement(_)
        | Expr::JSXFragment(_) => {}
    }
}

fn simplify_overwritten_pure_assignments_in_opt_chain_base(base: &mut swc_ecma_ast::OptChainBase) {
    match base {
        swc_ecma_ast::OptChainBase::Member(member) => {
            simplify_overwritten_pure_assignments_in_expr(&mut member.obj);
            if let swc_ecma_ast::MemberProp::Computed(computed) = &mut member.prop {
                simplify_overwritten_pure_assignments_in_expr(&mut computed.expr);
            }
        }
        swc_ecma_ast::OptChainBase::Call(call) => {
            simplify_overwritten_pure_assignments_in_expr(&mut call.callee);
            for arg in &mut call.args {
                simplify_overwritten_pure_assignments_in_expr(&mut arg.expr);
            }
        }
    }
}

fn assign_target_single_binding_name(target: &AssignTarget) -> Option<String> {
    if let Some(ident) = target.as_ident() {
        return Some(ident.id.sym.to_string());
    }
    let AssignTarget::Pat(assign_pat) = target else {
        return None;
    };
    let mut names = HashSet::new();
    collect_pat_names(&Pat::from(assign_pat.clone()), &mut names);
    if names.len() == 1 {
        return names.into_iter().next();
    }
    None
}

fn update_needed_bindings_from_expr(expr: &Expr, needed: &mut HashSet<String>) {
    if let Expr::Assign(assign) = unwrap_transparent_expr(expr) {
        if assign.op == op!("=") {
            if let Some(name) = assign_target_single_binding_name(&assign.left) {
                needed.remove(&name);
                collect_expr_reads(&assign.right, needed);
                return;
            }
        }
    }
    collect_expr_reads(expr, needed);
}

fn unwrap_transparent_expr(expr: &Expr) -> &Expr {
    match expr {
        Expr::Paren(paren) => unwrap_transparent_expr(&paren.expr),
        Expr::TsAs(ts_as) => unwrap_transparent_expr(&ts_as.expr),
        Expr::TsTypeAssertion(type_assertion) => unwrap_transparent_expr(&type_assertion.expr),
        Expr::TsNonNull(ts_non_null) => unwrap_transparent_expr(&ts_non_null.expr),
        Expr::TsConstAssertion(ts_const) => unwrap_transparent_expr(&ts_const.expr),
        Expr::TsInstantiation(ts_instantiation) => unwrap_transparent_expr(&ts_instantiation.expr),
        Expr::TsSatisfies(ts_satisfies) => unwrap_transparent_expr(&ts_satisfies.expr),
        _ => expr,
    }
}

fn prune_empty_statements(stmts: &mut Vec<Stmt>) {
    let mut pruned = Vec::with_capacity(stmts.len());
    for mut stmt in std::mem::take(stmts) {
        prune_empty_in_stmt(&mut stmt);
        if is_empty_stmt(&stmt) {
            continue;
        }
        pruned.push(stmt);
    }
    *stmts = pruned;
}

fn prune_empty_in_stmt(stmt: &mut Stmt) {
    match stmt {
        Stmt::Block(block) => {
            prune_empty_statements(&mut block.stmts);
        }
        Stmt::If(if_stmt) => {
            prune_empty_in_stmt(&mut if_stmt.cons);
            if let Some(alt) = &mut if_stmt.alt {
                prune_empty_in_stmt(alt);
                if is_empty_stmt(alt) {
                    if_stmt.alt = None;
                }
            }
        }
        Stmt::Switch(switch_stmt) => {
            for case in &mut switch_stmt.cases {
                prune_empty_statements(&mut case.cons);
            }
        }
        Stmt::Labeled(labeled) => {
            prune_empty_in_stmt(&mut labeled.body);
            if is_empty_stmt(&labeled.body) {
                *stmt = Stmt::Empty(swc_ecma_ast::EmptyStmt { span: DUMMY_SP });
            }
        }
        Stmt::For(for_stmt) => {
            prune_empty_in_stmt(&mut for_stmt.body);
        }
        Stmt::ForIn(for_in_stmt) => {
            prune_empty_in_stmt(&mut for_in_stmt.body);
        }
        Stmt::ForOf(for_of_stmt) => {
            prune_empty_in_stmt(&mut for_of_stmt.body);
        }
        Stmt::While(while_stmt) => {
            prune_empty_in_stmt(&mut while_stmt.body);
        }
        Stmt::DoWhile(do_while_stmt) => {
            prune_empty_in_stmt(&mut do_while_stmt.body);
        }
        Stmt::Try(try_stmt) => {
            prune_empty_statements(&mut try_stmt.block.stmts);
            if let Some(handler) = &mut try_stmt.handler {
                prune_empty_statements(&mut handler.body.stmts);
            }
            if let Some(finalizer) = &mut try_stmt.finalizer {
                prune_empty_statements(&mut finalizer.stmts);
            }
        }
        _ => {}
    }
}

fn is_empty_stmt(stmt: &Stmt) -> bool {
    matches!(stmt, Stmt::Empty(_)) || matches!(stmt, Stmt::Block(block) if block.stmts.is_empty())
}
