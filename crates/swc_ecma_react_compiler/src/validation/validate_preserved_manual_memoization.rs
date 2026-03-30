use super::dependency::{
    collect_callback_dependencies_with_hints, collect_function_like_bindings,
    collect_top_level_bindings, dependency_prefix_match, format_dependency, hook_call_kind,
    parse_manual_dependencies, resolve_callback_expr, Dependency, FunctionLike, HookCallKind,
    ManualDeps,
};
use crate::{
    error::{CompilerError, CompilerErrorDetail, ErrorCategory},
    hir::HirFunction,
};

pub fn validate_preserved_manual_memoization(hir: &HirFunction) -> Result<(), CompilerError> {
    let Some(body) = hir.function.body.as_ref() else {
        return Ok(());
    };

    let outer_bindings = collect_top_level_bindings(hir);
    let function_like_bindings = collect_function_like_bindings(body);

    let mut details = Vec::<CompilerErrorDetail>::new();

    struct Visitor<'a> {
        hir: &'a HirFunction,
        outer_bindings: &'a std::collections::HashSet<String>,
        function_like_bindings: &'a std::collections::HashMap<String, FunctionLike>,
        details: &'a mut Vec<CompilerErrorDetail>,
    }

    impl Visitor<'_> {
        fn validate_manual_memo(&mut self, call: &swc_ecma_ast::CallExpr) {
            let Some(kind) = hook_call_kind(call) else {
                return;
            };
            if !matches!(kind, HookCallKind::Memo | HookCallKind::Callback) {
                return;
            }

            let Some(callback_arg) = call.args.first() else {
                return;
            };
            if callback_arg.spread.is_some() {
                return;
            }
            let Some(callback_expr) =
                resolve_callback_expr(&callback_arg.expr, self.function_like_bindings)
            else {
                return;
            };

            let inferred = collect_callback_dependencies_with_hints(
                self.hir,
                &callback_expr,
                self.outer_bindings,
            );
            if inferred.is_empty() {
                return;
            }

            let ManualDeps::Parsed(manual_deps) =
                parse_manual_dependencies(call.args.get(1), self.outer_bindings)
            else {
                return;
            };

            // Empty deps arrays are intentionally handled conservatively here:
            // without the upstream reactive-scope sidecar we cannot reliably
            // distinguish truly invalid preservation from safe rewrites.
            if manual_deps.is_empty() {
                return;
            }

            if let Some(missing) = inferred.iter().find(|inferred_dep| {
                !manual_deps
                    .iter()
                    .any(|manual_dep| dependency_prefix_match(manual_dep, inferred_dep))
            }) {
                self.push_mismatch_error(call.span, missing, &manual_deps);
            }
        }

        fn push_mismatch_error(
            &mut self,
            span: swc_common::Span,
            inferred_dep: &Dependency,
            manual_deps: &[Dependency],
        ) {
            let manual_list = if manual_deps.is_empty() {
                String::new()
            } else {
                manual_deps
                    .iter()
                    .map(format_dependency)
                    .collect::<Vec<_>>()
                    .join(", ")
            };

            let mismatch_kind = if manual_deps.iter().any(|manual_dep| {
                manual_dep.root == inferred_dep.root
                    && dependency_prefix_match(inferred_dep, manual_dep)
                    && inferred_dep.path.len() < manual_dep.path.len()
            }) {
                " Inferred less specific property than source."
            } else {
                " Inferred different dependency than source."
            };

            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::PreserveManualMemo,
                "Compilation Skipped: Existing memoization could not be preserved",
            );
            detail.description = Some(format!(
                "React Compiler has skipped optimizing this component because the existing manual \
                 memoization could not be preserved. The inferred dependencies did not match the \
                 manually specified dependencies, which could cause the value to change more or \
                 less frequently than expected. The inferred dependency was `{}`, but the source \
                 dependencies were [{}].{}",
                format_dependency(inferred_dep),
                manual_list,
                mismatch_kind
            ));
            detail.loc = Some(span);
            self.details.push(detail);
        }
    }

    impl swc_ecma_visit::Visit for Visitor<'_> {
        fn visit_call_expr(&mut self, call: &swc_ecma_ast::CallExpr) {
            self.validate_manual_memo(call);
            call.visit_children_with(self);
        }
    }

    use swc_ecma_visit::VisitWith;
    let mut visitor = Visitor {
        hir,
        outer_bindings: &outer_bindings,
        function_like_bindings: &function_like_bindings,
        details: &mut details,
    };
    body.visit_with(&mut visitor);

    if details.is_empty() {
        Ok(())
    } else {
        Err(CompilerError { details })
    }
}
