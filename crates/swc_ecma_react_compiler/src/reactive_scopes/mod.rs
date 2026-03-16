use std::collections::HashSet;

use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    op, AssignExpr, AssignTarget, BindingIdent, BlockStmt, CallExpr, Callee, ComputedPropName,
    Expr, ExprOrSpread, ExprStmt, Function, Ident, IfStmt, Lit, MemberExpr, MemberProp, Number,
    Pat, Stmt, VarDecl, VarDeclKind, VarDeclarator,
};
use swc_ecma_visit::{Visit, VisitWith};

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
        memoize_return_expression(&mut reactive);

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

/// Phase 1 codegen:
/// Memoizes the final return expression for component/hook-like functions.
fn memoize_return_expression(reactive: &mut ReactiveFunction) -> (u32, u32, u32, u32, u32) {
    if !matches!(
        reactive.fn_type,
        ReactFunctionType::Component | ReactFunctionType::Hook
    ) {
        return (0, 0, 0, 0, 0);
    }

    let mut return_index = reactive.body.stmts.len().saturating_sub(1);
    let Some(Stmt::Return(_)) = reactive.body.stmts.get(return_index) else {
        return (0, 0, 0, 0, 0);
    };
    let return_expr = match &mut reactive.body.stmts[return_index] {
        Stmt::Return(return_stmt) => return_stmt.arg.take(),
        _ => None,
    };
    let Some(return_expr) = return_expr else {
        return (0, 0, 0, 0, 0);
    };

    let mut known_names = HashSet::new();
    for pat in &reactive.params {
        collect_pattern_bindings(pat, &mut known_names);
    }
    if reactive.body.stmts.len() > 1 {
        for stmt in reactive
            .body
            .stmts
            .iter()
            .take(reactive.body.stmts.len().saturating_sub(1))
        {
            collect_stmt_bindings(stmt, &mut known_names);
        }
    }

    let deps = collect_dependencies(&return_expr, &known_names);
    if deps.is_empty() {
        if let Stmt::Return(return_stmt) = &mut reactive.body.stmts[return_index] {
            return_stmt.arg = Some(return_expr);
        }
        return (0, 0, 0, 0, 0);
    }

    let mut reserved = known_names;
    let cache_ident = if !reserved.contains("$") {
        reserved.insert("$".into());
        Ident::new_no_ctxt("$".into(), DUMMY_SP)
    } else {
        fresh_ident("_react_compiler_cache", &mut reserved)
    };
    let temp_ident = fresh_ident("_react_compiler_t0", &mut reserved);

    // Keep directive prologue at the beginning.
    let directive_end = reactive
        .body
        .stmts
        .iter()
        .take_while(|stmt| directive_from_stmt(stmt).is_some())
        .count();
    reactive.body.stmts.insert(
        directive_end,
        make_let_decl(
            Pat::Ident(BindingIdent {
                id: cache_ident.clone(),
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
                        value: (deps.len() + 1) as f64,
                        raw: None,
                    }))),
                }],
                type_args: None,
            }))),
        ),
    );
    if directive_end <= return_index {
        return_index += 1;
    }

    reactive.body.stmts.insert(
        return_index,
        make_let_decl(
            Pat::Ident(BindingIdent {
                id: temp_ident.clone(),
                type_ann: None,
            }),
            None,
        ),
    );
    return_index += 1;

    let mut if_test = make_cache_index_expr(&cache_ident, 0);
    if_test = Box::new(Expr::Bin(swc_ecma_ast::BinExpr {
        span: DUMMY_SP,
        op: op!("!=="),
        left: if_test,
        right: Box::new(Expr::Ident(deps[0].clone())),
    }));

    for (index, dep) in deps.iter().enumerate().skip(1) {
        let dep_check = Expr::Bin(swc_ecma_ast::BinExpr {
            span: DUMMY_SP,
            op: op!("!=="),
            left: make_cache_index_expr(&cache_ident, index as u32),
            right: Box::new(Expr::Ident(dep.clone())),
        });

        if_test = Box::new(Expr::Bin(swc_ecma_ast::BinExpr {
            span: DUMMY_SP,
            op: op!("||"),
            left: if_test,
            right: Box::new(dep_check),
        }));
    }

    let mut consequent_stmts = Vec::with_capacity(deps.len() + 2);
    consequent_stmts.push(assign_stmt(
        AssignTarget::from(temp_ident.clone()),
        return_expr.clone(),
    ));
    for (index, dep) in deps.iter().enumerate() {
        consequent_stmts.push(assign_stmt(
            AssignTarget::from(make_cache_member(&cache_ident, index as u32)),
            Box::new(Expr::Ident(dep.clone())),
        ));
    }
    consequent_stmts.push(assign_stmt(
        AssignTarget::from(make_cache_member(&cache_ident, deps.len() as u32)),
        Box::new(Expr::Ident(temp_ident.clone())),
    ));

    let alternate_stmts = vec![assign_stmt(
        AssignTarget::from(temp_ident.clone()),
        make_cache_index_expr(&cache_ident, deps.len() as u32),
    )];

    reactive.body.stmts.insert(
        return_index,
        Stmt::If(IfStmt {
            span: DUMMY_SP,
            test: if_test,
            cons: Box::new(Stmt::Block(BlockStmt {
                span: DUMMY_SP,
                ctxt: Default::default(),
                stmts: consequent_stmts,
            })),
            alt: Some(Box::new(Stmt::Block(BlockStmt {
                span: DUMMY_SP,
                ctxt: Default::default(),
                stmts: alternate_stmts,
            }))),
        }),
    );
    return_index += 1;

    if let Stmt::Return(return_stmt) = &mut reactive.body.stmts[return_index] {
        return_stmt.arg = Some(Box::new(Expr::Ident(temp_ident)));
    }

    (
        (deps.len() + 1) as u32,
        1, // one memoized block
        1, // one memoized return value
        0,
        0,
    )
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

fn make_let_decl(name: Pat, init: Option<Box<Expr>>) -> Stmt {
    Stmt::Decl(swc_ecma_ast::Decl::Var(Box::new(VarDecl {
        span: DUMMY_SP,
        ctxt: Default::default(),
        kind: VarDeclKind::Let,
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

fn collect_dependencies(expr: &Expr, known_names: &HashSet<String>) -> Vec<Ident> {
    #[derive(Default)]
    struct DependencyCollector {
        known: HashSet<String>,
        seen: HashSet<String>,
        deps: Vec<Ident>,
    }

    impl Visit for DependencyCollector {
        fn visit_arrow_expr(&mut self, _: &swc_ecma_ast::ArrowExpr) {
            // Do not capture from nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Do not capture from nested functions.
        }

        fn visit_ident(&mut self, ident: &Ident) {
            let name = ident.sym.as_ref();
            if self.known.contains(name) && self.seen.insert(name.to_string()) {
                self.deps.push(ident.clone());
            }
        }
    }

    let mut collector = DependencyCollector {
        known: known_names.clone(),
        ..Default::default()
    };
    expr.visit_with(&mut collector);
    collector.deps
}
