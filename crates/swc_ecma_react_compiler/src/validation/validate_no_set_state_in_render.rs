use std::collections::HashSet;

use swc_ecma_ast::{BlockStmt, CallExpr, Callee, Expr, Pat, Stmt, VarDeclarator};
use swc_ecma_visit::{Visit, VisitWith};

use crate::{
    error::{CompilerError, CompilerErrorDetail, ErrorCategory},
    hir::HirFunction,
};

pub fn validate_no_set_state_in_render(hir: &HirFunction) -> Result<(), CompilerError> {
    let Some(body) = hir.function.body.as_ref() else {
        return Ok(());
    };
    let known_state_setters = collect_state_setters(body);

    #[derive(Default)]
    struct Finder {
        known_state_setters: HashSet<String>,
        errors: Vec<CompilerErrorDetail>,
    }

    impl Finder {
        fn push(&mut self, call: &CallExpr) {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::RenderSetState,
                "Cannot call setState during render",
            );
            detail.description = Some(
                "Calling setState during render may trigger an infinite loop.\n* To reset state \
                 when other state/props change, store the previous value in state and update \
                 conditionally: \
                 https://react.dev/reference/react/useState#storing-information-from-previous-renders\n* \
                 To derive data from other state/props, compute the derived data during render \
                 without using state."
                    .into(),
            );
            detail.loc = Some(call.span);
            self.errors.push(detail);
        }

        fn push_in_use_memo(&mut self, span: swc_common::Span) {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::RenderSetState,
                "Calling setState from useMemo may trigger an infinite loop",
            );
            detail.description = Some(
                "Each time the memo callback is evaluated it will change state. This can cause a \
                 memoization dependency to change, running the memo function again and causing an \
                 infinite loop. Instead of setting state in useMemo(), prefer deriving the value \
                 during render. (https://react.dev/reference/react/useState)."
                    .into(),
            );
            detail.loc = Some(span);
            self.errors.push(detail);
        }
    }

    impl Visit for Finder {
        fn visit_function(&mut self, _: &swc_ecma_ast::Function) {
            // Ignore nested functions; this pass validates render body only.
        }

        fn visit_arrow_expr(&mut self, _: &swc_ecma_ast::ArrowExpr) {
            // Ignore nested functions; this pass validates render body only.
        }

        fn visit_call_expr(&mut self, call: &CallExpr) {
            if is_set_state_call(call, &self.known_state_setters) {
                self.push(call);
            }

            if is_use_memo_call(call) {
                if let Some(callback) = call.args.first() {
                    let mut nested = SetStateFinder {
                        known_state_setters: self.known_state_setters.clone(),
                        spans: Vec::new(),
                    };
                    callback.visit_with(&mut nested);
                    for span in nested.spans {
                        self.push_in_use_memo(span);
                    }
                }
            }

            call.visit_children_with(self);
        }
    }

    #[derive(Default)]
    struct SetStateFinder {
        known_state_setters: HashSet<String>,
        spans: Vec<swc_common::Span>,
    }

    impl Visit for SetStateFinder {
        fn visit_call_expr(&mut self, call: &CallExpr) {
            if is_set_state_call(call, &self.known_state_setters) {
                self.spans.push(call.span);
            }
            call.visit_children_with(self);
        }
    }

    let mut finder = Finder {
        known_state_setters,
        errors: Vec::new(),
    };
    body.visit_with(&mut finder);

    if finder.errors.is_empty() {
        Ok(())
    } else {
        Err(CompilerError {
            details: finder.errors,
        })
    }
}

fn is_set_state_call(call: &CallExpr, known_state_setters: &HashSet<String>) -> bool {
    let Callee::Expr(callee) = &call.callee else {
        return false;
    };

    match &**callee {
        Expr::Ident(ident) => {
            let name = ident.sym.as_ref();
            name == "setState" || known_state_setters.contains(name)
        }
        Expr::Member(member) => match &member.prop {
            swc_ecma_ast::MemberProp::Ident(prop) => prop.sym == "setState",
            _ => false,
        },
        _ => false,
    }
}

fn is_use_memo_call(call: &CallExpr) -> bool {
    let Callee::Expr(callee) = &call.callee else {
        return false;
    };
    match &**callee {
        Expr::Ident(ident) => ident.sym == "useMemo",
        Expr::Member(member) => match &member.prop {
            swc_ecma_ast::MemberProp::Ident(prop) => prop.sym == "useMemo",
            _ => false,
        },
        _ => false,
    }
}

fn collect_state_setters(body: &BlockStmt) -> HashSet<String> {
    let mut out = HashSet::new();
    for stmt in &body.stmts {
        collect_setters_from_stmt(stmt, &mut out);
    }
    out
}

fn collect_setters_from_stmt(stmt: &Stmt, out: &mut HashSet<String>) {
    if let Stmt::Decl(swc_ecma_ast::Decl::Var(var_decl)) = stmt {
        for decl in &var_decl.decls {
            collect_setters_from_declarator(decl, out);
        }
    }
}

fn collect_setters_from_declarator(decl: &VarDeclarator, out: &mut HashSet<String>) {
    let Some(init) = decl.init.as_ref() else {
        return;
    };
    if !is_state_hook_call(init) {
        return;
    }

    let Pat::Array(array_pat) = &decl.name else {
        return;
    };

    if let Some(Some(Pat::Ident(binding))) = array_pat.elems.get(1) {
        out.insert(binding.id.sym.to_string());
    }
}

fn is_state_hook_call(expr: &Expr) -> bool {
    let Expr::Call(call) = expr else {
        return false;
    };
    let Callee::Expr(callee) = &call.callee else {
        return false;
    };

    let is_state_like = |name: &str| {
        matches!(
            name,
            "useState" | "useReducer" | "useActionState" | "useOptimistic"
        )
    };

    match &**callee {
        Expr::Ident(ident) => is_state_like(ident.sym.as_ref()),
        Expr::Member(member) => match &member.prop {
            swc_ecma_ast::MemberProp::Ident(prop) => is_state_like(prop.sym.as_ref()),
            _ => false,
        },
        _ => false,
    }
}
