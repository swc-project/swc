use std::collections::{HashMap, HashSet};

use swc_ecma_ast::{AssignTarget, Expr, Pat, Stmt};

use crate::hir::HirFunction;

/// Converts HIR into SSA form.
pub fn enter_ssa(hir: &mut HirFunction) {
    if hir.metadata.declared_bindings.is_empty() {
        hir.recompute_metadata();
    }

    let mut versions = HashMap::<String, u32>::new();
    for binding in &hir.metadata.declared_bindings {
        versions.insert(binding.clone(), 0);
    }
    let mut phi_candidates = HashMap::<String, Vec<u32>>::new();

    fn bump(versions: &mut HashMap<String, u32>, name: &str) -> u32 {
        let entry = versions.entry(name.to_string()).or_insert(0);
        *entry += 1;
        *entry
    }

    fn assign_target_name(target: &AssignTarget) -> Option<String> {
        match target {
            AssignTarget::Simple(swc_ecma_ast::SimpleAssignTarget::Ident(binding)) => {
                Some(binding.id.sym.to_string())
            }
            _ => None,
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

    fn walk_stmt(
        stmt: &Stmt,
        versions: &mut HashMap<String, u32>,
        phi_candidates: &mut HashMap<String, Vec<u32>>,
    ) {
        match stmt {
            Stmt::Decl(swc_ecma_ast::Decl::Var(var_decl)) => {
                for decl in &var_decl.decls {
                    if decl.init.is_none() {
                        continue;
                    }
                    let mut names = HashSet::new();
                    collect_pat_names(&decl.name, &mut names);
                    for name in names {
                        let version = bump(versions, name.as_str());
                        phi_candidates.entry(name).or_default().push(version);
                    }
                }
            }
            Stmt::Expr(expr_stmt) => match &*expr_stmt.expr {
                Expr::Assign(assign) => {
                    if let Some(name) = assign_target_name(&assign.left) {
                        let version = bump(versions, name.as_str());
                        phi_candidates.entry(name).or_default().push(version);
                    }
                }
                Expr::Update(update) => {
                    if let Expr::Ident(ident) = &*update.arg {
                        let name = ident.sym.to_string();
                        let version = bump(versions, name.as_str());
                        phi_candidates.entry(name).or_default().push(version);
                    }
                }
                _ => {}
            },
            Stmt::If(if_stmt) => {
                let mut cons_versions = versions.clone();
                walk_stmt(&if_stmt.cons, &mut cons_versions, phi_candidates);

                let mut alt_versions = versions.clone();
                if let Some(alt) = &if_stmt.alt {
                    walk_stmt(alt, &mut alt_versions, phi_candidates);
                }

                let names = cons_versions
                    .keys()
                    .chain(alt_versions.keys())
                    .cloned()
                    .collect::<HashSet<_>>();
                for name in names {
                    let cons = *cons_versions.get(&name).unwrap_or(&0);
                    let alt = *alt_versions.get(&name).unwrap_or(&0);
                    if cons != alt {
                        phi_candidates.entry(name.clone()).or_default().push(cons);
                        phi_candidates.entry(name.clone()).or_default().push(alt);
                    }
                    versions.insert(name, cons.max(alt));
                }
            }
            Stmt::Block(block) => {
                for nested in &block.stmts {
                    walk_stmt(nested, versions, phi_candidates);
                }
            }
            Stmt::Switch(switch_stmt) => {
                let mut merged = versions.clone();
                for case in &switch_stmt.cases {
                    let mut case_versions = versions.clone();
                    for nested in &case.cons {
                        walk_stmt(nested, &mut case_versions, phi_candidates);
                    }
                    for (name, version) in case_versions {
                        merged
                            .entry(name)
                            .and_modify(|entry| *entry = (*entry).max(version))
                            .or_insert(version);
                    }
                }
                *versions = merged;
            }
            Stmt::For(for_stmt) => {
                if let Some(init) = &for_stmt.init {
                    match init {
                        swc_ecma_ast::VarDeclOrExpr::VarDecl(var_decl) => {
                            for decl in &var_decl.decls {
                                if decl.init.is_none() {
                                    continue;
                                }
                                let mut names = HashSet::new();
                                collect_pat_names(&decl.name, &mut names);
                                for name in names {
                                    let version = bump(versions, name.as_str());
                                    phi_candidates.entry(name).or_default().push(version);
                                }
                            }
                        }
                        swc_ecma_ast::VarDeclOrExpr::Expr(expr) => {
                            if let Expr::Assign(assign) = &**expr {
                                if let Some(name) = assign_target_name(&assign.left) {
                                    let version = bump(versions, name.as_str());
                                    phi_candidates.entry(name).or_default().push(version);
                                }
                            }
                        }
                    }
                }
                walk_stmt(&for_stmt.body, versions, phi_candidates);
            }
            Stmt::ForIn(for_in_stmt) => walk_stmt(&for_in_stmt.body, versions, phi_candidates),
            Stmt::ForOf(for_of_stmt) => walk_stmt(&for_of_stmt.body, versions, phi_candidates),
            Stmt::While(while_stmt) => walk_stmt(&while_stmt.body, versions, phi_candidates),
            Stmt::DoWhile(do_while_stmt) => {
                walk_stmt(&do_while_stmt.body, versions, phi_candidates);
            }
            Stmt::Try(try_stmt) => {
                for nested in &try_stmt.block.stmts {
                    walk_stmt(nested, versions, phi_candidates);
                }
                if let Some(handler) = &try_stmt.handler {
                    for nested in &handler.body.stmts {
                        walk_stmt(nested, versions, phi_candidates);
                    }
                }
                if let Some(finalizer) = &try_stmt.finalizer {
                    for nested in &finalizer.stmts {
                        walk_stmt(nested, versions, phi_candidates);
                    }
                }
            }
            _ => {}
        }
    }

    if let Some(body) = &hir.function.body {
        for stmt in &body.stmts {
            walk_stmt(stmt, &mut versions, &mut phi_candidates);
        }
    }

    hir.metadata.ssa_versions = versions;
    hir.metadata.phi_candidates = phi_candidates;
}
