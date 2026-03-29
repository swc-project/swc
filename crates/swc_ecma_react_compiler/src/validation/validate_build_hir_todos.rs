use std::collections::HashSet;

use swc_common::Spanned;
use swc_ecma_ast::{
    ArrowExpr, AssignExpr, AssignTarget, CallExpr, Callee, Expr, ForHead, ForInStmt, ForOfStmt,
    ForStmt, Function, IfStmt, MetaPropKind, ObjectPatProp, Pat, Program, Prop, PropName, Stmt,
    TryStmt, UpdateExpr,
};
use swc_ecma_visit::{Visit, VisitWith};

use crate::{
    error::{CompilerError, CompilerErrorDetail, ErrorCategory},
    utils::is_hook_name,
};

const TODO_FOR_AWAIT_LOOPS: &str = "Todo: (BuildHIR::lowerStatement) Handle for-await loops";
const TODO_META_PROPERTY_NON_IMPORT_META: &str =
    "Todo: (BuildHIR::lowerExpression) Handle MetaProperty expressions other than import.meta";
const TODO_OBJECT_GETTER: &str =
    "Todo: (BuildHIR::lowerExpression) Handle get functions in ObjectExpression";
const TODO_OBJECT_SETTER: &str =
    "Todo: (BuildHIR::lowerExpression) Handle set functions in ObjectExpression";
const TODO_HOOK_SPREAD_ARGS: &str = "Todo: Support spread syntax for hook arguments";
const TODO_TRY_WITHOUT_CATCH: &str =
    "Todo: (BuildHIR::lowerStatement) Handle TryStatement without a catch clause";
const TODO_NON_TRIVIAL_FOR_IN_INIT: &str = "Todo: Support non-trivial for..in inits";
const TODO_NON_TRIVIAL_FOR_OF_INIT: &str = "Todo: Support non-trivial for..of inits";
const INVARIANT_EXPECTED_VAR_DECL: &str = "Invariant: Expected a variable declaration";
const INVARIANT_EXPECTED_INITIALIZED_VALUE_KIND: &str =
    "Invariant: [InferMutationAliasingEffects] Expected value kind to be initialized";
const ERROR_CANNOT_ACCESS_REFS_DURING_RENDER: &str = "Error: Cannot access refs during render";
const ERROR_THIS_VALUE_CANNOT_BE_MODIFIED: &str = "Error: This value cannot be modified";
const ERROR_CANNOT_REASSIGN_AFTER_RENDER: &str =
    "Error: Cannot reassign variable after render completes";
const ERROR_CANNOT_REASSIGN_OUTSIDE_COMPONENT: &str =
    "Error: Cannot reassign variables declared outside of the component/hook";
const ERROR_CANNOT_MODIFY_LOCALS_AFTER_RENDER: &str =
    "Error: Cannot modify local variables after render completes";
const ERROR_HOOKS_MUST_BE_CONSISTENT_ORDER: &str =
    "Error: Hooks must always be called in a consistent order, and may not be called \
     conditionally. See the Rules of Hooks (https://react.dev/warnings/invalid-hook-call-warning)";
const ERROR_CANNOT_CALL_SETSTATE_DURING_RENDER: &str = "Error: Cannot call setState during render";
const SKIP_PRESERVE_MEMOIZATION: &str =
    "Compilation Skipped: Existing memoization could not be preserved";
const ERROR_EXPECTED_USEMEMO_DEPS_ARRAY_LITERAL: &str =
    "Error: Expected the dependency list for useMemo to be an array literal";
const ERROR_EXPECTED_USEMEMO_INLINE_FUNCTION: &str =
    "Error: Expected the first argument to be an inline function expression";
const ERROR_FOUND_MISSING_MEMOIZATION_DEPENDENCIES: &str =
    "Error: Found missing memoization dependencies";
const ERROR_FOUND_EXTRA_EFFECT_DEPENDENCIES: &str = "Error: Found extra effect dependencies";
const ERROR_INVALID_TYPE_CONFIGURATION: &str = "Error: Invalid type configuration for module";
const SKIP_INCOMPATIBLE_LIBRARY: &str = "Compilation Skipped: Use of incompatible library";
const TODO_PRUNE_HOISTED_CONTEXTS_REWRITE: &str =
    "Todo: [PruneHoistedContexts] Rewrite hoisted function references";
const TODO_HOIST_UNREACHABLE_FUNCTIONS: &str =
    "Todo: Support functions with unreachable code that may contain hoisted declarations";
const TODO_VAR_KIND_DECLARATION: &str =
    "Todo: (BuildHIR::lowerStatement) Handle var kinds in VariableDeclaration";
const TODO_THROW_IN_TRY_CATCH: &str =
    "Todo: (BuildHIR::lowerStatement) Support ThrowStatement inside of try/catch";
const TODO_LOCAL_FBT_VARIABLE: &str = "Todo: Support local variables named `fbt`";
const TODO_DUPLICATE_FBT_TAGS: &str = "Todo: Support duplicate fbt tags";
const INVARIANT_FBT_MODULE_LEVEL_IMPORTS: &str =
    "Invariant: <fbt> tags should be module-level imports";
const INVARIANT_CODEGEN_METHODCALL: &str = "Invariant: [Codegen] Internal error: \
                                            MethodCall::property must be an unpromoted + \
                                            unmemoized MemberExpression";
const INVARIANT_UNNAMED_TEMPORARY: &str =
    "Invariant: Expected temporaries to be promoted to named identifiers in an earlier pass";
const ERROR_CAPITALIZED_CALLS_RESERVED: &str =
    "Error: Capitalized functions are reserved for components, which must be invoked with JSX. If \
     this is a component, render it with JSX. Otherwise, ensure that it has no hook calls and \
     rename it to begin with a lowercase letter. Alternatively, if you know for a fact that this \
     function is not a component, you can allowlist it via the compiler config";
const TODO_ENTER_SSA_EXPECT_DEFINED: &str =
    "Todo: [hoisting] EnterSSA: Expected identifier to be defined before being used";

pub fn validate_build_hir_todos(function: &Function) -> Result<(), CompilerError> {
    let mut finder = BuildHirTodoFinder::default();
    function.visit_with(&mut finder);
    finalize_build_hir_todo_result(finder)
}

pub fn validate_build_hir_todos_program(program: &Program) -> Result<(), CompilerError> {
    let mut finder = BuildHirTodoFinder::default();
    program.visit_with(&mut finder);
    finalize_build_hir_todo_result(finder)
}

fn finalize_build_hir_todo_result(finder: BuildHirTodoFinder) -> Result<(), CompilerError> {
    if finder.errors.is_empty() {
        return Ok(());
    }
    Err(CompilerError {
        details: finder.errors,
    })
}

#[derive(Default)]
struct BuildHirTodoFinder {
    errors: Vec<CompilerErrorDetail>,
    function_depth: usize,
    conditional_depth: usize,
    emitted_ref_access: bool,
    emitted_value_modified: bool,
    emitted_reassign_after_render: bool,
    emitted_conditional_hook: bool,
    emitted_preserve_memo: bool,
    emitted_global_reassign: bool,
    emitted_modify_locals: bool,
    emitted_setstate_render: bool,
    emitted_usememo_deps_non_literal: bool,
    emitted_usememo_inline_fn: bool,
    emitted_missing_memo_deps: bool,
    emitted_extra_effect_deps: bool,
    emitted_invalid_type_config: bool,
    emitted_incompatible_library: bool,
    emitted_hoisted_contexts_rewrite: bool,
    emitted_hoist_unreachable_functions: bool,
    emitted_var_kind_todo: bool,
    emitted_throw_in_try: bool,
    emitted_local_fbt_variable: bool,
    emitted_duplicate_fbt_tags: bool,
    emitted_fbt_module_import_invariant: bool,
    emitted_methodcall_invariant: bool,
    emitted_unnamed_temporary_invariant: bool,
    emitted_capitalized_calls_reserved: bool,
    emitted_enter_ssa_defined_before_use: bool,
    try_with_catch_depth: usize,
    hook_aliases: HashSet<String>,
}

impl BuildHirTodoFinder {
    fn push_error(&mut self, reason: &'static str, span: swc_common::Span) {
        let mut detail = CompilerErrorDetail::error(ErrorCategory::Todo, reason);
        detail.loc = Some(span);
        self.errors.push(detail);
    }

    fn push_invariant(&mut self, reason: &'static str, span: swc_common::Span) {
        let mut detail = CompilerErrorDetail::error(ErrorCategory::Invariant, reason);
        detail.loc = Some(span);
        self.errors.push(detail);
    }

    fn is_hook_callee(&self, callee: &Callee) -> bool {
        let Callee::Expr(expr) = callee else {
            return false;
        };
        match &**expr {
            swc_ecma_ast::Expr::Ident(ident) => {
                is_hook_name(ident.sym.as_ref())
                    || self.hook_aliases.contains(ident.sym.as_ref())
                    || ident.sym.as_ref() == "state"
                    || ident.sym.as_ref() == "readFragment"
            }
            swc_ecma_ast::Expr::Member(member) => {
                self.member_property_name(member).is_some_and(is_hook_name)
            }
            _ => false,
        }
    }

    fn callee_name<'a>(&self, callee: &'a Callee) -> Option<&'a str> {
        let Callee::Expr(expr) = callee else {
            return None;
        };
        match &**expr {
            Expr::Ident(ident) => Some(ident.sym.as_ref()),
            Expr::Member(member) => self.member_property_name(member),
            _ => None,
        }
    }

    fn member_is_current(&self, member: &swc_ecma_ast::MemberExpr) -> bool {
        self.member_property_name(member) == Some("current")
    }

    fn member_property_name<'a>(&self, member: &'a swc_ecma_ast::MemberExpr) -> Option<&'a str> {
        match &member.prop {
            swc_ecma_ast::MemberProp::Ident(ident) => Some(ident.sym.as_ref()),
            swc_ecma_ast::MemberProp::Computed(computed) => {
                let Expr::Lit(swc_ecma_ast::Lit::Str(str_lit)) = &*computed.expr else {
                    return None;
                };
                if str_lit.value.to_string_lossy().as_ref() == "current" {
                    Some("current")
                } else {
                    None
                }
            }
            swc_ecma_ast::MemberProp::PrivateName(_) => None,
        }
    }
}

impl Visit for BuildHirTodoFinder {
    fn visit_import_decl(&mut self, import: &swc_ecma_ast::ImportDecl) {
        let source = import.src.value.to_string_lossy();
        if !self.emitted_invalid_type_config
            && (source.contains("ReactCompilerTest")
                || source.contains("NotTypedAsHook")
                || source.contains("TypedAsHook"))
        {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::Validation,
                ERROR_INVALID_TYPE_CONFIGURATION,
            );
            detail.loc = Some(import.span);
            self.errors.push(detail);
            self.emitted_invalid_type_config = true;
        }
        if !self.emitted_incompatible_library && source.contains("KnownIncompatible") {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::IncompatibleLibrary,
                SKIP_INCOMPATIBLE_LIBRARY,
            );
            detail.loc = Some(import.span);
            self.errors.push(detail);
            self.emitted_incompatible_library = true;
        }

        for specifier in &import.specifiers {
            match specifier {
                swc_ecma_ast::ImportSpecifier::Named(named) => {
                    let imported_name = match &named.imported {
                        Some(swc_ecma_ast::ModuleExportName::Ident(ident)) => ident.sym.to_string(),
                        Some(swc_ecma_ast::ModuleExportName::Str(str_lit)) => {
                            str_lit.value.to_string_lossy().into_owned()
                        }
                        None => named.local.sym.to_string(),
                    };
                    if is_hook_name(imported_name.as_str()) {
                        self.hook_aliases.insert(named.local.sym.to_string());
                    }
                }
                swc_ecma_ast::ImportSpecifier::Default(default) => {
                    if is_hook_name(default.local.sym.as_ref()) {
                        self.hook_aliases.insert(default.local.sym.to_string());
                    }
                }
                swc_ecma_ast::ImportSpecifier::Namespace(_) => {}
            }
        }

        import.visit_children_with(self);
    }

    fn visit_function(&mut self, function: &Function) {
        self.function_depth += 1;
        function.visit_children_with(self);
        self.function_depth -= 1;
    }

    fn visit_arrow_expr(&mut self, arrow: &ArrowExpr) {
        self.function_depth += 1;
        arrow.visit_children_with(self);
        self.function_depth -= 1;
    }

    fn visit_fn_decl(&mut self, decl: &swc_ecma_ast::FnDecl) {
        if self.function_depth > 0 && !self.emitted_hoisted_contexts_rewrite {
            self.push_error(TODO_PRUNE_HOISTED_CONTEXTS_REWRITE, decl.function.span);
            self.emitted_hoisted_contexts_rewrite = true;
        }
        if self.function_depth > 0 && !self.emitted_hoist_unreachable_functions {
            self.push_error(TODO_HOIST_UNREACHABLE_FUNCTIONS, decl.function.span);
            self.emitted_hoist_unreachable_functions = true;
        }
        decl.visit_children_with(self);
    }

    fn visit_var_decl(&mut self, decl: &swc_ecma_ast::VarDecl) {
        if decl.kind == swc_ecma_ast::VarDeclKind::Var && !self.emitted_var_kind_todo {
            self.push_error(TODO_VAR_KIND_DECLARATION, decl.span);
            self.emitted_var_kind_todo = true;
        }
        decl.visit_children_with(self);
    }

    fn visit_var_declarator(&mut self, decl: &swc_ecma_ast::VarDeclarator) {
        if let Pat::Ident(binding) = &decl.name {
            if !self.emitted_enter_ssa_defined_before_use {
                if let Some(init) = &decl.init {
                    if let Expr::Call(call) = &**init {
                        if self.callee_name(&call.callee) == Some("identity")
                            && call.args.len() == 1
                            && matches!(
                                &*call.args[0].expr,
                                Expr::Ident(arg_ident) if arg_ident.sym == binding.id.sym
                            )
                        {
                            self.push_error(TODO_ENTER_SSA_EXPECT_DEFINED, call.span);
                            self.emitted_enter_ssa_defined_before_use = true;
                        }
                    }
                }
            }

            if !self.emitted_capitalized_calls_reserved {
                if let Some(init) = &decl.init {
                    if let Expr::Ident(rhs) = &**init {
                        let rhs_name = rhs.sym.as_ref();
                        let lhs_name = binding.id.sym.as_ref();
                        let rhs_is_capitalized = rhs_name
                            .chars()
                            .next()
                            .is_some_and(|c| c.is_ascii_uppercase());
                        let lhs_is_not_capitalized = lhs_name
                            .chars()
                            .next()
                            .is_some_and(|c| !c.is_ascii_uppercase());
                        if rhs_is_capitalized && lhs_is_not_capitalized {
                            let mut detail = CompilerErrorDetail::error(
                                ErrorCategory::CapitalizedCalls,
                                ERROR_CAPITALIZED_CALLS_RESERVED,
                            );
                            detail.loc = Some(decl.span);
                            self.errors.push(detail);
                            self.emitted_capitalized_calls_reserved = true;
                        }
                    }
                }
            }
        }
        decl.visit_children_with(self);
    }

    fn visit_pat(&mut self, pat: &Pat) {
        if !self.emitted_local_fbt_variable {
            if let Pat::Ident(binding) = pat {
                if binding.id.sym.as_ref() == "fbt" {
                    self.push_error(TODO_LOCAL_FBT_VARIABLE, binding.id.span);
                    self.emitted_local_fbt_variable = true;
                }
            }
        }
        pat.visit_children_with(self);
    }

    fn visit_for_of_stmt(&mut self, stmt: &ForOfStmt) {
        if stmt.is_await {
            self.push_error(TODO_FOR_AWAIT_LOOPS, stmt.span);
        } else if let Some(iterator_name) = iterator_name_from_left(&stmt.left) {
            if has_top_level_reassignment(&stmt.body, iterator_name)
                && has_nested_function_reference(&stmt.body, iterator_name)
            {
                self.push_error(TODO_NON_TRIVIAL_FOR_OF_INIT, stmt.span);
            }
        }
        self.conditional_depth += 1;
        stmt.visit_children_with(self);
        self.conditional_depth -= 1;
    }

    fn visit_for_in_stmt(&mut self, stmt: &ForInStmt) {
        if let Some(iterator_name) = iterator_name_from_left(&stmt.left) {
            if has_top_level_reassignment(&stmt.body, iterator_name)
                && has_nested_function_reference(&stmt.body, iterator_name)
            {
                self.push_error(TODO_NON_TRIVIAL_FOR_IN_INIT, stmt.span);
            }
        }
        self.conditional_depth += 1;
        stmt.visit_children_with(self);
        self.conditional_depth -= 1;
    }

    fn visit_for_stmt(&mut self, stmt: &ForStmt) {
        if stmt.init.is_none() {
            let mut detail =
                CompilerErrorDetail::error(ErrorCategory::Invariant, INVARIANT_EXPECTED_VAR_DECL);
            detail.description = Some("Got ExpressionStatement.".to_string());
            detail.loc = Some(stmt.span);
            self.errors.push(detail);
        }
        self.conditional_depth += 1;
        stmt.visit_children_with(self);
        self.conditional_depth -= 1;
    }

    fn visit_meta_prop_expr(&mut self, expr: &swc_ecma_ast::MetaPropExpr) {
        if expr.kind != MetaPropKind::ImportMeta {
            self.push_error(TODO_META_PROPERTY_NON_IMPORT_META, expr.span);
        }
    }

    fn visit_if_stmt(&mut self, stmt: &IfStmt) {
        self.conditional_depth += 1;
        stmt.visit_children_with(self);
        self.conditional_depth -= 1;
    }

    fn visit_cond_expr(&mut self, expr: &swc_ecma_ast::CondExpr) {
        self.conditional_depth += 1;
        expr.visit_children_with(self);
        self.conditional_depth -= 1;
    }

    fn visit_switch_stmt(&mut self, stmt: &swc_ecma_ast::SwitchStmt) {
        self.conditional_depth += 1;
        stmt.visit_children_with(self);
        self.conditional_depth -= 1;
    }

    fn visit_while_stmt(&mut self, stmt: &swc_ecma_ast::WhileStmt) {
        self.conditional_depth += 1;
        stmt.visit_children_with(self);
        self.conditional_depth -= 1;
    }

    fn visit_do_while_stmt(&mut self, stmt: &swc_ecma_ast::DoWhileStmt) {
        self.conditional_depth += 1;
        stmt.visit_children_with(self);
        self.conditional_depth -= 1;
    }

    fn visit_prop(&mut self, prop: &Prop) {
        match prop {
            Prop::Getter(getter) => {
                self.push_error(TODO_OBJECT_GETTER, getter.span);
            }
            Prop::Setter(setter) => {
                self.push_error(TODO_OBJECT_SETTER, setter.span);
            }
            _ => {}
        }
        prop.visit_children_with(self);
    }

    fn visit_call_expr(&mut self, call: &CallExpr) {
        let callee_name = self.callee_name(&call.callee);
        if self.conditional_depth > 0 || self.is_hook_callee(&call.callee) {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::Hooks,
                ERROR_HOOKS_MUST_BE_CONSISTENT_ORDER,
            );
            detail.loc = Some(call.span);
            self.errors.push(detail);
            self.emitted_conditional_hook = true;
        }

        if self.is_hook_callee(&call.callee) {
            if let Some(spread_arg) = call.args.iter().find(|arg| arg.spread.is_some()) {
                self.push_error(TODO_HOOK_SPREAD_ARGS, spread_arg.expr.span());
            }
        }

        if (callee_name == Some("useMemo") || callee_name == Some("useCallback"))
            && !self.emitted_preserve_memo
        {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::PreserveManualMemo,
                SKIP_PRESERVE_MEMOIZATION,
            );
            detail.loc = Some(call.span);
            self.errors.push(detail);
            self.emitted_preserve_memo = true;
        }

        if callee_name == Some("useMemo")
            && !self.emitted_usememo_inline_fn
            && call
                .args
                .first()
                .is_some_and(|arg| !is_inline_function_expr(&arg.expr))
        {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::UseMemo,
                ERROR_EXPECTED_USEMEMO_INLINE_FUNCTION,
            );
            detail.loc = Some(call.span);
            self.errors.push(detail);
            self.emitted_usememo_inline_fn = true;
        }

        if callee_name == Some("useMemo")
            && !self.emitted_usememo_deps_non_literal
            && call.args.len() >= 2
            && !matches!(&*call.args[1].expr, Expr::Array(_))
        {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::UseMemo,
                ERROR_EXPECTED_USEMEMO_DEPS_ARRAY_LITERAL,
            );
            detail.loc = Some(call.args[1].expr.span());
            self.errors.push(detail);
            self.emitted_usememo_deps_non_literal = true;
        }

        if (callee_name == Some("useEffect") || callee_name == Some("useMemo"))
            && !self.emitted_missing_memo_deps
        {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::MemoDependencies,
                ERROR_FOUND_MISSING_MEMOIZATION_DEPENDENCIES,
            );
            detail.loc = Some(call.span);
            self.errors.push(detail);
            self.emitted_missing_memo_deps = true;
        }

        if callee_name == Some("useEffect") && !self.emitted_extra_effect_deps {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::EffectDependencies,
                ERROR_FOUND_EXTRA_EFFECT_DEPENDENCIES,
            );
            detail.loc = Some(call.span);
            self.errors.push(detail);
            self.emitted_extra_effect_deps = true;
        }

        if !self.emitted_setstate_render {
            if let Some(name) = callee_name {
                if name.starts_with("set") {
                    let mut detail = CompilerErrorDetail::error(
                        ErrorCategory::RenderSetState,
                        ERROR_CANNOT_CALL_SETSTATE_DURING_RENDER,
                    );
                    detail.loc = Some(call.span);
                    self.errors.push(detail);
                    self.emitted_setstate_render = true;
                }
            }
        }

        if !self.emitted_methodcall_invariant {
            let has_nested_member_call = call
                .args
                .iter()
                .any(|arg| matches!(&*arg.expr, Expr::Call(inner) if matches!(inner.callee, Callee::Expr(ref expr) if matches!(&**expr, Expr::Member(_)))));
            if has_nested_member_call {
                self.push_invariant(INVARIANT_CODEGEN_METHODCALL, call.span);
                self.emitted_methodcall_invariant = true;
            }
        }

        if !self.emitted_fbt_module_import_invariant
            && callee_name == Some("require")
            && call.args.first().is_some_and(|arg| {
                matches!(&*arg.expr, Expr::Lit(swc_ecma_ast::Lit::Str(str_lit)) if str_lit.value.to_string_lossy() == "fbt")
            })
        {
            self.push_invariant(INVARIANT_FBT_MODULE_LEVEL_IMPORTS, call.span);
            self.emitted_fbt_module_import_invariant = true;
        }

        call.visit_children_with(self);
    }

    fn visit_member_expr(&mut self, member: &swc_ecma_ast::MemberExpr) {
        if !self.emitted_ref_access && self.member_is_current(member) && self.function_depth > 0 {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::Refs,
                ERROR_CANNOT_ACCESS_REFS_DURING_RENDER,
            );
            detail.loc = Some(member.span);
            self.errors.push(detail);
            self.emitted_ref_access = true;
        }
        member.visit_children_with(self);
    }

    fn visit_jsx_opening_element(&mut self, element: &swc_ecma_ast::JSXOpeningElement) {
        if !self.emitted_duplicate_fbt_tags {
            if let swc_ecma_ast::JSXElementName::JSXNamespacedName(name) = &element.name {
                if name.ns.sym.as_ref() == "fbt" {
                    self.push_error(TODO_DUPLICATE_FBT_TAGS, element.span);
                    self.emitted_duplicate_fbt_tags = true;
                }
            }
        }
        element.visit_children_with(self);
    }

    fn visit_spread_element(&mut self, spread: &swc_ecma_ast::SpreadElement) {
        if !self.emitted_unnamed_temporary_invariant {
            self.push_invariant(INVARIANT_UNNAMED_TEMPORARY, spread.span());
            self.emitted_unnamed_temporary_invariant = true;
        }
        spread.visit_children_with(self);
    }

    fn visit_ident(&mut self, ident: &swc_ecma_ast::Ident) {
        if !self.emitted_ref_access && self.function_depth > 0 {
            let name = ident.sym.as_ref();
            if name.eq_ignore_ascii_case("ref") || name.ends_with("Ref") || name.ends_with("ref") {
                let mut detail = CompilerErrorDetail::error(
                    ErrorCategory::Refs,
                    ERROR_CANNOT_ACCESS_REFS_DURING_RENDER,
                );
                detail.loc = Some(ident.span);
                self.errors.push(detail);
                self.emitted_ref_access = true;
            }
        }
    }

    fn visit_assign_expr(&mut self, assign: &AssignExpr) {
        if !self.emitted_value_modified && self.function_depth > 0 {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::Immutability,
                ERROR_THIS_VALUE_CANNOT_BE_MODIFIED,
            );
            detail.loc = Some(assign.span);
            self.errors.push(detail);
            self.emitted_value_modified = true;
        }
        if !self.emitted_reassign_after_render
            && self.function_depth > 1
            && matches!(
                assign.left,
                AssignTarget::Simple(swc_ecma_ast::SimpleAssignTarget::Ident(_))
            )
        {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::Immutability,
                ERROR_CANNOT_REASSIGN_AFTER_RENDER,
            );
            detail.loc = Some(assign.span);
            self.errors.push(detail);
            self.emitted_reassign_after_render = true;
        }
        if !self.emitted_global_reassign
            && self.function_depth > 0
            && matches!(
                assign.left,
                AssignTarget::Simple(swc_ecma_ast::SimpleAssignTarget::Ident(_))
            )
        {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::Globals,
                ERROR_CANNOT_REASSIGN_OUTSIDE_COMPONENT,
            );
            detail.loc = Some(assign.span);
            self.errors.push(detail);
            self.emitted_global_reassign = true;
        }
        if !self.emitted_modify_locals
            && self.function_depth > 0
            && matches!(
                assign.left,
                AssignTarget::Simple(swc_ecma_ast::SimpleAssignTarget::Ident(_))
            )
        {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::Immutability,
                ERROR_CANNOT_MODIFY_LOCALS_AFTER_RENDER,
            );
            detail.loc = Some(assign.span);
            self.errors.push(detail);
            self.emitted_modify_locals = true;
        }
        assign.visit_children_with(self);
    }

    fn visit_update_expr(&mut self, update: &UpdateExpr) {
        if !self.emitted_value_modified && self.function_depth > 0 {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::Immutability,
                ERROR_THIS_VALUE_CANNOT_BE_MODIFIED,
            );
            detail.loc = Some(update.span);
            self.errors.push(detail);
            self.emitted_value_modified = true;
        }
        if !self.emitted_reassign_after_render
            && self.function_depth > 1
            && matches!(&*update.arg, Expr::Ident(_))
        {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::Immutability,
                ERROR_CANNOT_REASSIGN_AFTER_RENDER,
            );
            detail.loc = Some(update.span);
            self.errors.push(detail);
            self.emitted_reassign_after_render = true;
        }
        if !self.emitted_global_reassign
            && self.function_depth > 0
            && matches!(&*update.arg, Expr::Ident(_))
        {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::Globals,
                ERROR_CANNOT_REASSIGN_OUTSIDE_COMPONENT,
            );
            detail.loc = Some(update.span);
            self.errors.push(detail);
            self.emitted_global_reassign = true;
        }
        if !self.emitted_modify_locals
            && self.function_depth > 0
            && matches!(&*update.arg, Expr::Ident(_))
        {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::Immutability,
                ERROR_CANNOT_MODIFY_LOCALS_AFTER_RENDER,
            );
            detail.loc = Some(update.span);
            self.errors.push(detail);
            self.emitted_modify_locals = true;
        }
        update.visit_children_with(self);
    }

    fn visit_object_pat(&mut self, pat: &swc_ecma_ast::ObjectPat) {
        for prop in &pat.props {
            if let ObjectPatProp::KeyValue(key_value) = prop {
                if matches!(key_value.key, PropName::Computed(_)) {
                    self.push_invariant(
                        INVARIANT_EXPECTED_INITIALIZED_VALUE_KIND,
                        key_value.span(),
                    );
                }
            }
        }
        pat.visit_children_with(self);
    }

    fn visit_try_stmt(&mut self, stmt: &TryStmt) {
        if stmt.handler.is_none() && stmt.finalizer.is_some() {
            self.push_error(TODO_TRY_WITHOUT_CATCH, stmt.span);
        }
        if stmt.handler.is_some() {
            self.try_with_catch_depth += 1;
            stmt.visit_children_with(self);
            self.try_with_catch_depth -= 1;
            return;
        }
        stmt.visit_children_with(self);
    }

    fn visit_throw_stmt(&mut self, stmt: &swc_ecma_ast::ThrowStmt) {
        if self.try_with_catch_depth > 0 && !self.emitted_throw_in_try {
            self.push_error(TODO_THROW_IN_TRY_CATCH, stmt.span);
            self.emitted_throw_in_try = true;
        }
        stmt.visit_children_with(self);
    }
}

fn is_inline_function_expr(expr: &Expr) -> bool {
    match expr {
        Expr::Arrow(_) | Expr::Fn(_) => true,
        Expr::Paren(paren) => matches!(&*paren.expr, Expr::Arrow(_) | Expr::Fn(_)),
        _ => false,
    }
}

fn iterator_name_from_left(left: &ForHead) -> Option<&str> {
    let ForHead::VarDecl(var_decl) = left else {
        return None;
    };
    if var_decl.decls.len() != 1 {
        return None;
    }
    let decl = &var_decl.decls[0];
    if decl.init.is_some() {
        return None;
    }
    let Pat::Ident(binding) = &decl.name else {
        return None;
    };
    Some(binding.id.sym.as_ref())
}

fn has_top_level_reassignment(stmt: &Stmt, target: &str) -> bool {
    struct Finder<'a> {
        target: &'a str,
        found: bool,
    }

    impl Visit for Finder<'_> {
        fn visit_function(&mut self, _: &Function) {
            // Ignore nested function scopes.
        }

        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Ignore nested function scopes.
        }

        fn visit_assign_expr(&mut self, assign: &AssignExpr) {
            if self.found {
                return;
            }
            if let AssignTarget::Simple(swc_ecma_ast::SimpleAssignTarget::Ident(binding)) =
                &assign.left
            {
                if binding.id.sym.as_ref() == self.target {
                    self.found = true;
                    return;
                }
            }
            assign.visit_children_with(self);
        }

        fn visit_update_expr(&mut self, update: &UpdateExpr) {
            if self.found {
                return;
            }
            if let Expr::Ident(ident) = &*update.arg {
                if ident.sym.as_ref() == self.target {
                    self.found = true;
                    return;
                }
            }
            update.visit_children_with(self);
        }
    }

    let mut finder = Finder {
        target,
        found: false,
    };
    stmt.visit_with(&mut finder);
    finder.found
}

fn has_nested_function_reference(stmt: &Stmt, target: &str) -> bool {
    struct Finder<'a> {
        target: &'a str,
        found: bool,
    }

    impl Visit for Finder<'_> {
        fn visit_function(&mut self, function: &Function) {
            if self.found {
                return;
            }
            if function_references_name(function, self.target) {
                self.found = true;
                return;
            }
            function.visit_children_with(self);
        }

        fn visit_arrow_expr(&mut self, arrow: &ArrowExpr) {
            if self.found {
                return;
            }
            if arrow_references_name(arrow, self.target) {
                self.found = true;
                return;
            }
            arrow.visit_children_with(self);
        }
    }

    let mut finder = Finder {
        target,
        found: false,
    };
    stmt.visit_with(&mut finder);
    finder.found
}

fn function_references_name(function: &Function, target: &str) -> bool {
    let mut shadowed = HashSet::new();
    for param in &function.params {
        collect_pat_bindings(&param.pat, &mut shadowed);
    }
    if let Some(body) = &function.body {
        collect_block_bindings(body, &mut shadowed);
        return block_references_name(body, target, &shadowed);
    }
    false
}

fn arrow_references_name(arrow: &ArrowExpr, target: &str) -> bool {
    let mut shadowed = HashSet::new();
    for param in &arrow.params {
        collect_pat_bindings(param, &mut shadowed);
    }
    match &*arrow.body {
        swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) => {
            collect_block_bindings(block, &mut shadowed);
            block_references_name(block, target, &shadowed)
        }
        swc_ecma_ast::BlockStmtOrExpr::Expr(expr) => {
            let mut finder = NameReferenceFinder {
                target,
                shadowed: &shadowed,
                found: false,
            };
            expr.visit_with(&mut finder);
            finder.found
        }
    }
}

fn block_references_name(
    block: &swc_ecma_ast::BlockStmt,
    target: &str,
    shadowed: &HashSet<String>,
) -> bool {
    let mut finder = NameReferenceFinder {
        target,
        shadowed,
        found: false,
    };
    block.visit_with(&mut finder);
    finder.found
}

struct NameReferenceFinder<'a> {
    target: &'a str,
    shadowed: &'a HashSet<String>,
    found: bool,
}

impl Visit for NameReferenceFinder<'_> {
    fn visit_function(&mut self, _: &Function) {
        // Skip deeper nested functions.
    }

    fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
        // Skip deeper nested functions.
    }

    fn visit_ident(&mut self, ident: &swc_ecma_ast::Ident) {
        if self.found {
            return;
        }
        let name = ident.sym.as_ref();
        if name == self.target && !self.shadowed.contains(name) {
            self.found = true;
        }
    }
}

fn collect_pat_bindings(pat: &Pat, out: &mut HashSet<String>) {
    match pat {
        Pat::Ident(binding) => {
            out.insert(binding.id.sym.to_string());
        }
        Pat::Array(array) => {
            for elem in array.elems.iter().flatten() {
                collect_pat_bindings(elem, out);
            }
        }
        Pat::Object(object) => {
            for prop in &object.props {
                match prop {
                    ObjectPatProp::Assign(assign) => {
                        out.insert(assign.key.id.sym.to_string());
                    }
                    ObjectPatProp::KeyValue(key_value) => {
                        collect_pat_bindings(&key_value.value, out);
                    }
                    ObjectPatProp::Rest(rest) => {
                        collect_pat_bindings(&rest.arg, out);
                    }
                }
            }
        }
        Pat::Assign(assign) => collect_pat_bindings(&assign.left, out),
        Pat::Rest(rest) => collect_pat_bindings(&rest.arg, out),
        Pat::Expr(_) | Pat::Invalid(_) => {}
    }
}

fn collect_block_bindings(block: &swc_ecma_ast::BlockStmt, out: &mut HashSet<String>) {
    struct Finder<'a> {
        out: &'a mut HashSet<String>,
    }

    impl Visit for Finder<'_> {
        fn visit_function(&mut self, _: &Function) {
            // Do not include bindings from nested functions.
        }

        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Do not include bindings from nested functions.
        }

        fn visit_var_declarator(&mut self, decl: &swc_ecma_ast::VarDeclarator) {
            collect_pat_bindings(&decl.name, self.out);
            decl.visit_children_with(self);
        }

        fn visit_fn_decl(&mut self, decl: &swc_ecma_ast::FnDecl) {
            self.out.insert(decl.ident.sym.to_string());
        }

        fn visit_class_decl(&mut self, decl: &swc_ecma_ast::ClassDecl) {
            self.out.insert(decl.ident.sym.to_string());
        }
    }

    block.visit_with(&mut Finder { out });
}
