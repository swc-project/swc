use std::collections::{HashMap, HashSet, VecDeque};

use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    op, ArrowExpr, AssignExpr, AssignTarget, BindingIdent, BlockStmt, CallExpr, Callee,
    ComputedPropName, Decl, Expr, ExprOrSpread, ExprStmt, Function, Ident, IfStmt, KeyValueProp,
    LabeledStmt, Lit, MemberExpr, MemberProp, Number, ObjectPatProp, OptChainBase, OptChainExpr,
    Pat, Prop, PropName, PropOrSpread, Stmt, SwitchStmt, VarDecl, VarDeclKind, VarDeclarator,
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

/// Applies the same nested binding conflict normalization used by reactive
/// scope memoization to lint-mode output, where we don't emit rewritten code.
pub fn normalize_lint_function_bindings(function: &mut Function) {
    let Some(body) = &mut function.body else {
        return;
    };

    let mut top_level_bindings = HashSet::new();
    for param in &function.params {
        collect_pattern_bindings(&param.pat, &mut top_level_bindings);
    }
    for stmt in &body.stmts {
        collect_stmt_bindings(stmt, &mut top_level_bindings);
    }

    normalize_duplicate_id_bindings_in_nested_functions(&mut body.stmts, &top_level_bindings);
}

/// Arrow variant of `normalize_lint_function_bindings`.
pub fn normalize_lint_arrow_bindings(arrow: &mut ArrowExpr) {
    let swc_ecma_ast::BlockStmtOrExpr::BlockStmt(body) = &mut *arrow.body else {
        return;
    };

    let mut top_level_bindings = HashSet::new();
    for param in &arrow.params {
        collect_pattern_bindings(param, &mut top_level_bindings);
    }
    for stmt in &body.stmts {
        collect_stmt_bindings(stmt, &mut top_level_bindings);
    }

    normalize_duplicate_id_bindings_in_nested_functions(&mut body.stmts, &top_level_bindings);
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
    let const_global_alias_bindings =
        collect_inlineable_const_global_alias_bindings(&reactive.body.stmts, &outer_bindings);

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
        if !const_global_alias_bindings.is_empty() {
            inline_const_alias_bindings_in_expr(init, &const_global_alias_bindings);
        }

        let (mut params, mut body, is_async, is_generator, captures_outer, keep_if_alias_pruned) =
            match &mut **init {
                Expr::Arrow(arrow) => {
                    let body = match &*arrow.body {
                        swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) => block.clone(),
                        swc_ecma_ast::BlockStmtOrExpr::Expr(expr) => BlockStmt {
                            span: DUMMY_SP,
                            ctxt: Default::default(),
                            stmts: vec![Stmt::Return(swc_ecma_ast::ReturnStmt {
                                span: DUMMY_SP,
                                arg: Some(normalize_arrow_body_expr(*expr.clone())),
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
                        false,
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
                        false,
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
                                        arg: Some(normalize_arrow_body_expr(*expr.clone())),
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
                                true,
                            )
                        }
                        Expr::Fn(fn_expr) => {
                            let function = &fn_expr.function;
                            let body = function.body.clone().unwrap_or_default();
                            let captures =
                                function_captures_outer_bindings(function, &outer_bindings);
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
                                true,
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
        normalize_outlined_params(&mut params, &mut body, &mut used_names);
        normalize_empty_jsx_elements_to_self_closing_in_stmts(&mut body.stmts);
        prune_unused_function_like_decls(&mut body);
        let nested_outer_bindings = collect_function_outer_bindings(&params, &body);
        for stmt in &mut body.stmts {
            outline_non_capturing_inline_functions_in_stmt(
                stmt,
                &nested_outer_bindings,
                &mut used_names,
                &mut outlined,
            );
        }

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

        decl.init = Some(Box::new(Expr::Ident(outlined_id.clone())));
        outlined_aliases.push((
            stmt_index,
            binding.id.sym.to_string(),
            outlined_id.sym.to_string(),
            keep_if_alias_pruned,
        ));
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

        let (mut params, mut body, is_async, is_generator, captures_outer) =
            match &*callback_arg.expr {
                Expr::Arrow(arrow) => {
                    let body = match &*arrow.body {
                        swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) => block.clone(),
                        swc_ecma_ast::BlockStmtOrExpr::Expr(expr) => BlockStmt {
                            span: DUMMY_SP,
                            ctxt: Default::default(),
                            stmts: vec![Stmt::Return(swc_ecma_ast::ReturnStmt {
                                span: DUMMY_SP,
                                arg: Some(normalize_arrow_body_expr(*expr.clone())),
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
        normalize_outlined_params(&mut params, &mut body, &mut used_names);
        normalize_empty_jsx_elements_to_self_closing_in_stmts(&mut body.stmts);
        prune_unused_function_like_decls(&mut body);
        let nested_outer_bindings = collect_function_outer_bindings(&params, &body);
        for stmt in &mut body.stmts {
            outline_non_capturing_inline_functions_in_stmt(
                stmt,
                &nested_outer_bindings,
                &mut used_names,
                &mut outlined,
            );
        }

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

    for stmt in &mut reactive.body.stmts {
        outline_non_capturing_inline_functions_in_stmt(
            stmt,
            &outer_bindings,
            &mut used_names,
            &mut outlined,
        );
    }

    let mut outlined_index = 0usize;
    while outlined_index < outlined.len() {
        let function_outer_bindings = collect_function_outer_bindings(
            &outlined[outlined_index].function.params,
            &outlined[outlined_index].function.body,
        );
        let mut body_stmts = std::mem::take(&mut outlined[outlined_index].function.body.stmts);
        for stmt in &mut body_stmts {
            outline_non_capturing_inline_functions_in_stmt(
                stmt,
                &function_outer_bindings,
                &mut used_names,
                &mut outlined,
            );
        }
        normalize_empty_jsx_elements_to_self_closing_in_stmts(&mut body_stmts);
        outlined[outlined_index].function.body.stmts = body_stmts;
        outlined_index += 1;
    }

    let mut removed_outlined_ids = HashSet::new();
    for (stmt_index, binding_name, outlined_id, keep_if_alias_pruned) in
        outlined_aliases.into_iter().rev()
    {
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
            if !keep_if_alias_pruned {
                removed_outlined_ids.insert(outlined_id);
            }
        }
    }

    if !removed_outlined_ids.is_empty() {
        outlined.retain(|outlined_fn| {
            let Some(id) = &outlined_fn.function.id else {
                return true;
            };
            !removed_outlined_ids.contains(id.sym.as_ref())
        });
    }

    outlined.reverse();
    outlined
}

fn collect_function_outer_bindings(params: &[Pat], body: &BlockStmt) -> HashSet<String> {
    let mut outer_bindings = HashSet::new();
    for param in params {
        collect_pattern_bindings(param, &mut outer_bindings);
    }
    for stmt in &body.stmts {
        collect_stmt_bindings(stmt, &mut outer_bindings);
    }
    outer_bindings
}

fn outline_non_capturing_inline_functions_in_stmt(
    stmt: &mut Stmt,
    outer_bindings: &HashSet<String>,
    used_names: &mut HashSet<String>,
    outlined: &mut Vec<OutlinedFunction>,
) {
    struct Outliner<'a> {
        outer_bindings: &'a HashSet<String>,
        used_names: &'a mut HashSet<String>,
        outlined: &'a mut Vec<OutlinedFunction>,
    }

    impl VisitMut for Outliner<'_> {
        fn visit_mut_call_expr(&mut self, call: &mut CallExpr) {
            call.visit_mut_children_with(self);
            outline_non_capturing_call_args(
                call,
                self.outer_bindings,
                self.used_names,
                self.outlined,
            );
        }

        fn visit_mut_assign_expr(&mut self, assign: &mut AssignExpr) {
            assign.visit_mut_children_with(self);
            try_outline_non_capturing_function_expr(
                &mut assign.right,
                self.outer_bindings,
                self.used_names,
                self.outlined,
            );
        }

        fn visit_mut_prop(&mut self, prop: &mut Prop) {
            prop.visit_mut_children_with(self);
            let Prop::KeyValue(key_value) = prop else {
                return;
            };
            try_outline_non_capturing_function_expr(
                &mut key_value.value,
                self.outer_bindings,
                self.used_names,
                self.outlined,
            );
        }

        fn visit_mut_assign_pat(&mut self, assign_pat: &mut swc_ecma_ast::AssignPat) {
            assign_pat.visit_mut_children_with(self);
            try_outline_non_capturing_function_expr(
                &mut assign_pat.right,
                self.outer_bindings,
                self.used_names,
                self.outlined,
            );
        }

        fn visit_mut_array_lit(&mut self, array: &mut swc_ecma_ast::ArrayLit) {
            array.visit_mut_children_with(self);
            for elem in array.elems.iter_mut().flatten() {
                if elem.spread.is_some() {
                    continue;
                }
                try_outline_non_capturing_function_expr(
                    &mut elem.expr,
                    self.outer_bindings,
                    self.used_names,
                    self.outlined,
                );
            }
        }

        fn visit_mut_cond_expr(&mut self, cond: &mut swc_ecma_ast::CondExpr) {
            cond.visit_mut_children_with(self);
            try_outline_non_capturing_function_expr(
                &mut cond.cons,
                self.outer_bindings,
                self.used_names,
                self.outlined,
            );
            try_outline_non_capturing_function_expr(
                &mut cond.alt,
                self.outer_bindings,
                self.used_names,
                self.outlined,
            );
        }
    }

    let mut outliner = Outliner {
        outer_bindings,
        used_names,
        outlined,
    };
    stmt.visit_mut_with(&mut outliner);
}

fn try_outline_non_capturing_function_expr(
    expr: &mut Box<Expr>,
    outer_bindings: &HashSet<String>,
    used_names: &mut HashSet<String>,
    outlined: &mut Vec<OutlinedFunction>,
) -> bool {
    let (mut params, mut body, is_async, is_generator, captures_outer) = match &**expr {
        Expr::Arrow(arrow) => {
            let body = match &*arrow.body {
                swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) => block.clone(),
                swc_ecma_ast::BlockStmtOrExpr::Expr(expr) => BlockStmt {
                    span: DUMMY_SP,
                    ctxt: Default::default(),
                    stmts: vec![Stmt::Return(swc_ecma_ast::ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(normalize_arrow_body_expr(*expr.clone())),
                    })],
                },
            };

            let captures = arrow_captures_outer_bindings(arrow, outer_bindings);
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
            let captures = function_captures_outer_bindings(function, outer_bindings);
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
        _ => return false,
    };

    if captures_outer {
        return false;
    }

    normalize_outlined_params(&mut params, &mut body, used_names);
    prune_unused_function_like_decls(&mut body);
    let outlined_id = fresh_ident("_temp", used_names);
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
    *expr = Box::new(Expr::Ident(outlined_id));
    true
}

fn outline_non_capturing_call_args(
    call: &mut CallExpr,
    outer_bindings: &HashSet<String>,
    used_names: &mut HashSet<String>,
    outlined: &mut Vec<OutlinedFunction>,
) {
    if call_has_hook_callee(call) && !call_is_outlineable_hook_call(call) {
        return;
    }

    for arg in &mut call.args {
        if arg.spread.is_some() {
            continue;
        }
        try_outline_non_capturing_function_expr(
            &mut arg.expr,
            outer_bindings,
            used_names,
            outlined,
        );
    }
}

fn call_is_outlineable_hook_call(call: &CallExpr) -> bool {
    let Callee::Expr(callee_expr) = &call.callee else {
        return false;
    };

    match unwrap_transparent_expr(callee_expr) {
        Expr::Ident(callee) => matches!(callee.sym.as_ref(), "useCallback"),
        Expr::Member(member) => {
            matches!(&*member.obj, Expr::Ident(object) if object.sym == "React")
                && matches!(
                    &member.prop,
                    MemberProp::Ident(property)
                        if matches!(property.sym.as_ref(), "useCallback")
                )
        }
        _ => false,
    }
}

fn normalize_outlined_params(
    params: &mut [Pat],
    body: &mut BlockStmt,
    used_names: &mut HashSet<String>,
) {
    for param in params {
        let Pat::Ident(binding) = param else {
            continue;
        };
        let original_name = binding.id.sym.to_string();
        if !used_names.contains(&original_name) {
            continue;
        }

        let mut suffix = 0u32;
        let replacement = loop {
            let candidate = format!("{original_name}_{suffix}");
            if !used_names.contains(&candidate) {
                break candidate;
            }
            suffix += 1;
        };

        rename_ident_in_block(body, &original_name, &replacement);
        binding.id.sym = replacement.clone().into();
        used_names.insert(replacement);
    }

    let mut block_bindings = HashSet::new();
    for stmt in &body.stmts {
        collect_stmt_bindings(stmt, &mut block_bindings);
    }
    let mut conflicts = block_bindings
        .into_iter()
        .filter(|name| used_names.contains(name))
        .collect::<Vec<_>>();
    conflicts.sort();

    for original_name in conflicts {
        let mut suffix = 0u32;
        let replacement = loop {
            let candidate = format!("{original_name}_{suffix}");
            if !used_names.contains(&candidate) {
                break candidate;
            }
            suffix += 1;
        };

        rename_ident_in_block(body, &original_name, &replacement);
        used_names.insert(replacement);
    }
}

fn rename_ident_in_block(body: &mut BlockStmt, from: &str, to: &str) {
    struct Renamer<'a> {
        from: &'a str,
        to: &'a str,
    }

    impl VisitMut for Renamer<'_> {
        fn visit_mut_arrow_expr(&mut self, _: &mut ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_mut_function(&mut self, _: &mut Function) {
            // Skip nested functions.
        }

        fn visit_mut_ident(&mut self, ident: &mut Ident) {
            if ident.sym == self.from {
                ident.sym = self.to.into();
            }
        }
    }

    let mut renamer = Renamer { from, to };
    body.visit_mut_with(&mut renamer);
}

fn rename_ident_in_nested_functions_without_param_shadow(
    body: &mut BlockStmt,
    from: &str,
    to: &str,
) {
    struct Renamer<'a> {
        from: &'a str,
        to: &'a str,
    }

    impl VisitMut for Renamer<'_> {
        fn visit_mut_function(&mut self, function: &mut Function) {
            let mut param_bindings = HashSet::new();
            for param in &function.params {
                collect_pattern_bindings(&param.pat, &mut param_bindings);
            }
            if param_bindings.contains(self.from) {
                return;
            }
            if let Some(body) = &mut function.body {
                body.visit_mut_children_with(self);
            }
        }

        fn visit_mut_arrow_expr(&mut self, arrow: &mut ArrowExpr) {
            let mut param_bindings = HashSet::new();
            for pat in &arrow.params {
                collect_pattern_bindings(pat, &mut param_bindings);
            }
            if param_bindings.contains(self.from) {
                return;
            }
            arrow.visit_mut_children_with(self);
        }

        fn visit_mut_ident(&mut self, ident: &mut Ident) {
            if ident.sym == self.from {
                ident.sym = self.to.into();
            }
        }
    }

    let mut renamer = Renamer { from, to };
    for stmt in &mut body.stmts {
        stmt.visit_mut_with(&mut renamer);
    }
}

fn preserve_shorthand_property_keys_for_rename_in_block(
    body: &mut BlockStmt,
    from: &str,
    to: &str,
) {
    struct Rewriter<'a> {
        from: &'a str,
        to: &'a str,
    }

    impl VisitMut for Rewriter<'_> {
        fn visit_mut_arrow_expr(&mut self, _: &mut ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_mut_function(&mut self, _: &mut Function) {
            // Skip nested functions.
        }

        fn visit_mut_prop(&mut self, prop: &mut Prop) {
            prop.visit_mut_children_with(self);

            let Prop::Shorthand(ident) = prop else {
                return;
            };
            if ident.sym.as_ref() != self.to {
                return;
            }

            let value_ident = ident.clone();
            *prop = Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(swc_ecma_ast::IdentName::new(self.from.into(), ident.span)),
                value: Box::new(Expr::Ident(value_ident)),
            });
        }
    }

    let mut rewriter = Rewriter { from, to };
    body.visit_mut_with(&mut rewriter);
}

fn normalize_duplicate_id_bindings_in_nested_functions(
    stmts: &mut [Stmt],
    top_level_bindings: &HashSet<String>,
) {
    struct Renamer {
        scope_bindings: Vec<HashSet<String>>,
        next_suffix: HashMap<String, u32>,
        inside_call_arg: bool,
        seen_first_id_binding: bool,
        next_id_suffix: u32,
        next_param_temp: u32,
    }

    impl Renamer {
        fn rename_conflicting_bindings_in_block(&mut self, body: &mut BlockStmt) {
            let mut block_bindings = HashSet::new();
            for stmt in &body.stmts {
                collect_stmt_bindings(stmt, &mut block_bindings);
            }
            if block_bindings.is_empty() {
                return;
            }

            let mut taken = HashSet::new();
            for scope in &self.scope_bindings {
                taken.extend(scope.iter().cloned());
            }
            if taken.is_empty() {
                return;
            }

            let mut conflicting = block_bindings
                .iter()
                .filter(|name| taken.contains(name.as_str()))
                .cloned()
                .collect::<Vec<_>>();
            conflicting.sort();

            for name in conflicting {
                let suffix_entry = self.next_suffix.entry(name.clone()).or_insert(0);
                let replacement = loop {
                    let candidate = format!("{name}_{}", *suffix_entry);
                    *suffix_entry += 1;
                    if !taken.contains(candidate.as_str()) && !block_bindings.contains(&candidate) {
                        break candidate;
                    }
                };

                rename_ident_in_block(body, name.as_str(), replacement.as_str());
                rename_ident_in_nested_functions_without_param_shadow(
                    body,
                    name.as_str(),
                    replacement.as_str(),
                );
                preserve_shorthand_property_keys_for_rename_in_block(
                    body,
                    name.as_str(),
                    replacement.as_str(),
                );
                block_bindings.remove(name.as_str());
                block_bindings.insert(replacement.clone());
                taken.insert(replacement);
            }

            if block_bindings.contains("id") {
                if !self.seen_first_id_binding {
                    self.seen_first_id_binding = true;
                    return;
                }

                let replacement = loop {
                    let candidate = format!("id_{}", self.next_id_suffix);
                    self.next_id_suffix += 1;
                    if !taken.contains(candidate.as_str()) && !block_bindings.contains(&candidate) {
                        break candidate;
                    }
                };

                rename_ident_in_block(body, "id", replacement.as_str());
                rename_ident_in_nested_functions_without_param_shadow(
                    body,
                    "id",
                    replacement.as_str(),
                );
                preserve_shorthand_property_keys_for_rename_in_block(
                    body,
                    "id",
                    replacement.as_str(),
                );
                block_bindings.remove("id");
                block_bindings.insert(replacement.clone());
                taken.insert(replacement);
            }
        }
    }

    impl VisitMut for Renamer {
        fn visit_mut_block_stmt(&mut self, block: &mut BlockStmt) {
            if self.inside_call_arg {
                for stmt in &mut block.stmts {
                    stmt.visit_mut_with(self);
                }
                return;
            }

            self.rename_conflicting_bindings_in_block(block);

            let mut local_bindings = HashSet::new();
            for stmt in &block.stmts {
                collect_stmt_bindings(stmt, &mut local_bindings);
            }

            self.scope_bindings.push(local_bindings);
            for stmt in &mut block.stmts {
                stmt.visit_mut_with(self);
            }
            self.scope_bindings.pop();
        }

        fn visit_mut_call_expr(&mut self, call: &mut CallExpr) {
            call.callee.visit_mut_with(self);
            let skip_arg_renaming = matches!(
                &call.callee,
                Callee::Expr(callee_expr)
                    if matches!(
                        unwrap_transparent_expr(callee_expr),
                        Expr::Ident(callee) if matches!(callee.sym.as_ref(), "useMemo" | "useCallback")
                    )
            );
            for arg in &mut call.args {
                let prev = self.inside_call_arg;
                self.inside_call_arg = skip_arg_renaming;
                arg.visit_mut_with(self);
                self.inside_call_arg = prev;
            }
        }

        fn visit_mut_arrow_expr(&mut self, arrow: &mut ArrowExpr) {
            let swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) = &mut *arrow.body else {
                return;
            };
            if self.inside_call_arg {
                for stmt in &mut block.stmts {
                    stmt.visit_mut_with(self);
                }
                return;
            }
            let mut taken = HashSet::new();
            for scope in &self.scope_bindings {
                taken.extend(scope.iter().cloned());
            }
            let mut param_prologue = Vec::new();
            for param in &mut arrow.params {
                match param {
                    Pat::Ident(binding) => {
                        if !taken.contains(binding.id.sym.as_ref()) {
                            continue;
                        }
                        let original = binding.id.sym.to_string();
                        let suffix_entry = self.next_suffix.entry(original.clone()).or_insert(0);
                        let replacement = loop {
                            let candidate = format!("{original}_{}", *suffix_entry);
                            *suffix_entry += 1;
                            if !taken.contains(candidate.as_str()) {
                                break candidate;
                            }
                        };
                        binding.id.sym = replacement.clone().into();
                        rename_ident_in_block(block, original.as_str(), replacement.as_str());
                        rename_ident_in_nested_functions_without_param_shadow(
                            block,
                            original.as_str(),
                            replacement.as_str(),
                        );
                        taken.insert(replacement);
                    }
                    Pat::Assign(assign_pat) => {
                        let Pat::Ident(binding) = &mut *assign_pat.left else {
                            continue;
                        };

                        let original = binding.id.sym.to_string();
                        let binding_name = if taken.contains(original.as_str()) {
                            let suffix_entry =
                                self.next_suffix.entry(original.clone()).or_insert(0);
                            loop {
                                let candidate = format!("{original}_{}", *suffix_entry);
                                *suffix_entry += 1;
                                if !taken.contains(candidate.as_str()) {
                                    break candidate;
                                }
                            }
                        } else {
                            original.clone()
                        };

                        if binding_name != original {
                            binding.id.sym = binding_name.clone().into();
                            rename_ident_in_block(block, original.as_str(), binding_name.as_str());
                            rename_ident_in_nested_functions_without_param_shadow(
                                block,
                                original.as_str(),
                                binding_name.as_str(),
                            );
                        }

                        let temp_name = loop {
                            let candidate = format!("t{}", self.next_param_temp);
                            self.next_param_temp += 1;
                            if !taken.contains(candidate.as_str()) {
                                break candidate;
                            }
                        };
                        let temp_ident = Ident::new_no_ctxt(temp_name.clone().into(), DUMMY_SP);
                        let default_expr = assign_pat.right.clone();
                        *param = Pat::Ident(BindingIdent {
                            id: temp_ident.clone(),
                            type_ann: None,
                        });

                        param_prologue.push(make_var_decl(
                            VarDeclKind::Const,
                            Pat::Ident(BindingIdent {
                                id: Ident::new_no_ctxt(binding_name.clone().into(), DUMMY_SP),
                                type_ann: None,
                            }),
                            Some(Box::new(Expr::Cond(swc_ecma_ast::CondExpr {
                                span: DUMMY_SP,
                                test: Box::new(Expr::Bin(swc_ecma_ast::BinExpr {
                                    span: DUMMY_SP,
                                    op: op!("==="),
                                    left: Box::new(Expr::Ident(temp_ident.clone())),
                                    right: Box::new(Expr::Ident(Ident::new_no_ctxt(
                                        "undefined".into(),
                                        DUMMY_SP,
                                    ))),
                                })),
                                cons: default_expr,
                                alt: Box::new(Expr::Ident(temp_ident.clone())),
                            }))),
                        ));

                        taken.insert(temp_name);
                        taken.insert(binding_name);
                    }
                    _ => {}
                }
            }
            self.rename_conflicting_bindings_in_block(block);
            if !param_prologue.is_empty() {
                let mut rewritten = param_prologue;
                rewritten.extend(std::mem::take(&mut block.stmts));
                block.stmts = rewritten;
            }

            let mut local_bindings = HashSet::new();
            for param in &arrow.params {
                collect_pattern_bindings(param, &mut local_bindings);
            }
            for stmt in &block.stmts {
                collect_stmt_bindings(stmt, &mut local_bindings);
            }
            self.scope_bindings.push(local_bindings);
            for stmt in &mut block.stmts {
                stmt.visit_mut_with(self);
            }
            self.scope_bindings.pop();
        }

        fn visit_mut_function(&mut self, function: &mut Function) {
            let Some(body) = &mut function.body else {
                return;
            };
            if self.inside_call_arg {
                for stmt in &mut body.stmts {
                    stmt.visit_mut_with(self);
                }
                return;
            }
            let mut taken = HashSet::new();
            for scope in &self.scope_bindings {
                taken.extend(scope.iter().cloned());
            }
            let mut param_prologue = Vec::new();
            for param in &mut function.params {
                match &mut param.pat {
                    Pat::Ident(binding) => {
                        if !taken.contains(binding.id.sym.as_ref()) {
                            continue;
                        }
                        let original = binding.id.sym.to_string();
                        let suffix_entry = self.next_suffix.entry(original.clone()).or_insert(0);
                        let replacement = loop {
                            let candidate = format!("{original}_{}", *suffix_entry);
                            *suffix_entry += 1;
                            if !taken.contains(candidate.as_str()) {
                                break candidate;
                            }
                        };
                        binding.id.sym = replacement.clone().into();
                        rename_ident_in_block(body, original.as_str(), replacement.as_str());
                        rename_ident_in_nested_functions_without_param_shadow(
                            body,
                            original.as_str(),
                            replacement.as_str(),
                        );
                        taken.insert(replacement);
                    }
                    Pat::Assign(assign_pat) => {
                        let Pat::Ident(binding) = &mut *assign_pat.left else {
                            continue;
                        };

                        let original = binding.id.sym.to_string();
                        let binding_name = if taken.contains(original.as_str()) {
                            let suffix_entry =
                                self.next_suffix.entry(original.clone()).or_insert(0);
                            loop {
                                let candidate = format!("{original}_{}", *suffix_entry);
                                *suffix_entry += 1;
                                if !taken.contains(candidate.as_str()) {
                                    break candidate;
                                }
                            }
                        } else {
                            original.clone()
                        };

                        if binding_name != original {
                            binding.id.sym = binding_name.clone().into();
                            rename_ident_in_block(body, original.as_str(), binding_name.as_str());
                            rename_ident_in_nested_functions_without_param_shadow(
                                body,
                                original.as_str(),
                                binding_name.as_str(),
                            );
                        }

                        let temp_name = loop {
                            let candidate = format!("t{}", self.next_param_temp);
                            self.next_param_temp += 1;
                            if !taken.contains(candidate.as_str()) {
                                break candidate;
                            }
                        };
                        let temp_ident = Ident::new_no_ctxt(temp_name.clone().into(), DUMMY_SP);
                        let default_expr = assign_pat.right.clone();
                        param.pat = Pat::Ident(BindingIdent {
                            id: temp_ident.clone(),
                            type_ann: None,
                        });

                        param_prologue.push(make_var_decl(
                            VarDeclKind::Const,
                            Pat::Ident(BindingIdent {
                                id: Ident::new_no_ctxt(binding_name.clone().into(), DUMMY_SP),
                                type_ann: None,
                            }),
                            Some(Box::new(Expr::Cond(swc_ecma_ast::CondExpr {
                                span: DUMMY_SP,
                                test: Box::new(Expr::Bin(swc_ecma_ast::BinExpr {
                                    span: DUMMY_SP,
                                    op: op!("==="),
                                    left: Box::new(Expr::Ident(temp_ident.clone())),
                                    right: Box::new(Expr::Ident(Ident::new_no_ctxt(
                                        "undefined".into(),
                                        DUMMY_SP,
                                    ))),
                                })),
                                cons: default_expr,
                                alt: Box::new(Expr::Ident(temp_ident.clone())),
                            }))),
                        ));

                        taken.insert(temp_name);
                        taken.insert(binding_name);
                    }
                    _ => {}
                }
            }
            self.rename_conflicting_bindings_in_block(body);
            if !param_prologue.is_empty() {
                let mut rewritten = param_prologue;
                rewritten.extend(std::mem::take(&mut body.stmts));
                body.stmts = rewritten;
            }

            let mut local_bindings = HashSet::new();
            for param in &function.params {
                collect_pattern_bindings(&param.pat, &mut local_bindings);
            }
            for stmt in &body.stmts {
                collect_stmt_bindings(stmt, &mut local_bindings);
            }
            self.scope_bindings.push(local_bindings);
            for stmt in &mut body.stmts {
                stmt.visit_mut_with(self);
            }
            self.scope_bindings.pop();
        }
    }

    let mut renamer = Renamer {
        scope_bindings: vec![top_level_bindings.clone()],
        next_suffix: HashMap::new(),
        inside_call_arg: false,
        seen_first_id_binding: false,
        next_id_suffix: 0,
        next_param_temp: 1,
    };
    for stmt in stmts {
        stmt.visit_mut_with(&mut renamer);
    }
}

fn normalize_arrow_body_expr(expr: Expr) -> Box<Expr> {
    match expr {
        Expr::Paren(paren) => normalize_arrow_body_expr(*paren.expr),
        other => Box::new(other),
    }
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

fn binding_used_in_constructor_before_terminal_return(stmts: &[Stmt], name: &str) -> bool {
    let Some((last, prefix)) = stmts.split_last() else {
        return false;
    };
    if !matches!(last, Stmt::Return(_)) {
        return false;
    }

    prefix
        .iter()
        .any(|stmt| stmt_references_binding_in_constructor_call(stmt, name))
}

fn stmt_references_binding_in_constructor_call(stmt: &Stmt, name: &str) -> bool {
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

        fn visit_new_expr(&mut self, new_expr: &swc_ecma_ast::NewExpr) {
            if self.found {
                return;
            }

            if let Some(args) = &new_expr.args {
                if args.iter().any(|arg| {
                    arg.spread.is_none() && expr_references_binding(&arg.expr, self.name)
                }) {
                    self.found = true;
                    return;
                }
            }

            new_expr.visit_children_with(self);
        }
    }

    let mut finder = Finder { name, found: false };
    stmt.visit_with(&mut finder);
    finder.found
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
    if finder.captures {
        return true;
    }
    match &*arrow.body {
        swc_ecma_ast::BlockStmtOrExpr::Expr(expr) => {
            function_expr_may_capture_outer_bindings(expr, outer_bindings)
        }
        swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) => {
            returned_function_expr_captures_outer_bindings(&block.stmts, outer_bindings)
                || called_local_function_captures_outer_bindings(&block.stmts, outer_bindings)
                || called_iife_captures_outer_bindings(&block.stmts, outer_bindings)
        }
    }
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
        if finder.captures {
            return true;
        }
        returned_function_expr_captures_outer_bindings(&body.stmts, outer_bindings)
            || called_local_function_captures_outer_bindings(&body.stmts, outer_bindings)
            || called_iife_captures_outer_bindings(&body.stmts, outer_bindings)
    } else {
        false
    }
}

fn function_expr_may_capture_outer_bindings(expr: &Expr, outer_bindings: &HashSet<String>) -> bool {
    match unwrap_transparent_expr(expr) {
        Expr::Arrow(arrow) => arrow_captures_outer_bindings(arrow, outer_bindings),
        Expr::Fn(fn_expr) => function_captures_outer_bindings(&fn_expr.function, outer_bindings),
        _ => false,
    }
}

fn returned_function_expr_captures_outer_bindings(
    stmts: &[Stmt],
    outer_bindings: &HashSet<String>,
) -> bool {
    stmts.iter().any(|stmt| {
        let Stmt::Return(return_stmt) = stmt else {
            return false;
        };
        let Some(arg) = &return_stmt.arg else {
            return false;
        };
        function_expr_may_capture_outer_bindings(arg, outer_bindings)
    })
}

fn called_local_function_captures_outer_bindings(
    stmts: &[Stmt],
    outer_bindings: &HashSet<String>,
) -> bool {
    let mut function_bindings = HashMap::<String, Box<Expr>>::new();
    for stmt in stmts {
        let Some((binding, init)) = extract_memoizable_single_decl(stmt) else {
            continue;
        };
        if matches!(unwrap_transparent_expr(&init), Expr::Arrow(_) | Expr::Fn(_)) {
            function_bindings.insert(binding.sym.to_string(), init);
        }
    }
    if function_bindings.is_empty() {
        return false;
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
                if let Expr::Ident(callee) = unwrap_transparent_expr(callee_expr) {
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

    called.names.into_iter().any(|name| {
        let Some(init) = function_bindings.get(&name) else {
            return false;
        };
        function_expr_may_capture_outer_bindings(init, outer_bindings)
    })
}

fn called_iife_captures_outer_bindings(stmts: &[Stmt], outer_bindings: &HashSet<String>) -> bool {
    struct Finder<'a> {
        outer_bindings: &'a HashSet<String>,
        captures: bool,
    }

    impl Visit for Finder<'_> {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_call_expr(&mut self, call: &CallExpr) {
            if self.captures {
                return;
            }

            if let Callee::Expr(callee_expr) = &call.callee {
                if matches!(
                    unwrap_transparent_expr(callee_expr),
                    Expr::Arrow(_) | Expr::Fn(_)
                ) && function_expr_may_capture_outer_bindings(callee_expr, self.outer_bindings)
                {
                    self.captures = true;
                    return;
                }
            }

            call.visit_children_with(self);
        }
    }

    let mut finder = Finder {
        outer_bindings,
        captures: false,
    };
    for stmt in stmts {
        stmt.visit_with(&mut finder);
        if finder.captures {
            return true;
        }
    }
    false
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
    if contains_object_pattern_assignment_with_reassigned_binding(&reactive.body.stmts) {
        split_multi_var_decls_in_stmts(&mut reactive.body.stmts);
        return (0, 0, 0, 0, 0);
    }
    let has_identity_sensitive_work = body_contains_identity_sensitive_work(&reactive.body);
    let has_destructuring_default_alloc =
        body_contains_destructuring_default_alloc_literal(&reactive.body);
    if reactive.fn_type == ReactFunctionType::Component
        && !has_identity_sensitive_work
        && !has_destructuring_default_alloc
    {
        normalize_non_ident_params_without_memoization(reactive);
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
    let mut param_prologue = rewrite_non_ident_params(
        &mut reactive.params,
        &mut reserved,
        &mut next_temp,
        &mut known_bindings,
    );
    strip_runtime_call_type_args_in_stmts(&mut param_prologue);
    rewrite_let_array_pattern_decls_to_assignment_stmts(&mut param_prologue, &mut reserved);
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
    rewrite_use_callback_decls_to_use_memo(&mut stmts);
    normalize_switch_case_blocks_in_stmts(&mut stmts);
    normalize_update_expressions_in_stmts(&mut stmts);
    prune_trivial_do_while_break_stmts(&mut stmts);
    flatten_nested_destructuring_assignments_in_stmts(&mut stmts, &mut reserved, &mut next_temp);
    collapse_single_object_temp_destructure_assign_pairs(&mut stmts);
    flatten_nested_destructuring_decls_to_temp_chain(&mut stmts, &mut reserved, &mut next_temp);
    rewrite_const_object_pattern_static_literal_decls_to_temp_aliases(
        &mut stmts,
        &mut reserved,
        &mut next_temp,
    );
    rewrite_destructuring_decls_with_top_level_rest_to_assignment_stmts(&mut stmts);
    rewrite_let_object_pattern_decls_to_assignment_stmts(&mut stmts);
    rewrite_let_array_pattern_decls_to_assignment_stmts(&mut stmts, &mut reserved);
    split_multi_var_decls_without_initializers_in_stmts(&mut stmts);
    normalize_reactive_labels(&mut stmts);
    let mut top_level_bindings = HashSet::new();
    for pat in &reactive.params {
        collect_pattern_bindings(pat, &mut top_level_bindings);
    }
    for stmt in &transformed {
        collect_stmt_bindings(stmt, &mut top_level_bindings);
    }
    for stmt in &stmts {
        collect_stmt_bindings(stmt, &mut top_level_bindings);
    }
    normalize_duplicate_id_bindings_in_nested_functions(&mut stmts, &top_level_bindings);
    prune_unused_function_like_decl_stmts(&mut stmts);
    prune_unused_pure_var_decls(&mut stmts);
    if maybe_fold_constant_return_binding(&mut stmts) {
        normalize_compound_assignments_in_stmts(&mut stmts);
        transformed.extend(stmts);
        reactive.body.stmts = transformed;
        return (0, 0, 0, 0, 0);
    }

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
                if let Some((first_binding, second_binding, init_expr)) =
                    extract_context_chained_assignment(var_decl)
                {
                    let middle = &stmts[prefix_index + 1..stmts.len().saturating_sub(1)];
                    let first_name = first_binding.sym.to_string();
                    let second_name = second_binding.sym.to_string();
                    let has_conflicting_middle = middle.iter().any(|stmt| {
                        binding_declared_in_stmts(std::slice::from_ref(stmt), first_name.as_str())
                            || binding_declared_in_stmts(
                                std::slice::from_ref(stmt),
                                second_name.as_str(),
                            )
                            || contains_return_stmt_in_stmts(std::slice::from_ref(stmt))
                    });

                    if !has_conflicting_middle
                        && last_return_is_binding_pair(
                            &stmts,
                            first_name.as_str(),
                            second_name.as_str(),
                        )
                    {
                        transformed.extend(std::mem::take(&mut pending_prefix_stmts));

                        let mut compute_stmts = Vec::with_capacity(middle.len() + 1);
                        compute_stmts.push(assign_stmt(
                            AssignTarget::from(second_binding.clone()),
                            Box::new(Expr::Assign(AssignExpr {
                                span: DUMMY_SP,
                                op: op!("="),
                                left: AssignTarget::from(first_binding.clone()),
                                right: init_expr,
                            })),
                        ));
                        compute_stmts.extend(middle.iter().cloned());
                        strip_runtime_call_type_args_in_stmts(&mut compute_stmts);

                        transformed.extend(build_memoized_block_two_values(
                            &cache_ident,
                            next_slot,
                            &[],
                            &first_binding,
                            &second_binding,
                            compute_stmts,
                            true,
                            false,
                        ));
                        next_slot += 2;
                        memo_blocks += 1;
                        memo_values += 2;
                        known_bindings.insert(first_name, true);
                        known_bindings.insert(second_name, true);
                        prefix_index = stmts.len().saturating_sub(1);
                        continue;
                    }
                }

                transformed.extend(std::mem::take(&mut pending_prefix_stmts));
                let mut passthrough_stmt = stmts[prefix_index].clone();
                if let Stmt::Decl(Decl::Var(var_decl_mut)) = &mut passthrough_stmt {
                    promote_var_decl_to_const_when_immutable(
                        var_decl_mut,
                        &stmts[prefix_index + 1..],
                    );
                }
                let mut stripped_stmt = vec![passthrough_stmt];
                strip_runtime_call_type_args_in_stmts(&mut stripped_stmt);
                let passthrough_stmt = stripped_stmt
                    .pop()
                    .expect("strip_runtime_call_type_args_in_stmts preserves statement count");
                transformed.push(passthrough_stmt);
                for decl in &var_decl.decls {
                    let stable_setters = state_tuple_setter_bindings(decl);
                    let stable_ref_object = ref_object_binding_from_hook(decl);
                    let stable_destructure_source = var_decl.kind == VarDeclKind::Const
                        && decl.init.as_deref().is_some_and(|init| {
                            let Expr::Ident(source) = unwrap_transparent_expr(init) else {
                                return false;
                            };
                            known_bindings
                                .get(source.sym.as_ref())
                                .copied()
                                .unwrap_or(false)
                        });
                    for name in collect_pattern_binding_names(&decl.name) {
                        if stable_setters.contains(&name)
                            || stable_ref_object.as_deref() == Some(&name)
                            || stable_destructure_source
                        {
                            known_bindings.insert(name.clone(), true);
                        } else {
                            known_bindings
                                .entry(name.clone())
                                .or_insert_with(|| is_ref_like_binding_name(&name));
                        }
                    }
                }
                prefix_index += 1;
                continue;
            }

            if is_hook_call_expr_stmt(&stmts[prefix_index]) {
                transformed.extend(std::mem::take(&mut pending_prefix_stmts));
                transformed.extend(lower_hook_call_stmt_with_memoized_args(
                    stmts[prefix_index].clone(),
                    &cache_ident,
                    &mut next_slot,
                    &mut memo_blocks,
                    &mut memo_values,
                    &mut reserved,
                    &mut next_temp,
                ));
                prefix_index += 1;
                continue;
            }

            if is_guard_if_with_terminal_return(&stmts[prefix_index]) {
                transformed.extend(std::mem::take(&mut pending_prefix_stmts));
                if let Some(stable_binding) =
                    stable_guard_assignment_binding(&stmts[prefix_index], &known_bindings)
                {
                    known_bindings.insert(stable_binding, true);
                }
                let mut guard_stmts = vec![stmts[prefix_index].clone()];
                let mut guard_reserved = reserved.clone();
                let mut guard_next_temp = next_temp;
                let (guard_slots, guard_blocks, guard_values) =
                    inject_nested_call_memoization_into_stmts(
                        &mut guard_stmts,
                        &known_bindings,
                        &cache_ident,
                        next_slot,
                        &mut guard_reserved,
                        &mut guard_next_temp,
                        false,
                    );
                transformed.extend(guard_stmts);
                next_slot += guard_slots;
                memo_blocks += guard_blocks;
                memo_values += guard_values;
                prefix_index += 1;
                continue;
            }

            if let Some(phi_assignments) = extract_phi_assignment_if_stmt(&stmts[prefix_index]) {
                transformed.extend(std::mem::take(&mut pending_prefix_stmts));
                let mut passthrough_stmt = vec![stmts[prefix_index].clone()];
                strip_runtime_call_type_args_in_stmts(&mut passthrough_stmt);
                transformed.extend(passthrough_stmt);
                for name in phi_assignments {
                    known_bindings.insert(name, false);
                }
                prefix_index += 1;
                continue;
            }

            break;
        };
        let mut init = init;
        let force_memoize_reassigned_jsx_tag_ident_init = matches!(&*init, Expr::Ident(_))
            && binding_reassigned_after(&stmts[prefix_index + 1..], binding.sym.as_ref())
            && binding_referenced_as_jsx_tag_in_stmts(
                &stmts[prefix_index + 1..],
                binding.sym.as_ref(),
            );
        let consume_self_use_memo_assignment = force_memoize_reassigned_jsx_tag_ident_init
            && stmts
                .get(prefix_index + 1)
                .is_some_and(|stmt| is_self_use_memo_assignment_stmt(stmt, binding.sym.as_ref()));
        if let Some(replacement) = foldable_same_branch_conditional(init.as_ref()) {
            if !binding_reassigned_after(&stmts[prefix_index + 1..], binding.sym.as_ref()) {
                transformed.extend(std::mem::take(&mut pending_prefix_stmts));
                transformed.push(Stmt::Expr(ExprStmt {
                    span: DUMMY_SP,
                    expr: init.clone(),
                }));
                replace_binding_with_expr_in_stmts(
                    &mut stmts[prefix_index + 1..],
                    binding.sym.as_ref(),
                    &replacement,
                );
                prefix_index += 1;
                continue;
            }
        }
        if pending_prefix_stmts.is_empty()
            && matches!(&*init, Expr::Arrow(_) | Expr::Fn(_))
            && next_stmt_function_decl_captures_binding(&stmts, prefix_index, binding.sym.as_ref())
        {
            pending_prefix_stmts.push(stmts[prefix_index].clone());
            known_bindings.insert(binding.sym.to_string(), true);
            prefix_index += 1;
            continue;
        }
        if pending_prefix_stmts.is_empty()
            && matches!(&*init, Expr::Array(_) | Expr::Object(_))
            && (next_stmt_function_decl_uses_binding_as_bare_ident(
                &stmts,
                prefix_index,
                binding.sym.as_ref(),
            ) || (next_stmt_iife_captures_binding(&stmts, prefix_index, binding.sym.as_ref())
                && !next_stmt_iife_may_mutate_binding(&stmts, prefix_index, binding.sym.as_ref())))
        {
            break;
        }
        if let Some((mut deps, lowered_compute_stmts)) =
            lower_use_memo_initializer(&init, &known_bindings)
        {
            let mut compute_stmts = std::mem::take(&mut pending_prefix_stmts);
            compute_stmts.extend(lowered_compute_stmts);
            let (mut post_memo_stmts, post_memo_source_name) =
                extract_post_memo_switch_stmts(&mut compute_stmts, "t_usememo");
            if !post_memo_stmts.is_empty() {
                normalize_switch_case_blocks_in_stmts(&mut post_memo_stmts);
                let mut local_bindings = HashSet::new();
                for stmt in &compute_stmts {
                    collect_stmt_bindings(stmt, &mut local_bindings);
                }
                deps = collect_dependencies_from_stmts(
                    &compute_stmts,
                    &known_bindings,
                    &local_bindings,
                );
                for dep in collect_called_local_function_capture_dependencies(
                    &compute_stmts,
                    &known_bindings,
                ) {
                    if !deps.iter().any(|existing| existing.key == dep.key) {
                        deps.push(dep);
                    }
                }
                deps = reduce_dependencies(deps);
            }
            let value_slot = next_slot + deps.len() as u32;
            let reassigned_after =
                binding_reassigned_after(&stmts[prefix_index + 1..], binding.sym.as_ref());
            let mut direct_binding_compute_stmts = compute_stmts.clone();
            rewrite_assignment_target_in_stmts(
                &mut direct_binding_compute_stmts,
                "t_usememo",
                binding.sym.as_ref(),
            );
            let can_lower_with_binding_directly = post_memo_stmts.is_empty()
                && rewrite_terminal_self_assignment_to_pattern_write(
                    &mut direct_binding_compute_stmts,
                    binding.sym.as_ref(),
                );

            if can_lower_with_binding_directly {
                transformed.extend(build_memoized_block(
                    &cache_ident,
                    next_slot,
                    &deps,
                    &binding,
                    direct_binding_compute_stmts,
                    true,
                ));
                transformed.extend(post_memo_stmts);
            } else {
                let temp = fresh_temp_ident(&mut next_temp, &mut reserved);
                rewrite_assignment_target_in_stmts(
                    &mut compute_stmts,
                    "t_usememo",
                    temp.sym.as_ref(),
                );
                rewrite_terminal_self_assignment_to_pattern_write(
                    &mut compute_stmts,
                    temp.sym.as_ref(),
                );

                transformed.extend(build_memoized_block(
                    &cache_ident,
                    next_slot,
                    &deps,
                    &temp,
                    compute_stmts,
                    true,
                ));
                let mut source_binding_for_post_stmt = None;
                if !post_memo_stmts.is_empty() {
                    if let Some(source_name) = post_memo_source_name.as_deref() {
                        if source_name != binding.sym.as_ref() {
                            let source_ident = Ident::new_no_ctxt(source_name.into(), DUMMY_SP);
                            transformed.push(make_var_decl(
                                VarDeclKind::Const,
                                Pat::Ident(BindingIdent {
                                    id: source_ident.clone(),
                                    type_ann: None,
                                }),
                                Some(Box::new(Expr::Ident(temp.clone()))),
                            ));
                            source_binding_for_post_stmt = Some(source_ident);
                        }
                    }
                }
                if source_binding_for_post_stmt.is_none() {
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
                }
                transformed.extend(post_memo_stmts);
                if let Some(source_ident) = source_binding_for_post_stmt {
                    transformed.push(make_var_decl(
                        VarDeclKind::Const,
                        Pat::Ident(BindingIdent {
                            id: binding.clone(),
                            type_ann: None,
                        }),
                        Some(Box::new(Expr::Ident(source_ident))),
                    ));
                }
            }

            next_slot = value_slot + 1;
            memo_blocks += 1;
            memo_values += 1;
            known_bindings.insert(binding.sym.to_string(), deps.is_empty());
            prefix_index += 1;
            continue;
        }
        if expr_contains_hook_call(&init) {
            transformed.extend(std::mem::take(&mut pending_prefix_stmts));
            transformed.push(stmts[prefix_index].clone());
            known_bindings.insert(
                binding.sym.to_string(),
                expr_is_ref_object_hook_call(&init)
                    || is_ref_like_binding_name(binding.sym.as_ref()),
            );
            prefix_index += 1;
            continue;
        }
        if let Expr::Ident(init_ident) = &*init {
            if !force_memoize_reassigned_jsx_tag_ident_init {
                transformed.extend(std::mem::take(&mut pending_prefix_stmts));
                let mut passthrough_stmt = stmts[prefix_index].clone();
                if let Stmt::Decl(Decl::Var(var_decl)) = &mut passthrough_stmt {
                    promote_var_decl_to_const_when_immutable(var_decl, &stmts[prefix_index + 1..]);
                }
                transformed.push(passthrough_stmt);
                let stable = known_bindings
                    .get(init_ident.sym.as_ref())
                    .copied()
                    .unwrap_or(true);
                known_bindings.insert(binding.sym.to_string(), stable);
                prefix_index += 1;
                continue;
            }
        }
        if inlineable_const_literal_initializer(init.as_ref())
            && binding_referenced_in_stmts(&stmts[prefix_index + 1..], binding.sym.as_ref())
        {
            break;
        }
        if matches!(&*init, Expr::Array(_) | Expr::Object(_))
            && binding_only_used_in_terminal_return_call(
                &stmts[prefix_index + 1..],
                binding.sym.as_ref(),
            )
        {
            break;
        }
        if matches!(&*init, Expr::Array(_) | Expr::Object(_))
            && binding_used_in_constructor_before_terminal_return(
                &stmts[prefix_index + 1..],
                binding.sym.as_ref(),
            )
        {
            break;
        }
        if pending_prefix_stmts.is_empty()
            && matches!(&*init, Expr::Arrow(_) | Expr::Fn(_))
            && binding_only_used_in_terminal_return(
                &stmts[prefix_index + 1..],
                binding.sym.as_ref(),
            )
            && (!collect_function_capture_dependencies(&init, &known_bindings).is_empty()
                || function_expr_writes_ref_current(init.as_ref())
                || terminal_return_depends_only_on_binding(
                    &stmts[prefix_index + 1..],
                    binding.sym.as_ref(),
                    &known_bindings,
                ))
            && !function_expr_contains_directive(init.as_ref())
            && (!function_expr_writes_ref_current(init.as_ref())
                || terminal_return_is_array_literal(&stmts[prefix_index + 1..]))
            && !function_expr_contains_member_call(init.as_ref())
            && !function_expr_contains_member_write(init.as_ref())
        {
            break;
        }
        if is_default_param_conditional_expr(init.as_ref())
            && binding_only_used_in_terminal_return(
                &stmts[prefix_index + 1..],
                binding.sym.as_ref(),
            )
            && !default_param_conditional_allocates_identity(init.as_ref())
        {
            break;
        }
        if should_passthrough_pure_initializer(init.as_ref())
            && !force_memoize_reassigned_jsx_tag_ident_init
        {
            transformed.extend(std::mem::take(&mut pending_prefix_stmts));
            let mut passthrough_stmt = stmts[prefix_index].clone();
            if let Stmt::Decl(Decl::Var(var_decl)) = &mut passthrough_stmt {
                promote_var_decl_to_const_when_immutable(var_decl, &stmts[prefix_index + 1..]);
            }
            transformed.push(passthrough_stmt);
            known_bindings.insert(binding.sym.to_string(), false);
            prefix_index += 1;
            continue;
        }
        if matches!(&*init, Expr::Member(_)) {
            transformed.extend(std::mem::take(&mut pending_prefix_stmts));
            transformed.push(stmts[prefix_index].clone());
            known_bindings.insert(binding.sym.to_string(), false);
            prefix_index += 1;
            continue;
        }
        if matches!(&*init, Expr::Call(_) | Expr::OptChain(_))
            && binding_only_used_in_terminal_return_literal(
                &stmts[prefix_index + 1..],
                binding.sym.as_ref(),
            )
            && terminal_return_is_array_literal(&stmts[prefix_index + 1..])
            && !expr_is_mutating_member_call(&init)
        {
            let local_bindings = HashSet::new();
            let init_deps = collect_dependencies_from_expr(&init, &known_bindings, &local_bindings);
            let direct_identifier_call = matches!(
                unwrap_transparent_expr(init.as_ref()),
                Expr::Call(call)
                    if matches!(
                        &call.callee,
                        Callee::Expr(callee_expr)
                            if matches!(unwrap_transparent_expr(callee_expr), Expr::Ident(_))
                    )
            );
            if !direct_identifier_call || init_deps.is_empty() {
                break;
            }
        }
        if let Expr::Call(call) = &*init {
            if call
                .args
                .iter()
                .any(|arg| matches!(&*arg.expr, Expr::Call(_) | Expr::OptChain(_)))
            {
                break;
            }
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

        let reassigned_after =
            binding_reassigned_after(&stmts[prefix_index + 1..], binding.sym.as_ref());
        if reassigned_after
            && is_static_alloc_literal_expr(init.as_ref())
            && binding_referenced_in_stmts(&stmts[prefix_index + 1..], binding.sym.as_ref())
            && binding_reassigned_in_called_iife_after(
                &stmts[prefix_index + 1..],
                binding.sym.as_ref(),
            )
        {
            break;
        }
        let mut mutated_after =
            binding_mutated_via_member_call_after(&stmts[prefix_index + 1..], binding.sym.as_ref());
        let mut member_assignment_after = matches!(&*init, Expr::Array(_) | Expr::Object(_))
            && binding_mutated_via_member_assignment_after(
                &stmts[prefix_index + 1..],
                binding.sym.as_ref(),
            );
        let mut alias_mutated_after = matches!(&*init, Expr::Array(_) | Expr::Object(_))
            && binding_maybe_mutated_via_alias_after(
                &stmts[prefix_index + 1..],
                binding.sym.as_ref(),
            );
        let mut direct_call_arg_mutated_after = matches!(&*init, Expr::Array(_) | Expr::Object(_))
            && binding_passed_to_potentially_mutating_call_after(
                &stmts[prefix_index + 1..],
                binding.sym.as_ref(),
            );
        let mut iife_mutated_after = matches!(&*init, Expr::Array(_) | Expr::Object(_))
            && binding_maybe_mutated_in_called_iife_after(
                &stmts[prefix_index + 1..],
                binding.sym.as_ref(),
            );
        let mut callback_chain_mutated_after = matches!(&*init, Expr::Array(_) | Expr::Object(_))
            && binding_used_in_potentially_mutating_callback_chain_after(
                &stmts[prefix_index + 1..],
                binding.sym.as_ref(),
            )
            && !binding_has_jsx_freeze_marker(&stmts[prefix_index + 1..], binding.sym.as_ref());
        let mut captured_called_after = matches!(&*init, Expr::Array(_) | Expr::Object(_))
            && binding_captured_by_called_local_function_after(
                &stmts[prefix_index + 1..],
                binding.sym.as_ref(),
            );
        let mut receiver_chain_after = matches!(&*init, Expr::Object(_))
            && binding_used_in_array_receiver_chain_after(
                &stmts[prefix_index + 1..],
                binding.sym.as_ref(),
            );
        let mut iterator_spread_after = matches!(&*init, Expr::New(_) | Expr::Call(_))
            && binding_used_in_iterator_spread_chain_after(
                &stmts[prefix_index + 1..],
                binding.sym.as_ref(),
            );
        if first_following_block_shadows_binding(&stmts[prefix_index + 1..], binding.sym.as_ref()) {
            mutated_after = false;
            member_assignment_after = false;
            alias_mutated_after = false;
            direct_call_arg_mutated_after = false;
            iife_mutated_after = false;
            callback_chain_mutated_after = false;
            captured_called_after = false;
            receiver_chain_after = false;
            iterator_spread_after = false;
        }
        if (mutated_after
            || member_assignment_after
            || alias_mutated_after
            || direct_call_arg_mutated_after
            || iife_mutated_after
            || callback_chain_mutated_after
            || captured_called_after
            || receiver_chain_after
            || iterator_spread_after)
            && !reassigned_after
        {
            if mutated_after
                || member_assignment_after
                || direct_call_arg_mutated_after
                || iife_mutated_after
            {
                if let Some((next_binding, next_init)) = stmts
                    .get(prefix_index + 1)
                    .and_then(extract_memoizable_single_decl)
                {
                    if let Expr::Call(next_call) = &*next_init {
                        if call_mutates_binding(next_call, binding.sym.as_ref()) {
                            transformed.extend(std::mem::take(&mut pending_prefix_stmts));

                            let mut deps = {
                                let local = HashSet::new();
                                collect_dependencies_from_expr(&init, &known_bindings, &local)
                            };
                            let local = HashSet::new();
                            for dep in
                                collect_dependencies_from_expr(&next_init, &known_bindings, &local)
                            {
                                if dep.key == binding.sym.as_ref()
                                    || dep.key.starts_with(&format!("{}.", binding.sym.as_ref()))
                                {
                                    continue;
                                }
                                if !deps.iter().any(|existing| existing.key == dep.key) {
                                    deps.push(dep);
                                }
                            }
                            deps = reduce_dependencies(deps);

                            let next_temp_ident = fresh_temp_ident(&mut next_temp, &mut reserved);
                            let mut compute_stmts = vec![
                                assign_stmt(
                                    AssignTarget::from(binding.clone()),
                                    Box::new((*init).clone()),
                                ),
                                assign_stmt(
                                    AssignTarget::from(next_temp_ident.clone()),
                                    next_init.clone(),
                                ),
                            ];
                            strip_runtime_call_type_args_in_stmts(&mut compute_stmts);
                            transformed.extend(build_memoized_block_two_values(
                                &cache_ident,
                                next_slot,
                                &deps,
                                &binding,
                                &next_temp_ident,
                                compute_stmts,
                                true,
                                false,
                            ));
                            transformed.push(make_var_decl(
                                if binding_reassigned_after(
                                    &stmts[prefix_index + 2..],
                                    next_binding.sym.as_ref(),
                                ) {
                                    VarDeclKind::Let
                                } else {
                                    VarDeclKind::Const
                                },
                                Pat::Ident(BindingIdent {
                                    id: next_binding.clone(),
                                    type_ann: None,
                                }),
                                Some(Box::new(Expr::Ident(next_temp_ident))),
                            ));

                            next_slot += deps.len() as u32 + 2;
                            memo_blocks += 1;
                            memo_values += 2;
                            known_bindings.insert(binding.sym.to_string(), false);
                            known_bindings.insert(next_binding.sym.to_string(), false);
                            prefix_index += 2;
                            continue;
                        }
                    }
                }

                if !binding_only_used_in_terminal_return_literal(
                    &stmts[prefix_index + 2..],
                    binding.sym.as_ref(),
                ) && !binding_mutated_via_member_call_after(
                    &stmts[prefix_index + 2..],
                    binding.sym.as_ref(),
                ) && !binding_mutated_via_member_assignment_after(
                    &stmts[prefix_index + 2..],
                    binding.sym.as_ref(),
                ) && !binding_passed_to_potentially_mutating_call_after(
                    &stmts[prefix_index + 2..],
                    binding.sym.as_ref(),
                ) {
                    if let Some(Stmt::Expr(next_expr_stmt)) = stmts.get(prefix_index + 1) {
                        if let Expr::Call(next_call) = &*next_expr_stmt.expr {
                            if call_mutates_binding(next_call, binding.sym.as_ref())
                                || call_passes_binding_to_potentially_mutating_identifier(
                                    next_call,
                                    binding.sym.as_ref(),
                                )
                                || iife_call_may_mutate_binding(next_call, binding.sym.as_ref())
                            {
                                transformed.extend(std::mem::take(&mut pending_prefix_stmts));

                                let mut deps = {
                                    let local = HashSet::new();
                                    collect_dependencies_from_expr(&init, &known_bindings, &local)
                                };
                                let next_call_expr = Expr::Call(next_call.clone());
                                let local = HashSet::new();
                                for dep in collect_dependencies_from_expr(
                                    &next_call_expr,
                                    &known_bindings,
                                    &local,
                                ) {
                                    if dep.key == binding.sym.as_ref()
                                        || dep
                                            .key
                                            .starts_with(&format!("{}.", binding.sym.as_ref()))
                                    {
                                        continue;
                                    }
                                    if !deps.iter().any(|existing| existing.key == dep.key) {
                                        deps.push(dep);
                                    }
                                }
                                deps = reduce_dependencies(deps);

                                let mut compute_stmts = vec![
                                    assign_stmt(
                                        AssignTarget::from(binding.clone()),
                                        Box::new((*init).clone()),
                                    ),
                                    Stmt::Expr(next_expr_stmt.clone()),
                                ];
                                inline_trivial_iifes_in_stmts(&mut compute_stmts);
                                strip_runtime_call_type_args_in_stmts(&mut compute_stmts);
                                let value_slot = next_slot + deps.len() as u32;
                                transformed.extend(build_memoized_block(
                                    &cache_ident,
                                    next_slot,
                                    &deps,
                                    &binding,
                                    compute_stmts,
                                    true,
                                ));

                                next_slot = value_slot + 1;
                                memo_blocks += 1;
                                memo_values += 1;
                                known_bindings.insert(binding.sym.to_string(), deps.is_empty());
                                prefix_index += 2;
                                continue;
                            }
                        }
                    }
                }
            }
            break;
        }
        let direct_call_in_rest = contains_direct_call(&stmts[prefix_index + 1..]);
        let frozen_via_create_element = matches!(&*init, Expr::Object(_))
            && binding_frozen_via_create_element_after(
                &stmts[prefix_index + 1..],
                binding.sym.as_ref(),
            );
        if (!matches!(&*init, Expr::Array(_)) && direct_call_in_rest && !frozen_via_create_element)
            || contains_complex_assignment(&stmts[prefix_index + 1..])
        {
            break;
        }

        maybe_split_static_array_elements_initializer(
            &mut init,
            &mut transformed,
            &cache_ident,
            &mut known_bindings,
            &mut reserved,
            &mut next_temp,
            &mut next_slot,
            &mut memo_blocks,
            &mut memo_values,
        );

        maybe_split_single_element_array_initializer(
            &mut init,
            &mut transformed,
            &cache_ident,
            &mut known_bindings,
            &mut reserved,
            &mut next_temp,
            &mut next_slot,
            &mut memo_blocks,
            &mut memo_values,
        );

        maybe_extract_single_call_arg_to_temp(
            &mut init,
            &mut transformed,
            &mut known_bindings,
            &mut reserved,
            &mut next_temp,
        );

        let deps = if matches!(&*init, Expr::Arrow(_) | Expr::Fn(_)) {
            collect_function_capture_dependencies(&init, &known_bindings)
        } else {
            let local = HashSet::new();
            collect_dependencies_from_expr(&init, &known_bindings, &local)
        };
        let use_binding_as_temp = force_memoize_reassigned_jsx_tag_ident_init
            || (!reassigned_after
                && next_stmt_destructures_from_binding(&stmts, prefix_index, binding.sym.as_ref()));
        let temp = if use_binding_as_temp {
            binding.clone()
        } else {
            fresh_temp_ident(&mut next_temp, &mut reserved)
        };
        let value_slot = next_slot + deps.len() as u32;
        let mut compute_stmts = std::mem::take(&mut pending_prefix_stmts);
        compute_stmts.push(assign_stmt(
            AssignTarget::from(temp.clone()),
            Box::new((*init).clone()),
        ));
        if consume_self_use_memo_assignment {
            compute_stmts.extend(make_self_use_memo_noop_stmts(binding.sym.as_ref()));
        }
        lower_iife_call_args_in_stmts(&mut compute_stmts, &mut reserved, &mut next_temp);
        strip_runtime_call_type_args_in_stmts(&mut compute_stmts);

        transformed.extend(build_memoized_block(
            &cache_ident,
            next_slot,
            &deps,
            &temp,
            std::mem::take(&mut compute_stmts),
            true,
        ));
        if !use_binding_as_temp {
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
        }

        next_slot = value_slot + 1;
        memo_blocks += 1;
        memo_values += 1;
        known_bindings.insert(binding.sym.to_string(), deps.is_empty());
        prefix_index += if consume_self_use_memo_assignment {
            2
        } else {
            1
        };
    }
    transformed.extend(pending_prefix_stmts);

    let mut tail = stmts[prefix_index..].to_vec();
    while !tail.is_empty() && is_ref_lazy_initialization_stmt(&tail[0]) {
        transformed.push(tail.remove(0));
    }
    while !tail.is_empty() && should_hoist_try_prelude_stmt(&tail[0]) {
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
            if is_constant_primitive_return_expr(return_expr.as_ref()) {
                if let Some(binding) = find_reactive_context_return_binding(&tail) {
                    return_expr = Box::new(Expr::Ident(binding));
                }
            }
            let tail_literal_bindings = collect_inlineable_const_literal_bindings(&tail);
            if !tail_literal_bindings.is_empty() {
                inline_const_literals_in_expr(&mut return_expr, &tail_literal_bindings);
            }
            alias_non_stable_return_bindings(
                &mut return_expr,
                &mut transformed,
                &tail,
                &mut known_bindings,
                &mut reserved,
            );
            let mut tail_local_bindings_for_jsx_hoist = HashSet::new();
            for stmt in &tail {
                collect_stmt_bindings(stmt, &mut tail_local_bindings_for_jsx_hoist);
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
                &tail_local_bindings_for_jsx_hoist,
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
            if let Some(alias) = &mut const_result_alias {
                if parse_temp_name(alias.sym.as_ref()).is_some() {
                    let old_alias = alias.sym.to_string();
                    reserved.remove(alias.sym.as_ref());
                    let renamed_alias = fresh_dollar_suffix_name(alias.sym.as_ref(), &mut reserved);
                    alias.sym = renamed_alias.into();
                    if let Some(stable) = known_bindings.remove(old_alias.as_str()) {
                        known_bindings.insert(alias.sym.to_string(), stable);
                    }
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
            if const_result_alias.is_none()
                && !return_as_const
                && try_lower_mutable_collection_jsx_tail(
                    &mut tail,
                    &mut return_expr,
                    &mut transformed,
                    &mut known_bindings,
                    &cache_ident,
                    &mut reserved,
                    &mut next_temp,
                    &mut next_slot,
                    &mut memo_blocks,
                    &mut memo_values,
                )
            {
                // Fully handled by specialized lowering.
            } else if return_expr_spreads_iterator_alias(&return_expr, &transformed, &tail) {
                let mut passthrough_tail = tail;
                let (nested_slots, nested_blocks, nested_values) =
                    inject_nested_call_memoization_into_stmts(
                        &mut passthrough_tail,
                        &known_bindings,
                        &cache_ident,
                        next_slot,
                        &mut reserved,
                        &mut next_temp,
                        false,
                    );
                transformed.extend(passthrough_tail);
                transformed.push(Stmt::Return(swc_ecma_ast::ReturnStmt {
                    span: DUMMY_SP,
                    arg: Some(wrap_with_ts_const_assertion(*return_expr, return_as_const)),
                }));
                next_slot += nested_slots;
                memo_blocks += nested_blocks;
                memo_values += nested_values;
            } else if tail.is_empty()
                && matches!(&*return_expr, Expr::Ident(existing) if binding_declared_in_stmts(&transformed, existing.sym.as_ref()))
            {
                // Already handled via direct return above.
            } else {
                let return_assigned_bindings = collect_assigned_bindings_in_expr(&return_expr);
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

                let skip_tail_result_block_memoization =
                    result_ident.as_ref().is_some_and(|result_ident| {
                        const_result_alias.is_none()
                            && !return_as_const
                            && matches!(
                                &*return_expr,
                                Expr::Ident(return_ident) if return_ident.sym == result_ident.sym
                            )
                            && should_skip_result_tail_memoization(&tail, result_ident.sym.as_ref())
                    });
                let skip_tail_result_outer_memoization =
                    result_ident.as_ref().is_some_and(|result_ident| {
                        const_result_alias.is_none()
                            && !return_as_const
                            && matches!(
                                &*return_expr,
                                Expr::Ident(return_ident) if return_ident.sym == result_ident.sym
                            )
                            && should_skip_result_tail_outer_memoization(
                                &tail,
                                result_ident.sym.as_ref(),
                            )
                    });
                let skip_tail_result_pattern_assignment_outer_memoization =
                    result_ident.as_ref().is_some_and(|result_ident| {
                        const_result_alias.is_none()
                            && !return_as_const
                            && matches!(
                                &*return_expr,
                                Expr::Ident(return_ident) if return_ident.sym == result_ident.sym
                            )
                            && should_skip_result_tail_pattern_assignment_outer_memoization(
                                &tail,
                                result_ident.sym.as_ref(),
                            )
                    });
                let skip_tail_result_passthrough =
                    result_ident.as_ref().is_some_and(|result_ident| {
                        const_result_alias.is_none()
                            && !return_as_const
                            && matches!(
                                &*return_expr,
                                Expr::Ident(return_ident) if return_ident.sym == result_ident.sym
                            )
                            && !contains_direct_assignment_to_binding(
                                &tail,
                                result_ident.sym.as_ref(),
                            )
                            && !binding_declared_in_stmts(&tail, result_ident.sym.as_ref())
                            && !binding_captured_by_called_local_function_after(
                                &tail,
                                result_ident.sym.as_ref(),
                            )
                    });

                prune_empty_stmts(&mut tail);
                prune_noop_identifier_exprs(&mut tail);
                prune_unused_underscore_jsx_decls(&mut tail);
                promote_immutable_lets_to_const_with_reassigned(
                    &mut tail,
                    &return_assigned_bindings,
                );
                normalize_static_string_members_in_stmts(&mut tail);
                let tail_literal_bindings = collect_inlineable_const_literal_bindings(&tail);
                if !tail_literal_bindings.is_empty() {
                    inline_const_literals_in_expr(&mut return_expr, &tail_literal_bindings);
                }
                inline_const_literal_indices_in_stmts(&mut tail);
                normalize_compound_assignments_in_stmts(&mut tail);
                normalize_reactive_labels(&mut tail);
                normalize_if_break_blocks(&mut tail);
                lower_function_decls_to_const_in_stmts(&mut tail);
                flatten_hoistable_blocks_in_stmts(&mut tail, &mut reserved);
                flatten_hoistable_blocks_in_nested_functions(&mut tail);

                if skip_tail_result_block_memoization
                    || skip_tail_result_outer_memoization
                    || skip_tail_result_pattern_assignment_outer_memoization
                    || skip_tail_result_passthrough
                {
                    let result_ident = result_ident
                        .clone()
                        .expect("skip_tail_result_block_memoization requires return identifier");
                    let mut rewritten_stmts = tail;
                    inline_trivial_iifes_in_stmts(&mut rewritten_stmts);
                    flatten_hoistable_blocks_in_stmts(&mut rewritten_stmts, &mut reserved);
                    flatten_hoistable_blocks_in_nested_functions(&mut rewritten_stmts);
                    let (nested_slots, nested_blocks, nested_values) =
                        inject_nested_call_memoization_into_stmts(
                            &mut rewritten_stmts,
                            &known_bindings,
                            &cache_ident,
                            next_slot,
                            &mut reserved,
                            &mut next_temp,
                            false,
                        );
                    transformed.extend(rewritten_stmts);
                    transformed.push(Stmt::Return(swc_ecma_ast::ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(wrap_with_ts_const_assertion(
                            Expr::Ident(result_ident),
                            return_as_const,
                        )),
                    }));
                    next_slot += nested_slots;
                    memo_blocks += nested_blocks;
                    memo_values += nested_values;
                } else {
                    let precompute_terminal_call_arg = const_result_alias.is_some()
                        && should_precompute_terminal_call_arg_expr(&return_expr);
                    let precomputed_call_arg_temp = if precompute_terminal_call_arg {
                        Some(fresh_temp_ident(&mut next_temp, &mut reserved))
                    } else {
                        None
                    };
                    let force_distinct_temp_for_result =
                        result_ident.as_ref().is_some_and(|ident| {
                            binding_declared_in_stmts(&transformed, ident.sym.as_ref())
                                && contains_function_assignment_to_binding(
                                    &tail,
                                    ident.sym.as_ref(),
                                )
                        });
                    let force_temp_for_post_compute_alias =
                        result_ident.as_ref().is_some_and(|ident| {
                            has_create_element_result_assignment_with_post_calls(
                                &tail,
                                ident.sym.as_ref(),
                            )
                        });
                    let rewrite_result_assignments_to_temp =
                        force_distinct_temp_for_result || force_temp_for_post_compute_alias;
                    let mut temp = if result_ident.as_ref().is_some_and(|ident| {
                        rewrite_result_assignments_to_temp
                            || binding_declared_in_stmts(&tail, ident.sym.as_ref())
                    }) {
                        fresh_temp_ident(&mut next_temp, &mut reserved)
                    } else {
                        result_ident
                            .clone()
                            .unwrap_or_else(|| fresh_temp_ident(&mut next_temp, &mut reserved))
                    };
                    let declare_temp = !binding_declared_in_stmts(&transformed, temp.sym.as_ref())
                        && !binding_declared_in_stmts(&tail, temp.sym.as_ref());

                    let mut compute_stmts = tail;
                    if rewrite_result_assignments_to_temp {
                        if let Some(result_ident) = &result_ident {
                            rewrite_assignment_target_in_stmts(
                                &mut compute_stmts,
                                result_ident.sym.as_ref(),
                                temp.sym.as_ref(),
                            );
                        }
                    }
                    normalize_array_pattern_assignments_in_stmts(
                        &mut compute_stmts,
                        &mut reserved,
                        &mut next_temp,
                    );
                    let should_assign_result = if rewrite_result_assignments_to_temp {
                        !contains_direct_assignment_to_binding(&compute_stmts, temp.sym.as_ref())
                    } else {
                        !matches!(&*return_expr, Expr::Ident(ident) if ident.sym == temp.sym)
                    };
                    if should_assign_result {
                        compute_stmts
                            .push(assign_stmt(AssignTarget::from(temp.clone()), return_expr));
                    }
                    if let Some(arg_temp) = &precomputed_call_arg_temp {
                        rewrite_terminal_call_assignment_with_precomputed_arg(
                            &mut compute_stmts,
                            temp.sym.as_ref(),
                            arg_temp,
                        );
                    }
                    lower_iife_call_args_in_stmts(
                        &mut compute_stmts,
                        &mut reserved,
                        &mut next_temp,
                    );
                    inline_trivial_iifes_in_stmts(&mut compute_stmts);
                    flatten_hoistable_blocks_in_stmts(&mut compute_stmts, &mut reserved);
                    flatten_hoistable_blocks_in_nested_functions(&mut compute_stmts);
                    strip_runtime_call_type_args_in_stmts(&mut compute_stmts);
                    prune_unused_pure_var_decls(&mut compute_stmts);
                    prune_unused_function_like_decl_stmts(&mut compute_stmts);
                    let mut post_compute_stmts = extract_trailing_post_compute_side_effect_stmts(
                        &mut compute_stmts,
                        temp.sym.as_ref(),
                    );

                    let mut prelude_stmts = if contains_return_stmt_in_stmts(&compute_stmts) {
                        Vec::new()
                    } else {
                        split_direct_call_prelude_from_compute_stmts(
                            &mut compute_stmts,
                            temp.sym.as_ref(),
                            &known_bindings,
                        )
                    };
                    let mut deferred_outer_temp_name = None;
                    if !prelude_stmts.is_empty()
                        && result_ident.is_none()
                        && is_latest_fresh_temp_ident(&temp, next_temp)
                        && reserved.remove(temp.sym.as_ref())
                    {
                        next_temp -= 1;
                        deferred_outer_temp_name = Some(temp.sym.to_string());
                    }
                    let skip_nested_prelude_injection =
                        prelude_stmts.iter().any(stmt_declares_non_ident_pattern);
                    let (mut prelude_slots, mut prelude_blocks, mut prelude_values) =
                        if prelude_stmts.is_empty() || skip_nested_prelude_injection {
                            (0, 0, 0)
                        } else {
                            inject_nested_call_memoization_into_stmts(
                                &mut prelude_stmts,
                                &known_bindings,
                                &cache_ident,
                                next_slot,
                                &mut reserved,
                                &mut next_temp,
                                true,
                            )
                        };
                    if !prelude_stmts.is_empty() && prelude_blocks == 0 {
                        if let Some((rewritten_prelude, slots, blocks, values)) =
                            rewrite_top_level_rest_pattern_assignments_in_prelude_to_memo_blocks(
                                &prelude_stmts,
                                &known_bindings,
                                &cache_ident,
                                next_slot,
                            )
                        {
                            prelude_stmts = rewritten_prelude;
                            prelude_slots = slots;
                            prelude_blocks = blocks;
                            prelude_values = values;
                        }
                    }
                    if !prelude_stmts.is_empty()
                        && prelude_blocks == 0
                        && !prelude_contains_if_with_else(&prelude_stmts)
                    {
                        if let Some(prelude_result_binding) =
                            infer_prelude_result_binding(&prelude_stmts, &compute_stmts)
                        {
                            let mut prelude_local_bindings = HashSet::new();
                            for stmt in &prelude_stmts {
                                collect_stmt_bindings_including_nested_blocks(
                                    stmt,
                                    &mut prelude_local_bindings,
                                );
                            }
                            let mut prelude_deps = collect_dependencies_from_stmts(
                                &prelude_stmts,
                                &known_bindings,
                                &prelude_local_bindings,
                            );
                            let prelude_called_fn_deps =
                                collect_called_local_function_capture_dependencies(
                                    &prelude_stmts,
                                    &known_bindings,
                                );
                            for dep in prelude_called_fn_deps {
                                if !prelude_deps.iter().any(|existing| existing.key == dep.key) {
                                    prelude_deps.push(dep);
                                }
                            }
                            let prelude_inline_fn_capture_deps =
                                collect_stmt_function_capture_dependencies(
                                    &prelude_stmts,
                                    &known_bindings,
                                );
                            for dep in prelude_inline_fn_capture_deps {
                                if !prelude_deps.iter().any(|existing| existing.key == dep.key) {
                                    prelude_deps.push(dep);
                                }
                            }
                            prelude_deps = reduce_dependencies(prelude_deps);
                            prelude_deps.retain(|dep| {
                                dep.key != prelude_result_binding.sym.as_ref()
                                    && !dep
                                        .key
                                        .starts_with(&format!("{}.", prelude_result_binding.sym))
                                    && !dep
                                        .key
                                        .starts_with(&format!("{}[", prelude_result_binding.sym))
                            });
                            prelude_deps = reduce_nested_member_dependencies(prelude_deps);
                            if !prelude_deps.is_empty() {
                                prelude_stmts = build_memoized_block(
                                    &cache_ident,
                                    next_slot,
                                    &prelude_deps,
                                    &prelude_result_binding,
                                    std::mem::take(&mut prelude_stmts),
                                    false,
                                );
                                prelude_slots = prelude_deps.len() as u32 + 1;
                                prelude_blocks = 1;
                                prelude_values = 1;
                            }
                        }
                    }
                    if !prelude_stmts.is_empty() && prelude_blocks == 0 {
                        if let Some((rewritten_prelude, slots, values)) =
                            try_build_pattern_assignment_prelude_memo_fallback(
                                &prelude_stmts,
                                &compute_stmts,
                                &known_bindings,
                                &cache_ident,
                                next_slot,
                            )
                        {
                            prelude_stmts = rewritten_prelude;
                            prelude_slots = slots;
                            prelude_blocks = 1;
                            prelude_values = values;
                        }
                    }
                    if let Some(old_temp_name) = deferred_outer_temp_name {
                        let replacement_temp = fresh_temp_ident(&mut next_temp, &mut reserved);
                        rewrite_assignment_target_in_stmts(
                            &mut compute_stmts,
                            old_temp_name.as_str(),
                            replacement_temp.sym.as_ref(),
                        );
                        temp = replacement_temp;
                    }
                    next_slot += prelude_slots;
                    memo_blocks += prelude_blocks;
                    memo_values += prelude_values;

                    let mut dep_known_bindings = known_bindings.clone();
                    for stmt in &prelude_stmts {
                        let mut bindings = HashSet::new();
                        collect_stmt_bindings(stmt, &mut bindings);
                        let stable_binding = stmt_declares_const_ident_alias(stmt);
                        for binding in bindings {
                            if stable_binding {
                                dep_known_bindings.insert(binding, true);
                            } else {
                                dep_known_bindings.entry(binding).or_insert(false);
                            }
                        }
                    }

                    let mut local_bindings = HashSet::new();
                    for stmt in &compute_stmts {
                        collect_stmt_bindings_including_nested_blocks(stmt, &mut local_bindings);
                    }
                    let mut deps = collect_dependencies_from_stmts(
                        &compute_stmts,
                        &dep_known_bindings,
                        &local_bindings,
                    );
                    let called_fn_deps = collect_called_local_function_capture_dependencies(
                        &compute_stmts,
                        &dep_known_bindings,
                    );
                    for dep in called_fn_deps {
                        if !deps.iter().any(|existing| existing.key == dep.key) {
                            deps.push(dep);
                        }
                    }
                    let inline_fn_capture_deps = collect_stmt_function_capture_dependencies(
                        &compute_stmts,
                        &dep_known_bindings,
                    );
                    for dep in inline_fn_capture_deps {
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
                    let skip_redundant_nested_call_memoization =
                        single_terminal_call_matches_outer_deps(
                            &rewritten_stmts,
                            temp.sym.as_ref(),
                            &deps,
                            &dep_known_bindings,
                        );
                    let nested_slot_start = if has_early_return {
                        next_slot + deps.len() as u32 + 2
                    } else {
                        next_slot + deps.len() as u32 + 1
                    };
                    let (nested_slots, nested_blocks, nested_values) =
                        if deps.is_empty() || skip_redundant_nested_call_memoization {
                            (0, 0, 0)
                        } else {
                            inject_nested_call_memoization_into_stmts(
                                &mut rewritten_stmts,
                                &dep_known_bindings,
                                &cache_ident,
                                nested_slot_start,
                                &mut reserved,
                                &mut next_temp,
                                false,
                            )
                        };
                    if has_early_return {
                        let sentinel = sentinel.expect("has_early_return implies sentinel");
                        let mut lowered_stmts = rewritten_stmts;
                        prune_redundant_result_preinit(&mut lowered_stmts, &temp);
                        let result_assigned_early = lowered_stmts
                            .first()
                            .is_some_and(|stmt| stmt_assigns_binding(stmt, temp.sym.as_ref()));
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

                        let first_slot = next_slot + deps.len() as u32;
                        let second_slot = first_slot + 1;
                        let (
                            first_value,
                            second_value,
                            result_slot,
                            sentinel_slot,
                            declare_second_before_first,
                        ) = if result_assigned_early {
                            (&temp, &sentinel, first_slot, second_slot, false)
                        } else {
                            (&sentinel, &temp, second_slot, first_slot, true)
                        };
                        transformed.extend(build_memoized_block_two_values(
                            &cache_ident,
                            next_slot,
                            &deps,
                            first_value,
                            second_value,
                            with_header,
                            declare_temp,
                            declare_second_before_first,
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
                        } else if let Some(result_ident) = &result_ident {
                            if result_ident.sym != temp.sym
                                && binding_declared_in_stmts(
                                    &transformed,
                                    result_ident.sym.as_ref(),
                                )
                            {
                                transformed.push(assign_stmt(
                                    AssignTarget::from(result_ident.clone()),
                                    Box::new(Expr::Ident(temp.clone())),
                                ));
                                transformed.push(Stmt::Return(swc_ecma_ast::ReturnStmt {
                                    span: DUMMY_SP,
                                    arg: Some(wrap_with_ts_const_assertion(
                                        Expr::Ident(result_ident.clone()),
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
                        } else {
                            transformed.push(Stmt::Return(swc_ecma_ast::ReturnStmt {
                                span: DUMMY_SP,
                                arg: Some(wrap_with_ts_const_assertion(
                                    Expr::Ident(temp),
                                    return_as_const,
                                )),
                            }));
                        }

                        next_slot = sentinel_slot.max(result_slot) + 1 + nested_slots;
                        memo_blocks += 1 + nested_blocks;
                        memo_values += 2 + nested_values;
                    } else {
                        let value_slot = next_slot + deps.len() as u32;
                        transformed.extend(prelude_stmts);
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
                            transformed.extend(std::mem::take(&mut post_compute_stmts));
                            transformed.push(Stmt::Return(swc_ecma_ast::ReturnStmt {
                                span: DUMMY_SP,
                                arg: Some(wrap_with_ts_const_assertion(
                                    Expr::Ident(alias.clone()),
                                    return_as_const,
                                )),
                            }));
                        } else if let Some(result_ident) = &result_ident {
                            if result_ident.sym != temp.sym
                                && binding_declared_in_stmts(
                                    &transformed,
                                    result_ident.sym.as_ref(),
                                )
                            {
                                transformed.push(assign_stmt(
                                    AssignTarget::from(result_ident.clone()),
                                    Box::new(Expr::Ident(temp.clone())),
                                ));
                                transformed.extend(std::mem::take(&mut post_compute_stmts));
                                transformed.push(Stmt::Return(swc_ecma_ast::ReturnStmt {
                                    span: DUMMY_SP,
                                    arg: Some(wrap_with_ts_const_assertion(
                                        Expr::Ident(result_ident.clone()),
                                        return_as_const,
                                    )),
                                }));
                            } else if result_ident.sym != temp.sym && !post_compute_stmts.is_empty()
                            {
                                transformed.push(make_var_decl(
                                    VarDeclKind::Const,
                                    Pat::Ident(BindingIdent {
                                        id: result_ident.clone(),
                                        type_ann: None,
                                    }),
                                    Some(Box::new(Expr::Ident(temp.clone()))),
                                ));
                                transformed.extend(std::mem::take(&mut post_compute_stmts));
                                transformed.push(Stmt::Return(swc_ecma_ast::ReturnStmt {
                                    span: DUMMY_SP,
                                    arg: Some(wrap_with_ts_const_assertion(
                                        Expr::Ident(result_ident.clone()),
                                        return_as_const,
                                    )),
                                }));
                            } else {
                                transformed.extend(std::mem::take(&mut post_compute_stmts));
                                transformed.push(Stmt::Return(swc_ecma_ast::ReturnStmt {
                                    span: DUMMY_SP,
                                    arg: Some(wrap_with_ts_const_assertion(
                                        Expr::Ident(temp),
                                        return_as_const,
                                    )),
                                }));
                            }
                        } else {
                            transformed.extend(std::mem::take(&mut post_compute_stmts));
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
                let return_assigned_bindings = collect_assigned_bindings_in_expr(&return_expr);

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
                prune_unused_underscore_jsx_decls(&mut compute_stmts);
                promote_immutable_lets_to_const_with_reassigned(
                    &mut compute_stmts,
                    &return_assigned_bindings,
                );
                normalize_static_string_members_in_stmts(&mut compute_stmts);
                inline_const_literal_indices_in_stmts(&mut compute_stmts);
                normalize_compound_assignments_in_stmts(&mut compute_stmts);
                normalize_reactive_labels(&mut compute_stmts);
                normalize_if_break_blocks(&mut compute_stmts);
                lower_function_decls_to_const_in_stmts(&mut compute_stmts);
                flatten_hoistable_blocks_in_stmts(&mut compute_stmts, &mut reserved);
                flatten_hoistable_blocks_in_nested_functions(&mut compute_stmts);

                let temp = if result_ident.as_ref().is_some_and(|ident| {
                    binding_declared_in_stmts(&compute_stmts, ident.sym.as_ref())
                }) {
                    fresh_temp_ident(&mut next_temp, &mut reserved)
                } else {
                    result_ident
                        .clone()
                        .unwrap_or_else(|| fresh_temp_ident(&mut next_temp, &mut reserved))
                };
                let declare_temp = !binding_declared_in_stmts(&compute_stmts, temp.sym.as_ref());

                let should_assign_result =
                    !matches!(&*return_expr, Expr::Ident(ident) if ident.sym == temp.sym);
                if should_assign_result {
                    compute_stmts.push(assign_stmt(AssignTarget::from(temp.clone()), return_expr));
                }
                lower_iife_call_args_in_stmts(&mut compute_stmts, &mut reserved, &mut next_temp);
                inline_trivial_iifes_in_stmts(&mut compute_stmts);
                flatten_hoistable_blocks_in_stmts(&mut compute_stmts, &mut reserved);
                flatten_hoistable_blocks_in_nested_functions(&mut compute_stmts);
                strip_runtime_call_type_args_in_stmts(&mut compute_stmts);
                prune_unused_pure_var_decls(&mut compute_stmts);
                prune_unused_function_like_decl_stmts(&mut compute_stmts);

                let mut local_bindings = HashSet::new();
                for stmt in &compute_stmts {
                    collect_stmt_bindings_including_nested_blocks(stmt, &mut local_bindings);
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
                let inline_fn_capture_deps =
                    collect_stmt_function_capture_dependencies(&compute_stmts, &known_bindings);
                for dep in inline_fn_capture_deps {
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
                let (nested_slots, nested_blocks, nested_values) = if deps.is_empty() {
                    (0, 0, 0)
                } else {
                    inject_nested_call_memoization_into_stmts(
                        &mut rewritten_stmts,
                        &known_bindings,
                        &cache_ident,
                        if has_early_return {
                            next_slot + deps.len() as u32 + 2
                        } else {
                            next_slot + deps.len() as u32 + 1
                        },
                        &mut reserved,
                        &mut next_temp,
                        false,
                    )
                };
                if has_early_return {
                    let sentinel = sentinel.expect("has_early_return implies sentinel");
                    let result_assigned_early = rewritten_stmts
                        .first()
                        .is_some_and(|stmt| stmt_assigns_binding(stmt, temp.sym.as_ref()));
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

                    let first_slot = next_slot + deps.len() as u32;
                    let second_slot = first_slot + 1;
                    let (
                        first_value,
                        second_value,
                        result_slot,
                        sentinel_slot,
                        declare_second_before_first,
                    ) = if result_assigned_early {
                        (&temp, &sentinel, first_slot, second_slot, false)
                    } else {
                        (&sentinel, &temp, second_slot, first_slot, true)
                    };
                    let mut memoized = build_memoized_block_two_values(
                        &cache_ident,
                        next_slot,
                        &deps,
                        first_value,
                        second_value,
                        with_header,
                        declare_temp,
                        declare_second_before_first,
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

                    next_slot = sentinel_slot.max(result_slot) + 1 + nested_slots;
                    memo_blocks += 1 + nested_blocks;
                    memo_values += 2 + nested_values;
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

                    next_slot = value_slot + 1 + nested_slots;
                    memo_blocks += 1 + nested_blocks;
                    memo_values += 1 + nested_values;
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

    prune_unused_object_pattern_bindings_in_stmts(&mut transformed);
    normalize_empty_jsx_elements_to_self_closing_in_stmts(&mut transformed);
    reactive.body.stmts = transformed;

    if next_slot == 0 {
        return (0, 0, 0, 0, 0);
    }

    (next_slot, memo_blocks, memo_values, 0, 0)
}

fn body_contains_identity_sensitive_work(body: &BlockStmt) -> bool {
    #[derive(Default)]
    struct Finder {
        found: bool,
    }

    impl Visit for Finder {
        fn visit_arrow_expr(&mut self, arrow: &ArrowExpr) {
            self.found = true;
            arrow.visit_children_with(self);
        }

        fn visit_function(&mut self, function: &Function) {
            self.found = true;
            function.visit_children_with(self);
        }

        fn visit_call_expr(&mut self, call: &CallExpr) {
            self.found = true;
            call.visit_children_with(self);
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

        fn visit_assign_pat(&mut self, assign_pat: &swc_ecma_ast::AssignPat) {
            if self.found {
                return;
            }

            if matches!(
                unwrap_transparent_expr(&assign_pat.right),
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

            assign_pat.visit_children_with(self);
        }
    }

    let mut finder = Finder::default();
    body.visit_with(&mut finder);
    finder.found
}

fn body_contains_destructuring_default_alloc_literal(body: &BlockStmt) -> bool {
    fn pat_has_default(pat: &Pat) -> bool {
        match pat {
            Pat::Assign(assign_pat) => {
                is_static_alloc_literal_expr(&assign_pat.right) || pat_has_default(&assign_pat.left)
            }
            Pat::Array(array_pat) => array_pat.elems.iter().flatten().any(pat_has_default),
            Pat::Object(object_pat) => object_pat.props.iter().any(|prop| match prop {
                ObjectPatProp::Assign(assign_prop) => assign_prop
                    .value
                    .as_ref()
                    .is_some_and(|value| is_static_alloc_literal_expr(value)),
                ObjectPatProp::KeyValue(key_value) => pat_has_default(&key_value.value),
                ObjectPatProp::Rest(rest) => pat_has_default(&rest.arg),
            }),
            Pat::Rest(rest_pat) => pat_has_default(&rest_pat.arg),
            Pat::Ident(_) | Pat::Expr(_) | Pat::Invalid(_) => false,
        }
    }

    fn stmt_has_default(stmt: &Stmt) -> bool {
        match stmt {
            Stmt::Decl(Decl::Var(var_decl)) => var_decl
                .decls
                .iter()
                .any(|decl| pat_has_default(&decl.name)),
            Stmt::Block(block) => block.stmts.iter().any(stmt_has_default),
            Stmt::Labeled(labeled) => stmt_has_default(&labeled.body),
            Stmt::If(if_stmt) => {
                stmt_has_default(&if_stmt.cons)
                    || if_stmt.alt.as_deref().is_some_and(stmt_has_default)
            }
            Stmt::Switch(switch_stmt) => switch_stmt
                .cases
                .iter()
                .any(|case| case.cons.iter().any(stmt_has_default)),
            Stmt::Try(try_stmt) => {
                try_stmt.block.stmts.iter().any(stmt_has_default)
                    || try_stmt
                        .handler
                        .as_ref()
                        .is_some_and(|handler| handler.body.stmts.iter().any(stmt_has_default))
                    || try_stmt
                        .finalizer
                        .as_ref()
                        .is_some_and(|finalizer| finalizer.stmts.iter().any(stmt_has_default))
            }
            Stmt::For(for_stmt) => {
                for_stmt.init.as_ref().is_some_and(|init| match init {
                    swc_ecma_ast::VarDeclOrExpr::VarDecl(var_decl) => var_decl
                        .decls
                        .iter()
                        .any(|decl| pat_has_default(&decl.name)),
                    swc_ecma_ast::VarDeclOrExpr::Expr(_) => false,
                }) || stmt_has_default(&for_stmt.body)
            }
            Stmt::ForIn(for_in_stmt) => match &for_in_stmt.left {
                swc_ecma_ast::ForHead::VarDecl(var_decl) => {
                    var_decl
                        .decls
                        .iter()
                        .any(|decl| pat_has_default(&decl.name))
                        || stmt_has_default(&for_in_stmt.body)
                }
                _ => stmt_has_default(&for_in_stmt.body),
            },
            Stmt::ForOf(for_of_stmt) => match &for_of_stmt.left {
                swc_ecma_ast::ForHead::VarDecl(var_decl) => {
                    var_decl
                        .decls
                        .iter()
                        .any(|decl| pat_has_default(&decl.name))
                        || stmt_has_default(&for_of_stmt.body)
                }
                _ => stmt_has_default(&for_of_stmt.body),
            },
            Stmt::While(while_stmt) => stmt_has_default(&while_stmt.body),
            Stmt::DoWhile(do_while_stmt) => stmt_has_default(&do_while_stmt.body),
            _ => false,
        }
    }

    body.stmts.iter().any(stmt_has_default)
}

fn contains_object_pattern_assignment_with_reassigned_binding(stmts: &[Stmt]) -> bool {
    for (index, stmt) in stmts.iter().enumerate() {
        let Stmt::Expr(expr_stmt) = stmt else {
            continue;
        };
        let Expr::Assign(assign) = unwrap_transparent_expr(&expr_stmt.expr) else {
            continue;
        };
        if assign.op != op!("=") {
            continue;
        }
        let AssignTarget::Pat(assign_pat) = &assign.left else {
            continue;
        };
        let Pat::Object(object_pat) = Pat::from(assign_pat.clone()) else {
            continue;
        };
        let binding_names = collect_pattern_binding_names(&Pat::Object(object_pat));
        if binding_names.is_empty() {
            continue;
        }
        if binding_names
            .iter()
            .any(|name| binding_reassigned_after(&stmts[index + 1..], name.as_str()))
        {
            return true;
        }
    }

    false
}

fn split_multi_var_decls_in_stmts(stmts: &mut Vec<Stmt>) {
    let mut out = Vec::with_capacity(stmts.len());
    let original = std::mem::take(stmts);

    for mut stmt in original {
        match &mut stmt {
            Stmt::Block(block) => split_multi_var_decls_in_stmts(&mut block.stmts),
            Stmt::Labeled(labeled) => {
                if let Stmt::Block(block) = &mut *labeled.body {
                    split_multi_var_decls_in_stmts(&mut block.stmts);
                }
            }
            Stmt::If(if_stmt) => {
                if let Stmt::Block(block) = &mut *if_stmt.cons {
                    split_multi_var_decls_in_stmts(&mut block.stmts);
                }
                if let Some(alt) = &mut if_stmt.alt {
                    if let Stmt::Block(block) = &mut **alt {
                        split_multi_var_decls_in_stmts(&mut block.stmts);
                    }
                }
            }
            Stmt::Try(try_stmt) => {
                split_multi_var_decls_in_stmts(&mut try_stmt.block.stmts);
                if let Some(handler) = &mut try_stmt.handler {
                    split_multi_var_decls_in_stmts(&mut handler.body.stmts);
                }
                if let Some(finalizer) = &mut try_stmt.finalizer {
                    split_multi_var_decls_in_stmts(&mut finalizer.stmts);
                }
            }
            Stmt::Switch(switch_stmt) => {
                for case in &mut switch_stmt.cases {
                    split_multi_var_decls_in_stmts(&mut case.cons);
                }
            }
            _ => {}
        }

        let Stmt::Decl(Decl::Var(var_decl)) = &stmt else {
            out.push(stmt);
            continue;
        };
        if var_decl.decls.len() <= 1 {
            out.push(stmt);
            continue;
        }

        for decl in &var_decl.decls {
            out.push(Stmt::Decl(Decl::Var(Box::new(VarDecl {
                span: var_decl.span,
                ctxt: var_decl.ctxt,
                kind: var_decl.kind,
                declare: var_decl.declare,
                decls: vec![decl.clone()],
            }))));
        }
    }

    *stmts = out;
}

fn split_multi_var_decls_without_initializers_in_stmts(stmts: &mut Vec<Stmt>) {
    let mut out = Vec::with_capacity(stmts.len());
    let original = std::mem::take(stmts);

    for mut stmt in original {
        match &mut stmt {
            Stmt::Block(block) => {
                split_multi_var_decls_without_initializers_in_stmts(&mut block.stmts);
            }
            Stmt::Labeled(labeled) => {
                if let Stmt::Block(block) = &mut *labeled.body {
                    split_multi_var_decls_without_initializers_in_stmts(&mut block.stmts);
                }
            }
            Stmt::If(if_stmt) => {
                if let Stmt::Block(block) = &mut *if_stmt.cons {
                    split_multi_var_decls_without_initializers_in_stmts(&mut block.stmts);
                }
                if let Some(alt) = &mut if_stmt.alt {
                    if let Stmt::Block(block) = &mut **alt {
                        split_multi_var_decls_without_initializers_in_stmts(&mut block.stmts);
                    }
                }
            }
            Stmt::Try(try_stmt) => {
                split_multi_var_decls_without_initializers_in_stmts(&mut try_stmt.block.stmts);
                if let Some(handler) = &mut try_stmt.handler {
                    split_multi_var_decls_without_initializers_in_stmts(&mut handler.body.stmts);
                }
                if let Some(finalizer) = &mut try_stmt.finalizer {
                    split_multi_var_decls_without_initializers_in_stmts(&mut finalizer.stmts);
                }
            }
            Stmt::Switch(switch_stmt) => {
                for case in &mut switch_stmt.cases {
                    split_multi_var_decls_without_initializers_in_stmts(&mut case.cons);
                }
            }
            _ => {}
        }

        let Stmt::Decl(Decl::Var(var_decl)) = &stmt else {
            out.push(stmt);
            continue;
        };
        if var_decl.decls.len() <= 1 || !var_decl.decls.iter().all(|decl| decl.init.is_none()) {
            out.push(stmt);
            continue;
        }

        for decl in &var_decl.decls {
            out.push(Stmt::Decl(Decl::Var(Box::new(VarDecl {
                span: var_decl.span,
                ctxt: var_decl.ctxt,
                kind: var_decl.kind,
                declare: var_decl.declare,
                decls: vec![decl.clone()],
            }))));
        }
    }

    *stmts = out;
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

fn extract_context_chained_assignment(var_decl: &VarDecl) -> Option<(Ident, Ident, Box<Expr>)> {
    if var_decl.kind != VarDeclKind::Let {
        return None;
    }

    let [first_decl, second_decl] = var_decl.decls.as_slice() else {
        return None;
    };
    let Pat::Ident(first_binding) = &first_decl.name else {
        return None;
    };
    if first_decl.init.is_some() {
        return None;
    }

    let Pat::Ident(second_binding) = &second_decl.name else {
        return None;
    };
    let Some(second_init) = &second_decl.init else {
        return None;
    };
    let Expr::Assign(assign) = unwrap_transparent_expr(second_init) else {
        return None;
    };
    if assign.op != op!("=") {
        return None;
    }
    let left_ident = assign.left.as_ident()?;
    if left_ident.id.sym != first_binding.id.sym {
        return None;
    }
    if !matches!(unwrap_transparent_expr(&assign.right), Expr::Object(_)) {
        return None;
    }

    Some((
        first_binding.id.clone(),
        second_binding.id.clone(),
        assign.right.clone(),
    ))
}

fn last_return_is_binding_pair(stmts: &[Stmt], first_name: &str, second_name: &str) -> bool {
    let Some(Stmt::Return(return_stmt)) = stmts.last() else {
        return false;
    };
    let Some(return_arg) = &return_stmt.arg else {
        return false;
    };
    let Expr::Array(array) = unwrap_transparent_expr(return_arg) else {
        return false;
    };
    let [Some(first_elem), Some(second_elem)] = array.elems.as_slice() else {
        return false;
    };
    if first_elem.spread.is_some() || second_elem.spread.is_some() {
        return false;
    }
    let Expr::Ident(first_ident) = unwrap_transparent_expr(&first_elem.expr) else {
        return false;
    };
    let Expr::Ident(second_ident) = unwrap_transparent_expr(&second_elem.expr) else {
        return false;
    };

    (first_ident.sym.as_ref() == second_name && second_ident.sym.as_ref() == first_name)
        || (first_ident.sym.as_ref() == first_name && second_ident.sym.as_ref() == second_name)
}

fn maybe_fold_constant_return_binding(stmts: &mut Vec<Stmt>) -> bool {
    let Some(last) = stmts.last() else {
        return false;
    };
    let Stmt::Return(return_stmt) = last else {
        return false;
    };
    let Some(return_arg) = &return_stmt.arg else {
        return false;
    };
    if is_constant_primitive_return_expr(return_arg) {
        return !stmts_assign_mutable_local_binding(&stmts[..stmts.len() - 1]);
    }
    let Expr::Ident(result_ident) = unwrap_transparent_expr(return_arg) else {
        return false;
    };
    let result_name = result_ident.sym.as_ref();

    let mut current: Option<f64> = None;
    let mut saw_constant_false_loop = false;
    for stmt in &stmts[..stmts.len() - 1] {
        match stmt {
            Stmt::Empty(_) => {}
            Stmt::Decl(Decl::Var(var_decl)) => {
                let [decl] = var_decl.decls.as_slice() else {
                    return false;
                };
                let Pat::Ident(binding) = &decl.name else {
                    return false;
                };
                if binding.id.sym != result_name {
                    return false;
                }
                if current.is_some() {
                    return false;
                }
                let Some(init) = decl.init.as_deref() else {
                    return false;
                };
                current = Some(match try_eval_numeric_expr(init, result_name, current) {
                    Some(value) => value,
                    None => return false,
                });
            }
            Stmt::Expr(expr_stmt) => {
                let Expr::Assign(assign) = unwrap_transparent_expr(&expr_stmt.expr) else {
                    return false;
                };
                let Some(target) = assign.left.as_ident() else {
                    return false;
                };
                if target.id.sym != result_name {
                    return false;
                }
                let Some(lhs) = current else {
                    return false;
                };
                let Some(rhs) = try_eval_numeric_expr(&assign.right, result_name, current) else {
                    return false;
                };
                let next = match assign.op {
                    op!("=") => rhs,
                    op!("+=") => lhs + rhs,
                    op!("-=") => lhs - rhs,
                    op!("*=") => lhs * rhs,
                    op!("/=") => lhs / rhs,
                    op!("%=") => lhs % rhs,
                    op!("<<=") => ((lhs as i32) << ((rhs as u32) & 0x1f)) as f64,
                    op!(">>=") => ((lhs as i32) >> ((rhs as u32) & 0x1f)) as f64,
                    op!(">>>=") => ((lhs as u32) >> ((rhs as u32) & 0x1f)) as f64,
                    op!("|=") => ((lhs as i32) | (rhs as i32)) as f64,
                    op!("&=") => ((lhs as i32) & (rhs as i32)) as f64,
                    op!("^=") => ((lhs as i32) ^ (rhs as i32)) as f64,
                    _ => return false,
                };
                current = Some(next);
            }
            Stmt::For(for_stmt) if for_stmt_has_constant_false_test(for_stmt) => {
                saw_constant_false_loop = true;
            }
            Stmt::While(while_stmt) if while_stmt_has_constant_false_test(while_stmt) => {
                saw_constant_false_loop = true;
            }
            _ => return false,
        }
    }

    let Some(value) = current else {
        return false;
    };
    if saw_constant_false_loop {
        // Keep the original structure for strict fixture parity while skipping
        // downstream memoization of a value proven independent of reactive deps.
        return true;
    }
    if !value.is_finite() {
        return false;
    }

    *stmts = vec![Stmt::Return(swc_ecma_ast::ReturnStmt {
        span: DUMMY_SP,
        arg: Some(Box::new(Expr::Lit(Lit::Num(Number {
            span: DUMMY_SP,
            value,
            raw: None,
        })))),
    })];

    true
}

fn for_stmt_has_constant_false_test(for_stmt: &swc_ecma_ast::ForStmt) -> bool {
    let Some(test) = &for_stmt.test else {
        return false;
    };
    matches!(
        unwrap_transparent_expr(test),
        Expr::Lit(Lit::Bool(swc_ecma_ast::Bool { value: false, .. }))
    )
}

fn while_stmt_has_constant_false_test(while_stmt: &swc_ecma_ast::WhileStmt) -> bool {
    matches!(
        unwrap_transparent_expr(&while_stmt.test),
        Expr::Lit(Lit::Bool(swc_ecma_ast::Bool { value: false, .. }))
    )
}

fn is_constant_primitive_return_expr(expr: &Expr) -> bool {
    match unwrap_transparent_expr(expr) {
        Expr::Lit(Lit::Num(_))
        | Expr::Lit(Lit::Str(_))
        | Expr::Lit(Lit::Bool(_))
        | Expr::Lit(Lit::Null(_)) => true,
        Expr::Ident(ident) if ident.sym == "undefined" => true,
        _ => false,
    }
}

fn find_reactive_context_return_binding(stmts: &[Stmt]) -> Option<Ident> {
    for (index, stmt) in stmts.iter().enumerate() {
        let Stmt::Decl(Decl::Var(var_decl)) = stmt else {
            continue;
        };
        if !matches!(var_decl.kind, VarDeclKind::Let | VarDeclKind::Var) {
            continue;
        }
        let [decl] = var_decl.decls.as_slice() else {
            continue;
        };
        let Pat::Ident(binding) = &decl.name else {
            continue;
        };
        if decl.init.is_none() {
            continue;
        }
        if binding_reassigned_after(&stmts[index + 1..], binding.id.sym.as_ref())
            || binding_captured_by_called_local_function_after(
                &stmts[index + 1..],
                binding.id.sym.as_ref(),
            )
            || binding_captured_by_function_passed_to_call_after(
                &stmts[index + 1..],
                binding.id.sym.as_ref(),
            )
        {
            return Some(binding.id.clone());
        }
    }
    None
}

fn stmts_assign_mutable_local_binding(stmts: &[Stmt]) -> bool {
    let mut mutable_bindings = HashSet::new();
    for stmt in stmts {
        let Stmt::Decl(Decl::Var(var_decl)) = stmt else {
            continue;
        };
        if !matches!(var_decl.kind, VarDeclKind::Let | VarDeclKind::Var) {
            continue;
        }
        for decl in &var_decl.decls {
            collect_pattern_bindings(&decl.name, &mut mutable_bindings);
        }
    }
    if mutable_bindings.is_empty() {
        return false;
    }

    struct Finder<'a> {
        mutable_bindings: &'a HashSet<String>,
        found: bool,
    }

    impl Visit for Finder<'_> {
        fn visit_assign_expr(&mut self, assign: &AssignExpr) {
            if let Some(target) = assign.left.as_ident() {
                if self.mutable_bindings.contains(target.id.sym.as_ref()) {
                    self.found = true;
                    return;
                }
            }
            assign.visit_children_with(self);
        }

        fn visit_update_expr(&mut self, update: &swc_ecma_ast::UpdateExpr) {
            if let Expr::Ident(ident) = &*update.arg {
                if self.mutable_bindings.contains(ident.sym.as_ref()) {
                    self.found = true;
                    return;
                }
            }
            update.visit_children_with(self);
        }
    }

    let mut finder = Finder {
        mutable_bindings: &mutable_bindings,
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

fn try_eval_numeric_expr(
    expr: &Expr,
    binding_name: &str,
    binding_value: Option<f64>,
) -> Option<f64> {
    match unwrap_transparent_expr(expr) {
        Expr::Lit(Lit::Num(number)) => Some(number.value),
        Expr::Ident(ident) if ident.sym == binding_name => binding_value,
        Expr::Unary(unary) => {
            let value = try_eval_numeric_expr(&unary.arg, binding_name, binding_value)?;
            match unary.op {
                op!(unary, "+") => Some(value),
                op!(unary, "-") => Some(-value),
                op!("~") => Some((!(value as i32)) as f64),
                _ => None,
            }
        }
        Expr::Bin(bin) => {
            let left = try_eval_numeric_expr(&bin.left, binding_name, binding_value)?;
            let right = try_eval_numeric_expr(&bin.right, binding_name, binding_value)?;
            match bin.op {
                op!(bin, "+") => Some(left + right),
                op!(bin, "-") => Some(left - right),
                op!("*") => Some(left * right),
                op!("/") => Some(left / right),
                op!("%") => Some(left % right),
                op!("<<") => Some((((left as i32) << ((right as u32) & 0x1f)) as i32) as f64),
                op!(">>") => Some((((left as i32) >> ((right as u32) & 0x1f)) as i32) as f64),
                op!(">>>") => Some((((left as u32) >> ((right as u32) & 0x1f)) as u32) as f64),
                op!("|") => Some((((left as i32) | (right as i32)) as i32) as f64),
                op!("&") => Some((((left as i32) & (right as i32)) as i32) as f64),
                op!("^") => Some((((left as i32) ^ (right as i32)) as i32) as f64),
                _ => None,
            }
        }
        _ => None,
    }
}

fn promote_var_decl_to_const_when_immutable(var_decl: &mut VarDecl, remaining: &[Stmt]) {
    if var_decl.kind != VarDeclKind::Let {
        return;
    }

    let immutable = var_decl.decls.iter().all(|decl| {
        decl.init.is_some()
            && collect_pattern_binding_names(&decl.name)
                .into_iter()
                .all(|name| {
                    !binding_reassigned_after(remaining, name.as_str())
                        && !binding_captured_by_called_local_function_after(
                            remaining,
                            name.as_str(),
                        )
                        && !binding_captured_by_function_passed_to_call_after(
                            remaining,
                            name.as_str(),
                        )
                })
    });
    if immutable {
        var_decl.kind = VarDeclKind::Const;
    }
}

fn state_tuple_setter_bindings(decl: &VarDeclarator) -> HashSet<String> {
    let mut setters = HashSet::new();
    let Pat::Array(array_pat) = &decl.name else {
        return setters;
    };
    let Some(Some(second)) = array_pat.elems.get(1) else {
        return setters;
    };
    let Pat::Ident(setter) = second else {
        return setters;
    };
    let Some(init) = &decl.init else {
        return setters;
    };
    let Expr::Call(call) = unwrap_transparent_expr(init) else {
        return setters;
    };
    if !call_is_state_tuple_hook(call) {
        return setters;
    }

    setters.insert(setter.id.sym.to_string());
    setters
}

fn ref_object_binding_from_hook(decl: &VarDeclarator) -> Option<String> {
    let Pat::Ident(binding) = &decl.name else {
        return None;
    };
    let Some(init) = &decl.init else {
        return None;
    };
    let Expr::Call(call) = unwrap_transparent_expr(init) else {
        return None;
    };
    let Callee::Expr(callee_expr) = &call.callee else {
        return None;
    };
    let hook_name = match unwrap_transparent_expr(callee_expr) {
        Expr::Ident(ident) => Some(ident.sym.as_ref().to_string()),
        Expr::Member(member) => member_prop_name(&member.prop),
        _ => None,
    };
    if matches!(hook_name.as_deref(), Some("useRef" | "createRef")) {
        return Some(binding.id.sym.to_string());
    }
    None
}

fn expr_is_ref_object_hook_call(expr: &Expr) -> bool {
    let Expr::Call(call) = unwrap_transparent_expr(expr) else {
        return false;
    };
    let Callee::Expr(callee_expr) = &call.callee else {
        return false;
    };
    let hook_name = match unwrap_transparent_expr(callee_expr) {
        Expr::Ident(ident) => Some(ident.sym.as_ref().to_string()),
        Expr::Member(member) => member_prop_name(&member.prop),
        _ => None,
    };
    matches!(hook_name.as_deref(), Some("useRef" | "createRef"))
}

fn call_is_state_tuple_hook(call: &CallExpr) -> bool {
    let Callee::Expr(callee_expr) = &call.callee else {
        return false;
    };
    let hook_name = match unwrap_transparent_expr(callee_expr) {
        Expr::Ident(ident) => Some(ident.sym.as_ref().to_string()),
        Expr::Member(member) => member_prop_name(&member.prop),
        _ => None,
    };

    matches!(
        hook_name.as_deref(),
        Some("useState" | "useReducer" | "useActionState" | "useTransition" | "useOptimistic")
    )
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

fn rewrite_use_callback_decls_to_use_memo(stmts: &mut [Stmt]) {
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

            let is_use_callback = match unwrap_transparent_expr(callee_expr) {
                Expr::Ident(callee) => callee.sym == "useCallback",
                Expr::Member(member) => {
                    member_prop_name(&member.prop).is_some_and(|name| name == "useCallback")
                }
                _ => false,
            };
            if !is_use_callback {
                continue;
            }

            let [callback_arg, deps_arg] = call.args.as_slice() else {
                continue;
            };
            if callback_arg.spread.is_some() || deps_arg.spread.is_some() {
                continue;
            }
            if !matches!(
                unwrap_transparent_expr(&callback_arg.expr),
                Expr::Arrow(_) | Expr::Fn(_)
            ) {
                continue;
            }

            let factory = Expr::Arrow(ArrowExpr {
                span: DUMMY_SP,
                ctxt: Default::default(),
                params: Vec::new(),
                body: Box::new(swc_ecma_ast::BlockStmtOrExpr::Expr(
                    callback_arg.expr.clone(),
                )),
                is_async: false,
                is_generator: false,
                type_params: None,
                return_type: None,
            });
            let rewritten = Expr::Call(CallExpr {
                span: call.span,
                ctxt: call.ctxt,
                callee: Callee::Expr(Box::new(Expr::Ident(Ident::new_no_ctxt(
                    "useMemo".into(),
                    DUMMY_SP,
                )))),
                args: vec![
                    ExprOrSpread {
                        spread: None,
                        expr: Box::new(factory),
                    },
                    ExprOrSpread {
                        spread: None,
                        expr: deps_arg.expr.clone(),
                    },
                ],
                type_args: None,
            });
            decl.init = Some(Box::new(rewritten));
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
    if !matches!(&*next_init, Expr::Arrow(_) | Expr::Fn(_)) {
        return false;
    }
    let outer = HashSet::from([binding.to_string()]);
    function_expr_may_capture_outer_bindings(&next_init, &outer)
}

fn next_stmt_function_decl_uses_binding_as_bare_ident(
    stmts: &[Stmt],
    index: usize,
    binding: &str,
) -> bool {
    let Some(next_stmt) = stmts.get(index + 1) else {
        return false;
    };
    let Some((_, next_init)) = extract_memoizable_single_decl(next_stmt) else {
        return false;
    };
    if !matches!(&*next_init, Expr::Arrow(_) | Expr::Fn(_)) {
        return false;
    }
    function_expr_uses_binding_as_bare_ident(&next_init, binding)
}

fn next_stmt_iife_captures_binding(stmts: &[Stmt], index: usize, binding: &str) -> bool {
    let Some(next_stmt) = stmts.get(index + 1) else {
        return false;
    };
    let Stmt::Expr(expr_stmt) = next_stmt else {
        return false;
    };
    let Expr::Call(call) = unwrap_transparent_expr(&expr_stmt.expr) else {
        return false;
    };
    if !call.args.is_empty() {
        return false;
    }
    let Callee::Expr(callee_expr) = &call.callee else {
        return false;
    };
    let outer = HashSet::from([binding.to_string()]);
    function_expr_may_capture_outer_bindings(callee_expr, &outer)
        || count_binding_references_in_stmt(next_stmt, binding) > 0
}

fn next_stmt_iife_may_mutate_binding(stmts: &[Stmt], index: usize, binding: &str) -> bool {
    let Some(next_stmt) = stmts.get(index + 1) else {
        return false;
    };
    let Stmt::Expr(expr_stmt) = next_stmt else {
        return false;
    };
    let Expr::Call(call) = unwrap_transparent_expr(&expr_stmt.expr) else {
        return false;
    };

    iife_call_may_mutate_binding(call, binding)
}

fn next_stmt_destructures_from_binding(stmts: &[Stmt], index: usize, binding: &str) -> bool {
    let Some(next_stmt) = stmts.get(index + 1) else {
        return false;
    };
    let Stmt::Decl(Decl::Var(var_decl)) = next_stmt else {
        return false;
    };
    let [decl] = var_decl.decls.as_slice() else {
        return false;
    };
    if matches!(decl.name, Pat::Ident(_)) {
        return false;
    }
    let Some(init) = &decl.init else {
        return false;
    };
    matches!(
        unwrap_transparent_expr(init),
        Expr::Ident(source) if source.sym == binding
    )
}

fn first_following_block_shadows_binding(stmts: &[Stmt], binding: &str) -> bool {
    let Some(Stmt::Block(block)) = stmts.first() else {
        return false;
    };

    block.stmts.iter().any(|stmt| {
        let mut names = HashSet::new();
        collect_stmt_bindings(stmt, &mut names);
        names.contains(binding)
    })
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

fn normalize_non_ident_params_without_memoization(reactive: &mut ReactiveFunction) {
    let mut reserved = HashSet::new();
    for pat in &reactive.params {
        collect_pattern_bindings(pat, &mut reserved);
    }
    for stmt in &reactive.body.stmts {
        collect_stmt_bindings(stmt, &mut reserved);
    }

    let mut known_bindings = HashMap::<String, bool>::new();
    let mut next_temp = 0u32;
    let mut param_prologue = rewrite_non_ident_params(
        &mut reactive.params,
        &mut reserved,
        &mut next_temp,
        &mut known_bindings,
    );
    strip_runtime_call_type_args_in_stmts(&mut param_prologue);
    rewrite_let_array_pattern_decls_to_assignment_stmts(&mut param_prologue, &mut reserved);
    rewrite_const_object_pattern_default_decls_to_temp_chain(&mut param_prologue, &mut reserved);

    let mut stmts = std::mem::take(&mut reactive.body.stmts);
    rewrite_let_array_pattern_decls_to_assignment_stmts(&mut stmts, &mut reserved);
    rewrite_const_object_pattern_default_decls_to_temp_chain(&mut stmts, &mut reserved);
    prune_overwritten_branch_and_switch_assignments_in_stmts(&mut stmts);
    normalize_switch_case_blocks_in_stmts(&mut stmts);
    prune_trivial_do_while_break_stmts(&mut stmts);
    normalize_reactive_labels(&mut stmts);
    if param_prologue.is_empty() {
        reactive.body.stmts = stmts;
        return;
    }

    let directive_end = stmts
        .iter()
        .take_while(|stmt| directive_from_stmt(stmt).is_some())
        .count();
    let mut transformed = Vec::new();
    transformed.extend(stmts.drain(..directive_end));
    transformed.extend(param_prologue);
    transformed.extend(stmts);
    reactive.body.stmts = transformed;
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
            Pat::Assign(assign_pat) => {
                let left_pat = (*assign_pat.left).clone();
                let default_expr = assign_pat.right.clone();
                for binding in collect_pattern_binding_names(&left_pat) {
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
                    left_pat,
                    Some(Box::new(Expr::Cond(swc_ecma_ast::CondExpr {
                        span: DUMMY_SP,
                        test: Box::new(Expr::Bin(swc_ecma_ast::BinExpr {
                            span: DUMMY_SP,
                            op: op!("==="),
                            left: Box::new(Expr::Ident(temp.clone())),
                            right: Box::new(Expr::Ident(Ident::new_no_ctxt(
                                "undefined".into(),
                                DUMMY_SP,
                            ))),
                        })),
                        cons: default_expr,
                        alt: Box::new(Expr::Ident(temp)),
                    }))),
                ));
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

                if let Pat::Array(array_pat) = &original {
                    let non_hole_pats = array_pat.elems.iter().flatten().collect::<Vec<_>>();
                    if non_hole_pats.len() == 1 {
                        if let Pat::Assign(assign_pat) = non_hole_pats[0] {
                            if let Pat::Ident(binding) = &*assign_pat.left {
                                let value_temp = fresh_temp_ident(next_temp, used);
                                known_bindings.insert(value_temp.sym.to_string(), false);
                                prologue.push(make_var_decl(
                                    VarDeclKind::Const,
                                    Pat::Array(swc_ecma_ast::ArrayPat {
                                        span: array_pat.span,
                                        elems: vec![Some(Pat::Ident(BindingIdent {
                                            id: value_temp.clone(),
                                            type_ann: None,
                                        }))],
                                        optional: false,
                                        type_ann: None,
                                    }),
                                    Some(Box::new(Expr::Ident(temp))),
                                ));
                                prologue.push(make_var_decl(
                                    VarDeclKind::Const,
                                    Pat::Ident(BindingIdent {
                                        id: binding.id.clone(),
                                        type_ann: binding.type_ann.clone(),
                                    }),
                                    Some(Box::new(Expr::Cond(swc_ecma_ast::CondExpr {
                                        span: DUMMY_SP,
                                        test: Box::new(Expr::Bin(swc_ecma_ast::BinExpr {
                                            span: DUMMY_SP,
                                            op: op!("==="),
                                            left: Box::new(Expr::Ident(value_temp.clone())),
                                            right: Box::new(Expr::Ident(Ident::new_no_ctxt(
                                                "undefined".into(),
                                                DUMMY_SP,
                                            ))),
                                        })),
                                        cons: parenthesize_conditional_expr(
                                            assign_pat.right.clone(),
                                        ),
                                        alt: Box::new(Expr::Ident(value_temp)),
                                    }))),
                                ));
                                continue;
                            }
                        }
                    }
                }

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

fn is_latest_fresh_temp_ident(ident: &Ident, next_temp: u32) -> bool {
    if next_temp == 0 {
        return false;
    }
    let Some(index) = parse_temp_name(ident.sym.as_ref()) else {
        return false;
    };
    index + 1 == next_temp
}

fn parse_temp_name(name: &str) -> Option<u32> {
    let index_str = name.strip_prefix('t')?;
    if index_str.is_empty() || !index_str.chars().all(|ch| ch.is_ascii_digit()) {
        return None;
    }
    index_str.parse::<u32>().ok()
}

fn fresh_dollar_suffix_name(base: &str, used: &mut HashSet<String>) -> String {
    let mut index = 0u32;
    loop {
        let candidate = format!("{base}${index}");
        if used.insert(candidate.clone()) {
            return candidate;
        }
        index += 1;
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

#[allow(clippy::too_many_arguments)]
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

fn parenthesize_nested_memo_jsx_expr(expr: Box<Expr>) -> Box<Expr> {
    if matches!(&*expr, Expr::JSXElement(_) | Expr::JSXFragment(_)) {
        Box::new(Expr::Paren(swc_ecma_ast::ParenExpr {
            span: DUMMY_SP,
            expr,
        }))
    } else {
        expr
    }
}

fn lower_use_memo_initializer(
    init: &Expr,
    known_bindings: &HashMap<String, bool>,
) -> Option<(Vec<ReactiveDependency>, Vec<Stmt>)> {
    let Expr::Call(call) = unwrap_transparent_expr(init) else {
        return None;
    };
    if !call_is_use_memo(call) {
        return None;
    }
    if !(1..=2).contains(&call.args.len()) {
        return None;
    }

    let factory_arg = call.args.first()?;
    if factory_arg.spread.is_some() {
        return None;
    }

    let (params, mut body_stmts, body_expr) = match unwrap_transparent_expr(&factory_arg.expr) {
        Expr::Arrow(arrow) => {
            let params = arrow.params.clone();
            match &*arrow.body {
                swc_ecma_ast::BlockStmtOrExpr::Expr(expr) => {
                    (params, Vec::new(), Some(expr.clone()))
                }
                swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) => {
                    (params, block.stmts.clone(), None)
                }
            }
        }
        Expr::Fn(fn_expr) => {
            let params = fn_expr
                .function
                .params
                .iter()
                .map(|param| param.pat.clone())
                .collect::<Vec<_>>();
            (
                params,
                fn_expr.function.body.clone().unwrap_or_default().stmts,
                None,
            )
        }
        _ => return None,
    };

    let mut param_bindings = HashSet::new();
    for param in &params {
        collect_pattern_bindings(param, &mut param_bindings);
    }

    let mut deps = if let Some(deps_arg) = call.args.get(1) {
        collect_dependencies_from_manual_memo_dep_array(deps_arg, known_bindings)?
    } else if let Some(expr) = &body_expr {
        collect_dependencies_from_expr(expr, known_bindings, &param_bindings)
    } else {
        let mut local_bindings = param_bindings.clone();
        for stmt in &body_stmts {
            collect_stmt_bindings(stmt, &mut local_bindings);
        }

        let mut deps =
            collect_dependencies_from_stmts(&body_stmts, known_bindings, &local_bindings);
        let called_fn_deps =
            collect_called_local_function_capture_dependencies(&body_stmts, known_bindings);
        for dep in called_fn_deps {
            if !deps.iter().any(|existing| existing.key == dep.key) {
                deps.push(dep);
            }
        }
        reduce_dependencies(deps)
    };
    deps = reduce_dependencies(deps);

    let result_ident = Ident::new_no_ctxt("t0".into(), DUMMY_SP);
    let mut compute_stmts = if let Some(expr) = body_expr {
        vec![assign_stmt(AssignTarget::from(result_ident.clone()), expr)]
    } else if let Some(last_stmt) = body_stmts.last() {
        if matches!(last_stmt, Stmt::Return(_))
            && !contains_return_stmt_in_stmts(&body_stmts[..body_stmts.len().saturating_sub(1)])
        {
            let return_stmt = body_stmts.pop();
            if let Some(Stmt::Return(return_stmt)) = return_stmt {
                body_stmts.push(assign_stmt(
                    AssignTarget::from(result_ident.clone()),
                    return_stmt.arg.unwrap_or_else(|| {
                        Box::new(Expr::Ident(Ident::new_no_ctxt(
                            "undefined".into(),
                            DUMMY_SP,
                        )))
                    }),
                ));
            }
            body_stmts
        } else if contains_return_stmt_in_stmts(&body_stmts) {
            let label = Ident::new_no_ctxt("bb0".into(), DUMMY_SP);
            let (rewritten, has_return) =
                rewrite_returns_for_labeled_block(body_stmts, &label, &result_ident);
            if has_return {
                vec![Stmt::Labeled(LabeledStmt {
                    span: DUMMY_SP,
                    label,
                    body: Box::new(Stmt::Block(BlockStmt {
                        span: DUMMY_SP,
                        ctxt: Default::default(),
                        stmts: rewritten,
                    })),
                })]
            } else {
                rewritten
            }
        } else {
            body_stmts
        }
    } else {
        Vec::new()
    };

    if !stmt_assigns_binding(
        compute_stmts
            .last()
            .unwrap_or(&Stmt::Empty(swc_ecma_ast::EmptyStmt { span: DUMMY_SP })),
        result_ident.sym.as_ref(),
    ) {
        compute_stmts.push(assign_stmt(
            AssignTarget::from(result_ident.clone()),
            Box::new(Expr::Ident(Ident::new_no_ctxt(
                "undefined".into(),
                DUMMY_SP,
            ))),
        ));
    }

    rewrite_assignment_target_in_stmts(&mut compute_stmts, result_ident.sym.as_ref(), "t_usememo");
    inline_trivial_iifes_in_stmts(&mut compute_stmts);
    strip_runtime_call_type_args_in_stmts(&mut compute_stmts);
    normalize_static_string_members_in_stmts(&mut compute_stmts);
    inline_const_literal_indices_in_stmts(&mut compute_stmts);
    normalize_compound_assignments_in_stmts(&mut compute_stmts);
    normalize_reactive_labels(&mut compute_stmts);
    normalize_if_break_blocks(&mut compute_stmts);
    prune_empty_stmts(&mut compute_stmts);
    prune_noop_identifier_exprs(&mut compute_stmts);
    prune_unused_pure_var_decls(&mut compute_stmts);
    prune_unused_function_like_decl_stmts(&mut compute_stmts);
    promote_immutable_lets_to_const(&mut compute_stmts);

    Some((deps, compute_stmts))
}

fn call_is_use_memo(call: &CallExpr) -> bool {
    let Callee::Expr(callee_expr) = &call.callee else {
        return false;
    };

    match unwrap_transparent_expr(callee_expr) {
        Expr::Ident(callee) => callee.sym == "useMemo",
        Expr::Member(member) => {
            member_prop_name(&member.prop).is_some_and(|name| name == "useMemo")
        }
        _ => false,
    }
}

fn member_prop_name(prop: &MemberProp) -> Option<String> {
    match prop {
        MemberProp::Ident(ident) => Some(ident.sym.to_string()),
        MemberProp::Computed(computed) => match &*computed.expr {
            Expr::Lit(Lit::Str(str_lit)) => Some(str_lit.value.to_string_lossy().to_string()),
            _ => None,
        },
        MemberProp::PrivateName(_) => None,
    }
}

fn collect_dependencies_from_manual_memo_dep_array(
    deps_arg: &ExprOrSpread,
    known_bindings: &HashMap<String, bool>,
) -> Option<Vec<ReactiveDependency>> {
    if deps_arg.spread.is_some() {
        return None;
    }
    let Expr::Array(dep_array) = &*deps_arg.expr else {
        return None;
    };

    let mut deps = Vec::new();
    let mut seen = HashSet::new();
    let local_bindings = HashSet::new();
    for element in dep_array.elems.iter().flatten() {
        if element.spread.is_some() {
            return None;
        }
        for dep in collect_dependencies_from_expr(&element.expr, known_bindings, &local_bindings) {
            if seen.insert(dep.key.clone()) {
                deps.push(dep);
            }
        }
    }
    Some(deps)
}

fn prune_trivial_do_while_break_stmts(stmts: &mut Vec<Stmt>) {
    fn stmt_is_unlabeled_break(stmt: &Stmt) -> bool {
        matches!(stmt, Stmt::Break(break_stmt) if break_stmt.label.is_none())
    }

    fn extract_unconditional_do_while_prefix(
        do_while_stmt: &swc_ecma_ast::DoWhileStmt,
    ) -> Option<Vec<Stmt>> {
        let Stmt::Block(block) = &*do_while_stmt.body else {
            return stmt_is_unlabeled_break(&do_while_stmt.body).then(Vec::new);
        };

        let non_empty_indices = block
            .stmts
            .iter()
            .enumerate()
            .filter_map(|(idx, stmt)| (!matches!(stmt, Stmt::Empty(_))).then_some(idx))
            .collect::<Vec<_>>();
        let &last_non_empty_idx = non_empty_indices.last()?;
        if !stmt_is_unlabeled_break(&block.stmts[last_non_empty_idx]) {
            return None;
        }

        // Keep this rewrite conservative: if the do-body has other top-level
        // break/continue control flow, we skip lowering because it may alter
        // loop semantics.
        for &idx in &non_empty_indices[..non_empty_indices.len().saturating_sub(1)] {
            if matches!(block.stmts[idx], Stmt::Break(_) | Stmt::Continue(_)) {
                return None;
            }
        }

        let mut prefix = Vec::with_capacity(non_empty_indices.len().saturating_sub(1));
        for (idx, stmt) in block.stmts.iter().enumerate() {
            if idx == last_non_empty_idx || matches!(stmt, Stmt::Empty(_)) {
                continue;
            }
            prefix.push(stmt.clone());
        }

        Some(prefix)
    }

    let mut pruned = Vec::with_capacity(stmts.len());
    let original = std::mem::take(stmts);

    for mut stmt in original {
        match &mut stmt {
            Stmt::Block(block) => prune_trivial_do_while_break_stmts(&mut block.stmts),
            Stmt::Labeled(labeled) => {
                if let Stmt::Block(block) = &mut *labeled.body {
                    prune_trivial_do_while_break_stmts(&mut block.stmts);
                }
            }
            Stmt::If(if_stmt) => {
                if let Stmt::Block(block) = &mut *if_stmt.cons {
                    prune_trivial_do_while_break_stmts(&mut block.stmts);
                }
                if let Some(alt) = &mut if_stmt.alt {
                    if let Stmt::Block(block) = &mut **alt {
                        prune_trivial_do_while_break_stmts(&mut block.stmts);
                    }
                }
            }
            Stmt::Try(try_stmt) => {
                prune_trivial_do_while_break_stmts(&mut try_stmt.block.stmts);
                if let Some(handler) = &mut try_stmt.handler {
                    prune_trivial_do_while_break_stmts(&mut handler.body.stmts);
                }
                if let Some(finalizer) = &mut try_stmt.finalizer {
                    prune_trivial_do_while_break_stmts(&mut finalizer.stmts);
                }
            }
            Stmt::Switch(switch_stmt) => {
                for case in &mut switch_stmt.cases {
                    prune_trivial_do_while_break_stmts(&mut case.cons);
                }
            }
            Stmt::DoWhile(do_while_stmt) => {
                if let Stmt::Block(block) = &mut *do_while_stmt.body {
                    prune_trivial_do_while_break_stmts(&mut block.stmts);
                }
            }
            _ => {}
        }

        if let Stmt::DoWhile(do_while_stmt) = &stmt {
            if let Some(prefix) = extract_unconditional_do_while_prefix(do_while_stmt) {
                pruned.extend(prefix);
                continue;
            }
        }

        pruned.push(stmt);
    }

    *stmts = pruned;
}

fn prune_overwritten_branch_and_switch_assignments_in_stmts(stmts: &mut [Stmt]) {
    fn single_non_empty_stmt(stmts: &[Stmt]) -> Option<&Stmt> {
        let mut non_empty = stmts.iter().filter(|stmt| !matches!(stmt, Stmt::Empty(_)));
        let first = non_empty.next()?;
        if non_empty.next().is_some() {
            return None;
        }
        Some(first)
    }

    fn simple_assignment_target_and_purity(stmt: &Stmt) -> Option<(String, bool)> {
        let stmt = match stmt {
            Stmt::Block(block) => single_non_empty_stmt(&block.stmts)?,
            other => other,
        };

        let Stmt::Expr(expr_stmt) = stmt else {
            return None;
        };
        let Expr::Assign(assign) = unwrap_transparent_expr(&expr_stmt.expr) else {
            return None;
        };
        if assign.op != op!("=") {
            return None;
        }
        let target = assign.left.as_ident()?;
        Some((
            target.id.sym.to_string(),
            !expr_has_observable_side_effect(&assign.right),
        ))
    }

    fn clear_simple_pure_assignment_stmt_if_matches(stmt: &mut Box<Stmt>, target: &str) -> bool {
        let Some((name, is_pure)) = simple_assignment_target_and_purity(stmt) else {
            return false;
        };
        if name != target || !is_pure {
            return false;
        }

        match &mut **stmt {
            Stmt::Block(block) => {
                block.stmts.clear();
            }
            _ => {
                *stmt = Box::new(Stmt::Block(BlockStmt {
                    span: DUMMY_SP,
                    ctxt: Default::default(),
                    stmts: Vec::new(),
                }));
            }
        }
        true
    }

    fn case_falls_through(case: &swc_ecma_ast::SwitchCase) -> bool {
        fn stmt_terminates_case(stmt: &Stmt) -> bool {
            match stmt {
                Stmt::Break(_) | Stmt::Continue(_) | Stmt::Return(_) | Stmt::Throw(_) => true,
                Stmt::Block(block) => block
                    .stmts
                    .iter()
                    .rev()
                    .find(|stmt| !matches!(stmt, Stmt::Empty(_)))
                    .is_some_and(stmt_terminates_case),
                _ => false,
            }
        }

        case.cons
            .iter()
            .rev()
            .find(|stmt| !matches!(stmt, Stmt::Empty(_)))
            .map(|stmt| !stmt_terminates_case(stmt))
            .unwrap_or(true)
    }

    fn case_single_pure_assignment_target(case: &swc_ecma_ast::SwitchCase) -> Option<String> {
        let stmt = single_non_empty_stmt(&case.cons)?;
        let (target, is_pure) = simple_assignment_target_and_purity(stmt)?;
        is_pure.then_some(target)
    }

    fn case_starts_with_assignment_to_target(
        case: &swc_ecma_ast::SwitchCase,
        target: &str,
    ) -> bool {
        let Some(first) = case
            .cons
            .iter()
            .find(|stmt| !matches!(stmt, Stmt::Empty(_)))
        else {
            return false;
        };
        let Some((name, _)) = simple_assignment_target_and_purity(first) else {
            return false;
        };
        name == target
    }

    fn prune_switch_case_fallthrough_overwritten_assignments(
        switch_stmt: &mut swc_ecma_ast::SwitchStmt,
    ) {
        let mut index = 0usize;
        while index + 1 < switch_stmt.cases.len() {
            let Some(target) = case_single_pure_assignment_target(&switch_stmt.cases[index]) else {
                index += 1;
                continue;
            };
            if !case_falls_through(&switch_stmt.cases[index])
                || !case_starts_with_assignment_to_target(&switch_stmt.cases[index + 1], &target)
            {
                index += 1;
                continue;
            }

            switch_stmt.cases[index].cons.clear();
            index += 1;
        }
    }

    fn recurse_stmt(stmt: &mut Stmt) {
        match stmt {
            Stmt::Block(block) => {
                prune_overwritten_branch_and_switch_assignments_in_stmts(&mut block.stmts)
            }
            Stmt::Labeled(labeled) => recurse_stmt(&mut labeled.body),
            Stmt::If(if_stmt) => {
                recurse_stmt(&mut if_stmt.cons);
                if let Some(alt) = &mut if_stmt.alt {
                    recurse_stmt(alt);
                }
            }
            Stmt::Switch(switch_stmt) => {
                for case in &mut switch_stmt.cases {
                    prune_overwritten_branch_and_switch_assignments_in_stmts(&mut case.cons);
                }
                prune_switch_case_fallthrough_overwritten_assignments(switch_stmt);
            }
            Stmt::While(while_stmt) => recurse_stmt(&mut while_stmt.body),
            Stmt::DoWhile(do_while_stmt) => recurse_stmt(&mut do_while_stmt.body),
            Stmt::For(for_stmt) => recurse_stmt(&mut for_stmt.body),
            Stmt::ForIn(for_in_stmt) => recurse_stmt(&mut for_in_stmt.body),
            Stmt::ForOf(for_of_stmt) => recurse_stmt(&mut for_of_stmt.body),
            Stmt::Try(try_stmt) => {
                prune_overwritten_branch_and_switch_assignments_in_stmts(&mut try_stmt.block.stmts);
                if let Some(handler) = &mut try_stmt.handler {
                    prune_overwritten_branch_and_switch_assignments_in_stmts(
                        &mut handler.body.stmts,
                    );
                }
                if let Some(finalizer) = &mut try_stmt.finalizer {
                    prune_overwritten_branch_and_switch_assignments_in_stmts(&mut finalizer.stmts);
                }
            }
            _ => {}
        }
    }

    for stmt in stmts.iter_mut() {
        recurse_stmt(stmt);
    }

    for index in 0..stmts.len().saturating_sub(1) {
        let Some((next_target, _)) = simple_assignment_target_and_purity(&stmts[index + 1]) else {
            continue;
        };
        let Stmt::If(if_stmt) = &mut stmts[index] else {
            continue;
        };
        clear_simple_pure_assignment_stmt_if_matches(&mut if_stmt.cons, &next_target);
    }
}

fn rewrite_assignment_target_in_stmts(stmts: &mut [Stmt], from: &str, to: &str) {
    struct Rewriter<'a> {
        from: &'a str,
        to: &'a str,
    }

    impl VisitMut for Rewriter<'_> {
        fn visit_mut_assign_expr(&mut self, assign: &mut AssignExpr) {
            assign.visit_mut_children_with(self);
            if assign.op != op!("=") {
                return;
            }
            let Some(binding) = assign.left.as_ident_mut() else {
                return;
            };
            if binding.id.sym == self.from {
                binding.id.sym = self.to.into();
            }
        }
    }

    let mut rewriter = Rewriter { from, to };
    for stmt in stmts {
        stmt.visit_mut_with(&mut rewriter);
    }
}

fn rewrite_terminal_self_assignment_to_pattern_write(stmts: &mut Vec<Stmt>, binding: &str) -> bool {
    let Some(Stmt::Expr(expr_stmt)) = stmts.last() else {
        return false;
    };
    let Expr::Assign(assign) = &*expr_stmt.expr else {
        return false;
    };
    if assign.op != op!("=") {
        return false;
    }
    let Some(left) = assign.left.as_ident() else {
        return false;
    };
    let Expr::Ident(right) = &*assign.right else {
        return false;
    };
    if left.id.sym != binding || right.sym != binding {
        return false;
    }

    for stmt in stmts.iter_mut() {
        let Stmt::Decl(Decl::Var(var_decl)) = stmt else {
            continue;
        };
        let [declarator] = var_decl.decls.as_slice() else {
            continue;
        };
        if !collect_pattern_binding_names(&declarator.name)
            .iter()
            .any(|name| name == binding)
        {
            continue;
        }
        let Some(init) = &declarator.init else {
            continue;
        };
        let mut assign_pat = declarator.name.clone();
        normalize_array_pattern_holes(&mut assign_pat);
        let Ok(target) = AssignTarget::try_from(assign_pat) else {
            continue;
        };

        *stmt = assign_stmt(target, init.clone());
        stmts.pop();
        return true;
    }

    false
}

fn flatten_nested_destructuring_assignments_in_stmts(
    stmts: &mut Vec<Stmt>,
    reserved: &mut HashSet<String>,
    next_temp: &mut u32,
) {
    let mut rewritten = Vec::with_capacity(stmts.len());
    let original = std::mem::take(stmts);

    for mut stmt in original {
        match &mut stmt {
            Stmt::Block(block) => flatten_nested_destructuring_assignments_in_stmts(
                &mut block.stmts,
                reserved,
                next_temp,
            ),
            Stmt::Labeled(labeled) => {
                if let Stmt::Block(block) = &mut *labeled.body {
                    flatten_nested_destructuring_assignments_in_stmts(
                        &mut block.stmts,
                        reserved,
                        next_temp,
                    );
                }
            }
            Stmt::If(if_stmt) => {
                if let Stmt::Block(block) = &mut *if_stmt.cons {
                    flatten_nested_destructuring_assignments_in_stmts(
                        &mut block.stmts,
                        reserved,
                        next_temp,
                    );
                }
                if let Some(alt) = &mut if_stmt.alt {
                    if let Stmt::Block(block) = &mut **alt {
                        flatten_nested_destructuring_assignments_in_stmts(
                            &mut block.stmts,
                            reserved,
                            next_temp,
                        );
                    }
                }
            }
            Stmt::Try(try_stmt) => {
                flatten_nested_destructuring_assignments_in_stmts(
                    &mut try_stmt.block.stmts,
                    reserved,
                    next_temp,
                );
                if let Some(handler) = &mut try_stmt.handler {
                    flatten_nested_destructuring_assignments_in_stmts(
                        &mut handler.body.stmts,
                        reserved,
                        next_temp,
                    );
                }
                if let Some(finalizer) = &mut try_stmt.finalizer {
                    flatten_nested_destructuring_assignments_in_stmts(
                        &mut finalizer.stmts,
                        reserved,
                        next_temp,
                    );
                }
            }
            Stmt::Switch(switch_stmt) => {
                for case in &mut switch_stmt.cases {
                    flatten_nested_destructuring_assignments_in_stmts(
                        &mut case.cons,
                        reserved,
                        next_temp,
                    );
                }
            }
            _ => {}
        }

        let Some(lowered) = lower_nested_destructuring_assignment_stmt(&stmt, reserved, next_temp)
        else {
            rewritten.push(stmt);
            continue;
        };
        rewritten.extend(lowered);
    }

    *stmts = rewritten;
}

fn lower_nested_destructuring_assignment_stmt(
    stmt: &Stmt,
    reserved: &mut HashSet<String>,
    next_temp: &mut u32,
) -> Option<Vec<Stmt>> {
    let Stmt::Expr(expr_stmt) = stmt else {
        return None;
    };
    let Expr::Assign(assign) = unwrap_transparent_expr(&expr_stmt.expr) else {
        return None;
    };
    if assign.op != op!("=") {
        return None;
    }
    let AssignTarget::Pat(assign_pat) = &assign.left else {
        return None;
    };
    let pat = Pat::from(assign_pat.clone());
    if !pattern_contains_nested_destructuring(&pat) {
        return None;
    }

    let mut lowered = Vec::new();
    lower_nested_destructuring_pattern_from_source(
        pat,
        assign.right.clone(),
        reserved,
        next_temp,
        &mut lowered,
    );
    Some(lowered)
}

fn pattern_contains_nested_destructuring(pat: &Pat) -> bool {
    match pat {
        Pat::Array(array_pat) => array_pat.elems.iter().flatten().any(|element| {
            matches!(element, Pat::Array(_) | Pat::Object(_))
                || pattern_contains_nested_destructuring(element)
        }),
        Pat::Object(object_pat) => object_pat.props.iter().any(|prop| match prop {
            ObjectPatProp::Assign(_) => false,
            ObjectPatProp::KeyValue(key_value) => {
                matches!(*key_value.value, Pat::Array(_) | Pat::Object(_))
                    || pattern_contains_nested_destructuring(&key_value.value)
            }
            ObjectPatProp::Rest(rest) => {
                matches!(*rest.arg, Pat::Array(_) | Pat::Object(_))
                    || pattern_contains_nested_destructuring(&rest.arg)
            }
        }),
        Pat::Assign(assign_pat) => {
            matches!(*assign_pat.left, Pat::Array(_) | Pat::Object(_))
                || pattern_contains_nested_destructuring(&assign_pat.left)
        }
        Pat::Rest(rest_pat) => {
            matches!(*rest_pat.arg, Pat::Array(_) | Pat::Object(_))
                || pattern_contains_nested_destructuring(&rest_pat.arg)
        }
        Pat::Ident(_) | Pat::Expr(_) | Pat::Invalid(_) => false,
    }
}

fn pattern_is_flat_reassignment(pat: &Pat) -> bool {
    match pat {
        Pat::Ident(_) => true,
        Pat::Array(array_pat) => array_pat
            .elems
            .iter()
            .flatten()
            .all(|element| match element {
                Pat::Ident(_) => true,
                Pat::Expr(expr) => matches!(unwrap_transparent_expr(expr), Expr::Ident(_)),
                Pat::Assign(assign_pat) => matches!(*assign_pat.left, Pat::Ident(_)),
                Pat::Rest(rest_pat) => matches!(*rest_pat.arg, Pat::Ident(_)),
                _ => false,
            }),
        Pat::Object(object_pat) => object_pat.props.iter().all(|prop| match prop {
            ObjectPatProp::Assign(_) => true,
            ObjectPatProp::KeyValue(key_value) => match &*key_value.value {
                Pat::Ident(_) => true,
                Pat::Expr(expr) => matches!(unwrap_transparent_expr(expr), Expr::Ident(_)),
                Pat::Assign(assign_pat) => matches!(*assign_pat.left, Pat::Ident(_)),
                _ => false,
            },
            ObjectPatProp::Rest(rest) => matches!(*rest.arg, Pat::Ident(_)),
        }),
        Pat::Assign(assign_pat) => matches!(*assign_pat.left, Pat::Ident(_)),
        Pat::Rest(rest_pat) => matches!(*rest_pat.arg, Pat::Ident(_)),
        Pat::Expr(_) | Pat::Invalid(_) => false,
    }
}

fn lower_nested_destructuring_pattern_from_source(
    pat: Pat,
    source_expr: Box<Expr>,
    reserved: &mut HashSet<String>,
    next_temp: &mut u32,
    out: &mut Vec<Stmt>,
) {
    if pattern_is_flat_reassignment(&pat) {
        match pat {
            Pat::Ident(binding) => {
                out.push(assign_stmt(AssignTarget::from(binding.id), source_expr));
            }
            Pat::Expr(expr) => {
                let Expr::Ident(binding) = unwrap_transparent_expr(&expr) else {
                    return;
                };
                out.push(assign_stmt(
                    AssignTarget::from(binding.clone()),
                    source_expr,
                ));
            }
            Pat::Assign(assign_pat) => {
                let Pat::Ident(binding) = &*assign_pat.left else {
                    return;
                };
                out.push(assign_stmt(
                    AssignTarget::from(binding.id.clone()),
                    Box::new(Expr::Cond(swc_ecma_ast::CondExpr {
                        span: DUMMY_SP,
                        test: Box::new(Expr::Bin(swc_ecma_ast::BinExpr {
                            span: DUMMY_SP,
                            op: op!("==="),
                            left: source_expr,
                            right: Box::new(Expr::Ident(Ident::new_no_ctxt(
                                "undefined".into(),
                                DUMMY_SP,
                            ))),
                        })),
                        cons: parenthesize_conditional_expr(assign_pat.right.clone()),
                        alt: Box::new(Expr::Ident(binding.id.clone())),
                    })),
                ));
            }
            other => {
                if let Ok(target) = AssignTarget::try_from(other) {
                    out.push(assign_stmt(target, source_expr));
                }
            }
        }
        return;
    }

    match pat {
        Pat::Assign(assign_pat) => {
            let value_temp = fresh_temp_ident(next_temp, reserved);
            let source_for_alt = source_expr.clone();
            out.push(make_var_decl(
                VarDeclKind::Const,
                Pat::Ident(BindingIdent {
                    id: value_temp.clone(),
                    type_ann: None,
                }),
                Some(Box::new(Expr::Cond(swc_ecma_ast::CondExpr {
                    span: DUMMY_SP,
                    test: Box::new(Expr::Bin(swc_ecma_ast::BinExpr {
                        span: DUMMY_SP,
                        op: op!("==="),
                        left: source_expr,
                        right: Box::new(Expr::Ident(Ident::new_no_ctxt(
                            "undefined".into(),
                            DUMMY_SP,
                        ))),
                    })),
                    cons: parenthesize_conditional_expr(assign_pat.right.clone()),
                    alt: source_for_alt,
                }))),
            ));
            lower_nested_destructuring_pattern_from_source(
                *assign_pat.left,
                Box::new(Expr::Ident(value_temp)),
                reserved,
                next_temp,
                out,
            );
        }
        Pat::Rest(rest_pat) => {
            lower_nested_destructuring_pattern_from_source(
                *rest_pat.arg,
                source_expr,
                reserved,
                next_temp,
                out,
            );
        }
        Pat::Array(array_pat) => {
            let mut temp_elems = Vec::with_capacity(array_pat.elems.len());
            let mut actions = Vec::<(Pat, Ident)>::new();
            for element in array_pat.elems {
                let Some(element) = element else {
                    temp_elems.push(None);
                    continue;
                };
                let temp = fresh_temp_ident(next_temp, reserved);
                match element {
                    Pat::Rest(rest_pat) => {
                        temp_elems.push(Some(Pat::Rest(swc_ecma_ast::RestPat {
                            span: rest_pat.span,
                            dot3_token: rest_pat.dot3_token,
                            type_ann: rest_pat.type_ann,
                            arg: Box::new(Pat::Ident(BindingIdent {
                                id: temp.clone(),
                                type_ann: None,
                            })),
                        })));
                        actions.push((*rest_pat.arg, temp));
                    }
                    other => {
                        temp_elems.push(Some(Pat::Ident(BindingIdent {
                            id: temp.clone(),
                            type_ann: None,
                        })));
                        actions.push((other, temp));
                    }
                }
            }
            out.push(make_var_decl(
                VarDeclKind::Const,
                Pat::Array(swc_ecma_ast::ArrayPat {
                    span: array_pat.span,
                    elems: temp_elems,
                    optional: array_pat.optional,
                    type_ann: array_pat.type_ann,
                }),
                Some(source_expr),
            ));
            for (action_pat, temp_ident) in actions {
                lower_nested_destructuring_pattern_from_source(
                    action_pat,
                    Box::new(Expr::Ident(temp_ident)),
                    reserved,
                    next_temp,
                    out,
                );
            }
        }
        Pat::Object(object_pat) => {
            let mut temp_props = Vec::with_capacity(object_pat.props.len());
            let mut actions = Vec::<(Pat, Ident)>::new();
            for prop in object_pat.props {
                match prop {
                    ObjectPatProp::Assign(assign_prop) => {
                        let temp = fresh_temp_ident(next_temp, reserved);
                        temp_props.push(ObjectPatProp::KeyValue(swc_ecma_ast::KeyValuePatProp {
                            key: PropName::Ident(assign_prop.key.id.clone().into()),
                            value: Box::new(Pat::Ident(BindingIdent {
                                id: temp.clone(),
                                type_ann: None,
                            })),
                        }));
                        let action_pat = if let Some(default_expr) = assign_prop.value {
                            Pat::Assign(swc_ecma_ast::AssignPat {
                                span: assign_prop.span,
                                left: Box::new(Pat::Ident(BindingIdent {
                                    id: assign_prop.key.id,
                                    type_ann: None,
                                })),
                                right: default_expr,
                            })
                        } else {
                            Pat::Ident(BindingIdent {
                                id: assign_prop.key.id,
                                type_ann: None,
                            })
                        };
                        actions.push((action_pat, temp));
                    }
                    ObjectPatProp::KeyValue(key_value) => {
                        let temp = fresh_temp_ident(next_temp, reserved);
                        let key = key_value.key.clone();
                        let original_value = *key_value.value;
                        temp_props.push(ObjectPatProp::KeyValue(swc_ecma_ast::KeyValuePatProp {
                            key,
                            value: Box::new(Pat::Ident(BindingIdent {
                                id: temp.clone(),
                                type_ann: None,
                            })),
                        }));
                        let action_pat = match &original_value {
                            Pat::Ident(binding) => {
                                let key_mismatches_binding = match &key_value.key {
                                    PropName::Ident(prop_ident) => prop_ident.sym != binding.id.sym,
                                    _ => true,
                                };
                                if key_mismatches_binding {
                                    Pat::Object(swc_ecma_ast::ObjectPat {
                                        span: DUMMY_SP,
                                        props: vec![ObjectPatProp::KeyValue(
                                            swc_ecma_ast::KeyValuePatProp {
                                                key: key_value.key,
                                                value: Box::new(Pat::Ident(binding.clone())),
                                            },
                                        )],
                                        optional: false,
                                        type_ann: None,
                                    })
                                } else {
                                    original_value
                                }
                            }
                            Pat::Expr(expr) => {
                                if let Expr::Ident(binding) = unwrap_transparent_expr(expr) {
                                    let key_mismatches_binding = match &key_value.key {
                                        PropName::Ident(prop_ident) => {
                                            prop_ident.sym != binding.sym
                                        }
                                        _ => true,
                                    };
                                    if key_mismatches_binding {
                                        Pat::Object(swc_ecma_ast::ObjectPat {
                                            span: DUMMY_SP,
                                            props: vec![ObjectPatProp::KeyValue(
                                                swc_ecma_ast::KeyValuePatProp {
                                                    key: key_value.key,
                                                    value: Box::new(Pat::Expr(Box::new(
                                                        Expr::Ident(binding.clone()),
                                                    ))),
                                                },
                                            )],
                                            optional: false,
                                            type_ann: None,
                                        })
                                    } else {
                                        original_value
                                    }
                                } else {
                                    original_value
                                }
                            }
                            _ => original_value,
                        };
                        actions.push((action_pat, temp));
                    }
                    ObjectPatProp::Rest(rest_prop) => {
                        let temp = fresh_temp_ident(next_temp, reserved);
                        temp_props.push(ObjectPatProp::Rest(swc_ecma_ast::RestPat {
                            span: rest_prop.span,
                            dot3_token: rest_prop.dot3_token,
                            type_ann: rest_prop.type_ann,
                            arg: Box::new(Pat::Ident(BindingIdent {
                                id: temp.clone(),
                                type_ann: None,
                            })),
                        }));
                        actions.push((*rest_prop.arg, temp));
                    }
                }
            }
            out.push(make_var_decl(
                VarDeclKind::Const,
                Pat::Object(swc_ecma_ast::ObjectPat {
                    span: object_pat.span,
                    props: temp_props,
                    optional: object_pat.optional,
                    type_ann: object_pat.type_ann,
                }),
                Some(source_expr),
            ));
            for (action_pat, temp_ident) in actions {
                lower_nested_destructuring_pattern_from_source(
                    action_pat,
                    Box::new(Expr::Ident(temp_ident)),
                    reserved,
                    next_temp,
                    out,
                );
            }
        }
        Pat::Ident(binding) => {
            out.push(assign_stmt(AssignTarget::from(binding.id), source_expr));
        }
        Pat::Expr(_) | Pat::Invalid(_) => {}
    }
}

fn collapse_single_object_temp_destructure_assign_pairs(stmts: &mut Vec<Stmt>) {
    let mut rewritten = Vec::with_capacity(stmts.len());
    let mut index = 0usize;

    while index < stmts.len() {
        if let Some(replacement) =
            build_collapsed_object_temp_destructure_assign(stmts.get(index), stmts.get(index + 1))
        {
            rewritten.push(replacement);
            index += 2;
            continue;
        }

        let mut stmt = stmts[index].clone();
        match &mut stmt {
            Stmt::Block(block) => {
                collapse_single_object_temp_destructure_assign_pairs(&mut block.stmts);
            }
            Stmt::Labeled(labeled) => {
                if let Stmt::Block(block) = &mut *labeled.body {
                    collapse_single_object_temp_destructure_assign_pairs(&mut block.stmts);
                }
            }
            Stmt::If(if_stmt) => {
                if let Stmt::Block(block) = &mut *if_stmt.cons {
                    collapse_single_object_temp_destructure_assign_pairs(&mut block.stmts);
                }
                if let Some(alt) = &mut if_stmt.alt {
                    if let Stmt::Block(block) = &mut **alt {
                        collapse_single_object_temp_destructure_assign_pairs(&mut block.stmts);
                    }
                }
            }
            Stmt::Try(try_stmt) => {
                collapse_single_object_temp_destructure_assign_pairs(&mut try_stmt.block.stmts);
                if let Some(handler) = &mut try_stmt.handler {
                    collapse_single_object_temp_destructure_assign_pairs(&mut handler.body.stmts);
                }
                if let Some(finalizer) = &mut try_stmt.finalizer {
                    collapse_single_object_temp_destructure_assign_pairs(&mut finalizer.stmts);
                }
            }
            Stmt::Switch(switch_stmt) => {
                for case in &mut switch_stmt.cases {
                    collapse_single_object_temp_destructure_assign_pairs(&mut case.cons);
                }
            }
            _ => {}
        }

        rewritten.push(stmt);
        index += 1;
    }

    *stmts = rewritten;
}

fn build_collapsed_object_temp_destructure_assign(
    first: Option<&Stmt>,
    second: Option<&Stmt>,
) -> Option<Stmt> {
    let first = first?;
    let second = second?;

    let Stmt::Decl(Decl::Var(var_decl)) = first else {
        return None;
    };
    if var_decl.kind != VarDeclKind::Const {
        return None;
    }
    let [decl] = var_decl.decls.as_slice() else {
        return None;
    };
    let Pat::Object(object_pat) = &decl.name else {
        return None;
    };
    let [ObjectPatProp::KeyValue(key_value)] = object_pat.props.as_slice() else {
        return None;
    };
    let Pat::Ident(temp_binding) = &*key_value.value else {
        return None;
    };
    let source_expr = decl.init.clone()?;

    let Stmt::Expr(expr_stmt) = second else {
        return None;
    };
    let Expr::Assign(assign) = unwrap_transparent_expr(&expr_stmt.expr) else {
        return None;
    };
    if assign.op != op!("=") {
        return None;
    }
    let target_ident = assign.left.as_ident()?;
    let Expr::Ident(source_ident) = unwrap_transparent_expr(&assign.right) else {
        return None;
    };
    if source_ident.sym != temp_binding.id.sym {
        return None;
    }

    let collapsed_pat = Pat::Object(swc_ecma_ast::ObjectPat {
        span: object_pat.span,
        props: vec![ObjectPatProp::KeyValue(swc_ecma_ast::KeyValuePatProp {
            key: key_value.key.clone(),
            value: Box::new(Pat::Ident(BindingIdent {
                id: target_ident.id.clone(),
                type_ann: None,
            })),
        })],
        optional: object_pat.optional,
        type_ann: object_pat.type_ann.clone(),
    });
    let target = AssignTarget::try_from(collapsed_pat).ok()?;
    Some(assign_stmt(target, source_expr))
}

fn flatten_nested_destructuring_decls_to_temp_chain(
    stmts: &mut Vec<Stmt>,
    reserved: &mut HashSet<String>,
    next_temp: &mut u32,
) {
    let mut rewritten = Vec::with_capacity(stmts.len());
    let original = std::mem::take(stmts);

    for mut stmt in original {
        match &mut stmt {
            Stmt::Block(block) => {
                flatten_nested_destructuring_decls_to_temp_chain(
                    &mut block.stmts,
                    reserved,
                    next_temp,
                );
            }
            Stmt::Labeled(labeled) => {
                if let Stmt::Block(block) = &mut *labeled.body {
                    flatten_nested_destructuring_decls_to_temp_chain(
                        &mut block.stmts,
                        reserved,
                        next_temp,
                    );
                }
            }
            Stmt::If(if_stmt) => {
                if let Stmt::Block(block) = &mut *if_stmt.cons {
                    flatten_nested_destructuring_decls_to_temp_chain(
                        &mut block.stmts,
                        reserved,
                        next_temp,
                    );
                }
                if let Some(alt) = &mut if_stmt.alt {
                    if let Stmt::Block(block) = &mut **alt {
                        flatten_nested_destructuring_decls_to_temp_chain(
                            &mut block.stmts,
                            reserved,
                            next_temp,
                        );
                    }
                }
            }
            Stmt::Try(try_stmt) => {
                flatten_nested_destructuring_decls_to_temp_chain(
                    &mut try_stmt.block.stmts,
                    reserved,
                    next_temp,
                );
                if let Some(handler) = &mut try_stmt.handler {
                    flatten_nested_destructuring_decls_to_temp_chain(
                        &mut handler.body.stmts,
                        reserved,
                        next_temp,
                    );
                }
                if let Some(finalizer) = &mut try_stmt.finalizer {
                    flatten_nested_destructuring_decls_to_temp_chain(
                        &mut finalizer.stmts,
                        reserved,
                        next_temp,
                    );
                }
            }
            Stmt::Switch(switch_stmt) => {
                for case in &mut switch_stmt.cases {
                    flatten_nested_destructuring_decls_to_temp_chain(
                        &mut case.cons,
                        reserved,
                        next_temp,
                    );
                }
            }
            _ => {}
        }

        let Stmt::Decl(Decl::Var(var_decl)) = &stmt else {
            rewritten.push(stmt);
            continue;
        };
        if !matches!(var_decl.kind, VarDeclKind::Let | VarDeclKind::Const) {
            rewritten.push(stmt);
            continue;
        }
        let [decl] = var_decl.decls.as_slice() else {
            rewritten.push(stmt);
            continue;
        };
        let Some(init) = &decl.init else {
            rewritten.push(stmt);
            continue;
        };
        if !matches!(decl.name, Pat::Array(_) | Pat::Object(_)) {
            rewritten.push(stmt);
            continue;
        }

        let Some(flattened) = flatten_destructuring_decl_to_temp_chain(
            var_decl.kind,
            decl.name.clone(),
            init.clone(),
            reserved,
            next_temp,
        ) else {
            rewritten.push(stmt);
            continue;
        };
        rewritten.extend(flattened);
    }

    *stmts = rewritten;
}

fn flatten_destructuring_decl_to_temp_chain(
    kind: VarDeclKind,
    pattern: Pat,
    init: Box<Expr>,
    reserved: &mut HashSet<String>,
    next_temp: &mut u32,
) -> Option<Vec<Stmt>> {
    let mut queue = VecDeque::new();
    queue.push_back((pattern, init));

    let mut rewritten = Vec::new();
    let mut changed = false;

    while let Some((pat, init_expr)) = queue.pop_front() {
        match pat {
            Pat::Array(array_pat) => {
                let (rewritten_pat, nested) =
                    flatten_array_pattern_one_level(array_pat, reserved, next_temp);
                changed |= !nested.is_empty();
                rewritten.push(make_var_decl(
                    kind,
                    Pat::Array(rewritten_pat),
                    Some(init_expr),
                ));
                for (nested_pat, temp) in nested {
                    queue.push_back((nested_pat, Box::new(Expr::Ident(temp))));
                }
            }
            Pat::Object(object_pat) => {
                let (rewritten_pat, nested) =
                    flatten_object_pattern_one_level(object_pat, reserved, next_temp);
                changed |= !nested.is_empty();
                rewritten.push(make_var_decl(
                    kind,
                    Pat::Object(rewritten_pat),
                    Some(init_expr),
                ));
                for (nested_pat, temp) in nested {
                    queue.push_back((nested_pat, Box::new(Expr::Ident(temp))));
                }
            }
            Pat::Assign(assign_pat)
                if matches!(*assign_pat.left, Pat::Array(_) | Pat::Object(_)) =>
            {
                changed = true;
                let value_temp = fresh_temp_ident(next_temp, reserved);
                let source_for_alt = init_expr.clone();
                rewritten.push(make_var_decl(
                    kind,
                    Pat::Ident(BindingIdent {
                        id: value_temp.clone(),
                        type_ann: None,
                    }),
                    Some(Box::new(Expr::Cond(swc_ecma_ast::CondExpr {
                        span: DUMMY_SP,
                        test: Box::new(Expr::Bin(swc_ecma_ast::BinExpr {
                            span: DUMMY_SP,
                            op: op!("==="),
                            left: init_expr,
                            right: Box::new(Expr::Ident(Ident::new_no_ctxt(
                                "undefined".into(),
                                DUMMY_SP,
                            ))),
                        })),
                        cons: parenthesize_conditional_expr(assign_pat.right.clone()),
                        alt: source_for_alt,
                    }))),
                ));
                queue.push_back((*assign_pat.left, Box::new(Expr::Ident(value_temp))));
            }
            _ => {
                rewritten.push(make_var_decl(kind, pat, Some(init_expr)));
            }
        }
    }

    changed.then_some(rewritten)
}

fn flatten_array_pattern_one_level(
    mut array_pat: swc_ecma_ast::ArrayPat,
    reserved: &mut HashSet<String>,
    next_temp: &mut u32,
) -> (swc_ecma_ast::ArrayPat, Vec<(Pat, Ident)>) {
    let mut nested = Vec::new();
    let mut rewritten_elems = Vec::with_capacity(array_pat.elems.len());

    for element in array_pat.elems {
        let Some(element) = element else {
            rewritten_elems.push(None);
            continue;
        };

        match element {
            Pat::Array(_) | Pat::Object(_) => {
                let temp = fresh_temp_ident(next_temp, reserved);
                nested.push((element, temp.clone()));
                rewritten_elems.push(Some(Pat::Ident(BindingIdent {
                    id: temp,
                    type_ann: None,
                })));
            }
            Pat::Rest(mut rest_pat) if matches!(*rest_pat.arg, Pat::Array(_) | Pat::Object(_)) => {
                let nested_pat = *rest_pat.arg;
                let temp = fresh_temp_ident(next_temp, reserved);
                rest_pat.arg = Box::new(Pat::Ident(BindingIdent {
                    id: temp.clone(),
                    type_ann: None,
                }));
                nested.push((nested_pat, temp));
                rewritten_elems.push(Some(Pat::Rest(rest_pat)));
            }
            _ => rewritten_elems.push(Some(element)),
        }
    }

    array_pat.elems = rewritten_elems;
    (array_pat, nested)
}

fn flatten_object_pattern_one_level(
    mut object_pat: swc_ecma_ast::ObjectPat,
    reserved: &mut HashSet<String>,
    next_temp: &mut u32,
) -> (swc_ecma_ast::ObjectPat, Vec<(Pat, Ident)>) {
    let mut nested = Vec::new();
    let mut rewritten_props = Vec::with_capacity(object_pat.props.len());

    for prop in object_pat.props {
        match prop {
            ObjectPatProp::KeyValue(mut key_value) => match *key_value.value {
                Pat::Array(_) | Pat::Object(_) => {
                    let nested_pat = *key_value.value;
                    let temp = fresh_temp_ident(next_temp, reserved);
                    key_value.value = Box::new(Pat::Ident(BindingIdent {
                        id: temp.clone(),
                        type_ann: None,
                    }));
                    nested.push((nested_pat, temp));
                    rewritten_props.push(ObjectPatProp::KeyValue(key_value));
                }
                Pat::Assign(assign_pat)
                    if matches!(*assign_pat.left, Pat::Array(_) | Pat::Object(_)) =>
                {
                    let nested_pat = Pat::Assign(assign_pat);
                    let temp = fresh_temp_ident(next_temp, reserved);
                    key_value.value = Box::new(Pat::Ident(BindingIdent {
                        id: temp.clone(),
                        type_ann: None,
                    }));
                    nested.push((nested_pat, temp));
                    rewritten_props.push(ObjectPatProp::KeyValue(key_value));
                }
                _ => rewritten_props.push(ObjectPatProp::KeyValue(key_value)),
            },
            ObjectPatProp::Rest(mut rest) => match *rest.arg {
                Pat::Array(_) | Pat::Object(_) => {
                    let nested_pat = *rest.arg;
                    let temp = fresh_temp_ident(next_temp, reserved);
                    rest.arg = Box::new(Pat::Ident(BindingIdent {
                        id: temp.clone(),
                        type_ann: None,
                    }));
                    nested.push((nested_pat, temp));
                    rewritten_props.push(ObjectPatProp::Rest(rest));
                }
                _ => rewritten_props.push(ObjectPatProp::Rest(rest)),
            },
            other => rewritten_props.push(other),
        }
    }

    object_pat.props = rewritten_props;
    (object_pat, nested)
}

fn rewrite_destructuring_decls_with_top_level_rest_to_assignment_stmts(stmts: &mut Vec<Stmt>) {
    let mut rewritten = Vec::with_capacity(stmts.len());
    let original = std::mem::take(stmts);

    for mut stmt in original {
        match &mut stmt {
            Stmt::Block(block) => {
                rewrite_destructuring_decls_with_top_level_rest_to_assignment_stmts(
                    &mut block.stmts,
                );
            }
            Stmt::Labeled(labeled) => {
                if let Stmt::Block(block) = &mut *labeled.body {
                    rewrite_destructuring_decls_with_top_level_rest_to_assignment_stmts(
                        &mut block.stmts,
                    );
                }
            }
            Stmt::If(if_stmt) => {
                if let Stmt::Block(block) = &mut *if_stmt.cons {
                    rewrite_destructuring_decls_with_top_level_rest_to_assignment_stmts(
                        &mut block.stmts,
                    );
                }
                if let Some(alt) = &mut if_stmt.alt {
                    if let Stmt::Block(block) = &mut **alt {
                        rewrite_destructuring_decls_with_top_level_rest_to_assignment_stmts(
                            &mut block.stmts,
                        );
                    }
                }
            }
            Stmt::Try(try_stmt) => {
                rewrite_destructuring_decls_with_top_level_rest_to_assignment_stmts(
                    &mut try_stmt.block.stmts,
                );
                if let Some(handler) = &mut try_stmt.handler {
                    rewrite_destructuring_decls_with_top_level_rest_to_assignment_stmts(
                        &mut handler.body.stmts,
                    );
                }
                if let Some(finalizer) = &mut try_stmt.finalizer {
                    rewrite_destructuring_decls_with_top_level_rest_to_assignment_stmts(
                        &mut finalizer.stmts,
                    );
                }
            }
            Stmt::Switch(switch_stmt) => {
                for case in &mut switch_stmt.cases {
                    rewrite_destructuring_decls_with_top_level_rest_to_assignment_stmts(
                        &mut case.cons,
                    );
                }
            }
            _ => {}
        }

        let Stmt::Decl(Decl::Var(var_decl)) = &stmt else {
            rewritten.push(stmt);
            continue;
        };
        if !matches!(var_decl.kind, VarDeclKind::Let | VarDeclKind::Const) {
            rewritten.push(stmt);
            continue;
        }
        let [decl] = var_decl.decls.as_slice() else {
            rewritten.push(stmt);
            continue;
        };
        let Some(init) = &decl.init else {
            rewritten.push(stmt);
            continue;
        };
        if !pattern_has_top_level_rest(&decl.name) {
            rewritten.push(stmt);
            continue;
        }
        let Ok(target) = AssignTarget::try_from(decl.name.clone()) else {
            rewritten.push(stmt);
            continue;
        };

        let mut seen = HashSet::new();
        let binding_names = collect_pattern_binding_names_in_order(&decl.name)
            .into_iter()
            .filter(|name| seen.insert(name.clone()))
            .collect::<Vec<_>>();
        let binding_names = reorder_array_rest_temp_binding_first(
            reorder_cache_binding_names_for_pattern_assignment(binding_names),
            &decl.name,
        );
        if binding_names.is_empty() {
            rewritten.push(stmt);
            continue;
        }

        for binding in binding_names {
            rewritten.push(make_var_decl(
                VarDeclKind::Let,
                Pat::Ident(BindingIdent {
                    id: Ident::new_no_ctxt(binding.into(), DUMMY_SP),
                    type_ann: None,
                }),
                None,
            ));
        }
        rewritten.push(assign_stmt(target, init.clone()));
    }

    *stmts = rewritten;
}

fn pattern_has_top_level_rest(pat: &Pat) -> bool {
    match pat {
        Pat::Array(array) => array
            .elems
            .iter()
            .flatten()
            .any(|element| matches!(element, Pat::Rest(_))),
        Pat::Object(object) => object
            .props
            .iter()
            .any(|prop| matches!(prop, ObjectPatProp::Rest(_))),
        _ => false,
    }
}

fn rewrite_const_object_pattern_default_decls_to_temp_chain(
    stmts: &mut Vec<Stmt>,
    reserved: &mut HashSet<String>,
) {
    let mut rewritten = Vec::with_capacity(stmts.len());
    let original = std::mem::take(stmts);
    let mut scope_bindings = HashSet::new();
    for stmt in &original {
        collect_stmt_bindings_including_nested_blocks(stmt, &mut scope_bindings);
    }
    scope_bindings.extend(reserved.iter().cloned());

    for mut stmt in original {
        match &mut stmt {
            Stmt::Block(block) => {
                rewrite_const_object_pattern_default_decls_to_temp_chain(
                    &mut block.stmts,
                    reserved,
                );
            }
            Stmt::Labeled(labeled) => {
                if let Stmt::Block(block) = &mut *labeled.body {
                    rewrite_const_object_pattern_default_decls_to_temp_chain(
                        &mut block.stmts,
                        reserved,
                    );
                }
            }
            Stmt::If(if_stmt) => {
                if let Stmt::Block(block) = &mut *if_stmt.cons {
                    rewrite_const_object_pattern_default_decls_to_temp_chain(
                        &mut block.stmts,
                        reserved,
                    );
                }
                if let Some(alt) = &mut if_stmt.alt {
                    if let Stmt::Block(block) = &mut **alt {
                        rewrite_const_object_pattern_default_decls_to_temp_chain(
                            &mut block.stmts,
                            reserved,
                        );
                    }
                }
            }
            Stmt::Try(try_stmt) => {
                rewrite_const_object_pattern_default_decls_to_temp_chain(
                    &mut try_stmt.block.stmts,
                    reserved,
                );
                if let Some(handler) = &mut try_stmt.handler {
                    rewrite_const_object_pattern_default_decls_to_temp_chain(
                        &mut handler.body.stmts,
                        reserved,
                    );
                }
                if let Some(finalizer) = &mut try_stmt.finalizer {
                    rewrite_const_object_pattern_default_decls_to_temp_chain(
                        &mut finalizer.stmts,
                        reserved,
                    );
                }
            }
            Stmt::Switch(switch_stmt) => {
                for case in &mut switch_stmt.cases {
                    rewrite_const_object_pattern_default_decls_to_temp_chain(
                        &mut case.cons,
                        reserved,
                    );
                }
            }
            _ => {}
        }

        let Stmt::Decl(Decl::Var(var_decl)) = &stmt else {
            rewritten.push(stmt);
            continue;
        };
        if !matches!(var_decl.kind, VarDeclKind::Const | VarDeclKind::Let) {
            rewritten.push(stmt);
            continue;
        }
        let [decl] = var_decl.decls.as_slice() else {
            rewritten.push(stmt);
            continue;
        };
        let Pat::Object(object_pat) = &decl.name else {
            rewritten.push(stmt);
            continue;
        };
        let Some(init) = &decl.init else {
            rewritten.push(stmt);
            continue;
        };

        let mut rewritten_props = Vec::with_capacity(object_pat.props.len());
        let mut follow_up = Vec::new();
        let mut changed = false;

        for prop in &object_pat.props {
            match prop {
                ObjectPatProp::Assign(assign_prop) if assign_prop.value.is_some() => {
                    changed = true;
                    let temp = fresh_lowest_scoped_temp_ident(&mut scope_bindings, reserved);
                    rewritten_props.push(ObjectPatProp::KeyValue(swc_ecma_ast::KeyValuePatProp {
                        key: PropName::Ident(assign_prop.key.id.clone().into()),
                        value: Box::new(Pat::Ident(BindingIdent {
                            id: temp.clone(),
                            type_ann: None,
                        })),
                    }));
                    follow_up.push(make_var_decl(
                        var_decl.kind,
                        Pat::Ident(BindingIdent {
                            id: assign_prop.key.id.clone(),
                            type_ann: None,
                        }),
                        Some(Box::new(Expr::Cond(swc_ecma_ast::CondExpr {
                            span: DUMMY_SP,
                            test: Box::new(Expr::Bin(swc_ecma_ast::BinExpr {
                                span: DUMMY_SP,
                                op: op!("==="),
                                left: Box::new(Expr::Ident(temp.clone())),
                                right: Box::new(Expr::Ident(Ident::new_no_ctxt(
                                    "undefined".into(),
                                    DUMMY_SP,
                                ))),
                            })),
                            cons: assign_prop.value.clone().expect("guarded by is_some"),
                            alt: Box::new(Expr::Ident(temp)),
                        }))),
                    ));
                }
                other => rewritten_props.push(other.clone()),
            }
        }

        if !changed {
            rewritten.push(stmt);
            continue;
        }

        rewritten.push(make_var_decl(
            var_decl.kind,
            Pat::Object(swc_ecma_ast::ObjectPat {
                span: object_pat.span,
                props: rewritten_props,
                optional: object_pat.optional,
                type_ann: object_pat.type_ann.clone(),
            }),
            Some(init.clone()),
        ));
        rewritten.extend(follow_up);
    }

    *stmts = rewritten;
}

fn rewrite_let_object_pattern_decls_to_assignment_stmts(stmts: &mut Vec<Stmt>) {
    let mut rewritten = Vec::with_capacity(stmts.len());
    let original = std::mem::take(stmts);

    for mut stmt in original {
        match &mut stmt {
            Stmt::Block(block) => {
                rewrite_let_object_pattern_decls_to_assignment_stmts(&mut block.stmts);
            }
            Stmt::Labeled(labeled) => {
                if let Stmt::Block(block) = &mut *labeled.body {
                    rewrite_let_object_pattern_decls_to_assignment_stmts(&mut block.stmts);
                }
            }
            Stmt::If(if_stmt) => {
                if let Stmt::Block(block) = &mut *if_stmt.cons {
                    rewrite_let_object_pattern_decls_to_assignment_stmts(&mut block.stmts);
                }
                if let Some(alt) = &mut if_stmt.alt {
                    if let Stmt::Block(block) = &mut **alt {
                        rewrite_let_object_pattern_decls_to_assignment_stmts(&mut block.stmts);
                    }
                }
            }
            Stmt::Try(try_stmt) => {
                rewrite_let_object_pattern_decls_to_assignment_stmts(&mut try_stmt.block.stmts);
                if let Some(handler) = &mut try_stmt.handler {
                    rewrite_let_object_pattern_decls_to_assignment_stmts(&mut handler.body.stmts);
                }
                if let Some(finalizer) = &mut try_stmt.finalizer {
                    rewrite_let_object_pattern_decls_to_assignment_stmts(&mut finalizer.stmts);
                }
            }
            Stmt::Switch(switch_stmt) => {
                for case in &mut switch_stmt.cases {
                    rewrite_let_object_pattern_decls_to_assignment_stmts(&mut case.cons);
                }
            }
            _ => {}
        }

        let Stmt::Decl(Decl::Var(var_decl)) = &stmt else {
            rewritten.push(stmt);
            continue;
        };
        if var_decl.kind != VarDeclKind::Let {
            rewritten.push(stmt);
            continue;
        }
        let [decl] = var_decl.decls.as_slice() else {
            rewritten.push(stmt);
            continue;
        };
        if !matches!(decl.name, Pat::Object(_)) {
            rewritten.push(stmt);
            continue;
        }
        let Some(init) = &decl.init else {
            rewritten.push(stmt);
            continue;
        };
        let binding_names = collect_pattern_binding_names_in_order(&decl.name);
        let [binding] = binding_names.as_slice() else {
            rewritten.push(stmt);
            continue;
        };
        let Ok(target) = AssignTarget::try_from(decl.name.clone()) else {
            rewritten.push(stmt);
            continue;
        };

        rewritten.push(make_var_decl(
            VarDeclKind::Let,
            Pat::Ident(BindingIdent {
                id: Ident::new_no_ctxt(binding.clone().into(), DUMMY_SP),
                type_ann: None,
            }),
            None,
        ));
        rewritten.push(assign_stmt(target, init.clone()));
    }

    *stmts = rewritten;
}

fn rewrite_let_array_pattern_decls_to_assignment_stmts(
    stmts: &mut Vec<Stmt>,
    reserved: &mut HashSet<String>,
) {
    let mut rewritten = Vec::with_capacity(stmts.len());
    let original = std::mem::take(stmts);
    let mut scope_bindings = HashSet::new();
    for stmt in &original {
        collect_stmt_bindings_including_nested_blocks(stmt, &mut scope_bindings);
    }

    for mut stmt in original {
        match &mut stmt {
            Stmt::Block(block) => {
                rewrite_let_array_pattern_decls_to_assignment_stmts(&mut block.stmts, reserved);
            }
            Stmt::Labeled(labeled) => {
                if let Stmt::Block(block) = &mut *labeled.body {
                    rewrite_let_array_pattern_decls_to_assignment_stmts(&mut block.stmts, reserved);
                }
            }
            Stmt::If(if_stmt) => {
                if let Stmt::Block(block) = &mut *if_stmt.cons {
                    rewrite_let_array_pattern_decls_to_assignment_stmts(&mut block.stmts, reserved);
                }
                if let Some(alt) = &mut if_stmt.alt {
                    if let Stmt::Block(block) = &mut **alt {
                        rewrite_let_array_pattern_decls_to_assignment_stmts(
                            &mut block.stmts,
                            reserved,
                        );
                    }
                }
            }
            Stmt::Try(try_stmt) => {
                rewrite_let_array_pattern_decls_to_assignment_stmts(
                    &mut try_stmt.block.stmts,
                    reserved,
                );
                if let Some(handler) = &mut try_stmt.handler {
                    rewrite_let_array_pattern_decls_to_assignment_stmts(
                        &mut handler.body.stmts,
                        reserved,
                    );
                }
                if let Some(finalizer) = &mut try_stmt.finalizer {
                    rewrite_let_array_pattern_decls_to_assignment_stmts(
                        &mut finalizer.stmts,
                        reserved,
                    );
                }
            }
            Stmt::Switch(switch_stmt) => {
                for case in &mut switch_stmt.cases {
                    rewrite_let_array_pattern_decls_to_assignment_stmts(&mut case.cons, reserved);
                }
            }
            _ => {}
        }

        let Stmt::Decl(Decl::Var(var_decl)) = &stmt else {
            rewritten.push(stmt);
            continue;
        };
        if !matches!(var_decl.kind, VarDeclKind::Let | VarDeclKind::Const) {
            rewritten.push(stmt);
            continue;
        }
        let [decl] = var_decl.decls.as_slice() else {
            rewritten.push(stmt);
            continue;
        };
        let Some(init) = &decl.init else {
            rewritten.push(stmt);
            continue;
        };
        if let Expr::Call(call) = unwrap_transparent_expr(init) {
            if call_is_state_tuple_hook(call) {
                rewritten.push(stmt);
                continue;
            }
        }

        let mut pat = decl.name.clone();
        normalize_array_pattern_holes(&mut pat);
        let Pat::Array(array_pat) = &pat else {
            rewritten.push(stmt);
            continue;
        };

        let non_hole_pats = array_pat.elems.iter().flatten().collect::<Vec<_>>();
        if non_hole_pats.len() != 1 {
            rewritten.push(stmt);
            continue;
        }

        match (var_decl.kind, non_hole_pats[0]) {
            (VarDeclKind::Const, Pat::Assign(assign_pat)) => match &*assign_pat.left {
                Pat::Ident(binding) => {
                    let temp = fresh_lowest_scoped_temp_ident(&mut scope_bindings, reserved);
                    rewritten.push(make_var_decl(
                        VarDeclKind::Const,
                        Pat::Array(swc_ecma_ast::ArrayPat {
                            span: array_pat.span,
                            elems: vec![Some(Pat::Ident(BindingIdent {
                                id: temp.clone(),
                                type_ann: None,
                            }))],
                            optional: false,
                            type_ann: None,
                        }),
                        Some(init.clone()),
                    ));
                    rewritten.push(make_var_decl(
                        VarDeclKind::Const,
                        Pat::Ident(BindingIdent {
                            id: binding.id.clone(),
                            type_ann: None,
                        }),
                        Some(Box::new(Expr::Cond(swc_ecma_ast::CondExpr {
                            span: DUMMY_SP,
                            test: Box::new(Expr::Bin(swc_ecma_ast::BinExpr {
                                span: DUMMY_SP,
                                op: op!("==="),
                                left: Box::new(Expr::Ident(temp.clone())),
                                right: Box::new(Expr::Ident(Ident::new_no_ctxt(
                                    "undefined".into(),
                                    DUMMY_SP,
                                ))),
                            })),
                            cons: parenthesize_conditional_expr(assign_pat.right.clone()),
                            alt: Box::new(Expr::Ident(temp)),
                        }))),
                    ));
                }
                Pat::Array(_) | Pat::Object(_) => {
                    let input_temp = fresh_lowest_scoped_temp_ident(&mut scope_bindings, reserved);
                    let value_temp = fresh_lowest_scoped_temp_ident(&mut scope_bindings, reserved);
                    rewritten.push(make_var_decl(
                        VarDeclKind::Const,
                        Pat::Array(swc_ecma_ast::ArrayPat {
                            span: array_pat.span,
                            elems: vec![Some(Pat::Ident(BindingIdent {
                                id: input_temp.clone(),
                                type_ann: None,
                            }))],
                            optional: false,
                            type_ann: None,
                        }),
                        Some(init.clone()),
                    ));
                    rewritten.push(make_var_decl(
                        VarDeclKind::Let,
                        Pat::Ident(BindingIdent {
                            id: value_temp.clone(),
                            type_ann: None,
                        }),
                        Some(Box::new(Expr::Cond(swc_ecma_ast::CondExpr {
                            span: DUMMY_SP,
                            test: Box::new(Expr::Bin(swc_ecma_ast::BinExpr {
                                span: DUMMY_SP,
                                op: op!("==="),
                                left: Box::new(Expr::Ident(input_temp.clone())),
                                right: Box::new(Expr::Ident(Ident::new_no_ctxt(
                                    "undefined".into(),
                                    DUMMY_SP,
                                ))),
                            })),
                            cons: parenthesize_conditional_expr(assign_pat.right.clone()),
                            alt: Box::new(Expr::Ident(input_temp)),
                        }))),
                    ));
                    rewritten.push(make_var_decl(
                        VarDeclKind::Const,
                        (*assign_pat.left).clone(),
                        Some(Box::new(Expr::Ident(value_temp))),
                    ));
                }
                _ => {
                    rewritten.push(stmt);
                }
            },
            (VarDeclKind::Let, Pat::Ident(binding)) => {
                let Ok(target) = AssignTarget::try_from(pat.clone()) else {
                    rewritten.push(stmt);
                    continue;
                };
                rewritten.push(make_var_decl(
                    VarDeclKind::Let,
                    Pat::Ident(BindingIdent {
                        id: binding.id.clone(),
                        type_ann: None,
                    }),
                    None,
                ));
                rewritten.push(assign_stmt(target, init.clone()));
            }
            (VarDeclKind::Let, Pat::Assign(assign_pat)) => {
                let Pat::Ident(binding) = &*assign_pat.left else {
                    rewritten.push(stmt);
                    continue;
                };
                let Ok(target) = AssignTarget::try_from(pat.clone()) else {
                    rewritten.push(stmt);
                    continue;
                };
                rewritten.push(make_var_decl(
                    VarDeclKind::Let,
                    Pat::Ident(BindingIdent {
                        id: binding.id.clone(),
                        type_ann: None,
                    }),
                    None,
                ));
                rewritten.push(assign_stmt(target, init.clone()));
            }
            _ => {
                rewritten.push(stmt);
            }
        }
    }

    *stmts = rewritten;
}

fn rewrite_const_object_pattern_static_literal_decls_to_temp_aliases(
    stmts: &mut Vec<Stmt>,
    reserved: &mut HashSet<String>,
    next_temp: &mut u32,
) {
    let mut rewritten = Vec::with_capacity(stmts.len());
    let original = std::mem::take(stmts);

    for mut stmt in original {
        match &mut stmt {
            Stmt::Block(block) => {
                rewrite_const_object_pattern_static_literal_decls_to_temp_aliases(
                    &mut block.stmts,
                    reserved,
                    next_temp,
                )
            }
            Stmt::Labeled(labeled) => {
                if let Stmt::Block(block) = &mut *labeled.body {
                    rewrite_const_object_pattern_static_literal_decls_to_temp_aliases(
                        &mut block.stmts,
                        reserved,
                        next_temp,
                    );
                }
            }
            Stmt::If(if_stmt) => {
                if let Stmt::Block(block) = &mut *if_stmt.cons {
                    rewrite_const_object_pattern_static_literal_decls_to_temp_aliases(
                        &mut block.stmts,
                        reserved,
                        next_temp,
                    );
                }
                if let Some(alt) = &mut if_stmt.alt {
                    if let Stmt::Block(block) = &mut **alt {
                        rewrite_const_object_pattern_static_literal_decls_to_temp_aliases(
                            &mut block.stmts,
                            reserved,
                            next_temp,
                        );
                    }
                }
            }
            Stmt::Try(try_stmt) => {
                rewrite_const_object_pattern_static_literal_decls_to_temp_aliases(
                    &mut try_stmt.block.stmts,
                    reserved,
                    next_temp,
                );
                if let Some(handler) = &mut try_stmt.handler {
                    rewrite_const_object_pattern_static_literal_decls_to_temp_aliases(
                        &mut handler.body.stmts,
                        reserved,
                        next_temp,
                    );
                }
                if let Some(finalizer) = &mut try_stmt.finalizer {
                    rewrite_const_object_pattern_static_literal_decls_to_temp_aliases(
                        &mut finalizer.stmts,
                        reserved,
                        next_temp,
                    );
                }
            }
            Stmt::Switch(switch_stmt) => {
                for case in &mut switch_stmt.cases {
                    rewrite_const_object_pattern_static_literal_decls_to_temp_aliases(
                        &mut case.cons,
                        reserved,
                        next_temp,
                    );
                }
            }
            _ => {}
        }

        let Stmt::Decl(Decl::Var(var_decl)) = &stmt else {
            rewritten.push(stmt);
            continue;
        };
        if var_decl.kind != VarDeclKind::Const {
            rewritten.push(stmt);
            continue;
        }
        let [decl] = var_decl.decls.as_slice() else {
            rewritten.push(stmt);
            continue;
        };
        if !matches!(decl.name, Pat::Object(_)) {
            rewritten.push(stmt);
            continue;
        }
        let Some(init) = &decl.init else {
            rewritten.push(stmt);
            continue;
        };
        if !is_static_alloc_literal_expr(init) {
            rewritten.push(stmt);
            continue;
        }

        let temp = fresh_temp_ident(next_temp, reserved);
        rewritten.push(make_var_decl(
            VarDeclKind::Const,
            Pat::Ident(BindingIdent {
                id: temp.clone(),
                type_ann: None,
            }),
            Some(init.clone()),
        ));
        rewritten.push(make_var_decl(
            VarDeclKind::Const,
            decl.name.clone(),
            Some(Box::new(Expr::Ident(temp))),
        ));
    }

    *stmts = rewritten;
}

fn normalize_array_pattern_assignments_in_stmts(
    stmts: &mut Vec<Stmt>,
    reserved: &mut HashSet<String>,
    _next_temp: &mut u32,
) {
    let mut normalized = Vec::with_capacity(stmts.len());
    let original = std::mem::take(stmts);
    let mut scope_bindings = HashSet::new();
    for stmt in &original {
        collect_stmt_bindings_including_nested_blocks(stmt, &mut scope_bindings);
    }

    for mut stmt in original {
        match &mut stmt {
            Stmt::Block(block) => {
                normalize_array_pattern_assignments_in_stmts(
                    &mut block.stmts,
                    reserved,
                    _next_temp,
                );
            }
            Stmt::Labeled(labeled) => {
                if let Stmt::Block(block) = &mut *labeled.body {
                    normalize_array_pattern_assignments_in_stmts(
                        &mut block.stmts,
                        reserved,
                        _next_temp,
                    );
                }
            }
            Stmt::If(if_stmt) => {
                if let Stmt::Block(block) = &mut *if_stmt.cons {
                    normalize_array_pattern_assignments_in_stmts(
                        &mut block.stmts,
                        reserved,
                        _next_temp,
                    );
                }
                if let Some(alt) = &mut if_stmt.alt {
                    if let Stmt::Block(block) = &mut **alt {
                        normalize_array_pattern_assignments_in_stmts(
                            &mut block.stmts,
                            reserved,
                            _next_temp,
                        );
                    }
                }
            }
            Stmt::Try(try_stmt) => {
                normalize_array_pattern_assignments_in_stmts(
                    &mut try_stmt.block.stmts,
                    reserved,
                    _next_temp,
                );
                if let Some(handler) = &mut try_stmt.handler {
                    normalize_array_pattern_assignments_in_stmts(
                        &mut handler.body.stmts,
                        reserved,
                        _next_temp,
                    );
                }
                if let Some(finalizer) = &mut try_stmt.finalizer {
                    normalize_array_pattern_assignments_in_stmts(
                        &mut finalizer.stmts,
                        reserved,
                        _next_temp,
                    );
                }
            }
            Stmt::Switch(switch_stmt) => {
                for case in &mut switch_stmt.cases {
                    normalize_array_pattern_assignments_in_stmts(
                        &mut case.cons,
                        reserved,
                        _next_temp,
                    );
                }
            }
            _ => {}
        }

        let Stmt::Expr(expr_stmt) = &stmt else {
            normalized.push(stmt);
            continue;
        };
        let Expr::Assign(assign) = unwrap_transparent_expr(&expr_stmt.expr) else {
            normalized.push(stmt);
            continue;
        };
        if assign.op != op!("=") {
            normalized.push(stmt);
            continue;
        }
        let AssignTarget::Pat(assign_pat) = &assign.left else {
            normalized.push(stmt);
            continue;
        };
        let mut pat = Pat::from(assign_pat.clone());
        normalize_array_pattern_holes(&mut pat);
        if let Pat::Object(object_pat) = pat {
            let mut can_rewrite = true;
            let mut original_binding = None::<Ident>;
            let mut rewritten_props = Vec::with_capacity(object_pat.props.len());

            for prop in object_pat.props {
                match prop {
                    ObjectPatProp::Assign(assign_prop) if assign_prop.value.is_none() => {
                        let temp = fresh_lowest_scoped_temp_ident(&mut scope_bindings, reserved);
                        original_binding = Some(assign_prop.key.id.clone());
                        rewritten_props.push(ObjectPatProp::KeyValue(
                            swc_ecma_ast::KeyValuePatProp {
                                key: PropName::Ident(assign_prop.key.id.clone().into()),
                                value: Box::new(Pat::Ident(BindingIdent {
                                    id: temp.clone(),
                                    type_ann: None,
                                })),
                            },
                        ));
                    }
                    ObjectPatProp::KeyValue(key_value)
                        if matches!(*key_value.value, Pat::Ident(_)) =>
                    {
                        let Pat::Ident(binding) = *key_value.value else {
                            unreachable!("guarded by matches!");
                        };
                        if matches!(
                            &key_value.key,
                            PropName::Ident(prop_ident) if prop_ident.sym != binding.id.sym
                        ) {
                            can_rewrite = false;
                            break;
                        }
                        let temp = fresh_lowest_scoped_temp_ident(&mut scope_bindings, reserved);
                        original_binding = Some(binding.id.clone());
                        rewritten_props.push(ObjectPatProp::KeyValue(
                            swc_ecma_ast::KeyValuePatProp {
                                key: key_value.key,
                                value: Box::new(Pat::Ident(BindingIdent {
                                    id: temp.clone(),
                                    type_ann: None,
                                })),
                            },
                        ));
                    }
                    _ => {
                        can_rewrite = false;
                        break;
                    }
                }
            }

            let Some(original_binding) = original_binding else {
                normalized.push(stmt);
                continue;
            };
            if !can_rewrite || rewritten_props.len() != 1 {
                normalized.push(stmt);
                continue;
            }

            let temp_name = match &rewritten_props[0] {
                ObjectPatProp::KeyValue(key_value) => match &*key_value.value {
                    Pat::Ident(binding) => binding.id.clone(),
                    _ => {
                        normalized.push(stmt);
                        continue;
                    }
                },
                _ => {
                    normalized.push(stmt);
                    continue;
                }
            };

            normalized.push(make_var_decl(
                VarDeclKind::Const,
                Pat::Object(swc_ecma_ast::ObjectPat {
                    span: object_pat.span,
                    props: rewritten_props,
                    optional: object_pat.optional,
                    type_ann: object_pat.type_ann,
                }),
                Some(assign.right.clone()),
            ));
            normalized.push(assign_stmt(
                AssignTarget::from(original_binding),
                Box::new(Expr::Ident(temp_name)),
            ));
            continue;
        }
        let Pat::Array(array_pat) = pat else {
            normalized.push(stmt);
            continue;
        };
        let swc_ecma_ast::ArrayPat {
            span,
            elems,
            optional,
            ..
        } = array_pat;
        if elems
            .iter()
            .flatten()
            .all(|element| matches!(element, Pat::Ident(_)))
            && matches!(unwrap_transparent_expr(&assign.right), Expr::Ident(_))
        {
            normalized.push(stmt);
            continue;
        }

        let mut temp_elems = Vec::with_capacity(elems.len());
        let mut rewritten_assignments = Vec::new();
        let mut can_rewrite = true;

        for element in elems {
            let Some(inner) = element else {
                temp_elems.push(None);
                continue;
            };

            let temp = fresh_lowest_scoped_temp_ident(&mut scope_bindings, reserved);
            temp_elems.push(Some(Pat::Ident(BindingIdent {
                id: temp.clone(),
                type_ann: None,
            })));
            match inner {
                Pat::Ident(binding) => {
                    rewritten_assignments.push(assign_stmt(
                        AssignTarget::from(binding.id.clone()),
                        Box::new(Expr::Ident(temp)),
                    ));
                }
                Pat::Assign(assign_pat) => {
                    let Pat::Ident(binding) = &*assign_pat.left else {
                        can_rewrite = false;
                        break;
                    };
                    rewritten_assignments.push(assign_stmt(
                        AssignTarget::from(binding.id.clone()),
                        Box::new(Expr::Cond(swc_ecma_ast::CondExpr {
                            span: DUMMY_SP,
                            test: Box::new(Expr::Bin(swc_ecma_ast::BinExpr {
                                span: DUMMY_SP,
                                op: op!("==="),
                                left: Box::new(Expr::Ident(temp.clone())),
                                right: Box::new(Expr::Ident(Ident::new_no_ctxt(
                                    "undefined".into(),
                                    DUMMY_SP,
                                ))),
                            })),
                            cons: parenthesize_conditional_expr(assign_pat.right.clone()),
                            alt: Box::new(Expr::Ident(temp)),
                        })),
                    ));
                }
                _ => {
                    can_rewrite = false;
                    break;
                }
            }
        }

        if !can_rewrite {
            normalized.push(stmt);
            continue;
        }

        normalized.push(make_var_decl(
            VarDeclKind::Const,
            Pat::Array(swc_ecma_ast::ArrayPat {
                span,
                elems: temp_elems,
                optional,
                type_ann: None,
            }),
            Some(assign.right.clone()),
        ));
        normalized.extend(rewritten_assignments);
    }

    *stmts = normalized;
}

fn fresh_lowest_scoped_temp_ident(
    scope_bindings: &mut HashSet<String>,
    reserved: &mut HashSet<String>,
) -> Ident {
    let mut index = 0u32;
    loop {
        let candidate = format!("t{index}");
        index += 1;
        if scope_bindings.insert(candidate.clone()) {
            reserved.insert(candidate.clone());
            return Ident::new_no_ctxt(candidate.into(), DUMMY_SP);
        }
    }
}

fn normalize_array_pattern_holes(pat: &mut Pat) {
    let Pat::Array(array_pat) = pat else {
        return;
    };

    for element in &mut array_pat.elems {
        let Some(inner) = element else {
            continue;
        };
        let Pat::Ident(binding) = inner else {
            continue;
        };
        if binding.id.sym == "_" {
            *element = None;
        }
    }
}

fn alias_non_stable_return_bindings(
    return_expr: &mut Box<Expr>,
    transformed: &mut Vec<Stmt>,
    pending_stmts: &[Stmt],
    known_bindings: &mut HashMap<String, bool>,
    reserved: &mut HashSet<String>,
) {
    if jsx_root_expr_mut(return_expr).is_none() {
        return;
    }

    struct Finder {
        names: Vec<String>,
        seen: HashSet<String>,
    }

    impl Visit for Finder {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_ident(&mut self, ident: &Ident) {
            let name = ident.sym.to_string();
            if self.seen.insert(name.clone()) {
                self.names.push(name);
            }
        }
    }

    let mut finder = Finder {
        names: Vec::new(),
        seen: HashSet::new(),
    };
    return_expr.visit_with(&mut finder);

    for name in finder.names {
        if known_bindings.get(name.as_str()).copied().unwrap_or(true) {
            continue;
        }
        if !binding_declared_in_stmts(transformed, name.as_str()) {
            continue;
        }
        if !binding_declared_as_let_in_stmts(transformed, name.as_str()) {
            continue;
        }

        if !binding_declared_as_initialized_let_in_stmts(transformed, name.as_str()) {
            let assigned_in_transformed = has_assignment_to_binding(transformed, name.as_str());
            if !assigned_in_transformed
                && !stmts_definitely_assign_binding(pending_stmts, name.as_str())
            {
                continue;
            }
        }

        let alias_name = format!("{name}_0");
        let alias = if reserved.insert(alias_name.clone()) {
            Ident::new_no_ctxt(alias_name.into(), DUMMY_SP)
        } else {
            fresh_ident(alias_name.as_str(), reserved)
        };
        transformed.push(make_var_decl(
            VarDeclKind::Const,
            Pat::Ident(BindingIdent {
                id: alias.clone(),
                type_ann: None,
            }),
            Some(Box::new(Expr::Ident(Ident::new_no_ctxt(
                name.clone().into(),
                DUMMY_SP,
            )))),
        ));
        known_bindings.insert(alias.sym.to_string(), false);
        rewrite_identifier_in_expr(return_expr, name.as_str(), alias.sym.as_ref());
    }
}

fn rewrite_identifier_in_expr(expr: &mut Box<Expr>, from: &str, to: &str) {
    struct Rewriter<'a> {
        from: &'a str,
        to: &'a str,
    }

    impl VisitMut for Rewriter<'_> {
        fn visit_mut_arrow_expr(&mut self, _: &mut ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_mut_function(&mut self, _: &mut Function) {
            // Skip nested functions.
        }

        fn visit_mut_ident(&mut self, ident: &mut Ident) {
            if ident.sym == self.from {
                ident.sym = self.to.into();
            }
        }
    }

    let mut rewriter = Rewriter { from, to };
    expr.visit_mut_with(&mut rewriter);
}

fn binding_declared_as_let_in_stmts(stmts: &[Stmt], name: &str) -> bool {
    stmts.iter().any(|stmt| {
        let Stmt::Decl(Decl::Var(var_decl)) = stmt else {
            return false;
        };
        if var_decl.kind != VarDeclKind::Let {
            return false;
        }
        var_decl
            .decls
            .iter()
            .flat_map(|decl| collect_pattern_binding_names(&decl.name))
            .any(|binding| binding == name)
    })
}

fn binding_declared_as_initialized_let_in_stmts(stmts: &[Stmt], name: &str) -> bool {
    stmts.iter().any(|stmt| {
        let Stmt::Decl(Decl::Var(var_decl)) = stmt else {
            return false;
        };
        if var_decl.kind != VarDeclKind::Let {
            return false;
        }
        var_decl.decls.iter().any(|decl| {
            decl.init.is_some()
                && collect_pattern_binding_names(&decl.name)
                    .into_iter()
                    .any(|binding| binding == name)
        })
    })
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
                maybe_push_dependency(&mut self.deps, &mut self.seen, dep);
                return;
            }

            member.visit_children_with(self);
        }

        fn visit_do_while_stmt(&mut self, do_while: &swc_ecma_ast::DoWhileStmt) {
            for dep in collect_loop_test_dependencies_from_expr(
                &do_while.test,
                self.known_bindings,
                self.local_bindings,
            ) {
                maybe_push_dependency(&mut self.deps, &mut self.seen, dep);
            }
            do_while.body.visit_with(self);
        }

        fn visit_while_stmt(&mut self, while_stmt: &swc_ecma_ast::WhileStmt) {
            for dep in collect_loop_test_dependencies_from_expr(
                &while_stmt.test,
                self.known_bindings,
                self.local_bindings,
            ) {
                maybe_push_dependency(&mut self.deps, &mut self.seen, dep);
            }
            while_stmt.body.visit_with(self);
        }

        fn visit_for_stmt(&mut self, for_stmt: &swc_ecma_ast::ForStmt) {
            if let Some(test) = &for_stmt.test {
                for dep in collect_loop_test_dependencies_from_expr(
                    test,
                    self.known_bindings,
                    self.local_bindings,
                ) {
                    maybe_push_dependency(&mut self.deps, &mut self.seen, dep);
                }
            }

            if let Some(init) = &for_stmt.init {
                init.visit_with(self);
            }
            if let Some(update) = &for_stmt.update {
                update.visit_with(self);
            }
            for_stmt.body.visit_with(self);
        }

        fn visit_call_expr(&mut self, call: &CallExpr) {
            if let Callee::Expr(callee_expr) = &call.callee {
                if let Expr::Member(member) = &**callee_expr {
                    if call.args.is_empty() || should_collapse_member_callee_dependency(member) {
                        if let Some(dep) = member_object_dependency(
                            member,
                            self.known_bindings,
                            self.local_bindings,
                        ) {
                            maybe_push_dependency(&mut self.deps, &mut self.seen, dep);
                        } else {
                            member.obj.visit_with(self);
                        }

                        if let MemberProp::Computed(computed) = &member.prop {
                            computed.expr.visit_with(self);
                        }
                        for arg in &call.args {
                            arg.visit_with(self);
                        }
                        return;
                    }
                }
            }

            call.visit_children_with(self);
        }

        fn visit_opt_call(&mut self, call: &swc_ecma_ast::OptCall) {
            if let Expr::Member(member) = &*call.callee {
                if call.args.is_empty() || should_collapse_member_callee_dependency(member) {
                    if let Some(dep) =
                        member_object_dependency(member, self.known_bindings, self.local_bindings)
                    {
                        maybe_push_dependency(&mut self.deps, &mut self.seen, dep);
                    } else {
                        member.obj.visit_with(self);
                    }

                    if let MemberProp::Computed(computed) = &member.prop {
                        computed.expr.visit_with(self);
                    }
                    for arg in &call.args {
                        arg.visit_with(self);
                    }
                    return;
                }
            }

            call.visit_children_with(self);
        }

        fn visit_opt_chain_expr(&mut self, expr: &OptChainExpr) {
            match &*expr.base {
                OptChainBase::Member(member) => {
                    if should_collapse_member_callee_dependency(member) {
                        if let Some(dep) = member_object_dependency(
                            member,
                            self.known_bindings,
                            self.local_bindings,
                        ) {
                            maybe_push_dependency(&mut self.deps, &mut self.seen, dep);
                        } else {
                            member.obj.visit_with(self);
                        }

                        if let MemberProp::Computed(computed) = &member.prop {
                            computed.expr.visit_with(self);
                        }
                    } else {
                        member.visit_with(self);
                    }
                }
                OptChainBase::Call(call) => {
                    call.visit_with(self);
                }
            }
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
                maybe_push_dependency(&mut self.deps, &mut self.seen, dep);
                return;
            }

            member.visit_children_with(self);
        }

        fn visit_do_while_stmt(&mut self, do_while: &swc_ecma_ast::DoWhileStmt) {
            for dep in collect_loop_test_dependencies_from_expr(
                &do_while.test,
                self.known_bindings,
                self.local_bindings,
            ) {
                maybe_push_dependency(&mut self.deps, &mut self.seen, dep);
            }
            do_while.body.visit_with(self);
        }

        fn visit_while_stmt(&mut self, while_stmt: &swc_ecma_ast::WhileStmt) {
            for dep in collect_loop_test_dependencies_from_expr(
                &while_stmt.test,
                self.known_bindings,
                self.local_bindings,
            ) {
                maybe_push_dependency(&mut self.deps, &mut self.seen, dep);
            }
            while_stmt.body.visit_with(self);
        }

        fn visit_for_stmt(&mut self, for_stmt: &swc_ecma_ast::ForStmt) {
            if let Some(test) = &for_stmt.test {
                for dep in collect_loop_test_dependencies_from_expr(
                    test,
                    self.known_bindings,
                    self.local_bindings,
                ) {
                    maybe_push_dependency(&mut self.deps, &mut self.seen, dep);
                }
            }

            if let Some(init) = &for_stmt.init {
                init.visit_with(self);
            }
            if let Some(update) = &for_stmt.update {
                update.visit_with(self);
            }
            for_stmt.body.visit_with(self);
        }

        fn visit_call_expr(&mut self, call: &CallExpr) {
            if let Callee::Expr(callee_expr) = &call.callee {
                if let Expr::Member(member) = &**callee_expr {
                    if call.args.is_empty() || should_collapse_member_callee_dependency(member) {
                        if let Some(dep) = member_object_dependency(
                            member,
                            self.known_bindings,
                            self.local_bindings,
                        ) {
                            maybe_push_dependency(&mut self.deps, &mut self.seen, dep);
                        } else {
                            member.obj.visit_with(self);
                        }

                        if let MemberProp::Computed(computed) = &member.prop {
                            computed.expr.visit_with(self);
                        }
                        for arg in &call.args {
                            arg.visit_with(self);
                        }
                        return;
                    }
                }
            }

            call.visit_children_with(self);
        }

        fn visit_opt_call(&mut self, call: &swc_ecma_ast::OptCall) {
            if let Expr::Member(member) = &*call.callee {
                if call.args.is_empty() || should_collapse_member_callee_dependency(member) {
                    if let Some(dep) =
                        member_object_dependency(member, self.known_bindings, self.local_bindings)
                    {
                        maybe_push_dependency(&mut self.deps, &mut self.seen, dep);
                    } else {
                        member.obj.visit_with(self);
                    }

                    if let MemberProp::Computed(computed) = &member.prop {
                        computed.expr.visit_with(self);
                    }
                    for arg in &call.args {
                        arg.visit_with(self);
                    }
                    return;
                }
            }

            call.visit_children_with(self);
        }

        fn visit_opt_chain_expr(&mut self, expr: &OptChainExpr) {
            match &*expr.base {
                OptChainBase::Member(member) => {
                    if should_collapse_member_callee_dependency(member) {
                        if let Some(dep) = member_object_dependency(
                            member,
                            self.known_bindings,
                            self.local_bindings,
                        ) {
                            maybe_push_dependency(&mut self.deps, &mut self.seen, dep);
                        } else {
                            member.obj.visit_with(self);
                        }

                        if let MemberProp::Computed(computed) = &member.prop {
                            computed.expr.visit_with(self);
                        }
                    } else {
                        member.visit_with(self);
                    }
                }
                OptChainBase::Call(call) => {
                    call.visit_with(self);
                }
            }
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
    let mut deps = match unwrap_transparent_expr(expr) {
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
                    let mut deps = collect_dependencies_from_stmts(
                        &block.stmts,
                        known_bindings,
                        &local_bindings,
                    );
                    for dep in
                        collect_called_iife_capture_dependencies(&block.stmts, known_bindings)
                    {
                        if !deps.iter().any(|existing| existing.key == dep.key) {
                            deps.push(dep);
                        }
                    }
                    deps
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
                let mut deps =
                    collect_dependencies_from_stmts(&body.stmts, known_bindings, &local_bindings);
                for dep in collect_called_iife_capture_dependencies(&body.stmts, known_bindings) {
                    if !deps.iter().any(|existing| existing.key == dep.key) {
                        deps.push(dep);
                    }
                }
                deps
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

fn collect_called_iife_capture_dependencies(
    stmts: &[Stmt],
    known_bindings: &HashMap<String, bool>,
) -> Vec<ReactiveDependency> {
    struct Collector<'a> {
        known_bindings: &'a HashMap<String, bool>,
        deps: Vec<ReactiveDependency>,
    }

    impl Visit for Collector<'_> {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_call_expr(&mut self, call: &CallExpr) {
            if let Callee::Expr(callee_expr) = &call.callee {
                if matches!(
                    unwrap_transparent_expr(callee_expr),
                    Expr::Arrow(_) | Expr::Fn(_)
                ) {
                    for dep in
                        collect_function_capture_dependencies(callee_expr, self.known_bindings)
                    {
                        if !self
                            .deps
                            .iter()
                            .any(|existing: &ReactiveDependency| existing.key == dep.key)
                        {
                            self.deps.push(dep);
                        }
                    }
                }
            }

            call.visit_children_with(self);
        }
    }

    let mut collector = Collector {
        known_bindings,
        deps: Vec::new(),
    };
    for stmt in stmts {
        stmt.visit_with(&mut collector);
    }
    reduce_dependencies(collector.deps)
}

fn collect_called_local_function_capture_dependencies(
    stmts: &[Stmt],
    known_bindings: &HashMap<String, bool>,
) -> Vec<ReactiveDependency> {
    let mut stmt_local_bindings = HashSet::new();
    for stmt in stmts {
        collect_stmt_bindings(stmt, &mut stmt_local_bindings);
    }

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
            let dep_base = dep
                .key
                .split_once('.')
                .map(|(base, _)| base)
                .unwrap_or(dep.key.as_str());
            if stmt_local_bindings.contains(dep_base) {
                continue;
            }
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

fn collect_stmt_function_capture_dependencies(
    stmts: &[Stmt],
    known_bindings: &HashMap<String, bool>,
) -> Vec<ReactiveDependency> {
    let mut stmt_local_bindings = HashSet::new();
    for stmt in stmts {
        collect_stmt_bindings(stmt, &mut stmt_local_bindings);
    }

    struct Collector<'a> {
        known_bindings: &'a HashMap<String, bool>,
        stmt_local_bindings: &'a HashSet<String>,
        deps: Vec<ReactiveDependency>,
    }

    impl Collector<'_> {
        fn push_deps_from_expr(&mut self, expr: &Expr) {
            for dep in collect_function_capture_dependencies(expr, self.known_bindings) {
                let dep_base = dep
                    .key
                    .split_once('.')
                    .map(|(base, _)| base)
                    .unwrap_or(dep.key.as_str());
                if self.stmt_local_bindings.contains(dep_base) {
                    continue;
                }
                if !self
                    .deps
                    .iter()
                    .any(|existing: &ReactiveDependency| existing.key == dep.key)
                {
                    self.deps.push(dep);
                }
            }
        }
    }

    impl Visit for Collector<'_> {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_var_declarator(&mut self, declarator: &VarDeclarator) {
            let Some(init) = &declarator.init else {
                return;
            };
            if matches!(unwrap_transparent_expr(init), Expr::Arrow(_) | Expr::Fn(_)) {
                self.push_deps_from_expr(init);
            }
            declarator.visit_children_with(self);
        }

        fn visit_assign_expr(&mut self, assign: &AssignExpr) {
            if assign.op == op!("=")
                && matches!(
                    unwrap_transparent_expr(&assign.right),
                    Expr::Arrow(_) | Expr::Fn(_)
                )
            {
                self.push_deps_from_expr(&assign.right);
            }
            assign.visit_children_with(self);
        }
    }

    let mut collector = Collector {
        known_bindings,
        stmt_local_bindings: &stmt_local_bindings,
        deps: Vec::new(),
    };
    for stmt in stmts {
        stmt.visit_with(&mut collector);
    }

    reduce_dependencies(collector.deps)
}

fn member_dependency(
    member: &MemberExpr,
    known_bindings: &HashMap<String, bool>,
    local_bindings: &HashSet<String>,
) -> Option<ReactiveDependency> {
    let (object, segments) = extract_static_member_dependency_parts(member)?;
    let object_name = object.sym.as_ref();
    if local_bindings.contains(object_name) {
        return None;
    }
    if known_bindings.get(object_name).copied().unwrap_or(true) {
        return None;
    }

    Some(ReactiveDependency {
        key: format!("{object_name}.{}", segments.join(".")),
        expr: Box::new(Expr::Member(member.clone())),
    })
}

fn extract_static_member_dependency_parts(member: &MemberExpr) -> Option<(Ident, Vec<String>)> {
    fn prop_segment(prop: &MemberProp) -> Option<String> {
        match prop {
            MemberProp::Ident(prop) => Some(prop.sym.to_string()),
            MemberProp::Computed(computed) => match &*computed.expr {
                Expr::Lit(Lit::Str(str_lit)) => Some(str_lit.value.to_string_lossy().to_string()),
                Expr::Lit(Lit::Num(num_lit)) => Some(num_lit.value.to_string()),
                _ => None,
            },
            MemberProp::PrivateName(_) => None,
        }
    }

    let mut current = member;
    let mut segments_rev = Vec::new();

    loop {
        segments_rev.push(prop_segment(&current.prop)?);
        match &*current.obj {
            Expr::Ident(object) => {
                segments_rev.reverse();
                return Some((object.clone(), segments_rev));
            }
            Expr::Member(parent) => {
                current = parent;
            }
            _ => return None,
        }
    }
}

fn member_object_dependency(
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

    Some(ReactiveDependency {
        key: object_name.to_string(),
        expr: Box::new(Expr::Ident(object.clone())),
    })
}

fn collect_member_object_dependencies_from_expr(
    expr: &Expr,
    known_bindings: &HashMap<String, bool>,
    local_bindings: &HashSet<String>,
) -> Vec<ReactiveDependency> {
    struct Collector<'a> {
        known_bindings: &'a HashMap<String, bool>,
        local_bindings: &'a HashSet<String>,
        seen: HashSet<String>,
        deps: Vec<ReactiveDependency>,
    }

    impl Visit for Collector<'_> {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_member_expr(&mut self, member: &MemberExpr) {
            if let Some(dep) =
                member_object_dependency(member, self.known_bindings, self.local_bindings)
            {
                maybe_push_dependency(&mut self.deps, &mut self.seen, dep);
            }

            member.visit_children_with(self);
        }
    }

    let mut collector = Collector {
        known_bindings,
        local_bindings,
        seen: HashSet::new(),
        deps: Vec::new(),
    };
    expr.visit_with(&mut collector);
    collector.deps
}

fn collect_loop_test_dependencies_from_expr(
    expr: &Expr,
    known_bindings: &HashMap<String, bool>,
    local_bindings: &HashSet<String>,
) -> Vec<ReactiveDependency> {
    fn is_member_path_of_object(dep_key: &str, object_key: &str) -> bool {
        dep_key.len() > object_key.len()
            && dep_key.starts_with(object_key)
            && dep_key.as_bytes()[object_key.len()] == b'.'
    }

    let mut deps = collect_dependencies_from_expr(expr, known_bindings, local_bindings);
    let object_deps =
        collect_member_object_dependencies_from_expr(expr, known_bindings, local_bindings);
    if object_deps.is_empty() {
        return deps;
    }

    let object_keys: HashSet<String> = object_deps.iter().map(|dep| dep.key.clone()).collect();
    deps.retain(|dep| {
        !object_keys
            .iter()
            .any(|object_key| is_member_path_of_object(&dep.key, object_key))
    });

    let mut seen: HashSet<String> = deps.iter().map(|dep| dep.key.clone()).collect();
    for dep in object_deps {
        maybe_push_dependency(&mut deps, &mut seen, dep);
    }

    reduce_dependencies(deps)
}

fn should_collapse_member_callee_dependency(member: &MemberExpr) -> bool {
    match &member.prop {
        MemberProp::Ident(prop) => matches!(
            prop.sym.as_ref(),
            "at" | "toString" | "toLocaleString" | "valueOf"
        ),
        MemberProp::Computed(computed) => match &*computed.expr {
            Expr::Lit(Lit::Str(str_lit)) => matches!(
                str_lit.value.to_string_lossy().as_ref(),
                "at" | "toString" | "toLocaleString" | "valueOf"
            ),
            _ => false,
        },
        MemberProp::PrivateName(_) => false,
    }
}

fn maybe_push_dependency(
    deps: &mut Vec<ReactiveDependency>,
    seen: &mut HashSet<String>,
    dep: ReactiveDependency,
) {
    if seen.insert(dep.key.clone()) {
        deps.push(dep);
    }
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

fn reduce_nested_member_dependencies(deps: Vec<ReactiveDependency>) -> Vec<ReactiveDependency> {
    let mut reduced = Vec::with_capacity(deps.len());
    for (idx, dep) in deps.iter().enumerate() {
        let subsumed = deps.iter().enumerate().any(|(other_idx, other)| {
            if idx == other_idx {
                return false;
            }
            dep.key.starts_with(&other.key)
                && dep.key.len() > other.key.len()
                && matches!(dep.key.as_bytes().get(other.key.len()), Some(b'.' | b'['))
        });
        if !subsumed {
            reduced.push(dep.clone());
        }
    }

    reduced.sort_by(|left, right| left.key.cmp(&right.key));
    reduced
}

fn rewrite_top_level_rest_pattern_assignments_in_prelude_to_memo_blocks(
    prelude_stmts: &[Stmt],
    known_bindings: &HashMap<String, bool>,
    cache_ident: &Ident,
    slot_start: u32,
) -> Option<(Vec<Stmt>, u32, u32, u32)> {
    let mut rewritten = Vec::with_capacity(prelude_stmts.len());
    let mut local_bindings = HashSet::new();
    let mut cursor = slot_start;
    let mut added_blocks = 0u32;
    let mut added_values = 0u32;

    for stmt in prelude_stmts {
        let mut transformed_stmt = false;
        if let Stmt::Expr(expr_stmt) = stmt {
            if let Expr::Assign(assign) = unwrap_transparent_expr(&expr_stmt.expr) {
                if assign.op == op!("=") {
                    if let AssignTarget::Pat(assign_pat) = &assign.left {
                        let pat = Pat::from(assign_pat.clone());
                        if pattern_has_top_level_rest(&pat) {
                            let mut cache_binding_names =
                                collect_assigned_bindings_in_order_from_stmts(
                                    std::slice::from_ref(stmt),
                                );
                            if !cache_binding_names.is_empty() {
                                cache_binding_names =
                                    reorder_cache_binding_names_for_pattern_assignment(
                                        cache_binding_names,
                                    );
                                cache_binding_names = reorder_array_rest_temp_binding_first(
                                    cache_binding_names,
                                    &pat,
                                );
                                if cache_binding_names.len() >= 2 {
                                    let mut dep_local_bindings = local_bindings.clone();
                                    for binding in &cache_binding_names {
                                        dep_local_bindings.insert(binding.clone());
                                    }

                                    let mut deps = collect_dependencies_from_stmts(
                                        std::slice::from_ref(stmt),
                                        known_bindings,
                                        &dep_local_bindings,
                                    );
                                    for dep in collect_called_local_function_capture_dependencies(
                                        std::slice::from_ref(stmt),
                                        known_bindings,
                                    ) {
                                        if !deps.iter().any(|existing| existing.key == dep.key) {
                                            deps.push(dep);
                                        }
                                    }
                                    for dep in collect_stmt_function_capture_dependencies(
                                        std::slice::from_ref(stmt),
                                        known_bindings,
                                    ) {
                                        if !deps.iter().any(|existing| existing.key == dep.key) {
                                            deps.push(dep);
                                        }
                                    }
                                    deps = reduce_dependencies(deps);
                                    deps = reduce_nested_member_dependencies(deps);
                                    if deps.is_empty() {
                                        if let Expr::Ident(rhs_ident) =
                                            unwrap_transparent_expr(&assign.right)
                                        {
                                            let rhs_name = rhs_ident.sym.to_string();
                                            deps.push(ReactiveDependency {
                                                key: rhs_name,
                                                expr: Box::new(Expr::Ident(rhs_ident.clone())),
                                            });
                                        }
                                    }
                                    if !deps.is_empty() {
                                        let cache_bindings = cache_binding_names
                                            .iter()
                                            .map(|name| {
                                                Ident::new_no_ctxt(name.clone().into(), DUMMY_SP)
                                            })
                                            .collect::<Vec<_>>();
                                        rewritten.extend(build_memoized_block_multi_values(
                                            cache_ident,
                                            cursor,
                                            &deps,
                                            &cache_bindings,
                                            vec![stmt.clone()],
                                        ));
                                        cursor += deps.len() as u32 + cache_bindings.len() as u32;
                                        added_blocks += 1;
                                        added_values += cache_bindings.len() as u32;
                                        transformed_stmt = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        if transformed_stmt {
            collect_stmt_bindings_including_nested_blocks(stmt, &mut local_bindings);
            continue;
        }

        rewritten.push(stmt.clone());
        collect_stmt_bindings_including_nested_blocks(stmt, &mut local_bindings);
    }

    if added_blocks == 0 {
        None
    } else {
        Some((rewritten, cursor - slot_start, added_blocks, added_values))
    }
}

fn reorder_cache_binding_names_for_pattern_assignment(names: Vec<String>) -> Vec<String> {
    let mut seen = HashSet::new();
    let mut ordered = Vec::new();
    let mut temp_names = Vec::new();

    for name in names {
        if !seen.insert(name.clone()) {
            continue;
        }
        if parse_temp_name(name.as_str()).is_some() {
            temp_names.push(name);
        } else {
            ordered.push(name);
        }
    }

    ordered.extend(temp_names);
    ordered
}

fn reorder_array_rest_temp_binding_first(mut names: Vec<String>, pattern: &Pat) -> Vec<String> {
    let Pat::Array(array_pat) = pattern else {
        return names;
    };
    let rest_ident = array_pat.elems.iter().flatten().find_map(|element| {
        let Pat::Rest(rest_pat) = element else {
            return None;
        };
        let Pat::Ident(binding) = &*rest_pat.arg else {
            return None;
        };
        parse_temp_name(binding.id.sym.as_ref()).map(|_| binding.id.sym.to_string())
    });
    let Some(rest_ident) = rest_ident else {
        return names;
    };

    let Some(index) = names.iter().position(|name| name == &rest_ident) else {
        return names;
    };
    if index == 0 {
        return names;
    }

    let rest_name = names.remove(index);
    let mut reordered = vec![rest_name];
    reordered.extend(names);
    reordered
}

fn try_build_pattern_assignment_prelude_memo_fallback(
    prelude_stmts: &[Stmt],
    compute_stmts: &[Stmt],
    known_bindings: &HashMap<String, bool>,
    cache_ident: &Ident,
    slot_start: u32,
) -> Option<(Vec<Stmt>, u32, u32)> {
    let has_pattern_assignment = stmts_contain_pattern_assignment(prelude_stmts);
    let allow_without_rest =
        has_pattern_assignment && prelude_contains_control_flow_stmt(prelude_stmts);
    if !prelude_has_top_level_rest_pattern_assignment(prelude_stmts) && !allow_without_rest {
        return None;
    }

    let mut outer_decls = Vec::new();
    let mut prelude_compute = Vec::new();
    let mut declared_bindings = Vec::<String>::new();
    let mut declared_set = HashSet::<String>::new();

    for stmt in prelude_stmts {
        let Stmt::Decl(Decl::Var(var_decl)) = stmt else {
            prelude_compute.push(stmt.clone());
            continue;
        };
        if !matches!(var_decl.kind, VarDeclKind::Let | VarDeclKind::Const) {
            prelude_compute.push(stmt.clone());
            continue;
        }
        if var_decl
            .decls
            .iter()
            .any(|decl| !matches!(decl.name, Pat::Ident(_)))
        {
            prelude_compute.push(stmt.clone());
            continue;
        }

        for decl in &var_decl.decls {
            let Pat::Ident(binding) = &decl.name else {
                continue;
            };
            let name = binding.id.sym.to_string();
            if declared_set.insert(name.clone()) {
                declared_bindings.push(name.clone());
            }

            let used_in_compute = binding_referenced_in_stmts(compute_stmts, name.as_str());
            let keep_outer_init = decl
                .init
                .as_ref()
                .is_some_and(|init| used_in_compute && !is_static_alloc_literal_expr(init));
            let outer_init = if keep_outer_init {
                decl.init.clone()
            } else {
                None
            };

            outer_decls.push(make_var_decl(
                VarDeclKind::Let,
                Pat::Ident(BindingIdent {
                    id: binding.id.clone(),
                    type_ann: binding.type_ann.clone(),
                }),
                outer_init,
            ));

            if decl.init.is_some() && !keep_outer_init && used_in_compute {
                prelude_compute.push(assign_stmt(
                    AssignTarget::from(binding.id.clone()),
                    decl.init.clone().expect("checked is_some"),
                ));
            }
        }
    }

    if outer_decls.is_empty() || prelude_compute.is_empty() {
        return None;
    }

    let mut cache_binding_names = collect_assigned_bindings_in_order_from_stmts(&prelude_compute);
    cache_binding_names.retain(|name| declared_set.contains(name));
    if cache_binding_names.len() < 2 {
        return None;
    }

    let mut local_bindings = declared_set.clone();
    for stmt in &prelude_compute {
        collect_stmt_bindings_including_nested_blocks(stmt, &mut local_bindings);
    }

    let mut prelude_deps =
        collect_dependencies_from_stmts(&prelude_compute, known_bindings, &local_bindings);
    for dep in collect_called_local_function_capture_dependencies(&prelude_compute, known_bindings)
    {
        if !prelude_deps.iter().any(|existing| existing.key == dep.key) {
            prelude_deps.push(dep);
        }
    }
    for dep in collect_stmt_function_capture_dependencies(&prelude_compute, known_bindings) {
        if !prelude_deps.iter().any(|existing| existing.key == dep.key) {
            prelude_deps.push(dep);
        }
    }
    prelude_deps = reduce_dependencies(prelude_deps);
    prelude_deps = reduce_nested_member_dependencies(prelude_deps);
    if prelude_deps.is_empty() {
        return None;
    }

    let cache_bindings = cache_binding_names
        .into_iter()
        .map(|name| Ident::new_no_ctxt(name.into(), DUMMY_SP))
        .collect::<Vec<_>>();
    let mut rewritten = outer_decls;
    rewritten.extend(build_memoized_block_multi_values(
        cache_ident,
        slot_start,
        &prelude_deps,
        &cache_bindings,
        prelude_compute,
    ));
    let slots = prelude_deps.len() as u32 + cache_bindings.len() as u32;
    let values = cache_bindings.len() as u32;

    Some((rewritten, slots, values))
}

#[allow(clippy::too_many_arguments)]
fn maybe_split_static_array_elements_initializer(
    init_expr: &mut Box<Expr>,
    transformed: &mut Vec<Stmt>,
    cache_ident: &Ident,
    known_bindings: &mut HashMap<String, bool>,
    reserved: &mut HashSet<String>,
    next_temp: &mut u32,
    next_slot: &mut u32,
    memo_blocks: &mut u32,
    memo_values: &mut u32,
) {
    let Expr::Array(array_lit) = &mut **init_expr else {
        return;
    };

    if array_lit.elems.len() < 2 {
        return;
    }

    let mut static_indices = Vec::new();
    let mut has_dynamic_element = false;

    for (index, element_opt) in array_lit.elems.iter().enumerate() {
        let Some(element) = element_opt else {
            has_dynamic_element = true;
            continue;
        };
        if element.spread.is_some() {
            has_dynamic_element = true;
            continue;
        }

        if is_static_alloc_literal_expr(&element.expr) {
            static_indices.push(index);
        } else {
            has_dynamic_element = true;
        }
    }

    if !has_dynamic_element || static_indices.is_empty() {
        return;
    }

    if static_indices.len() == 2 {
        let first_index = static_indices[0];
        let second_index = static_indices[1];
        let Some(first_expr) = array_lit
            .elems
            .get(first_index)
            .and_then(Option::as_ref)
            .map(|element| element.expr.clone())
        else {
            return;
        };
        let Some(second_expr) = array_lit
            .elems
            .get(second_index)
            .and_then(Option::as_ref)
            .map(|element| element.expr.clone())
        else {
            return;
        };

        let first_temp = fresh_temp_ident(next_temp, reserved);
        let second_temp = fresh_temp_ident(next_temp, reserved);
        let mut compute_stmts = vec![
            assign_stmt(AssignTarget::from(first_temp.clone()), first_expr),
            assign_stmt(AssignTarget::from(second_temp.clone()), second_expr),
        ];
        strip_runtime_call_type_args_in_stmts(&mut compute_stmts);

        transformed.extend(build_memoized_block_two_values(
            cache_ident,
            *next_slot,
            &[],
            &first_temp,
            &second_temp,
            compute_stmts,
            true,
            false,
        ));

        if let Some(first_element) = array_lit
            .elems
            .get_mut(first_index)
            .and_then(Option::as_mut)
        {
            first_element.expr = Box::new(Expr::Ident(first_temp.clone()));
        }
        if let Some(second_element) = array_lit
            .elems
            .get_mut(second_index)
            .and_then(Option::as_mut)
        {
            second_element.expr = Box::new(Expr::Ident(second_temp.clone()));
        }

        known_bindings.insert(first_temp.sym.to_string(), true);
        known_bindings.insert(second_temp.sym.to_string(), true);
        *next_slot += 2;
        *memo_blocks += 1;
        *memo_values += 2;
        return;
    }

    for index in static_indices {
        let Some(element) = array_lit.elems.get_mut(index).and_then(Option::as_mut) else {
            continue;
        };

        let value_temp = fresh_temp_ident(next_temp, reserved);
        let mut compute_stmts = vec![assign_stmt(
            AssignTarget::from(value_temp.clone()),
            element.expr.clone(),
        )];
        strip_runtime_call_type_args_in_stmts(&mut compute_stmts);

        transformed.extend(build_memoized_block(
            cache_ident,
            *next_slot,
            &[],
            &value_temp,
            compute_stmts,
            true,
        ));

        element.expr = Box::new(Expr::Ident(value_temp.clone()));
        known_bindings.insert(value_temp.sym.to_string(), true);
        *next_slot += 1;
        *memo_blocks += 1;
        *memo_values += 1;
    }
}

fn is_static_alloc_literal_expr(expr: &Expr) -> bool {
    match unwrap_transparent_expr(expr) {
        Expr::Array(array_lit) => array_lit.elems.iter().all(|element_opt| {
            let Some(element) = element_opt else {
                return false;
            };
            if element.spread.is_some() {
                return false;
            }

            is_static_value_expr(&element.expr)
        }),
        Expr::Object(object_lit) => object_lit.props.iter().all(|prop| match prop {
            swc_ecma_ast::PropOrSpread::Spread(_) => false,
            swc_ecma_ast::PropOrSpread::Prop(prop) => match &**prop {
                swc_ecma_ast::Prop::KeyValue(key_value) => is_static_value_expr(&key_value.value),
                swc_ecma_ast::Prop::Shorthand(_)
                | swc_ecma_ast::Prop::Assign(_)
                | swc_ecma_ast::Prop::Getter(_)
                | swc_ecma_ast::Prop::Setter(_)
                | swc_ecma_ast::Prop::Method(_) => false,
            },
        }),
        _ => false,
    }
}

fn is_static_value_expr(expr: &Expr) -> bool {
    match unwrap_transparent_expr(expr) {
        Expr::Lit(_) => true,
        Expr::Array(_) | Expr::Object(_) => is_static_alloc_literal_expr(expr),
        _ => false,
    }
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
    if matches!(&*element.expr, Expr::Ident(_) | Expr::Lit(_))
        || is_static_alloc_literal_expr(&element.expr)
    {
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
    let deps = collect_dependencies_from_expr(&inner_expr, known_bindings, &local_bindings);
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

#[allow(clippy::too_many_arguments)]
fn maybe_split_single_element_array_initializer(
    init_expr: &mut Box<Expr>,
    transformed: &mut Vec<Stmt>,
    cache_ident: &Ident,
    known_bindings: &mut HashMap<String, bool>,
    reserved: &mut HashSet<String>,
    next_temp: &mut u32,
    next_slot: &mut u32,
    memo_blocks: &mut u32,
    memo_values: &mut u32,
) {
    let Expr::Array(array_lit) = &mut **init_expr else {
        return;
    };
    let [Some(element)] = array_lit.elems.as_mut_slice() else {
        return;
    };
    if element.spread.is_some()
        || matches!(&*element.expr, Expr::Ident(_) | Expr::Lit(_))
        || is_static_alloc_literal_expr(&element.expr)
    {
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
    let deps = collect_dependencies_from_expr(&inner_expr, known_bindings, &local_bindings);
    let value_slot = *next_slot + deps.len() as u32;

    transformed.extend(build_memoized_block(
        cache_ident,
        *next_slot,
        &deps,
        &inner_temp,
        compute_stmts,
        true,
    ));

    element.expr = Box::new(Expr::Ident(inner_temp.clone()));
    known_bindings.insert(inner_temp.sym.to_string(), false);
    *next_slot = value_slot + 1;
    *memo_blocks += 1;
    *memo_values += 1;
}

fn match_pattern_assignment_default_memo_candidate(
    stmt: &Stmt,
    previous_stmt: Option<&Stmt>,
) -> Option<(Ident, Box<Expr>, Ident)> {
    let Stmt::Expr(expr_stmt) = stmt else {
        return None;
    };
    let Expr::Assign(assign) = unwrap_transparent_expr(&expr_stmt.expr) else {
        return None;
    };
    if assign.op != op!("=") {
        return None;
    }
    if !matches!(assign.left, AssignTarget::Pat(_)) {
        return None;
    }
    let Expr::Ident(rhs_ident) = unwrap_transparent_expr(&assign.right) else {
        return None;
    };

    let previous_stmt = previous_stmt?;
    let Stmt::Decl(Decl::Var(var_decl)) = previous_stmt else {
        return None;
    };
    if var_decl.kind != VarDeclKind::Const {
        return None;
    }
    let [decl] = var_decl.decls.as_slice() else {
        return None;
    };
    let Pat::Ident(binding) = &decl.name else {
        return None;
    };
    if binding.id.sym != rhs_ident.sym {
        return None;
    }

    let init_expr = decl.init.clone()?;
    let Expr::Cond(cond_expr) = unwrap_transparent_expr(&init_expr) else {
        return None;
    };
    let Expr::Bin(test_expr) = unwrap_transparent_expr(&cond_expr.test) else {
        return None;
    };
    if test_expr.op != op!("===") {
        return None;
    }

    let dep_ident = match (
        unwrap_transparent_expr(&test_expr.left),
        unwrap_transparent_expr(&test_expr.right),
    ) {
        (Expr::Ident(left), Expr::Ident(right)) if right.sym == "undefined" => left.clone(),
        (Expr::Ident(left), Expr::Ident(right)) if left.sym == "undefined" => right.clone(),
        _ => return None,
    };

    let Expr::Ident(alt_ident) = unwrap_transparent_expr(&cond_expr.alt) else {
        return None;
    };
    if alt_ident.sym != dep_ident.sym {
        return None;
    }

    Some((binding.id.clone(), init_expr, dep_ident))
}

fn lower_object_pattern_default_decl_with_memoization(
    var_decl: &VarDecl,
    cache_ident: &Ident,
    slot_start: u32,
    reserved: &mut HashSet<String>,
    next_temp: &mut u32,
) -> Option<(Vec<Stmt>, u32, u32, u32)> {
    #[derive(Clone)]
    struct AssignDefaultTask {
        binding: Ident,
        source_temp: Ident,
        default_expr: Option<Box<Expr>>,
    }

    if var_decl.kind != VarDeclKind::Const {
        return None;
    }
    let [decl] = var_decl.decls.as_slice() else {
        return None;
    };
    let Pat::Object(object_pat) = &decl.name else {
        return None;
    };
    let init_expr = decl.init.clone()?;

    let mut rewritten_props = Vec::with_capacity(object_pat.props.len());
    let mut assign_tasks = Vec::<AssignDefaultTask>::new();
    let mut changed = false;
    let mut cursor = slot_start;
    let mut added_blocks = 0u32;
    let mut added_values = 0u32;

    for prop in &object_pat.props {
        match prop {
            ObjectPatProp::Assign(assign_prop) => {
                if assign_prop.value.is_none() {
                    rewritten_props.push(ObjectPatProp::Assign(assign_prop.clone()));
                    continue;
                }

                changed = true;
                let source_temp = fresh_temp_ident(next_temp, reserved);
                rewritten_props.push(ObjectPatProp::KeyValue(swc_ecma_ast::KeyValuePatProp {
                    key: PropName::Ident(assign_prop.key.id.clone().into()),
                    value: Box::new(Pat::Ident(BindingIdent {
                        id: source_temp.clone(),
                        type_ann: None,
                    })),
                }));
                assign_tasks.push(AssignDefaultTask {
                    binding: assign_prop.key.id.clone(),
                    source_temp,
                    default_expr: assign_prop.value.clone(),
                });
            }
            other => rewritten_props.push(other.clone()),
        }
    }

    if !changed {
        return None;
    }

    let mut follow_up_stmts = Vec::with_capacity(assign_tasks.len() * 2);
    for task in assign_tasks {
        let assign_expr = if let Some(default_expr) = &task.default_expr {
            Box::new(Expr::Cond(swc_ecma_ast::CondExpr {
                span: DUMMY_SP,
                test: Box::new(Expr::Bin(swc_ecma_ast::BinExpr {
                    span: DUMMY_SP,
                    op: op!("==="),
                    left: Box::new(Expr::Ident(task.source_temp.clone())),
                    right: Box::new(Expr::Ident(Ident::new_no_ctxt(
                        "undefined".into(),
                        DUMMY_SP,
                    ))),
                })),
                cons: default_expr.clone(),
                alt: Box::new(Expr::Ident(task.source_temp.clone())),
            }))
        } else {
            Box::new(Expr::Ident(task.source_temp.clone()))
        };

        if task
            .default_expr
            .as_ref()
            .is_some_and(|default_expr| is_static_alloc_literal_expr(default_expr))
        {
            let value_temp = fresh_temp_ident(next_temp, reserved);
            let mut nested_compute = vec![assign_stmt(
                AssignTarget::from(value_temp.clone()),
                assign_expr,
            )];
            strip_runtime_call_type_args_in_stmts(&mut nested_compute);

            let nested_deps = vec![ReactiveDependency {
                key: task.source_temp.sym.to_string(),
                expr: Box::new(Expr::Ident(task.source_temp)),
            }];
            follow_up_stmts.extend(build_memoized_block(
                cache_ident,
                cursor,
                &nested_deps,
                &value_temp,
                nested_compute,
                true,
            ));
            cursor += nested_deps.len() as u32 + 1;
            added_blocks += 1;
            added_values += 1;

            follow_up_stmts.push(make_var_decl(
                VarDeclKind::Const,
                Pat::Ident(BindingIdent {
                    id: task.binding,
                    type_ann: None,
                }),
                Some(Box::new(Expr::Ident(value_temp))),
            ));
        } else {
            follow_up_stmts.push(make_var_decl(
                VarDeclKind::Const,
                Pat::Ident(BindingIdent {
                    id: task.binding,
                    type_ann: None,
                }),
                Some(assign_expr),
            ));
        }
    }

    let mut lowered = vec![make_var_decl(
        var_decl.kind,
        Pat::Object(swc_ecma_ast::ObjectPat {
            span: object_pat.span,
            props: rewritten_props,
            optional: object_pat.optional,
            type_ann: object_pat.type_ann.clone(),
        }),
        Some(init_expr),
    )];
    lowered.extend(follow_up_stmts);

    Some((lowered, cursor - slot_start, added_blocks, added_values))
}

fn inject_nested_call_memoization_into_stmts(
    stmts: &mut Vec<Stmt>,
    known_bindings: &HashMap<String, bool>,
    cache_ident: &Ident,
    slot_start: u32,
    reserved: &mut HashSet<String>,
    next_temp: &mut u32,
    allow_zero_dep_var_decl_call_memoization: bool,
) -> (u32, u32, u32) {
    let mut out = Vec::with_capacity(stmts.len());
    let mut cursor = slot_start;
    let mut added_blocks = 0u32;
    let mut added_values = 0u32;
    let mut nested_known_bindings = known_bindings.clone();
    let original = std::mem::take(stmts);

    for (index, stmt) in original.iter().cloned().enumerate() {
        let mut stmt = stmt;
        inject_nested_call_memoization_into_stmt_children(
            &mut stmt,
            &nested_known_bindings,
            cache_ident,
            &mut cursor,
            &mut added_blocks,
            &mut added_values,
            reserved,
            next_temp,
        );
        let remaining = &original[index + 1..];

        if let Stmt::Decl(Decl::Var(var_decl)) = &stmt {
            if let Some((lowered_stmts, used_slots, nested_blocks, nested_values)) =
                lower_object_pattern_default_decl_with_memoization(
                    var_decl,
                    cache_ident,
                    cursor,
                    reserved,
                    next_temp,
                )
            {
                cursor += used_slots;
                added_blocks += nested_blocks;
                added_values += nested_values;
                for lowered_stmt in lowered_stmts {
                    out.push(lowered_stmt.clone());
                    mark_stmt_bindings_unstable(&lowered_stmt, &mut nested_known_bindings);
                }
                continue;
            }

            let [decl] = var_decl.decls.as_slice() else {
                out.push(stmt.clone());
                mark_stmt_bindings_unstable(&stmt, &mut nested_known_bindings);
                continue;
            };
            let Pat::Ident(binding) = &decl.name else {
                out.push(stmt.clone());
                mark_stmt_bindings_unstable(&stmt, &mut nested_known_bindings);
                continue;
            };
            let Some(init_expr) = &decl.init else {
                out.push(stmt.clone());
                mark_stmt_bindings_unstable(&stmt, &mut nested_known_bindings);
                continue;
            };
            if matches!(
                unwrap_transparent_expr(init_expr),
                Expr::Arrow(_) | Expr::Fn(_)
            ) {
                let nested_deps =
                    collect_function_capture_dependencies(init_expr, &nested_known_bindings);
                let has_length_dep = nested_deps.iter().any(|dep| dep.key.ends_with(".length"));
                let supported_member_deps =
                    has_length_dep && nested_deps.iter().all(|dep| dep.key.ends_with(".length"));
                let captures_mutated_dep = nested_deps.iter().any(|dep| {
                    let base = dep
                        .key
                        .split_once('.')
                        .map(|(base, _)| base)
                        .unwrap_or(dep.key.as_str());
                    binding_reassigned_after(remaining, base)
                        || binding_mutated_via_member_call_after(remaining, base)
                        || binding_mutated_via_member_assignment_after(remaining, base)
                        || binding_maybe_mutated_via_alias_after(remaining, base)
                });
                if !nested_deps.is_empty() && supported_member_deps && !captures_mutated_dep {
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

                    let rewritten_stmt = make_var_decl(
                        var_decl.kind,
                        Pat::Ident(binding.clone()),
                        Some(Box::new(Expr::Ident(result_temp))),
                    );
                    out.push(rewritten_stmt.clone());
                    mark_stmt_bindings_unstable(&rewritten_stmt, &mut nested_known_bindings);
                    continue;
                }
            }

            let captured_by_called_local_function =
                binding_captured_by_called_local_function_after(remaining, binding.id.sym.as_ref());
            let referenced_in_object_literal_assignment =
                binding_used_in_object_literal_assignment_after(remaining, binding.id.sym.as_ref());
            let should_split_simple_nested_initializer =
                (is_simple_nested_array_initializer(init_expr)
                    && !captured_by_called_local_function)
                    || (is_simple_nested_object_initializer(init_expr)
                        && ((captured_by_called_local_function
                            && !binding_used_as_bare_ident_in_called_local_function_after(
                                remaining,
                                binding.id.sym.as_ref(),
                            ))
                            || referenced_in_object_literal_assignment));
            if should_split_simple_nested_initializer
                && !binding_reassigned_after(remaining, binding.id.sym.as_ref())
                && !binding_mutated_via_member_call_after(remaining, binding.id.sym.as_ref())
                && !binding_mutated_via_member_assignment_after(remaining, binding.id.sym.as_ref())
                && !binding_maybe_mutated_via_alias_after(remaining, binding.id.sym.as_ref())
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

                    let rewritten_stmt = make_var_decl(
                        var_decl.kind,
                        Pat::Ident(binding.clone()),
                        Some(Box::new(Expr::Ident(result_temp))),
                    );
                    out.push(rewritten_stmt.clone());
                    mark_stmt_bindings_unstable(&rewritten_stmt, &mut nested_known_bindings);
                    continue;
                }
            }

            let Expr::Call(call) = &**init_expr else {
                out.push(stmt.clone());
                mark_stmt_bindings_unstable(&stmt, &mut nested_known_bindings);
                continue;
            };
            if call_has_hook_callee(call) {
                out.push(stmt.clone());
                mark_stmt_bindings_unstable(&stmt, &mut nested_known_bindings);
                continue;
            }
            let callee_is_local_binding = matches!(
                &call.callee,
                Callee::Expr(callee_expr)
                    if matches!(
                        unwrap_transparent_expr(callee_expr),
                        Expr::Ident(callee)
                            if nested_known_bindings.contains_key(callee.sym.as_ref())
                    )
            );
            let callee_is_identifier = matches!(
                &call.callee,
                Callee::Expr(callee_expr)
                    if matches!(
                        unwrap_transparent_expr(callee_expr),
                        Expr::Ident(callee)
                            if !is_hook_name(callee.sym.as_ref())
                                && !matches!(callee.sym.as_ref(), "String" | "Number" | "Boolean")
                                && !nested_known_bindings.contains_key(callee.sym.as_ref())
                    )
            );
            if allow_zero_dep_var_decl_call_memoization
                && !callee_is_local_binding
                && callee_is_identifier
                && !call.args.is_empty()
                && call.args.iter().all(|arg| {
                    arg.spread.is_none()
                        && matches!(&*arg.expr, Expr::Ident(_) | Expr::Lit(_) | Expr::Member(_))
                })
            {
                let call_expr = Expr::Call(call.clone());
                let local_bindings = HashSet::new();
                let nested_deps = collect_dependencies_from_expr(
                    &call_expr,
                    &nested_known_bindings,
                    &local_bindings,
                );
                if nested_deps.is_empty() {
                    let result_temp = fresh_temp_ident(next_temp, reserved);
                    let mut nested_compute = vec![assign_stmt(
                        AssignTarget::from(result_temp.clone()),
                        Box::new(call_expr),
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

                    let rewritten_stmt = make_var_decl(
                        var_decl.kind,
                        Pat::Ident(binding.clone()),
                        Some(Box::new(Expr::Ident(result_temp))),
                    );
                    out.push(rewritten_stmt.clone());
                    mark_stmt_bindings_unstable(&rewritten_stmt, &mut nested_known_bindings);
                    continue;
                }
            }
            let [arg] = call.args.as_slice() else {
                out.push(stmt.clone());
                mark_stmt_bindings_unstable(&stmt, &mut nested_known_bindings);
                continue;
            };
            if arg.spread.is_some()
                || matches!(
                    &*arg.expr,
                    Expr::Ident(_)
                        | Expr::Lit(_)
                        | Expr::Member(_)
                        | Expr::Array(_)
                        | Expr::Object(_)
                )
            {
                out.push(stmt.clone());
                mark_stmt_bindings_unstable(&stmt, &mut nested_known_bindings);
                continue;
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
            nested_known_bindings.insert(arg_temp.sym.to_string(), false);

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

            let rewritten_stmt = make_var_decl(
                var_decl.kind,
                Pat::Ident(binding.clone()),
                Some(Box::new(Expr::Ident(result_temp))),
            );
            out.push(rewritten_stmt.clone());
            mark_stmt_bindings_unstable(&rewritten_stmt, &mut nested_known_bindings);
            continue;
        }

        if let Stmt::Expr(expr_stmt) = &stmt {
            if let Expr::Call(call) = &*expr_stmt.expr {
                if call_has_hook_callee(call) {
                    out.push(stmt.clone());
                    mark_stmt_bindings_unstable(&stmt, &mut nested_known_bindings);
                    continue;
                }

                let mut rewritten_call = call.clone();
                let mut changed = false;
                for arg in &mut rewritten_call.args {
                    if arg.spread.is_some() {
                        continue;
                    }
                    if !matches!(&*arg.expr, Expr::Array(_) | Expr::Object(_)) {
                        continue;
                    }

                    let arg_expr = arg.expr.clone();
                    let local_bindings = HashSet::new();
                    let nested_deps = collect_dependencies_from_expr(
                        &arg_expr,
                        &nested_known_bindings,
                        &local_bindings,
                    );
                    let arg_temp = fresh_temp_ident(next_temp, reserved);
                    let mut nested_compute =
                        vec![assign_stmt(AssignTarget::from(arg_temp.clone()), arg_expr)];
                    strip_runtime_call_type_args_in_stmts(&mut nested_compute);

                    out.extend(build_memoized_block(
                        cache_ident,
                        cursor,
                        &nested_deps,
                        &arg_temp,
                        nested_compute,
                        true,
                    ));
                    cursor += nested_deps.len() as u32 + 1;
                    added_blocks += 1;
                    added_values += 1;
                    nested_known_bindings.insert(arg_temp.sym.to_string(), false);

                    arg.expr = Box::new(Expr::Ident(arg_temp));
                    changed = true;
                }

                if changed {
                    let rewritten_stmt = Stmt::Expr(ExprStmt {
                        span: expr_stmt.span,
                        expr: Box::new(Expr::Call(rewritten_call)),
                    });
                    out.push(rewritten_stmt.clone());
                    mark_stmt_bindings_unstable(&rewritten_stmt, &mut nested_known_bindings);
                    continue;
                }
            }
        }

        if let Some((value_binding, default_init_expr, dep_ident)) =
            match_pattern_assignment_default_memo_candidate(&stmt, out.last())
        {
            out.pop();

            let mut nested_compute = vec![assign_stmt(
                AssignTarget::from(value_binding.clone()),
                default_init_expr,
            )];
            strip_runtime_call_type_args_in_stmts(&mut nested_compute);

            let nested_deps = vec![ReactiveDependency {
                key: dep_ident.sym.to_string(),
                expr: Box::new(Expr::Ident(dep_ident)),
            }];
            out.extend(build_memoized_block(
                cache_ident,
                cursor,
                &nested_deps,
                &value_binding,
                nested_compute,
                true,
            ));
            cursor += nested_deps.len() as u32 + 1;
            added_blocks += 1;
            added_values += 1;
            nested_known_bindings.insert(value_binding.sym.to_string(), false);

            out.push(stmt.clone());
            mark_stmt_bindings_unstable(&stmt, &mut nested_known_bindings);
            continue;
        }

        let mut rewritten_stmt = stmt.clone();
        let Stmt::Expr(expr_stmt) = &mut rewritten_stmt else {
            out.push(stmt.clone());
            mark_stmt_bindings_unstable(&stmt, &mut nested_known_bindings);
            continue;
        };
        let Expr::Assign(assign) = &mut *expr_stmt.expr else {
            out.push(stmt.clone());
            mark_stmt_bindings_unstable(&stmt, &mut nested_known_bindings);
            continue;
        };
        if assign.op != op!("=") {
            out.push(stmt.clone());
            mark_stmt_bindings_unstable(&stmt, &mut nested_known_bindings);
            continue;
        }
        let assign_target_binding = assign
            .left
            .as_ident()
            .map(|binding| binding.id.sym.to_string());
        let reassigned_or_mutated_later = assign_target_binding.as_ref().is_some_and(|binding| {
            binding_reassigned_after(remaining, binding)
                || binding_mutated_via_member_call_after(remaining, binding)
                || binding_mutated_via_member_assignment_after(remaining, binding)
        });
        if matches!(unwrap_transparent_expr(&assign.right), Expr::Object(_))
            && !reassigned_or_mutated_later
        {
            let rhs_expr = assign.right.clone();
            let local_bindings = HashSet::new();
            let nested_deps =
                collect_dependencies_from_expr(&rhs_expr, &nested_known_bindings, &local_bindings);
            let depends_on_assign_target = assign_target_binding.as_deref().is_some_and(|target| {
                nested_deps
                    .iter()
                    .any(|dep| dep.key == target || dep.key.starts_with(&format!("{target}.")))
            });
            if !nested_deps.is_empty() {
                if !depends_on_assign_target {
                    out.push(stmt.clone());
                    mark_stmt_bindings_unstable(&stmt, &mut nested_known_bindings);
                    continue;
                }
                let result_temp = fresh_temp_ident(next_temp, reserved);
                let mut nested_compute = vec![assign_stmt(
                    AssignTarget::from(result_temp.clone()),
                    rhs_expr,
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
                nested_known_bindings.insert(result_temp.sym.to_string(), false);

                assign.right = Box::new(Expr::Ident(result_temp));
                out.push(rewritten_stmt.clone());
                mark_stmt_bindings_unstable(&rewritten_stmt, &mut nested_known_bindings);
                continue;
            }
        }
        let Expr::Call(call) = &mut *assign.right else {
            out.push(stmt.clone());
            mark_stmt_bindings_unstable(&stmt, &mut nested_known_bindings);
            continue;
        };
        if call_has_hook_callee(call) {
            out.push(stmt.clone());
            mark_stmt_bindings_unstable(&stmt, &mut nested_known_bindings);
            continue;
        }
        let callee_is_local_binding = matches!(
            &call.callee,
            Callee::Expr(callee_expr)
                if matches!(
                    &**callee_expr,
                    Expr::Ident(callee)
                        if nested_known_bindings.contains_key(callee.sym.as_ref())
                )
        );
        let callee_is_iife_function = matches!(
            &call.callee,
            Callee::Expr(callee_expr)
                if matches!(unwrap_transparent_expr(callee_expr), Expr::Arrow(_) | Expr::Fn(_))
        );
        if call.args.is_empty()
            && !callee_is_local_binding
            && !callee_is_iife_function
            && !reassigned_or_mutated_later
        {
            let result_temp = fresh_temp_ident(next_temp, reserved);
            let mut nested_compute = vec![assign_stmt(
                AssignTarget::from(result_temp.clone()),
                Box::new(Expr::Call(call.clone())),
            )];
            strip_runtime_call_type_args_in_stmts(&mut nested_compute);

            out.extend(build_memoized_block(
                cache_ident,
                cursor,
                &[],
                &result_temp,
                nested_compute,
                true,
            ));
            cursor += 1;
            added_blocks += 1;
            added_values += 1;
            nested_known_bindings.insert(result_temp.sym.to_string(), false);

            assign.right = Box::new(Expr::Ident(result_temp));
            out.push(rewritten_stmt.clone());
            mark_stmt_bindings_unstable(&rewritten_stmt, &mut nested_known_bindings);
            continue;
        }
        let callee_is_identifier = matches!(
            &call.callee,
            Callee::Expr(callee_expr)
                if matches!(
                    unwrap_transparent_expr(callee_expr),
                    Expr::Ident(callee)
                        if !is_hook_name(callee.sym.as_ref())
                            && !matches!(callee.sym.as_ref(), "String" | "Number" | "Boolean")
                            && !nested_known_bindings.contains_key(callee.sym.as_ref())
                )
        );
        if !callee_is_local_binding
            && callee_is_identifier
            && !call.args.is_empty()
            && call.args.iter().all(|arg| {
                arg.spread.is_none()
                    && matches!(&*arg.expr, Expr::Ident(_) | Expr::Lit(_) | Expr::Member(_))
            })
        {
            let result_temp = fresh_temp_ident(next_temp, reserved);
            let call_expr = Expr::Call(call.clone());
            let local_bindings = HashSet::new();
            let nested_deps =
                collect_dependencies_from_expr(&call_expr, &nested_known_bindings, &local_bindings);
            let mut nested_compute = vec![assign_stmt(
                AssignTarget::from(result_temp.clone()),
                Box::new(call_expr),
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
            nested_known_bindings.insert(result_temp.sym.to_string(), false);

            assign.right = Box::new(Expr::Ident(result_temp));
            out.push(rewritten_stmt.clone());
            mark_stmt_bindings_unstable(&rewritten_stmt, &mut nested_known_bindings);
            continue;
        }
        if !callee_is_local_binding
            && !callee_is_iife_function
            && is_react_create_element_call(call)
        {
            let mut changed = false;
            for arg in &mut call.args {
                if arg.spread.is_some() {
                    continue;
                }
                if !matches!(
                    unwrap_transparent_expr(&arg.expr),
                    Expr::Array(_) | Expr::Object(_)
                ) {
                    continue;
                }

                let arg_expr = arg.expr.clone();
                let local_bindings = HashSet::new();
                let nested_deps = collect_dependencies_from_expr(
                    &arg_expr,
                    &nested_known_bindings,
                    &local_bindings,
                );
                let arg_temp = fresh_temp_ident(next_temp, reserved);
                let mut nested_compute =
                    vec![assign_stmt(AssignTarget::from(arg_temp.clone()), arg_expr)];
                strip_runtime_call_type_args_in_stmts(&mut nested_compute);

                out.extend(build_memoized_block(
                    cache_ident,
                    cursor,
                    &nested_deps,
                    &arg_temp,
                    nested_compute,
                    true,
                ));
                cursor += nested_deps.len() as u32 + 1;
                added_blocks += 1;
                added_values += 1;
                nested_known_bindings.insert(arg_temp.sym.to_string(), false);

                arg.expr = Box::new(Expr::Ident(arg_temp));
                changed = true;
            }

            if changed {
                out.push(rewritten_stmt.clone());
                mark_stmt_bindings_unstable(&rewritten_stmt, &mut nested_known_bindings);
                continue;
            }
        }
        if !callee_is_local_binding {
            let [arg] = call.args.as_slice() else {
                out.push(stmt.clone());
                mark_stmt_bindings_unstable(&stmt, &mut nested_known_bindings);
                continue;
            };
            if arg.spread.is_none()
                && matches!(&*arg.expr, Expr::Ident(_) | Expr::Lit(_) | Expr::Member(_))
            {
                let result_temp = fresh_temp_ident(next_temp, reserved);
                let call_expr = Expr::Call(call.clone());
                let local_bindings = HashSet::new();
                let nested_deps = collect_dependencies_from_expr(
                    &call_expr,
                    &nested_known_bindings,
                    &local_bindings,
                );
                if !nested_deps.is_empty() {
                    out.push(stmt.clone());
                    mark_stmt_bindings_unstable(&stmt, &mut nested_known_bindings);
                    continue;
                }
                let mut nested_compute = vec![assign_stmt(
                    AssignTarget::from(result_temp.clone()),
                    Box::new(call_expr),
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
                nested_known_bindings.insert(result_temp.sym.to_string(), false);

                assign.right = Box::new(Expr::Ident(result_temp));
                out.push(rewritten_stmt.clone());
                mark_stmt_bindings_unstable(&rewritten_stmt, &mut nested_known_bindings);
                continue;
            }
        }
        let [arg] = call.args.as_mut_slice() else {
            out.push(stmt.clone());
            mark_stmt_bindings_unstable(&stmt, &mut nested_known_bindings);
            continue;
        };
        if arg.spread.is_some()
            || matches!(
                &*arg.expr,
                Expr::Ident(_) | Expr::Lit(_) | Expr::Member(_) | Expr::Array(_) | Expr::Object(_)
            )
        {
            out.push(stmt.clone());
            mark_stmt_bindings_unstable(&stmt, &mut nested_known_bindings);
            continue;
        }
        let arg_expr = arg.expr.clone();
        if !matches!(
            unwrap_transparent_expr(&arg_expr),
            Expr::JSXElement(_) | Expr::JSXFragment(_) | Expr::Call(_) | Expr::OptChain(_)
        ) {
            out.push(stmt.clone());
            mark_stmt_bindings_unstable(&stmt, &mut nested_known_bindings);
            continue;
        }
        let local_bindings = HashSet::new();
        let nested_deps =
            collect_dependencies_from_expr(&arg_expr, &nested_known_bindings, &local_bindings);
        if nested_deps.is_empty() {
            out.push(stmt.clone());
            mark_stmt_bindings_unstable(&stmt, &mut nested_known_bindings);
            continue;
        }

        let arg_temp = fresh_temp_ident(next_temp, reserved);
        let mut nested_compute = vec![assign_stmt(
            AssignTarget::from(arg_temp.clone()),
            parenthesize_nested_memo_jsx_expr(arg_expr),
        )];
        strip_runtime_call_type_args_in_stmts(&mut nested_compute);

        out.extend(build_memoized_block(
            cache_ident,
            cursor,
            &nested_deps,
            &arg_temp,
            nested_compute,
            true,
        ));
        cursor += nested_deps.len() as u32 + 1;
        added_blocks += 1;
        added_values += 1;
        nested_known_bindings.insert(arg_temp.sym.to_string(), false);

        arg.expr = Box::new(Expr::Ident(arg_temp));
        out.push(rewritten_stmt.clone());
        mark_stmt_bindings_unstable(&rewritten_stmt, &mut nested_known_bindings);
    }

    let added_slots = cursor - slot_start;
    *stmts = out;
    (added_slots, added_blocks, added_values)
}

#[allow(clippy::too_many_arguments)]
fn inject_nested_call_memoization_into_stmt_children(
    stmt: &mut Stmt,
    known_bindings: &HashMap<String, bool>,
    cache_ident: &Ident,
    cursor: &mut u32,
    added_blocks: &mut u32,
    added_values: &mut u32,
    reserved: &mut HashSet<String>,
    next_temp: &mut u32,
) {
    let mut inject_stmt_list = |items: &mut Vec<Stmt>| {
        let (nested_slots, nested_blocks, nested_values) =
            inject_nested_call_memoization_into_stmts(
                items,
                known_bindings,
                cache_ident,
                *cursor,
                reserved,
                next_temp,
                false,
            );
        *cursor += nested_slots;
        *added_blocks += nested_blocks;
        *added_values += nested_values;
    };

    match stmt {
        Stmt::Block(block) => inject_stmt_list(&mut block.stmts),
        Stmt::If(if_stmt) => {
            inject_nested_call_memoization_into_stmt_children(
                &mut if_stmt.cons,
                known_bindings,
                cache_ident,
                cursor,
                added_blocks,
                added_values,
                reserved,
                next_temp,
            );
            if let Some(alt) = &mut if_stmt.alt {
                inject_nested_call_memoization_into_stmt_children(
                    alt,
                    known_bindings,
                    cache_ident,
                    cursor,
                    added_blocks,
                    added_values,
                    reserved,
                    next_temp,
                );
            }
        }
        Stmt::Labeled(labeled) => inject_nested_call_memoization_into_stmt_children(
            &mut labeled.body,
            known_bindings,
            cache_ident,
            cursor,
            added_blocks,
            added_values,
            reserved,
            next_temp,
        ),
        Stmt::For(for_stmt) => inject_nested_call_memoization_into_stmt_children(
            &mut for_stmt.body,
            known_bindings,
            cache_ident,
            cursor,
            added_blocks,
            added_values,
            reserved,
            next_temp,
        ),
        Stmt::ForIn(for_in_stmt) => inject_nested_call_memoization_into_stmt_children(
            &mut for_in_stmt.body,
            known_bindings,
            cache_ident,
            cursor,
            added_blocks,
            added_values,
            reserved,
            next_temp,
        ),
        Stmt::ForOf(for_of_stmt) => inject_nested_call_memoization_into_stmt_children(
            &mut for_of_stmt.body,
            known_bindings,
            cache_ident,
            cursor,
            added_blocks,
            added_values,
            reserved,
            next_temp,
        ),
        Stmt::While(while_stmt) => inject_nested_call_memoization_into_stmt_children(
            &mut while_stmt.body,
            known_bindings,
            cache_ident,
            cursor,
            added_blocks,
            added_values,
            reserved,
            next_temp,
        ),
        Stmt::DoWhile(do_while_stmt) => inject_nested_call_memoization_into_stmt_children(
            &mut do_while_stmt.body,
            known_bindings,
            cache_ident,
            cursor,
            added_blocks,
            added_values,
            reserved,
            next_temp,
        ),
        Stmt::Switch(switch_stmt) => {
            for case in &mut switch_stmt.cases {
                inject_stmt_list(&mut case.cons);
            }
        }
        Stmt::Try(try_stmt) => {
            inject_stmt_list(&mut try_stmt.block.stmts);
            if let Some(handler) = &mut try_stmt.handler {
                inject_stmt_list(&mut handler.body.stmts);
            }
            if let Some(finalizer) = &mut try_stmt.finalizer {
                inject_stmt_list(&mut finalizer.stmts);
            }
        }
        _ => {}
    }
}

fn call_has_hook_callee(call: &CallExpr) -> bool {
    let Callee::Expr(callee_expr) = &call.callee else {
        return false;
    };
    let Expr::Ident(callee) = &**callee_expr else {
        return false;
    };

    is_hook_name(callee.sym.as_ref())
}

fn mark_stmt_bindings_unstable(stmt: &Stmt, known_bindings: &mut HashMap<String, bool>) {
    let mut bindings = HashSet::new();
    collect_stmt_bindings(stmt, &mut bindings);
    for binding in bindings {
        known_bindings.entry(binding).or_insert(false);
    }
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
    if array.elems.len() < 2 {
        return false;
    }

    array.elems.iter().flatten().all(|element| {
        element.spread.is_none() && matches!(&*element.expr, Expr::Ident(_) | Expr::Lit(_))
    })
}

fn is_simple_nested_object_initializer(expr: &Expr) -> bool {
    let Expr::Object(object) = expr else {
        return false;
    };
    if object.props.is_empty() {
        return false;
    }

    object.props.iter().all(|prop| match prop {
        PropOrSpread::Spread(_) => false,
        PropOrSpread::Prop(prop) => match &**prop {
            Prop::Shorthand(_) => true,
            Prop::KeyValue(key_value) => {
                matches!(
                    &*key_value.value,
                    Expr::Ident(_) | Expr::Lit(_) | Expr::Member(_)
                )
            }
            Prop::Assign(assign) => {
                matches!(
                    &*assign.value,
                    Expr::Ident(_) | Expr::Lit(_) | Expr::Member(_)
                )
            }
            _ => false,
        },
    })
}

fn prune_noop_identifier_exprs(stmts: &mut Vec<Stmt>) {
    struct Pruner;

    impl VisitMut for Pruner {
        fn visit_mut_block_stmt(&mut self, block: &mut BlockStmt) {
            for stmt in &mut block.stmts {
                stmt.visit_mut_with(self);
            }
            block.stmts.retain(|stmt| !stmt_is_noop_read_expr(stmt));
        }

        fn visit_mut_function(&mut self, function: &mut Function) {
            if let Some(body) = &mut function.body {
                self.visit_mut_block_stmt(body);
            }
        }

        fn visit_mut_arrow_expr(&mut self, arrow: &mut ArrowExpr) {
            if let swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) = &mut *arrow.body {
                self.visit_mut_block_stmt(block);
            }
        }
    }

    let mut pruner = Pruner;
    for stmt in stmts.iter_mut() {
        stmt.visit_mut_with(&mut pruner);
    }
    stmts.retain(|stmt| !stmt_is_noop_read_expr(stmt));
}

fn stmt_is_noop_read_expr(stmt: &Stmt) -> bool {
    let Stmt::Expr(expr_stmt) = stmt else {
        return false;
    };
    match unwrap_transparent_expr(&expr_stmt.expr) {
        Expr::Ident(_) | Expr::JSXElement(_) | Expr::JSXFragment(_) => true,
        Expr::Member(member) => member_read_is_pure(member),
        _ => false,
    }
}

fn member_read_is_pure(member: &MemberExpr) -> bool {
    if !expr_is_prunable_pure(member.obj.as_ref()) {
        return false;
    }
    match &member.prop {
        MemberProp::Ident(_) => true,
        MemberProp::Computed(computed) => {
            matches!(unwrap_transparent_expr(&computed.expr), Expr::Lit(_))
        }
        MemberProp::PrivateName(_) => false,
    }
}

fn expr_is_prunable_pure(expr: &Expr) -> bool {
    match unwrap_transparent_expr(expr) {
        Expr::Ident(_) | Expr::Lit(_) => true,
        Expr::Object(object) => object.props.iter().all(|prop| match prop {
            swc_ecma_ast::PropOrSpread::Spread(_) => false,
            swc_ecma_ast::PropOrSpread::Prop(prop) => match &**prop {
                swc_ecma_ast::Prop::KeyValue(kv) => expr_is_prunable_pure(&kv.value),
                swc_ecma_ast::Prop::Shorthand(_) => true,
                swc_ecma_ast::Prop::Assign(assign) => expr_is_prunable_pure(&assign.value),
                swc_ecma_ast::Prop::Getter(_)
                | swc_ecma_ast::Prop::Setter(_)
                | swc_ecma_ast::Prop::Method(_) => false,
            },
        }),
        Expr::Array(array) => array
            .elems
            .iter()
            .flatten()
            .all(|elem| elem.spread.is_none() && expr_is_prunable_pure(&elem.expr)),
        Expr::Member(member) => member_read_is_pure(member),
        _ => false,
    }
}

fn prune_unused_pure_var_decls(stmts: &mut Vec<Stmt>) {
    struct Pruner;

    impl VisitMut for Pruner {
        fn visit_mut_block_stmt(&mut self, block: &mut BlockStmt) {
            for stmt in &mut block.stmts {
                stmt.visit_mut_with(self);
            }
            prune_unused_pure_var_decls_in_list(&mut block.stmts);
        }

        fn visit_mut_function(&mut self, function: &mut Function) {
            if let Some(body) = &mut function.body {
                self.visit_mut_block_stmt(body);
            }
        }

        fn visit_mut_arrow_expr(&mut self, arrow: &mut ArrowExpr) {
            if let swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) = &mut *arrow.body {
                self.visit_mut_block_stmt(block);
            }
        }
    }

    let mut pruner = Pruner;
    for stmt in stmts.iter_mut() {
        stmt.visit_mut_with(&mut pruner);
    }
    prune_unused_pure_var_decls_in_list(stmts);
}

fn prune_unused_pure_var_decls_in_list(stmts: &mut Vec<Stmt>) {
    let mut index = 0usize;
    while index < stmts.len() {
        let remove = match stmts.get(index) {
            Some(Stmt::Decl(Decl::Var(var_decl)))
                if matches!(var_decl.kind, VarDeclKind::Let | VarDeclKind::Const) =>
            {
                let [declarator] = var_decl.decls.as_slice() else {
                    index += 1;
                    continue;
                };
                let Pat::Ident(binding) = &declarator.name else {
                    index += 1;
                    continue;
                };
                let Some(init) = &declarator.init else {
                    index += 1;
                    continue;
                };
                expr_is_prunable_pure(init)
                    && !binding_referenced_in_stmts(&stmts[index + 1..], binding.id.sym.as_ref())
            }
            _ => false,
        };

        if remove {
            stmts.remove(index);
        } else {
            index += 1;
        }
    }
}

fn prune_unused_function_like_decl_stmts(stmts: &mut Vec<Stmt>) {
    let mut index = 0usize;
    while index < stmts.len() {
        let remove = matches!(
            stmts.get(index),
            Some(Stmt::Decl(Decl::Var(var_decl)))
                if matches!(
                    var_decl.decls.as_slice(),
                    [VarDeclarator {
                        name: Pat::Ident(BindingIdent { id, .. }),
                        init: Some(init),
                        ..
                    }] if matches!(unwrap_transparent_expr(init), Expr::Arrow(_) | Expr::Fn(_))
                        && !binding_referenced_in_stmts(&stmts[index + 1..], id.sym.as_ref())
                )
        );

        if remove {
            stmts.remove(index);
        } else {
            index += 1;
        }
    }
}

fn prune_unused_underscore_jsx_decls(stmts: &mut Vec<Stmt>) {
    let mut index = 0usize;
    while index < stmts.len() {
        let Some(Stmt::Decl(Decl::Var(var_decl))) = stmts.get(index) else {
            index += 1;
            continue;
        };
        let [declarator] = var_decl.decls.as_slice() else {
            index += 1;
            continue;
        };
        let Pat::Ident(binding) = &declarator.name else {
            index += 1;
            continue;
        };
        if binding.id.sym != "_" {
            index += 1;
            continue;
        }
        let Some(init) = &declarator.init else {
            index += 1;
            continue;
        };
        if !matches!(
            unwrap_transparent_expr(init),
            Expr::JSXElement(_) | Expr::JSXFragment(_)
        ) {
            index += 1;
            continue;
        }
        if binding_referenced_in_stmts(&stmts[index + 1..], "_") {
            index += 1;
            continue;
        }

        stmts.remove(index);
    }
}

fn prune_empty_stmts(stmts: &mut Vec<Stmt>) {
    stmts.retain(|stmt| !matches!(stmt, Stmt::Empty(_)));
}

fn promote_immutable_lets_to_const(stmts: &mut [Stmt]) {
    let extra_reassigned = HashSet::new();
    promote_immutable_lets_to_const_with_reassigned(stmts, &extra_reassigned);
}

fn promote_immutable_lets_to_const_with_reassigned(
    stmts: &mut [Stmt],
    extra_reassigned: &HashSet<String>,
) {
    #[derive(Default)]
    struct ReassignedCollector {
        names: HashSet<String>,
    }

    impl Visit for ReassignedCollector {
        fn visit_assign_expr(&mut self, assign: &AssignExpr) {
            if let Some(binding) = assign.left.as_ident() {
                self.names.insert(binding.id.sym.to_string());
            } else if let AssignTarget::Pat(assign_pat) = &assign.left {
                for binding in collect_pattern_binding_names(&Pat::from(assign_pat.clone())) {
                    self.names.insert(binding);
                }
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
    collector.names.extend(extra_reassigned.iter().cloned());

    let mut promoter = Promoter {
        reassigned: &collector.names,
    };
    for stmt in &mut *stmts {
        stmt.visit_mut_with(&mut promoter);
    }

    struct NestedScopePromoter;

    impl VisitMut for NestedScopePromoter {
        fn visit_mut_arrow_expr(&mut self, arrow: &mut ArrowExpr) {
            let swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) = &mut *arrow.body else {
                return;
            };
            promote_immutable_lets_to_const(&mut block.stmts);
        }

        fn visit_mut_function(&mut self, function: &mut Function) {
            let Some(body) = &mut function.body else {
                return;
            };
            promote_immutable_lets_to_const(&mut body.stmts);
        }
    }

    let mut nested_scope_promoter = NestedScopePromoter;
    for stmt in &mut *stmts {
        stmt.visit_mut_with(&mut nested_scope_promoter);
    }
}

fn collect_assigned_bindings_in_expr(expr: &Expr) -> HashSet<String> {
    #[derive(Default)]
    struct Collector {
        names: HashSet<String>,
    }

    impl Visit for Collector {
        fn visit_assign_expr(&mut self, assign: &AssignExpr) {
            if let Some(binding) = assign.left.as_ident() {
                self.names.insert(binding.id.sym.to_string());
            } else if let AssignTarget::Pat(assign_pat) = &assign.left {
                for binding in collect_pattern_binding_names(&Pat::from(assign_pat.clone())) {
                    self.names.insert(binding);
                }
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

    let mut collector = Collector::default();
    expr.visit_with(&mut collector);
    collector.names
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

        fn visit_call_expr(&mut self, call: &CallExpr) {
            if self.found {
                return;
            }
            if let Callee::Expr(callee_expr) = &call.callee {
                if iife_callee_reassigns_binding(callee_expr, self.name) {
                    self.found = true;
                    return;
                }
            }
            call.visit_children_with(self);
        }

        fn visit_assign_expr(&mut self, assign: &AssignExpr) {
            if assign_target_assigns_binding(&assign.left, self.name) {
                self.found = true;
                return;
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

fn binding_reassigned_in_called_iife_after(stmts: &[Stmt], name: &str) -> bool {
    for stmt in stmts {
        let mut found = false;

        struct Finder<'a> {
            name: &'a str,
            found: &'a mut bool,
        }

        impl Visit for Finder<'_> {
            fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
                // Skip nested functions.
            }

            fn visit_function(&mut self, _: &Function) {
                // Skip nested functions.
            }

            fn visit_call_expr(&mut self, call: &CallExpr) {
                if *self.found {
                    return;
                }
                if let Callee::Expr(callee_expr) = &call.callee {
                    if iife_callee_reassigns_binding(callee_expr, self.name) {
                        *self.found = true;
                        return;
                    }
                }
                call.visit_children_with(self);
            }
        }

        let mut finder = Finder {
            name,
            found: &mut found,
        };
        stmt.visit_with(&mut finder);
        if found {
            return true;
        }
    }

    false
}

fn binding_maybe_mutated_in_called_iife_after(stmts: &[Stmt], name: &str) -> bool {
    for stmt in stmts {
        let mut found = false;

        struct Finder<'a> {
            name: &'a str,
            found: &'a mut bool,
        }

        impl Visit for Finder<'_> {
            fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
                // Skip nested functions.
            }

            fn visit_function(&mut self, _: &Function) {
                // Skip nested functions.
            }

            fn visit_call_expr(&mut self, call: &CallExpr) {
                if *self.found {
                    return;
                }
                if iife_call_may_mutate_binding(call, self.name) {
                    *self.found = true;
                    return;
                }
                call.visit_children_with(self);
            }
        }

        let mut finder = Finder {
            name,
            found: &mut found,
        };
        stmt.visit_with(&mut finder);
        if found {
            return true;
        }
    }

    false
}

fn iife_call_may_mutate_binding(call: &CallExpr, name: &str) -> bool {
    let Callee::Expr(callee_expr) = &call.callee else {
        return false;
    };
    iife_callee_may_mutate_binding(callee_expr, name)
}

fn iife_callee_reassigns_binding(callee_expr: &Expr, name: &str) -> bool {
    struct ReassignCollector<'a> {
        name: &'a str,
        found: bool,
    }

    impl Visit for ReassignCollector<'_> {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_assign_expr(&mut self, assign: &AssignExpr) {
            if assign_target_assigns_binding(&assign.left, self.name) {
                self.found = true;
                return;
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

    let mut collector = ReassignCollector { name, found: false };
    match unwrap_transparent_expr(callee_expr) {
        Expr::Fn(fn_expr) => {
            if let Some(body) = &fn_expr.function.body {
                for stmt in &body.stmts {
                    stmt.visit_with(&mut collector);
                    if collector.found {
                        return true;
                    }
                }
            }
            false
        }
        Expr::Arrow(arrow) => {
            match &*arrow.body {
                swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) => {
                    for stmt in &block.stmts {
                        stmt.visit_with(&mut collector);
                        if collector.found {
                            return true;
                        }
                    }
                }
                swc_ecma_ast::BlockStmtOrExpr::Expr(expr) => expr.visit_with(&mut collector),
            }
            collector.found
        }
        _ => false,
    }
}

fn iife_callee_may_mutate_binding(callee_expr: &Expr, name: &str) -> bool {
    let body_stmts = match unwrap_transparent_expr(callee_expr) {
        Expr::Fn(fn_expr) => fn_expr
            .function
            .body
            .as_ref()
            .map(|body| body.stmts.as_slice()),
        Expr::Arrow(arrow) => match &*arrow.body {
            swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) => Some(block.stmts.as_slice()),
            swc_ecma_ast::BlockStmtOrExpr::Expr(_) => None,
        },
        _ => None,
    };

    let Some(body_stmts) = body_stmts else {
        return false;
    };

    binding_passed_to_potentially_mutating_call_after(body_stmts, name)
        || binding_mutated_via_member_call_after(body_stmts, name)
        || binding_mutated_via_member_assignment_after(body_stmts, name)
        || binding_maybe_mutated_via_alias_after(body_stmts, name)
        || binding_reassigned_after(body_stmts, name)
}

fn assign_target_assigns_binding(target: &AssignTarget, name: &str) -> bool {
    if let Some(binding) = target.as_ident() {
        return binding.id.sym == name;
    }

    let AssignTarget::Pat(pat) = target else {
        return false;
    };
    collect_pattern_binding_names(&Pat::from(pat.clone()))
        .into_iter()
        .any(|binding| binding == name)
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

        fn visit_unary_expr(&mut self, unary: &swc_ecma_ast::UnaryExpr) {
            if matches!(unary.op, swc_ecma_ast::UnaryOp::Delete) {
                if let Expr::Member(member) = unwrap_transparent_expr(&unary.arg) {
                    if member_root_is_binding(member, self.name) {
                        self.found = true;
                        return;
                    }
                }
            }
            unary.visit_children_with(self);
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

fn binding_maybe_mutated_via_alias_after(stmts: &[Stmt], name: &str) -> bool {
    let mut aliases = HashSet::new();

    for stmt in stmts {
        collect_binding_aliases_from_stmt(stmt, name, &mut aliases);
        if aliases.is_empty() {
            continue;
        }

        if stmt_calls_with_alias_argument(stmt, &aliases)
            || stmt_calls_mutating_member_on_alias(stmt, &aliases)
            || stmt_assigns_member_of_alias(stmt, &aliases)
        {
            return true;
        }
    }

    false
}

fn binding_passed_to_potentially_mutating_call_after(stmts: &[Stmt], name: &str) -> bool {
    let aliases = HashSet::from([name.to_string()]);
    let mut frozen_by_create_element = false;

    for stmt in stmts {
        let freezes_alias = stmt_freezes_alias_via_create_element(stmt, &aliases);
        let mutates_via_call = stmt_calls_identifier_with_alias_argument(stmt, &aliases);

        if freezes_alias {
            frozen_by_create_element = true;
            continue;
        }

        if mutates_via_call {
            if frozen_by_create_element {
                continue;
            }
            return true;
        }
    }

    false
}

fn binding_frozen_via_create_element_after(stmts: &[Stmt], name: &str) -> bool {
    let aliases = HashSet::from([name.to_string()]);
    stmts
        .iter()
        .any(|stmt| stmt_freezes_alias_via_create_element(stmt, &aliases))
}

fn binding_captured_by_called_local_function_after(stmts: &[Stmt], name: &str) -> bool {
    let outer = HashSet::from([name.to_string()]);
    let mut function_bindings = HashSet::new();
    for stmt in stmts {
        let Some((binding, init)) = extract_memoizable_single_decl(stmt) else {
            continue;
        };
        if !matches!(unwrap_transparent_expr(&init), Expr::Arrow(_) | Expr::Fn(_)) {
            continue;
        }
        if function_expr_may_capture_outer_bindings(&init, &outer) {
            function_bindings.insert(binding.sym.to_string());
        }
    }
    if function_bindings.is_empty() {
        return false;
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
                if let Expr::Ident(callee) = unwrap_transparent_expr(callee_expr) {
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

    called
        .names
        .into_iter()
        .any(|called_name| function_bindings.contains(called_name.as_str()))
}

fn binding_captured_by_function_passed_to_call_after(stmts: &[Stmt], name: &str) -> bool {
    let outer = HashSet::from([name.to_string()]);
    let mut function_bindings = HashSet::new();
    for stmt in stmts {
        let Some((binding, init)) = extract_memoizable_single_decl(stmt) else {
            continue;
        };
        if !matches!(unwrap_transparent_expr(&init), Expr::Arrow(_) | Expr::Fn(_)) {
            continue;
        }
        if function_expr_may_capture_outer_bindings(&init, &outer) {
            function_bindings.insert(binding.sym.to_string());
        }
    }
    if function_bindings.is_empty() {
        return false;
    }

    struct ArgCollector<'a> {
        function_bindings: &'a HashSet<String>,
        found: bool,
    }

    impl Visit for ArgCollector<'_> {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_call_expr(&mut self, call: &CallExpr) {
            if self.found {
                return;
            }
            if call.args.iter().any(|arg| {
                arg.spread.is_none()
                    && matches!(
                        unwrap_transparent_expr(&arg.expr),
                        Expr::Ident(ident) if self.function_bindings.contains(ident.sym.as_ref())
                    )
            }) {
                self.found = true;
                return;
            }
            call.visit_children_with(self);
        }
    }

    let mut collector = ArgCollector {
        function_bindings: &function_bindings,
        found: false,
    };
    for stmt in stmts {
        stmt.visit_with(&mut collector);
        if collector.found {
            return true;
        }
    }
    false
}

fn binding_used_as_bare_ident_in_called_local_function_after(stmts: &[Stmt], name: &str) -> bool {
    let outer = HashSet::from([name.to_string()]);
    let mut function_inits = HashMap::new();
    for stmt in stmts {
        let Some((binding, init)) = extract_memoizable_single_decl(stmt) else {
            continue;
        };
        if !matches!(unwrap_transparent_expr(&init), Expr::Arrow(_) | Expr::Fn(_)) {
            continue;
        }
        if function_expr_may_capture_outer_bindings(&init, &outer) {
            function_inits.insert(binding.sym.to_string(), init);
        }
    }
    if function_inits.is_empty() {
        return false;
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
                if let Expr::Ident(callee) = unwrap_transparent_expr(callee_expr) {
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

    called.names.into_iter().any(|called_name| {
        function_inits
            .get(called_name.as_str())
            .is_some_and(|init| function_expr_uses_binding_as_bare_ident(init, name))
    })
}

fn function_expr_uses_binding_as_bare_ident(expr: &Expr, name: &str) -> bool {
    struct BareUseFinder<'a> {
        name: &'a str,
        found: bool,
    }

    impl Visit for BareUseFinder<'_> {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_expr(&mut self, expr: &Expr) {
            if self.found {
                return;
            }
            match unwrap_transparent_expr(expr) {
                Expr::Ident(ident) if ident.sym.as_ref() == self.name => {
                    self.found = true;
                }
                Expr::Member(member) if member_root_is_binding(member, self.name) => {
                    if let MemberProp::Computed(computed) = &member.prop {
                        computed.expr.visit_with(self);
                    }
                }
                _ => expr.visit_children_with(self),
            }
        }

        fn visit_prop(&mut self, prop: &Prop) {
            if self.found {
                return;
            }
            if let Prop::Shorthand(ident) = prop {
                if ident.sym.as_ref() == self.name {
                    self.found = true;
                    return;
                }
            }
            prop.visit_children_with(self);
        }
    }

    let mut finder = BareUseFinder { name, found: false };
    match unwrap_transparent_expr(expr) {
        Expr::Arrow(arrow) => match &*arrow.body {
            swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) => {
                for stmt in &block.stmts {
                    stmt.visit_with(&mut finder);
                    if finder.found {
                        break;
                    }
                }
                if !finder.found && called_iife_uses_binding_as_bare_ident(&block.stmts, name) {
                    finder.found = true;
                }
            }
            swc_ecma_ast::BlockStmtOrExpr::Expr(body_expr) => body_expr.visit_with(&mut finder),
        },
        Expr::Fn(fn_expr) => {
            if let Some(body) = &fn_expr.function.body {
                for stmt in &body.stmts {
                    stmt.visit_with(&mut finder);
                    if finder.found {
                        break;
                    }
                }
                if !finder.found && called_iife_uses_binding_as_bare_ident(&body.stmts, name) {
                    finder.found = true;
                }
            }
        }
        _ => {}
    }

    finder.found
}

fn called_iife_uses_binding_as_bare_ident(stmts: &[Stmt], name: &str) -> bool {
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
            if self.found {
                return;
            }

            if let Callee::Expr(callee_expr) = &call.callee {
                if matches!(
                    unwrap_transparent_expr(callee_expr),
                    Expr::Arrow(_) | Expr::Fn(_)
                ) && function_expr_uses_binding_as_bare_ident(callee_expr, self.name)
                {
                    self.found = true;
                    return;
                }
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

fn binding_used_in_object_literal_assignment_after(stmts: &[Stmt], name: &str) -> bool {
    stmts.iter().any(|stmt| {
        let Stmt::Expr(expr_stmt) = stmt else {
            return false;
        };
        let Expr::Assign(assign) = unwrap_transparent_expr(&expr_stmt.expr) else {
            return false;
        };

        assign.op == op!("=")
            && matches!(unwrap_transparent_expr(&assign.right), Expr::Object(_))
            && count_binding_references_in_expr(&assign.right, name) > 0
    })
}

fn binding_used_in_potentially_mutating_callback_chain_after(stmts: &[Stmt], name: &str) -> bool {
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
            let Callee::Expr(callee_expr) = &call.callee else {
                call.visit_children_with(self);
                return;
            };
            let Expr::Member(member) = unwrap_transparent_expr(callee_expr) else {
                call.visit_children_with(self);
                return;
            };

            let method_name = match &member.prop {
                MemberProp::Ident(prop) => Some(prop.sym.to_string()),
                MemberProp::Computed(computed) => match &*computed.expr {
                    Expr::Lit(Lit::Str(str_lit)) => {
                        Some(str_lit.value.to_string_lossy().to_string())
                    }
                    _ => None,
                },
                MemberProp::PrivateName(_) => None,
            };
            let Some(method_name) = method_name else {
                call.visit_children_with(self);
                return;
            };
            let is_callback_chain = matches!(
                method_name.as_str(),
                "map" | "forEach" | "flatMap" | "reduce" | "reduceRight"
            );
            if !is_callback_chain || call.args.is_empty() {
                call.visit_children_with(self);
                return;
            }

            if count_binding_references_in_expr(member.obj.as_ref(), self.name) > 0 {
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

fn binding_has_jsx_freeze_marker(stmts: &[Stmt], name: &str) -> bool {
    stmts.iter().any(|stmt| {
        let Stmt::Expr(expr_stmt) = stmt else {
            return false;
        };
        matches!(
            unwrap_transparent_expr(&expr_stmt.expr),
            Expr::JSXElement(_) | Expr::JSXFragment(_)
        ) && count_binding_references_in_stmt(stmt, name) > 0
    })
}

fn binding_referenced_as_jsx_tag_in_stmts(stmts: &[Stmt], name: &str) -> bool {
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

        fn visit_jsx_element(&mut self, element: &swc_ecma_ast::JSXElement) {
            if self.found {
                return;
            }

            if matches!(
                &element.opening.name,
                swc_ecma_ast::JSXElementName::Ident(ident) if ident.sym == self.name
            ) {
                self.found = true;
                return;
            }

            element.visit_children_with(self);
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

fn is_self_use_memo_assignment_stmt(stmt: &Stmt, name: &str) -> bool {
    let Stmt::Expr(expr_stmt) = stmt else {
        return false;
    };
    let Expr::Assign(assign) = unwrap_transparent_expr(&expr_stmt.expr) else {
        return false;
    };
    if assign.op != op!("=") {
        return false;
    }
    let Some(target) = assign.left.as_ident() else {
        return false;
    };
    if target.id.sym != name {
        return false;
    }

    let Expr::Call(call) = unwrap_transparent_expr(&assign.right) else {
        return false;
    };
    let Callee::Expr(callee_expr) = &call.callee else {
        return false;
    };
    let Expr::Ident(callee_ident) = unwrap_transparent_expr(callee_expr) else {
        return false;
    };
    if callee_ident.sym != "useMemo" {
        return false;
    }
    let [callback_arg, deps_arg] = call.args.as_slice() else {
        return false;
    };
    if callback_arg.spread.is_some() || deps_arg.spread.is_some() {
        return false;
    }
    if !memo_callback_returns_binding(&callback_arg.expr, name) {
        return false;
    }
    let Expr::Array(deps_array) = unwrap_transparent_expr(&deps_arg.expr) else {
        return false;
    };
    let [Some(dep)] = deps_array.elems.as_slice() else {
        return false;
    };
    dep.spread.is_none()
        && matches!(unwrap_transparent_expr(&dep.expr), Expr::Ident(ident) if ident.sym == name)
}

fn memo_callback_returns_binding(callback: &Expr, name: &str) -> bool {
    match unwrap_transparent_expr(callback) {
        Expr::Arrow(arrow) => match &*arrow.body {
            swc_ecma_ast::BlockStmtOrExpr::Expr(expr) => {
                matches!(unwrap_transparent_expr(expr), Expr::Ident(ident) if ident.sym == name)
            }
            swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) => {
                matches!(
                    block.stmts.as_slice(),
                    [Stmt::Return(return_stmt)]
                        if return_stmt
                            .arg
                            .as_ref()
                            .is_some_and(|arg| matches!(unwrap_transparent_expr(arg), Expr::Ident(ident) if ident.sym == name))
                )
            }
        },
        Expr::Fn(fn_expr) => {
            let Some(body) = &fn_expr.function.body else {
                return false;
            };
            matches!(
                body.stmts.as_slice(),
                [Stmt::Return(return_stmt)]
                    if return_stmt
                        .arg
                        .as_ref()
                        .is_some_and(|arg| matches!(unwrap_transparent_expr(arg), Expr::Ident(ident) if ident.sym == name))
            )
        }
        _ => false,
    }
}

fn make_self_use_memo_noop_stmts(name: &str) -> Vec<Stmt> {
    let ident = Ident::new_no_ctxt(name.into(), DUMMY_SP);
    vec![
        Stmt::Expr(ExprStmt {
            span: DUMMY_SP,
            expr: Box::new(Expr::Ident(ident.clone())),
        }),
        assign_stmt(
            AssignTarget::from(ident.clone()),
            Box::new(Expr::Ident(ident)),
        ),
    ]
}

fn binding_used_in_array_receiver_chain_after(stmts: &[Stmt], name: &str) -> bool {
    let mut aliases = HashSet::from([name.to_string()]);

    for stmt in stmts {
        let source_aliases = aliases.clone();
        collect_array_receiver_aliases(stmt, &source_aliases, &mut aliases);
        if stmt_uses_alias_as_array_receiver_call(stmt, &aliases) {
            return true;
        }
    }

    false
}

fn binding_used_in_iterator_spread_chain_after(stmts: &[Stmt], name: &str) -> bool {
    let mut aliases = HashSet::from([name.to_string()]);

    for stmt in stmts {
        let source_aliases = aliases.clone();
        collect_iterator_aliases(stmt, &source_aliases, &mut aliases);
        if stmt_spreads_iterator_alias(stmt, &aliases) {
            return true;
        }
    }

    false
}

fn return_expr_spreads_iterator_alias(
    return_expr: &Expr,
    transformed: &[Stmt],
    tail: &[Stmt],
) -> bool {
    let Expr::Call(call) = unwrap_transparent_expr(return_expr) else {
        return false;
    };

    call.args.iter().any(|arg| {
        if arg.spread.is_none() {
            return false;
        }
        let Expr::Ident(ident) = unwrap_transparent_expr(&arg.expr) else {
            return false;
        };

        binding_declared_as_iterator_alias_in_stmts(transformed, ident.sym.as_ref())
            || binding_declared_as_iterator_alias_in_stmts(tail, ident.sym.as_ref())
    })
}

fn binding_declared_as_iterator_alias_in_stmts(stmts: &[Stmt], name: &str) -> bool {
    stmts.iter().any(|stmt| {
        let Stmt::Decl(Decl::Var(var_decl)) = stmt else {
            return false;
        };

        var_decl.decls.iter().any(|decl| {
            collect_pattern_binding_names(&decl.name)
                .into_iter()
                .any(|binding| binding == name)
                && decl.init.as_ref().is_some_and(|init| {
                    let Expr::Call(call) = unwrap_transparent_expr(init) else {
                        return false;
                    };
                    let Callee::Expr(callee_expr) = &call.callee else {
                        return false;
                    };
                    let Expr::Member(member) = unwrap_transparent_expr(callee_expr) else {
                        return false;
                    };

                    match &member.prop {
                        MemberProp::Ident(prop) => {
                            matches!(prop.sym.as_ref(), "values" | "entries" | "keys")
                        }
                        MemberProp::Computed(computed) => match &*computed.expr {
                            Expr::Lit(Lit::Str(str_lit)) => matches!(
                                str_lit.value.to_string_lossy().as_ref(),
                                "values" | "entries" | "keys"
                            ),
                            _ => false,
                        },
                        MemberProp::PrivateName(_) => false,
                    }
                })
        })
    })
}

fn collect_iterator_aliases(
    stmt: &Stmt,
    source_aliases: &HashSet<String>,
    aliases: &mut HashSet<String>,
) {
    let Stmt::Decl(Decl::Var(var_decl)) = stmt else {
        return;
    };

    for decl in &var_decl.decls {
        let Some(init) = &decl.init else {
            continue;
        };
        let Expr::Call(call) = unwrap_transparent_expr(init) else {
            continue;
        };
        let Callee::Expr(callee_expr) = &call.callee else {
            continue;
        };
        let Expr::Member(member) = unwrap_transparent_expr(callee_expr) else {
            continue;
        };
        let Expr::Ident(object) = unwrap_transparent_expr(member.obj.as_ref()) else {
            continue;
        };
        if !source_aliases.contains(object.sym.as_ref()) {
            continue;
        }
        let method_is_iterator = match &member.prop {
            MemberProp::Ident(prop) => matches!(prop.sym.as_ref(), "values" | "entries" | "keys"),
            MemberProp::Computed(computed) => match &*computed.expr {
                Expr::Lit(Lit::Str(str_lit)) => {
                    matches!(
                        str_lit.value.to_string_lossy().as_ref(),
                        "values" | "entries" | "keys"
                    )
                }
                _ => false,
            },
            MemberProp::PrivateName(_) => false,
        };
        if !method_is_iterator {
            continue;
        }

        for alias in collect_pattern_binding_names(&decl.name) {
            aliases.insert(alias);
        }
    }
}

fn stmt_spreads_iterator_alias(stmt: &Stmt, aliases: &HashSet<String>) -> bool {
    struct Finder<'a> {
        aliases: &'a HashSet<String>,
        found: bool,
    }

    impl Visit for Finder<'_> {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_array_lit(&mut self, array: &swc_ecma_ast::ArrayLit) {
            if array.elems.iter().flatten().any(|element| {
                if element.spread.is_none() {
                    return false;
                }
                let Expr::Ident(ident) = unwrap_transparent_expr(&element.expr) else {
                    return false;
                };
                self.aliases.contains(ident.sym.as_ref())
            }) {
                self.found = true;
                return;
            }

            array.visit_children_with(self);
        }

        fn visit_call_expr(&mut self, call: &CallExpr) {
            if call.args.iter().any(|arg| {
                if arg.spread.is_none() {
                    return false;
                }
                let Expr::Ident(ident) = unwrap_transparent_expr(&arg.expr) else {
                    return false;
                };
                self.aliases.contains(ident.sym.as_ref())
            }) {
                self.found = true;
                return;
            }

            call.visit_children_with(self);
        }

        fn visit_opt_call(&mut self, call: &swc_ecma_ast::OptCall) {
            if call.args.iter().any(|arg| {
                if arg.spread.is_none() {
                    return false;
                }
                let Expr::Ident(ident) = unwrap_transparent_expr(&arg.expr) else {
                    return false;
                };
                self.aliases.contains(ident.sym.as_ref())
            }) {
                self.found = true;
                return;
            }

            call.visit_children_with(self);
        }
    }

    let mut finder = Finder {
        aliases,
        found: false,
    };
    stmt.visit_with(&mut finder);
    finder.found
}

fn collect_array_receiver_aliases(
    stmt: &Stmt,
    source_aliases: &HashSet<String>,
    aliases: &mut HashSet<String>,
) {
    if let Stmt::Decl(Decl::Var(var_decl)) = stmt {
        for decl in &var_decl.decls {
            let Some(init) = &decl.init else {
                continue;
            };
            let Expr::Array(array_lit) = unwrap_transparent_expr(init) else {
                continue;
            };
            let array_uses_alias = array_lit.elems.iter().flatten().any(|element| {
                if element.spread.is_some() {
                    return false;
                }
                let Expr::Ident(ident) = unwrap_transparent_expr(&element.expr) else {
                    return false;
                };
                source_aliases.contains(ident.sym.as_ref())
            });
            if !array_uses_alias {
                continue;
            }

            for alias in collect_pattern_binding_names(&decl.name) {
                aliases.insert(alias);
            }
        }
    }
}

fn stmt_uses_alias_as_array_receiver_call(stmt: &Stmt, aliases: &HashSet<String>) -> bool {
    struct Finder<'a> {
        aliases: &'a HashSet<String>,
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
            let Callee::Expr(callee_expr) = &call.callee else {
                call.visit_children_with(self);
                return;
            };
            let Expr::Member(member) = unwrap_transparent_expr(callee_expr) else {
                call.visit_children_with(self);
                return;
            };
            let Expr::Ident(object) = unwrap_transparent_expr(&member.obj) else {
                call.visit_children_with(self);
                return;
            };
            if !self.aliases.contains(object.sym.as_ref()) {
                call.visit_children_with(self);
                return;
            }

            let method_name = match &member.prop {
                MemberProp::Ident(prop) => prop.sym.to_string(),
                MemberProp::Computed(computed) => match &*computed.expr {
                    Expr::Lit(Lit::Str(str_lit)) => str_lit.value.to_string_lossy().to_string(),
                    _ => {
                        call.visit_children_with(self);
                        return;
                    }
                },
                MemberProp::PrivateName(_) => {
                    call.visit_children_with(self);
                    return;
                }
            };
            if matches!(
                method_name.as_str(),
                "map"
                    | "filter"
                    | "forEach"
                    | "reduce"
                    | "reduceRight"
                    | "find"
                    | "findIndex"
                    | "some"
                    | "every"
                    | "flatMap"
            ) {
                self.found = true;
                return;
            }

            call.visit_children_with(self);
        }
    }

    let mut finder = Finder {
        aliases,
        found: false,
    };
    stmt.visit_with(&mut finder);
    finder.found
}

fn collect_binding_aliases_from_stmt(stmt: &Stmt, name: &str, aliases: &mut HashSet<String>) {
    if let Stmt::Decl(Decl::Var(var_decl)) = stmt {
        for decl in &var_decl.decls {
            let Some(init) = &decl.init else {
                continue;
            };
            if expr_derives_from_binding(init, name) {
                for alias in collect_pattern_binding_names(&decl.name) {
                    aliases.insert(alias);
                }
            }
        }
    }

    struct AssignmentAliasCollector<'a> {
        name: &'a str,
        aliases: &'a mut HashSet<String>,
    }

    impl Visit for AssignmentAliasCollector<'_> {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_assign_expr(&mut self, assign: &AssignExpr) {
            if let Some(ident) = assign.left.as_ident() {
                if expr_derives_from_binding(&assign.right, self.name) {
                    self.aliases.insert(ident.id.sym.to_string());
                }
            }
            assign.visit_children_with(self);
        }
    }

    let mut collector = AssignmentAliasCollector { name, aliases };
    stmt.visit_with(&mut collector);
}

fn expr_derives_from_binding(expr: &Expr, name: &str) -> bool {
    match unwrap_transparent_expr(expr) {
        Expr::Member(member) => member_root_is_binding(member, name),
        Expr::Call(call) => {
            let Callee::Expr(callee_expr) = &call.callee else {
                return false;
            };
            let Expr::Member(member) = unwrap_transparent_expr(callee_expr) else {
                return false;
            };
            if !member_call_may_return_alias(member) {
                return false;
            }
            member_root_is_binding(member, name)
        }
        Expr::OptChain(opt_chain) => match &*opt_chain.base {
            OptChainBase::Member(member) => member_root_is_binding(member, name),
            OptChainBase::Call(call) => {
                let Expr::Member(member) = unwrap_transparent_expr(&call.callee) else {
                    return false;
                };
                if !member_call_may_return_alias(member) {
                    return false;
                }
                member_root_is_binding(member, name)
            }
        },
        _ => false,
    }
}

fn member_call_may_return_alias(member: &MemberExpr) -> bool {
    let method_name = match &member.prop {
        MemberProp::Ident(prop) => prop.sym.to_string(),
        MemberProp::Computed(computed) => match &*computed.expr {
            Expr::Lit(Lit::Str(str_lit)) => str_lit.value.to_string_lossy().to_string(),
            _ => return false,
        },
        MemberProp::PrivateName(_) => return false,
    };

    matches!(method_name.as_str(), "at" | "concat" | "slice")
}

fn stmt_calls_with_alias_argument(stmt: &Stmt, aliases: &HashSet<String>) -> bool {
    struct Finder<'a> {
        aliases: &'a HashSet<String>,
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
            if call_may_mutate_arguments(call)
                && call
                    .args
                    .iter()
                    .filter(|arg| arg.spread.is_none())
                    .any(|arg| expr_is_alias(arg.expr.as_ref(), self.aliases))
            {
                self.found = true;
                return;
            }
            call.visit_children_with(self);
        }

        fn visit_opt_call(&mut self, call: &swc_ecma_ast::OptCall) {
            if opt_call_may_mutate_arguments(call)
                && call
                    .args
                    .iter()
                    .filter(|arg| arg.spread.is_none())
                    .any(|arg| expr_is_alias(arg.expr.as_ref(), self.aliases))
            {
                self.found = true;
                return;
            }
            call.visit_children_with(self);
        }
    }

    let mut finder = Finder {
        aliases,
        found: false,
    };
    stmt.visit_with(&mut finder);
    finder.found
}

fn stmt_calls_identifier_with_alias_argument(stmt: &Stmt, aliases: &HashSet<String>) -> bool {
    struct Finder<'a> {
        aliases: &'a HashSet<String>,
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
            let Callee::Expr(callee_expr) = &call.callee else {
                call.visit_children_with(self);
                return;
            };
            let Expr::Ident(callee) = unwrap_transparent_expr(callee_expr) else {
                call.visit_children_with(self);
                return;
            };
            if is_hook_name(callee.sym.as_ref())
                || matches!(callee.sym.as_ref(), "String" | "Number" | "Boolean")
            {
                call.visit_children_with(self);
                return;
            }
            if call
                .args
                .iter()
                .filter(|arg| arg.spread.is_none())
                .any(|arg| expr_is_alias(arg.expr.as_ref(), self.aliases))
            {
                self.found = true;
                return;
            }
            call.visit_children_with(self);
        }

        fn visit_opt_call(&mut self, call: &swc_ecma_ast::OptCall) {
            let Expr::Ident(callee) = unwrap_transparent_expr(&call.callee) else {
                call.visit_children_with(self);
                return;
            };
            if is_hook_name(callee.sym.as_ref())
                || matches!(callee.sym.as_ref(), "String" | "Number" | "Boolean")
            {
                call.visit_children_with(self);
                return;
            }
            if call
                .args
                .iter()
                .filter(|arg| arg.spread.is_none())
                .any(|arg| expr_is_alias(arg.expr.as_ref(), self.aliases))
            {
                self.found = true;
                return;
            }
            call.visit_children_with(self);
        }
    }

    let mut finder = Finder {
        aliases,
        found: false,
    };
    stmt.visit_with(&mut finder);
    finder.found
}

fn stmt_freezes_alias_via_create_element(stmt: &Stmt, aliases: &HashSet<String>) -> bool {
    struct Finder<'a> {
        aliases: &'a HashSet<String>,
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
            if call_freezes_alias_via_create_element(call, self.aliases) {
                self.found = true;
                return;
            }
            call.visit_children_with(self);
        }
    }

    let mut finder = Finder {
        aliases,
        found: false,
    };
    stmt.visit_with(&mut finder);
    finder.found
}

fn call_freezes_alias_via_create_element(call: &CallExpr, aliases: &HashSet<String>) -> bool {
    if !is_react_create_element_call(call) {
        return false;
    }

    let Some(props_arg) = call.args.get(1) else {
        return false;
    };
    if props_arg.spread.is_some() {
        return false;
    }

    expr_is_alias(props_arg.expr.as_ref(), aliases)
}

fn is_react_create_element_call(call: &CallExpr) -> bool {
    let Callee::Expr(callee_expr) = &call.callee else {
        return false;
    };

    match unwrap_transparent_expr(callee_expr) {
        Expr::Ident(ident) => ident.sym == "createElement",
        Expr::Member(member) => {
            matches!(&*member.obj, Expr::Ident(object) if object.sym == "React")
                && matches!(&member.prop, MemberProp::Ident(property) if property.sym == "createElement")
        }
        _ => false,
    }
}

fn stmt_calls_mutating_member_on_alias(stmt: &Stmt, aliases: &HashSet<String>) -> bool {
    struct Finder<'a> {
        aliases: &'a HashSet<String>,
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
            if !call_is_known_mutating_member_call(call) {
                call.visit_children_with(self);
                return;
            }

            let Callee::Expr(callee_expr) = &call.callee else {
                call.visit_children_with(self);
                return;
            };
            let Expr::Member(member) = unwrap_transparent_expr(callee_expr) else {
                call.visit_children_with(self);
                return;
            };
            if self
                .aliases
                .iter()
                .any(|alias| member_root_is_binding(member, alias.as_str()))
            {
                self.found = true;
                return;
            }
            call.visit_children_with(self);
        }

        fn visit_opt_call(&mut self, call: &swc_ecma_ast::OptCall) {
            if !opt_call_is_known_mutating_member_call(call) {
                call.visit_children_with(self);
                return;
            }

            let Expr::Member(member) = unwrap_transparent_expr(&call.callee) else {
                call.visit_children_with(self);
                return;
            };
            if self
                .aliases
                .iter()
                .any(|alias| member_root_is_binding(member, alias.as_str()))
            {
                self.found = true;
                return;
            }
            call.visit_children_with(self);
        }
    }

    let mut finder = Finder {
        aliases,
        found: false,
    };
    stmt.visit_with(&mut finder);
    finder.found
}

fn stmt_assigns_member_of_alias(stmt: &Stmt, aliases: &HashSet<String>) -> bool {
    struct Finder<'a> {
        aliases: &'a HashSet<String>,
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
            if self
                .aliases
                .iter()
                .any(|alias| assign_target_is_member_of_binding(&assign.left, alias.as_str()))
            {
                self.found = true;
                return;
            }
            assign.visit_children_with(self);
        }

        fn visit_update_expr(&mut self, update: &swc_ecma_ast::UpdateExpr) {
            let Expr::Member(member) = unwrap_transparent_expr(&update.arg) else {
                update.visit_children_with(self);
                return;
            };
            if self
                .aliases
                .iter()
                .any(|alias| member_root_is_binding(member, alias.as_str()))
            {
                self.found = true;
                return;
            }
            update.visit_children_with(self);
        }
    }

    let mut finder = Finder {
        aliases,
        found: false,
    };
    stmt.visit_with(&mut finder);
    finder.found
}

fn call_may_mutate_arguments(call: &CallExpr) -> bool {
    let Callee::Expr(callee_expr) = &call.callee else {
        return true;
    };
    let Expr::Ident(callee) = unwrap_transparent_expr(callee_expr) else {
        return true;
    };
    !is_hook_name(callee.sym.as_ref())
        && !matches!(callee.sym.as_ref(), "String" | "Number" | "Boolean")
}

fn opt_call_may_mutate_arguments(call: &swc_ecma_ast::OptCall) -> bool {
    let Expr::Ident(callee) = unwrap_transparent_expr(&call.callee) else {
        return true;
    };
    !is_hook_name(callee.sym.as_ref())
        && !matches!(callee.sym.as_ref(), "String" | "Number" | "Boolean")
}

fn opt_call_is_known_mutating_member_call(call: &swc_ecma_ast::OptCall) -> bool {
    let Expr::Member(member) = unwrap_transparent_expr(&call.callee) else {
        return false;
    };

    match &member.prop {
        MemberProp::Ident(prop) => matches!(
            prop.sym.as_ref(),
            "copyWithin"
                | "fill"
                | "pop"
                | "push"
                | "reverse"
                | "set"
                | "shift"
                | "sort"
                | "splice"
                | "unshift"
        ),
        MemberProp::Computed(_) => true,
        MemberProp::PrivateName(_) => true,
    }
}

fn expr_is_alias(expr: &Expr, aliases: &HashSet<String>) -> bool {
    match unwrap_transparent_expr(expr) {
        Expr::Ident(ident) => aliases.contains(ident.sym.as_ref()),
        Expr::Member(member) => aliases
            .iter()
            .any(|alias| member_root_is_binding(member, alias.as_str())),
        _ => false,
    }
}

fn unwrap_transparent_expr(mut expr: &Expr) -> &Expr {
    loop {
        match expr {
            Expr::Paren(paren) => expr = &paren.expr,
            Expr::TsAs(ts_as) => expr = &ts_as.expr,
            Expr::TsTypeAssertion(type_assertion) => expr = &type_assertion.expr,
            Expr::TsNonNull(ts_non_null) => expr = &ts_non_null.expr,
            Expr::TsSatisfies(ts_satisfies) => expr = &ts_satisfies.expr,
            Expr::TsInstantiation(ts_instantiation) => expr = &ts_instantiation.expr,
            _ => return expr,
        }
    }
}

fn parenthesize_conditional_expr(expr: Box<Expr>) -> Box<Expr> {
    let needs_paren = matches!(unwrap_transparent_expr(&expr), Expr::Cond(_))
        && !matches!(&*expr, Expr::Paren(_));
    if needs_paren {
        Box::new(Expr::Paren(swc_ecma_ast::ParenExpr {
            span: DUMMY_SP,
            expr,
        }))
    } else {
        expr
    }
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
                | "set"
                | "shift"
                | "sort"
                | "splice"
                | "unshift"
        ),
        MemberProp::Computed(_) => true,
        MemberProp::PrivateName(_) => true,
    }
}

fn call_passes_binding_to_potentially_mutating_identifier(call: &CallExpr, target: &str) -> bool {
    let Callee::Expr(callee_expr) = &call.callee else {
        return false;
    };
    let Expr::Ident(callee) = unwrap_transparent_expr(callee_expr) else {
        return false;
    };
    if is_hook_name(callee.sym.as_ref())
        || matches!(callee.sym.as_ref(), "String" | "Number" | "Boolean")
    {
        return false;
    }

    let aliases = HashSet::from([target.to_string()]);
    call.args
        .iter()
        .filter(|arg| arg.spread.is_none())
        .any(|arg| expr_is_alias(arg.expr.as_ref(), &aliases))
}

fn call_is_known_mutating_member_call(call: &CallExpr) -> bool {
    let Callee::Expr(callee_expr) = &call.callee else {
        return false;
    };
    let Expr::Member(member) = &**callee_expr else {
        return false;
    };

    match &member.prop {
        MemberProp::Ident(prop) => matches!(
            prop.sym.as_ref(),
            "copyWithin"
                | "fill"
                | "pop"
                | "push"
                | "reverse"
                | "set"
                | "shift"
                | "sort"
                | "splice"
                | "unshift"
        ),
        MemberProp::Computed(_) => true,
        MemberProp::PrivateName(_) => true,
    }
}

fn expr_is_mutating_member_call(expr: &Expr) -> bool {
    let Expr::Call(call) = expr else {
        return false;
    };
    call_is_known_mutating_member_call(call)
}

fn function_expr_contains_member_write(expr: &Expr) -> bool {
    let function_expr = unwrap_transparent_expr(expr);
    if !matches!(function_expr, Expr::Arrow(_) | Expr::Fn(_)) {
        return false;
    }

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
            if let Some(swc_ecma_ast::SimpleAssignTarget::Member(member)) = assign.left.as_simple()
            {
                if !is_ref_current_member(member) {
                    self.found = true;
                    return;
                }
            }
            assign.visit_children_with(self);
        }

        fn visit_update_expr(&mut self, update: &swc_ecma_ast::UpdateExpr) {
            if let Expr::Member(member) = unwrap_transparent_expr(&update.arg) {
                if !is_ref_current_member(member) {
                    self.found = true;
                    return;
                }
            }
            update.visit_children_with(self);
        }
    }

    let mut finder = Finder::default();
    match function_expr {
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

fn function_expr_writes_ref_current(expr: &Expr) -> bool {
    let function_expr = unwrap_transparent_expr(expr);
    if !matches!(function_expr, Expr::Arrow(_) | Expr::Fn(_)) {
        return false;
    }

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
            if let Some(swc_ecma_ast::SimpleAssignTarget::Member(member)) = assign.left.as_simple()
            {
                if is_ref_current_member(member) {
                    self.found = true;
                    return;
                }
            }
            assign.visit_children_with(self);
        }

        fn visit_update_expr(&mut self, update: &swc_ecma_ast::UpdateExpr) {
            if let Expr::Member(member) = unwrap_transparent_expr(&update.arg) {
                if is_ref_current_member(member) {
                    self.found = true;
                    return;
                }
            }
            update.visit_children_with(self);
        }
    }

    let mut finder = Finder::default();
    match function_expr {
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

fn function_expr_contains_directive(expr: &Expr) -> bool {
    let function_expr = unwrap_transparent_expr(expr);
    match function_expr {
        Expr::Arrow(arrow) => {
            let swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) = &*arrow.body else {
                return false;
            };
            block
                .stmts
                .iter()
                .take_while(|stmt| directive_from_stmt(stmt).is_some())
                .next()
                .is_some()
        }
        Expr::Fn(fn_expr) => {
            let Some(body) = &fn_expr.function.body else {
                return false;
            };
            body.stmts
                .iter()
                .take_while(|stmt| directive_from_stmt(stmt).is_some())
                .next()
                .is_some()
        }
        _ => false,
    }
}

fn function_expr_contains_member_call(expr: &Expr) -> bool {
    let function_expr = unwrap_transparent_expr(expr);
    if !matches!(function_expr, Expr::Arrow(_) | Expr::Fn(_)) {
        return false;
    }

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
            if matches!(&call.callee, Callee::Expr(callee_expr) if matches!(unwrap_transparent_expr(callee_expr), Expr::Member(_)))
            {
                self.found = true;
                return;
            }
            call.visit_children_with(self);
        }
    }

    let mut finder = Finder::default();
    match function_expr {
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

fn contains_local_direct_call(stmts: &[Stmt]) -> bool {
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
                    if self.local_bindings.contains(callee.sym.as_ref()) {
                        self.found = true;
                        return;
                    }
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

fn has_create_element_result_assignment_with_post_calls(stmts: &[Stmt], name: &str) -> bool {
    let assignment_index = stmts.iter().position(|stmt| {
        let Stmt::Expr(expr_stmt) = stmt else {
            return false;
        };
        let Expr::Assign(assign) = unwrap_transparent_expr(&expr_stmt.expr) else {
            return false;
        };
        if assign.op != op!("=") {
            return false;
        }
        let Some(target) = assign.left.as_ident() else {
            return false;
        };
        if target.id.sym != name {
            return false;
        }
        let Expr::Call(call) = unwrap_transparent_expr(&assign.right) else {
            return false;
        };

        is_react_create_element_call(call)
    });

    let Some(assignment_index) = assignment_index else {
        return false;
    };

    stmts[assignment_index + 1..].iter().any(|stmt| {
        let Stmt::Expr(expr_stmt) = stmt else {
            return false;
        };
        !matches!(unwrap_transparent_expr(&expr_stmt.expr), Expr::Assign(_))
            && matches!(
                unwrap_transparent_expr(&expr_stmt.expr),
                Expr::Call(_) | Expr::OptChain(_)
            )
    })
}

fn prelude_has_top_level_rest_pattern_assignment(stmts: &[Stmt]) -> bool {
    stmts.iter().any(|stmt| {
        let Stmt::Expr(expr_stmt) = stmt else {
            return false;
        };
        let Expr::Assign(assign) = unwrap_transparent_expr(&expr_stmt.expr) else {
            return false;
        };
        if assign.op != op!("=") {
            return false;
        }
        let AssignTarget::Pat(assign_pat) = &assign.left else {
            return false;
        };
        pattern_has_top_level_rest(&Pat::from(assign_pat.clone()))
    })
}

fn prelude_contains_control_flow_stmt(stmts: &[Stmt]) -> bool {
    stmts.iter().any(|stmt| {
        matches!(
            stmt,
            Stmt::If(if_stmt) if if_stmt.alt.is_none()
        ) || matches!(stmt, |Stmt::Switch(_)| Stmt::Try(_)
            | Stmt::For(_)
            | Stmt::ForIn(_)
            | Stmt::ForOf(_)
            | Stmt::While(_)
            | Stmt::DoWhile(_)
            | Stmt::Labeled(_))
    })
}

fn prelude_contains_if_with_else(stmts: &[Stmt]) -> bool {
    stmts
        .iter()
        .any(|stmt| matches!(stmt, Stmt::If(if_stmt) if if_stmt.alt.is_some()))
}

fn split_direct_call_prelude_from_compute_stmts(
    compute_stmts: &mut Vec<Stmt>,
    temp_name: &str,
    known_bindings: &HashMap<String, bool>,
) -> Vec<Stmt> {
    if compute_stmts.len() < 2 {
        return Vec::new();
    }

    let Some(split_index) = compute_stmts
        .iter()
        .rposition(|stmt| stmt_assigns_binding(stmt, temp_name))
    else {
        return Vec::new();
    };
    if split_index == 0 {
        return Vec::new();
    }

    let mut prelude_bindings = HashSet::new();
    for stmt in &compute_stmts[..split_index] {
        collect_stmt_bindings(stmt, &mut prelude_bindings);
    }
    let force_split_for_prelude_call_arg = stmt_assigns_nonlocal_call_with_prelude_arg(
        &compute_stmts[split_index],
        temp_name,
        &prelude_bindings,
    );
    let has_local_member_mutation_prelude = contains_mutating_member_call_on_local_binding(
        &compute_stmts[..split_index],
        &prelude_bindings,
    );
    let has_local_direct_call_prelude = contains_local_direct_call(&compute_stmts[..split_index]);
    let has_local_conditional_test_prelude = prelude_has_conditional_test_on_local_binding(
        &compute_stmts[..split_index],
        &prelude_bindings,
    );
    if has_local_member_mutation_prelude && has_local_conditional_test_prelude {
        return Vec::new();
    }
    if !contains_direct_call(&compute_stmts[..split_index])
        && !has_local_direct_call_prelude
        && !has_local_member_mutation_prelude
        && !stmts_contain_pattern_assignment(&compute_stmts[..split_index])
    {
        return Vec::new();
    }
    if contains_allowlisted_mutating_direct_call(&compute_stmts[..split_index]) {
        return Vec::new();
    }
    if !force_split_for_prelude_call_arg
        && prelude_passes_local_binding_to_call(&compute_stmts[..split_index], &prelude_bindings)
    {
        return Vec::new();
    }
    if prelude_var_call_initializer_uses_prelude_binding(
        &compute_stmts[..split_index],
        &prelude_bindings,
    ) {
        return Vec::new();
    }
    if prelude_declares_local_function_capturing_local_binding(&compute_stmts[..split_index]) {
        return Vec::new();
    }
    if stmt_rhs_uses_binding_as_call_callee(&compute_stmts[split_index], &prelude_bindings) {
        return Vec::new();
    }
    let prelude_references_known_bindings =
        stmts_reference_known_bindings(&compute_stmts[..split_index], known_bindings);
    let prelude_has_memoizable_call_binding =
        prelude_contains_memoizable_call_binding(&compute_stmts[..split_index], &prelude_bindings);
    if !prelude_references_known_bindings && !prelude_has_memoizable_call_binding {
        return Vec::new();
    }
    let mut split_local_bindings = HashSet::new();
    for stmt in compute_stmts.iter() {
        collect_stmt_bindings_including_nested_blocks(stmt, &mut split_local_bindings);
    }
    if collect_dependencies_from_stmts(compute_stmts, known_bindings, &split_local_bindings)
        .is_empty()
    {
        return Vec::new();
    }
    if let Some(rhs_expr) = stmt_assigned_rhs(&compute_stmts[split_index], temp_name) {
        if !matches!(unwrap_transparent_expr(rhs_expr), Expr::Ident(_)) {
            let rhs_referenced_bindings = collect_ident_references_in_expr(rhs_expr);
            if rhs_referenced_bindings.iter().any(|name| {
                prelude_bindings.contains(name)
                    && prelude_mutates_binding_for_non_ident_rhs_split_guard(
                        &compute_stmts[..split_index],
                        name,
                    )
            }) {
                return Vec::new();
            }
        }
    }
    if let Some(source_name) = stmt_assigned_identifier_rhs(&compute_stmts[split_index], temp_name)
    {
        let source_declared_in_prelude =
            binding_declared_in_stmts(&compute_stmts[..split_index], source_name.as_str());
        if !source_declared_in_prelude
            && prelude_mutates_result_source(&compute_stmts[..split_index], &source_name)
        {
            return Vec::new();
        }
    }

    let trailing = compute_stmts.split_off(split_index);
    let prelude = std::mem::take(compute_stmts);
    *compute_stmts = trailing;
    prelude
}

fn build_memoized_block_multi_values(
    cache_ident: &Ident,
    slot_start: u32,
    deps: &[ReactiveDependency],
    value_bindings: &[Ident],
    mut compute_stmts: Vec<Stmt>,
) -> Vec<Stmt> {
    if value_bindings.is_empty() {
        return Vec::new();
    }

    let test = if deps.is_empty() {
        Box::new(Expr::Bin(swc_ecma_ast::BinExpr {
            span: DUMMY_SP,
            op: op!("==="),
            left: make_cache_index_expr(cache_ident, slot_start),
            right: memo_cache_sentinel_expr(),
        }))
    } else {
        let mut current = Box::new(Expr::Bin(swc_ecma_ast::BinExpr {
            span: DUMMY_SP,
            op: op!("!=="),
            left: make_cache_index_expr(cache_ident, slot_start),
            right: deps[0].expr.clone(),
        }));
        for (index, dep) in deps.iter().enumerate().skip(1) {
            current = Box::new(Expr::Bin(swc_ecma_ast::BinExpr {
                span: DUMMY_SP,
                op: op!("||"),
                left: current,
                right: Box::new(Expr::Bin(swc_ecma_ast::BinExpr {
                    span: DUMMY_SP,
                    op: op!("!=="),
                    left: make_cache_index_expr(cache_ident, slot_start + index as u32),
                    right: dep.expr.clone(),
                })),
            }));
        }
        current
    };

    for (index, dep) in deps.iter().enumerate() {
        compute_stmts.push(assign_stmt(
            AssignTarget::from(make_cache_member(cache_ident, slot_start + index as u32)),
            dep.expr.clone(),
        ));
    }

    let value_slot_start = slot_start + deps.len() as u32;
    for (index, binding) in value_bindings.iter().enumerate() {
        compute_stmts.push(assign_stmt(
            AssignTarget::from(make_cache_member(
                cache_ident,
                value_slot_start + index as u32,
            )),
            Box::new(Expr::Ident(binding.clone())),
        ));
    }

    let else_stmts = value_bindings
        .iter()
        .enumerate()
        .map(|(index, binding)| {
            assign_stmt(
                AssignTarget::from(binding.clone()),
                make_cache_index_expr(cache_ident, value_slot_start + index as u32),
            )
        })
        .collect::<Vec<_>>();

    vec![Stmt::If(IfStmt {
        span: DUMMY_SP,
        test,
        cons: Box::new(Stmt::Block(BlockStmt {
            span: DUMMY_SP,
            ctxt: Default::default(),
            stmts: compute_stmts,
        })),
        alt: Some(Box::new(Stmt::Block(BlockStmt {
            span: DUMMY_SP,
            ctxt: Default::default(),
            stmts: else_stmts,
        }))),
    })]
}

fn stmt_assigned_rhs<'a>(stmt: &'a Stmt, target_name: &str) -> Option<&'a Expr> {
    match stmt {
        Stmt::Expr(expr_stmt) => {
            let Expr::Assign(assign) = unwrap_transparent_expr(&expr_stmt.expr) else {
                return None;
            };
            let target = assign.left.as_ident()?;
            if target.id.sym != target_name {
                return None;
            }
            Some(&assign.right)
        }
        Stmt::Decl(Decl::Var(var_decl)) => {
            let [decl] = var_decl.decls.as_slice() else {
                return None;
            };
            let Pat::Ident(binding) = &decl.name else {
                return None;
            };
            if binding.id.sym != target_name {
                return None;
            }
            decl.init.as_deref()
        }
        _ => None,
    }
}

fn collect_ident_references_in_expr(expr: &Expr) -> HashSet<String> {
    #[derive(Default)]
    struct Collector {
        names: HashSet<String>,
    }

    impl Visit for Collector {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_ident(&mut self, ident: &Ident) {
            self.names.insert(ident.sym.to_string());
        }
    }

    let mut collector = Collector::default();
    expr.visit_with(&mut collector);
    collector.names
}

fn stmts_contain_pattern_assignment(stmts: &[Stmt]) -> bool {
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
            if matches!(assign.left, AssignTarget::Pat(_)) {
                self.found = true;
                return;
            }
            assign.visit_children_with(self);
        }
    }

    let mut finder = Finder { found: false };
    for stmt in stmts {
        stmt.visit_with(&mut finder);
        if finder.found {
            return true;
        }
    }
    false
}

fn collect_assigned_bindings_in_order_from_stmts(stmts: &[Stmt]) -> Vec<String> {
    let mut out = Vec::new();
    let mut seen = HashSet::new();
    for stmt in stmts {
        collect_assigned_bindings_in_order_from_stmt(stmt, &mut out, &mut seen);
    }
    out
}

fn collect_assigned_bindings_in_order_from_stmt(
    stmt: &Stmt,
    out: &mut Vec<String>,
    seen: &mut HashSet<String>,
) {
    match stmt {
        Stmt::Expr(expr_stmt) => {
            let Expr::Assign(assign) = unwrap_transparent_expr(&expr_stmt.expr) else {
                return;
            };
            if let Some(ident) = assign.left.as_ident() {
                let name = ident.id.sym.to_string();
                if seen.insert(name.clone()) {
                    out.push(name);
                }
                return;
            }
            let AssignTarget::Pat(assign_pat) = &assign.left else {
                return;
            };
            let pat = Pat::from(assign_pat.clone());
            for name in collect_pattern_binding_names_in_order(&pat) {
                if seen.insert(name.clone()) {
                    out.push(name);
                }
            }
        }
        Stmt::Decl(Decl::Var(var_decl)) => {
            for decl in &var_decl.decls {
                if decl.init.is_none() {
                    continue;
                }
                for name in collect_pattern_binding_names_in_order(&decl.name) {
                    if seen.insert(name.clone()) {
                        out.push(name);
                    }
                }
            }
        }
        Stmt::Block(block) => {
            for nested in &block.stmts {
                collect_assigned_bindings_in_order_from_stmt(nested, out, seen);
            }
        }
        Stmt::Labeled(labeled) => {
            collect_assigned_bindings_in_order_from_stmt(&labeled.body, out, seen);
        }
        Stmt::If(if_stmt) => {
            collect_assigned_bindings_in_order_from_stmt(&if_stmt.cons, out, seen);
            if let Some(alt) = &if_stmt.alt {
                collect_assigned_bindings_in_order_from_stmt(alt, out, seen);
            }
        }
        Stmt::Switch(switch_stmt) => {
            for case in &switch_stmt.cases {
                for cons in &case.cons {
                    collect_assigned_bindings_in_order_from_stmt(cons, out, seen);
                }
            }
        }
        Stmt::Try(try_stmt) => {
            for nested in &try_stmt.block.stmts {
                collect_assigned_bindings_in_order_from_stmt(nested, out, seen);
            }
            if let Some(handler) = &try_stmt.handler {
                for nested in &handler.body.stmts {
                    collect_assigned_bindings_in_order_from_stmt(nested, out, seen);
                }
            }
            if let Some(finalizer) = &try_stmt.finalizer {
                for nested in &finalizer.stmts {
                    collect_assigned_bindings_in_order_from_stmt(nested, out, seen);
                }
            }
        }
        _ => {}
    }
}

fn collect_pattern_binding_names_in_order(pat: &Pat) -> Vec<String> {
    fn collect(pat: &Pat, out: &mut Vec<String>) {
        match pat {
            Pat::Ident(binding) => out.push(binding.id.sym.to_string()),
            Pat::Array(array) => {
                for element in array.elems.iter().flatten() {
                    collect(element, out);
                }
            }
            Pat::Object(object) => {
                for prop in &object.props {
                    match prop {
                        ObjectPatProp::Assign(assign) => out.push(assign.key.id.sym.to_string()),
                        ObjectPatProp::KeyValue(key_value) => collect(&key_value.value, out),
                        ObjectPatProp::Rest(rest) => collect(&rest.arg, out),
                    }
                }
            }
            Pat::Assign(assign) => collect(&assign.left, out),
            Pat::Rest(rest) => collect(&rest.arg, out),
            Pat::Invalid(_) | Pat::Expr(_) => {}
        }
    }

    let mut out = Vec::new();
    collect(pat, &mut out);
    out
}

fn extract_trailing_post_compute_side_effect_stmts(
    compute_stmts: &mut Vec<Stmt>,
    result_name: &str,
) -> Vec<Stmt> {
    if contains_return_stmt_in_stmts(compute_stmts) {
        return Vec::new();
    }

    let Some(last_assignment_index) = compute_stmts
        .iter()
        .rposition(|stmt| stmt_assigns_binding(stmt, result_name))
    else {
        return Vec::new();
    };

    let mut post_assignment_bindings = HashSet::new();
    for stmt in &compute_stmts[last_assignment_index + 1..] {
        collect_stmt_bindings_including_nested_blocks(stmt, &mut post_assignment_bindings);
    }

    let mut suffix_start = compute_stmts.len();
    while suffix_start > last_assignment_index + 1 {
        let idx = suffix_start - 1;
        if stmt_is_trailing_post_compute_side_effect(&compute_stmts[idx], result_name)
            && !stmt_references_bindings(&compute_stmts[idx], &post_assignment_bindings)
        {
            suffix_start -= 1;
        } else {
            break;
        }
    }

    if suffix_start == compute_stmts.len() {
        return Vec::new();
    }

    compute_stmts.split_off(suffix_start)
}

fn stmt_references_bindings(stmt: &Stmt, bindings: &HashSet<String>) -> bool {
    if bindings.is_empty() {
        return false;
    }

    struct Finder<'a> {
        bindings: &'a HashSet<String>,
        found: bool,
    }

    impl Visit for Finder<'_> {
        fn visit_ident(&mut self, ident: &Ident) {
            if self.bindings.contains(ident.sym.as_ref()) {
                self.found = true;
            }
        }
    }

    let mut finder = Finder {
        bindings,
        found: false,
    };
    stmt.visit_with(&mut finder);
    finder.found
}

fn infer_prelude_result_binding(prelude_stmts: &[Stmt], compute_stmts: &[Stmt]) -> Option<Ident> {
    let mut assigned = HashSet::new();
    collect_assigned_bindings_in_stmts(prelude_stmts, &mut assigned);
    if assigned.is_empty() {
        return None;
    }

    let mut declared = HashSet::new();
    for stmt in prelude_stmts {
        collect_stmt_bindings_including_nested_blocks(stmt, &mut declared);
    }

    let mut used_in_compute = assigned
        .into_iter()
        .filter(|name| !declared.contains(name))
        .filter(|name| {
            compute_stmts
                .iter()
                .any(|stmt| count_binding_references_in_stmt(stmt, name.as_str()) > 0)
        })
        .collect::<Vec<_>>();

    if used_in_compute.len() != 1 {
        return None;
    }

    Some(Ident::new_no_ctxt(
        used_in_compute.swap_remove(0).into(),
        DUMMY_SP,
    ))
}

fn collect_assigned_bindings_in_stmts(stmts: &[Stmt], out: &mut HashSet<String>) {
    for stmt in stmts {
        collect_assigned_bindings_in_stmt(stmt, out);
    }
}

fn collect_assigned_bindings_in_stmt(stmt: &Stmt, out: &mut HashSet<String>) {
    match stmt {
        Stmt::Expr(expr_stmt) => {
            out.extend(collect_assigned_bindings_in_expr(&expr_stmt.expr));
        }
        Stmt::Decl(Decl::Var(var_decl)) => {
            for decl in &var_decl.decls {
                if decl.init.is_some() {
                    out.extend(collect_pattern_binding_names(&decl.name));
                }
            }
        }
        Stmt::Block(block) => {
            collect_assigned_bindings_in_stmts(&block.stmts, out);
        }
        Stmt::Labeled(labeled) => {
            collect_assigned_bindings_in_stmt(&labeled.body, out);
        }
        Stmt::If(if_stmt) => {
            collect_assigned_bindings_in_stmt(&if_stmt.cons, out);
            if let Some(alt) = &if_stmt.alt {
                collect_assigned_bindings_in_stmt(alt, out);
            }
        }
        Stmt::While(while_stmt) => {
            collect_assigned_bindings_in_stmt(&while_stmt.body, out);
        }
        Stmt::DoWhile(do_while_stmt) => {
            collect_assigned_bindings_in_stmt(&do_while_stmt.body, out);
        }
        Stmt::For(for_stmt) => {
            if let Some(init) = &for_stmt.init {
                match init {
                    swc_ecma_ast::VarDeclOrExpr::VarDecl(var_decl) => {
                        for decl in &var_decl.decls {
                            if decl.init.is_some() {
                                out.extend(collect_pattern_binding_names(&decl.name));
                            }
                        }
                    }
                    swc_ecma_ast::VarDeclOrExpr::Expr(expr) => {
                        out.extend(collect_assigned_bindings_in_expr(expr));
                    }
                }
            }
            collect_assigned_bindings_in_stmt(&for_stmt.body, out);
        }
        Stmt::ForIn(for_in_stmt) => {
            if let swc_ecma_ast::ForHead::VarDecl(var_decl) = &for_in_stmt.left {
                for decl in &var_decl.decls {
                    out.extend(collect_pattern_binding_names(&decl.name));
                }
            }
            collect_assigned_bindings_in_stmt(&for_in_stmt.body, out);
        }
        Stmt::ForOf(for_of_stmt) => {
            if let swc_ecma_ast::ForHead::VarDecl(var_decl) = &for_of_stmt.left {
                for decl in &var_decl.decls {
                    out.extend(collect_pattern_binding_names(&decl.name));
                }
            }
            collect_assigned_bindings_in_stmt(&for_of_stmt.body, out);
        }
        Stmt::Switch(switch_stmt) => {
            for case in &switch_stmt.cases {
                collect_assigned_bindings_in_stmts(&case.cons, out);
            }
        }
        Stmt::Try(try_stmt) => {
            collect_assigned_bindings_in_stmts(&try_stmt.block.stmts, out);
            if let Some(handler) = &try_stmt.handler {
                collect_assigned_bindings_in_stmts(&handler.body.stmts, out);
            }
            if let Some(finalizer) = &try_stmt.finalizer {
                collect_assigned_bindings_in_stmts(&finalizer.stmts, out);
            }
        }
        _ => {}
    }
}

fn stmt_is_trailing_post_compute_side_effect(stmt: &Stmt, result_name: &str) -> bool {
    if count_binding_references_in_stmt(stmt, result_name) > 0 {
        return false;
    }

    match stmt {
        Stmt::Expr(expr_stmt) => matches!(
            unwrap_transparent_expr(&expr_stmt.expr),
            Expr::Call(_) | Expr::OptChain(_)
        ),
        Stmt::If(if_stmt) => {
            stmt_is_trailing_post_compute_side_effect(&if_stmt.cons, result_name)
                && if_stmt
                    .alt
                    .as_deref()
                    .map(|alt| stmt_is_trailing_post_compute_side_effect(alt, result_name))
                    .unwrap_or(true)
        }
        Stmt::Block(block) => {
            !block.stmts.is_empty()
                && block
                    .stmts
                    .iter()
                    .all(|nested| stmt_is_trailing_post_compute_side_effect(nested, result_name))
        }
        Stmt::Labeled(labeled) => {
            stmt_is_trailing_post_compute_side_effect(&labeled.body, result_name)
        }
        _ => false,
    }
}

fn prelude_contains_memoizable_call_binding(
    stmts: &[Stmt],
    local_bindings: &HashSet<String>,
) -> bool {
    let mut found = false;

    for stmt in stmts {
        let Stmt::Decl(Decl::Var(var_decl)) = stmt else {
            return false;
        };
        if var_decl.kind != VarDeclKind::Const {
            return false;
        }
        for decl in &var_decl.decls {
            if !matches!(&decl.name, Pat::Ident(_)) {
                return false;
            }
            let Some(init) = &decl.init else {
                return false;
            };
            let Expr::Call(call) = unwrap_transparent_expr(init) else {
                return false;
            };
            if call_has_hook_callee(call) {
                return false;
            }
            let Callee::Expr(callee_expr) = &call.callee else {
                return false;
            };
            let Expr::Ident(callee) = unwrap_transparent_expr(callee_expr) else {
                return false;
            };
            if local_bindings.contains(callee.sym.as_ref())
                || is_hook_name(callee.sym.as_ref())
                || matches!(callee.sym.as_ref(), "String" | "Number" | "Boolean")
            {
                return false;
            }

            if !call.args.iter().all(|arg| {
                arg.spread.is_none()
                    && matches!(
                        unwrap_transparent_expr(&arg.expr),
                        Expr::Ident(_) | Expr::Lit(_) | Expr::Member(_)
                    )
            }) {
                return false;
            }
            if call.args.is_empty() {
                return false;
            }

            found = true;
        }
    }

    found
}

fn prelude_var_call_initializer_uses_prelude_binding(
    stmts: &[Stmt],
    local_bindings: &HashSet<String>,
) -> bool {
    for stmt in stmts {
        let Stmt::Decl(Decl::Var(var_decl)) = stmt else {
            continue;
        };
        for decl in &var_decl.decls {
            let Some(init) = &decl.init else {
                continue;
            };
            let Expr::Call(call) = unwrap_transparent_expr(init) else {
                continue;
            };
            if call.args.iter().any(|arg| {
                arg.spread.is_none() && expr_references_bindings(&arg.expr, local_bindings)
            }) {
                return true;
            }
        }
    }

    false
}

fn stmt_declares_const_ident_alias(stmt: &Stmt) -> bool {
    let Stmt::Decl(Decl::Var(var_decl)) = stmt else {
        return false;
    };
    if var_decl.kind != VarDeclKind::Const {
        return false;
    }
    if var_decl.decls.is_empty() {
        return false;
    }

    var_decl.decls.iter().all(|decl| {
        matches!(&decl.name, Pat::Ident(_))
            && matches!(
                decl.init.as_deref(),
                Some(expr) if matches!(unwrap_transparent_expr(expr), Expr::Ident(_))
            )
    })
}

fn stmt_declares_non_ident_pattern(stmt: &Stmt) -> bool {
    let Stmt::Decl(Decl::Var(var_decl)) = stmt else {
        return false;
    };

    var_decl
        .decls
        .iter()
        .any(|decl| !matches!(decl.name, Pat::Ident(_)))
}

fn prelude_passes_local_binding_to_call(stmts: &[Stmt], local_bindings: &HashSet<String>) -> bool {
    if local_bindings.is_empty() {
        return false;
    }

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
            if let Callee::Expr(callee_expr) = &call.callee {
                if let Expr::Ident(callee) = unwrap_transparent_expr(callee_expr) {
                    if self.local_bindings.contains(callee.sym.as_ref())
                        || is_hook_name(callee.sym.as_ref())
                        || matches!(callee.sym.as_ref(), "String" | "Number" | "Boolean")
                    {
                        call.visit_children_with(self);
                        return;
                    }

                    if call
                        .args
                        .iter()
                        .filter(|arg| arg.spread.is_none())
                        .any(|arg| expr_references_bindings(&arg.expr, self.local_bindings))
                    {
                        self.found = true;
                        return;
                    }
                }
            }

            call.visit_children_with(self);
        }
    }

    let mut finder = Finder {
        local_bindings,
        found: false,
    };

    for stmt in stmts {
        if let Stmt::Expr(expr_stmt) = stmt {
            if let Expr::Call(call) = unwrap_transparent_expr(&expr_stmt.expr) {
                if let Callee::Expr(callee_expr) = &call.callee {
                    callee_expr.visit_with(&mut finder);
                }
                for arg in &call.args {
                    if arg.spread.is_none() {
                        arg.expr.visit_with(&mut finder);
                    }
                }
                if finder.found {
                    return true;
                }
                continue;
            }
        }

        stmt.visit_with(&mut finder);
        if finder.found {
            return true;
        }
    }

    false
}

fn prelude_declares_local_function_capturing_local_binding(stmts: &[Stmt]) -> bool {
    let mut local_bindings = HashSet::new();
    for stmt in stmts {
        collect_stmt_bindings(stmt, &mut local_bindings);
    }
    if local_bindings.is_empty() {
        return false;
    }

    for stmt in stmts {
        let Stmt::Decl(Decl::Var(var_decl)) = stmt else {
            continue;
        };
        for decl in &var_decl.decls {
            let Some(init) = &decl.init else {
                continue;
            };
            if !matches!(unwrap_transparent_expr(init), Expr::Arrow(_) | Expr::Fn(_)) {
                continue;
            }
            if function_expr_may_capture_outer_bindings(init, &local_bindings) {
                let Pat::Ident(binding) = &decl.name else {
                    return true;
                };
                if !binding_only_called_directly_in_stmts(stmts, binding.id.sym.as_ref()) {
                    return true;
                }
            }
        }
    }

    false
}

fn binding_only_called_directly_in_stmts(stmts: &[Stmt], name: &str) -> bool {
    #[derive(Default)]
    struct Finder<'a> {
        name: &'a str,
        called: bool,
        invalid: bool,
    }

    impl Visit for Finder<'_> {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_var_decl(&mut self, var_decl: &VarDecl) {
            for decl in &var_decl.decls {
                if let Some(init) = &decl.init {
                    init.visit_with(self);
                }
            }
        }

        fn visit_call_expr(&mut self, call: &CallExpr) {
            if let Callee::Expr(callee_expr) = &call.callee {
                if let Expr::Ident(callee) = unwrap_transparent_expr(callee_expr) {
                    if callee.sym == self.name {
                        self.called = true;
                        for arg in &call.args {
                            arg.visit_with(self);
                            if self.invalid {
                                return;
                            }
                        }
                        return;
                    }
                }
            }

            call.visit_children_with(self);
        }

        fn visit_opt_call(&mut self, call: &swc_ecma_ast::OptCall) {
            if let Expr::Ident(callee) = unwrap_transparent_expr(&call.callee) {
                if callee.sym == self.name {
                    self.called = true;
                    for arg in &call.args {
                        arg.visit_with(self);
                        if self.invalid {
                            return;
                        }
                    }
                    return;
                }
            }

            call.visit_children_with(self);
        }

        fn visit_ident(&mut self, ident: &Ident) {
            if ident.sym == self.name {
                self.invalid = true;
            }
        }
    }

    let mut finder = Finder {
        name,
        called: false,
        invalid: false,
    };
    for stmt in stmts {
        stmt.visit_with(&mut finder);
        if finder.invalid {
            return false;
        }
    }

    finder.called
}

fn extract_post_memo_switch_stmts(
    compute_stmts: &mut Vec<Stmt>,
    result_name: &str,
) -> (Vec<Stmt>, Option<String>) {
    if compute_stmts.len() < 2 {
        return (Vec::new(), None);
    }

    let Some(Stmt::Expr(expr_stmt)) = compute_stmts.last() else {
        return (Vec::new(), None);
    };
    let Expr::Assign(assign) = &*expr_stmt.expr else {
        return (Vec::new(), None);
    };
    if assign.op != op!("=") {
        return (Vec::new(), None);
    }
    let Some(target) = assign.left.as_ident() else {
        return (Vec::new(), None);
    };
    if target.id.sym != result_name {
        return (Vec::new(), None);
    }
    let Expr::Ident(result_source) = &*assign.right else {
        return (Vec::new(), None);
    };
    let result_source_name = result_source.sym.to_string();

    let mut extracted = Vec::new();
    let mut kept = Vec::with_capacity(compute_stmts.len());
    let Some(mut last_stmt) = compute_stmts.pop() else {
        return (Vec::new(), None);
    };

    for stmt in std::mem::take(compute_stmts) {
        if is_extractable_post_memo_switch_stmt(&stmt, result_source_name.as_str()) {
            extracted.push(stmt);
        } else {
            kept.push(stmt);
        }
    }

    if extracted.is_empty() {
        kept.push(last_stmt);
        *compute_stmts = kept;
        return (Vec::new(), Some(result_source_name));
    }

    rewrite_result_source_assignment_from_local_init(
        &mut kept,
        &mut last_stmt,
        result_source_name.as_str(),
    );
    kept.push(last_stmt);
    *compute_stmts = kept;
    (extracted, Some(result_source_name))
}

fn is_extractable_post_memo_switch_stmt(stmt: &Stmt, result_source: &str) -> bool {
    let is_switch_stmt = match stmt {
        Stmt::Switch(_) => true,
        Stmt::Labeled(labeled) => matches!(&*labeled.body, Stmt::Switch(_)),
        _ => false,
    };
    if !is_switch_stmt {
        return false;
    }

    !has_assignment_to_binding(std::slice::from_ref(stmt), result_source)
        && !binding_mutated_via_member_call_after(std::slice::from_ref(stmt), result_source)
        && !binding_mutated_via_member_assignment_after(std::slice::from_ref(stmt), result_source)
}

fn rewrite_result_source_assignment_from_local_init(
    stmts: &mut Vec<Stmt>,
    last_stmt: &mut Stmt,
    source_name: &str,
) {
    let Stmt::Expr(expr_stmt) = last_stmt else {
        return;
    };
    let Expr::Assign(assign) = &mut *expr_stmt.expr else {
        return;
    };
    let Expr::Ident(right_ident) = &*assign.right else {
        return;
    };
    if right_ident.sym != source_name {
        return;
    }

    let mut source_decl_index = None;
    let mut source_init = None;
    for (index, stmt) in stmts.iter().enumerate() {
        let Stmt::Decl(Decl::Var(var_decl)) = stmt else {
            continue;
        };
        let [decl] = var_decl.decls.as_slice() else {
            continue;
        };
        let Pat::Ident(binding) = &decl.name else {
            continue;
        };
        if binding.id.sym != source_name {
            continue;
        }
        let Some(init) = &decl.init else {
            return;
        };
        if binding_referenced_in_stmts(&stmts[index + 1..], source_name)
            || has_assignment_to_binding(&stmts[index + 1..], source_name)
            || binding_mutated_via_member_call_after(&stmts[index + 1..], source_name)
            || binding_mutated_via_member_assignment_after(&stmts[index + 1..], source_name)
        {
            return;
        }
        source_decl_index = Some(index);
        source_init = Some(init.clone());
        break;
    }

    let (Some(index), Some(init)) = (source_decl_index, source_init) else {
        return;
    };
    stmts.remove(index);
    assign.right = init;
}

fn stmts_reference_known_bindings(stmts: &[Stmt], known_bindings: &HashMap<String, bool>) -> bool {
    let mut local_bindings = HashSet::new();
    for stmt in stmts {
        collect_stmt_bindings(stmt, &mut local_bindings);
    }

    struct Finder<'a> {
        known_bindings: &'a HashMap<String, bool>,
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

        fn visit_ident(&mut self, ident: &Ident) {
            let name = ident.sym.as_ref();
            if !self.local_bindings.contains(name) && self.known_bindings.contains_key(name) {
                self.found = true;
            }
        }
    }

    let mut finder = Finder {
        known_bindings,
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

fn stmt_assigns_binding(stmt: &Stmt, name: &str) -> bool {
    let Stmt::Expr(expr_stmt) = stmt else {
        return false;
    };
    let Expr::Assign(assign) = &*expr_stmt.expr else {
        return false;
    };
    if assign.op != op!("=") {
        return false;
    }

    let Some(ident) = assign.left.as_ident() else {
        return false;
    };
    ident.id.sym == name
}

fn stmt_assigned_identifier_rhs(stmt: &Stmt, name: &str) -> Option<String> {
    let Stmt::Expr(expr_stmt) = stmt else {
        return None;
    };
    let Expr::Assign(assign) = &*expr_stmt.expr else {
        return None;
    };
    if assign.op != op!("=") {
        return None;
    }

    let ident = assign.left.as_ident()?;
    if ident.id.sym != name {
        return None;
    }

    let Expr::Ident(source) = &*assign.right else {
        return None;
    };

    Some(source.sym.to_string())
}

fn stmt_rhs_uses_binding_as_call_callee(stmt: &Stmt, bindings: &HashSet<String>) -> bool {
    if bindings.is_empty() {
        return false;
    }

    let Stmt::Expr(expr_stmt) = stmt else {
        return false;
    };
    let Expr::Assign(assign) = &*expr_stmt.expr else {
        return false;
    };
    if assign.op != op!("=") {
        return false;
    }

    struct Finder<'a> {
        bindings: &'a HashSet<String>,
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
            if let Callee::Expr(callee_expr) = &call.callee {
                if let Expr::Ident(callee) = unwrap_transparent_expr(callee_expr) {
                    if self.bindings.contains(callee.sym.as_ref()) {
                        self.found = true;
                        return;
                    }
                }
            }
            call.visit_children_with(self);
        }
    }

    let mut finder = Finder {
        bindings,
        found: false,
    };
    assign.right.visit_with(&mut finder);
    finder.found
}

fn stmt_assigns_nonlocal_call_with_prelude_arg(
    stmt: &Stmt,
    name: &str,
    prelude_bindings: &HashSet<String>,
) -> bool {
    let Stmt::Expr(expr_stmt) = stmt else {
        return false;
    };
    let Expr::Assign(assign) = &*expr_stmt.expr else {
        return false;
    };
    if assign.op != op!("=") {
        return false;
    }
    let Some(target) = assign.left.as_ident() else {
        return false;
    };
    if target.id.sym != name {
        return false;
    }

    let Expr::Call(call) = unwrap_transparent_expr(&assign.right) else {
        return false;
    };
    let Callee::Expr(callee_expr) = &call.callee else {
        return false;
    };
    let Expr::Ident(callee) = unwrap_transparent_expr(callee_expr) else {
        return false;
    };
    if prelude_bindings.contains(callee.sym.as_ref())
        || is_hook_name(callee.sym.as_ref())
        || matches!(callee.sym.as_ref(), "String" | "Number" | "Boolean")
    {
        return false;
    }

    call.args
        .iter()
        .filter(|arg| arg.spread.is_none())
        .any(|arg| {
            matches!(
                unwrap_transparent_expr(&arg.expr),
                Expr::Ident(ident) if prelude_bindings.contains(ident.sym.as_ref())
            )
        })
}

fn single_terminal_call_matches_outer_deps(
    stmts: &[Stmt],
    temp_name: &str,
    deps: &[ReactiveDependency],
    known_bindings: &HashMap<String, bool>,
) -> bool {
    let [stmt] = stmts else {
        return false;
    };
    let Stmt::Expr(expr_stmt) = stmt else {
        return false;
    };
    let Expr::Assign(assign) = &*expr_stmt.expr else {
        return false;
    };
    if assign.op != op!("=") {
        return false;
    }
    let Some(target) = assign.left.as_ident() else {
        return false;
    };
    if target.id.sym != temp_name {
        return false;
    }
    let Expr::Call(call) = unwrap_transparent_expr(&assign.right) else {
        return false;
    };
    if !call.args.iter().all(|arg| {
        arg.spread.is_none()
            && matches!(
                unwrap_transparent_expr(&arg.expr),
                Expr::Ident(_) | Expr::Lit(_) | Expr::Member(_)
            )
    }) {
        return false;
    }

    let local_bindings = HashSet::new();
    let mut call_deps =
        collect_dependencies_from_expr(&Expr::Call(call.clone()), known_bindings, &local_bindings);
    call_deps = reduce_dependencies(call_deps);

    let mut outer_dep_keys = deps.iter().map(|dep| dep.key.clone()).collect::<Vec<_>>();
    outer_dep_keys.sort();
    outer_dep_keys.dedup();

    let mut call_dep_keys = call_deps.into_iter().map(|dep| dep.key).collect::<Vec<_>>();
    call_dep_keys.sort();
    call_dep_keys.dedup();

    outer_dep_keys == call_dep_keys
}

fn should_precompute_terminal_call_arg_expr(return_expr: &Expr) -> bool {
    let Expr::Call(call) = unwrap_transparent_expr(return_expr) else {
        return false;
    };
    let Callee::Expr(callee_expr) = &call.callee else {
        return false;
    };
    let Expr::Ident(callee) = unwrap_transparent_expr(callee_expr) else {
        return false;
    };
    if is_hook_name(callee.sym.as_ref())
        || matches!(callee.sym.as_ref(), "String" | "Number" | "Boolean")
    {
        return false;
    }
    let [arg] = call.args.as_slice() else {
        return false;
    };
    if arg.spread.is_some() {
        return false;
    }
    let arg_expr = unwrap_transparent_expr(&arg.expr);
    !matches!(
        arg_expr,
        Expr::Ident(_)
            | Expr::Lit(_)
            | Expr::Member(_)
            | Expr::Array(_)
            | Expr::Object(_)
            | Expr::Call(_)
            | Expr::OptChain(_)
            | Expr::JSXElement(_)
            | Expr::JSXFragment(_)
    ) && !expr_has_observable_side_effect(arg_expr)
}

fn rewrite_terminal_call_assignment_with_precomputed_arg(
    stmts: &mut Vec<Stmt>,
    result_name: &str,
    arg_temp: &Ident,
) {
    let Some(last_stmt) = stmts.pop() else {
        return;
    };
    let mut rewritten_last = last_stmt.clone();
    let Stmt::Expr(expr_stmt) = &mut rewritten_last else {
        stmts.push(last_stmt);
        return;
    };
    let Expr::Assign(assign) = &mut *expr_stmt.expr else {
        stmts.push(last_stmt);
        return;
    };
    if assign.op != op!("=") {
        stmts.push(last_stmt);
        return;
    }
    let Some(target) = assign.left.as_ident() else {
        stmts.push(last_stmt);
        return;
    };
    if target.id.sym != result_name {
        stmts.push(last_stmt);
        return;
    }
    let Expr::Call(call) = unwrap_transparent_expr(&assign.right).clone() else {
        stmts.push(last_stmt);
        return;
    };
    let mut call = call;
    let [arg] = call.args.as_mut_slice() else {
        stmts.push(last_stmt);
        return;
    };
    if arg.spread.is_some() {
        stmts.push(last_stmt);
        return;
    }
    if matches!(
        unwrap_transparent_expr(&arg.expr),
        Expr::Ident(_)
            | Expr::Lit(_)
            | Expr::Member(_)
            | Expr::Array(_)
            | Expr::Object(_)
            | Expr::Call(_)
            | Expr::OptChain(_)
            | Expr::JSXElement(_)
            | Expr::JSXFragment(_)
    ) {
        stmts.push(last_stmt);
        return;
    }
    if expr_has_observable_side_effect(&arg.expr) {
        stmts.push(last_stmt);
        return;
    }

    let precomputed_arg = arg.expr.clone();
    arg.expr = Box::new(Expr::Ident(arg_temp.clone()));
    assign.right = Box::new(Expr::Call(call));

    stmts.push(make_var_decl(
        VarDeclKind::Const,
        Pat::Ident(BindingIdent {
            id: arg_temp.clone(),
            type_ann: None,
        }),
        Some(precomputed_arg),
    ));
    stmts.push(rewritten_last);
}

fn prelude_mutates_result_source(stmts: &[Stmt], source_name: &str) -> bool {
    has_assignment_to_binding(stmts, source_name)
        || binding_mutated_via_member_call_after(stmts, source_name)
        || binding_mutated_via_member_assignment_after(stmts, source_name)
        || binding_passed_to_potentially_mutating_call_after(stmts, source_name)
        || binding_maybe_mutated_in_called_iife_after(stmts, source_name)
}

fn prelude_mutates_binding_for_non_ident_rhs_split_guard(stmts: &[Stmt], name: &str) -> bool {
    binding_captured_by_called_local_function_after(stmts, name)
        || binding_maybe_mutated_in_called_iife_after(stmts, name)
}

fn contains_allowlisted_mutating_direct_call(stmts: &[Stmt]) -> bool {
    for stmt in stmts {
        let Stmt::Expr(expr_stmt) = stmt else {
            continue;
        };
        let Expr::Call(call) = &*expr_stmt.expr else {
            continue;
        };
        let Callee::Expr(expr) = &call.callee else {
            continue;
        };
        let Expr::Ident(callee) = &**expr else {
            continue;
        };
        if matches!(
            callee.sym.as_ref(),
            "mutate" | "setProperty" | "setPropertyByKey"
        ) {
            return true;
        }
    }
    false
}

fn contains_mutating_member_call_on_local_binding(
    stmts: &[Stmt],
    local_bindings: &HashSet<String>,
) -> bool {
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
            let Callee::Expr(callee_expr) = &call.callee else {
                call.visit_children_with(self);
                return;
            };
            let Expr::Member(member) = unwrap_transparent_expr(callee_expr) else {
                call.visit_children_with(self);
                return;
            };
            let Expr::Ident(object) = unwrap_transparent_expr(&member.obj) else {
                call.visit_children_with(self);
                return;
            };
            if self.local_bindings.contains(object.sym.as_ref())
                && call_mutates_binding(call, object.sym.as_ref())
            {
                self.found = true;
                return;
            }

            call.visit_children_with(self);
        }
    }

    let mut finder = Finder {
        local_bindings,
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

fn prelude_has_conditional_test_on_local_binding(
    stmts: &[Stmt],
    local_bindings: &HashSet<String>,
) -> bool {
    struct Finder<'a> {
        local_bindings: &'a HashSet<String>,
        found: bool,
        in_test: bool,
    }

    impl Visit for Finder<'_> {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_if_stmt(&mut self, if_stmt: &IfStmt) {
            let prev_in_test = self.in_test;
            self.in_test = true;
            if_stmt.test.visit_with(self);
            self.in_test = prev_in_test;
            if self.found {
                return;
            }
            if_stmt.cons.visit_with(self);
            if self.found {
                return;
            }
            if let Some(alt) = &if_stmt.alt {
                alt.visit_with(self);
            }
        }

        fn visit_for_stmt(&mut self, for_stmt: &swc_ecma_ast::ForStmt) {
            if let Some(test) = &for_stmt.test {
                let prev_in_test = self.in_test;
                self.in_test = true;
                test.visit_with(self);
                self.in_test = prev_in_test;
                if self.found {
                    return;
                }
            }
            for_stmt.init.visit_with(self);
            if self.found {
                return;
            }
            for_stmt.update.visit_with(self);
            if self.found {
                return;
            }
            for_stmt.body.visit_with(self);
        }

        fn visit_while_stmt(&mut self, while_stmt: &swc_ecma_ast::WhileStmt) {
            let prev_in_test = self.in_test;
            self.in_test = true;
            while_stmt.test.visit_with(self);
            self.in_test = prev_in_test;
            if self.found {
                return;
            }
            while_stmt.body.visit_with(self);
        }

        fn visit_do_while_stmt(&mut self, do_while_stmt: &swc_ecma_ast::DoWhileStmt) {
            do_while_stmt.body.visit_with(self);
            if self.found {
                return;
            }
            let prev_in_test = self.in_test;
            self.in_test = true;
            do_while_stmt.test.visit_with(self);
            self.in_test = prev_in_test;
        }

        fn visit_cond_expr(&mut self, cond_expr: &swc_ecma_ast::CondExpr) {
            let prev_in_test = self.in_test;
            self.in_test = true;
            cond_expr.test.visit_with(self);
            self.in_test = prev_in_test;
            if self.found {
                return;
            }
            cond_expr.cons.visit_with(self);
            if self.found {
                return;
            }
            cond_expr.alt.visit_with(self);
        }

        fn visit_ident(&mut self, ident: &Ident) {
            if self.in_test && self.local_bindings.contains(ident.sym.as_ref()) {
                self.found = true;
            }
        }
    }

    let mut finder = Finder {
        local_bindings,
        found: false,
        in_test: false,
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

fn binding_only_used_in_terminal_return_literal(stmts: &[Stmt], binding: &str) -> bool {
    let Some((last, preceding)) = stmts.split_last() else {
        return false;
    };
    let Stmt::Return(return_stmt) = last else {
        return false;
    };
    let Some(return_arg) = &return_stmt.arg else {
        return false;
    };

    if !matches!(
        unwrap_transparent_expr(return_arg),
        Expr::Array(_) | Expr::Object(_)
    ) {
        return false;
    }

    if count_binding_references_in_expr(return_arg, binding) == 0 {
        return false;
    }

    let prior_refs: usize = preceding
        .iter()
        .map(|stmt| count_binding_references_in_stmt(stmt, binding))
        .sum();
    prior_refs == 0
}

fn binding_only_used_in_terminal_return_call(stmts: &[Stmt], binding: &str) -> bool {
    let Some((last, preceding)) = stmts.split_last() else {
        return false;
    };
    let Stmt::Return(return_stmt) = last else {
        return false;
    };
    let Some(return_arg) = &return_stmt.arg else {
        return false;
    };

    let Expr::Call(_) = unwrap_transparent_expr(return_arg) else {
        return false;
    };
    if count_binding_references_in_expr(return_arg, binding) == 0 {
        return false;
    }

    let prior_refs: usize = preceding
        .iter()
        .map(|stmt| count_binding_references_in_stmt(stmt, binding))
        .sum();
    prior_refs == 0
}

fn terminal_return_is_array_literal(stmts: &[Stmt]) -> bool {
    let Some(last) = stmts.last() else {
        return false;
    };
    let Stmt::Return(return_stmt) = last else {
        return false;
    };
    let Some(return_arg) = &return_stmt.arg else {
        return false;
    };

    if matches!(unwrap_transparent_expr(return_arg), Expr::Array(_)) {
        return true;
    }

    matches!(
        &**return_arg,
        Expr::TsConstAssertion(const_assert)
            if matches!(unwrap_transparent_expr(&const_assert.expr), Expr::Array(_))
    )
}

fn terminal_return_depends_only_on_binding(
    stmts: &[Stmt],
    binding: &str,
    known_bindings: &HashMap<String, bool>,
) -> bool {
    let Some(Stmt::Return(return_stmt)) = stmts.last() else {
        return false;
    };
    let Some(return_arg) = &return_stmt.arg else {
        return false;
    };

    let local = HashSet::new();
    let deps = collect_dependencies_from_expr(return_arg, known_bindings, &local);
    !deps.is_empty()
        && deps
            .iter()
            .all(|dep| dep.key == binding || dep.key.starts_with(&format!("{binding}.")))
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

fn should_hoist_try_prelude_stmt(stmt: &Stmt) -> bool {
    let Stmt::Try(try_stmt) = stmt else {
        return false;
    };
    if try_stmt.finalizer.is_some() {
        return false;
    }
    if contains_return_stmt_in_stmts(&try_stmt.block.stmts) {
        return false;
    }

    let mut bindings = HashSet::new();
    collect_stmt_bindings(stmt, &mut bindings);
    bindings.is_empty()
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

fn is_hook_call_expr_stmt(stmt: &Stmt) -> bool {
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

    let Some(root_expr) = jsx_root_expr_mut(return_expr) else {
        return;
    };
    let Expr::JSXElement(element) = root_expr else {
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

#[allow(clippy::too_many_arguments)]
fn hoist_stable_jsx_fragment_children(
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
    let Some(root_expr) = jsx_root_expr_mut(return_expr) else {
        return;
    };
    let Expr::JSXFragment(fragment) = root_expr else {
        return;
    };

    let local_bindings = HashSet::new();
    let child_deps = fragment
        .children
        .iter()
        .map(|child| match child {
            swc_ecma_ast::JSXElementChild::JSXElement(element) => {
                Some(collect_dependencies_from_expr(
                    &Expr::JSXElement(element.clone()),
                    known_bindings,
                    &local_bindings,
                ))
            }
            _ => None,
        })
        .collect::<Vec<_>>();
    let has_unstable_child = child_deps
        .iter()
        .any(|deps| deps.as_ref().is_some_and(|deps| !deps.is_empty()));
    let jsx_element_child_count = child_deps.iter().filter(|deps| deps.is_some()).count();
    let first_jsx_child_is_component = fragment.children.iter().find_map(|child| match child {
        swc_ecma_ast::JSXElementChild::JSXElement(element) => {
            Some(jsx_element_uses_component_tag(element))
        }
        _ => None,
    });
    let hoist_one_stable_child_when_all_stable = !has_unstable_child
        && jsx_element_child_count > 1
        && first_jsx_child_is_component == Some(true);
    if !has_unstable_child && !hoist_one_stable_child_when_all_stable {
        return;
    }

    let mut hoisted_one_stable_child = false;
    for (index, child) in fragment.children.iter_mut().enumerate() {
        let swc_ecma_ast::JSXElementChild::JSXElement(element) = child else {
            continue;
        };
        let Some(deps) = child_deps.get(index).and_then(Clone::clone) else {
            continue;
        };
        if has_unstable_child && !deps.is_empty() {
            continue;
        }
        if !has_unstable_child && hoisted_one_stable_child {
            continue;
        }

        let value_temp = fresh_temp_ident(next_temp, reserved);
        let hoisted_expr = if has_unstable_child {
            Expr::JSXElement(element.clone())
        } else {
            Expr::Paren(swc_ecma_ast::ParenExpr {
                span: DUMMY_SP,
                expr: Box::new(Expr::JSXElement(element.clone())),
            })
        };
        let mut compute_stmts = vec![assign_stmt(
            AssignTarget::from(value_temp.clone()),
            Box::new(hoisted_expr),
        )];
        strip_runtime_call_type_args_in_stmts(&mut compute_stmts);

        transformed.extend(build_memoized_block(
            cache_ident,
            *next_slot,
            &deps,
            &value_temp,
            compute_stmts,
            true,
        ));
        *next_slot += deps.len() as u32 + 1;
        *memo_blocks += 1;
        *memo_values += 1;
        known_bindings.insert(value_temp.sym.to_string(), true);

        *child = swc_ecma_ast::JSXElementChild::JSXExprContainer(swc_ecma_ast::JSXExprContainer {
            span: DUMMY_SP,
            expr: swc_ecma_ast::JSXExpr::Expr(Box::new(Expr::Ident(value_temp))),
        });
        if !has_unstable_child {
            hoisted_one_stable_child = true;
        }
    }
}

fn jsx_element_uses_component_tag(element: &swc_ecma_ast::JSXElement) -> bool {
    match &element.opening.name {
        swc_ecma_ast::JSXElementName::Ident(ident) => is_component_jsx_identifier(ident),
        swc_ecma_ast::JSXElementName::JSXMemberExpr(_) => true,
        swc_ecma_ast::JSXElementName::JSXNamespacedName(_) => false,
    }
}

#[allow(clippy::too_many_arguments)]
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
    blocked_bindings: &HashSet<String>,
) {
    if jsx_root_expr_mut(return_expr).is_none() {
        return;
    }

    hoist_root_jsx_tag_alias_if_needed(return_expr, transformed, known_bindings, reserved);
    hoist_stable_jsx_fragment_children(
        return_expr,
        transformed,
        known_bindings,
        reserved,
        next_temp,
        cache_ident,
        next_slot,
        memo_blocks,
        memo_values,
    );

    struct Hoister<'a> {
        transformed: &'a mut Vec<Stmt>,
        known_bindings: &'a mut HashMap<String, bool>,
        reserved: &'a mut HashSet<String>,
        next_temp: &'a mut u32,
        cache_ident: &'a Ident,
        next_slot: &'a mut u32,
        memo_blocks: &'a mut u32,
        memo_values: &'a mut u32,
        blocked_bindings: &'a HashSet<String>,
        inside_call_arg: bool,
        inside_template_literal: bool,
        inside_jsx_attr_value: bool,
    }

    impl VisitMut for Hoister<'_> {
        fn visit_mut_arrow_expr(&mut self, _: &mut ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_mut_function(&mut self, _: &mut Function) {
            // Skip nested functions.
        }

        fn visit_mut_call_expr(&mut self, call: &mut CallExpr) {
            call.callee.visit_mut_with(self);

            let prev_inside_call_arg = self.inside_call_arg;
            self.inside_call_arg = true;
            for arg in &mut call.args {
                arg.visit_mut_with(self);
            }
            self.inside_call_arg = prev_inside_call_arg;
        }

        fn visit_mut_tpl(&mut self, tpl: &mut swc_ecma_ast::Tpl) {
            let prev_inside_template_literal = self.inside_template_literal;
            self.inside_template_literal = true;
            tpl.visit_mut_children_with(self);
            self.inside_template_literal = prev_inside_template_literal;
        }

        fn visit_mut_jsx_attr(&mut self, attr: &mut swc_ecma_ast::JSXAttr) {
            if let Some(value) = &mut attr.value {
                let prev_inside_jsx_attr_value = self.inside_jsx_attr_value;
                self.inside_jsx_attr_value = true;
                value.visit_mut_with(self);
                self.inside_jsx_attr_value = prev_inside_jsx_attr_value;
            }
        }

        fn visit_mut_expr(&mut self, expr: &mut Expr) {
            expr.visit_mut_children_with(self);

            let value_expr = match expr {
                Expr::Call(call) => {
                    if self.inside_template_literal {
                        return;
                    }
                    if call.args.iter().any(|arg| arg.spread.is_some()) {
                        return;
                    }
                    Some(Expr::Call(call.clone()))
                }
                Expr::Array(array) => {
                    if self.inside_call_arg {
                        return;
                    }
                    if self.inside_jsx_attr_value
                        && !should_hoist_single_dependency_array_expr(array)
                    {
                        return;
                    }
                    if array.elems.iter().all(|element| {
                        let Some(element) = element else {
                            return true;
                        };
                        element.spread.is_none() && is_static_value_expr(&element.expr)
                    }) {
                        return;
                    }
                    Some(Expr::Array(array.clone()))
                }
                Expr::Bin(bin) if binary_has_negative_numeric_rhs(bin) => {
                    Some(Expr::Bin(bin.clone()))
                }
                _ => None,
            };
            let Some(value_expr) = value_expr else {
                return;
            };
            if expr_references_bindings(&value_expr, self.blocked_bindings) {
                return;
            }

            let value_temp = fresh_temp_ident(self.next_temp, self.reserved);
            let is_string_call = matches!(
                &value_expr,
                Expr::Call(call)
                    if matches!(
                        &call.callee,
                        Callee::Expr(callee_expr)
                            if matches!(&**callee_expr, Expr::Ident(callee) if callee.sym == "String")
                    )
            );
            if is_string_call {
                self.transformed.push(make_var_decl(
                    VarDeclKind::Const,
                    Pat::Ident(BindingIdent {
                        id: value_temp.clone(),
                        type_ann: None,
                    }),
                    Some(Box::new(value_expr.clone())),
                ));
            } else if matches!(&value_expr, Expr::Call(call) if should_memoize_jsx_hoisted_call(call))
                || matches!(&value_expr, Expr::Array(_))
            {
                let local_bindings = HashSet::new();
                let deps = collect_dependencies_from_expr(
                    &value_expr,
                    self.known_bindings,
                    &local_bindings,
                );
                let mut compute_stmts = vec![assign_stmt(
                    AssignTarget::from(value_temp.clone()),
                    Box::new(value_expr.clone()),
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
                    Some(Box::new(value_expr.clone())),
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
        blocked_bindings,
        inside_call_arg: false,
        inside_template_literal: false,
        inside_jsx_attr_value: false,
    };
    if let Some(root_expr) = jsx_root_expr_mut(return_expr) {
        root_expr.visit_mut_with(&mut hoister);
    }
}

fn should_hoist_single_dependency_array_expr(array: &swc_ecma_ast::ArrayLit) -> bool {
    let [Some(elem)] = array.elems.as_slice() else {
        return false;
    };
    if elem.spread.is_some() {
        return false;
    }
    matches!(
        unwrap_transparent_expr(&elem.expr),
        Expr::Ident(_) | Expr::Member(_)
    )
}

fn expr_references_bindings(expr: &Expr, bindings: &HashSet<String>) -> bool {
    if bindings.is_empty() {
        return false;
    }

    struct Finder<'a> {
        bindings: &'a HashSet<String>,
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
            if self.bindings.contains(ident.sym.as_ref()) {
                self.found = true;
            }
        }
    }

    let mut finder = Finder {
        bindings,
        found: false,
    };
    expr.visit_with(&mut finder);
    finder.found
}

fn binary_has_negative_numeric_rhs(bin: &swc_ecma_ast::BinExpr) -> bool {
    match unwrap_transparent_expr(&bin.right) {
        Expr::Unary(unary) => {
            matches!(unary.op, op!(unary, "-"))
                && matches!(unwrap_transparent_expr(&unary.arg), Expr::Lit(Lit::Num(_)))
        }
        Expr::Lit(Lit::Num(num)) => num.value.is_sign_negative(),
        _ => false,
    }
}

fn jsx_root_expr_mut(return_expr: &mut Box<Expr>) -> Option<&mut Expr> {
    let mut current = return_expr.as_mut();
    loop {
        match current {
            Expr::Paren(paren) => current = paren.expr.as_mut(),
            Expr::TsAs(ts_as) => current = ts_as.expr.as_mut(),
            Expr::TsTypeAssertion(type_assertion) => current = type_assertion.expr.as_mut(),
            Expr::TsNonNull(ts_non_null) => current = ts_non_null.expr.as_mut(),
            Expr::TsSatisfies(ts_satisfies) => current = ts_satisfies.expr.as_mut(),
            Expr::TsInstantiation(ts_instantiation) => current = ts_instantiation.expr.as_mut(),
            Expr::JSXElement(_) | Expr::JSXFragment(_) => return Some(current),
            _ => return None,
        }
    }
}

fn rewrite_result_binding_to_assignment(stmts: &mut [Stmt], name: &str) -> bool {
    let mut preceding_bindings = HashSet::new();

    for stmt in stmts {
        let Stmt::Decl(Decl::Var(var_decl)) = stmt else {
            collect_stmt_bindings(stmt, &mut preceding_bindings);
            continue;
        };
        let [declarator] = var_decl.decls.as_slice() else {
            collect_stmt_bindings(stmt, &mut preceding_bindings);
            continue;
        };
        let Pat::Ident(binding) = &declarator.name else {
            collect_stmt_bindings(stmt, &mut preceding_bindings);
            continue;
        };
        if binding.id.sym != name {
            collect_stmt_bindings(stmt, &mut preceding_bindings);
            continue;
        }
        let Some(init) = &declarator.init else {
            collect_stmt_bindings(stmt, &mut preceding_bindings);
            continue;
        };
        if matches!(unwrap_transparent_expr(init), Expr::Arrow(_) | Expr::Fn(_))
            && function_expr_may_capture_outer_bindings(init, &preceding_bindings)
        {
            return false;
        }
        *stmt = assign_stmt(AssignTarget::from(binding.id.clone()), init.clone());
        return true;
    }
    false
}

#[derive(Clone)]
struct MutableCollectionJsxTailSplit {
    collection_binding: Ident,
    last_mutation_index: usize,
    post_binding_names: HashSet<String>,
    hoisted_child_index: usize,
    hoisted_child_expr: Box<Expr>,
    hoisted_child_deps: Vec<ReactiveDependency>,
}

#[allow(clippy::too_many_arguments)]
fn try_lower_mutable_collection_jsx_tail(
    tail: &mut Vec<Stmt>,
    return_expr: &mut Box<Expr>,
    transformed: &mut Vec<Stmt>,
    known_bindings: &mut HashMap<String, bool>,
    cache_ident: &Ident,
    reserved: &mut HashSet<String>,
    next_temp: &mut u32,
    next_slot: &mut u32,
    memo_blocks: &mut u32,
    memo_values: &mut u32,
) -> bool {
    let Some(split) = find_mutable_collection_jsx_tail_split(tail, return_expr, known_bindings)
    else {
        return false;
    };

    let mut collection_compute_stmts = tail[..=split.last_mutation_index].to_vec();
    if !rewrite_result_binding_to_assignment(
        &mut collection_compute_stmts,
        split.collection_binding.sym.as_ref(),
    ) {
        return false;
    }
    prune_empty_stmts(&mut collection_compute_stmts);
    prune_noop_identifier_exprs(&mut collection_compute_stmts);
    prune_unused_underscore_jsx_decls(&mut collection_compute_stmts);
    normalize_static_string_members_in_stmts(&mut collection_compute_stmts);
    inline_const_literal_indices_in_stmts(&mut collection_compute_stmts);
    normalize_compound_assignments_in_stmts(&mut collection_compute_stmts);
    normalize_reactive_labels(&mut collection_compute_stmts);
    normalize_if_break_blocks(&mut collection_compute_stmts);
    lower_function_decls_to_const_in_stmts(&mut collection_compute_stmts);
    flatten_hoistable_blocks_in_stmts(&mut collection_compute_stmts, reserved);
    flatten_hoistable_blocks_in_nested_functions(&mut collection_compute_stmts);
    append_for_update_assignment_result_in_stmts(&mut collection_compute_stmts);
    lower_iife_call_args_in_stmts(&mut collection_compute_stmts, reserved, next_temp);
    inline_trivial_iifes_in_stmts(&mut collection_compute_stmts);
    flatten_hoistable_blocks_in_stmts(&mut collection_compute_stmts, reserved);
    flatten_hoistable_blocks_in_nested_functions(&mut collection_compute_stmts);
    strip_runtime_call_type_args_in_stmts(&mut collection_compute_stmts);
    prune_unused_pure_var_decls(&mut collection_compute_stmts);
    prune_unused_function_like_decl_stmts(&mut collection_compute_stmts);

    let mut collection_local_bindings = HashSet::new();
    for stmt in &collection_compute_stmts {
        collect_stmt_bindings_including_nested_blocks(stmt, &mut collection_local_bindings);
    }
    let mut collection_deps = collect_dependencies_from_stmts(
        &collection_compute_stmts,
        known_bindings,
        &collection_local_bindings,
    );
    for dep in collect_called_local_function_capture_dependencies(
        &collection_compute_stmts,
        known_bindings,
    ) {
        if !collection_deps
            .iter()
            .any(|existing| existing.key == dep.key)
        {
            collection_deps.push(dep);
        }
    }
    for dep in collect_stmt_function_capture_dependencies(&collection_compute_stmts, known_bindings)
    {
        if !collection_deps
            .iter()
            .any(|existing| existing.key == dep.key)
        {
            collection_deps.push(dep);
        }
    }
    collection_deps = reduce_dependencies(collection_deps);
    collection_deps.retain(|dep| {
        dep.key != split.collection_binding.sym.as_ref()
            && !dep
                .key
                .starts_with(&format!("{}.", split.collection_binding.sym.as_ref()))
    });

    let collection_value_slot = *next_slot + collection_deps.len() as u32;
    transformed.extend(build_memoized_block(
        cache_ident,
        *next_slot,
        &collection_deps,
        &split.collection_binding,
        collection_compute_stmts,
        true,
    ));
    *next_slot = collection_value_slot + 1;
    *memo_blocks += 1;
    *memo_values += 1;
    known_bindings.insert(
        split.collection_binding.sym.to_string(),
        collection_deps.is_empty(),
    );

    let mut post_stmts = tail[split.last_mutation_index + 1..].to_vec();
    strip_runtime_call_type_args_in_stmts(&mut post_stmts);
    transformed.extend(post_stmts);
    for binding in &split.post_binding_names {
        known_bindings.insert(binding.clone(), false);
    }

    let child_temp = fresh_temp_ident(next_temp, reserved);
    let mut child_compute_stmts = vec![assign_stmt(
        AssignTarget::from(child_temp.clone()),
        split.hoisted_child_expr.clone(),
    )];
    strip_runtime_call_type_args_in_stmts(&mut child_compute_stmts);

    let child_value_slot = *next_slot + split.hoisted_child_deps.len() as u32;
    transformed.extend(build_memoized_block(
        cache_ident,
        *next_slot,
        &split.hoisted_child_deps,
        &child_temp,
        child_compute_stmts,
        true,
    ));
    *next_slot = child_value_slot + 1;
    *memo_blocks += 1;
    *memo_values += 1;
    known_bindings.insert(
        child_temp.sym.to_string(),
        split.hoisted_child_deps.is_empty(),
    );

    let Some(root_expr) = jsx_root_expr_mut(return_expr) else {
        return false;
    };
    let Expr::JSXElement(root_element) = root_expr else {
        return false;
    };
    if split.hoisted_child_index >= root_element.children.len() {
        return false;
    }
    root_element.children[split.hoisted_child_index] =
        swc_ecma_ast::JSXElementChild::JSXExprContainer(swc_ecma_ast::JSXExprContainer {
            span: DUMMY_SP,
            expr: swc_ecma_ast::JSXExpr::Expr(Box::new(Expr::Ident(child_temp.clone()))),
        });

    let final_temp = fresh_temp_ident(next_temp, reserved);
    let final_expr = parenthesize_nested_memo_jsx_expr(return_expr.clone());
    let mut final_compute_stmts = vec![assign_stmt(
        AssignTarget::from(final_temp.clone()),
        final_expr,
    )];
    strip_runtime_call_type_args_in_stmts(&mut final_compute_stmts);

    let final_local_bindings = HashSet::new();
    let mut final_deps =
        collect_dependencies_from_expr(return_expr, known_bindings, &final_local_bindings);
    final_deps = reduce_dependencies(final_deps);

    let final_value_slot = *next_slot + final_deps.len() as u32;
    transformed.extend(build_memoized_block(
        cache_ident,
        *next_slot,
        &final_deps,
        &final_temp,
        final_compute_stmts,
        true,
    ));
    *next_slot = final_value_slot + 1;
    *memo_blocks += 1;
    *memo_values += 1;

    transformed.push(Stmt::Return(swc_ecma_ast::ReturnStmt {
        span: DUMMY_SP,
        arg: Some(Box::new(Expr::Ident(final_temp))),
    }));

    tail.clear();
    true
}

fn find_mutable_collection_jsx_tail_split(
    tail: &[Stmt],
    return_expr: &Expr,
    known_bindings: &HashMap<String, bool>,
) -> Option<MutableCollectionJsxTailSplit> {
    let root_expr = unwrap_transparent_expr(return_expr);
    let Expr::JSXElement(root_element) = root_expr else {
        return None;
    };

    for (decl_index, stmt) in tail.iter().enumerate() {
        let Stmt::Decl(Decl::Var(var_decl)) = stmt else {
            continue;
        };
        if !matches!(var_decl.kind, VarDeclKind::Const | VarDeclKind::Let) {
            continue;
        }
        let [decl] = var_decl.decls.as_slice() else {
            continue;
        };
        let Pat::Ident(binding) = &decl.name else {
            continue;
        };
        let Some(init) = &decl.init else {
            continue;
        };
        if !matches!(
            unwrap_transparent_expr(init),
            Expr::Array(_) | Expr::Object(_)
        ) {
            continue;
        }
        if !expr_references_binding(return_expr, binding.id.sym.as_ref()) {
            continue;
        }
        if !binding_mutated_in_stmts(&tail[decl_index + 1..], binding.id.sym.as_ref()) {
            continue;
        }

        let Some(last_mutation_index) =
            last_statement_mutating_binding(tail, binding.id.sym.as_ref())
        else {
            continue;
        };
        if last_mutation_index <= decl_index {
            continue;
        }
        if last_mutation_index + 1 >= tail.len() {
            continue;
        }

        let trailing = &tail[last_mutation_index + 1..];
        if trailing
            .iter()
            .any(|trailing_stmt| stmt_mutates_binding(trailing_stmt, binding.id.sym.as_ref()))
        {
            continue;
        }

        let mut post_binding_names = HashSet::new();
        let mut all_const_derived = true;
        for trailing_stmt in trailing {
            let Some(post_binding) = side_effect_free_const_decl_binding_name(trailing_stmt) else {
                all_const_derived = false;
                break;
            };
            post_binding_names.insert(post_binding);
        }
        if !all_const_derived || post_binding_names.is_empty() {
            continue;
        }

        let mut dep_known_bindings = known_bindings.clone();
        for binding_name in &post_binding_names {
            dep_known_bindings.insert(binding_name.clone(), false);
        }

        let local_bindings = HashSet::new();
        let mut hoisted_child_index = None;
        let mut hoisted_child_expr = None;
        let mut hoisted_child_deps = None;
        for (child_index, child) in root_element.children.iter().enumerate() {
            let swc_ecma_ast::JSXElementChild::JSXElement(child_element) = child else {
                continue;
            };
            let candidate_expr = Expr::JSXElement(child_element.clone());
            let deps = collect_dependencies_from_expr(
                &candidate_expr,
                &dep_known_bindings,
                &local_bindings,
            );
            if deps.is_empty() {
                continue;
            }
            if !deps
                .iter()
                .all(|dep| post_binding_names.contains(dep.key.as_str()))
            {
                continue;
            }

            hoisted_child_index = Some(child_index);
            hoisted_child_expr = Some(Box::new(candidate_expr));
            hoisted_child_deps = Some(reduce_dependencies(deps));
            break;
        }
        let (Some(hoisted_child_index), Some(hoisted_child_expr), Some(hoisted_child_deps)) =
            (hoisted_child_index, hoisted_child_expr, hoisted_child_deps)
        else {
            continue;
        };

        return Some(MutableCollectionJsxTailSplit {
            collection_binding: binding.id.clone(),
            last_mutation_index,
            post_binding_names,
            hoisted_child_index,
            hoisted_child_expr,
            hoisted_child_deps,
        });
    }

    None
}

fn binding_mutated_in_stmts(stmts: &[Stmt], name: &str) -> bool {
    stmts.iter().any(|stmt| stmt_mutates_binding(stmt, name))
}

fn stmt_mutates_binding(stmt: &Stmt, name: &str) -> bool {
    has_assignment_to_binding(std::slice::from_ref(stmt), name)
        || binding_mutated_via_member_call_after(std::slice::from_ref(stmt), name)
        || binding_mutated_via_member_assignment_after(std::slice::from_ref(stmt), name)
        || binding_passed_to_potentially_mutating_call_after(std::slice::from_ref(stmt), name)
}

fn last_statement_mutating_binding(stmts: &[Stmt], name: &str) -> Option<usize> {
    stmts
        .iter()
        .enumerate()
        .rfind(|(_, stmt)| stmt_mutates_binding(stmt, name))
        .map(|(index, _)| index)
}

fn expr_references_binding(expr: &Expr, name: &str) -> bool {
    let bindings = HashSet::from([name.to_string()]);
    expr_references_bindings(expr, &bindings)
}

fn side_effect_free_const_decl_binding_name(stmt: &Stmt) -> Option<String> {
    let Stmt::Decl(Decl::Var(var_decl)) = stmt else {
        return None;
    };
    if !matches!(var_decl.kind, VarDeclKind::Const) {
        return None;
    }
    let [decl] = var_decl.decls.as_slice() else {
        return None;
    };
    let Pat::Ident(binding) = &decl.name else {
        return None;
    };
    let init = decl.init.as_ref()?;
    if expr_has_observable_side_effect(init) {
        return None;
    }
    Some(binding.id.sym.to_string())
}

fn expr_has_observable_side_effect(expr: &Expr) -> bool {
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

        fn visit_new_expr(&mut self, _: &swc_ecma_ast::NewExpr) {
            self.found = true;
        }

        fn visit_assign_expr(&mut self, _: &AssignExpr) {
            self.found = true;
        }

        fn visit_update_expr(&mut self, _: &swc_ecma_ast::UpdateExpr) {
            self.found = true;
        }

        fn visit_await_expr(&mut self, _: &swc_ecma_ast::AwaitExpr) {
            self.found = true;
        }

        fn visit_yield_expr(&mut self, _: &swc_ecma_ast::YieldExpr) {
            self.found = true;
        }

        fn visit_unary_expr(&mut self, unary: &swc_ecma_ast::UnaryExpr) {
            if matches!(unary.op, swc_ecma_ast::UnaryOp::Delete) {
                self.found = true;
                return;
            }
            unary.visit_children_with(self);
        }
    }

    let mut finder = Finder { found: false };
    expr.visit_with(&mut finder);
    finder.found
}

fn foldable_same_branch_conditional(expr: &Expr) -> Option<Box<Expr>> {
    let Expr::Cond(cond) = unwrap_transparent_expr(expr) else {
        return None;
    };
    if !expr_structurally_equal_simple(&cond.cons, &cond.alt) {
        return None;
    }
    Some(cond.cons.clone())
}

fn expr_structurally_equal_simple(left: &Expr, right: &Expr) -> bool {
    match (
        unwrap_transparent_expr(left),
        unwrap_transparent_expr(right),
    ) {
        (Expr::Ident(lhs), Expr::Ident(rhs)) => lhs.sym == rhs.sym,
        (Expr::Lit(Lit::Str(lhs)), Expr::Lit(Lit::Str(rhs))) => lhs.value == rhs.value,
        (Expr::Lit(Lit::Num(lhs)), Expr::Lit(Lit::Num(rhs))) => lhs.value == rhs.value,
        (Expr::Lit(Lit::Bool(lhs)), Expr::Lit(Lit::Bool(rhs))) => lhs.value == rhs.value,
        (Expr::Lit(Lit::Null(_)), Expr::Lit(Lit::Null(_))) => true,
        _ => false,
    }
}

fn replace_binding_with_expr_in_stmts(stmts: &mut [Stmt], name: &str, replacement: &Expr) {
    struct Rewriter<'a> {
        name: &'a str,
        replacement: &'a Expr,
    }

    impl VisitMut for Rewriter<'_> {
        fn visit_mut_expr(&mut self, expr: &mut Expr) {
            expr.visit_mut_children_with(self);
            let Expr::Ident(ident) = expr else {
                return;
            };
            if ident.sym == self.name {
                *expr = self.replacement.clone();
            }
        }
    }

    let mut rewriter = Rewriter { name, replacement };
    for stmt in stmts {
        stmt.visit_mut_with(&mut rewriter);
    }
}

fn should_passthrough_pure_initializer(expr: &Expr) -> bool {
    if expr_has_observable_side_effect(expr) {
        return false;
    }
    if default_param_conditional_allocates_identity(expr) {
        return false;
    }

    matches!(
        unwrap_transparent_expr(expr),
        Expr::Lit(_)
            | Expr::Ident(_)
            | Expr::Unary(_)
            | Expr::Bin(_)
            | Expr::Cond(_)
            | Expr::Member(_)
            | Expr::Tpl(_)
    )
}

fn default_param_conditional_allocates_identity(expr: &Expr) -> bool {
    let Expr::Cond(cond) = unwrap_transparent_expr(expr) else {
        return false;
    };

    matches!(
        unwrap_transparent_expr(&cond.cons),
        Expr::Array(_)
            | Expr::Object(_)
            | Expr::Class(_)
            | Expr::New(_)
            | Expr::JSXElement(_)
            | Expr::JSXFragment(_)
    )
}

fn is_default_param_conditional_expr(expr: &Expr) -> bool {
    fn is_undefined(expr: &Expr) -> bool {
        matches!(unwrap_transparent_expr(expr), Expr::Ident(ident) if ident.sym == "undefined")
    }

    let Expr::Cond(cond) = unwrap_transparent_expr(expr) else {
        return false;
    };
    let Expr::Bin(test) = unwrap_transparent_expr(&cond.test) else {
        return false;
    };
    if test.op != op!("===") {
        return false;
    }

    let param_ident = match (
        unwrap_transparent_expr(&test.left),
        unwrap_transparent_expr(&test.right),
    ) {
        (Expr::Ident(left), right) if is_undefined(right) => Some(left.sym.to_string()),
        (left, Expr::Ident(right)) if is_undefined(left) => Some(right.sym.to_string()),
        _ => None,
    };
    let Some(param_ident) = param_ident else {
        return false;
    };

    matches!(
        unwrap_transparent_expr(&cond.alt),
        Expr::Ident(alt_ident) if alt_ident.sym == param_ident
    )
}

fn append_for_update_assignment_result_in_stmts(stmts: &mut Vec<Stmt>) {
    struct Rewriter;

    impl VisitMut for Rewriter {
        fn visit_mut_arrow_expr(&mut self, arrow: &mut ArrowExpr) {
            match &mut *arrow.body {
                swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) => {
                    block.visit_mut_children_with(self);
                }
                swc_ecma_ast::BlockStmtOrExpr::Expr(body_expr) => {
                    body_expr.visit_mut_with(self);
                }
            }
        }

        fn visit_mut_function(&mut self, function: &mut Function) {
            if let Some(body) = &mut function.body {
                body.visit_mut_children_with(self);
            }
        }

        fn visit_mut_for_stmt(&mut self, for_stmt: &mut swc_ecma_ast::ForStmt) {
            for_stmt.visit_mut_children_with(self);
            let Some(update_expr) = &mut for_stmt.update else {
                return;
            };
            let Expr::Assign(assign) = &**update_expr else {
                return;
            };
            if assign.op != op!("=") {
                return;
            }
            let Some(target_ident) = assign.left.as_ident() else {
                return;
            };
            *update_expr = Box::new(Expr::Seq(swc_ecma_ast::SeqExpr {
                span: DUMMY_SP,
                exprs: vec![
                    Box::new(Expr::Assign(assign.clone())),
                    Box::new(Expr::Ident(target_ident.id.clone())),
                ],
            }));
        }
    }

    let mut rewriter = Rewriter;
    stmts.visit_mut_with(&mut rewriter);
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
        let allow_extract = match var_decl.kind {
            VarDeclKind::Const => true,
            // Preserve upstream lowering shape for simple `let x = ...; return x;`
            // by extracting the terminal declaration initializer into the memoized result.
            VarDeclKind::Let => index + 1 == stmts.len(),
            _ => false,
        };
        if !allow_extract {
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
        if index + 1 != stmts.len() {
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
    struct Normalizer {
        in_delete_operand: bool,
    }

    impl VisitMut for Normalizer {
        fn visit_mut_member_expr(&mut self, member: &mut MemberExpr) {
            member.visit_mut_children_with(self);
            if self.in_delete_operand {
                return;
            }

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

        fn visit_mut_unary_expr(&mut self, unary: &mut swc_ecma_ast::UnaryExpr) {
            let prev = self.in_delete_operand;
            if matches!(unary.op, swc_ecma_ast::UnaryOp::Delete) {
                self.in_delete_operand = true;
            }
            unary.visit_mut_children_with(self);
            self.in_delete_operand = prev;
        }
    }

    let mut normalizer = Normalizer {
        in_delete_operand: false,
    };
    for stmt in stmts {
        stmt.visit_mut_with(&mut normalizer);
    }
}

fn inline_const_literal_indices_in_stmts(stmts: &mut Vec<Stmt>) {
    let literal_bindings = collect_inlineable_const_literal_bindings(stmts);

    if literal_bindings.is_empty() {
        return;
    }

    struct IndexInliner<'a> {
        literal_bindings: &'a HashMap<String, Expr>,
    }

    impl VisitMut for IndexInliner<'_> {
        fn visit_mut_arrow_expr(&mut self, _: &mut ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_mut_function(&mut self, _: &mut Function) {
            // Skip nested functions.
        }

        fn visit_mut_expr(&mut self, expr: &mut Expr) {
            expr.visit_mut_children_with(self);

            let Expr::Ident(ident) = expr else {
                return;
            };
            let Some(literal) = self.literal_bindings.get(ident.sym.as_ref()) else {
                return;
            };
            *expr = literal.clone();
        }

        fn visit_mut_member_expr(&mut self, member: &mut MemberExpr) {
            member.visit_mut_children_with(self);
            let MemberProp::Computed(computed) = &mut member.prop else {
                return;
            };
            let Expr::Ident(index_ident) = &*computed.expr else {
                return;
            };
            let Some(literal) = self.literal_bindings.get(index_ident.sym.as_ref()) else {
                return;
            };
            computed.expr = Box::new(literal.clone());
        }
    }

    let mut inliner = IndexInliner {
        literal_bindings: &literal_bindings,
    };
    for stmt in stmts.iter_mut() {
        stmt.visit_mut_with(&mut inliner);
    }

    let mut index = 0usize;
    while index < stmts.len() {
        let can_remove = if let Some(Stmt::Decl(Decl::Var(var_decl))) = stmts.get(index) {
            if var_decl.kind != VarDeclKind::Const {
                false
            } else if let [decl] = var_decl.decls.as_slice() {
                if let Pat::Ident(binding) = &decl.name {
                    literal_bindings.contains_key(binding.id.sym.as_ref())
                        && !binding_referenced_in_stmts(
                            &stmts[index + 1..],
                            binding.id.sym.as_ref(),
                        )
                } else {
                    false
                }
            } else {
                false
            }
        } else {
            false
        };

        if can_remove {
            stmts.remove(index);
        } else {
            index += 1;
        }
    }
}

fn normalize_update_expressions_in_stmts(stmts: &mut Vec<Stmt>) {
    let mut index = 0usize;
    while index < stmts.len() {
        let mut insert_before = None;
        match &mut stmts[index] {
            Stmt::Decl(Decl::Var(var_decl)) => {
                insert_before = rewrite_update_var_decl_initializer(var_decl);
                for decl in &mut var_decl.decls {
                    if let Some(init) = &mut decl.init {
                        normalize_update_expressions_in_expr(init);
                    }
                }
            }
            Stmt::Decl(Decl::Fn(fn_decl)) => {
                if let Some(body) = &mut fn_decl.function.body {
                    normalize_update_expressions_in_stmts(&mut body.stmts);
                }
            }
            Stmt::Expr(expr_stmt) => {
                normalize_update_expressions_in_expr(&mut expr_stmt.expr);
            }
            Stmt::Block(block) => {
                normalize_update_expressions_in_stmts(&mut block.stmts);
            }
            Stmt::If(if_stmt) => {
                normalize_update_expressions_in_stmt(&mut if_stmt.cons);
                if let Some(alt) = &mut if_stmt.alt {
                    normalize_update_expressions_in_stmt(alt);
                }
            }
            Stmt::Labeled(labeled) => {
                normalize_update_expressions_in_stmt(&mut labeled.body);
            }
            Stmt::For(for_stmt) => {
                normalize_update_expressions_in_stmt(&mut for_stmt.body);
            }
            Stmt::ForIn(for_in_stmt) => {
                normalize_update_expressions_in_stmt(&mut for_in_stmt.body);
            }
            Stmt::ForOf(for_of_stmt) => {
                normalize_update_expressions_in_stmt(&mut for_of_stmt.body);
            }
            Stmt::While(while_stmt) => {
                normalize_update_expressions_in_stmt(&mut while_stmt.body);
            }
            Stmt::DoWhile(do_while_stmt) => {
                normalize_update_expressions_in_stmt(&mut do_while_stmt.body);
            }
            Stmt::Switch(switch_stmt) => {
                for case in &mut switch_stmt.cases {
                    normalize_update_expressions_in_stmts(&mut case.cons);
                }
            }
            Stmt::Try(try_stmt) => {
                normalize_update_expressions_in_stmts(&mut try_stmt.block.stmts);
                if let Some(handler) = &mut try_stmt.handler {
                    normalize_update_expressions_in_stmts(&mut handler.body.stmts);
                }
                if let Some(finalizer) = &mut try_stmt.finalizer {
                    normalize_update_expressions_in_stmts(&mut finalizer.stmts);
                }
            }
            _ => {}
        }

        if let Some(stmt) = insert_before {
            stmts.insert(index, stmt);
            index += 2;
        } else {
            index += 1;
        }
    }
}

fn normalize_update_expressions_in_stmt(stmt: &mut Stmt) {
    match stmt {
        Stmt::Block(block) => normalize_update_expressions_in_stmts(&mut block.stmts),
        _ => {
            let mut single = vec![stmt.clone()];
            normalize_update_expressions_in_stmts(&mut single);
            if let [single_stmt] = single.as_slice() {
                *stmt = single_stmt.clone();
            } else {
                *stmt = Stmt::Block(BlockStmt {
                    span: DUMMY_SP,
                    ctxt: Default::default(),
                    stmts: single,
                });
            }
        }
    }
}

fn normalize_update_expressions_in_expr(expr: &mut Box<Expr>) {
    struct Rewriter;

    impl VisitMut for Rewriter {
        fn visit_mut_arrow_expr(&mut self, arrow: &mut ArrowExpr) {
            match &mut *arrow.body {
                swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) => {
                    normalize_update_expressions_in_stmts(&mut block.stmts);
                }
                swc_ecma_ast::BlockStmtOrExpr::Expr(body_expr) => {
                    body_expr.visit_mut_with(self);
                }
            }
        }

        fn visit_mut_function(&mut self, function: &mut Function) {
            if let Some(body) = &mut function.body {
                normalize_update_expressions_in_stmts(&mut body.stmts);
            }
        }

        fn visit_mut_expr(&mut self, expr: &mut Expr) {
            expr.visit_mut_children_with(self);
            let Expr::Update(update) = expr else {
                return;
            };
            let arg_expr = unwrap_transparent_expr(&update.arg).clone();
            let Some(assignment) = make_increment_assignment_expr(&arg_expr, update.op) else {
                return;
            };
            *expr = *assignment;
        }
    }

    let mut rewriter = Rewriter;
    expr.visit_mut_with(&mut rewriter);
}

fn rewrite_update_var_decl_initializer(var_decl: &mut VarDecl) -> Option<Stmt> {
    let [decl] = var_decl.decls.as_mut_slice() else {
        return None;
    };
    let Some(init) = &mut decl.init else {
        return None;
    };
    let Expr::Update(update) = unwrap_transparent_expr(init) else {
        return None;
    };
    let arg_expr = unwrap_transparent_expr(&update.arg).clone();
    let increment_assignment = make_increment_assignment_expr(&arg_expr, update.op)?;

    if update.prefix {
        decl.init = Some(Box::new(Expr::Paren(swc_ecma_ast::ParenExpr {
            span: DUMMY_SP,
            expr: increment_assignment,
        })));
        return None;
    }

    let assign_target = assign_target_from_expr(&arg_expr)?;
    let assign_expr = if let Expr::Assign(assign) = *increment_assignment {
        assign
    } else {
        return None;
    };
    decl.init = Some(Box::new(arg_expr));
    Some(Stmt::Expr(ExprStmt {
        span: DUMMY_SP,
        expr: Box::new(Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            op: assign_expr.op,
            left: assign_target,
            right: assign_expr.right,
        })),
    }))
}

fn assign_target_from_expr(expr: &Expr) -> Option<AssignTarget> {
    match expr {
        Expr::Ident(ident) => Some(AssignTarget::from(ident.clone())),
        Expr::Member(member) => Some(AssignTarget::from(member.clone())),
        _ => None,
    }
}

fn make_increment_assignment_expr(
    arg_expr: &Expr,
    op: swc_ecma_ast::UpdateOp,
) -> Option<Box<Expr>> {
    let left = assign_target_from_expr(arg_expr)?;
    let binary_op = match op {
        swc_ecma_ast::UpdateOp::PlusPlus => op!(bin, "+"),
        swc_ecma_ast::UpdateOp::MinusMinus => op!(bin, "-"),
    };
    Some(Box::new(Expr::Assign(AssignExpr {
        span: DUMMY_SP,
        op: op!("="),
        left,
        right: Box::new(Expr::Bin(swc_ecma_ast::BinExpr {
            span: DUMMY_SP,
            op: binary_op,
            left: Box::new(arg_expr.clone()),
            right: Box::new(Expr::Lit(Lit::Num(Number {
                span: DUMMY_SP,
                value: 1.0,
                raw: None,
            }))),
        })),
    })))
}

fn collect_inlineable_const_literal_bindings(stmts: &[Stmt]) -> HashMap<String, Expr> {
    let mut literal_bindings = HashMap::<String, Expr>::new();
    for stmt in stmts {
        let Stmt::Decl(Decl::Var(var_decl)) = stmt else {
            continue;
        };
        if var_decl.kind != VarDeclKind::Const {
            continue;
        }
        let [decl] = var_decl.decls.as_slice() else {
            continue;
        };
        let Pat::Ident(binding) = &decl.name else {
            continue;
        };
        let Some(init) = &decl.init else {
            continue;
        };
        let Some(inline_expr) = inlineable_const_literal_expr(init.as_ref()) else {
            continue;
        };
        literal_bindings.insert(binding.id.sym.to_string(), inline_expr);
    }
    literal_bindings
}

fn collect_inlineable_const_global_alias_bindings(
    stmts: &[Stmt],
    local_bindings: &HashSet<String>,
) -> HashMap<String, Expr> {
    let mut alias_bindings = HashMap::<String, Expr>::new();
    for stmt in stmts {
        let Stmt::Decl(Decl::Var(var_decl)) = stmt else {
            continue;
        };
        if var_decl.kind != VarDeclKind::Const {
            continue;
        }
        let [decl] = var_decl.decls.as_slice() else {
            continue;
        };
        let Pat::Ident(binding) = &decl.name else {
            continue;
        };
        let Some(init) = &decl.init else {
            continue;
        };
        let Expr::Ident(alias_target) = unwrap_transparent_expr(init) else {
            continue;
        };
        if local_bindings.contains(alias_target.sym.as_ref()) {
            continue;
        }
        alias_bindings.insert(
            binding.id.sym.to_string(),
            Expr::Ident(alias_target.clone()),
        );
    }
    alias_bindings
}

fn inline_const_alias_bindings_in_expr(
    expr: &mut Box<Expr>,
    alias_bindings: &HashMap<String, Expr>,
) {
    struct Inliner<'a> {
        alias_bindings: &'a HashMap<String, Expr>,
    }

    impl VisitMut for Inliner<'_> {
        fn visit_mut_arrow_expr(&mut self, arrow: &mut ArrowExpr) {
            arrow.visit_mut_children_with(self);
        }

        fn visit_mut_function(&mut self, function: &mut Function) {
            function.visit_mut_children_with(self);
        }

        fn visit_mut_expr(&mut self, expr: &mut Expr) {
            expr.visit_mut_children_with(self);

            let Expr::Ident(ident) = expr else {
                return;
            };
            let Some(alias_target) = self.alias_bindings.get(ident.sym.as_ref()) else {
                return;
            };
            *expr = alias_target.clone();
        }
    }

    let mut inliner = Inliner { alias_bindings };
    expr.visit_mut_with(&mut inliner);
}

fn inline_const_literals_in_expr(expr: &mut Box<Expr>, literal_bindings: &HashMap<String, Expr>) {
    struct Inliner<'a> {
        literal_bindings: &'a HashMap<String, Expr>,
    }

    impl VisitMut for Inliner<'_> {
        fn visit_mut_arrow_expr(&mut self, _: &mut ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_mut_function(&mut self, _: &mut Function) {
            // Skip nested functions.
        }

        fn visit_mut_expr(&mut self, expr: &mut Expr) {
            expr.visit_mut_children_with(self);

            let Expr::Ident(ident) = expr else {
                return;
            };
            let Some(literal) = self.literal_bindings.get(ident.sym.as_ref()) else {
                return;
            };
            *expr = literal.clone();
        }
    }

    let mut inliner = Inliner { literal_bindings };
    expr.visit_mut_with(&mut inliner);
}

fn inlineable_const_literal_initializer(expr: &Expr) -> bool {
    inlineable_const_literal_expr(expr).is_some()
}

fn inlineable_const_literal_expr(expr: &Expr) -> Option<Expr> {
    let expr = unwrap_transparent_expr(expr);
    match expr {
        Expr::Lit(Lit::Num(_) | Lit::Str(_) | Lit::Bool(_) | Lit::Null(_)) => Some(expr.clone()),
        Expr::Unary(unary)
            if matches!(unary.op, op!(unary, "-") | op!(unary, "+"))
                && matches!(unary.arg.as_ref(), Expr::Lit(Lit::Num(_))) =>
        {
            Some(expr.clone())
        }
        _ => None,
    }
}

fn normalize_compound_assignments_in_stmts(stmts: &mut [Stmt]) {
    struct Normalizer;

    impl VisitMut for Normalizer {
        fn visit_mut_assign_expr(&mut self, assign: &mut AssignExpr) {
            assign.visit_mut_children_with(self);

            let binary_op = match assign.op {
                swc_ecma_ast::AssignOp::AddAssign => Some(op!(bin, "+")),
                swc_ecma_ast::AssignOp::SubAssign => Some(op!(bin, "-")),
                swc_ecma_ast::AssignOp::MulAssign => Some(op!("*")),
                swc_ecma_ast::AssignOp::DivAssign => Some(op!("/")),
                swc_ecma_ast::AssignOp::ModAssign => Some(op!("%")),
                swc_ecma_ast::AssignOp::LShiftAssign => Some(op!("<<")),
                swc_ecma_ast::AssignOp::RShiftAssign => Some(op!(">>")),
                swc_ecma_ast::AssignOp::ZeroFillRShiftAssign => Some(op!(">>>")),
                swc_ecma_ast::AssignOp::BitOrAssign => Some(op!("|")),
                swc_ecma_ast::AssignOp::BitXorAssign => Some(op!("^")),
                swc_ecma_ast::AssignOp::BitAndAssign => Some(op!("&")),
                swc_ecma_ast::AssignOp::ExpAssign => Some(op!("**")),
                _ => None,
            };
            let Some(binary_op) = binary_op else {
                return;
            };

            let left_expr = if let Some(binding) = assign.left.as_ident() {
                Box::new(Expr::Ident(binding.id.clone()))
            } else if let Some(swc_ecma_ast::SimpleAssignTarget::Member(member)) =
                assign.left.as_simple()
            {
                Box::new(Expr::Member(member.clone()))
            } else {
                return;
            };

            let mut right_expr = assign.right.clone();
            if matches!(
                unwrap_transparent_expr(&right_expr),
                Expr::Assign(_) | Expr::Seq(_) | Expr::Cond(_)
            ) {
                right_expr = Box::new(Expr::Paren(swc_ecma_ast::ParenExpr {
                    span: DUMMY_SP,
                    expr: right_expr,
                }));
            }
            assign.op = op!("=");
            assign.right = Box::new(Expr::Bin(swc_ecma_ast::BinExpr {
                span: DUMMY_SP,
                op: binary_op,
                left: left_expr,
                right: right_expr,
            }));
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

fn prune_unused_object_pattern_bindings_in_stmts(stmts: &mut Vec<Stmt>) {
    let mut index = 0usize;
    while index < stmts.len() {
        let rest_owned = stmts[index + 1..].to_vec();
        let mut remove_stmt = false;

        if let Stmt::Decl(Decl::Var(var_decl)) = &mut stmts[index] {
            for declarator in &mut var_decl.decls {
                prune_unused_object_pattern_bindings_in_pat(&mut declarator.name, &rest_owned);
            }
            var_decl
                .decls
                .retain(|decl| !matches!(&decl.name, Pat::Object(object_pat) if object_pat.props.is_empty()));
            if var_decl.decls.is_empty() {
                remove_stmt = true;
            }
        }

        if remove_stmt {
            stmts.remove(index);
        } else {
            index += 1;
        }
    }
}

fn prune_unused_object_pattern_bindings_in_pat(pat: &mut Pat, rest: &[Stmt]) {
    match pat {
        Pat::Object(object_pat) => {
            object_pat.props.retain_mut(|prop| match prop {
                swc_ecma_ast::ObjectPatProp::KeyValue(key_value) => {
                    prune_unused_object_pattern_bindings_in_pat(&mut key_value.value, rest);
                    !pattern_bindings_are_unused(&key_value.value, rest)
                }
                swc_ecma_ast::ObjectPatProp::Assign(assign) => {
                    binding_referenced_in_stmts(rest, assign.key.sym.as_ref())
                }
                swc_ecma_ast::ObjectPatProp::Rest(_) => true,
            });
        }
        Pat::Array(array_pat) => {
            for element_opt in &mut array_pat.elems {
                let Some(element) = element_opt else {
                    continue;
                };
                prune_unused_object_pattern_bindings_in_pat(element, rest);
                if !matches!(element, Pat::Rest(_)) && pattern_bindings_are_unused(element, rest) {
                    *element_opt = None;
                }
            }
        }
        Pat::Assign(assign_pat) => {
            prune_unused_object_pattern_bindings_in_pat(&mut assign_pat.left, rest);
        }
        Pat::Rest(rest_pat) => {
            prune_unused_object_pattern_bindings_in_pat(&mut rest_pat.arg, rest);
        }
        _ => {}
    }
}

fn pattern_bindings_are_unused(pat: &Pat, rest: &[Stmt]) -> bool {
    let bindings = collect_pattern_binding_names(pat);
    !bindings.is_empty()
        && bindings
            .iter()
            .all(|binding| !binding_referenced_in_stmts(rest, binding))
}

fn normalize_empty_jsx_elements_to_self_closing_in_stmts(stmts: &mut [Stmt]) {
    struct Normalizer;

    impl VisitMut for Normalizer {
        fn visit_mut_jsx_element(&mut self, jsx: &mut swc_ecma_ast::JSXElement) {
            jsx.visit_mut_children_with(self);
            if jsx.children.is_empty() {
                jsx.opening.self_closing = true;
                jsx.closing = None;
            }
        }
    }

    let mut normalizer = Normalizer;
    for stmt in stmts {
        stmt.visit_mut_with(&mut normalizer);
    }
}

fn lower_function_decls_to_const_in_stmts(stmts: &mut [Stmt]) {
    struct Lowerer;

    impl VisitMut for Lowerer {
        fn visit_mut_arrow_expr(&mut self, _: &mut ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_mut_function(&mut self, _: &mut Function) {
            // Skip nested functions.
        }

        fn visit_mut_stmt(&mut self, stmt: &mut Stmt) {
            stmt.visit_mut_children_with(self);

            let Stmt::Decl(Decl::Fn(fn_decl)) = stmt else {
                return;
            };
            if fn_decl.declare {
                return;
            }

            let ident = fn_decl.ident.clone();
            *stmt = make_var_decl(
                VarDeclKind::Const,
                Pat::Ident(BindingIdent {
                    id: ident.clone(),
                    type_ann: None,
                }),
                Some(Box::new(Expr::Fn(swc_ecma_ast::FnExpr {
                    ident: Some(ident),
                    function: fn_decl.function.clone(),
                }))),
            );
        }
    }

    let mut lowerer = Lowerer;
    for stmt in stmts {
        stmt.visit_mut_with(&mut lowerer);
    }
}

fn flatten_hoistable_blocks_in_stmts(stmts: &mut Vec<Stmt>, reserved: &mut HashSet<String>) {
    fn stmt_contains_function_like(stmt: &Stmt) -> bool {
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
        }

        let mut finder = Finder::default();
        stmt.visit_with(&mut finder);
        finder.found
    }

    fn block_is_flattenable(block: &BlockStmt, has_local_bindings: bool) -> bool {
        block.stmts.iter().all(|stmt| {
            !(matches!(
                stmt,
                Stmt::Break(_)
                    | Stmt::Continue(_)
                    | Stmt::Labeled(_)
                    | Stmt::Try(_)
                    | Stmt::For(_)
                    | Stmt::ForIn(_)
                    | Stmt::ForOf(_)
                    | Stmt::While(_)
                    | Stmt::DoWhile(_)
                    | Stmt::Switch(_)
            ) || has_local_bindings && stmt_contains_function_like(stmt))
        })
    }

    let mut taken = reserved.clone();
    for stmt in stmts.iter() {
        collect_stmt_bindings(stmt, &mut taken);
    }

    let mut out = Vec::with_capacity(stmts.len());
    for stmt in std::mem::take(stmts) {
        let Stmt::Block(mut block) = stmt else {
            collect_stmt_bindings(&stmt, &mut taken);
            out.push(stmt);
            continue;
        };

        let mut block_bindings = HashSet::new();
        for inner in &block.stmts {
            collect_stmt_bindings(inner, &mut block_bindings);
        }

        if !block_is_flattenable(&block, !block_bindings.is_empty()) {
            collect_stmt_bindings(&Stmt::Block(block.clone()), &mut taken);
            out.push(Stmt::Block(block));
            continue;
        }

        if !block_bindings.is_empty() {
            let mut conflicts = block_bindings
                .iter()
                .filter(|name| taken.contains(name.as_str()))
                .cloned()
                .collect::<Vec<_>>();
            conflicts.sort();

            for name in conflicts {
                let mut suffix = 0u32;
                let replacement = loop {
                    let candidate = format!("{name}_{suffix}");
                    suffix += 1;
                    if !taken.contains(candidate.as_str())
                        && !block_bindings.contains(candidate.as_str())
                    {
                        break candidate;
                    }
                };

                rename_ident_in_block(&mut block, name.as_str(), replacement.as_str());
                preserve_shorthand_property_keys_for_rename_in_block(
                    &mut block,
                    name.as_str(),
                    replacement.as_str(),
                );
                block_bindings.remove(name.as_str());
                block_bindings.insert(replacement.clone());
                taken.insert(replacement);
            }
        }

        for binding in block_bindings {
            taken.insert(binding);
        }
        out.extend(block.stmts);
    }

    reserved.extend(taken);
    *stmts = out;
}

fn flatten_hoistable_blocks_in_nested_functions(stmts: &mut [Stmt]) {
    struct NestedFlattener;

    impl VisitMut for NestedFlattener {
        fn visit_mut_arrow_expr(&mut self, arrow: &mut ArrowExpr) {
            let swc_ecma_ast::BlockStmtOrExpr::BlockStmt(body) = &mut *arrow.body else {
                return;
            };

            let mut reserved = HashSet::new();
            for param in &arrow.params {
                collect_pattern_bindings(param, &mut reserved);
            }
            for stmt in &body.stmts {
                collect_stmt_bindings(stmt, &mut reserved);
            }
            flatten_hoistable_blocks_in_stmts(&mut body.stmts, &mut reserved);

            for stmt in &mut body.stmts {
                stmt.visit_mut_with(self);
            }
        }

        fn visit_mut_function(&mut self, function: &mut Function) {
            let Some(body) = &mut function.body else {
                return;
            };

            let mut reserved = HashSet::new();
            for param in &function.params {
                collect_pattern_bindings(&param.pat, &mut reserved);
            }
            for stmt in &body.stmts {
                collect_stmt_bindings(stmt, &mut reserved);
            }
            flatten_hoistable_blocks_in_stmts(&mut body.stmts, &mut reserved);

            for stmt in &mut body.stmts {
                stmt.visit_mut_with(self);
            }
        }
    }

    let mut flattener = NestedFlattener;
    for stmt in stmts {
        stmt.visit_mut_with(&mut flattener);
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

fn normalize_switch_case_blocks_in_stmts(stmts: &mut [Stmt]) {
    struct SwitchCaseNormalizer;

    impl VisitMut for SwitchCaseNormalizer {
        fn visit_mut_arrow_expr(&mut self, _: &mut ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_mut_function(&mut self, _: &mut Function) {
            // Skip nested functions.
        }

        fn visit_mut_stmt(&mut self, stmt: &mut Stmt) {
            stmt.visit_mut_children_with(self);

            let Stmt::Switch(switch_stmt) = stmt else {
                return;
            };
            let Some(label) = normalize_switch_case_blocks(switch_stmt) else {
                return;
            };

            *stmt = Stmt::Labeled(LabeledStmt {
                span: DUMMY_SP,
                label,
                body: Box::new(Stmt::Switch(switch_stmt.clone())),
            });
        }
    }

    let mut normalizer = SwitchCaseNormalizer;
    for stmt in stmts {
        stmt.visit_mut_with(&mut normalizer);
    }
}

fn normalize_switch_case_blocks(switch_stmt: &mut SwitchStmt) -> Option<Ident> {
    let should_wrap_case = |case: &swc_ecma_ast::SwitchCase| {
        !case.cons.is_empty() && !matches!(case.cons.as_slice(), [Stmt::Block(_)])
    };

    let should_simplify_empty_default = |case: &swc_ecma_ast::SwitchCase| {
        case.test.is_none()
            && matches!(case.cons.as_slice(), [Stmt::Block(block)] if block.stmts.is_empty())
    };

    if !switch_stmt.cases.iter().any(should_wrap_case)
        && !switch_stmt
            .cases
            .iter()
            .any(case_contains_unlabeled_switch_break)
        && !switch_stmt.cases.iter().any(should_simplify_empty_default)
    {
        return None;
    }

    let needs_label = switch_stmt
        .cases
        .iter()
        .any(case_contains_unlabeled_switch_break);
    let label = needs_label.then(|| Ident::new_no_ctxt("bb0".into(), DUMMY_SP));

    for case in &mut switch_stmt.cases {
        if should_simplify_empty_default(case) {
            case.cons.clear();
            continue;
        }

        if !should_wrap_case(case) {
            if let Some(label) = &label {
                for stmt in &mut case.cons {
                    relabel_unlabeled_switch_breaks(stmt, label);
                }
            }
            continue;
        }

        let mut cons = std::mem::take(&mut case.cons);
        if let Some(label) = &label {
            for stmt in &mut cons {
                relabel_unlabeled_switch_breaks(stmt, label);
            }
        }

        case.cons = vec![Stmt::Block(BlockStmt {
            span: DUMMY_SP,
            ctxt: Default::default(),
            stmts: cons,
        })];
    }

    label
}

fn case_contains_unlabeled_switch_break(case: &swc_ecma_ast::SwitchCase) -> bool {
    case.cons.iter().any(stmt_contains_unlabeled_switch_break)
}

fn stmt_contains_unlabeled_switch_break(stmt: &Stmt) -> bool {
    match stmt {
        Stmt::Break(break_stmt) => break_stmt.label.is_none(),
        Stmt::Block(block) => block.stmts.iter().any(stmt_contains_unlabeled_switch_break),
        Stmt::If(if_stmt) => {
            stmt_contains_unlabeled_switch_break(&if_stmt.cons)
                || if_stmt
                    .alt
                    .as_deref()
                    .is_some_and(stmt_contains_unlabeled_switch_break)
        }
        Stmt::Labeled(labeled) => stmt_contains_unlabeled_switch_break(&labeled.body),
        Stmt::Try(try_stmt) => {
            try_stmt
                .block
                .stmts
                .iter()
                .any(stmt_contains_unlabeled_switch_break)
                || try_stmt.handler.as_ref().is_some_and(|handler| {
                    handler
                        .body
                        .stmts
                        .iter()
                        .any(stmt_contains_unlabeled_switch_break)
                })
                || try_stmt.finalizer.as_ref().is_some_and(|finalizer| {
                    finalizer
                        .stmts
                        .iter()
                        .any(stmt_contains_unlabeled_switch_break)
                })
        }
        Stmt::For(_)
        | Stmt::ForIn(_)
        | Stmt::ForOf(_)
        | Stmt::While(_)
        | Stmt::DoWhile(_)
        | Stmt::Switch(_)
        | Stmt::Decl(Decl::Fn(_))
        | Stmt::Decl(Decl::Class(_)) => false,
        _ => false,
    }
}

fn relabel_unlabeled_switch_breaks(stmt: &mut Stmt, label: &Ident) {
    match stmt {
        Stmt::Break(break_stmt) => {
            if break_stmt.label.is_none() {
                break_stmt.label = Some(label.clone());
            }
        }
        Stmt::Block(block) => {
            for nested in &mut block.stmts {
                relabel_unlabeled_switch_breaks(nested, label);
            }
        }
        Stmt::If(if_stmt) => {
            relabel_unlabeled_switch_breaks(&mut if_stmt.cons, label);
            if let Some(alt) = &mut if_stmt.alt {
                relabel_unlabeled_switch_breaks(alt, label);
            }
        }
        Stmt::Labeled(labeled) => relabel_unlabeled_switch_breaks(&mut labeled.body, label),
        Stmt::Try(try_stmt) => {
            for nested in &mut try_stmt.block.stmts {
                relabel_unlabeled_switch_breaks(nested, label);
            }
            if let Some(handler) = &mut try_stmt.handler {
                for nested in &mut handler.body.stmts {
                    relabel_unlabeled_switch_breaks(nested, label);
                }
            }
            if let Some(finalizer) = &mut try_stmt.finalizer {
                for nested in &mut finalizer.stmts {
                    relabel_unlabeled_switch_breaks(nested, label);
                }
            }
        }
        Stmt::For(_)
        | Stmt::ForIn(_)
        | Stmt::ForOf(_)
        | Stmt::While(_)
        | Stmt::DoWhile(_)
        | Stmt::Switch(_)
        | Stmt::Decl(Decl::Fn(_))
        | Stmt::Decl(Decl::Class(_)) => {}
        _ => {}
    }
}

fn inline_trivial_iifes_in_stmts(stmts: &mut Vec<Stmt>) {
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
    for stmt in stmts.iter_mut() {
        stmt.visit_mut_with(&mut inliner);
    }

    fn recurse(stmt: &mut Stmt) {
        match stmt {
            Stmt::Block(block) => inline_trivial_iifes_in_stmts(&mut block.stmts),
            Stmt::If(if_stmt) => {
                recurse(&mut if_stmt.cons);
                if let Some(alt) = &mut if_stmt.alt {
                    recurse(alt);
                }
            }
            Stmt::Labeled(labeled) => recurse(&mut labeled.body),
            Stmt::Try(try_stmt) => {
                inline_trivial_iifes_in_stmts(&mut try_stmt.block.stmts);
                if let Some(handler) = &mut try_stmt.handler {
                    inline_trivial_iifes_in_stmts(&mut handler.body.stmts);
                }
                if let Some(finalizer) = &mut try_stmt.finalizer {
                    inline_trivial_iifes_in_stmts(&mut finalizer.stmts);
                }
            }
            Stmt::Switch(switch_stmt) => {
                for case in &mut switch_stmt.cases {
                    inline_trivial_iifes_in_stmts(&mut case.cons);
                }
            }
            Stmt::For(for_stmt) => recurse(&mut for_stmt.body),
            Stmt::ForIn(for_in_stmt) => recurse(&mut for_in_stmt.body),
            Stmt::ForOf(for_of_stmt) => recurse(&mut for_of_stmt.body),
            Stmt::While(while_stmt) => recurse(&mut while_stmt.body),
            Stmt::DoWhile(do_while_stmt) => recurse(&mut do_while_stmt.body),
            _ => {}
        }
    }

    for stmt in stmts.iter_mut() {
        recurse(stmt);
    }

    let mut expanded = Vec::with_capacity(stmts.len());
    for stmt in std::mem::take(stmts) {
        let replacement = match &stmt {
            Stmt::Expr(expr_stmt) => {
                let Expr::Call(call) = unwrap_transparent_expr(&expr_stmt.expr) else {
                    expanded.push(stmt);
                    continue;
                };
                if !call.args.is_empty() {
                    expanded.push(stmt);
                    continue;
                }
                let Callee::Expr(callee_expr) = &call.callee else {
                    expanded.push(stmt);
                    continue;
                };
                extract_iife_inlineable_stmt_list(callee_expr)
            }
            _ => {
                expanded.push(stmt);
                continue;
            }
        };

        if let Some(mut replacement_stmts) = replacement {
            expanded.append(&mut replacement_stmts);
        } else {
            expanded.push(stmt);
        }
    }
    *stmts = expanded;
}

fn lower_iife_call_args_in_stmts(
    stmts: &mut Vec<Stmt>,
    reserved: &mut HashSet<String>,
    next_temp: &mut u32,
) {
    fn expr_is_simple_arg(expr: &Expr) -> bool {
        matches!(
            unwrap_transparent_expr(expr),
            Expr::Ident(_) | Expr::Lit(_) | Expr::Member(_) | Expr::This(_)
        )
    }

    fn expr_root_binding_name(expr: &Expr) -> Option<String> {
        match unwrap_transparent_expr(expr) {
            Expr::Ident(ident) => Some(ident.sym.to_string()),
            Expr::Member(member) => {
                let mut current = member.obj.as_ref();
                loop {
                    match unwrap_transparent_expr(current) {
                        Expr::Ident(ident) => return Some(ident.sym.to_string()),
                        Expr::Member(parent) => {
                            current = parent.obj.as_ref();
                        }
                        _ => return None,
                    }
                }
            }
            _ => None,
        }
    }

    let mut lowered = Vec::with_capacity(stmts.len());
    for stmt in std::mem::take(stmts) {
        let Stmt::Expr(expr_stmt) = stmt else {
            lowered.push(stmt);
            continue;
        };
        let Expr::Assign(assign) = *expr_stmt.expr else {
            lowered.push(Stmt::Expr(expr_stmt));
            continue;
        };
        if assign.op != op!("=") {
            lowered.push(Stmt::Expr(ExprStmt {
                span: expr_stmt.span,
                expr: Box::new(Expr::Assign(assign)),
            }));
            continue;
        }

        let Expr::Call(mut call) = *assign.right else {
            lowered.push(Stmt::Expr(ExprStmt {
                span: expr_stmt.span,
                expr: Box::new(Expr::Assign(assign)),
            }));
            continue;
        };
        if call.args.iter().any(|arg| arg.spread.is_some()) {
            lowered.push(Stmt::Expr(ExprStmt {
                span: expr_stmt.span,
                expr: Box::new(Expr::Assign(AssignExpr {
                    span: assign.span,
                    op: assign.op,
                    left: assign.left,
                    right: Box::new(Expr::Call(call)),
                })),
            }));
            continue;
        }

        let mut first_iife_index = None;
        let mut iife_prelude = Vec::new();
        for (index, arg) in call.args.iter_mut().enumerate() {
            let Some((mut prelude, ret_expr)) = extract_iife_prelude_and_return_expr(&arg.expr)
            else {
                continue;
            };
            if first_iife_index.is_none() {
                first_iife_index = Some(index);
            }
            iife_prelude.append(&mut prelude);
            arg.expr = ret_expr;
        }

        let Some(first_iife_index) = first_iife_index else {
            lowered.push(Stmt::Expr(ExprStmt {
                span: expr_stmt.span,
                expr: Box::new(Expr::Assign(AssignExpr {
                    span: assign.span,
                    op: assign.op,
                    left: assign.left,
                    right: Box::new(Expr::Call(call)),
                })),
            }));
            continue;
        };

        let mut prelude = Vec::new();
        for arg in call.args.iter_mut().take(first_iife_index) {
            let needs_snapshot = expr_root_binding_name(&arg.expr).is_some_and(|name| {
                binding_reassigned_after(&iife_prelude, name.as_str())
                    || binding_mutated_via_member_call_after(&iife_prelude, name.as_str())
                    || binding_mutated_via_member_assignment_after(&iife_prelude, name.as_str())
            });
            if expr_is_simple_arg(&arg.expr) && !needs_snapshot {
                continue;
            }
            let temp = fresh_temp_ident(next_temp, reserved);
            prelude.push(make_var_decl(
                VarDeclKind::Const,
                Pat::Ident(BindingIdent {
                    id: temp.clone(),
                    type_ann: None,
                }),
                Some(arg.expr.clone()),
            ));
            arg.expr = Box::new(Expr::Ident(temp));
        }
        prelude.extend(iife_prelude);
        lowered.extend(prelude);
        lowered.push(Stmt::Expr(ExprStmt {
            span: expr_stmt.span,
            expr: Box::new(Expr::Assign(AssignExpr {
                span: assign.span,
                op: assign.op,
                left: assign.left,
                right: Box::new(Expr::Call(call)),
            })),
        }));
    }

    *stmts = lowered;
}

fn extract_iife_prelude_and_return_expr(expr: &Expr) -> Option<(Vec<Stmt>, Box<Expr>)> {
    let Expr::Call(call) = unwrap_transparent_expr(expr) else {
        return None;
    };
    if !call.args.is_empty() {
        return None;
    }
    let Callee::Expr(callee_expr) = &call.callee else {
        return None;
    };

    match unwrap_transparent_expr(callee_expr) {
        Expr::Arrow(arrow) if !arrow.is_async && !arrow.is_generator && arrow.params.is_empty() => {
            match &*arrow.body {
                swc_ecma_ast::BlockStmtOrExpr::Expr(value_expr) => {
                    Some((Vec::new(), value_expr.clone()))
                }
                swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) => {
                    let (last, preceding) = block.stmts.split_last()?;
                    let Stmt::Return(return_stmt) = last else {
                        return None;
                    };
                    let ret_expr = return_stmt.arg.clone()?;
                    if contains_return_stmt_in_stmts(preceding) {
                        return None;
                    }
                    Some((preceding.to_vec(), ret_expr))
                }
            }
        }
        Expr::Fn(fn_expr)
            if !fn_expr.function.is_async
                && !fn_expr.function.is_generator
                && fn_expr.function.params.is_empty() =>
        {
            let body = fn_expr.function.body.as_ref()?;
            let (last, preceding) = body.stmts.split_last()?;
            let Stmt::Return(return_stmt) = last else {
                return None;
            };
            let ret_expr = return_stmt.arg.clone()?;
            if contains_return_stmt_in_stmts(preceding) {
                return None;
            }
            Some((preceding.to_vec(), ret_expr))
        }
        _ => None,
    }
}

fn extract_iife_inlineable_stmt_list(expr: &Expr) -> Option<Vec<Stmt>> {
    match unwrap_transparent_expr(expr) {
        Expr::Arrow(arrow) if !arrow.is_async && !arrow.is_generator && arrow.params.is_empty() => {
            match &*arrow.body {
                swc_ecma_ast::BlockStmtOrExpr::Expr(value_expr) => {
                    Some(vec![Stmt::Expr(ExprStmt {
                        span: DUMMY_SP,
                        expr: value_expr.clone(),
                    })])
                }
                swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) => {
                    if contains_return_stmt_in_stmts(&block.stmts) {
                        None
                    } else {
                        Some(block.stmts.clone())
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
            if contains_return_stmt_in_stmts(&body.stmts) {
                None
            } else {
                Some(body.stmts.clone())
            }
        }
        _ => None,
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

        fn visit_mut_pat(&mut self, pat: &mut Pat) {
            pat.visit_mut_children_with(self);
            match pat {
                Pat::Ident(binding) => {
                    binding.type_ann = None;
                }
                Pat::Array(array) => {
                    array.type_ann = None;
                }
                Pat::Object(object) => {
                    object.type_ann = None;
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
    fn stmt_is_drop_pure_iife_prelude(stmt: &Stmt) -> bool {
        match stmt {
            Stmt::Decl(Decl::Var(var_decl))
                if matches!(var_decl.kind, VarDeclKind::Const | VarDeclKind::Let) =>
            {
                var_decl.decls.iter().all(|decl| {
                    decl.init
                        .as_ref()
                        .map_or(true, |init| !expr_has_observable_side_effect(init))
                })
            }
            Stmt::Empty(_) => true,
            _ => false,
        }
    }

    fn can_drop_iife_prelude_stmts(preceding: &[Stmt], ret_expr: &Expr) -> bool {
        if preceding.is_empty() {
            return true;
        }
        if preceding
            .iter()
            .any(|stmt| !stmt_is_drop_pure_iife_prelude(stmt))
        {
            return false;
        }

        let mut prelude_bindings = HashSet::new();
        for stmt in preceding {
            collect_stmt_bindings(stmt, &mut prelude_bindings);
        }
        if prelude_bindings.is_empty() {
            return true;
        }

        if matches!(
            unwrap_transparent_expr(ret_expr),
            Expr::Arrow(_) | Expr::Fn(_)
        ) {
            !function_expr_may_capture_outer_bindings(ret_expr, &prelude_bindings)
        } else {
            !expr_references_bindings(ret_expr, &prelude_bindings)
        }
    }

    match expr {
        Expr::Paren(paren) => extract_iife_return_expr(&paren.expr),
        Expr::Arrow(arrow) if !arrow.is_async && !arrow.is_generator && arrow.params.is_empty() => {
            match &*arrow.body {
                swc_ecma_ast::BlockStmtOrExpr::Expr(value_expr) => Some(value_expr.clone()),
                swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) => {
                    let (last, preceding) = block.stmts.split_last()?;
                    let Stmt::Return(return_stmt) = last else {
                        return None;
                    };
                    let ret_expr = return_stmt.arg.clone()?;
                    if can_drop_iife_prelude_stmts(preceding, ret_expr.as_ref()) {
                        Some(ret_expr)
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
            let (last, preceding) = body.stmts.split_last()?;
            let Stmt::Return(return_stmt) = last else {
                return None;
            };
            let ret_expr = return_stmt.arg.clone()?;
            if can_drop_iife_prelude_stmts(preceding, ret_expr.as_ref()) {
                Some(ret_expr)
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

fn is_guard_if_with_terminal_return(stmt: &Stmt) -> bool {
    let Stmt::If(if_stmt) = stmt else {
        return false;
    };
    let Some(alternate) = if_stmt.alt.as_deref() else {
        return false;
    };

    let consequent_returns = stmt_is_terminal_return(if_stmt.cons.as_ref());
    let alternate_returns = stmt_is_terminal_return(alternate);
    if consequent_returns == alternate_returns {
        return false;
    }

    let non_return_branch = if consequent_returns {
        alternate
    } else {
        if_stmt.cons.as_ref()
    };
    if contains_return_stmt_in_stmts(std::slice::from_ref(non_return_branch)) {
        return false;
    }
    if stmt_contains_var_declaration(non_return_branch) {
        return false;
    }

    true
}

fn stable_guard_assignment_binding(
    stmt: &Stmt,
    known_bindings: &HashMap<String, bool>,
) -> Option<String> {
    let Stmt::If(if_stmt) = stmt else {
        return None;
    };
    let alternate = if_stmt.alt.as_deref()?;
    if !is_guard_if_with_terminal_return(stmt) {
        return None;
    }

    let non_return_branch = if stmt_is_terminal_return(if_stmt.cons.as_ref()) {
        alternate
    } else {
        if_stmt.cons.as_ref()
    };
    let assignment_stmt = match non_return_branch {
        Stmt::Expr(expr_stmt) => Some(expr_stmt),
        Stmt::Block(block) => match block.stmts.as_slice() {
            [Stmt::Expr(expr_stmt)] => Some(expr_stmt),
            _ => None,
        },
        _ => None,
    }?;
    let Expr::Assign(assign) = &*assignment_stmt.expr else {
        return None;
    };
    if assign.op != op!("=") {
        return None;
    }
    let target = assign.left.as_ident()?;
    if !matches!(&*assign.right, Expr::Call(_) | Expr::OptChain(_)) {
        return None;
    }

    let local_bindings = HashSet::new();
    let deps = collect_dependencies_from_expr(&assign.right, known_bindings, &local_bindings);
    if deps.is_empty() {
        Some(target.id.sym.to_string())
    } else {
        None
    }
}

fn stmt_is_terminal_return(stmt: &Stmt) -> bool {
    match stmt {
        Stmt::Return(_) => true,
        Stmt::Block(block) => matches!(block.stmts.as_slice(), [Stmt::Return(_)]),
        _ => false,
    }
}

fn stmt_contains_var_declaration(stmt: &Stmt) -> bool {
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

        fn visit_var_decl(&mut self, _: &VarDecl) {
            self.found = true;
        }
    }

    let mut finder = Finder::default();
    stmt.visit_with(&mut finder);
    finder.found
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

fn extract_phi_assignment_if_stmt(stmt: &Stmt) -> Option<Vec<String>> {
    let Stmt::If(if_stmt) = stmt else {
        return None;
    };
    let alternate = if_stmt.alt.as_deref()?;

    let consequent_assignments = match &*if_stmt.cons {
        Stmt::Block(block) => collect_branch_assignment_targets(&block.stmts)?,
        other => collect_branch_assignment_targets(std::slice::from_ref(other))?,
    };
    let alternate_assignments = match alternate {
        Stmt::Block(block) => collect_branch_assignment_targets(&block.stmts)?,
        other => collect_branch_assignment_targets(std::slice::from_ref(other))?,
    };

    if consequent_assignments.is_empty() || alternate_assignments.is_empty() {
        return None;
    }
    if consequent_assignments != alternate_assignments {
        return None;
    }

    let mut names = consequent_assignments.into_iter().collect::<Vec<_>>();
    names.sort_unstable();
    Some(names)
}

fn collect_branch_assignment_targets(stmts: &[Stmt]) -> Option<HashSet<String>> {
    let mut assigned = HashSet::new();

    for stmt in stmts {
        let Stmt::Expr(expr_stmt) = stmt else {
            return None;
        };
        if !collect_assignment_chain_targets(&expr_stmt.expr, &mut assigned) {
            return None;
        }
    }

    Some(assigned)
}

fn collect_assignment_chain_targets(expr: &Expr, assigned: &mut HashSet<String>) -> bool {
    let Expr::Assign(assign) = unwrap_transparent_expr(expr) else {
        return false;
    };
    if assign.op != op!("=") {
        return false;
    }
    let Some(target) = assign.left.as_ident() else {
        return false;
    };
    assigned.insert(target.id.sym.to_string());

    let rhs = unwrap_transparent_expr(&assign.right);
    if let Expr::Assign(_) = rhs {
        return collect_assignment_chain_targets(rhs, assigned);
    }

    !expr_has_observable_side_effect(rhs)
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

fn should_skip_result_tail_memoization(stmts: &[Stmt], name: &str) -> bool {
    if contains_return_stmt_in_stmts(stmts)
        || !contains_call_assignment_to_binding(stmts, name)
        || !contains_direct_assignment_to_binding(stmts, name)
        || binding_has_non_assignment_usage_in_stmts(stmts, name)
    {
        return false;
    }

    if !stmts_definitely_assign_binding(stmts, name) {
        return true;
    }

    contains_conditional_call_and_non_call_assignment_to_binding(stmts, name)
}

fn should_skip_result_tail_outer_memoization(stmts: &[Stmt], name: &str) -> bool {
    !contains_return_stmt_in_stmts(stmts)
        && !contains_direct_call(stmts)
        && contains_object_assignment_to_binding(stmts, name)
}

fn should_skip_result_tail_pattern_assignment_outer_memoization(
    stmts: &[Stmt],
    name: &str,
) -> bool {
    let [Stmt::If(if_stmt)] = stmts else {
        return false;
    };
    let Some(alt) = if_stmt.alt.as_deref() else {
        return false;
    };

    let consequent_assigns =
        contains_direct_assignment_to_binding(std::slice::from_ref(if_stmt.cons.as_ref()), name)
            || contains_pattern_assignment_to_binding(
                std::slice::from_ref(if_stmt.cons.as_ref()),
                name,
            );
    let alternate_assigns = contains_direct_assignment_to_binding(std::slice::from_ref(alt), name)
        || contains_pattern_assignment_to_binding(std::slice::from_ref(alt), name);

    !contains_return_stmt_in_stmts(stmts)
        && !contains_direct_call(stmts)
        && consequent_assigns
        && alternate_assigns
        && contains_pattern_assignment_to_binding(stmts, name)
}

fn contains_pattern_assignment_to_binding(stmts: &[Stmt], name: &str) -> bool {
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
            let AssignTarget::Pat(assign_pat) = &assign.left else {
                assign.visit_children_with(self);
                return;
            };
            let pat = Pat::from(assign_pat.clone());
            if collect_pattern_binding_names(&pat)
                .iter()
                .any(|binding| binding == self.name)
            {
                self.found = true;
                return;
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

fn contains_object_assignment_to_binding(stmts: &[Stmt], name: &str) -> bool {
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
                if binding.id.sym == self.name
                    && matches!(unwrap_transparent_expr(&assign.right), Expr::Object(_))
                    && count_binding_references_in_expr(&assign.right, self.name) > 0
                {
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

fn contains_direct_assignment_to_binding(stmts: &[Stmt], name: &str) -> bool {
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

fn contains_function_assignment_to_binding(stmts: &[Stmt], name: &str) -> bool {
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
                if binding.id.sym == self.name
                    && matches!(
                        unwrap_transparent_expr(&assign.right),
                        Expr::Arrow(_) | Expr::Fn(_)
                    )
                {
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

fn contains_call_assignment_to_binding(stmts: &[Stmt], name: &str) -> bool {
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
                if binding.id.sym == self.name
                    && matches!(&*assign.right, Expr::Call(_) | Expr::OptChain(_))
                {
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

fn contains_non_call_assignment_to_binding(stmts: &[Stmt], name: &str) -> bool {
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
                if binding.id.sym == self.name
                    && !matches!(&*assign.right, Expr::Call(_) | Expr::OptChain(_))
                {
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

fn contains_assignment_to_binding(stmts: &[Stmt], name: &str) -> bool {
    contains_direct_assignment_to_binding(stmts, name)
}

fn contains_conditional_call_and_non_call_assignment_to_binding(
    stmts: &[Stmt],
    name: &str,
) -> bool {
    stmts.iter().any(|stmt| {
        let Stmt::If(if_stmt) = stmt else {
            return false;
        };
        let Some(alternate) = if_stmt.alt.as_deref() else {
            return false;
        };
        let consequent = if_stmt.cons.as_ref();

        let branch_assigns = contains_assignment_to_binding(std::slice::from_ref(consequent), name)
            && contains_assignment_to_binding(std::slice::from_ref(alternate), name);
        if !branch_assigns {
            return false;
        }

        let has_call_assignment =
            contains_call_assignment_to_binding(std::slice::from_ref(consequent), name)
                || contains_call_assignment_to_binding(std::slice::from_ref(alternate), name);
        if !has_call_assignment {
            return false;
        }

        contains_non_call_assignment_to_binding(std::slice::from_ref(consequent), name)
            || contains_non_call_assignment_to_binding(std::slice::from_ref(alternate), name)
    })
}

fn binding_has_non_assignment_usage_in_stmts(stmts: &[Stmt], name: &str) -> bool {
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

        fn visit_var_decl(&mut self, var_decl: &VarDecl) {
            for decl in &var_decl.decls {
                if let Some(init) = &decl.init {
                    init.visit_with(self);
                }
            }
        }

        fn visit_assign_expr(&mut self, assign: &AssignExpr) {
            if let Some(binding) = assign.left.as_ident() {
                if binding.id.sym == self.name {
                    assign.right.visit_with(self);
                    return;
                }
            }

            assign.visit_children_with(self);
        }

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

fn stmts_definitely_assign_binding(stmts: &[Stmt], name: &str) -> bool {
    for stmt in stmts {
        if stmt_definitely_assigns_binding(stmt, name) {
            return true;
        }
    }

    false
}

fn stmt_definitely_assigns_binding(stmt: &Stmt, name: &str) -> bool {
    match stmt {
        Stmt::Expr(expr_stmt) => {
            let Expr::Assign(assign) = &*expr_stmt.expr else {
                return false;
            };

            assign
                .left
                .as_ident()
                .is_some_and(|binding| binding.id.sym == name)
        }
        Stmt::Decl(Decl::Var(var_decl)) => var_decl.decls.iter().any(|decl| {
            collect_pattern_binding_names(&decl.name)
                .into_iter()
                .any(|binding| binding == name)
                && decl.init.is_some()
        }),
        Stmt::Block(block) => stmts_definitely_assign_binding(&block.stmts, name),
        Stmt::Labeled(labeled) => stmt_definitely_assigns_binding(&labeled.body, name),
        Stmt::If(if_stmt) => if_stmt.alt.as_deref().is_some_and(|alt| {
            stmt_definitely_assigns_binding(&if_stmt.cons, name)
                && stmt_definitely_assigns_binding(alt, name)
        }),
        Stmt::Try(try_stmt) => {
            if try_stmt.finalizer.is_some() {
                return false;
            }
            let try_assigns = stmts_definitely_assign_binding(&try_stmt.block.stmts, name);
            if let Some(handler) = &try_stmt.handler {
                try_assigns && stmts_definitely_assign_binding(&handler.body.stmts, name)
            } else {
                try_assigns
            }
        }
        _ => false,
    }
}

fn fresh_ident(base: &str, used: &mut HashSet<String>) -> Ident {
    if !used.contains(base) {
        used.insert(base.to_string());
        return Ident::new_no_ctxt(base.into(), DUMMY_SP);
    }

    let mut index = if base == "$" { 0 } else { 2 };
    loop {
        let candidate = format!("{base}{index}");
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
    let needs_paren = matches!(
        &left,
        AssignTarget::Pat(assign_pat) if matches!(Pat::from(assign_pat.clone()), Pat::Object(_))
    );
    let assign = Expr::Assign(AssignExpr {
        span: DUMMY_SP,
        op: op!("="),
        left,
        right,
    });

    Stmt::Expr(ExprStmt {
        span: DUMMY_SP,
        expr: if needs_paren {
            Box::new(Expr::Paren(swc_ecma_ast::ParenExpr {
                span: DUMMY_SP,
                expr: Box::new(assign),
            }))
        } else {
            Box::new(assign)
        },
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

fn collect_stmt_bindings_including_nested_blocks(stmt: &Stmt, out: &mut HashSet<String>) {
    struct Collector<'a> {
        out: &'a mut HashSet<String>,
    }

    impl Visit for Collector<'_> {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_decl(&mut self, decl: &Decl) {
            match decl {
                Decl::Var(var_decl) => {
                    for declarator in &var_decl.decls {
                        collect_pattern_bindings(&declarator.name, self.out);
                    }
                }
                Decl::Fn(fn_decl) => {
                    self.out.insert(fn_decl.ident.sym.to_string());
                }
                Decl::Class(class_decl) => {
                    self.out.insert(class_decl.ident.sym.to_string());
                }
                _ => {}
            }
        }
    }

    let mut collector = Collector { out };
    stmt.visit_with(&mut collector);
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
