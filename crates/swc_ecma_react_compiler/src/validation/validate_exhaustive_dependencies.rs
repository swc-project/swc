use super::dependency::{
    collect_callback_dependencies, collect_function_like_bindings, collect_stable_hook_bindings,
    collect_top_level_bindings, dependency_prefix_match, format_dependency, hook_call_kind,
    is_probably_stable_dependency, parse_manual_dependencies, resolve_callback_expr, Dependency,
    FunctionLike, HookCallKind, ManualDeps,
};
use crate::{
    error::{CompilerError, CompilerErrorDetail, ErrorCategory},
    hir::HirFunction,
    options::ExhaustiveEffectDependenciesMode,
};

pub fn validate_exhaustive_dependencies(
    hir: &HirFunction,
    validate_exhaustive_memoization_dependencies: bool,
    validate_exhaustive_effect_dependencies: ExhaustiveEffectDependenciesMode,
) -> Result<(), CompilerError> {
    let Some(body) = hir.function.body.as_ref() else {
        return Ok(());
    };

    let outer_bindings = collect_top_level_bindings(hir);
    let function_like_bindings = collect_function_like_bindings(body);
    let stable_bindings = collect_stable_hook_bindings(body);
    let mut details = Vec::<CompilerErrorDetail>::new();

    struct Visitor<'a> {
        outer_bindings: &'a std::collections::HashSet<String>,
        function_like_bindings: &'a std::collections::HashMap<String, FunctionLike>,
        stable_bindings: &'a std::collections::HashSet<String>,
        validate_memo: bool,
        validate_effect_mode: ExhaustiveEffectDependenciesMode,
        details: &'a mut Vec<CompilerErrorDetail>,
    }

    impl Visitor<'_> {
        fn validate_call(&mut self, call: &swc_ecma_ast::CallExpr) {
            let Some(kind) = hook_call_kind(call) else {
                return;
            };
            match kind {
                HookCallKind::Memo | HookCallKind::Callback if !self.validate_memo => return,
                HookCallKind::Effect if !self.validate_effect_mode.is_enabled() => return,
                _ => {}
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

            let manual = parse_manual_dependencies(call.args.get(1), self.outer_bindings);
            let ManualDeps::Parsed(manual) = manual else {
                // No deps list or unsupported deps expression; upstream treats many of these
                // cases in other validators. Keep exhaustive-deps conservative here.
                return;
            };

            let inferred = collect_callback_dependencies(&callback_expr, self.outer_bindings);
            let inferred = dedup_dependencies(inferred);
            let inferred = inferred
                .into_iter()
                .filter(|dep| !dep.path.iter().any(|segment| segment == "current"))
                .collect::<Vec<_>>();
            let manual = dedup_dependencies(manual);

            let mut missing = Vec::new();
            for inferred_dep in &inferred {
                if is_probably_stable_dependency(inferred_dep, self.stable_bindings) {
                    continue;
                }
                let matched = manual
                    .iter()
                    .any(|manual_dep| dependency_prefix_match(manual_dep, inferred_dep));
                if !matched {
                    missing.push(inferred_dep.clone());
                }
            }

            let mut extra = Vec::new();
            for manual_dep in &manual {
                let matched = inferred
                    .iter()
                    .any(|inferred_dep| dependency_prefix_match(manual_dep, inferred_dep));
                if !matched {
                    extra.push(manual_dep.clone());
                }
            }

            if matches!(kind, HookCallKind::Effect) {
                match self.validate_effect_mode {
                    ExhaustiveEffectDependenciesMode::MissingOnly => extra.clear(),
                    ExhaustiveEffectDependenciesMode::ExtraOnly => missing.clear(),
                    ExhaustiveEffectDependenciesMode::All
                    | ExhaustiveEffectDependenciesMode::Off => {}
                }
            }

            if missing.is_empty() && extra.is_empty() {
                return;
            }

            let (category, reason, description) = report_strings(kind, &missing, &extra);

            let mut detail = CompilerErrorDetail::error(category, reason);
            let mut description_lines = vec![description.to_string()];
            if !missing.is_empty() {
                description_lines.push(format!(
                    "Missing dependencies: [{}]",
                    missing
                        .iter()
                        .map(format_dependency)
                        .collect::<Vec<_>>()
                        .join(", ")
                ));
            }
            if !extra.is_empty() {
                description_lines.push(format!(
                    "Extra dependencies: [{}]",
                    extra
                        .iter()
                        .map(format_dependency)
                        .collect::<Vec<_>>()
                        .join(", ")
                ));
            }
            description_lines.push(format!(
                "Inferred dependencies: `[{}]`",
                inferred
                    .iter()
                    .map(format_dependency)
                    .collect::<Vec<_>>()
                    .join(", ")
            ));
            detail.description = Some(description_lines.join("\n"));
            detail.loc = Some(call.span);
            self.details.push(detail);
        }
    }

    impl swc_ecma_visit::Visit for Visitor<'_> {
        fn visit_call_expr(&mut self, call: &swc_ecma_ast::CallExpr) {
            self.validate_call(call);
            call.visit_children_with(self);
        }
    }

    use swc_ecma_visit::VisitWith;
    let mut visitor = Visitor {
        outer_bindings: &outer_bindings,
        function_like_bindings: &function_like_bindings,
        stable_bindings: &stable_bindings,
        validate_memo: validate_exhaustive_memoization_dependencies,
        validate_effect_mode: validate_exhaustive_effect_dependencies,
        details: &mut details,
    };
    body.visit_with(&mut visitor);

    if details.is_empty() {
        Ok(())
    } else {
        Err(CompilerError { details })
    }
}

fn dedup_dependencies(deps: Vec<Dependency>) -> Vec<Dependency> {
    let mut out = Vec::new();
    for dep in deps {
        if out
            .iter()
            .any(|item: &Dependency| item.root == dep.root && item.path == dep.path)
        {
            continue;
        }
        out.push(dep);
    }
    out
}

fn report_strings(
    kind: HookCallKind,
    missing: &[Dependency],
    extra: &[Dependency],
) -> (ErrorCategory, &'static str, &'static str) {
    match kind {
        HookCallKind::Memo | HookCallKind::Callback => {
            let reason = if !missing.is_empty() && !extra.is_empty() {
                "Found missing/extra memoization dependencies"
            } else if !missing.is_empty() {
                "Found missing memoization dependencies"
            } else {
                "Found extra memoization dependencies"
            };

            let description = if !missing.is_empty() && !extra.is_empty() {
                "Missing dependencies can cause a value to update less often than it should, \
                 resulting in stale UI. Extra dependencies can cause a value to update more often \
                 than it should, resulting in performance problems such as excessive renders or \
                 effects firing too often."
            } else if !missing.is_empty() {
                "Missing dependencies can cause a value to update less often than it should, \
                 resulting in stale UI."
            } else {
                "Extra dependencies can cause a value to update more often than it should, \
                 resulting in performance problems such as excessive renders or effects firing too \
                 often."
            };

            (ErrorCategory::MemoDependencies, reason, description)
        }
        HookCallKind::Effect => {
            let reason = if !missing.is_empty() && !extra.is_empty() {
                "Found missing/extra effect dependencies"
            } else if !missing.is_empty() {
                "Found missing effect dependencies"
            } else {
                "Found extra effect dependencies"
            };

            let description = if !missing.is_empty() && !extra.is_empty() {
                "Missing dependencies can cause an effect to fire less often than it should. Extra \
                 dependencies can cause an effect to fire more often than it should, resulting in \
                 performance problems such as excessive renders and side effects."
            } else if !missing.is_empty() {
                "Missing dependencies can cause an effect to fire less often than it should."
            } else {
                "Extra dependencies can cause an effect to fire more often than it should, \
                 resulting in performance problems such as excessive renders and side effects."
            };

            (
                ErrorCategory::EffectExhaustiveDependencies,
                reason,
                description,
            )
        }
    }
}
