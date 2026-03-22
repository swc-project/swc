use std::collections::HashSet;

use swc_ecma_ast::{
    op, AssignExpr, AssignTarget, BinExpr, BlockStmt, Expr, MemberExpr, MemberProp, Stmt,
};
use swc_ecma_visit::{Visit, VisitWith};

use crate::{
    error::{CompilerError, CompilerErrorDetail, ErrorCategory},
    hir::HirFunction,
};

pub fn validate_no_ref_access_in_render(hir: &HirFunction) -> Result<(), CompilerError> {
    let Some(body) = hir.function.body.as_ref() else {
        return Ok(());
    };
    let allowed_lazy_init_spans = collect_allowed_lazy_init_ref_spans(body);

    #[derive(Default)]
    struct Finder {
        allowed_lazy_init_spans: HashSet<(u32, u32)>,
        errors: Vec<CompilerErrorDetail>,
    }

    impl Finder {
        fn push(&mut self, span: swc_common::Span) {
            let mut detail =
                CompilerErrorDetail::error(ErrorCategory::Refs, "Cannot access refs during render");
            detail.description = Some(
                "React refs are values that are not needed for rendering. Refs should only be \
                 accessed outside of render, such as in event handlers or effects. Accessing a \
                 ref value (the `current` property) during render can cause your component not to \
                 update as expected (https://react.dev/reference/react/useRef)."
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

        fn visit_member_expr(&mut self, member: &MemberExpr) {
            if is_ref_current_member(member)
                && !self
                    .allowed_lazy_init_spans
                    .contains(&(member.span.lo.0, member.span.hi.0))
            {
                self.push(member.span);
            }
            member.visit_children_with(self);
        }
    }

    let mut finder = Finder {
        allowed_lazy_init_spans,
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

fn is_ref_current_member(member: &MemberExpr) -> bool {
    let prop = match &member.prop {
        MemberProp::Ident(prop) => Some(prop.sym.as_ref()),
        MemberProp::Computed(computed) => match &*computed.expr {
            Expr::Lit(swc_ecma_ast::Lit::Str(value)) if value.value == *"current" => {
                Some("current")
            }
            _ => None,
        },
        MemberProp::PrivateName(_) => None,
    };
    prop == Some("current")
}

fn ref_current_ident(member: &MemberExpr) -> Option<&str> {
    if !is_ref_current_member(member) {
        return None;
    }
    if let Expr::Ident(obj) = &*member.obj {
        Some(obj.sym.as_ref())
    } else {
        None
    }
}

fn ref_current_ident_from_expr(expr: &Expr) -> Option<&str> {
    if let Expr::Member(member) = expr {
        ref_current_ident(member)
    } else {
        None
    }
}

fn is_nullish_expr(expr: &Expr) -> bool {
    match expr {
        Expr::Lit(swc_ecma_ast::Lit::Null(_)) => true,
        Expr::Ident(ident) if ident.sym == "undefined" => true,
        _ => false,
    }
}

fn nullish_check_ref_name(expr: &Expr) -> Option<String> {
    let Expr::Bin(BinExpr {
        op, left, right, ..
    }) = expr
    else {
        return None;
    };

    if !matches!(*op, op!("==") | op!("===") | op!("!=") | op!("!==")) {
        return None;
    }

    if let Some(name) = ref_current_ident_from_expr(left) {
        if is_nullish_expr(right) {
            return Some(name.to_string());
        }
    }
    if let Some(name) = ref_current_ident_from_expr(right) {
        if is_nullish_expr(left) {
            return Some(name.to_string());
        }
    }
    None
}

fn collect_allowed_lazy_init_ref_spans(body: &BlockStmt) -> HashSet<(u32, u32)> {
    fn collect_stmt(stmt: &Stmt, out: &mut HashSet<(u32, u32)>) {
        match stmt {
            Stmt::If(if_stmt) => {
                if let Some(name) = nullish_check_ref_name(&if_stmt.test) {
                    if contains_assignment_to_ref_current(&if_stmt.cons, &name) {
                        collect_ref_current_spans_in_expr(&if_stmt.test, &name, out);
                        collect_ref_current_spans_in_stmt(&if_stmt.cons, &name, out);
                    }
                }

                collect_stmt(&if_stmt.cons, out);
                if let Some(alt) = &if_stmt.alt {
                    collect_stmt(alt, out);
                }
            }
            Stmt::Block(block) => {
                for child in &block.stmts {
                    collect_stmt(child, out);
                }
            }
            _ => {}
        }
    }

    let mut out = HashSet::new();
    for stmt in &body.stmts {
        collect_stmt(stmt, &mut out);
    }
    out
}

fn contains_assignment_to_ref_current(stmt: &Stmt, ident_name: &str) -> bool {
    struct Finder<'a> {
        ident_name: &'a str,
        found: bool,
    }

    impl Visit for Finder<'_> {
        fn visit_function(&mut self, _: &swc_ecma_ast::Function) {}

        fn visit_arrow_expr(&mut self, _: &swc_ecma_ast::ArrowExpr) {}

        fn visit_assign_expr(&mut self, assign: &AssignExpr) {
            if let AssignTarget::Simple(swc_ecma_ast::SimpleAssignTarget::Member(member)) =
                &assign.left
            {
                if ref_current_ident(member).is_some_and(|name| name == self.ident_name) {
                    self.found = true;
                    return;
                }
            }
            assign.visit_children_with(self);
        }
    }

    let mut finder = Finder {
        ident_name,
        found: false,
    };
    stmt.visit_with(&mut finder);
    finder.found
}

fn collect_ref_current_spans_in_expr(expr: &Expr, ident_name: &str, out: &mut HashSet<(u32, u32)>) {
    struct Collector<'a> {
        ident_name: &'a str,
        out: &'a mut HashSet<(u32, u32)>,
    }

    impl Visit for Collector<'_> {
        fn visit_function(&mut self, _: &swc_ecma_ast::Function) {}

        fn visit_arrow_expr(&mut self, _: &swc_ecma_ast::ArrowExpr) {}

        fn visit_member_expr(&mut self, member: &MemberExpr) {
            if ref_current_ident(member).is_some_and(|name| name == self.ident_name) {
                self.out.insert((member.span.lo.0, member.span.hi.0));
            }
            member.visit_children_with(self);
        }
    }

    expr.visit_with(&mut Collector { ident_name, out });
}

fn collect_ref_current_spans_in_stmt(stmt: &Stmt, ident_name: &str, out: &mut HashSet<(u32, u32)>) {
    struct Collector<'a> {
        ident_name: &'a str,
        out: &'a mut HashSet<(u32, u32)>,
    }

    impl Visit for Collector<'_> {
        fn visit_function(&mut self, _: &swc_ecma_ast::Function) {}

        fn visit_arrow_expr(&mut self, _: &swc_ecma_ast::ArrowExpr) {}

        fn visit_member_expr(&mut self, member: &MemberExpr) {
            if ref_current_ident(member).is_some_and(|name| name == self.ident_name) {
                self.out.insert((member.span.lo.0, member.span.hi.0));
            }
            member.visit_children_with(self);
        }
    }

    stmt.visit_with(&mut Collector { ident_name, out });
}
