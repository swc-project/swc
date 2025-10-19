use rustc_hash::{FxHashMap, FxHashSet};
use swc_common::{util::take::Take, EqIgnoreSpan, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, Visit, VisitMut, VisitMutWith, VisitWith,
};

use super::Optimizer;
use crate::program_data::{ScopeData, VarUsageInfoFlags};

/// Parameter inlining optimization
///
/// This optimization identifies function parameters that are consistently
/// passed the same constant value across ALL call sites and inlines those
/// values into the function body, removing the parameter from the signature and
/// updating all call sites.
///
/// # Example
///
/// ```javascript
/// function complex(foo, fn) {
///   return fn?.(foo)
/// }
///
/// complex(1, undefined)
/// complex(2, undefined)
/// complex(3, undefined)
/// ```
///
/// Transforms to:
///
/// ```javascript
/// function complex(foo) {
///   const fn = undefined;
///   return fn?.(foo)
/// }
///
/// complex(1)
/// complex(2)
/// complex(3)
/// ```

/// Call site information for a function
#[derive(Debug, Clone)]
struct CallSiteInfo {
    /// Arguments passed at this call site
    args: Vec<Option<Box<Expr>>>,
}

/// Visitor to collect call site arguments for functions
struct CallSiteCollector {
    /// Map of function ID to list of call site arguments
    call_sites: FxHashMap<Id, Vec<CallSiteInfo>>,
}

impl CallSiteCollector {
    fn new() -> Self {
        Self {
            call_sites: FxHashMap::default(),
        }
    }
}

impl Visit for CallSiteCollector {
    noop_visit_type!();

    fn visit_call_expr(&mut self, call: &CallExpr) {
        // Visit children first
        call.visit_children_with(self);

        // Check if callee is a simple identifier
        if let Callee::Expr(expr) = &call.callee {
            if let Expr::Ident(ident) = &**expr {
                let fn_id = ident.to_id();

                // Collect arguments (including missing ones as None)
                let args: Vec<Option<Box<Expr>>> =
                    call.args.iter().map(|arg| Some(arg.expr.clone())).collect();

                self.call_sites
                    .entry(fn_id)
                    .or_default()
                    .push(CallSiteInfo { args });
            }
        }
    }
}

/// Transformer that inlines parameters based on analysis results
struct ParamInliner {
    /// Map of function ID to parameters to inline with their values
    inlinable_params: FxHashMap<Id, Vec<(usize, Box<Expr>)>>,
    /// Set of parameter indices to remove for each function
    params_to_remove: FxHashMap<Id, FxHashSet<usize>>,
}

impl ParamInliner {
    fn new(inlinable_params: FxHashMap<Id, Vec<(usize, Box<Expr>)>>) -> Self {
        // Build a set of parameter indices to remove for quick lookup
        let params_to_remove: FxHashMap<Id, FxHashSet<usize>> = inlinable_params
            .iter()
            .map(|(fn_id, params)| {
                let indices: FxHashSet<usize> = params.iter().map(|(idx, _)| *idx).collect();
                (fn_id.clone(), indices)
            })
            .collect();

        Self {
            inlinable_params,
            params_to_remove,
        }
    }
}

impl VisitMut for ParamInliner {
    noop_visit_mut_type!();

    fn visit_mut_function(&mut self, func: &mut Function) {
        // Visit children first
        func.visit_mut_children_with(self);

        // We can't directly get the function's ID here, so we'll handle this
        // in visit_mut_fn_decl and visit_mut_fn_expr
    }

    fn visit_mut_fn_decl(&mut self, decl: &mut FnDecl) {
        let fn_id = decl.ident.to_id();

        // Clone params to inline to avoid borrow checker issues
        let params_to_inline = self.inlinable_params.get(&fn_id).cloned();

        if let Some(params) = params_to_inline {
            // Transform the function
            Self::transform_function_static(&mut decl.function, &params);
        }

        // Visit children
        decl.visit_mut_children_with(self);
    }

    fn visit_mut_var_declarator(&mut self, declarator: &mut VarDeclarator) {
        // Handle function expressions assigned to variables
        if let Pat::Ident(ident_pat) = &declarator.name {
            let fn_id = ident_pat.to_id();

            // Clone params to inline to avoid borrow checker issues
            let params_to_inline = self.inlinable_params.get(&fn_id).cloned();

            if let Some(init) = &mut declarator.init {
                if let Expr::Fn(fn_expr) = &mut **init {
                    if let Some(params) = params_to_inline {
                        Self::transform_function_static(&mut fn_expr.function, &params);
                    }
                } else if let Expr::Arrow(arrow) = &mut **init {
                    if let Some(params) = params_to_inline {
                        Self::transform_arrow_function_static(arrow, &params);
                    }
                }
            }
        }

        // Visit children
        declarator.visit_mut_children_with(self);
    }

    fn visit_mut_call_expr(&mut self, call: &mut CallExpr) {
        // Visit children first
        call.visit_mut_children_with(self);

        // Check if callee is a function we're inlining parameters for
        if let Callee::Expr(expr) = &call.callee {
            if let Expr::Ident(ident) = &**expr {
                let fn_id = ident.to_id();

                if let Some(param_indices) = self.params_to_remove.get(&fn_id) {
                    // Remove arguments at the specified indices
                    let mut new_args = Vec::new();
                    for (idx, arg) in call.args.iter().enumerate() {
                        if !param_indices.contains(&idx) {
                            new_args.push(arg.clone());
                        }
                    }
                    call.args = new_args;
                }
            }
        }
    }
}

impl ParamInliner {
    /// Transforms a function by inlining parameters (static version)
    fn transform_function_static(func: &mut Function, params_to_inline: &[(usize, Box<Expr>)]) {
        // Create variable declarations for inlined parameters
        let mut var_decls = Vec::new();

        // Remove parameters and create variable declarations
        let params_to_remove_set: FxHashSet<usize> =
            params_to_inline.iter().map(|(idx, _)| *idx).collect();

        let mut new_params = Vec::new();
        for (idx, param) in func.params.iter().enumerate() {
            if !params_to_remove_set.contains(&idx) {
                new_params.push(param.clone());
            } else if let Pat::Ident(param_ident) = &param.pat {
                // Find the constant value for this parameter
                if let Some((_, value)) = params_to_inline.iter().find(|(i, _)| *i == idx) {
                    // Create const declaration
                    let var_decl = VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Const,
                        declare: false,
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            name: Pat::Ident(param_ident.clone()),
                            init: Some(value.clone()),
                            definite: false,
                        }],
                        ctxt: Default::default(),
                    };
                    var_decls.push(Stmt::Decl(Decl::Var(Box::new(var_decl))));
                }
            }
        }

        // Update function parameters
        func.params = new_params;

        // Prepend variable declarations to function body
        if !var_decls.is_empty() {
            if let Some(body) = &mut func.body {
                let mut new_stmts = var_decls;
                new_stmts.extend(body.stmts.take());
                body.stmts = new_stmts;
            }
        }
    }

    /// Transforms an arrow function by inlining parameters (static version)
    fn transform_arrow_function_static(
        arrow: &mut ArrowExpr,
        params_to_inline: &[(usize, Box<Expr>)],
    ) {
        // Create variable declarations for inlined parameters
        let mut var_decls = Vec::new();

        // Remove parameters and create variable declarations
        let params_to_remove_set: FxHashSet<usize> =
            params_to_inline.iter().map(|(idx, _)| *idx).collect();

        let mut new_params = Vec::new();
        for (idx, param) in arrow.params.iter().enumerate() {
            if !params_to_remove_set.contains(&idx) {
                new_params.push(param.clone());
            } else if let Pat::Ident(param_ident) = param {
                // Find the constant value for this parameter
                if let Some((_, value)) = params_to_inline.iter().find(|(i, _)| *i == idx) {
                    // Create const declaration
                    let var_decl = VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Const,
                        declare: false,
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            name: Pat::Ident(param_ident.clone()),
                            init: Some(value.clone()),
                            definite: false,
                        }],
                        ctxt: Default::default(),
                    };
                    var_decls.push(Stmt::Decl(Decl::Var(Box::new(var_decl))));
                }
            }
        }

        // Update arrow function parameters
        arrow.params = new_params;

        // Prepend variable declarations to function body (convert expression to block
        // if needed)
        if !var_decls.is_empty() {
            match arrow.body.as_mut() {
                BlockStmtOrExpr::BlockStmt(block) => {
                    let mut new_stmts = var_decls;
                    new_stmts.extend(block.stmts.take());
                    block.stmts = new_stmts;
                }
                BlockStmtOrExpr::Expr(expr) => {
                    // Convert expression to block statement
                    let return_stmt = Stmt::Return(ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(expr.take()),
                    });
                    var_decls.push(return_stmt);
                    arrow.body = Box::new(BlockStmtOrExpr::BlockStmt(BlockStmt {
                        span: DUMMY_SP,
                        stmts: var_decls,
                        ctxt: Default::default(),
                    }));
                }
            }
        }
    }
}

impl Optimizer<'_> {
    /// Applies parameter inlining optimization to the AST
    ///
    /// This is the main entry point for the parameter inlining optimization.
    /// It analyzes the code, identifies inlinable parameters, and transforms
    /// the AST to inline them.
    pub(super) fn inline_function_params<N>(&mut self, n: &mut N) -> bool
    where
        N: VisitWith<CallSiteCollector> + VisitMutWith<ParamInliner>,
    {
        // Analyze which parameters can be inlined
        let inlinable_params = self.analyze_params_for_inlining(n);

        if inlinable_params.is_empty() {
            return false;
        }

        trace_op!(
            "inline_params: Transforming {} functions",
            inlinable_params.len()
        );

        // Apply the transformation
        let mut transformer = ParamInliner::new(inlinable_params);
        n.visit_mut_with(&mut transformer);

        true
    }

    /// Analyzes function parameters and determines if any can be inlined
    ///
    /// Returns a map of function identifiers to parameter indices that can be
    /// inlined along with their constant values.
    fn analyze_params_for_inlining<N>(&self, n: &N) -> FxHashMap<Id, Vec<(usize, Box<Expr>)>>
    where
        N: VisitWith<CallSiteCollector>,
    {
        trace_op!("inline_params: Starting parameter analysis");

        let mut inlinable_params: FxHashMap<Id, Vec<(usize, Box<Expr>)>> = FxHashMap::default();

        // Early exit if inlining is disabled or we have eval/with statements
        if self.options.inline == 0 {
            return inlinable_params;
        }

        if self.data.top.contains(ScopeData::HAS_EVAL_CALL)
            || self.data.top.contains(ScopeData::HAS_WITH_STMT)
        {
            return inlinable_params;
        }

        trace_op!(
            "inline_params: Analyzing {} variables",
            self.data.vars.len()
        );

        // Collect call site information
        let mut collector = CallSiteCollector::new();
        n.visit_with(&mut collector);

        trace_op!(
            "inline_params: Found {} functions with call sites",
            collector.call_sites.len()
        );

        // For each function, analyze if parameters can be inlined
        for (fn_id, call_sites) in &collector.call_sites {
            if !self.is_safe_for_param_inlining(fn_id) {
                continue;
            }

            // Get function usage info to find parameter count
            let Some(usage) = self.data.vars.get(fn_id) else {
                continue;
            };

            // Verify all call sites are accounted for
            if call_sites.len() != usage.callee_count as usize {
                trace_op!(
                    "inline_params: [x] Function {:?} has {} call sites but callee_count is {}",
                    fn_id.0,
                    call_sites.len(),
                    usage.callee_count
                );
                continue;
            }

            // Determine the maximum parameter count across all call sites
            let max_param_count = call_sites.iter().map(|cs| cs.args.len()).max().unwrap_or(0);

            if max_param_count == 0 {
                continue;
            }

            let mut params_to_inline = Vec::new();

            // Check each parameter position
            for param_idx in 0..max_param_count {
                // Find the constant value for this parameter across all call sites
                if let Some(constant_value) =
                    self.all_args_same_constant_collected(fn_id, param_idx, call_sites)
                {
                    trace_op!(
                        "inline_params: [✓] Function {:?} param {} can be inlined",
                        fn_id.0,
                        param_idx
                    );
                    params_to_inline.push((param_idx, constant_value));
                }
            }

            if !params_to_inline.is_empty() {
                inlinable_params.insert(fn_id.clone(), params_to_inline);
            }
        }

        trace_op!(
            "inline_params: Found {} functions with inlinable parameters",
            inlinable_params.len()
        );

        inlinable_params
    }

    /// Checks if all arguments at a parameter index are the same constant
    ///
    /// Returns the constant value if all call sites pass the same constant
    fn all_args_same_constant_collected(
        &self,
        _fn_id: &Id,
        param_idx: usize,
        call_sites: &[CallSiteInfo],
    ) -> Option<Box<Expr>> {
        if call_sites.is_empty() {
            return None;
        }

        // Get the first argument value to compare against
        let first_arg = call_sites
            .first()
            .and_then(|cs| cs.args.get(param_idx))
            .and_then(|arg| arg.as_ref())?;

        // Check if it's a constant we can inline
        if !self.is_constant_for_param_inlining(first_arg) {
            return None;
        }

        // Check that all other call sites pass the same value
        for call_site in call_sites.iter().skip(1) {
            let arg = call_site.args.get(param_idx).and_then(|arg| arg.as_ref());

            match arg {
                Some(arg_expr) => {
                    // Check if arguments are equivalent
                    if !self.are_exprs_equivalent(first_arg, arg_expr) {
                        return None;
                    }
                }
                None => {
                    // Missing argument means undefined, check if first_arg is also undefined
                    if !self.is_undefined_expr(first_arg) {
                        return None;
                    }
                }
            }
        }

        // All call sites pass the same constant value
        Some(first_arg.clone())
    }

    /// Checks if an expression represents undefined
    fn is_undefined_expr(&self, expr: &Expr) -> bool {
        match expr {
            Expr::Ident(i) if &*i.sym == "undefined" => true,
            Expr::Unary(UnaryExpr {
                op: op!("void"), ..
            }) => true,
            _ => false,
        }
    }

    /// Checks if two expressions are equivalent for parameter inlining
    fn are_exprs_equivalent(&self, a: &Expr, b: &Expr) -> bool {
        // Use structural equality
        a.eq_ignore_span(b)
    }

    /// Checks if a function is safe to have its parameters inlined
    ///
    /// # Safety checks:
    /// - No use of `arguments` object
    /// - No use of `Function.length` property
    /// - Function is not exported
    /// - All call sites are known
    /// - No dynamic calls (apply, call, bind)
    pub(super) fn is_safe_for_param_inlining(&self, fn_id: &Id) -> bool {
        let Some(usage) = self.data.vars.get(fn_id) else {
            return false;
        };

        // Cannot inline if function uses arguments
        if self.data.top.contains(ScopeData::USED_ARGUMENTS) {
            trace_op!("inline_params: [x] Function {:?} uses arguments", fn_id.0);
            return false;
        }

        // Cannot inline if function is exported
        if usage.flags.contains(VarUsageInfoFlags::EXPORTED) {
            trace_op!("inline_params: [x] Function {:?} is exported", fn_id.0);
            return false;
        }

        // Cannot inline if function signature matters (used as value, not just called)
        if usage.ref_count > usage.callee_count {
            trace_op!(
                "inline_params: [x] Function {:?} used as value (ref_count: {}, callee_count: {})",
                fn_id.0,
                usage.ref_count,
                usage.callee_count
            );
            return false;
        }

        // Cannot inline if function has property access (might access .length)
        if usage.flags.contains(VarUsageInfoFlags::HAS_PROPERTY_ACCESS) {
            trace_op!(
                "inline_params: [x] Function {:?} has property access",
                fn_id.0
            );
            return false;
        }

        // Cannot inline if function is used as argument (might be called with
        // apply/call)
        if usage.flags.contains(VarUsageInfoFlags::USED_AS_ARG) {
            trace_op!(
                "inline_params: [x] Function {:?} is used as argument",
                fn_id.0
            );
            return false;
        }

        // Need at least one call site to inline
        if usage.callee_count == 0 {
            trace_op!(
                "inline_params: [x] Function {:?} has no call sites",
                fn_id.0
            );
            return false;
        }

        trace_op!("inline_params: [✓] Function {:?} is safe", fn_id.0);
        true
    }

    /// Checks if a parameter pattern is simple enough for inlining
    ///
    /// We only inline simple identifier parameters, not destructuring or rest
    /// parameters
    pub(super) fn is_param_simple_for_inlining(&self, param: &Param) -> bool {
        matches!(param.pat, Pat::Ident(..))
    }

    /// Checks if an expression is a constant that can be inlined
    ///
    /// For safety, we only inline:
    /// - undefined
    /// - null
    /// - boolean literals
    /// - number literals
    /// - small string literals
    pub(super) fn is_constant_for_param_inlining(&self, expr: &Expr) -> bool {
        match expr {
            // undefined (represented as void 0 or bare undefined)
            Expr::Ident(i) if &*i.sym == "undefined" => true,
            Expr::Unary(UnaryExpr {
                op: op!("void"), ..
            }) => true,

            // Literals
            Expr::Lit(Lit::Null(..)) => true,
            Expr::Lit(Lit::Bool(..)) => true,
            Expr::Lit(Lit::Num(..)) => true,
            Expr::Lit(Lit::Str(s)) if s.value.len() <= 10 => true,

            _ => false,
        }
    }
}

// Tests are implemented using the standard swc test infrastructure
// in tests/fixture/issues/10931/
