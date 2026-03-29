use std::collections::{HashMap, HashSet};

use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    AssignExpr, AssignOp, AssignTarget, BinaryOp, BindingIdent, BlockStmtOrExpr, Decl, Expr,
    Function, Ident, Lit, MemberProp, Number, Pat, Prop, PropOrSpread, SimpleAssignTarget, Stmt,
    UnaryOp, UpdateExpr, UpdateOp, VarDeclarator,
};
use swc_ecma_visit::{Visit, VisitMut, VisitMutWith, VisitWith};

use crate::hir::HirFunction;

#[derive(Debug, Clone, PartialEq)]
enum ConstValue {
    Number(f64),
    Bool(bool),
    String(String),
    Null,
    Undefined,
}

impl ConstValue {
    fn to_expr(&self) -> Box<Expr> {
        match self {
            Self::Number(value) => Box::new(Expr::Lit(Lit::Num(Number {
                span: DUMMY_SP,
                value: *value,
                raw: None,
            }))),
            Self::Bool(value) => Box::new(Expr::Lit(Lit::Bool(swc_ecma_ast::Bool {
                span: DUMMY_SP,
                value: *value,
            }))),
            Self::String(value) => Box::new(Expr::Lit(Lit::Str(swc_ecma_ast::Str {
                span: DUMMY_SP,
                value: value.as_str().into(),
                raw: None,
            }))),
            Self::Null => Box::new(Expr::Lit(Lit::Null(swc_ecma_ast::Null { span: DUMMY_SP }))),
            Self::Undefined => Box::new(Expr::Ident(Ident::new_no_ctxt(
                "undefined".into(),
                DUMMY_SP,
            ))),
        }
    }
}

/// Runs lightweight constant propagation directly on the lowered function AST.
///
/// The pass is intentionally conservative: it tracks only simple identifier
/// assignments and clears state around control-flow constructs.
pub fn constant_propagation(hir: &mut HirFunction) {
    run_constant_propagation(&mut hir.function);
}

fn run_constant_propagation(function: &mut Function) {
    let Some(body) = function.body.as_mut() else {
        return;
    };

    let mut env = HashMap::<String, ConstValue>::new();
    let mut const_bindings = HashSet::<String>::new();
    for stmt in &mut body.stmts {
        propagate_stmt(stmt, &mut env, &mut const_bindings);
    }
}

fn propagate_stmt(
    stmt: &mut Stmt,
    env: &mut HashMap<String, ConstValue>,
    const_bindings: &mut HashSet<String>,
) {
    rewrite_known_computed_properties(stmt, env);

    match stmt {
        Stmt::Block(block) => {
            for stmt in &mut block.stmts {
                propagate_stmt(stmt, env, const_bindings);
            }
        }
        Stmt::Decl(Decl::Var(var_decl)) => {
            for decl in &mut var_decl.decls {
                propagate_var_decl(
                    decl,
                    matches!(var_decl.kind, swc_ecma_ast::VarDeclKind::Const),
                    env,
                    const_bindings,
                );
            }
        }
        Stmt::Expr(expr_stmt) => match &mut *expr_stmt.expr {
            Expr::Assign(assign) => propagate_assign_expr(assign, env, const_bindings),
            Expr::Update(update) => propagate_update_expr(update, env, const_bindings),
            _ => {
                fold_constants_in_expr(&mut expr_stmt.expr, env);
                invalidate_assigned_bindings_in_expr(&expr_stmt.expr, env, const_bindings);
            }
        },
        Stmt::Return(return_stmt) => {
            if let Some(arg) = &mut return_stmt.arg {
                fold_constants_in_expr(arg, env);
                if let Some(value) = eval_expr(arg, env) {
                    *arg = value.to_expr();
                }
            }
        }
        Stmt::If(if_stmt) => {
            fold_constants_in_expr(&mut if_stmt.test, env);
            let Some(test) = eval_expr(&if_stmt.test, env) else {
                if try_propagate_phi_assignment(if_stmt, env) {
                    return;
                }
                env.clear();
                return;
            };

            let mut replacement = if test.is_truthy() {
                *if_stmt.cons.clone()
            } else if let Some(alt) = &if_stmt.alt {
                *alt.clone()
            } else {
                Stmt::Empty(swc_ecma_ast::EmptyStmt { span: DUMMY_SP })
            };
            if let Stmt::Block(block) = &replacement {
                if can_unwrap_constant_folded_if_block(block) {
                    replacement = block.stmts[0].clone();
                }
            }
            propagate_stmt(&mut replacement, env, const_bindings);
            *stmt = replacement;
        }
        // Keep propagation conservative around branching/loops.
        Stmt::Switch(_)
        | Stmt::ForIn(_)
        | Stmt::ForOf(_)
        | Stmt::DoWhile(_)
        | Stmt::Try(_)
        | Stmt::With(_)
        | Stmt::Labeled(_) => {
            env.clear();
            const_bindings.clear();
        }
        Stmt::For(for_stmt) => {
            propagate_for_stmt(for_stmt, env);
            env.clear();
            const_bindings.clear();
        }
        Stmt::While(while_stmt) => {
            propagate_while_stmt(while_stmt, env);
            env.clear();
            const_bindings.clear();
        }
        _ => {}
    }
}

fn try_propagate_phi_assignment(
    if_stmt: &mut swc_ecma_ast::IfStmt,
    env: &mut HashMap<String, ConstValue>,
) -> bool {
    let Some((cons_name, cons_value)) = branch_assignment_const_value(&if_stmt.cons, env) else {
        return false;
    };
    let Some(alt_stmt) = &if_stmt.alt else {
        return false;
    };
    let Some((alt_name, alt_value)) = branch_assignment_const_value(alt_stmt, env) else {
        return false;
    };

    if cons_name != alt_name || !cons_value.strict_eq(&alt_value) {
        return false;
    }

    env.insert(cons_name, cons_value);
    if_stmt.cons = Box::new(Stmt::Block(swc_ecma_ast::BlockStmt {
        span: DUMMY_SP,
        ctxt: Default::default(),
        stmts: Vec::new(),
    }));
    if_stmt.alt = None;
    true
}

fn branch_assignment_const_value(
    stmt: &Stmt,
    env: &HashMap<String, ConstValue>,
) -> Option<(String, ConstValue)> {
    let stmt = unwrap_single_stmt_block(stmt);
    let Stmt::Expr(expr_stmt) = stmt else {
        return None;
    };
    let Expr::Assign(assign) = &*expr_stmt.expr else {
        return None;
    };
    if assign.op != AssignOp::Assign {
        return None;
    }

    let name = assign_target_ident_name(&assign.left)?;
    let value = eval_expr(&assign.right, env)?;
    Some((name, value))
}

fn unwrap_single_stmt_block(stmt: &Stmt) -> &Stmt {
    match stmt {
        Stmt::Block(block) if block.stmts.len() == 1 => &block.stmts[0],
        _ => stmt,
    }
}

fn propagate_for_stmt(for_stmt: &mut swc_ecma_ast::ForStmt, env: &HashMap<String, ConstValue>) {
    let mut loop_env = env.clone();

    if let Some(init) = &mut for_stmt.init {
        match init {
            swc_ecma_ast::VarDeclOrExpr::VarDecl(var_decl) => {
                for decl in &mut var_decl.decls {
                    let Some(name) = pat_ident_name(&decl.name) else {
                        continue;
                    };

                    if let Some(init_expr) = &mut decl.init {
                        fold_constants_in_expr(init_expr, &loop_env);
                        if matches!(var_decl.kind, swc_ecma_ast::VarDeclKind::Const) {
                            if let Some(value) = eval_expr(init_expr, &loop_env) {
                                loop_env.insert(name, value);
                            } else {
                                loop_env.remove(&name);
                            }
                        } else {
                            loop_env.remove(&name);
                        }
                    } else {
                        loop_env.remove(&name);
                    }
                }
            }
            swc_ecma_ast::VarDeclOrExpr::Expr(expr) => {
                fold_constants_in_expr(expr, &loop_env);
            }
        }
    }

    if let Some(test) = &mut for_stmt.test {
        fold_constants_in_expr(test, &loop_env);
        if let Some(value) = eval_expr(test, &loop_env) {
            *test = value.to_expr();
        }
    }

    if let Some(update) = &mut for_stmt.update {
        fold_constants_in_expr(update, &loop_env);
        if let Some(value) = eval_expr(update, &loop_env) {
            *update = value.to_expr();
        }
    }
}

fn propagate_while_stmt(
    while_stmt: &mut swc_ecma_ast::WhileStmt,
    env: &HashMap<String, ConstValue>,
) {
    let mut loop_env = env.clone();
    let mut assigned_in_body = HashSet::new();
    collect_ident_assignments_in_stmt(&while_stmt.body, &mut assigned_in_body);
    for name in assigned_in_body {
        loop_env.remove(name.as_str());
    }

    fold_constants_in_expr(&mut while_stmt.test, &loop_env);
    if let Some(value) = eval_expr(&while_stmt.test, &loop_env) {
        while_stmt.test = value.to_expr();
    }
}

fn collect_ident_assignments_in_stmt(stmt: &Stmt, out: &mut HashSet<String>) {
    struct Finder<'a> {
        out: &'a mut HashSet<String>,
    }

    impl Visit for Finder<'_> {
        fn visit_assign_expr(&mut self, assign: &AssignExpr) {
            if let Some(name) = assign_target_ident_name(&assign.left) {
                self.out.insert(name);
            }
            assign.visit_children_with(self);
        }

        fn visit_update_expr(&mut self, update: &UpdateExpr) {
            if let Expr::Ident(ident) = &*update.arg {
                self.out.insert(ident.sym.to_string());
            }
            update.visit_children_with(self);
        }
    }

    let mut finder = Finder { out };
    stmt.visit_with(&mut finder);
}

fn can_unwrap_constant_folded_if_block(block: &swc_ecma_ast::BlockStmt) -> bool {
    if block.stmts.len() != 1 {
        return false;
    }

    !matches!(block.stmts.first(), Some(Stmt::Decl(_)))
}

fn rewrite_known_computed_properties(stmt: &mut Stmt, env: &HashMap<String, ConstValue>) {
    struct Rewriter<'a> {
        env: &'a HashMap<String, ConstValue>,
    }

    impl VisitMut for Rewriter<'_> {
        fn visit_mut_member_expr(&mut self, member: &mut swc_ecma_ast::MemberExpr) {
            member.visit_mut_children_with(self);
            if let MemberProp::Computed(computed) = &mut member.prop {
                if let Some(value) = eval_expr(&computed.expr, self.env) {
                    computed.expr = value.to_expr();
                }
            }
        }
    }

    stmt.visit_mut_with(&mut Rewriter { env });
}

fn propagate_var_decl(
    decl: &mut VarDeclarator,
    is_const_decl: bool,
    env: &mut HashMap<String, ConstValue>,
    const_bindings: &mut HashSet<String>,
) {
    let Some(name) = pat_ident_name(&decl.name) else {
        return;
    };

    if let Some(init) = &mut decl.init {
        inline_const_captures_in_expr(init, env, const_bindings);
        fold_constants_in_expr(init, env);
        invalidate_env_bindings_assigned_in_expr(init, env, const_bindings);

        if let Some(value) = eval_expr(init, env) {
            env.insert(name.clone(), value);
            if is_const_decl {
                const_bindings.insert(name);
            } else {
                const_bindings.remove(name.as_str());
            }
            return;
        }
    }

    env.remove(&name);
    const_bindings.remove(name.as_str());
}

fn propagate_assign_expr(
    assign: &mut AssignExpr,
    env: &mut HashMap<String, ConstValue>,
    const_bindings: &mut HashSet<String>,
) {
    let Some(name) = assign_target_ident_name(&assign.left) else {
        // Member / pattern assignments may mutate aliased objects.
        env.clear();
        const_bindings.clear();
        return;
    };

    fold_constants_in_expr(&mut assign.right, env);
    let rhs = eval_expr(&assign.right, env);
    let next = match assign.op {
        AssignOp::Assign => rhs,
        _ => {
            let lhs = env.get(&name).cloned();
            match (lhs, rhs) {
                (Some(lhs), Some(rhs)) => apply_assign_op(assign.op, lhs, rhs),
                _ => None,
            }
        }
    };

    if let Some(value) = next {
        env.insert(name.clone(), value);
        const_bindings.remove(name.as_str());
    } else {
        env.remove(&name);
        const_bindings.remove(name.as_str());
    }
}

fn propagate_update_expr(
    update: &mut UpdateExpr,
    env: &mut HashMap<String, ConstValue>,
    const_bindings: &mut HashSet<String>,
) {
    let Expr::Ident(ident) = &*update.arg else {
        env.clear();
        const_bindings.clear();
        return;
    };

    let name = ident.sym.to_string();
    let Some(current) = env.get(&name).cloned() else {
        return;
    };
    let Some(number) = current.to_number() else {
        env.remove(&name);
        const_bindings.remove(name.as_str());
        return;
    };

    let next = match update.op {
        UpdateOp::PlusPlus => ConstValue::Number(number + 1.0),
        UpdateOp::MinusMinus => ConstValue::Number(number - 1.0),
    };

    env.insert(name.clone(), next);
    const_bindings.remove(name.as_str());
}

fn invalidate_assigned_bindings_in_expr(
    expr: &Expr,
    env: &mut HashMap<String, ConstValue>,
    const_bindings: &mut HashSet<String>,
) {
    struct Finder {
        assigned: Vec<String>,
        clear_all: bool,
    }

    impl Visit for Finder {
        fn visit_assign_expr(&mut self, assign: &AssignExpr) {
            if let Some(name) = assign_target_ident_name(&assign.left) {
                self.assigned.push(name);
            } else {
                self.clear_all = true;
            }
            assign.visit_children_with(self);
        }

        fn visit_update_expr(&mut self, update: &UpdateExpr) {
            if let Expr::Ident(ident) = &*update.arg {
                self.assigned.push(ident.sym.to_string());
            } else {
                self.clear_all = true;
            }
            update.visit_children_with(self);
        }
    }

    let mut finder = Finder {
        assigned: Vec::new(),
        clear_all: false,
    };
    expr.visit_with(&mut finder);

    if finder.clear_all {
        env.clear();
        const_bindings.clear();
        return;
    }

    for name in finder.assigned {
        env.remove(name.as_str());
        const_bindings.remove(name.as_str());
    }
}

fn invalidate_env_bindings_assigned_in_expr(
    expr: &Expr,
    env: &mut HashMap<String, ConstValue>,
    const_bindings: &mut HashSet<String>,
) {
    let tracked = env.keys().cloned().collect::<HashSet<_>>();
    if tracked.is_empty() {
        return;
    }

    struct Finder<'a> {
        tracked: &'a HashSet<String>,
        assigned: HashSet<String>,
    }

    impl Visit for Finder<'_> {
        fn visit_assign_expr(&mut self, assign: &AssignExpr) {
            if let Some(name) = assign_target_ident_name(&assign.left) {
                if self.tracked.contains(&name) {
                    self.assigned.insert(name);
                }
            }
            assign.visit_children_with(self);
        }

        fn visit_update_expr(&mut self, update: &UpdateExpr) {
            if let Expr::Ident(ident) = &*update.arg {
                let name = ident.sym.to_string();
                if self.tracked.contains(&name) {
                    self.assigned.insert(name);
                }
            }
            update.visit_children_with(self);
        }
    }

    let mut finder = Finder {
        tracked: &tracked,
        assigned: HashSet::new(),
    };
    expr.visit_with(&mut finder);
    for name in finder.assigned {
        env.remove(name.as_str());
        const_bindings.remove(name.as_str());
    }
}

fn inline_const_captures_in_function_initializer(
    init: &mut Box<Expr>,
    env: &HashMap<String, ConstValue>,
    const_bindings: &HashSet<String>,
) {
    match &mut **init {
        Expr::Arrow(arrow) => {
            inline_const_captures_in_arrow(arrow, env, const_bindings);
        }
        Expr::Fn(fn_expr) => {
            inline_const_captures_in_function(&mut fn_expr.function, env, const_bindings);
        }
        _ => {}
    }
}

fn fold_constants_in_expr(expr: &mut Box<Expr>, env: &HashMap<String, ConstValue>) {
    expr.visit_mut_with(&mut ExprConstantFolder {
        env,
        in_callee: false,
    });
}

fn inline_const_captures_in_expr(
    expr: &mut Box<Expr>,
    env: &HashMap<String, ConstValue>,
    const_bindings: &HashSet<String>,
) {
    inline_const_captures_in_function_initializer(expr, env, const_bindings);

    match &mut **expr {
        Expr::Object(object) => {
            for prop in &mut object.props {
                let PropOrSpread::Prop(prop) = prop else {
                    continue;
                };
                match &mut **prop {
                    Prop::Method(method) => {
                        inline_const_captures_in_function(
                            &mut method.function,
                            env,
                            const_bindings,
                        );
                    }
                    Prop::Getter(getter) => {
                        if let Some(body) = &mut getter.body {
                            let locals = HashSet::new();
                            body.visit_mut_with(&mut CapturedConstRewriter {
                                env,
                                const_bindings,
                                local_bindings: &locals,
                                in_callee: false,
                            });
                        }
                    }
                    Prop::Setter(setter) => {
                        let mut locals = HashSet::new();
                        collect_pattern_bindings(&setter.param, &mut locals);
                        let mut rewriter = CapturedConstRewriter {
                            env,
                            const_bindings,
                            local_bindings: &locals,
                            in_callee: false,
                        };
                        if let Some(body) = &mut setter.body {
                            body.visit_mut_with(&mut rewriter);
                        }
                    }
                    Prop::KeyValue(key_value) => {
                        inline_const_captures_in_expr(&mut key_value.value, env, const_bindings);
                    }
                    _ => {}
                }
            }
        }
        Expr::Array(array) => {
            for elem in array.elems.iter_mut().flatten() {
                if elem.spread.is_none() {
                    inline_const_captures_in_expr(&mut elem.expr, env, const_bindings);
                }
            }
        }
        Expr::Paren(paren) => inline_const_captures_in_expr(&mut paren.expr, env, const_bindings),
        Expr::TsAs(ts_as) => inline_const_captures_in_expr(&mut ts_as.expr, env, const_bindings),
        Expr::TsTypeAssertion(type_assertion) => {
            inline_const_captures_in_expr(&mut type_assertion.expr, env, const_bindings);
        }
        Expr::TsNonNull(ts_non_null) => {
            inline_const_captures_in_expr(&mut ts_non_null.expr, env, const_bindings)
        }
        Expr::TsSatisfies(ts_satisfies) => {
            inline_const_captures_in_expr(&mut ts_satisfies.expr, env, const_bindings);
        }
        Expr::TsInstantiation(ts_instantiation) => {
            inline_const_captures_in_expr(&mut ts_instantiation.expr, env, const_bindings);
        }
        _ => {}
    }
}

fn inline_const_captures_in_arrow(
    arrow: &mut swc_ecma_ast::ArrowExpr,
    env: &HashMap<String, ConstValue>,
    const_bindings: &HashSet<String>,
) {
    let local_bindings = collect_arrow_local_bindings(arrow);
    let mut rewriter = CapturedConstRewriter {
        env,
        const_bindings,
        local_bindings: &local_bindings,
        in_callee: false,
    };
    match &mut *arrow.body {
        BlockStmtOrExpr::BlockStmt(block) => {
            block.visit_mut_with(&mut rewriter);
        }
        BlockStmtOrExpr::Expr(expr) => {
            expr.visit_mut_with(&mut rewriter);
        }
    }
}

fn inline_const_captures_in_function(
    function: &mut Function,
    env: &HashMap<String, ConstValue>,
    const_bindings: &HashSet<String>,
) {
    let local_bindings = collect_function_local_bindings(function);
    let mut rewriter = CapturedConstRewriter {
        env,
        const_bindings,
        local_bindings: &local_bindings,
        in_callee: false,
    };
    if let Some(body) = &mut function.body {
        body.visit_mut_with(&mut rewriter);
    }
}

fn collect_arrow_local_bindings(arrow: &swc_ecma_ast::ArrowExpr) -> HashSet<String> {
    let mut bindings = HashSet::new();
    for pat in &arrow.params {
        collect_pattern_bindings(pat, &mut bindings);
    }

    if let BlockStmtOrExpr::BlockStmt(block) = &*arrow.body {
        let mut collector = LocalBindingCollector {
            bindings: &mut bindings,
        };
        block.visit_with(&mut collector);
    }

    bindings
}

fn collect_function_local_bindings(function: &Function) -> HashSet<String> {
    let mut bindings = HashSet::new();
    for param in &function.params {
        collect_pattern_bindings(&param.pat, &mut bindings);
    }

    if let Some(body) = &function.body {
        let mut collector = LocalBindingCollector {
            bindings: &mut bindings,
        };
        body.visit_with(&mut collector);
    }

    bindings
}

fn collect_pattern_bindings(pat: &Pat, out: &mut HashSet<String>) {
    match pat {
        Pat::Ident(binding) => {
            out.insert(binding.id.sym.to_string());
        }
        Pat::Array(array) => {
            for elem in array.elems.iter().flatten() {
                collect_pattern_bindings(elem, out);
            }
        }
        Pat::Object(object) => {
            for prop in &object.props {
                match prop {
                    swc_ecma_ast::ObjectPatProp::KeyValue(key_value) => {
                        collect_pattern_bindings(&key_value.value, out);
                    }
                    swc_ecma_ast::ObjectPatProp::Assign(assign) => {
                        out.insert(assign.key.id.sym.to_string());
                    }
                    swc_ecma_ast::ObjectPatProp::Rest(rest) => {
                        collect_pattern_bindings(&rest.arg, out);
                    }
                }
            }
        }
        Pat::Assign(assign) => {
            collect_pattern_bindings(&assign.left, out);
        }
        Pat::Rest(rest) => {
            collect_pattern_bindings(&rest.arg, out);
        }
        Pat::Invalid(_) | Pat::Expr(_) => {}
    }
}

struct LocalBindingCollector<'a> {
    bindings: &'a mut HashSet<String>,
}

impl Visit for LocalBindingCollector<'_> {
    fn visit_arrow_expr(&mut self, _: &swc_ecma_ast::ArrowExpr) {
        // Skip nested function scopes.
    }

    fn visit_function(&mut self, _: &Function) {
        // Skip nested function scopes.
    }

    fn visit_fn_decl(&mut self, fn_decl: &swc_ecma_ast::FnDecl) {
        self.bindings.insert(fn_decl.ident.sym.to_string());
    }

    fn visit_var_declarator(&mut self, decl: &VarDeclarator) {
        collect_pattern_bindings(&decl.name, self.bindings);
        if let Some(init) = &decl.init {
            init.visit_with(self);
        }
    }
}

struct CapturedConstRewriter<'a> {
    env: &'a HashMap<String, ConstValue>,
    const_bindings: &'a HashSet<String>,
    local_bindings: &'a HashSet<String>,
    in_callee: bool,
}

struct ExprConstantFolder<'a> {
    env: &'a HashMap<String, ConstValue>,
    in_callee: bool,
}

impl VisitMut for ExprConstantFolder<'_> {
    fn visit_mut_arrow_expr(&mut self, _: &mut swc_ecma_ast::ArrowExpr) {
        // Skip nested function scopes to avoid shadowing hazards.
    }

    fn visit_mut_function(&mut self, _: &mut Function) {
        // Skip nested function scopes to avoid shadowing hazards.
    }

    fn visit_mut_assign_expr(&mut self, assign: &mut AssignExpr) {
        assign.right.visit_mut_with(self);
    }

    fn visit_mut_update_expr(&mut self, _: &mut UpdateExpr) {}

    fn visit_mut_call_expr(&mut self, call: &mut swc_ecma_ast::CallExpr) {
        if let swc_ecma_ast::Callee::Expr(callee_expr) = &mut call.callee {
            let prev = self.in_callee;
            self.in_callee = true;
            callee_expr.visit_mut_with(self);
            self.in_callee = prev;
        }

        for arg in &mut call.args {
            arg.visit_mut_with(self);
        }
    }

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        expr.visit_mut_children_with(self);

        if let Expr::Object(object) = expr {
            for prop in &mut object.props {
                let PropOrSpread::Prop(prop) = prop else {
                    continue;
                };
                let Prop::Shorthand(ident) = &**prop else {
                    continue;
                };
                let Some(value) = self.env.get(ident.sym.as_ref()) else {
                    continue;
                };
                **prop = Prop::KeyValue(swc_ecma_ast::KeyValueProp {
                    key: swc_ecma_ast::PropName::Ident(ident.clone().into()),
                    value: value.to_expr(),
                });
            }
        }

        if self.in_callee && matches!(expr, Expr::Ident(_)) {
            return;
        }

        let Some(value) = eval_expr(expr, self.env) else {
            return;
        };

        *expr = *value.to_expr();
    }
}

impl VisitMut for CapturedConstRewriter<'_> {
    fn visit_mut_arrow_expr(&mut self, _: &mut swc_ecma_ast::ArrowExpr) {
        // Skip nested function scopes.
    }

    fn visit_mut_function(&mut self, _: &mut Function) {
        // Skip nested function scopes.
    }

    fn visit_mut_assign_expr(&mut self, assign: &mut AssignExpr) {
        assign.right.visit_mut_with(self);
    }

    fn visit_mut_update_expr(&mut self, _: &mut UpdateExpr) {}

    fn visit_mut_call_expr(&mut self, call: &mut swc_ecma_ast::CallExpr) {
        if let swc_ecma_ast::Callee::Expr(callee_expr) = &mut call.callee {
            let prev = self.in_callee;
            self.in_callee = true;
            callee_expr.visit_mut_with(self);
            self.in_callee = prev;
        }

        for arg in &mut call.args {
            arg.visit_mut_with(self);
        }
    }

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        expr.visit_mut_children_with(self);

        let Expr::Ident(ident) = expr else {
            return;
        };
        if self.in_callee || self.local_bindings.contains(ident.sym.as_ref()) {
            return;
        }

        let Some(value) = self.env.get(ident.sym.as_ref()) else {
            return;
        };
        if !self.const_bindings.contains(ident.sym.as_ref()) {
            return;
        }
        *expr = *value.to_expr();
    }
}

fn pat_ident_name(pat: &Pat) -> Option<String> {
    match pat {
        Pat::Ident(BindingIdent { id, .. }) => Some(id.sym.to_string()),
        _ => None,
    }
}

fn assign_target_ident_name(target: &AssignTarget) -> Option<String> {
    match target {
        AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent { id, .. })) => {
            Some(id.sym.to_string())
        }
        _ => None,
    }
}

fn eval_expr(expr: &Expr, env: &HashMap<String, ConstValue>) -> Option<ConstValue> {
    match expr {
        Expr::Lit(lit) => lit_to_const(lit),
        Expr::Ident(ident) => {
            if let Some(value) = env.get(ident.sym.as_ref()) {
                return Some(value.clone());
            }

            if ident.sym == *"undefined" {
                Some(ConstValue::Undefined)
            } else {
                None
            }
        }
        Expr::Paren(paren) => eval_expr(&paren.expr, env),
        // Sequence expressions preserve left-to-right evaluation order and may
        // carry side effects in discarded elements. Keep them untouched.
        Expr::Seq(_) => None,
        Expr::Unary(unary) => {
            let arg = eval_expr(&unary.arg, env)?;
            eval_unary(unary.op, arg)
        }
        Expr::Bin(bin) => {
            let left = eval_expr(&bin.left, env)?;
            let right = eval_expr(&bin.right, env)?;
            eval_binary(bin.op, left, right)
        }
        Expr::Cond(cond) => {
            let test = eval_expr(&cond.test, env)?;
            if test.is_truthy() {
                eval_expr(&cond.cons, env)
            } else {
                eval_expr(&cond.alt, env)
            }
        }
        Expr::Tpl(tpl) => {
            if tpl.quasis.len() != tpl.exprs.len() + 1 {
                return None;
            }

            let mut out = String::new();
            for (index, quasi) in tpl.quasis.iter().enumerate() {
                let cooked = quasi.cooked.as_ref()?;
                out.push_str(cooked.to_atom_lossy().as_ref());

                if let Some(expr) = tpl.exprs.get(index) {
                    let value = eval_expr(expr, env)?;
                    out.push_str(value.to_template_string_part()?.as_str());
                }
            }

            Some(ConstValue::String(out))
        }
        _ => None,
    }
}

fn lit_to_const(lit: &Lit) -> Option<ConstValue> {
    match lit {
        Lit::Num(number) => Some(ConstValue::Number(number.value)),
        Lit::Bool(boolean) => Some(ConstValue::Bool(boolean.value)),
        Lit::Str(string) => Some(ConstValue::String(
            string.value.to_atom_lossy().into_owned().to_string(),
        )),
        Lit::Null(_) => Some(ConstValue::Null),
        _ => None,
    }
}

fn eval_unary(op: UnaryOp, value: ConstValue) -> Option<ConstValue> {
    match op {
        UnaryOp::Minus => {
            let number = -value.to_number()?;
            Some(ConstValue::Number(if number == 0.0 { 0.0 } else { number }))
        }
        UnaryOp::Plus => Some(ConstValue::Number(value.to_number()?)),
        UnaryOp::Bang => match value {
            ConstValue::Undefined => None,
            _ => Some(ConstValue::Bool(!value.is_truthy())),
        },
        UnaryOp::Tilde => Some(ConstValue::Number((!(value.to_i32()?)) as f64)),
        UnaryOp::Void => Some(ConstValue::Undefined),
        UnaryOp::TypeOf => Some(ConstValue::String(value.typeof_name().to_string())),
        UnaryOp::Delete => None,
    }
}

fn eval_binary(op: BinaryOp, left: ConstValue, right: ConstValue) -> Option<ConstValue> {
    let bool_value = match op {
        BinaryOp::EqEq => Some(ConstValue::Bool(left.loose_eq(&right))),
        BinaryOp::NotEq => Some(ConstValue::Bool(!left.loose_eq(&right))),
        BinaryOp::EqEqEq => Some(ConstValue::Bool(left.strict_eq(&right))),
        BinaryOp::NotEqEq => Some(ConstValue::Bool(!left.strict_eq(&right))),
        BinaryOp::Lt => Some(ConstValue::Bool(left.to_number()? < right.to_number()?)),
        BinaryOp::LtEq => Some(ConstValue::Bool(left.to_number()? <= right.to_number()?)),
        BinaryOp::Gt => Some(ConstValue::Bool(left.to_number()? > right.to_number()?)),
        BinaryOp::GtEq => Some(ConstValue::Bool(left.to_number()? >= right.to_number()?)),
        _ => None,
    };
    if bool_value.is_some() {
        return bool_value;
    }

    match op {
        BinaryOp::Add => {
            if matches!(left, ConstValue::String(_)) || matches!(right, ConstValue::String(_)) {
                Some(ConstValue::String(format!(
                    "{}{}",
                    left.to_string_value()?,
                    right.to_string_value()?
                )))
            } else {
                Some(ConstValue::Number(left.to_number()? + right.to_number()?))
            }
        }
        BinaryOp::Sub => Some(ConstValue::Number(left.to_number()? - right.to_number()?)),
        BinaryOp::Mul => Some(ConstValue::Number(left.to_number()? * right.to_number()?)),
        BinaryOp::Div => Some(ConstValue::Number(left.to_number()? / right.to_number()?)),
        BinaryOp::Mod => Some(ConstValue::Number(left.to_number()? % right.to_number()?)),
        BinaryOp::Exp => Some(ConstValue::Number(
            left.to_number()?.powf(right.to_number()?),
        )),
        BinaryOp::LShift => Some(ConstValue::Number(
            (left.to_i32()? << (right.to_u32()? & 31)) as f64,
        )),
        BinaryOp::RShift => Some(ConstValue::Number(
            (left.to_i32()? >> (right.to_u32()? & 31)) as f64,
        )),
        BinaryOp::ZeroFillRShift => Some(ConstValue::Number(
            (left.to_u32()? >> (right.to_u32()? & 31)) as f64,
        )),
        BinaryOp::BitOr => Some(ConstValue::Number(
            (left.to_i32()? | right.to_i32()?) as f64,
        )),
        BinaryOp::BitXor => Some(ConstValue::Number(
            (left.to_i32()? ^ right.to_i32()?) as f64,
        )),
        BinaryOp::BitAnd => Some(ConstValue::Number(
            (left.to_i32()? & right.to_i32()?) as f64,
        )),
        BinaryOp::LogicalAnd => {
            if left.is_truthy() {
                Some(right)
            } else {
                Some(left)
            }
        }
        BinaryOp::LogicalOr => {
            if left.is_truthy() {
                Some(left)
            } else {
                Some(right)
            }
        }
        BinaryOp::NullishCoalescing => {
            if matches!(left, ConstValue::Null | ConstValue::Undefined) {
                Some(right)
            } else {
                Some(left)
            }
        }
        _ => None,
    }
}

fn apply_assign_op(op: AssignOp, left: ConstValue, right: ConstValue) -> Option<ConstValue> {
    match op {
        AssignOp::AddAssign => eval_binary(BinaryOp::Add, left, right),
        AssignOp::SubAssign => eval_binary(BinaryOp::Sub, left, right),
        AssignOp::MulAssign => eval_binary(BinaryOp::Mul, left, right),
        AssignOp::DivAssign => eval_binary(BinaryOp::Div, left, right),
        AssignOp::ModAssign => eval_binary(BinaryOp::Mod, left, right),
        AssignOp::LShiftAssign => eval_binary(BinaryOp::LShift, left, right),
        AssignOp::RShiftAssign => eval_binary(BinaryOp::RShift, left, right),
        AssignOp::ZeroFillRShiftAssign => eval_binary(BinaryOp::ZeroFillRShift, left, right),
        AssignOp::BitOrAssign => eval_binary(BinaryOp::BitOr, left, right),
        AssignOp::BitXorAssign => eval_binary(BinaryOp::BitXor, left, right),
        AssignOp::BitAndAssign => eval_binary(BinaryOp::BitAnd, left, right),
        AssignOp::ExpAssign => eval_binary(BinaryOp::Exp, left, right),
        AssignOp::AndAssign => {
            if left.is_truthy() {
                Some(right)
            } else {
                Some(left)
            }
        }
        AssignOp::OrAssign => {
            if left.is_truthy() {
                Some(left)
            } else {
                Some(right)
            }
        }
        AssignOp::NullishAssign => {
            if matches!(left, ConstValue::Null | ConstValue::Undefined) {
                Some(right)
            } else {
                Some(left)
            }
        }
        AssignOp::Assign => Some(right),
    }
}

impl ConstValue {
    fn typeof_name(&self) -> &'static str {
        match self {
            ConstValue::Number(_) => "number",
            ConstValue::Bool(_) => "boolean",
            ConstValue::String(_) => "string",
            ConstValue::Null => "object",
            ConstValue::Undefined => "undefined",
        }
    }

    fn to_number(&self) -> Option<f64> {
        match self {
            ConstValue::Number(value) => Some(*value),
            ConstValue::Bool(value) => Some(if *value { 1.0 } else { 0.0 }),
            ConstValue::Null => Some(0.0),
            ConstValue::Undefined => Some(f64::NAN),
            ConstValue::String(value) => value.parse::<f64>().ok(),
        }
    }

    fn to_i32(&self) -> Option<i32> {
        Some(self.to_number()? as i32)
    }

    fn to_u32(&self) -> Option<u32> {
        Some(self.to_number()? as u32)
    }

    fn to_string_value(&self) -> Option<String> {
        match self {
            ConstValue::String(value) => Some(value.clone()),
            ConstValue::Number(value) => Some(if value.fract() == 0.0 {
                format!("{}", *value as i64)
            } else {
                value.to_string()
            }),
            ConstValue::Bool(value) => Some(value.to_string()),
            ConstValue::Null => Some("null".to_string()),
            ConstValue::Undefined => Some("undefined".to_string()),
        }
    }

    fn to_template_string_part(&self) -> Option<String> {
        match self {
            ConstValue::Undefined => None,
            _ => self.to_string_value(),
        }
    }

    fn is_truthy(&self) -> bool {
        match self {
            ConstValue::Bool(value) => *value,
            ConstValue::Null | ConstValue::Undefined => false,
            ConstValue::Number(value) => *value != 0.0 && !value.is_nan(),
            ConstValue::String(value) => !value.is_empty(),
        }
    }

    fn strict_eq(&self, other: &Self) -> bool {
        match (self, other) {
            (ConstValue::Number(a), ConstValue::Number(b)) => a == b,
            (ConstValue::Bool(a), ConstValue::Bool(b)) => a == b,
            (ConstValue::String(a), ConstValue::String(b)) => a == b,
            (ConstValue::Null, ConstValue::Null) => true,
            (ConstValue::Undefined, ConstValue::Undefined) => true,
            _ => false,
        }
    }

    fn loose_eq(&self, other: &Self) -> bool {
        if self.strict_eq(other) {
            return true;
        }
        match (self, other) {
            (ConstValue::Null, ConstValue::Undefined)
            | (ConstValue::Undefined, ConstValue::Null) => true,
            _ => match (self.to_number(), other.to_number()) {
                (Some(lhs), Some(rhs)) => lhs == rhs,
                _ => false,
            },
        }
    }
}
