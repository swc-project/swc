use std::collections::{HashMap, HashSet};

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
    let mut original = Vec::new();
    std::mem::swap(&mut body.stmts, &mut original);

    let mut live = HashSet::<String>::new();
    let mut kept_rev = Vec::with_capacity(original.len());

    for mut stmt in original.into_iter().rev() {
        if keep_statement(&mut stmt, &mut live, &function_captures) {
            kept_rev.push(stmt);
        }
    }

    kept_rev.reverse();
    body.stmts = kept_rev;

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
}

fn keep_statement(
    stmt: &mut Stmt,
    live: &mut HashSet<String>,
    function_captures: &HashMap<String, HashSet<String>>,
) -> bool {
    match stmt {
        Stmt::Return(return_stmt) => {
            if let Some(arg) = &return_stmt.arg {
                collect_expr_reads(arg, live);
            }
            true
        }
        Stmt::Decl(Decl::Var(var_decl)) => keep_var_decl(var_decl, live),
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
        other => {
            collect_stmt_reads(other, live);
            true
        }
    }
}

fn keep_var_decl(var_decl: &mut VarDecl, live: &mut HashSet<String>) -> bool {
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

    let insert_index = stmts
        .iter()
        .take_while(|stmt| matches!(stmt, Stmt::Expr(expr_stmt) if matches!(&*expr_stmt.expr, Expr::Lit(Lit::Str(_)))))
        .count();
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
