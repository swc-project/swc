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

mod options;

pub use options::RegExpOptions;
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::TransformCtx;

/// RegExp transformer that converts unsupported RegExp features to `new
/// RegExp()` constructor calls.
pub struct RegExp {
    options: RegExpOptions,
}

impl RegExp {
    /// Creates a new RegExp transformer with the given options.
    pub fn new(options: RegExpOptions) -> Self {
        Self { options }
    }

    /// Check if a regex literal needs transformation based on its flags.
    fn needs_flag_transformation(&self, regex: &Regex) -> bool {
        // Check for unsupported flags
        if self.options.sticky_flag && regex.flags.contains('y') {
            return true;
        }
        if self.options.unicode_flag && regex.flags.contains('u') {
            return true;
        }
        if self.options.dot_all_flag && regex.flags.contains('s') {
            return true;
        }
        if self.options.match_indices && regex.flags.contains('d') {
            return true;
        }
        if self.options.set_notation && regex.flags.contains('v') {
            return true;
        }
        false
    }

    /// Check if a regex pattern needs transformation based on its content.
    fn needs_pattern_transformation(&self, pattern: &str) -> bool {
        // Check for lookbehind assertions: (?<= or (?<!
        if self.options.look_behind_assertions
            && (pattern.contains("(?<=") || pattern.contains("(?<!"))
        {
            return true;
        }

        // Check for named capture groups: (?<name>
        if self.options.named_capture_groups && pattern.contains("(?<") {
            return true;
        }

        // Check for unicode property escapes: \p{ or \P{
        if self.options.unicode_property_escapes
            && (pattern.contains("\\p{") || pattern.contains("\\P{"))
        {
            return true;
        }

        false
    }

    /// Transform a regex literal to a `new RegExp()` constructor call.
    fn transform_regex(&self, regex: &Regex) -> Expr {
        let pattern = Box::new(Expr::Lit(Lit::Str(Str {
            span: regex.span,
            value: regex.exp.clone().into(),
            raw: None,
        })));

        let flags = Box::new(Expr::Lit(Lit::Str(Str {
            span: regex.span,
            value: regex.flags.clone().into(),
            raw: None,
        })));

        Expr::New(NewExpr {
            span: regex.span,
            ctxt: Default::default(),
            callee: Box::new(Expr::Ident(Ident::new(
                "RegExp".into(),
                regex.span,
                Default::default(),
            ))),
            args: Some(vec![
                ExprOrSpread {
                    spread: None,
                    expr: pattern,
                },
                ExprOrSpread {
                    spread: None,
                    expr: flags,
                },
            ]),
            type_args: None,
        })
    }
}

impl VisitMutHook<TransformCtx> for RegExp {
    fn enter_expr(&mut self, expr: &mut Expr, _ctx: &mut TransformCtx) {
        // Only process regex literals
        if let Expr::Lit(Lit::Regex(regex)) = expr {
            // Check if transformation is needed
            let needs_transform = self.needs_flag_transformation(regex)
                || self.needs_pattern_transformation(&regex.exp);

            if needs_transform {
                // Replace the regex literal with a new RegExp() call
                *expr = self.transform_regex(regex);
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_sticky_flag_transformation() {
        let options = RegExpOptions {
            sticky_flag: true,
            ..Default::default()
        };
        let transformer = RegExp::new(options);

        let regex = Regex {
            span: Default::default(),
            exp: "test".into(),
            flags: "y".into(),
        };

        assert!(transformer.needs_flag_transformation(&regex));
    }

    #[test]
    fn test_dotall_flag_transformation() {
        let options = RegExpOptions {
            dot_all_flag: true,
            ..Default::default()
        };
        let transformer = RegExp::new(options);

        let regex = Regex {
            span: Default::default(),
            exp: ".+".into(),
            flags: "s".into(),
        };

        assert!(transformer.needs_flag_transformation(&regex));
    }

    #[test]
    fn test_lookbehind_pattern_transformation() {
        let options = RegExpOptions {
            look_behind_assertions: true,
            ..Default::default()
        };
        let transformer = RegExp::new(options);

        assert!(transformer.needs_pattern_transformation("(?<=x)"));
        assert!(transformer.needs_pattern_transformation("(?<!x)"));
        assert!(!transformer.needs_pattern_transformation("(?:x)"));
    }

    #[test]
    fn test_named_capture_groups_transformation() {
        let options = RegExpOptions {
            named_capture_groups: true,
            ..Default::default()
        };
        let transformer = RegExp::new(options);

        assert!(transformer.needs_pattern_transformation("(?<name>x)"));
        assert!(!transformer.needs_pattern_transformation("(?:x)"));
    }

    #[test]
    fn test_unicode_property_escapes_transformation() {
        let options = RegExpOptions {
            unicode_property_escapes: true,
            ..Default::default()
        };
        let transformer = RegExp::new(options);

        assert!(transformer.needs_pattern_transformation("\\p{Letter}"));
        assert!(transformer.needs_pattern_transformation("\\P{Number}"));
        assert!(!transformer.needs_pattern_transformation("\\w"));
    }

    #[test]
    fn test_no_transformation_needed() {
        let options = RegExpOptions::default();
        let transformer = RegExp::new(options);

        let regex = Regex {
            span: Default::default(),
            exp: "test".into(),
            flags: "g".into(),
        };

        assert!(!transformer.needs_flag_transformation(&regex));
        assert!(!transformer.needs_pattern_transformation(&regex.exp));
    }
}
