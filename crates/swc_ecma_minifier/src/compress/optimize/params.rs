use swc_common::DUMMY_SP;
use swc_ecma_ast::*;

use super::Optimizer;
use crate::program_data::{ScopeData, VarUsageInfoFlags};

/// Methods related to parameter inlining optimization.
impl Optimizer<'_> {
    /// Inline function parameters that are consistently passed the same
    /// constant value.
    ///
    /// This optimization identifies function parameters where all call sites
    /// pass the same constant value (including implicit undefined), and
    /// transforms the function to use a const declaration instead.
    ///
    /// Example:
    /// ```js
    /// function complex(foo, fn) {
    ///     if (Math.random() > 0.5) throw new Error();
    ///     return fn?.(foo);
    /// }
    /// complex("foo");
    /// complex("bar");
    /// complex("baz");
    /// ```
    /// =>
    /// ```js
    /// function complex(foo) {
    ///     const fn = undefined;
    ///     if (Math.random() > 0.5) throw new Error();
    ///     return fn?.(foo);
    /// }
    /// complex("foo");
    /// complex("bar");
    /// complex("baz");
    /// ```
    pub(super) fn inline_function_parameters(&mut self, f: &mut Function, fn_id: &Id) {
        // Skip if optimization is disabled
        if self.options.inline == 0 && !self.options.reduce_vars {
            return;
        }

        // Skip if function uses eval or with statement
        if let Some(scope_data) = self.data.scopes.get(&f.ctxt) {
            if scope_data.intersects(ScopeData::HAS_EVAL_CALL | ScopeData::HAS_WITH_STMT) {
                return;
            }
        }

        // Skip if function uses arguments object
        if let Some(scope_data) = self.data.scopes.get(&f.ctxt) {
            if scope_data.contains(ScopeData::USED_ARGUMENTS) {
                return;
            }
        }

        // Get usage info for the function
        let usage = match self.data.vars.get(fn_id) {
            Some(u) => u,
            None => return,
        };

        // Skip if function is exported or can't optimize
        if usage.flags.contains(VarUsageInfoFlags::EXPORTED)
            || usage.flags.contains(VarUsageInfoFlags::INLINE_PREVENTED)
            || usage.flags.contains(VarUsageInfoFlags::USED_AS_REF)
            || usage.flags.contains(VarUsageInfoFlags::REASSIGNED)
        {
            return;
        }

        // Get call site arguments
        let call_sites = match &usage.call_site_args {
            Some(sites) if !sites.is_empty() => sites,
            _ => return,
        };

        // Check if all call sites are known (callee_count should match call_sites
        // length)
        if usage.callee_count as usize != call_sites.len() {
            return;
        }

        // Skip very small functions with few call sites that are better optimized
        // by function body inlining (reduce_fns/reduce_vars) rather than parameter
        // inlining.
        //
        // Small functions (single statement, simple return) with 1-2 calls are prime
        // candidates for function inlining, which handles parameter substitution
        // differently:
        //   function g(b) { return b; }
        //   g(2)
        // =>
        //   (function(b) { return 2; })(0)  // function inlined, param kept
        //
        // vs our parameter inlining which would do:
        //   function g() { const b = 2; return b; }
        //   g()  // param removed
        //
        // However, larger functions or functions with 3+ call sites benefit more from
        // parameter inlining as function body inlining becomes less effective.
        if (self.options.reduce_fns || self.options.reduce_vars) && call_sites.len() <= 2 {
            // Check if this is a small, simple function (candidate for function
            // inlining)
            let is_small_function = if let Some(body) = &f.body {
                // Single statement functions are prime candidates for function inlining
                body.stmts.len() == 1
            } else {
                false
            };

            if is_small_function {
                return;
            }
        }

        // Analyze each parameter
        let mut params_to_inline: Vec<(usize, Box<Expr>)> = Vec::new();

        for (param_idx, param) in f.params.iter().enumerate() {
            // Only handle simple identifier parameters
            let param_id = match &param.pat {
                Pat::Ident(ident) => ident.id.to_id(),
                _ => continue, // Skip destructuring, rest params, etc.
            };

            // Check if parameter is mutated within the function
            if let Some(param_usage) = self.data.vars.get(&param_id) {
                if param_usage.flags.contains(VarUsageInfoFlags::REASSIGNED) {
                    continue;
                }
            }

            // Collect argument values for this parameter across all call sites
            let mut common_value: Option<Box<Expr>> = None;
            let mut all_same = true;

            for call_site in call_sites {
                let arg_value = if param_idx < call_site.len() {
                    call_site[param_idx].clone()
                } else {
                    // Implicit undefined - use unresolved context
                    Some(Box::new(Expr::Ident(Ident::new(
                        "undefined".into(),
                        DUMMY_SP,
                        self.ctx.expr_ctx.unresolved_ctxt,
                    ))))
                };

                let arg_value = match arg_value {
                    Some(v) => v,
                    None => {
                        all_same = false;
                        break;
                    }
                };

                // Check if this is a safe, constant value to inline
                if !Self::is_safe_constant_for_param_inline(&arg_value) {
                    all_same = false;
                    break;
                }

                match &common_value {
                    None => {
                        common_value = Some(arg_value);
                    }
                    Some(existing) => {
                        if !Self::expr_eq(existing, &arg_value) {
                            all_same = false;
                            break;
                        }
                    }
                }
            }

            // If all call sites pass the same constant value, mark for inlining
            if all_same {
                if let Some(value) = common_value {
                    params_to_inline.push((param_idx, value));
                }
            }
        }

        // Apply the parameter inlining transformation
        if !params_to_inline.is_empty() {
            self.apply_param_inlining(f, &params_to_inline, fn_id);
        }
    }

    /// Apply parameter inlining transformation to a function.
    fn apply_param_inlining(
        &mut self,
        f: &mut Function,
        params_to_inline: &[(usize, Box<Expr>)],
        fn_id: &Id,
    ) {
        use rustc_hash::FxHashSet;

        // Sort in reverse order to remove from the end first
        let mut sorted_params = params_to_inline.to_vec();
        sorted_params.sort_by(|a, b| b.0.cmp(&a.0));

        // Collect const declarations to add at the beginning of function body
        let mut const_decls = Vec::new();

        // Track which parameter indices are being inlined
        let mut inlined_indices = FxHashSet::default();

        for (param_idx, value) in &sorted_params {
            inlined_indices.insert(*param_idx);

            if let Some(param) = f.params.get(*param_idx) {
                if let Pat::Ident(ident) = &param.pat {
                    // Create const declaration: const paramName = value;
                    const_decls.push(Stmt::Decl(Decl::Var(Box::new(VarDecl {
                        span: DUMMY_SP,
                        ctxt: Default::default(),
                        kind: VarDeclKind::Const,
                        declare: false,
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            name: Pat::Ident(ident.clone()),
                            init: Some(value.clone()),
                            definite: false,
                        }],
                    }))));
                }
            }
        }

        // Remove parameters (in reverse order)
        for (param_idx, _) in &sorted_params {
            f.params.remove(*param_idx);
        }

        // Add const declarations to function body
        if let Some(body) = &mut f.body {
            const_decls.reverse(); // Reverse to maintain original order
            const_decls.append(&mut body.stmts);
            body.stmts = const_decls;
        }

        // Store the inlined parameter indices for later use when visiting call
        // sites
        self.inlined_params.insert(fn_id.clone(), inlined_indices);

        self.changed = true;
        report_change!(
            "params: Inlined {} parameter(s) for function '{}{:?}'",
            params_to_inline.len(),
            fn_id.0,
            fn_id.1
        );
    }

    /// Check if an expression is a safe constant value for parameter inlining.
    fn is_safe_constant_for_param_inline(expr: &Expr) -> bool {
        match expr {
            // Literal values are always safe
            Expr::Lit(Lit::Null(_))
            | Expr::Lit(Lit::Bool(_))
            | Expr::Lit(Lit::Num(_))
            | Expr::Lit(Lit::Str(_))
            | Expr::Lit(Lit::BigInt(_)) => true,

            // undefined identifier (unresolved)
            Expr::Ident(id) if id.sym == "undefined" => true,

            // Negated or numeric-negated literals
            Expr::Unary(UnaryExpr {
                op: UnaryOp::Bang | UnaryOp::Minus,
                arg,
                ..
            }) => Self::is_safe_constant_for_param_inline(arg),

            // Parenthesized expressions
            Expr::Paren(ParenExpr { expr, .. }) => Self::is_safe_constant_for_param_inline(expr),

            _ => false,
        }
    }

    /// Compare two expressions for equality (structural equality for simple
    /// cases).
    fn expr_eq(a: &Expr, b: &Expr) -> bool {
        match (a, b) {
            (Expr::Lit(Lit::Null(_)), Expr::Lit(Lit::Null(_))) => true,
            (Expr::Lit(Lit::Bool(a)), Expr::Lit(Lit::Bool(b))) => a.value == b.value,
            (Expr::Lit(Lit::Num(a)), Expr::Lit(Lit::Num(b))) => {
                // Handle NaN specially
                if a.value.is_nan() && b.value.is_nan() {
                    true
                } else {
                    a.value == b.value
                }
            }
            (Expr::Lit(Lit::Str(a)), Expr::Lit(Lit::Str(b))) => a.value == b.value,
            (Expr::Lit(Lit::BigInt(a)), Expr::Lit(Lit::BigInt(b))) => a.value == b.value,
            (Expr::Ident(a), Expr::Ident(b)) if a.sym == "undefined" && b.sym == "undefined" => {
                true
            }
            (
                Expr::Unary(UnaryExpr {
                    op: op_a,
                    arg: arg_a,
                    ..
                }),
                Expr::Unary(UnaryExpr {
                    op: op_b,
                    arg: arg_b,
                    ..
                }),
            ) if op_a == op_b => Self::expr_eq(arg_a, arg_b),
            (Expr::Paren(ParenExpr { expr: a, .. }), b) => Self::expr_eq(a, b),
            (a, Expr::Paren(ParenExpr { expr: b, .. })) => Self::expr_eq(a, b),
            _ => false,
        }
    }

    /// Remove arguments from a call expression that correspond to inlined
    /// parameters.
    ///
    /// This method should be called when visiting a call expression to ensure
    /// that arguments are removed for parameters that have been inlined.
    pub(super) fn remove_inlined_call_args(&mut self, call: &mut CallExpr) {
        // Get the function identifier from the callee
        let fn_id = match &call.callee {
            Callee::Expr(expr) => match &**expr {
                Expr::Ident(ident) => ident.to_id(),
                _ => return, // Not a simple identifier call
            },
            _ => return,
        };

        // Check if this function has inlined parameters
        let inlined_indices = match self.inlined_params.get(&fn_id) {
            Some(indices) if !indices.is_empty() => indices,
            _ => return,
        };

        // Remove arguments at the inlined parameter indices
        // We need to iterate in reverse order to avoid index shifting issues
        let mut indices_to_remove: Vec<usize> = inlined_indices.iter().copied().collect();
        indices_to_remove.sort_by(|a, b| b.cmp(a)); // Sort in descending order

        for idx in indices_to_remove {
            if idx < call.args.len() {
                call.args.remove(idx);
                self.changed = true;
            }
        }

        if !inlined_indices.is_empty() {
            report_change!(
                "params: Removed {} argument(s) from call to '{}{:?}'",
                inlined_indices.len(),
                fn_id.0,
                fn_id.1
            );
        }
    }
}
