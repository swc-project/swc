use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_visit::{Visit, VisitWith};

use super::{Optimizer, ProgramData, VarUsageInfoFlags};

/// Returns true if a function body has a strict-mode directive.
pub(super) fn has_use_strict_directive(f: &Function) -> bool {
    f.body.as_ref().is_some_and(|body| {
        body.stmts
            .iter()
            .take_while(|stmt| {
                matches!(stmt, Stmt::Expr(ExprStmt { expr, .. }) if matches!(&**expr, Expr::Lit(Lit::Str(..))))
            })
            .any(|stmt| {
                matches!(stmt,
                    Stmt::Expr(ExprStmt {
                        expr,
                        ..
                    }) if matches!(
                        &**expr,
                        Expr::Lit(Lit::Str(Str { raw: Some(raw), .. }))
                            if raw == "\"use strict\"" || raw == "'use strict'"
                    )
                )
            })
    })
}

/// Returns true if a function body reads its implicit `arguments` object.
///
/// A lexical `arguments` declaration has a distinct syntax context, while a
/// `var arguments` declaration aliases the implicit arguments object unless it
/// belongs to a nested arrow function. Its declaration occurrence is not a
/// read.
fn uses_implicit_arguments(
    f: &Function,
    data: &ProgramData,
    unresolved_ctxt: SyntaxContext,
) -> bool {
    struct ArrowVarFinder {
        ids: Vec<Id>,
    }

    impl Visit for ArrowVarFinder {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {}

        fn visit_function(&mut self, _: &Function) {}

        fn visit_constructor(&mut self, _: &Constructor) {}

        fn visit_var_decl(&mut self, var: &VarDecl) {
            if var.kind == VarDeclKind::Var {
                for declarator in &var.decls {
                    declarator.name.visit_with(self);
                }
            }
        }

        fn visit_binding_ident(&mut self, ident: &BindingIdent) {
            if ident.id.sym == "arguments" {
                self.ids.push(ident.id.to_id());
            }
        }
    }

    struct Finder<'a> {
        data: &'a ProgramData,
        unresolved_ctxt: SyntaxContext,
        shadowed_arguments: Vec<Id>,
        found: bool,
    }

    impl Visit for Finder<'_> {
        fn visit_stmts(&mut self, stmts: &[Stmt]) {
            for stmt in stmts {
                if self.found {
                    return;
                }

                stmt.visit_with(self);
            }
        }

        fn visit_expr_or_spreads(&mut self, exprs: &[ExprOrSpread]) {
            for expr in exprs {
                if self.found {
                    return;
                }

                expr.visit_with(self);
            }
        }

        fn visit_function(&mut self, function: &Function) {
            if self.found {
                return;
            }

            // Function and parameter decorators execute while the enclosing scope is
            // active, unlike the nested function's parameters and body.
            function.decorators.visit_with(self);
            for param in &function.params {
                if self.found {
                    return;
                }

                param.decorators.visit_with(self);
            }
        }

        fn visit_constructor(&mut self, constructor: &Constructor) {
            if self.found {
                return;
            }

            // Constructor parameter decorators execute in the enclosing scope. The
            // parameter patterns and constructor body execute in the constructor's
            // own scope and must remain skipped.
            for param in &constructor.params {
                if self.found {
                    return;
                }

                match param {
                    ParamOrTsParamProp::Param(param) => param.decorators.visit_with(self),
                    ParamOrTsParamProp::TsParamProp(param) => param.decorators.visit_with(self),
                }
            }
        }

        fn visit_labeled_stmt(&mut self, labeled: &LabeledStmt) {
            if self.found {
                return;
            }

            // Labels are not expression references and live in a separate namespace.
            labeled.body.visit_with(self);
        }

        fn visit_break_stmt(&mut self, _: &BreakStmt) {}

        fn visit_continue_stmt(&mut self, _: &ContinueStmt) {}

        fn visit_arrow_expr(&mut self, arrow: &ArrowExpr) {
            if self.found {
                return;
            }

            // Default parameter initializers execute in this lexical scope and can read the
            // enclosing function's implicit `arguments` object.
            arrow.params.visit_with(self);
            if self.found {
                return;
            }

            let mut var_finder = ArrowVarFinder { ids: Vec::new() };
            arrow.body.visit_with(&mut var_finder);

            let shadowed_len = self.shadowed_arguments.len();
            self.shadowed_arguments.extend(var_finder.ids);
            arrow.body.visit_with(self);
            self.shadowed_arguments.truncate(shadowed_len);
        }

        fn visit_call_expr(&mut self, call: &CallExpr) {
            if self.found {
                return;
            }

            // Direct eval can read the enclosing implicit `arguments` object without a
            // corresponding identifier node. Nested ordinary functions and constructors
            // are skipped above, while arrows share the enclosing lexical scope.
            if matches!(
                &call.callee,
                Callee::Expr(expr) if matches!(&**expr, Expr::Ident(ident) if ident.sym == "eval" && ident.ctxt == self.unresolved_ctxt)
            ) && self.shadowed_arguments.is_empty()
            {
                self.found = true;
                return;
            }

            call.visit_children_with(self);
        }

        // A binding identifier declares a name, while expressions nested in a binding
        // pattern (defaults and computed keys) still execute and can read `arguments`.
        fn visit_binding_ident(&mut self, _: &BindingIdent) {}

        fn visit_ident(&mut self, ident: &Ident) {
            if self.found {
                return;
            }

            if ident.sym == "arguments"
                && !self.shadowed_arguments.contains(&ident.to_id())
                && self.data.vars.get(&ident.to_id()).map_or(true, |usage| {
                    usage.var_kind == Some(VarDeclKind::Var)
                        || !usage.flags.contains(VarUsageInfoFlags::DECLARED)
                })
            {
                self.found = true;
            }
        }
    }

    let mut finder = Finder {
        data,
        unresolved_ctxt,
        shadowed_arguments: Vec::new(),
        found: false,
    };
    f.body.visit_with(&mut finder);
    finder.found
}

/// Methods related to rest parameter optimization.
impl Optimizer<'_> {
    /// Removes unused rest parameters from functions.
    ///
    /// Example:
    /// ```js
    /// function f(a, ...b) {
    ///     console.log(a);
    /// }
    /// ```
    /// =>
    /// ```js
    /// function f(a) {
    ///     console.log(a);
    /// }
    /// ```
    pub(super) fn drop_unused_rest_params(&mut self, f: &mut Function, in_strict: bool) {
        if !self.options.arguments && !self.options.unused {
            return;
        }

        // Don't optimize if there's no rest parameter
        if f.params.is_empty() {
            return;
        }

        let last_param = match f.params.last() {
            Some(p) => p,
            None => return,
        };

        // Check if the last parameter is a rest parameter
        let rest_pat = match &last_param.pat {
            Pat::Rest(rest) => rest,
            _ => return,
        };

        // Get the identifier of the rest parameter
        let rest_id = match &*rest_pat.arg {
            Pat::Ident(BindingIdent { id, .. }) => id.to_id(),
            _ => return,
        };

        // Removing a rest parameter can make a sloppy function's parameter list simple.
        // In that case, `arguments` becomes mapped to the remaining parameters, which
        // changes observable behavior when the function uses `arguments`.
        let can_make_arguments_mapped = f.params.len() > 1
            && !in_strict
            && f.params[..f.params.len() - 1].iter().all(|param| {
                matches!(
                    &param.pat,
                    Pat::Ident(BindingIdent { id, .. }) if id.sym != "arguments"
                )
            });

        if let Some(usage) = self.data.vars.get(&rest_id) {
            // Preserve the rest parameter only if removing it can change an
            // `arguments` object from unmapped to mapped.
            if usage.ref_count == 0
                && (!can_make_arguments_mapped
                    || !uses_implicit_arguments(f, self.data, self.ctx.expr_ctx.unresolved_ctxt))
            {
                self.changed = true;
                report_change!("rest_params: Removing unused rest parameter");
                f.params.pop();
            }
        }
    }
}
