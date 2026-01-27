//! ES3 compatibility transforms.
//!
//! This module provides transforms for making JavaScript code compatible with
//! ES3 environments.

use swc_ecma_hooks::VisitMutHook;

use crate::{
    hook_utils::{HookBuilder, NoopHook},
    TraverseCtx,
};

mod member_expr_lits;
mod prop_lits;
mod reserved_word;

pub use reserved_word::ReservedWordContext;

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct Es3Options {
    /// Enable property literals transformation
    ///
    /// Transforms property names from strings to identifiers where possible:
    /// `{ "bar": 1 }` -> `{ bar: 1 }`
    pub property_literals: bool,

    /// Enable member expression literals transformation
    ///
    /// Transforms member expressions with reserved/invalid identifiers:
    /// `obj.const` -> `obj["const"]`
    pub member_expression_literals: bool,

    /// Enable reserved words transformation
    ///
    /// Renames ES3 reserved words used as identifiers:
    /// `var abstract = 1` -> `var _abstract = 1`
    pub reserved_words: bool,

    /// Preserve `import` identifier without renaming.
    ///
    /// Only used when `reserved_words` is true.
    pub preserve_import: bool,
}

impl Es3Options {
    /// Returns true if any transform is enabled.
    pub fn is_enabled(&self) -> bool {
        self.property_literals || self.member_expression_literals || self.reserved_words
    }
}

pub fn hook(options: Es3Options) -> impl VisitMutHook<TraverseCtx> {
    let hook = HookBuilder::new(NoopHook);

    // Member expression literals: obj.const -> obj["const"]
    let hook = hook.chain(if options.member_expression_literals {
        Some(self::member_expr_lits::hook())
    } else {
        None
    });

    // Property literals: { "bar": 1 } -> { bar: 1 }
    let hook = hook.chain(if options.property_literals {
        Some(self::prop_lits::hook())
    } else {
        None
    });

    // Reserved words: var abstract = 1 -> var _abstract = 1
    let hook = hook.chain(if options.reserved_words {
        Some(self::reserved_word::hook(options.preserve_import))
    } else {
        None
    });

    hook.build()
}
