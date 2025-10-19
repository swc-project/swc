use rustc_hash::FxHashMap;
use swc_common::util::take::Take;
use swc_ecma_ast::*;
use swc_ecma_utils::ExprExt;

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
impl Optimizer<'_> {
    /// Analyzes function parameters and determines if any can be inlined
    ///
    /// Returns a map of function identifiers to parameter indices that can be
    /// inlined along with their constant values.
    pub(super) fn analyze_params_for_inlining(&self) -> FxHashMap<Id, Vec<(usize, Box<Expr>)>> {
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

        // For now, return empty map - implementation will be added in follow-up
        // This is a conservative approach: when in doubt, don't optimize
        inlinable_params
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

    /// Checks if all arguments at a parameter index are the same constant
    ///
    /// This is a placeholder for the actual implementation which would need
    /// to track call sites during the analysis phase.
    pub(super) fn all_args_same_constant(
        &self,
        _fn_id: &Id,
        _param_idx: usize,
    ) -> Option<Box<Expr>> {
        // Placeholder - actual implementation would track call sites
        // and compare all arguments at this parameter position
        None
    }
}

#[cfg(test)]
mod tests {
    use swc_common::{chain, Mark, DUMMY_SP};
    use swc_ecma_ast::*;
    use swc_ecma_transforms_base::resolver;
    use swc_ecma_visit::FoldWith;

    use crate::{
        compress::optimize::optimizer, marks::Marks, mode::Mode, option::CompressOptions,
        program_data,
    };

    fn test_transform(input: &str, _expected: &str) -> Result<(), Box<dyn std::error::Error>> {
        let marks = Marks::new();
        let unresolved_mark = marks.unresolved_mark;
        let top_level_mark = marks.top_level_mark;

        let input = input.parse::<swc_ecma_ast::Module>()?;

        let input = input.fold_with(&mut resolver(unresolved_mark, top_level_mark, false));

        let mut _data = program_data::analyze(&input, Some(marks), false);

        // Placeholder for actual test implementation
        // This would involve:
        // 1. Running the optimizer with parameter inlining enabled
        // 2. Comparing the output with expected
        // 3. Verifying the transformation is correct

        Ok(())
    }

    #[test]
    #[ignore] // Remove ignore when implementation is complete
    fn test_inline_undefined_param() {
        let input = r#"
            function complex(foo, fn) {
                return fn?.(foo);
            }
            complex(1, undefined);
            complex(2, undefined);
            complex(3, undefined);
        "#;

        let expected = r#"
            function complex(foo) {
                const fn = undefined;
                return fn?.(foo);
            }
            complex(1);
            complex(2);
            complex(3);
        "#;

        test_transform(input, expected).unwrap();
    }

    #[test]
    #[ignore] // Remove ignore when implementation is complete
    fn test_no_inline_mixed_args() {
        let input = r#"
            function test(a, b) {
                return a + b;
            }
            test(1, undefined);
            test(2, null);  // Different value!
        "#;

        let expected = input; // Should not transform

        test_transform(input, expected).unwrap();
    }

    #[test]
    #[ignore] // Remove ignore when implementation is complete
    fn test_no_inline_with_arguments() {
        let input = r#"
            function test(a, b) {
                return arguments.length;
            }
            test(1, undefined);
            test(2, undefined);
        "#;

        let expected = input; // Should not transform

        test_transform(input, expected).unwrap();
    }
}
