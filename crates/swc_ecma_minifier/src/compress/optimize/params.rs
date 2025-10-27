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
    /// transforms the function to use a variable declaration instead.
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
    ///     const fn = undefined; // const if not reassigned, let otherwise
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

        // Skip if function is exported, reassigned, or inlining is prevented
        if usage.flags.contains(VarUsageInfoFlags::EXPORTED)
            || usage.flags.contains(VarUsageInfoFlags::INLINE_PREVENTED)
            || usage.flags.contains(VarUsageInfoFlags::REASSIGNED)
        {
            return;
        }

        // Skip if function is used as a reference/argument (not just called)
        // Check if the function is used in ways other than being called directly
        // USED_AS_ARG indicates the function is passed to another function, which means
        // we don't have visibility into all call sites
        if usage.flags.contains(VarUsageInfoFlags::USED_AS_ARG) {
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

        // Skip if this function is a candidate for function body inlining.
        // Function body inlining can completely inline small functions which is
        // more effective than parameter inlining. We should not interfere with
        // that optimization by removing parameters first.
        //
        // A function is a good candidate for body inlining when:
        // - It has a single call site (reduce_fns typically inlines single-use
        //   functions)
        // - It's small (single statement)
        //
        // This check ensures parameter inlining effectively runs "after" function
        // body inlining by skipping functions that would be inlined anyway.
        if (self.options.reduce_fns || self.options.reduce_vars) && call_sites.len() == 1 {
            if let Some(body) = &f.body {
                // Single statement functions are prime candidates for function body inlining
                if body.stmts.len() == 1 {
                    return;
                }
            }
        }

        // Analyze each parameter
        let mut params_to_inline: Vec<(usize, Box<Expr>)> = Vec::new();

        for (param_idx, param) in f.params.iter().enumerate() {
            // Only handle simple identifier parameters
            let _param_id = match &param.pat {
                Pat::Ident(ident) => ident.id.to_id(),
                _ => continue, // Skip destructuring, rest params, etc.
            };

            // Collect argument values for this parameter across all call sites
            // Use Option<Option<Box<Expr>>> to track:
            // - None = no common value yet established
            // - Some(None) = all call sites have implicit undefined
            // - Some(Some(expr)) = all call sites have the same explicit expression
            let mut common_value: Option<Option<Box<Expr>>> = None;
            let mut inlinable = true;

            for call_site in call_sites {
                // Get argument at this position, or None if implicit undefined
                let arg_value: Option<Box<Expr>> = if param_idx < call_site.len() {
                    Some(call_site[param_idx].clone())
                } else {
                    None // Implicit undefined
                };

                // Check if this is a safe, constant value to inline
                if let Some(ref expr) = arg_value {
                    if !self.is_safe_constant_for_param_inline(expr) {
                        inlinable = false;
                        break;
                    }
                }
                // Implicit undefined (None) is always safe to inline

                match &common_value {
                    None => {
                        // First call site, establish the common value
                        common_value = Some(arg_value);
                    }
                    Some(existing) => {
                        // Check if this call site has the same value
                        if !self.arg_eq(existing, &arg_value) {
                            inlinable = false;
                            break;
                        }
                    }
                }
            }

            // If all call sites pass the same constant value, mark for inlining
            // Currently, we only inline undefined values to match the original use case
            // and avoid being too aggressive. This handles optional callbacks/parameters
            // that are consistently omitted or explicitly undefined.
            if inlinable {
                if let Some(Some(value)) = &common_value {
                    // Check if the value is explicitly undefined
                    if let Expr::Ident(id) = &**value {
                        if id.ctxt == self.ctx.expr_ctx.unresolved_ctxt && id.sym == "undefined" {
                            params_to_inline.push((param_idx, value.clone()));
                        }
                    }
                } else if let Some(None) = common_value {
                    // All call sites have implicit undefined
                    let undefined_expr = Box::new(Expr::Ident(Ident::new(
                        "undefined".into(),
                        DUMMY_SP,
                        self.ctx.expr_ctx.unresolved_ctxt,
                    )));
                    params_to_inline.push((param_idx, undefined_expr));
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
        // Sort in reverse order to remove from the end first
        let mut sorted_params = params_to_inline.to_vec();
        sorted_params.sort_by(|a, b| b.0.cmp(&a.0));

        // Collect variable declarations to add at the beginning of function body
        let mut var_decls = Vec::new();

        // Track which parameter indices are being inlined (will be sorted)
        let mut inlined_indices = Vec::new();

        for (param_idx, value) in &sorted_params {
            inlined_indices.push(*param_idx);

            if let Some(param) = f.params.get(*param_idx) {
                if let Pat::Ident(ident) = &param.pat {
                    // Create variable declaration: let paramName = value;
                    // Always use 'let' to preserve parameter semantics (reassignable)
                    var_decls.push(Stmt::Decl(Decl::Var(Box::new(VarDecl {
                        span: DUMMY_SP,
                        ctxt: Default::default(),
                        kind: VarDeclKind::Let,
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

        // Add variable declarations to function body
        if let Some(body) = &mut f.body {
            var_decls.reverse(); // Reverse to maintain original order
            var_decls.append(&mut body.stmts);
            body.stmts = var_decls;
        }

        // Store the inlined parameter indices for later use when visiting call
        // sites. Reverse sort to get descending order for efficient removal.
        inlined_indices.sort_by(|a, b| b.cmp(a));
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
    fn is_safe_constant_for_param_inline(&self, expr: &Expr) -> bool {
        match expr {
            // Literal values are always safe
            Expr::Lit(Lit::Null(_))
            | Expr::Lit(Lit::Bool(_))
            | Expr::Lit(Lit::Num(_))
            | Expr::Lit(Lit::Str(_))
            | Expr::Lit(Lit::BigInt(_)) => true,

            // Only allow unresolved "undefined" identifier
            // We DO NOT inline variable references because:
            // 1. It doesn't save code (just moves a reference)
            // 2. It can interfere with other optimizations
            // 3. The goal is to inline actual constants, not variable names
            Expr::Ident(id) => {
                let is_unresolved = id.ctxt == self.ctx.expr_ctx.unresolved_ctxt;
                // Only allow unresolved "undefined"
                is_unresolved && id.sym == "undefined"
            }

            // Negated or numeric-negated literals
            Expr::Unary(UnaryExpr {
                op: UnaryOp::Bang | UnaryOp::Minus,
                arg,
                ..
            }) => self.is_safe_constant_for_param_inline(arg),

            // Parenthesized expressions
            Expr::Paren(ParenExpr { expr, .. }) => self.is_safe_constant_for_param_inline(expr),

            _ => false,
        }
    }

    /// Compare two optional argument values for equality.
    /// None represents implicit undefined.
    fn arg_eq(&self, a: &Option<Box<Expr>>, b: &Option<Box<Expr>>) -> bool {
        match (a, b) {
            (None, None) => true, // Both implicit undefined
            (Some(a_expr), Some(b_expr)) => self.expr_eq(a_expr, b_expr),
            _ => false, // One is implicit undefined, the other is not
        }
    }

    /// Compare two expressions for equality (structural equality for simple
    /// cases).
    ///
    /// We cannot use the derived `Eq` trait because:
    /// 1. NaN handling: We treat NaN as equal to NaN for parameter inlining
    ///    purposes, whereas standard floating point comparison has NaN != NaN.
    /// 2. Context-aware identifier comparison: We only consider unresolved
    ///    "undefined" identifiers as safe to inline, checking the syntax
    ///    context.
    fn expr_eq(&self, a: &Expr, b: &Expr) -> bool {
        match (a, b) {
            (Expr::Lit(Lit::Null(_)), Expr::Lit(Lit::Null(_))) => true,
            (Expr::Lit(Lit::Bool(a)), Expr::Lit(Lit::Bool(b))) => a.value == b.value,
            (Expr::Lit(Lit::Num(a)), Expr::Lit(Lit::Num(b))) => {
                // Handle NaN specially: treat NaN as equal to NaN for parameter inlining
                if a.value.is_nan() && b.value.is_nan() {
                    true
                } else {
                    a.value == b.value
                }
            }
            (Expr::Lit(Lit::Str(a)), Expr::Lit(Lit::Str(b))) => a.value == b.value,
            (Expr::Lit(Lit::BigInt(a)), Expr::Lit(Lit::BigInt(b))) => a.value == b.value,
            // Compare identifiers: we can compare naively since is_safe_constant_for_param_inline
            // already validated that only unresolved "undefined" identifiers reach here
            (Expr::Ident(a), Expr::Ident(b)) => a.sym == b.sym && a.ctxt == b.ctxt,
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
            ) if op_a == op_b => self.expr_eq(arg_a, arg_b),
            (Expr::Paren(ParenExpr { expr: a, .. }), b) => self.expr_eq(a, b),
            (a, Expr::Paren(ParenExpr { expr: b, .. })) => self.expr_eq(a, b),
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
        // The indices are already sorted in descending order from apply_param_inlining
        for &idx in inlined_indices {
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
