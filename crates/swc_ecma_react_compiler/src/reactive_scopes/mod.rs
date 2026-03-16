use std::collections::{HashMap, HashSet};

use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    op, ArrowExpr, AssignExpr, AssignTarget, BindingIdent, BlockStmt, CallExpr, Callee,
    ComputedPropName, Decl, Expr, ExprOrSpread, ExprStmt, Function, Ident, IfStmt, Lit, MemberExpr,
    MemberProp, Number, Pat, Stmt, VarDecl, VarDeclKind, VarDeclarator,
};
use swc_ecma_visit::{Visit, VisitMut, VisitMutWith, VisitWith};

use crate::{hir::HirFunction, transform::ReactFunctionType, utils::directive_from_stmt};

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

pub fn build_reactive_function(hir: &HirFunction) -> ReactiveFunction {
    function_to_reactive(&hir.function, hir.id.clone(), hir.fn_type)
}

pub fn codegen_function(mut reactive: ReactiveFunction) -> CodegenFunction {
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
        outlined: Vec::new(),
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

    let cache_ident = if !reserved.contains("$") {
        reserved.insert("$".to_string());
        Ident::new_no_ctxt("$".into(), DUMMY_SP)
    } else {
        fresh_ident("$", &mut reserved)
    };

    let mut next_slot = 0u32;
    let mut memo_blocks = 0u32;
    let mut memo_values = 0u32;

    let mut stmts = std::mem::take(&mut reactive.body.stmts);
    let directive_end = stmts
        .iter()
        .take_while(|stmt| directive_from_stmt(stmt).is_some())
        .count();

    let mut transformed = Vec::new();
    transformed.extend(stmts.drain(..directive_end));
    transformed.extend(param_prologue);

    if !matches!(stmts.last(), Some(Stmt::Return(return_stmt)) if return_stmt.arg.is_some()) {
        transformed.extend(stmts);
        reactive.body.stmts = transformed;
        return (0, 0, 0, 0, 0);
    }

    let mut prefix_index = 0usize;
    while prefix_index < stmts.len().saturating_sub(1) {
        let Some((binding, init)) = extract_memoizable_single_decl(&stmts[prefix_index]) else {
            break;
        };

        if contains_direct_call(&stmts[prefix_index + 1..])
            || contains_complex_assignment(&stmts[prefix_index + 1..])
        {
            break;
        }

        if binding_reassigned_or_mutated_after(&stmts[prefix_index + 1..], binding.sym.as_ref()) {
            break;
        }

        let local = HashSet::new();
        let deps = collect_dependencies_from_expr(&init, &known_bindings, &local);
        let temp = fresh_temp_ident(&mut next_temp, &mut reserved);
        let value_slot = next_slot + deps.len() as u32;
        let mut compute_stmts = vec![assign_stmt(
            AssignTarget::from(temp.clone()),
            Box::new((*init).clone()),
        )];

        transformed.extend(build_memoized_block(
            &cache_ident,
            next_slot,
            &deps,
            &temp,
            std::mem::take(&mut compute_stmts),
        ));
        transformed.push(make_var_decl(
            VarDeclKind::Const,
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

    let mut tail = stmts[prefix_index..].to_vec();
    if !tail.is_empty() {
        if let Some(return_expr) = tail.last().and_then(|stmt| match stmt {
            Stmt::Return(return_stmt) => return_stmt.arg.clone(),
            _ => None,
        }) {
            tail.pop();
            let mut result_ident = None;
            if let Expr::Ident(result) = &*return_expr {
                if rewrite_result_binding_to_assignment(&mut tail, result.sym.as_ref()) {
                    result_ident = Some(result.clone());
                }
            }

            prune_noop_identifier_exprs(&mut tail);
            promote_immutable_lets_to_const(&mut tail);
            normalize_static_string_members_in_stmts(&mut tail);

            let temp =
                result_ident.unwrap_or_else(|| fresh_temp_ident(&mut next_temp, &mut reserved));

            let mut compute_stmts = tail;
            let should_assign_result =
                !matches!(&*return_expr, Expr::Ident(ident) if ident.sym == temp.sym);
            if should_assign_result {
                compute_stmts.push(assign_stmt(AssignTarget::from(temp.clone()), return_expr));
            }

            let mut local_bindings = HashSet::new();
            for stmt in &compute_stmts {
                collect_stmt_bindings(stmt, &mut local_bindings);
            }
            let deps =
                collect_dependencies_from_stmts(&compute_stmts, &known_bindings, &local_bindings);

            let value_slot = next_slot + deps.len() as u32;
            transformed.extend(build_memoized_block(
                &cache_ident,
                next_slot,
                &deps,
                &temp,
                compute_stmts,
            ));
            transformed.push(Stmt::Return(swc_ecma_ast::ReturnStmt {
                span: DUMMY_SP,
                arg: Some(Box::new(Expr::Ident(temp))),
            }));

            next_slot = value_slot + 1;
            memo_blocks += 1;
            memo_values += 1;
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
    deps: &[Ident],
    temp_ident: &Ident,
    mut compute_stmts: Vec<Stmt>,
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
            right: Box::new(Expr::Ident(deps[0].clone())),
        }));

        for (index, dep) in deps.iter().enumerate().skip(1) {
            let dep_check = Expr::Bin(swc_ecma_ast::BinExpr {
                span: DUMMY_SP,
                op: op!("!=="),
                left: make_cache_index_expr(cache_ident, slot_start + index as u32),
                right: Box::new(Expr::Ident(dep.clone())),
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
            Box::new(Expr::Ident(dep.clone())),
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

    vec![
        make_var_decl(
            VarDeclKind::Let,
            Pat::Ident(BindingIdent {
                id: temp_ident.clone(),
                type_ann: None,
            }),
            None,
        ),
        Stmt::If(IfStmt {
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
        }),
    ]
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

fn collect_dependencies_from_expr(
    expr: &Expr,
    known_bindings: &HashMap<String, bool>,
    local_bindings: &HashSet<String>,
) -> Vec<Ident> {
    struct DependencyCollector<'a> {
        known_bindings: &'a HashMap<String, bool>,
        local_bindings: &'a HashSet<String>,
        seen: HashSet<String>,
        deps: Vec<Ident>,
    }

    impl Visit for DependencyCollector<'_> {
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

            let Some(stable) = self.known_bindings.get(name) else {
                return;
            };
            if *stable {
                return;
            }

            if self.seen.insert(name.to_string()) {
                self.deps.push(ident.clone());
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
    collector.deps
}

fn collect_dependencies_from_stmts(
    stmts: &[Stmt],
    known_bindings: &HashMap<String, bool>,
    local_bindings: &HashSet<String>,
) -> Vec<Ident> {
    struct DependencyCollector<'a> {
        known_bindings: &'a HashMap<String, bool>,
        local_bindings: &'a HashSet<String>,
        seen: HashSet<String>,
        deps: Vec<Ident>,
    }

    impl Visit for DependencyCollector<'_> {
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

            let Some(stable) = self.known_bindings.get(name) else {
                return;
            };
            if *stable {
                return;
            }

            if self.seen.insert(name.to_string()) {
                self.deps.push(ident.clone());
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
    collector.deps
}

fn prune_noop_identifier_exprs(stmts: &mut Vec<Stmt>) {
    stmts.retain(|stmt| {
        !matches!(
            stmt,
            Stmt::Expr(expr_stmt) if matches!(&*expr_stmt.expr, Expr::Ident(_))
        )
    });
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

fn binding_reassigned_or_mutated_after(stmts: &[Stmt], name: &str) -> bool {
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
            if let Callee::Expr(expr) = &call.callee {
                if matches!(&**expr, Expr::Ident(_)) {
                    self.found = true;
                    return;
                }
            }
            call.visit_children_with(self);
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
        let Some(init) = &declarator.init else {
            continue;
        };

        *stmt = assign_stmt(AssignTarget::from(binding.id.clone()), init.clone());
        return true;
    }

    false
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
