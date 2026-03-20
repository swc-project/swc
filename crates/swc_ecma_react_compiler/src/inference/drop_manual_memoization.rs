use swc_ecma_ast::{BlockStmt, Callee, Expr, Lit, MemberExpr, MemberProp};
use swc_ecma_visit::{Visit, VisitMut, VisitMutWith, VisitWith};

use crate::hir::HirFunction;

/// Drops manual memoization wrappers when they are a direct `useMemo` call with
/// a pure dependency array and a callback that is equivalent to an expression.
pub fn drop_manual_memoization(hir: &mut HirFunction) {
    let Some(body) = hir.function.body.as_mut() else {
        return;
    };

    struct Rewriter;

    impl VisitMut for Rewriter {
        fn visit_mut_expr(&mut self, expr: &mut Expr) {
            expr.visit_mut_children_with(self);

            let Expr::Call(call) = expr else {
                return;
            };
            if !is_use_memo_callee(&call.callee) {
                return;
            }
            if call.args.len() < 2 {
                return;
            }

            let deps = &call.args[1];
            if deps.spread.is_some() || !is_pure_dependency_array(&deps.expr) {
                return;
            }

            let callback = &call.args[0];
            if callback.spread.is_some() {
                return;
            }
            let Some(inlined) = extract_callback_expr(&callback.expr) else {
                return;
            };
            if is_self_identity_memo(&inlined, &deps.expr) {
                return;
            }
            if contains_allocating_literal(&inlined) {
                return;
            }

            *expr = *inlined;
        }
    }

    body.visit_mut_with(&mut Rewriter);
}

fn is_use_memo_callee(callee: &Callee) -> bool {
    let Callee::Expr(callee_expr) = callee else {
        return false;
    };
    match &**callee_expr {
        Expr::Ident(ident) => ident.sym == "useMemo",
        Expr::Member(member) => is_react_use_memo_member(member),
        _ => false,
    }
}

fn is_react_use_memo_member(member: &MemberExpr) -> bool {
    let Expr::Ident(object) = &*member.obj else {
        return false;
    };
    if object.sym != "React" {
        return false;
    }
    match &member.prop {
        MemberProp::Ident(prop) => prop.sym == "useMemo",
        MemberProp::Computed(computed) => match &*computed.expr {
            Expr::Lit(Lit::Str(value)) => value.value == *"useMemo",
            _ => false,
        },
        MemberProp::PrivateName(_) => false,
    }
}

fn is_pure_dependency_array(expr: &Expr) -> bool {
    let Expr::Array(array) = expr else {
        return false;
    };
    array.elems.iter().all(|element| {
        let Some(element) = element else {
            return true;
        };
        if element.spread.is_some() {
            return false;
        }
        matches!(
            &*element.expr,
            Expr::Ident(_)
                | Expr::Member(_)
                | Expr::Lit(_)
                | Expr::This(_)
                | Expr::Unary(_)
                | Expr::Bin(_)
                | Expr::Cond(_)
        )
    })
}

fn extract_callback_expr(expr: &Expr) -> Option<Box<Expr>> {
    match expr {
        Expr::Arrow(arrow) => {
            if !arrow.params.is_empty() {
                return None;
            }
            match &*arrow.body {
                swc_ecma_ast::BlockStmtOrExpr::Expr(value) => Some(value.clone()),
                swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) => {
                    extract_single_return_expr(block)
                }
            }
        }
        Expr::Fn(function_expr) => {
            if !function_expr.function.params.is_empty() {
                return None;
            }
            let body = function_expr.function.body.as_ref()?;
            extract_single_return_expr(body)
        }
        _ => None,
    }
}

fn extract_single_return_expr(block: &BlockStmt) -> Option<Box<Expr>> {
    let mut non_empty = block
        .stmts
        .iter()
        .filter(|stmt| !matches!(stmt, swc_ecma_ast::Stmt::Empty(_)));
    let stmt = non_empty.next()?;
    if non_empty.next().is_some() {
        return None;
    }
    let swc_ecma_ast::Stmt::Return(return_stmt) = stmt else {
        return None;
    };
    return_stmt.arg.clone()
}

fn contains_allocating_literal(expr: &Expr) -> bool {
    struct Finder {
        found: bool,
    }

    impl Visit for Finder {
        fn visit_arrow_expr(&mut self, _: &swc_ecma_ast::ArrowExpr) {
            self.found = true;
        }

        fn visit_fn_expr(&mut self, _: &swc_ecma_ast::FnExpr) {
            self.found = true;
        }

        fn visit_object_lit(&mut self, _: &swc_ecma_ast::ObjectLit) {
            self.found = true;
        }

        fn visit_array_lit(&mut self, _: &swc_ecma_ast::ArrayLit) {
            self.found = true;
        }

        fn visit_new_expr(&mut self, _: &swc_ecma_ast::NewExpr) {
            self.found = true;
        }

        fn visit_jsx_element(&mut self, _: &swc_ecma_ast::JSXElement) {
            self.found = true;
        }

        fn visit_jsx_fragment(&mut self, _: &swc_ecma_ast::JSXFragment) {
            self.found = true;
        }

        fn visit_class_expr(&mut self, _: &swc_ecma_ast::ClassExpr) {
            self.found = true;
        }

        fn visit_expr(&mut self, expr: &Expr) {
            if self.found {
                return;
            }
            expr.visit_children_with(self);
        }
    }

    let mut finder = Finder { found: false };
    expr.visit_with(&mut finder);
    finder.found
}

fn is_self_identity_memo(inlined: &Expr, deps_expr: &Expr) -> bool {
    let Expr::Ident(inlined_ident) = inlined else {
        return false;
    };
    let Expr::Array(deps_array) = deps_expr else {
        return false;
    };
    let [Some(dep)] = deps_array.elems.as_slice() else {
        return false;
    };
    dep.spread.is_none()
        && matches!(&*dep.expr, Expr::Ident(dep_ident) if dep_ident.sym == inlined_ident.sym)
}
