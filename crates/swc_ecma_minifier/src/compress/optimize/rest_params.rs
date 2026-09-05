use swc_ecma_ast::*;
use swc_ecma_visit::{Visit, VisitWith};

use super::{Optimizer, ProgramData, VarUsageInfoFlags};

/// Returns true if a function body reads its implicit `arguments` object.
///
/// A lexical `arguments` declaration has a distinct syntax context, while a
/// `var arguments` declaration aliases the implicit arguments object unless it
/// belongs to a nested arrow function.
fn uses_implicit_arguments(f: &Function, data: &ProgramData) -> bool {
    struct ArrowVarFinder {
        ids: Vec<Id>,
    }

    impl Visit for ArrowVarFinder {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {}

        fn visit_function(&mut self, _: &Function) {}

        fn visit_var_decl(&mut self, var: &VarDecl) {
            if var.kind == VarDeclKind::Var {
                var.decls.visit_with(self);
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
        shadowed_arguments: Vec<Id>,
        found: bool,
    }

    impl Visit for Finder<'_> {
        fn visit_function(&mut self, _: &Function) {}

        fn visit_labeled_stmt(&mut self, labeled: &LabeledStmt) {
            // Labels are not expression references and live in a separate namespace.
            labeled.body.visit_with(self);
        }

        fn visit_break_stmt(&mut self, _: &BreakStmt) {}

        fn visit_continue_stmt(&mut self, _: &ContinueStmt) {}

        fn visit_arrow_expr(&mut self, arrow: &ArrowExpr) {
            let mut var_finder = ArrowVarFinder { ids: Vec::new() };
            arrow.body.visit_with(&mut var_finder);

            let shadowed_len = self.shadowed_arguments.len();
            self.shadowed_arguments.extend(var_finder.ids);
            arrow.body.visit_with(self);
            self.shadowed_arguments.truncate(shadowed_len);
        }

        fn visit_ident(&mut self, ident: &Ident) {
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
    pub(super) fn drop_unused_rest_params(&mut self, f: &mut Function) {
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
            && !self.ctx.expr_ctx.in_strict
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
                && (!can_make_arguments_mapped || !uses_implicit_arguments(f, self.data))
            {
                self.changed = true;
                report_change!("rest_params: Removing unused rest parameter");
                f.params.pop();
            }
        }
    }
}
