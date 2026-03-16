use std::collections::{HashMap, HashSet};

use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    op, ArrowExpr, AssignExpr, AssignTarget, BindingIdent, BlockStmt, CallExpr, Callee,
    ComputedPropName, Decl, Expr, ExprOrSpread, ExprStmt, Function, Ident, IfStmt, LabeledStmt,
    Lit, MemberExpr, MemberProp, Number, Pat, Stmt, VarDecl, VarDeclKind, VarDeclarator,
};
use swc_ecma_visit::{Visit, VisitMut, VisitMutWith, VisitWith};

use crate::{
    hir::HirFunction,
    transform::ReactFunctionType,
    utils::{directive_from_stmt, is_hook_name},
};

/// Generated outlined function.
#[derive(Debug, Clone)]
pub struct OutlinedFunction {
    pub function: CodegenFunction,
    pub kind: Option<ReactFunctionType>,
}

/// Final codegen payload for one compiled function.
#[derive(Debug, Clone)]
pub struct CodegenFunction {
    pub id: Option<Ident>,
    pub params: Vec<Pat>,
    pub body: BlockStmt,
    pub is_async: bool,
    pub is_generator: bool,
    pub memo_slots_used: u32,
    pub memo_blocks: u32,
    pub memo_values: u32,
    pub pruned_memo_blocks: u32,
    pub pruned_memo_values: u32,
    pub outlined: Vec<OutlinedFunction>,
}

/// Reactive function IR placeholder.
#[derive(Debug, Clone)]
pub struct ReactiveFunction {
    pub id: Option<Ident>,
    pub params: Vec<Pat>,
    pub body: BlockStmt,
    pub is_async: bool,
    pub is_generator: bool,
    pub fn_type: ReactFunctionType,
}

#[derive(Clone)]
struct ReactiveDependency {
    key: String,
    expr: Box<Expr>,
}

pub fn build_reactive_function(hir: &HirFunction) -> ReactiveFunction {
    function_to_reactive(&hir.function, hir.id.clone(), hir.fn_type)
}

pub fn codegen_function(mut reactive: ReactiveFunction) -> CodegenFunction {
    let outlined = outline_eligible_function_bindings(&mut reactive);
    let (memo_slots_used, memo_blocks, memo_values, pruned_memo_blocks, pruned_memo_values) =
        memoize_reactive_function(&mut reactive);

    CodegenFunction {
        id: reactive.id,
        params: reactive.params,
        body: reactive.body,
        is_async: reactive.is_async,
        is_generator: reactive.is_generator,
        memo_slots_used,
        memo_blocks,
        memo_values,
        pruned_memo_blocks,
        pruned_memo_values,
        outlined,
    }
}

fn function_to_reactive(
    function: &Function,
    id: Option<Ident>,
    fn_type: ReactFunctionType,
) -> ReactiveFunction {
    ReactiveFunction {
        id,
        params: function
            .params
            .iter()
            .map(|param| param.pat.clone())
            .collect(),
        body: function.body.clone().unwrap_or_default(),
        is_async: function.is_async,
        is_generator: function.is_generator,
        fn_type,
    }
}

fn outline_eligible_function_bindings(reactive: &mut ReactiveFunction) -> Vec<OutlinedFunction> {
    let mut outer_bindings = HashSet::new();
    for pat in &reactive.params {
        collect_pattern_bindings(pat, &mut outer_bindings);
    }
    for stmt in &reactive.body.stmts {
        collect_stmt_bindings(stmt, &mut outer_bindings);
    }

    let mut used_names = outer_bindings.clone();
    let mut outlined = Vec::new();

    let mut outlined_aliases = Vec::new();
    for (stmt_index, stmt) in reactive.body.stmts.iter_mut().enumerate() {
        let Stmt::Decl(Decl::Var(var_decl)) = stmt else {
            continue;
        };
        let [decl] = var_decl.decls.as_mut_slice() else {
            continue;
        };
        let Pat::Ident(binding) = &decl.name else {
            continue;
        };
        let Some(init) = &mut decl.init else {
            continue;
        };

        let (params, mut body, is_async, is_generator, captures_outer) = match &mut **init {
            Expr::Arrow(arrow) => {
                let body = match &*arrow.body {
                    swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) => block.clone(),
                    swc_ecma_ast::BlockStmtOrExpr::Expr(expr) => BlockStmt {
                        span: DUMMY_SP,
                        ctxt: Default::default(),
                        stmts: vec![Stmt::Return(swc_ecma_ast::ReturnStmt {
                            span: DUMMY_SP,
                            arg: Some(expr.clone()),
                        })],
                    },
                };

                let captures = arrow_captures_outer_bindings(arrow, &outer_bindings);
                (
                    arrow.params.clone(),
                    body,
                    arrow.is_async,
                    arrow.is_generator,
                    captures,
                )
            }
            Expr::Fn(fn_expr) => {
                let function = &fn_expr.function;
                let body = function.body.clone().unwrap_or_default();
                let captures = function_captures_outer_bindings(function, &outer_bindings);
                (
                    function
                        .params
                        .iter()
                        .map(|param| param.pat.clone())
                        .collect::<Vec<_>>(),
                    body,
                    function.is_async,
                    function.is_generator,
                    captures,
                )
            }
            Expr::Call(call) => {
                let Callee::Expr(callee_expr) = &call.callee else {
                    continue;
                };
                let Expr::Ident(callee) = &**callee_expr else {
                    continue;
                };
                if callee.sym != "useCallback" {
                    continue;
                }
                let [callback_arg, deps_arg] = call.args.as_slice() else {
                    continue;
                };
                if callback_arg.spread.is_some() || deps_arg.spread.is_some() {
                    continue;
                }
                let Expr::Array(deps) = &*deps_arg.expr else {
                    continue;
                };
                if !deps.elems.is_empty() {
                    continue;
                }

                match &*callback_arg.expr {
                    Expr::Arrow(arrow) => {
                        let body = match &*arrow.body {
                            swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) => block.clone(),
                            swc_ecma_ast::BlockStmtOrExpr::Expr(expr) => BlockStmt {
                                span: DUMMY_SP,
                                ctxt: Default::default(),
                                stmts: vec![Stmt::Return(swc_ecma_ast::ReturnStmt {
                                    span: DUMMY_SP,
                                    arg: Some(expr.clone()),
                                })],
                            },
                        };
                        let captures = arrow_captures_outer_bindings(arrow, &outer_bindings);
                        (
                            arrow.params.clone(),
                            body,
                            arrow.is_async,
                            arrow.is_generator,
                            captures,
                        )
                    }
                    Expr::Fn(fn_expr) => {
                        let function = &fn_expr.function;
                        let body = function.body.clone().unwrap_or_default();
                        let captures = function_captures_outer_bindings(function, &outer_bindings);
                        (
                            function
                                .params
                                .iter()
                                .map(|param| param.pat.clone())
                                .collect::<Vec<_>>(),
                            body,
                            function.is_async,
                            function.is_generator,
                            captures,
                        )
                    }
                    _ => continue,
                }
            }
            _ => continue,
        };

        if captures_outer {
            continue;
        }
        prune_unused_function_like_decls(&mut body);

        let outlined_id = fresh_ident("_temp", &mut used_names);
        outlined.push(OutlinedFunction {
            function: CodegenFunction {
                id: Some(outlined_id.clone()),
                params,
                body,
                is_async,
                is_generator,
                memo_slots_used: 0,
                memo_blocks: 0,
                memo_values: 0,
                pruned_memo_blocks: 0,
                pruned_memo_values: 0,
                outlined: Vec::new(),
            },
            kind: None,
        });

        decl.init = Some(Box::new(Expr::Ident(outlined_id)));
        outlined_aliases.push((stmt_index, binding.id.sym.to_string()));
        // Keep aliases to outlined bindings stable so return memoization can avoid
        // introducing unnecessary dependency slots.
        used_names.insert(binding.id.sym.to_string());
    }

    for stmt in &mut reactive.body.stmts {
        let Stmt::Expr(expr_stmt) = stmt else {
            continue;
        };
        let Expr::Call(call) = &mut *expr_stmt.expr else {
            continue;
        };
        let Callee::Expr(callee_expr) = &call.callee else {
            continue;
        };
        let Expr::Ident(callee) = &**callee_expr else {
            continue;
        };
        if callee.sym != "useEffect" {
            continue;
        }
        let [callback_arg, deps_arg] = call.args.as_mut_slice() else {
            continue;
        };
        if callback_arg.spread.is_some() || deps_arg.spread.is_some() {
            continue;
        }
        let Expr::Array(deps) = &*deps_arg.expr else {
            continue;
        };
        if !deps.elems.is_empty() {
            continue;
        }

        let (params, mut body, is_async, is_generator, captures_outer) = match &*callback_arg.expr {
            Expr::Arrow(arrow) => {
                let body = match &*arrow.body {
                    swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) => block.clone(),
                    swc_ecma_ast::BlockStmtOrExpr::Expr(expr) => BlockStmt {
                        span: DUMMY_SP,
                        ctxt: Default::default(),
                        stmts: vec![Stmt::Return(swc_ecma_ast::ReturnStmt {
                            span: DUMMY_SP,
                            arg: Some(expr.clone()),
                        })],
                    },
                };
                let captures = arrow_captures_outer_bindings(arrow, &outer_bindings);
                (
                    arrow.params.clone(),
                    body,
                    arrow.is_async,
                    arrow.is_generator,
                    captures,
                )
            }
            Expr::Fn(fn_expr) => {
                let function = &fn_expr.function;
                let body = function.body.clone().unwrap_or_default();
                let captures = function_captures_outer_bindings(function, &outer_bindings);
                (
                    function
                        .params
                        .iter()
                        .map(|param| param.pat.clone())
                        .collect::<Vec<_>>(),
                    body,
                    function.is_async,
                    function.is_generator,
                    captures,
                )
            }
            _ => continue,
        };
        if captures_outer {
            continue;
        }
        prune_unused_function_like_decls(&mut body);

        let outlined_id = fresh_ident("_temp", &mut used_names);
        outlined.push(OutlinedFunction {
            function: CodegenFunction {
                id: Some(outlined_id.clone()),
                params,
                body,
                is_async,
                is_generator,
                memo_slots_used: 0,
                memo_blocks: 0,
                memo_values: 0,
                pruned_memo_blocks: 0,
                pruned_memo_values: 0,
                outlined: Vec::new(),
            },
            kind: None,
        });
        callback_arg.expr = Box::new(Expr::Ident(outlined_id));
    }

    for (stmt_index, binding_name) in outlined_aliases.into_iter().rev() {
        if binding_referenced_in_stmts(&reactive.body.stmts[stmt_index + 1..], &binding_name) {
            continue;
        }

        if matches!(
            reactive.body.stmts.get(stmt_index),
            Some(Stmt::Decl(Decl::Var(var_decl)))
                if matches!(
                    var_decl.decls.as_slice(),
                    [VarDeclarator { name: Pat::Ident(BindingIdent { id, .. }), .. }]
                        if id.sym == binding_name
                )
        ) {
            reactive.body.stmts.remove(stmt_index);
        }
    }

    outlined
}

fn binding_referenced_in_stmts(stmts: &[Stmt], name: &str) -> bool {
    struct Finder<'a> {
        name: &'a str,
        found: bool,
    }

    impl Visit for Finder<'_> {
        fn visit_ident(&mut self, ident: &Ident) {
            if ident.sym == self.name {
                self.found = true;
            }
        }
    }

    let mut finder = Finder { name, found: false };
    for stmt in stmts {
        stmt.visit_with(&mut finder);
        if finder.found {
            return true;
        }
    }
    false
}

fn prune_unused_function_like_decls(body: &mut BlockStmt) {
    let mut index = 0usize;
    while index < body.stmts.len() {
        let remove = matches!(
            body.stmts.get(index),
            Some(Stmt::Decl(Decl::Var(var_decl)))
                if matches!(
                    var_decl.decls.as_slice(),
                    [VarDeclarator {
                        name: Pat::Ident(BindingIdent { id, .. }),
                        init: Some(init),
                        ..
                    }] if matches!(&**init, Expr::Arrow(_) | Expr::Fn(_))
                        && !binding_referenced_in_stmts(&body.stmts[index + 1..], id.sym.as_ref())
                )
        );

        if remove {
            body.stmts.remove(index);
        } else {
            index += 1;
        }
    }
}

fn arrow_captures_outer_bindings(arrow: &ArrowExpr, outer_bindings: &HashSet<String>) -> bool {
    struct CaptureFinder<'a> {
        outer_bindings: &'a HashSet<String>,
        local_bindings: HashSet<String>,
        captures: bool,
    }

    impl Visit for CaptureFinder<'_> {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_ident(&mut self, ident: &Ident) {
            let name = ident.sym.as_ref();
            if self.local_bindings.contains(name) {
                return;
            }
            if self.outer_bindings.contains(name) {
                self.captures = true;
            }
        }
    }

    let mut finder = CaptureFinder {
        outer_bindings,
        local_bindings: HashSet::new(),
        captures: false,
    };
    for param in &arrow.params {
        collect_pattern_bindings(param, &mut finder.local_bindings);
    }
    match &*arrow.body {
        swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) => {
            for stmt in &block.stmts {
                collect_stmt_bindings(stmt, &mut finder.local_bindings);
            }
            block.visit_with(&mut finder);
        }
        swc_ecma_ast::BlockStmtOrExpr::Expr(expr) => {
            expr.visit_with(&mut finder);
        }
    }
    finder.captures
}

fn function_captures_outer_bindings(function: &Function, outer_bindings: &HashSet<String>) -> bool {
    struct CaptureFinder<'a> {
        outer_bindings: &'a HashSet<String>,
        local_bindings: HashSet<String>,
        captures: bool,
    }

    impl Visit for CaptureFinder<'_> {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_ident(&mut self, ident: &Ident) {
            let name = ident.sym.as_ref();
            if self.local_bindings.contains(name) {
                return;
            }
            if self.outer_bindings.contains(name) {
                self.captures = true;
            }
        }
    }

    let mut finder = CaptureFinder {
        outer_bindings,
        local_bindings: HashSet::new(),
        captures: false,
    };
    for param in &function.params {
        collect_pattern_bindings(&param.pat, &mut finder.local_bindings);
    }
    if let Some(body) = &function.body {
        for stmt in &body.stmts {
            collect_stmt_bindings(stmt, &mut finder.local_bindings);
        }
        body.visit_with(&mut finder);
    }
    finder.captures
}

fn memoize_reactive_function(reactive: &mut ReactiveFunction) -> (u32, u32, u32, u32, u32) {
    if !matches!(
        reactive.fn_type,
        ReactFunctionType::Component | ReactFunctionType::Hook
    ) {
        return (0, 0, 0, 0, 0);
    }

    if reactive.body.stmts.is_empty() {
        return (0, 0, 0, 0, 0);
    }

    let mut reserved = HashSet::new();
    for pat in &reactive.params {
        collect_pattern_bindings(pat, &mut reserved);
    }
    for stmt in &reactive.body.stmts {
        collect_stmt_bindings(stmt, &mut reserved);
    }

    let mut known_bindings = HashMap::<String, bool>::new();
    let mut next_temp = 0u32;
    let param_prologue = rewrite_non_ident_params(
        &mut reactive.params,
        &mut reserved,
        &mut next_temp,
        &mut known_bindings,
    );
    let mut declared_bindings = HashSet::new();
    for stmt in &reactive.body.stmts {
        collect_stmt_bindings(stmt, &mut declared_bindings);
    }
    for name in declared_bindings {
        known_bindings
            .entry(name.clone())
            .or_insert_with(|| is_ref_like_binding_name(&name));
    }

    let cache_ident = if !reserved.contains("$") {
        reserved.insert("$".to_string());
        Ident::new_no_ctxt("$".into(), DUMMY_SP)
    } else {
        fresh_ident("$", &mut reserved)
    };

    let mut next_slot = 0u32;
    let mut memo_blocks = 0u32;
    let mut memo_values = 0u32;
    let mut pending_prefix_stmts = Vec::new();

    let mut stmts = std::mem::take(&mut reactive.body.stmts);
    let directive_end = stmts
        .iter()
        .take_while(|stmt| directive_from_stmt(stmt).is_some())
        .count();

    let mut transformed = Vec::new();
    transformed.extend(stmts.drain(..directive_end));
    transformed.extend(param_prologue);
    inline_use_memo_empty_deps_returns(&mut stmts);
    inline_use_callback_empty_deps_decls(&mut stmts);

    if !matches!(stmts.last(), Some(Stmt::Return(return_stmt)) if return_stmt.arg.is_some()) {
        let can_memoize_try_tail = matches!(
            stmts.as_slice(),
            [Stmt::Try(try_stmt)]
                if try_stmt.finalizer.is_none()
                    && matches!(
                        try_stmt.block.stmts.last(),
                        Some(Stmt::Return(return_stmt)) if return_stmt.arg.is_some()
                    )
        );
        if !can_memoize_try_tail {
            transformed.extend(stmts);
            reactive.body.stmts = transformed;
            return (0, 0, 0, 0, 0);
        }
    }

    let mut prefix_index = 0usize;
    while prefix_index < stmts.len().saturating_sub(1) {
        let Some((binding, init)) = extract_memoizable_single_decl(&stmts[prefix_index]) else {
            if let Stmt::Decl(Decl::Var(var_decl)) = &stmts[prefix_index] {
                transformed.extend(std::mem::take(&mut pending_prefix_stmts));
                transformed.push(stmts[prefix_index].clone());
                for decl in &var_decl.decls {
                    for name in collect_pattern_binding_names(&decl.name) {
                        known_bindings
                            .entry(name.clone())
                            .or_insert_with(|| is_ref_like_binding_name(&name));
                    }
                }
                prefix_index += 1;
                continue;
            }

            break;
        };
        let mut init = init;
        if pending_prefix_stmts.is_empty()
            && matches!(&*init, Expr::Arrow(_) | Expr::Fn(_))
            && next_stmt_function_decl_captures_binding(&stmts, prefix_index, binding.sym.as_ref())
        {
            pending_prefix_stmts.push(stmts[prefix_index].clone());
            known_bindings.insert(binding.sym.to_string(), true);
            prefix_index += 1;
            continue;
        }
        if expr_contains_hook_call(&init) {
            transformed.extend(std::mem::take(&mut pending_prefix_stmts));
            transformed.push(stmts[prefix_index].clone());
            known_bindings.insert(
                binding.sym.to_string(),
                is_ref_like_binding_name(binding.sym.as_ref()),
            );
            prefix_index += 1;
            continue;
        }
        if let Expr::Ident(init_ident) = &*init {
            transformed.extend(std::mem::take(&mut pending_prefix_stmts));
            transformed.push(stmts[prefix_index].clone());
            let stable = known_bindings
                .get(init_ident.sym.as_ref())
                .copied()
                .unwrap_or(true);
            known_bindings.insert(binding.sym.to_string(), stable);
            prefix_index += 1;
            continue;
        }
        if matches!(&*init, Expr::Arrow(_) | Expr::Fn(_))
            && binding_only_used_in_terminal_return(
                &stmts[prefix_index + 1..],
                binding.sym.as_ref(),
            )
        {
            break;
        }
        if expr_contains_ref_like_identifier(&init)
            && !matches!(&*init, Expr::Arrow(_) | Expr::Fn(_))
        {
            transformed.extend(std::mem::take(&mut pending_prefix_stmts));
            transformed.push(stmts[prefix_index].clone());
            known_bindings.insert(binding.sym.to_string(), true);
            prefix_index += 1;
            continue;
        }

        maybe_extract_single_call_arg_to_temp(
            &mut init,
            &mut transformed,
            &mut known_bindings,
            &mut reserved,
            &mut next_temp,
        );

        if contains_direct_call(&stmts[prefix_index + 1..])
            || contains_complex_assignment(&stmts[prefix_index + 1..])
        {
            break;
        }

        let deps = if matches!(&*init, Expr::Arrow(_) | Expr::Fn(_)) {
            collect_function_capture_dependencies(&init, &known_bindings)
        } else {
            let local = HashSet::new();
            collect_dependencies_from_expr(&init, &known_bindings, &local)
        };
        let reassigned_after =
            binding_reassigned_after(&stmts[prefix_index + 1..], binding.sym.as_ref());
        let mutated_after =
            binding_mutated_via_member_call_after(&stmts[prefix_index + 1..], binding.sym.as_ref());
        if mutated_after && !reassigned_after {
            break;
        }
        let temp = fresh_temp_ident(&mut next_temp, &mut reserved);
        let value_slot = next_slot + deps.len() as u32;
        let mut compute_stmts = std::mem::take(&mut pending_prefix_stmts);
        compute_stmts.push(assign_stmt(
            AssignTarget::from(temp.clone()),
            Box::new((*init).clone()),
        ));
        strip_runtime_call_type_args_in_stmts(&mut compute_stmts);

        transformed.extend(build_memoized_block(
            &cache_ident,
            next_slot,
            &deps,
            &temp,
            std::mem::take(&mut compute_stmts),
            true,
        ));
        transformed.push(make_var_decl(
            if reassigned_after {
                VarDeclKind::Let
            } else {
                VarDeclKind::Const
            },
            Pat::Ident(BindingIdent {
                id: binding.clone(),
                type_ann: None,
            }),
            Some(Box::new(Expr::Ident(temp))),
        ));

        next_slot = value_slot + 1;
        memo_blocks += 1;
        memo_values += 1;
        known_bindings.insert(binding.sym.to_string(), deps.is_empty());
        prefix_index += 1;
    }
    transformed.extend(pending_prefix_stmts);

    let mut tail = stmts[prefix_index..].to_vec();
    while !tail.is_empty() && is_ref_lazy_initialization_stmt(&tail[0]) {
        transformed.push(tail.remove(0));
    }
    if !tail.is_empty() {
        if let Some(return_expr) = tail.last().and_then(|stmt| match stmt {
            Stmt::Return(return_stmt) => return_stmt.arg.clone(),
            _ => None,
        }) {
            tail.pop();
            let mut return_expr = return_expr;
            maybe_split_single_element_array_return(
                &mut return_expr,
                &mut transformed,
                &cache_ident,
                &mut known_bindings,
                &mut reserved,
                &mut next_temp,
                &mut next_slot,
                &mut memo_blocks,
                &mut memo_values,
            );
            if contains_hook_call_stmt(&tail) {
                let mut lowered_tail = Vec::new();
                for stmt in std::mem::take(&mut tail) {
                    lowered_tail.extend(lower_hook_call_stmt_with_memoized_args(
                        stmt,
                        &cache_ident,
                        &mut next_slot,
                        &mut memo_blocks,
                        &mut memo_values,
                        &mut reserved,
                        &mut next_temp,
                    ));
                }
                transformed.extend(lowered_tail);
            }
            hoist_string_calls_from_jsx_return(
                &mut return_expr,
                &mut transformed,
                &mut known_bindings,
                &mut reserved,
                &mut next_temp,
                &cache_ident,
                &mut next_slot,
                &mut memo_blocks,
                &mut memo_values,
            );
            let mut return_as_const = false;
            if let Expr::TsConstAssertion(const_assert) = &*return_expr {
                return_as_const = true;
                return_expr = const_assert.expr.clone();
            }
            let mut const_result_alias = None;
            if let Expr::Ident(result) = &*return_expr {
                if let Some(init_expr) =
                    extract_const_decl_initializer(&mut tail, result.sym.as_ref())
                {
                    const_result_alias = Some(result.clone());
                    return_expr = init_expr;
                }
            }
            if let Expr::Ident(existing) = &*return_expr {
                if tail.is_empty() && binding_declared_in_stmts(&transformed, existing.sym.as_ref())
                {
                    transformed.push(Stmt::Return(swc_ecma_ast::ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(wrap_with_ts_const_assertion(
                            Expr::Ident(existing.clone()),
                            return_as_const,
                        )),
                    }));
                    // The return value is already provided by an existing binding.
                    // Emitting another memo block would only create a redundant cache entry.
                    tail = Vec::new();
                }
            }
            if tail.is_empty()
                && matches!(&*return_expr, Expr::Ident(existing) if binding_declared_in_stmts(&transformed, existing.sym.as_ref()))
            {
                // Already handled via direct return above.
            } else {
                let mut result_ident = None;
                if let Expr::Ident(result) = &*return_expr {
                    result_ident = Some(result.clone());
                    if rewrite_result_binding_to_assignment(&mut tail, result.sym.as_ref()) {
                        result_ident = Some(result.clone());
                    }
                }
                if let Some(result_ident) = &result_ident {
                    prune_redundant_result_preinit(&mut tail, result_ident);
                }

                prune_empty_stmts(&mut tail);
                prune_noop_identifier_exprs(&mut tail);
                promote_immutable_lets_to_const(&mut tail);
                normalize_static_string_members_in_stmts(&mut tail);
                normalize_reactive_labels(&mut tail);
                normalize_if_break_blocks(&mut tail);

                let temp = result_ident
                    .clone()
                    .unwrap_or_else(|| fresh_temp_ident(&mut next_temp, &mut reserved));
                let declare_temp = !binding_declared_in_stmts(&transformed, temp.sym.as_ref())
                    && !binding_declared_in_stmts(&tail, temp.sym.as_ref());

                let mut compute_stmts = tail;
                let should_assign_result =
                    !matches!(&*return_expr, Expr::Ident(ident) if ident.sym == temp.sym);
                if should_assign_result {
                    compute_stmts.push(assign_stmt(AssignTarget::from(temp.clone()), return_expr));
                }
                inline_trivial_iifes_in_stmts(&mut compute_stmts);
                strip_runtime_call_type_args_in_stmts(&mut compute_stmts);

                let mut local_bindings = HashSet::new();
                for stmt in &compute_stmts {
                    collect_stmt_bindings(stmt, &mut local_bindings);
                }
                let mut deps = collect_dependencies_from_stmts(
                    &compute_stmts,
                    &known_bindings,
                    &local_bindings,
                );
                let called_fn_deps = collect_called_local_function_capture_dependencies(
                    &compute_stmts,
                    &known_bindings,
                );
                for dep in called_fn_deps {
                    if !deps.iter().any(|existing| existing.key == dep.key) {
                        deps.push(dep);
                    }
                }
                deps = reduce_dependencies(deps);
                if let Some(result_ident) = &result_ident {
                    deps.retain(|dep| {
                        dep.key != result_ident.sym.as_ref()
                            && !dep
                                .key
                                .starts_with(&format!("{}.", result_ident.sym.as_ref()))
                    });
                }

                let label = Ident::new_no_ctxt("bb0".into(), DUMMY_SP);
                let (mut rewritten_stmts, has_early_return, sentinel) =
                    if contains_return_stmt_in_stmts(&compute_stmts) {
                        let sentinel = fresh_temp_ident(&mut next_temp, &mut reserved);
                        let (rewritten_stmts, has_early_return) =
                            rewrite_returns_for_labeled_block(compute_stmts, &label, &sentinel);
                        (rewritten_stmts, has_early_return, Some(sentinel))
                    } else {
                        (compute_stmts, false, None)
                    };
                let nested_slot_start = if has_early_return {
                    next_slot + deps.len() as u32 + 2
                } else {
                    next_slot + deps.len() as u32 + 1
                };
                let (nested_slots, nested_blocks, nested_values) =
                    inject_nested_call_memoization_into_stmts(
                        &mut rewritten_stmts,
                        &cache_ident,
                        nested_slot_start,
                        &mut reserved,
                        &mut next_temp,
                    );
                if has_early_return {
                    let sentinel = sentinel.expect("has_early_return implies sentinel");
                    let mut lowered_stmts = rewritten_stmts;
                    prune_redundant_result_preinit(&mut lowered_stmts, &temp);
                    let mut with_header = Vec::with_capacity(lowered_stmts.len() + 2);
                    with_header.push(assign_stmt(
                        AssignTarget::from(sentinel.clone()),
                        early_return_sentinel_expr(),
                    ));
                    with_header.push(Stmt::Labeled(LabeledStmt {
                        span: DUMMY_SP,
                        label: label.clone(),
                        body: Box::new(Stmt::Block(BlockStmt {
                            span: DUMMY_SP,
                            ctxt: Default::default(),
                            stmts: lowered_stmts,
                        })),
                    }));

                    let sentinel_slot = next_slot + deps.len() as u32;
                    let result_slot = sentinel_slot + 1;
                    transformed.extend(build_memoized_block_two_values(
                        &cache_ident,
                        next_slot,
                        &deps,
                        &sentinel,
                        &temp,
                        with_header,
                        declare_temp,
                        true,
                    ));
                    transformed.push(Stmt::If(IfStmt {
                        span: DUMMY_SP,
                        test: Box::new(Expr::Bin(swc_ecma_ast::BinExpr {
                            span: DUMMY_SP,
                            op: op!("!=="),
                            left: Box::new(Expr::Ident(sentinel.clone())),
                            right: early_return_sentinel_expr(),
                        })),
                        cons: Box::new(Stmt::Block(BlockStmt {
                            span: DUMMY_SP,
                            ctxt: Default::default(),
                            stmts: vec![Stmt::Return(swc_ecma_ast::ReturnStmt {
                                span: DUMMY_SP,
                                arg: Some(Box::new(Expr::Ident(sentinel))),
                            })],
                        })),
                        alt: None,
                    }));
                    if let Some(alias) = &const_result_alias {
                        transformed.push(make_var_decl(
                            VarDeclKind::Const,
                            Pat::Ident(BindingIdent {
                                id: alias.clone(),
                                type_ann: None,
                            }),
                            Some(Box::new(Expr::Ident(temp.clone()))),
                        ));
                        transformed.push(Stmt::Return(swc_ecma_ast::ReturnStmt {
                            span: DUMMY_SP,
                            arg: Some(wrap_with_ts_const_assertion(
                                Expr::Ident(alias.clone()),
                                return_as_const,
                            )),
                        }));
                    } else {
                        transformed.push(Stmt::Return(swc_ecma_ast::ReturnStmt {
                            span: DUMMY_SP,
                            arg: Some(wrap_with_ts_const_assertion(
                                Expr::Ident(temp),
                                return_as_const,
                            )),
                        }));
                    }

                    next_slot = result_slot + 1 + nested_slots;
                    memo_blocks += 1 + nested_blocks;
                    memo_values += 2 + nested_values;
                } else {
                    let value_slot = next_slot + deps.len() as u32;
                    transformed.extend(build_memoized_block(
                        &cache_ident,
                        next_slot,
                        &deps,
                        &temp,
                        rewritten_stmts,
                        declare_temp,
                    ));
                    if let Some(alias) = &const_result_alias {
                        transformed.push(make_var_decl(
                            VarDeclKind::Const,
                            Pat::Ident(BindingIdent {
                                id: alias.clone(),
                                type_ann: None,
                            }),
                            Some(Box::new(Expr::Ident(temp.clone()))),
                        ));
                        transformed.push(Stmt::Return(swc_ecma_ast::ReturnStmt {
                            span: DUMMY_SP,
                            arg: Some(wrap_with_ts_const_assertion(
                                Expr::Ident(alias.clone()),
                                return_as_const,
                            )),
                        }));
                    } else {
                        transformed.push(Stmt::Return(swc_ecma_ast::ReturnStmt {
                            span: DUMMY_SP,
                            arg: Some(wrap_with_ts_const_assertion(
                                Expr::Ident(temp),
                                return_as_const,
                            )),
                        }));
                    }

                    next_slot = value_slot + 1 + nested_slots;
                    memo_blocks += 1 + nested_blocks;
                    memo_values += 1 + nested_values;
                }
            }
        } else if let [Stmt::Try(try_stmt)] = tail.as_mut_slice() {
            if try_stmt.finalizer.is_some() {
                transformed.extend(tail);
            } else if let Some(return_expr) =
                try_stmt.block.stmts.last().and_then(|stmt| match stmt {
                    Stmt::Return(return_stmt) => return_stmt.arg.clone(),
                    _ => None,
                })
            {
                try_stmt.block.stmts.pop();
                let mut compute_stmts = std::mem::take(&mut try_stmt.block.stmts);

                let mut result_ident = None;
                if let Expr::Ident(result) = &*return_expr {
                    result_ident = Some(result.clone());
                    if rewrite_result_binding_to_assignment(&mut compute_stmts, result.sym.as_ref())
                    {
                        result_ident = Some(result.clone());
                    }
                }

                prune_empty_stmts(&mut compute_stmts);
                prune_noop_identifier_exprs(&mut compute_stmts);
                promote_immutable_lets_to_const(&mut compute_stmts);
                normalize_static_string_members_in_stmts(&mut compute_stmts);
                normalize_reactive_labels(&mut compute_stmts);
                normalize_if_break_blocks(&mut compute_stmts);

                let temp = result_ident
                    .clone()
                    .unwrap_or_else(|| fresh_temp_ident(&mut next_temp, &mut reserved));
                let declare_temp = !binding_declared_in_stmts(&compute_stmts, temp.sym.as_ref());

                let should_assign_result =
                    !matches!(&*return_expr, Expr::Ident(ident) if ident.sym == temp.sym);
                if should_assign_result {
                    compute_stmts.push(assign_stmt(AssignTarget::from(temp.clone()), return_expr));
                }
                inline_trivial_iifes_in_stmts(&mut compute_stmts);
                strip_runtime_call_type_args_in_stmts(&mut compute_stmts);

                let mut local_bindings = HashSet::new();
                for stmt in &compute_stmts {
                    collect_stmt_bindings(stmt, &mut local_bindings);
                }
                let mut deps = collect_dependencies_from_stmts(
                    &compute_stmts,
                    &known_bindings,
                    &local_bindings,
                );
                let called_fn_deps = collect_called_local_function_capture_dependencies(
                    &compute_stmts,
                    &known_bindings,
                );
                for dep in called_fn_deps {
                    if !deps.iter().any(|existing| existing.key == dep.key) {
                        deps.push(dep);
                    }
                }
                deps = reduce_dependencies(deps);
                if let Some(result_ident) = &result_ident {
                    deps.retain(|dep| {
                        dep.key != result_ident.sym.as_ref()
                            && !dep
                                .key
                                .starts_with(&format!("{}.", result_ident.sym.as_ref()))
                    });
                }

                let label = Ident::new_no_ctxt("bb0".into(), DUMMY_SP);
                let (rewritten_stmts, has_early_return, sentinel) =
                    if contains_return_stmt_in_stmts(&compute_stmts) {
                        let sentinel = fresh_temp_ident(&mut next_temp, &mut reserved);
                        let (rewritten_stmts, has_early_return) =
                            rewrite_returns_for_labeled_block(compute_stmts, &label, &sentinel);
                        (rewritten_stmts, has_early_return, Some(sentinel))
                    } else {
                        (compute_stmts, false, None)
                    };
                if has_early_return {
                    let sentinel = sentinel.expect("has_early_return implies sentinel");
                    let mut with_header = Vec::with_capacity(rewritten_stmts.len() + 2);
                    with_header.push(assign_stmt(
                        AssignTarget::from(sentinel.clone()),
                        early_return_sentinel_expr(),
                    ));
                    with_header.push(Stmt::Labeled(LabeledStmt {
                        span: DUMMY_SP,
                        label: label.clone(),
                        body: Box::new(Stmt::Block(BlockStmt {
                            span: DUMMY_SP,
                            ctxt: Default::default(),
                            stmts: rewritten_stmts,
                        })),
                    }));

                    let sentinel_slot = next_slot + deps.len() as u32;
                    let result_slot = sentinel_slot + 1;
                    let mut memoized = build_memoized_block_two_values(
                        &cache_ident,
                        next_slot,
                        &deps,
                        &sentinel,
                        &temp,
                        with_header,
                        declare_temp,
                        true,
                    );
                    memoized.push(Stmt::If(IfStmt {
                        span: DUMMY_SP,
                        test: Box::new(Expr::Bin(swc_ecma_ast::BinExpr {
                            span: DUMMY_SP,
                            op: op!("!=="),
                            left: Box::new(Expr::Ident(sentinel.clone())),
                            right: early_return_sentinel_expr(),
                        })),
                        cons: Box::new(Stmt::Block(BlockStmt {
                            span: DUMMY_SP,
                            ctxt: Default::default(),
                            stmts: vec![Stmt::Return(swc_ecma_ast::ReturnStmt {
                                span: DUMMY_SP,
                                arg: Some(Box::new(Expr::Ident(sentinel))),
                            })],
                        })),
                        alt: None,
                    }));
                    memoized.push(Stmt::Return(swc_ecma_ast::ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(Box::new(Expr::Ident(temp))),
                    }));
                    try_stmt.block.stmts = memoized;

                    next_slot = result_slot + 1;
                    memo_blocks += 1;
                    memo_values += 2;
                } else {
                    let value_slot = next_slot + deps.len() as u32;
                    let mut memoized = build_memoized_block(
                        &cache_ident,
                        next_slot,
                        &deps,
                        &temp,
                        rewritten_stmts,
                        declare_temp,
                    );
                    memoized.push(Stmt::Return(swc_ecma_ast::ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(Box::new(Expr::Ident(temp))),
                    }));
                    try_stmt.block.stmts = memoized;

                    next_slot = value_slot + 1;
                    memo_blocks += 1;
                    memo_values += 1;
                }

                transformed.extend(tail);
            } else {
                transformed.extend(tail);
            }
        } else {
            transformed.extend(tail);
        }
    }

    if next_slot > 0 {
        transformed.insert(
            directive_end,
            make_var_decl(
                VarDeclKind::Const,
                Pat::Ident(BindingIdent {
                    id: cache_ident,
                    type_ann: None,
                }),
                Some(Box::new(Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    ctxt: Default::default(),
                    callee: Callee::Expr(Box::new(Expr::Ident(Ident::new_no_ctxt(
                        "_c".into(),
                        DUMMY_SP,
                    )))),
                    args: vec![ExprOrSpread {
                        spread: None,
                        expr: Box::new(Expr::Lit(Lit::Num(Number {
                            span: DUMMY_SP,
                            value: next_slot as f64,
                            raw: None,
                        }))),
                    }],
                    type_args: None,
                }))),
            ),
        );
    }

    reactive.body.stmts = transformed;

    if next_slot == 0 {
        return (0, 0, 0, 0, 0);
    }

    (next_slot, memo_blocks, memo_values, 0, 0)
}

fn extract_memoizable_single_decl(stmt: &Stmt) -> Option<(Ident, Box<Expr>)> {
    let Stmt::Decl(Decl::Var(var_decl)) = stmt else {
        return None;
    };

    if !matches!(var_decl.kind, VarDeclKind::Let | VarDeclKind::Const) {
        return None;
    }

    let [decl] = var_decl.decls.as_slice() else {
        return None;
    };

    let Pat::Ident(binding) = &decl.name else {
        return None;
    };

    let Some(init) = &decl.init else {
        return None;
    };

    Some((binding.id.clone(), init.clone()))
}

fn inline_use_memo_empty_deps_returns(stmts: &mut [Stmt]) {
    for stmt in stmts {
        let Stmt::Return(return_stmt) = stmt else {
            continue;
        };
        let Some(arg) = &return_stmt.arg else {
            continue;
        };
        let Some(inlined) = inline_use_memo_empty_deps_expr(arg) else {
            continue;
        };
        return_stmt.arg = Some(inlined);
    }
}

fn inline_use_callback_empty_deps_decls(stmts: &mut [Stmt]) {
    for stmt in stmts {
        let Stmt::Decl(Decl::Var(var_decl)) = stmt else {
            continue;
        };

        for decl in &mut var_decl.decls {
            let Some(init) = &decl.init else {
                continue;
            };
            let Expr::Call(call) = &**init else {
                continue;
            };
            let Callee::Expr(callee_expr) = &call.callee else {
                continue;
            };
            let Expr::Ident(callee) = &**callee_expr else {
                continue;
            };
            if callee.sym != "useCallback" {
                continue;
            }

            let [callback_arg, deps_arg] = call.args.as_slice() else {
                continue;
            };
            if callback_arg.spread.is_some() || deps_arg.spread.is_some() {
                continue;
            }
            let Expr::Array(deps) = &*deps_arg.expr else {
                continue;
            };
            if !deps.elems.is_empty() {
                continue;
            }

            decl.init = Some(callback_arg.expr.clone());
        }
    }
}

fn inline_use_memo_empty_deps_expr(expr: &Expr) -> Option<Box<Expr>> {
    let Expr::Call(call) = expr else {
        return None;
    };
    let Callee::Expr(callee_expr) = &call.callee else {
        return None;
    };
    let Expr::Ident(callee) = &**callee_expr else {
        return None;
    };
    if callee.sym != "useMemo" {
        return None;
    }
    let [factory, deps] = call.args.as_slice() else {
        return None;
    };
    if factory.spread.is_some() || deps.spread.is_some() {
        return None;
    }
    let Expr::Array(dep_array) = &*deps.expr else {
        return None;
    };
    if !dep_array.elems.is_empty() {
        return None;
    }

    match &*factory.expr {
        Expr::Arrow(arrow) => {
            if !arrow.params.is_empty() {
                return None;
            }

            match &*arrow.body {
                swc_ecma_ast::BlockStmtOrExpr::Expr(expr) => Some(expr.clone()),
                swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) => {
                    if let [Stmt::Return(return_stmt)] = block.stmts.as_slice() {
                        return_stmt.arg.clone()
                    } else {
                        None
                    }
                }
            }
        }
        Expr::Fn(fn_expr) => {
            let function = &fn_expr.function;
            if !function.params.is_empty() {
                return None;
            }
            let body = function.body.as_ref()?;
            if let [Stmt::Return(return_stmt)] = body.stmts.as_slice() {
                return_stmt.arg.clone()
            } else {
                None
            }
        }
        _ => None,
    }
}

fn next_stmt_function_decl_captures_binding(stmts: &[Stmt], index: usize, binding: &str) -> bool {
    let Some(next_stmt) = stmts.get(index + 1) else {
        return false;
    };
    let Some((_, next_init)) = extract_memoizable_single_decl(next_stmt) else {
        return false;
    };
    matches!(&*next_init, Expr::Arrow(_) | Expr::Fn(_))
        && function_expr_references_binding(&next_init, binding)
}

fn function_expr_references_binding(expr: &Expr, binding: &str) -> bool {
    struct Finder<'a> {
        binding: &'a str,
        found: bool,
    }

    impl Visit for Finder<'_> {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_ident(&mut self, ident: &Ident) {
            if ident.sym == self.binding {
                self.found = true;
            }
        }
    }

    let mut finder = Finder {
        binding,
        found: false,
    };
    match expr {
        Expr::Arrow(arrow) => match &*arrow.body {
            swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) => block.visit_with(&mut finder),
            swc_ecma_ast::BlockStmtOrExpr::Expr(body_expr) => body_expr.visit_with(&mut finder),
        },
        Expr::Fn(fn_expr) => {
            if let Some(body) = &fn_expr.function.body {
                body.visit_with(&mut finder);
            }
        }
        _ => {}
    }
    finder.found
}

fn maybe_extract_single_call_arg_to_temp(
    init: &mut Box<Expr>,
    transformed: &mut Vec<Stmt>,
    known_bindings: &mut HashMap<String, bool>,
    reserved: &mut HashSet<String>,
    next_temp: &mut u32,
) {
    let Expr::Call(call) = &mut **init else {
        return;
    };
    let [arg] = call.args.as_mut_slice() else {
        return;
    };
    if arg.spread.is_some() {
        return;
    }
    if matches!(&*arg.expr, Expr::Ident(_) | Expr::Lit(_) | Expr::Member(_)) {
        return;
    }

    let arg_temp = fresh_temp_ident(next_temp, reserved);
    transformed.push(make_var_decl(
        VarDeclKind::Const,
        Pat::Ident(BindingIdent {
            id: arg_temp.clone(),
            type_ann: None,
        }),
        Some(arg.expr.clone()),
    ));
    arg.expr = Box::new(Expr::Ident(arg_temp.clone()));
    known_bindings.insert(arg_temp.sym.to_string(), false);
}

fn rewrite_non_ident_params(
    params: &mut [Pat],
    used: &mut HashSet<String>,
    next_temp: &mut u32,
    known_bindings: &mut HashMap<String, bool>,
) -> Vec<Stmt> {
    let mut prologue = Vec::new();

    for param in params.iter_mut() {
        match param {
            Pat::Ident(binding) => {
                known_bindings.insert(binding.id.sym.to_string(), false);
            }
            _ => {
                let original = param.clone();
                for binding in collect_pattern_binding_names(&original) {
                    known_bindings.insert(binding, false);
                }

                let temp = fresh_temp_ident(next_temp, used);
                known_bindings.insert(temp.sym.to_string(), false);
                *param = Pat::Ident(BindingIdent {
                    id: temp.clone(),
                    type_ann: None,
                });

                prologue.push(make_var_decl(
                    VarDeclKind::Const,
                    original,
                    Some(Box::new(Expr::Ident(temp))),
                ));
            }
        }
    }

    prologue
}

fn fresh_temp_ident(next_temp: &mut u32, used: &mut HashSet<String>) -> Ident {
    loop {
        let candidate = format!("t{next_temp}");
        *next_temp += 1;
        if used.insert(candidate.clone()) {
            return Ident::new_no_ctxt(candidate.into(), DUMMY_SP);
        }
    }
}

fn build_memoized_block(
    cache_ident: &Ident,
    slot_start: u32,
    deps: &[ReactiveDependency],
    temp_ident: &Ident,
    mut compute_stmts: Vec<Stmt>,
    declare_temp: bool,
) -> Vec<Stmt> {
    let value_slot = slot_start + deps.len() as u32;
    let if_test = if deps.is_empty() {
        Box::new(Expr::Bin(swc_ecma_ast::BinExpr {
            span: DUMMY_SP,
            op: op!("==="),
            left: make_cache_index_expr(cache_ident, slot_start),
            right: memo_cache_sentinel_expr(),
        }))
    } else {
        let mut test = Box::new(Expr::Bin(swc_ecma_ast::BinExpr {
            span: DUMMY_SP,
            op: op!("!=="),
            left: make_cache_index_expr(cache_ident, slot_start),
            right: deps[0].expr.clone(),
        }));

        for (index, dep) in deps.iter().enumerate().skip(1) {
            let dep_check = Expr::Bin(swc_ecma_ast::BinExpr {
                span: DUMMY_SP,
                op: op!("!=="),
                left: make_cache_index_expr(cache_ident, slot_start + index as u32),
                right: dep.expr.clone(),
            });
            test = Box::new(Expr::Bin(swc_ecma_ast::BinExpr {
                span: DUMMY_SP,
                op: op!("||"),
                left: test,
                right: Box::new(dep_check),
            }));
        }

        test
    };

    for (index, dep) in deps.iter().enumerate() {
        compute_stmts.push(assign_stmt(
            AssignTarget::from(make_cache_member(cache_ident, slot_start + index as u32)),
            dep.expr.clone(),
        ));
    }
    compute_stmts.push(assign_stmt(
        AssignTarget::from(make_cache_member(cache_ident, value_slot)),
        Box::new(Expr::Ident(temp_ident.clone())),
    ));

    let alternate_stmts = vec![assign_stmt(
        AssignTarget::from(temp_ident.clone()),
        make_cache_index_expr(cache_ident, value_slot),
    )];

    let mut out = Vec::new();
    if declare_temp {
        out.push(make_var_decl(
            VarDeclKind::Let,
            Pat::Ident(BindingIdent {
                id: temp_ident.clone(),
                type_ann: None,
            }),
            None,
        ));
    }
    out.push(Stmt::If(IfStmt {
        span: DUMMY_SP,
        test: if_test,
        cons: Box::new(Stmt::Block(BlockStmt {
            span: DUMMY_SP,
            ctxt: Default::default(),
            stmts: compute_stmts,
        })),
        alt: Some(Box::new(Stmt::Block(BlockStmt {
            span: DUMMY_SP,
            ctxt: Default::default(),
            stmts: alternate_stmts,
        }))),
    }));
    out
}

fn build_memoized_block_two_values(
    cache_ident: &Ident,
    slot_start: u32,
    deps: &[ReactiveDependency],
    first_value: &Ident,
    second_value: &Ident,
    mut compute_stmts: Vec<Stmt>,
    declare_second_value: bool,
    declare_second_before_first: bool,
) -> Vec<Stmt> {
    let first_slot = slot_start + deps.len() as u32;
    let second_slot = first_slot + 1;
    let if_test = if deps.is_empty() {
        Box::new(Expr::Bin(swc_ecma_ast::BinExpr {
            span: DUMMY_SP,
            op: op!("==="),
            left: make_cache_index_expr(cache_ident, slot_start),
            right: memo_cache_sentinel_expr(),
        }))
    } else {
        let mut test = Box::new(Expr::Bin(swc_ecma_ast::BinExpr {
            span: DUMMY_SP,
            op: op!("!=="),
            left: make_cache_index_expr(cache_ident, slot_start),
            right: deps[0].expr.clone(),
        }));

        for (index, dep) in deps.iter().enumerate().skip(1) {
            let dep_check = Expr::Bin(swc_ecma_ast::BinExpr {
                span: DUMMY_SP,
                op: op!("!=="),
                left: make_cache_index_expr(cache_ident, slot_start + index as u32),
                right: dep.expr.clone(),
            });
            test = Box::new(Expr::Bin(swc_ecma_ast::BinExpr {
                span: DUMMY_SP,
                op: op!("||"),
                left: test,
                right: Box::new(dep_check),
            }));
        }

        test
    };

    for (index, dep) in deps.iter().enumerate() {
        compute_stmts.push(assign_stmt(
            AssignTarget::from(make_cache_member(cache_ident, slot_start + index as u32)),
            dep.expr.clone(),
        ));
    }
    compute_stmts.push(assign_stmt(
        AssignTarget::from(make_cache_member(cache_ident, first_slot)),
        Box::new(Expr::Ident(first_value.clone())),
    ));
    compute_stmts.push(assign_stmt(
        AssignTarget::from(make_cache_member(cache_ident, second_slot)),
        Box::new(Expr::Ident(second_value.clone())),
    ));

    let alternate_stmts = vec![
        assign_stmt(
            AssignTarget::from(first_value.clone()),
            make_cache_index_expr(cache_ident, first_slot),
        ),
        assign_stmt(
            AssignTarget::from(second_value.clone()),
            make_cache_index_expr(cache_ident, second_slot),
        ),
    ];

    let mut out = Vec::new();
    if declare_second_value && declare_second_before_first {
        out.push(make_var_decl(
            VarDeclKind::Let,
            Pat::Ident(BindingIdent {
                id: second_value.clone(),
                type_ann: None,
            }),
            None,
        ));
        out.push(make_var_decl(
            VarDeclKind::Let,
            Pat::Ident(BindingIdent {
                id: first_value.clone(),
                type_ann: None,
            }),
            None,
        ));
    } else {
        out.push(make_var_decl(
            VarDeclKind::Let,
            Pat::Ident(BindingIdent {
                id: first_value.clone(),
                type_ann: None,
            }),
            None,
        ));
        if declare_second_value {
            out.push(make_var_decl(
                VarDeclKind::Let,
                Pat::Ident(BindingIdent {
                    id: second_value.clone(),
                    type_ann: None,
                }),
                None,
            ));
        }
    }
    out.push(Stmt::If(IfStmt {
        span: DUMMY_SP,
        test: if_test,
        cons: Box::new(Stmt::Block(BlockStmt {
            span: DUMMY_SP,
            ctxt: Default::default(),
            stmts: compute_stmts,
        })),
        alt: Some(Box::new(Stmt::Block(BlockStmt {
            span: DUMMY_SP,
            ctxt: Default::default(),
            stmts: alternate_stmts,
        }))),
    }));
    out
}

fn memo_cache_sentinel_expr() -> Box<Expr> {
    Box::new(Expr::Call(CallExpr {
        span: DUMMY_SP,
        ctxt: Default::default(),
        callee: Callee::Expr(Box::new(Expr::Member(MemberExpr {
            span: DUMMY_SP,
            obj: Box::new(Expr::Ident(Ident::new_no_ctxt("Symbol".into(), DUMMY_SP))),
            prop: MemberProp::Ident(Ident::new_no_ctxt("for".into(), DUMMY_SP).into()),
        }))),
        args: vec![ExprOrSpread {
            spread: None,
            expr: Box::new(Expr::Lit(Lit::Str("react.memo_cache_sentinel".into()))),
        }],
        type_args: None,
    }))
}

fn early_return_sentinel_expr() -> Box<Expr> {
    Box::new(Expr::Call(CallExpr {
        span: DUMMY_SP,
        ctxt: Default::default(),
        callee: Callee::Expr(Box::new(Expr::Member(MemberExpr {
            span: DUMMY_SP,
            obj: Box::new(Expr::Ident(Ident::new_no_ctxt("Symbol".into(), DUMMY_SP))),
            prop: MemberProp::Ident(Ident::new_no_ctxt("for".into(), DUMMY_SP).into()),
        }))),
        args: vec![ExprOrSpread {
            spread: None,
            expr: Box::new(Expr::Lit(Lit::Str("react.early_return_sentinel".into()))),
        }],
        type_args: None,
    }))
}

fn wrap_with_ts_const_assertion(expr: Expr, as_const: bool) -> Box<Expr> {
    if as_const {
        Box::new(Expr::TsConstAssertion(swc_ecma_ast::TsConstAssertion {
            span: DUMMY_SP,
            expr: Box::new(expr),
        }))
    } else {
        Box::new(expr)
    }
}

fn collect_dependencies_from_expr(
    expr: &Expr,
    known_bindings: &HashMap<String, bool>,
    local_bindings: &HashSet<String>,
) -> Vec<ReactiveDependency> {
    struct DependencyCollector<'a> {
        known_bindings: &'a HashMap<String, bool>,
        local_bindings: &'a HashSet<String>,
        seen: HashSet<String>,
        deps: Vec<ReactiveDependency>,
    }

    impl Visit for DependencyCollector<'_> {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_member_expr(&mut self, member: &MemberExpr) {
            if let Some(dep) = member_dependency(member, self.known_bindings, self.local_bindings) {
                if self.seen.insert(dep.key.clone()) {
                    self.deps.push(dep);
                }
                return;
            }

            member.visit_children_with(self);
        }

        fn visit_ident(&mut self, ident: &Ident) {
            let name = ident.sym.as_ref();
            if self.local_bindings.contains(name) {
                return;
            }

            let Some(stable) = self.known_bindings.get(name) else {
                return;
            };
            if *stable {
                return;
            }

            if self.seen.insert(name.to_string()) {
                self.deps.push(ReactiveDependency {
                    key: name.to_string(),
                    expr: Box::new(Expr::Ident(ident.clone())),
                });
            }
        }
    }

    let mut collector = DependencyCollector {
        known_bindings,
        local_bindings,
        seen: HashSet::new(),
        deps: Vec::new(),
    };
    expr.visit_with(&mut collector);
    reduce_dependencies(collector.deps)
}

fn collect_dependencies_from_stmts(
    stmts: &[Stmt],
    known_bindings: &HashMap<String, bool>,
    local_bindings: &HashSet<String>,
) -> Vec<ReactiveDependency> {
    struct DependencyCollector<'a> {
        known_bindings: &'a HashMap<String, bool>,
        local_bindings: &'a HashSet<String>,
        seen: HashSet<String>,
        deps: Vec<ReactiveDependency>,
    }

    impl Visit for DependencyCollector<'_> {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_member_expr(&mut self, member: &MemberExpr) {
            if let Some(dep) = member_dependency(member, self.known_bindings, self.local_bindings) {
                if self.seen.insert(dep.key.clone()) {
                    self.deps.push(dep);
                }
                return;
            }

            member.visit_children_with(self);
        }

        fn visit_ident(&mut self, ident: &Ident) {
            let name = ident.sym.as_ref();
            if self.local_bindings.contains(name) {
                return;
            }

            let Some(stable) = self.known_bindings.get(name) else {
                return;
            };
            if *stable {
                return;
            }

            if self.seen.insert(name.to_string()) {
                self.deps.push(ReactiveDependency {
                    key: name.to_string(),
                    expr: Box::new(Expr::Ident(ident.clone())),
                });
            }
        }
    }

    let mut collector = DependencyCollector {
        known_bindings,
        local_bindings,
        seen: HashSet::new(),
        deps: Vec::new(),
    };
    for stmt in stmts {
        stmt.visit_with(&mut collector);
    }
    reduce_dependencies(collector.deps)
}

fn collect_function_capture_dependencies(
    expr: &Expr,
    known_bindings: &HashMap<String, bool>,
) -> Vec<ReactiveDependency> {
    let mut deps = match expr {
        Expr::Arrow(arrow) => {
            let mut local_bindings = HashSet::new();
            for param in &arrow.params {
                collect_pattern_bindings(param, &mut local_bindings);
            }

            match &*arrow.body {
                swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) => {
                    for stmt in &block.stmts {
                        collect_stmt_bindings(stmt, &mut local_bindings);
                    }
                    collect_dependencies_from_stmts(&block.stmts, known_bindings, &local_bindings)
                }
                swc_ecma_ast::BlockStmtOrExpr::Expr(body_expr) => {
                    collect_dependencies_from_expr(body_expr, known_bindings, &local_bindings)
                }
            }
        }
        Expr::Fn(fn_expr) => {
            let mut local_bindings = HashSet::new();
            for param in &fn_expr.function.params {
                collect_pattern_bindings(&param.pat, &mut local_bindings);
            }

            let body = fn_expr.function.body.as_ref();
            if let Some(body) = body {
                for stmt in &body.stmts {
                    collect_stmt_bindings(stmt, &mut local_bindings);
                }
                collect_dependencies_from_stmts(&body.stmts, known_bindings, &local_bindings)
            } else {
                Vec::new()
            }
        }
        _ => Vec::new(),
    };
    deps.retain(|dep| {
        let base = dep
            .key
            .split_once('.')
            .map(|(base, _)| base)
            .unwrap_or(dep.key.as_str());
        !is_ref_like_binding_name(base)
    });
    deps
}

fn collect_called_local_function_capture_dependencies(
    stmts: &[Stmt],
    known_bindings: &HashMap<String, bool>,
) -> Vec<ReactiveDependency> {
    let mut function_bindings = HashMap::<String, Box<Expr>>::new();
    for stmt in stmts {
        let Some((binding, init)) = extract_memoizable_single_decl(stmt) else {
            continue;
        };
        if matches!(&*init, Expr::Arrow(_) | Expr::Fn(_)) {
            function_bindings.insert(binding.sym.to_string(), init);
        }
    }

    #[derive(Default)]
    struct CalledCollector {
        names: HashSet<String>,
    }

    impl Visit for CalledCollector {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_call_expr(&mut self, call: &CallExpr) {
            if let Callee::Expr(callee_expr) = &call.callee {
                if let Expr::Ident(callee) = &**callee_expr {
                    self.names.insert(callee.sym.to_string());
                }
            }
            call.visit_children_with(self);
        }
    }

    let mut called = CalledCollector::default();
    for stmt in stmts {
        stmt.visit_with(&mut called);
    }

    let mut deps = Vec::new();
    for name in called.names {
        let Some(init) = function_bindings.get(&name) else {
            continue;
        };
        for dep in collect_function_capture_dependencies(init, known_bindings) {
            if !deps
                .iter()
                .any(|existing: &ReactiveDependency| existing.key == dep.key)
            {
                deps.push(dep);
            }
        }
    }

    reduce_dependencies(deps)
}

fn member_dependency(
    member: &MemberExpr,
    known_bindings: &HashMap<String, bool>,
    local_bindings: &HashSet<String>,
) -> Option<ReactiveDependency> {
    let Expr::Ident(object) = &*member.obj else {
        return None;
    };
    let object_name = object.sym.as_ref();
    if local_bindings.contains(object_name) {
        return None;
    }
    if known_bindings.get(object_name).copied().unwrap_or(true) {
        return None;
    }

    let suffix = match &member.prop {
        MemberProp::Ident(prop) => prop.sym.to_string(),
        MemberProp::Computed(computed) => match &*computed.expr {
            Expr::Lit(Lit::Str(str_lit)) => str_lit.value.to_string_lossy().to_string(),
            Expr::Lit(Lit::Num(num_lit)) => num_lit.value.to_string(),
            _ => return None,
        },
        MemberProp::PrivateName(_) => return None,
    };

    Some(ReactiveDependency {
        key: format!("{object_name}.{suffix}"),
        expr: Box::new(Expr::Member(member.clone())),
    })
}

fn reduce_dependencies(deps: Vec<ReactiveDependency>) -> Vec<ReactiveDependency> {
    let base_keys = deps
        .iter()
        .filter(|dep| !dep.key.contains('.'))
        .map(|dep| dep.key.clone())
        .collect::<HashSet<_>>();

    let mut reduced = deps
        .into_iter()
        .filter(|dep| {
            if let Some((base, _)) = dep.key.split_once('.') {
                !base_keys.contains(base)
            } else {
                true
            }
        })
        .collect::<Vec<_>>();
    reduced.sort_by(|left, right| left.key.cmp(&right.key));
    reduced
}

#[allow(clippy::too_many_arguments)]
fn maybe_split_single_element_array_return(
    return_expr: &mut Box<Expr>,
    transformed: &mut Vec<Stmt>,
    cache_ident: &Ident,
    known_bindings: &mut HashMap<String, bool>,
    reserved: &mut HashSet<String>,
    next_temp: &mut u32,
    next_slot: &mut u32,
    memo_blocks: &mut u32,
    memo_values: &mut u32,
) {
    let Expr::Array(array_lit) = &mut **return_expr else {
        return;
    };
    let [Some(element)] = array_lit.elems.as_mut_slice() else {
        return;
    };
    if element.spread.is_some() {
        return;
    }
    if matches!(&*element.expr, Expr::Ident(_) | Expr::Lit(_)) {
        return;
    }

    let inner_temp = fresh_temp_ident(next_temp, reserved);
    let inner_expr = element.expr.clone();
    let mut compute_stmts = vec![assign_stmt(
        AssignTarget::from(inner_temp.clone()),
        inner_expr.clone(),
    )];
    inline_trivial_iifes_in_stmts(&mut compute_stmts);
    strip_runtime_call_type_args_in_stmts(&mut compute_stmts);

    let local_bindings = HashSet::new();
    let mut deps = collect_dependencies_from_expr(&inner_expr, known_bindings, &local_bindings);
    if expr_contains_call_expression(&inner_expr) {
        deps = collapse_member_dependencies_to_base(deps);
    }
    let value_slot = *next_slot + deps.len() as u32;

    transformed.extend(build_memoized_block(
        cache_ident,
        *next_slot,
        &deps,
        &inner_temp,
        compute_stmts,
        true,
    ));

    element.expr = Box::new(Expr::Ident(inner_temp));
    known_bindings.insert(
        match &*element.expr {
            Expr::Ident(ident) => ident.sym.to_string(),
            _ => unreachable!("array element was rewritten to an identifier"),
        },
        false,
    );
    *next_slot = value_slot + 1;
    *memo_blocks += 1;
    *memo_values += 1;
}

fn inject_nested_call_memoization_into_stmts(
    stmts: &mut Vec<Stmt>,
    cache_ident: &Ident,
    slot_start: u32,
    reserved: &mut HashSet<String>,
    next_temp: &mut u32,
) -> (u32, u32, u32) {
    let mut out = Vec::with_capacity(stmts.len());
    let mut cursor = slot_start;
    let mut added_blocks = 0u32;
    let mut added_values = 0u32;
    let original = std::mem::take(stmts);
    for (index, stmt) in original.iter().cloned().enumerate() {
        let remaining = &original[index + 1..];
        let Stmt::Decl(Decl::Var(var_decl)) = &stmt else {
            out.push(stmt);
            continue;
        };
        let [decl] = var_decl.decls.as_slice() else {
            out.push(stmt);
            continue;
        };
        let Pat::Ident(binding) = &decl.name else {
            out.push(stmt);
            continue;
        };
        let Some(init_expr) = &decl.init else {
            out.push(stmt);
            continue;
        };

        if is_simple_nested_array_initializer(init_expr)
            && !binding_reassigned_after(remaining, binding.id.sym.as_ref())
            && !binding_mutated_via_member_call_after(remaining, binding.id.sym.as_ref())
            && !binding_mutated_via_member_assignment_after(remaining, binding.id.sym.as_ref())
        {
            let nested_deps = collect_identifier_dependencies_for_nested_expr(init_expr);
            if !nested_deps.is_empty() {
                let result_temp = fresh_temp_ident(next_temp, reserved);
                let mut nested_compute = vec![assign_stmt(
                    AssignTarget::from(result_temp.clone()),
                    init_expr.clone(),
                )];
                strip_runtime_call_type_args_in_stmts(&mut nested_compute);

                out.extend(build_memoized_block(
                    cache_ident,
                    cursor,
                    &nested_deps,
                    &result_temp,
                    nested_compute,
                    true,
                ));
                cursor += nested_deps.len() as u32 + 1;
                added_blocks += 1;
                added_values += 1;

                out.push(make_var_decl(
                    var_decl.kind,
                    Pat::Ident(binding.clone()),
                    Some(Box::new(Expr::Ident(result_temp))),
                ));
                continue;
            }
        }

        let Expr::Call(call) = &**init_expr else {
            out.push(stmt);
            continue;
        };
        let [arg] = call.args.as_slice() else {
            out.push(stmt);
            continue;
        };
        if arg.spread.is_some() || matches!(&*arg.expr, Expr::Ident(_) | Expr::Lit(_)) {
            out.push(stmt);
            continue;
        }
        if let Callee::Expr(callee_expr) = &call.callee {
            if let Expr::Ident(callee) = &**callee_expr {
                if is_hook_name(callee.sym.as_ref()) {
                    out.push(stmt);
                    continue;
                }
            }
        }

        let arg_temp = fresh_temp_ident(next_temp, reserved);
        out.push(make_var_decl(
            VarDeclKind::Const,
            Pat::Ident(BindingIdent {
                id: arg_temp.clone(),
                type_ann: None,
            }),
            Some(arg.expr.clone()),
        ));

        let mut nested_call = call.clone();
        nested_call.args[0].expr = Box::new(Expr::Ident(arg_temp.clone()));
        let result_temp = fresh_temp_ident(next_temp, reserved);
        let mut nested_compute = vec![assign_stmt(
            AssignTarget::from(result_temp.clone()),
            Box::new(Expr::Call(nested_call)),
        )];
        strip_runtime_call_type_args_in_stmts(&mut nested_compute);

        let nested_deps = vec![ReactiveDependency {
            key: arg_temp.sym.to_string(),
            expr: Box::new(Expr::Ident(arg_temp)),
        }];
        out.extend(build_memoized_block(
            cache_ident,
            cursor,
            &nested_deps,
            &result_temp,
            nested_compute,
            true,
        ));
        cursor += nested_deps.len() as u32 + 1;
        added_blocks += 1;
        added_values += 1;

        out.push(make_var_decl(
            var_decl.kind,
            Pat::Ident(binding.clone()),
            Some(Box::new(Expr::Ident(result_temp))),
        ));
    }

    let added_slots = cursor - slot_start;
    *stmts = out;
    (added_slots, added_blocks, added_values)
}

fn collect_identifier_dependencies_for_nested_expr(expr: &Expr) -> Vec<ReactiveDependency> {
    struct Collector {
        seen: HashSet<String>,
        deps: Vec<ReactiveDependency>,
    }

    impl Visit for Collector {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_ident(&mut self, ident: &Ident) {
            let key = ident.sym.to_string();
            if self.seen.insert(key.clone()) {
                self.deps.push(ReactiveDependency {
                    key,
                    expr: Box::new(Expr::Ident(ident.clone())),
                });
            }
        }
    }

    let mut collector = Collector {
        seen: HashSet::new(),
        deps: Vec::new(),
    };
    expr.visit_with(&mut collector);
    collector
        .deps
        .sort_by(|left, right| left.key.cmp(&right.key));
    collector.deps
}

fn is_simple_nested_array_initializer(expr: &Expr) -> bool {
    let Expr::Array(array) = expr else {
        return false;
    };

    array.elems.iter().flatten().all(|element| {
        element.spread.is_none() && matches!(&*element.expr, Expr::Ident(_) | Expr::Lit(_))
    })
}

fn expr_contains_call_expression(expr: &Expr) -> bool {
    #[derive(Default)]
    struct Finder {
        found: bool,
    }

    impl Visit for Finder {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_call_expr(&mut self, _: &CallExpr) {
            self.found = true;
        }

        fn visit_opt_call(&mut self, _: &swc_ecma_ast::OptCall) {
            self.found = true;
        }
    }

    let mut finder = Finder::default();
    expr.visit_with(&mut finder);
    finder.found
}

fn collapse_member_dependencies_to_base(deps: Vec<ReactiveDependency>) -> Vec<ReactiveDependency> {
    let mut dedup = HashSet::new();
    let mut collapsed = Vec::new();

    for dep in deps {
        if let Some((base, _)) = dep.key.split_once('.') {
            if dedup.insert(base.to_string()) {
                collapsed.push(ReactiveDependency {
                    key: base.to_string(),
                    expr: Box::new(Expr::Ident(Ident::new_no_ctxt(base.into(), DUMMY_SP))),
                });
            }
            continue;
        }

        if dedup.insert(dep.key.clone()) {
            collapsed.push(dep);
        }
    }

    collapsed
}

fn prune_noop_identifier_exprs(stmts: &mut Vec<Stmt>) {
    stmts.retain(|stmt| {
        !matches!(
            stmt,
            Stmt::Expr(expr_stmt) if matches!(&*expr_stmt.expr, Expr::Ident(_))
        )
    });
}

fn prune_empty_stmts(stmts: &mut Vec<Stmt>) {
    stmts.retain(|stmt| !matches!(stmt, Stmt::Empty(_)));
}

fn promote_immutable_lets_to_const(stmts: &mut [Stmt]) {
    #[derive(Default)]
    struct ReassignedCollector {
        names: HashSet<String>,
    }

    impl Visit for ReassignedCollector {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_assign_expr(&mut self, assign: &AssignExpr) {
            if let Some(binding) = assign.left.as_ident() {
                self.names.insert(binding.id.sym.to_string());
            }
            assign.visit_children_with(self);
        }

        fn visit_update_expr(&mut self, update: &swc_ecma_ast::UpdateExpr) {
            if let Expr::Ident(ident) = &*update.arg {
                self.names.insert(ident.sym.to_string());
            }
            update.visit_children_with(self);
        }
    }

    struct Promoter<'a> {
        reassigned: &'a HashSet<String>,
    }

    impl VisitMut for Promoter<'_> {
        fn visit_mut_arrow_expr(&mut self, _: &mut ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_mut_function(&mut self, _: &mut Function) {
            // Skip nested functions.
        }

        fn visit_mut_var_decl(&mut self, var_decl: &mut VarDecl) {
            var_decl.visit_mut_children_with(self);

            if var_decl.kind != VarDeclKind::Let {
                return;
            }

            let can_promote = var_decl.decls.iter().all(|declarator| {
                let Pat::Ident(binding) = &declarator.name else {
                    return false;
                };
                declarator.init.is_some() && !self.reassigned.contains(binding.id.sym.as_ref())
            });

            if can_promote {
                var_decl.kind = VarDeclKind::Const;
            }
        }
    }

    let mut collector = ReassignedCollector::default();
    for stmt in &*stmts {
        stmt.visit_with(&mut collector);
    }

    let mut promoter = Promoter {
        reassigned: &collector.names,
    };
    for stmt in stmts {
        stmt.visit_mut_with(&mut promoter);
    }
}

fn binding_reassigned_after(stmts: &[Stmt], name: &str) -> bool {
    #[derive(Default)]
    struct Finder<'a> {
        name: &'a str,
        found: bool,
    }

    impl Visit for Finder<'_> {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_assign_expr(&mut self, assign: &AssignExpr) {
            if let Some(binding) = assign.left.as_ident() {
                if binding.id.sym == self.name {
                    self.found = true;
                    return;
                }
            }
            assign.visit_children_with(self);
        }

        fn visit_update_expr(&mut self, update: &swc_ecma_ast::UpdateExpr) {
            if let Expr::Ident(ident) = &*update.arg {
                if ident.sym == self.name {
                    self.found = true;
                    return;
                }
            }
            update.visit_children_with(self);
        }
    }

    let mut finder = Finder { name, found: false };
    for stmt in stmts {
        stmt.visit_with(&mut finder);
        if finder.found {
            return true;
        }
    }
    false
}

fn binding_mutated_via_member_call_after(stmts: &[Stmt], name: &str) -> bool {
    #[derive(Default)]
    struct Finder<'a> {
        name: &'a str,
        found: bool,
    }

    impl Visit for Finder<'_> {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_call_expr(&mut self, call: &CallExpr) {
            if call_mutates_binding(call, self.name) {
                self.found = true;
                return;
            }
            call.visit_children_with(self);
        }
    }

    let mut finder = Finder { name, found: false };
    for stmt in stmts {
        stmt.visit_with(&mut finder);
        if finder.found {
            return true;
        }
    }
    false
}

fn binding_mutated_via_member_assignment_after(stmts: &[Stmt], name: &str) -> bool {
    #[derive(Default)]
    struct Finder<'a> {
        name: &'a str,
        found: bool,
    }

    impl Visit for Finder<'_> {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_assign_expr(&mut self, assign: &AssignExpr) {
            if assign_target_is_member_of_binding(&assign.left, self.name) {
                self.found = true;
                return;
            }
            assign.visit_children_with(self);
        }

        fn visit_update_expr(&mut self, update: &swc_ecma_ast::UpdateExpr) {
            if let Expr::Member(member) = &*update.arg {
                if member_root_is_binding(member, self.name) {
                    self.found = true;
                    return;
                }
            }
            update.visit_children_with(self);
        }
    }

    let mut finder = Finder { name, found: false };
    for stmt in stmts {
        stmt.visit_with(&mut finder);
        if finder.found {
            return true;
        }
    }
    false
}

fn assign_target_is_member_of_binding(target: &AssignTarget, name: &str) -> bool {
    let Some(simple_target) = target.as_simple() else {
        return false;
    };
    let swc_ecma_ast::SimpleAssignTarget::Member(member) = simple_target else {
        return false;
    };
    member_root_is_binding(member, name)
}

fn member_root_is_binding(member: &MemberExpr, name: &str) -> bool {
    let mut current = &*member.obj;
    loop {
        match current {
            Expr::Ident(ident) => return ident.sym == name,
            Expr::Member(inner) => {
                current = &inner.obj;
            }
            Expr::Paren(paren) => {
                current = &paren.expr;
            }
            Expr::TsAs(ts_as) => {
                current = &ts_as.expr;
            }
            Expr::TsTypeAssertion(type_assertion) => {
                current = &type_assertion.expr;
            }
            Expr::TsNonNull(ts_non_null) => {
                current = &ts_non_null.expr;
            }
            Expr::TsSatisfies(ts_satisfies) => {
                current = &ts_satisfies.expr;
            }
            Expr::TsInstantiation(ts_instantiation) => {
                current = &ts_instantiation.expr;
            }
            _ => return false,
        }
    }
}

fn call_mutates_binding(call: &CallExpr, target: &str) -> bool {
    let Callee::Expr(callee_expr) = &call.callee else {
        return false;
    };

    let Expr::Member(member) = &**callee_expr else {
        return false;
    };
    let Expr::Ident(object) = &*member.obj else {
        return false;
    };
    if object.sym != target {
        return false;
    }

    match &member.prop {
        MemberProp::Ident(prop) => matches!(
            prop.sym.as_ref(),
            "copyWithin"
                | "fill"
                | "pop"
                | "push"
                | "reverse"
                | "shift"
                | "sort"
                | "splice"
                | "unshift"
        ),
        MemberProp::Computed(_) => true,
        MemberProp::PrivateName(_) => true,
    }
}

fn contains_direct_call(stmts: &[Stmt]) -> bool {
    struct Finder<'a> {
        local_bindings: &'a HashSet<String>,
        found: bool,
    }

    impl Visit for Finder<'_> {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_call_expr(&mut self, call: &CallExpr) {
            if let Callee::Expr(expr) = &call.callee {
                if let Expr::Ident(callee) = &**expr {
                    if is_hook_name(callee.sym.as_ref())
                        || matches!(callee.sym.as_ref(), "String" | "Number" | "Boolean")
                        || self.local_bindings.contains(callee.sym.as_ref())
                    {
                        call.visit_children_with(self);
                        return;
                    }

                    self.found = true;
                    return;
                }
            }
            call.visit_children_with(self);
        }
    }

    let mut local_bindings = HashSet::new();
    for stmt in stmts {
        collect_stmt_bindings(stmt, &mut local_bindings);
    }

    let mut finder = Finder {
        local_bindings: &local_bindings,
        found: false,
    };
    for stmt in stmts {
        stmt.visit_with(&mut finder);
        if finder.found {
            return true;
        }
    }
    false
}

fn count_binding_references_in_expr(expr: &Expr, name: &str) -> usize {
    struct Counter<'a> {
        name: &'a str,
        count: usize,
    }

    impl Visit for Counter<'_> {
        fn visit_ident(&mut self, ident: &Ident) {
            if ident.sym == self.name {
                self.count += 1;
            }
        }
    }

    let mut counter = Counter { name, count: 0 };
    expr.visit_with(&mut counter);
    counter.count
}

fn count_binding_references_in_stmt(stmt: &Stmt, name: &str) -> usize {
    struct Counter<'a> {
        name: &'a str,
        count: usize,
    }

    impl Visit for Counter<'_> {
        fn visit_ident(&mut self, ident: &Ident) {
            if ident.sym == self.name {
                self.count += 1;
            }
        }
    }

    let mut counter = Counter { name, count: 0 };
    stmt.visit_with(&mut counter);
    counter.count
}

fn binding_only_used_in_terminal_return(stmts: &[Stmt], binding: &str) -> bool {
    let Some((last, preceding)) = stmts.split_last() else {
        return false;
    };
    let Stmt::Return(return_stmt) = last else {
        return false;
    };
    let Some(return_arg) = &return_stmt.arg else {
        return false;
    };
    if !matches!(&**return_arg, Expr::TsConstAssertion(_)) {
        return false;
    }

    let return_refs = count_binding_references_in_expr(return_arg, binding);
    if return_refs == 0 {
        return false;
    }

    let prior_refs: usize = preceding
        .iter()
        .map(|stmt| count_binding_references_in_stmt(stmt, binding))
        .sum();

    prior_refs == 0
}

fn is_ref_current_member(member: &MemberExpr) -> bool {
    let Expr::Ident(object) = &*member.obj else {
        return false;
    };
    if !is_ref_like_binding_name(object.sym.as_ref()) {
        return false;
    }

    matches!(&member.prop, MemberProp::Ident(prop) if prop.sym == "current")
}

fn is_ref_current_null_check(expr: &Expr) -> bool {
    let Expr::Bin(bin) = expr else {
        return false;
    };

    if !matches!(bin.op, op!("==") | op!("===")) {
        return false;
    }

    let left_is_ref = matches!(&*bin.left, Expr::Member(member) if is_ref_current_member(member));
    let right_is_ref = matches!(&*bin.right, Expr::Member(member) if is_ref_current_member(member));
    let left_is_null = matches!(&*bin.left, Expr::Lit(Lit::Null(_)));
    let right_is_null = matches!(&*bin.right, Expr::Lit(Lit::Null(_)));

    (left_is_ref && right_is_null) || (right_is_ref && left_is_null)
}

fn stmt_assigns_ref_current(stmt: &Stmt) -> bool {
    match stmt {
        Stmt::Expr(expr_stmt) => {
            let Expr::Assign(assign) = &*expr_stmt.expr else {
                return false;
            };
            let Some(simple_target) = assign.left.as_simple() else {
                return false;
            };
            let swc_ecma_ast::SimpleAssignTarget::Member(member) = simple_target else {
                return false;
            };
            assign.op == op!("=") && is_ref_current_member(member)
        }
        Stmt::Block(block) => {
            let [single] = block.stmts.as_slice() else {
                return false;
            };
            stmt_assigns_ref_current(single)
        }
        _ => false,
    }
}

fn is_ref_lazy_initialization_stmt(stmt: &Stmt) -> bool {
    let Stmt::If(if_stmt) = stmt else {
        return false;
    };
    if if_stmt.alt.is_some() {
        return false;
    }
    if !is_ref_current_null_check(&if_stmt.test) {
        return false;
    }
    stmt_assigns_ref_current(&if_stmt.cons)
}

fn contains_complex_assignment(stmts: &[Stmt]) -> bool {
    #[derive(Default)]
    struct Finder {
        found: bool,
    }

    impl Visit for Finder {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_assign_expr(&mut self, assign: &AssignExpr) {
            if assign.left.as_ident().is_none() {
                self.found = true;
                return;
            }
            assign.visit_children_with(self);
        }
    }

    let mut finder = Finder::default();
    for stmt in stmts {
        stmt.visit_with(&mut finder);
        if finder.found {
            return true;
        }
    }
    false
}

fn expr_contains_hook_call(expr: &Expr) -> bool {
    #[derive(Default)]
    struct Finder {
        found: bool,
    }

    impl Visit for Finder {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_call_expr(&mut self, call: &CallExpr) {
            let Callee::Expr(callee_expr) = &call.callee else {
                call.visit_children_with(self);
                return;
            };
            let Expr::Ident(callee) = &**callee_expr else {
                call.visit_children_with(self);
                return;
            };

            if is_hook_name(callee.sym.as_ref()) {
                self.found = true;
                return;
            }

            call.visit_children_with(self);
        }
    }

    let mut finder = Finder::default();
    expr.visit_with(&mut finder);
    finder.found
}

fn expr_contains_ref_like_identifier(expr: &Expr) -> bool {
    #[derive(Default)]
    struct Finder {
        found: bool,
    }

    impl Visit for Finder {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_ident(&mut self, ident: &Ident) {
            if is_ref_like_binding_name(ident.sym.as_ref()) {
                self.found = true;
            }
        }
    }

    let mut finder = Finder::default();
    expr.visit_with(&mut finder);
    finder.found
}

fn is_ref_like_binding_name(name: &str) -> bool {
    name == "ref"
        || name.ends_with("Ref")
        || name
            .strip_prefix("ref")
            .and_then(|rest| rest.chars().next())
            .is_some_and(|first| first.is_ascii_uppercase() || first.is_ascii_digit())
}

fn contains_hook_call_stmt(stmts: &[Stmt]) -> bool {
    stmts.iter().any(|stmt| {
        let Stmt::Expr(expr_stmt) = stmt else {
            return false;
        };
        let Expr::Call(call) = &*expr_stmt.expr else {
            return false;
        };
        let Callee::Expr(callee_expr) = &call.callee else {
            return false;
        };
        let Expr::Ident(callee) = &**callee_expr else {
            return false;
        };
        is_hook_name(callee.sym.as_ref())
    })
}

fn should_memoize_hook_argument(expr: &Expr) -> bool {
    matches!(
        expr,
        Expr::Arrow(_)
            | Expr::Fn(_)
            | Expr::Array(_)
            | Expr::Object(_)
            | Expr::JSXElement(_)
            | Expr::JSXFragment(_)
            | Expr::Call(_)
            | Expr::OptChain(_)
    )
}

fn lower_hook_call_stmt_with_memoized_args(
    stmt: Stmt,
    cache_ident: &Ident,
    next_slot: &mut u32,
    memo_blocks: &mut u32,
    memo_values: &mut u32,
    reserved: &mut HashSet<String>,
    next_temp: &mut u32,
) -> Vec<Stmt> {
    let Stmt::Expr(expr_stmt) = stmt else {
        return vec![stmt];
    };
    let Expr::Call(mut call) = *expr_stmt.expr else {
        return vec![Stmt::Expr(expr_stmt)];
    };
    let Callee::Expr(callee_expr) = &call.callee else {
        return vec![Stmt::Expr(ExprStmt {
            span: expr_stmt.span,
            expr: Box::new(Expr::Call(call)),
        })];
    };
    let Expr::Ident(callee) = &**callee_expr else {
        return vec![Stmt::Expr(ExprStmt {
            span: expr_stmt.span,
            expr: Box::new(Expr::Call(call)),
        })];
    };
    if !is_hook_name(callee.sym.as_ref()) {
        return vec![Stmt::Expr(ExprStmt {
            span: expr_stmt.span,
            expr: Box::new(Expr::Call(call)),
        })];
    }

    let mut lowered = Vec::new();
    match call.args.len() {
        0 => {}
        1 => {
            if should_memoize_hook_argument(&call.args[0].expr) {
                let arg_expr = call.args[0].expr.clone();
                let arg_temp = fresh_temp_ident(next_temp, reserved);
                let mut compute_stmts =
                    vec![assign_stmt(AssignTarget::from(arg_temp.clone()), arg_expr)];
                strip_runtime_call_type_args_in_stmts(&mut compute_stmts);
                lowered.extend(build_memoized_block(
                    cache_ident,
                    *next_slot,
                    &[],
                    &arg_temp,
                    compute_stmts,
                    true,
                ));
                call.args[0].expr = Box::new(Expr::Ident(arg_temp));
                *next_slot += 1;
                *memo_blocks += 1;
                *memo_values += 1;
            }
        }
        2 => {
            let memo_arg0 = should_memoize_hook_argument(&call.args[0].expr);
            let memo_arg1 = should_memoize_hook_argument(&call.args[1].expr);
            if memo_arg0 && memo_arg1 {
                let arg0_expr = call.args[0].expr.clone();
                let arg1_expr = call.args[1].expr.clone();
                let arg0_temp = fresh_temp_ident(next_temp, reserved);
                let arg1_temp = fresh_temp_ident(next_temp, reserved);
                let mut compute_stmts = vec![
                    assign_stmt(AssignTarget::from(arg0_temp.clone()), arg0_expr),
                    assign_stmt(AssignTarget::from(arg1_temp.clone()), arg1_expr),
                ];
                strip_runtime_call_type_args_in_stmts(&mut compute_stmts);
                lowered.extend(build_memoized_block_two_values(
                    cache_ident,
                    *next_slot,
                    &[],
                    &arg0_temp,
                    &arg1_temp,
                    compute_stmts,
                    true,
                    false,
                ));
                call.args[0].expr = Box::new(Expr::Ident(arg0_temp));
                call.args[1].expr = Box::new(Expr::Ident(arg1_temp));
                *next_slot += 2;
                *memo_blocks += 1;
                *memo_values += 2;
            } else if memo_arg0 {
                let arg_expr = call.args[0].expr.clone();
                let arg_temp = fresh_temp_ident(next_temp, reserved);
                let mut compute_stmts =
                    vec![assign_stmt(AssignTarget::from(arg_temp.clone()), arg_expr)];
                strip_runtime_call_type_args_in_stmts(&mut compute_stmts);
                lowered.extend(build_memoized_block(
                    cache_ident,
                    *next_slot,
                    &[],
                    &arg_temp,
                    compute_stmts,
                    true,
                ));
                call.args[0].expr = Box::new(Expr::Ident(arg_temp));
                *next_slot += 1;
                *memo_blocks += 1;
                *memo_values += 1;
            } else if memo_arg1 {
                let arg_expr = call.args[1].expr.clone();
                let arg_temp = fresh_temp_ident(next_temp, reserved);
                let mut compute_stmts =
                    vec![assign_stmt(AssignTarget::from(arg_temp.clone()), arg_expr)];
                strip_runtime_call_type_args_in_stmts(&mut compute_stmts);
                lowered.extend(build_memoized_block(
                    cache_ident,
                    *next_slot,
                    &[],
                    &arg_temp,
                    compute_stmts,
                    true,
                ));
                call.args[1].expr = Box::new(Expr::Ident(arg_temp));
                *next_slot += 1;
                *memo_blocks += 1;
                *memo_values += 1;
            }
        }
        _ => {}
    }

    lowered.push(Stmt::Expr(ExprStmt {
        span: expr_stmt.span,
        expr: Box::new(Expr::Call(call)),
    }));
    lowered
}

fn jsx_call_argument_is_identity_unstable(expr: &Expr) -> bool {
    #[derive(Default)]
    struct Finder {
        found: bool,
    }

    impl Visit for Finder {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            self.found = true;
        }

        fn visit_function(&mut self, _: &Function) {
            self.found = true;
        }

        fn visit_expr(&mut self, expr: &Expr) {
            if self.found {
                return;
            }

            if matches!(
                expr,
                Expr::Array(_)
                    | Expr::Object(_)
                    | Expr::Class(_)
                    | Expr::New(_)
                    | Expr::JSXElement(_)
                    | Expr::JSXFragment(_)
            ) {
                self.found = true;
                return;
            }

            expr.visit_children_with(self);
        }
    }

    let mut finder = Finder::default();
    expr.visit_with(&mut finder);
    finder.found
}

fn should_memoize_jsx_hoisted_call(call: &CallExpr) -> bool {
    !call
        .args
        .iter()
        .any(|arg| arg.spread.is_some() || jsx_call_argument_is_identity_unstable(&arg.expr))
}

fn jsx_return_contains_non_memoized_hoisted_call(return_expr: &Expr) -> bool {
    #[derive(Default)]
    struct Finder {
        found: bool,
    }

    impl Visit for Finder {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_call_expr(&mut self, call: &CallExpr) {
            if call.args.iter().any(|arg| arg.spread.is_some()) {
                call.visit_children_with(self);
                return;
            }

            let is_string_call = matches!(
                &call.callee,
                Callee::Expr(callee_expr)
                    if matches!(&**callee_expr, Expr::Ident(callee) if callee.sym == "String")
            );
            if !is_string_call && !should_memoize_jsx_hoisted_call(call) {
                self.found = true;
                return;
            }

            call.visit_children_with(self);
        }
    }

    let mut finder = Finder::default();
    return_expr.visit_with(&mut finder);
    finder.found
}

fn is_component_jsx_identifier(tag: &Ident) -> bool {
    tag.sym
        .as_ref()
        .chars()
        .next()
        .is_some_and(|ch| ch.is_ascii_uppercase())
}

fn fresh_jsx_tag_ident(used: &mut HashSet<String>) -> Ident {
    let mut index = 0u32;
    loop {
        let candidate = format!("T{index}");
        if used.insert(candidate.clone()) {
            return Ident::new_no_ctxt(candidate.into(), DUMMY_SP);
        }
        index += 1;
    }
}

fn hoist_root_jsx_tag_alias_if_needed(
    return_expr: &mut Box<Expr>,
    transformed: &mut Vec<Stmt>,
    known_bindings: &mut HashMap<String, bool>,
    reserved: &mut HashSet<String>,
) {
    if !jsx_return_contains_non_memoized_hoisted_call(return_expr) {
        return;
    }

    let Expr::JSXElement(element) = &mut **return_expr else {
        return;
    };
    let swc_ecma_ast::JSXElementName::Ident(original_tag) = &element.opening.name else {
        return;
    };
    if !is_component_jsx_identifier(original_tag) {
        return;
    }

    let tag_alias = fresh_jsx_tag_ident(reserved);
    transformed.push(make_var_decl(
        VarDeclKind::Const,
        Pat::Ident(BindingIdent {
            id: tag_alias.clone(),
            type_ann: None,
        }),
        Some(Box::new(Expr::Ident(original_tag.clone()))),
    ));
    known_bindings.insert(tag_alias.sym.to_string(), false);

    element.opening.name = swc_ecma_ast::JSXElementName::Ident(tag_alias.clone());
    if let Some(closing) = &mut element.closing {
        closing.name = swc_ecma_ast::JSXElementName::Ident(tag_alias);
    }
}

fn hoist_string_calls_from_jsx_return(
    return_expr: &mut Box<Expr>,
    transformed: &mut Vec<Stmt>,
    known_bindings: &mut HashMap<String, bool>,
    reserved: &mut HashSet<String>,
    next_temp: &mut u32,
    cache_ident: &Ident,
    next_slot: &mut u32,
    memo_blocks: &mut u32,
    memo_values: &mut u32,
) {
    if !matches!(&**return_expr, Expr::JSXElement(_) | Expr::JSXFragment(_)) {
        return;
    }

    hoist_root_jsx_tag_alias_if_needed(return_expr, transformed, known_bindings, reserved);

    struct Hoister<'a> {
        transformed: &'a mut Vec<Stmt>,
        known_bindings: &'a mut HashMap<String, bool>,
        reserved: &'a mut HashSet<String>,
        next_temp: &'a mut u32,
        cache_ident: &'a Ident,
        next_slot: &'a mut u32,
        memo_blocks: &'a mut u32,
        memo_values: &'a mut u32,
    }

    impl VisitMut for Hoister<'_> {
        fn visit_mut_arrow_expr(&mut self, _: &mut ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_mut_function(&mut self, _: &mut Function) {
            // Skip nested functions.
        }

        fn visit_mut_expr(&mut self, expr: &mut Expr) {
            expr.visit_mut_children_with(self);

            let Expr::Call(call) = expr else {
                return;
            };
            if call.args.iter().any(|arg| arg.spread.is_some()) {
                return;
            }

            let value_temp = fresh_temp_ident(self.next_temp, self.reserved);
            let is_string_call = matches!(
                &call.callee,
                Callee::Expr(callee_expr)
                    if matches!(&**callee_expr, Expr::Ident(callee) if callee.sym == "String")
            );
            if is_string_call {
                self.transformed.push(make_var_decl(
                    VarDeclKind::Const,
                    Pat::Ident(BindingIdent {
                        id: value_temp.clone(),
                        type_ann: None,
                    }),
                    Some(Box::new(Expr::Call(call.clone()))),
                ));
            } else if should_memoize_jsx_hoisted_call(call) {
                let local_bindings = HashSet::new();
                let deps = collect_dependencies_from_expr(
                    &Expr::Call(call.clone()),
                    self.known_bindings,
                    &local_bindings,
                );
                let mut compute_stmts = vec![assign_stmt(
                    AssignTarget::from(value_temp.clone()),
                    Box::new(Expr::Call(call.clone())),
                )];
                strip_runtime_call_type_args_in_stmts(&mut compute_stmts);
                self.transformed.extend(build_memoized_block(
                    self.cache_ident,
                    *self.next_slot,
                    &deps,
                    &value_temp,
                    compute_stmts,
                    true,
                ));
                *self.next_slot += deps.len() as u32 + 1;
                *self.memo_blocks += 1;
                *self.memo_values += 1;
            } else {
                self.transformed.push(make_var_decl(
                    VarDeclKind::Const,
                    Pat::Ident(BindingIdent {
                        id: value_temp.clone(),
                        type_ann: None,
                    }),
                    Some(Box::new(Expr::Call(call.clone()))),
                ));
            }
            self.known_bindings
                .insert(value_temp.sym.to_string(), false);
            *expr = Expr::Ident(value_temp);
        }
    }

    let mut hoister = Hoister {
        transformed,
        known_bindings,
        reserved,
        next_temp,
        cache_ident,
        next_slot,
        memo_blocks,
        memo_values,
    };
    return_expr.visit_mut_with(&mut hoister);
}

fn rewrite_result_binding_to_assignment(stmts: &mut [Stmt], name: &str) -> bool {
    for stmt in stmts {
        let Stmt::Decl(Decl::Var(var_decl)) = stmt else {
            continue;
        };
        let [declarator] = var_decl.decls.as_slice() else {
            continue;
        };
        let Pat::Ident(binding) = &declarator.name else {
            continue;
        };
        if binding.id.sym != name {
            continue;
        }
        if let Some(init) = &declarator.init {
            *stmt = assign_stmt(AssignTarget::from(binding.id.clone()), init.clone());
        } else {
            *stmt = Stmt::Empty(swc_ecma_ast::EmptyStmt { span: DUMMY_SP });
        }
        return true;
    }

    false
}

fn extract_const_decl_initializer(stmts: &mut Vec<Stmt>, name: &str) -> Option<Box<Expr>> {
    let mut index = 0usize;
    while index < stmts.len() {
        let Some(stmt) = stmts.get(index) else {
            break;
        };
        let Stmt::Decl(Decl::Var(var_decl)) = stmt else {
            index += 1;
            continue;
        };
        if var_decl.kind != VarDeclKind::Const {
            index += 1;
            continue;
        }
        let [declarator] = var_decl.decls.as_slice() else {
            index += 1;
            continue;
        };
        let Pat::Ident(binding) = &declarator.name else {
            index += 1;
            continue;
        };
        if binding.id.sym != name {
            index += 1;
            continue;
        }
        if binding_referenced_in_stmts(&stmts[index + 1..], name) {
            index += 1;
            continue;
        }
        let init = declarator.init.clone()?;
        stmts.remove(index);
        return Some(init);
    }

    None
}

fn normalize_static_string_members_in_stmts(stmts: &mut [Stmt]) {
    struct Normalizer;

    impl VisitMut for Normalizer {
        fn visit_mut_member_expr(&mut self, member: &mut MemberExpr) {
            member.visit_mut_children_with(self);

            let MemberProp::Computed(computed) = &member.prop else {
                return;
            };
            let Expr::Lit(Lit::Str(str_lit)) = &*computed.expr else {
                return;
            };
            let symbol = str_lit.value.to_string_lossy();

            if swc_ecma_ast::Ident::verify_symbol(symbol.as_ref()).is_ok() {
                member.prop = MemberProp::Ident(
                    Ident::new_no_ctxt(symbol.as_ref().into(), computed.span).into(),
                );
            }
        }
    }

    let mut normalizer = Normalizer;
    for stmt in stmts {
        stmt.visit_mut_with(&mut normalizer);
    }
}

fn normalize_reactive_labels(stmts: &mut [Stmt]) {
    struct LabelNormalizer {
        map: HashMap<String, String>,
        next_index: usize,
    }

    impl VisitMut for LabelNormalizer {
        fn visit_mut_labeled_stmt(&mut self, labeled: &mut LabeledStmt) {
            let old = labeled.label.sym.to_string();
            let new = self
                .map
                .entry(old)
                .or_insert_with(|| {
                    let name = format!("bb{}", self.next_index);
                    self.next_index += 1;
                    name
                })
                .clone();
            labeled.label.sym = new.into();
            labeled.visit_mut_children_with(self);
        }

        fn visit_mut_break_stmt(&mut self, break_stmt: &mut swc_ecma_ast::BreakStmt) {
            if let Some(label) = &mut break_stmt.label {
                if let Some(mapped) = self.map.get(label.sym.as_ref()) {
                    label.sym = mapped.clone().into();
                }
            }
        }
    }

    let mut normalizer = LabelNormalizer {
        map: HashMap::new(),
        next_index: 0,
    };
    for stmt in stmts {
        stmt.visit_mut_with(&mut normalizer);
    }
}

fn normalize_if_break_blocks(stmts: &mut [Stmt]) {
    struct IfBreakNormalizer;

    impl VisitMut for IfBreakNormalizer {
        fn visit_mut_if_stmt(&mut self, if_stmt: &mut IfStmt) {
            if_stmt.visit_mut_children_with(self);

            if matches!(&*if_stmt.cons, Stmt::Break(_)) {
                let original = *if_stmt.cons.clone();
                if_stmt.cons = Box::new(Stmt::Block(BlockStmt {
                    span: DUMMY_SP,
                    ctxt: Default::default(),
                    stmts: vec![original],
                }));
            }
        }
    }

    let mut normalizer = IfBreakNormalizer;
    for stmt in stmts {
        stmt.visit_mut_with(&mut normalizer);
    }
}

fn inline_trivial_iifes_in_stmts(stmts: &mut [Stmt]) {
    struct Inliner;

    impl VisitMut for Inliner {
        fn visit_mut_expr(&mut self, expr: &mut Expr) {
            expr.visit_mut_children_with(self);

            let Expr::Call(call) = expr else {
                return;
            };
            if !call.args.is_empty() {
                return;
            }

            let replacement = match &call.callee {
                Callee::Expr(callee_expr) => extract_iife_return_expr(callee_expr),
                _ => None,
            };

            if let Some(replacement) = replacement {
                *expr = *replacement;
            }
        }
    }

    let mut inliner = Inliner;
    for stmt in stmts {
        stmt.visit_mut_with(&mut inliner);
    }
}

fn strip_runtime_call_type_args_in_stmts(stmts: &mut [Stmt]) {
    struct TypeArgStripper;

    impl VisitMut for TypeArgStripper {
        fn visit_mut_expr(&mut self, expr: &mut Expr) {
            expr.visit_mut_children_with(self);

            match expr {
                Expr::Call(call) => {
                    call.type_args = None;
                }
                Expr::New(new_expr) => {
                    new_expr.type_args = None;
                }
                Expr::TaggedTpl(tagged) => {
                    tagged.type_params = None;
                }
                Expr::TsInstantiation(instantiation) => {
                    *expr = *instantiation.expr.clone();
                    expr.visit_mut_with(self);
                }
                _ => {}
            }
        }
    }

    let mut stripper = TypeArgStripper;
    for stmt in stmts {
        stmt.visit_mut_with(&mut stripper);
    }
}

fn extract_iife_return_expr(expr: &Expr) -> Option<Box<Expr>> {
    match expr {
        Expr::Paren(paren) => extract_iife_return_expr(&paren.expr),
        Expr::Arrow(arrow) if !arrow.is_async && !arrow.is_generator && arrow.params.is_empty() => {
            match &*arrow.body {
                swc_ecma_ast::BlockStmtOrExpr::Expr(value_expr) => Some(value_expr.clone()),
                swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) => {
                    if let [Stmt::Return(return_stmt)] = block.stmts.as_slice() {
                        return_stmt.arg.clone()
                    } else {
                        None
                    }
                }
            }
        }
        Expr::Fn(fn_expr)
            if !fn_expr.function.is_async
                && !fn_expr.function.is_generator
                && fn_expr.function.params.is_empty() =>
        {
            let body = fn_expr.function.body.as_ref()?;
            if let [Stmt::Return(return_stmt)] = body.stmts.as_slice() {
                return_stmt.arg.clone()
            } else {
                None
            }
        }
        _ => None,
    }
}

fn contains_return_stmt_in_stmts(stmts: &[Stmt]) -> bool {
    #[derive(Default)]
    struct Finder {
        found: bool,
    }

    impl Visit for Finder {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_return_stmt(&mut self, _: &swc_ecma_ast::ReturnStmt) {
            self.found = true;
        }
    }

    let mut finder = Finder::default();
    for stmt in stmts {
        stmt.visit_with(&mut finder);
        if finder.found {
            return true;
        }
    }
    false
}

fn rewrite_returns_for_labeled_block(
    stmts: Vec<Stmt>,
    label: &Ident,
    sentinel: &Ident,
) -> (Vec<Stmt>, bool) {
    let mut has_return = false;
    let rewritten = stmts
        .into_iter()
        .map(|stmt| rewrite_stmt_returns(stmt, label, sentinel, &mut has_return))
        .collect();
    (rewritten, has_return)
}

fn rewrite_stmt_returns(
    stmt: Stmt,
    label: &Ident,
    sentinel: &Ident,
    has_return: &mut bool,
) -> Stmt {
    match stmt {
        Stmt::Return(return_stmt) => {
            *has_return = true;
            Stmt::Block(BlockStmt {
                span: DUMMY_SP,
                ctxt: Default::default(),
                stmts: vec![
                    assign_stmt(
                        AssignTarget::from(sentinel.clone()),
                        return_stmt.arg.unwrap_or_else(|| {
                            Box::new(Expr::Ident(Ident::new_no_ctxt(
                                "undefined".into(),
                                DUMMY_SP,
                            )))
                        }),
                    ),
                    Stmt::Break(swc_ecma_ast::BreakStmt {
                        span: DUMMY_SP,
                        label: Some(label.clone()),
                    }),
                ],
            })
        }
        Stmt::Block(mut block) => {
            let mut rewritten = Vec::with_capacity(block.stmts.len());
            for stmt in block.stmts {
                if let Stmt::Return(return_stmt) = stmt {
                    *has_return = true;
                    rewritten.push(assign_stmt(
                        AssignTarget::from(sentinel.clone()),
                        return_stmt.arg.unwrap_or_else(|| {
                            Box::new(Expr::Ident(Ident::new_no_ctxt(
                                "undefined".into(),
                                DUMMY_SP,
                            )))
                        }),
                    ));
                    rewritten.push(Stmt::Break(swc_ecma_ast::BreakStmt {
                        span: DUMMY_SP,
                        label: Some(label.clone()),
                    }));
                } else {
                    rewritten.push(rewrite_stmt_returns(stmt, label, sentinel, has_return));
                }
            }
            block.stmts = rewritten;
            Stmt::Block(block)
        }
        Stmt::If(mut if_stmt) => {
            if_stmt.cons = Box::new(rewrite_stmt_returns(
                *if_stmt.cons,
                label,
                sentinel,
                has_return,
            ));
            if_stmt.alt = if_stmt
                .alt
                .map(|alt| Box::new(rewrite_stmt_returns(*alt, label, sentinel, has_return)));
            Stmt::If(if_stmt)
        }
        Stmt::Labeled(mut labeled) => {
            labeled.body = Box::new(rewrite_stmt_returns(
                *labeled.body,
                label,
                sentinel,
                has_return,
            ));
            Stmt::Labeled(labeled)
        }
        Stmt::With(mut with_stmt) => {
            with_stmt.body = Box::new(rewrite_stmt_returns(
                *with_stmt.body,
                label,
                sentinel,
                has_return,
            ));
            Stmt::With(with_stmt)
        }
        Stmt::While(mut while_stmt) => {
            while_stmt.body = Box::new(rewrite_stmt_returns(
                *while_stmt.body,
                label,
                sentinel,
                has_return,
            ));
            Stmt::While(while_stmt)
        }
        Stmt::DoWhile(mut do_while) => {
            do_while.body = Box::new(rewrite_stmt_returns(
                *do_while.body,
                label,
                sentinel,
                has_return,
            ));
            Stmt::DoWhile(do_while)
        }
        Stmt::For(mut for_stmt) => {
            for_stmt.body = Box::new(rewrite_stmt_returns(
                *for_stmt.body,
                label,
                sentinel,
                has_return,
            ));
            Stmt::For(for_stmt)
        }
        Stmt::ForIn(mut for_in) => {
            for_in.body = Box::new(rewrite_stmt_returns(
                *for_in.body,
                label,
                sentinel,
                has_return,
            ));
            Stmt::ForIn(for_in)
        }
        Stmt::ForOf(mut for_of) => {
            for_of.body = Box::new(rewrite_stmt_returns(
                *for_of.body,
                label,
                sentinel,
                has_return,
            ));
            Stmt::ForOf(for_of)
        }
        Stmt::Switch(mut switch_stmt) => {
            for case in &mut switch_stmt.cases {
                case.cons = std::mem::take(&mut case.cons)
                    .into_iter()
                    .map(|stmt| rewrite_stmt_returns(stmt, label, sentinel, has_return))
                    .collect();
            }
            Stmt::Switch(switch_stmt)
        }
        Stmt::Try(mut try_stmt) => {
            try_stmt.block.stmts = std::mem::take(&mut try_stmt.block.stmts)
                .into_iter()
                .map(|stmt| rewrite_stmt_returns(stmt, label, sentinel, has_return))
                .collect();
            if let Some(handler) = &mut try_stmt.handler {
                handler.body.stmts = std::mem::take(&mut handler.body.stmts)
                    .into_iter()
                    .map(|stmt| rewrite_stmt_returns(stmt, label, sentinel, has_return))
                    .collect();
            }
            if let Some(finalizer) = &mut try_stmt.finalizer {
                finalizer.stmts = std::mem::take(&mut finalizer.stmts)
                    .into_iter()
                    .map(|stmt| rewrite_stmt_returns(stmt, label, sentinel, has_return))
                    .collect();
            }
            Stmt::Try(try_stmt)
        }
        other => other,
    }
}

fn prune_redundant_result_preinit(stmts: &mut Vec<Stmt>, result: &Ident) {
    let Some(Stmt::Expr(expr_stmt)) = stmts.first() else {
        return;
    };
    let Expr::Assign(assign) = &*expr_stmt.expr else {
        return;
    };
    if assign.op != op!("=") {
        return;
    }
    let Some(target) = assign.left.as_ident() else {
        return;
    };
    if target.id.sym != result.sym {
        return;
    }

    let is_nullish_init = match &*assign.right {
        Expr::Lit(Lit::Null(_)) => true,
        Expr::Ident(ident) if ident.sym == "undefined" => true,
        _ => false,
    };
    if !is_nullish_init {
        return;
    }
    if !has_assignment_to_binding(&stmts[1..], result.sym.as_ref()) {
        return;
    }

    stmts.remove(0);
}

fn has_assignment_to_binding(stmts: &[Stmt], name: &str) -> bool {
    #[derive(Default)]
    struct Finder<'a> {
        name: &'a str,
        found: bool,
    }

    impl Visit for Finder<'_> {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_assign_expr(&mut self, assign: &AssignExpr) {
            if let Some(binding) = assign.left.as_ident() {
                if binding.id.sym == self.name {
                    self.found = true;
                    return;
                }
            }
            assign.visit_children_with(self);
        }
    }

    let mut finder = Finder { name, found: false };
    for stmt in stmts {
        stmt.visit_with(&mut finder);
        if finder.found {
            return true;
        }
    }
    false
}

fn fresh_ident(base: &str, used: &mut HashSet<String>) -> Ident {
    if !used.contains(base) {
        used.insert(base.to_string());
        return Ident::new_no_ctxt(base.into(), DUMMY_SP);
    }

    let mut index = 1u32;
    loop {
        let candidate = format!("{base}_{index}");
        if !used.contains(&candidate) {
            used.insert(candidate.clone());
            return Ident::new_no_ctxt(candidate.into(), DUMMY_SP);
        }
        index += 1;
    }
}

fn make_var_decl(kind: VarDeclKind, name: Pat, init: Option<Box<Expr>>) -> Stmt {
    Stmt::Decl(swc_ecma_ast::Decl::Var(Box::new(VarDecl {
        span: DUMMY_SP,
        ctxt: Default::default(),
        kind,
        declare: false,
        decls: vec![VarDeclarator {
            span: DUMMY_SP,
            name,
            init,
            definite: false,
        }],
    })))
}

fn assign_stmt(left: AssignTarget, right: Box<Expr>) -> Stmt {
    Stmt::Expr(ExprStmt {
        span: DUMMY_SP,
        expr: Box::new(Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            op: op!("="),
            left,
            right,
        })),
    })
}

fn make_cache_member(cache_ident: &Ident, index: u32) -> MemberExpr {
    MemberExpr {
        span: DUMMY_SP,
        obj: Box::new(Expr::Ident(cache_ident.clone())),
        prop: MemberProp::Computed(ComputedPropName {
            span: DUMMY_SP,
            expr: Box::new(Expr::Lit(Lit::Num(Number {
                span: DUMMY_SP,
                value: index as f64,
                raw: None,
            }))),
        }),
    }
}

fn make_cache_index_expr(cache_ident: &Ident, index: u32) -> Box<Expr> {
    Box::new(Expr::Member(make_cache_member(cache_ident, index)))
}

fn collect_pattern_bindings(pat: &Pat, out: &mut HashSet<String>) {
    match pat {
        Pat::Ident(binding) => {
            out.insert(binding.id.sym.to_string());
        }
        Pat::Array(array) => {
            for item in array.elems.iter().flatten() {
                collect_pattern_bindings(item, out);
            }
        }
        Pat::Object(object) => {
            for prop in &object.props {
                match prop {
                    swc_ecma_ast::ObjectPatProp::Assign(assign) => {
                        out.insert(assign.key.sym.to_string());
                    }
                    swc_ecma_ast::ObjectPatProp::KeyValue(kv) => {
                        collect_pattern_bindings(&kv.value, out);
                    }
                    swc_ecma_ast::ObjectPatProp::Rest(rest) => {
                        collect_pattern_bindings(&rest.arg, out);
                    }
                }
            }
        }
        Pat::Assign(assign) => collect_pattern_bindings(&assign.left, out),
        Pat::Rest(rest) => collect_pattern_bindings(&rest.arg, out),
        _ => {}
    }
}

fn collect_stmt_bindings(stmt: &Stmt, out: &mut HashSet<String>) {
    match stmt {
        Stmt::Decl(swc_ecma_ast::Decl::Var(var_decl)) => {
            for decl in &var_decl.decls {
                collect_pattern_bindings(&decl.name, out);
            }
        }
        Stmt::Decl(swc_ecma_ast::Decl::Fn(fn_decl)) => {
            out.insert(fn_decl.ident.sym.to_string());
        }
        Stmt::Decl(swc_ecma_ast::Decl::Class(class_decl)) => {
            out.insert(class_decl.ident.sym.to_string());
        }
        _ => {}
    }
}

fn collect_pattern_binding_names(pat: &Pat) -> Vec<String> {
    let mut bindings = HashSet::new();
    collect_pattern_bindings(pat, &mut bindings);
    bindings.into_iter().collect()
}

fn binding_declared_in_stmts(stmts: &[Stmt], name: &str) -> bool {
    let mut bindings = HashSet::new();
    for stmt in stmts {
        collect_stmt_bindings(stmt, &mut bindings);
    }
    bindings.contains(name)
}
