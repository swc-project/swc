//! RegExp Transformer
//!
//! This module supports various RegExp plugins to handle unsupported RegExp
//! literal features. When an unsupported feature is detected, these plugins
//! convert the RegExp literal into a `new RegExp()` constructor call to avoid
//! syntax errors.
//!
//! Note: You will need to include a polyfill for the `RegExp` constructor in
//! your code to have the correct runtime behavior.
//!
//! ### ES2015
//!
//! #### Sticky flag (`y`)
//! - @babel/plugin-transform-sticky-regex: <https://babeljs.io/docs/en/babel-plugin-transform-sticky-regex>
//!
//! #### Unicode flag (`u`)
//! - @babel/plugin-transform-unicode-regex: <https://babeljs.io/docs/en/babel-plugin-transform-unicode-regex>
//!
//! ### ES2018
//!
//! #### DotAll flag (`s`)
//! - @babel/plugin-transform-dotall-regex: <https://babeljs.io/docs/en/babel-plugin-transform-dotall-regex>
//! - Spec: ECMAScript 2018: <https://262.ecma-international.org/9.0/#sec-get-regexp.prototype.dotAll>
//!
//! #### Lookbehind assertions (`/(?<=x)/` and `/(?<!x)/`)
//! - Implementation: Same as esbuild's handling
//!
//! #### Named capture groups (`(?<name>x)`)
//! - @babel/plugin-transform-named-capturing-groups-regex: <https://babeljs.io/docs/en/babel-plugin-transform-named-capturing-groups-regex>
//!
//! #### Unicode property escapes (`\p{...}` and `\P{...}`)
//! - @babel/plugin-transform-unicode-property-regex: <https://babeljs.io/docs/en/babel-plugin-proposal-unicode-property-regex>
//!
//! ### ES2022
//!
//! #### Match indices flag (`d`)
//! - Implementation: Same as esbuild's handling
//!
//! ### ES2024
//!
//! #### Set notation + properties of strings (`v`)
//! - @babel/plugin-transform-unicode-sets-regex: <https://babeljs.io/docs/en/babel-plugin-proposal-unicode-sets-regex>
//! - TC39 Proposal: <https://github.com/tc39/proposal-regexp-set-notation>
//!
//! TODO(improve-on-babel): We could convert to plain `RegExp(...)` instead of
//! `new RegExp(...)`. TODO(improve-on-babel): When flags is empty, we could
//! output `RegExp("(?<=x)")` instead of `RegExp("(?<=x)", "")`. (actually these
//! would be improvements on ESBuild, not Babel)

use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::context::TraverseCtx;

mod options;

pub use options::RegExpOptions;

/// RegExp transformer that converts unsupported RegExp features to `new
/// RegExp()` constructor calls.
///
/// This transform is necessary when targeting older JavaScript environments
/// that don't support certain RegExp flags or patterns. It detects unsupported
/// features and rewrites the literal into a constructor call.
pub struct RegExp {
    options: RegExpOptions,
}

impl RegExp {
    /// Creates a new RegExp transformer with the given options.
    ///
    /// # Arguments
    ///
    /// * `options` - Configuration specifying which RegExp features to
    ///   transform
    pub fn new(options: RegExpOptions) -> Self {
        Self { options }
    }

    /// Checks if a RegExp literal needs to be transformed based on its flags.
    ///
    /// Returns true if the literal contains any flags that are marked as
    /// unsupported in the transformer's options.
    fn has_unsupported_flags(&self, flags: &str) -> bool {
        flags.chars().any(|flag| match flag {
            's' => self.options.dot_all_flag,
            'y' => self.options.sticky_flag,
            'u' => self.options.unicode_flag,
            'd' => self.options.match_indices,
            'v' => self.options.set_notation,
            _ => false,
        })
    }

    /// Checks if a RegExp pattern needs to be transformed.
    ///
    /// Returns true if the pattern contains features that are marked as
    /// unsupported. This includes lookbehind assertions, named capture
    /// groups, and unicode property escapes.
    fn has_unsupported_pattern(&self, pattern: &str) -> bool {
        // Simple heuristic checks for unsupported patterns
        if self.options.look_behind_assertions
            && (pattern.contains("(?<=") || pattern.contains("(?<!"))
        {
            return true;
        }
        if self.options.named_capture_groups && pattern.contains("(?<") {
            return true;
        }
        if self.options.unicode_property_escapes
            && (pattern.contains("\\p{") || pattern.contains("\\P{"))
        {
            return true;
        }
        false
    }

    /// Transforms a RegExp literal to a `new RegExp()` constructor call if it
    /// contains unsupported features.
    ///
    /// This is called when we've determined that the literal needs to be
    /// rewritten.
    fn transform_regexp(&self, regex: &Regex) -> Expr {
        use swc_common::{SyntaxContext, DUMMY_SP};

        // Create `new RegExp(pattern, flags)` constructor
        let pattern_arg = ExprOrSpread {
            spread: None,
            expr: Box::new(Expr::Lit(Lit::Str(Str {
                span: DUMMY_SP,
                value: regex.exp.clone().into(),
                raw: None,
            }))),
        };

        let flags_arg = ExprOrSpread {
            spread: None,
            expr: Box::new(Expr::Lit(Lit::Str(Str {
                span: DUMMY_SP,
                value: regex.flags.clone().into(),
                raw: None,
            }))),
        };

        Expr::New(NewExpr {
            span: regex.span,
            ctxt: SyntaxContext::empty(),
            callee: Box::new(Expr::Ident(Ident::new(
                "RegExp".into(),
                DUMMY_SP,
                Default::default(),
            ))),
            args: Some(vec![pattern_arg, flags_arg]),
            type_args: None,
        })
    }
}

impl VisitMutHook<TraverseCtx<'_>> for RegExp {
    /// Called when entering an expression node.
    ///
    /// Checks if the expression is a RegExp literal that needs transformation,
    /// and if so, rewrites it to a constructor call.
    #[inline]
    fn enter_expr(&mut self, expr: &mut Expr, _ctx: &mut TraverseCtx) {
        if let Expr::Lit(Lit::Regex(regex)) = expr {
            // Check if transformation is needed
            let needs_transform = self.has_unsupported_flags(&regex.flags)
                || self.has_unsupported_pattern(&regex.exp);

            if needs_transform {
                *expr = self.transform_regexp(regex);
            }
        }
    }
}
