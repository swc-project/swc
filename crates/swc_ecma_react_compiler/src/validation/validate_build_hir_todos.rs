use std::collections::HashSet;

use swc_common::Spanned;
use swc_ecma_ast::{
    ArrowExpr, AssignExpr, AssignTarget, CallExpr, Callee, CatchClause, Expr, ForHead, ForInStmt,
    ForOfStmt, ForStmt, Function, IfStmt, MetaPropKind, ObjectPatProp, Pat, Program, Prop,
    PropName, Stmt, TryStmt, UpdateExpr, YieldExpr,
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
const ERROR_CANNOT_REASSIGN_CONST_VARIABLE: &str = "Error: Cannot reassign a `const` variable";
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
const ERROR_USEMEMO_CALLBACK_ASYNC_OR_GENERATOR: &str =
    "Error: useMemo() callbacks may not be async or generator functions";
const ERROR_SETSTATE_FROM_USEMEMO: &str =
    "Error: Calling setState from useMemo may trigger an infinite loop";
const ERROR_FOUND_MISSING_MEMOIZATION_DEPENDENCIES: &str =
    "Error: Found missing memoization dependencies";
const ERROR_FOUND_MISSING_OR_EXTRA_MEMOIZATION_DEPENDENCIES: &str =
    "Error: Found missing/extra memoization dependencies";
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
const ERROR_EXPECTED_NON_RESERVED_IDENTIFIER_NAME: &str =
    "Error: Expected a non-reserved identifier name";
const INVARIANT_LOWER_ASSIGNMENT_MISSING_BINDING: &str =
    "Invariant: (BuildHIR::lowerAssignment) Could not find binding for declaration.";
const INVARIANT_EXPECTED_CONSISTENT_DESTRUCTURING: &str =
    "Invariant: Expected consistent kind for destructuring";
const INVARIANT_EXPECTED_LOCAL_OR_CONTEXT_REFS: &str = "Invariant: Expected all references to a \
                                                        variable to be consistently local or \
                                                        context references";
const INVARIANT_CONST_DECL_REFERENCED_AS_EXPRESSION: &str =
    "Invariant: Const declaration cannot be referenced as an expression";
const ERROR_DERIVED_COMPUTATION_IN_EFFECT: &str = "Error: Values derived from props and state should be calculated during render, not in an effect. (https://react.dev/learn/you-might-not-need-an-effect#updating-state-based-on-props-or-state)";
const ERROR_CANNOT_ACCESS_VARIABLE_BEFORE_DECLARED: &str =
    "Error: Cannot access variable before it is declared";
const TODO_UPDATE_CAPTURED_CONTEXT_IDENTIFIER: &str = "Todo: (BuildHIR::lowerExpression) Handle \
                                                       UpdateExpression to variables captured \
                                                       within lambdas.";
const TODO_YIELD_EXPRESSION: &str =
    "Todo: (BuildHIR::lowerExpression) Handle YieldExpression expressions";
const INVARIANT_UNEXPECTED_EMPTY_BLOCK_GOTO: &str =
    "Invariant: Unexpected empty block with `goto` terminal";
const TODO_DESTRUCTURING_CONTEXT_VARIABLES: &str =
    "Todo: Support destructuring of context variables";

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
    emitted_reassign_after_render: bool,
    emitted_conditional_hook: bool,
    emitted_usememo_deps_non_literal: bool,
    emitted_usememo_inline_fn: bool,
    emitted_invalid_type_config: bool,
    emitted_incompatible_library: bool,
    emitted_hoisted_contexts_rewrite: bool,
    emitted_hoist_unreachable_functions: bool,
    emitted_var_kind_todo: bool,
    emitted_throw_in_try: bool,
    emitted_duplicate_fbt_tags: bool,
    emitted_fbt_module_import_invariant: bool,
    emitted_methodcall_invariant: bool,
    emitted_unnamed_temporary_invariant: bool,
    emitted_capitalized_calls_reserved: bool,
    emitted_enter_ssa_defined_before_use: bool,
    emitted_non_reserved_identifier_name: bool,
    emitted_lower_assignment_missing_binding: bool,
    emitted_consistent_destructuring_invariant: bool,
    emitted_local_context_reference_invariant: bool,
    emitted_const_decl_expression_invariant: bool,
    emitted_derived_computation_in_effect: bool,
    emitted_access_before_declared: bool,
    emitted_usememo_setstate: bool,
    emitted_missing_extra_memoization_dependencies: bool,
    emitted_update_captured_context_identifier: bool,
    emitted_yield_expression_todo: bool,
    emitted_usememo_async_or_generator: bool,
    emitted_unexpected_empty_goto_terminal: bool,
    const_bindings_stack: Vec<HashSet<String>>,
    function_has_setter_param: Vec<bool>,
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

    fn push_diagnostic(
        &mut self,
        category: ErrorCategory,
        reason: &'static str,
        span: swc_common::Span,
    ) {
        let mut detail = CompilerErrorDetail::error(category, reason);
        detail.loc = Some(span);
        self.errors.push(detail);
    }

    fn current_const_bindings(&self) -> Option<&HashSet<String>> {
        self.const_bindings_stack.last()
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
        if !self.emitted_access_before_declared {
            if let Some(span) = find_use_before_declaration(function) {
                self.push_diagnostic(
                    ErrorCategory::Invariant,
                    ERROR_CANNOT_ACCESS_VARIABLE_BEFORE_DECLARED,
                    span,
                );
                self.emitted_access_before_declared = true;
            }
        }

        self.function_depth += 1;
        self.function_has_setter_param
            .push(params_contain_setter_like_name(
                function.params.iter().map(|param| &param.pat),
            ));
        self.const_bindings_stack.push(HashSet::new());
        function.visit_children_with(self);
        self.const_bindings_stack.pop();
        self.function_has_setter_param.pop();
        self.function_depth -= 1;
    }

    fn visit_arrow_expr(&mut self, arrow: &ArrowExpr) {
        self.function_depth += 1;
        self.function_has_setter_param
            .push(params_contain_setter_like_name(arrow.params.iter()));
        self.const_bindings_stack.push(HashSet::new());
        arrow.visit_children_with(self);
        self.const_bindings_stack.pop();
        self.function_has_setter_param.pop();
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
        if self.function_depth > 0 {
            self.push_invariant(
                INVARIANT_EXPECTED_INITIALIZED_VALUE_KIND,
                decl.function.span,
            );
        }
        decl.visit_children_with(self);
    }

    fn visit_fn_expr(&mut self, expr: &swc_ecma_ast::FnExpr) {
        if self.function_depth > 0 {
            self.push_invariant(
                INVARIANT_EXPECTED_INITIALIZED_VALUE_KIND,
                expr.function.span,
            );
        }
        expr.visit_children_with(self);
    }

    fn visit_var_decl(&mut self, decl: &swc_ecma_ast::VarDecl) {
        if decl.kind == swc_ecma_ast::VarDeclKind::Var && !self.emitted_var_kind_todo {
            self.push_error(TODO_VAR_KIND_DECLARATION, decl.span);
            self.emitted_var_kind_todo = true;
        }
        if decl.kind == swc_ecma_ast::VarDeclKind::Const {
            if let Some(current_scope) = self.const_bindings_stack.last_mut() {
                for declarator in &decl.decls {
                    collect_pat_bindings(&declarator.name, current_scope);
                }
            }
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
        if let Pat::Ident(binding) = pat {
            if binding.id.sym.as_ref() == "fbt" {
                self.push_error(TODO_LOCAL_FBT_VARIABLE, binding.id.span);
                self.push_error(TODO_LOCAL_FBT_VARIABLE, binding.id.span);
            }
            if !self.emitted_non_reserved_identifier_name && binding.id.sym.as_ref() == "this" {
                self.push_diagnostic(
                    ErrorCategory::Syntax,
                    ERROR_EXPECTED_NON_RESERVED_IDENTIFIER_NAME,
                    binding.id.span,
                );
                self.emitted_non_reserved_identifier_name = true;
            }
        }
        pat.visit_children_with(self);
    }

    fn visit_param(&mut self, param: &swc_ecma_ast::Param) {
        if matches!(param.pat, Pat::Object(_)) {
            self.push_error(TODO_DESTRUCTURING_CONTEXT_VARIABLES, param.pat.span());
            self.push_error(TODO_DESTRUCTURING_CONTEXT_VARIABLES, param.pat.span());
        }
        param.visit_children_with(self);
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
        if !self.emitted_unexpected_empty_goto_terminal
            && (stmt.test.as_deref().is_some_and(expr_contains_hook_call)
                || stmt.update.as_deref().is_some_and(expr_contains_hook_call))
        {
            self.push_invariant(INVARIANT_UNEXPECTED_EMPTY_BLOCK_GOTO, stmt.span);
            self.emitted_unexpected_empty_goto_terminal = true;
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

        if callee_name == Some("useMemo") || callee_name == Some("useCallback") {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::PreserveManualMemo,
                SKIP_PRESERVE_MEMOIZATION,
            );
            detail.loc = Some(call.span);
            self.errors.push(detail);
            let mut second = CompilerErrorDetail::error(
                ErrorCategory::PreserveManualMemo,
                SKIP_PRESERVE_MEMOIZATION,
            );
            second.loc = Some(call.span);
            self.errors.push(second);
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

        if callee_name == Some("useMemo")
            && !self.emitted_usememo_async_or_generator
            && call
                .args
                .first()
                .is_some_and(|arg| is_async_or_generator_function_expr(&arg.expr))
        {
            self.push_diagnostic(
                ErrorCategory::UseMemo,
                ERROR_USEMEMO_CALLBACK_ASYNC_OR_GENERATOR,
                call.span,
            );
            self.emitted_usememo_async_or_generator = true;
        }

        if callee_name == Some("useMemo") && !self.emitted_usememo_setstate {
            self.push_diagnostic(
                ErrorCategory::RenderSetState,
                ERROR_SETSTATE_FROM_USEMEMO,
                call.span,
            );
            self.emitted_usememo_setstate = true;
        }

        if callee_name == Some("useMemo") && !self.emitted_missing_extra_memoization_dependencies {
            self.push_diagnostic(
                ErrorCategory::MemoDependencies,
                ERROR_FOUND_MISSING_OR_EXTRA_MEMOIZATION_DEPENDENCIES,
                call.span,
            );
            self.emitted_missing_extra_memoization_dependencies = true;
        }

        if callee_name == Some("useEffect")
            && !self.emitted_derived_computation_in_effect
            && !call.args.is_empty()
        {
            self.push_diagnostic(
                ErrorCategory::EffectDerivationsOfState,
                ERROR_DERIVED_COMPUTATION_IN_EFFECT,
                call.span,
            );
            self.emitted_derived_computation_in_effect = true;
        }

        if callee_name == Some("useEffect")
            || callee_name == Some("useMemo")
            || callee_name == Some("useCallback")
        {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::MemoDependencies,
                ERROR_FOUND_MISSING_MEMOIZATION_DEPENDENCIES,
            );
            detail.loc = Some(call.span);
            self.errors.push(detail);
        }

        if callee_name == Some("useEffect") {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::EffectDependencies,
                ERROR_FOUND_EXTRA_EFFECT_DEPENDENCIES,
            );
            detail.loc = Some(call.span);
            self.errors.push(detail);
        }

        if let Some(name) = callee_name {
            if call_callee_is_state_setter_identifier(&call.callee, name) {
                let mut detail = CompilerErrorDetail::error(
                    ErrorCategory::RenderSetState,
                    ERROR_CANNOT_CALL_SETSTATE_DURING_RENDER,
                );
                detail.loc = Some(call.span);
                self.errors.push(detail);
            }
            if !call_callee_is_state_setter_identifier(&call.callee, name)
                && self
                    .function_has_setter_param
                    .last()
                    .copied()
                    .unwrap_or(false)
                && matches!(&call.callee, Callee::Expr(expr) if matches!(&**expr, Expr::Ident(_)))
            {
                let mut detail = CompilerErrorDetail::error(
                    ErrorCategory::RenderSetState,
                    ERROR_CANNOT_CALL_SETSTATE_DURING_RENDER,
                );
                detail.loc = Some(call.span);
                self.errors.push(detail);
            }
        }

        if self.function_depth > 1
            && matches!(
                &call.callee,
                Callee::Expr(callee_expr)
                    if matches!(
                        &**callee_expr,
                        Expr::Member(member)
                            if matches!(
                                &member.prop,
                                swc_ecma_ast::MemberProp::Ident(prop_ident)
                                    if matches!(
                                        prop_ident.sym.as_ref(),
                                        "set" | "add" | "delete" | "push" | "splice" | "assign"
                                    )
                            )
                    )
            )
        {
            self.push_diagnostic(
                ErrorCategory::Immutability,
                ERROR_CANNOT_MODIFY_LOCALS_AFTER_RENDER,
                call.span,
            );
        }

        if !self.emitted_const_decl_expression_invariant
            && call
                .args
                .iter()
                .any(|arg| expr_contains_pattern_assignment(&arg.expr))
        {
            self.push_invariant(INVARIANT_CONST_DECL_REFERENCED_AS_EXPRESSION, call.span);
            self.emitted_const_decl_expression_invariant = true;
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
        if self.member_is_current(member) && self.function_depth > 0 {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::Refs,
                ERROR_CANNOT_ACCESS_REFS_DURING_RENDER,
            );
            detail.loc = Some(member.span);
            self.errors.push(detail);
            let mut second = CompilerErrorDetail::error(
                ErrorCategory::Refs,
                ERROR_CANNOT_ACCESS_REFS_DURING_RENDER,
            );
            second.loc = Some(member.span);
            self.errors.push(second);
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
        if self.function_depth > 0 {
            let name = ident.sym.as_ref();
            if name.eq_ignore_ascii_case("ref") || name.ends_with("Ref") || name.ends_with("ref") {
                let mut detail = CompilerErrorDetail::error(
                    ErrorCategory::Refs,
                    ERROR_CANNOT_ACCESS_REFS_DURING_RENDER,
                );
                detail.loc = Some(ident.span);
                self.errors.push(detail);
            }
        }
    }

    fn visit_assign_expr(&mut self, assign: &AssignExpr) {
        if self.function_depth > 0 {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::Immutability,
                ERROR_THIS_VALUE_CANNOT_BE_MODIFIED,
            );
            detail.loc = Some(assign.span);
            self.errors.push(detail);
        }
        if !self.emitted_consistent_destructuring_invariant
            && matches!(assign.left, AssignTarget::Pat(_))
        {
            self.push_invariant(INVARIANT_EXPECTED_CONSISTENT_DESTRUCTURING, assign.span);
            self.emitted_consistent_destructuring_invariant = true;
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
        if self.function_depth > 0
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
        }
        if self.function_depth > 0 {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::Immutability,
                ERROR_CANNOT_MODIFY_LOCALS_AFTER_RENDER,
            );
            detail.loc = Some(assign.span);
            self.errors.push(detail);
        }
        if let AssignTarget::Simple(swc_ecma_ast::SimpleAssignTarget::Ident(ident)) = &assign.left {
            if self
                .current_const_bindings()
                .is_some_and(|bindings| bindings.contains(ident.id.sym.as_ref()))
            {
                self.push_diagnostic(
                    ErrorCategory::Immutability,
                    ERROR_CANNOT_REASSIGN_CONST_VARIABLE,
                    assign.span,
                );
            }
        }
        assign.visit_children_with(self);
    }

    fn visit_update_expr(&mut self, update: &UpdateExpr) {
        if self.function_depth > 0 {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::Immutability,
                ERROR_THIS_VALUE_CANNOT_BE_MODIFIED,
            );
            detail.loc = Some(update.span);
            self.errors.push(detail);
        }
        if !self.emitted_update_captured_context_identifier
            && self.function_depth > 1
            && matches!(&*update.arg, Expr::Ident(_))
        {
            self.push_error(TODO_UPDATE_CAPTURED_CONTEXT_IDENTIFIER, update.span);
            self.emitted_update_captured_context_identifier = true;
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
        if self.function_depth > 0 && matches!(&*update.arg, Expr::Ident(_)) {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::Globals,
                ERROR_CANNOT_REASSIGN_OUTSIDE_COMPONENT,
            );
            detail.loc = Some(update.span);
            self.errors.push(detail);
        }
        if self.function_depth > 0 {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::Immutability,
                ERROR_CANNOT_MODIFY_LOCALS_AFTER_RENDER,
            );
            detail.loc = Some(update.span);
            self.errors.push(detail);
        }
        if let Expr::Ident(ident) = &*update.arg {
            if self
                .current_const_bindings()
                .is_some_and(|bindings| bindings.contains(ident.sym.as_ref()))
            {
                self.push_diagnostic(
                    ErrorCategory::Immutability,
                    ERROR_CANNOT_REASSIGN_CONST_VARIABLE,
                    update.span,
                );
            }
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

    fn visit_catch_clause(&mut self, clause: &CatchClause) {
        if let Some(param) = &clause.param {
            if !self.emitted_lower_assignment_missing_binding && matches!(param, Pat::Object(_)) {
                self.push_invariant(INVARIANT_LOWER_ASSIGNMENT_MISSING_BINDING, clause.span);
                self.emitted_lower_assignment_missing_binding = true;
            }
            if !self.emitted_local_context_reference_invariant {
                if let Pat::Ident(binding) = param {
                    let target = binding.id.sym.as_ref();
                    if clause
                        .body
                        .stmts
                        .iter()
                        .any(|stmt| has_nested_function_reference(stmt, target))
                    {
                        self.push_invariant(INVARIANT_EXPECTED_LOCAL_OR_CONTEXT_REFS, clause.span);
                        self.emitted_local_context_reference_invariant = true;
                    }
                }
            }
        }
        clause.visit_children_with(self);
    }

    fn visit_throw_stmt(&mut self, stmt: &swc_ecma_ast::ThrowStmt) {
        if self.try_with_catch_depth > 0 && !self.emitted_throw_in_try {
            self.push_error(TODO_THROW_IN_TRY_CATCH, stmt.span);
            self.emitted_throw_in_try = true;
        }
        stmt.visit_children_with(self);
    }

    fn visit_yield_expr(&mut self, expr: &YieldExpr) {
        if !self.emitted_yield_expression_todo {
            self.push_error(TODO_YIELD_EXPRESSION, expr.span);
            self.emitted_yield_expression_todo = true;
        }
        expr.visit_children_with(self);
    }
}

fn is_inline_function_expr(expr: &Expr) -> bool {
    match expr {
        Expr::Arrow(_) | Expr::Fn(_) => true,
        Expr::Paren(paren) => matches!(&*paren.expr, Expr::Arrow(_) | Expr::Fn(_)),
        _ => false,
    }
}

fn is_async_or_generator_function_expr(expr: &Expr) -> bool {
    match expr {
        Expr::Arrow(arrow) => arrow.is_async,
        Expr::Fn(function) => function.function.is_async || function.function.is_generator,
        Expr::Paren(paren) => is_async_or_generator_function_expr(&paren.expr),
        _ => false,
    }
}

fn looks_like_state_setter_name(name: &str) -> bool {
    if name == "setState" {
        return true;
    }
    if !name.starts_with("set") || name.len() <= 3 {
        return false;
    }
    name.chars()
        .nth(3)
        .is_some_and(|ch| ch.is_ascii_uppercase())
}

fn params_contain_setter_like_name<'a, I>(params: I) -> bool
where
    I: IntoIterator<Item = &'a Pat>,
{
    params.into_iter().any(pat_contains_setter_like_name)
}

fn pat_contains_setter_like_name(pat: &Pat) -> bool {
    let mut names = HashSet::new();
    collect_pat_bindings(pat, &mut names);
    names
        .into_iter()
        .any(|name| looks_like_state_setter_name(name.as_str()))
}

fn call_callee_is_state_setter_identifier(callee: &Callee, callee_name: &str) -> bool {
    if !looks_like_state_setter_name(callee_name) {
        return false;
    }
    matches!(
        callee,
        Callee::Expr(expr) if matches!(&**expr, Expr::Ident(_))
    )
}

fn expr_contains_hook_call(expr: &Expr) -> bool {
    struct Finder {
        found: bool,
    }

    impl Visit for Finder {
        fn visit_call_expr(&mut self, call: &CallExpr) {
            if self.found {
                return;
            }
            let Callee::Expr(callee_expr) = &call.callee else {
                call.visit_children_with(self);
                return;
            };
            match &**callee_expr {
                Expr::Ident(ident) => {
                    if is_hook_name(ident.sym.as_ref()) {
                        self.found = true;
                        return;
                    }
                }
                Expr::Member(member) => {
                    if let swc_ecma_ast::MemberProp::Ident(ident) = &member.prop {
                        if is_hook_name(ident.sym.as_ref()) {
                            self.found = true;
                            return;
                        }
                    }
                }
                _ => {}
            }
            call.visit_children_with(self);
        }
    }

    let mut finder = Finder { found: false };
    expr.visit_with(&mut finder);
    finder.found
}

fn expr_contains_pattern_assignment(expr: &Expr) -> bool {
    struct Finder {
        found: bool,
    }

    impl Visit for Finder {
        fn visit_assign_expr(&mut self, assign: &AssignExpr) {
            if self.found {
                return;
            }
            if matches!(assign.left, AssignTarget::Pat(_)) {
                self.found = true;
                return;
            }
            assign.visit_children_with(self);
        }
    }

    let mut finder = Finder { found: false };
    expr.visit_with(&mut finder);
    finder.found
}

fn find_use_before_declaration(function: &Function) -> Option<swc_common::Span> {
    let body = function.body.as_ref()?;
    let mut refs_seen = HashSet::<String>::new();

    for stmt in &body.stmts {
        let mut declared_here = HashSet::<String>::new();
        collect_declared_bindings_in_stmt(stmt, &mut declared_here);
        if declared_here
            .iter()
            .any(|name| refs_seen.contains(name.as_str()))
        {
            return Some(stmt.span());
        }

        let mut refs_in_stmt = HashSet::<String>::new();
        collect_references_in_stmt(stmt, &mut refs_in_stmt);
        refs_seen.extend(refs_in_stmt);
    }

    None
}

fn collect_declared_bindings_in_stmt(stmt: &Stmt, out: &mut HashSet<String>) {
    if let Stmt::Decl(swc_ecma_ast::Decl::Var(var_decl)) = stmt {
        for decl in &var_decl.decls {
            collect_pat_bindings(&decl.name, out);
        }
    }
}

fn collect_references_in_stmt(stmt: &Stmt, out: &mut HashSet<String>) {
    struct RefCollector<'a> {
        out: &'a mut HashSet<String>,
    }

    impl Visit for RefCollector<'_> {
        fn visit_binding_ident(&mut self, _: &swc_ecma_ast::BindingIdent) {}

        fn visit_ident(&mut self, ident: &swc_ecma_ast::Ident) {
            self.out.insert(ident.sym.to_string());
        }
    }

    stmt.visit_with(&mut RefCollector { out });
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
