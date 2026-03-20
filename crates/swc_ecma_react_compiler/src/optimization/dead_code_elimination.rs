use std::collections::{HashMap, HashSet};

use swc_ecma_ast::{
    op, AssignExpr, AssignTarget, Decl, Expr, Pat, SimpleAssignTarget, Stmt, VarDecl, VarDeclKind,
};
use swc_ecma_visit::{Visit, VisitWith};

use crate::hir::HirFunction;

/// Runs a conservative dead-code elimination pass over top-level statements
/// in the lowered function body.
pub fn dead_code_elimination(hir: &mut HirFunction) {
    let Some(body) = hir.function.body.as_mut() else {
        return;
    };

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
        // Conservative fallback for expressions with potential side-effects.
        Expr::Call(_)
        | Expr::New(_)
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
