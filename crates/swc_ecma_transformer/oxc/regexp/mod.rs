//! RegExp Transformer
//!
//! This module supports various RegExp plugins to handle unsupported RegExp literal features.
//! When an unsupported feature is detected, these plugins convert the RegExp literal into
//! a `new RegExp()` constructor call to avoid syntax errors.
//!
//! Note: You will need to include a polyfill for the `RegExp` constructor in your code to have the correct runtime behavior.
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
//! TODO(improve-on-babel): We could convert to plain `RegExp(...)` instead of `new RegExp(...)`.
//! TODO(improve-on-babel): When flags is empty, we could output `RegExp("(?<=x)")` instead of `RegExp("(?<=x)", "")`.
//! (actually these would be improvements on ESBuild, not Babel)

use oxc_ast::{NONE, ast::*};
use oxc_regular_expression::{
    RegexUnsupportedPatterns, has_unsupported_regular_expression_pattern,
};
use oxc_semantic::ReferenceFlags;
use oxc_span::{Atom, SPAN};
use oxc_traverse::Traverse;

use crate::{
    context::{TransformCtx, TraverseCtx},
    state::TransformState,
};

mod options;

pub use options::RegExpOptions;

pub struct RegExp<'a, 'ctx> {
    ctx: &'ctx TransformCtx<'a>,
    unsupported_flags: RegExpFlags,
    some_unsupported_patterns: bool,
    unsupported_patterns: RegexUnsupportedPatterns,
}

impl<'a, 'ctx> RegExp<'a, 'ctx> {
    pub fn new(options: RegExpOptions, ctx: &'ctx TransformCtx<'a>) -> Self {
        // Get unsupported flags
        let mut unsupported_flags = RegExpFlags::empty();
        if options.dot_all_flag {
            unsupported_flags |= RegExpFlags::S;
        }
        if options.sticky_flag {
            unsupported_flags |= RegExpFlags::Y;
        }
        if options.unicode_flag {
            unsupported_flags |= RegExpFlags::U;
        }
        if options.match_indices {
            unsupported_flags |= RegExpFlags::D;
        }
        if options.set_notation {
            unsupported_flags |= RegExpFlags::V;
        }

        // Get if some unsupported patterns
        let RegExpOptions {
            look_behind_assertions,
            named_capture_groups,
            unicode_property_escapes,
            ..
        } = options;

        let some_unsupported_patterns =
            look_behind_assertions || named_capture_groups || unicode_property_escapes;

        Self {
            ctx,
            unsupported_flags,
            some_unsupported_patterns,
            unsupported_patterns: RegexUnsupportedPatterns {
                look_behind_assertions,
                named_capture_groups,
                unicode_property_escapes,
                pattern_modifiers: false,
            },
        }
    }
}

impl<'a> Traverse<'a, TransformState<'a>> for RegExp<'a, '_> {
    // `#[inline]` to avoid cost of function call for all `Expression`s which aren't `RegExpLiteral`s
    #[inline]
    fn enter_expression(&mut self, expr: &mut Expression<'a>, ctx: &mut TraverseCtx<'a>) {
        if matches!(expr, Expression::RegExpLiteral(_)) {
            self.transform_regexp(expr, ctx);
        }
    }
}

impl<'a> RegExp<'a, '_> {
    /// If `RegExpLiteral` contains unsupported syntax or flags, transform to `new RegExp(...)`.
    fn transform_regexp(&self, expr: &mut Expression<'a>, ctx: &mut TraverseCtx<'a>) {
        let Expression::RegExpLiteral(regexp) = expr else {
            unreachable!();
        };
        let regexp = regexp.as_mut();

        let pattern_text = regexp.regex.pattern.text;
        let flags = regexp.regex.flags;
        let has_unsupported_flags = flags.intersects(self.unsupported_flags);
        if !has_unsupported_flags {
            if !self.some_unsupported_patterns {
                // This RegExp has no unsupported flags, and there are no patterns which may need transforming,
                // so there's nothing to do
                return;
            }

            let owned_pattern;
            let pattern = if let Some(pattern) = &regexp.regex.pattern.pattern {
                pattern
            } else {
                match regexp.parse_pattern(ctx.ast.allocator) {
                    Ok(pattern) => {
                        owned_pattern = Some(pattern);
                        owned_pattern.as_ref().unwrap()
                    }
                    Err(error) => {
                        self.ctx.error(error);
                        return;
                    }
                }
            };

            if !has_unsupported_regular_expression_pattern(pattern, &self.unsupported_patterns) {
                return;
            }
        }

        let callee = {
            let symbol_id = ctx.scoping().find_binding(ctx.current_scope_id(), "RegExp");
            ctx.create_ident_expr(SPAN, Atom::from("RegExp"), symbol_id, ReferenceFlags::read())
        };

        let arguments = ctx.ast.vec_from_array([
            Argument::from(ctx.ast.expression_string_literal(SPAN, pattern_text, None)),
            Argument::from(ctx.ast.expression_string_literal(
                SPAN,
                ctx.ast.atom(flags.to_inline_string().as_str()),
                None,
            )),
        ]);

        *expr = ctx.ast.expression_new(regexp.span, callee, NONE, arguments);
    }
}
